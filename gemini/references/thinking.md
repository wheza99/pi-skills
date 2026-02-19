# Gemini Thinking

## Overview

Gemini 3 dan 2.5 series models menggunakan internal "thinking process" yang meningkatkan kemampuan reasoning dan multi-step planning. Fitur ini sangat efektif untuk tugas kompleks seperti coding, matematika, dan analisis data.

## Basic Usage

```python
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="What is the sum of the first 50 prime numbers?"
)

print(response.text)
```

Thinking diaktifkan secara default untuk model yang mendukung.

## Thought Summaries

Untuk melihat ringkasan proses berpikir model:

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="What is the sum of the first 50 prime numbers?",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
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

## Streaming with Thinking

```python
from google import genai
from google.genai import types

client = genai.Client()

prompt = """
Alice, Bob, and Carol each live in a different house: red, green, blue.
The person in the red house owns a cat.
Bob does not live in the green house.
Carol owns a dog.
The green house is to the left of the red house.
Alice does not own a cat.
Who lives in each house, and what pet do they own?
"""

for chunk in client.models.generate_content_stream(
    model="gemini-3-flash-preview",
    contents=prompt,
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(include_thoughts=True)
    )
):
    for part in chunk.candidates[0].content.parts:
        if part.thought:
            print(part.text, end="", flush=True)
        else:
            print(part.text, end="", flush=True)
```

## Thinking Levels (Gemini 3)

```python
from google import genai
from google.genai import types

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Explain quantum entanglement",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_level="high"  # minimal, low, medium, high
        )
    )
)
```

| Level | Gemini 3 Pro | Gemini 3 Flash | Description |
|-------|--------------|----------------|-------------|
| `minimal` | ❌ | ✅ | Minimal latency, minimal thinking |
| `low` | ✅ | ✅ | Minimizes latency and cost |
| `medium` | ❌ | ✅ | Balanced thinking |
| `high` | ✅ (default) | ✅ (default) | Maximum reasoning depth |

## Thinking Budgets (Gemini 2.5)

```python
from google import genai
from google.genai import types

# Set specific token budget
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Complex problem...",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=1024  # Number of tokens
        )
    )
)

# Disable thinking
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Simple question...",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=0  # Disable thinking
        )
    )
)

# Dynamic thinking (default)
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="...",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=-1  # Dynamic
        )
    )
)
```

### Thinking Budget Ranges

| Model | Default | Range | Disable | Dynamic |
|-------|---------|-------|---------|---------|
| 2.5 Pro | Dynamic | 128-32768 | ❌ | -1 |
| 2.5 Flash | Dynamic | 0-24576 | 0 | -1 |
| 2.5 Flash Lite | Off | 512-24576 | 0 | -1 |

## Token Usage

```python
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="..."
)

print("Thoughts tokens:", response.usage_metadata.thoughts_token_count)
print("Output tokens:", response.usage_metadata.candidates_token_count)
```

## Thought Signatures

Thought signatures adalah representasi terenkripsi dari proses berpikir model, digunakan untuk mempertahankan konteks dalam multi-turn conversations.

### When to Use

- Function calling dengan thinking models
- Multi-turn conversations dengan manual history management
- REST API usage

### Rules

1. Selalu kirim thought_signature kembali dalam Part aslinya
2. Jangan merge Part dengan signature dengan Part tanpa signature
3. Jangan gabungkan dua Parts yang keduanya mengandung signatures

### SDK Handling

SDK secara otomatis menangani thought signatures:

```python
# SDK handles signatures automatically
chat = client.chats.create(model="gemini-3-flash-preview")
response1 = chat.send_message("First message")
response2 = chat.send_message("Second message")  # Signatures preserved
```

### Manual Handling

```python
# If managing history manually
import base64

part = response.candidates[0].content.parts[0]
if part.thought_signature:
    signature = base64.b64encode(part.thought_signature).decode("utf-8")
    print(f"Signature: {signature}")
```

## Task Complexity Guide

### Easy Tasks (Thinking OFF/Minimal)

```python
# Fact retrieval
"What is the capital of France?"

# Simple classification
"Is this email spam or not?"

# Basic math
"What is 2 + 2?"
```

### Medium Tasks (Default/Some Thinking)

```python
# Analogies
"Compare photosynthesis to growing up"

# Comparisons
"Compare electric cars and hybrid cars"

# Summarization
"Summarize this article in 3 sentences"
```

### Hard Tasks (Maximum Thinking)

```python
# Complex math
"Solve problem 1 in AIME 2025"

# Complex coding
"Write a web application for real-time stock visualization"

# Multi-step reasoning
"Analyze this dataset and find anomalies"
```

## Best Practices

### 1. Debugging dengan Thought Summaries

```python
# If not getting expected results, check thinking
config = types.GenerateContentConfig(
    thinking_config=types.ThinkingConfig(include_thoughts=True)
)
# Analyze how model arrived at conclusion
```

### 2. Guide Reasoning in Prompts

```python
# For lengthy outputs, constrain thinking to reserve tokens for output
prompt = """
Please solve this step by step, but keep your reasoning concise.
[Problem details...]
"""
```

### 3. Match Level to Complexity

```python
# Simple task - minimal thinking
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="What day is today?",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_level="minimal")
    )
)

# Complex task - high thinking
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Prove the Riemann hypothesis",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_level="high")
    )
)
```

## Supported Models

| Model | Thinking | Thinking Levels | Budget Control |
|-------|----------|-----------------|----------------|
| Gemini 3 Pro | ✅ | low, high | ❌ |
| Gemini 3 Flash | ✅ | minimal, low, medium, high | ❌ |
| Gemini 2.5 Pro | ✅ | ❌ | ✅ |
| Gemini 2.5 Flash | ✅ | ❌ | ✅ |
| Gemini 2.5 Flash Lite | ✅ | ❌ | ✅ |

## Pricing

- Thinking tokens + Output tokens dihitung terpisah
- Thought summaries tidak dikenakan biaya tambahan
- Thought signatures meningkatkan input tokens di request berikutnya
