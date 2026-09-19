import asyncio

import server


def _video(video_id, width=1920, height=1080, files=None):
    return {
        "id": video_id,
        "width": width,
        "height": height,
        "duration": 14,
        "image": f"https://images.pexels.com/videos/{video_id}/poster.jpg",
        "url": f"https://www.pexels.com/video/{video_id}/",
        "user": {
            "name": "Pexels Creator",
            "url": "https://www.pexels.com/@creator/",
        },
        "video_files": files or [
            {
                "width": 640,
                "height": 360,
                "file_type": "video/mp4",
                "link": f"https://videos.pexels.com/video-files/{video_id}/640.mp4",
            },
            {
                "width": 1280,
                "height": 720,
                "file_type": "video/mp4",
                "link": f"https://videos.pexels.com/video-files/{video_id}/1280.mp4",
            },
        ],
    }


def test_video_summary_rejects_portrait_and_chooses_bounded_landscape_source():
    assert server._video_summary(_video(1, width=720, height=1280)) is None
    summary = server._video_summary(_video(2))
    assert summary["id"] == 2
    assert summary["video_width"] == 1280
    assert summary["video_height"] == 720
    assert summary["video_url"].endswith("/1280.mp4")
    assert summary["photographer"] == "Pexels Creator"


def test_morocco_feed_hardcodes_query_filters_landscape_and_deduplicates(monkeypatch):
    captured = {}

    async def fake_get(path, params):
        captured.update({"path": path, "params": params})
        return {
            "page": 2,
            "per_page": 8,
            "total_results": 40,
            "next_page": "https://api.pexels.com/videos/search?page=3",
            "videos": [_video(10), _video(10), _video(11, width=720, height=1280)],
        }

    monkeypatch.setattr(server, "_pexels_video_get", fake_get)
    server._pexels_video_cache.clear()
    response = asyncio.run(server.pexels_morocco_videos(page=2, per_page=8, locale="es-ES"))

    assert captured["path"] == "/search"
    assert captured["params"] == {
        "query": "Morocco",
        "orientation": "landscape",
        "page": 2,
        "per_page": 8,
        "locale": "es-ES",
    }
    assert [video["id"] for video in response["videos"]] == [10]
    assert response["next_page"] is True
