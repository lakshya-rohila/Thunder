import { NextResponse } from "next/server";
import { generateComponent } from "@/lib/llm";
import { validateComponent } from "@/lib/validator";
import { sanitizeComponent } from "@/lib/sanitizer";

export async function POST(request: Request) {
  try {
    const { prompt, context, mode, projectType } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // 1. Generate (with optional context for refinement)
    const rawComponent = await generateComponent(
      prompt,
      context,
      mode,
      projectType,
    );

    // 2. Validate (Skip if it is a clarification question)
    if (rawComponent.clarification || rawComponent.type === "clarification") {
      return NextResponse.json(rawComponent);
    }

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
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
