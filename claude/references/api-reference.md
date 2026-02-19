# Claude API Reference

## Authentication

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

## Base URL

```
https://api.anthropic.com/v1
```

## Messages API

### Basic Request

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
```

### REST API

```bash
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Request Parameters

```typescript
type MessageCreateParams = {
  model: string;                    // Required: Model ID
  max_tokens: number;               // Required: Max output tokens
  messages: Message[];              // Required: Conversation
  
  system?: string | ContentBlock[]; // Optional: System prompt
  stream?: boolean;                 // Optional: Enable streaming
  
  // Thinking
  thinking?: {
    type: "enabled" | "adaptive";
    budget_tokens?: number;         // For "enabled" mode
  };
  
  // Output config
  output_config?: {
    effort?: "low" | "medium" | "high" | "max";
  };
  
  // Tools
  tools?: Tool[];
  tool_choice?: ToolChoice;
  
  // Other
  metadata?: object;
  stop_sequences?: string[];
  temperature?: number;             // 0-1
  top_k?: number;
  top_p?: number;
};
```

## Message Types

```typescript
type Message = {
  role: "user" | "assistant";
  content: string | ContentBlock[];
};

type ContentBlock = 
  | { type: "text"; text: string }
  | { type: "image"; source: ImageSource }
  | { type: "tool_use"; id: string; name: string; input: object }
  | { type: "tool_result"; tool_use_id: string; content: string | ContentBlock[]; is_error?: boolean }
  | { type: "thinking"; thinking: string; signature?: string }
  | { type: "redacted_thinking"; data: string };

type ImageSource = {
  type: "base64" | "url" | "file";
  media_type?: string;  // For base64: image/jpeg, image/png, image/gif, image/webp
  data?: string;        // For base64
  url?: string;         // For url
  file_id?: string;     // For file
};
```

## Tool Definition

```typescript
type Tool = {
  name: string;           // Regex: ^[a-zA-Z0-9_-]{1,64}$
  description: string;    // Detailed description
  input_schema: JSONSchema;
  strict?: boolean;       // Enable strict mode
  input_examples?: object[];  // Optional examples
};

type ToolChoice = 
  | { type: "auto" }      // Default: Claude decides
  | { type: "any" }       // Must use a tool
  | { type: "tool"; name: string }  // Force specific tool
  | { type: "none" };     // No tools
```

## Response Object

```typescript
type MessageResponse = {
  id: string;
  type: "message";
  role: "assistant";
  content: ContentBlock[];
  model: string;
  stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | 
               "tool_use" | "pause_turn" | "refusal";
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
};
```

## Streaming Events

```typescript
type StreamEvent =
  | { type: "message_start"; message: Message }
  | { type: "content_block_start"; index: number; content_block: ContentBlock }
  | { type: "content_block_delta"; index: number; delta: Delta }
  | { type: "content_block_stop"; index: number }
  | { type: "message_delta"; delta: { stop_reason: string } }
  | { type: "message_stop" };

type Delta =
  | { type: "text_delta"; text: string }
  | { type: "thinking_delta"; thinking: string }
  | { type: "signature_delta"; signature: string }
  | { type: "input_json_delta"; partial_json: string };
```

## Thinking Configuration

### Manual Mode

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[...]
)
```

### Adaptive Mode (Recommended for Opus 4.6 / Sonnet 4.6)

```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[...]
)
```

## Prompt Caching

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {"type": "text", "text": "Instructions..."},
        {"type": "text", "text": "Large content...", 
         "cache_control": {"type": "ephemeral", "ttl": "5m"}}
    ],
    messages=[...]
)
```

### Cache TTL Options

- `"5m"` - 5 minutes (default)
- `"1h"` - 1 hour (additional cost)

## Structured Outputs

```python
from pydantic import BaseModel

class MySchema(BaseModel):
    field1: str
    field2: int

response = client.messages.parse(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[...],
    output_format=MySchema
)

parsed = response.parsed_output  # MySchema instance
```

## Error Handling

```python
from anthropic import Anthropic, APIError, RateLimitError

try:
    response = client.messages.create(...)
except RateLimitError as e:
    print(f"Rate limit: {e}")
except APIError as e:
    print(f"API error: {e}")
```

## Headers

```
Content-Type: application/json
x-api-key: <api-key>
anthropic-version: 2023-06-01
anthropic-beta: <beta-features>  # Optional
```

## Rate Limits

| Tier | Requests/min | Tokens/min |
|------|--------------|------------|
| Free | 5 | 10,000 |
| Tier 1 | 100 | 40,000 |
| Tier 2 | 1,000 | 160,000 |
| Tier 3 | 2,000 | 400,000 |
| Tier 4 | 4,000 | 1,000,000 |

## Vision Limits

- Max image size: 8000x8000 px
- Max images per request: 100 (API), 20 (claude.ai)
- If > 20 images: max 2000x2000 px each
- Request size limit: 32MB

## Token Calculation

For images:
```
tokens ≈ (width * height) / 750
```

Maximum non-resized images (~1600 tokens):
- 1:1: 1092x1092 px
- 16:9: 1376x768 px
- 9:16: 819x1456 px
