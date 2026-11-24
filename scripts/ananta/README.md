# ANANTA data and evaluation pipeline

## First base-model candidate

Start benchmark trials with Google Gemma 4 E2B IT (google/gemma-4-E2B-it) as a candidate, not a final selection. The official model card describes the Gemma 4 family as Apache 2.0 open-weight, pretrained on 140+ languages, with 35+ out-of-the-box multilingual support. Khmer quality is not assumed; it must pass the included Khmer benchmark.

Official model card: https://huggingface.co/google/gemma-4-E2B
Official model documentation: https://github.com/google-gemma/docs/blob/main/docs/models/gemma-4/model-card.md

The user's known CPU-only 16 GB Windows machine can prepare data and may run quantized inference experiments, but is not a realistic LoRA fine-tuning target. Check actual GPU memory before training. Do not start paid compute without explicit approval.

## 1. Validate and split approved records

Run: python scripts/ananta/build_dataset.py docs/ananta-sft-pilot-v0.1.jsonl --output-dir artifacts/ananta-dataset

The builder accepts approved records only, validates chat roles and source traceability, screens for common PII/secret patterns, groups by source lesson before deterministic train/validation/test splitting, and writes a manifest.

The current teacher-authored pilot contains 150 examples across 15 approved source lessons. The source-aware split has passed the minimum technical gate: 110 train, 20 validation and 20 held-out test examples. These are synthetic teaching examples, not real customer conversations; this is enough to begin a controlled pilot run, not enough by itself to justify production deployment. Human review and broader real-world scenario coverage are still required.

## 2. Run the base model locally on Windows

For the existing CPU-only Windows PC with 16 GB RAM, use `scripts/ananta/windows/START-ANANTA-LOCAL.bat`. It installs llama.cpp if needed and starts the Gemma 4 E2B Q4_0 GGUF model (about 2.84 GB) as an OpenAI-compatible API at `127.0.0.1:9931`. This is the untuned base model, not the fine-tuned ANANTA adapter. The optional `START-ANANTA-TUNNEL.bat` exposes the local endpoint through a temporary HTTPS tunnel protected by the generated API key. The PC must stay on and the tunnel URL changes when restarted. See `scripts/ananta/windows/README.md`.

To test the local model, set `ANANTA_MODEL_URL=http://127.0.0.1:9931/v1/chat/completions`, `ANANTA_MODEL_NAME=ananta-gemma4-e2b`, and `ANANTA_MODEL_API_KEY` from the local key file, then run `python scripts/ananta/run_benchmark.py`.

## 3. Fine-tune the candidate model

A guarded QLoRA script and a Google Colab notebook are included:

- `scripts/ananta/train_lora.py`
- `scripts/ananta/requirements-train.txt`
- `notebooks/ANANTA-Gemma4-Free-Training.ipynb`

Open the notebook in Google Colab, select a free GPU runtime only if offered, and run the cells in order. It refuses to train without CUDA, sufficient VRAM, an approved dataset manifest, and a Hugging Face read token. It does not start paid compute. Free GPU availability is not guaranteed. Never commit the Hugging Face token or adapter weights to the public repository.

## 4. Evaluate base model vs. adapter

Run `scripts/ananta/run_local_benchmark.py` twice against the same 20-case benchmark: once without `--adapter-dir` for the base model, then with `--adapter-dir artifacts/ananta-adapter` for the tuned model. Human-review both outputs; the runner does not self-grade.

## 5. Run the fixed benchmark against an own-model endpoint

Set environment variables outside Git: ANANTA_MODEL_URL (OpenAI-compatible chat-completions endpoint), ANANTA_MODEL_NAME, and optional ANANTA_MODEL_API_KEY. Never commit keys.

Run: python scripts/ananta/run_benchmark.py

The runner stores raw answers and latency. It does not grade itself. A teacher/admin must score outputs against must_include and must_not_claim. Keep the benchmark fixed and never add its answers to the training set.

## 6. Deployment gate

Do not deploy until all 20 held-out cases have been reviewed, the tuned model improves Khmer usefulness without increasing factual or privacy errors, and the adapter has a recorded model revision, dataset hash, and rollback plan.

## 4. Architecture rules

- Telegram is the lesson intake/archive interface, not the neural model.
- Supabase remains the canonical store for approved knowledge and provenance.
- Fine-tuning teaches stable behavior; live 7inOne APIs/RAG provide changing prices, stock, seller status, delivery and warranty facts.
- The legacy automatic self-grading loop is disabled by default because one model must not generate its own exam and grade itself as proof of learning.
- No fine-tuned ANANTA model exists until a real adapter/checkpoint is produced and passes independent evaluation.
