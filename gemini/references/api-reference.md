# Gemini API Reference

## Authentication

```bash
export GEMINI_API_KEY="your-api-key"
```

## Base URL

```
https://generativelanguage.googleapis.com/v1beta
```

## Generate Content

### Python SDK

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Hello!",
    config=types.GenerateContentConfig(
        temperature=0.7,
        max_output_tokens=1024
    )
)
```

### REST API

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=$GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello!"}]
    }]
  }'
```

## Generate Content Configuration

```typescript
type GenerateContentConfig = {
  // System instruction
  system_instruction?: string;
  
  // Generation parameters
  temperature?: number;         // 0-2, default 1.0
  top_p?: number;               // 0-1
  top_k?: number;               // 1-infinity
  max_output_tokens?: number;   // Max response length
  
  // Stop sequences
  stop_sequences?: string[];
  
  // Safety settings
  safety_settings?: SafetySetting[];
  
  // Tools
  tools?: Tool[];
  
  // Thinking config
  thinking_config?: ThinkingConfig;
  
  // Response format
  response_mime_type?: string;  // "text/plain" or "application/json"
  response_json_schema?: object;
  
  // Image config
  image_config?: ImageConfig;
  
  // Response modalities
  response_modalities?: string[];  // ["TEXT", "IMAGE", "AUDIO"]
};
```

## Thinking Configuration

```typescript
type ThinkingConfig = {
  // Include thought summaries in response
  include_thoughts?: boolean;
  
  // Thinking level (Gemini 3)
  thinking_level?: "minimal" | "low" | "medium" | "high";
  
  // Thinking budget in tokens (Gemini 2.5)
  thinking_budget?: number;  // -1 for dynamic, 0 to disable
};
```

## Message Types

```typescript
type Content = {
  role: "user" | "model" | "system" | "tool";
  parts: Part[];
};

type Part = 
  | { text: string }
  | { inline_data: { mime_type: string; data: string } }
  | { function_call: FunctionCall }
  | { function_response: FunctionResponse };
```

## Function Calling

```typescript
type Tool = {
  function_declarations: FunctionDeclaration[];
};

type FunctionDeclaration = {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: {
      [key: string]: {
        type: string;
        description: string;
        enum?: string[];
      };
    };
    required: string[];
  };
};

type FunctionCallingConfig = {
  mode: "AUTO" | "ANY" | "NONE" | "VALIDATED";
  allowed_function_names?: string[];
};
```

## Structured Output

```python
from pydantic import BaseModel
from typing import List

class MySchema(BaseModel):
    field1: str
    field2: int
    field3: List[str]

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="...",
    config={
        "response_mime_type": "application/json",
        "response_json_schema": MySchema.model_json_schema()
    }
)
```

## Image Configuration

```typescript
type ImageConfig = {
  aspect_ratio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | 
                   "4:5" | "5:4" | "9:16" | "16:9" | "21:9";
  image_size?: "1K" | "2K" | "4K";  // Only for gemini-3-pro-image-preview
};
```

## Embed Content

```python
result = client.models.embed_content(
    model="gemini-embedding-001",
    contents=["Text 1", "Text 2"],
    config=types.EmbedContentConfig(
        task_type="SEMANTIC_SIMILARITY",
        output_dimensionality=768
    )
)
```

### Task Types

| Task Type | Description |
|-----------|-------------|
| `SEMANTIC_SIMILARITY` | Text similarity |
| `CLASSIFICATION` | Text classification |
| `CLUSTERING` | Clustering texts |
| `RETRIEVAL_DOCUMENT` | Document search |
| `RETRIEVAL_QUERY` | Search queries |
| `CODE_RETRIEVAL_QUERY` | Code search |
| `QUESTION_ANSWERING` | QA systems |
| `FACT_VERIFICATION` | Fact checking |

## Live API

```python
async with client.aio.live.connect(
    model="gemini-2.5-flash-native-audio-preview",
    config={"response_modalities": ["AUDIO"]}
) as session:
    await session.send_realtime_input(
        audio={"data": audio_bytes, "mime_type": "audio/pcm"}
    )
    async for response in session.receive():
        # Handle response
        pass
```

## Response Object

```typescript
type GenerateContentResponse = {
  candidates: Candidate[];
  usage_metadata: {
    prompt_token_count: number;
    candidates_token_count: number;
    total_token_count: number;
    thoughts_token_count?: number;
  };
  model_version: string;
};

type Candidate = {
  content: {
    role: string;
    parts: Part[];
  };
  finish_reason: string;
  safety_ratings: SafetyRating[];
};
```

## Finish Reasons

| Reason | Description |
|--------|-------------|
| `STOP` | Normal completion |
| `MAX_TOKENS` | Max tokens reached |
| `SAFETY` | Content filtered |
| `RECITATION` | Recitation detected |
| `FUNCTION_CALL` | Function call requested |

## Safety Settings

```python
from google.genai import types

safety_settings = [
    types.SafetySetting(
        category="HARM_CATEGORY_HARASSMENT",
        threshold="BLOCK_MEDIUM_AND_ABOVE"
    )
]
```

### Categories

- `HARM_CATEGORY_HARASSMENT`
- `HARM_CATEGORY_HATE_SPEECH`
- `HARM_CATEGORY_SEXUALLY_EXPLICIT`
- `HARM_CATEGORY_DANGEROUS_CONTENT`

### Thresholds

- `BLOCK_NONE`
- `BLOCK_LOW_AND_ABOVE`
- `BLOCK_MEDIUM_AND_ABOVE`
- `BLOCK_ONLY_HIGH`

## Error Handling

```python
from google.genai import errors

try:
    response = client.models.generate_content(...)
except errors.APIError as e:
    print(f"API Error: {e.code} - {e.message}")
```

## Rate Limits

| Tier | RPM | TPM |
|------|-----|-----|
| Free | 15 | 1M |
| Paid | 2000 | 4M |

Check [Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits) for current limits.

## Models List

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"
```
