"""Regression tests for the slot-usage endpoint that powers the
'Dónde se usa esta imagen' panel in the Image Editor.

Run: cd /app/backend && python -m pytest tests/test_slot_usage.py -v
"""
import os
import uuid
import requests

API = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/") + "/api"


def _set_slot(slot_id, url, source="external"):
    r = requests.put(f"{API}/slots/{slot_id}", json={"url": url, "source": source}, timeout=15)
    r.raise_for_status()


def test_usage_nonexistent_slot_returns_empty():
    r = requests.get(f"{API}/slots/zz.does.not.exist.{uuid.uuid4().hex}/usage", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["count"] == 0
    assert data["slots"] == []


def test_usage_single_slot_counts_one():
    tag = uuid.uuid4().hex[:10]
    slot = f"test-usage.single.{tag}"
    url = f"/api/files/xaluca/library/unit_{tag}.jpg"
    _set_slot(slot, url)

    r = requests.get(f"{API}/slots/{slot}/usage", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["count"] == 1
    assert data["slots"][0]["slot_id"] == slot
    assert data["slots"][0]["is_current"] is True


def test_usage_shared_image_lists_all_slots_current_first():
    tag = uuid.uuid4().hex[:10]
    url = f"/api/files/xaluca/library/shared_{tag}.jpg"
    slot_a = f"test-usage.shared-a.{tag}"
    slot_b = f"test-usage.shared-b.{tag}"
    _set_slot(slot_a, url)
    _set_slot(slot_b, url)

    r = requests.get(f"{API}/slots/{slot_a}/usage", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["count"] == 2
    ids = [s["slot_id"] for s in data["slots"]]
    assert slot_a in ids and slot_b in ids
    # current slot must be listed first with is_current True
    assert data["slots"][0]["slot_id"] == slot_a
    assert data["slots"][0]["is_current"] is True
    assert data["slots"][1]["is_current"] is False
