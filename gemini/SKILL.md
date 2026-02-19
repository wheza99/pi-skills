---
name: gemini
description: Skill untuk menggunakan Google Gemini API - akses ke model AI Gemini 3 Pro, Gemini 3 Flash, Gemini 2.5, Nano Banana (image generation), Veo (video), embeddings, function calling, structured outputs, Live API untuk real-time voice/video, dan fitur thinking/reasoning.
---

# Gemini API

Google Gemini API memberikan akses ke model AI paling canggih dari Google termasuk Gemini 3 Pro (model paling cerdas), Gemini 3 Flash (cepat & efisien), Nano Banana untuk image generation, Veo untuk video generation, dan banyak lagi.

## Setup

### 1. Dapatkan API Key

Kunjungi [Google AI Studio](https://aistudio.google.com/apikey) untuk membuat API key gratis.

### 2. Set Environment Variable

```bash
export GEMINI_API_KEY="your-api-key"
```

### 3. Install SDK

```bash
pip install -q -U google-genai
```

## Quickstart

```python
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Explain how AI works in a few words"
)

print(response.text)
```

## Models

| Model | Description | Best For |
|-------|-------------|----------|
| `gemini-3-pro-preview` | Paling cerdas, reasoning terbaik | Tugas kompleks, coding, math |
| `gemini-3-flash-preview` | Cepat & efisien | High-volume, low-latency |
| `gemini-2.5-flash` | Price-performance terbaik | Scale processing, agents |
| `gemini-2.5-pro` | Advanced thinking model | Complex reasoning, analysis |
| `gemini-2.5-flash-image` | Image generation (Nano Banana) | Generate & edit images |
| `gemini-3-pro-image-preview` | Pro image generation | Professional assets, 4K |
| `gemini-embedding-001` | Text embeddings | RAG, semantic search |

## Penggunaan

### Text Generation

```bash
cd .pi/skills/gemini && python scripts/chat.py "Your prompt here"
```

**Options:**
- `--model=<name>`: Model ID (default: gemini-3-flash-preview)
- `--stream`: Enable streaming
- `--system=<text>`: System instruction
- `--temperature=<n>`: Temperature (0-2)
- `--max-tokens=<n>`: Max output tokens

### Streaming

```python
from google import genai

client = genai.Client()

response = client.models.generate_content_stream(
    model="gemini-3-flash-preview",
    contents=["Explain how AI works"]
)
for chunk in response:
    print(chunk.text, end="")
```

### Multi-turn Chat

```python
from google import genai

client = genai.Client()
chat = client.chats.create(model="gemini-3-flash-preview")

response = chat.send_message("I have 2 dogs in my house.")
print(response.text)

response = chat.send_message("How many paws are in my house?")
print(response.text)
```

### System Instructions

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    config=types.GenerateContentConfig(
        system_instruction="You are a cat. Your name is Neko."
    ),
    contents="Hello there"
)
print(response.text)
```

## Fitur Utama

### 1. Thinking (Reasoning)

Gemini 3 & 2.5 memiliki kemampuan "thinking" untuk reasoning yang lebih baik:

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="What is the sum of the first 50 prime numbers?",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_level="high",  # minimal, low, medium, high
            include_thoughts=True
        )
    )
)

for part in response.candidates[0].content.parts:
    if part.thought:
        print("Thought:", part.text)
    else:
        print("Answer:", part.text)
```

### 2. Function Calling

```python
from google import genai
from google.genai import types

# Define function
get_weather_declaration = {
    "name": "get_weather",
    "description": "Gets the current weather for a location",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The city and state, e.g., San Francisco, CA"
            }
        },
        "required": ["location"]
    }
}

client = genai.Client()
tools = types.Tool(function_declarations=[get_weather_declaration])
config = types.GenerateContentConfig(tools=[tools])

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="What's the weather in Tokyo?",
    config=config
)

# Check for function call
if response.candidates[0].content.parts[0].function_call:
    fc = response.candidates[0].content.parts[0].function_call
    print(f"Call: {fc.name}({fc.args})")
```

### 3. Structured Outputs

```python
from google import genai
from pydantic import BaseModel
from typing import List

class Recipe(BaseModel):
    recipe_name: str
    ingredients: List[str]
    instructions: List[str]

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Extract recipe for chocolate chip cookies",
    config={
        "response_mime_type": "application/json",
        "response_json_schema": Recipe.model_json_schema()
    }
)

recipe = Recipe.model_validate_json(response.text)
print(recipe)
```

### 4. Image Generation (Nano Banana)

```bash
cd .pi/skills/gemini && python scripts/image-gen.py "A cute cat in space"
```

```python
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=["Create a picture of a nano banana dish"],
    config=types.GenerateContentConfig(
        image_config=types.ImageConfig(
            aspect_ratio="16:9",  # 1:1, 16:9, 9:16, etc.
        )
    )
)

for part in response.parts:
    if part.inline_data is not None:
        image = part.as_image()
        image.save("generated.png")
```

### 5. Image Editing

```python
from google import genai
from PIL import Image

client = genai.Client()

image = Image.open("cat.png")
prompt = "Add a wizard hat to this cat"

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt, image]
)

for part in response.parts:
    if part.inline_data is not None:
        part.as_image().save("edited.png")
```

### 6. Embeddings

```bash
cd .pi/skills/gemini && python scripts/embed.py "What is the meaning of life?"
```

```python
from google import genai
from google.genai import types

client = genai.Client()

result = client.models.embed_content(
    model="gemini-embedding-001",
    contents=["What is the meaning of life?"],
    config=types.EmbedContentConfig(
        task_type="SEMANTIC_SIMILARITY",
        output_dimensionality=768
    )
)

print(result.embeddings[0].values[:10])  # First 10 values
```

### 7. Multimodal (Vision)

```python
from google import genai
from PIL import Image

client = genai.Client()

image = Image.open("photo.jpg")
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=[image, "What's in this image?"]
)
print(response.text)
```

### 8. Live API (Real-time Voice)

```bash
cd .pi/skills/gemini && python scripts/live-audio.py
```

```python
import asyncio
from google import genai

client = genai.Client()

async def run():
    async with client.aio.live.connect(
        model="gemini-2.5-flash-native-audio-preview",
        config={"response_modalities": ["AUDIO"]}
    ) as session:
        # Send audio/text and receive responses
        await session.send_realtime_input(
            audio={"data": audio_bytes, "mime_type": "audio/pcm"}
        )
        async for response in session.receive():
            # Handle response
            pass

asyncio.run(run())
```

## Scripts

### Chat
```bash
python scripts/chat.py "Your prompt" --model="gemini-3-flash-preview"
```

### Image Generation
```bash
python scripts/image-gen.py "A futuristic city" --aspect="16:9" --output="city.png"
```

### Embeddings
```bash
python scripts/embed.py "Text to embed" --dimension=768
```

### Function Calling Demo
```bash
python scripts/function-call.py "What's the weather in Tokyo?"
```

### Structured Output
```bash
python scripts/structured.py "Extract recipe from: ..."
```

## Tools & Agents

Gemini mendukung berbagai built-in tools:

### Google Search Grounding

```python
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Latest news about AI",
    config=types.GenerateContentConfig(
        tools=[{"google_search": {}}]
    )
)
```

### Code Execution

```python
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Calculate fibonacci of 50",
    config=types.GenerateContentConfig(
        tools=[{"code_execution": {}}]
    )
)
```

### URL Context

```python
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Summarize this page",
    config=types.GenerateContentConfig(
        tools=[{"url_context": {}}]
    )
)
```

## Thinking Levels (Gemini 3)

| Level | Gemini 3 Pro | Gemini 3 Flash | Description |
|-------|--------------|----------------|-------------|
| `minimal` | ❌ | ✅ | Minimal latency, minimal thinking |
| `low` | ✅ | ✅ | Minimizes latency and cost |
| `medium` | ❌ | ✅ | Balanced thinking |
| `high` | ✅ (default) | ✅ (default) | Maximum reasoning depth |

## Best Practices

1. **Temperature**: Gunakan temperature default 1.0 untuk Gemini 3
2. **Thinking**: Gunakan thinking level `high` untuk tugas kompleks
3. **Streaming**: Gunakan streaming untuk UX yang lebih baik
4. **System Instructions**: Berikan konteks yang jelas
5. **Function Descriptions**: Jelaskan fungsi dengan detail

## Limits & Pricing

- Free tier tersedia dengan rate limits
- Lihat [pricing page](https://ai.google.dev/gemini-api/docs/pricing) untuk detail
- Gemini 3 Pro: Rate limit lebih ketat di preview
- Embeddings: 2048 token input limit

## Referensi

- [API Reference](references/api-reference.md) - Detail API lengkap
- [Function Calling](references/function-calling.md) - Panduan function calling
- [Structured Outputs](references/structured-outputs.md) - Panduan JSON schema
- [Image Generation](references/image-generation.md) - Panduan Nano Banana
- [Thinking](references/thinking.md) - Panduan reasoning

## Links

- [Google AI Studio](https://aistudio.google.com/)
- [API Keys](https://aistudio.google.com/apikey)
- [Cookbook](https://github.com/google-gemini/cookbook)
- [API Reference](https://ai.google.dev/api)
- [Community](https://discuss.ai.google.dev/c/gemini-api/)
