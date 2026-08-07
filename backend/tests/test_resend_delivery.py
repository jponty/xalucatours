"""Unit coverage for synchronous Resend acceptance across public forms."""

import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
from starlette.requests import Request

import server


def _collection(monkeypatch, name):
    collection = getattr(server.db, name)
    monkeypatch.setattr(collection, "insert_one", AsyncMock())
    monkeypatch.setattr(collection, "update_one", AsyncMock())
    return collection


def _accepted_senders(monkeypatch, captured):
    def internal(subject, html, reply_to=None, recipients=None, idempotency_key=None):
        captured.append(("internal", subject, html, reply_to, recipients, idempotency_key))
        return "resend-internal-id"

    def confirmation(to_email, name, lang="es", idempotency_key=None):
        captured.append(("confirmation", to_email, name, lang, idempotency_key))
        return "resend-client-id"

    monkeypatch.setattr(server, "send_lead_notification", internal)
    monkeypatch.setattr(server, "send_client_confirmation", confirmation)


def test_contact_waits_for_resend_and_includes_every_field(monkeypatch):
    collection = _collection(monkeypatch, "contact_requests")
    captured = []
    _accepted_senders(monkeypatch, captured)
    payload = server.ContactRequestCreate(
        full_name="Ana García",
        email="ana@example.com",
        phone="+34 600 111 222",
        travel_dates="Octubre 2026",
        party_size="4",
        journey_interest="Gran Sur",
        preferred_contact=["email", "phone"],
        message="Queremos una propuesta familiar completa.",
        source_path="/contacto",
        source_label="Contacto",
        language="es",
    )

    result = asyncio.run(server.create_contact_request(payload))

    internal = captured[0]
    assert result.full_name == "Ana García"
    for value in (
        "Ana García", "ana@example.com", "+34 600 111 222", "Octubre 2026",
        "4", "Gran Sur", "Queremos una propuesta familiar completa.", "Contacto",
    ):
        assert value in internal[2]
    assert captured[1][0] == "confirmation"
    delivery = collection.update_one.await_args_list[-1].args[1]["$set"]["email_delivery"]
    assert delivery["status"] == "accepted"
    assert delivery["notification_id"] == "resend-internal-id"
    assert delivery["confirmation_id"] == "resend-client-id"


def test_contact_never_returns_success_when_resend_rejects(monkeypatch):
    collection = _collection(monkeypatch, "contact_requests")
    monkeypatch.setattr(
        server,
        "send_lead_notification",
        lambda *args, **kwargs: (_ for _ in ()).throw(server.EmailDeliveryError("rejected")),
    )
    monkeypatch.setattr(server, "send_client_confirmation", lambda *args, **kwargs: "client-id")
    payload = server.ContactRequestCreate(
        full_name="Ana García",
        email="ana@example.com",
        message="Necesito información del viaje.",
    )

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(server.create_contact_request(payload))

    assert exc_info.value.status_code == 502
    delivery = collection.update_one.await_args_list[-1].args[1]["$set"]["email_delivery"]
    assert delivery["status"] == "failed"


def test_planner_and_program_download_wait_for_both_messages(monkeypatch):
    _collection(monkeypatch, "trip_planner_requests")
    _collection(monkeypatch, "program_downloads")
    captured = []
    _accepted_senders(monkeypatch, captured)
    request = Request({
        "type": "http",
        "method": "POST",
        "path": "/api/trip-planner",
        "headers": [(b"origin", b"https://xalucatours.com")],
        "client": ("127.0.0.1", 12345),
    })
    planner = server.TripPlannerCreate(
        full_name="Marc Vidal",
        email="marc@example.com",
        phone="+34 611 222 333",
        date_mode="range",
        start_date="2026-10-10",
        end_date="2026-10-18",
        travellers_adults=2,
        travellers_children=1,
        accommodation="premium",
        regions=["sur"],
        selected_trips=["tourMarrakechFez67"],
        activities=["desierto", "fotografía"],
        notes="Habitación familiar.",
        preferred_contact=["email"],
        language="es",
    )
    asyncio.run(server.create_trip_planner(planner, request))
    planner_html = next(row[2] for row in captured if row[0] == "internal")
    for value in ("Marc Vidal", "+34 611 222 333", "2026-10-10", "2026-10-18", "premium", "Habitación familiar."):
        assert value in planner_html

    captured.clear()
    download = server.ProgramDownloadCreate(
        first_name="Laura",
        last_name="Costa",
        email="laura@example.com",
        phone="+34 622 333 444",
        newsletter=True,
        privacy_accepted=True,
        route_id="tourMarrakechFez67",
        program_title="Marrakech a Fez",
        language="es",
    )
    asyncio.run(server.create_program_download(download))
    download_html = next(row[2] for row in captured if row[0] == "internal")
    for value in ("Laura Costa", "laura@example.com", "+34 622 333 444", "Marrakech a Fez", "Sí"):
        assert value in download_html
    assert [row[0] for row in captured] == ["internal", "confirmation"]


def test_resend_acceptance_requires_recipient_and_message_id(monkeypatch):
    monkeypatch.setattr(server, "RESEND_API_KEY", "re_test")
    monkeypatch.setattr(server, "LEADS_FROM_EMAIL", "Xaluca Tours <hola@example.com>")
    monkeypatch.setattr(server, "NOTIFY_EMAILS", [])
    with pytest.raises(server.EmailDeliveryError):
        server.send_lead_notification("Subject", "<p>Body</p>")

    monkeypatch.setattr(server.resend.Emails, "send", lambda *_args, **_kwargs: {})
    with pytest.raises(server.EmailDeliveryError):
        server.send_client_confirmation("ana@example.com", "Ana")

    monkeypatch.setattr(server.resend.Emails, "send", lambda *_args, **_kwargs: {"id": "accepted-id"})
    assert server.send_client_confirmation("ana@example.com", "Ana") == "accepted-id"


def test_empty_database_recipients_fall_back_to_render_environment(monkeypatch):
    settings = server.db.app_settings
    monkeypatch.setattr(settings, "find_one", AsyncMock(return_value={"key": "notify_emails", "emails": []}))
    update = AsyncMock()
    monkeypatch.setattr(settings, "update_one", update)
    monkeypatch.setattr(server, "LEADS_NOTIFY_EMAILS", ["central@xaluca.com"])
    monkeypatch.setattr(server, "NOTIFY_EMAILS", [])

    asyncio.run(server.load_notify_emails())

    assert server.NOTIFY_EMAILS == ["central@xaluca.com"]
    persisted = update.await_args.args[1]["$set"]["emails"]
    assert persisted == ["central@xaluca.com"]
