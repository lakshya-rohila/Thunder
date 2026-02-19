import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Session from "@/models/Session";
import { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET;
const FIFTEEN_DAYS_SECONDS = 60 * 60 * 24 * 15;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export interface JWTPayload {
  userId: string;
  sessionId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/** Sign a JWT with userId + sessionId. Expires in 15 days. */
export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: FIFTEEN_DAYS_SECONDS });
}

/** Verify a JWT and return the typed payload, or null if invalid. */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Shared route-handler auth context.
 *
 * 1. Reads the JWT from the cookie.
 * 2. Verifies the JWT signature and expiry.
 * 3. Looks up the Session in MongoDB (exists, isActive, not expired).
 *
 * Returns `{ userId, sessionId }` on success.
 * Returns a NextResponse (401/403) on failure — callers should return it immediately.
 */
export async function getAuthContext(
  request: Request,
): Promise<
  { userId: Types.ObjectId; sessionId: Types.ObjectId } | NextResponse
> {
  // 1. Read token from Authorization header or cookie
  let token: string | undefined;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    // Fall back to cookie (server-side)
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  }

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Verify JWT
  const payload = verifyToken(token);
  if (!payload || !payload.userId || !payload.sessionId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // 3. Validate ObjectIds
  if (
    !Types.ObjectId.isValid(payload.userId) ||
    !Types.ObjectId.isValid(payload.sessionId)
  ) {
    return NextResponse.json(
      { error: "Invalid token payload" },
      { status: 401 },
    );
  }

  // 4. Check session in DB
  await connectToDatabase();

  const session = await Session.findById(payload.sessionId).lean();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 401 });
  }

  if (!session.isActive) {
    return NextResponse.json({ error: "Session revoked" }, { status: 401 });
  }

  if (session.expiresAt < new Date()) {
    // Invalidate in DB (TTL will clean up, but mark immediately)
    await Session.findByIdAndUpdate(payload.sessionId, { isActive: false });
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  // 5. Confirm session belongs to the claimed user
  if (session.userId.toString() !== payload.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return {
    userId: new Types.ObjectId(payload.userId),
    sessionId: new Types.ObjectId(payload.sessionId),
  };
}

/** Convenience: get session from cookie (for server components). */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
