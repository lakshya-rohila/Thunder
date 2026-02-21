import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILearningInsight extends Document {
  pattern: string;
  category: "ui" | "logic" | "performance" | "accessibility" | "error";
  improvementInstruction: string;
  frequency: number;
  lastDetected: Date;
}

const LearningInsightSchema = new Schema<ILearningInsight>(
  {
    pattern: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["ui", "logic", "performance", "accessibility", "error"],
      default: "ui",
    },
    improvementInstruction: { type: String, required: true },
    frequency: { type: Number, default: 1 },
    lastDetected: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const LearningInsight: Model<ILearningInsight> =
  mongoose.models.LearningInsight ||
  mongoose.model<ILearningInsight>("LearningInsight", LearningInsightSchema);

export default LearningInsight;
