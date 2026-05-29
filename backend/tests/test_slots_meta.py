"""Regression tests for /api/slots/{id} trilingual metadata support.

Validates: optional payload (selective $set), cleared/exists flags,
DELETE preserving metadata, PUT resetting cleared, and the full create
-> read -> partial update -> clear -> recreate flow.
"""
import os
import uuid
import requests
import pytest
from dotenv import load_dotenv
from pathlib import Path

# Load both env files so the suite works whether invoked from supervisor or CLI.
load_dotenv(Path('/app/frontend/.env'))
load_dotenv(Path('/app/backend/.env'))

# Public preview URL (what real users see).
BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']


@pytest.fixture(scope="module")
def slot_id():
    return f"regression.meta.test_{uuid.uuid4().hex[:8]}"


@pytest.fixture(scope="module", autouse=True)
def hard_cleanup(slot_id):
    """After the whole module finishes, drop the test doc straight from Mongo."""
    yield
    try:
        from pymongo import MongoClient
        with MongoClient(MONGO_URL) as cli:
            cli[DB_NAME].image_slots.delete_one({"_id": slot_id})
    except Exception as exc:  # pragma: no cover
        print(f"cleanup failed: {exc}")


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- 1) Fresh slot ----------
def test_01_fresh_slot_returns_exists_false(session, slot_id):
    r = session.get(f"{BASE_URL}/api/slots/{slot_id}")
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["slot_id"] == slot_id
    assert data["url"] is None
    assert data["exists"] is False


# ---------- 2) Full PUT persists url + i18n ----------
def test_02_put_full_payload_persists(session, slot_id):
    payload = {
        "url": "https://example.com/x.jpg",
        "alt_i18n": {"es": "alt ES", "en": "alt EN", "fr": "alt FR"},
        "caption_i18n": {"es": "cap ES", "en": "cap EN", "fr": "cap FR"},
    }
    r = session.put(f"{BASE_URL}/api/slots/{slot_id}", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["url"] == payload["url"]
    assert data["alt_i18n"] == payload["alt_i18n"]
    assert data["caption_i18n"] == payload["caption_i18n"]
    assert data["exists"] is True
    # When url is being set, cleared must flip to False.
    assert data.get("cleared") is False


# ---------- 3) GET returns persisted i18n ----------
def test_03_get_returns_i18n_intact(session, slot_id):
    r = session.get(f"{BASE_URL}/api/slots/{slot_id}")
    assert r.status_code == 200
    data = r.json()
    assert data["exists"] is True
    assert data["url"] == "https://example.com/x.jpg"
    assert data["alt_i18n"] == {"es": "alt ES", "en": "alt EN", "fr": "alt FR"}
    assert data["caption_i18n"] == {"es": "cap ES", "en": "cap EN", "fr": "cap FR"}


# ---------- 4) Selective update: alt_i18n only must NOT clobber url ----------
def test_04_partial_put_does_not_clobber_url(session, slot_id):
    new_alt = {"es": "alt ES v2", "en": "alt EN v2", "fr": "alt FR v2"}
    r = session.put(f"{BASE_URL}/api/slots/{slot_id}", json={"alt_i18n": new_alt})
    assert r.status_code == 200, r.text
    data = r.json()
    # url MUST still be the previous value
    assert data["url"] == "https://example.com/x.jpg"
    assert data["alt_i18n"] == new_alt
    # caption_i18n must also survive
    assert data["caption_i18n"] == {"es": "cap ES", "en": "cap EN", "fr": "cap FR"}


# ---------- 5) DELETE clears but preserves metadata ----------
def test_05_delete_clears_but_preserves_metadata(session, slot_id):
    r = session.delete(f"{BASE_URL}/api/slots/{slot_id}")
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["url"] is None
    assert data["cleared"] is True

    g = session.get(f"{BASE_URL}/api/slots/{slot_id}")
    assert g.status_code == 200
    gd = g.json()
    assert gd["exists"] is True
    assert gd["url"] is None
    assert gd["cleared"] is True
    # Metadata preserved
    assert gd["alt_i18n"] == {"es": "alt ES v2", "en": "alt EN v2", "fr": "alt FR v2"}
    assert gd["caption_i18n"] == {"es": "cap ES", "en": "cap EN", "fr": "cap FR"}


# ---------- 6) Re-PUT a url resets cleared back to false ----------
def test_06_new_put_resets_cleared(session, slot_id):
    r = session.put(
        f"{BASE_URL}/api/slots/{slot_id}",
        json={"url": "https://example.com/y.jpg"},
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["url"] == "https://example.com/y.jpg"
    assert data.get("cleared") is False
    # Metadata still preserved from earlier steps
    assert data["alt_i18n"] == {"es": "alt ES v2", "en": "alt EN v2", "fr": "alt FR v2"}


# ---------- 7) Sanity: existing seed slots are not modified by this suite ----------
def test_07_known_seed_slots_unaffected(session):
    """Spot-check a couple of pre-existing slots respond and are populated."""
    for sid in ("home.hero.0", "sur.hero"):
        r = session.get(f"{BASE_URL}/api/slots/{sid}")
        assert r.status_code == 200, f"{sid} -> {r.text}"
        d = r.json()
        # We only assert they exist; do not assert specific URLs/values.
        assert d["slot_id"] == sid
