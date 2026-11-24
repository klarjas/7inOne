# ANANTA Own Model — Roadmap

**Status:** Phase 0 / foundation design  
**Product:** 7inOne  
**Assistant identity:** ANANTA (អាណានតា)  
**Principle:** Build a Khmer-capable, independently deployable model using approved 7inOne training data. Keep the existing marketplace and customer data intact.

## 1. Current verified baseline

The connected Supabase project currently contains:
- 1 primary knowledge space.
- 15 approved knowledge entries and 45 teacher-reviewed SFT examples.
- 0 training attempts.
- 1 training-progress row.

The repository already contains:
- `backend/ananta-brain-upload.js` for authenticated knowledge ingestion.
- `backend/assistant-training-engine.js` for scenario generation, live ANANTA response, grading, and progress tracking.
- Existing Admin learning-monitor routes and UI.

The current training and shopping-assistant code has been changed to remove Qwen, Hugging Face, and OpenRouter defaults. It now waits for an ANANTA-owned, OpenAI-compatible model endpoint configured through `ANANTA_MODEL_URL` and `ANANTA_MODEL_NAME` (optional `ANANTA_MODEL_API_KEY`). The training scheduler stays paused until that endpoint exists. There are no completed training attempts yet, so there is not evidence of a successful training/evaluation cycle or a separately fine-tuned ANANTA model.

## 2. Target architecture

1. **Teacher layer — ChatGPT:** author Khmer lessons, realistic customer scenarios, ideal answers, evaluation criteria, and corrections. ChatGPT can prepare and review data when a teacher workflow is active; it does not run continuously after a chat is closed and its model weights cannot be copied into ANANTA.
2. **Knowledge Center — Telegram:** provide a convenient place for lesson drafts, approved lesson posts, exercises, and review records. Telegram is an intake/archive interface, not the model itself or the canonical database.
3. **Canonical knowledge — Supabase:** retain approved lessons, source references, review status, attempts, and progress. Existing tables must be reused where possible; never delete the existing 15 approved entries.
4. **Dataset builder:** convert only approved, deduplicated, privacy-clean examples into versioned JSONL supervised fine-tuning (SFT) records. Preserve source IDs and review metadata outside the model-facing messages.
5. **Quality gate:** validate format, Khmer readability, factual grounding, policy compliance, duplication, and train/validation/test separation before export.
6. **Base model selection:** compare open-weight models for Khmer quality, commercial-use license, model size, inference memory, and fine-tuning compatibility. Do not lock the project to Qwen or another provider before testing.
7. **Fine-tuning:** begin with a small LoRA/QLoRA experiment on a suitable base model. Save adapter, tokenizer/config, dataset version, training parameters, and evaluation results.
8. **Evaluation and deployment:** compare the fine-tuned model against its base model on a held-out Khmer test set. Deploy only if it improves measured task performance without increasing hallucinations. Keep a rollback path and current live assistant until the replacement is verified.

The repository now includes 45 teacher-reviewed SFT examples sourced from 15 approved lessons, an approved-data validator/splitter, a fixed 20-case Khmer benchmark, a raw-output benchmark runner, and passing GitHub Actions checks for these assets. See `scripts/ananta/README.md` and `docs/ANANTA-MODEL-DECISION.md`.

## 3. What the model should learn

Fine-tuning should teach stable behavior and task skills:
- Understand Khmer customer intent and ask only necessary clarification questions.
- Recommend and compare products using the customer's needs and budget.
- Explain technical specifications in plain Khmer.
- Never invent price, stock, product variants, warranty, seller identity, or delivery facts.
- Use 7inOne's live product/shop/order data tools for changing facts instead of memorizing stale values.
- Admit uncertainty, explain what must be checked, and escalate complaints or sensitive cases appropriately.
- Follow 7inOne's tone, response structure, privacy, and safety rules.

Dynamic catalogue facts (price, inventory, seller status, shipping, warranty changes) belong in live retrieval/API data, not in model weights.

## 4. Training-data contract

Canonical format: UTF-8 JSONL, one record per line. Each record contains:
- `record_id`: stable unique identifier.
- `source_lesson_id` and `source_reference`: traceability to approved source material.
- `category`, `difficulty`, `review_status`, and `split`.
- `messages`: ordered chat messages with `system`, `user`, and `assistant` roles.

Only records with `review_status = "approved"` may be exported. The trainer must pass only the `messages` field to the model; metadata must not become training text. The live assistant and training engine must use `ANANTA_MODEL_URL`, `ANANTA_MODEL_NAME`, and optionally `ANANTA_MODEL_API_KEY`; do not restore Qwen/OpenRouter/Hugging Face provider defaults. Do not include customer names, phone numbers, addresses, account IDs, private chat logs, credentials, or other personal data.

Use a source-aware split (initial target 80% train / 10% validation / 10% test) so paraphrases or examples from the same source lesson/conversation cannot leak across splits. Keep the test set fixed and never train on it.

See `docs/ananta-sft-format.schema.json` and `docs/ananta-sft-example.jsonl`.

## 5. Milestones and acceptance gates

### Phase 0 — Foundation (current)
- Record the existing architecture and baseline.
- Define the canonical dataset contract.
- Preserve current Supabase knowledge and live marketplace behavior.

**Exit gate:** data format and safety rules are documented.

### Phase 1 — Data pipeline
- Create an Admin review/export flow for approved lesson-derived examples.
- Add deduplication, privacy checks, source traceability, and dataset versioning.
- Export a small pilot dataset and inspect it manually.

**Exit gate:** every exported record is approved, traceable, valid JSONL, and free of personal data.

### Phase 2 — Khmer benchmark
- Build a held-out set covering product advice, comparisons, budget, specs, uncertainty, seller/customer support, and policy compliance.
- Score answer relevance, factuality, Khmer clarity, tool-use decisions, and safety.

**Exit gate:** reproducible baseline results for candidate base models.

### Phase 3 — Base-model experiment
- Compare candidate open-weight models by actual Khmer test results and license.
- Check model memory requirements against the available hardware.
- Prefer a small model for the first experiment; do not assume local fine-tuning is feasible on a CPU-only 16 GB machine.

**Exit gate:** chosen model has an acceptable license, Khmer benchmark score, and feasible training/serving plan.

### Phase 4 — Fine-tuning pilot
- Train a small LoRA/QLoRA adapter on approved examples.
- Record all hyperparameters, dataset hash, model revision, and artifacts.
- Compare base vs. tuned model on the unchanged test set.

**Exit gate:** tuned model demonstrably improves target tasks and does not regress critical safety/factuality checks.

### Phase 5 — Controlled deployment
- Deploy behind an Admin-controlled feature flag.
- Run internal tests and a limited rollout.
- Monitor latency, cost, failure rate, answer quality, and rollback readiness.

**Exit gate:** Admin approves promotion to production after evidence-based evaluation.

## 6. Free-first constraints

- Prefer open-weight models and local inference where hardware allows.
- A free GPU notebook or hosted tier may be used for experiments only if its current limits and terms permit it; availability is not guaranteed.
- Do not add a paid API, paid GPU, or paid model subscription without explicit approval.
- A model being open-weight does not automatically mean every use is free; check license and compute costs.
- Keep secrets out of GitHub. Never put API keys, service-role keys, Telegram bot tokens, or customer data in dataset files.

## 7. Important distinction

A knowledge base (RAG) gives ANANTA access to approved information. Fine-tuning changes model behavior through learned parameters. They complement each other; neither replaces the other. The intended final system combines:
- a fine-tuned ANANTA model for Khmer behavior and 7inOne task skills;
- Supabase/live APIs for current and permission-checked facts;
- Telegram for knowledge intake and review workflow;
- Admin evaluation, versioning, and rollback.

**No claim of an own model or successful training is valid until a real fine-tuning artifact exists and passes the held-out evaluation.**
