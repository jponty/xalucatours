import asyncio
import uuid
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
import newsletter_leads
from .test_lead_registry import Database


def test_history_import_is_segment_scoped_paginated_and_never_resubscribes(monkeypatch):
    db = Database()
    calls = []
    pages = [
        {'has_more': True, 'data': [{'id': 'first', 'email': 'ANA@example.com', 'first_name': 'Ana', 'last_name': 'García', 'created_at': '2026-09-17 10:00:00+00', 'unsubscribed': True}]},
        {'has_more': False, 'data': [{'id': 'second', 'email': 'ana@example.com', 'unsubscribed': True}]},
    ]
    class Client:
        def __init__(self, **kwargs): pass
        async def __aenter__(self): return self
        async def __aexit__(self, *args): pass
        async def get(self, path, params):
            calls.append((path, params))
            value = pages.pop(0)
            return SimpleNamespace(raise_for_status=lambda: None, json=lambda: value)
    monkeypatch.setattr(newsletter_leads.httpx, 'AsyncClient', Client)
    monkeypatch.setattr(newsletter_leads.asyncio, 'sleep', AsyncMock())
    result = asyncio.run(newsletter_leads.import_newsletter_leads(db, 'test', 'newsletter-segment'))
    assert result['processed'] == 2
    assert len(db.contact_requests.rows) == 1
    assert calls[1] == ('/segments/newsletter-segment/contacts', {'limit': 100, 'after': 'first'})
    saved = next(iter(db.contact_requests.rows.values()))
    assert saved['resend_unsubscribed_snapshot'] is True
    assert 'consent' not in saved
    assert 'source_url' not in saved
    assert saved['first_name'] == 'Ana'


def test_refuses_import_of_entire_shared_resend_account():
    with pytest.raises(HTTPException) as error:
        asyncio.run(newsletter_leads.import_newsletter_leads(Database(), 'test-key', ''))
    assert error.value.status_code == 503
