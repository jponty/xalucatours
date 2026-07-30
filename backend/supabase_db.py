"""Async Mongo-like compatibility layer backed exclusively by Supabase Postgres.

The application historically used Motor throughout ``server.py``.  Rewriting every
endpoint at once would make the migration unnecessarily risky, so this module
implements the small Motor subset the application actually uses while persisting
documents in the existing ``mirror_<collection>`` JSONB tables.

It is an operational database layer, not a synchronisation layer: all reads and
writes go directly to Supabase Postgres.
"""

from __future__ import annotations

import asyncio
import copy
import json
import os
import re
import uuid
from dataclasses import dataclass
from datetime import date, datetime
from typing import Any, AsyncIterator

import asyncpg


_SAFE_NAME = re.compile(r"^[a-z][a-z0-9_]*$")
_MISSING = object()


def _safe_json(value: Any) -> Any:
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, dict):
        return {str(k): _safe_json(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [_safe_json(v) for v in value]
    return value


def _values_at(value: Any, dotted: str) -> list[Any]:
    parts = dotted.split(".") if dotted else []
    values = [value]
    for part in parts:
        next_values: list[Any] = []
        for current in values:
            if isinstance(current, dict):
                if part in current:
                    next_values.append(current[part])
            elif isinstance(current, list):
                for item in current:
                    if isinstance(item, dict) and part in item:
                        next_values.append(item[part])
        values = next_values
    flattened: list[Any] = []
    for item in values:
        if isinstance(item, list):
            flattened.extend(item)
        else:
            flattened.append(item)
    return flattened


def _eq(values: list[Any], expected: Any) -> bool:
    for value in values:
        if value == expected:
            return True
        if isinstance(value, list) and expected in value:
            return True
    return False


def _match_field(doc: dict, field: str, condition: Any) -> bool:
    values = _values_at(doc, field)
    exists = bool(values)
    if not isinstance(condition, dict) or not any(str(k).startswith("$") for k in condition):
        return _eq(values, condition)

    options = str(condition.get("$options", ""))
    for operator, expected in condition.items():
        if operator == "$options":
            continue
        if operator == "$exists":
            if exists != bool(expected):
                return False
        elif operator == "$ne":
            if exists and _eq(values, expected):
                return False
        elif operator == "$in":
            if not any(_eq(values, item) for item in expected):
                return False
        elif operator == "$gt":
            if not any(value is not None and value > expected for value in values):
                return False
        elif operator == "$regex":
            flags = re.IGNORECASE if "i" in options else 0
            pattern = re.compile(str(expected), flags)
            if not any(pattern.search(str(value or "")) for value in values):
                return False
        else:
            raise NotImplementedError(f"Unsupported Supabase query operator: {operator}")
    return True


def _matches(doc: dict, query: dict | None) -> bool:
    query = query or {}
    for field, condition in query.items():
        if field == "$or":
            if not any(_matches(doc, branch) for branch in condition):
                return False
        elif not _match_field(doc, field, condition):
            return False
    return True


def _project(doc: dict, projection: dict | None) -> dict:
    if not projection:
        return copy.deepcopy(doc)
    included = {key for key, enabled in projection.items() if enabled and key != "_id"}
    exclude_id = projection.get("_id") == 0
    if included:
        out: dict[str, Any] = {}
        if not exclude_id and "_id" in doc:
            out["_id"] = copy.deepcopy(doc["_id"])
        for key in included:
            values = _values_at(doc, key)
            if values:
                _set_path(out, key, copy.deepcopy(values[0] if len(values) == 1 else values))
        return out
    out = copy.deepcopy(doc)
    for key, enabled in projection.items():
        if not enabled:
            _unset_path(out, key)
    return out


def _set_path(doc: dict, dotted: str, value: Any) -> None:
    current = doc
    parts = dotted.split(".")
    for part in parts[:-1]:
        child = current.get(part)
        if not isinstance(child, dict):
            child = {}
            current[part] = child
        current = child
    current[parts[-1]] = value


def _unset_path(doc: dict, dotted: str) -> None:
    current: Any = doc
    parts = dotted.split(".")
    for part in parts[:-1]:
        if not isinstance(current, dict) or part not in current:
            return
        current = current[part]
    if isinstance(current, dict):
        current.pop(parts[-1], None)


def _positional_index(doc: dict, query: dict, array_name: str) -> int | None:
    wanted = query.get(f"{array_name}.id")
    items = doc.get(array_name) or []
    for index, item in enumerate(items):
        if isinstance(item, dict) and item.get("id") == wanted:
            return index
    return None


def _apply_update(doc: dict, update: dict, query: dict, inserted: bool) -> dict:
    out = copy.deepcopy(doc)
    for operator, changes in update.items():
        if operator == "$setOnInsert":
            if not inserted:
                continue
            operator = "$set"
        for path, value in changes.items():
            actual_path = path
            if ".$." in path:
                array_name, tail = path.split(".$.", 1)
                index = _positional_index(out, query, array_name)
                if index is None:
                    continue
                items = out.setdefault(array_name, [])
                target = items[index]
                if operator == "$inc":
                    _set_path(target, tail, (_values_at(target, tail) or [0])[0] + value)
                elif operator == "$set":
                    _set_path(target, tail, value)
                continue
            if operator == "$set":
                _set_path(out, actual_path, value)
            elif operator == "$unset":
                _unset_path(out, actual_path)
            elif operator == "$inc":
                previous = _values_at(out, actual_path)
                _set_path(out, actual_path, (previous[0] if previous else 0) + value)
            elif operator == "$addToSet":
                previous = _values_at(out, actual_path)
                items = list(previous) if previous else []
                if value not in items:
                    items.append(value)
                _set_path(out, actual_path, items)
            else:
                raise NotImplementedError(f"Unsupported Supabase update operator: {operator}")
    return _safe_json(out)


@dataclass
class InsertOneResult:
    inserted_id: str


@dataclass
class InsertManyResult:
    inserted_ids: list[str]


@dataclass
class UpdateResult:
    matched_count: int = 0
    modified_count: int = 0
    upserted_id: str | None = None


@dataclass
class DeleteResult:
    deleted_count: int = 0


@dataclass
class BulkWriteResult:
    upserted_count: int = 0
    modified_count: int = 0


class UpdateOne:
    """Tiny replacement for ``pymongo.UpdateOne`` used by bulk registrations."""

    def __init__(self, query: dict, update: dict, upsert: bool = False):
        self._filter = query
        self._doc = update
        self._upsert = upsert


class SupabaseCursor(AsyncIterator[dict]):
    def __init__(self, documents: list[dict], projection: dict | None = None):
        self._documents = documents
        self._projection = projection
        self._skip = 0
        self._limit: int | None = None
        self._sort_specs: list[tuple[str, int]] = []
        self._index = 0

    def sort(self, key: str | list[tuple[str, int]], direction: int | None = None):
        self._sort_specs = [(key, direction or 1)] if isinstance(key, str) else list(key)
        return self

    def skip(self, count: int):
        self._skip = max(0, int(count))
        return self

    def limit(self, count: int):
        self._limit = max(0, int(count))
        return self

    def max_time_ms(self, _milliseconds: int):
        """Motor compatibility; Postgres timeouts are configured on the pool."""
        return self

    def _result(self) -> list[dict]:
        for field, order in reversed(self._sort_specs):
            def sort_key(doc):
                values = _values_at(doc, field)
                value = values[0] if values else None
                return value is None, value
            self._documents.sort(key=sort_key, reverse=order < 0)
        rows = self._documents[self._skip :]
        if self._limit is not None:
            rows = rows[: self._limit]
        return [_project(row, self._projection) for row in rows]

    async def to_list(self, length: int | None = None) -> list[dict]:
        rows = self._result()
        return rows if length is None else rows[:length]

    def __aiter__(self):
        self._iter_rows = self._result()
        self._index = 0
        return self

    async def __anext__(self):
        if self._index >= len(self._iter_rows):
            raise StopAsyncIteration
        row = self._iter_rows[self._index]
        self._index += 1
        return row


class SupabaseCollection:
    def __init__(self, database: "SupabaseDatabase", name: str):
        if not _SAFE_NAME.fullmatch(name):
            raise ValueError(f"Invalid collection name: {name}")
        self.database = database
        self.name = name
        self.table = f"mirror_{name}"
        self._lock = asyncio.Lock()

    async def _ensure(self, connection) -> None:
        await connection.execute(
            f'CREATE TABLE IF NOT EXISTS "{self.table}" ('
            "id text PRIMARY KEY, data jsonb NOT NULL, "
            "updated_at timestamptz NOT NULL DEFAULT now())"
        )
        await connection.execute(f'ALTER TABLE "{self.table}" ENABLE ROW LEVEL SECURITY')

    async def _all(self) -> list[dict]:
        pool = await self.database.pool()
        async with pool.acquire() as connection:
            await self._ensure(connection)
            rows = await connection.fetch(f'SELECT data FROM "{self.table}"')
        return [
            copy.deepcopy(json.loads(row["data"]) if isinstance(row["data"], str) else row["data"])
            for row in rows
        ]

    async def _save(self, doc: dict) -> str:
        clean = _safe_json(doc)
        row_id = str(clean.get("_id") or clean.get("id") or uuid.uuid4())
        clean.setdefault("_id", row_id)
        pool = await self.database.pool()
        async with pool.acquire() as connection:
            await self._ensure(connection)
            await connection.execute(
                f'INSERT INTO "{self.table}" (id, data, updated_at) '
                "VALUES ($1, $2::jsonb, now()) "
                "ON CONFLICT (id) DO UPDATE SET data=excluded.data, updated_at=now()",
                row_id,
                json.dumps(clean, ensure_ascii=False, separators=(",", ":")),
            )
        return row_id

    async def find_one(
        self,
        query: dict | None = None,
        projection: dict | None = None,
        sort: list[tuple[str, int]] | None = None,
    ):
        matches = [doc for doc in await self._all() if _matches(doc, query)]
        cursor = SupabaseCursor(matches, projection)
        if sort:
            cursor.sort(sort)
        rows = await cursor.to_list(1)
        return rows[0] if rows else None

    def find(self, query: dict | None = None, projection: dict | None = None):
        async def load():
            return [doc for doc in await self._all() if _matches(doc, query)]
        return DeferredCursor(load, projection)

    async def insert_one(self, document: dict):
        async with self._lock:
            row_id = await self._save(document)
        return InsertOneResult(row_id)

    async def insert_many(self, documents: list[dict]):
        ids = []
        async with self._lock:
            for document in documents:
                ids.append(await self._save(document))
        return InsertManyResult(ids)

    async def update_one(self, query: dict, update: dict, upsert: bool = False):
        async with self._lock:
            docs = await self._all()
            for doc in docs:
                if _matches(doc, query):
                    changed = _apply_update(doc, update, query, False)
                    await self._save(changed)
                    return UpdateResult(1, int(changed != doc))
            if not upsert:
                return UpdateResult()
            base = {
                key: value
                for key, value in query.items()
                if not key.startswith("$") and not isinstance(value, dict) and "." not in key
            }
            created = _apply_update(base, update, query, True)
            row_id = await self._save(created)
            return UpdateResult(upserted_id=row_id)

    async def update_many(self, query: dict, update: dict):
        matched = modified = 0
        async with self._lock:
            for doc in await self._all():
                if _matches(doc, query):
                    matched += 1
                    changed = _apply_update(doc, update, query, False)
                    modified += int(changed != doc)
                    await self._save(changed)
        return UpdateResult(matched, modified)

    async def delete_one(self, query: dict):
        return await self._delete(query, one=True)

    async def delete_many(self, query: dict):
        return await self._delete(query, one=False)

    async def _delete(self, query: dict, one: bool):
        ids = [str(doc.get("_id") or doc.get("id")) for doc in await self._all() if _matches(doc, query)]
        if one:
            ids = ids[:1]
        if ids:
            pool = await self.database.pool()
            async with pool.acquire() as connection:
                await connection.execute(f'DELETE FROM "{self.table}" WHERE id=ANY($1::text[])', ids)
        return DeleteResult(len(ids))

    async def count_documents(self, query: dict | None = None, **_kwargs):
        return sum(1 for doc in await self._all() if _matches(doc, query))

    async def create_index(self, *args, **kwargs):
        return None

    async def bulk_write(self, operations, ordered: bool = True):
        upserted = modified = 0
        for operation in operations:
            query = getattr(operation, "_filter", {})
            update = getattr(operation, "_doc", {})
            result = await self.update_one(query, update, upsert=bool(getattr(operation, "_upsert", False)))
            upserted += int(result.upserted_id is not None)
            modified += result.modified_count
        return BulkWriteResult(upserted, modified)

    def aggregate(self, pipeline: list[dict]):
        async def load():
            rows = await self._all()
            for stage in pipeline:
                if "$match" in stage:
                    rows = [row for row in rows if _matches(row, stage["$match"])]
                elif "$unwind" in stage:
                    field = str(stage["$unwind"]).lstrip("$")
                    expanded = []
                    for row in rows:
                        for value in _values_at(row, field):
                            clone = copy.deepcopy(row)
                            _set_path(clone, field, value)
                            expanded.append(clone)
                    rows = expanded
                elif "$group" in stage:
                    spec = stage["$group"]
                    grouped: dict[str, dict] = {}
                    for row in rows:
                        group_spec = spec["_id"]
                        if isinstance(group_spec, str):
                            values = _values_at(row, group_spec.lstrip("$"))
                            group_key = values[0] if values else None
                        elif isinstance(group_spec, dict) and "$substr" in group_spec:
                            field, start, length = group_spec["$substr"]
                            values = _values_at(row, str(field).lstrip("$"))
                            group_key = str(values[0] if values else "")[start : start + length]
                        else:
                            group_key = None
                        token = json.dumps(group_key, sort_keys=True, default=str)
                        grouped.setdefault(token, {"_id": group_key})
                        for output, accumulator in spec.items():
                            if output != "_id" and accumulator == {"$sum": 1}:
                                grouped[token][output] = grouped[token].get(output, 0) + 1
                    rows = list(grouped.values())
                elif "$sort" in stage:
                    for field, order in reversed(list(stage["$sort"].items())):
                        rows.sort(key=lambda row: (_values_at(row, field) or [None])[0], reverse=order < 0)
                elif "$limit" in stage:
                    rows = rows[: int(stage["$limit"])]
                else:
                    raise NotImplementedError(f"Unsupported Supabase aggregate stage: {stage}")
            return rows
        return DeferredCursor(load)


class DeferredCursor(SupabaseCursor):
    def __init__(self, loader, projection: dict | None = None):
        super().__init__([], projection)
        self._loader = loader

    async def _loaded_result(self):
        self._documents = await self._loader()
        return self._result()

    async def to_list(self, length: int | None = None):
        rows = await self._loaded_result()
        return rows if length is None else rows[:length]

    def __aiter__(self):
        self._async_iterator = self._iterate()
        return self

    async def _iterate(self):
        for row in await self._loaded_result():
            yield row

    async def __anext__(self):
        return await self._async_iterator.__anext__()


class SupabaseDatabase:
    def __init__(self, database_url: str | None = None):
        self.database_url = database_url or os.environ.get("SUPABASE_DB_URL")
        if not self.database_url:
            raise RuntimeError("SUPABASE_DB_URL is required")
        self._pool = None
        self._collections: dict[str, SupabaseCollection] = {}

    async def pool(self):
        if self._pool is None:
            self._pool = await asyncpg.create_pool(
                self.database_url,
                statement_cache_size=0,
                min_size=1,
                max_size=int(os.environ.get("SUPABASE_DB_POOL_SIZE", "4")),
                command_timeout=120,
            )
        return self._pool

    def __getattr__(self, name: str):
        if name.startswith("_"):
            raise AttributeError(name)
        if name not in self._collections:
            self._collections[name] = SupabaseCollection(self, name)
        return self._collections[name]

    def __getitem__(self, name: str):
        return getattr(self, name)

    async def close(self):
        if self._pool is not None:
            await self._pool.close()
            self._pool = None
