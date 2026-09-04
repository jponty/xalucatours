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

    def confirmation(to_email, name, lang="es", idempotency_key=None, **kwargs):
        captured.append(("confirmation", to_email, name, lang, idempotency_key, kwargs))
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
        preferred_contact_email="respuesta.ana@example.com",
        preferred_contact_phone="+34 699 555 444",
        message="Queremos una propuesta familiar completa.",
        source_path="/contacto",
        source_label="Contacto",
        language="es",
    )

    result = asyncio.run(server.create_contact_request(payload))

    internal = captured[0]
    assert result.full_name == "Ana García"
    stored_contact = collection.insert_one.await_args.args[0]
    assert stored_contact["preferred_contact_email"] == "respuesta.ana@example.com"
    assert stored_contact["preferred_contact_phone"] == "+34699555444"
    for value in (
        "Ana García", "ana@example.com", "+34600111222", "Octubre 2026",
        "4", "Gran Sur", "respuesta.ana@example.com", "+34699555444",
        "Queremos una propuesta familiar completa.", "Contacto",
    ):
        assert value in internal[2]
    assert internal[3] == "respuesta.ana@example.com"
    assert captured[1][0] == "confirmation"
    confirmation_rows = captured[1][5]["summary_rows"]
    assert confirmation_rows == [
        ("Nombre", "Ana García"),
        ("Email", "ana@example.com"),
        ("Teléfono", "+34600111222"),
        ("Fechas", "Octubre 2026"),
        ("Viajeros", "4"),
        ("Interés", "Gran Sur"),
        ("Canal preferido", "Correo electrónico, Teléfono / WhatsApp"),
        ("Email preferido de contacto", "respuesta.ana@example.com"),
        ("Teléfono / WhatsApp preferido", "+34699555444"),
        ("Destinatario", ""),
        ("Mensaje", "Queremos una propuesta familiar completa."),
        ("Página origen", "Contacto"),
        ("Idioma", "es"),
    ]
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
    planner_collection = _collection(monkeypatch, "trip_planner_requests")
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
        preferred_contact_email="viajes.marc@example.com",
        language="es",
    )
    asyncio.run(server.create_trip_planner(planner, request))
    stored_planner = planner_collection.insert_one.await_args.args[0]
    assert stored_planner["preferred_contact_email"] == "viajes.marc@example.com"
    assert stored_planner["preferred_contact_phone"] is None
    planner_html = next(row[2] for row in captured if row[0] == "internal")
    for value in ("Marc Vidal", "+34611222333", "2026-10-10", "2026-10-18", "premium", "Habitación familiar."):
        assert value in planner_html
    planner_confirmation = next(row for row in captured if row[0] == "confirmation")
    summary_rows = planner_confirmation[5]["summary_rows"]
    assert summary_rows
    assert ("Notas", "Habitación familiar.") in summary_rows
    assert ("Email preferido de contacto", "viajes.marc@example.com") in summary_rows
    assert next(row for row in captured if row[0] == "internal")[3] == "viajes.marc@example.com"

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
    for value in ("Laura Costa", "laura@example.com", "+34622333444", "Marrakech a Fez", "Sí"):
        assert value in download_html
    assert [row[0] for row in captured] == ["internal", "confirmation"]


def test_phone_fields_are_normalized_and_require_country_code():
    contact = server.ContactRequestCreate(
        full_name="Ana García",
        email="ana@example.com",
        phone="+34 600 111 222",
        message="Necesito información del viaje.",
    )
    assert contact.phone == "+34600111222"

    download = server.ProgramDownloadCreate(
        first_name="Laura",
        last_name="Costa",
        email="laura@example.com",
        phone="+33 6 12 34 56 78",
        privacy_accepted=True,
    )
    assert download.phone == "+33612345678"

    with pytest.raises(ValueError, match="international calling code"):
        server.ContactRequestCreate(
            full_name="Ana García",
            email="ana@example.com",
            phone="600 111 222",
            message="Necesito información del viaje.",
        )


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


def test_selected_contact_methods_require_their_own_details():
    with pytest.raises(ValueError, match="Preferred contact email is required"):
        server.ContactRequestCreate(
            full_name="Ana García",
            email="ana@example.com",
            preferred_contact=["email"],
            message="Necesito información del viaje.",
        )

    with pytest.raises(ValueError, match="Preferred contact phone is required"):
        server.TripPlannerCreate(
            full_name="Marc Vidal",
            email="marc@example.com",
            preferred_contact=["phone"],
        )


def test_planner_confirmation_has_public_archive_cta_and_non_empty_summary(monkeypatch):
    sent = {}

    def accept(params, **_kwargs):
        sent.update(params)
        return {"id": "accepted-id"}

    monkeypatch.setattr(server, "RESEND_API_KEY", "re_test")
    monkeypatch.setattr(server, "LEADS_FROM_EMAIL", "Xaluca Tours <hola@example.com>")
    monkeypatch.setattr(server, "PUBLIC_SITE_URL", "http://127.0.0.1:3100")
    monkeypatch.setattr(server.resend.Emails, "send", accept)

    result = server.send_client_confirmation(
        "joan@example.com",
        "Joan Pont",
        summary_rows=[
            ("Nombre", "Joan Pont"),
            ("Fechas", "10 → 18 de octubre"),
            ("Alojamiento", "premium"),
            ("Notas", ""),
        ],
    )

    assert result == "accepted-id"
    assert sent["subject"] == "Hemos recibido tu solicitud · Xaluca Tours"
    assert "Mientras preparamos tu propuesta" in sent["html"]
    assert "Explorar todos nuestros viajes" in sent["html"]
    assert "https://xaluca-tours-web.onrender.com/archivo" in sent["html"]
    assert "Resumen de tu solicitud" in sent["html"]
    assert "10 → 18 de octubre" in sent["html"]
    assert "premium" in sent["html"]
    assert "Notas" not in sent["html"]
    assert "127.0.0.1" not in sent["html"]


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
