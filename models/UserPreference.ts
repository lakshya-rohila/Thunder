import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserPreference extends Document {
  userId: mongoose.Types.ObjectId;
  prefersDarkMode: boolean;
  cssFramework: "tailwind" | "vanilla" | "bootstrap" | "auto";
  codingStyle: "functional" | "class" | "auto";
  preferredLibraries: string[]; // e.g. ["gsap", "three.js"]
  tone: "professional" | "playful" | "minimal" | "auto";
}

const UserPreferenceSchema = new Schema<IUserPreference>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    prefersDarkMode: { type: Boolean, default: true },
    cssFramework: { type: String, enum: ["tailwind", "vanilla", "bootstrap", "auto"], default: "auto" },
    codingStyle: { type: String, enum: ["functional", "class", "auto"], default: "auto" },
    preferredLibraries: [{ type: String }],
    tone: { type: String, enum: ["professional", "playful", "minimal", "auto"], default: "auto" },
  },
  { timestamps: true },
);

const UserPreference: Model<IUserPreference> =
  mongoose.models.UserPreference ||
  mongoose.model<IUserPreference>("UserPreference", UserPreferenceSchema);

export default UserPreference;
