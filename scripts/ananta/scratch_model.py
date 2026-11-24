#!/usr/bin/env python3
"""ANANTA v0.1: tiny decoder-only Transformer with random initialization."""
from __future__ import annotations
import json
from pathlib import Path
import torch
from torch import nn

class UTF8ByteTokenizer:
    """Lossless reversible UTF-8 byte tokenizer; Khmer-safe prototype."""
    vocab_size = 256
    def encode(self, text: str) -> list[int]:
        return list(text.encode("utf-8"))
    def decode(self, token_ids: list[int]) -> str:
        return bytes(int(x) for x in token_ids).decode("utf-8", errors="replace")
    def save(self, directory: str | Path) -> None:
        path = Path(directory)
        path.mkdir(parents=True, exist_ok=True)
        (path / "tokenizer.json").write_text(json.dumps({
            "type": "utf8-byte", "version": "0.1", "vocab_size": self.vocab_size,
            "description": "One token per UTF-8 byte; lossless for Khmer and Unicode."
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

class ANANTAScratchConfig:
    def __init__(self, vocab_size=256, max_seq_len=128, d_model=128,
                 n_heads=4, n_layers=4, dropout=0.1):
        if d_model % n_heads:
            raise ValueError("d_model must be divisible by n_heads")
        self.vocab_size=vocab_size; self.max_seq_len=max_seq_len
        self.d_model=d_model; self.n_heads=n_heads
        self.n_layers=n_layers; self.dropout=dropout
    def to_dict(self):
        return dict(vars(self))

class ANANTAScratchLM(nn.Module):
    """Causal language model. No pretrained weights are loaded."""
    def __init__(self, config=None):
        super().__init__()
        self.config=config or ANANTAScratchConfig()
        c=self.config
        self.token_embedding=nn.Embedding(c.vocab_size,c.d_model)
        self.position_embedding=nn.Embedding(c.max_seq_len,c.d_model)
        layer=nn.TransformerEncoderLayer(
            d_model=c.d_model,nhead=c.n_heads,dim_feedforward=4*c.d_model,
            dropout=c.dropout,activation="gelu",batch_first=True,norm_first=True)
        self.blocks=nn.TransformerEncoder(layer,num_layers=c.n_layers)
        self.final_norm=nn.LayerNorm(c.d_model)
        self.lm_head=nn.Linear(c.d_model,c.vocab_size,bias=False)
        self.lm_head.weight=self.token_embedding.weight
        self.apply(self._init_weights)
    @staticmethod
    def _init_weights(module):
        if isinstance(module,(nn.Linear,nn.Embedding)):
            nn.init.normal_(module.weight,mean=0.0,std=0.02)
            if isinstance(module,nn.Linear) and module.bias is not None:
                nn.init.zeros_(module.bias)
    def forward(self,input_ids,targets=None):
        _,seq_len=input_ids.shape
        if seq_len>self.config.max_seq_len:
            raise ValueError(f"sequence length {seq_len} exceeds {self.config.max_seq_len}")
        positions=torch.arange(seq_len,device=input_ids.device).unsqueeze(0)
        x=self.token_embedding(input_ids)+self.position_embedding(positions)
        mask=torch.triu(torch.ones(seq_len,seq_len,device=input_ids.device,dtype=torch.bool),diagonal=1)
        x=self.blocks(x,mask=mask)
        logits=self.lm_head(self.final_norm(x))
        loss=None
        if targets is not None:
            loss=nn.functional.cross_entropy(logits.reshape(-1,logits.size(-1)),targets.reshape(-1))
        return logits,loss
    @torch.no_grad()
    def generate(self,input_ids,max_new_tokens=80,temperature=0.8):
        self.eval()
        for _ in range(max_new_tokens):
            logits,_=self(input_ids[:,-self.config.max_seq_len:])
            probs=torch.softmax(logits[:,-1,:]/max(temperature,1e-5),dim=-1)
            input_ids=torch.cat((input_ids,torch.multinomial(probs,1)),dim=1)
        return input_ids

def count_parameters(model):
    return sum(p.numel() for p in model.parameters() if p.requires_grad)
