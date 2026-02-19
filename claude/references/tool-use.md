# Claude Tool Use

## Overview

Claude dapat menggunakan tools untuk berinteraksi dengan sistem eksternal. Ada dua jenis tools:

1. **Client Tools** - Dieksekusi di sistem Anda (user-defined)
2. **Server Tools** - Dieksekusi di server Anthropic (web search, web fetch)

## Basic Tool Use

### Defining Tools

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location. Use this when the user asks about weather.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g., San Francisco, CA"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit"
                }
            },
            "required": ["location"]
        }
    }
]
```

### Making a Request

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)

# Check for tool use
for block in response.content:
    if block.type == "tool_use":
        print(f"Tool: {block.name}")
        print(f"Input: {block.input}")
```

### Returning Tool Results

```python
# Execute the tool
result = get_weather(**block.input)

# Send result back
messages = [
    {"role": "user", "content": "What's the weather in Tokyo?"},
    {"role": "assistant", "content": response.content},
    {"role": "user", "content": [
        {
            "type": "tool_result",
            "tool_use_id": block.id,
            "content": json.dumps(result)
        }
    ]}
]

final_response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=messages
)
```

## Tool Runner (Beta)

Python SDK menyediakan tool runner untuk otomatisasi:

```python
from anthropic import Anthropic, beta_tool

client = Anthropic()

@beta_tool
def get_weather(location: str, unit: str = "fahrenheit") -> str:
    """Get the current weather in a given location.
    
    Args:
        location: The city and state, e.g., San Francisco, CA
        unit: Temperature unit, 'celsius' or 'fahrenheit'
    """
    # Call weather API...
    return json.dumps({"temperature": 22, "condition": "Sunny"})

# Use tool runner
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in Paris?"}]
)

for message in runner:
    print(message.content[0].text)

# Or get final message directly
final = runner.until_done()
```

## Tool Choice

```python
# Auto (default) - Claude decides
tool_choice = {"type": "auto"}

# Any - Must use one of the tools
tool_choice = {"type": "any"}

# Specific tool - Force a particular tool
tool_choice = {"type": "tool", "name": "get_weather"}

# None - Disable tools
tool_choice = {"type": "none"}
```

## Parallel Tool Use

Claude dapat memanggil multiple tools sekaligus:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[get_weather, get_time],
    messages=[{"role": "user", "content": "What's the weather and time in Tokyo?"}]
)

# Multiple tool_use blocks may be returned
for block in response.content:
    if block.type == "tool_use":
        print(f"Tool: {block.name}, Input: {block.input}")
```

Disable parallel tool use:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "auto", "disable_parallel_tool_use": True},
    messages=[...]
)
```

## Strict Tool Use

Guarantee schema conformance:

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get weather",
        "strict": True,  # Enable strict mode
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string"}
            },
            "required": ["location"],
            "additionalProperties": False  # Required for strict mode
        }
    }
]
```

## Input Examples

Provide examples for complex tools:

```python
tools = [{
    "name": "search",
    "description": "Search for documents",
    "input_schema": {...},
    "input_examples": [
        {"query": "climate change", "limit": 10},
        {"query": "AI safety", "limit": 5}
    ]
}]
```

## Server Tools

### Web Search

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}],
    messages=[{"role": "user", "content": "Latest news about AI"}]
)
```

### Web Fetch

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[{"type": "web_fetch_20250305", "name": "web_fetch", "max_uses": 1}],
    messages=[{"role": "user", "content": "Summarize https://example.com/article"}]
)
```

## Tool Use with Thinking

Important rules when combining tool use with extended thinking:

1. **Preserve thinking blocks** - Pass thinking blocks back with tool results
2. **Tool choice limitation** - Only `auto` and `none` supported
3. **Interleaved thinking** - Claude can think between tool calls

```python
# First request with thinking
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    tools=tools,
    messages=[{"role": "user", "content": "..."}]
)

# When returning tool results, include thinking blocks
messages = [
    {"role": "user", "content": "..."},
    response.content,  # Includes thinking + tool_use
    {"role": "user", "content": [tool_result]}
]
```

## Tool Result Format

```python
tool_result = {
    "type": "tool_result",
    "tool_use_id": "toolu_01...",
    "content": "Result string or content blocks",
    "is_error": False  # Optional: set True if tool failed
}
```

With images in tool result:

```python
tool_result = {
    "type": "tool_result",
    "tool_use_id": "toolu_01...",
    "content": [
        {"type": "text", "text": "Here's the chart:"},
        {"type": "image", "source": {...}}
    ]
}
```

## Best Practices

1. **Detailed Descriptions** - At least 3-4 sentences per tool
2. **Descriptive Names** - Clear, purpose-indicating names
3. **Strong Typing** - Use specific types and enums
4. **Error Handling** - Return informative error messages
5. **Token Awareness** - Tool definitions count toward input tokens
6. **Tool Limit** - Recommended max 10-20 active tools
