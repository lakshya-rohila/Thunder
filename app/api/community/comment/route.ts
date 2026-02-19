import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectToDatabase from "@/lib/db";
import Comment from "@/models/Comment";
import Chat from "@/models/Chat";
import { getAuthContext } from "@/lib/auth";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Simple text sanitizer — strip HTML tags
function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>]/g, "") // strip stray angle brackets
    .trim();
}

/**
 * GET /api/community/comment?chatId=xxx&page=1
 * Public — fetch paginated comments for a chat.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = 20;
    const skip = (page - 1) * limit;

    if (!chatId || !Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    await connectToDatabase();

    // Optional: get current user for isOwner flag
    let currentUserId: Types.ObjectId | null = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        const payload = verifyToken(token);
        if (payload?.userId && Types.ObjectId.isValid(payload.userId)) {
          currentUserId = new Types.ObjectId(payload.userId);
        }
      }
    } catch {}

    const [comments, total] = await Promise.all([
      Comment.aggregate([
        { $match: { chatId: new Types.ObjectId(chatId) } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "author",
            pipeline: [{ $project: { name: 1, username: 1 } }],
          },
        },
        { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            content: 1,
            createdAt: 1,
            "author.name": 1,
            "author.username": 1,
            isOwner: currentUserId
              ? { $eq: ["$userId", currentUserId] }
              : false,
          },
        },
      ]),
      Comment.countDocuments({ chatId: new Types.ObjectId(chatId) }),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    });
  } catch (error: any) {
    console.error("Comment GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/community/comment
 * Auth required. Body: { chatId, content }
 */
export async function POST(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { chatId, content } = await request.json();

    if (!chatId || !Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    const sanitized = sanitizeText(content || "");
    if (!sanitized || sanitized.length < 1) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 },
      );
    }
    if (sanitized.length > 500) {
      return NextResponse.json(
        { error: "Comment too long (max 500 chars)" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const chatObjId = new Types.ObjectId(chatId);

    // Verify chat is public
    const chat = await Chat.findOne({ _id: chatObjId, isPublic: true })
      .select("_id")
      .lean();
    if (!chat) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 },
      );
    }

    // Create comment + increment count atomically
    const [comment] = await Promise.all([
      Comment.create({
        userId: auth.userId,
        chatId: chatObjId,
        content: sanitized,
      }),
      Chat.findByIdAndUpdate(chatObjId, { $inc: { commentsCount: 1 } }),
    ]);

    return NextResponse.json(
      { message: "Comment posted", comment },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Comment POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
