"""Privacy regressions for the ephemeral feedback transcription flow."""

import asyncio
from tempfile import SpooledTemporaryFile

from fastapi import UploadFile
from starlette.datastructures import Headers
from starlette.requests import Request

import server


def test_uploaded_audio_is_closed_immediately_after_read():
    temporary = SpooledTemporaryFile(max_size=1)
    temporary.write(b"temporary voice bytes")
    temporary.seek(0)
    upload = UploadFile(
        file=temporary,
        filename="feedback.webm",
        headers=Headers({"content-type": "audio/webm"}),
    )

    data, filename, content_type = asyncio.run(server._read_feedback_audio(upload))

    assert data == b"temporary voice bytes"
    assert filename == "feedback.webm"
    assert content_type == "audio/webm"
    assert temporary.closed


def test_voice_feedback_persists_only_reviewed_text(monkeypatch):
    captured = {}

    async def fake_request(method, table, **kwargs):
        captured.update({"method": method, "table": table, **kwargs})

    monkeypatch.setattr(server.db, "request", fake_request)
    server._feedback_rate.clear()
    request = Request({
        "type": "http",
        "method": "POST",
        "path": "/api/feedback",
        "headers": [],
        "client": ("127.0.0.1", 12345),
    })

    result = asyncio.run(server.create_feedback(
        request=request,
        submission_type="voice",
        name="Cliente",
        email=None,
        trip_reference="Gran Sur",
        rating=5,
        message="Texto revisado por el cliente.",
        transcription_language="es",
        source_url="http://127.0.0.1:3000/feedback",
        consent=True,
        website=None,
    ))

    stored = captured["json"]
    assert result["submission_type"] == "voice"
    assert captured["table"] == "feedback"
    assert stored["feedback_text"] == "Texto revisado por el cliente."
    assert stored["transcription_language"] == "es"
    assert not any("audio" in key or key == "transcript" for key in stored)
