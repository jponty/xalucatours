"""Test the /api/admin/reoptimize-library endpoint after the MAX_IMAGE_PIXELS fix.

Bug fixed: Pillow's decompression-bomb guard caused giant masters to be silently
counted as 'skipped' instead of optimized. Now optimized >= 1, saved_bytes > 0.
"""
import os
import time

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://morocco-trips-2.preview.emergentagent.com").rstrip("/")
# Admin password comes from the environment only — never hardcode secrets in source.
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")


@pytest.fixture(scope="module")
def admin_token():
    if not ADMIN_PASSWORD:
        pytest.skip("ADMIN_PASSWORD env var not set")
    resp = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD}, timeout=20)
    assert resp.status_code == 200, f"login failed: {resp.status_code} {resp.text}"
    token = resp.json().get("token")
    assert token, "no token returned from login"
    return token


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


def test_admin_verify(auth_headers):
    r = requests.get(f"{BASE_URL}/api/admin/verify", headers=auth_headers, timeout=15)
    assert r.status_code == 200, r.text


def test_reoptimize_library_triggers_and_optimizes(auth_headers):
    # Make sure no job currently running first
    s0 = requests.get(f"{BASE_URL}/api/admin/reoptimize-library/status", headers=auth_headers, timeout=20)
    assert s0.status_code == 200, s0.text
    if s0.json().get("running"):
        # wait for any existing job to finish
        for _ in range(60):
            time.sleep(2)
            s = requests.get(f"{BASE_URL}/api/admin/reoptimize-library/status", headers=auth_headers, timeout=20).json()
            if not s.get("running"):
                break

    # Trigger
    trig = requests.post(f"{BASE_URL}/api/admin/reoptimize-library", headers=auth_headers, timeout=30)
    assert trig.status_code in (200, 202), trig.text

    # Poll until done (max ~3 minutes)
    final = None
    for i in range(90):
        time.sleep(2)
        r = requests.get(f"{BASE_URL}/api/admin/reoptimize-library/status", headers=auth_headers, timeout=20)
        assert r.status_code == 200, r.text
        st = r.json()
        print(f"poll #{i}: running={st.get('running')} done={st.get('done')}/{st.get('total')} "
              f"opt={st.get('optimized')} skip={st.get('skipped')} err={st.get('errors')} "
              f"saved={st.get('saved_bytes')} pct={st.get('percent')}")
        if not st.get("running"):
            final = st
            break
    assert final is not None, "reoptimize job did not finish in time"

    # Key assertions (the bug was optimized=0 for everything)
    total = final.get("total", 0)
    done = final.get("done", 0)
    optimized = final.get("optimized", 0)
    errors = final.get("errors", 0)
    saved = final.get("saved_bytes", 0)

    assert total >= 1, f"expected candidates >=1, got total={total}"
    assert done == total, f"done {done} != total {total}"
    assert errors == 0, f"expected 0 errors, got {errors}"
    assert optimized >= 1, f"BUG STILL PRESENT: optimized={optimized} (expected >=1)"
    assert saved > 0, f"BUG STILL PRESENT: saved_bytes={saved} (expected > 0)"
    # Per request: ~13MB savings expected. At least confirm it's a meaningful save (>1MB)
    assert saved > 1_000_000, f"saved_bytes too small: {saved}"
