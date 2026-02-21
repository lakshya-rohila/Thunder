import mongoose from "mongoose";
import Generation from "@/models/Generation";
import Feedback from "@/models/Feedback";
import LearningInsight from "@/models/LearningInsight";
import UserPreference from "@/models/UserPreference";
import BestExample from "@/models/BestExample";

export class LearningEngine {
  static async analyzeFailedGenerations() {
    // Find generations with low success scores or negative feedback
    const badGenerations = await Generation.find({
      successScore: { $lt: 50 },
    }).limit(100);

    for (const gen of badGenerations) {
      // Analyze patterns (mock logic for now, could be LLM powered)
      const pattern = this.detectPattern(gen);
      if (pattern) {
        await this.recordInsight(pattern);
      }
    }
  }

  static detectPattern(generation: any): string | null {
    // Simple regex heuristics
    if (generation.html.includes("<div onclick=")) {
      return "inline-event-handlers";
    }
    if (!generation.css.includes("@media")) {
      return "missing-responsive-styles";
    }
    return null;
  }

  static async recordInsight(pattern: string) {
    let insight = await LearningInsight.findOne({ pattern });

    if (insight) {
      insight.frequency += 1;
      insight.lastDetected = new Date();
    } else {
      insight = new LearningInsight({
        pattern,
        improvementInstruction: this.getInstructionForPattern(pattern),
        category: "ui",
      });
    }

    await insight.save();
  }

  static getInstructionForPattern(pattern: string): string {
    const map: Record<string, string> = {
      "inline-event-handlers":
        "Do not use inline event handlers. Use addEventListener.",
      "missing-responsive-styles":
        "Ensure CSS includes media queries for mobile responsiveness.",
    };
    return map[pattern] || "Fix detected issue.";
  }

  static async getTopLearnings(): Promise<string[]> {
    const insights = await LearningInsight.find()
      .sort({ frequency: -1 })
      .limit(5);

    return insights.map((i) => i.improvementInstruction);
  }

  static async getUserPreferences(userId: string): Promise<string> {
    const prefs = await UserPreference.findOne({ userId });
    if (!prefs) return "";

    let instruction = "\n### USER PERSONALIZATION:\n";
    if (prefs.prefersDarkMode) instruction += "- Use dark mode styles.\n";
    if (prefs.cssFramework !== "auto")
      instruction += `- Use ${prefs.cssFramework} for styling.\n`;
    if (prefs.codingStyle !== "auto")
      instruction += `- Use ${prefs.codingStyle} coding style.\n`;
    if (prefs.tone !== "auto")
      instruction += `- Tone: ${prefs.tone}.\n`;

    return instruction;
  }

  static async getRelevantExamples(prompt: string): Promise<string> {
    // Basic text search using regex (in prod use Vector DB)
    const keywords = prompt.split(" ").filter((w) => w.length > 3);
    const regex = new RegExp(keywords.join("|"), "i");

    const examples = await BestExample.find({ prompt: { $regex: regex } })
      .sort({ qualityScore: -1 })
      .limit(2);

    if (examples.length === 0) return "";

    let output = "\n### REFERENCE EXAMPLES (High Quality):\n";
    examples.forEach((ex, i) => {
      output += `\nExample ${i + 1}:\nHTML:\n${ex.html}\nCSS:\n${ex.css}\nJS:\n${ex.js}\n`;
    });

    return output;
  }
}
