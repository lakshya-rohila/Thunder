const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;

const MODELS = {
  // Use Donut for Invoice Extraction (it returns structured JSON-like text)
  "invoice-extractor": "naver-clova-ix/donut-base-finetuned-cord-v2",
  // Use Donut for Form Parsing as well (general DocVQA)
  "form-parser": "naver-clova-ix/donut-base-finetuned-docvqa",
  // Table Transformer is good but returns bboxes. For simple structured data, Donut is often safer for OCR-free extraction.
  // However, let's keep Table Transformer if we want specific table structure, OR switch to a more general model.
  // Let's stick to the requested one but warn it might be raw.
  // Actually, for "Table Extractor", Microsoft's Table Transformer is the standard.
  "table-extractor": "microsoft/table-transformer-structure-recognition",
  // Nougat is best for PDFs
  "document-reader": "facebook/nougat-base",
};

export async function queryHuggingFace(modelKey: string, fileBuffer: Buffer, fileType: string) {
  if (!HUGGINGFACE_TOKEN) {
    throw new Error("Hugging Face Token is missing");
  }

  const model = MODELS[modelKey as keyof typeof MODELS];
  if (!model) {
    throw new Error(`Model not found for tool: ${modelKey}`);
  }

  // Determine the correct API URL
  // Using the new router URL structure or the standard inference API
  const apiUrl = `https://api-inference.huggingface.co/models/${model}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
        "Content-Type": fileType === "application/pdf" ? "application/pdf" : "application/octet-stream",
        "x-wait-for-model": "true",
      },
      method: "POST",
      body: fileBuffer as any,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
}

export function cleanOutput(tool: string, rawResult: any) {
  // Post-processing logic to make the output cleaner
  
  if (tool === "invoice-extractor" || tool === "form-parser") {
    // Donut models often return a "generated_text" field which contains XML/JSON string
    if (Array.isArray(rawResult) && rawResult[0]?.generated_text) {
      try {
        // Try to parse if it looks like JSON
        return JSON.parse(rawResult[0].generated_text);
      } catch {
        return { text: rawResult[0].generated_text };
      }
    }
  }

  if (tool === "document-reader") {
    // If we have a single text output (from Nougat or direct read), clean it up
    if (Array.isArray(rawResult) && rawResult[0]?.generated_text) {
      return { markdown: rawResult[0].generated_text };
    }
  }

  if (Array.isArray(rawResult)) {
    // Many models return [ { "generated_text": "..." } ] or similar
    // We might want to restructure it
    return rawResult;
  }
  return rawResult;
}
