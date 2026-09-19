"""A CRM projection over existing records: no copied leads or schema migration."""
import asyncio
import csv
import hashlib
import io
import json
import unicodedata
import uuid
from datetime import date, datetime, timezone

from fastapi import Header, HTTPException, Query, Response
from pydantic import BaseModel, Field


COLLECTIONS = {
    "contact": "contact_requests",
    "planner": "trip_planner_requests",
    "download": "program_downloads",
    "contest": "contest_participants",
    "feedback": None,
}
KINDS = {
    "dictation": "Dictado",
    "whatsapp_business": "WhatsApp Business",
    "quick_contact": "Contacto rápido", "detailed_planning": "Planificación detallada",
    "appointment": "Cita previa", "exit_intent": "Antes de irte",
    "trip_information": "Información de un viaje", "general_contact": "Contacto general",
    "fast_track": "Fast Track", "program_download": "Descarga de programa",
    "newsletter": "Newsletter", "contest": "Ruleta de la suerte",
    "team_contact": "Contacto con el equipo", "founder_contact": "Contacto con fundadores",
    "feedback": "Opinión del viajero",
}
STATUSES = {"new": "Nuevo", "reviewed": "En seguimiento", "resolved": "Resuelto", "archived": "Archivado"}


class LeadCapture(BaseModel):
    # Public clients cannot set CRM state, timestamps or delivery status.
    capture_type: str | None = Field(default=None, max_length=60)
    source_url: str | None = Field(default=None, max_length=1500)
    source_path: str | None = Field(default=None, max_length=500)
    source_route_id: str | None = Field(default=None, max_length=120)
    source_label: str | None = Field(default=None, max_length=300)
    related_trip_id: str | None = Field(default=None, max_length=120)
    related_trip_title: str | None = Field(default=None, max_length=300)
    submission_id: uuid.UUID | None = None


def classify(source, row):
    if source != "contact":
        return {"planner": "detailed_planning", "download": "program_download",
                "contest": "contest", "feedback": "feedback"}[source]
    if row.get("capture_type") in KINDS:
        return row["capture_type"]
    interest = row.get("journey_interest", "")
    if interest in {"exit-intent", "fast-track", "team-contact", "founder-contact"}:
        return interest.replace("-", "_")
    if row.get("founder_recipient"):
        return "founder_contact"
    if row.get("team_recipient"):
        return "team_contact"
    if row.get("related_trip_id") or str(row.get("source_path", "")).startswith("/viajes/"):
        return "trip_information"
    return "quick_contact" if row.get("preferred_contact") else "general_contact"


def project_lead(source, row, detail=False):
    kind = classify(source, row)
    trips = row.get("selected_trips_detail") or []
    related = row.get("related_trip_title") or row.get("program_title") or row.get("trip_reference")
    related = related or ", ".join(t.get("title") or t.get("id", "") for t in trips)
    related = related or row.get("related_trip_id") or row.get("route_id")
    result = {
        "id": f"{source}:{row['id']}", "record_id": row["id"], "source": source,
        "type": kind, "type_label": KINDS[kind],
        "full_name": row.get("full_name") or row.get("name") or " ".join(filter(None, [row.get("first_name"), row.get("last_name")])),
        "email": row.get("email"), "phone": row.get("phone"),
        "preferred_contact_email": row.get("preferred_contact_email"),
        "preferred_contact_phone": row.get("preferred_contact_phone"),
        "created_at": row.get("created_at"),
        "source_url": row.get("source_url") or row.get("source_path"),
        "source_label": row.get("source_label") or row.get("source_route_id"),
        "trip": related,
        "message": row.get("message") or row.get("notes") or row.get("feedback_text"),
        "status": (row.get("status") if source == "feedback" else row.get("lead_status")) or "new",
        "delivery_status": (row.get("email_delivery") or {}).get("status"),
        "subscription_sync": row.get("subscription_sync"),
    }
    if detail:
        result["details"] = {k: v for k, v in row.items() if k not in {"_id", "submission_id"}}
    return result


def fold(value):
    return "".join(c for c in unicodedata.normalize("NFKD", str(value or "").casefold()) if not unicodedata.combining(c))


async def all_leads(db):
    async def load(source, collection):
        if collection:
            records = await db[collection].find({}, {"_id": 0}).to_list(None)
        else:
            records = []
            while True:
                response = await db.request("GET", "feedback", params={"select": "*", "order": "created_at.desc,id.asc", "offset": len(records), "limit": 1000})
                batch = response.json()
                records.extend(batch)
                if len(batch) < 1000:
                    break
        return [project_lead(source, row, detail=True) for row in records if row.get("id")]
    groups = await asyncio.gather(*(load(source, name) for source, name in COLLECTIONS.items()))
    # Identity is the original collection + id, never email: two real enquiries
    # from the same traveller must remain separate.
    unique = {lead["id"]: lead for group in groups for lead in group}
    return sorted(unique.values(), key=lambda lead: (lead["created_at"] or "", lead["id"]), reverse=True)


def filter_leads(rows, q="", kind="", origin="", status="", date_from=None, date_to=None):
    if kind and kind not in KINDS or status and status not in STATUSES:
        raise HTTPException(422, "Filtro no válido")
    if date_from and date_to and date_from > date_to:
        raise HTTPException(422, "La fecha inicial no puede ser posterior a la final")
    def match(row):
        # Calendar dates in the admin are explicitly UTC; both bounds inclusive.
        created = (row.get("created_at") or "")[:10]
        return (not kind or row["type"] == kind) and (not status or row["status"] == status) and (
            not origin or fold(origin) in fold(f"{row['source_url'] or ''} {row['source_label'] or ''}")
        ) and (not date_from or created >= date_from.isoformat()) and (
            not date_to or bool(created) and created <= date_to.isoformat()
        ) and all(term in fold(json.dumps(row, ensure_ascii=False, default=str)) for term in fold(q).split())
    return [row for row in rows if match(row)]


class LeadUpdate(BaseModel):
    status: str = Field(pattern="^(new|reviewed|resolved|archived)$")


async def save_submission(collection, obj):
    """An atomic primary-key insert makes retries safe across API workers."""
    doc = obj.model_dump(mode="json")
    submission = doc.get("submission_id")
    if submission:
        business = {k: v for k, v in doc.items() if k not in {"id", "created_at", "submission_id"}}
        fingerprint = hashlib.sha256(json.dumps(business, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
        doc["id"] = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{collection.name}:{submission}:{fingerprint}"))
        stored = await collection.insert_once(doc)
        return obj.__class__(**stored), stored
    await collection.insert_one(doc)
    return obj, doc


def register_lead_routes(router, get_db, require_admin):
    @router.get("/admin/leads")
    async def list_leads(response: Response, authorization: str = Header(default=""), q: str = Query(default="", max_length=300),
                         kind: str = "", origin: str = Query(default="", max_length=500), status: str = "",
                         date_from: date | None = None, date_to: date | None = None,
                         offset: int = Query(default=0, ge=0), limit: int = Query(default=50, ge=1, le=200)):
        require_admin(authorization)
        response.headers["Cache-Control"] = "private, no-store"
        rows = await all_leads(get_db())
        filtered = filter_leads(rows, q, kind, origin, status, date_from, date_to)
        return {"items": [{k: v for k, v in row.items() if k != "details"} for row in filtered[offset:offset+limit]],
                "total": len(filtered), "all_total": len(rows), "types": KINDS, "statuses": STATUSES}

    @router.get("/admin/leads/export")
    async def export_leads(authorization: str = Header(default=""), q: str = "", kind: str = "", origin: str = "",
                           status: str = "", date_from: date | None = None, date_to: date | None = None):
        require_admin(authorization)
        rows = filter_leads(await all_leads(get_db()), q, kind, origin, status, date_from, date_to)
        output = io.StringIO()
        writer = csv.writer(output)
        columns = {"id": "ID", "created_at": "Fecha UTC", "full_name": "Nombre", "email": "Email", "phone": "Teléfono",
                   "type_label": "Tipo", "source_url": "Origen", "trip": "Viaje", "status": "Estado", "message": "Mensaje",
                   "preferred_contact_email": "Email preferido", "preferred_contact_phone": "Teléfono preferido", "details": "Datos completos"}
        writer.writerow(columns.values())
        for row in rows:
            values = [json.dumps(row[k], ensure_ascii=False, default=str) if isinstance(row.get(k), (dict, list)) else str(row.get(k) or "") for k in columns]
            writer.writerow(["'" + value if value.lstrip().startswith(("=", "+", "-", "@")) else value for value in values])
        return Response("\ufeff" + output.getvalue(), media_type="text/csv", headers={"Content-Disposition": 'attachment; filename="xaluca-leads.csv"', "Cache-Control": "no-store"})

    async def find_record(source, record_id):
        if source not in COLLECTIONS:
            raise HTTPException(404, "Lead no encontrado")
        db = get_db()
        if source == "feedback":
            response = await db.request("GET", "feedback", params={"id": f"eq.{record_id}", "select": "*"})
            rows = response.json()
            row = rows[0] if rows else None
        else:
            row = await db[COLLECTIONS[source]].find_one({"id": record_id}, {"_id": 0})
        if not row:
            raise HTTPException(404, "Lead no encontrado")
        return row

    @router.get("/admin/leads/{source}/{record_id}")
    async def detail(source: str, record_id: uuid.UUID, response: Response, authorization: str = Header(default="")):
        require_admin(authorization)
        response.headers["Cache-Control"] = "private, no-store"
        return project_lead(source, await find_record(source, str(record_id)), detail=True)

    @router.patch("/admin/leads/{source}/{record_id}")
    async def update(source: str, record_id: uuid.UUID, payload: LeadUpdate, authorization: str = Header(default="")):
        require_admin(authorization)
        await find_record(source, str(record_id))
        now = datetime.now(timezone.utc).isoformat()
        db = get_db()
        if source == "feedback":
            await db.request("PATCH", "feedback", params={"id": f"eq.{record_id}"},
                             json={"status": payload.status, "updated_at": now, "archived_at": now if payload.status == "archived" else None})
        else:
            await db[COLLECTIONS[source]].update_one({"id": str(record_id)}, {"$set": {"lead_status": payload.status, "lead_updated_at": now}})
        return project_lead(source, await find_record(source, str(record_id)), detail=True)
