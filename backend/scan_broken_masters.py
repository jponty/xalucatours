import asyncio, os, sys
from io import BytesIO
from PIL import Image, UnidentifiedImageError
sys.path.insert(0, os.path.dirname(__file__))
import server

Image.MAX_IMAGE_PIXELS = None
CONCURRENCY = 6

def _fetch_with_retry(p, tries=4):
    last = None
    for _ in range(tries):
        try:
            return server.get_object(p)
        except Exception as exc:
            last = exc
    raise last

async def main():
    docs = []
    async for d in server.db.files.find({}, {"storage_path": 1, "size": 1, "content_type": 1, "original_filename": 1, "slot_id": 1, "source": 1, "tags": 1}):
        if d.get("storage_path"):
            docs.append(d)
    total = len(docs)
    print(f"SCANNING total={total}", flush=True)

    broken, neterr, done = [], [], 0
    sem = asyncio.Semaphore(CONCURRENCY)
    lock = asyncio.Lock()

    async def check(d):
        nonlocal done
        p = d.get("storage_path")
        async with sem:
            try:
                data, _ct = await asyncio.to_thread(_fetch_with_retry, p)
            except Exception as exc:
                async with lock:
                    neterr.append(p)
                return
            try:
                img = Image.open(BytesIO(data))
                img.load()
            except Exception as exc:
                info = {"path": p, "size": d.get("size"), "ct": d.get("content_type"),
                        "fn": d.get("original_filename"), "slot": d.get("slot_id"),
                        "src": d.get("source"), "err": f"{type(exc).__name__}: {exc}"}
                broken.append(info)
                print("REAL-BROKEN:", p, "|", d.get("original_filename"), "|", d.get("content_type"),
                      "| slot=", d.get("slot_id"), "| src=", d.get("source"), "|", f"{type(exc).__name__}: {exc}", flush=True)
        async with lock:
            done += 1
            if done % 1000 == 0:
                print(f"...progress {done}/{total} (neterr={len(neterr)})", flush=True)

    await asyncio.gather(*[check(d) for d in docs])
    print("====", flush=True)
    print(f"TOTAL={total} REAL_BROKEN={len(broken)} NET_TIMEOUTS_AFTER_RETRY={len(neterr)}", flush=True)
    if neterr:
        print("NET_TIMEOUT_PATHS:", neterr[:20], flush=True)

asyncio.run(main())
