import User from "@/models/User";
import connectToDatabase from "@/lib/db";

export const DAILY_CREDIT_LIMIT = 200;

export async function getUserCredits(userId: string) {
  await connectToDatabase();
  
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check for daily reset
  const now = new Date();
  const lastReset = user.lastCreditReset ? new Date(user.lastCreditReset) : new Date(0); // Handle missing date
  
  // Reset if it's a different day (UTC)
  if (
    now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
    now.getUTCMonth() !== lastReset.getUTCMonth() ||
    now.getUTCDate() !== lastReset.getUTCDate()
  ) {
    user.dailyCredits = DAILY_CREDIT_LIMIT;
    user.lastCreditReset = now;
    await user.save();
    return DAILY_CREDIT_LIMIT;
  }

  // Auto-correct negative credits if any exist (e.g. from manual edits or race conditions)
  if (user.dailyCredits < 0) {
    user.dailyCredits = 0;
    await user.save();
    return 0;
  }

  return user.dailyCredits;
}

export async function deductCredits(userId: string, amount: number) {
  await connectToDatabase();

  // First ensure credits are up to date (handle reset)
  await getUserCredits(userId);

  // Atomic deduction with condition to prevent negative balance
  const result = await User.findOneAndUpdate(
    { 
      _id: userId, 
      dailyCredits: { $gte: amount } 
    },
    { $inc: { dailyCredits: -amount } },
    { new: true } // Return updated document
  );

  return !!result;
}
