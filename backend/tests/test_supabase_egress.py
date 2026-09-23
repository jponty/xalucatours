"""Offline PostgREST contract tests: no credentials, DB writes or network."""
import copy
import json

import httpx
import pytest

from supabase_db import SupabaseCollection, SupabaseDatabase, UpdateOne, _id_batches


@pytest.fixture
def anyio_backend():
    return "asyncio"


class Postgrest:
    def __init__(self, docs=()):
        self.rows = {d["_id"]: copy.deepcopy(d) for d in docs}
        self.calls = []
        self.response_bytes = 0

    async def request(self, method, table, **kwargs):
        self.calls.append((method, table, copy.deepcopy(kwargs)))
        params = kwargs.get("params", {})
        matches = sorted(self.rows.items())
        for field, expression in params.items():
            if field in {"select", "order", "offset", "limit", "on_conflict"}:
                continue
            def value(row):
                return row[0] if field == "id" else row[1].get(field.removeprefix("data->>"))
            if expression.startswith("eq."):
                matches = [r for r in matches if value(r) == expression[3:]]
            elif expression.startswith("in.("):
                allowed = json.loads("[" + expression[4:-1] + "]")
                matches = [r for r in matches if value(r) in allowed]
            else:
                raise AssertionError(f"Unsupported test filter: {field}")
        headers = {}
        body = b""
        if method == "GET":
            offset = params.get("offset", 0)
            page = matches[offset:offset + params.get("limit", 1000)]
            body = json.dumps([{"data": doc} for _, doc in page]).encode()
        elif method == "HEAD":
            headers["content-range"] = f"*/{len(matches)}"
        elif method == "POST":
            payload = kwargs["json"]
            for row in payload if isinstance(payload, list) else [payload]:
                self.rows[row["id"]] = copy.deepcopy(row["data"])
        elif method == "DELETE":
            for key, _ in matches:
                del self.rows[key]
        else:
            raise AssertionError(method)
        self.response_bytes += len(body)
        return httpx.Response(200, content=body, headers=headers)


@pytest.mark.anyio
async def test_twenty_registry_updates_read_only_twenty_rows():
    docs = [{"_id": f"slot-{i:05}", "defaults": {"es": "Texto " * 70}, "first_seen": "original"}
            for i in range(14487)]
    db = Postgrest(docs)
    collection = SupabaseCollection(db, "text_slot_registry")
    result = await collection.bulk_write([
        UpdateOne({"_id": doc["_id"]}, {"$set": {"defaults": {"es": "Nuevo"}},
                  "$setOnInsert": {"first_seen": "new"}}, upsert=True) for doc in docs[:20]
    ])
    assert result.modified_count == 20
    assert len(db.calls) == 2  # one filtered GET + one bulk POST, previously 320
    assert db.calls[0][2]["params"]["id"].startswith("in.(")
    assert len(db.calls[1][2]["json"]) == 20
    assert db.rows["slot-00000"]["first_seen"] == "original"
    assert db.rows["slot-00020"] == docs[20]
    old_bytes = 20 * len(json.dumps([{"data": d} for d in docs]).encode())
    assert db.response_bytes / old_bytes < 0.001
    print(f"registry benchmark: previous={old_bytes:,} bytes, optimized={db.response_bytes:,} bytes")


@pytest.mark.anyio
async def test_bulk_preserves_insert_only_fields_duplicates_and_missing_non_upserts():
    db = Postgrest([{"_id": "existing", "count": 1, "first_seen": "old"}])
    collection = SupabaseCollection(db, "text_slot_registry")
    result = await collection.bulk_write([
        UpdateOne({"_id": "existing"}, {"$inc": {"count": 1}, "$setOnInsert": {"first_seen": "wrong"}}, True),
        UpdateOne({"_id": "new"}, {"$setOnInsert": {"first_seen": "new", "count": 0}}, True),
        UpdateOne({"_id": "new"}, {"$inc": {"count": 2}}, True),
        UpdateOne({"_id": "missing"}, {"$set": {"count": 5}}),
    ])
    assert result.upserted_count == 1 and result.modified_count == 2
    assert db.rows["existing"] == {"_id": "existing", "count": 2, "first_seen": "old"}
    assert db.rows["new"] == {"_id": "new", "count": 2, "first_seen": "new"}
    assert "missing" not in db.rows
    db.calls.clear()
    await collection.bulk_write([UpdateOne({"_id": "existing"}, {"$set": {"count": 2}}, True)])
    assert [call[0] for call in db.calls] == ["GET"]


@pytest.mark.anyio
async def test_point_reads_updates_deletes_and_counts_are_filtered():
    db = Postgrest([{"_id": "row-a", "id": "a", "email": "ana@example.com", "is_deleted": True},
                   {"_id": "row-b", "id": "b", "email": "ana@example.com", "tags": ["trip"], "meta": "preserve"}])
    collection = SupabaseCollection(db, "files")
    assert (await collection.find_one({"id": "b"}))["meta"] == "preserve"
    assert db.calls[-1][2]["params"]["data->>id"] == "eq.b"
    # A residual filter must not limit the candidate set prematurely.
    row = await collection.find_one({"email": "ana@example.com", "is_deleted": {"$ne": True}})
    assert row["id"] == "b"
    await collection.update_one({"_id": "row-b"}, {"$addToSet": {"tags": "gallery"}})
    assert db.rows["row-b"]["tags"] == ["trip", "gallery"]
    assert db.rows["row-b"]["meta"] == "preserve"
    assert await collection.count_documents({"email": "ana@example.com"}) == 2
    assert db.calls[-1][0] == "HEAD"
    assert (await collection.delete_one({"id": "a"})).deleted_count == 1
    assert list(db.rows) == ["row-b"]


@pytest.mark.anyio
async def test_cursor_limit_skip_projection_sort_and_residual_queries():
    db = Postgrest([{"_id": str(i).zfill(4), "rank": 1500-i, "tags": ["match" if i % 2 else "other"]}
                   for i in range(1500)])
    collection = SupabaseCollection(db, "files")
    rows = await collection.find({}, {"_id": 1, "rank": 1}).skip(5).limit(3).to_list(2)
    assert [r["_id"] for r in rows] == ["0005", "0006"]
    assert db.calls[-1][2]["params"]["limit"] == 7
    assert (await collection.find({}).sort("rank", 1).to_list(1))[0]["rank"] == 1
    assert len(await collection.find({"tags": "match"}).to_list(None)) == 750
    assert len([row async for row in collection.find({}).limit(4)]) == 4
    assert await collection.find({}).to_list(0) == []


@pytest.mark.anyio
async def test_ids_with_reserved_characters_and_large_url_ids():
    ids = ['https://example.com/a,b?(c)=1&x="quoted"', "back\\slash", "á"]
    db = Postgrest([{"_id": key} for key in ids])
    collection = SupabaseCollection(db, "remote_image_registry")
    await collection.bulk_write([UpdateOne({"_id": key}, {"$set": {"seen": True}}, True) for key in ids])
    assert len(db.rows) == 3 and all(d["seen"] for d in db.rows.values())
    long_ids = [f"https://example.com/{i}?x=" + "a" * 1800 for i in range(120)]
    batches = list(_id_batches(long_ids))
    assert [i for batch in batches for i in batch] == long_ids
    assert max(len(batch) for batch in batches) <= 3


@pytest.mark.anyio
async def test_metrics_contain_no_query_values_or_secrets(monkeypatch, caplog):
    monkeypatch.setenv("SUPABASE_URL", "https://example.invalid")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "fake-secret")
    db = SupabaseDatabase()
    db._transfer_window = 0
    with caplog.at_level("INFO"):
        db._record_transfer("GET", "mirror_files", httpx.Response(200, content=b"private-content"))
    assert "response_bytes=15" in caplog.text
    assert "private-content" not in caplog.text and "fake-secret" not in caplog.text
    await db.close()
