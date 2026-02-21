import { NextResponse } from "next/server";
import { generateImage, ImageGenerationRequest } from "@/lib/image-gen";
import { getAuthContext } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";

export async function POST(request: Request) {
  try {
    // Authenticate first
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Check credits (5 for image generation)
    const hasCredits = await deductCredits(auth.userId.toString(), 5);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient daily credits. Please upgrade or wait for tomorrow." },
        { status: 402 }
      );
    }

    const body: ImageGenerationRequest = await request.json();

    if (!body.prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const imageBlob = await generateImage(body);

    // Convert Blob to Buffer for Next.js response
    const arrayBuffer = await imageBlob.arrayBuffer();
    // Use standard Web API Response for better compatibility
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Image Generation API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 },
    );
  }
}
