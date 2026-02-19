import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret",
);

/**
 * Edge-compatible middleware.
 * Verifies JWT signature/expiry (no DB access — Edge runtime has no Mongoose).
 * Full session DB validation happens inside each route handler via getAuthContext().
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Protect Dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify JWT signature and expiry on the Edge
    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      // Invalid or expired token — clear cookie and redirect
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // Redirect already-authenticated users away from auth pages
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register")
  ) {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        // Token invalid — let them through to login/register
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
