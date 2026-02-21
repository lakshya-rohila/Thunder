import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt, visionSystemPrompt } from "./promptTemplate";
import { reverseEngineeringSystemPrompt } from "./reverseEngineeringPrompt";
import { LearningEngine } from "./learningEngine";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    // We use JSON mode for standard generation, but text mode for reverse engineering
    // because it returns a mix of markdown and code blocks.
    // However, the standard mode relies on JSON schema or prompt instruction.
    // Let's keep it flexible or switch config based on mode if needed.
    // For now, we will handle parsing manually for text responses.
  },
});

/**
 * Robustly parse JSON from Gemini responses.
 */
function safeParseJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {}

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {}
  }

  const braceStart = text.indexOf("{");
  const braceEnd = text.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd > braceStart) {
    try {
      return JSON.parse(text.slice(braceStart, braceEnd + 1));
    } catch {}
  }

  throw new Error("Could not parse JSON from AI response");
}

/**
 * Parse the structured output from Reverse Engineering Mode.
 * Extracts sections like "Structural Analysis" and code blocks for HTML/CSS/JS.
 */
function parseReverseEngineeringResponse(text: string) {
  const result: any = {
    name: "Refactored Component",
    html: "",
    css: "",
    js: "",
    analysis: "",
  };

  // 1. Extract Code Blocks using regex
  // We look for ===HTML=== [Code] ===CSS=== ...
  // or standard markdown code blocks if the AI deviates slightly.
  // The system prompt explicitly asks for:
  // ===HTML===
  // [Code]
  // ===CSS===
  // ...

  const htmlMatch = text.match(/===HTML===\s*([\s\S]*?)(?=(===CSS===|$))/i);
  const cssMatch = text.match(/===CSS===\s*([\s\S]*?)(?=(===JS===|$))/i);
  const jsMatch = text.match(/===JS===\s*([\s\S]*?)(?=(===|$))/i);

  if (htmlMatch) result.html = htmlMatch[1].trim();
  if (cssMatch) result.css = cssMatch[1].trim();
  if (jsMatch) result.js = jsMatch[1].trim();

  // Fallback: Try standard markdown blocks if custom separators miss
  if (!result.html) {
    const htmlBlock = text.match(/```html\s*([\s\S]*?)```/i);
    if (htmlBlock) result.html = htmlBlock[1].trim();
  }
  if (!result.css) {
    const cssBlock = text.match(/```css\s*([\s\S]*?)```/i);
    if (cssBlock) result.css = cssBlock[1].trim();
  }
  if (!result.js) {
    const jsBlock = text.match(/```(?:javascript|js)\s*([\s\S]*?)```/i);
    if (jsBlock) result.js = jsBlock[1].trim();
  }

  // 2. Extract Analysis (everything before the code sections)
  // We want to capture the "Structural Analysis", "UI Pattern", etc.
  // We split by the first code section header.
  const splitIndex = text.search(
    /===HTML===|===CSS===|===JS===|⚡ Refactored/i,
  );
  if (splitIndex !== -1) {
    result.analysis = text.slice(0, splitIndex).trim();
  } else {
    // If no code found, everything is analysis
    result.analysis = text;
  }

  return result;
}

export async function generateComponent(
  userPrompt: string,
  previousCode?: any,
  mode: "standard" | "reverse" = "standard",
  projectType: "component" | "app" | "game" | "auto" = "auto",
  styleMode: "vanilla" | "tailwind" = "vanilla",
  userId?: string, // Add userId to support personalization
) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  let prompt = "";

  if (mode === "reverse") {
    prompt = `${reverseEngineeringSystemPrompt}\n\nINPUT:\n${userPrompt}`;
  } else {
    // 1. Inject top learned patterns
    const learnings = await LearningEngine.getTopLearnings();
    const learningBlock =
      learnings.length > 0
        ? `\n\n### SYSTEM LEARNINGS (Apply these improvements):\n${learnings.map((l) => `- ${l}`).join("\n")}`
        : "";

    // 2. Inject User Personalization (if userId provided)
    let personalizationBlock = "";
    if (userId) {
      personalizationBlock = await LearningEngine.getUserPreferences(userId);
    }

    // 3. Inject RAG Examples (Best Practices)
    const ragBlock = await LearningEngine.getRelevantExamples(userPrompt);

    // Combine all blocks
    prompt = `${systemPrompt}${learningBlock}${personalizationBlock}${ragBlock}\n\nUser Request: ${userPrompt}`;

    if (projectType && projectType !== "auto") {
      prompt += `\n\nIMPORTANT: The user has explicitly selected to build a [${projectType.toUpperCase()}]. Enforce ${projectType} mode rules.`;
    }

    if (styleMode) {
      prompt += `\n\nIMPORTANT: The user has explicitly selected [${styleMode.toUpperCase()}] styling. Enforce ${styleMode} mode rules.`;
    }

    if (previousCode) {
      prompt += `\n\nPREVIOUS COMPONENT CODE:\n${JSON.stringify(previousCode, null, 2)}\n\nINSTRUCTION: Update the above component based on the User Request.`;
    }
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (mode === "reverse") {
      try {
        return parseReverseEngineeringResponse(text);
      } catch (e) {
        console.error("Failed to parse Reverse Engineering response:", text);
        return {
          name: "Analysis Error",
          html: "<!-- Parsing failed, see analysis -->",
          css: "",
          js: "",
          analysis: text,
        };
      }
    } else {
      try {
        const parsed = safeParseJSON(text);

        // --- AUTOMATED CRITIC PASS ---
        // If this is a new generation (not clarification), run a quick critique
        if (!parsed.clarification && !parsed.type?.includes("clarification")) {
          // In a real production system, we would do a second LLM call here.
          // For now, we'll simulate a "Quality Check" by ensuring required fields exist.
          // This placeholder is where the "Critic Agent" logic lives.
          if (!parsed.html || !parsed.css) {
            console.warn("Critic: Missing core fields, triggering fallback fix...");
            // Could trigger re-generation or patching here
          }
        }

        return parsed;
      } catch (e) {
        console.log("JSON parse failed, returning as clarification text");
        return {
          detail: "Clarification Needed",
          html: "",
          css: "",
          js: "",
          clarification: text,
        };
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

export async function synthesizeResearch(
  topic: string,
  rawData: string,
): Promise<any> {
  const prompt = `
    You are an expert Research Assistant.
    Your task is to analyze the following raw research data about "${topic}" and produce a structured Deep Research Report.

    RAW DATA:
    ${rawData}

    INSTRUCTIONS:
    1. Extract key facts, timeline events, and core concepts.
    2. Identify the most important insights.
    3. Write a detailed explanation that synthesizes the information.
    4. Return ONLY valid JSON in this format:
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return safeParseJSON(response.text());
  } catch (error) {
    console.error("Research Synthesis Error:", error);
    throw new Error("Failed to synthesize research.");
  }
}
export async function analyzeImageComponent(
  imageBase64: string,
  mimeType: string,
) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };

  const textPart = {
    text: visionSystemPrompt,
  };

  try {
    const result = await model.generateContent([imagePart, textPart]);
    const response = await result.response;
    const text = response.text();

    try {
      return safeParseJSON(text);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini Vision:", text);
      throw new Error("Invalid JSON response from AI Vision");
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}
