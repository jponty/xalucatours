"""Newsletter signup must be consented, idempotent and Resend-confirmed."""

import asyncio

import pytest
from fastapi import HTTPException

import server


class _Response:
    def __init__(self, status_code, body=None):
        self.status_code = status_code
        self._body = body or {}

    def json(self):
        return self._body

    def raise_for_status(self):
        if self.status_code >= 400:
            raise server.httpx.HTTPStatusError(
                "request failed",
                request=server.httpx.Request("GET", "https://api.resend.com/contacts/test"),
                response=server.httpx.Response(self.status_code),
            )


class _ExistingContactClient:
    calls = []

    def __init__(self, **_kwargs):
        self.calls = _ExistingContactClient.calls

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return None

    def get(self, path):
        self.calls.append(("GET", path))
        return _Response(200, {"id": "contact-id", "unsubscribed": True})

    def patch(self, path, json):
        self.calls.append(("PATCH", path, json))
        return _Response(200, {"id": "contact-id"})

    def post(self, path, json):
        self.calls.append(("POST", path, json))
        return _Response(200, {"id": "segment-id"})


def test_newsletter_signup_normalizes_email_and_waits_for_resend(monkeypatch):
    captured = []
    monkeypatch.setattr(server, "sync_newsletter_contact", lambda email: captured.append(email) or "contact-id")

    result = asyncio.run(server.create_newsletter_subscription(
        server.NewsletterSubscriptionCreate(
            email="Viajes@Example.COM",
            consent=True,
            language="es",
            source_path="/",
        )
    ))

    assert result.status == "subscribed"
    assert captured == ["viajes@example.com"]


def test_newsletter_signup_rejects_missing_consent():
    with pytest.raises(ValueError, match="Newsletter consent is required"):
        server.NewsletterSubscriptionCreate(email="viajes@example.com", consent=False)


def test_newsletter_signup_does_not_claim_success_after_resend_failure(monkeypatch):
    def reject(_email):
        raise server.NewsletterSubscriptionError("rejected")

    monkeypatch.setattr(server, "sync_newsletter_contact", reject)
    payload = server.NewsletterSubscriptionCreate(
        email="viajes@example.com",
        consent=True,
        language="es",
    )

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(server.create_newsletter_subscription(payload))

    assert exc_info.value.status_code == 502


def test_newsletter_honeypot_does_not_reach_resend(monkeypatch):
    called = []
    monkeypatch.setattr(server, "sync_newsletter_contact", lambda email: called.append(email))
    payload = server.NewsletterSubscriptionCreate(
        email="bot@example.com",
        consent=True,
        website="https://spam.example",
    )

    result = asyncio.run(server.create_newsletter_subscription(payload))

    assert result.status == "subscribed"
    assert called == []


def test_existing_resend_contact_is_reactivated_and_added_to_segment(monkeypatch):
    _ExistingContactClient.calls = []
    monkeypatch.setattr(server, "RESEND_CONTACTS_API_KEY", "re_full_access")
    monkeypatch.setattr(server, "RESEND_NEWSLETTER_SEGMENT_ID", "segment-id")
    monkeypatch.setattr(server.httpx, "Client", _ExistingContactClient)

    contact_id = server.sync_newsletter_contact("viajes@example.com")

    assert contact_id == "contact-id"
    assert _ExistingContactClient.calls == [
        ("GET", "/contacts/viajes%40example.com"),
        ("PATCH", "/contacts/viajes%40example.com", {"unsubscribed": False}),
        ("POST", "/contacts/viajes%40example.com/segments/segment-id", {}),
    ]
