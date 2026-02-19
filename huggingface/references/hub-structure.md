# Hugging Face Hub Structure

Dokumentasi ini berisi struktur dan informasi detail tentang Hugging Face Hub.

## Hub Overview

Hugging Face Hub adalah platform dengan:
- **2M+ Models**: LLM, vision, audio, multimodal
- **500k+ Datasets**: 8k+ bahasa, berbagai domain
- **1M+ Spaces**: Demo apps, ML showcases

## Categories

### Hub & Client Libraries

| Library | Description | URL |
|---------|-------------|-----|
| Hub | Git-based models, datasets, Spaces | /docs/hub |
| Hub Python Library | Python client untuk HF Hub | /docs/huggingface_hub |
| Huggingface.js | JavaScript libraries dengan TS types | /docs/huggingface.js |
| Tasks | Explore demos, models, datasets per task | /tasks |
| Dataset viewer | API untuk metadata & content datasets | /docs/dataset-viewer |

### Deployment & Inference

| Service | Description | URL |
|---------|-------------|-----|
| Inference Providers | 200k+ models dari 10+ providers | /docs/inference-providers |
| Inference Endpoints | Dedicated infrastructure | /docs/inference-endpoints |
| AWS | Deploy dengan DLCs | /docs/sagemaker |
| TGI | Text Generation Inference | /docs/text-generation-inference |
| TEI | Text Embeddings Inference | /docs/text-embeddings-inference |
| Microsoft Azure | Deploy on Azure | /docs/microsoft-azure |
| Google Cloud | Train & deploy on GCP | /docs/google-cloud |

### Core ML Libraries

| Library | Description | URL |
|---------|-------------|-----|
| Transformers | SOTA AI models untuk PyTorch | /docs/transformers |
| Diffusers | SOTA Diffusion models | /docs/diffusers |
| Datasets | Access & share datasets | /docs/datasets |
| Transformers.js | ML in browser | /docs/transformers.js |
| Tokenizers | Fast tokenizers | /docs/tokenizers |
| Evaluate | Evaluate model performance | /docs/evaluate |
| timm | Vision models | /docs/timm |
| Sentence Transformers | Embeddings, Retrieval | https://sbert.net/ |
| Kernels | Compute kernels from Hub | /docs/kernels |

### Training & Optimization

| Library | Description | URL |
|---------|-------------|-----|
| PEFT | Parameter-efficient finetuning | /docs/peft |
| Accelerate | Multi-GPU, TPU, mixed precision | /docs/accelerate |
| Optimum | Optimize for faster training | /docs/optimum |
| AWS Trainium | Train on AWS | /docs/optimum-neuron |
| Google TPUs | Train on TPUs | /docs/optimum-tpu |
| TRL | RL training untuk LLMs | /docs/trl |
| Safetensors | Safe weight storage | /docs/safetensors |
| Bitsandbytes | Quantization | /docs/bitsandbytes |
| Lighteval | LLM evaluation | /docs/lighteval |

### Collaboration & Extras

| Tool | Description | URL |
|------|-------------|-----|
| Gradio | ML demos & web apps | https://gradio.app/docs/ |
| Trackio | Experiment tracking | /docs/trackio |
| smolagents | Build agents in Python | /docs/smolagents |
| LeRobot | AI for Robotics | /docs/lerobot |
| Reachy Mini | Robot SDK | /docs/reachy_mini |
| AutoTrain | Auto training UI/API | /docs/autotrain |
| Chat UI | Chat frontend (HuggingChat) | /docs/chat-ui |
| Leaderboards | Custom leaderboards | /docs/leaderboards |
| Argilla | Dataset collaboration | https://argilla-io.github.io/argilla/ |
| Distilabel | Synthetic data generation | https://distilabel.argilla.io/ |

## Hub Features

### Repositories

- Git-based version control
- Commit history, diffs, branches
- Xet storage untuk large files
- Storage limits dan backend options
- Pull requests dan discussions
- Webhooks
- Collections

### Models

- Model Cards dengan limitations & biases
- Gated models untuk akses terkontrol
- Upload/download dengan berbagai cara
- Library integrations (Transformers, dll)
- Task widgets
- Inference API
- Download stats

### Datasets

- Dataset Cards
- Gated datasets
- Upload/download
- Streaming untuk large datasets
- Data Studio untuk explore
- Dataset viewer API
- Data files configuration

### Spaces

- Gradio SDK
- Streamlit SDK
- Docker Spaces
- Static HTML Spaces
- ZeroGPU Spaces
- Embed Spaces
- Run with Docker

### Security

- User Access Tokens
- Access Control untuk Organizations
- GPG signing commits
- Malware scanning
- Audit Logs (Enterprise)
- SSO (Enterprise)
- Network Security
- Rate Limits

## Subscriptions & Plans

- PRO subscription
- Team & Enterprise Plans
- Single Sign-On (SSO)
- Audit Logs
- Storage Regions
- Data Studio for Private datasets
- Resource Groups
- Advanced Security
