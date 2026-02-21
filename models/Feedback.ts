import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
  generationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number; // 1-5
  useful: boolean;
  userEdited: boolean;
  copiedCode: boolean;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    generationId: {
      type: Schema.Types.ObjectId,
      ref: "Generation",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5 },
    useful: { type: Boolean, default: false },
    userEdited: { type: Boolean, default: false },
    copiedCode: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
