// test-code-gen-strict.js
require('dotenv').config({ path: '.env.local' });

const token = process.env.HUGGING_FACE_TOKEN;
const model = "Qwen/Qwen2.5-Coder-32B-Instruct";

async function runTest() {
  console.log(`Testing ${model} strict code output...`);
  
  const url = "https://router.huggingface.co/v1/chat/completions";
  
  const payload = {
    model: model,
    messages: [
      { 
        role: "system", 
        content: "You are a code generator. Return ONLY the raw code solution. Do not use markdown backticks. Do not add explanations." 
      },
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

    const data = await response.json();
    console.log("Output:\n" + data.choices[0].message.content);
    
  } catch (e) {
    console.error("Fetch Error:", e);
  }
}

runTest();
