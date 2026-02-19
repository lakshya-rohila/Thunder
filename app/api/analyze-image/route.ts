import { NextResponse } from "next/server";
import { analyzeImageComponent } from "@/lib/llm";
import { validateComponent } from "@/lib/validator";
import { sanitizeComponent } from "@/lib/sanitizer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported image type. Please upload a JPEG, PNG, WebP, or GIF.",
        },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 10MB." },
        { status: 400 },
      );
    }

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // 1. Analyze with Gemini Vision
    const rawComponent = await analyzeImageComponent(base64, file.type);

    // 2. Validate
    const validation = validateComponent(rawComponent);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: `Validation Error: ${validation.error}` },
        { status: 422 },
      );
    }

    // 3. Sanitize
    const sanitizedComponent = sanitizeComponent(rawComponent);

    return NextResponse.json(sanitizedComponent);
  } catch (error: any) {
    console.error("Image Analysis API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
