"""Tests for the CMS autotranslation endpoint POST /api/translate.

Hits the live Emergent LLM key (real call) — keep assertions tolerant of
exact wording, only checking that translations are returned for the
requested target languages.
"""
import os
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE}/api"


def test_translate_es_to_en_fr():
    r = requests.post(
        f"{API}/translate",
        json={
            "text": "Descubre la magia del desierto de Marruecos.",
            "source": "es",
            "targets": ["en", "fr"],
        },
        timeout=60,
    )
    assert r.status_code == 200, r.text
    tr = r.json().get("translations", {})
    assert tr.get("en"), "expected an English translation"
    assert tr.get("fr"), "expected a French translation"
    # Source language must not leak as a target
    assert "es" not in tr


def test_translate_empty_text_returns_empty():
    r = requests.post(
        f"{API}/translate",
        json={"text": "   ", "source": "es", "targets": ["en", "fr"]},
        timeout=30,
    )
    assert r.status_code == 200, r.text
    assert r.json().get("translations") == {}


def test_translate_skips_source_in_targets():
    r = requests.post(
        f"{API}/translate",
        json={"text": "Hola", "source": "es", "targets": ["es"]},
        timeout=30,
    )
    assert r.status_code == 200, r.text
    assert r.json().get("translations") == {}
