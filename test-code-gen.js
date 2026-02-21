// test-code-gen.js
require('dotenv').config({ path: '.env.local' });
const { InferenceClient } = require("@huggingface/inference");

const token = process.env.HUGGING_FACE_TOKEN;

async function runTest() {
  console.log("Testing Code Generation Models with @huggingface/inference SDK...");
  const client = new InferenceClient(token);
  
  // Broader list of models
  const candidateModels = [
    "Qwen/Qwen2.5-Coder-32B-Instruct",
    "Qwen/Qwen2.5-72B-Instruct",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    "meta-llama/Llama-3.2-3B-Instruct",
    "microsoft/Phi-3.5-mini-instruct",
    "HuggingFaceH4/zephyr-7b-beta",
    "mistralai/Mistral-7B-Instruct-v0.3"
  ];

  console.log(`Testing ${candidateModels.length} models...`);
  
  const workingModels = [];

  for (const model of candidateModels) {
    try {
      process.stdout.write(`Trying ${model}... `);
      const start = Date.now();
      
      // Try without specifying provider first (auto)
      const response = await client.chatCompletion({
        model: model,
        messages: [{ role: "user", content: "Write a fibonacci function in python" }],
        max_tokens: 100
      });
      
      const duration = Date.now() - start;
      console.log(`✅ Success! (${duration}ms)`);
      console.log(`   Output: ${response.choices[0].message.content.substring(0, 50)}...`);
      workingModels.push(model);
      
    } catch (e) {
       console.log(`❌ Error: ${e.message.substring(0, 100)}...`);
    }
  }

  console.log("\n--- SUMMARY OF WORKING MODELS ---");
  console.log(JSON.stringify(workingModels, null, 2));
}

runTest();
