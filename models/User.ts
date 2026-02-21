import mongoose, { Schema, Model } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // allows null/undefined for existing users
    lowercase: true,
    trim: true,
    maxlength: [30, "Username too long"],
    match: [
      /^[a-z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens",
    ],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dailyCredits: {
    type: Number,
    default: 100, // Default daily credits for beta
  },
  lastCreditReset: {
    type: Date,
    default: Date.now,
  },
  subscription: {
    type: String,
    enum: ["beta-free", "pro"],
    default: "beta-free",
  },
});

// Prevent Mongoose recompilation error in dev but allow schema updates
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.User;
}

const User: Model<any> =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
