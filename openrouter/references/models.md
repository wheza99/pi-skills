# OpenRouter Models

## Models API

```bash
# Get all models
curl https://openrouter.ai/api/v1/models
```

## Response Schema

```typescript
{
  "data": [
    {
      "id": "google/gemini-2.5-pro-preview",
      "canonical_slug": "google/gemini-2.5-pro-preview",
      "name": "Google: Gemini 2.5 Pro Preview",
      "created": 1704067200,
      "description": "Most capable Gemini model...",
      "context_length": 1048576,
      "architecture": {
        "input_modalities": ["file", "image", "text"],
        "output_modalities": ["text"],
        "tokenizer": "Gemini",
        "instruct_type": null
      },
      "pricing": {
        "prompt": "0.00000125",
        "completion": "0.000005",
        "request": "0",
        "image": "0",
        "web_search": "0",
        "internal_reasoning": "0",
        "input_cache_read": "0",
        "input_cache_write": "0"
      },
      "top_provider": {
        "context_length": 1048576,
        "max_completion_tokens": 65536,
        "is_moderated": false
      },
      "supported_parameters": [
        "tools",
        "tool_choice",
        "max_tokens",
        "temperature",
        "top_p",
        "structured_outputs",
        "response_format"
      ]
    }
  ]
}
```

## Model Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for API requests |
| `canonical_slug` | string | Permanent slug that never changes |
| `name` | string | Human-readable display name |
| `created` | number | Unix timestamp when added |
| `description` | string | Detailed model description |
| `context_length` | number | Maximum context window in tokens |
| `architecture` | object | Technical capabilities |
| `pricing` | object | Price structure (USD per token) |
| `top_provider` | object | Primary provider config |
| `supported_parameters` | string[] | Supported API parameters |

## Architecture Object

```typescript
{
  "input_modalities": ["file", "image", "text"],
  "output_modalities": ["text"],
  "tokenizer": "GPT",
  "instruct_type": "chat" | null
}
```

## Pricing Object

All values in USD per token/request/unit:

```typescript
{
  "prompt": "0.00000125",        // Cost per input token
  "completion": "0.000005",      // Cost per output token
  "request": "0",                // Fixed cost per request
  "image": "0",                  // Cost per image input
  "web_search": "0",             // Cost per web search
  "internal_reasoning": "0",     // Cost for reasoning tokens
  "input_cache_read": "0",       // Cost per cached token read
  "input_cache_write": "0"       // Cost per cached token write
}
```

Value `"0"` means the feature is free.

## Supported Parameters

| Parameter | Description |
|-----------|-------------|
| `tools` | Function calling capabilities |
| `tool_choice` | Tool selection control |
| `max_tokens` | Response length limiting |
| `temperature` | Randomness control |
| `top_p` | Nucleus sampling |
| `reasoning` | Internal reasoning mode |
| `include_reasoning` | Include reasoning in response |
| `structured_outputs` | JSON schema enforcement |
| `response_format` | Output format specification |
| `stop` | Custom stop sequences |
| `frequency_penalty` | Repetition reduction |
| `presence_penalty` | Topic diversity |
| `seed` | Deterministic outputs |

## Popular Models

### OpenAI
| Model | Context | Description |
|-------|---------|-------------|
| `openai/gpt-4o` | 128k | GPT-4 Omni, multimodal |
| `openai/gpt-4o-mini` | 128k | Cheaper, faster GPT-4 |
| `openai/o1-preview` | 128k | Reasoning model |
| `openai/o1-mini` | 128k | Faster reasoning |

### Anthropic
| Model | Context | Description |
|-------|---------|-------------|
| `anthropic/claude-sonnet-4` | 200k | Latest Claude |
| `anthropic/claude-3.5-sonnet` | 200k | Claude 3.5 Sonnet |
| `anthropic/claude-3-opus` | 200k | Most capable Claude 3 |

### Google
| Model | Context | Description |
|-------|---------|-------------|
| `google/gemini-2.5-pro-preview` | 1M | Most capable Gemini |
| `google/gemini-2.5-flash` | 1M | Fast Gemini |
| `google/gemini-2.0-flash-exp` | 1M | Experimental |

### Meta
| Model | Context | Description |
|-------|---------|-------------|
| `meta-llama/llama-3.3-70b-instruct` | 128k | Llama 3.3 70B |
| `meta-llama/llama-3.2-90b-vision-instruct` | 128k | Vision capable |

### Open Source / Others
| Model | Context | Description |
|-------|---------|-------------|
| `deepseek/deepseek-r1` | 64k | DeepSeek R1 reasoning |
| `qwen/qwen-2.5-72b-instruct` | 128k | Qwen 2.5 72B |
| `mistralai/mistral-large` | 128k | Mistral Large |
| `cohere/command-r-plus` | 128k | Command R+ |

## Filtering Models

### By Provider
```
https://openrouter.ai/models?q=openai
```

### By Capability
```
# Tool calling support
https://openrouter.ai/models?supported_parameters=tools

# Vision support
https://openrouter.ai/models?supported_parameters=vision

# Free models
https://openrouter.ai/models?q=free
```

## Tokenization

Different models use different tokenizers:
- **GPT/Claude/Llama**: Tokenize by chunks of characters
- **PaLM**: Tokenize by character

Token counts (and costs) will vary between models even with the same input/output.

Use the `usage` field in responses to get actual token counts.

## RSS Feed

Stay updated on new models:
```
https://openrouter.ai/models.rss
```
