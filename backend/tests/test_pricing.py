"""Regression tests for the centralised pricing endpoints.

Run: cd /app/backend && python -m pytest tests/test_pricing.py -v
"""
import os
import requests
import pytest

API = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/") + "/api"
# Admin password comes from the environment only — never hardcode secrets in source.
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")


def _login_token():
    if not ADMIN_PASSWORD:
        pytest.skip("ADMIN_PASSWORD env var not set")
    r = requests.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
    r.raise_for_status()
    return r.json()["token"]


def test_get_pricing_returns_object():
    r = requests.get(f"{API}/pricing", timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), dict)


def test_put_pricing_requires_auth():
    r = requests.put(
        f"{API}/pricing",
        json={"tiers": [{"people": 2, "low": 1010, "high": 1085}]},
        timeout=15,
    )
    assert r.status_code == 401


def test_put_pricing_persists_and_from_price_is_lowest():
    token = _login_token()
    payload = {
        "tiers": [
            {"people": 2, "low": 1010, "high": 1085},
            {"people": 3, "low": 865, "high": 920},
            {"people": 4, "low": 790, "high": 835},
        ],
        "currency": "EUR",
    }
    r = requests.put(
        f"{API}/pricing",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
        timeout=15,
    )
    assert r.status_code == 200
    saved = r.json()
    assert saved["currency"] == "EUR"
    assert len(saved["tiers"]) == 3

    # GET reflects the saved tiers
    got = requests.get(f"{API}/pricing", timeout=15).json()
    lows = [t["low"] for t in got["tiers"]] + [t["high"] for t in got["tiers"]]
    assert min(lows) == 790  # the "From" price


def test_put_pricing_rejects_invalid_payload():
    token = _login_token()
    r = requests.put(
        f"{API}/pricing",
        json={"tiers": []},  # min_length=1 → 422
        headers={"Authorization": f"Bearer {token}"},
        timeout=15,
    )
    assert r.status_code == 422
