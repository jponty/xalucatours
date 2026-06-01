"""Regression tests for domain-independent image slot URLs.

Bug: Pexels/Unsplash imports stored ABSOLUTE urls (origin baked in), which
broke images when the same DB record was served from a different domain
(preview ↔ production) → frontend <img> errored → reverted to code fallback.
Fix: backend relativizes our own /api/... urls on write (PUT/upload) and on
read (GET list + single).

Run: cd /app/backend && python -m pytest tests/test_relativize_slots.py -v
"""
import os
import uuid
import requests

API = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/") + "/api"
ORIGIN = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")


def test_absolute_own_url_is_stored_relative():
    slot = f"test-rel.abs.{uuid.uuid4().hex[:8]}"
    abs_url = f"{ORIGIN}/api/files/xaluca/library/sample_{uuid.uuid4().hex[:6]}.jpg"
    r = requests.put(f"{API}/slots/{slot}", json={"url": abs_url, "source": "library"}, timeout=15)
    assert r.status_code == 200
    assert r.json()["url"].startswith("/api/")
    # and on a fresh GET
    g = requests.get(f"{API}/slots/{slot}", timeout=15)
    assert g.json()["url"].startswith("/api/")
    requests.delete(f"{API}/slots/{slot}", timeout=15)


def test_relative_url_stays_relative():
    slot = f"test-rel.relpath.{uuid.uuid4().hex[:8]}"
    rel = f"/api/files/xaluca/library/keep_{uuid.uuid4().hex[:6]}.jpg"
    r = requests.put(f"{API}/slots/{slot}", json={"url": rel, "source": "library"}, timeout=15)
    assert r.json()["url"] == rel
    requests.delete(f"{API}/slots/{slot}", timeout=15)


def test_external_cdn_url_is_left_untouched():
    slot = f"test-rel.ext.{uuid.uuid4().hex[:8]}"
    ext = "https://images.unsplash.com/photo-123?w=1600&q=80"
    r = requests.put(f"{API}/slots/{slot}", json={"url": ext, "source": "external"}, timeout=15)
    assert r.json()["url"] == ext  # external stock URLs must NOT be rewritten
    requests.delete(f"{API}/slots/{slot}", timeout=15)


def test_list_slots_has_no_absolute_own_urls():
    """After the fix, the bulk slots feed (used by the frontend image cache)
    must never expose absolute URLs that point back at our own /api paths."""
    r = requests.get(f"{API}/slots", timeout=30)
    assert r.status_code == 200
    offenders = [
        s for s in r.json().get("slots", [])
        if (s.get("url") or "").startswith(("http://", "https://")) and "/api/" in (s.get("url") or "")
    ]
    assert offenders == [], f"absolute own-/api urls leaked: {[o['slot_id'] for o in offenders][:5]}"
