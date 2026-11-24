# ANANTA model decision record — 2026-11-24

## Decision
Use Google Gemma 4 E2B IT as the first candidate to benchmark, not as a final production selection. Do not use Qwen.

## Why this candidate
- Its official Hugging Face model card lists Apache 2.0 licensing for Gemma 4.
- Google’s model card describes pretraining across 140+ languages and out-of-the-box multilingual support for 35+ languages.
- The E2B size is intended for edge/mobile environments, making it a more realistic first inference candidate than 12B/31B variants.
- Khmer is not assumed to be supported well enough. The 20-case 7inOne benchmark must measure actual Khmer response quality before adoption.

## Candidate identifier
- Hugging Face: google/gemma-4-E2B-it
- Model card: https://huggingface.co/google/gemma-4-E2B
- Official technical card: https://github.com/google-gemma/docs/blob/main/docs/models/gemma-4/model-card.md

## Hardware and cost constraints
- Existing known development machine: CPU-only, Intel graphics, 16 GB RAM.
- Data cleaning, dataset validation, benchmark review and possibly quantized inference are the first local tasks.
- Fine-tuning requires suitable GPU memory. Do not pretend CPU-only 16 GB is enough for practical LoRA fine-tuning.
- Use only a genuinely free GPU allocation if available and permitted; quotas and availability can change. No paid compute without explicit user approval.

## Promotion gates
1. Run the 20-case Khmer benchmark against the unmodified candidate.
2. Human-review every answer for Khmer quality, factual restraint, privacy and shopping usefulness.
3. Grow the reviewed dataset beyond the current 15 seed examples; current minimum gate is 100 train / 20 validation / 20 test records, with larger and more varied data preferred.
4. Fine-tune a LoRA adapter only after data and compute gates pass.
5. Re-run the same held-out benchmark and compare base vs. fine-tuned results.
6. Deploy only after clear measured improvement and rollback readiness.

## Important
An open-weight base model plus a fine-tuned adapter is an ANANTA-customized model, not a model pretrained from scratch. Pretraining a foundation model from scratch is out of scope for the current free-first budget and hardware.
