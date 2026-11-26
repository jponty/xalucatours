import httpx
from fastapi import APIRouter, FastAPI
from fastapi.testclient import TestClient

from rankspot_webhook import register_rankspot_routes


PAYLOAD = {
    "event": "post.published", "timestamp": "2026-11-19T12:00:00Z",
    "post": {
        "id": "rankspot-1", "title": "Marruecos en otoño", "description": "Rutas y consejos",
        "slug": "marruecos-en-otono", "contentHtml": "<h2>Rutas</h2><p>Viaja con nosotros</p>",
        "coverImageUrl": "https://example.com/cover.jpg", "category": "Rutas",
        "keywords": ["Marruecos", "otoño"], "createdAt": "2026-11-18T12:00:00Z",
        "updatedAt": "2026-11-19T12:00:00Z",
    },
}


class FakeDb:
    def __init__(self):
        self.rows = {}

    async def request(self, method, table, **kwargs):
        assert table == "rankspot_blog_posts"
        if method == "POST":
            row = kwargs["json"]
            self.rows[row["slug"]] = row
            return httpx.Response(204, request=httpx.Request(method, "https://example.com"))
        params = kwargs["params"]
        rows = list(self.rows.values())
        if "slug" in params:
            rows = [row for row in rows if row["slug"] == params["slug"][3:]]
        if "content_html" not in params["select"]:
            rows = [{k: v for k, v in row.items() if k != "content_html"} for row in rows]
        return httpx.Response(200, json=rows, request=httpx.Request(method, "https://example.com"))


def client_for(db):
    app = FastAPI()
    router = APIRouter(prefix="/api")
    register_rankspot_routes(router, lambda: db)
    app.include_router(router)
    return TestClient(app)


def test_rejects_missing_or_wrong_key(monkeypatch):
    monkeypatch.setenv("RANKSPOT_WEBHOOK_API_KEY", "secret")
    client = client_for(FakeDb())
    assert client.post("/api/webhooks/rankspot", json=PAYLOAD).status_code == 401
    assert client.post("/api/webhooks/rankspot", json=PAYLOAD, headers={"X-API-Key": "wrong"}).status_code == 401


def test_publishes_and_lists_metadata_without_html(monkeypatch):
    monkeypatch.setenv("RANKSPOT_WEBHOOK_API_KEY", "secret")
    db = FakeDb()
    client = client_for(db)
    response = client.post("/api/webhooks/rankspot", json=PAYLOAD, headers={"X-API-Key": "secret"})
    assert response.status_code == 200
    assert response.json() == {"ok": True, "slug": "marruecos-en-otono"}
    assert db.rows["marruecos-en-otono"]["keywords"] == ["Marruecos", "otoño"]
    listed = client.get("/api/blog/posts").json()
    assert "content_html" not in listed[0]
    assert client.get("/api/blog/posts/marruecos-en-otono").json()["content_html"].startswith("<h2>")


def test_rejects_empty_article_and_unsafe_slug(monkeypatch):
    monkeypatch.setenv("RANKSPOT_WEBHOOK_API_KEY", "secret")
    client = client_for(FakeDb())
    empty = {**PAYLOAD, "post": {**PAYLOAD["post"], "contentHtml": None}}
    assert client.post("/api/webhooks/rankspot", json=empty, headers={"X-API-Key": "secret"}).status_code == 422
    bad_slug = {**PAYLOAD, "post": {**PAYLOAD["post"], "slug": "../admin"}}
    assert client.post("/api/webhooks/rankspot", json=bad_slug, headers={"X-API-Key": "secret"}).status_code == 422


def test_updates_published_article(monkeypatch):
    monkeypatch.setenv("RANKSPOT_WEBHOOK_API_KEY", "secret")
    db = FakeDb()
    client = client_for(db)
    headers = {"X-API-Key": "secret"}
    assert client.post("/api/webhooks/rankspot", json=PAYLOAD, headers=headers).status_code == 200
    update = {**PAYLOAD, "event": "post.updated", "post": {
        **PAYLOAD["post"], "contentHtml": "<p>Contenido actualizado</p>",
        "coverImageUrl": "https://example.com/new-cover.jpg",
    }}
    response = client.post("/api/webhooks/rankspot", json=update, headers=headers)
    assert response.status_code == 200
    assert db.rows["marruecos-en-otono"]["content_html"] == "<p>Contenido actualizado</p>"
    assert db.rows["marruecos-en-otono"]["cover_image_url"] == "https://example.com/new-cover.jpg"
    update["post"]["contentHtml"] = None
    assert client.post("/api/webhooks/rankspot", json=update, headers=headers).status_code == 422
