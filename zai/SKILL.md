---
name: zai
description: Skill untuk menggunakan Z.AI API - akses ke GLM-5 (flagship untuk coding dan agentic tasks), GLM-4.7, GLM-4.6, GLM-4.6V (vision), GLM-OCR, GLM-Image (text-to-image), CogVideoX-3 (video generation), GLM-ASR-2512 (speech-to-text), Thinking Mode, Function Calling, dan tools. Compatible dengan OpenAI SDK. Gunakan untuk text generation, vision, image generation, video generation, dan audio transcription.
---

# Z.AI API

Skill untuk menggunakan Z.AI API dengan berbagai model GLM dan fitur AI.

## Setup

1. Buat API key di [Z.AI Platform](https://z.ai/model-api)
2. Export sebagai environment variable:

```bash
# macOS / Linux
export ZAI_API_KEY="your_api_key_here"

# Windows (PowerShell)
$env:ZAI_API_KEY="your_api_key_here"

# Windows (CMD)
set ZAI_API_KEY=your_api_key_here
```

3. Install SDK:

```bash
# Python (OpenAI Compatible)
pip install openai

# Python (Official ZAI SDK)
pip install zai-sdk

# Node.js
npm install openai
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `https://api.z.ai/api/paas/v4/` | Standard API |
| `https://api.z.ai/api/coding/paas/v4/` | Coding Plan (untuk coding scenarios) |

## Model yang Tersedia

### Text Models (LLM)

| Model | Input | Output | Deskripsi |
|-------|-------|--------|-----------|
| `glm-5` | $1/MTok | $3.2/MTok | Flagship model untuk Agentic Engineering, 200K context |
| `glm-5-code` | $1.2/MTok | $5/MTok | Optimized untuk coding |
| `glm-4.7` | $0.6/MTok | $2.2/MTok | Advanced reasoning |
| `glm-4.7-flashx` | $0.07/MTok | $0.4/MTok | Fast dan cost-efficient |
| `glm-4.7-flash` | FREE | FREE | Free tier |
| `glm-4.6` | $0.6/MTok | $2.2/MTok | General purpose |
| `glm-4.5` | $0.6/MTok | $2.2/MTok | Standard model |
| `glm-4.5-x` | $2.2/MTok | $8.9/MTok | Extended capabilities |
| `glm-4.5-air` | $0.2/MTok | $1.1/MTok | Lightweight |
| `glm-4.5-airx` | $1.1/MTok | $4.5/MTok | Air extended |
| `glm-4.5-flash` | FREE | FREE | Free tier |
| `glm-4-32b-0414-128k` | $0.1/MTok | $0.1/MTok | Budget option |

### Vision Models (VLM)

| Model | Input | Output | Deskripsi |
|-------|-------|--------|-----------|
| `glm-4.6v` | $0.3/MTok | $0.9/MTok | Flagship vision, 128K context, native function calling |
| `glm-4.6v-flashx` | $0.04/MTok | $0.4/MTok | Fast vision |
| `glm-4.6v-flash` | FREE | FREE | Free vision tier |
| `glm-ocr` | $0.03/MTok | $0.03/MTok | OCR specialist |
| `glm-4.5v` | $0.6/MTok | $1.8/MTok | Previous gen vision |
| `autoglm-phone-multilingual` | - | - | Phone automation |

### Image Generation

| Model | Price | Deskripsi |
|-------|-------|-----------|
| `glm-image` | $0.015/image | Flagship, autoregressive + diffusion |
| `cogview-4` | $0.01/image | Standard generation |

### Video Generation

| Model | Price | Deskripsi |
|-------|-------|-----------|
| `cogvideox-3` | $0.2/video | Text/Image to video, start-end frame |
| `viduq1-text` | $0.4/video | Text to video |
| `viduq1-image` | $0.4/video | Image to video |
| `vidu2-image` | $0.2/video | Vidu 2 image to video |
| `vidu2-start-end` | $0.2/video | Start-end frame |

### Audio Models

| Model | Price | Deskripsi |
|-------|-------|-----------|
| `glm-asr-2512` | $0.03/MTok | Speech-to-text, CER 0.0717 |

## Penggunaan Dasar

### OpenAI SDK Compatible (Recommended)

```python
from openai import OpenAI

# Create Z.AI client
client = OpenAI(
    api_key="your-zai-api-key",
    base_url="https://api.z.ai/api/paas/v4/"
)

# Basic chat
response = client.chat.completions.create(
    model="glm-5",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, please introduce yourself."}
    ]
)

print(response.choices[0].message.content)
```

### Streaming Response

```python
stream = client.chat.completions.create(
    model="glm-5",
    messages=[
        {"role": "user", "content": "Write a poem about AI"}
    ],
    stream=True,
    temperature=1.0
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### cURL

```bash
curl -X POST "https://api.z.ai/api/paas/v4/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_API_KEY" \
-d '{
    "model": "glm-5",
    "messages": [
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": "Hello, please introduce yourself."}
    ]
}'
```

## Thinking Mode

GLM-5 dan GLM-4.7 mendukung thinking mode untuk complex reasoning.

### Enable Thinking

```python
response = client.chat.completions.create(
    model="glm-5",
    messages=[
        {"role": "user", "content": "Solve this complex problem..."}
    ],
    stream=True,
    extra_body={
        "thinking": {
            "type": "enabled"
        }
    }
)

for chunk in response:
    if chunk.choices[0].delta.reasoning_content:
        print(chunk.choices[0].delta.reasoning_content, end='')  # Thinking
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end='')  # Response
```

### Disable Thinking

```python
response = client.chat.completions.create(
    model="glm-5",
    messages=[{"role": "user", "content": "Quick question"}],
    extra_body={
        "thinking": {
            "type": "disabled"
        }
    }
)
```

### Preserved Thinking (Coding Scenarios)

```python
response = client.chat.completions.create(
    model="glm-5",
    messages=messages,
    stream=True,
    extra_body={
        "thinking": {
            "type": "enabled",
            "clear_thinking": False  # Enable preserved thinking
        }
    }
)

# Must return reasoning_content in subsequent messages
messages.append({
    "role": "assistant",
    "content": content,
    "reasoning_content": reasoning  # Important!
})
```

## Vision (GLM-4.6V)

### Image Analysis

```python
response = client.chat.completions.create(
    model="glm-4.6v",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/image.png"
                    }
                },
                {
                    "type": "text",
                    "text": "What is in this image?"
                }
            ]
        }
    ],
    extra_body={
        "thinking": {"type": "enabled"}
    }
)
```

### Object Detection with Coordinates

```python
response = client.chat.completions.create(
    model="glm-4.6v",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": image_url}},
                {"type": "text", "text": "Find the object. Provide coordinates in [[xmin,ymin,xmax,ymax]] format"}
            ]
        }
    ]
)
```

## Function Calling

```python
import json

# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "City name, e.g.: Beijing, Shanghai"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# Call with tools
response = client.chat.completions.create(
    model="glm-5",
    messages=[
        {"role": "user", "content": "How's the weather in Beijing?"}
    ],
    tools=tools,
    tool_choice="auto"
)

# Handle tool calls
message = response.choices[0].message
if message.tool_calls:
    for tool_call in message.tool_calls:
        if tool_call.function.name == "get_weather":
            args = json.loads(tool_call.function.arguments)
            result = get_weather(args["city"])
            
            # Return result to model
            messages.append({
                "role": "tool",
                "content": json.dumps(result),
                "tool_call_id": tool_call.id
            })
```

## Image Generation

### GLM-Image

```python
response = client.images.generate(
    model="glm-image",
    prompt="A cute kitten sitting on a sunny windowsill",
    size="1280x1280"
)

print(response.data[0].url)  # Image URL
```

**Supported Sizes:** 1:1, 3:4, 4:3, 16:9
- 1280×1280, 1568×1056, 1056×1568, 1472×1088, 1088×1472, 1728×960, 960×1728
- Custom: 512-2048px, multiple of 32

### cURL

```bash
curl --request POST \
--url https://api.z.ai/api/paas/v4/images/generations \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "model": "glm-image",
    "prompt": "A beautiful sunset over mountains",
    "size": "1280x1280"
}'
```

## Video Generation (CogVideoX-3)

```python
from zai import ZaiClient

client = ZaiClient(api_key="your-api-key")

# Generate video
response = client.videos.generations(
    model="cogvideox-3",
    prompt="A cat is playing with a ball.",
    quality="quality",  # "quality" or "speed"
    with_audio=True,
    size="1920x1080",  # Up to 4K
    fps=30  # 30 or 60
)

# Get result
result = client.videos.retrieve_videos_result(id=response.id)
print(result)
```

## Speech-to-Text (GLM-ASR-2512)

```bash
curl --request POST \
    --url https://api.z.ai/api/paas/v4/audio/transcriptions \
    --header 'Authorization: Bearer API_Key' \
    --header 'Content-Type: multipart/form-data' \
    --form model=glm-asr-2512 \
    --form stream=false \
    --form file=@audio.mp3
```

**Features:**
- CER: 0.0717 (leading accuracy)
- Max duration: 30 seconds
- Max file size: 25 MB
- Languages: Chinese (Mandarin + dialects), English, French, German, Japanese, Korean, Spanish, Arabic, etc.

## Structured Output

```python
response = client.chat.completions.create(
    model="glm-5",
    messages=[
        {"role": "user", "content": "Extract user info: John is 25 years old"}
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "user_info",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "number"}
                },
                "required": ["name", "age"]
            }
        }
    }
)
```

## Web Search Tool

```python
response = client.chat.completions.create(
    model="glm-5",
    messages=[
        {"role": "user", "content": "What's the latest news today?"}
    ],
    tools=[{"type": "web_search"}]
)

# Cost: $0.01 per use
```

## Context Caching

```python
response = client.chat.completions.create(
    model="glm-5",
    messages=messages,
    extra_body={
        "cache": True
    }
)
```

**Cached Input Pricing:** 80% discount on input tokens

## Multi-turn Conversation

```python
class ChatBot:
    def __init__(self, api_key: str):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.z.ai/api/paas/v4/"
        )
        self.conversation = [
            {"role": "system", "content": "You are a helpful AI assistant"}
        ]
    
    def chat(self, user_input: str) -> str:
        self.conversation.append({"role": "user", "content": user_input})
        
        response = self.client.chat.completions.create(
            model="glm-5",
            messages=self.conversation
        )
        
        ai_response = response.choices[0].message.content
        self.conversation.append({"role": "assistant", "content": ai_response})
        
        return ai_response

bot = ChatBot("your-api-key")
print(bot.chat("Hello!"))
```

## Common Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | Required | Model name |
| `messages` | array | Required | Conversation messages |
| `temperature` | float | 0.6 | Randomness (0-1) |
| `top_p` | float | 0.95 | Nucleus sampling |
| `max_tokens` | int | - | Max output tokens |
| `stream` | bool | false | Streaming output |
| `stop` | string/array | - | Stop tokens |

## Script Helper

```bash
cd .pi/skills/zai && node scripts/chat.js "Your prompt here"
cd .pi/skills/zai && node scripts/chat.js --model=glm-4.7-flashx "Quick question"
cd .pi/skills/zai && node scripts/image.js "A sunset over mountains" --output=sunset.png
```

## Tips

1. **Pilih model yang tepat**: Gunakan `glm-5` untuk coding/agents, `glm-4.7-flashx` untuk tasks cepat
2. **Free tier**: `glm-4.7-flash` dan `glm-4.5-flash` gratis
3. **Coding endpoint**: Gunakan `https://api.z.ai/api/coding/paas/v4/` untuk coding scenarios
4. **Thinking mode**: Enable untuk complex reasoning, disable untuk quick responses
5. **Preserved thinking**: Aktifkan di coding scenarios untuk reasoning continuity
6. **Context caching**: Gunakan untuk conversations panjang (80% discount)
7. **Vision + Function calling**: GLM-4.6V mendukung native multimodal tool calling

## Migrasi dari OpenAI

```python
# Sebelum (OpenAI)
from openai import OpenAI
client = OpenAI(api_key="sk-...")

# Sesudah (Z.AI) - hanya ubah 2 baris
client = OpenAI(
    api_key="your-zai-api-key",
    base_url="https://api.z.ai/api/paas/v4/"
)

# Gunakan model Z.AI
response = client.chat.completions.create(
    model="glm-5",  # Ganti ke model Z.AI
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Referensi

- [Z.AI Platform](https://z.ai/model-api)
- [API Keys](https://z.ai/manage-apikey/apikey-list)
- [Billing](https://z.ai/manage-apikey/billing)
- [Python SDK GitHub](https://github.com/zai-org/z-ai-sdk-python)
- [Java SDK GitHub](https://github.com/zai-org/z-ai-sdk-java)
- [Discord](https://discord.gg/QR7SARHRxK)
