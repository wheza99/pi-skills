# Transformers Library Detail

Dokumentasi detail tentang Transformers library dari hasil scraping.

## Overview

Transformers adalah model-definition framework untuk SOTA ML models dalam:
- Text
- Computer Vision
- Audio
- Video
- Multimodal

### Key Points

- **1M+ model checkpoints** di Hugging Face Hub
- Centralized model definition yang compatible dengan:
  - Training frameworks: Axolotl, Unsloth, DeepSpeed, FSDP, PyTorch-Lightning
  - Inference engines: vLLM, SGLang, TGI
  - Modeling libraries: llama.cpp, mlx

## Core Features

### Pipeline

Simple dan optimized inference class untuk:
- Text generation
- Image segmentation
- Automatic speech recognition
- Document question answering
- Dan banyak lagi

### Trainer

Comprehensive trainer dengan support:
- Mixed precision
- torch.compile
- FlashAttention
- Distributed training untuk PyTorch

### generate()

Fast text generation dengan LLMs dan VLMs:
- Streaming support
- Multiple decoding strategies

## Design Principles

1. **Fast and easy to use**: Hanya 3 classes utama (configuration, model, preprocessor)
2. **Pretrained models**: Reduce carbon footprint dengan pretrained models

## Three Base Classes

| Class | Description |
|-------|-------------|
| PreTrainedConfig | Model attributes (attention heads, vocab size, etc.) |
| PreTrainedModel | Model architecture, returns raw hidden states |
| Preprocessor | Convert raw inputs to tensors |

### AutoClass API

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Auto-detect architecture
model = AutoModelForCausalLM.from_pretrained("model-name")
tokenizer = AutoTokenizer.from_pretrained("model-name")
```

### Optimized Loading

```python
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    dtype="auto",           # Load in stored dtype
    device_map="auto"       # Auto allocate to fastest device
)
```

## Installation

### Using uv (Recommended)

```bash
# Create virtual environment
uv venv .env
source .env/bin/activate

# Install
uv pip install transformers

# With GPU
nvidia-smi  # Check GPU
uv pip install transformers

# CPU only
uv pip install torch --index-url https://download.pytorch.org/whl/cpu
uv pip install transformers
```

### From Source

```bash
uv pip install git+https://github.com/huggingface/transformers
```

### Editable Install

```bash
git clone https://github.com/huggingface/transformers.git
cd transformers
uv pip install -e .
```

### Conda

```bash
conda install conda-forge::transformers
```

## Cache Directory

Default locations:
- Linux/Mac: `~/.cache/huggingface/hub`
- Windows: `C:\Users\username\.cache\huggingface\hub`

Priority order:
1. `HF_HUB_CACHE`
2. `HF_HOME`
3. `XDG_CACHE_HOME + /huggingface`

## Offline Mode

```python
# Download ahead of time
from huggingface_hub import snapshot_download
snapshot_download(repo_id="meta-llama/Llama-2-7b-hf")

# Set offline mode
import os
os.environ["HF_HUB_OFFLINE"] = "1"

# Or use local_files_only
model = LlamaForCausalLM.from_pretrained(
    "./path/to/local/directory",
    local_files_only=True
)
```

## Pipeline Usage

### Basic

```python
from transformers import pipeline

# Default model
pipe = pipeline("sentiment-analysis")
result = pipe("I love Hugging Face!")

# Specific model
pipe = pipeline("text-generation", model="google/gemma-2-2b")
result = pipe("the secret to baking a good cake is ")
```

### Multiple Inputs

```python
pipe = pipeline("text-generation", model="google/gemma-2-2b")
pipe(["input 1", "input 2"])
```

### Device Selection

```python
from accelerate import Accelerator

# Using Accelerate
device = Accelerator().device
pipe = pipeline("text-generation", model="google/gemma-2-2b", device=device)

# GPU by ID
pipe = pipeline("text-generation", device=0)

# Auto device mapping
pipe = pipeline("text-generation", device_map="auto")
```

### Batch Inference

```python
pipe = pipeline(
    "text-generation",
    model="google/gemma-2-2b",
    device=device,
    batch_size=2
)
pipe(["input 1", "input 2", "input 3", "input 4"])
```

### Large Datasets

```python
from transformers.pipelines.pt_utils import KeyDataset
from datasets import load_dataset

dataset = load_dataset("imdb", split="unsupervised")
pipe = pipeline("text-classification", device=0)

for out in pipe(KeyDataset(dataset, "text"), batch_size=8):
    print(out)
```

### Streaming with Generator

```python
def data():
    for i in range(1000):
        yield f"My example {i}"

pipe = pipeline(model="openai-community/gpt2", device=0)
for out in pipe(data()):
    print(out)
```

### Large Models

```python
import torch
from transformers import pipeline, BitsAndBytesConfig

pipe = pipeline(
    model="google/gemma-7b",
    dtype=torch.bfloat16,
    device_map="auto",
    model_kwargs={
        "quantization_config": BitsAndBytesConfig(load_in_8bit=True)
    }
)
```

## Task-Specific Parameters

### Automatic Speech Recognition

```python
pipe = pipeline("automatic-speech-recognition", model="openai/whisper-large-v3")
result = pipe(audio="audio.flac", return_timestamps="word")
# Returns text + word-level timestamps
```

### Summarization

```python
pipe = pipeline("summarization", model="google/pegasus-billsum")
result = pipe(long_text)
```

## Trainer Usage

### Basic Setup

```python
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
    DataCollatorWithPadding
)
from datasets import load_dataset

# Load components
model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
dataset = load_dataset("rotten_tomatoes")

# Tokenize
def tokenize_dataset(dataset):
    return tokenizer(dataset["text"])
dataset = dataset.map(tokenize_dataset, batched=True)

# Data collator
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# Training arguments
training_args = TrainingArguments(
    output_dir="my-model",
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
trainer.push_to_hub()
```

### Training Optimizations

```python
# torch.compile
training_args = TrainingArguments(
    torch_compile=True,
    torch_compile_backend="inductor",
    torch_compile_mode="default",
)

# NEFTune
training_args = TrainingArguments(
    neftune_noise_alpha=0.1,
)

# Liger Kernel
training_args = TrainingArguments(
    use_liger_kernel=True,
    liger_kernel_config={
        "rope": True,
        "cross_entropy": True,
    }
)
```

### Custom Trainer

```python
from torch import nn

class CustomTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False, num_items_in_batch=None):
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        logits = outputs.get("logits")
        
        loss_fct = nn.CrossEntropyLoss(
            weight=torch.tensor([1.0, 2.0, 3.0], device=model.device)
        )
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
```

## Checkpoints

- Saved to `output_dir/checkpoint-XXX`
- Resume training: `trainer.train(resume_from_checkpoint=True)`
- Specific checkpoint: `trainer.train(resume_from_checkpoint="checkpoint-500")`

### Hub Strategies

- `hub_strategy="every_save"` (default): Save on every save
- `hub_strategy="end"`: Only on save_model()
- `hub_strategy="checkpoint"`: Latest checkpoint to `last-checkpoint`
- `hub_strategy="all_checkpoints"`: All checkpoints

## Distributed Training

### Accelerate Config

```yaml
compute_environment: LOCAL_MACHINE
distributed_type: MULTI_GPU
gpu_ids: all
mixed_precision: fp16
num_machines: 2
num_processes: 8
main_process_ip: 192.168.20.1
main_process_port: 9898
```

### Launch

```bash
accelerate launch train.py --model_name_or_path bert-base-cased ...
```

## Models Timeline

Explore latest architectures:
https://huggingface.co/docs/transformers/models_timeline

## Learn

LLM Course: https://huggingface.co/learn/llm-course/chapter1/1
