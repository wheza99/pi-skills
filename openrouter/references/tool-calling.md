# Tool Calling Guide

Tool calls (function calls) memberikan LLM akses ke external tools. LLM tidak memanggil tool secara langsung, tetapi menyarankan tool yang akan dipanggil.

## Alur Tool Calling

1. **Inference Request dengan Tools** - Kirim request dengan definisi tools
2. **Tool Execution (Client-Side)** - Model respond dengan `tool_calls`, eksekusi tool lokal
3. **Inference Request dengan Tool Results** - Kirim hasil tool kembali ke model

## Contoh Lengkap

### Step 1: Definisikan Tools

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'search_gutenberg_books',
      description: 'Search for books in the Project Gutenberg library',
      parameters: {
        type: 'object',
        properties: {
          search_terms: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of search terms to find books'
          }
        },
        required: ['search_terms']
      }
    }
  }
];
```

### Step 2: Kirim Request dengan Tools

```typescript
const messages = [
  { role: 'user', content: 'What are the titles of some James Joyce books?' }
];

const response = await openai.chat.completions.create({
  model: 'google/gemini-2.5-flash',
  messages,
  tools,
});

const assistantMessage = response.choices[0].message;
```

### Step 3: Proses Tool Calls

```typescript
if (assistantMessage.tool_calls) {
  // Add assistant message to conversation
  messages.push(assistantMessage);

  for (const toolCall of assistantMessage.tool_calls) {
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    // Execute the tool locally
    const result = await executeTool(functionName, args);

    // Add tool result to messages
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(result)
    });
  }
}
```

### Step 4: Kirim Tool Results

```typescript
const finalResponse = await openai.chat.completions.create({
  model: 'google/gemini-2.5-flash',
  messages,
  tools,  // Include tools again for validation
});

console.log(finalResponse.choices[0].message.content);
```

## Tool Choice

```typescript
// Let model decide (default)
{ tool_choice: 'auto' }

// Disable tool usage
{ tool_choice: 'none' }

// Force specific tool
{
  tool_choice: {
    type: 'function',
    function: { name: 'search_database' }
  }
}
```

## Parallel Tool Calls

```typescript
// Disable parallel tool calls
{ parallel_tool_calls: false }
```

## Streaming dengan Tool Calls

```typescript
const stream = await fetch('/api/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4',
    messages,
    tools,
    stream: true
  })
});

const reader = stream.body.getReader();
let toolCalls = [];

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = new TextDecoder().decode(value);
  const lines = chunk.split('\n').filter(line => line.trim());

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));

      if (data.choices[0].delta.tool_calls) {
        toolCalls.push(...data.choices[0].delta.tool_calls);
      }

      if (data.choices[0].delta.finish_reason === 'tool_calls') {
        await handleToolCalls(toolCalls);
      }
    }
  }
}
```

## Agentic Loop

```typescript
async function agenticLoop(messages, tools, maxIterations = 10) {
  for (let i = 0; i < maxIterations; i++) {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash',
      messages,
      tools,
    });

    const message = response.choices[0].message;
    messages.push(message);

    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        const result = await executeTool(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments)
        );
        
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        });
      }
    } else {
      // No more tool calls, return final response
      return message.content;
    }
  }
  
  throw new Error('Max iterations reached');
}
```

## Best Practices

### Function Definition

```typescript
// Good: Clear and specific
{
  name: 'get_weather_forecast',
  description: 'Get current weather conditions and 5-day forecast for a specific location. Supports cities, zip codes, and coordinates.',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: "City name, zip code, or coordinates (lat,lng). Examples: 'New York', '10001', '40.7128,-74.0060'"
      },
      units: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'Temperature unit preference',
        default: 'celsius'
      }
    },
    required: ['location']
  }
}

// Avoid: Too vague
{ name: 'weather' }
```

### Multi-Tool Workflows

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'search_products',
      description: 'Search for products in the catalog'
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_product_details',
      description: 'Get detailed information about a specific product'
    }
  },
  {
    type: 'function',
    function: {
      name: 'check_inventory',
      description: 'Check current inventory levels for a product'
    }
  }
];
```

## Interleaved Thinking

Beberapa model mendukung "interleaved thinking" yang memungkinkan model untuk bernalar di antara tool calls:

- Model dapat bernalar tentang hasil tool sebelum memutuskan langkah selanjutnya
- Chain multiple tool calls dengan reasoning di antaranya
- Memberikan alasan yang transparan untuk proses pemilihan tool

**Note**: Interleaved thinking meningkatkan token usage dan latency.

## Supported Models

Filter models dengan tool support:
- API: `https://openrouter.ai/api/v1/models`
- Web: [openrouter.ai/models?supported_parameters=tools](https://openrouter.ai/models?supported_parameters=tools)
