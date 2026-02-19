import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// TTL index — MongoDB auto-deletes expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default Session;
