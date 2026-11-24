#!/usr/bin/env python3
"""Train ANANTA's tiny random-initialized Transformer on approved UTF-8 text."""
from __future__ import annotations
import argparse, hashlib, json, math, random, time
from pathlib import Path
import torch
from scratch_model import ANANTAScratchConfig, ANANTAScratchLM, UTF8ByteTokenizer, count_parameters

def batches(data,batch_size,seq_len,device):
    max_start=len(data)-seq_len-1
    if max_start<1: raise ValueError("Corpus is shorter than one sequence")
    starts=torch.randint(0,max_start,(batch_size,))
    x=torch.stack([data[i:i+seq_len] for i in starts])
    y=torch.stack([data[i+1:i+seq_len+1] for i in starts])
    return x.to(device),y.to(device)

@torch.no_grad()
def evaluate(model,train_data,val_data,batch_size,seq_len,device):
    model.eval(); metrics={}
    for name,data in (("train",train_data),("validation",val_data)):
        losses=[]
        for _ in range(5):
            x,y=batches(data,batch_size,seq_len,device)
            _,loss=model(x,y); losses.append(float(loss.item()))
        mean=sum(losses)/len(losses)
        metrics[name+"_loss"]=mean
        metrics[name+"_perplexity"]=math.exp(min(mean,20))
    model.train()
    return metrics

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--corpus",type=Path,default=Path("data/ananta-corpus/approved-corpus.txt"))
    p.add_argument("--output",type=Path,default=Path("artifacts/ananta-scratch-v0.1"))
    p.add_argument("--steps",type=int,default=300); p.add_argument("--batch-size",type=int,default=16)
    p.add_argument("--seq-len",type=int,default=128); p.add_argument("--eval-interval",type=int,default=50)
    p.add_argument("--seed",type=int,default=42); p.add_argument("--learning-rate",type=float,default=3e-4)
    p.add_argument("--device",choices=("auto","cpu","cuda"),default="auto")
    p.add_argument("--d-model",type=int,default=128); p.add_argument("--layers",type=int,default=4)
    p.add_argument("--heads",type=int,default=4); a=p.parse_args()
    if a.steps<1 or a.seq_len<8 or a.batch_size<1: raise SystemExit("Invalid training dimensions")
    if not a.corpus.exists(): raise SystemExit(f"Corpus not found: {a.corpus}")
    raw=a.corpus.read_text(encoding="utf-8")
    if len(raw.encode("utf-8"))<2000: raise SystemExit("Need at least 2 KB of approved UTF-8 corpus text")
    random.seed(a.seed); torch.manual_seed(a.seed)
    if torch.cuda.is_available(): torch.cuda.manual_seed_all(a.seed)
    if a.device=="cuda" and not torch.cuda.is_available(): raise SystemExit("CUDA requested but unavailable")
    device=torch.device("cuda" if a.device=="cuda" or (a.device=="auto" and torch.cuda.is_available()) else "cpu")
    tokenizer=UTF8ByteTokenizer(); encoded=torch.tensor(tokenizer.encode(raw),dtype=torch.long)
    split=int(len(encoded)*0.9); train_data,val_data=encoded[:split],encoded[split:]
    if len(val_data)<=a.seq_len+1: raise SystemExit("Validation split too small; add more corpus text")
    config=ANANTAScratchConfig(max_seq_len=a.seq_len,d_model=a.d_model,n_heads=a.heads,n_layers=a.layers)
    model=ANANTAScratchLM(config).to(device); optimizer=torch.optim.AdamW(model.parameters(),lr=a.learning_rate)
    a.output.mkdir(parents=True,exist_ok=True); tokenizer.save(a.output)
    history=[]; started=time.time()
    print(f"ANANTA scratch prototype | device={device} | parameters={count_parameters(model):,}")
    for step in range(1,a.steps+1):
        x,y=batches(train_data,a.batch_size,a.seq_len,device)
        _,loss=model(x,y); optimizer.zero_grad(set_to_none=True); loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(),1.0); optimizer.step()
        if step==1 or step%a.eval_interval==0 or step==a.steps:
            metrics=evaluate(model,train_data,val_data,a.batch_size,a.seq_len,device)
            metrics["step"]=step; history.append(metrics)
            print(json.dumps(metrics,ensure_ascii=False))
            torch.save({"model_state_dict":model.state_dict(),"config":config.to_dict(),
                "step":step,"seed":a.seed,"initialization":"random","tokenizer":"utf8-byte-v0.1"},
                a.output/"checkpoint-latest.pt")
    manifest={"name":"ANANTA","model_version":"scratch-prototype-v0.1",
        "initialization":"random; no pretrained model weights","architecture":"decoder-only Transformer",
        "config":config.to_dict(),"trainable_parameters":count_parameters(model),
        "corpus_file":str(a.corpus),"corpus_sha256":hashlib.sha256(a.corpus.read_bytes()).hexdigest(),
        "corpus_utf8_bytes":len(encoded),"train_utf8_bytes":len(train_data),"validation_utf8_bytes":len(val_data),
        "seed":a.seed,"steps":a.steps,"device":str(device),"elapsed_seconds":round(time.time()-started,2),
        "metrics":history,"status":"prototype-trained; Khmer quality and held-out review required",
        "warning":"This tiny prototype is not a capable assistant or production-ready LLM."}
    (a.output/"training-manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Saved checkpoint and manifest to",a.output)

if __name__=="__main__": main()
