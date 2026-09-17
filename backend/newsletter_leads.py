"""Import historical newsletter contacts, without changing anything in Resend."""
import asyncio
import uuid
from datetime import datetime, timezone
from urllib.parse import quote

import httpx
from fastapi import HTTPException


async def import_newsletter_leads(db, api_key, segment_id):
    # Require a dedicated segment: never import every contact in a shared account.
    if not api_key or not segment_id:
        raise HTTPException(503, "Configura XALUCA_TOURS_NEWSLETTER y RESEND_NEWSLETTER_SEGMENT_ID en la API para importar el histórico.")
    count, after = 0, None
    async with httpx.AsyncClient(base_url="https://api.resend.com", headers={"Authorization": f"Bearer {api_key}"}, timeout=30) as client:
        while True:
            params = {"limit": 100}
            if after:
                params["after"] = after
            try:
                response = await client.get(f"/segments/{quote(segment_id, safe='')}/contacts", params=params)
                response.raise_for_status()
                result = response.json()
                contacts = result["data"]
            except (httpx.HTTPError, ValueError, KeyError):
                raise HTTPException(502, f"No se pudo completar la importación de Resend. Procesados: {count}. Puedes reintentar sin duplicar registros.")
            for contact in contacts:
                email = str(contact.get("email") or "").strip().lower()
                if not email:
                    continue
                record_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f"xaluca:newsletter:{email}"))
                now = datetime.now(timezone.utc).isoformat()
                created = contact.get("created_at")
                if created:
                    created = datetime.fromisoformat(created.replace("Z", "+00:00")).isoformat()
                await db.contact_requests.insert_once({
                    "id": record_id, "capture_type": "newsletter", "email": email,
                    "first_name": contact.get("first_name"), "last_name": contact.get("last_name"),
                    "full_name": " ".join(filter(None, [contact.get("first_name"), contact.get("last_name")])),
                    "created_at": created or now, "source_label": "Resend · Histórico del segmento newsletter",
                    "message": "Contacto recuperado del segmento de newsletter. La página original no fue registrada.",
                    "imported_at": now,
                })
                # Snapshot only. It is never used as permission to send marketing.
                await db.contact_requests.update_one({"id": record_id}, {"$set": {
                    "resend_contact_id": contact.get("id"), "resend_unsubscribed_snapshot": contact.get("unsubscribed"),
                    "resend_snapshot_at": now,
                }})
                count += 1
            if not result.get("has_more"):
                break
            next_after = contacts[-1].get("id") if contacts else None
            if not next_after or next_after == after:
                raise HTTPException(502, "Resend no proporcionó un cursor válido; la importación está incompleta.")
            after = next_after
            await asyncio.sleep(0.6)  # Respect the provider's shared rate limit.
    return {"processed": count}
