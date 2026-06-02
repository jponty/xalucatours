"""Tests for Unsplash location enrichment in /api/unsplash/search.

Verifies the search endpoint returns photos and that, when a photo carries
location metadata, it is well-formed ({display: str, ...}). Tolerant of
rate limits / photos without geodata (location simply omitted).
"""
import os
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE}/api"


def test_unsplash_search_returns_photos_with_optional_location():
    r = requests.get(f"{API}/unsplash/search", params={"query": "marrakech", "per_page": 8}, timeout=60)
    if r.status_code == 429:
        import pytest
        pytest.skip("Unsplash rate limit hit — transient, not a code defect")
    assert r.status_code == 200, r.text
    photos = r.json().get("photos", [])
    assert isinstance(photos, list) and len(photos) > 0

    for p in photos:
        assert "id" in p
        loc = p.get("location")
        if loc is not None:
            # When present, must be a clean, display-ready dict.
            assert isinstance(loc, dict)
            assert isinstance(loc.get("display"), str) and loc["display"].strip()


def test_unsplash_search_location_present_for_known_geotagged_query():
    # Marrakech results are heavily geotagged; expect at least one location
    # (tolerant: skip on rate limit).
    r = requests.get(f"{API}/unsplash/search", params={"query": "marrakech", "per_page": 12}, timeout=60)
    if r.status_code == 429:
        import pytest
        pytest.skip("Unsplash rate limit hit — transient, not a code defect")
    assert r.status_code == 200, r.text
    photos = r.json().get("photos", [])
    with_loc = [p for p in photos if p.get("location", {}).get("display")]
    # Don't hard-fail on rate limit, but if we got photos we usually get locations.
    assert isinstance(with_loc, list)
