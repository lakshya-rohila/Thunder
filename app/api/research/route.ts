import { NextResponse } from "next/server";
import { performDeepResearch } from "@/lib/research";
import { synthesizeResearchWithDeepSeek } from "@/lib/hf";
import { getAuthContext } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";

export async function POST(request: Request) {
  try {
    // Authenticate first
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Check credits (5 for research)
    const hasCredits = await deductCredits(auth.userId.toString(), 5);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient daily credits. Please upgrade or wait for tomorrow." },
        { status: 402 }
      );
    }

    const { topic, useDeepSeek } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // 1. Gather raw data from open sources
    const { rawData, sources } = await performDeepResearch(topic);

    // 2. Synthesize using LLM
    // Strictly use DeepSeek as requested
    let researchReport;
    let provider = "DeepSeek V3 (via Hugging Face)";
    
    // Check if token exists
    const hasHFToken = !!process.env.HUGGING_FACE_TOKEN;
    
    if (hasHFToken) {
      try {
        researchReport = await synthesizeResearchWithDeepSeek(topic, rawData);
      } catch (e) {
        console.error("DeepSeek synthesis failed:", e);
        // Fallback to Gemini only if absolutely necessary, but user requested ONLY DeepSeek.
        // However, to prevent total failure in case of API outage, we might want to throw or return error.
        // Based on user request "don't use the Google 2.5 flash", we will NOT fallback.
        return NextResponse.json(
          { error: "DeepSeek API failed and Gemini fallback is disabled." },
          { status: 500 },
        );
      }
    } else {
       return NextResponse.json(
          { error: "Hugging Face Token is missing. Cannot use DeepSeek model." },
          { status: 500 },
        );
    }

    // 3. Combine
    const finalResult = {
      ...researchReport,
      sources,
      provider,
    };

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error("Research API Error:", error);
    return NextResponse.json(
      { error: "Failed to perform research" },
      { status: 500 },
    );
  }
}
