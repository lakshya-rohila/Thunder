import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Please provide all fields" },
        { status: 400 },
      );
    }

    // Username validation
    const usernameRegex = /^[a-z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username can only contain letters, numbers, underscores, and hyphens",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Check if user exists (email or username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 },
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
