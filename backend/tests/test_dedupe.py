"""Tests for duplicate detection (SHA-256) + add-to-existing-tag in the
library upload endpoint POST /api/library/upload.
"""
import io
import os
import requests
from PIL import Image

BASE = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE}/api"


def _png_bytes(seed):
    # Deterministic content so re-uploading yields the same SHA-256.
    img = Image.new("RGB", (640, 480), (seed % 255, (seed * 3) % 255, (seed * 7) % 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def _cleanup(tag):
    items = requests.get(f"{API}/files", params={"tag": tag, "limit": 50}, timeout=30).json().get("items", [])
    for it in items:
        requests.delete(f"{API}/files/{it['id']}", timeout=30)


def test_duplicate_not_stored_and_tag_merged():
    data = _png_bytes(123)
    tag_a, tag_b = "dedupe-a", "dedupe-b"
    _cleanup(tag_a)
    _cleanup(tag_b)
    try:
        # First upload under tag A
        r1 = requests.post(
            f"{API}/library/upload",
            files=[("files", ("x.png", data, "image/png"))],
            data={"tag": tag_a},
            timeout=60,
        )
        assert r1.status_code == 200, r1.text
        assert r1.json()["count"] == 1
        assert len(r1.json()["duplicates"]) == 0

        # Same bytes under tag B -> duplicate, NOT stored, tag B merged in
        r2 = requests.post(
            f"{API}/library/upload",
            files=[("files", ("x-copy.png", data, "image/png"))],
            data={"tag": tag_b},
            timeout=60,
        )
        assert r2.status_code == 200, r2.text
        body = r2.json()
        assert body["count"] == 0                       # nothing new stored
        assert len(body["duplicates"]) == 1
        assert body["duplicates"][0]["tag_added"] is True

        # The single underlying file now carries both folder tags
        items = requests.get(f"{API}/files", params={"tag": tag_b, "limit": 10}, timeout=30).json()["items"]
        assert len(items) == 1
        tags = items[0]["tags"]
        assert tag_a in tags and tag_b in tags and "library" in tags
    finally:
        _cleanup(tag_a)
        _cleanup(tag_b)


def test_distinct_images_both_stored():
    tag = "dedupe-distinct"
    _cleanup(tag)
    try:
        r = requests.post(
            f"{API}/library/upload",
            files=[
                ("files", ("a.png", _png_bytes(10), "image/png")),
                ("files", ("b.png", _png_bytes(200), "image/png")),
            ],
            data={"tag": tag},
            timeout=60,
        )
        assert r.status_code == 200, r.text
        assert r.json()["count"] == 2
        assert len(r.json()["duplicates"]) == 0
    finally:
        _cleanup(tag)
