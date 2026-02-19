# Inference Providers Detail

Dokumentasi detail tentang Inference Providers dari hasil scraping.

## Overview

Inference Providers memberikan akses ke ratusan ML models melalui world-class inference providers. Terintegrasi dengan Python dan JavaScript SDKs.

## Partners

| Provider | Chat (LLM) | Chat (VLM) | Feature Extraction | Text to Image | Text to Video | Speech to Text |
|----------|------------|------------|-------------------|---------------|---------------|----------------|
| Cerebras | ✅ |  |  |  |  |  |
| Cohere | ✅ | ✅ |  |  |  |  |
| Fal AI |  |  |  | ✅ | ✅ | ✅ |
| Featherless AI | ✅ | ✅ |  |  |  |  |
| Fireworks | ✅ | ✅ |  |  |  |  |
| Groq | ✅ | ✅ |  |  |  |  |
| HF Inference | ✅ | ✅ | ✅ | ✅ |  | ✅ |
| Hyperbolic | ✅ | ✅ |  |  |  |  |
| Novita | ✅ | ✅ |  |  | ✅ |  |
| Nscale | ✅ | ✅ |  | ✅ |  |  |
| OVHcloud | ✅ | ✅ |  |  |  |  |
| Public AI | ✅ |  |  |  |  |  |
| Replicate |  |  |  | ✅ | ✅ | ✅ |
| SambaNova | ✅ |  | ✅ |  |  |  |
| Scaleway | ✅ |  | ✅ |  |  |  |
| Together | ✅ | ✅ |  | ✅ |  |  |
| WaveSpeedAI |  |  |  | ✅ | ✅ |  |
| Z.ai | ✅ | ✅ |  |  |  |  |

## Key Features

- 🎯 **All-in-One API**: Single API untuk text, image, embeddings, dll
- 🔀 **Multi-Provider Support**: fal, Replicate, Sambanova, Together, dll
- 🚀 **Scalable & Reliable**: High availability, low-latency
- 🔧 **Developer-Friendly**: Simple requests, consistent experience
- 👷 **Easy Integration**: Drop-in replacement untuk OpenAI API
- 💰 **Cost-Effective**: No extra markup on provider rates

## Why Inference Providers?

1. **Instant Access to Cutting-Edge Models**: Thousands of specialized models
2. **Zero Vendor Lock-in**: Multiple providers through one interface
3. **Production-Ready Performance**: Enterprise reliability

## Use Cases

- **Text Generation**: Chatbots, content generation, code assistance
- **Image & Video Generation**: Custom images/videos dengan LoRAs
- **Search & Retrieval**: Semantic search, RAG, recommendations
- **Traditional ML**: Classification, NER, summarization, speech recognition

## Pricing

- Generous free tier
- Additional credits untuk PRO users
- Team & Enterprise credits

## Authentication

1. Get token from: https://huggingface.co/settings/tokens
2. Use fine-grained token dengan "Make calls to Inference Providers" permission

## Quick Start - LLM

### Python with huggingface_hub

```python
import os
from huggingface_hub import InferenceClient

client = InferenceClient()

completion = client.chat.completions.create(
    model="openai/gpt-oss-120b",
    messages=[{"role": "user", "content": "How many 'G's in 'huggingface'?"}]
)

print(completion.choices[0].message)
```

### JavaScript with huggingface.js

```typescript
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

const chatCompletion = await client.chatCompletion({
  model: "openai/gpt-oss-120b:fastest",
  messages: [{ role: "user", content: "How many 'G's in 'huggingface'?" }],
});

console.log(chatCompletion.choices[0].message);
```

### HTTP / cURL

```bash
curl https://router.huggingface.co/v1/chat/completions \
    -H "Authorization: Bearer $HF_TOKEN" \
    -H 'Content-Type: application/json' \
    -d '{
        "messages": [{"role": "user", "content": "How many G in huggingface?"}],
        "model": "openai/gpt-oss-120b:fastest",
        "stream": false
    }'
```

## Quick Start - Text-to-Image

### Python

```python
from huggingface_hub import InferenceClient

client = InferenceClient()

image = client.text_to_image(
    prompt="A serene lake surrounded by mountains at sunset, photorealistic style",
    model="black-forest-labs/FLUX.1-dev"
)
image.save("generated_image.png")
```

### JavaScript

```typescript
import { InferenceClient } from "@huggingface/inference";
import fs from "fs";

const client = new InferenceClient(process.env.HF_TOKEN);

const imageBlob = await client.textToImage({
  model: "black-forest-labs/FLUX.1-dev",
  inputs: "A serene lake surrounded by mountains at sunset, photorealistic style",
});

const buffer = Buffer.from(await imageBlob.arrayBuffer());
fs.writeFileSync("generated_image.png", buffer);
```

## Provider Selection

### API as Proxy Service

Benefits:
- Unified Authentication & Billing
- Automatic Failover (with provider="auto")
- Consistent Interface through client libraries

### Client-Side Selection

```python
# Explicit provider
client.chat.completions.create(
    model="deepseek-ai/DeepSeek-R1",
    provider="sambanova",
    messages=[{"role": "user", "content": "Hello!"}]
)

# Automatic selection (default)
client.chat.completions.create(
    model="deepseek-ai/DeepSeek-R1",
    # provider="auto" (default)
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Selection Policies

- `provider="auto"` (default): First available by preference order
- `provider="specific-provider"`: Force specific provider

## OpenAI-Compatible Endpoint

Drop-in replacement untuk OpenAI chat completions:

### Python with OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    baseURL="https://router.huggingface.co/v1",
    apiKey=process.env.HF_TOKEN,
)

completion = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-R1:fastest",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Model Name Suffixes

- `:fastest` (default): Highest throughput in tokens/sec
- `:cheapest`: Lowest price per output token
- `:preferred`: Your preference order in settings

### cURL

```bash
curl https://router.huggingface.co/v1/chat/completions \
  -H "Authorization: Bearer $HF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-ai/DeepSeek-R1:fastest",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Choosing the Right Approach

### Use Inference Clients when:
- Need all task types (text-to-image, speech, embeddings, etc.)
- Want explicit control over provider selection
- Building applications with multiple AI tasks

### Use OpenAI-Compatible Endpoint when:
- Only doing chat completions
- Migrating existing OpenAI-based code
- Prefer server-side provider management

### Use Direct HTTP when:
- Implementing custom request logic
- Fine-grained control over request/response
- No available client libraries

## Next Steps

- [Pricing and Billing](https://huggingface.co/docs/inference-providers/billing)
- [Hub Integration](https://huggingface.co/docs/inference-providers/hub)
- [API Reference](https://huggingface.co/docs/inference-providers/api-reference)
