# Groq Code Examples

Kumpulan contoh kode untuk berbagai use case dengan Groq API.

## Chat Application

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

def chat(messages: list[dict]) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
    )
    return response.choices[0].message.content

# Conversation loop
messages = [{"role": "system", "content": "You are a helpful assistant."}]

while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        break
    
    messages.append({"role": "user", "content": user_input})
    response = chat(messages)
    print(f"Assistant: {response}")
    messages.append({"role": "assistant", "content": response})
```

## Streaming Chat

```python
def stream_chat(message: str):
    stream = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": message}],
        stream=True,
    )
    
    full_response = ""
    for chunk in stream:
        if chunk.choices[0].delta.content:
            content = chunk.choices[0].delta.content
            print(content, end="", flush=True)
            full_response += content
    
    print()  # Newline after streaming
    return full_response
```

## Function Calling Agent

```python
import json
from typing import Callable

# Define available functions
def get_weather(location: str) -> dict:
    """Simulated weather function"""
    return {"temperature": 25, "condition": "sunny", "location": location}

def search_web(query: str) -> dict:
    """Simulated web search"""
    return {"results": [f"Result for: {query}"]}

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "City name"}
                },
                "required": ["location"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "Search the web",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"}
                },
                "required": ["query"]
            }
        }
    }
]

available_functions = {
    "get_weather": get_weather,
    "search_web": search_web,
}

def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]
    
    while True:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )
        
        message = response.choices[0].message
        
        # Check if model wants to call tools
        if message.tool_calls:
            messages.append(message)
            
            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                
                # Execute function
                result = available_functions[function_name](**arguments)
                
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result)
                })
        else:
            return message.content

# Usage
result = run_agent("What's the weather in Tokyo?")
print(result)
```

## Structured Output with Pydantic

```python
from pydantic import BaseModel
from typing import List

class Person(BaseModel):
    name: str
    age: int
    occupation: str
    hobbies: List[str]

class Team(BaseModel):
    name: str
    members: List[Person]
    project: str

# Use JSON mode and parse
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": "You generate JSON data about teams."},
        {"role": "user", "content": "Generate a team with 3 members"}
    ],
    response_format={"type": "json_object"},
)

import json
data = json.loads(response.choices[0].message.content)
team = Team(**data)
print(team)
```

## Vision - Image Analysis

```python
import base64

def analyze_image(image_path: str, question: str) -> str:
    # Read and encode image
    with open(image_path, "rb") as f:
        image_base64 = base64.b64encode(f.read()).decode()
    
    response = client.chat.completions.create(
        model="llama-3.2-11b-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": question},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        }
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content

# Usage
result = analyze_image("photo.jpg", "What objects are in this image?")
print(result)
```

## Audio Transcription

```python
def transcribe_audio(file_path: str) -> str:
    with open(file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=audio_file,
            response_format="json",
        )
    return transcription.text

# With timestamps
def transcribe_with_timestamps(file_path: str) -> dict:
    with open(file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=audio_file,
            response_format="verbose_json",
        )
    return transcription.model_dump()

# Usage
text = transcribe_audio("meeting.mp3")
print(text)
```

## Text to Speech

```python
def text_to_speech(text: str, output_file: str = "output.wav"):
    response = client.audio.speech.create(
        model="playai-tts",
        voice="Fritz-PlayAI",
        input=text,
        response_format="wav",
    )
    
    with open(output_file, "wb") as f:
        f.write(response.content)
    
    return output_file

# Usage
text_to_speech("Hello, this is a test of text to speech!", "greeting.wav")
```

## Translation Agent

```python
def translate(text: str, target_language: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": f"You are a translator. Translate the given text to {target_language}. Only output the translation, nothing else."
            },
            {"role": "user", "content": text}
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content

# Usage
spanish = translate("Hello, how are you?", "Spanish")
print(spanish)  # Hola, ¿cómo estás?
```

## Code Generation

```python
def generate_code(prompt: str, language: str = "Python") -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": f"You are an expert {language} programmer. Generate clean, efficient, and well-commented code."
            },
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
    )
    return response.choices[0].message.content

# Usage
code = generate_code("Write a function to sort a list of dictionaries by a specific key")
print(code)
```

## RAG (Retrieval Augmented Generation)

```python
from typing import List

# Simple in-memory vector store simulation
documents = [
    "The capital of France is Paris.",
    "Python was created by Guido van Rossum.",
    "The speed of light is approximately 299,792 kilometers per second.",
]

def simple_search(query: str, docs: List[str], top_k: int = 2) -> List[str]:
    """Simple keyword-based search (replace with real vector search)"""
    query_words = set(query.lower().split())
    scored_docs = []
    
    for doc in docs:
        doc_words = set(doc.lower().split())
        score = len(query_words & doc_words)
        scored_docs.append((score, doc))
    
    scored_docs.sort(reverse=True)
    return [doc for score, doc in scored_docs[:top_k]]

def rag_query(query: str) -> str:
    # Retrieve relevant documents
    relevant_docs = simple_search(query, documents)
    context = "\n".join(relevant_docs)
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "Answer questions based on the provided context. If the context doesn't contain the answer, say so."
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {query}"
            }
        ],
    )
    
    return response.choices[0].message.content

# Usage
answer = rag_query("Who created Python?")
print(answer)
```

## Async Batch Processing

```python
import asyncio
from openai import AsyncOpenAI

async_client = AsyncOpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

async def process_single(item: str) -> str:
    response = await async_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": item}],
    )
    return response.choices[0].message.content

async def batch_process(items: list[str]) -> list[str]:
    tasks = [process_single(item) for item in items]
    return await asyncio.gather(*tasks)

# Usage
async def main():
    prompts = [
        "What is 2+2?",
        "What is the capital of Japan?",
        "Who wrote Romeo and Juliet?"
    ]
    results = await batch_process(prompts)
    for prompt, result in zip(prompts, results):
        print(f"Q: {prompt}\nA: {result}\n")

asyncio.run(main())
```

## Error Handling with Retry

```python
import time
from openai import RateLimitError, APIError

def call_with_retry(func, max_retries=3, **kwargs):
    for attempt in range(max_retries):
        try:
            return func(**kwargs)
        except RateLimitError as e:
            wait_time = int(e.response.headers.get("retry-after", 60))
            print(f"Rate limited. Waiting {wait_time} seconds...")
            time.sleep(wait_time)
        except APIError as e:
            if attempt == max_retries - 1:
                raise
            wait_time = 2 ** attempt  # Exponential backoff
            print(f"API error. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
    
    raise Exception("Max retries exceeded")

# Usage
response = call_with_retry(
    client.chat.completions.create,
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Next.js API Route

```typescript
// app/api/chat/route.ts
import OpenAI from 'openai';
import { StreamingTextResponse } from 'ai';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    stream: true,
  });
  
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || '';
        controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });
  
  return new StreamingTextResponse(stream);
}
```

## Express.js Server

```javascript
import express from 'express';
import OpenAI from 'openai';

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: message }],
    });
    
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
