"""Unit tests for the reversible Supabase/Bunny storage adapter."""

import os
import sys
import types
import unittest
from unittest.mock import Mock, call, patch

# The project runtime installs requests from backend/requirements.txt. The
# lightweight system Python used by local checks may not, so provide only the
# interface exercised by these fully mocked unit tests.
try:
    import requests
except ModuleNotFoundError:  # pragma: no cover - local test harness only
    requests = types.ModuleType("requests")
    requests.RequestException = type("RequestException", (Exception,), {})
    requests.ConnectionError = type(
        "ConnectionError", (requests.RequestException,), {}
    )
    requests.get = Mock()
    requests.post = Mock()
    requests.put = Mock()
    sys.modules["requests"] = requests

from backend import storage


ENV = {
    "SUPABASE_URL": "https://project.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "supabase-secret",
    "SUPABASE_STORAGE_BUCKET": "xaluca",
    "BUNNY_STORAGE_ENDPOINT": "https://storage.bunnycdn.com",
    "BUNNY_STORAGE_ZONE": "xalucatours-media",
    "BUNNY_STORAGE_API_KEY": "bunny-secret",
    "BUNNY_CDN_URL": "https://xalucatours-media.b-cdn.net",
}


def response(content=b"", content_type="application/octet-stream") -> Mock:
    result = Mock()
    result.content = content
    result.headers = {"Content-Type": content_type}
    result.json.return_value = {"ok": True}
    result.raise_for_status.return_value = None
    return result


class StorageAdapterTests(unittest.TestCase):
    def environment(self, provider: str):
        return patch.dict(
            os.environ,
            {**ENV, "MEDIA_STORAGE_PROVIDER": provider},
            clear=False,
        )

    def test_supabase_remains_default_write_target(self):
        post = Mock(return_value=response())
        with self.environment("supabase"), patch.object(storage.requests, "post", post):
            result = storage.put_object(
                "xaluca/library/photo.webp", b"image", "image/webp"
            )
        self.assertEqual(result["provider"], "supabase")
        self.assertEqual(result["path"], "xaluca/library/photo.webp")
        self.assertTrue(
            post.call_args.args[0].endswith(
                "/storage/v1/object/xaluca/xaluca/library/photo.webp"
            )
        )

    def test_bunny_write_uses_zone_password_and_preserves_path(self):
        put = Mock(return_value=response())
        with self.environment("bunny"), patch.object(storage.requests, "put", put):
            result = storage.put_object(
                "xaluca/library/foto uno.webp", b"image", "image/webp"
            )
        self.assertEqual(result["provider"], "bunny")
        self.assertEqual(
            put.call_args.args[0],
            "https://storage.bunnycdn.com/xalucatours-media/"
            "xaluca/library/foto%20uno.webp",
        )
        self.assertEqual(put.call_args.kwargs["headers"]["AccessKey"], "bunny-secret")

    def test_bunny_read_falls_back_to_supabase(self):
        get = Mock(
            side_effect=[
                requests.ConnectionError("bunny unavailable"),
                response(b"supabase-bytes", "image/webp"),
            ]
        )
        with self.environment("bunny"), patch.object(storage.requests, "get", get):
            body, content_type = storage.get_object("xaluca/library/photo.webp")
        self.assertEqual(body, b"supabase-bytes")
        self.assertEqual(content_type, "image/webp")
        self.assertEqual(get.call_count, 2)
        self.assertTrue(
            get.call_args_list[0].args[0].startswith("https://storage.bunnycdn.com/")
        )
        self.assertIn(
            "/storage/v1/object/authenticated/", get.call_args_list[1].args[0]
        )

    def test_dual_mode_writes_bunny_before_supabase(self):
        manager = Mock()
        manager.attach_mock(Mock(return_value=response()), "put")
        manager.attach_mock(Mock(return_value=response()), "post")
        with (
            self.environment("dual"),
            patch.object(storage.requests, "put", manager.put),
            patch.object(storage.requests, "post", manager.post),
        ):
            result = storage.put_object(
                "xaluca/library/photo.webp", b"image", "image/webp"
            )
        self.assertEqual(result["provider"], "dual")
        self.assertEqual(
            manager.mock_calls[0],
            call.put(
                "https://storage.bunnycdn.com/xalucatours-media/"
                "xaluca/library/photo.webp",
                headers={
                    "AccessKey": "bunny-secret",
                    "Content-Type": "image/webp",
                    "Cache-Control": "public, max-age=31536000, immutable",
                },
                data=b"image",
                timeout=180,
            ),
        )
        self.assertEqual(manager.mock_calls[1][0], "post")

    def test_public_url_is_derived_and_not_a_database_key(self):
        with self.environment("bunny"):
            value = storage.public_url("xaluca/library/foto uno.webp")
        self.assertEqual(
            value,
            "https://xalucatours-media.b-cdn.net/"
            "xaluca/library/foto%20uno.webp",
        )

    def test_rejects_unsafe_paths(self):
        with self.environment("bunny"):
            with self.assertRaisesRegex(ValueError, "Unsafe"):
                storage.public_url("../secret")


if __name__ == "__main__":
    unittest.main()
