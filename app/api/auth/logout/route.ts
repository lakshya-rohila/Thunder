import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import Session from "@/models/Session";
import { verifyToken } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const payload = verifyToken(token);
      if (payload?.sessionId) {
        // Invalidate session in DB
        await connectToDatabase();
        await Session.findByIdAndUpdate(payload.sessionId, { isActive: false });
      }
    }

    // Clear cookie regardless
    cookieStore.delete("token");

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
