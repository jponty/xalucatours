"""Supabase Storage helper used by the operational backend.

Object keys intentionally keep their historical ``xaluca/...`` prefix.  With
the ``xaluca`` bucket this produces public URLs containing
``/public/xaluca/xaluca/...``.
"""

from __future__ import annotations

import os
from typing import Tuple
from urllib.parse import quote

import requests


def _config() -> tuple[str, str, str]:
    project_url = (os.environ.get("SUPABASE_URL") or "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or ""
    bucket = os.environ.get("SUPABASE_STORAGE_BUCKET", "xaluca")
    if not project_url or not service_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
    return project_url, service_key, bucket


def _encoded(path: str) -> str:
    return "/".join(quote(part, safe="") for part in path.split("/"))


def _headers(content_type: str | None = None) -> dict[str, str]:
    _, key, _ = _config()
    headers = {"apikey": key, "Authorization": f"Bearer {key}"}
    if content_type:
        headers["Content-Type"] = content_type
    return headers


def init_storage() -> str:
    """Validate configuration and return the active bucket name."""
    project_url, _, bucket = _config()
    response = requests.get(
        f"{project_url}/storage/v1/bucket/{quote(bucket, safe='')}",
        headers=_headers(),
        timeout=30,
    )
    response.raise_for_status()
    return bucket


def put_object(path: str, data: bytes, content_type: str) -> dict:
    """Upload or replace an object at its canonical historical path."""
    project_url, _, bucket = _config()
    response = requests.post(
        f"{project_url}/storage/v1/object/{quote(bucket, safe='')}/{_encoded(path)}",
        headers={
            **_headers(content_type or "application/octet-stream"),
            "x-upsert": "true",
            "cache-control": "public, max-age=31536000, immutable",
        },
        data=data,
        timeout=180,
    )
    response.raise_for_status()
    payload = response.json() if response.content else {}
    return {
        **payload,
        "path": path,
        "size": len(data),
        "content_type": content_type,
    }


def get_object(path: str) -> Tuple[bytes, str]:
    """Download an object with backend credentials."""
    project_url, _, bucket = _config()
    response = requests.get(
        f"{project_url}/storage/v1/object/authenticated/"
        f"{quote(bucket, safe='')}/{_encoded(path)}",
        headers=_headers(),
        timeout=90,
    )
    response.raise_for_status()
    return response.content, response.headers.get("Content-Type", "application/octet-stream")
