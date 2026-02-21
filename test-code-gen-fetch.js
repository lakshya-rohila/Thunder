// test-code-gen-fetch.js
require('dotenv').config({ path: '.env.local' });

const token = process.env.HUGGING_FACE_TOKEN;
const model = "Qwen/Qwen2.5-Coder-32B-Instruct";

async function runTest() {
  console.log(`Testing ${model} via fetch to router...`);
  
  const url = "https://router.huggingface.co/v1/chat/completions";
  
  const payload = {
    model: model,
    messages: [
      { role: "system", content: "You are a helpful code assistant." },
      { role: "user", content: "Write a hello world in Rust." }
    ],
    max_tokens: 500,
    stream: false
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.log(`❌ Status: ${response.status}`);
      console.log(`   Error: ${text}`);
      return;
    }

    const data = await response.json();
    console.log("✅ Success!");
    console.log("Output:", data.choices[0].message.content);
    
  } catch (e) {
    console.error("Fetch Error:", e);
  }
}

runTest();
