import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Generation from "@/models/Generation";
import Feedback from "@/models/Feedback";

export async function POST(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    const { generationId, eventType, rating, useful, userEdited } =
      await request.json();

    if (!generationId) {
      return NextResponse.json(
        { error: "Generation ID required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Find or create feedback entry
    let feedback = await Feedback.findOne({
      generationId,
      userId: auth.userId,
    });

    if (!feedback) {
      feedback = new Feedback({
        generationId,
        userId: auth.userId,
      });
    }

    // Update fields based on event
    if (eventType === "copy") feedback.copiedCode = true;
    if (eventType === "edit") feedback.userEdited = true;
    if (eventType === "rate") {
      feedback.rating = rating;
      feedback.useful = useful;
    }

    await feedback.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
