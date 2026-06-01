"""Regression tests for the text-slot reset endpoint that powers the
'Restablecer texto original' control in text-edit mode.

Run: cd /app/backend && python -m pytest tests/test_text_slots_reset.py -v
"""
import os
import uuid
import requests

API = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/") + "/api"


def _put(slot, values):
    r = requests.put(f"{API}/text_slots/{slot}", json={"values": values}, timeout=15)
    r.raise_for_status()
    return r.json()


def _get(slot):
    r = requests.get(f"{API}/text_slots/{slot}", timeout=15)
    r.raise_for_status()
    return r.json()


def test_reset_single_language_keeps_others():
    slot = f"test-reset.{uuid.uuid4().hex[:10]}"
    _put(slot, {"es": "Editado", "en": "Edited", "fr": "Modifié"})

    r = requests.delete(f"{API}/text_slots/{slot}?lang=es", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "es" not in data["values"]
    assert data["values"].get("en") == "Edited"
    assert data["values"].get("fr") == "Modifié"


def test_reset_last_language_deletes_document():
    slot = f"test-reset.{uuid.uuid4().hex[:10]}"
    _put(slot, {"es": "Solo ES"})

    r = requests.delete(f"{API}/text_slots/{slot}?lang=es", timeout=15)
    assert r.status_code == 200
    assert r.json()["values"] == {}
    # The slot now renders the code default again.
    assert _get(slot)["values"] == {}


def test_reset_whole_slot_without_lang():
    slot = f"test-reset.{uuid.uuid4().hex[:10]}"
    _put(slot, {"es": "A", "en": "B"})

    r = requests.delete(f"{API}/text_slots/{slot}", timeout=15)
    assert r.status_code == 200
    assert r.json()["values"] == {}
    assert _get(slot)["values"] == {}
