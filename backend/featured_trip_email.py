"""Shared, configurable customer-only email block. No network calls or sending."""

import html
import json
import logging
from pathlib import Path
from urllib.parse import urlsplit


CONFIG_PATH = Path(__file__).parent / "email_templates" / "featured-trip.json"
logger = logging.getLogger(__name__)


def render_featured_trip(lang, public_site_link):
    """Return (HTML table row, plain text); a bad promotion must not block a lead."""
    try:
        config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        if not config.get("enabled"):
            return "", ""
        locales = config["locales"]
        copy = locales.get(lang, locales["es"])
        fields = ("label", "name", "description", "image_alt", "cta", "path")
        if any(not isinstance(copy.get(key), str) or not copy[key].strip() for key in fields):
            raise ValueError("Incomplete featured trip copy")
        path = copy["path"]
        if not path.startswith("/") or path.startswith("//") or "\\" in path:
            raise ValueError("Featured trip must use a local page path")
        image_url = config["image_url"]
        image = urlsplit(image_url)
        if image.scheme != "https" or not image.hostname:
            raise ValueError("Featured trip image must be a public HTTPS URL")
        url = public_site_link(path)
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        logger.warning("Featured trip email configuration invalid; omitting optional block")
        return "", ""

    safe = {key: html.escape(copy[key], quote=True) for key in fields}
    href = html.escape(url, quote=True)
    src = html.escape(image_url, quote=True)
    block = (
        '<tr><td style="padding:0 24px 28px">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
        'style="width:100%;border-collapse:collapse;background:#FAF6EF">'
        '<tr><td style="padding:20px 20px 14px;color:#8A492F;font-family:Arial,Helvetica,sans-serif;'
        'font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">'
        f'{safe["label"]}</td></tr>'
        f'<tr><td><a href="{href}" style="text-decoration:none">'
        f'<img src="{src}" alt="{safe["image_alt"]}" width="552" border="0" '
        'style="display:block;width:100%;max-width:552px;height:auto;border:0"></a></td></tr>'
        '<tr><td style="padding:22px 20px 24px">'
        f'<h2 style="margin:0 0 12px;color:#2C2621;font-family:Georgia,serif;font-size:25px;'
        f'font-weight:normal;line-height:1.25">{safe["name"]}</h2>'
        f'<p style="margin:0 0 20px;color:#5C5248;font-family:Arial,Helvetica,sans-serif;'
        f'font-size:16px;line-height:1.6">{safe["description"]}</p>'
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
        '<td align="center" bgcolor="#2C2621" style="border-radius:30px;mso-padding-alt:15px 22px">'
        f'<a href="{href}" style="display:inline-block;box-sizing:border-box;padding:15px 22px;'
        'border:1px solid #2C2621;border-radius:30px;background:#2C2621;color:#FFFFFF;'
        'font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;font-weight:bold;'
        f'text-decoration:none;text-align:center;mso-padding-alt:0">{safe["cta"]}</a>'
        '</td></tr></table></td></tr></table></td></tr>'
    )
    text = f'{copy["label"]}\n{copy["name"]}\n{copy["description"]}\n{copy["cta"]}: {url}'
    return block, text


def email_plain_text(markup):
    """Text alternative for the existing confirmation content (before the promo)."""
    import re

    text = re.sub(r"<br\s*/?>|</(?:p|div|tr|h[1-6])\s*>", "\n", markup, flags=re.I)
    text = re.sub(r"</td\s*>", " · ", text, flags=re.I)
    text = html.unescape(re.sub(r"<[^>]+>", "", text))
    return "\n".join(line.strip(" ·\t") for line in text.splitlines() if line.strip(" ·\t"))
