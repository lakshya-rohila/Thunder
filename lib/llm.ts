import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt, visionSystemPrompt } from "./promptTemplate";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

/**
 * Robustly parse JSON from Gemini responses.
 * Handles three cases:
 * 1. Clean JSON string
 * 2. JSON wrapped in markdown code fences (```json ... ```)
 * 3. JSON object embedded somewhere in a larger text response
 */
function safeParseJSON(text: string): any {
  // Case 1: clean JSON
  try {
    return JSON.parse(text);
  } catch {}

  // Case 2: strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {}
  }

  // Case 3: extract first {...} block from the text
  const braceStart = text.indexOf("{");
  const braceEnd = text.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd > braceStart) {
    try {
      return JSON.parse(text.slice(braceStart, braceEnd + 1));
    } catch {}
  }

  // All attempts failed
  throw new Error("Could not parse JSON from AI response");
}

export async function generateComponent(
  userPrompt: string,
  previousCode?: any,
) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  let prompt = `${systemPrompt}\n\nUser Request: ${userPrompt}`;

  if (previousCode) {
    prompt += `\n\nPREVIOUS COMPONENT CODE:\n${JSON.stringify(previousCode, null, 2)}\n\nINSTRUCTION: Update the above component based on the User Request.`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return safeParseJSON(text);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini:", text);
      throw new Error("Invalid JSON response from AI");
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
