import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDocumentJob extends Document {
  userId: mongoose.Types.ObjectId;
  toolName: string;
  fileName: string;
  result: any;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
  createdAt: Date;
}

const DocumentJobSchema = new Schema<IDocumentJob>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toolName: { type: String, required: true },
    fileName: { type: String, required: true },
    result: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    error: { type: String },
    createdAt: { type: Date, default: Date.now, expires: "15d" }, // TTL Index: 15 days
  },
  { timestamps: true }
);

// Prevent overwriting the model if it already exists
const DocumentJob: Model<IDocumentJob> =
  mongoose.models.DocumentJob ||
  mongoose.model<IDocumentJob>("DocumentJob", DocumentJobSchema);

export default DocumentJob;
