import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getAuthContext } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { name, username } = await request.json();

    if (!name || name.length > 60) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    // Validate username format if provided
    if (username) {
      if (!/^[a-z0-9_-]+$/.test(username) || username.length > 30) {
        return NextResponse.json(
          { error: "Invalid username format" },
          { status: 400 },
        );
      }
    }

    await connectToDatabase();

    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: auth.userId },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 },
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      auth.userId,
      {
        name,
        ...(username ? { username: username.toLowerCase() } : {}),
      },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
