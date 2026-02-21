import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getAuthContext } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const auth = await getAuthContext(request);

    // If getAuthContext returned a NextResponse, it's an error
    if (auth instanceof NextResponse) return auth;

    await connectToDatabase();

    const user = await User.findById(auth.userId)
      .select("name email createdAt dailyCredits")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        dailyCredits: user.dailyCredits,
      },
      sessionId: auth.sessionId,
    });
  } catch (error: any) {
    console.error("Session Validate Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
