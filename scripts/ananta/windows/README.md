# ANANTA — Windows local model

## What this starts

- Google Gemma 4 E2B instruction model, Q4_0 GGUF (about 2.84 GB).
- llama.cpp local OpenAI-compatible endpoint at `http://127.0.0.1:9931/v1/chat/completions`.
- CPU inference; no paid API and no GPU required for this inference test.
- A private API key file stored outside the Git repository.

Official model source: https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF
llama.cpp Windows instructions: https://huggingface.co/google/gemma-4-E2B-it-qat-q4_0-gguf

## Start

1. Run `START-ANANTA-LOCAL.bat` from Windows. It installs llama.cpp with winget if missing and downloads the model on first run.
2. Wait for the server to finish loading. The local health endpoint is `http://127.0.0.1:9931/health`.
3. Keep the terminal open. The computer must remain on and connected to the internet while the model is in use.
4. To let the 7inOne Render backend reach this local model, run `START-ANANTA-TUNNEL.bat` in a second terminal. It creates a temporary HTTPS Cloudflare Quick Tunnel. Keep that terminal open too.

## Render environment values

Set these values in the Render service environment after the tunnel is running:

- `ANANTA_MODEL_NAME=ananta-gemma4-e2b`
- `ANANTA_MODEL_URL=https://YOUR-QUICK-TUNNEL.trycloudflare.com/v1/chat/completions`
- `ANANTA_MODEL_API_KEY=` contents of `E:\ANANTA-Local\ananta-api-key.txt` (or `%USERPROFILE%\ANANTA-Local\ananta-api-key.txt` if E: is unavailable).

The Quick Tunnel URL changes when restarted; update `ANANTA_MODEL_URL` each time it changes. Do not share the key or put it in GitHub. The API key is enforced by llama.cpp and the server listens only on localhost.

## Important limits

- This starts the untuned Gemma 4 base instruction model as ANANTA's first local inference engine. It is not the fine-tuned ANANTA adapter yet.
- The current 150-example dataset has passed the minimum data split gate. Fine-tuning still requires a suitable free GPU; the Windows CPU-only machine is not used for QLoRA training.
- CPU answers may be slow. First model download is about 2.8 GB.
- A Quick Tunnel is temporary and the computer must stay on. This is a free development bridge, not a permanent always-on production host.
- Do not deploy to customers until the 20-case benchmark has been reviewed and the fine-tuned adapter improves quality without factual or privacy regressions.
