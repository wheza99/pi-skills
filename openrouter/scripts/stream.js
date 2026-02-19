#!/usr/bin/env node
/**
 * OpenRouter Streaming Chat Script
 * 
 * Usage: node stream.js "<prompt>" --model="openai/gpt-4o"
 */

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    prompt: args.find(a => !a.startsWith('--')) || '',
    model: args.find(a => a.startsWith('--model='))?.split('=')[1] || 'openai/gpt-4o',
    system: args.find(a => a.startsWith('--system='))?.split('=')[1],
  };
}

async function streamChat(options) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('Error: OPENROUTER_API_KEY environment variable is required');
    process.exit(1);
  }

  if (!options.prompt) {
    console.error('Error: Prompt is required');
    process.exit(1);
  }

  const messages = [];
  
  if (options.system) {
    messages.push({ role: 'system', content: options.system });
  }
  
  messages.push({ role: 'user', content: options.prompt });

  console.log(`\n[Streaming from ${options.model}]\n`);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    console.error('API Error:', await response.json());
    process.exit(1);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const json = JSON.parse(data);
          const content = json.choices[0]?.delta?.content;
          if (content) {
            process.stdout.write(content);
            fullContent += content;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }

  console.log('\n');
}

const options = parseArgs();
streamChat(options);
