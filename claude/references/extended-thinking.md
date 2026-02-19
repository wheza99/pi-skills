# Claude Extended Thinking

## Overview

Extended thinking memberikan Claude kemampuan reasoning yang lebih baik dengan memproses "pikiran" internal sebelum memberikan jawaban final.

## Modes

### Adaptive Thinking (Recommended)

Untuk Claude Opus 4.6 dan Sonnet 4.6:

```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "Complex problem..."}]
)
```

**Effort Levels:**
| Level | Behavior | Models |
|-------|----------|--------|
| `max` | Always thinks, no constraints | Opus 4.6 only |
| `high` | Always thinks, deep reasoning | All (default) |
| `medium` | Moderate thinking, may skip simple | All |
| `low` | Minimizes thinking, prioritizes speed | All |

### Manual Thinking

Untuk semua model yang mendukung:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "..."}]
)
```

**Budget Guidelines:**
- Minimum: 1,024 tokens
- Start with: 10,000 tokens for complex tasks
- Diminishing returns above: 32,000 tokens

## Response Format

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "EqQBCgIYAhIM..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

## Processing Thinking Blocks

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    messages=[...]
)

for block in response.content:
    if block.type == "thinking":
        print(f"Thinking: {block.thinking[:200]}...")
        if hasattr(block, 'signature'):
            print(f"Signature: {block.signature[:50]}...")
    elif block.type == "text":
        print(f"Answer: {block.text}")
```

## Streaming with Thinking

```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    messages=[...]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            print(f"\n[{event.content_block.type} block]")
        elif event.type == "content_block_delta":
            if hasattr(event.delta, 'thinking'):
                print(event.delta.thinking, end="", flush=True)
            elif hasattr(event.delta, 'text'):
                print(event.delta.text, end="", flush=True)
```

## Thinking with Tool Use

### Rules

1. Only `tool_choice: auto` or `none` supported
2. Must preserve thinking blocks between tool calls
3. Interleaved thinking automatically enabled with adaptive mode

### Example

```python
# Initial request
response1 = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)

# Get tool use info
tool_use = next(b for b in response1.content if b.type == "tool_use")

# Execute tool
result = get_weather(**tool_use.input)

# Return result WITH thinking blocks preserved
messages = [
    {"role": "user", "content": "What's the weather in Tokyo?"},
    {"role": "assistant", "content": response1.content},  # Includes thinking
    {"role": "user", "content": [{
        "type": "tool_result",
        "tool_use_id": tool_use.id,
        "content": json.dumps(result)
    }]}
]

response2 = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    tools=tools,
    messages=messages
)
```

## Summarized Thinking

Claude 4+ models return summarized thinking:
- Full thinking generated internally
- Summary returned in response
- Billed for full thinking tokens, not summary

```python
# Usage shows full thinking tokens
print(f"Output tokens: {response.usage.output_tokens}")
# But visible thinking is summarized
```

## Redacted Thinking

Safety systems may encrypt some thinking:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Normal thinking..."
    },
    {
      "type": "redacted_thinking",
      "data": "EmwKAhgBEgy3va3pzix..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

Handle in UI:

```python
for block in response.content:
    if block.type == "redacted_thinking":
        print("[Some reasoning encrypted for safety]")
    elif block.type == "thinking":
        print(f"Thinking: {block.thinking}")
```

## Thinking Signatures

Signatures verify thinking block authenticity:

- Added to thinking blocks automatically
- Must be preserved when passing back
- Compatible across platforms (API, Bedrock, Vertex)

```python
# Signatures are in the signature field
if hasattr(thinking_block, 'signature'):
    # Pass back unmodified
    pass
```

## Context Window with Thinking

```
context_window = 
  (current input - previous thinking tokens) +
  (thinking tokens + encrypted tokens + output tokens)
```

- Previous thinking blocks stripped from context
- Current turn thinking counts toward max_tokens
- Use token counting API for accurate counts

## Pricing

| Component | Charge |
|-----------|--------|
| Thinking output tokens | Standard output rate |
| Thinking blocks in input | Standard input rate |
| Summary generation | No charge |
| Specialized system prompt | Included automatically |

## Best Practices

1. **Use Adaptive Mode** - For Opus 4.6 / Sonnet 4.6
2. **Start with Lower Budget** - Increase if needed
3. **Monitor Token Usage** - Thinking can be expensive
4. **Preserve Thinking Blocks** - Critical for tool use
5. **Consider Latency** - Thinking adds response time
6. **Match Effort to Task** - Lower for simple, higher for complex

## Task Guidelines

| Task Complexity | Recommended Setting |
|-----------------|---------------------|
| Simple lookup | `effort: "low"` or thinking off |
| Standard tasks | `effort: "medium"` |
| Complex reasoning | `effort: "high"` (default) |
| Maximum reasoning | `effort: "max"` (Opus only) |
