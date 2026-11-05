"""Drive brochure links must match a concrete trip route, without guessing variants."""

import server


def test_confirmed_routes_resolve_to_their_drive_program():
    assert server.resolve_program_download_url("tourMarrakechFez78") == "https://docs.google.com/document/d/1Y1tv3ywi60r0F1733F2JryiQQ_GYcED8oY2-9Ed7StY/edit"
    assert server.resolve_program_download_url("tourMarrakechErg45") == "https://docs.google.com/document/d/1YrWhiqA8ouE3TrkKR7EglyYWe8OEkbV0jKlPLvjtXPI/edit"
    assert server.resolve_program_download_url("tourAtlasDesierto67") == "https://docs.google.com/document/d/1eJPTNRfdrp5p7kN5oMnM4TXsuF9QJum6wJHAVIdAyuY/edit"
    assert server.resolve_program_download_url("tourEnduroAventura34") == "https://docs.google.com/document/d/1O9JhiU5pPLsue68Nticyx0-rNKWlIiAji0pF_Tkwkf8/edit"
    assert server.resolve_program_download_url("tourEnduroAventura45") == "https://docs.google.com/document/d/1e--qkZu_fnGfr9hq6DHjMdeL_N_f0m53mw4X86KZTNU/edit"
    assert server.resolve_program_download_url("tourMarrakechLoop23") == server.resolve_program_download_url("tourEscapadaRakErgRak23")


def test_all_assigned_documents_are_drive_links():
    assert len(server.PROGRAM_DOWNLOAD_LINKS) == 55
    assert all(url.startswith("https://docs.google.com/document/d/") for url in server.PROGRAM_DOWNLOAD_LINKS.values())


def test_ambiguous_or_unconfirmed_routes_keep_existing_fallback():
    for route_id in (
        "tourMarrakechFez67",  # One or two nights in Marrakech.
        "tourFezRak67",  # One or two nights in Marrakech.
        "tourMarrakechErg56",  # One or two nights in Marrakech.
        "tourCiudadesImperialesRif78",  # Row 71 has no Drive URL yet.
        "tourCiudadesImperiales67",  # Supplied row 69 says 5 nights, page says 6.
    ):
        assert route_id not in server.PROGRAM_DOWNLOAD_LINKS
        assert server.resolve_program_download_url(route_id) == server.DEFAULT_PROGRAM_DOWNLOAD_URL
