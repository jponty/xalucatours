"""No real emails or database writes: verify customer-only promotion coverage."""
import asyncio
import json
from unittest.mock import AsyncMock

import pytest
from starlette.requests import Request
import server
import featured_trip_email as featured


@pytest.fixture
def outbox(monkeypatch):
    messages = []
    def capture(params, **kwargs):
        messages.append(params)
        return "test-message-id"
    monkeypatch.setattr(server, "_send_resend_email", capture)
    monkeypatch.setattr(server, "PUBLIC_SITE_URL", "https://xalucatours.com")
    monkeypatch.setattr(server, "NOTIFY_EMAILS", ["team@example.com"])
    monkeypatch.setattr(server, "_record_lead_email_delivery", AsyncMock())
    async def save(collection, obj):
        return obj, obj.model_dump()
    monkeypatch.setattr(server, "save_submission", save)
    return messages


@pytest.mark.parametrize("lang,path,label", [
    ("es", "/findeano2026", "Viaje destacado"),
    ("en", "/en/newyear2026", "Featured journey"),
    ("fr", "/fr/nouvelan2026", "Voyage à la une"),
    ("unknown", "/findeano2026", "Viaje destacado"),
])
@pytest.mark.parametrize("kind", ["confirmation", "contest", "feedback"])
def test_all_customer_templates_include_shared_block(outbox, kind, lang, path, label):
    if kind == "confirmation":
        server.send_client_confirmation("client@example.com", "Ana", lang)
    elif kind == "contest":
        server.send_contest_prize_email("client@example.com", "Ana", "Premio Spa", lang)
    else:
        server.send_feedback_review_followup("client@example.com", "Ana", "Atlas", 5, "Buen viaje", lang)
    message = outbox[0]
    assert message["to"] == ["client@example.com"]
    assert message["html"].count(label) == 1
    assert f'href="https://xalucatours.com{path}"' in message["html"]
    assert f"https://xalucatours.com{path}" in message["text"]
    assert "pexels_1703316_fe362842.jpg" in message["html"]
    assert len(message["html"].encode()) < 102_000


@pytest.mark.parametrize("capture_type", [
    "quick_contact", "dictation", "whatsapp_business", "exit_intent",
    "trip_information", "general_contact", "fast_track",
])
def test_contact_origins_only_add_featured_trip_to_client_email(outbox, capture_type):
    payload = server.ContactRequestCreate(
        full_name="Ana García", email="client@example.com", phone="+34612345678",
        first_name="Ana", last_name="García", privacy_consent=True,
        capture_type=capture_type, message="Quiero preparar mi viaje por Marruecos", language="es",
    )
    asyncio.run(server.create_contact_request(payload))
    assert len(outbox) == 2
    client = next(message for message in outbox if message["to"] == ["client@example.com"])
    internal = next(message for message in outbox if message["to"] == ["team@example.com"])
    assert "Viaje destacado" in client["html"]
    assert "Viaje destacado" not in internal["html"]
    assert "pexels_1703316_fe362842.jpg" not in internal["html"]


def test_configuration_can_change_or_disable_block(monkeypatch, tmp_path):
    config = json.loads(featured.CONFIG_PATH.read_text())
    config["locales"]["es"].update(name="Otro viaje <especial>", path="/otro-viaje")
    path = tmp_path / "featured.json"
    path.write_text(json.dumps(config))
    monkeypatch.setattr(featured, "CONFIG_PATH", path)
    markup, text = featured.render_featured_trip("es", server._public_site_link)
    assert "Otro viaje &lt;especial&gt;" in markup
    assert "/otro-viaje" in markup and "/otro-viaje" in text
    config["enabled"] = False
    path.write_text(json.dumps(config))
    assert featured.render_featured_trip("es", server._public_site_link) == ("", "")


@pytest.mark.parametrize("kind", ["planner", "download"])
def test_planner_and_download_use_same_customer_only_block(outbox, kind):
    if kind == "planner":
        payload = server.TripPlannerCreate(
            full_name="Ana García", email="client@example.com", phone="+34612345678",
        )
        request = Request({"type": "http", "headers": []})
        asyncio.run(server.create_trip_planner(payload, request))
    else:
        payload = server.ProgramDownloadCreate(
            first_name="Ana", last_name="García", email="client@example.com",
            phone="+34612345678", privacy_accepted=True,
        )
        asyncio.run(server.create_program_download(payload))
    assert len(outbox) == 2
    for message in outbox:
        is_client = message["to"] == ["client@example.com"]
        assert ("Viaje destacado" in message["html"]) == is_client


@pytest.mark.parametrize("field,value", [
    ("image_url", "javascript:alert(1)"),
    ("path", "//other.example/trip"),
    ("path", "https://other.example/trip"),
])
def test_unsafe_configuration_is_omitted(monkeypatch, tmp_path, field, value):
    config = json.loads(featured.CONFIG_PATH.read_text())
    if field == "path":
        config["locales"]["es"][field] = value
    else:
        config[field] = value
    path = tmp_path / "featured.json"
    path.write_text(json.dumps(config))
    monkeypatch.setattr(featured, "CONFIG_PATH", path)
    assert featured.render_featured_trip("es", server._public_site_link) == ("", "")


@pytest.mark.parametrize("contents", ["broken json", "{}", '{"enabled":true,"locales":null}'])
def test_invalid_configuration_does_not_prevent_confirmation(monkeypatch, tmp_path, outbox, contents):
    path = tmp_path / "featured.json"
    path.write_text(contents)
    monkeypatch.setattr(featured, "CONFIG_PATH", path)
    server.send_client_confirmation("client@example.com", "Ana")
    assert "Hemos recibido tu solicitud" in outbox[0]["html"]
    assert "Viaje destacado" not in outbox[0]["html"]
