import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectToDatabase from "@/lib/db";
import Comment from "@/models/Comment";
import Chat from "@/models/Chat";
import { getAuthContext } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/community/comment/[id]
 * Owner-only. Decrements commentsCount on the parent chat.
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid comment ID" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Find and delete — ownership check via userId filter
    const deleted = await Comment.findOneAndDelete({
      _id: id,
      userId: auth.userId, // ownership enforced at DB level
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Comment not found or not authorized" },
        { status: 404 },
      );
    }

    // Decrement commentsCount, floor at 0
    await Chat.findOneAndUpdate(
      { _id: deleted.chatId, commentsCount: { $gt: 0 } },
      { $inc: { commentsCount: -1 } },
    );

    return NextResponse.json({ message: "Comment deleted" });
  } catch (error: any) {
    console.error("Comment DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
