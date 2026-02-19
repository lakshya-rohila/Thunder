import mongoose, { Schema, Model, Document, Types } from "mongoose";
import Message from "./Message";
import Like from "./Like";
import Comment from "./Comment";

export interface IChat extends Document {
  userId: Types.ObjectId;
  title: string;
  description: string;
  prompt: string;
  generatedHTML: string;
  generatedCSS: string;
  generatedJS: string;
  isPublic: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
}

const ChatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [200, "Title too long"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description too long"],
      trim: true,
    },
    prompt: {
      type: String,
      required: true,
      maxlength: [10000, "Prompt too long"],
    },
    generatedHTML: { type: String, default: "" },
    generatedCSS: { type: String, default: "" },
    generatedJS: { type: String, default: "" },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      // null = public (never expires), Date = private (TTL)
    },
  },
  {
    timestamps: true,
  },
);

// TTL index — only fires when expiresAt is a Date (not null)
ChatSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// Private history: sorted listing
ChatSchema.index({ userId: 1, updatedAt: -1 });

// Community feed: public + sorted by time or likes
ChatSchema.index({ isPublic: 1, createdAt: -1 });
ChatSchema.index({ isPublic: 1, likesCount: -1 });

// Cascade delete: remove Messages, Likes, Comments when a Chat is deleted
ChatSchema.pre("findOneAndDelete", async function () {
  const chat = await this.model.findOne(this.getFilter());
  if (chat) {
    await Promise.all([
      Message.deleteMany({ chatId: chat._id }),
      Like.deleteMany({ chatId: chat._id }),
      Comment.deleteMany({ chatId: chat._id }),
    ]);
  }
});

// Prevent Mongoose recompilation error in dev but allow schema updates
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Chat;
}

const Chat: Model<IChat> =
  mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
