import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide email and password" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Create a new session document
    const session = await Session.create({ userId: user._id });

    // Sign JWT with userId + sessionId
    const token = signToken({
      userId: user._id.toString(),
      sessionId: session._id.toString(),
      email: user.email,
    });

    // Set secure HTTP-only cookie (15 days)
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 15, // 15 days
      path: "/",
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
