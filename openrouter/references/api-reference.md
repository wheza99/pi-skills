# OpenRouter API Reference

## Endpoint

```
POST https://openrouter.ai/api/v1/chat/completions
```

## Request Schema

```typescript
type Request = {
  // Either "messages" or "prompt" is required
  messages?: Message[];
  prompt?: string;

  // If "model" is unspecified, uses the user's default
  model?: string;

  // Structured outputs
  response_format?: ResponseFormat;

  stop?: string | string[];
  stream?: boolean;
  
  // Plugins
  plugins?: Plugin[];

  // LLM Parameters
  max_tokens?: number;       // Range: [1, context_length)
  temperature?: number;      // Range: [0, 2]
  seed?: number;             // Integer only
  top_p?: number;            // Range: (0, 1]
  top_k?: number;            // Range: [1, Infinity) Not for OpenAI
  frequency_penalty?: number; // Range: [-2, 2]
  presence_penalty?: number;  // Range: [-2, 2]
  repetition_penalty?: number; // Range: (0, 2]
  logit_bias?: { [key: number]: number };
  top_logprobs: number;
  min_p?: number;            // Range: [0, 1]
  top_a?: number;            // Range: [0, 1]

  // Prediction for latency optimization
  prediction?: { type: 'content'; content: string };

  // Tool calling
  tools?: Tool[];
  tool_choice?: ToolChoice;

  // OpenRouter-only parameters
  transforms?: string[];
  models?: string[];
  route?: 'fallback';
  provider?: ProviderPreferences;
  user?: string;
  
  // Debug options (streaming only)
  debug?: {
    echo_upstream_body?: boolean;
  };
};
```

## Message Types

```typescript
type TextContent = {
  type: 'text';
  text: string;
};

type ImageContentPart = {
  type: 'image_url';
  image_url: {
    url: string;    // URL or base64 encoded image
    detail?: string; // Optional, defaults to "auto"
  };
};

type ContentPart = TextContent | ImageContentPart;

type Message =
  | {
      role: 'user' | 'assistant' | 'system';
      content: string | ContentPart[];
      name?: string;
    }
  | {
      role: 'tool';
      content: string;
      tool_call_id: string;
      name?: string;
    };
```

## Tool Types

```typescript
type FunctionDescription = {
  description?: string;
  name: string;
  parameters: object; // JSON Schema object
};

type Tool = {
  type: 'function';
  function: FunctionDescription;
};

type ToolChoice =
  | 'none'
  | 'auto'
  | {
      type: 'function';
      function: {
        name: string;
      };
    };
```

## Response Format

```typescript
type ResponseFormat =
  | { type: 'json_object' }
  | {
      type: 'json_schema';
      json_schema: {
        name: string;
        strict?: boolean;
        schema: object; // JSON Schema object
      };
    };
```

## Plugin Types

```typescript
type Plugin = {
  id: string; // 'web', 'file-parser', 'response-healing'
  enabled?: boolean;
  [key: string]: unknown;
};
```

## Response Schema

```typescript
type Response = {
  id: string;
  choices: (NonStreamingChoice | StreamingChoice | NonChatChoice)[];
  created: number;        // Unix timestamp
  model: string;
  object: 'chat.completion' | 'chat.completion.chunk';
  system_fingerprint?: string;
  usage?: ResponseUsage;
};

type ResponseUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  
  prompt_tokens_details?: {
    cached_tokens: number;
    cache_write_tokens?: number;
    audio_tokens?: number;
    video_tokens?: number;
  };
  
  completion_tokens_details?: {
    reasoning_tokens?: number;
    image_tokens?: number;
  };
  
  cost?: number;
  is_byok?: boolean;
  cost_details?: {
    upstream_inference_cost?: number;
    upstream_inference_prompt_cost: number;
    upstream_inference_completions_cost: number;
  };
  
  server_tool_use?: {
    web_search_requests?: number;
  };
};

type NonStreamingChoice = {
  finish_reason: string | null;
  native_finish_reason: string | null;
  message: {
    content: string | null;
    role: string;
    tool_calls?: ToolCall[];
  };
  error?: ErrorResponse;
};

type StreamingChoice = {
  finish_reason: string | null;
  native_finish_reason: string | null;
  delta: {
    content: string | null;
    role?: string;
    tool_calls?: ToolCall[];
  };
  error?: ErrorResponse;
};

type ToolCall = {
  id: string;
  type: 'function';
  function: FunctionCall;
};

type ErrorResponse = {
  code: number;
  message: string;
  metadata?: Record<string, unknown>;
};
```

## Finish Reasons

OpenRouter normalizes finish_reason to:
- `tool_calls` - Model requested tool calls
- `stop` - Normal completion
- `length` - Max tokens reached
- `content_filter` - Content filtered
- `error` - Error occurred

Raw provider finish_reason is available in `native_finish_reason`.

## Headers

```javascript
{
  "Authorization": "Bearer <OPENROUTER_API_KEY>",
  "Content-Type": "application/json",
  "HTTP-Referer": "<YOUR_SITE_URL>",  // Optional, for rankings
  "X-Title": "<YOUR_SITE_NAME>"        // Optional, for rankings
}
```

## Generation Stats API

Query stats for a completed generation:

```javascript
const generation = await fetch(
  'https://openrouter.ai/api/v1/generation?id=$GENERATION_ID',
  { headers }
);
const stats = await generation.json();
```

## OpenAPI Specification

- YAML: https://openrouter.ai/openapi.yaml
- JSON: https://openrouter.ai/openapi.json
