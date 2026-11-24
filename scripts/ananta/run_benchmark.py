#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, os, time, urllib.request, urllib.error
from datetime import datetime, timezone
from pathlib import Path
SYSTEM = ("អ្នកគឺ ANANTA ជំនួយការទិញទំនិញរបស់ 7inOne។ ឆ្លើយជាភាសាខ្មែរធម្មជាតិ និងច្បាស់។ "
          "កុំប្រឌិតតម្លៃ ស្តុក ស្ពែក ការធានា ឬសកម្មភាពដែលមិនបានផ្ទៀងផ្ទាត់។ "
          "បើព័ត៌មានមិនគ្រប់គ្រាន់ សូមសួរតែមួយសំណួរចាំបាច់ ឬប្រាប់ថាត្រូវបញ្ជាក់បន្ថែម។")
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--benchmark",type=Path,default=Path("docs/ananta-benchmark-v0.1.jsonl"))
    ap.add_argument("--output",type=Path)
    args=ap.parse_args()
    endpoint=os.environ.get("ANANTA_MODEL_URL","").strip()
    model=os.environ.get("ANANTA_MODEL_NAME","").strip()
    key=os.environ.get("ANANTA_MODEL_API_KEY","").strip()
    if not endpoint or not model: raise SystemExit("Set ANANTA_MODEL_URL and ANANTA_MODEL_NAME. API key is optional for local endpoints.")
    cases=[json.loads(x) for x in args.benchmark.read_text(encoding="utf-8").splitlines() if x.strip()]
    stamp=datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    output=args.output or Path("artifacts/ananta-evaluations")/("benchmark-"+stamp+".jsonl")
    output.parent.mkdir(parents=True,exist_ok=True)
    with output.open("w",encoding="utf-8") as f:
        for case in cases:
            body=json.dumps({"model":model,"temperature":0.1,"max_tokens":450,"messages":[{"role":"system","content":SYSTEM},{"role":"user","content":case["prompt"]}]}).encode()
            headers={"Content-Type":"application/json"}
            if key: headers["Authorization"]="Bearer "+key
            req=urllib.request.Request(endpoint,data=body,headers=headers,method="POST")
            start=time.monotonic()
            try:
                with urllib.request.urlopen(req,timeout=90) as response: payload=json.loads(response.read().decode("utf-8"))
                answer=payload.get("choices",[{}])[0].get("message",{}).get("content","")
                row={"case_id":case["case_id"],"category":case["category"],"model":model,"answer":answer,"latency_seconds":round(time.monotonic()-start,3),"status":"ok","must_include":case.get("must_include",[]),"must_not_claim":case.get("must_not_claim",[])}
            except (urllib.error.URLError,TimeoutError,ValueError,KeyError) as exc:
                row={"case_id":case["case_id"],"category":case["category"],"model":model,"latency_seconds":round(time.monotonic()-start,3),"status":"error","error":str(exc)[:500]}
            f.write(json.dumps(row,ensure_ascii=False)+"\n")
            print(case["case_id"]+": "+row["status"]+" ("+str(row["latency_seconds"])+"s)")
    print("Saved raw outputs to "+str(output)+". This script does not assign scores.")
if __name__=="__main__": main()
