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
) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  let prompt = "";

  if (mode === "reverse") {
    prompt = `${reverseEngineeringSystemPrompt}\n\nINPUT:\n${userPrompt}`;
  } else {
    // Inject top learned patterns
    const learnings = await LearningEngine.getTopLearnings();
    const learningBlock =
      learnings.length > 0
        ? `\n\n### SYSTEM LEARNINGS (Apply these improvements):\n${learnings.map((l) => `- ${l}`).join("\n")}`
        : "";

    prompt = `${systemPrompt}${learningBlock}\n\nUser Request: ${userPrompt}`;

    if (projectType && projectType !== "auto") {
      prompt += `\n\nIMPORTANT: The user has explicitly selected to build a [${projectType.toUpperCase()}]. Enforce ${projectType} mode rules.`;
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
        // Return mostly empty component but with the text as analysis so user sees something
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
        return safeParseJSON(text);
      } catch (e) {
        // If JSON parsing fails, assume it's a clarification question (plain text)
        // We return a special object that the frontend will recognize
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
