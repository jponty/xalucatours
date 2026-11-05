"""Brochure links must match a concrete trip route, without guessing variants."""

import server


def test_confirmed_routes_resolve_to_their_canva_program():
    assert server.resolve_program_download_url("tourMarrakechFez78") == "https://canva.link/zkm6na3qbnnb6fu"
    assert server.resolve_program_download_url("tourFezRak910") == "https://canva.link/go1az578girgm29"
    assert server.resolve_program_download_url("tourEscapadaFez34") == "https://canva.link/a7jnfm77a0yhdas"
    assert server.resolve_program_download_url("tourMarrakechLoop23") == server.resolve_program_download_url("tourEscapadaRakErgRak23")


def test_ambiguous_or_unconfirmed_routes_keep_existing_fallback():
    for route_id in (
        "tourMarrakechFez67",  # One or two nights in Marrakech.
        "tourFezRak67",  # One or two nights in Marrakech.
        "tourMarrakechErg56",  # One or two nights in Marrakech.
        "tourAtlasDesierto67",  # Supplied Canva URL also belongs to row 57.
        "tourCiudadesImperiales67",  # Supplied row 69 says 5 nights, page says 6.
    ):
        assert route_id not in server.PROGRAM_DOWNLOAD_LINKS
        assert server.resolve_program_download_url(route_id) == server.DEFAULT_PROGRAM_DOWNLOAD_URL
