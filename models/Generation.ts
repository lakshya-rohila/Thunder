import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGeneration extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  detectedType: "component" | "app" | "game";
  html: string;
  css: string;
  js: string;
  createdAt: Date;
  successScore?: number;
}

const GenerationSchema = new Schema<IGeneration>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    prompt: { type: String, required: true },
    detectedType: {
      type: String,
      enum: ["component", "app", "game"],
      required: true,
    },
    html: { type: String, default: "" },
    css: { type: String, default: "" },
    js: { type: String, default: "" },
    successScore: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true },
);

const Generation: Model<IGeneration> =
  mongoose.models.Generation ||
  mongoose.model<IGeneration>("Generation", GenerationSchema);

export default Generation;
