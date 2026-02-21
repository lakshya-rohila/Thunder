import connectToDatabase from "@/lib/db";
import { LearningEngine } from "@/lib/learningEngine";

// This script would typically be run via a cron job (e.g., Vercel Cron, GitHub Actions)
// For now, it's a standalone script that can be invoked manually or via an API endpoint.

async function runPatternDetection() {
  console.log("Starting Pattern Detection Job...");
  try {
    await connectToDatabase();
    await LearningEngine.analyzeFailedGenerations();
    console.log("Pattern Detection Job Completed Successfully.");
  } catch (error) {
    console.error("Pattern Detection Job Failed:", error);
    process.exit(1);
  }
  process.exit(0);
}

// Execute if run directly
if (require.main === module) {
  runPatternDetection();
}
