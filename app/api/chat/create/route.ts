import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { getAuthContext } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { prompt, title, generatedHTML, generatedCSS, generatedJS } =
      await request.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedPrompt = prompt.trim().slice(0, 10000);
    const sanitizedTitle = (title?.trim() ||
      sanitizedPrompt.slice(0, 80)) as string;

    await connectToDatabase();

    // Create chat document
    const chat = await Chat.create({
      userId: auth.userId,
      title: sanitizedTitle,
      prompt: sanitizedPrompt,
      generatedHTML: generatedHTML || "",
      generatedCSS: generatedCSS || "",
      generatedJS: generatedJS || "",
    });

    // Save the initial user message
    await Message.create({
      chatId: chat._id,
      role: "user",
      content: sanitizedPrompt,
    });

    // If there's a generated response, save it too
    if (generatedHTML || generatedCSS || generatedJS) {
      await Message.create({
        chatId: chat._id,
        role: "assistant",
        content: "Component generated successfully.",
      });
    }

    return NextResponse.json(
      {
        message: "Chat created",
        chat: {
          id: chat._id,
          title: chat.title,
          prompt: chat.prompt,
          createdAt: chat.createdAt,
          expiresAt: chat.expiresAt,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Chat Create Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
