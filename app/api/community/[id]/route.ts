import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectToDatabase from "@/lib/db";
import Chat from "@/models/Chat";
import Like from "@/models/Like";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { getAuthContext } from "@/lib/auth";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/community/[id]
 * Public — returns chat detail + author + like status for current user + comments.
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await connectToDatabase();

    const chat = await Chat.findOne({ _id: id, isPublic: true })
      .select("-__v")
      .lean();

    if (!chat) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 },
      );
    }

    // Get author info
    const author = await User.findById(chat.userId)
      .select("name username createdAt")
      .lean();

    // Check if current user has liked (optional auth)
    let hasLiked = false;
    let currentUserId: string | null = null;

    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        const payload = verifyToken(token);
        if (payload?.userId) {
          currentUserId = payload.userId;
          const like = await Like.findOne({
            userId: new Types.ObjectId(payload.userId),
            chatId: new Types.ObjectId(id),
          }).lean();
          hasLiked = !!like;
        }
      }
    } catch {
      // Not authenticated — that's fine
    }

    // Get recent comments with author names
    const comments = await Comment.aggregate([
      { $match: { chatId: new Types.ObjectId(id) } },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
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
          isOwner: {
            $eq: [
              "$userId",
              currentUserId ? new Types.ObjectId(currentUserId) : null,
            ],
          },
        },
      },
    ]);

    return NextResponse.json({
      chat,
      author,
      hasLiked,
      comments,
    });
  } catch (error: any) {
    console.error("Community Detail Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
