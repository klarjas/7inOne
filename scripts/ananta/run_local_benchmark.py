#!/usr/bin/env python3
"""Run ANANTA's fixed Khmer benchmark locally against a Gemma 4 base or adapter."""
from __future__ import annotations
import argparse,json,time
from pathlib import Path

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--benchmark",type=Path,default=Path("docs/ananta-benchmark-v0.1.jsonl"))
    ap.add_argument("--model-id",default="google/gemma-4-E2B-it")
    ap.add_argument("--adapter-dir",type=Path)
    ap.add_argument("--output",type=Path,required=True)
    ap.add_argument("--max-new-tokens",type=int,default=450)
    ap.add_argument("--load-in-4bit",action="store_true")
    args=ap.parse_args()
    import torch
    if not torch.cuda.is_available(): raise SystemExit("A CUDA GPU is required for this benchmark runner. No cloud resources are started.")
    from transformers import AutoProcessor,AutoModelForMultimodalLM,BitsAndBytesConfig
    from peft import PeftModel
    token=__import__("os").environ.get("HF_TOKEN")
    processor=AutoProcessor.from_pretrained(args.model_id,token=token)
    kwargs={"device_map":"auto","torch_dtype":"auto"}
    if args.load_in_4bit:
        dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
        kwargs["quantization_config"]=BitsAndBytesConfig(load_in_4bit=True,bnb_4bit_quant_type="nf4",bnb_4bit_compute_dtype=dtype,bnb_4bit_use_double_quant=True)
    model=AutoModelForMultimodalLM.from_pretrained(args.model_id,token=token,**kwargs)
    if args.adapter_dir:
        model=PeftModel.from_pretrained(model,str(args.adapter_dir))
    model.eval()
    cases=[json.loads(x) for x in args.benchmark.read_text(encoding="utf-8").splitlines() if x.strip()]
    args.output.parent.mkdir(parents=True,exist_ok=True)
    with args.output.open("w",encoding="utf-8") as f:
        for case in cases:
            messages=[
                {"role":"system","content":"អ្នកគឺ ANANTA ជំនួយការទិញទំនិញរបស់ 7inOne។ ឆ្លើយតាមការពិត។ កុំប្រឌិតតម្លៃ ស្តុក ស្ពែក ការធានា ឬសកម្មភាពដែលមិនបានធ្វើ។ បើខ្វះព័ត៌មាន សូមសួរតែមួយសំណួរចាំបាច់ ឬប្រាប់ថាត្រូវបញ្ជាក់បន្ថែម។"},
                {"role":"user","content":case["prompt"]}
            ]
            inputs=processor.apply_chat_template(messages,tokenize=True,return_dict=True,return_tensors="pt",add_generation_prompt=True,enable_thinking=False)
            inputs={k:v.to(model.device) for k,v in inputs.items() if hasattr(v,"to")}
            start=time.monotonic()
            try:
                with torch.inference_mode():
                    output=model.generate(**inputs,max_new_tokens=args.max_new_tokens,do_sample=False)
                answer=processor.decode(output[0][inputs["input_ids"].shape[-1]:],skip_special_tokens=True).strip()
                row={"case_id":case["case_id"],"category":case["category"],"answer":answer,"latency_seconds":round(time.monotonic()-start,3),"must_include":case.get("must_include",[]),"must_not_claim":case.get("must_not_claim",[]),"status":"ok"}
            except Exception as exc:
                row={"case_id":case["case_id"],"category":case["category"],"error":str(exc)[:500],"status":"error","latency_seconds":round(time.monotonic()-start,3)}
            f.write(json.dumps(row,ensure_ascii=False)+"\n")
            print(case["case_id"],row["status"],row["latency_seconds"],"sec")
    print("Saved raw outputs:",args.output)
    print("No automatic self-grading is performed. Have a human review each case.")

if __name__=="__main__": main()
