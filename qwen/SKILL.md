---
name: qwen
description: Skill untuk menggunakan Qwen API dari Alibaba - akses ke Qwen3 (235B-A22B, 30B-A3B, 8B, 4B), Qwen2.5, Qwen2.5-VL (vision), QwQ (reasoning), dengan fitur Thinking Mode, Function Calling, Tool Use, MCP Support, multilingual 100+ bahasa, dan OpenAI-compatible API. Gunakan untuk text generation, vision, coding, reasoning, dan agentic tasks.
---

# Qwen API

Qwen adalah family model AI open-source dari Alibaba yang sangat powerful. Qwen3 adalah versi terbaru dengan kemampuan thinking mode, 256K context, dan mendukung 100+ bahasa.

## Setup

### 1. Dapatkan API Key

Pilih salah satu:

1. **DashScope (Alibaba Cloud)** - API resmi
   - Kunjungi [DashScope Console](https://dashscope.console.aliyun.com/)
   - Buat API key di [API Key Management](https://dashscope.console.aliyun.com/apiKey)
   - Free tier tersedia!

2. **Self-hosted** - Deploy sendiri dengan vLLM, SGLang, Ollama
   - Gratis, tapi butuh GPU
   - Lihat bagian Deployment

### 2. Set Environment Variable

```bash
# DashScope API
export DASHSCOPE_API_KEY="your-api-key"

# Atau untuk OpenAI-compatible server (vLLM, SGLang, dll)
export OPENAI_API_KEY="your-key"
export OPENAI_BASE_URL="http://localhost:8000/v1"
```

### 3. Install SDK

```bash
# DashScope SDK
pip install dashscope

# Atau OpenAI SDK (compatible)
pip install openai

# Qwen-Agent untuk agentic workflows
pip install "qwen-agent[gui,rag,code_interpreter,mcp]"
```

## Models

### Qwen3-2507 (Latest)

| Model | Type | Context | Deskripsi |
|-------|------|---------|-----------|
| `qwen3-235b-a22b-instruct-2507` | Instruct | 256K (extend 1M) | Flagship non-thinking |
| `qwen3-235b-a22b-thinking-2507` | Thinking | 256K (extend 1M) | Flagship reasoning |
| `qwen3-30b-a3b-instruct-2507` | Instruct | 256K | MoE, efficient |
| `qwen3-30b-a3b-thinking-2507` | Thinking | 256K | MoE reasoning |
| `qwen3-4b-instruct-2507` | Instruct | 32K | Lightweight |
| `qwen3-4b-thinking-2507` | Thinking | 32K | Lightweight reasoning |

### Qwen3-2504 (Original)

| Model | Size | Context | Deskripsi |
|-------|------|---------|-----------|
| `qwen3-235b-a22b` | 235B (MoE) | 128K | Largest, best performance |
| `qwen3-30b-a3b` | 30B (MoE) | 128K | Efficient MoE |
| `qwen3-32b` | 32B | 128K | Dense, balanced |
| `qwen3-14b` | 14B | 32K | Mid-size |
| `qwen3-8b` | 8B | 32K | Compact |
| `qwen3-4b` | 4B | 32K | Edge deployment |
| `qwen3-1.7b` | 1.7B | 32K | Tiny |
| `qwen3-0.6b` | 0.6B | 32K | Smallest |

### Qwen2.5 Series

| Model | Context | Deskripsi |
|-------|---------|-----------|
| `qwen2.5-72b-instruct` | 128K | Best Qwen2.5 |
| `qwen2.5-32b-instruct` | 128K | Balanced |
| `qwen2.5-14b-instruct` | 32K | Mid-size |
| `qwen2.5-7b-instruct` | 32K | Compact |
| `qwen2.5-3b-instruct` | 32K | Lightweight |
| `qwen2.5-1.5b-instruct` | 32K | Tiny |
| `qwen2.5-0.5b-instruct` | 32K | Smallest |

### Vision Models

| Model | Context | Deskripsi |
|-------|---------|-----------|
| `qwen2.5-vl-72b-instruct` | 128K | Flagship vision |
| `qwen2.5-vl-7b-instruct` | 32K | Compact vision |
| `qwen2.5-vl-3b-instruct` | 32K | Lightweight vision |

### Reasoning Model

| Model | Context | Deskripsi |
|-------|---------|-----------|
| `qwq-32b` | 128K | Reasoning specialist (like o1) |

### DashScope Model Names

| Model | DashScope Name |
|-------|----------------|
| Qwen3 Flagship | `qwen-max-latest` |
| Qwen3 Fast | `qwen-plus-latest` |
| Qwen3 Economy | `qwen-turbo-latest` |
| Qwen2.5-72B | `qwen2.5-72b-instruct` |

## Penggunaan

### DashScope SDK

```python
import dashscope
from dashscope import Generation

dashscope.api_key = "your-api-key"

response = Generation.call(
    model='qwen-max-latest',
    messages=[
        {'role': 'system', 'content': 'You are a helpful assistant.'},
        {'role': 'user', 'content': 'Hello!'}
    ],
    result_format='message'
)

print(response.output.choices[0].message.content)
```

### OpenAI SDK Compatible (DashScope)

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-dashscope-api-key",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="qwen-max-latest",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)
```

### Streaming

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-dashscope-api-key",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

stream = client.chat.completions.create(
    model="qwen-max-latest",
    messages=[{"role": "user", "content": "Write a poem"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### Multi-turn Chat

```python
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is Python?"}
]

response = client.chat.completions.create(
    model="qwen-max-latest",
    messages=messages
)

# Add response to history
messages.append({
    "role": "assistant",
    "content": response.choices[0].message.content
})

# Continue conversation
messages.append({"role": "user", "content": "Show me an example"})
```

## Thinking Mode

Qwen3-Thinking dan QwQ mendukung thinking mode untuk complex reasoning.

### Enable Thinking

```python
response = client.chat.completions.create(
    model="qwen3-30b-a3b-thinking-2507",
    messages=[
        {"role": "user", "content": "Solve: x^2 + 5x + 6 = 0"}
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.reasoning_content:
        print(f"[Thinking] {chunk.choices[0].delta.reasoning_content}")
    if chunk.choices[0].delta.content:
        print(f"[Answer] {chunk.choices[0].delta.content}")
```

### Toggle Thinking (Qwen3-2504)

```python
# Disable thinking
response = client.chat.completions.create(
    model="qwen3-8b",
    messages=[
        {"role": "user", "content": "/no_think Quick question: What is 2+2?"}
    ]
)

# Enable thinking (default)
response = client.chat.completions.create(
    model="qwen3-8b",
    messages=[
        {"role": "user", "content": "/think Solve this complex problem..."}
    ]
)
```

### Parse Thinking Output (Transformers)

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/Qwen3-30B-A3B-Thinking-2507"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype="auto", device_map="auto")

messages = [{"role": "user", "content": "Explain quantum computing"}]
text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

generated_ids = model.generate(**model_inputs, max_new_tokens=32768)
output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist()

# Parse thinking content
try:
    index = len(output_ids) - output_ids[::-1].index(151668)  # Find </think&gt; token
except ValueError:
    index = 0

thinking = tokenizer.decode(output_ids[:index], skip_special_tokens=True).strip("\n")
content = tokenizer.decode(output_ids[index:], skip_special_tokens=True).strip("\n")

print("Thinking:", thinking)
print("Answer:", content)
```

## Vision (Qwen2.5-VL)

### Image Analysis

```python
response = client.chat.completions.create(
    model="qwen2.5-vl-7b-instruct",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}},
                {"type": "text", "text": "What's in this image?"}
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

### Local Image (Base64)

```python
import base64

with open("image.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode("utf-8")

response = client.chat.completions.create(
    model="qwen2.5-vl-7b-instruct",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}},
                {"type": "text", "text": "Describe this image"}
            ]
        }
    ]
)
```

## Function Calling

### Basic Tool Use

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "City name"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="qwen-max-latest",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools,
    tool_choice="auto"
)

message = response.choices[0].message
if message.tool_calls:
    for tool_call in message.tool_calls:
        print(f"Function: {tool_call.function.name}")
        print(f"Arguments: {tool_call.function.arguments}")
```

### Complete Tool Call Flow

```python
import json

def get_weather(city: str) -> dict:
    # Mock function - replace with actual API
    return {"city": city, "temp": 25, "condition": "sunny"}

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"]
        }
    }
}]

messages = [{"role": "user", "content": "Weather in Jakarta?"}]

# Step 1: Model decides to call tool
response = client.chat.completions.create(
    model="qwen-max-latest",
    messages=messages,
    tools=tools
)

# Step 2: Execute tool and return result
message = response.choices[0].message
if message.tool_calls:
    tool_call = message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    result = get_weather(args["city"])

    # Add tool result to messages
    messages.append(message)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result)
    })

    # Step 3: Get final response
    final_response = client.chat.completions.create(
        model="qwen-max-latest",
        messages=messages,
        tools=tools
    )
    print(final_response.choices[0].message.content)
```

## Qwen-Agent Framework

Qwen-Agent adalah framework untuk building AI agents dengan Qwen.

### Basic Agent

```python
from qwen_agent.agents import Assistant

llm_cfg = {
    'model': 'qwen-max-latest',
    'model_type': 'qwen_dashscope',
    # 'api_key': 'YOUR_DASHSCOPE_API_KEY',  # Or use env DASHSCOPE_API_KEY
}

bot = Assistant(
    llm=llm_cfg,
    system_message="You are a helpful assistant.",
    function_list=['code_interpreter']  # Built-in tools
)

messages = [{'role': 'user', 'content': 'Calculate fibonacci of 10'}]

for response in bot.run(messages=messages):
    print(response)
```

### Custom Tool

```python
from qwen_agent.tools.base import BaseTool, register_tool
import json5

@register_tool('my_image_gen')
class MyImageGen(BaseTool):
    description = 'Generate image from text description'
    parameters = [{
        'name': 'prompt',
        'type': 'string',
        'description': 'Image description in English',
        'required': True
    }]

    def call(self, params: str, **kwargs) -> str:
        prompt = json5.loads(params)['prompt']
        return f'https://image.pollinations.ai/prompt/{prompt}'

# Use in agent
bot = Assistant(
    llm=llm_cfg,
    function_list=['my_image_gen', 'code_interpreter']
)
```

### RAG Agent

```python
from qwen_agent.agents import Assistant

bot = Assistant(
    llm=llm_cfg,
    system_message="Answer based on the provided documents.",
    files=['./document.pdf', './data.txt']  # RAG files
)

for response in bot.run(messages=[{'role': 'user', 'content': 'Summarize the document'}]):
    print(response)
```

### GUI Interface

```python
from qwen_agent.agents import Assistant
from qwen_agent.gui import WebUI

bot = Assistant(
    llm=llm_cfg,
    system_message="You are a helpful assistant.",
    function_list=['code_interpreter']
)

WebUI(bot).run()  # Launch Gradio interface at http://localhost:7860
```

## Self-Hosting Deployment

### vLLM (Recommended)

```bash
# Install
pip install vllm>=0.9.0

# Serve Qwen3-Instruct
vllm serve Qwen/Qwen3-8B --port 8000 --max-model-len 131072

# Serve Qwen3-Thinking
vllm serve Qwen/Qwen3-8B --port 8000 --max-model-len 131072 \
    --enable-reasoning --reasoning-parser qwen3

# OpenAI-compatible API at http://localhost:8000/v1
```

### SGLang

```bash
pip install sglang>=0.4.6.post1

# Serve Qwen3-Instruct
python -m sglang.launch_server --model-path Qwen/Qwen3-8B --port 30000 --context-length 131072

# Serve Qwen3-Thinking
python -m sglang.launch_server --model-path Qwen/Qwen3-8B --port 30000 \
    --context-length 131072 --reasoning-parser qwen3
```

### Ollama

```bash
# Install Ollama from ollama.com

# Pull and run
ollama run qwen3:8b

# Or specify size
ollama run qwen3:30b-a3b

# OpenAI-compatible API at http://localhost:11434/v1
```

### llama.cpp

```bash
# CLI
./llama-cli -hf Qwen/Qwen3-8B-GGUF:Q8_0 --jinja --color -ngl 99 -fa \
    --temp 0.6 --top-k 20 --top-p 0.95 -c 40960 -n 32768

# Server (OpenAI-compatible)
./llama-server -hf Qwen/Qwen3-8B-GGUF:Q8_0 --jinja --reasoning-format deepseek \
    -ngl 99 -fa --temp 0.6 --top-k 20 --top-p 0.95 -c 40960 -n 32768 --port 8080
```

## MCP (Model Context Protocol)

Qwen-Agent mendukung MCP untuk ekstensi tools.

```python
from qwen_agent.agents import Assistant

# Configure MCP servers
mcp_servers = {
    "memory": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
}

bot = Assistant(
    llm=llm_cfg,
    mcp_servers=mcp_servers
)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `temperature` | float | 0.7 | Randomness (0-2) |
| `top_p` | float | 0.8 | Nucleus sampling |
| `top_k` | int | 20 | Top-k sampling |
| `max_tokens` | int | - | Max output tokens |
| `stream` | bool | false | Streaming output |
| `stop` | list | - | Stop sequences |

### Recommended Settings

```python
# For Qwen3-Thinking
response = client.chat.completions.create(
    model="qwen3-8b",
    messages=messages,
    temperature=0.6,
    top_p=0.95,
    top_k=20,
    max_tokens=32768
)

# For Qwen3-Instruct
response = client.chat.completions.create(
    model="qwen3-8b",
    messages=messages,
    temperature=0.7,
    top_p=0.8
)
```

## Embeddings

```python
from dashscope import TextEmbedding

response = TextEmbedding.call(
    model='text-embedding-v3',
    input='Hello world',
    dimension=1024  # 1024 or 768
)

print(response.output['embeddings'][0]['embedding'])
```

## Pricing (DashScope)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| qwen-max-latest | $2.00 | $8.00 |
| qwen-plus-latest | $0.40 | $1.20 |
| qwen-turbo-latest | $0.05 | $0.10 |
| qwen2.5-72b-instruct | $0.50 | $2.00 |

*Free tier tersedia dengan limits*

## Tips

1. **Pilih model yang tepat**:
   - `qwen-max-latest` untuk tugas kompleks
   - `qwen-turbo-latest` untuk speed
   - `qwen3-*-thinking` untuk reasoning
   - Self-host untuk kontrol penuh & gratis

2. **Thinking Mode**:
   - Gunakan untuk math, coding, logic
   - Non-thinking untuk chat biasa
   - Qwen3-Thinking-2507 lebih powerful

3. **Long Context**:
   - Qwen3 mendukung 256K (extend ke 1M)
   - Gunakan untuk dokumen panjang

4. **Qwen-Agent**:
   - Untuk complex workflows
   - Support RAG, Code Interpreter, MCP
   - Built-in tool untuk browsing, coding

5. **Self-hosting**:
   - vLLM untuk production
   - Ollama untuk development
   - GGUF untuk CPU/laptop

## Comparison

| Feature | Qwen3 | Qwen2.5 | QwQ |
|---------|-------|---------|-----|
| Thinking Mode | ✅ | ❌ | ✅ |
| Multilingual | 100+ | 29 | 29 |
| Function Calling | ✅ | ✅ | ✅ |
| Vision | ❌ | ✅ (VL) | ❌ |
| Max Context | 256K-1M | 128K | 128K |
| Open Weights | ✅ | ✅ | ✅ |

## Referensi

- [Qwen3 GitHub](https://github.com/QwenLM/Qwen3)
- [Qwen-Agent GitHub](https://github.com/QwenLM/Qwen-Agent)
- [DashScope Docs](https://help.aliyun.com/zh/dashscope/)
- [Documentation](https://qwen.readthedocs.io/)
- [Qwen Chat](https://chat.qwen.ai/)
- [Hugging Face](https://huggingface.co/Qwen)
- [ModelScope](https://modelscope.cn/organization/qwen)
- [Discord](https://discord.gg/CV4E9rpNSD)
