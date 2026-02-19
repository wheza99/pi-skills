# Gemini Image Generation (Nano Banana)

## Overview

Nano Banana adalah nama untuk kemampuan image generation native Gemini. Terdapat dua model:

- **Nano Banana** (`gemini-2.5-flash-image`) - Cepat & efisien, 1024px
- **Nano Banana Pro** (`gemini-3-pro-image-preview`) - Professional, up to 4K, dengan Google Search grounding

Semua gambar yang dihasilkan memiliki SynthID watermark.

## Text-to-Image

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=["A cute cat wearing a space suit"],
    config=types.GenerateContentConfig(
        image_config=types.ImageConfig(
            aspect_ratio="16:9"
        )
    )
)

for part in response.parts:
    if part.inline_data is not None:
        image = part.as_image()
        image.save("generated.png")
```

## Image Editing

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

## Multi-turn Image Editing

```python
from google import genai
from google.genai import types

client = genai.Client()

chat = client.chats.create(
    model="gemini-3-pro-image-preview",
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE']
    )
)

# First generation
response = chat.send_message("Create an infographic about photosynthesis")
for part in response.parts:
    if part.inline_data is not None:
        part.as_image().save("photosynthesis.png")

# Edit in same chat
response = chat.send_message("Change the text to Spanish")
for part in response.parts:
    if part.inline_data is not None:
        part.as_image().save("photosynthesis_spanish.png")
```

## High Resolution (4K)

```python
from google import genai
from google.genai import types

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=["A detailed anatomical sketch of a butterfly"],
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE'],
        image_config=types.ImageConfig(
            aspect_ratio="1:1",
            image_size="4K"  # 1K, 2K, or 4K
        )
    )
)
```

## Google Search Grounding

```python
from google import genai
from google.genai import types

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents="Visualize the current weather forecast for San Francisco",
    config=types.GenerateContentConfig(
        response_modalities=['Text', 'Image'],
        image_config=types.ImageConfig(aspect_ratio="16:9"),
        tools=[{"google_search": {}}]
    )
)
```

## Multiple Reference Images (Gemini 3 Pro)

Up to 14 reference images:

```python
from google import genai
from google.genai import types
from PIL import Image

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=[
        "An office group photo of these people",
        Image.open('person1.png'),
        Image.open('person2.png'),
        Image.open('person3.png'),
        Image.open('person4.png'),
        Image.open('person5.png'),
    ],
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE'],
        image_config=types.ImageConfig(
            aspect_ratio="5:4",
            image_size="2K"
        )
    )
)
```

## Aspect Ratios

| Ratio | Gemini 2.5 Flash | Gemini 3 Pro |
|-------|------------------|--------------|
| 1:1 | 1024x1024 | 1024-4096 |
| 2:3 | 832x1248 | 848-3392 |
| 3:2 | 1248x832 | 1264-5056 |
| 3:4 | 864x1184 | 896-3584 |
| 4:3 | 1184x864 | 1200-4800 |
| 4:5 | 896x1152 | 928-3712 |
| 5:4 | 1152x896 | 1152-4608 |
| 9:16 | 768x1344 | 768-3072 |
| 16:9 | 1344x768 | 1376-5504 |
| 21:9 | 1536x672 | 1584-6336 |

## Prompting Guide

### 1. Photorealistic

```
A photorealistic close-up portrait of an elderly Japanese ceramicist,
illuminated by soft natural window light, creating a contemplative mood.
Captured with 85mm lens, emphasizing weathered hands and focused expression.
16:9 aspect ratio.
```

### 2. Stylized Illustrations

```
A kawaii-style sticker of a happy red panda, featuring rounded shapes
and a pastel color palette. Clean line art with soft cel shading.
Transparent background.
```

### 3. Text in Images

```
Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'
with the text "EST. 2024" in an elegant serif font. Warm brown tones.
```

### 4. Product Mockups

```
A high-resolution, studio-lit product photograph of a minimalist ceramic
coffee mug on a white marble surface. Three-point softbox lighting.
Sharp focus on the glaze texture. 16:9 aspect ratio.
```

### 5. Sequential Art

```
Make a 3 panel comic in a gritty noir art style. A detective discovers
a clue in panel 1, investigates in panel 2, and has a revelation in panel 3.
```

### 6. Inpainting (Semantic Masking)

```
Using the provided image of a living room, change only the blue sofa
to a vintage brown leather chesterfield. Keep everything else exactly the same.
```

### 7. Style Transfer

```
Transform this photograph of a city street into the style of Van Gogh's
Starry Night. Preserve the composition but render with swirling brushstrokes.
```

## Response Modalities

```python
# Text and Image (default)
config = types.GenerateContentConfig(
    response_modalities=['TEXT', 'IMAGE']
)

# Image only
config = types.GenerateContentConfig(
    response_modalities=['IMAGE']
)
```

## Thought Signatures

Untuk multi-turn image editing, thought signatures diperlukan:

```python
# Rules:
# 1. All image parts have thought_signature
# 2. First non-thought text part has signature
# 3. Thought images don't have signatures

# The SDK handles this automatically when using chat
```

## Model Selection

| Use Case | Model |
|----------|-------|
| Fast generation | gemini-2.5-flash-image |
| Professional assets | gemini-3-pro-image-preview |
| Google Search grounding | gemini-3-pro-image-preview |
| 4K resolution | gemini-3-pro-image-preview |
| Up to 14 reference images | gemini-3-pro-image-preview |

## Limitations

- Best languages: EN, ar-EG, de-DE, es-MX, fr-FR, hi-IN, id-ID, it-IT, ja-JP, ko-KR, pt-BR, ru-RU, ua-UA, vi-VN, zh-CN
- No audio or video inputs
- gemini-2.5-flash-image: max 3 input images
- gemini-3-pro-image-preview: up to 14 input images
- All images have SynthID watermark
- Text generation works better if you generate text first, then ask for image
