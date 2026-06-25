"""Backend tests for the hardened GET /api/files listing endpoint.

The fix being verified:
  * Always returns valid JSON (never propagates a 5xx).
  * Metadata-only (no file bytes / base64).
  * Pagination with capped limit (1..200) and a `has_more` flag.
  * Search (`q`) and tag (`tag`) filters never crash on weird input.
  * Index-backed sort -> responds quickly (< 5s) even with thousands of docs.
  * Regression: GET /api/files/{storage_path} still serves binary image bytes.
"""

import os
import time

import pytest
import requests

def _load_base_url():
    url = os.environ.get("REACT_APP_BACKEND_URL")
    if not url:
        # Fall back to the frontend .env so tests can be run locally.
        env_path = "/app/frontend/.env"
        if os.path.exists(env_path):
            for line in open(env_path):
                if line.startswith("REACT_APP_BACKEND_URL="):
                    url = line.split("=", 1)[1].strip()
                    break
    if not url:
        raise RuntimeError("REACT_APP_BACKEND_URL not configured")
    return url.rstrip("/")


BASE_URL = _load_base_url()
FILES_URL = f"{BASE_URL}/api/files"

# Fields that we expect on each listed item.
METADATA_FIELDS = {
    "id", "url", "storage_path", "original_filename",
    "content_type", "size", "slot_id", "tags", "created_at",
}
# Fields that would imply we are leaking the raw file content.
FORBIDDEN_FIELDS = {"data", "bytes", "content", "blob", "base64", "raw"}


# ---------- shared fixtures ----------

@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Accept": "application/json"})
    return sess


def _assert_envelope(payload, expect_limit=None):
    """Validate the top-level response envelope."""
    assert isinstance(payload, dict), f"payload not dict: {type(payload)}"
    for key in ("items", "total", "has_more", "limit", "skip"):
        assert key in payload, f"missing key {key!r} in {list(payload)}"
    assert isinstance(payload["items"], list)
    assert isinstance(payload["total"], int)
    assert isinstance(payload["has_more"], bool)
    assert isinstance(payload["limit"], int)
    assert isinstance(payload["skip"], int)
    assert payload["limit"] >= 1
    assert payload["skip"] >= 0
    if expect_limit is not None:
        assert payload["limit"] == expect_limit, (
            f"limit={payload['limit']} expected={expect_limit}"
        )


def _assert_items_metadata_only(items):
    for it in items:
        assert isinstance(it, dict)
        # Required metadata field present (id + storage_path are the hard ones).
        assert "id" in it
        assert "storage_path" in it
        assert "url" in it
        # Never leak raw file payload.
        keys_lower = {str(k).lower() for k in it.keys()}
        leaks = keys_lower & FORBIDDEN_FIELDS
        assert not leaks, f"file listing item leaks raw content fields: {leaks}"
        # Also: no value should look like a giant base64 blob.
        for v in it.values():
            if isinstance(v, str) and len(v) > 4000:
                pytest.fail(f"suspiciously large string in metadata: len={len(v)}")


# ---------- baseline tests ----------

class TestBasicListing:
    def test_default_call_returns_json_200_under_5s(self, s):
        t0 = time.time()
        r = s.get(FILES_URL, timeout=10)
        dt = time.time() - t0
        assert r.status_code == 200, r.text[:500]
        assert "application/json" in r.headers.get("content-type", ""), r.headers
        body = r.json()
        _assert_envelope(body, expect_limit=60)
        _assert_items_metadata_only(body["items"])
        assert dt < 5.0, f"listing took {dt:.2f}s (>5s) — index/timeout issue?"

    def test_items_only_contain_metadata_fields(self, s):
        r = s.get(FILES_URL, params={"limit": 20}, timeout=10)
        assert r.status_code == 200
        body = r.json()
        _assert_envelope(body, expect_limit=20)
        for it in body["items"]:
            extra = set(it.keys()) - METADATA_FIELDS
            assert not extra, f"unexpected fields in item: {extra}"
        _assert_items_metadata_only(body["items"])


# ---------- pagination ----------

class TestPagination:
    def test_limit_5(self, s):
        r = s.get(FILES_URL, params={"limit": 5}, timeout=10)
        assert r.status_code == 200
        body = r.json()
        _assert_envelope(body, expect_limit=5)
        assert len(body["items"]) <= 5

    def test_skip_returns_different_page(self, s):
        a = s.get(FILES_URL, params={"limit": 5, "skip": 0}, timeout=10).json()
        b = s.get(FILES_URL, params={"limit": 5, "skip": 10}, timeout=10).json()
        _assert_envelope(a, expect_limit=5)
        _assert_envelope(b, expect_limit=5)
        # If there is enough data, the two pages should not be identical.
        if a["total"] >= 15 and a["items"] and b["items"]:
            a_ids = [i["id"] for i in a["items"]]
            b_ids = [i["id"] for i in b["items"]]
            assert a_ids != b_ids, "skip=10 returned the same page as skip=0"

    def test_has_more_true_when_more_files_exist(self, s):
        # Ask for a tiny page; with ~4228 docs, has_more must be True.
        body = s.get(FILES_URL, params={"limit": 1}, timeout=10).json()
        _assert_envelope(body, expect_limit=1)
        if body["total"] > 1:
            assert body["has_more"] is True

    def test_limit_capped_at_200(self, s):
        body = s.get(FILES_URL, params={"limit": 1000}, timeout=15).json()
        _assert_envelope(body, expect_limit=200)
        assert len(body["items"]) <= 200

    def test_limit_zero_floors_to_at_least_one(self, s):
        r = s.get(FILES_URL, params={"limit": 0}, timeout=10)
        assert r.status_code == 200
        body = r.json()
        assert body["limit"] >= 1

    def test_negative_skip_and_limit(self, s):
        r = s.get(FILES_URL, params={"limit": -3, "skip": -5}, timeout=10)
        assert r.status_code == 200
        body = r.json()
        _assert_envelope(body)
        assert body["limit"] >= 1
        assert body["skip"] >= 0


# ---------- filters ----------

class TestFilters:
    def test_search_q_pexels(self, s):
        r = s.get(FILES_URL, params={"q": "pexels"}, timeout=10)
        assert r.status_code == 200
        body = r.json()
        _assert_envelope(body)
        assert isinstance(body["items"], list)

    def test_tag_filter(self, s):
        r = s.get(FILES_URL, params={"tag": "morocco"}, timeout=10)
        assert r.status_code == 200
        _assert_envelope(r.json())

    def test_long_q_500_chars(self, s):
        r = s.get(FILES_URL, params={"q": "a" * 500}, timeout=10)
        assert r.status_code == 200
        _assert_envelope(r.json())

    def test_regex_special_chars(self, s):
        r = s.get(FILES_URL, params={"q": ".*[(?)"}, timeout=10)
        assert r.status_code == 200
        _assert_envelope(r.json())


# ---------- regression: image serving still works ----------

class TestImageServingRegression:
    @pytest.fixture(scope="class")
    def sample_storage_path(self, s):
        body = s.get(FILES_URL, params={"limit": 20}, timeout=10).json()
        for it in body.get("items", []):
            sp = it.get("storage_path")
            ct = (it.get("content_type") or "").lower()
            if sp and ct.startswith("image/"):
                return sp
        pytest.skip("no image storage_path available to test serving")

    def test_serve_original(self, s, sample_storage_path):
        r = s.get(f"{BASE_URL}/api/files/{sample_storage_path}", timeout=15)
        assert r.status_code == 200, r.status_code
        ct = r.headers.get("content-type", "")
        assert ct.startswith("image/"), f"unexpected content-type: {ct}"
        assert len(r.content) > 100, "image body suspiciously small"

    def test_serve_optimized_w960(self, s, sample_storage_path):
        r = s.get(
            f"{BASE_URL}/api/files/{sample_storage_path}",
            params={"w": 960}, timeout=20,
        )
        assert r.status_code == 200, r.status_code
        ct = r.headers.get("content-type", "")
        # Optimized output should be a modern variant (avif/webp) or at worst
        # a fall-back to the original image/* (still acceptable per code).
        assert ct.startswith("image/"), f"unexpected content-type: {ct}"
        assert len(r.content) > 100
