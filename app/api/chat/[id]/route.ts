import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectToDatabase from "@/lib/db";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { getAuthContext } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** GET /api/chat/[id] — fetch a single chat with its messages */
export async function GET(request: Request, context: RouteContext) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    await connectToDatabase();

    const chat = await Chat.findOne({
      _id: id,
      userId: auth.userId,
    }).lean();

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = await Message.find({ chatId: id })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ chat, messages });
  } catch (error: any) {
    console.error("Chat Get Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

/** DELETE /api/chat/[id] — delete a chat (cascades to messages via model middleware) */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    await connectToDatabase();

    // findOneAndDelete triggers the pre-hook that cascades to messages
    const deleted = await Chat.findOneAndDelete({
      _id: id,
      userId: auth.userId, // ownership check
    });

    if (!deleted) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (error: any) {
    console.error("Chat Delete Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
