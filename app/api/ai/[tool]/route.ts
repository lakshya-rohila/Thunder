import { NextResponse } from "next/server";
import { queryHuggingFace, cleanOutput } from "@/lib/document-ai";
import DocumentJob from "@/models/DocumentJob";
import connectToDatabase from "@/lib/db";
import { getAuthContext } from "@/lib/auth";

// Map frontend tool IDs to internal model keys if they differ, 
// but we used consistent naming in lib/document-ai.ts
const TOOL_MAPPING: Record<string, string> = {
  "invoice-extractor": "invoice-extractor",
  "form-parser": "form-parser",
  "table-extractor": "table-extractor",
  "document-reader": "document-reader",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tool: string }> }
) {
  try {
    const { tool } = await params;
    
    // 1. Authenticate
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;
    const userId = auth.userId;

    // 2. Validate Tool
    const modelKey = TOOL_MAPPING[tool];
    if (!modelKey) {
      return NextResponse.json({ error: "Invalid tool" }, { status: 404 });
    }

    // 3. Parse File
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Check file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "text/markdown", "text/plain"];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".md") && !file.name.endsWith(".txt")) {
      // Sometimes file.type is empty or different for text files, check extension as backup
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // 4. Create Job Record
    await connectToDatabase();
    const job = await DocumentJob.create({
      userId,
      toolName: tool,
      fileName: file.name,
      status: "processing",
    });

    // 5. Process with AI
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      let cleanedResult;

      // Handle Text/Markdown files directly (skip Hugging Face)
      if (
        (file.type === "text/markdown" || file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt")) &&
        tool === "document-reader"
      ) {
        const textContent = buffer.toString("utf-8");
        // Return structured like the AI model would (Nougat often returns a markdown string)
        cleanedResult = [{ generated_text: textContent }];
      } else {
        // Use AI Model
        const rawResult = await queryHuggingFace(modelKey, buffer, file.type);
        cleanedResult = cleanOutput(tool, rawResult);
      }

      // 6. Update Job
      job.result = cleanedResult;
      job.status = "completed";
      await job.save();

      return NextResponse.json({ 
        success: true, 
        data: cleanedResult,
        jobId: job._id 
      });

    } catch (aiError: any) {
      console.error("AI Processing Error:", aiError);
      job.status = "failed";
      job.error = aiError.message || "AI processing failed";
      await job.save();

      return NextResponse.json(
        { error: "AI processing failed. Please try again later." },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
