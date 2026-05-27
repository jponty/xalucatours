"""Backend tests for image library management (iteration 11)."""
import os
import io
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # Read from frontend/.env
    fe_env = '/app/frontend/.env'
    if os.path.exists(fe_env):
        with open(fe_env) as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
                    break

# Minimal valid PNG (1x1 transparent)
PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xfc\xcf"
    b"\xc0\x00\x00\x00\x03\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
)


@pytest.fixture(scope="module")
def uploaded_ids():
    """Bulk upload 3 PNGs and return their IDs (cleaned at end)."""
    files = [
        ("files", ("TEST_dune1.png", io.BytesIO(PNG_BYTES), "image/png")),
        ("files", ("TEST_dune2.png", io.BytesIO(PNG_BYTES), "image/png")),
        ("files", ("TEST_dune3.png", io.BytesIO(PNG_BYTES), "image/png")),
    ]
    r = requests.post(f"{BASE_URL}/api/library/upload", files=files, timeout=30)
    assert r.status_code == 200, f"upload failed: {r.status_code} {r.text}"
    data = r.json()
    assert data["count"] == 3
    assert len(data["uploaded"]) == 3
    for u in data["uploaded"]:
        assert "id" in u and "url" in u and "storage_path" in u
    ids = [u["id"] for u in data["uploaded"]]
    yield ids
    # cleanup
    for fid in ids:
        try:
            requests.delete(f"{BASE_URL}/api/files/{fid}", timeout=10)
        except Exception:
            pass


def test_bulk_upload_reflects_in_listing(uploaded_ids):
    r = requests.get(f"{BASE_URL}/api/files?limit=200", timeout=15)
    assert r.status_code == 200
    items = r.json()["items"]
    ids_in_listing = {it["id"] for it in items}
    for uid in uploaded_ids:
        assert uid in ids_in_listing


def test_patch_normalizes_tags(uploaded_ids):
    fid = uploaded_ids[0]
    payload = {"original_filename": "duna.jpg", "tags": ["Duna", " Sahara ", "duna", "DUNA"]}
    r = requests.patch(f"{BASE_URL}/api/files/{fid}", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    doc = r.json()
    assert doc["original_filename"] == "duna.jpg"
    # lowercased + deduped
    assert doc["tags"] == ["duna", "sahara"]


def test_patch_no_editable_fields_returns_400(uploaded_ids):
    fid = uploaded_ids[1]
    r = requests.patch(f"{BASE_URL}/api/files/{fid}", json={}, timeout=15)
    assert r.status_code == 400


def test_delete_then_patch_returns_404():
    # upload a one-off file just for this destructive test
    files = [("files", ("TEST_kill.png", io.BytesIO(PNG_BYTES), "image/png"))]
    r = requests.post(f"{BASE_URL}/api/library/upload", files=files, timeout=20)
    fid = r.json()["uploaded"][0]["id"]

    d = requests.delete(f"{BASE_URL}/api/files/{fid}", timeout=15)
    assert d.status_code == 200
    assert d.json() == {"id": fid, "deleted": True}

    # not in listing
    r = requests.get(f"{BASE_URL}/api/files?limit=200", timeout=15)
    ids = {it["id"] for it in r.json()["items"]}
    assert fid not in ids

    # PATCH on deleted -> 404
    p = requests.patch(f"{BASE_URL}/api/files/{fid}", json={"original_filename": "x"}, timeout=15)
    assert p.status_code == 404


def test_replace_changes_storage_path(uploaded_ids):
    fid = uploaded_ids[2]
    # capture original path
    r = requests.get(f"{BASE_URL}/api/files?limit=200", timeout=15)
    before = next(it for it in r.json()["items"] if it["id"] == fid)
    before_path = before["storage_path"]

    files = {"file": ("TEST_replaced.png", io.BytesIO(PNG_BYTES), "image/png")}
    rp = requests.post(f"{BASE_URL}/api/files/{fid}/replace", files=files, timeout=20)
    assert rp.status_code == 200, rp.text
    body = rp.json()
    assert body["id"] == fid
    assert body["storage_path"] != before_path

    # verify via listing
    r2 = requests.get(f"{BASE_URL}/api/files?limit=200", timeout=15)
    after = next(it for it in r2.json()["items"] if it["id"] == fid)
    assert after["storage_path"] == body["storage_path"]
    assert after["storage_path"] != before_path


def test_library_tags_sorted_and_counted(uploaded_ids):
    # Set distinct tags on two files
    fid_a = uploaded_ids[0]
    fid_b = uploaded_ids[1]
    requests.patch(f"{BASE_URL}/api/files/{fid_a}", json={"tags": ["duna", "sahara"]}, timeout=15)
    requests.patch(f"{BASE_URL}/api/files/{fid_b}", json={"tags": ["duna"]}, timeout=15)

    r = requests.get(f"{BASE_URL}/api/library/tags", timeout=15)
    assert r.status_code == 200
    tags = r.json()["tags"]
    assert isinstance(tags, list)
    # find duna
    by_name = {t["name"]: t["count"] for t in tags}
    assert "duna" in by_name and by_name["duna"] >= 2
    assert "sahara" in by_name and by_name["sahara"] >= 1
    # Sorted by count desc, then name asc (verify: counts non-increasing)
    counts = [t["count"] for t in tags]
    assert counts == sorted(counts, reverse=True)


def test_filter_by_tag(uploaded_ids):
    # uploaded_ids[0] should still have duna+sahara
    r = requests.get(f"{BASE_URL}/api/files?tag=sahara&limit=200", timeout=15)
    assert r.status_code == 200
    items = r.json()["items"]
    # every returned item must contain sahara
    for it in items:
        assert "sahara" in (it.get("tags") or [])
    assert any(it["id"] == uploaded_ids[0] for it in items)
