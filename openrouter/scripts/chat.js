#!/usr/bin/env node
/**
 * OpenRouter Chat Completion Script
 * 
 * Usage: node chat.js "<prompt>" --model="openai/gpt-4o" [options]
 */

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    prompt: '',
    model: 'openai/gpt-4o',
    stream: false,
    maxTokens: null,
    temperature: null,
    system: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--model=')) {
      options.model = arg.split('=')[1];
    } else if (arg.startsWith('--stream=')) {
      options.stream = arg.split('=')[1] === 'true';
    } else if (arg.startsWith('--max-tokens=')) {
      options.maxTokens = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--temperature=')) {
      options.temperature = parseFloat(arg.split('=')[1]);
    } else if (arg.startsWith('--system=')) {
      options.system = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
      options.prompt = arg;
    }
  }

  return options;
}

async function chat(options) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('Error: OPENROUTER_API_KEY environment variable is required');
    console.error('Get your API key at https://openrouter.ai/keys');
    process.exit(1);
  }

  if (!options.prompt) {
    console.error('Error: Prompt is required');
    console.error('Usage: node chat.js "<prompt>" --model="openai/gpt-4o"');
    process.exit(1);
  }

  const messages = [];
  
  if (options.system) {
    messages.push({ role: 'system', content: options.system });
  }
  
  messages.push({ role: 'user', content: options.prompt });

  const body = {
    model: options.model,
    messages: messages,
    stream: options.stream,
  };

  if (options.maxTokens) body.max_tokens = options.maxTokens;
  if (options.temperature !== null) body.temperature = options.temperature;

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error);
      process.exit(1);
    }

    if (options.stream) {
      // Streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

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
              if (content) process.stdout.write(content);
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
      console.log();
    } else {
      // Non-streaming response
      const data = await response.json();
      
      console.log('\n--- Response ---');
      console.log(data.choices[0].message.content);
      console.log('\n--- Usage ---');
      console.log(`Model: ${data.model}`);
      console.log(`Prompt tokens: ${data.usage.prompt_tokens}`);
      console.log(`Completion tokens: ${data.usage.completion_tokens}`);
      console.log(`Total tokens: ${data.usage.total_tokens}`);
      if (data.usage.cost) {
        console.log(`Cost: $${data.usage.cost}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

const options = parseArgs();
chat(options);
