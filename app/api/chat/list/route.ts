import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Chat from "@/models/Chat";
import { getAuthContext } from "@/lib/auth";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(
        1,
        parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10),
      ),
    );
    const skip = (page - 1) * limit;

    await connectToDatabase();

    const [chats, total] = await Promise.all([
      Chat.find({ userId: auth.userId })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title prompt createdAt updatedAt expiresAt")
        .lean(),
      Chat.countDocuments({ userId: auth.userId }),
    ]);

    return NextResponse.json({
      chats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Chat List Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
