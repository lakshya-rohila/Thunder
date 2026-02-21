import { NextResponse } from "next/server";
import { generateComponent } from "@/lib/llm";
import { validateComponent } from "@/lib/validator";
import { sanitizeComponent } from "@/lib/sanitizer";
import { getAuthContext } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { prompt, context, mode, projectType, styleMode } =
      await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Try to get auth context for personalization (optional)
    let userId: string | undefined;
    const auth = await getAuthContext(request);
    if (!(auth instanceof NextResponse)) {
      userId = auth.userId.toString();
    }

    // 1. Generate (with optional context for refinement)
    const rawComponent = await generateComponent(
      prompt,
      context,
      mode,
      projectType,
      styleMode,
      userId,
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
