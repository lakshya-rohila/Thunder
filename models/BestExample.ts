import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBestExample extends Document {
  prompt: string;
  type: "component" | "app" | "game";
  html: string;
  css: string;
  js: string;
  tags: string[];
  qualityScore: number;
}

const BestExampleSchema = new Schema<IBestExample>(
  {
    prompt: { type: String, required: true, index: "text" }, // Text index for basic search
    type: { type: String, enum: ["component", "app", "game"], required: true },
    html: { type: String, required: true },
    css: { type: String, required: true },
    js: { type: String, required: true },
    tags: [{ type: String }],
    qualityScore: { type: Number, default: 90 },
  },
  { timestamps: true },
);

const BestExample: Model<IBestExample> =
  mongoose.models.BestExample ||
  mongoose.model<IBestExample>("BestExample", BestExampleSchema);

export default BestExample;
