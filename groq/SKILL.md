---
name: groq
description: Skill untuk menggunakan Groq API - LLM inference dengan kecepatan ultra-cepat. OpenAI-compatible API. Gunakan untuk text generation, speech-to-text, text-to-speech, tool use, dan AI agents.
---

# Groq API Skill

Groq menyediakan LLM inference dengan kecepatan ultra-cepat menggunakan LPU (Language Processing Unit). API-nya kompatibel dengan OpenAI, sehingga mudah diintegrasikan.

## Quick Start

### Setup API Key

1. Daftar di [console.groq.com](https://console.groq.com)
2. Buat API Key di [console.groq.com/keys](https://console.groq.com/keys)
3. Set environment variable:

```bash
export GROQ_API_KEY="your-api-key-here"
```

### Base URL

```
https://api.groq.com/openai/v1
```

### Python (OpenAI SDK)

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "user", "content": "Explain quantum computing in one sentence"}
    ]
)

print(response.choices[0].message.content)
```

### Python (Groq SDK)

```bash
pip install groq
```

```python
from groq import Groq

client = Groq()

chat_completion = client.chat.completions.create(
    messages=[
        {"role": "user", "content": "Explain the importance of fast LLM inference"}
    ],
    model="llama-3.3-70b-versatile",
)

print(chat_completion.choices[0].message.content)
```

### JavaScript/Node.js

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const response = await client.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);
```

### cURL

```bash
curl "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Models

### Text Generation Models

| Model | ID | Description |
|-------|-----|-------------|
| Llama 3.3 70B | `llama-3.3-70b-versatile` | Best balance of speed & quality |
| Llama 3.3 70B Specdec | `llama-3.3-70b-specdec` | Fastest with speculative decoding |
| Llama 3.1 8B | `llama-3.1-8b-instant` | Fastest, lightweight |
| Llama 3.2 1B | `llama-3.2-1b-preview` | Ultra-fast, smallest |
| Llama 3.2 3B | `llama-3.2-3b-preview` | Fast, compact |
| Llama 3.2 11B Vision | `llama-3.2-11b-vision-preview` | Multimodal (text + image) |
| Llama 3.2 90B Vision | `llama-3.2-90b-vision-preview` | Multimodal, high quality |
| Mixtral 8x7B | `mixtral-8x7b-32768` | MoE, 32K context |
| Gemma 2 9B | `gemma2-9b-it` | Google's Gemma |

### Speech-to-Text Models

| Model | ID | Description |
|-------|-----|-------------|
| Whisper Large v3 | `whisper-large-v3` | Best accuracy |
| Whisper Large v3 Turbo | `whisper-large-v3-turbo` | Faster transcription |

### Text-to-Speech Models

| Model | ID | Description |
|-------|-----|-------------|
| PlayAI TTS | `playai-tts` | Text to speech |
| Orpheus TTS | `orpheus-tts` | Expressive TTS |

## Text Generation

### Basic Chat

```python
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
)
```

### Streaming

```python
stream = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Write a short story"}],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### With Parameters

```python
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Generate creative ideas"}],
    temperature=0.7,        # 0-2, higher = more random
    max_tokens=1024,        # Max output tokens
    top_p=0.9,              # Nucleus sampling
    stop=["END", "\n\n"],   # Stop sequences
)
```

### JSON Mode

```python
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "List 3 fruits as JSON"}],
    response_format={"type": "json_object"},
)
```

## Speech to Text (Transcription)

```python
# From file
with open("audio.mp3", "rb") as audio_file:
    transcription = client.audio.transcriptions.create(
        model="whisper-large-v3",
        file=audio_file,
        response_format="json",  # json, text, srt, vtt
    )
    print(transcription.text)

# With translation to English
with open("audio.mp3", "rb") as audio_file:
    translation = client.audio.translations.create(
        model="whisper-large-v3",
        file=audio_file,
    )
    print(translation.text)
```

## Text to Speech

```python
response = client.audio.speech.create(
    model="playai-tts",
    voice="Fritz-PlayAI",  # Available voices
    input="Hello, this is a test.",
    response_format="wav",  # wav, mp3, pcm
)

# Save to file
with open("output.wav", "wb") as f:
    f.write(response.content)
```

## Vision (Image Recognition)

```python
import base64

# From URL
response = client.chat.completions.create(
    model="llama-3.2-11b-vision-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
            ]
        }
    ]
)

# From base64
with open("image.jpg", "rb") as f:
    image_base64 = base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="llama-3.2-11b-vision-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image"},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
            ]
        }
    ]
)
```

## Tool Use (Function Calling)

### Define Tools

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name"
                    }
                },
                "required": ["location"]
            }
        }
    }
]
```

### Use Tools

```python
def get_weather(location):
    # Your weather API logic here
    return {"temperature": 22, "condition": "sunny"}

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools,
    tool_choice="auto",
)

# Check if model wants to call a tool
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    function_name = tool_call.function.name
    arguments = json.loads(tool_call.function.arguments)
    
    # Execute the function
    result = get_weather(arguments["location"])
    
    # Continue conversation with function result
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": "What's the weather in Tokyo?"},
            response.choices[0].message,  # Model's tool call
            {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result)
            }
        ]
    )
```

## Built-in Tools (Groq)

Groq menyediakan built-in tools yang sudah terintegrasi:

### Web Search

```python
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "What are the latest AI news today?"}],
    tools=[{"type": "web_search"}],
)
```

### Code Execution

```python
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Calculate fibonacci of 100"}],
    tools=[{"type": "code_execution"}],
)
```

### Browser Automation

```python
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Go to example.com and get the title"}],
    tools=[{"type": "browser_automation"}],
)
```

## Structured Outputs

```python
from pydantic import BaseModel

class Person(BaseModel):
    name: str
    age: int
    city: str

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Generate info about a random person"}],
    response_format=Person,  # Pydantic model
)
```

## Prompt Caching

Aktifkan prompt caching untuk menghemat token pada prompt yang berulang:

```python
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": "Long system prompt..." * 100},
        {"role": "user", "content": "Hello"}
    ],
)
```

## Rate Limits

Rate limits berbeda per model dan tier. Lihat [console.groq.com/docs/rate-limits](https://console.groq.com/docs/rate-limits) untuk detail.

### Handling Rate Limits

```python
import time
from openai import RateLimitError

try:
    response = client.chat.completions.create(...)
except RateLimitError as e:
    wait_time = int(e.response.headers.get("retry-after", 60))
    time.sleep(wait_time)
    # Retry
```

## Responses API (New)

API baru yang lebih sederhana untuk responses:

```python
response = client.responses.create(
    input="Explain the importance of fast language models",
    model="llama-3.3-70b-versatile",
)
print(response.output_text)
```

## Reasoning Models

```python
response = client.chat.completions.create(
    model="deepseek-r1-distill-llama-70b",
    messages=[{"role": "user", "content": "Solve this puzzle: ..."}],
)
```

## Service Tiers

| Tier | Description |
|------|-------------|
| Free | Untuk testing dan development |
| Performance | Latensi terendah, untuk produksi |
| Flex | Lebih murah, latensi bervariasi |
| Batch | Pemrosesan batch asynchronous |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad request - invalid parameters |
| 401 | Unauthorized - invalid API key |
| 403 | Forbidden - insufficient permissions |
| 404 | Not found - model/endpoint not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

## Best Practices

1. **Streaming**: Gunakan streaming untuk response yang panjang
2. **Temperature**: 0.1-0.3 untuk factual, 0.7-1.0 untuk creative
3. **System Prompt**: Letakkan instruksi di system message
4. **Context**: Llama models mendukung 128K context
5. **Caching**: Manfaatkan prompt caching untuk prompt berulang
6. **Error Handling**: Selalu handle rate limits dan errors

## Resources

- [Official Docs](https://console.groq.com/docs)
- [API Reference](https://console.groq.com/docs/api-reference)
- [Models](https://console.groq.com/docs/models)
- [Cookbook](https://github.com/groq/groq-api-cookbook)
- [Community](https://community.groq.com/)
- [OpenBench](https://openbench.dev/)
