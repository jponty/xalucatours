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


class _NewContactClient(_ExistingContactClient):
    def get(self, path):
        self.calls.append(("GET", path))
        return _Response(404)


def test_newsletter_signup_normalizes_email_and_waits_for_resend(monkeypatch):
    captured = []
    monkeypatch.setattr(
        server,
        "sync_newsletter_contact",
        lambda email, first_name, last_name: captured.append((email, first_name, last_name)) or "contact-id",
    )

    result = asyncio.run(server.create_newsletter_subscription(
        server.NewsletterSubscriptionCreate(
            first_name="  Joan  ",
            last_name="  Pont  Serra ",
            email="Viajes@Example.COM",
            consent=True,
            language="es",
            source_path="/",
        )
    ))

    assert result.status == "subscribed"
    assert captured == [("viajes@example.com", "Joan", "Pont Serra")]


def test_newsletter_signup_rejects_missing_consent():
    with pytest.raises(ValueError, match="Newsletter consent is required"):
        server.NewsletterSubscriptionCreate(
            first_name="Joan",
            last_name="Pont",
            email="viajes@example.com",
            consent=False,
        )


def test_newsletter_signup_rejects_blank_names():
    with pytest.raises(ValueError, match="Name is required"):
        server.NewsletterSubscriptionCreate(
            first_name="   ",
            last_name="Pont",
            email="viajes@example.com",
            consent=True,
        )


def test_newsletter_signup_does_not_claim_success_after_resend_failure(monkeypatch):
    def reject(_email, _first_name, _last_name):
        raise server.NewsletterSubscriptionError("rejected")

    monkeypatch.setattr(server, "sync_newsletter_contact", reject)
    payload = server.NewsletterSubscriptionCreate(
        first_name="Joan",
        last_name="Pont",
        email="viajes@example.com",
        consent=True,
        language="es",
    )

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(server.create_newsletter_subscription(payload))

    assert exc_info.value.status_code == 502


def test_newsletter_honeypot_does_not_reach_resend(monkeypatch):
    called = []
    monkeypatch.setattr(server, "sync_newsletter_contact", lambda *args: called.append(args))
    payload = server.NewsletterSubscriptionCreate(
        first_name="Bot",
        last_name="Spam",
        email="bot@example.com",
        consent=True,
        website="https://spam.example",
    )

    result = asyncio.run(server.create_newsletter_subscription(payload))

    assert result.status == "subscribed"
    assert called == []


def test_new_resend_contact_includes_first_and_last_name(monkeypatch):
    _ExistingContactClient.calls = []
    monkeypatch.setattr(server, "RESEND_CONTACTS_API_KEY", "re_full_access")
    monkeypatch.setattr(server, "RESEND_NEWSLETTER_SEGMENT_ID", "")
    monkeypatch.setattr(server.httpx, "Client", _NewContactClient)

    contact_id = server.sync_newsletter_contact("viajes@example.com", "Joan", "Pont Serra")

    assert contact_id == "segment-id"
    assert _ExistingContactClient.calls == [
        ("GET", "/contacts/viajes%40example.com"),
        (
            "POST",
            "/contacts",
            {
                "email": "viajes@example.com",
                "first_name": "Joan",
                "last_name": "Pont Serra",
                "unsubscribed": False,
            },
        ),
    ]


def test_existing_resend_contact_is_reactivated_and_added_to_segment(monkeypatch):
    _ExistingContactClient.calls = []
    monkeypatch.setattr(server, "RESEND_CONTACTS_API_KEY", "re_full_access")
    monkeypatch.setattr(server, "RESEND_NEWSLETTER_SEGMENT_ID", "segment-id")
    monkeypatch.setattr(server.httpx, "Client", _ExistingContactClient)

    contact_id = server.sync_newsletter_contact("viajes@example.com", "Joan", "Pont Serra")

    assert contact_id == "contact-id"
    assert _ExistingContactClient.calls == [
        ("GET", "/contacts/viajes%40example.com"),
        (
            "PATCH",
            "/contacts/viajes%40example.com",
            {"first_name": "Joan", "last_name": "Pont Serra", "unsubscribed": False},
        ),
        ("POST", "/contacts/viajes%40example.com/segments/segment-id", {}),
    ]
