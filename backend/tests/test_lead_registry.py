import asyncio
import copy
import hashlib
import hmac
import json
import time
import uuid
from types import SimpleNamespace

import pytest
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.testclient import TestClient

from lead_registry import all_leads, classify, filter_leads, register_lead_routes, save_submission
from calendly_leads import register_calendly_routes


class Collection:
    def __init__(self, name):
        self.name = name
        self.rows = {}

    async def insert_one(self, row):
        self.rows[row['id']] = copy.deepcopy(row)

    async def insert_once(self, row):
        self.rows.setdefault(row['id'], copy.deepcopy(row))
        return copy.deepcopy(self.rows[row['id']])

    async def find_one(self, query, projection=None):
        return copy.deepcopy(self.rows.get(query['id']))

    def find(self, *_args):
        async def result(_limit):
            return copy.deepcopy(list(self.rows.values()))
        return SimpleNamespace(to_list=result)

    async def update_one(self, query, update):
        if query['id'] in self.rows:
            self.rows[query['id']].update(copy.deepcopy(update['$set']))


class Database:
    def __init__(self):
        self.collections = {}
        self.feedback = []

    def __getitem__(self, key):
        return self.collections.setdefault(key, Collection(key))

    def __getattr__(self, key):
        return self[key]

    async def request(self, method, table, params=None, **kwargs):
        assert table == 'feedback'
        rows = [row for row in self.feedback if not (params or {}).get('id') or f"eq.{row['id']}" == params['id']]
        if method == 'PATCH':
            for row in rows:
                row.update(kwargs['json'])
        return SimpleNamespace(json=lambda: rows)


def row(**kwargs):
    return {'id': str(uuid.uuid4()), 'full_name': 'Ana García', 'email': 'ana@example.com',
            'created_at': '2026-09-17T10:30:00+00:00', **kwargs}


@pytest.fixture
def db():
    return Database()


@pytest.fixture
def client(db):
    app = FastAPI()
    router = APIRouter(prefix='/api')
    def require_admin(header):
        if header != 'Bearer test-admin':
            raise HTTPException(401, 'Unauthorized')
    register_lead_routes(router, lambda: db, require_admin)
    register_calendly_routes(router, lambda: db)
    app.include_router(router)
    return TestClient(app)


@pytest.mark.parametrize('path,method', [('/api/admin/leads','get'),('/api/admin/leads/export','get'),
    ('/api/admin/leads/contact/00000000-0000-0000-0000-000000000000','get'),
    ('/api/admin/leads/contact/00000000-0000-0000-0000-000000000000','patch')])
def test_requires_admin(client, path, method):
    args = {'json': {'status': 'resolved'}} if method == 'patch' else {}
    assert getattr(client, method)(path, **args).status_code == 401


@pytest.mark.parametrize('fields,expected', [
    ({'journey_interest': 'fast-track'}, 'fast_track'),
    ({'journey_interest': 'exit-intent'}, 'exit_intent'),
    ({'team_recipient': 'magda'}, 'team_contact'),
    ({'founder_recipient': 'lluis'}, 'founder_contact'),
    ({'source_path': '/viajes/atlas_desierto/programa_4n_5d'}, 'trip_information'),
    ({'capture_type': 'appointment'}, 'appointment'),
    ({'capture_type': 'newsletter'}, 'newsletter'),
])
def test_classifies_historical_and_current_sources(fields, expected):
    assert classify('contact', fields) == expected


def test_all_sources_one_view_without_merging_same_email(db, client):
    for name in ('contact_requests', 'trip_planner_requests', 'program_downloads', 'contest_participants'):
        asyncio.run(db[name].insert_one(row()))
    db.feedback.append(row(name='Ana', feedback_text='Buen viaje'))
    response = client.get('/api/admin/leads', headers={'Authorization': 'Bearer test-admin'})
    assert response.status_code == 200
    assert response.json()['total'] == 5
    assert {lead['source'] for lead in response.json()['items']} == {'contact', 'planner', 'download', 'contest', 'feedback'}
    assert all('details' not in lead for lead in response.json()['items'])


def test_filters_pagination_detail_and_update_original(db, client):
    record = row(capture_type='exit_intent', phone='+34612345678', source_url='https://xalucatravel.com/contacto', message='Familia',
                 preferred_contact_email='respuesta@example.com', custom_answer={'children': 0})
    asyncio.run(db.contact_requests.insert_one(record))
    headers = {'Authorization': 'Bearer test-admin'}
    result = client.get('/api/admin/leads?q=garcia&kind=exit_intent&origin=/contacto&date_from=2026-09-17&date_to=2026-09-17', headers=headers)
    assert result.json()['total'] == 1
    assert client.get('/api/admin/leads?q=respuesta@example.com', headers=headers).json()['total'] == 1
    assert client.get('/api/admin/leads?q=+34612345678', headers=headers).json()['total'] == 1
    assert client.get('/api/admin/leads?offset=1&limit=1', headers=headers).json()['items'] == []
    path = f"/api/admin/leads/contact/{record['id']}"
    assert client.get(path, headers=headers).json()['details']['custom_answer'] == {'children': 0}
    assert client.patch(path, headers=headers, json={'status': 'reviewed'}).json()['status'] == 'reviewed'
    assert db.contact_requests.rows[record['id']]['lead_status'] == 'reviewed'
    assert client.get('/api/admin/leads?status=new', headers=headers).json()['total'] == 0
    assert client.patch(path, headers=headers, json={'status': 'fake'}).status_code == 422
    assert client.get('/api/admin/leads?date_from=2026-10-01&date_to=2026-09-01', headers=headers).status_code == 422


def test_export_all_filtered_rows_and_prevent_excel_formulas(db, client):
    for _ in range(55):
        asyncio.run(db.contact_requests.insert_one(row(full_name='=HYPERLINK("evil")', phone='+34612345678')))
    response = client.get('/api/admin/leads/export', headers={'Authorization': 'Bearer test-admin'})
    assert response.status_code == 200
    assert response.text.count("'=HYPERLINK") == 55
    assert "'+34612345678" in response.text


def test_retry_keeps_record_and_crm_state_but_changed_data_is_new(db):
    import server
    payload = server.ContactRequest(full_name='Ana García', email='ana@example.com', message='Un viaje', submission_id=uuid.uuid4())
    obj, stored = asyncio.run(save_submission(db.contact_requests, payload))
    db.contact_requests.rows[obj.id]['lead_status'] = 'resolved'
    retried, _ = asyncio.run(save_submission(db.contact_requests, payload))
    assert retried.id == obj.id
    assert len(db.contact_requests.rows) == 1
    assert db.contact_requests.rows[obj.id]['lead_status'] == 'resolved'
    payload.message = 'Otro viaje diferente'
    changed, _ = asyncio.run(save_submission(db.contact_requests, payload))
    assert changed.id != obj.id


def signed_event(event, secret='test-key', timestamp=None):
    body = json.dumps(event).encode()
    timestamp = str(timestamp or int(time.time()))
    sig = hmac.new(secret.encode(), timestamp.encode() + b'.' + body, hashlib.sha256).hexdigest()
    return body, {'Calendly-Webhook-Signature': f't={timestamp},v1={sig}', 'Content-Type': 'application/json'}


def test_calendly_verified_idempotent_and_cancel_not_reverted(db, client, monkeypatch):
    monkeypatch.setenv('CALENDLY_WEBHOOK_SIGNING_KEY', 'test-key')
    event = {'event': 'invitee.created', 'payload': {'uri': 'https://api.calendly.com/scheduled_events/event/invitees/person',
        'name': 'Ana García', 'email': 'ana@example.com', 'tracking': {'utm_content': 'https://xalucatravel.com/contacto?trip=atlas', 'utm_term': 'atlas'},
        'questions_and_answers': [{'question': 'Teléfono', 'answer': '+34612345678'}]}}
    for _ in range(2):
        body, headers = signed_event(event)
        assert client.post('/api/webhooks/calendly', content=body, headers=headers).status_code == 200
    assert len(db.contact_requests.rows) == 1
    event['event'] = 'invitee.canceled'
    body, headers = signed_event(event)
    assert client.post('/api/webhooks/calendly', content=body, headers=headers).status_code == 200
    event['event'] = 'invitee.created'
    body, headers = signed_event(event)
    client.post('/api/webhooks/calendly', content=body, headers=headers)
    saved = next(iter(db.contact_requests.rows.values()))
    assert saved['appointment_status'] == 'canceled'
    assert saved['phone'] == '+34612345678'
    assert saved['related_trip_id'] == 'atlas'


def test_calendly_rejects_forged_and_stale_events(client, monkeypatch):
    monkeypatch.setenv('CALENDLY_WEBHOOK_SIGNING_KEY', 'test-key')
    body, headers = signed_event({}, secret='wrong')
    assert client.post('/api/webhooks/calendly', content=body, headers=headers).status_code == 401
    body, headers = signed_event({}, timestamp=int(time.time()) - 1000)
    assert client.post('/api/webhooks/calendly', content=body, headers=headers).status_code == 401
