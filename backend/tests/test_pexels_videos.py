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


def test_morocco_feed_rotates_city_queries_filters_landscape_and_deduplicates(monkeypatch):
    captured = []

    async def fake_get(path, params):
        captured.append({"path": path, "params": params})
        city_index = server.PEXELS_VIDEO_CITY_QUERIES.index(params["query"])
        return {
            "page": params["page"],
            "per_page": params["per_page"],
            "total_results": 40,
            "next_page": "https://api.pexels.com/videos/search?page=3",
            "videos": [
                _video(100 + city_index),
                _video(100 + city_index),
                _video(200 + city_index, width=720, height=1280),
            ],
        }

    monkeypatch.setattr(server, "_pexels_video_get", fake_get)
    server._pexels_video_cache.clear()
    response = asyncio.run(server.pexels_morocco_videos(page=2, per_page=8, locale="es-ES"))

    assert [call["path"] for call in captured] == ["/search"] * 4
    assert [call["params"]["query"] for call in captured] == [
        "Tangier",
        "Chefchaouen",
        "Essaouira",
        "Agadir",
    ]
    assert all(call["params"]["query"] != "Morocco" for call in captured)
    assert all(call["params"]["orientation"] == "landscape" for call in captured)
    assert all(call["params"]["page"] == 1 for call in captured)
    assert all(call["params"]["per_page"] == 3 for call in captured)
    assert all(call["params"]["locale"] == "es-ES" for call in captured)
    assert [video["id"] for video in response["videos"]] == [104, 105, 106, 107]
    assert [query["city"] for query in response["queries"]] == [
        "Tangier",
        "Chefchaouen",
        "Essaouira",
        "Agadir",
    ]
    assert response["next_page"] is True


def test_city_rotation_advances_each_city_search_page_after_a_full_cycle(monkeypatch):
    captured = []

    async def fake_get(path, params):
        captured.append(params)
        return {"videos": [_video(len(captured))], "next_page": True, "total_results": 1}

    monkeypatch.setattr(server, "_pexels_video_get", fake_get)
    server._pexels_video_cache.clear()
    asyncio.run(server.pexels_morocco_videos(page=3, per_page=12))

    assert [(call["query"], call["page"]) for call in captured] == [
        ("Ouarzazate", 1),
        ("Merzouga", 1),
        ("Marrakech", 2),
        ("Casablanca", 2),
    ]
