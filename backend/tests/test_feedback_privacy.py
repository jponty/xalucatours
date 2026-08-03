"""Privacy regressions for the ephemeral feedback transcription flow."""

import asyncio
from tempfile import SpooledTemporaryFile

from fastapi import BackgroundTasks, UploadFile
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
        background_tasks=BackgroundTasks(),
        submission_type="voice",
        name="Cliente",
        email=None,
        trip_reference="Gran Sur",
        rating=5,
        message="Texto revisado por el cliente.",
        transcription_language="es",
        language="es",
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


def test_positive_feedback_with_email_schedules_followup(monkeypatch):
    async def fake_request(*args, **kwargs):
        return None

    monkeypatch.setattr(server.db, "request", fake_request)
    server._feedback_rate.clear()
    tasks = BackgroundTasks()
    request = Request({
        "type": "http",
        "method": "POST",
        "path": "/api/feedback",
        "headers": [],
        "client": ("127.0.0.1", 12346),
    })

    asyncio.run(server.create_feedback(
        request=request,
        background_tasks=tasks,
        submission_type="text",
        name="Ana",
        email="ana@example.com",
        trip_reference="Gran Sur",
        rating=5,
        message="Una experiencia excelente.",
        transcription_language=None,
        language="es",
        source_url="http://127.0.0.1:3000/feedback",
        consent=True,
        website=None,
    ))

    assert len(tasks.tasks) == 1
    task = tasks.tasks[0]
    assert task.func is server.send_feedback_review_followup
    assert task.args == (
        "ana@example.com",
        "Ana",
        "Gran Sur",
        5,
        "Una experiencia excelente.",
        "es",
    )


def test_followup_is_not_scheduled_without_both_conditions(monkeypatch):
    async def fake_request(*args, **kwargs):
        return None

    monkeypatch.setattr(server.db, "request", fake_request)
    cases = [
        {"rating": 3, "email": "ana@example.com"},
        {"rating": 5, "email": None},
    ]
    for index, case in enumerate(cases):
        server._feedback_rate.clear()
        tasks = BackgroundTasks()
        request = Request({
            "type": "http",
            "method": "POST",
            "path": "/api/feedback",
            "headers": [],
            "client": ("127.0.0.1", 12400 + index),
        })
        asyncio.run(server.create_feedback(
            request=request,
            background_tasks=tasks,
            submission_type="text",
            name="Ana",
            email=case["email"],
            trip_reference="Gran Sur",
            rating=case["rating"],
            message="Comentario del viaje.",
            transcription_language=None,
            language="es",
            source_url="http://127.0.0.1:3000/feedback",
            consent=True,
            website=None,
        ))
        assert tasks.tasks == []


def test_followup_email_contains_review_and_never_raises(monkeypatch):
    sent = []
    monkeypatch.setattr(server, "RESEND_API_KEY", "test-key")
    monkeypatch.setattr(server, "LEADS_FROM_EMAIL", "Xaluca Tours <hola@example.com>")
    monkeypatch.setattr(server, "NOTIFY_EMAILS", [])
    monkeypatch.setattr(server, "_email_attachments", lambda: [])
    monkeypatch.setattr(server.resend.Emails, "send", lambda params: sent.append(params))

    server.send_feedback_review_followup(
        "ana@example.com",
        "Ana",
        "Gran Sur",
        4,
        "Un viaje <inolvidable>\nGracias.",
        "es",
    )

    assert len(sent) == 1
    params = sent[0]
    assert params["to"] == ["ana@example.com"]
    assert "Gran Sur" in params["html"]
    assert "★★★★" in params["html"]
    assert "Un viaje &lt;inolvidable&gt;<br>Gracias." in params["html"]
    assert server.FEEDBACK_GOOGLE_REVIEW_URL in params["html"]
    assert "Un viaje <inolvidable>" in params["text"]

    def fail_send(_params):
        raise RuntimeError("Resend unavailable")

    monkeypatch.setattr(server.resend.Emails, "send", fail_send)
    server.send_feedback_review_followup(
        "ana@example.com", "Ana", "Gran Sur", 5, "Excelente", "es"
    )
