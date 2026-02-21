// lib/image-gen.ts

export const IMAGE_MODELS = [
  {
    id: "stabilityai/stable-diffusion-3-medium-diffusers",
    name: "Stable Diffusion 3 Medium",
    description: "Latest generation, high quality text-to-image",
    endpoint: "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-3-medium-diffusers",
  },
  {
    id: "black-forest-labs/FLUX.1-schnell",
    name: "FLUX.1 Schnell",
    description: "State-of-the-art speed and quality",
    endpoint: "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
  },
  {
    id: "stabilityai/stable-diffusion-xl-base-1.0",
    name: "SDXL Base 1.0",
    description: "Reliable, high quality base model",
    endpoint: "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
  },
];

export interface ImageGenerationRequest {
  prompt: string;
  modelId: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  negative_prompt?: string;
}

export async function generateImage(params: ImageGenerationRequest): Promise<Blob> {
  const model = IMAGE_MODELS.find((m) => m.id === params.modelId) || IMAGE_MODELS[0];
  const hfToken = process.env.HUGGING_FACE_TOKEN;

  if (!hfToken) {
    throw new Error("HUGGING_FACE_TOKEN is not set");
  }

  // Construct payload based on model type recommendations
  const payload: any = {
    inputs: params.prompt,
    parameters: {
      width: params.width || 512,
      height: params.height || 512,
    },
  };

  // Add specific parameters if provided or set defaults based on model
  // Note: params.num_inference_steps might be 0 or undefined, so we check specifically
  if (params.modelId.includes("turbo")) {
    payload.parameters.num_inference_steps = params.num_inference_steps ?? 1;
    payload.parameters.guidance_scale = 0.0;
  } else {
    payload.parameters.num_inference_steps = params.num_inference_steps ?? 25;
    payload.parameters.guidance_scale = params.guidance_scale ?? 7.5;
    if (params.negative_prompt) {
      payload.parameters.negative_prompt = params.negative_prompt;
    }
  }

  // Use the endpoint from the model definition
  const response = await fetch(model.endpoint, {
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
    throw new Error(`Image Generation Failed: ${response.status} - ${errorText}`);
  }

  return await response.blob();
}
