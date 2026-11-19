"""Authenticated RankSpot delivery and public blog reads."""

import hmac
import os
import re
import asyncio
from datetime import datetime
from urllib.parse import urlparse

import httpx
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, ConfigDict, Field, field_validator


SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
METADATA = "source_id,slug,title,description,cover_image_url,category,keywords,created_at,updated_at,published_at"


class RankSpotPost(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: str = Field(min_length=1, max_length=200)
    title: str = Field(min_length=1, max_length=300)
    description: str | None = Field(default=None, max_length=1000)
    slug: str = Field(min_length=1, max_length=160)
    content_html: str | None = Field(alias="contentHtml", default=None, max_length=1_000_000)
    cover_image_url: str | None = Field(alias="coverImageUrl", default=None, max_length=2048)
    category: str | None = Field(default=None, max_length=100)
    keywords: list[str] = Field(default_factory=list, max_length=50)
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")

    @field_validator("slug")
    @classmethod
    def valid_slug(cls, value):
        if not SLUG.fullmatch(value):
            raise ValueError("Invalid URL slug")
        return value

    @field_validator("cover_image_url")
    @classmethod
    def valid_cover(cls, value):
        if value and (urlparse(value).scheme != "https" or not urlparse(value).hostname):
            raise ValueError("Cover URL must be HTTPS")
        return value

    @field_validator("keywords")
    @classmethod
    def valid_keywords(cls, values):
        if any(not isinstance(value, str) or len(value) > 100 for value in values):
            raise ValueError("Invalid keywords")
        return values


class RankSpotEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")

    event: str
    timestamp: datetime
    post: RankSpotPost


def register_rankspot_routes(router: APIRouter, get_db):
    @router.post("/webhooks/rankspot")
    async def receive_rankspot(payload: RankSpotEvent, x_api_key: str = Header(default="")):
        configured_key = os.environ.get("RANKSPOT_WEBHOOK_API_KEY", "")
        if not configured_key or not hmac.compare_digest(x_api_key, configured_key):
            raise HTTPException(status_code=401, detail="Unauthorized")
        if payload.event != "post.published" or not payload.post.content_html:
            raise HTTPException(status_code=422, detail="A published article with contentHtml is required")

        db = get_db()
        post = payload.post
        row = {
            "source_id": post.id,
            "slug": post.slug,
            "title": post.title,
            "description": post.description,
            "content_html": post.content_html,
            "cover_image_url": post.cover_image_url,
            "category": post.category,
            "keywords": post.keywords,
            "created_at": post.created_at.isoformat(),
            "updated_at": post.updated_at.isoformat(),
            "published_at": payload.timestamp.isoformat(),
        }
        try:
            await asyncio.wait_for(db.request("POST", "rankspot_blog_posts",
                params={"on_conflict": "source_id"},
                headers={"Prefer": "resolution=merge-duplicates,return=minimal"}, json=row,
                timeout=2.5), timeout=2.8)
        except httpx.HTTPStatusError as exc:
            if exc.response.status_code == 409:
                raise HTTPException(status_code=409, detail="Article slug is already in use") from exc
            raise HTTPException(status_code=503, detail="Article could not be saved") from exc
        except httpx.TransportError as exc:
            raise HTTPException(status_code=503, detail="Article could not be saved") from exc
        except asyncio.TimeoutError as exc:
            raise HTTPException(status_code=503, detail="Article could not be saved") from exc
        return {"ok": True, "slug": post.slug}

    @router.get("/blog/posts")
    async def list_rankspot_posts():
        response = await get_db().request("GET", "rankspot_blog_posts", params={
            "select": METADATA, "order": "published_at.desc", "limit": 100,
        })
        return response.json()

    @router.get("/blog/posts/{slug}")
    async def get_rankspot_post(slug: str):
        if not SLUG.fullmatch(slug):
            raise HTTPException(status_code=404, detail="Article not found")
        response = await get_db().request("GET", "rankspot_blog_posts", params={
            "select": f"{METADATA},content_html", "slug": f"eq.{slug}", "limit": 1,
        })
        rows = response.json()
        if not rows:
            raise HTTPException(status_code=404, detail="Article not found")
        return rows[0]
