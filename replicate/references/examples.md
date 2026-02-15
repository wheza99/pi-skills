# Replicate Code Examples

Kumpulan contoh kode untuk berbagai use case dengan Replicate API.

## Image Generation Examples

### FLUX Schnell (Fast Generation)

```python
import replicate

output = replicate.run(
    "black-forest-labs/flux-schnell",
    input={
        "prompt": "A cyberpunk city at night with neon lights",
        "go_fast": True,
        "num_outputs": 1,
        "aspect_ratio": "16:9",
        "output_format": "webp",
        "output_quality": 90,
    }
)

# Save image
import requests
response = requests.get(output[0])
with open("cyberpunk_city.webp", "wb") as f:
    f.write(response.content)
```

### FLUX Dev (High Quality)

```python
output = replicate.run(
    "black-forest-labs/flux-dev",
    input={
        "prompt": "A photorealistic portrait of a woman in golden hour lighting",
        "guidance": 3.5,
        "num_outputs": 1,
        "aspect_ratio": "3:4",
        "output_format": "png",
        "num_inference_steps": 28,
        "prompt_strength": 0.8,
    }
)
```

### Stable Diffusion XL

```python
output = replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    input={
        "prompt": "A mystical forest with glowing mushrooms",
        "negative_prompt": "blurry, low quality, distorted",
        "width": 1024,
        "height": 1024,
        "scheduler": "K_EULER_ANCESTRAL",
        "num_inference_steps": 30,
        "guidance_scale": 7.5,
        "refine": "expert_ensemble_refiner",
    }
)
```

### SDXL with LoRA

```python
output = replicate.run(
    "stability-ai/sdxl",
    input={
        "prompt": "a person in style of <s0><s1>",
        "negative_prompt": "blurry, low quality",
        "lora_weights": "https://civitai.com/api/download/models/12345",
        "lora_scale": 0.8,
    }
)
```

### Image with ControlNet

```python
output = replicate.run(
    "stability-ai/sdxl-controlnet",
    input={
        "prompt": "A modern living room",
        "control_image": "https://example.com/sketch.png",
        "control_type": "canny",
        "num_inference_steps": 30,
    }
)
```

## Video Generation

### Minimax Video

```python
output = replicate.run(
    "minimax/video-01",
    input={
        "prompt": "A golden retriever running through a meadow",
        "prompt_optimizer": True,
    }
)

# Save video
import requests
response = requests.get(output[0])
with open("dog_video.mp4", "wb") as f:
    f.write(response.content)
```

### Image to Video

```python
output = replicate.run(
    "stability-ai/stable-video-diffusion",
    input={
        "input_image": "https://example.com/image.jpg",
        "frames_per_second": 14,
        "motion_bucket_id": 127,
        "cond_aug": 0.02,
    }
)
```

## Audio Generation

### Music Generation (MusicGen)

```python
output = replicate.run(
    "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcfbfdfeab3f590d108f1e3ad88a2a2a9c",
    input={
        "prompt": "Upbeat electronic dance music with synthesizers",
        "model_version": "stereo-large",
        "output_format": "mp3",
        "duration": 30,
        "temperature": 1.0,
        "guidance_scale": 3.0,
        "top_k": 250,
    }
)

# Save audio
import requests
response = requests.get(output)
with open("edm_track.mp3", "wb") as f:
    f.write(response.content)
```

### Text to Speech (Bark)

```python
output = replicate.run(
    "suno-ai/bark:769d0b22e7b13c4d6f6f20ab91854f00d2908db9e178740e07d0c650d1bce7e9",
    input={
        "prompt": "Hello! Welcome to our podcast.",
        "text_temp": 0.7,
        "waveform_temp": 0.7,
    }
)
```

## Image Enhancement

### CodeFormer (Face Restoration)

```python
output = replicate.run(
    "sczhou/codeformer:0fbf44c4e55e83af6e9f2e5a5b5c5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5",
    input={
        "image": "https://example.com/old_photo.jpg",
        "codeformer_fidelity": 0.8,
        "background_enhance": True,
        "face_upsample": True,
        "upscale": 2,
    }
)
```

### Clarity Upscaler

```python
output = replicate.run(
    "philz1337x/clarity-upscaler",
    input={
        "image": "https://example.com/low_res.jpg",
        "scale": 4,
        "face_enhance": True,
        "output_format": "png",
    }
)
```

### Background Removal

```python
output = replicate.run(
    "stability-ai/stable-diffusion-inpainting",
    input={
        "image": "https://example.com/photo.jpg",
        "mask_image": "https://example.com/mask.png",
        "prompt": "clean white background",
    }
)
```

## Text/LLM Examples

### Llama 3 Chat

```python
output = replicate.run(
    "meta/meta-llama-3-70b-instruct",
    input={
        "prompt": "Explain quantum computing in simple terms",
        "system_prompt": "You are a helpful teacher who explains complex topics simply.",
        "max_tokens": 500,
        "temperature": 0.7,
        "top_p": 0.9,
    }
)

print(output)
```

### Streaming LLM Output

```python
for event in replicate.stream(
    "meta/meta-llama-3-70b-instruct",
    input={
        "prompt": "Write a short story about a robot",
    }
):
    print(str(event), end="", flush=True)
```

### Mixtral Chat

```python
output = replicate.run(
    "mistralai/mixtral-8x7b-instruct-v0.1",
    input={
        "prompt": "<s>[INST] What is machine learning? [/INST]",
        "max_tokens": 300,
        "temperature": 0.5,
    }
)
```

## Fine-tuning Examples

### Fine-tune FLUX on Custom Images

```python
# Step 1: Create training
training = replicate.trainings.create(
    version="black-forest-labs/flux-dev:your-version-hash",
    input={
        "input_images": "https://your-bucket.s3.amazonaws.com/training_images.zip",
        "steps": 1000,
        "learning_rate": 0.0001,
    },
    destination="your-username/your-finetuned-model",
)

print(f"Training ID: {training.id}")

# Step 2: Monitor training
import time
while training.status not in ["succeeded", "failed", "canceled"]:
    time.sleep(10)
    training = replicate.trainings.get(training.id)
    print(f"Status: {training.status}")

# Step 3: Use fine-tuned model
if training.status == "succeeded":
    output = replicate.run(
        f"your-username/your-finetuned-model:{training.output.version}",
        input={
            "prompt": "Photo of a person in custom style",
        }
    )
```

### Create Training with Webhook

```python
training = replicate.trainings.create(
    version="model-version-hash",
    input={
        "input_images": "https://example.com/images.zip",
    },
    destination="username/model-name",
    webhook="https://your-server.com/webhook/training-complete",
    webhook_events_filter=["completed"],
)
```

## Webhook Examples

### Flask Webhook Handler

```python
from flask import Flask, request, jsonify
import hashlib
import hmac

app = Flask(__name__)
WEBHOOK_SECRET = "your-webhook-secret"

def verify_webhook(data, signature):
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        data,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)

@app.route("/webhook", methods=["POST"])
def webhook():
    signature = request.headers.get("webhook-signature")
    
    if not verify_webhook(request.data, signature):
        return jsonify({"error": "Invalid signature"}), 401
    
    payload = request.json
    prediction_id = payload["id"]
    status = payload["status"]
    
    if status == "succeeded":
        output = payload["output"]
        # Process successful prediction
        print(f"Prediction {prediction_id} succeeded: {output}")
    elif status == "failed":
        error = payload.get("error")
        print(f"Prediction {prediction_id} failed: {error}")
    
    return jsonify({"received": True})

if __name__ == "__main__":
    app.run(port=5000)
```

### Next.js API Route Webhook

```typescript
// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.REPLICATE_WEBHOOK_SECRET!;

function verifyWebhook(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('webhook-signature') || '';
  const payload = await request.text();
  
  if (!verifyWebhook(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const data = JSON.parse(payload);
  
  // Handle the webhook
  if (data.status === 'succeeded') {
    console.log('Prediction succeeded:', data.output);
    // Save to database, send notification, etc.
  }
  
  return NextResponse.json({ received: true });
}
```

## Async & Batch Processing

### Async Image Generation

```python
import asyncio
import replicate

async def generate_image(prompt: str) -> str:
    output = await replicate.async_run(
        "black-forest-labs/flux-schnell",
        input={"prompt": prompt}
    )
    return output[0]

async def batch_generate(prompts: list[str]) -> list[str]:
    tasks = [generate_image(p) for p in prompts]
    return await asyncio.gather(*tasks)

# Usage
async def main():
    prompts = [
        "A sunset over mountains",
        "A futuristic city",
        "A peaceful garden",
    ]
    results = await batch_generate(prompts)
    for prompt, url in zip(prompts, results):
        print(f"{prompt}: {url}")

asyncio.run(main())
```

### Long-running Prediction with Polling

```python
import time

def run_long_prediction(model: str, input_data: dict, timeout: int = 300):
    # Create prediction
    prediction = replicate.predictions.create(
        version=model,
        input=input_data,
    )
    
    print(f"Created prediction: {prediction.id}")
    
    # Poll until complete
    start_time = time.time()
    while prediction.status not in ["succeeded", "failed", "canceled"]:
        if time.time() - start_time > timeout:
            replicate.predictions.cancel(prediction.id)
            raise TimeoutError("Prediction timed out")
        
        time.sleep(2)
        prediction = replicate.predictions.get(prediction.id)
        print(f"Status: {prediction.status}")
    
    if prediction.status == "succeeded":
        return prediction.output
    else:
        raise Exception(f"Prediction failed: {prediction.error}")

# Usage
result = run_long_prediction(
    "video-model-version",
    {"prompt": "A dancing robot"}
)
```

## Error Handling

```python
import replicate
from replicate.exceptions import ReplicateError
import time

def run_with_retry(model: str, input_data: dict, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            return replicate.run(model, input=input_data)
        except ReplicateError as e:
            if e.status_code == 429:  # Rate limit
                wait_time = 60
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            elif e.status_code >= 500:  # Server error
                wait_time = 2 ** attempt
                print(f"Server error. Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise
    
    raise Exception("Max retries exceeded")

# Usage
try:
    result = run_with_retry(
        "black-forest-labs/flux-schnell",
        {"prompt": "test image"}
    )
except Exception as e:
    print(f"Failed to generate: {e}")
```

## Next.js Integration

### API Route for Image Generation

```typescript
// app/api/generate/route.ts
import Replicate from 'replicate';
import { NextResponse } from 'next/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt,
          go_fast: true,
          num_outputs: 1,
        }
      }
    ) as string[];
    
    return NextResponse.json({ image: output[0] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
```

### React Component

```tsx
'use client';

import { useState } from 'react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setImage(data.image);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
        className="w-full p-2 border rounded"
      />
      <button
        onClick={generate}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {image && (
        <img src={image} alt="Generated" className="mt-4 max-w-full" />
      )}
    </div>
  );
}
```

## Deployment Examples

### Create and Use Deployment

```python
# Create deployment
deployment = replicate.deployments.create(
    name="my-flux-deployment",
    model="black-forest-labs/flux-schnell",
    version="latest-version-hash",
    hardware="gpu-a100-large",
    min_instances=0,
    max_instances=5,
)

print(f"Created deployment: {deployment.name}")

# Run prediction on deployment
prediction = deployment.predictions.create(
    input={"prompt": "A beautiful landscape"}
)

prediction.wait()
print(prediction.output)
```

### List and Manage Deployments

```python
# List all deployments
deployments = replicate.deployments.list()
for d in deployments:
    print(f"{d.name}: {d.current_release}")

# Get specific deployment
deployment = replicate.deployments.get("username/deployment-name")

# Update deployment
deployment.update(
    hardware="gpu-h100",
    min_instances=1,
)

# Delete deployment
replicate.deployments.delete("username/deployment-name")
```
