"""Short, ephemeral form dictation. No audio/transcript is stored or logged here."""
import asyncio
import hashlib
import io
import json
import os
import time
import wave
from collections import deque

import httpx
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

ENDPOINT = "https://sync.eu.assemblyai.com/transcribe"
MAX_SECONDS = 120
MAX_BYTES = 48000 * MAX_SECONDS * 2 + 4096  # mono, PCM16 at up to 48 kHz
SAMPLE_RATES = {8000, 16000, 22050, 24000, 32000, 44100, 48000}


def fail(status, code, retry_after=None):
    headers = {"Cache-Control": "no-store"}
    if retry_after is not None:
        headers["Retry-After"] = str(retry_after)
    raise HTTPException(status, detail={"code": code}, headers=headers)


class DictationGuard:
    """Bounded, per-process quotas; deploy a shared limiter before scaling workers."""
    def __init__(self):
        self.clients = {}
        self.total = deque()
        self.inflight = 0

    def enter(self, request):
        now = time.monotonic()
        self.clients = {key: times for key, times in self.clients.items() if times and now - times[-1] < 3600}
        while self.total and now - self.total[0] >= 3600:
            self.total.popleft()
        # Use the ASGI peer (proxy trust belongs to the deployment), not an
        # unverified client-supplied X-Forwarded-For header.
        peer = request.client.host if request.client else "unknown"
        key = hashlib.sha256(peer.encode()).hexdigest()
        recent = deque(ts for ts in self.clients.get(key, ()) if now - ts < 3600)
        try:
            hourly_limit = max(1, int(os.environ.get("ASSEMBLYAI_DICTATION_HOURLY_LIMIT", "120")))
        except ValueError:
            hourly_limit = 120
        if len(recent) >= 12 or len(self.total) >= hourly_limit or len(self.clients) >= 2048:
            fail(429, "rate_limit", 60)
        if self.inflight >= 2:
            fail(429, "busy", 5)
        recent.append(now)
        self.clients[key] = recent
        self.total.append(now)
        self.inflight += 1


def validate_wav(data):
    try:
        with wave.open(io.BytesIO(data), "rb") as audio:
            frames = audio.getnframes()
            rate = audio.getframerate()
            if (audio.getnchannels() != 1 or audio.getsampwidth() != 2
                    or audio.getcomptype() != "NONE" or rate not in SAMPLE_RATES):
                fail(415, "bad_audio")
            duration = frames / rate
            if not 0.08 <= duration <= MAX_SECONDS:
                fail(400, "audio_duration")
            if len(audio.readframes(frames)) != frames * 2:
                fail(400, "bad_audio")
    except (wave.Error, EOFError, ValueError):
        fail(400, "bad_audio")


async def read_audio(request):
    data = bytearray()
    async for chunk in request.stream():
        if len(data) + len(chunk) > MAX_BYTES:
            fail(413, "audio_too_large")
        data.extend(chunk)
    return bytes(data)


async def transcribe(data, language, api_key):
    async with httpx.AsyncClient(timeout=httpx.Timeout(35, connect=10)) as client:
        for attempt in range(2):
            response = await client.post(
                ENDPOINT,
                headers={"Authorization": api_key, "X-AAI-Model": "universal-3-5-pro"},
                files={
                    "audio": ("dictation.wav", data, "audio/wav"),
                    # Raw HTTP uses language_code; SDKs call it language_codes.
                    "config": (None, json.dumps({"language_code": language, "timestamps": False}), "application/json"),
                },
            )
            if response.status_code in {429, 500, 502, 503, 504} and attempt == 0:
                try:
                    delay = max(1, float(response.headers.get("Retry-After", "1")))
                except ValueError:
                    delay = 1
                # Never retry earlier than the provider allows, or keep a
                # visitor waiting indefinitely for a public form helper.
                if delay <= 3:
                    await asyncio.sleep(delay)
                    continue
            break
    if response.status_code in {401, 403, 404}:
        fail(503, "unavailable")
    if response.status_code == 429:
        fail(429, "rate_limit", 60)
    if response.status_code in {400, 413, 415}:
        fail(400, "bad_audio")
    if response.status_code >= 400:
        fail(503, "unavailable")
    try:
        text = response.json().get("text")
    except (ValueError, AttributeError):
        fail(502, "unavailable")
    if not isinstance(text, str) or not text.strip():
        fail(422, "no_speech")
    if len(text) > 20000:
        fail(502, "unavailable")
    return text.strip()


def register_dictation_routes(router):
    guard = DictationGuard()

    @router.get("/form-dictation/status")
    async def dictation_status():
        return JSONResponse({"available": bool(os.environ.get("ASSEMBLYAI_API_KEY", "").strip()),
                             "max_seconds": MAX_SECONDS}, headers={"Cache-Control": "no-store"})

    @router.post("/form-dictation")
    async def form_dictation(request: Request, language: str = "es"):
        api_key = os.environ.get("ASSEMBLYAI_API_KEY", "").strip()
        if not api_key:
            fail(503, "unavailable")
        if language not in {"es", "en", "fr"}:
            fail(400, "bad_language")
        if request.headers.get("content-type", "").split(";")[0].strip().lower() != "audio/wav":
            fail(415, "bad_audio")
        try:
            length = int(request.headers.get("content-length", "0"))
        except ValueError:
            fail(400, "bad_audio")
        if length > MAX_BYTES:
            fail(413, "audio_too_large")
        guard.enter(request)
        try:
            # Raw, bounded request body avoids multipart's temporary disk files.
            data = await asyncio.wait_for(read_audio(request), timeout=20)
            validate_wav(data)
            text = await asyncio.wait_for(transcribe(data, language, api_key), timeout=80)
            return JSONResponse({"text": text}, headers={"Cache-Control": "no-store"})
        except (asyncio.TimeoutError, httpx.TimeoutException):
            fail(504, "timeout")
        except httpx.RequestError:
            fail(503, "unavailable")
        finally:
            guard.inflight -= 1
