import uuid
from unittest.mock import Mock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

import server
from .test_lead_registry import Database


@pytest.fixture
def flow(monkeypatch):
    database = Database()
    monkeypatch.setattr(server, "db", database)
    internal = Mock(return_value="internal-id")
    confirmation = Mock(return_value="confirmation-id")
    monkeypatch.setattr(server, "send_lead_notification", internal)
    monkeypatch.setattr(server, "send_client_confirmation", confirmation)
    monkeypatch.setattr(server, "verify_admin_token", lambda token: token == "test-admin")
    app = FastAPI()
    app.include_router(server.api_router)
    return TestClient(app), database, internal, confirmation


@pytest.mark.parametrize("kind,endpoint", [
    ("quick_contact", "contact-requests"), ("dictation", "contact-requests"), ("detailed_planning", "trip-planner"),
])
@pytest.mark.parametrize("methods", [["email"], ["email", "phone"]])
def test_contact_methods_save_lead_notify_and_return_success(flow, kind, endpoint, methods):
    client, database, internal, confirmation = flow
    email = "ana@example.com"
    phone = "+34612345678"
    payload = {
        "capture_type": kind, "first_name": "Ana", "last_name": "García", "message": "Queremos conocer Marruecos en familia.",
        "email": email, "phone": phone, "preferred_contact": methods,
        "privacy_consent": True, "source_url": "https://xalucatours.com/contacto", "source_path": "/contacto",
        "submission_id": str(uuid.uuid4()),
    }
    for _ in range(2):
        response = client.post(f"/api/{endpoint}", json=payload)
        assert response.status_code == 200, response.text
        assert response.json()["email"] == (email or None)
        assert response.json()["phone"] == phone
    internal.assert_called_once()
    assert server._contact_pref_label(methods) in internal.call_args.args[1]
    assert internal.call_args.args[2] == (email or None)
    if email:
        confirmation.assert_called_once()
        assert confirmation.call_args.args[0] == email
    else:
        confirmation.assert_not_called()
        assert phone in internal.call_args.args[1]
        assert "mailto:" not in internal.call_args.args[1]
        assert "None" not in internal.call_args.args[1]
    leads = client.get("/api/admin/leads", headers={"Authorization": "Bearer test-admin"})
    assert leads.status_code == 200, leads.text
    assert leads.json()["total"] == 1
    lead = leads.json()["items"][0]
    assert lead["email"] == (email or None)
    assert lead["phone"] == phone
    assert lead["preferred_contact"] == methods
    assert lead["type"] == kind
    assert lead["source_url"] == payload["source_url"]
    assert lead["delivery_status"] == "accepted"


@pytest.mark.parametrize("endpoint", ["contact-requests", "trip-planner"])
@pytest.mark.parametrize("overrides", [
    {"phone": ""}, {"phone": None}, {"phone": "123"},
    {"email": ""}, {"email": None},
    {"preferred_contact": ["phone"]}, {"preferred_contact": []},
    {"email": "not-an-email"},
])
def test_invalid_contact_does_not_create_or_notify(flow, endpoint, overrides):
    client, database, internal, confirmation = flow
    payload = {"first_name": "Ana", "last_name": "García", "message": "Un viaje a Marruecos", "email": "ana@example.com",
               "preferred_contact": ["email"], "phone": "+34612345678", **overrides}
    assert client.post(f"/api/{endpoint}", json=payload).status_code == 422
    assert not database.contact_requests.rows and not database.trip_planner_requests.rows
    internal.assert_not_called()
    confirmation.assert_not_called()


@pytest.mark.parametrize("model,extra", [
    (server.ContactRequestCreate, {"first_name": "Ana", "last_name": "García", "message": "Un viaje a Marruecos"}),
    (server.TripPlannerCreate, {"first_name": "Ana", "last_name": "García"}),
    (server.ProgramDownloadCreate, {"first_name": "Ana", "last_name": "García", "privacy_accepted": True}),
    (server.NewsletterSubscriptionCreate, {"first_name": "Ana", "last_name": "García", "consent": True}),
    (server.ContestSpinPayload, {"first_name": "Ana", "last_name": "García"}),
    (server.FeedbackFields, {"message": "Un viaje inolvidable", "consent": True}),
])
def test_every_capture_requires_both_details_and_only_two_preferences(model, extra):
    from pydantic import ValidationError
    valid = {**extra, "email": "ana@example.com", "phone": "+34 612 345 678"}
    assert model(**valid).preferred_contact == ["email", "phone"]
    assert model(**valid).phone == "+34612345678"
    assert model(**valid, preferred_contact=["email"]).phone == "+34612345678"
    for field in ("email", "phone"):
        for empty in (None, "", "  "):
            with pytest.raises(ValidationError):
                model(**{**valid, field: empty})
        with pytest.raises(ValidationError):
            model(**{key: value for key, value in valid.items() if key != field})
    for preference in (["phone"], [], ["fax"], None, [{"channel": "email"}, {"channel": "phone"}]):
        with pytest.raises(ValidationError):
            model(**valid, preferred_contact=preference)


def test_legacy_contact_fields_cannot_override_current_identity():
    data = server.ContactRequestCreate(first_name="Ana", last_name="García", email="ana@example.com", phone="+34612345678",
        message="Un viaje a Marruecos", preferred_contact=["email"],
        preferred_contact_email="other@example.com", preferred_contact_phone="+34699123456")
    assert data.email == "ana@example.com"
    assert data.phone == "+34612345678"
    assert "preferred_contact_email" not in data.model_dump()


def test_historical_phone_only_records_still_load():
    historic = server.ContactRequest(full_name="Ana García", email=None, phone="+34612345678", message="Viaje", preferred_contact=["phone"])
    assert historic.email is None
    assert server._contact_pref_label(historic.preferred_contact) == "Teléfono / WhatsApp"


def test_direct_recipient_validation_remains_independent_of_contact_preference():
    from pydantic import ValidationError
    with pytest.raises(ValidationError, match="Choose either a founder or a team recipient"):
        server.ContactRequestCreate(first_name="Ana", last_name="García", email="ana@example.com", phone="+34612345678",
            message="Consulta de viaje", founder_recipient="lluis", team_recipient="noemi")
