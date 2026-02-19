---
name: huggingface
description: Skill untuk menggunakan Hugging Face platform - akses ke Hub (models, datasets, Spaces), Inference Providers (200k+ models), Inference Endpoints, Transformers, Diffusers, PEFT, Accelerate, TRL, dan library ML lainnya. Gunakan untuk download/upload models, inference, training, fine-tuning, dan deployment.
---

# Hugging Face

Skill untuk bekerja dengan Hugging Face platform - platform ML terbesar dengan 2M+ models, 500k+ datasets, dan 1M+ Spaces.

## Setup

```bash
# Install Hugging Face libraries
pip install huggingface_hub transformers datasets diffusers peft accelerate trl

# Login ke Hugging Face (diperlukan untuk private repos dan upload)
huggingface-cli login
# atau
hf auth login
```

### Virtual Environment (Recommended)

```bash
# Using uv (fast Rust-based package manager)
uv venv .env
source .env/bin/activate  # Linux/Mac
# or
.env\Scripts\activate  # Windows

uv pip install transformers
```

### GPU Support

```bash
# Check NVIDIA GPU
nvidia-smi

# Install PyTorch with CUDA
pip install torch --index-url https://download.pytorch.org/whl/cu121
pip install transformers
```

### CPU Only

```bash
uv pip install torch --index-url https://download.pytorch.org/whl/cpu
uv pip install transformers
```

### Test Installation

```bash
python -c "from transformers import pipeline; print(pipeline('sentiment-analysis')('hugging face is the best'))"
# [{'label': 'POSITIVE', 'score': 0.9998704791069031}]
```

## Environment Variables

```bash
# Set token sebagai environment variable
export HF_TOKEN="hf_xxxxxxxxxxxx"

# Cache directory (default: ~/.cache/huggingface/hub)
export HF_HUB_CACHE="/path/to/cache"

# Offline mode
export HF_HUB_OFFLINE=1
```

Dapatkan token dari: https://huggingface.co/settings/tokens

---

## 🤗 Hugging Face Hub

Platform untuk hosting models, datasets, dan Spaces dengan 2M+ models, 500k+ datasets, dan 1M+ Spaces.

### Key Features

- **Git-based repositories**: Version control, commit history, diffs, branches
- **Xet storage**: Efficient storage for large files with intelligent chunking
- **Model Cards**: Documentation with limitations, biases, and usage examples
- **Inference API**: Serverless API for running models
- **Dataset Viewer**: Preview datasets directly in browser
- **Webhooks & Collections**: Automation and organization

### Download Model

```python
from transformers import AutoModel, AutoTokenizer

# Download model dan tokenizer
model = AutoModel.from_pretrained("bert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# Untuk model gated (perlu akses)
model = AutoModel.from_pretrained("meta-llama/Llama-3.1-8B", token=HF_TOKEN)

# Optimized loading
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B",
    dtype="auto",           # Load in stored dtype
    device_map="auto"       # Auto-distribute to fastest device
)
```

### Upload Model

```python
from huggingface_hub import HfApi

api = HfApi()

# Create repo
api.create_repo(repo_id="my-user/my-model", repo_type="model")

# Upload file
api.upload_file(
    path_or_fileobj="path/to/model.bin",
    path_in_repo="model.bin",
    repo_id="my-user/my-model",
    repo_type="model"
)

# Upload folder
api.upload_folder(
    folder_path="path/to/model",
    repo_id="my-user/my-model"
)
```

### Download/Upload dengan huggingface_hub

```python
from huggingface_hub import hf_hub_download, snapshot_download

# Download file tunggal
file_path = hf_hub_download(
    repo_id="bert-base-uncased",
    filename="config.json"
)

# Download seluruh repo
repo_path = snapshot_download(
    repo_id="stabilityai/stable-diffusion-xl-base-1.0"
)

# Download for offline use
snapshot_download(repo_id="meta-llama/Llama-2-7b-hf", repo_type="model")
```

### Offline Mode

```python
# Set environment variable
import os
os.environ["HF_HUB_OFFLINE"] = "1"

# Or use local_files_only
from transformers import LlamaForCausalLM

model = LlamaForCausalLM.from_pretrained(
    "./path/to/local/directory",
    local_files_only=True
)
```

### Datasets

```python
from datasets import load_dataset

# Load dataset dari Hub
dataset = load_dataset("imdb")
dataset = load_dataset("wikipedia", "20220301.en")

# Streaming untuk dataset besar
dataset = load_dataset("bigscience/P3", streaming=True)

# Upload dataset
dataset.push_to_hub("my-user/my-dataset")
```

---

## 🔧 Transformers Library

State-of-the-art ML models untuk PyTorch. 1M+ model checkpoints tersedia di Hub.

### Core Features

- **Pipeline**: Simple inference untuk banyak ML tasks
- **Trainer**: Complete training loop dengan mixed precision, torch.compile, FlashAttention
- **generate()**: Fast text generation dengan multiple decoding strategies
- **AutoClass**: Auto-detect model architecture dari checkpoint

### Three Base Classes

| Class | Description |
|-------|-------------|
| `PreTrainedConfig` | Model attributes (attention heads, vocab size, etc.) |
| `PreTrainedModel` | Model architecture, returns raw hidden states |
| `Preprocessor` | Convert raw inputs to tensors (Tokenizer, ImageProcessor) |

### AutoClass API

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model dan tokenizer
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-hf")

# Tokenize
model_inputs = tokenizer(["The secret to baking a good cake is "], return_tensors="pt").to(model.device)

# Generate
generated_ids = model.generate(**model_inputs, max_length=30)
tokenizer.batch_decode(generated_ids)[0]
```

### Pipeline (Easy Inference)

Pipeline adalah cara paling mudah untuk inference dengan pretrained model.

#### Text Tasks

```python
from transformers import pipeline

# Sentiment Analysis
classifier = pipeline("sentiment-analysis")
result = classifier("I love Hugging Face!")
# [{'label': 'POSITIVE', 'score': 0.9998}]

# Text Generation
generator = pipeline("text-generation", model="google/gemma-2-2b")
result = generator("the secret to baking a good cake is ")
# [{'generated_text': 'the secret to baking a good cake is 1. the right ingredients...'}]

# Question Answering
qa = pipeline("question-answering")
result = qa(
    question="What is Hugging Face?",
    context="Hugging Face is a company that provides ML tools..."
)

# Summarization
summarizer = pipeline("summarization", model="google/pegasus-billsum")
result = summarizer(long_text, max_length=130, min_length=30)

# Translation
translator = pipeline("translation_en_to_fr")
result = translator("Hello, how are you?")

# Zero-Shot Classification
classifier = pipeline("zero-shot-classification")
result = classifier(
    "This is a tutorial about machine learning",
    candidate_labels=["education", "politics", "technology"]
)

# Named Entity Recognition
ner = pipeline("ner", grouped_entities=True)
result = ner("Apple was founded by Steve Jobs in California.")

# Fill-Mask (BERT-style)
unmasker = pipeline("fill-mask")
result = unmasker("Hugging Face is a <mask> company.")
```

#### Audio Tasks

```python
from transformers import pipeline

# Automatic Speech Recognition with timestamps
asr = pipeline("automatic-speech-recognition", model="openai/whisper-large-v3")
result = asr("audio.flac", return_timestamps="word")
# Returns text + word-level timestamps

# Audio Classification
classifier = pipeline("audio-classification")
result = classifier("audio.wav")
```

#### Vision Tasks

```python
from transformers import pipeline

# Image Classification
classifier = pipeline("image-classification")
result = classifier("path/to/image.jpg")

# Visual Question Answering
vqa = pipeline("visual-question-answering")
result = vqa(image="image.jpg", question="What is in this image?")

# Image Segmentation
segmenter = pipeline("image-segmentation")
result = segmenter("image.jpg")
```

### Pipeline Parameters

```python
from transformers import pipeline
from accelerate import Accelerator

# Device selection
device = Accelerator().device
pipe = pipeline("text-generation", model="google/gemma-2-2b", device=device)

# GPU by ID
pipe = pipeline("text-generation", model="google/gemma-2-2b", device=0)

# Auto device mapping (multi-GPU)
pipe = pipeline("text-generation", model="google/gemma-2-2b", device_map="auto")

# Batch inference
pipe = pipeline(
    "text-generation",
    model="google/gemma-2-2b",
    device=device,
    batch_size=2
)
pipe(["input 1", "input 2", "input 3", "input 4"])

# Half precision
import torch
pipe = pipeline(
    model="google/gemma-7b",
    torch_dtype=torch.bfloat16,
    device_map="auto"
)
```

### Large Datasets with Pipeline

```python
from transformers.pipelines.pt_utils import KeyDataset
from transformers import pipeline
from datasets import load_dataset

dataset = load_dataset("imdb", split="unsupervised")
pipe = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english", device=0)

for out in pipe(KeyDataset(dataset, "text"), batch_size=8, truncation="only_first"):
    print(out)
```

### Trainer (Training Loop)

Trainer adalah complete training dan evaluation loop untuk PyTorch models.

```python
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
    DataCollatorWithPadding
)
from datasets import load_dataset

# Load model, tokenizer, dataset
model = AutoModelForSequenceClassification.from_pretrained("distilbert/distilbert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("distilbert/distilbert-base-uncased")
dataset = load_dataset("rotten_tomatoes")

# Tokenize dataset
def tokenize_dataset(dataset):
    return tokenizer(dataset["text"])
dataset = dataset.map(tokenize_dataset, batched=True)

# Data collator
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# Training arguments
training_args = TrainingArguments(
    output_dir="distilbert-rotten-tomatoes",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=2,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    push_to_hub=True,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
    processing_class=tokenizer,
    data_collator=data_collator,
)

# Train
trainer.train()

# Push to Hub
trainer.push_to_hub()
```

### Training Optimizations

```python
from transformers import TrainingArguments

# torch.compile for faster training
training_args = TrainingArguments(
    torch_compile=True,
    torch_compile_backend="inductor",
    torch_compile_mode="default",
    ...
)

# NEFTune for better model performance
training_args = TrainingArguments(
    neftune_noise_alpha=0.1,
    ...
)

# Liger Kernel for LLM training
training_args = TrainingArguments(
    use_liger_kernel=True,
    liger_kernel_config={
        "rope": True,
        "cross_entropy": True,
        "rms_norm": True,
    }
)

# GaLore for memory-efficient training
from trl import SFTConfig, SFTTrainer

args = SFTConfig(
    optim="galore_adamw",
    optim_target_modules=[r".*.attn.*", r".*.mlp.*"],
    optim_args="rank=64, update_proj_gap=100, scale=0.10",
    gradient_checkpointing=True,
)
```

### Custom Trainer

```python
from torch import nn
from transformers import Trainer

class CustomTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False, num_items_in_batch=None):
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        logits = outputs.get("logits")
        
        # Custom weighted loss
        loss_fct = nn.CrossEntropyLoss(weight=torch.tensor([1.0, 2.0, 3.0], device=model.device))
        loss = loss_fct(logits.view(-1, self.model.config.num_labels), labels.view(-1))
        
        return (loss, outputs) if return_outputs else loss
```

### Callbacks

```python
from transformers import TrainerCallback

class EarlyStoppingCallback(TrainerCallback):
    def __init__(self, num_steps=10):
        self.num_steps = num_steps

    def on_step_end(self, args, state, control, **kwargs):
        if state.global_step >= self.num_steps:
            return {"should_training_stop": True}
        return {}

trainer = Trainer(
    ...,
    callbacks=[EarlyStoppingCallback()],
)
```

---

## 🎨 Diffusers (Image/Video/Audio Generation)

State-of-the-art diffusion models untuk generating videos, images, dan audio.

### Core Features

- **DiffusionPipeline**: Easy inference dengan beberapa baris kode
- **Mix-and-match components**: Combine different models dan schedulers
- **Adapters**: LoRA dan lainnya
- **Optimizations**: Offloading, quantization untuk memory-constrained devices
- **torch.compile**: Boost inference speed

### Text to Image

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

### FLUX (State-of-the-Art)

```python
from diffusers import FluxPipeline
import torch

pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-dev", torch_dtype=torch.bfloat16)
pipe.enable_model_cpu_offload()

image = pipe(
    prompt="A serene lake surrounded by mountains at sunset, photorealistic style",
    height=1024,
    width=1024,
    num_inference_steps=30,
).images[0]
image.save("flux_output.png")
```

### Image to Image

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

### Inpainting

```python
from diffusers import AutoPipelineForInpainting
import torch

pipeline = AutoPipelineForInpainting.from_pretrained(
    "runwayml/stable-diffusion-inpainting",
    torch_dtype=torch.float16
).to("cuda")

image = pipeline(
    prompt="A sunflower",
    image=original_image,
    mask_image=mask_image
).images[0]
```

### ControlNet

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

### LoRA Adapters

```python
from diffusers import DiffusionPipeline
import torch

pipe = DiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16
).to("cuda")

# Load LoRA
pipe.load_lora_weights("path/to/lora")

image = pipe("prompt", cross_attention_kwargs={"scale": 0.8}).images[0]
```

### Memory Optimizations

```python
# CPU offloading
pipe.enable_model_cpu_offload()

# Attention slicing
pipe.enable_attention_slicing()

# VAE slicing
pipe.enable_vae_slicing()

# Sequential CPU offloading
pipe.enable_sequential_cpu_offload()

# 8-bit quantization
from diffusers import BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(load_in_8bit=True)
pipe = DiffusionPipeline.from_pretrained(
    "model-name",
    quantization_config=quantization_config
)
```

---

## 🚀 Inference Providers

Akses 200k+ models dari berbagai providers melalui satu API.

### Chat Completion (LLM)

```python
from huggingface_hub import InferenceClient

client = InferenceClient()

# Chat completion
completion = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(completion.choices[0].message.content)

# Streaming
for chunk in client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Hello!"}],
    stream=True
):
    print(chunk.choices[0].delta.content, end="")

# Pilih provider spesifik
completion = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Hello!"}],
    provider="sambanova"  # atau "together", "groq", "replicate", dll
)
```

### Text to Image

```python
from huggingface_hub import InferenceClient

client = InferenceClient()

image = client.text_to_image(
    prompt="A serene lake at sunset, photorealistic",
    model="black-forest-labs/FLUX.1-dev"
)
image.save("generated.png")
```

### Embeddings

```python
from huggingface_hub import InferenceClient

client = InferenceClient()

embedding = client.feature_extraction(
    text="Hello world",
    model="sentence-transformers/all-MiniLM-L6-v2"
)
```

### Provider Selection Policy

```python
# :fastest - throughput tertinggi (default)
# :cheapest - harga terendah per token
# :preferred - sesuai preferensi di settings

client.chat.completions.create(
    model="deepseek-ai/DeepSeek-R1:cheapest",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### OpenAI-Compatible API

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN
)

completion = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-R1:fastest",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Available Providers

| Provider | Chat | VLM | Embeddings | Text2Img | Video | Speech |
|----------|------|-----|------------|----------|-------|--------|
| HF Inference | ✅ | ✅ | ✅ | ✅ |  | ✅ |
| SambaNova | ✅ |  | ✅ |  |  |  |
| Together | ✅ | ✅ |  | ✅ |  |  |
| Groq | ✅ | ✅ |  |  |  |  |
| Replicate |  |  |  | ✅ | ✅ | ✅ |
| Fal AI |  |  |  | ✅ | ✅ | ✅ |
| Cohere | ✅ | ✅ |  |  |  |  |
| Cerebras | ✅ |  |  |  |  |  |
| Fireworks | ✅ | ✅ |  |  |  |  |

---

## 📊 Datasets Library

Akses ribuan datasets untuk ML.

### Load Dataset

```python
from datasets import load_dataset

# Dari Hub
dataset = load_dataset("imdb")
dataset = load_dataset("wikipedia", "20220301.en")
dataset = load_dataset("imagefolder", data_dir="path/to/images")

# CSV/JSON lokal
dataset = load_dataset("csv", data_files="my_file.csv")
dataset = load_dataset("json", data_files="my_file.json")

# Multiple files
dataset = load_dataset("csv", data_files={
    "train": "train.csv",
    "test": "test.csv"
})
```

### Process Dataset

```python
# Map function
dataset = dataset.map(lambda x: {"text_length": len(x["text"])})

# Filter
dataset = dataset.filter(lambda x: x["text_length"] > 100)

# Shuffle
dataset = dataset.shuffle(seed=42)

# Train/test split
dataset = dataset.train_test_split(test_size=0.1)

# Select columns
dataset = dataset.select_columns(["text", "label"])

# Rename column
dataset = dataset.rename_column("text", "content")
```

### Streaming Large Datasets

```python
# Streaming untuk dataset besar
dataset = load_dataset("bigscience/P3", streaming=True)

for example in dataset["train"]:
    print(example)
    break
```

### Push to Hub

```python
dataset.push_to_hub("my-user/my-dataset", private=True)
```

---

## 🏋️ PEFT (Parameter-Efficient Fine-Tuning)

Fine-tuning efisien untuk LLM.

### LoRA Fine-Tuning

```python
from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM

# Load base model
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B")

# LoRA config
peft_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    inference_mode=False,
    r=8,
    lora_alpha=32,
    lora_dropout=0.1
)

# Apply LoRA
model = get_peft_model(model, peft_config)
model.print_trainable_parameters()
# trainable params: 2,097,152 || all params: 6,771,937,280 || trainable%: 0.03
```

### QLoRA (4-bit Quantization)

```python
from transformers import BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

# 4-bit quantization
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B",
    quantization_config=bnb_config
)

# LoRA on top of quantized model
peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, peft_config)
```

---

## ⚡ Accelerate

Training dengan multi-GPU, TPU, mixed precision.

### Basic Usage

```python
from accelerate import Accelerator

accelerator = Accelerator()

# Prepare everything
model, optimizer, train_dataloader, eval_dataloader = accelerator.prepare(
    model, optimizer, train_dataloader, eval_dataloader
)

# Training loop
for batch in train_dataloader:
    outputs = model(**batch)
    loss = outputs.loss
    accelerator.backward(loss)
    optimizer.step()
    optimizer.zero_grad()
```

### Launch Script

```bash
# Configure
accelerate config

# Single node multi-GPU
accelerate launch train.py

# Multi-node
accelerate launch --num_processes 8 train.py
```

### Distributed Training Config

```yaml
# config_file.yaml
compute_environment: LOCAL_MACHINE
distributed_type: MULTI_GPU
gpu_ids: all
mixed_precision: fp16
num_machines: 2
num_processes: 8
```

```bash
accelerate launch --config_file config_file.yaml train.py
```

---

## 🤖 TRL (Transformer Reinforcement Learning)

Training LLM dengan RL.

### SFT (Supervised Fine-Tuning)

```python
from trl import SFTTrainer
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B")

trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    tokenizer=tokenizer,
    max_seq_length=512,
)

trainer.train()
```

### DPO (Direct Preference Optimization)

```python
from trl import DPOTrainer

trainer = DPOTrainer(
    model=model,
    ref_model=ref_model,
    train_dataset=preference_dataset,
    tokenizer=tokenizer,
)

trainer.train()
```

### GaLore with SFTTrainer

```python
import datasets
from trl import SFTConfig, SFTTrainer

train_dataset = datasets.load_dataset('imdb', split='train')

args = SFTConfig(
    output_dir="./test-galore",
    max_steps=100,
    optim="galore_adamw",
    optim_target_modules=[r".*.attn.*", r".*.mlp.*"],
    optim_args="rank=64, update_proj_gap=100, scale=0.10",
    gradient_checkpointing=True,
)

trainer = SFTTrainer(
    model="google/gemma-2b",
    args=args,
    train_dataset=train_dataset,
)
trainer.train()
```

---

## 🌐 JavaScript/TypeScript SDK

### Installation

```bash
npm install @huggingface/inference @huggingface/hub
```

### Inference

```typescript
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

// Chat completion
const chat = await client.chatCompletion({
  model: "meta-llama/Llama-3.1-8B-Instruct",
  messages: [{ role: "user", content: "Hello!" }],
  max_tokens: 512
});

// Streaming
for await (const chunk of client.chatCompletionStream({
  model: "meta-llama/Llama-3.1-8B-Instruct",
  messages: [{ role: "user", content: "Hello!" }],
})) {
  console.log(chunk.choices[0].delta.content);
}

// Text to image
const image = await client.textToImage({
  model: "black-forest-labs/FLUX.1-dev",
  inputs: "A sunset over mountains"
});

// Embeddings
const embedding = await client.featureExtraction({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  inputs: "Hello world"
});
```

### Hub Operations

```typescript
import { createRepo, uploadFile, deleteFiles } from "@huggingface/hub";

// Create repo
await createRepo({
  repo: "my-user/my-model",
  accessToken: HF_TOKEN
});

// Upload file
await uploadFile({
  repo: "my-user/my-model",
  accessToken: HF_TOKEN,
  file: {
    path: "model.bin",
    content: new Blob([...])
  }
});
```

### MCP Client (Agents)

```typescript
import { Agent } from '@huggingface/mcp-client';

const agent = new Agent({
  provider: "auto",
  model: "Qwen/Qwen2.5-72B-Instruct",
  apiKey: HF_TOKEN,
  servers: [
    { command: "npx", args: ["@playwright/mcp@latest"] }
  ]
});

await agent.loadTools();

for await (const chunk of agent.run("Search for trending models")) {
  if ("choices" in chunk) {
    console.log(chunk.choices[0]?.delta?.content);
  }
}
```

---

## 🔐 Authentication & Security

### Token Types

1. **Read tokens**: Untuk download model/dataset public
2. **Write tokens**: Untuk upload ke repos Anda
3. **Fine-grained tokens**: Permissions spesifik (recommended)

### Create Token

```
https://huggingface.co/settings/tokens
```

### Use in Code

```python
# Option 1: Login via CLI
huggingface-cli login

# Option 2: Environment variable
import os
os.environ["HF_TOKEN"] = "hf_xxx"

# Option 3: Pass directly
model = AutoModel.from_pretrained("private-model", token="hf_xxx")

# Option 4: Notebook login
from huggingface_hub import notebook_login
notebook_login()
```

### Gated Models

```python
# Request access di halaman model
# Contoh: https://huggingface.co/meta-llama/Llama-3.1-8B

# Setelah disetujui, download dengan token
model = AutoModel.from_pretrained(
    "meta-llama/Llama-3.1-8B",
    token=HF_TOKEN
)
```

---

## 📡 Inference Endpoints (Dedicated)

Deploy models di dedicated infrastructure.

### Create Endpoint

Via UI: https://ui.endpoints.huggingface.co/

```python
from huggingface_hub import HfApi

api = HfApi()

endpoint = api.create_inference_endpoint(
    "my-endpoint",
    repository="meta-llama/Llama-3.1-8B",
    framework="pytorch",
    accelerator="gpu",
    region="us-east-1",
    type="protected"
)
```

### Use Endpoint

```python
from huggingface_hub import InferenceClient

client = InferenceClient("https://xyz.endpoints.huggingface.cloud")

response = client.chat.completions.create(
    model="tgi",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

---

## 🚀 Spaces

Host ML demos dan web apps.

### Gradio Space

```python
# app.py
import gradio as gr

def greet(name):
    return f"Hello {name}!"

demo = gr.Interface(fn=greet, inputs="text", outputs="text")
demo.launch()
```

### Requirements

```
# requirements.txt
gradio
transformers
torch
```

### README.md

```markdown
---
title: My Space
emoji: 🚀
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
---

My awesome ML demo!
```

### ZeroGPU

```python
import spaces  # Auto-available in ZeroGPU Spaces

@spaces.GPU
def generate(prompt):
    model.to("cuda")
    return model(prompt)
```

### Docker Spaces

```dockerfile
FROM python:3.9

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .
CMD ["python", "app.py"]
```

```markdown
---
title: My Docker Space
sdk: docker
---
```

---

## 📚 Quick Reference

### Common Pipeline Tasks

| Task | Pipeline Name |
|------|---------------|
| Sentiment Analysis | `sentiment-analysis` |
| Text Generation | `text-generation` |
| Question Answering | `question-answering` |
| Translation | `translation_xx_to_yy` |
| Summarization | `summarization` |
| Zero-Shot Classification | `zero-shot-classification` |
| NER | `ner` |
| Image Classification | `image-classification` |
| Image Segmentation | `image-segmentation` |
| Text to Image | `text-to-image` |
| Audio Classification | `audio-classification` |
| Speech Recognition | `automatic-speech-recognition` |
| Text to Speech | `text-to-speech` |
| Visual Question Answering | `visual-question-answering` |
| Document Question Answering | `document-question-answering` |

### Model Suffixes

| Suffix | Meaning |
|--------|---------|
| `-base` | Base model (belum fine-tuned) |
| `-large` | Model lebih besar |
| `-small` | Model lebih kecil |
| `-Instruct` | Fine-tuned untuk chat/instruction |
| `-Chat` | Optimized untuk conversational |
| `-fp16` | Half precision weights |
| `-bf16` | BFloat16 weights |
| `-8bit` | 8-bit quantized |
| `-4bit` | 4-bit quantized |

### CLI Commands

```bash
# Login
huggingface-cli login
hf auth login

# Download model
huggingface-cli download meta-llama/Llama-3.1-8B

# Upload model
huggingface-cli upload my-user/my-model ./model-folder

# Scan cache
huggingface-cli scan-cache

# Delete from cache
huggingface-cli delete-cache

# Create repo
huggingface-cli repo create my-model --type model
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `HF_TOKEN` | Authentication token |
| `HF_HOME` | Cache directory |
| `HF_HUB_CACHE` | Hub cache directory |
| `HF_HUB_OFFLINE` | Offline mode (1) |
| `TRANSFORMERS_CACHE` | Transformers cache |

---

## 🔗 Useful Links

- **Hub**: https://huggingface.co
- **Docs**: https://huggingface.co/docs
- **Models**: https://huggingface.co/models
- **Datasets**: https://huggingface.co/datasets
- **Spaces**: https://huggingface.co/spaces
- **Tokens**: https://huggingface.co/settings/tokens
- **Inference Endpoints**: https://ui.endpoints.huggingface.co/
- **Forum**: https://discuss.huggingface.co
- **Discord**: https://hf.co/join/discord
- **GitHub**: https://github.com/huggingface
- **LLM Course**: https://huggingface.co/learn/llm-course
- **Diffusion Course**: https://huggingface.co/learn/diffusers-course

---

## 📖 Referensi

- [Hub Documentation](https://huggingface.co/docs/hub)
- [Transformers Documentation](https://huggingface.co/docs/transformers)
- [Diffusers Documentation](https://huggingface.co/docs/diffusers)
- [Datasets Documentation](https://huggingface.co/docs/datasets)
- [PEFT Documentation](https://huggingface.co/docs/peft)
- [TRL Documentation](https://huggingface.co/docs/trl)
- [Accelerate Documentation](https://huggingface.co/docs/accelerate)
- [Inference Providers](https://huggingface.co/docs/inference-providers)
- [Inference Endpoints](https://huggingface.co/docs/inference-endpoints)
- [huggingface_hub](https://huggingface.co/docs/huggingface_hub)
- [huggingface.js](https://huggingface.co/docs/huggingface.js)
