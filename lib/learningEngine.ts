import mongoose from "mongoose";
import Generation from "@/models/Generation";
import Feedback from "@/models/Feedback";
import LearningInsight from "@/models/LearningInsight";

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
}
