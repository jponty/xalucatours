"""Render local customer-email previews without sending emails or writing leads.

Run from the repository: .venv/bin/python backend/email_templates/preview_confirmations.py
"""
import html
from pathlib import Path
import sys
import tempfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server


def main():
    output = Path(tempfile.mkdtemp(prefix="xaluca-email-preview-"))
    def capture(params, **kwargs):
        content = params["html"]
        for attachment in params.get("attachments", []):
            cid = attachment.get("content_id")
            if cid:
                content = content.replace(f"cid:{cid}", f'data:image/png;base64,{attachment["content"]}')
        flow = params["tags"][0]["value"]
        page = (
            '<!doctype html><html lang="es" dir="ltr"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{html.escape(params["subject"])}</title></head><body style="margin:0">'
            f'{content}</body></html>'
        )
        (output / f"{flow}.html").write_text(page, encoding="utf-8")
        (output / f"{flow}.txt").write_text(params["text"], encoding="utf-8")
        return "local-preview-only"
    server._send_resend_email = capture
    server.send_client_confirmation("preview@example.com", "Ana", summary_rows=[("Viaje", "Marruecos a medida")])
    server.send_contest_prize_email("preview@example.com", "Ana", "Experiencia Spa")
    server.send_feedback_review_followup("preview@example.com", "Ana", "Marruecos", 5, "Una experiencia inolvidable.")
    print(output)


if __name__ == "__main__":
    main()
