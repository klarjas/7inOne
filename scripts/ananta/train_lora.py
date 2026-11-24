#!/usr/bin/env python3
"""Free-first Gemma 4 E2B QLoRA fine-tuning for ANANTA.

Requires a CUDA GPU. This script intentionally refuses to run on CPU or when
the leakage-safe dataset manifest has not passed the minimum data gate.
"""
from __future__ import annotations
import argparse, hashlib, json, os, platform, sys
from datetime import datetime, timezone
from pathlib import Path

def sha256(path: Path) -> str:
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""): h.update(chunk)
    return h.hexdigest()

def read_jsonl(path: Path):
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--data-dir",type=Path,default=Path("artifacts/ananta-dataset"))
    ap.add_argument("--output-dir",type=Path,default=Path("artifacts/ananta-adapter"))
    ap.add_argument("--model-id",default="google/gemma-4-E2B-it")
    ap.add_argument("--max-length",type=int,default=1024)
    ap.add_argument("--epochs",type=float,default=3)
    ap.add_argument("--learning-rate",type=float,default=2e-4)
    args=ap.parse_args()

    manifest_path=args.data_dir/"manifest.json"
    if not manifest_path.exists(): raise SystemExit("Dataset manifest missing. Run build_dataset.py first.")
    manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
    if not manifest.get("training_ready"):
        raise SystemExit("Dataset gate failed. Need >=100 train, >=20 validation and >=20 test records.")
    train_rows=read_jsonl(args.data_dir/"train.jsonl")
    val_rows=read_jsonl(args.data_dir/"validation.jsonl")
    test_rows=read_jsonl(args.data_dir/"test.jsonl")
    if len(train_rows)<100 or len(val_rows)<20 or len(test_rows)<20:
        raise SystemExit("Dataset counts do not meet the minimum gate.")
    if not os.environ.get("HF_TOKEN"):
        raise SystemExit("Set HF_TOKEN in your notebook/session after accepting the Gemma model terms. Do not save it in GitHub.")

    import torch
    if not torch.cuda.is_available():
        raise SystemExit("No CUDA GPU detected. CPU-only training is disabled; no paid compute will be started.")
    from transformers import AutoProcessor, AutoModelForMultimodalLM, Trainer, TrainingArguments
    from transformers import BitsAndBytesConfig
    from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

    bf16=torch.cuda.is_bf16_supported()
    compute_dtype=torch.bfloat16 if bf16 else torch.float16
    gpu=torch.cuda.get_device_name(0)
    vram_gb=round(torch.cuda.get_device_properties(0).total_memory/1024**3,1)
    print(f"GPU: {gpu} | VRAM: {vram_gb} GB | BF16: {bf16}")
    if vram_gb < 7:
        raise SystemExit(f"Only {vram_gb} GB VRAM detected; Gemma 4 E2B QLoRA needs about 7 GB at 2K context. Refusing to OOM.")

    processor=AutoProcessor.from_pretrained(args.model_id,token=os.environ["HF_TOKEN"])
    tokenizer=processor.tokenizer
    if tokenizer.pad_token_id is None:
        tokenizer.pad_token=tokenizer.eos_token
    quant=BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=compute_dtype,
        bnb_4bit_use_double_quant=True
    )
    model=AutoModelForMultimodalLM.from_pretrained(
        args.model_id,
        token=os.environ["HF_TOKEN"],
        quantization_config=quant,
        device_map="auto",
        torch_dtype=compute_dtype
    )
    model.config.use_cache=False
    model=prepare_model_for_kbit_training(model,use_gradient_checkpointing=True)
    lora=LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules="all-linear"
    )
    model=get_peft_model(model,lora)
    model.print_trainable_parameters()

    def encode(row):
        messages=row["messages"]
        system=[m for m in messages if m["role"]=="system"]
        user=[m for m in messages if m["role"]=="user"]
        assistant=[m for m in messages if m["role"]=="assistant"]
        if not user or not assistant: raise ValueError("Each row must have user and assistant messages.")
        # The current SFT format has one system, one user and one target answer.
        prompt_messages=system+user
        full_messages=prompt_messages+assistant[-1:]
        prompt=processor.apply_chat_template(
            prompt_messages,tokenize=True,return_dict=True,return_tensors="pt",
            add_generation_prompt=True,enable_thinking=False
        )
        full=processor.apply_chat_template(
            full_messages,tokenize=True,return_dict=True,return_tensors="pt",
            add_generation_prompt=False,enable_thinking=False
        )
        input_ids=full["input_ids"][0].tolist()
        prompt_len=int(prompt["input_ids"].shape[-1])
        if prompt_len>=len(input_ids): raise ValueError("No assistant completion tokens after prompt.")
        completion=input_ids[prompt_len:]
        if len(completion)>=args.max_length: raise ValueError("Assistant completion exceeds max sequence length.")
        prompt_ids=input_ids[:prompt_len]
        if len(prompt_ids)+len(completion)>args.max_length:
            prompt_ids=prompt_ids[-(args.max_length-len(completion)):]
        ids=prompt_ids+completion
        labels=[-100]*len(prompt_ids)+completion.copy()
        return {"input_ids":ids,"attention_mask":[1]*len(ids),"labels":labels}

    class Collator:
        def __call__(self,features):
            max_len=max(len(x["input_ids"]) for x in features)
            pad=tokenizer.pad_token_id
            ids=[]; masks=[]; labels=[]
            for x in features:
                n=max_len-len(x["input_ids"])
                ids.append(x["input_ids"]+[pad]*n)
                masks.append(x["attention_mask"]+[0]*n)
                labels.append(x["labels"]+[-100]*n)
            return {
                "input_ids":torch.tensor(ids,dtype=torch.long),
                "attention_mask":torch.tensor(masks,dtype=torch.long),
                "labels":torch.tensor(labels,dtype=torch.long)
            }

    class Rows(torch.utils.data.Dataset):
        def __init__(self,rows): self.items=[encode(x) for x in rows]
        def __len__(self): return len(self.items)
        def __getitem__(self,i): return self.items[i]

    train_ds=Rows(train_rows); val_ds=Rows(val_rows)
    args.output_dir.mkdir(parents=True,exist_ok=True)
    training_args=TrainingArguments(
        output_dir=str(args.output_dir/"checkpoints"),
        num_train_epochs=args.epochs,
        learning_rate=args.learning_rate,
        per_device_train_batch_size=1,
        per_device_eval_batch_size=1,
        gradient_accumulation_steps=8,
        warmup_ratio=0.05,
        logging_steps=5,
        eval_strategy="epoch",
        save_strategy="epoch",
        save_total_limit=2,
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
        greater_is_better=False,
        bf16=bf16,
        fp16=not bf16,
        optim="paged_adamw_8bit",
        gradient_checkpointing=True,
        max_grad_norm=0.3,
        report_to="none",
        remove_unused_columns=False,
        dataloader_pin_memory=True,
        seed=42
    )
    trainer=Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        data_collator=Collator(),
        processing_class=tokenizer
    )
    result=trainer.train()
    trainer.save_model(str(args.output_dir))
    processor.save_pretrained(str(args.output_dir))
    metadata={
        "model_id":args.model_id,
        "dataset_version":manifest.get("dataset_version"),
        "dataset_manifest":manifest,
        "dataset_manifest_sha256":sha256(manifest_path),
        "train_records":len(train_rows),
        "validation_records":len(val_rows),
        "held_out_test_records":len(test_rows),
        "epochs":args.epochs,
        "learning_rate":args.learning_rate,
        "max_length":args.max_length,
        "gpu":gpu,
        "gpu_vram_gb":vram_gb,
        "platform":platform.platform(),
        "training_metrics":{k:(float(v) if isinstance(v,(int,float)) else str(v)) for k,v in result.metrics.items()},
        "created_at":datetime.now(timezone.utc).isoformat(),
        "status":"adapter-trained; held-out benchmark evaluation still required",
        "note":"Synthetic teacher-authored pilot data. Do not deploy until human review and independent held-out benchmark pass."
    }
    (args.output_dir/"ananta-training-manifest.json").write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(metadata,ensure_ascii=False,indent=2))
    print("Adapter saved to:",args.output_dir)

if __name__=="__main__": main()
