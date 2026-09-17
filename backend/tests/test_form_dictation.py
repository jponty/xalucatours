import asyncio
import io
import json
import wave
from types import SimpleNamespace
from unittest.mock import AsyncMock

import httpx
import pytest
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.testclient import TestClient

import form_dictation as dictation


def wav(seconds=1, rate=16000, channels=1, width=2):
    result = io.BytesIO()
    with wave.open(result, "wb") as audio:
        audio.setnchannels(channels)
        audio.setsampwidth(width)
        audio.setframerate(rate)
        audio.writeframes(b"\0" * int(seconds * rate) * channels * width)
    return result.getvalue()


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv("ASSEMBLYAI_API_KEY", "test-only-key")
    monkeypatch.setenv("ASSEMBLYAI_DICTATION_HOURLY_LIMIT", "120")
    app = FastAPI()
    router = APIRouter(prefix="/api")
    dictation.register_dictation_routes(router)
    app.include_router(router)
    return TestClient(app)


@pytest.fixture
def provider(monkeypatch):
    responses = [httpx.Response(200, json={"text": "Quiero conocer el Atlas."})]
    post = AsyncMock(side_effect=lambda *a, **kw: responses.pop(0))
    fake = SimpleNamespace(post=post)
    class Client:
        def __init__(self, **_kwargs): pass
        async def __aenter__(self): return fake
        async def __aexit__(self, *_args): pass
    monkeypatch.setattr(dictation.httpx, "AsyncClient", Client)
    sleep = AsyncMock()
    monkeypatch.setattr(dictation.asyncio, "sleep", sleep)
    return responses, post, sleep


def send(client, audio=None, lang="es", **kwargs):
    return client.post(f"/api/form-dictation?language={lang}",
                       content=audio if audio is not None else wav(), headers={"Content-Type": "audio/wav"}, **kwargs)


def test_configuration_status_and_missing_key(client, monkeypatch):
    status = client.get("/api/form-dictation/status")
    assert status.json() == {"available": True, "max_seconds": 120}
    assert status.headers["cache-control"] == "no-store"
    assert "test-only-key" not in status.text
    monkeypatch.delenv("ASSEMBLYAI_API_KEY")
    assert client.get("/api/form-dictation/status").json()["available"] is False
    assert send(client).status_code == 503


@pytest.mark.parametrize("lang", ["es", "en", "fr"])
def test_raw_wav_proxied_only_to_eu_without_saving_audio(client, provider, lang):
    _, post, _ = provider
    audio = wav()
    result = send(client, audio, lang)
    assert result.status_code == 200
    assert result.json() == {"text": "Quiero conocer el Atlas."}
    assert result.headers["cache-control"] == "no-store"
    args, kwargs = post.call_args
    assert args[0] == "https://sync.eu.assemblyai.com/transcribe"
    assert kwargs["headers"] == {"Authorization": "test-only-key", "X-AAI-Model": "universal-3-5-pro"}
    assert kwargs["files"]["audio"] == ("dictation.wav", audio, "audio/wav")
    assert json.loads(kwargs["files"]["config"][1]) == {"language_code": lang, "timestamps": False}


@pytest.mark.parametrize("audio,status", [
    (b"not audio", 400), (wav(0.02), 400), (wav(120.1), 400),
    (wav(channels=2), 415), (wav(width=1), 415), (wav(rate=12345), 415),
    (wav()[:-10], 400), (b"", 400), (b"a" * (dictation.MAX_BYTES + 1), 413),
])
def test_rejects_invalid_audio_before_provider(client, provider, audio, status):
    assert send(client, audio).status_code == status
    provider[1].assert_not_called()


def test_accepts_exactly_two_minutes(client, provider):
    assert send(client, wav(120)).status_code == 200


def test_rejects_wrong_media_type_language_and_size(client, provider):
    assert client.post("/api/form-dictation", content=wav(), headers={"Content-Type": "audio/webm"}).status_code == 415
    assert send(client, lang="https://evil.test").status_code == 400
    assert client.post("/api/form-dictation", content=b"x", headers={"Content-Type": "audio/wav", "Content-Length": str(dictation.MAX_BYTES + 1)}).status_code == 413
    provider[1].assert_not_called()


@pytest.mark.parametrize("status", [429, 500, 502, 503, 504])
def test_transient_errors_have_only_one_retry(client, provider, status):
    responses, post, sleep = provider
    responses.insert(0, httpx.Response(status, headers={"Retry-After": "2"}))
    assert send(client).status_code == 200
    assert post.call_count == 2
    sleep.assert_awaited_once_with(2)


def test_long_retry_after_is_respected_without_holding_request(client, provider):
    responses, post, sleep = provider
    responses[:] = [httpx.Response(429, headers={"Retry-After": "60"})]
    result = send(client)
    assert result.status_code == 429
    assert result.headers["retry-after"] == "60"
    assert post.call_count == 1
    sleep.assert_not_called()


@pytest.mark.parametrize("status,expected", [(401, 503), (403, 503), (404, 503), (400, 400), (413, 400), (415, 400), (503, 503)])
def test_upstream_errors_never_expose_credentials_or_transcripts(client, provider, status, expected):
    responses, _, _ = provider
    responses[:] = [httpx.Response(status, json={"detail": "private upstream content"})] * 2
    result = send(client)
    assert result.status_code == expected
    assert "private" not in result.text
    assert "test-only-key" not in result.text


@pytest.mark.parametrize("payload,expected", [({"text": " "}, 422), ({"text": 42}, 422), ({}, 422), ({"text": "x" * 20001}, 502)])
def test_no_speech_or_invalid_response(client, provider, payload, expected):
    provider[0][:] = [httpx.Response(200, json=payload)]
    assert send(client).status_code == expected


def test_request_timeout_and_network_error(client, provider):
    provider[1].side_effect = httpx.ReadTimeout("private network details")
    assert send(client).json()["detail"]["code"] == "timeout"
    provider[1].side_effect = httpx.ConnectError("private network details")
    assert send(client).json()["detail"]["code"] == "unavailable"


def test_bounded_quotas_do_not_trust_forwarded_headers(monkeypatch):
    guard = dictation.DictationGuard()
    req = SimpleNamespace(client=SimpleNamespace(host="127.0.0.1"), headers={"x-forwarded-for": "forged"})
    for _ in range(12):
        guard.enter(req)
        guard.inflight -= 1
    with pytest.raises(HTTPException) as exc:
        guard.enter(req)
    assert exc.value.status_code == 429
    assert len(guard.clients) == 1
    assert "127.0.0.1" not in guard.clients
    fresh = dictation.DictationGuard()
    fresh.inflight = 2
    with pytest.raises(HTTPException): fresh.enter(req)
    fresh.inflight = 0
    monkeypatch.setenv("ASSEMBLYAI_DICTATION_HOURLY_LIMIT", "1")
    fresh.enter(req)
    fresh.inflight = 0
    with pytest.raises(HTTPException): fresh.enter(SimpleNamespace(client=SimpleNamespace(host="different")))


def test_streamed_body_cap_without_content_length():
    class Request:
        async def stream(self):
            yield b"a" * dictation.MAX_BYTES
            yield b"b"
    with pytest.raises(HTTPException) as exc:
        asyncio.run(dictation.read_audio(Request()))
    assert exc.value.status_code == 413
