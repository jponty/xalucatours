"""Public Xaluca frontends must be able to call the API from the browser."""

from fastapi.testclient import TestClient
import pytest

import server


@pytest.mark.parametrize(
    "origin",
    [
        "https://xalucatravel.com",
        "https://www.xalucatravel.com",
        "https://xaluca-tours-web.onrender.com",
        "http://127.0.0.1:3100",
        "http://localhost:3100",
    ],
)
def test_newsletter_preflight_allows_xaluca_frontends(origin):
    with TestClient(server.app) as client:
        response = client.options(
            "/api/newsletter/subscriptions",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin

