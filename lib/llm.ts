import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt } from "./promptTemplate";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

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

    // Parse JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini:", text);
      throw new Error("Invalid JSON response from AI");
    }
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}
