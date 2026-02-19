#!/usr/bin/env node
/**
 * Qwen Chat Script
 * Usage: node chat.js "Your prompt" --model=qwen-max-latest
 */

const OpenAI = require('openai');

// Parse arguments
const args = process.argv.slice(2);
let prompt = '';
let model = 'qwen-max-latest';
let stream = true;
let temperature = 0.7;

for (const arg of args) {
  if (arg.startsWith('--model=')) {
    model = arg.split('=')[1];
  } else if (arg.startsWith('--temp=')) {
    temperature = parseFloat(arg.split('=')[1]);
  } else if (arg === '--no-stream') {
    stream = false;
  } else if (!arg.startsWith('--')) {
    prompt = arg;
  }
}

if (!prompt) {
  console.error('Usage: node chat.js "Your prompt" [--model=MODEL] [--temp=0.7] [--no-stream]');
  console.error('\nModels: qwen-max-latest, qwen-plus-latest, qwen-turbo-latest, qwen2.5-72b-instruct');
  process.exit(1);
}

// Check for API key
const apiKey = process.env.DASHSCOPE_API_KEY || process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: Set DASHSCOPE_API_KEY or OPENAI_API_KEY environment variable');
  process.exit(1);
}

// Initialize client
const client = new OpenAI({
  apiKey: apiKey,
  base_url: process.env.OPENAI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
});

async function chat() {
  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature,
      stream: stream
    });

    if (stream) {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        process.stdout.write(content);
      }
      console.log();
    } else {
      console.log(response.choices[0].message.content);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

chat();
