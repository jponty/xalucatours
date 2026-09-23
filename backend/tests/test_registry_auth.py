from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

import server
from supabase_db import SupabaseCursor


@pytest.mark.parametrize("endpoint,collection,payload", [
    ("text_slots", "text_slot_registry", {"slots": [{"slot_id": "hero", "defaults": {"es": "Hola"}}]}),
    ("image_slots", "image_slot_registry", {"slots": [{"slot_id": "hero", "fallback": "https://example.com/a.jpg"}]}),
    ("image_urls", "remote_image_registry", {"urls": ["https://images.unsplash.com/example.jpg"]}),
])
def test_registration_is_admin_only_and_preserves_batch_payload(monkeypatch, endpoint, collection, payload):
    bulk = AsyncMock()
    monkeypatch.setattr(server, "db", SimpleNamespace(**{collection: SimpleNamespace(bulk_write=bulk)}))
    monkeypatch.setattr(server, "verify_admin_token", lambda token: token == "test-admin")
    app = FastAPI()
    app.include_router(server.api_router)
    client = TestClient(app)
    for headers in ({}, {"Authorization": "Bearer wrong"}):
        assert client.post(f"/api/{endpoint}/register", json=payload, headers=headers).status_code == 401
    bulk.assert_not_awaited()
    response = client.post(f"/api/{endpoint}/register", json=payload, headers={"Authorization": "Bearer test-admin"})
    assert response.status_code == 200 and response.json() == {"registered": 1}
    bulk.assert_awaited_once()
    operation = bulk.call_args.args[0][0]
    assert operation._upsert and "first_seen" in operation._doc["$setOnInsert"]


@pytest.mark.parametrize("kind,collection", [("text_slots", "text_slot_registry"), ("image_slots", "image_slot_registry")])
def test_large_registry_reads_are_admin_only(monkeypatch, kind, collection):
    from unittest.mock import Mock
    find = Mock(return_value=SupabaseCursor([{"_id": "hero", "defaults": {"es": "Hola"}, "alt": "Atlas"}]))
    monkeypatch.setattr(server, "db", SimpleNamespace(**{collection: SimpleNamespace(find=find)}))
    monkeypatch.setattr(server, "verify_admin_token", lambda token: token == "test-admin")
    app = FastAPI()
    app.include_router(server.api_router)
    client = TestClient(app)
    assert client.get(f"/api/{kind}/registry").status_code == 401
    find.assert_not_called()
    response = client.get(f"/api/{kind}/registry", headers={"Authorization": "Bearer test-admin"})
    assert response.status_code == 200 and "hero" in response.json()["registry"]
