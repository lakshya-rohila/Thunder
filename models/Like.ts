import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface ILike extends Document {
  userId: Types.ObjectId;
  chatId: Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Prevent duplicate likes — unique compound index
LikeSchema.index({ userId: 1, chatId: 1 }, { unique: true });

// Fast lookup by chat
LikeSchema.index({ chatId: 1 });

const Like: Model<ILike> =
  mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema);

export default Like;
