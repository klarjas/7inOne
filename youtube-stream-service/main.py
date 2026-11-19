import re
from urllib.parse import urlparse, parse_qs
from cachetools import TTLCache
from fastapi import FastAPI, HTTPException, Query
from starlette.concurrency import run_in_threadpool
from yt_dlp import YoutubeDL

app = FastAPI(title="7inOne YouTube Stream Resolver")
cache = TTLCache(maxsize=300, ttl=1200)

VIDEO_ID = re.compile(r"^[A-Za-z0-9_-]{11}$")

def normalize_youtube_url(value: str) -> str:
    parsed = urlparse(value)
    host = (parsed.hostname or "").lower().removeprefix("www.")
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only HTTP(S) YouTube URLs are accepted.")
    if host not in {"youtube.com", "m.youtube.com", "youtu.be", "youtube-nocookie.com"}:
        raise ValueError("Only YouTube video URLs are accepted.")
    video_id = ""
    if host == "youtu.be":
        video_id = parsed.path.strip("/").split("/")[0]
    elif parsed.path == "/watch":
        video_id = parse_qs(parsed.query).get("v", [""])[0]
    else:
        parts = [part for part in parsed.path.split("/") if part]
        if len(parts) >= 2 and parts[0] in {"shorts", "embed", "live"}:
            video_id = parts[1]
    if not VIDEO_ID.fullmatch(video_id):
        raise ValueError("Invalid YouTube video URL.")
    return f"https://www.youtube.com/watch?v={video_id}"

def extract_mp4(source_url: str) -> dict:
    normalized = normalize_youtube_url(source_url)
    cached = cache.get(normalized)
    if cached:
        return cached
    options = {
        "quiet": True, "no_warnings": True, "noplaylist": True,
        "skip_download": True,
        "format": "best[ext=mp4][vcodec!=none][acodec!=none]",
        "socket_timeout": 15, "retries": 2,
    }
    with YoutubeDL(options) as ydl:
        info = ydl.extract_info(normalized, download=False)
    stream_url = info.get("url")
    if not stream_url or info.get("ext") != "mp4":
        raise RuntimeError("No combined MP4 video/audio stream is available.")
    result = {"stream_url": stream_url, "title": info.get("title") or "",
              "duration": info.get("duration"), "expires_in": 1200}
    cache[normalized] = result
    return result

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/stream-url")
async def stream_url(url: str = Query(..., min_length=12, max_length=2048)):
    try:
        return {"success": True, "data": await run_in_threadpool(extract_mp4, url)}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=502, detail="Could not extract a combined MP4 stream. The video may be restricted or unsupported.")
