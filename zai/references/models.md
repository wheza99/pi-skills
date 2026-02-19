# Z.AI Models Reference

Dokumen ini berisi daftar lengkap model Z.AI yang tersedia via API.

## Text Models (LLM)

### Flagship Models

| Model | Context | Max Output | Input | Cached | Output | Best For |
|-------|---------|------------|-------|--------|--------|----------|
| `glm-5` | 200K | 128K | $1/MTok | $0.2/MTok | $3.2/MTok | Coding, agents, complex tasks |
| `glm-5-code` | - | - | $1.2/MTok | $0.3/MTok | $5/MTok | Agentic coding |
| `glm-4.7` | - | - | $0.6/MTok | $0.11/MTok | $2.2/MTok | Advanced reasoning |
| `glm-4.6` | - | - | $0.6/MTok | $0.11/MTok | $2.2/MTok | General purpose |

### Fast Models

| Model | Input | Cached | Output | Best For |
|-------|-------|--------|--------|----------|
| `glm-4.7-flashx` | $0.07/MTok | $0.01/MTok | $0.4/MTok | Fast, cost-efficient |
| `glm-4.5-air` | $0.2/MTok | $0.03/MTok | $1.1/MTok | Lightweight tasks |
| `glm-4.5-airx` | $1.1/MTok | $0.22/MTok | $4.5/MTok | Air extended |

### Extended Models

| Model | Input | Cached | Output | Best For |
|-------|-------|--------|--------|----------|
| `glm-4.5-x` | $2.2/MTok | $0.45/MTok | $8.9/MTok | Extended capabilities |
| `glm-4.5` | $0.6/MTok | $0.11/MTok | $2.2/MTok | Standard model |

### Free Models

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| `glm-4.7-flash` | FREE | FREE | Free tier |
| `glm-4.5-flash` | FREE | FREE | Free tier |

### Budget Models

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| `glm-4-32b-0414-128k` | $0.1/MTok | $0.1/MTok | Budget option |

## Vision Models (VLM)

### Flagship Vision

| Model | Context | Input | Cached | Output | Best For |
|-------|---------|-------|--------|--------|----------|
| `glm-4.6v` | 128K | $0.3/MTok | $0.05/MTok | $0.9/MTok | Vision + function calling |
| `glm-4.5v` | - | $0.6/MTok | $0.11/MTok | $1.8/MTok | Previous gen vision |

### Fast Vision

| Model | Input | Cached | Output | Best For |
|-------|-------|--------|--------|----------|
| `glm-4.6v-flashx` | $0.04/MTok | $0.004/MTok | $0.4/MTok | Fast vision |

### Free Vision

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| `glm-4.6v-flash` | FREE | FREE | Free vision tier |

### Specialized

| Model | Price | Best For |
|-------|-------|----------|
| `glm-ocr` | $0.03/MTok (in+out) | OCR, document understanding |
| `autoglm-phone-multilingual` | - | Phone automation |

## Image Generation Models

| Model | Price | Description |
|-------|-------|-------------|
| `glm-image` | $0.015/image | Flagship, autoregressive + diffusion, text rendering |
| `cogview-4` | $0.01/image | Standard generation |

### GLM-Image Features
- Hybrid architecture: 9B autoregressive + 7B DiT diffusion
- Excellent text rendering (SOTA on CVTG-2K, LongText-Bench)
- Resolutions: 1:1, 3:4, 4:3, 16:9
- Common: 1280×1280, 1568×1056, 1056×1568, 1472×1088, 1088×1472, 1728×960, 960×1728
- Custom: 512-2048px, multiple of 32

## Video Generation Models

| Model | Price | Description |
|-------|-------|-------------|
| `cogvideox-3` | $0.2/video | Text/Image to video, start-end frame |
| `viduq1-text` | $0.4/video | Text to video |
| `viduq1-image` | $0.4/video | Image to video |
| `viduq1-start-end` | $0.4/video | Start-end frame generation |
| `vidu2-image` | $0.2/video | Vidu 2 image to video |
| `vidu2-start-end` | $0.2/video | Vidu 2 start-end frame |
| `vidu2-reference` | $0.4/video | Vidu 2 reference |

### CogVideoX-3 Features
- Up to 4K resolution (3840x2160)
- FPS: 30 or 60
- Quality modes: "quality" or "speed"
- Audio generation supported
- Start and end frame generation

## Audio Models

| Model | Price | Description |
|-------|-------|-------------|
| `glm-asr-2512` | $0.03/MTok (~$0.0024/min) | Speech-to-text |

### GLM-ASR-2512 Features
- CER: 0.0717 (leading accuracy)
- Max duration: 30 seconds
- Max file size: 25 MB
- Languages: Chinese (Mandarin, Sichuanese, Cantonese, Min Nan, Wu), English (American, British), French, German, Japanese, Korean, Spanish, Arabic, etc.
- Custom dictionary support

## Built-in Tools

| Tool | Cost | Description |
|------|------|-------------|
| Web Search | $0.01/use | Search the web for information |

## Agents

| Agent | Price | Description |
|-------|-------|-------------|
| GLM Slide/Poster Agent (beta) | $0.7/MTok | Generate slides and posters |
| Translation Agent | $3/MTok | General-purpose translation |
| Video Effect Templates | $0.2/video | Popular special effects |

## Model Selection Guide

### By Use Case

| Use Case | Recommended Model |
|----------|-------------------|
| General chat | `glm-4.7-flashx` |
| Coding/Agents | `glm-5` or `glm-5-code` |
| Complex reasoning | `glm-5` with thinking enabled |
| Image analysis | `glm-4.6v` |
| OCR | `glm-ocr` |
| Image generation | `glm-image` |
| Video generation | `cogvideox-3` |
| Speech-to-text | `glm-asr-2512` |
| Budget/Testing | `glm-4.7-flash` (FREE) |
| Fast responses | `glm-4.7-flashx` |

### By Budget

| Budget | Text Model | Vision Model | Image Model |
|--------|------------|--------------|-------------|
| Free | `glm-4.7-flash` | `glm-4.6v-flash` | - |
| Low | `glm-4.7-flashx` | `glm-4.6v-flashx` | `cogview-4` |
| Medium | `glm-4.7` | `glm-4.6v` | `glm-image` |
| High | `glm-5` | `glm-4.6v` | `glm-image` |

## Model Capabilities Matrix

| Model | Thinking | Function Call | Streaming | Structured Output | Cache |
|-------|----------|---------------|-----------|-------------------|-------|
| glm-5 | ✅ | ✅ | ✅ | ✅ | ✅ |
| glm-5-code | ✅ | ✅ | ✅ | ✅ | ✅ |
| glm-4.7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| glm-4.7-flashx | ✅ | ✅ | ✅ | ✅ | ✅ |
| glm-4.6 | ✅ | ✅ | ✅ | ✅ | ✅ |
| glm-4.6v | ✅ | ✅ | ✅ | ✅ | ✅ |

## Thinking Mode Support

| Model | Default | Enabled | Disabled | Preserved | Turn-level |
|-------|---------|---------|----------|-----------|------------|
| glm-5 | On | ✅ | ✅ | ✅ | ✅ |
| glm-4.7 | On | ✅ | ✅ | ✅ | ✅ |
| glm-4.6 | Hybrid | ✅ | ✅ | ✅ | ✅ |
| glm-4.5 | Off | ✅ | - | - | - |

## API Endpoints

| Endpoint | Usage |
|----------|-------|
| `https://api.z.ai/api/paas/v4/` | Standard API for all use cases |
| `https://api.z.ai/api/coding/paas/v4/` | Coding Plan - optimized for coding scenarios |

**Note:** Coding endpoint has Preserved Thinking enabled by default for better coding performance.

## Context Limits

| Model | Context Length | Max Output |
|-------|----------------|------------|
| glm-5 | 200K | 128K |
| glm-4.6v | 128K | - |
| glm-4.6 | - | - |
| glm-4-32b-0414 | 128K | - |

## Checking Model Availability

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-zai-api-key",
    base_url="https://api.z.ai/api/paas/v4/"
)

models = client.models.list()
for model in models.data:
    print(model.id)
```
