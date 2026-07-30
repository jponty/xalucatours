"""Clean full refresh of MongoDB -> Supabase Postgres mirror.
TRUNCATE each mirror_* table first (removes orphan rows from prior upsert-only
syncs), then repopulate from live Mongo, then lock down (RLS + revoke
anon/authenticated + grant service_role) and VERIFY parity + RLS + grants.
Source (Mongo/Object Storage) is never modified.
"""
import os, re, sys, asyncio
sys.path.insert(0, "/app/backend")
ENV = open("/app/backend/.env").read()
for _l in ENV.splitlines():
    _l=_l.strip()
    if _l and not _l.startswith("#") and "=" in _l:
        k,v=_l.split("=",1); os.environ.setdefault(k.strip(), v.strip().strip('"'))
def ev(k):
    m=re.search(rf"^{k}=(\S+)",ENV,re.M); return m.group(1).strip('"') if m else None

from motor.motor_asyncio import AsyncIOMotorClient
import supabase_mirror as M

async def main():
    db = AsyncIOMotorClient(ev("MONGO_URL"))[ev("DB_NAME")]
    pool = await M._get_pool()

    # 1. TRUNCATE existing mirror tables (destination copy only)
    async with pool.acquire() as conn:
        tables = [r["table_name"] for r in await conn.fetch(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema='public' AND table_name LIKE 'mirror_%' ORDER BY 1")]
        for t in tables:
            await conn.execute(f'TRUNCATE TABLE "{t}"')
        print(f"[truncate] {len(tables)} mirror_* tables cleared", flush=True)

    # 2. repopulate from live Mongo (content + personal)
    print("[mirror] running clean DB sync...", flush=True)
    snap = await M.run_sync(db, include_personal=True, do_db=True, do_storage=False, force=False)
    print("[mirror] phase:", snap.get("phase"), "error:", snap.get("error"), flush=True)

    # 3. lock down every mirror table
    async with pool.acquire() as conn:
        tables = [r["table_name"] for r in await conn.fetch(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema='public' AND table_name LIKE 'mirror_%' ORDER BY 1")]
        for t in tables:
            for sql in (f'ALTER TABLE "{t}" ENABLE ROW LEVEL SECURITY',
                        f'REVOKE ALL ON "{t}" FROM anon',
                        f'REVOKE ALL ON "{t}" FROM authenticated',
                        f'GRANT ALL ON "{t}" TO service_role'):
                try:
                    await conn.execute(sql)
                except Exception as e:
                    print(f"    WARN {t}: {str(e)[:80]}", flush=True)

        # 4. verify RLS (ordinary tables only: relkind='r')
        rls = await conn.fetch(
            "SELECT c.relname, c.relrowsecurity FROM pg_class c "
            "JOIN pg_namespace n ON n.oid=c.relnamespace "
            "WHERE n.nspname='public' AND c.relkind='r' AND c.relname LIKE 'mirror_%'")
        off = [r["relname"] for r in rls if not r["relrowsecurity"]]
        print(f"\n[verify] RLS enabled on {sum(1 for r in rls if r['relrowsecurity'])}/{len(rls)} "
              f"tables; OFF: {off or 'none'}", flush=True)

        leaks = await conn.fetch(
            "SELECT table_name, grantee FROM information_schema.role_table_grants "
            "WHERE table_name LIKE 'mirror_%' AND grantee IN ('anon','authenticated')")
        print(f"[verify] anon/authenticated grants: {len(leaks)} "
              f"{'(GOOD: none)' if not leaks else '(LEAK!)'}", flush=True)

        # 5. parity: mongo count vs mirror count
        print("\n[parity] collection: mongo vs mirror", flush=True)
        personal = {"contact_requests","contest_participants","trip_planner_requests","program_downloads"}
        all_ok = True
        for coll in M.CONTENT_COLLECTIONS + M.PERSONAL_COLLECTIONS:
            mongo_n = await db[coll].count_documents({})
            t = M._table_for(coll)
            try:
                mir_n = await conn.fetchval(f'SELECT count(*) FROM "{t}"')
            except Exception:
                mir_n = "N/A"
            ok = (mongo_n == mir_n)
            all_ok = all_ok and ok
            tag = "  <-- personal/requested" if coll in personal else ""
            print(f"    {coll:28s} mongo={mongo_n:6} mirror={mir_n:>6} {'OK' if ok else 'MISMATCH'}{tag}", flush=True)
        print(f"\n[parity] ALL MATCH: {all_ok}", flush=True)

asyncio.run(main())
