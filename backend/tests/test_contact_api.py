"""Backend API tests for Xaluca Tours.

Covers:
- GET /api/             (health/root)
- POST /api/contact-requests (validation + persistence)
- GET  /api/contact-requests (listing)
- Confirms MongoDB _id is not leaked in response
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://127.0.0.1:8001').rstrip('/')


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
class TestRoot:
    def test_root_returns_ok(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "ok"
        assert data.get("service") == "Xaluca Tours"


# ---------- Contact Requests ----------
class TestContactRequests:
    unique_marker = f"TEST_{uuid.uuid4().hex[:8]}"

    def test_create_with_valid_payload(self, api):
        payload = {
            "full_name": f"TEST User {self.unique_marker}",
            "email": "test.user@example.com",
            "phone": "+212 600 000 000",
            "travel_dates": "March 2026",
            "party_size": "2",
            "journey_interest": "desert-escapes",
            "message": f"Hello from automated tests {self.unique_marker}",
            "language": "en",
        }
        r = api.post(f"{BASE_URL}/api/contact-requests", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        # Field assertions
        assert data["full_name"] == payload["full_name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert data["language"] == "en"
        assert data["journey_interest"] == "desert-escapes"
        assert isinstance(data.get("id"), str) and len(data["id"]) > 0
        # No mongo _id leak
        assert "_id" not in data
        # Stash id for next test
        TestContactRequests._created_id = data["id"]

    def test_no_mongo_id_in_list(self, api):
        r = api.get(f"{BASE_URL}/api/contact-requests")
        assert r.status_code == 200, r.text
        rows = r.json()
        assert isinstance(rows, list)
        for row in rows:
            assert "_id" not in row

    def test_list_contains_created(self, api):
        r = api.get(f"{BASE_URL}/api/contact-requests")
        assert r.status_code == 200
        rows = r.json()
        ids = [row["id"] for row in rows]
        assert getattr(TestContactRequests, "_created_id", None) in ids

    def test_reject_invalid_email(self, api):
        payload = {
            "full_name": "TEST Invalid Email",
            "email": "not-an-email",
            "message": "this should fail validation",
        }
        r = api.post(f"{BASE_URL}/api/contact-requests", json=payload)
        assert r.status_code == 422, r.text

    def test_reject_missing_full_name(self, api):
        payload = {
            "email": "ok@example.com",
            "message": "missing name",
        }
        r = api.post(f"{BASE_URL}/api/contact-requests", json=payload)
        assert r.status_code == 422

    def test_reject_missing_email(self, api):
        payload = {
            "full_name": "TEST Missing Email",
            "message": "missing email",
        }
        r = api.post(f"{BASE_URL}/api/contact-requests", json=payload)
        assert r.status_code == 422

    def test_reject_missing_message(self, api):
        payload = {
            "full_name": "TEST Missing Message",
            "email": "ok@example.com",
        }
        r = api.post(f"{BASE_URL}/api/contact-requests", json=payload)
        assert r.status_code == 422

    def test_reject_short_message(self, api):
        payload = {
            "full_name": "TEST Short Msg",
            "email": "ok@example.com",
            "message": "hi",  # min_length=4
        }
        r = api.post(f"{BASE_URL}/api/contact-requests", json=payload)
        assert r.status_code == 422

    def test_create_minimal_required_only(self, api):
        payload = {
            "full_name": "TEST Minimal",
            "email": "minimal@example.com",
            "message": "Minimal valid payload for tests",
        }
        r = api.post(f"{BASE_URL}/api/contact-requests", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["full_name"] == payload["full_name"]
        assert data["language"] == "en"  # default
        assert data.get("phone") is None
        assert "_id" not in data
