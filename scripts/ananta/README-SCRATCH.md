# ANANTA scratch model v0.1

This is an executable prototype of ANANTA's own language model: a decoder-only
Transformer initialized from random weights and a reversible UTF-8 byte tokenizer.
It does not download or load pretrained model weights.

## Limitations

- This proves a training/checkpoint pipeline, not intelligence.
- Byte tokenization preserves Khmer exactly but is inefficient. A Khmer-first
  subword tokenizer is a later milestone.
- A tiny model trained for a few hundred steps is not a production assistant.
  It needs a large, licensed corpus, more training, instruction teaching, and tests.
- Never use private customer conversations, personal data, credentials, or
  copyrighted material without permission.
- Render Free (512 MB RAM) is not a training or inference host for this model.

## Corpus

Prepare data/ananta-corpus/approved-corpus.txt in a private training workspace.
Use only public-domain, appropriately licensed, or explicitly authorized text.
Keep source, license/permission, collection date, and review status in a separate
manifest. Do not commit private or unlicensed corpus data to GitHub.
At least 2 KB is needed for a smoke run; meaningful pretraining needs far more.

## Run

From repository root:

    python -m pip install -r scripts/ananta/requirements-scratch.txt
    python scripts/ananta/train_scratch.py --corpus data/ananta-corpus/approved-corpus.txt --steps 20 --batch-size 4 --seq-len 64 --d-model 64 --layers 2 --heads 2 --device cpu
