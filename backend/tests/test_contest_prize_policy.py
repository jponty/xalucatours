import asyncio
from copy import deepcopy
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException

import server
from contest_prize_policy import contest_prize_policy_error, normalize_legacy_contest_prize
from export_supabase_images import public_contest


def legacy_prize():
    return {
        "id": "legacy-discount", "enabled": True, "weight": 14, "awarded": 3,
        "max_wins": 20, "color": "#7A4A32", "is_grand": False,
        "label": {"es": "10% de descuento en una futura reserva", "en": "10% off a future booking", "fr": "10% de réduction sur une future réservation"},
        "short": {lang: "−10%" for lang in ("es", "en", "fr")},
    }


def contest_with(prizes):
    return {"id": "test-contest", "slug": "test", "active": True, "name": {"es": "Ruleta"}, "prizes": prizes}


def test_default_discounts_are_spa_only_without_changing_other_gifts_or_odds():
    prizes = server._default_contest_prizes()
    assert len(prizes) == 15
    assert [p["weight"] for p in prizes] == [5, 5, 20, 8, 4, 6, 4, 18, 14, 9, 6, 10, 2, 1.5, 0.2]
    assert all(contest_prize_policy_error(p) is None for p in prizes)
    discounts = [p for p in prizes if "%" in p["label"]["es"]]
    assert len(discounts) == 2
    for p in discounts:
        for lang in ("es", "en", "fr"):
            assert "Spa" in p["label"][lang]
            assert "Spa" in p["short"][lang]
    assert "Cena" in prizes[6]["label"]["es"]
    assert "Estancia gratuita" in prizes[13]["label"]["es"]


@pytest.mark.parametrize("label,short", [
    ("10% de descuento", "−10%"),
    ("10% de descuento en alojamiento", "−10% Spa"),
    ("10% de descuento en restauración", "−10% Spa"),
    ("10% de descuento en Spa y alojamiento", "−10% Spa"),
    ("10% off future bookings", "−10% Spa"),
    ("15% off Spa and meals", "−15% Spa"),
    ("10% de réduction sur une réservation", "−10% Spa"),
    ("Remise sur les séjours et le Spa", "Spa"),
    ("10% de descuento en tratamientos de Spa", "−10%"),
])
def test_rejects_generic_non_spa_and_ambiguous_discount_labels(label, short):
    assert contest_prize_policy_error({"label": {"es": label}, "short": {"es": short}})


def test_checks_each_translation_independently():
    prize = normalize_legacy_contest_prize(legacy_prize())
    prize["label"]["en"] = "10% off future bookings"
    assert contest_prize_policy_error(prize)


def test_legacy_compatibility_preserves_identity_odds_limits_and_input():
    old = legacy_prize()
    original = deepcopy(old)
    new = normalize_legacy_contest_prize(old)
    assert old == original
    assert {k: v for k, v in new.items() if k not in ("label", "short")} == {
        k: v for k, v in old.items() if k not in ("label", "short")
    }
    assert new["label"]["es"] == "10% de descuento en tratamientos de Spa"
    assert contest_prize_policy_error(new) is None
    assert normalize_legacy_contest_prize(new) == new


def test_live_display_export_and_selection_use_same_eligible_prizes():
    valid = server._default_contest_prizes()[2]
    invalid = {**valid, "id": "invalid", "label": {"es": "20% de descuento en cenas"}, "short": {"es": "−20%"}}
    contest = contest_with([valid, invalid, legacy_prize()])
    live = server._public_contest(contest)
    exported = public_contest(contest)
    assert live["prizes"] == exported["prizes"]
    assert [p["id"] for p in live["prizes"]] == [valid["id"], "legacy-discount"]
    assert "Spa" in live["prizes"][1]["short"]["es"]
    only_legacy = contest_with([legacy_prize()])
    assert server._pick_weighted_prize(only_legacy)["label"]["es"] == "10% de descuento en tratamientos de Spa"
    assert server._pick_weighted_prize(contest_with([invalid])) is None


def test_admin_rejects_new_generic_discounts_without_writing(monkeypatch):
    collection = SimpleNamespace(find_one=AsyncMock(return_value=contest_with([])), update_one=AsyncMock())
    monkeypatch.setattr(server, "db", SimpleNamespace(contests=collection))
    monkeypatch.setattr(server, "_require_admin", lambda token: None)
    payload = server.ContestUpdatePayload(prizes=[legacy_prize()])
    with pytest.raises(HTTPException) as error:
        asyncio.run(server.admin_update_contest("test-contest", payload, "test"))
    assert error.value.status_code == 422
    assert "exclusivos del spa" in error.value.detail
    collection.update_one.assert_not_awaited()


def test_admin_can_save_corrected_prize_preserving_awarded_count(monkeypatch):
    old = legacy_prize()
    collection = SimpleNamespace(find_one=AsyncMock(return_value=contest_with([old])), update_one=AsyncMock())
    monkeypatch.setattr(server, "db", SimpleNamespace(contests=collection))
    monkeypatch.setattr(server, "_require_admin", lambda token: None)
    corrected = asyncio.run(server.admin_get_contest("test-contest", "test"))
    payload = server.ContestUpdatePayload(prizes=corrected["prizes"])
    asyncio.run(server.admin_update_contest("test-contest", payload, "test"))
    saved = collection.update_one.await_args.args[1]["$set"]["prizes"][0]
    assert saved["awarded"] == 3
    assert saved["weight"] == 14
    assert "Spa" in saved["label"]["es"]


def test_spin_stores_and_emails_only_the_spa_discount(monkeypatch):
    contest = contest_with([legacy_prize()])
    participants = SimpleNamespace(find_one=AsyncMock(return_value=None), insert_one=AsyncMock(), update_one=AsyncMock())
    contests = SimpleNamespace(find_one=AsyncMock(return_value=contest), update_one=AsyncMock())
    monkeypatch.setattr(server, "db", SimpleNamespace(contests=contests, contest_participants=participants))
    mails = []
    def winner(*args):
        mails.append(args[2])
        return "test-winner-id"
    def team(subject, *args):
        mails.append(subject)
        return "test-team-id"
    monkeypatch.setattr(server, "send_contest_prize_email", winner)
    monkeypatch.setattr(server, "send_lead_notification", team)
    payload = server.ContestSpinPayload(contest_id="test-contest", first_name="Test", last_name="User", email="test@example.com")
    result = asyncio.run(server.contest_spin(payload))
    assert result["prize_index"] == 0
    assert result["prize"]["label"]["es"] == "10% de descuento en tratamientos de Spa"
    assert len(mails) == 2
    assert all("10% de descuento en tratamientos de Spa" in text for text in mails)
    stored = participants.insert_one.await_args.args[0]
    assert stored["prize_id"] == "legacy-discount"
    assert stored["prize_label"] == result["prize"]["label"]
