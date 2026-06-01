"""Regression tests for the CMS export/import (cross-environment sync).

Run: cd /app/backend && python -m pytest tests/test_cms_sync.py -v
"""
import os
import re
import uuid
import requests

API = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/") + "/api"


def _admin_password():
    try:
        with open(os.path.join(os.path.dirname(__file__), "..", ".env")) as f:
            for line in f:
                if line.startswith("ADMIN_PASSWORD="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    except OSError:
        pass
    return None


def _token():
    pwd = _admin_password()
    assert pwd, "ADMIN_PASSWORD not configured"
    r = requests.post(f"{API}/admin/login", json={"password": pwd}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["token"]


def test_export_returns_collections():
    r = requests.get(f"{API}/cms/export", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["version"] == 1
    assert "image_slots" in d and "text_slots" in d
    assert isinstance(d["counts"]["image_slots"], int)


def test_import_requires_admin():
    r = requests.post(f"{API}/cms/import", json={"image_slots": [], "text_slots": []}, timeout=15)
    assert r.status_code == 401


def test_import_upserts_slots_and_relativizes():
    token = _token()
    tag = uuid.uuid4().hex[:8]
    img_slot = f"test-cms.img.{tag}"
    txt_slot = f"test-cms.txt.{tag}"
    payload = {
        "image_slots": [
            {"_id": img_slot, "url": f"https://example.com/api/files/x/{tag}.jpg", "source": "library"}
        ],
        "text_slots": [
            {"_id": txt_slot, "values": {"es": "hola", "en": "hi", "fr": "salut"}}
        ],
    }
    r = requests.post(
        f"{API}/cms/import",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
        timeout=20,
    )
    assert r.status_code == 200, r.text
    imported = r.json()["imported"]
    assert imported["image_slots"] == 1 and imported["text_slots"] == 1

    # image url must be relativized on import
    g = requests.get(f"{API}/slots/{img_slot}", timeout=15)
    assert g.json()["url"] == f"/api/files/x/{tag}.jpg"
    # text slot persisted
    t = requests.get(f"{API}/text_slots/{txt_slot}", timeout=15)
    assert t.json()["values"]["es"] == "hola"

    # cleanup
    requests.delete(f"{API}/slots/{img_slot}", timeout=15)
    requests.delete(f"{API}/text_slots/{txt_slot}", timeout=15)
