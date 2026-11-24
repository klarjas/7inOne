#!/usr/bin/env python3
"""Export approved teacher-authored ANANTA examples as a small text corpus.

This is a bootstrap corpus for smoke tests and early experiments only. The source
pilot examples are synthetic teacher-authored examples, not real customer chats.
"""
from __future__ import annotations
import argparse, hashlib, json, re
from pathlib import Path

PII = [
    re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b"),
    re.compile(r"(?<!\d)(?:\+?855|0)(?:[ .-]?\d){7,10}(?!\d)"),
    re.compile(r"(?i)\b(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|sb_secret_[A-Za-z0-9_-]{16,})\b"),
]

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--input",type=Path,default=Path("docs/ananta-sft-pilot-v0.1.jsonl"))
    p.add_argument("--output-dir",type=Path,default=Path("artifacts/ananta-scratch-corpus"))
    a=p.parse_args()
    if not a.input.exists():
        raise SystemExit(f"Input dataset not found: {a.input}")
    raw=a.input.read_bytes()
    rows=[]; ids=set(); groups=set()
    for line_no,line in enumerate(raw.decode("utf-8").splitlines(),1):
        if not line.strip(): continue
        row=json.loads(line)
        rid=row.get("record_id")
        if not isinstance(rid,str) or not rid or rid in ids:
            raise SystemExit(f"Missing or duplicate record_id at line {line_no}")
        ids.add(rid)
        if row.get("review_status")!="approved":
            continue
        source=row.get("source_lesson_id")
        if not source:
            raise SystemExit(f"Missing source_lesson_id at line {line_no}")
        groups.add(source)
        messages=row.get("messages")
        if not isinstance(messages,list) or not messages:
            raise SystemExit(f"Invalid messages at line {line_no}")
        chunks=[]
        for message in messages:
            role=message.get("role")
            text=message.get("content")
            if role not in {"system","user","assistant"} or not isinstance(text,str) or not text.strip():
                raise SystemExit(f"Invalid message at line {line_no}")
            if any(pattern.search(text) for pattern in PII):
                raise SystemExit(f"Possible PII/secret in record {rid}; remove it before training")
            chunks.append(f"<|{role}|>\n{text.strip()}")
        rows.append((rid,"\n".join(chunks)))
    if not rows:
        raise SystemExit("No approved records found")
    a.output_dir.mkdir(parents=True,exist_ok=True)
    corpus="\n\n".join(text for _,text in rows)+"\n"
    corpus_path=a.output_dir/"approved-teacher-corpus.txt"
    corpus_path.write_text(corpus,encoding="utf-8")
    manifest={
        "corpus_version":"ananta-teacher-bootstrap-v0.1",
        "source_file":str(a.input),
        "source_sha256":hashlib.sha256(raw).hexdigest(),
        "approved_records":len(rows),
        "source_lesson_groups":len(groups),
        "corpus_utf8_bytes":len(corpus.encode("utf-8")),
        "corpus_sha256":hashlib.sha256(corpus.encode("utf-8")).hexdigest(),
        "data_origin":"teacher-authored synthetic examples; not real customer conversations",
        "privacy_scan":"basic regex scan only; manual review still required",
        "purpose":"bootstrap/smoke experiments only; insufficient for capable foundation-model pretraining"
    }
    (a.output_dir/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(manifest,ensure_ascii=False,indent=2))

if __name__=="__main__":
    main()
