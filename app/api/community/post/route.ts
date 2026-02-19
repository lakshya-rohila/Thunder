import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectToDatabase from "@/lib/db";
import Chat from "@/models/Chat";
import { getAuthContext } from "@/lib/auth";

/**
 * POST /api/community/post
 * Toggle isPublic on a chat. Owner only.
 * Body: { chatId, isPublic, description? }
 */
export async function POST(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { chatId, isPublic, description } = await request.json();

    if (!chatId || !Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    if (typeof isPublic !== "boolean") {
      return NextResponse.json(
        { error: "isPublic must be a boolean" },
        { status: 400 },
      );
    }

    // Require description when publishing
    if (isPublic) {
      const desc = description?.trim() ?? "";
      if (desc.length < 10) {
        return NextResponse.json(
          {
            error:
              "Description is required (min 10 characters) when posting to community",
          },
          { status: 400 },
        );
      }
    }

    await connectToDatabase();

    const chat = await Chat.findOne({ _id: chatId, userId: auth.userId });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Must have generated code to publish
    if (isPublic && !chat.generatedHTML) {
      return NextResponse.json(
        { error: "Cannot publish a chat with no generated component" },
        { status: 400 },
      );
    }

    // Toggle: public = remove TTL entirely, private = restore 15-day TTL
    // IMPORTANT: must use $unset to remove expiresAt — setting to null
    // does NOT remove the field and the TTL index may still fire.
    const updateOp = isPublic
      ? {
          $set: {
            isPublic: true,
            description: description.trim().slice(0, 500),
          },
          $unset: { expiresAt: "" }, // fully remove the TTL field
        }
      : {
          $set: {
            isPublic: false,
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          },
        };

    const updated = await Chat.findByIdAndUpdate(chatId, updateOp, {
      new: true,
    })
      .select("isPublic description expiresAt")
      .lean();

    return NextResponse.json({
      message: isPublic ? "Posted to community" : "Removed from community",
      chat: updated,
    });
  } catch (error: any) {
    console.error("Community Post Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
