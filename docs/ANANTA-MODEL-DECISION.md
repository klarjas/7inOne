# ANANTA model decision record — 2026-11-24

## Current decision

The main ANANTA path is a language model trained from random initialization.
Do not use Gemma, Qwen, or another pretrained model as ANANTA's brain.

## Implemented first prototype

- Architecture: compact decoder-only Transformer implemented in scripts/ananta/scratch_model.py.
- Initialization: random trainable weights; no pretrained checkpoint is loaded.
- Tokenizer: reversible UTF-8 byte tokenizer (256 tokens), preserving Khmer Unicode exactly.
- Training: CPU/CUDA selectable training loop with deterministic seed, train/validation split,
  loss/perplexity tracking, checkpoint saving, and a corpus hash manifest.
- This is only a technical prototype. It is not yet a capable Khmer assistant.

## Next milestones

1. Validate tokenizer round-trip behavior for Khmer, English, punctuation, and mixed text.
2. Run a tiny smoke training job on a small, approved corpus and verify that loss/checkpoints work.
3. Replace byte tokenization with a Khmer-first subword tokenizer after corpus and segmentation review.
4. Curate a large, legally usable, privacy-clean pretraining corpus with provenance and deduplication.
5. Scale pretraining on free compute only when genuinely available; do not start paid GPU jobs.
6. Teach approved 7inOne instruction examples in stages and evaluate on held-out cases.
7. Deploy only when a suitable runtime is available and the model passes quality, safety, and stability gates.

## Data and deployment rules

- Use public-domain, appropriately licensed, or explicitly user-authorized text only.
- Do not train on private customer conversations, personal data, credentials, or secrets.
- Supabase remains the canonical store for approved lessons, provenance, training attempts, and progress.
- Live prices, stock, shop status, warranty, and delivery facts must be retrieved from 7inOne at answer time.
- No third-party hosted inference API, paid model API, paid GPU, or paid hosting without explicit approval.
- The existing Render Free backend (512 MB RAM) is not suitable for training or serving this model.

## Truthful status

Code for a tiny random-initialized prototype has been added. No actual training run has yet
been completed because an approved corpus and a compute run are still required. Do not claim
that ANANTA is trained or production-ready until a real checkpoint is produced and independently
evaluated on held-out Khmer tasks.
