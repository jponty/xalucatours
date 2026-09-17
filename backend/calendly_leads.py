"""Verified Calendly events stored once in the existing contact collection."""
import hashlib
import hmac
import json
import os
import time
import uuid
from datetime import datetime, timezone
from urllib.parse import urlsplit

from fastapi import HTTPException, Request


def verify_signature(body, header, secret):
    if not secret:
        raise HTTPException(503, "Calendly webhook not configured")
    parts = [item.strip().split("=", 1) for item in header.split(",") if "=" in item]
    timestamps = [value for key, value in parts if key == "t"]
    signatures = [value for key, value in parts if key == "v1"]
    try:
        timestamp = timestamps[0]
        if abs(time.time() - int(timestamp)) > 180:
            raise ValueError()
    except (IndexError, ValueError):
        raise HTTPException(401, "Invalid webhook signature")
    expected = hmac.new(secret.encode(), timestamp.encode() + b"." + body, hashlib.sha256).hexdigest()
    if not any(hmac.compare_digest(expected, value) for value in signatures):
        raise HTTPException(401, "Invalid webhook signature")


def register_calendly_routes(router, get_db):
    @router.post("/webhooks/calendly")
    async def calendly_webhook(request: Request):
        body = await request.body()
        if len(body) > 256 * 1024:
            raise HTTPException(413, "Webhook too large")
        verify_signature(body, request.headers.get("Calendly-Webhook-Signature", ""), os.environ.get("CALENDLY_WEBHOOK_SIGNING_KEY", ""))
        try:
            event = json.loads(body)
            payload = event["payload"]
            if not isinstance(payload, dict):
                raise ValueError()
        except (ValueError, KeyError, TypeError):
            raise HTTPException(422, "Invalid webhook")
        if event.get("event") not in {"invitee.created", "invitee.canceled"}:
            return {"ignored": True}
        uri = payload.get("uri", "")
        if not isinstance(uri, str) or not uri.startswith("https://api.calendly.com/scheduled_events/") or "/invitees/" not in uri:
            raise HTTPException(422, "Missing invitee identity")
        record_id = str(uuid.uuid5(uuid.NAMESPACE_URL, uri))
        now = datetime.now(timezone.utc).isoformat()
        tracking = payload.get("tracking") or {}
        origin = str(tracking.get("utm_content") or "")[:1500]
        if not origin.startswith(("https://", "http://", "/")):
            origin = ""
        source_path = urlsplit(origin).path or None
        scheduled = payload.get("scheduled_event") or {}
        answers = payload.get("questions_and_answers") or []
        phone = payload.get("text_reminder_number")
        if not phone:
            phone = next((answer.get("answer") for answer in answers
                          if any(word in str(answer.get("question", "")).lower() for word in ("phone", "teléfono", "telefono", "whatsapp"))), None)
        record = {
            "id": record_id, "capture_type": "appointment", "created_at": payload.get("created_at") or event.get("created_at") or now,
            "full_name": payload.get("name") or "", "first_name": payload.get("first_name"), "last_name": payload.get("last_name"),
            "email": payload.get("email"), "phone": phone,
            "source_url": origin or None, "source_path": source_path,
            "source_label": "Calendly · Cita previa", "source_route_id": "appointment",
            "related_trip_id": tracking.get("utm_term"),
            "message": "\n".join(f"{a.get('question', '')}: {a.get('answer', '')}" for a in answers),
            "appointment": {"invitee_uri": uri, "event_uri": payload.get("event"), "name": scheduled.get("name"),
                            "start_time": scheduled.get("start_time"), "end_time": scheduled.get("end_time"),
                            "timezone": payload.get("timezone"), "questions_and_answers": answers},
        }
        collection = get_db().contact_requests
        await collection.insert_once(record)
        # Only cancellation mutates appointment state. A delayed created retry
        # must never reactivate a canceled booking or overwrite CRM progress.
        if event["event"] == "invitee.canceled":
            await collection.update_one({"id": record_id}, {"$set": {
                "appointment_status": "canceled", "appointment_cancellation": payload.get("cancellation"),
                "appointment_updated_at": event.get("created_at") or now,
            }})
        return {"received": True}
