---
name: claude
description: Skill untuk menggunakan Anthropic Claude API - akses ke Claude Opus 4.6 (paling cerdas), Claude Sonnet 4.6 (cepat & cerdas), Claude Haiku 4.5 (tercepat), dengan extended thinking, adaptive thinking, tool use, structured outputs, vision, prompt caching, dan fitur agentic.
---

# Claude API

Claude adalah keluarga large language models dari Anthropic. Claude 4.6 menawarkan performa terbaik untuk coding, reasoning, dan tugas kompleks.

## Setup

### 1. Dapatkan API Key

Kunjungi [Claude Console](https://console.claude.com/) untuk membuat API key.

### 2. Set Environment Variable

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

### 3. Install SDK

```bash
pip install anthropic
```

## Quickstart

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)

print(response.content[0].text)
```

## Models

| Model | ID | Best For | Pricing (per MTok) |
|-------|-----|----------|-------------------|
| **Opus 4.6** | `claude-opus-4-6` | Most complex tasks, agents, coding | $5 input / $25 output |
| **Sonnet 4.6** | `claude-sonnet-4-6` | Best balance of speed & intelligence | $3 input / $15 output |
| **Haiku 4.5** | `claude-haiku-4-5-20251001` | Fastest, near-frontier intelligence | $1 input / $5 output |

### Model Capabilities

| Feature | Opus 4.6 | Sonnet 4.6 | Haiku 4.5 |
|---------|----------|------------|-----------|
| Context Window | 200K / 1M (beta) | 200K / 1M (beta) | 200K |
| Max Output | 128K | 64K | 64K |
| Extended Thinking | ✅ | ✅ | ✅ |
| Adaptive Thinking | ✅ | ✅ | ❌ |
| Vision | ✅ | ✅ | ✅ |

## Penggunaan

### Basic Chat

```bash
cd .pi/skills/claude && python scripts/chat.py "Your prompt here"
```

**Options:**
- `--model=<id>`: Model ID (default: claude-sonnet-4-6)
- `--system=<text>`: System prompt
- `--max-tokens=<n>`: Max output tokens
- `--stream`: Enable streaming

### Streaming

```python
from anthropic import Anthropic

client = Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### System Prompt

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a helpful coding assistant.",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Fitur Utama

### 1. Extended Thinking

Claude dapat "berpikir" sebelum menjawab untuk reasoning yang lebih baik:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "Solve this complex problem..."}]
)

for block in response.content:
    if block.type == "thinking":
        print(f"Thinking: {block.thinking}")
    elif block.type == "text":
        print(f"Answer: {block.text}")
```

### 2. Adaptive Thinking (Recommended)

Untuk Claude Opus 4.6 dan Sonnet 4.6, gunakan adaptive thinking:

```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},  # low, medium, high, max
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)
```

**Effort Levels:**
| Level | Behavior |
|-------|----------|
| `max` | Always thinks, no constraints (Opus 4.6 only) |
| `high` | Always thinks, deep reasoning (default) |
| `medium` | Moderate thinking, may skip for simple queries |
| `low` | Minimizes thinking, prioritizes speed |

### 3. Tool Use

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "City and state"}
                },
                "required": ["location"]
            }
        }
    ],
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)

# Check for tool use
for block in response.content:
    if block.type == "tool_use":
        print(f"Tool: {block.name}")
        print(f"Input: {block.input}")
```

### 4. Structured Outputs

```python
from pydantic import BaseModel

class Person(BaseModel):
    name: str
    age: int
    occupation: str

response = client.messages.parse(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Extract: John is 30, a software engineer"}],
    output_format=Person
)

print(response.parsed_output)  # Person object
```

### 5. Vision (Image Understanding)

```python
import base64

# Read image
with open("image.jpg", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": image_data
                    }
                },
                {"type": "text", "text": "Describe this image"}
            ]
        }
    ]
)
```

### 6. Prompt Caching

Cache expensive prompts untuk menghemat biaya:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant..."
        },
        {
            "type": "text",
            "text": "<large document content>",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": "Question about the document"}]
)

# Check cache usage
print(f"Cache read: {response.usage.cache_read_input_tokens}")
print(f"Cache created: {response.usage.cache_creation_input_tokens}")
```

## Scripts

### Chat
```bash
python scripts/chat.py "Your prompt" --model="claude-sonnet-4-6"
```

### With Thinking
```bash
python scripts/chat.py "Complex problem..." --thinking --budget=10000
```

### Vision
```bash
python scripts/vision.py image.jpg "Describe this image"
```

### Tool Use Demo
```bash
python scripts/tool-use.py "What's the weather in Tokyo?"
```

### Structured Output
```bash
python scripts/structured.py "Extract info from..." --schema="person"
```

## Tool Choice Options

```python
# Auto (default) - Claude decides
tool_choice = {"type": "auto"}

# Any - Must use a tool
tool_choice = {"type": "any"}

# Specific tool
tool_choice = {"type": "tool", "name": "get_weather"}

# None - No tools
tool_choice = {"type": "none"}
```

## Prompt Caching Pricing

| Model | Base Input | Cache Write (5m) | Cache Read |
|-------|------------|------------------|------------|
| Opus 4.6 | $5/MTok | $6.25/MTok | $0.50/MTok |
| Sonnet 4.6 | $3/MTok | $3.75/MTok | $0.30/MTok |
| Haiku 4.5 | $1/MTok | $1.25/MTok | $0.10/MTok |

## Best Practices

### 1. Prompt Engineering

```python
# Use XML tags for structure
system = """
<instructions>
You are a helpful assistant.
</instructions>

<context>
<document>
{{content}}
</document>
</context>
"""
```

### 2. Tool Descriptions

```python
# Be extremely detailed
tools = [{
    "name": "search_database",
    "description": """
    Searches the company database for customer information.
    Use this tool when you need to find customer details, order history,
    or account status. Returns customer name, email, and recent orders.
    The query parameter should be a natural language search term.
    """,
    "input_schema": {...}
}]
```

### 3. Extended Thinking

```python
# For complex tasks, use larger budgets
thinking = {"type": "enabled", "budget_tokens": 16000}

# For Opus 4.6 / Sonnet 4.6, use adaptive
thinking = {"type": "adaptive"}
```

### 4. Caching Strategy

```python
# Cache at logical breakpoints
system = [
    {"type": "text", "text": "System instructions..."},
    {"type": "text", "text": "Large context...", "cache_control": {"type": "ephemeral"}}
]
```

## Stop Reasons

| Reason | Description |
|--------|-------------|
| `end_turn` | Normal completion |
| `max_tokens` | Token limit reached |
| `stop_sequence` | Stop sequence hit |
| `tool_use` | Tool call requested |
| `pause_turn` | Server tool paused (web search) |
| `refusal` | Content refused |

## Rate Limits

| Tier | RPM | TPM |
|------|-----|-----|
| Free | 5 | 10K |
| Tier 1 | 100 | 40K |
| Tier 2 | 1000 | 160K |
| Tier 3 | 2000 | 400K |
| Tier 4 | 4000 | 1M |

## Referensi

- [API Reference](references/api-reference.md) - Detail API lengkap
- [Tool Use](references/tool-use.md) - Panduan tool use
- [Extended Thinking](references/extended-thinking.md) - Panduan thinking
- [Prompt Caching](references/prompt-caching.md) - Panduan caching

## Links

- [Claude Console](https://console.claude.com/)
- [API Docs](https://docs.anthropic.com/)
- [Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [Discord](https://www.anthropic.com/discord)
