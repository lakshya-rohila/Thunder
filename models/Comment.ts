import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IComment extends Document {
  userId: Types.ObjectId;
  chatId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
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
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for fetching comments by chat, sorted by time
CommentSchema.index({ chatId: 1, createdAt: -1 });

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
