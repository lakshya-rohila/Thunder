// lib/code-assistant.ts

export const CODE_MODEL = {
  id: "Qwen/Qwen2.5-Coder-32B-Instruct",
  name: "Qwen 2.5 Coder 32B",
  description: "State-of-the-art open coding model",
  // Use the standard OpenAI-compatible chat completion endpoint
  endpoint: "https://router.huggingface.co/v1/chat/completions",
};

export interface CodeAssistantRequest {
  prompt: string;
  codeContext?: string; // Optional existing code
  language?: string;
}

export async function generateCode(params: CodeAssistantRequest): Promise<string> {
  const hfToken = process.env.HUGGING_FACE_TOKEN;

  if (!hfToken) {
    throw new Error("HUGGING_FACE_TOKEN is not set");
  }

  const lang = params.language || "javascript";
  
  // Construct a chat prompt for the instruct model
  const messages = [
    {
      role: "system",
      content: `You are an expert coding assistant specialized in ${lang}. 
      Your task is to generate high-quality, efficient code based on the user's request.
      Return ONLY the raw code solution. Do not use markdown backticks (unless part of the code itself). 
      Do not add explanations or conversational filler. Just the code.`
    },
    {
      role: "user",
      content: params.codeContext 
        ? `Context:\n${params.codeContext}\n\nTask: ${params.prompt}`
        : params.prompt
    }
  ];

  const payload = {
    model: CODE_MODEL.id,
    messages: messages,
    max_tokens: 2048,
    temperature: 0.2,
    top_p: 0.95,
    stream: false
  };

  const response = await fetch(CODE_MODEL.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hfToken}`,
      "Content-Type": "application/json",
      "X-Use-Cache": "false",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Code Generation Failed: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  // Parse OpenAI-compatible response format
  if (result.choices && result.choices[0] && result.choices[0].message) {
    let content = result.choices[0].message.content;
    
    // Clean up if the model still adds markdown blocks despite instructions
    if (content.startsWith("```")) {
      content = content.replace(/^```[a-z]*\n/, "").replace(/\n```$/, "");
    }
    
    return content;
  }
  
  return JSON.stringify(result);
}
