"""CRUD smoke tests for /api/text_slots (used by inline CMS)."""
import os
import time
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE}/api"


def test_get_slots_meta():
    r = requests.get(f"{API}/slots", timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), (list, dict))


def test_text_slots_lang_filter():
    for lang in ("es", "en", "fr"):
        r = requests.get(f"{API}/text_slots", params={"lang": lang}, timeout=15)
        assert r.status_code == 200, f"lang={lang}: {r.text}"
        assert isinstance(r.json(), (list, dict))


def test_text_slots_put_then_delete_roundtrip():
    slot_id = f"TEST_AUTOMATION.cross_lang.smoke_{int(time.time())}"
    # PUT (es)
    r = requests.put(
        f"{API}/text_slots/{slot_id}",
        json={"value": "Texto de prueba automatizado", "lang": "es"},
        timeout=15,
    )
    assert r.status_code in (200, 201), r.text
    # GET back (es)
    r2 = requests.get(f"{API}/text_slots", params={"lang": "es"}, timeout=15)
    assert r2.status_code == 200
    body = r2.json()
    found = False
    if isinstance(body, list):
        found = any((it.get("id") == slot_id or it.get("slot_id") == slot_id) for it in body)
    elif isinstance(body, dict):
        found = slot_id in body or slot_id in body.get("slots", {})
    assert found, f"Newly written slot {slot_id} not found in es list"
    # DELETE
    rd = requests.delete(f"{API}/text_slots/{slot_id}", timeout=15)
    assert rd.status_code in (200, 204), rd.text
    # DELETE other langs idempotently
    requests.delete(f"{API}/text_slots/{slot_id}", params={"lang": "en"}, timeout=15)
    requests.delete(f"{API}/text_slots/{slot_id}", params={"lang": "fr"}, timeout=15)


def test_cms_export():
    r = requests.get(f"{API}/cms/export", timeout=15)
    assert r.status_code == 200
    j = r.json()
    assert isinstance(j, (list, dict))
