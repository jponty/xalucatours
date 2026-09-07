#!/usr/bin/env python3
"""Validate the reusable Xaluca Tours Resend Broadcast source."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent
HTML_PATH = ROOT / "xaluca-travel-broadcast.html"
TEXT_PATH = ROOT / "xaluca-travel-broadcast.txt"


def fail(message: str) -> None:
    print(f"ERROR: {message}")
    raise SystemExit(1)


def main() -> None:
    html = HTML_PATH.read_text(encoding="utf-8")
    text = TEXT_PATH.read_text(encoding="utf-8")
    combined = html + "\n" + text

    required_tokens = (
        "{{{contact.first_name|viajero}}}",
        "{{{RESEND_UNSUBSCRIBE_URL}}}",
        "https://xalucatravel.com/planifica-tu-viaje",
        "https://xalucatravel.com/archivo",
        "Xaluca Tours",
    )
    for token in required_tokens:
        if token not in combined:
            fail(f"falta el elemento obligatorio: {token}")

    local_url = re.search(r"https?://(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?", combined, re.I)
    if local_url:
        fail(f"se ha encontrado una URL local: {local_url.group(0)}")

    if html.count("<!-- EDITAR:") < 8:
        fail("faltan marcadores EDITAR para mantener el template reutilizable")

    image_urls = re.findall(r'<img[^>]+src="(https://[^"]+)"', html, re.I)
    if len(image_urls) < 3:
        fail("el template debe incluir una imagen principal y dos propuestas visuales")

    if "@media screen and (max-width: 640px)" not in html:
        fail("faltan estilos responsive para mobile")

    print("OK: template HTML y versión de texto preparados para Resend Broadcasts.")
    print(f"OK: {len(image_urls)} imágenes HTTPS y {html.count('<!-- EDITAR:')} bloques editables validados.")


if __name__ == "__main__":
    main()
