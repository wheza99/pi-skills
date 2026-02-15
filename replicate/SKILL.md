---
name: replicate
description: Skill untuk membantu development dengan Replicate - cloud API untuk menjalankan machine learning models. Gunakan ketika user ingin menjalankan AI models (image generation, text generation, speech, dll), fine-tuning models, atau deploy custom models.
---

# Replicate Development

Skill ini membantu development dengan Replicate, platform cloud API untuk menjalankan machine learning models dengan mudah.

## Setup

### Dapatkan API Token

1. Buat akun di https://replicate.com
2. Generate API token di https://replicate.com/account/api-tokens
3. Set environment variable:

```bash
export REPLICATE_API_TOKEN=r8_...
```

### Install Client Libraries

```bash
# Python
pip install replicate

# Node.js
npm install replicate

# Swift (Swift Package Manager)
# https://github.com/replicate/replicate-swift

# Go
go get github.com/replicate/replicate-go
```

## Quickstart

### Python

```python
import replicate

# Run a model
output = replicate.run(
    "black-forest-labs/flux-schnell",
    input={"prompt": "an iguana on the beach, pointillism"}
)

# Save the generated image
with open('output.png', 'wb') as f:
    f.write(output[0].read())

print("Image saved as output.png")
```

### Node.js

```javascript
import Replicate from "replicate";
const replicate = new Replicate();

const [output] = await replicate.run(
  "black-forest-labs/flux-schnell",
  {
    input: {
      prompt: "An astronaut riding a rainbow unicorn, cinematic, dramatic",
    },
  }
);

// Save the generated image
import { writeFile } from "node:fs/promises";
await writeFile("./output.png", output);
console.log("Image saved as output.png");
```

### Quick Scaffold (Node.js)

```bash
# Scaffold project dengan satu command
npx create-replicate

# Dengan model spesifik
npx create-replicate --model black-forest-labs/flux-schnell
```

## Popular Models

### Image Generation

```python
# FLUX Schnell (fast)
output = replicate.run(
    "black-forest-labs/flux-schnell",
    input={"prompt": "a futuristic cityscape at sunset"}
)

# FLUX Dev (higher quality)
output = replicate.run(
    "black-forest-labs/flux-dev",
    input={"prompt": "a portrait of a cyberpunk character"}
)

# Stable Diffusion
output = replicate.run(
    "stability-ai/stable-diffusion",
    input={"prompt": "a magical forest with glowing mushrooms"}
)
```

### Text Generation (LLMs)

```python
# Llama 3.1 405B
output = replicate.run(
    "meta/meta-llama-3.1-405b-instruct",
    input={"prompt": "Write a poem about technology"}
)

# Llama 3 70B
output = replicate.run(
    "meta/meta-llama-3-70b-instruct",
    input={"prompt": "Explain quantum computing"}
)

# Claude (via Anthropic)
output = replicate.run(
    "anthropic/claude-3.7-sonnet",
    input={"prompt": "Who was Dolly the sheep?"}
)
```

### Vision Models

```python
# LLaVA - Image understanding
image = open("my_fridge.jpg", "rb")
output = replicate.run(
    "yorickvp/llava-13b",
    input={
        "image": image,
        "prompt": "What's in this image?"
    }
)
print(output)
```

## Input Files

### Menggunakan Local Files

```python
# Dengan file lokal
image = open("input.jpg", "rb")
output = replicate.run(
    "yorickvp/llava-13b",
    input={
        "image": image,
        "prompt": "Describe this image"
    }
)
```

### Menggunakan URLs

```python
# Dengan URL (lebih efisien untuk file besar)
image = "https://example.com/image.jpg"
output = replicate.run(
    "yorickvp/llava-13b",
    input={
        "image": image,
        "prompt": "Describe this image"
    }
)
```

## Streaming Output

### Python Streaming

```python
# Untuk LLMs yang mendukung streaming
for event in replicate.stream(
    "meta/meta-llama-3-70b-instruct",
    input={"prompt": "Tell me a story"}
):
    if event.event == "output":
        print(event.data, end="", flush=True)
```

### Node.js Streaming

```javascript
const stream = replicate.stream("meta/meta-llama-3-70b-instruct", {
  input: { prompt: "Tell me a story" },
});

for await (const { event, data } of stream) {
  if (event === "output") {
    process.stdout.write(data);
  }
}
```

## Async & Webhooks

### Async Mode (Default)

```python
# Membuat prediction async
prediction = replicate.predictions.create(
    version="model-version-hash",
    input={"prompt": "Generate something"},
    webhook="https://your-server.com/webhook",
    webhook_events_filter=["completed"]
)

print(f"Prediction ID: {prediction.id}")
```

### Sync Mode

```python
# Menunggu hasil (blocking)
output = replicate.run(
    "model-name",
    input={"prompt": "..."}
)
# Output langsung tersedia
```

### Polling

```python
# Manual polling
prediction = replicate.predictions.create(
    version="model-version-hash",
    input={"prompt": "..."}
)

while prediction.status not in ["succeeded", "failed", "canceled"]:
    prediction = replicate.predictions.get(prediction.id)
    time.sleep(1)

if prediction.status == "succeeded":
    print(prediction.output)
```

## Webhooks

### Setup Webhook

```python
prediction = replicate.predictions.create(
    version="model-version-hash",
    input={"prompt": "..."},
    webhook="https://your-server.com/webhooks/replicate",
    webhook_events_filter=["completed"]
)
```

### Webhook Payload

```json
{
  "id": "prediction-id",
  "status": "succeeded",
  "output": "Hello Alice",
  "metrics": {
    "predict_time": 0.58
  }
}
```

## Deployments

Deployments memberikan control lebih untuk production.

### Features:
- **Hardware flexibility**: Pilih GPU (A100, H100, T4, dll)
- **Auto-scaling**: Scale otomatis berdasarkan traffic
- **Always-on instances**: Eliminate cold starts
- **Zero-downtime deployments**: Update tanpa downtime
- **Private endpoints**: URL yang hanya bisa diakses Anda

### Create Deployment

```bash
# Via dashboard atau API
curl -X POST \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -d '{
    "name": "my-deployment",
    "model": "owner/model-name",
    "hardware": "gpu-a100-large",
    "min_instances": 0,
    "max_instances": 10
  }' \
  https://api.replicate.com/v1/deployments
```

### Run Deployment

```python
output = replicate.deployments.predictions.create(
    deployment_owner="your-username",
    deployment_name="my-deployment",
    input={"prompt": "..."}
)
```

## Fine-Tuning

### Fine-tune FLUX Model

1. **Gather training images** (minimal 10 images, 1024x1024 or higher)
2. **Create zip file**: `zip -r data.zip data/`
3. **Choose trigger word** (unique, bukan kata yang ada)
4. **Run training** via web atau API

### Python Training

```python
training = replicate.trainings.create(
    model="your-username/your-model",
    destination="your-username/destination-model",
    input={
        "input_images": open("data.zip", "rb"),
        "trigger_word": "MY_UNIQUE_TRIGGER",
        "lora_type": "subject",  # atau "style"
        "training_steps": 1000
    }
)
```

### Use Fine-tuned Model

```python
output = replicate.run(
    "your-username/your-finetuned-model",
    input={"prompt": "MY_UNIQUE_TRIGGER as a superhero"}
)
```

## HTTP API

### Base URL

```
https://api.replicate.com/v1
```

### Headers

```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

### Create Prediction

```bash
curl -X POST \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "model-version-hash",
    "input": {"prompt": "Hello world"}
  }' \
  https://api.replicate.com/v1/predictions
```

### Get Prediction

```bash
curl -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  https://api.replicate.com/v1/predictions/PREDICTION_ID
```

### Sync Mode dengan Header

```bash
curl -X POST \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: wait" \
  -d '{
    "version": "model-version-hash",
    "input": {"text": "Alice"}
  }' \
  https://api.replicate.com/v1/predictions
```

### Cancel Prediction

```bash
curl -X POST \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  https://api.replicate.com/v1/predictions/PREDICTION_ID/cancel
```

## Prediction Lifecycle

Status prediksi:
- `starting`: Model sedang dimuat (cold boot)
- `processing`: Prediksi sedang berjalan
- `succeeded`: Berhasil
- `failed`: Gagal
- `canceled`: Dibatalkan

### Warm vs Cold Models

- **Warm**: Model sudah running, response cepat
- **Cold**: Model perlu distart, bisa beberapa menit

Tips: Gunakan deployments untuk keep models warm.

## Rate Limits

- Per-account limits berlaku
- Rate limits bervariasi per model
- Gunakan exponential backoff untuk retry

## Error Handling

```python
import replicate

try:
    output = replicate.run(
        "model-name",
        input={"prompt": "..."}
    )
except replicate.exceptions.ModelError as e:
    print(f"Model error: {e}")
except replicate.exceptions.ReplicateError as e:
    print(f"API error: {e}")
```

## Best Practices

1. **Use async mode** untuk long-running predictions
2. **Implement webhooks** untuk notifikasi completion
3. **Handle cold starts** dengan retry logic
4. **Use deployments** untuk production workloads
5. **Cache outputs** jika memungkinkan
6. **Set deadlines** untuk avoid runaway predictions

```python
# Dengan deadline
prediction = replicate.predictions.create(
    version="...",
    input={...},
    # Cancel setelah 5 menit
)
```

## Useful Links

- Homepage: https://replicate.com
- Explore Models: https://replicate.com/explore
- Playground: https://replicate.com/playground
- API Tokens: https://replicate.com/account/api-tokens
- Pricing: https://replicate.com/pricing
- Status: https://www.replicatestatus.com
- Discord: https://discord.gg/replicate
- YouTube: https://www.youtube.com/@replicatehq
