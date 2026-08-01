"""Operational object-storage adapter with a reversible Bunny cutover.

Modes are selected with ``MEDIA_STORAGE_PROVIDER``:

``supabase`` (default)
    Read and write only Supabase Storage.
``dual``
    Write Bunny first and then Supabase; read Bunny with Supabase fallback.
``bunny``
    Write Bunny; read Bunny with Supabase fallback while the migration is
    being validated.

Object keys keep their historical ``xaluca/...`` prefix on both providers so
the migration can be byte-for-byte and reversed without rewriting CMS data.
"""

from __future__ import annotations

import os
from typing import Tuple
from urllib.parse import quote

import requests


VALID_PROVIDERS = {"supabase", "dual", "bunny"}


def _provider() -> str:
    provider = (os.environ.get("MEDIA_STORAGE_PROVIDER") or "supabase").strip().lower()
    if provider not in VALID_PROVIDERS:
        raise RuntimeError(
            "MEDIA_STORAGE_PROVIDER must be one of: supabase, dual, bunny"
        )
    return provider


def _supabase_config() -> tuple[str, str, str]:
    project_url = (os.environ.get("SUPABASE_URL") or "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or ""
    bucket = os.environ.get("SUPABASE_STORAGE_BUCKET", "xaluca")
    if not project_url or not service_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
    return project_url, service_key, bucket


def _bunny_config() -> tuple[str, str, str, str]:
    endpoint = (os.environ.get("BUNNY_STORAGE_ENDPOINT") or "").rstrip("/")
    zone = (os.environ.get("BUNNY_STORAGE_ZONE") or "").strip()
    access_key = os.environ.get("BUNNY_STORAGE_API_KEY") or ""
    cdn_url = (os.environ.get("BUNNY_CDN_URL") or "").rstrip("/")
    if not endpoint or not zone or not access_key:
        raise RuntimeError(
            "BUNNY_STORAGE_ENDPOINT, BUNNY_STORAGE_ZONE and "
            "BUNNY_STORAGE_API_KEY are required"
        )
    return endpoint, zone, access_key, cdn_url


def _encoded(path: str) -> str:
    normalized = path.strip("/")
    if not normalized or normalized.startswith("../") or "/../" in normalized:
        raise ValueError("Unsafe or empty storage path")
    return "/".join(quote(part, safe="") for part in normalized.split("/"))


def _supabase_headers(content_type: str | None = None) -> dict[str, str]:
    _, key, _ = _supabase_config()
    headers = {"apikey": key, "Authorization": f"Bearer {key}"}
    if content_type:
        headers["Content-Type"] = content_type
    return headers


def _bunny_headers(content_type: str | None = None) -> dict[str, str]:
    _, _, key, _ = _bunny_config()
    headers = {"AccessKey": key}
    if content_type:
        headers["Content-Type"] = content_type
    return headers


def _supabase_put(path: str, data: bytes, content_type: str) -> dict:
    project_url, _, bucket = _supabase_config()
    response = requests.post(
        f"{project_url}/storage/v1/object/{quote(bucket, safe='')}/{_encoded(path)}",
        headers={
            **_supabase_headers(content_type or "application/octet-stream"),
            "x-upsert": "true",
            "cache-control": "public, max-age=31536000, immutable",
        },
        data=data,
        timeout=180,
    )
    response.raise_for_status()
    payload = response.json() if response.content else {}
    return {**payload, "provider": "supabase"}


def _bunny_put(path: str, data: bytes, content_type: str) -> dict:
    endpoint, zone, _, _ = _bunny_config()
    response = requests.put(
        f"{endpoint}/{quote(zone, safe='')}/{_encoded(path)}",
        headers={
            **_bunny_headers(content_type or "application/octet-stream"),
            "Cache-Control": "public, max-age=31536000, immutable",
        },
        data=data,
        timeout=180,
    )
    response.raise_for_status()
    payload = response.json() if response.content else {}
    return {**payload, "provider": "bunny"}


def _supabase_get(path: str) -> Tuple[bytes, str]:
    project_url, _, bucket = _supabase_config()
    response = requests.get(
        f"{project_url}/storage/v1/object/authenticated/"
        f"{quote(bucket, safe='')}/{_encoded(path)}",
        headers=_supabase_headers(),
        timeout=90,
    )
    response.raise_for_status()
    return response.content, response.headers.get(
        "Content-Type", "application/octet-stream"
    )


def _bunny_get(path: str) -> Tuple[bytes, str]:
    endpoint, zone, _, _ = _bunny_config()
    response = requests.get(
        f"{endpoint}/{quote(zone, safe='')}/{_encoded(path)}",
        headers=_bunny_headers(),
        timeout=90,
    )
    response.raise_for_status()
    return response.content, response.headers.get(
        "Content-Type", "application/octet-stream"
    )


def init_storage() -> str:
    """Validate the active provider and return its zone/bucket name."""
    provider = _provider()
    if provider == "supabase":
        project_url, _, bucket = _supabase_config()
        response = requests.get(
            f"{project_url}/storage/v1/bucket/{quote(bucket, safe='')}",
            headers=_supabase_headers(),
            timeout=30,
        )
        response.raise_for_status()
        return bucket

    endpoint, zone, _, _ = _bunny_config()
    response = requests.get(
        f"{endpoint}/{quote(zone, safe='')}/",
        headers=_bunny_headers(),
        timeout=30,
    )
    response.raise_for_status()
    if provider == "dual":
        # Dual mode must fail early unless both destinations are configured.
        _supabase_config()
    return zone


def put_object(path: str, data: bytes, content_type: str) -> dict:
    """Upload or replace an object without changing its historical key."""
    provider = _provider()
    if provider == "supabase":
        payload = _supabase_put(path, data, content_type)
    elif provider == "bunny":
        payload = _bunny_put(path, data, content_type)
    else:
        # Bunny is written first. If Supabase then fails, the CMS/database is
        # not updated by the caller and the unreferenced Bunny object is safe
        # to identify and clean up from the migration manifest.
        bunny_payload = _bunny_put(path, data, content_type)
        supabase_payload = _supabase_put(path, data, content_type)
        payload = {
            "provider": "dual",
            "bunny": bunny_payload,
            "supabase": supabase_payload,
        }
    return {
        **payload,
        "path": path,
        "size": len(data),
        "content_type": content_type,
    }


def get_object(path: str) -> Tuple[bytes, str]:
    """Download from the active provider with a reversible Supabase fallback."""
    provider = _provider()
    if provider == "supabase":
        return _supabase_get(path)
    try:
        return _bunny_get(path)
    except requests.RequestException:
        # Supabase remains intact throughout preview and early production.
        return _supabase_get(path)


def public_url(path: str) -> str:
    """Return a delivery URL without using it as a database relationship."""
    provider = _provider()
    if provider in {"bunny", "dual"}:
        _, _, _, cdn_url = _bunny_config()
        if cdn_url:
            return f"{cdn_url}/{_encoded(path)}"
    project_url, _, bucket = _supabase_config()
    return (
        f"{project_url}/storage/v1/object/public/"
        f"{quote(bucket, safe='')}/{_encoded(path)}"
    )
