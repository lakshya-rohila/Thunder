import { NextResponse } from "next/server";
import { generateComponent } from "@/lib/llm";
import { validateComponent } from "@/lib/validator";
import { sanitizeComponent } from "@/lib/sanitizer";
import { getAuthContext } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";

export async function POST(request: Request) {
  try {
    const { prompt, context, mode, projectType, styleMode, framework } =
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
    
    // Check credits if user is authenticated
    if (!(auth instanceof NextResponse)) {
      userId = auth.userId.toString();
      const hasCredits = await deductCredits(userId, 5); // 5 credits per generation
      
      if (!hasCredits) {
        return NextResponse.json(
          { error: "Insufficient daily credits. Please upgrade or wait for tomorrow." },
          { status: 402 } // Payment Required
        );
      }
    } else {
       // Require authentication for generation
       return NextResponse.json(
         { error: "Authentication required to generate components" },
         { status: 401 }
       );
    }

    // 1. Generate (with optional context for refinement)
    const rawComponent = await generateComponent(
      prompt,
      context,
      mode,
      projectType,
      styleMode,
      userId,
      framework,
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
