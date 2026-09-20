import asyncio
import uuid
from unittest.mock import Mock

import pytest
from pydantic import ValidationError

import server
from lead_registry import project_lead
from .test_lead_registry import Database


def payload(**changes):
    return {
        "capture_type": "dictation", "full_name": "Ana García", "email": "ana@example.com",
        "phone": "+34 612 345 678", "message": "Queremos recorrer el Atlas en familia durante siete días.",
        "preferred_contact": ["email", "phone"], "preferred_contact_email": "respuesta@example.com",
        "preferred_contact_phone": "+34 699 123 456", "privacy_consent": True,
        "related_trip_id": "tourAtlasDesierto67", "related_trip_title": "Atlas y Desierto · 7 días",
        "source_url": "https://xalucatravel.com/contacto?trip=tourAtlasDesierto67",
        "source_path": "/contacto", "language": "es", **changes,
    }


@pytest.mark.parametrize("changes", [
    {"privacy_consent": False}, {"preferred_contact": []},
    {"full_name": "  "}, {"message": "    "}, {"message": "x" * 4001},
    {"email": None}, {"phone": None},
    {"phone": "612345678"},
])
def test_dictation_requires_valid_contact_consent_and_story(changes):
    with pytest.raises(ValidationError):
        server.ContactRequestCreate(**payload(**changes))


@pytest.mark.parametrize("travel_dates,party_size", [
    (None, None),
    ("Rango: 2026-10-12 → 2026-10-18", "Adultos: 2 · Niños: 1 · Total: 3"),
    ("Día concreto: 2026-11-14", "Adultos: 2 · Niños: 0 · Total: 2"),
    ("Mes flexible: 2027-03", None),
])
@pytest.mark.parametrize("origin", ["https://xalucatours.com", "https://xalucatravel.com"])
def test_dictation_uses_existing_lead_and_both_email_summaries_idempotently(monkeypatch, travel_dates, party_size, origin):
    database = Database()
    monkeypatch.setattr(server, "db", database)
    internal = Mock(return_value="internal-id")
    confirmation = Mock(return_value="confirmation-id")
    monkeypatch.setattr(server, "send_lead_notification", internal)
    monkeypatch.setattr(server, "send_client_confirmation", confirmation)
    data = payload(submission_id=str(uuid.uuid4()), travel_dates=travel_dates, party_size=party_size,
                   source_url=f"{origin}/contacto?trip=tourAtlasDesierto67")
    for _ in range(2):
        asyncio.run(server.create_contact_request(server.ContactRequestCreate(**data)))
    assert len(database.contact_requests.rows) == 1
    row = next(iter(database.contact_requests.rows.values()))
    assert row["privacy_consent"] is True
    assert row["phone"] == "+34612345678"
    assert row["preferred_contact"] == ["email", "phone"]
    lead = project_lead("contact", row, detail=True)
    assert lead["type_label"] == "Dictado"
    assert lead["trip"] == data["related_trip_title"]
    assert lead["source_url"] == data["source_url"]
    assert lead["message"] == data["message"]
    assert lead["details"]["travel_dates"] == travel_dates
    assert lead["details"]["party_size"] == party_size
    internal.assert_called_once()
    confirmation.assert_called_once()
    assert "Dictado" in internal.call_args.args[1]
    assert data["message"] in internal.call_args.args[1]
    assert ("Viaje consultado", data["related_trip_title"]) in confirmation.call_args.kwargs["summary_rows"]
    assert ("Mensaje", data["message"]) in confirmation.call_args.kwargs["summary_rows"]
    for label, value in [("Fechas", travel_dates), ("Viajeros", party_size)]:
        assert (label, value) in confirmation.call_args.kwargs["summary_rows"]
        if value:
            assert value in internal.call_args.args[1]
