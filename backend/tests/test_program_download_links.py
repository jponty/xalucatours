"""Drive brochure links must match a concrete trip route, without guessing variants."""

import pytest

import server


def test_confirmed_routes_resolve_to_their_drive_program():
    assert server.resolve_program_download_url("tourMarrakechFez78") == "https://docs.google.com/document/d/1Y1tv3ywi60r0F1733F2JryiQQ_GYcED8oY2-9Ed7StY/edit"
    assert server.resolve_program_download_url("tourMarrakechErg45") == "https://docs.google.com/document/d/1YrWhiqA8ouE3TrkKR7EglyYWe8OEkbV0jKlPLvjtXPI/edit"
    assert server.resolve_program_download_url("tourAtlasDesierto67") == "https://docs.google.com/document/d/1eJPTNRfdrp5p7kN5oMnM4TXsuF9QJum6wJHAVIdAyuY/edit"
    assert server.resolve_program_download_url("tourEnduroAventura34") == "https://docs.google.com/document/d/1O9JhiU5pPLsue68Nticyx0-rNKWlIiAji0pF_Tkwkf8/edit"
    assert server.resolve_program_download_url("tourEnduroAventura45") == "https://docs.google.com/document/d/1e--qkZu_fnGfr9hq6DHjMdeL_N_f0m53mw4X86KZTNU/edit"
    assert server.resolve_program_download_url("tourMarrakechLoop23") == server.resolve_program_download_url("tourEscapadaRakErgRak23")
    assert server.resolve_program_download_url("tourCiudadesImperiales45").endswith("1JpsTiSn45ud05VajtwSz2SU9YY1Cmr2wAEy1B9qzt1Q/edit")
    assert server.resolve_program_download_url("tourCiudadesImperiales56").endswith("16QzcwzSHE-DfDYnwWWRepQirSXqHGHhlmN5vGfjXfTg/edit")
    assert server.resolve_program_download_url("tourCiudadesImperialesRif67").endswith("1LSKa8cdm_w60MX4dBssVC87fc-95RrTU4FoKfIRFdgo/edit")
    assert server.resolve_program_download_url("tourCiudadesImperialesRif78").endswith("1EdUlrDLILdjcizcCwNMQQs8NJ_hAKisXqL2JcFaZDxE/edit")


@pytest.mark.parametrize("route_id,document_id", [
    ("tourMarrakechFez67", "1REEThN6fgObQe-LAu70_QMN9YArKQLTdVIruY84cHRs"),
    ("tourFezRak67", "1Z5GTSji0ut67F7WQUn2upB99vBRNhEySt4nn9vqzeiE"),
    ("tourMarrakechErg56", "1kgxIqzPPfgSYrR_RlH7xveNHqiLqch1R_usOMh7htGA"),
    ("tourFezSidialiOzz56", "1AEMUMuSNXrUZUVsTeJ_4wvxeeFzKw3WndBHzZL2qBds"),
    ("tourFezSidialiOzz67", "1AHc9pDZkEACX3nzvPxS2d2oTVNNFr0zMtZ4HjOHyFn0"),
    ("tourFezSidialiOzz78", "1gZVfkxxQLwGN_Gcy9nzZp0dWXo78yh9UMyh_g5O0lbg"),
    ("tourOzzSidialiFez56", "1iId9gFwAcpDuszQg8ypFF_jKXl_RVw1FiBsewb_-lWs"),
    ("tourOzzSidialiFez67", "1_iI8i4lB04oHSrXR2LCnYzhWfjTTLOXaFC2eAyWCvwE"),
    ("tourOzzSidialiFez78", "1r03BAxzkCn4u7XNKqsQHHT9ko_jIF8UsK14hTZnAnME"),
])
def test_confirmed_gran_sur_and_ancestral_program_links(route_id, document_id):
    assert server.resolve_program_download_url(route_id) == f"https://docs.google.com/document/d/{document_id}/edit"


def test_all_assigned_documents_are_drive_links():
    assert len(server.PROGRAM_DOWNLOAD_LINKS) == 66
    assert all(url.startswith("https://docs.google.com/document/d/") for url in server.PROGRAM_DOWNLOAD_LINKS.values())


def test_ambiguous_or_unconfirmed_routes_keep_existing_fallback():
    for route_id in (
        "tourCiudadesImperiales67",  # Supplied row 69 says 5 nights, page says 6.
    ):
        assert route_id not in server.PROGRAM_DOWNLOAD_LINKS
        assert server.resolve_program_download_url(route_id) == server.DEFAULT_PROGRAM_DOWNLOAD_URL
