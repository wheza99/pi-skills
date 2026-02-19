#!/usr/bin/env node
/**
 * OpenRouter Tool Calling Example Script
 * 
 * Usage: node tool-call.js "<prompt>" --model="google/gemini-2.5-flash"
 * 
 * This script demonstrates tool calling with a simple calculator tool.
 */

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Example tool: Calculator
const tools = [
  {
    type: 'function',
    function: {
      name: 'calculate',
      description: 'Perform basic arithmetic operations',
      parameters: {
        type: 'object',
        properties: {
          operation: {
            type: 'string',
            enum: ['add', 'subtract', 'multiply', 'divide'],
            description: 'The arithmetic operation to perform'
          },
          a: { type: 'number', description: 'First operand' },
          b: { type: 'number', description: 'Second operand' }
        },
        required: ['operation', 'a', 'b']
      }
    }
  }
];

// Tool implementation
function calculate(operation, a, b) {
  switch (operation) {
    case 'add': return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide': return b !== 0 ? a / b : 'Error: Division by zero';
    default: return 'Unknown operation';
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    prompt: args.find(a => !a.startsWith('--')) || 'What is 25 multiplied by 4?',
    model: args.find(a => a.startsWith('--model='))?.split('=')[1] || 'google/gemini-2.5-flash',
  };
}

async function toolCallChat(options) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('Error: OPENROUTER_API_KEY environment variable is required');
    process.exit(1);
  }

  const messages = [
    { role: 'user', content: options.prompt }
  ];

  console.log(`\n[Prompt] ${options.prompt}`);
  console.log(`[Model] ${options.model}\n`);

  // Step 1: Send request with tools
  let response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model,
      messages,
      tools,
    }),
  });

  if (!response.ok) {
    console.error('API Error:', await response.json());
    process.exit(1);
  }

  let data = await response.json();
  const assistantMessage = data.choices[0].message;

  // Step 2: Check if model wants to call a tool
  if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
    console.log('[Tool Call Requested]');
    
    // Add assistant message to conversation
    messages.push(assistantMessage);

    // Process each tool call
    for (const toolCall of assistantMessage.tool_calls) {
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      console.log(`  Function: ${functionName}`);
      console.log(`  Arguments: ${JSON.stringify(args)}`);

      // Execute the tool
      let result;
      if (functionName === 'calculate') {
        result = calculate(args.operation, args.a, args.b);
      } else {
        result = 'Unknown function';
      }

      console.log(`  Result: ${result}\n`);

      // Add tool result to messages
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: String(result)
      });
    }

    // Step 3: Send tool results back to model
    console.log('[Getting final response...]\n');
    
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        tools,
      }),
    });

    if (!response.ok) {
      console.error('API Error:', await response.json());
      process.exit(1);
    }

    data = await response.json();
  }

  // Final response
  console.log('[Response]');
  console.log(data.choices[0].message.content);
  console.log('\n[Usage]');
  console.log(`Total tokens: ${data.usage.total_tokens}`);
  if (data.usage.cost) {
    console.log(`Cost: $${data.usage.cost}`);
  }
}

const options = parseArgs();
toolCallChat(options);
