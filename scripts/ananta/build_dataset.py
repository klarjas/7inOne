#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, re, sys
from collections import defaultdict
from pathlib import Path

ROLES = {"system", "user", "assistant"}
PII_PATTERNS = [
    re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b"),
    re.compile(r"(?<!\d)(?:\+?855|0)(?:[ .-]?\d){7,10}(?!\d)"),
    re.compile(r"(?i)\b(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|sb_secret_[A-Za-z0-9_-]{16,})\b"),
]
def fail(msg):
    print("ERROR: " + msg, file=sys.stderr)
    raise SystemExit(2)
def load_records(path):
    records, seen = [], set()
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip(): continue
        try: row = json.loads(line)
        except json.JSONDecodeError as exc: fail(f"{path}:{line_no}: invalid JSON: {exc}")
        if not isinstance(row, dict): fail(f"{path}:{line_no}: record must be an object")
        rid = row.get("record_id")
        if not isinstance(rid, str) or not rid.strip(): fail(f"{path}:{line_no}: missing record_id")
        if rid in seen: fail(f"{path}:{line_no}: duplicate record_id {rid}")
        seen.add(rid)
        if row.get("review_status") != "approved": continue
        messages = row.get("messages")
        if not isinstance(messages, list) or len(messages) < 2: fail(f"{path}:{line_no}: {rid} needs at least two messages")
        roles = []
        for m in messages:
            if not isinstance(m, dict) or m.get("role") not in ROLES or not isinstance(m.get("content"), str) or not m["content"].strip():
                fail(f"{path}:{line_no}: {rid} has an invalid message")
            roles.append(m["role"])
            for pattern in PII_PATTERNS:
                if pattern.search(m["content"]): fail(f"{path}:{line_no}: possible personal data/secret in {rid}; remove or anonymize it")
        if "user" not in roles or roles[-1] != "assistant": fail(f"{path}:{line_no}: {rid} must contain a user message and end with assistant")
        if not row.get("source_lesson_id"): fail(f"{path}:{line_no}: {rid} needs source_lesson_id for leakage-safe grouping")
        records.append(row)
    if not records: fail("no approved records found")
    return records
def split_groups(records):
    groups = defaultdict(list)
    for row in records: groups[str(row["source_lesson_id"])].append(row)
    keys = sorted(groups, key=lambda k: hashlib.sha256(("ananta-v1:"+k).encode()).hexdigest())
    n = len(keys)
    if n < 3: fail("need at least 3 distinct source_lesson_id groups before splitting")
    test_n, val_n = max(1, round(n*.15)), max(1, round(n*.15))
    if test_n + val_n >= n: test_n, val_n = 1, 1
    test_keys, val_keys = set(keys[:test_n]), set(keys[test_n:test_n+val_n])
    out = {"train": [], "validation": [], "test": []}
    for key, rows in groups.items():
        split = "test" if key in test_keys else "validation" if key in val_keys else "train"
        for row in rows:
            clean = dict(row); clean["split"] = split; out[split].append(clean)
    for part in out.values(): part.sort(key=lambda x:x["record_id"])
    return out, n
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("input",type=Path)
    ap.add_argument("--output-dir",type=Path,default=Path("artifacts/ananta-dataset"))
    args=ap.parse_args()
    records=load_records(args.input)
    splits, groups=split_groups(records)
    args.output_dir.mkdir(parents=True,exist_ok=True)
    for name, rows in splits.items():
        (args.output_dir/(name+".jsonl")).write_text("".join(json.dumps(r,ensure_ascii=False)+"\n" for r in rows),encoding="utf-8")
    manifest={"dataset_version":"ananta-sft-v0.1","input":str(args.input),"approved_records":len(records),"source_groups":groups,"counts":{k:len(v) for k,v in splits.items()},"group_split":True,"privacy_scan":"basic-pattern-screen-only; manual review still required","training_ready":len(splits["train"])>=100 and len(splits["validation"])>=20 and len(splits["test"])>=20,"note":"Pilot split validates the pipeline only; it is not enough for a meaningful fine-tuning run."}
    (args.output_dir/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(manifest,ensure_ascii=False,indent=2))
    if not manifest["training_ready"]: print("WARNING: dataset is too small for a meaningful fine-tuning run.",file=sys.stderr)
if __name__=="__main__": main()
