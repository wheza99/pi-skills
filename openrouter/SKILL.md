---
name: openrouter
description: Skill untuk menggunakan OpenRouter API - unified API untuk mengakses ratusan AI models (OpenAI, Anthropic, Google, Meta, dll) melalui satu endpoint. Gunakan untuk chat completions, streaming, tool calling, structured outputs, dan AI agents.
---

# OpenRouter

OpenRouter menyediakan unified API yang memberikan akses ke ratusan AI models melalui satu endpoint. API kompatibel dengan OpenAI format, sehingga mudah diintegrasikan dengan SDK yang sudah ada.

## Setup

Tidak ada instalasi khusus diperlukan. Hanya butuh API key dari [openrouter.ai/keys](https://openrouter.ai/keys).

Set environment variable:
```bash
export OPENROUTER_API_KEY="your-api-key"
```

## Endpoint

```
POST https://openrouter.ai/api/v1/chat/completions
```

## Headers

```javascript
{
  "Authorization": "Bearer <OPENROUTER_API_KEY>",
  "Content-Type": "application/json",
  "HTTP-Referer": "<YOUR_SITE_URL>",  // Optional, untuk rankings
  "X-Title": "<YOUR_SITE_NAME>"        // Optional, untuk rankings
}
```

## Penggunaan

### 1. Menggunakan OpenRouter SDK (Beta)

```bash
npm install @openrouter/sdk
```

```typescript
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: '<OPENROUTER_API_KEY>',
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>',
    'X-Title': '<YOUR_SITE_NAME>',
  },
});

const completion = await openRouter.chat.send({
  model: 'openai/gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: false,
});

console.log(completion.choices[0].message.content);
```

### 2. Menggunakan OpenAI SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '<OPENROUTER_API_KEY>',
});

const completion = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

### 3. Menggunakan Fetch Langsung

```bash
cd .pi/skills/openrouter && node scripts/chat.js "<prompt>" --model="<model>"
```

**Options:**
- `--model=<id>`: Model ID (default: openai/gpt-4o)
- `--stream=true`: Enable streaming
- `--max-tokens=<n>`: Max tokens
- `--temperature=<n>`: Temperature (0-2)
- `--system=<text>`: System prompt

**Contoh:**
```bash
node scripts/chat.js "What is the meaning of life?" --model="anthropic/claude-sonnet-4"
node scripts/chat.js "Write a poem" --model="google/gemini-2.5-pro" --stream=true
```

## Models Populer

| Model ID | Provider | Deskripsi |
|----------|----------|-----------|
| `openai/gpt-4o` | OpenAI | GPT-4 Omni, fast & capable |
| `openai/gpt-4o-mini` | OpenAI | Cheaper, faster GPT-4 |
| `anthropic/claude-sonnet-4` | Anthropic | Claude Sonnet 4 |
| `anthropic/claude-3.5-sonnet` | Anthropic | Claude 3.5 Sonnet |
| `google/gemini-2.5-pro` | Google | Gemini 2.5 Pro |
| `google/gemini-2.5-flash` | Google | Gemini 2.5 Flash |
| `meta-llama/llama-3.3-70b-instruct` | Meta | Llama 3.3 70B |
| `deepseek/deepseek-r1` | DeepSeek | DeepSeek R1 reasoning |
| `qwen/qwen-2.5-72b-instruct` | Qwen | Qwen 2.5 72B |

Lihat semua models: `node scripts/models.js` atau [openrouter.ai/models](https://openrouter.ai/models)

## Fitur

### Streaming

```typescript
const stream = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### Tool Calling

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string' }
        },
        required: ['location']
      }
    }
  }
];

const response = await openai.chat.completions.create({
  model: 'google/gemini-2.5-flash',
  messages: [{ role: 'user', content: 'What is the weather in Tokyo?' }],
  tools: tools,
});

// Model akan respond dengan tool_calls
if (response.choices[0].message.tool_calls) {
  // Eksekusi tool dan kirim hasilnya kembali
}
```

### Structured Outputs

```typescript
const response = await openai.chat.completions.create({
  model: 'openai/gpt-4o',
  messages: [{ role: 'user', content: 'List 3 fruits' }],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'fruits',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          fruits: { type: 'array', items: { type: 'string' } }
        },
        required: ['fruits']
      }
    }
  }
});
```

### Vision (Image Input)

```typescript
const response = await openai.chat.completions.create({
  model: 'openai/gpt-4o',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is in this image?' },
        { type: 'image_url', image_url: { url: 'https://example.com/image.png' } }
      ]
    }
  ]
});
```

### Assistant Prefill

```typescript
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [
    { role: 'user', content: 'What is the meaning of life?' },
    { role: 'assistant', content: "I'm not sure, but my best guess is" }
  ]
});
```

## Request Parameters

| Parameter | Type | Deskripsi |
|-----------|------|-----------|
| `model` | string | Model ID (wajib) |
| `messages` | array | Array of messages |
| `stream` | boolean | Enable streaming |
| `max_tokens` | number | Max output tokens |
| `temperature` | number | Randomness (0-2) |
| `top_p` | number | Nucleus sampling (0-1] |
| `stop` | string[] | Stop sequences |
| `tools` | array | Tool definitions |
| `tool_choice` | string/object | Tool selection |
| `response_format` | object | Output format |
| `seed` | number | Deterministic outputs |
| `frequency_penalty` | number | Repetition penalty (-2 to 2) |
| `presence_penalty` | number | Topic diversity (-2 to 2) |

## Response Format

```typescript
{
  "id": "gen-xxxxxxxxxxxxxx",
  "choices": [
    {
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "Hello there!"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 4,
    "total_tokens": 14,
    "cost": 0.00014
  },
  "model": "openai/gpt-4o"
}
```

## Scripts

### Chat Completion
```bash
node scripts/chat.js "<prompt>" --model="<model>" [options]
```

### List Models
```bash
node scripts/models.js [options]
```

**Options:**
- `--search=<term>`: Filter by name
- `--provider=<name>`: Filter by provider
- `--free=true`: Show only free models
- `--tools=true`: Show models with tool support

### Tool Calling Example
```bash
node scripts/tool-call.js "<prompt>" --tools='[...]'
```

### Streaming Example
```bash
node scripts/stream.js "<prompt>" --model="<model>"
```

## Tips

1. **Model Selection**: Gunakan models page untuk filter berdasarkan kemampuan (tool calling, vision, dll)
2. **Cost Tracking**: Response includes `usage.cost` untuk tracking biaya
3. **Free Models**: Filter dengan `?supported_parameters=tools` untuk models dengan tool support
4. **Fallbacks**: OpenRouter otomatis fallback ke provider lain jika error
5. **Rate Limits**: Lihat FAQ untuk informasi rate limits

## Referensi

- [API Reference](references/api-reference.md) - Detail lengkap request/response schema
- [Tool Calling](references/tool-calling.md) - Panduan tool calling dan agentic loops
- [Models](references/models.md) - Informasi models API dan parameters

## Links

- [OpenRouter Dashboard](https://openrouter.ai/)
- [API Keys](https://openrouter.ai/keys)
- [Models Page](https://openrouter.ai/models)
- [Request Builder](https://openrouter.ai/request-builder)
- [OpenAPI Spec](https://openrouter.ai/openapi.yaml)
