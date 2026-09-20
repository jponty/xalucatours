"""Privacy regressions for the ephemeral feedback transcription flow."""

import asyncio
import uuid
from tempfile import SpooledTemporaryFile

import pytest
from fastapi import UploadFile
from starlette.datastructures import Headers
from starlette.requests import Request

import server


@pytest.mark.parametrize("preference", [["email"], ["email", "phone"]])
def test_feedback_http_form_persists_and_notifies_both_contact_details(monkeypatch, preference):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from unittest.mock import Mock

    records = []
    async def save(method, table, **kwargs):
        assert method == "POST" and table == "feedback"
        records.append(kwargs["json"])
    monkeypatch.setattr(server.db, "request", save)
    notify = Mock(return_value="internal-id")
    monkeypatch.setattr(server, "send_lead_notification", notify)
    server._feedback_rate.clear()
    app = FastAPI(); app.include_router(server.api_router)
    client = TestClient(app)
    data = {"name": "Ana", "email": "ana@example.com", "phone": "+34 612 345 678",
            "message": "Gracias por organizar nuestro viaje.", "consent": "true", "preferred_contact": preference}
    response = client.post("/api/feedback", data=data)
    assert response.status_code == 201, response.text
    assert records[0]["phone"] == "+34612345678"
    assert records[0]["email"] == "ana@example.com"
    assert records[0]["preferred_contact"] == preference
    assert server._contact_pref_label(preference) in notify.call_args.args[1]
    for field in ("email", "phone"):
        assert client.post("/api/feedback", data={**data, field: ""}).status_code == 422
    assert len(records) == 1
    notify.assert_called_once()


def test_feedback_retries_reuse_record_and_notification_identity(monkeypatch):
    records = []
    notifications = []

    async def fake_request(method, table, **kwargs):
        assert method == "POST" and table == "feedback"
        assert kwargs["params"] == {"on_conflict": "id"}
        assert "ignore-duplicates" in kwargs["headers"]["Prefer"]
        records.append(kwargs["json"])

    monkeypatch.setattr(server.db, "request", fake_request)
    monkeypatch.setattr(server, "send_lead_notification", lambda *args: notifications.append(args[-1]) or "notification-id")
    server._feedback_rate.clear()
    request = Request({"type": "http", "method": "POST", "path": "/api/feedback", "headers": [], "client": ("127.0.0.1", 12121)})
    payload = dict(request=request, submission_type="text", name="Cliente", email="cliente@example.com", phone="+34612345678", preferred_contact=["email"],
                   trip_reference="Atlas", rating=3, message="Nuestro comentario del viaje.",
                   transcription_language=None, language="es", source_url="https://xalucatravel.com/feedback",
                   consent=True, website=None, submission_id=uuid.uuid4())
    asyncio.run(server.create_feedback(**payload))
    asyncio.run(server.create_feedback(**payload))
    asyncio.run(server.create_feedback(**{**payload, "message": "Otra consulta diferente."}))
    assert records[0]["id"] == records[1]["id"] != records[2]["id"]
    assert notifications[0] == notifications[1] != notifications[2]


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
    monkeypatch.setattr(server, "send_lead_notification", lambda *args, **kwargs: "notif-id")
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
        email="cliente@example.com",
        phone="+34612345678", preferred_contact=["email"],
        trip_reference="Gran Sur",
        rating=3,
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
    assert stored["phone"] == "+34612345678"
    assert stored["preferred_contact"] == ["email"]
    assert not any("audio" in key or key == "transcript" for key in stored)


def test_positive_feedback_with_email_waits_for_both_emails(monkeypatch):
    async def fake_request(*args, **kwargs):
        return None

    monkeypatch.setattr(server.db, "request", fake_request)
    calls = []
    monkeypatch.setattr(server, "send_lead_notification", lambda *args, **kwargs: calls.append("internal") or "notif-id")
    monkeypatch.setattr(server, "send_feedback_review_followup", lambda *args, **kwargs: calls.append("followup") or "followup-id")
    server._feedback_rate.clear()
    request = Request({
        "type": "http",
        "method": "POST",
        "path": "/api/feedback",
        "headers": [],
        "client": ("127.0.0.1", 12346),
    })

    asyncio.run(server.create_feedback(
        request=request,
        submission_type="text",
        name="Ana",
        email="ana@example.com",
        phone="+34612345678", preferred_contact=["email"],
        trip_reference="Gran Sur",
        rating=5,
        message="Una experiencia excelente.",
        transcription_language=None,
        language="es",
        source_url="http://127.0.0.1:3000/feedback",
        consent=True,
        website=None,
    ))

    assert calls == ["internal", "followup"]


def test_followup_is_not_sent_without_both_conditions(monkeypatch):
    async def fake_request(*args, **kwargs):
        return None

    monkeypatch.setattr(server.db, "request", fake_request)
    calls = []
    monkeypatch.setattr(server, "send_lead_notification", lambda *args, **kwargs: calls.append("internal") or "notif-id")
    monkeypatch.setattr(server, "send_feedback_review_followup", lambda *args, **kwargs: calls.append("followup") or "followup-id")
    cases = [
        {"rating": 3, "email": "ana@example.com"},
        {"rating": 2, "email": "ana@example.com"},
    ]
    for index, case in enumerate(cases):
        server._feedback_rate.clear()
        request = Request({
            "type": "http",
            "method": "POST",
            "path": "/api/feedback",
            "headers": [],
            "client": ("127.0.0.1", 12400 + index),
        })
        asyncio.run(server.create_feedback(
            request=request,
            submission_type="text",
            name="Ana",
            email=case["email"],
            phone="+34612345678", preferred_contact=["email"],
            trip_reference="Gran Sur",
            rating=case["rating"],
            message="Comentario del viaje.",
            transcription_language=None,
            language="es",
            source_url="http://127.0.0.1:3000/feedback",
            consent=True,
            website=None,
        ))
    assert calls == ["internal", "internal"]


def test_followup_email_contains_review_and_propagates_failure(monkeypatch):
    sent = []
    monkeypatch.setattr(server, "RESEND_API_KEY", "test-key")
    monkeypatch.setattr(server, "LEADS_FROM_EMAIL", "Xaluca Tours <hola@example.com>")
    monkeypatch.setattr(server, "NOTIFY_EMAILS", [])
    monkeypatch.setattr(server, "_email_attachments", lambda: [])
    monkeypatch.setattr(server.resend.Emails, "send", lambda params: sent.append(params) or {"id": "feedback-id"})

    message_id = server.send_feedback_review_followup(
        "ana@example.com",
        "Ana",
        "Gran Sur",
        4,
        "Un viaje <inolvidable>\nGracias.",
        "es",
    )

    assert message_id == "feedback-id"
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
    with pytest.raises(server.EmailDeliveryError):
        server.send_feedback_review_followup(
            "ana@example.com", "Ana", "Gran Sur", 5, "Excelente", "es"
        )
