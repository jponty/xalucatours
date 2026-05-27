"""Emergent Object Storage helper.

A thin synchronous wrapper around the Emergent storage HTTP API. The
session-scoped `storage_key` is cached at the module level — call
`init_storage()` once at FastAPI startup and reuse the connection for
the lifetime of the process.

Path convention used by Xaluca Tours:
    xaluca/slots/{slot_id_safe}/{uuid}.{ext}
"""

from __future__ import annotations

import os
import logging
from typing import Tuple

import requests

logger = logging.getLogger(__name__)

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
APP_NAME = "xaluca"

_storage_key: str | None = None


def init_storage() -> str:
    """Call once at startup. Returns a session-scoped storage_key."""
    global _storage_key
    if _storage_key:
        return _storage_key
    emergent_key = os.environ.get("EMERGENT_LLM_KEY")
    if not emergent_key:
        raise RuntimeError("EMERGENT_LLM_KEY is not configured")
    resp = requests.post(
        f"{STORAGE_URL}/init",
        json={"emergent_key": emergent_key},
        timeout=30,
    )
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    logger.info("Emergent object storage initialized")
    return _storage_key


def _key_or_init() -> str:
    return _storage_key or init_storage()


def put_object(path: str, data: bytes, content_type: str) -> dict:
    """Upload bytes to storage. Returns {"path": str, "size": int, ...}."""
    key = _key_or_init()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    if resp.status_code == 403:
        # Refresh the key once and retry — handles expired session keys.
        global _storage_key
        _storage_key = None
        key = init_storage()
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data,
            timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str) -> Tuple[bytes, str]:
    """Download an object. Returns (bytes, content_type)."""
    key = _key_or_init()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )
    if resp.status_code == 403:
        global _storage_key
        _storage_key = None
        key = init_storage()
        resp = requests.get(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key},
            timeout=60,
        )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")
