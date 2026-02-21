const hfToken = process.env.HUGGING_FACE_TOKEN;

// Use the newer DeepSeek V3 model which is available via the Router API
const DEFAULT_MODEL = "deepseek-ai/DeepSeek-V3";

/**
 * Generate text completion using Hugging Face Inference API (OpenAI Compatible)
 */
export async function generateWithHF(
  prompt: string,
  model = DEFAULT_MODEL,
): Promise<string> {
  if (!hfToken) {
    throw new Error("HUGGING_FACE_TOKEN is not set in environment variables");
  }

  try {
    // Use the chat completions endpoint which is more robust for newer models
    const response = await fetch(
      `https://router.huggingface.co/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "user", content: prompt }
          ],
          max_tokens: 2048,
          temperature: 0.2, // Low temp for factual research
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Hugging Face API Error: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw new Error("Failed to generate content with Hugging Face");
  }
}

/**
 * Synthesize research using DeepSeek via HF
 */
export async function synthesizeResearchWithDeepSeek(
  topic: string,
  rawData: string,
): Promise<any> {
  const systemPrompt = `
You are an expert Research Assistant.
Your task is to analyze the following raw research data about "${topic}" and produce a structured Deep Research Report.

RAW DATA:
${rawData}

INSTRUCTIONS:
1. Extract key facts, timeline events, and core concepts.
2. Identify the most important insights.
3. Write a detailed explanation that synthesizes the information.
4. Return ONLY valid JSON in this format (no markdown fences, just raw JSON):
{
  "topic": "${topic}",
  "summary": "2-3 sentence executive summary",
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "detailedExplanation": "A comprehensive markdown-formatted explanation...",
  "timeline": [
    {"year": "YYYY", "event": "Description"}
  ],
  "relatedConcepts": ["Concept A", "Concept B"]
}
`;

  try {
    const jsonText = await generateWithHF(systemPrompt);
    
    // Parse the JSON (handle potential markdown wrapping)
    const cleanJson = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("DeepSeek Synthesis Error:", error);
    // Fallback or re-throw
    throw error;
  }
}
