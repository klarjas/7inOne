# ANANTA Own Model — Roadmap

**Status:** From-scratch model direction approved; data pipeline exists; scratch model not yet trained  
**Product:** 7inOne  
**Assistant identity:** ANANTA (អាណានតា)  
**Principle:** Build ANANTA's language model from randomly initialized weights, teach it progressively, and deploy only after measured evaluation. Do not use a third-party pretrained model as ANANTA's brain.

## 1. Verified baseline

The connected Supabase project currently contains:
- 1 primary knowledge space.
- 15 approved knowledge entries and 150 teacher-authored SFT examples.
- 0 training attempts.
- 1 training-progress row.

The repository already contains:
- Knowledge ingestion, lesson review, training-data validation, and Admin learning-monitor code.
- A source-aware 110 / 20 / 20 pilot dataset split and a fixed 20-case Khmer benchmark.
- An existing Gemma-based experiment from the earlier plan. This is now **superseded for the main ANANTA path**. Keep its files for reference; do not describe that experiment as ANANTA's own from-scratch model and do not run it as the selected training path.

No from-scratch language model has been trained yet. Existing lessons and examples are teaching material, not proof that a model has learned them.

## 2. The chosen direction: train from random initialization

ANANTA's own model will start with randomly initialized parameters. It will not inherit another model's learned weights. The first version will be deliberately small so the training process can be tested with limited resources.

Core components:
1. **Khmer-first tokenizer:** build and version a tokenizer from legally usable, privacy-clean Khmer and multilingual text. Test Khmer word segmentation, Unicode normalization, punctuation, English terms, and mixed Khmer-English input.
2. **Own decoder-only Transformer:** implement a compact causal language model with documented architecture, parameter count, context length, and reproducible initialization.
3. **Pretraining corpus:** curate and deduplicate licensed/public-domain or user-authorized text. Record provenance and licensing. Do not scrape private conversations or include personal data.
4. **Pretraining:** learn next-token prediction from the corpus. Save checkpoints, tokenizer version, corpus manifest/hash, training configuration, and loss curves.
5. **Instruction teaching:** after language pretraining, teach question-answer behavior, Khmer explanations, product-support tasks, and safe uncertainty handling using approved examples.
6. **Evaluation:** test on held-out text and unseen Khmer tasks. Measure validation loss/perplexity, Khmer readability, instruction-following, factuality, hallucination, and safety. Keep test data out of training.
7. **Serving:** package the trained model and tokenizer as a versioned artifact. Run inference on a server with sufficient RAM/CPU/GPU; the existing 512 MB Render Free service is only the application backend and is not a suitable host for the language model.
8. **Live marketplace facts:** retrieve current price, inventory, shop, warranty, delivery, and seller data from authorized 7inOne APIs/Supabase at answer time. Do not bake changing facts into model weights.

## 3. Progressive learning levels

- **Level 0 — Foundation:** tokenizer, Unicode handling, basic token prediction, reproducible training and checkpointing.
- **Level 1 — Language:** Khmer sentence patterns, common vocabulary, punctuation, simple English and mixed-language text.
- **Level 2 — Understanding:** intent, question forms, context, summaries, and simple explanations.
- **Level 3 — Instruction:** follow directions, answer clearly, ask only necessary clarifying questions, and admit uncertainty.
- **Level 4 — 7inOne skills:** product discovery, comparisons, budget guidance, technical explanations, seller/customer support, and safe tool use.
- **Level 5 — Advanced:** broader reasoning exercises, multi-step tasks, robust evaluation, and continuous approved curriculum updates.

A level is earned only after passing its held-out evaluation gate. Adding lessons to Supabase does not automatically mean the model has learned them; the approved material must go through a training run and evaluation.

## 4. Teacher and knowledge workflow

1. ChatGPT acts as curriculum author/reviewer when the teacher workflow is active: it prepares lessons, exercises, ideal answers, rubrics, and corrections.
2. Admin reviews and approves the material.
3. Supabase remains the canonical store for lessons, provenance, approval state, attempts, and progress.
4. Dataset builder exports only approved, deduplicated, privacy-clean records into versioned training files.
5. Training jobs consume a fixed dataset version and record reproducible metadata.
6. Evaluation compares the new checkpoint with the previous checkpoint on the same held-out tests.
7. Promote a checkpoint only when measured quality improves and critical safety/factuality checks do not regress.

ChatGPT does not run continuously after a chat closes, and its own model weights cannot be copied into ANANTA. The teacher workflow must explicitly save approved curriculum to the project's data store.

## 5. Data and safety contract

- Use UTF-8 text and preserve Khmer Unicode correctly.
- Record source, license/permission, collection date, deduplication result, and dataset version.
- Do not train on customer names, phone numbers, addresses, account IDs, credentials, private chat logs, or other personal data.
- Do not include secrets or service-role keys in GitHub or datasets.
- Separate train, validation, and held-out test data by source to prevent leakage.
- Keep the benchmark fixed and never train on it.
- Only Admin-approved material may enter instruction training.
- Dynamic product and transaction facts must be fetched live from permission-checked APIs.

## 6. Resource and deployment constraints

- No Cloudflare, third-party hosted inference API, or external model will be used as a substitute brain.
- No paid API, paid GPU, paid hosting tier, or subscription without explicit approval.
- Free GPU availability is not guaranteed. CPU training can validate a tiny prototype but will be too slow for meaningful large-scale pretraining.
- Start with a tiny model and a small, legally usable corpus to validate the complete pipeline. Be transparent that this prototype will not initially match a large commercial assistant.
- Scale model size and corpus only when compute, storage, and evaluation evidence justify it.
- Model artifact storage is not the same as inference: a trained checkpoint must be loaded by a server process with sufficient resources.
- Keep the current marketplace backend and user data intact. Do not deploy an untested model to production.

## 7. Milestones and acceptance gates

### Phase 0 — Preserve and document
- Keep the existing Supabase lessons and approved examples.
- Mark the previous pretrained-model experiment as superseded, not as completed training.
- Define the from-scratch model specification and reproducible artifact format.

**Exit gate:** architecture, tokenizer plan, data permissions, and benchmark are documented.

### Phase 1 — Tokenizer and corpus
- Build Khmer-first tokenizer tests.
- Assemble a small, licensed, privacy-clean corpus with source manifest.
- Add corpus validation and deduplication.

**Exit gate:** tokenizer passes Khmer Unicode and round-trip tests; corpus provenance is auditable.

### Phase 2 — Tiny Transformer
- Implement the decoder-only model from random initialization.
- Add training, checkpoint save/resume, validation loss, and deterministic smoke tests.
- Run a tiny CPU smoke test first.

**Exit gate:** a reproducible checkpoint is trained from random initialization and can generate text. This is a technical prototype, not yet a capable assistant.

### Phase 3 — Language pretraining
- Train on the approved corpus when suitable compute is available.
- Track loss, throughput, resource use, and checkpoint versions.

**Exit gate:** validation loss improves against the random baseline and generated Khmer text is manually reviewed.

### Phase 4 — Instruction curriculum
- Teach approved lessons and task examples in staged levels.
- Add held-out evaluation for every level.

**Exit gate:** model passes the relevant unseen-task benchmark without critical factuality or safety regression.

### Phase 5 — Controlled deployment
- Host the model on a runtime with sufficient resources.
- Connect the 7inOne backend to ANANTA's own inference service.
- Keep live product facts in the existing database/API path.
- Use an Admin-controlled feature flag, monitoring, and rollback.

**Exit gate:** latency, stability, Khmer quality, and safety pass production checks.

## 8. Truthful status rule

At present, ANANTA has approved teaching material and a data pipeline, but **does not yet have a trained from-scratch language model**. Do not claim that ANANTA is trained, intelligent, or production-ready until a real random-initialized model checkpoint exists and passes held-out evaluation.
