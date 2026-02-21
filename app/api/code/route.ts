// app/api/code/route.ts
import { NextResponse } from "next/server";
import { generateCode, CodeAssistantRequest } from "@/lib/code-assistant";
import { getAuthContext } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";

export async function POST(request: Request) {
  try {
    // Authenticate first
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Check credits (3 for code modification)
    const hasCredits = await deductCredits(auth.userId.toString(), 3);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient daily credits. Please upgrade or wait for tomorrow." },
        { status: 402 }
      );
    }

    const body: CodeAssistantRequest = await request.json();

    if (!body.prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const code = await generateCode(body);

    return NextResponse.json({ code });
  } catch (error: any) {
    console.error("Code Generation API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate code" },
      { status: 500 },
    );
  }
}
