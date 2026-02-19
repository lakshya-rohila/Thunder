import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [50000, "Message content too long"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
