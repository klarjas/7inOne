# ANANTA data and evaluation pipeline

## First base-model candidate

Start benchmark trials with Google Gemma 4 E2B IT (google/gemma-4-E2B-it) as a candidate, not a final selection. The official model card describes the Gemma 4 family as Apache 2.0 open-weight, pretrained on 140+ languages, with 35+ out-of-the-box multilingual support. Khmer quality is not assumed; it must pass the included Khmer benchmark.

Official model card: https://huggingface.co/google/gemma-4-E2B
Official model documentation: https://github.com/google-gemma/docs/blob/main/docs/models/gemma-4/model-card.md

The user's known CPU-only 16 GB Windows machine can prepare data and may run quantized inference experiments, but is not a realistic LoRA fine-tuning target. Check actual GPU memory before training. Do not start paid compute without explicit approval.

## 1. Validate and split approved records

Run: python scripts/ananta/build_dataset.py docs/ananta-sft-pilot-v0.1.jsonl --output-dir artifacts/ananta-dataset

The builder accepts approved records only, validates chat roles and source traceability, screens for common PII/secret patterns, groups by source lesson before deterministic train/validation/test splitting, and writes a manifest.

The current teacher-reviewed pilot has 45 examples derived from 15 approved source lessons. It is enough to validate the data pipeline, but it is still too small and narrow for a meaningful production fine-tuning run. Initial planning threshold: at least 100 train, 20 validation and 20 test records, with more varied examples preferred.

## 2. Run the fixed benchmark against an own-model endpoint

Set environment variables outside Git: ANANTA_MODEL_URL (OpenAI-compatible chat-completions endpoint), ANANTA_MODEL_NAME, and optional ANANTA_MODEL_API_KEY. Never commit keys.

Run: python scripts/ananta/run_benchmark.py

The runner stores raw answers and latency. It does not grade itself. A teacher/admin must score outputs against must_include and must_not_claim. Keep the benchmark fixed and never add its answers to the training set.

## 3. Fine-tuning gate

Do not fine-tune until the dataset is larger and manually reviewed. Choose the base model only after Khmer benchmark trials, license review, and GPU-memory feasibility checks. Fine-tune with LoRA/QLoRA on permitted GPU, record the base-model revision and dataset hash, then compare base vs. adapter on the same held-out benchmark.

## 4. Architecture rules

- Telegram is the lesson intake/archive interface, not the neural model.
- Supabase remains the canonical store for approved knowledge and provenance.
- Fine-tuning teaches stable behavior; live 7inOne APIs/RAG provide changing prices, stock, seller status, delivery and warranty facts.
- The legacy automatic self-grading loop is disabled by default because one model must not generate its own exam and grade itself as proof of learning.
- No fine-tuned ANANTA model exists until a real adapter/checkpoint is produced and passes independent evaluation.
