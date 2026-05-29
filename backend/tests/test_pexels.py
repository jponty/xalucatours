"""Pexels integration tests — search/curated/import proxy endpoints.

Lightweight regression suite for /api/pexels/* endpoints introduced in
iteration 15. We intentionally hit /api/pexels/import only ONCE to
avoid hammering the Pexels quota and consuming MB of bandwidth.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback to reading the frontend env file directly if not exported
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break


@pytest.fixture(scope="module")
def http():
    s = requests.Session()
    s.headers.update({"Accept": "application/json"})
    return s


@pytest.fixture(scope="module")
def first_search_photo(http):
    """One curl to /search → cached for reuse across tests so we only
    spend 1 Pexels search quota per test run."""
    r = http.get(f"{BASE_URL}/api/pexels/search",
                 params={"query": "morocco desert", "per_page": 3},
                 timeout=20)
    assert r.status_code == 200, f"search returned {r.status_code}: {r.text[:200]}"
    body = r.json()
    assert body.get("photos"), "search returned no photos"
    return body["photos"][0]


# ---------- /api/pexels/search ----------

def test_search_basic_shape(first_search_photo):
    p = first_search_photo
    # CMS-shaped fields the frontend relies on
    assert isinstance(p.get("id"), int) and p["id"] > 0
    assert isinstance(p.get("photographer"), str) and p["photographer"]
    assert isinstance(p.get("thumb_url"), str) and p["thumb_url"].startswith("http")
    assert isinstance(p.get("pexels_url"), str) and "pexels.com" in p["pexels_url"]
    assert isinstance(p.get("photographer_url"), str)


def test_search_empty_query_returns_400(http):
    r = http.get(f"{BASE_URL}/api/pexels/search",
                 params={"query": "   ", "per_page": 3},
                 timeout=15)
    assert r.status_code == 400


def test_search_pagination_flag(http):
    r = http.get(f"{BASE_URL}/api/pexels/search",
                 params={"query": "morocco kasbah", "per_page": 3, "page": 1},
                 timeout=20)
    assert r.status_code == 200
    body = r.json()
    assert "next_page" in body
    assert isinstance(body["next_page"], bool)
    assert body.get("page") == 1
    assert len(body.get("photos") or []) <= 3


# ---------- /api/pexels/curated ----------

def test_curated_returns_photos(http):
    r = http.get(f"{BASE_URL}/api/pexels/curated",
                 params={"per_page": 3},
                 timeout=20)
    assert r.status_code == 200
    body = r.json()
    photos = body.get("photos") or []
    assert len(photos) > 0, "curated returned 0 photos"
    p = photos[0]
    assert {"id", "thumb_url", "photographer", "pexels_url"}.issubset(p.keys())


# ---------- /api/pexels/import (run ONCE) ----------

def test_import_persists_file_and_url_resolves(http, first_search_photo):
    pid = first_search_photo["id"]
    r = http.post(f"{BASE_URL}/api/pexels/import",
                  json={"pexels_id": pid},
                  timeout=90)
    assert r.status_code == 200, f"import returned {r.status_code}: {r.text[:300]}"
    body = r.json()

    # Returned shape
    assert body.get("source") == "pexels"
    url = body.get("url") or ""
    assert url.startswith("/api/files/xaluca/library/pexels_"), f"unexpected url: {url}"
    attribution = body.get("pexels") or {}
    assert attribution.get("pexels_id") == pid
    assert attribution.get("photographer")
    assert attribution.get("photographer_url")
    assert attribution.get("pexels_url")

    # File is reachable
    head = http.get(f"{BASE_URL}{url}", timeout=30, stream=True)
    try:
        assert head.status_code == 200
        ctype = head.headers.get("content-type", "")
        assert ctype.startswith("image/"), f"unexpected content-type: {ctype}"
    finally:
        head.close()


def test_import_invalid_id_rejected(http):
    r = http.post(f"{BASE_URL}/api/pexels/import",
                  json={"pexels_id": 0},
                  timeout=15)
    # Pydantic validation rejects gt=0 → 422; if 400 also acceptable
    assert r.status_code in (400, 422)
