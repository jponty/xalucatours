"""Keep every roulette discount explicitly and exclusively scoped to the spa."""

import re
import unicodedata


DISCOUNT_POLICY_MESSAGE = (
    "Los descuentos de la ruleta deben ser exclusivos del spa. "
    "Indica Spa en el nombre y la etiqueta corta de cada idioma, "
    "sin incluir reservas, alojamiento, restauración ni otros servicios."
)
_DISCOUNT = re.compile(r"%|\b(?:descuent\w*|rebaj\w*|discount\w*|off|reduc\w*|remise\w*)\b")
_SPA = re.compile(r"\bspa\b")
_OTHER_SERVICES = re.compile(
    r"\b(?:reserv\w*|booking\w*|alojamiento\w*|hebergement\w*|accommodation\w*|"
    r"habitacion\w*|chambre\w*|room\w*|estancia\w*|stay\w*|sejour\w*|"
    r"restaur\w*|cena\w*|diner\w*|dinner\w*|meal\w*|repas|"
    r"viaje\w*|trip\w*|voyage\w*|excursion\w*|quad\w*|dromedar\w*|camel\w*)\b"
)
_LEGACY_BOOKING_DISCOUNT = {
    "es": "10% de descuento en una futura reserva",
    "en": "10% off a future booking",
    "fr": "10% de réduction sur une future réservation",
}


def normalize_legacy_contest_prize(prize):
    """Upgrade the original seeded discount without changing its identity/odds.

    Operates on current contest prizes only, never historical participant
    records. Returning a copy also leaves cached/persisted records untouched.
    """
    if prize.get("label") != _LEGACY_BOOKING_DISCOUNT:
        return prize
    return {
        **prize,
        "label": {
            "es": "10% de descuento en tratamientos de Spa",
            "en": "10% off Spa treatments",
            "fr": "10% de réduction sur les soins Spa",
        },
        "short": {lang: "−10% Spa" for lang in ("es", "en", "fr")},
    }


def _texts(value):
    values = value.values() if isinstance(value, dict) else [value]
    return [str(text).strip() for text in values if text and str(text).strip()]


def _fold(text):
    return "".join(char for char in unicodedata.normalize("NFD", text.lower()) if not unicodedata.combining(char))


def contest_prize_policy_error(prize):
    """Return a readable admin error, or None for an eligible prize.

    Non-discount gifts are unaffected. Every supplied translation/short label
    of a discount must mention Spa; a translated generic discount cannot hide
    behind a correct Spanish label.
    """
    labels = _texts(prize.get("label"))
    shorts = _texts(prize.get("short"))
    texts = [_fold(text) for text in labels + shorts]
    if not any(_DISCOUNT.search(text) for text in texts):
        return None
    if not labels or any(not _SPA.search(text) or _OTHER_SERVICES.search(text) for text in texts):
        return DISCOUNT_POLICY_MESSAGE
    return None
