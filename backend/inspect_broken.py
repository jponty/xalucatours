import asyncio, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import server

async def main():
    # the broken one
    d = await server.db.files.find_one({"storage_path": "xaluca/library/df8dd624adeb4148acb17915300d1600.png"})
    print("=== BROKEN RECORD ===")
    if d:
        for k in ("_id","storage_path","original_filename","content_type","size","slot_id","source","tags","created_at","migrated_from"):
            print(f"  {k}: {d.get(k)}")
    # any other TEST_ / junk files
    print("=== TEST_/junk named files ===")
    async for d in server.db.files.find({"original_filename": {"$regex": "TEST_|test_|tmp|temp|dummy", "$options": "i"}}, {"storage_path":1,"original_filename":1,"content_type":1,"size":1,"slot_id":1,"source":1}):
        print("  ", d.get("original_filename"), "|", d.get("storage_path"), "|", d.get("content_type"), "| size=", d.get("size"), "| slot=", d.get("slot_id"))
    # tiny files (likely truncated) < 1KB
    print("=== suspiciously tiny files (size < 1024 bytes) ===")
    async for d in server.db.files.find({"size": {"$lt": 1024, "$gt": 0}}, {"storage_path":1,"original_filename":1,"content_type":1,"size":1}):
        print("  ", d.get("original_filename"), "|", d.get("storage_path"), "| size=", d.get("size"), "| ct=", d.get("content_type"))

asyncio.run(main())
