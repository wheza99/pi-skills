# Diffusers Library Detail

Dokumentasi detail tentang Diffusers library.

## Overview

Diffusers adalah library SOTA pretrained diffusion models untuk generating:
- Videos
- Images
- Audio

## Core Features

### DiffusionPipeline

API yang didesain untuk:
- **Easy inference**: Hanya beberapa baris kode
- **Flexibility**: Mix-and-match pipeline components (models, schedulers)
- **Adapters**: Load dan gunakan LoRA dan adapter lainnya

### Optimizations

- **Offloading**: CPU offloading untuk memory efficiency
- **Quantization**: Reduce memory usage
- **torch.compile**: Boost inference speed

## Available Models

- Stable Diffusion (1.5, 2.0, XL)
- FLUX (dev, schnell)
- Kandinsky
- PixArt
- DeepFloyd IF
- UniDiffuser
- Dan banyak lagi

## Text to Image

### Basic Usage

```python
from diffusers import DiffusionPipeline
import torch

pipeline = DiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16,
    use_safetensors=True,
    variant="fp16"
).to("cuda")

image = pipeline(
    prompt="Astronaut in a jungle, cold color palette",
    num_inference_steps=20
).images[0]
image.save("output.png")
```

### FLUX

```python
from diffusers import FluxPipeline
import torch

pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-dev",
    torch_dtype=torch.bfloat16
)
pipe.enable_model_cpu_offload()

image = pipe(
    prompt="A cat holding a sign that says hello",
    height=1024,
    width=1024,
    num_inference_steps=30,
).images[0]
```

## Image to Image

```python
from diffusers import AutoPipelineForImage2Image
from diffusers.utils import load_image
import torch

pipeline = AutoPipelineForImage2Image.from_pretrained(
    "kandinsky-community/kandinsky-2-2-decoder",
    torch_dtype=torch.float16
).to("cuda")

init_image = load_image("https://example.com/image.png")

image = pipeline(
    prompt="A fantasy landscape",
    image=init_image
).images[0]
```

## Inpainting

```python
from diffusers import AutoPipelineForInpainting
import torch

pipeline = AutoPipelineForInpainting.from_pretrained(
    "runwayml/stable-diffusion-inpainting",
    torch_dtype=torch.float16
).to("cuda")

image = pipeline(
    prompt="A sunflower in a field",
    image=original_image,
    mask_image=mask_image
).images[0]
```

## ControlNet

```python
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
import torch

controlnet = ControlNetModel.from_pretrained(
    "lllyasviel/sd-controlnet-canny",
    torch_dtype=torch.float16
)

pipeline = StableDiffusionControlNetPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    controlnet=controlnet,
    torch_dtype=torch.float16
).to("cuda")

image = pipeline(
    prompt="A modern house",
    image=canny_edge_image
).images[0]
```

## LoRA Adapters

```python
from diffusers import DiffusionPipeline
import torch

pipe = DiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16
).to("cuda")

# Load LoRA weights
pipe.load_lora_weights("path/to/lora")

# Generate with LoRA
image = pipe(
    "prompt with lora style",
    cross_attention_kwargs={"scale": 0.8}
).images[0]
```

## Memory Optimizations

### Model CPU Offload

```python
# Offload ke CPU saat tidak digunakan
pipe.enable_model_cpu_offload()
```

### Attention Slicing

```python
# Reduce memory untuk attention
pipe.enable_attention_slicing()
```

### VAE Slicing

```python
# Process VAE one image at a time
pipe.enable_vae_slicing()
```

### Sequential CPU Offload

```python
# Aggressive offloading
pipe.enable_sequential_cpu_offload()
```

### Quantization

```python
from diffusers import BitsAndBytesConfig, DiffusionPipeline

# 8-bit quantization
quantization_config = BitsAndBytesConfig(load_in_8bit=True)

pipe = DiffusionPipeline.from_pretrained(
    "model-name",
    quantization_config=quantization_config,
    torch_dtype=torch.float16
)
```

## Schedulers

Diffusers mendukung berbagai schedulers:

| Scheduler | Description |
|-----------|-------------|
| DDIMScheduler | Denoising Diffusion Implicit Models |
| DDPMScheduler | Denoising Diffusion Probabilistic Models |
| EulerDiscreteScheduler | Euler scheduler |
| EulerAncestralDiscreteScheduler | Euler ancestral |
| DPMSolverMultistepScheduler | DPM-Solver++ |
| LMSDiscreteScheduler | Linear Multistep |
| PNDMScheduler | Pseudo Numerical Methods |

### Change Scheduler

```python
from diffusers import EulerDiscreteScheduler

pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config)
```

## Video Generation

```python
from diffusers import DiffusionPipeline
import torch

pipe = DiffusionPipeline.from_pretrained(
    "damo-vilab/text-to-video-ms-1.7b",
    torch_dtype=torch.float16
).to("cuda")

video_frames = pipe("A cat playing piano").frames[0]
```

## Audio Generation

```python
from diffusers import AudioLDMPipeline
import torch

pipe = AudioLDMPipeline.from_pretrained(
    "cvssp/audioldm",
    torch_dtype=torch.float16
).to("cuda")

audio = pipe("A piano playing classical music").audios[0]
```

## torch.compile

```python
pipe = DiffusionPipeline.from_pretrained("model-name").to("cuda")

# Compile untuk speedup
pipe.unet = torch.compile(pipe.unet, mode="reduce-overhead", fullgraph=True)

# Generate
image = pipe("prompt").images[0]
```

## Resources

- [Diffusion Course](https://huggingface.co/learn/diffusers-course)
- [Diffusers Docs](https://huggingface.co/docs/diffusers)
- [Hub Models](https://huggingface.co/models?library=diffusers)
