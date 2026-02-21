// test-image-gen.js
require('dotenv').config({ path: '.env.local' });

const token = process.env.HUGGING_FACE_TOKEN;
const modelId = "stabilityai/sdxl-turbo";

// Try the standard Inference API endpoint, but using the HF-Inference pattern if router fails?
// The 410 error said "use router.huggingface.co".
// Let's try to list available models or just check docs via search? 
// But first, let's try the v1/chat/completions style? No, that's for text.

async function runTests() {
  // Let's try the EXACT url that was in the 410 error message from earlier logs?
  // "https://api-inference.huggingface.co is no longer supported. Please use https://router.huggingface.co instead."
  
  // Maybe it's https://router.huggingface.co/hf-inference/v1/models/...? 
  // Or maybe we need to use the `huggingface_hub` library style URLs?
  
  const urls = [
      "https://router.huggingface.co/hf-inference/models/stabilityai/sdxl-turbo", // 404
      "https://router.huggingface.co/models/stabilityai/sdxl-turbo", // 404
      "https://router.huggingface.co/stabilityai/sdxl-turbo", // 404
      "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo", // 410
  ];
  
  // Let's try a different model that is definitely free serverless
  const models = [
      "stabilityai/sdxl-turbo",
      "black-forest-labs/FLUX.1-dev", // Might be on router?
  ];
  
  // Wait, maybe the issue is that "router.huggingface.co" is for "Inference Providers" (external), 
  // and "hf-inference" provider is one of them.
  
  // Let's try to query the "hf-inference" provider specifically via the OpenAI compatible endpoint for images? 
  // No, OpenAI API is for text.
  
  // Let's try to use the huggingface.js client in a script to see what URL it constructs?
  // Or just search for "hugging face inference api router url image generation"
}
