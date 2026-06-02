"""Tests for folder import grouping in POST /api/library/upload.

Uploads images with a `tag` (folder name) and verifies they are grouped
under the normalised tag, then cleans up.
"""
import io
import os
import requests
from PIL import Image

BASE = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE}/api"


def _jpeg(color):
    buf = io.BytesIO()
    Image.new("RGB", (800, 600), color).save(buf, format="JPEG", quality=85)
    return buf.getvalue()


def _cleanup(tag):
    items = requests.get(f"{API}/files", params={"tag": tag, "limit": 50}, timeout=30).json().get("items", [])
    for it in items:
        requests.delete(f"{API}/files/{it['id']}", timeout=30)


def test_folder_upload_groups_under_normalised_tag():
    raw_tag = "Marrakech Test 2026"
    norm_tag = "marrakech-test-2026"
    _cleanup(norm_tag)
    try:
        files = [
            ("files", ("a.jpg", _jpeg((200, 120, 40)), "image/jpeg")),
            ("files", ("b.jpg", _jpeg((40, 120, 200)), "image/jpeg")),
        ]
        r = requests.post(f"{API}/library/upload", files=files, data={"tag": raw_tag}, timeout=60)
        assert r.status_code == 200, r.text
        assert r.json()["count"] == 2

        # The tag must appear in the aggregated tag list
        tags = {t["name"]: t["count"] for t in requests.get(f"{API}/library/tags", timeout=30).json()["tags"]}
        assert tags.get(norm_tag, 0) >= 2

        # And the files must be filterable by it, each carrying library + folder tag
        items = requests.get(f"{API}/files", params={"tag": norm_tag, "limit": 50}, timeout=30).json()["items"]
        assert len(items) == 2
        for it in items:
            assert "library" in it["tags"] and norm_tag in it["tags"]
    finally:
        _cleanup(norm_tag)


def test_library_upload_without_tag_only_library():
    _cleanup("library-notag-probe")  # noop safety
    files = [("files", ("solo.jpg", _jpeg((90, 90, 90)), "image/jpeg"))]
    r = requests.post(f"{API}/library/upload", files=files, timeout=60)
    assert r.status_code == 200, r.text
    up = r.json()["uploaded"][0]
    # fetch its record and confirm it has only the library tag
    item = requests.get(f"{API}/files", params={"q": "solo.jpg", "limit": 5}, timeout=30).json()["items"]
    assert item, "uploaded file not found"
    requests.delete(f"{API}/files/{item[0]['id']}", timeout=30)
