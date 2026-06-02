"""Tests for automatic image optimisation on CMS upload.

Uploads a large JPEG to a throwaway slot and verifies the stored asset is
a resized WebP (max width 2000), then cleans up.
"""
import io
import os
import requests
from PIL import Image

BASE = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE}/api"
SLOT = "test.opt.pytest"


def _make_jpeg(w, h):
    buf = io.BytesIO()
    Image.new("RGB", (w, h), (90, 120, 60)).save(buf, format="JPEG", quality=92)
    return buf.getvalue()


def test_large_upload_is_resized_to_webp():
    data = _make_jpeg(3000, 2000)
    r = requests.post(
        f"{API}/slots/{SLOT}/upload",
        files={"file": ("big.jpg", data, "image/jpeg")},
        timeout=60,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["content_type"] == "image/webp"
    assert body["url"].endswith(".webp")

    img_bytes = requests.get(f"{BASE}{body['url']}", timeout=30).content
    img = Image.open(io.BytesIO(img_bytes))
    assert img.format == "WEBP"
    assert img.width == 2000           # downscaled from 3000
    assert img.height == 1333          # aspect ratio preserved

    requests.delete(f"{API}/slots/{SLOT}", timeout=30)


def test_small_upload_not_upscaled():
    data = _make_jpeg(500, 400)
    r = requests.post(
        f"{API}/slots/{SLOT}b/upload",
        files={"file": ("small.jpg", data, "image/jpeg")},
        timeout=60,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["content_type"] == "image/webp"
    img = Image.open(io.BytesIO(requests.get(f"{BASE}{body['url']}", timeout=30).content))
    assert img.size == (500, 400)      # never upscaled
    requests.delete(f"{API}/slots/{SLOT}b", timeout=30)
