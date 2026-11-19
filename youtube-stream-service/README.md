# 7inOne YouTube HTML5 Shorts resolver

This is a separate FastAPI service. The existing 7inOne app remains Node.js/Express.

## Deploy as a separate Render Web Service

- Repository: `klarjas/7inOne`
- Root Directory: `youtube-stream-service`
- Runtime: Python
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Generate a long random secret. Set these environment variables:

- On the Python service: `STREAM_SERVICE_TOKEN=YOUR_LONG_RANDOM_SECRET`
- On the existing 7inOne Node service: `YOUTUBE_STREAM_SERVICE_URL=https://YOUR-PYTHON-SERVICE.onrender.com`
- On the existing 7inOne Node service: `YOUTUBE_STREAM_SERVICE_TOKEN=THE_SAME_LONG_RANDOM_SECRET`

Do not add a trailing slash to the service URL. Keep the token private; the browser calls only the same-origin Node proxy.

## Notes

- Accepts YouTube Shorts, watch, embed and youtu.be URLs only.
- Extracts a combined MP4 stream (audio + video) without downloading it to disk.
- Signed stream URLs are cached in memory for 20 minutes because they expire.
- Cache is per service instance and clears on restart.
- Restricted videos or videos without a combined MP4 format return an error.
- Use only videos you own or are authorized to process. Direct YouTube stream extraction is unofficial and may be restricted by YouTube's terms.
