import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectToDatabase from "@/lib/db";
import Like from "@/models/Like";
import Chat from "@/models/Chat";
import { getAuthContext } from "@/lib/auth";

/**
 * POST /api/community/like
 * Toggle like on a public chat. Auth required.
 * Body: { chatId }
 */
export async function POST(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { chatId } = await request.json();

    if (!chatId || !Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
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

    // Try to insert a like — unique index prevents duplicates
    try {
      await Like.create({ userId: auth.userId, chatId: chatObjId });

      // Atomically increment likesCount
      await Chat.findByIdAndUpdate(chatObjId, { $inc: { likesCount: 1 } });

      return NextResponse.json({ liked: true, message: "Liked" });
    } catch (err: any) {
      // Duplicate key error (code 11000) = already liked → unlike
      if (err.code === 11000) {
        await Like.deleteOne({ userId: auth.userId, chatId: chatObjId });
        await Chat.findByIdAndUpdate(chatObjId, {
          $inc: { likesCount: -1 },
        });

        // Ensure likesCount never goes below 0
        await Chat.findOneAndUpdate(
          { _id: chatObjId, likesCount: { $lt: 0 } },
          { $set: { likesCount: 0 } },
        );

        return NextResponse.json({ liked: false, message: "Unliked" });
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Like Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
