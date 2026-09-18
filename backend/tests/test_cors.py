"""Public Xaluca frontends must be able to call the API from the browser."""

from fastapi.testclient import TestClient
import pytest

import server


@pytest.mark.parametrize(
    "origin",
    [
        "https://xalucatours.com",
        "https://www.xalucatours.com",
        "https://xalucatravel.com",
        "https://www.xalucatravel.com",
        "https://xaluca-tours-web.onrender.com",
        "http://127.0.0.1:3100",
        "http://localhost:3100",
        "http://127.0.0.1:3101",
        "http://localhost:3101",
    ],
)
@pytest.mark.parametrize("endpoint", [
    "/api/newsletter/subscriptions", "/api/contact-requests", "/api/trip-planner",
    "/api/form-dictation", "/api/program-downloads",
])
def test_preflight_allows_xaluca_frontends(origin, endpoint):
    # No lifespan: this middleware test must not run production DB seeding.
    response = TestClient(server.app).options(
        endpoint,
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin


@pytest.mark.parametrize("origin", ["https://untrusted.example", "https://xalucatours.com.untrusted.example"])
def test_preflight_rejects_untrusted_origins(origin):
    response = TestClient(server.app).options(
        "/api/contact-requests",
        headers={"Origin": origin, "Access-Control-Request-Method": "POST"},
    )
    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers
