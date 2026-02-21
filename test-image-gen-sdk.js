// test-image-gen-sdk.js
require('dotenv').config({ path: '.env.local' });
const { InferenceClient } = require("@huggingface/inference");

const token = process.env.HUGGING_FACE_TOKEN;

async function runTest() {
  console.log("Testing with @huggingface/inference SDK...");
  const client = new InferenceClient(token);
  
  // Potential free models to test
  const candidateModels = [
    // Stable Diffusion Variants
    "stabilityai/stable-diffusion-3-medium-diffusers",
    "stabilityai/stable-diffusion-xl-base-1.0",
    "stabilityai/stable-diffusion-2-1",
    "runwayml/stable-diffusion-v1-5",
    "CompVis/stable-diffusion-v1-4",

    // XL Fine-tunes / Specialized
    "ByteDance/SDXL-Lightning",
    "cagliostrolab/animagine-xl-3.1",
    "Corcelio/mobius",
    "prompthero/openjourney",
    "prompthero/openjourney-v4",
    
    // Others
    "black-forest-labs/FLUX.1-dev", // Likely paid
    "black-forest-labs/FLUX.1-schnell", // Likely paid
    "playgroundai/playground-v2.5-1024px-aesthetic",
    "Lykon/dreamshaper-8",
    "Lykon/dreamshaper-xl-1-0"
  ];

  console.log(`Testing ${candidateModels.length} models for free tier availability...`);
  
  const workingModels = [];

  for (const model of candidateModels) {
    try {
      process.stdout.write(`Trying ${model}... `);
      const start = Date.now();
      
      // We set a short timeout to fail fast if it hangs
      const blob = await client.textToImage({
        model: model,
        provider: "hf-inference", 
        inputs: "a cat",
        parameters: { width: 256, height: 256 } // Small image for speed
      });
      
      const duration = Date.now() - start;
      console.log(`✅ Success! (${(blob.size / 1024).toFixed(1)} KB, ${duration}ms)`);
      workingModels.push(model);
      
    } catch (e) {
      // Check error message for specific failure reasons
      const msg = e.message || "";
      if (msg.includes("404") || msg.includes("Not Found")) {
        console.log(`❌ 404 Not Found`);
      } else if (msg.includes("410") || msg.includes("deprecated")) {
        console.log(`❌ 410 Deprecated`);
      } else if (msg.includes("403") || msg.includes("Forbidden")) {
        console.log(`❌ 403 Forbidden (Auth/Paid?)`);
      } else if (msg.includes("402") || msg.includes("Payment Required")) {
         console.log(`❌ 402 Payment Required`);
      } else if (msg.includes("503") || msg.includes("Service Unavailable")) {
         console.log(`⚠️ 503 Service Unavailable (Might be loading)`);
         // 503 often means model is cold-booting on free tier, so it MIGHT work later.
         // But for a reliable list, we should probably skip or mark as "Cold".
         workingModels.push(`${model} (Cold Boot)`);
      } else if (msg.includes("timeout")) {
          console.log(`❌ Timeout`);
      } else {
        console.log(`❌ Error: ${msg.substring(0, 60)}...`);
      }
    }
  }

  console.log("\n--- SUMMARY OF WORKING MODELS ---");
  console.log(JSON.stringify(workingModels, null, 2));
}

runTest();
