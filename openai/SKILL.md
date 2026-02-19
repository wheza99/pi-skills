---
name: openai
description: Skill untuk menggunakan OpenAI API - akses ke GPT-5.2, GPT-5 mini/nano, GPT-4.1, reasoning models (o3, o4-mini), image generation (GPT Image 1.5), video generation (Sora 2), audio/speech, embeddings, Realtime API, function calling, structured outputs, agents, fine-tuning, dan Codex. Gunakan untuk text generation, chat, vision, code generation, dan AI agents.
---

# OpenAI API

Skill untuk menggunakan OpenAI API dengan berbagai model dan fitur.

## Setup

1. Buat API key di [OpenAI Dashboard](https://platform.openai.com/login)
2. Export sebagai environment variable:

```bash
# macOS / Linux
export OPENAI_API_KEY="your_api_key_here"

# Windows (PowerShell)
$env:OPENAI_API_KEY="your_api_key_here"

# Windows (CMD)
set OPENAI_API_KEY=your_api_key_here
```

3. Install SDK:

```bash
# JavaScript/TypeScript
npm install openai

# Python
pip install openai
```

## Model yang Tersedia

### Frontier Models (Recommended)
| Model | Deskripsi |
|-------|-----------|
| `gpt-5.2` | Model terbaik untuk coding dan agentic tasks |
| `gpt-5-mini` | Versi lebih cepat dan cost-efficient |
| `gpt-5-nano` | Tercepat dan paling cost-efficient |
| `gpt-5.2-pro` | Versi GPT-5.2 dengan respons lebih presisi |
| `gpt-5` | Model reasoning dengan configurable effort |
| `gpt-4.1` | Smartest non-reasoning model |

### Reasoning Models
| Model | Deskripsi |
|-------|-----------|
| `o3` | Reasoning model untuk complex tasks |
| `o4-mini` | Fast, cost-efficient reasoning model |
| `o3-pro` | Versi o3 dengan lebih banyak compute |

### Open-Weight Models
| Model | Deskripsi |
|-------|-----------|
| `gpt-oss-120b` | Open-weight model paling powerful |
| `gpt-oss-20b` | Medium-sized untuk low latency |

### Image Generation
| Model | Deskripsi |
|-------|-----------|
| `gpt-image-1.5` | State-of-the-art image generation |
| `gpt-image-1` | Previous generation image generation |
| `gpt-image-1-mini` | Cost-efficient version |

### Video Generation
| Model | Deskripsi |
|-------|-----------|
| `sora-2` | Flagship video generation dengan synced audio |
| `sora-2-pro` | Most advanced video generation |

### Audio/Speech
| Model | Deskripsi |
|-------|-----------|
| `gpt-4o-mini-tts` | Text-to-speech |
| `gpt-4o-transcribe` | Speech-to-text |
| `gpt-realtime` | Realtime text dan audio I/O |

### Embeddings & Moderation
| Model | Deskripsi |
|-------|-----------|
| `text-embedding-3-large` | Embedding model paling capable |
| `text-embedding-3-small` | Small embedding model |
| `omni-moderation` | Content moderation untuk text dan images |

## Penggunaan Dasar

### Text Generation (Responses API - Recommended)

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5.2",
    input: "Write a one-sentence bedtime story about a unicorn."
});

console.log(response.output_text);
```

### Dengan Instructions

```javascript
const response = await client.responses.create({
    model: "gpt-5",
    reasoning: { effort: "low" },
    instructions: "Talk like a pirate.",
    input: "Are semicolons optional in JavaScript?",
});

console.log(response.output_text);
```

### Multi-turn Conversation

```javascript
const response = await client.responses.create({
    model: "gpt-5",
    input: [
        {
            role: "developer",
            content: "Talk like a pirate."
        },
        {
            role: "user",
            content: "Are semicolons optional in JavaScript?",
        },
    ],
});
```

### Streaming

```javascript
const stream = await client.responses.create({
    model: "gpt-5",
    input: "Say 'double bubble bath' ten times fast.",
    stream: true,
});

for await (const event of stream) {
    console.log(event);
}
```

## Vision (Image Analysis)

### Dari URL

```javascript
const response = await client.responses.create({
    model: "gpt-5",
    input: [
        {
            role: "user",
            content: [
                { type: "input_text", text: "What is in this image?" },
                { type: "input_image", image_url: "https://example.com/image.png" },
            ],
        },
    ],
});
```

## Tools & Function Calling

### Web Search

```javascript
const response = await client.responses.create({
    model: "gpt-5",
    tools: [
        { type: "web_search" },
    ],
    input: "What was a positive news story from today?",
});
```

### Custom Function Calling

```javascript
const response = await client.responses.create({
    model: "gpt-5",
    tools: [
        {
            type: "function",
            name: "get_weather",
            description: "Get current weather for a location",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string" }
                },
                required: ["location"]
            }
        }
    ],
    input: "What's the weather in Jakarta?",
});
```

## Structured Outputs

```javascript
const response = await client.responses.create({
    model: "gpt-5",
    response_format: {
        type: "json_schema",
        json_schema: {
            name: "user_info",
            schema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    age: { type: "number" }
                },
                required: ["name", "age"]
            }
        }
    },
    input: "Extract info: John is 25 years old"
});
```

## Agents SDK

```javascript
import { Agent, run } from '@openai/agents';

const spanishAgent = new Agent({
    name: 'Spanish agent',
    instructions: 'You only speak Spanish.',
});

const englishAgent = new Agent({
    name: 'English agent',
    instructions: 'You only speak English',
});

const triageAgent = new Agent({
    name: 'Triage agent',
    instructions: 'Handoff to the appropriate agent based on the language.',
    handoffs: [spanishAgent, englishAgent],
});

const result = await run(triageAgent, 'Hola, ¿cómo estás?');
console.log(result.finalOutput);
```

## Image Generation

```javascript
const response = await client.images.generate({
    model: "gpt-image-1.5",
    prompt: "A white siamese cat",
    size: "1024x1024",
    quality: "standard",
    n: 1,
});

console.log(response.data[0].url);
```

## Audio (Speech-to-Text)

```javascript
const transcription = await client.audio.transcriptions.create({
    file: fs.createReadStream("audio.mp3"),
    model: "gpt-4o-transcribe",
});

console.log(transcription.text);
```

## Audio (Text-to-Speech)

```javascript
const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: "Hello world!",
});

const buffer = Buffer.from(await response.arrayBuffer());
fs.writeFileSync("output.mp3", buffer);
```

## Embeddings

```javascript
const response = await client.embeddings.create({
    model: "text-embedding-3-large",
    input: "The food was delicious and the waiter was friendly",
});

console.log(response.data[0].embedding);
```

## Moderation

```javascript
const response = await client.moderations.create({
    model: "omni-moderation",
    input: "Text to moderate here",
});

console.log(response.results[0]);
```

## Reasoning Models

Untuk reasoning models seperti GPT-5 dan o3:

```javascript
const response = await client.responses.create({
    model: "gpt-5",
    reasoning: { effort: "low" }, // "low", "medium", "high"
    input: "Solve this complex problem..."
});
```

## Reusable Prompts

```javascript
const response = await client.responses.create({
    model: "gpt-5",
    prompt: {
        id: "pmpt_abc123",
        version: "2",
        variables: {
            customer_name: "Jane Doe",
            product: "40oz juice box"
        }
    }
});
```

## Python Examples

### Basic Usage

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5.2",
    input="Write a haiku about programming."
)

print(response.output_text)
```

### Streaming

```python
stream = client.responses.create(
    model="gpt-5",
    input="Tell me a story",
    stream=True
)

for event in stream:
    print(event)
```

## Script Helper

Gunakan script helper untuk tugas umum:

```bash
cd .pi/skills/openai && node scripts/chat.js "Your prompt here"
cd .pi/skills/openai && node scripts/chat.js --model=gpt-5-mini "Quick question"
cd .pi/skills/openai && node scripts/embed.js "Text to embed"
cd .pi/skills/openai && node scripts/image.js "A sunset over mountains"
```

## Tips

1. **Pilih model yang tepat**: Gunakan `gpt-5.2` untuk coding/agentic, `gpt-5-mini` untuk tasks sederhana
2. **Gunakan Responses API**: Lebih direkomendasikan daripada Chat Completions API lama
3. **Streaming**: Gunakan streaming untuk UX yang lebih responsif
4. **Reasoning effort**: Untuk reasoning models, sesuaikan `effort` dengan kompleksitas task
5. **Pin model version**: Untuk production, gunakan model snapshot spesifik (e.g., `gpt-5-2025-08-07`)

## Referensi

- [API Reference](https://developers.openai.com/api/reference/overview)
- [Models Overview](references/models.md)
- [Text Generation Guide](https://developers.openai.com/api/docs/guides/text)
- [Agents Guide](https://developers.openai.com/api/docs/guides/agents)
- [Function Calling](https://developers.openai.com/api/docs/guides/function-calling)
- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Realtime API](https://developers.openai.com/api/docs/guides/realtime)
- [Fine-tuning](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)
- [OpenAI Cookbook](https://developers.openai.com/cookbook)
