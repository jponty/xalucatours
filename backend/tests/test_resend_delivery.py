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
        first_name="Ana", last_name="García",
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
    assert stored_contact["email"] == "ana@example.com"
    assert stored_contact["preferred_contact_email"] is None
    assert stored_contact["phone"] == "+34600111222"
    for value in (
        "Ana García", "ana@example.com", "+34600111222", "Octubre 2026",
        "4", "Gran Sur", "Email + Teléfono",
        "Queremos una propuesta familiar completa.", "Contacto",
    ):
        assert value in internal[2]
    assert internal[3] == "ana@example.com"
    assert captured[1][0] == "confirmation"
    confirmation_rows = captured[1][5]["summary_rows"]
    assert confirmation_rows == [
        ("Nombre", "Ana"),
        ("Apellido(s)", "García"),
        ("Email", "ana@example.com"),
        ("Teléfono", "+34600111222"),
        ("Fechas", "Octubre 2026"),
        ("Viajeros", "4"),
        ("Interés", "Gran Sur"),
        ("Canal preferido", "Email + Teléfono"),
        ("Destinatario", ""),
        ("Mensaje", "Queremos una propuesta familiar completa."),
        ("Página origen", "Contacto"),
        ("Idioma", "es"),
    ]
    delivery = collection.update_one.await_args_list[-1].args[1]["$set"]["email_delivery"]
    assert delivery["status"] == "accepted"
    assert delivery["notification_id"] == "resend-internal-id"
    assert delivery["confirmation_id"] == "resend-client-id"


@pytest.mark.parametrize("recipient,name", [
    ("noemi", "Noemí Aparicio"),
    ("elena", "Elena"),
    ("sanaa", "Sanaa"),
    ("magda", "Magda"),
])
def test_team_contact_preserves_recipient_in_storage_and_both_emails(monkeypatch, recipient, name):
    collection = _collection(monkeypatch, "contact_requests")
    captured = []
    _accepted_senders(monkeypatch, captured)
    recipient_email = f"{recipient}@example.com"
    monkeypatch.setattr(server, f"TEAM_{recipient.upper()}_EMAIL", recipient_email)
    monkeypatch.setattr(server, "NOTIFY_EMAILS", ["xalucatours@xaluca.com", "joan@xaluca.com"])
    payload = server.ContactRequestCreate(
        first_name="Ana", last_name="García",
        phone="+34612345678",
        email="ana@example.com",
        team_recipient=recipient.upper(),
        journey_interest="team-contact",
        message="Quiero preparar mi viaje a Marruecos.",
        language="es",
    )

    result = asyncio.run(server.create_contact_request(payload))

    assert result.team_recipient == recipient
    assert collection.insert_one.await_args.args[0]["team_recipient"] == recipient
    assert name in captured[0][2]
    assert captured[0][4] == [recipient_email, "xalucatours@xaluca.com", "joan@xaluca.com"]
    assert ("Destinatario", name) in captured[1][5]["summary_rows"]


def test_magda_contact_uses_central_inbox_until_individual_address_is_configured(monkeypatch):
    monkeypatch.setattr(server, "TEAM_MAGDA_EMAIL", "")
    monkeypatch.setattr(server, "NOTIFY_EMAILS", ["team@example.com"])
    assert server._team_notification_recipients("magda") == [
        "team@example.com", "xalucatours@xaluca.com",
    ]


@pytest.mark.parametrize("field,selected,personal_emails", [
    ("founder_recipient", "lluis", ["lluis@example.com"]),
    ("founder_recipient", "tayeb", ["tayeb@example.com"]),
    ("founder_recipient", "both", ["lluis@example.com", "tayeb@example.com"]),
    ("team_recipient", "noemi", ["noemi@example.com"]),
    ("team_recipient", "elena", ["elena@example.com"]),
    ("team_recipient", "sanaa", ["sanaa@example.com"]),
    ("team_recipient", "magda", ["magda@example.com"]),
])
def test_direct_contact_sends_to_personal_and_central_recipients(
    monkeypatch, field, selected, personal_emails,
):
    collection = _collection(monkeypatch, "contact_requests")
    for person in ("lluis", "tayeb"):
        monkeypatch.setattr(server, f"FOUNDER_{person.upper()}_EMAIL", f"{person}@example.com")
    for person in ("noemi", "elena", "sanaa", "magda"):
        monkeypatch.setattr(server, f"TEAM_{person.upper()}_EMAIL", f"{person}@example.com")
    monkeypatch.setattr(server, "NOTIFY_EMAILS", ["xalucatours@xaluca.com", "joan@xaluca.com"])
    monkeypatch.setattr(server, "RESEND_API_KEY", "re_test")
    monkeypatch.setattr(server, "LEADS_FROM_EMAIL", "Xaluca Tours <hola@example.com>")
    sent = []

    def accept(params, *_args, **_kwargs):
        sent.append(params)
        return {"id": f"accepted-{params['to'][0]}"}

    monkeypatch.setattr(server.resend.Emails, "send", accept)
    payload = server.ContactRequestCreate(
        first_name="Ana", last_name="García",
        phone="+34612345678",
        email="ana@example.com",
        message="Quiero preparar mi viaje a Marruecos.",
        language="es",
        **{field: selected},
    )

    asyncio.run(server.create_contact_request(payload))

    assert len(sent) == 2
    internal = next(email for email in sent if email["subject"].startswith("Consulta para"))
    assert internal["to"] == [*personal_emails, "xalucatours@xaluca.com", "joan@xaluca.com"]
    assert internal["reply_to"] == "ana@example.com"
    confirmation = next(email for email in sent if email is not internal)
    assert confirmation["to"] == ["ana@example.com"]
    assert "cc" not in confirmation and "bcc" not in confirmation
    assert collection.insert_one.await_args.args[0][field] == selected
    delivery = collection.update_one.await_args.args[1]["$set"]["email_delivery"]
    assert delivery["status"] == "accepted"


@pytest.mark.parametrize("resolver,selected", [
    (server._founder_notification_recipients, "lluis"),
    (server._founder_notification_recipients, "tayeb"),
    (server._founder_notification_recipients, "both"),
    (server._team_notification_recipients, "noemi"),
    (server._team_notification_recipients, "elena"),
    (server._team_notification_recipients, "sanaa"),
    (server._team_notification_recipients, "magda"),
])
@pytest.mark.parametrize("personal_email,notify_emails,expected", [
    ("", [], ["xalucatours@xaluca.com"]),
    ("not-an-email", ["team@example.com"], ["team@example.com", "xalucatours@xaluca.com"]),
    ("personal@example.com", ["joan@xaluca.com"], [
        "personal@example.com", "joan@xaluca.com", "xalucatours@xaluca.com",
    ]),
    (" XALUCATOURS@XALUCA.COM ", ["xalucatours@xaluca.com", " joan@xaluca.com ", "JOAN@xaluca.com"], [
        "XALUCATOURS@XALUCA.COM", "joan@xaluca.com",
    ]),
])
def test_direct_contact_recipients_always_include_central_inbox_once(
    monkeypatch, resolver, selected, personal_email, notify_emails, expected,
):
    for variable in (
        "FOUNDER_LLUIS_EMAIL", "FOUNDER_TAYEB_EMAIL", "TEAM_NOEMI_EMAIL",
        "TEAM_ELENA_EMAIL", "TEAM_SANAA_EMAIL", "TEAM_MAGDA_EMAIL",
    ):
        monkeypatch.setattr(server, variable, personal_email)
    monkeypatch.setattr(server, "NOTIFY_EMAILS", notify_emails.copy())

    assert resolver(selected) == expected
    assert server.NOTIFY_EMAILS == notify_emails


def test_no_direct_recipient_preserves_general_routing():
    for value in (None, "", "  "):
        assert server._founder_notification_recipients(value) is None
        assert server._team_notification_recipients(value) is None


def test_contact_never_returns_success_when_resend_rejects(monkeypatch):
    collection = _collection(monkeypatch, "contact_requests")
    monkeypatch.setattr(
        server,
        "send_lead_notification",
        lambda *args, **kwargs: (_ for _ in ()).throw(server.EmailDeliveryError("rejected")),
    )
    monkeypatch.setattr(server, "send_client_confirmation", lambda *args, **kwargs: "client-id")
    payload = server.ContactRequestCreate(
        first_name="Ana", last_name="García",
        phone="+34612345678",
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
        first_name="Marc", last_name="Vidal",
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
    assert stored_planner["email"] == "marc@example.com"
    assert stored_planner["preferred_contact_phone"] is None
    planner_html = next(row[2] for row in captured if row[0] == "internal")
    for value in ("Marc Vidal", "+34611222333", "2026-10-10", "2026-10-18", "premium", "Habitación familiar."):
        assert value in planner_html
    planner_confirmation = next(row for row in captured if row[0] == "confirmation")
    summary_rows = planner_confirmation[5]["summary_rows"]
    assert summary_rows
    assert ("Notas", "Habitación familiar.") in summary_rows
    assert ("Canal preferido", "Solamente Email") in summary_rows
    assert next(row for row in captured if row[0] == "internal")[3] == "marc@example.com"

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
        first_name="Ana", last_name="García",
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
            first_name="Ana", last_name="García",
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


def test_both_primary_details_are_required_independently_of_preference():
    with pytest.raises(ValueError, match="phone"):
        server.ContactRequestCreate(
            first_name="Ana", last_name="García",
            email="ana@example.com",
            preferred_contact=["email"],
            message="Necesito información del viaje.",
        )

    with pytest.raises(ValueError, match="phone"):
        server.TripPlannerCreate(
            first_name="Marc", last_name="Vidal",
            email="marc@example.com",
            preferred_contact=["phone"],
        )


@pytest.mark.parametrize("public_origin", ["", "http://127.0.0.1:3100", "https://xalucatours.com"])
def test_planner_confirmation_has_public_archive_cta_and_non_empty_summary(monkeypatch, public_origin):
    sent = {}

    def accept(params, **_kwargs):
        sent.update(params)
        return {"id": "accepted-id"}

    monkeypatch.setattr(server, "RESEND_API_KEY", "re_test")
    monkeypatch.setattr(server, "LEADS_FROM_EMAIL", "Xaluca Tours <hola@example.com>")
    monkeypatch.setattr(server, "PUBLIC_SITE_URL", public_origin)
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
    assert "https://xalucatours.com/archivo" in sent["html"]
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
