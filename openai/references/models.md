# OpenAI Models Reference

Dokumen ini berisi daftar lengkap model OpenAI yang tersedia via API.

## Frontier Models

Model paling advanced, direkomendasikan untuk sebagian besar tasks.

### GPT-5 Family

| Model | Deskripsi | Best For |
|-------|-----------|----------|
| `gpt-5.2` | Model terbaik untuk coding dan agentic tasks | Coding, agents, complex tasks |
| `gpt-5-mini` | Versi lebih cepat dan cost-efficient | Well-defined tasks, high volume |
| `gpt-5-nano` | Tercepat dan paling cost-efficient | Simple tasks, real-time apps |
| `gpt-5.2-pro` | Versi GPT-5.2 dengan respons lebih presisi | High-stakes decisions |
| `gpt-5` | Model reasoning dengan configurable effort | Complex reasoning, analysis |
| `gpt-5.1` | Previous generation dengan reasoning | General purpose |

### GPT-4.1 Family

| Model | Deskripsi | Best For |
|-------|-----------|----------|
| `gpt-4.1` | Smartest non-reasoning model | Fast, intelligent responses |
| `gpt-4.1-mini` | Versi lebih kecil dan cepat | Cost-sensitive apps |
| `gpt-4.1-nano` | Tercepat di keluarga GPT-4.1 | High-speed, low-cost |

## Reasoning Models (o-series)

Model yang dioptimasi untuk complex reasoning tasks.

| Model | Deskripsi | Best For |
|-------|-----------|----------|
| `o3` | Reasoning model untuk complex tasks | Math, science, complex analysis |
| `o4-mini` | Fast, cost-efficient reasoning | Quick reasoning tasks |
| `o3-pro` | Versi o3 dengan lebih banyak compute | Critical reasoning tasks |
| `o3-mini` | Small model alternative ke o3 | Budget reasoning |

## Codex Models

Model yang dioptimasi untuk coding dan agentic tasks.

| Model | Deskripsi |
|-------|-----------|
| `gpt-5.2-codex` | Most intelligent coding model |
| `gpt-5.1-codex` | Optimized for agentic coding |
| `gpt-5.1-codex-max` | Untuk long running tasks |
| `gpt-5-codex` | GPT-5 optimized for Codex |

## Open-Weight Models

Model dengan lisensi Apache 2.0 yang bisa dijalankan sendiri.

| Model | Deskripsi | Requirements |
|-------|-----------|--------------|
| `gpt-oss-120b` | Most powerful open-weight | Fits in H100 GPU |
| `gpt-oss-20b` | Medium-sized open-weight | Lower latency, smaller GPU |

## Image Generation

### GPT Image Family

| Model | Deskripsi | Best For |
|-------|-----------|----------|
| `gpt-image-1.5` | State-of-the-art image generation | High-quality images |
| `gpt-image-1` | Previous generation | General image generation |
| `gpt-image-1-mini` | Cost-efficient version | High volume, budget apps |
| `chatgpt-image-latest` | Model yang digunakan di ChatGPT | ChatGPT-like experience |

### DALL-E (Deprecated)

| Model | Status |
|-------|--------|
| `dall-e-3` | Deprecated |
| `dall-e-2` | Deprecated |

## Video Generation

| Model | Deskripsi | Features |
|-------|-----------|----------|
| `sora-2` | Flagship video generation | Synced audio |
| `sora-2-pro` | Most advanced video generation | Best quality synced audio |

## Deep Research

| Model | Deskripsi |
|-------|-----------|
| `o3-deep-research` | Most powerful deep research |
| `o4-mini-deep-research` | Faster, more affordable |

## Audio Models

### Text-to-Speech

| Model | Deskripsi |
|-------|-----------|
| `gpt-4o-mini-tts` | Text-to-speech powered by GPT-4o mini |
| `tts-1` | Optimized for speed |
| `tts-1-hd` | Optimized for quality |

### Speech-to-Text

| Model | Deskripsi |
|-------|-----------|
| `gpt-4o-transcribe` | Speech-to-text by GPT-4o |
| `gpt-4o-mini-transcribe` | Smaller STT model |
| `gpt-4o-transcribe-diarize` | Identifies different speakers |
| `whisper` | General-purpose speech recognition |

## Realtime Models

| Model | Deskripsi |
|-------|-----------|
| `gpt-realtime` | Realtime text dan audio I/O |
| `gpt-realtime-mini` | Cost-efficient realtime |
| `gpt-audio` | Audio I/O dengan Chat Completions |
| `gpt-audio-mini` | Smaller audio model |

## Embeddings

| Model | Deskripsi | Dimensions |
|-------|-----------|------------|
| `text-embedding-3-large` | Most capable | 3072 |
| `text-embedding-3-small` | Smaller, faster | 1536 |
| `text-embedding-ada-002` | Older model | 1536 |

## Moderation

| Model | Deskripsi |
|-------|-----------|
| `omni-moderation` | Text dan image moderation |
| `text-moderation` | Deprecated, text-only |
| `text-moderation-stable` | Deprecated |

## Computer Use

| Model | Deskripsi |
|-------|-----------|
| `computer-use-preview` | Specialized for computer use tool |

## Search Models

| Model | Deskripsi |
|-------|-----------|
| `gpt-4o-search-preview` | GPT model for web search |
| `gpt-4o-mini-search-preview` | Smaller search model |

## ChatGPT Models (Not Recommended for API)

Model yang digunakan di ChatGPT, tidak direkomendasikan untuk API use.

| Model | Deskripsi |
|-------|-----------|
| `gpt-5.2-chat` | GPT-5.2 in ChatGPT |
| `gpt-5.1-chat` | GPT-5.1 in ChatGPT |
| `gpt-5-chat` | GPT-5 in ChatGPT |
| `chatgpt-4o` | Deprecated |

## Deprecated Models

Model berikut sudah deprecated dan tidak disarankan untuk penggunaan baru:

- `gpt-4.5-preview`
- `gpt-4-turbo-preview`
- `gpt-4-turbo`
- `gpt-4`
- `gpt-3.5-turbo`
- `dall-e-2`, `dall-e-3`
- `o1`, `o1-mini`, `o1-preview`
- `babbage-002`, `davinci-002`

## Model Selection Guide

### By Use Case

| Use Case | Recommended Model |
|----------|-------------------|
| General chat | `gpt-5-mini` atau `gpt-4.1-mini` |
| Coding | `gpt-5.2` atau `gpt-5.2-codex` |
| Complex reasoning | `gpt-5` dengan `reasoning.effort: "high"` |
| High volume, low cost | `gpt-5-nano` atau `gpt-4.1-nano` |
| Image generation | `gpt-image-1.5` |
| Video generation | `sora-2` |
| Text-to-speech | `gpt-4o-mini-tts` |
| Speech-to-text | `gpt-4o-transcribe` |
| Embeddings | `text-embedding-3-large` |
| Realtime audio | `gpt-realtime` |
| Web search | `gpt-4o-search-preview` |

### By Budget

| Budget | Text Model | Image Model |
|--------|------------|-------------|
| Low | `gpt-5-nano` | `gpt-image-1-mini` |
| Medium | `gpt-5-mini` | `gpt-image-1` |
| High | `gpt-5.2` | `gpt-image-1.5` |

## Model Naming Convention

- **No suffix**: Base model (e.g., `gpt-5`)
- **`-mini`**: Smaller, faster, cheaper
- **`-nano`**: Smallest, fastest, cheapest
- **`-pro`**: More compute for better responses
- **`-codex`**: Optimized for coding
- **`-chat`**: Used in ChatGPT (avoid for API)
- **`-transcribe`**: Speech-to-text
- **`-tts`**: Text-to-speech
- **`-search-preview`**: For web search

## Rate Limits & Pricing

Rate limits dan pricing bervariasi per model. Lihat:
- [Pricing page](https://developers.openai.com/api/docs/pricing)
- [Rate limits guide](https://developers.openai.com/api/docs/guides/rate-limits)

## Checking Model Availability

```javascript
const models = await client.models.list();
console.log(models.data.map(m => m.id));
```
