"""Independent name parts survive validation, storage, CRM and email rendering."""
import csv
import io
import uuid

import pytest
from pydantic import ValidationError

import server
from lead_name import name_fields
from virtual_assistant import SessionInput
from .test_lead_contact_contract import flow


MODELS = [
    (server.ContactRequestCreate, {"message": "Consulta de viaje"}),
    (server.TripPlannerCreate, {}),
    (server.ProgramDownloadCreate, {"privacy_accepted": True}),
    (server.NewsletterSubscriptionCreate, {"consent": True}),
    (server.ContestSpinPayload, {}),
    (SessionInput, {"privacy_consent": True, "submission_id": str(uuid.uuid4())}),
]


@pytest.mark.parametrize("model,extra", MODELS)
def test_all_identity_contracts_require_two_independent_name_parts(model, extra):
    valid = {"first_name": "  María   José ", "last_name": " de la Cruz  O’Neill ",
             "email": "visitor@example.com", "phone": "+34612345678", **extra}
    parsed = model(**valid)
    assert parsed.first_name == "María José"
    assert parsed.last_name == "de la Cruz O’Neill"
    for field in ("first_name", "last_name"):
        for invalid in (None, "", "  ", "\x00Nombre", "A" * 151):
            with pytest.raises(ValidationError):
                model(**{**valid, field: invalid})
        with pytest.raises(ValidationError):
            model(**{key: value for key, value in valid.items() if key != field})


@pytest.mark.parametrize("model,extra", MODELS[:2])
def test_legacy_full_name_is_derived_never_an_alternative_input(model, extra):
    valid = {"first_name": "Ana María", "last_name": "García de la Torre",
             "email": "visitor@example.com", "phone": "+34612345678", **extra}
    parsed = model(**valid, full_name="Wrong Old Name")
    assert parsed.full_name == "Ana María García de la Torre"
    with pytest.raises(ValidationError):
        model(full_name="Unsplit Legacy Name", email=valid["email"], phone=valid["phone"], **extra)


@pytest.mark.parametrize("kind,endpoint", [
    ("quick_contact", "contact-requests"), ("dictation", "contact-requests"),
    ("exit_intent", "contact-requests"), ("whatsapp_business", "contact-requests"),
    ("fast_track", "contact-requests"), ("team_contact", "contact-requests"),
    ("founder_contact", "contact-requests"), ("trip_information", "contact-requests"),
    ("detailed_planning", "trip-planner"),
])
def test_name_parts_reach_storage_admin_export_and_notifications(flow, kind, endpoint):
    client, db, internal, confirmation = flow
    payload = {"capture_type": kind, "first_name": "Ana María", "last_name": "García de la Torre",
               "email": "visitor@example.com", "phone": "+34612345678", "message": "Viaje en familia",
               "privacy_consent": True, "submission_id": str(uuid.uuid4()), "source_url": "https://xalucatours.com/contacto"}
    result = client.post(f"/api/{endpoint}", json=payload)
    assert result.status_code == 200, result.text
    record = next(iter((db.trip_planner_requests if endpoint == "trip-planner" else db.contact_requests).rows.values()))
    assert record["first_name"] == payload["first_name"]
    assert record["last_name"] == payload["last_name"]
    assert record["full_name"] == "Ana María García de la Torre"
    html = internal.call_args.args[1]
    assert "Apellido(s)" in html and payload["first_name"] in html and payload["last_name"] in html
    confirmation.assert_called_once()
    headers = {"Authorization": "Bearer test-admin"}
    listing = client.get("/api/admin/leads", headers=headers).json()
    lead = listing["items"][0]
    assert lead["first_name"] == payload["first_name"] and lead["last_name"] == payload["last_name"]
    detail = client.get(f"/api/admin/leads/{lead['source']}/{lead['record_id']}", headers=headers).json()
    assert detail["details"]["last_name"] == payload["last_name"]
    exported = client.get("/api/admin/leads/export", headers=headers).text.lstrip("\ufeff")
    row = next(csv.DictReader(io.StringIO(exported)))
    assert row["Nombre"] == payload["first_name"] and row["Apellido(s)"] == payload["last_name"]
    assert row["Nombre original (sin separar)"] == ""


@pytest.mark.parametrize("source", ["contact", "planner", "download", "contest", "feedback"])
def test_historical_names_are_never_split_by_guessing(source):
    from lead_registry import project_lead
    old = {"id": "old", "full_name": "María del Mar de la Fuente", "name": "María del Mar de la Fuente"}
    projected = project_lead(source, old)
    assert projected["first_name"] is None and projected["last_name"] is None
    assert projected["legacy_name"] == old["full_name"]
    assert projected["full_name"] == old["full_name"]
    assert name_fields({"first_name": "Ana", "last_name": "García", "full_name": "Stale"})["full_name"] == "Ana García"
    partial = name_fields({"first_name": "María", "full_name": "María de la Fuente"})
    assert partial["full_name"] == partial["legacy_name"] == "María de la Fuente"
    assert partial["first_name"] == "María" and partial["last_name"] is None


def test_feedback_preserves_optional_name_parts_and_long_display_name():
    base = {"email": "visitor@example.com", "phone": "+34612345678", "message": "Nuestro comentario", "consent": True}
    parsed = server.FeedbackFields(**base, first_name="A" * 120, last_name="B" * 150)
    assert len(parsed.name) == 271
    anonymous = server.FeedbackFields(**base, first_name="  ", last_name="")
    assert anonymous.first_name is anonymous.last_name is anonymous.name is None
    historic = server.FeedbackFields(**base, name="Legacy unsplit name")
    assert historic.name == "Legacy unsplit name" and historic.last_name is None
