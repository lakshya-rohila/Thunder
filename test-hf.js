// test-hf.js
require('dotenv').config({ path: '.env.local' });

const model = "deepseek-ai/DeepSeek-V3";
const token = process.env.HUGGING_FACE_TOKEN;

console.log("Token:", token ? "Present" : "Missing");

async function test() {
  const url = `https://router.huggingface.co/v1/chat/completions`;
  console.log("Testing URL:", url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "user", content: "Explain quantum computing in 50 words." }
        ],
        max_tokens: 500,
      }),
    });

    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Response:", text);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
