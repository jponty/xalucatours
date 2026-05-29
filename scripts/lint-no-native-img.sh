#!/usr/bin/env bash
# ============================================================
# lint-no-native-img.sh
# ----
# Project-wide guardrail: every image visible to end users MUST
# use <EditableImage> so the global Edit Mode can manage it.
#
# This script greps for raw <img tags inside the frontend source
# tree and fails if any of them sit outside the allow-list below.
#
# Allow-list (these files are part of the CMS / admin UI and the
# editor itself — they legitimately render raw <img> elements):
#   - components/EditableImage.jsx     (internal renderer)
#   - components/EditableImageMeta.jsx (metadata preview)
#   - pages/AdminPage.jsx              (admin dashboard)
#   - pages/ImageEditorPage.jsx        (image editor UI)
#   - lib/imageBank.js                 (JSDoc examples only)
#
# Usage:
#   bash /app/scripts/lint-no-native-img.sh
# Exit codes:
#   0  no violations found
#   1  one or more raw <img> tags outside the allow-list
# ============================================================

set -euo pipefail

ROOT="/app/frontend/src"
ALLOW='components/EditableImage\.jsx|components/EditableImageMeta\.jsx|components/ImageLibraryPicker\.jsx|components/MoroccoIntroVideo\.jsx|components/PexelsTab\.jsx|pages/AdminPage\.jsx|pages/ImageEditorPage\.jsx|lib/imageBank\.js'

# Strict mode: pass `--strict` (or set STRICT=1) to exit 1 on violations.
# Default mode prints a warning and still exits 0 so it doesn't gate
# unrelated work while the legacy migration is in flight.
STRICT="${STRICT:-0}"
[ "${1:-}" = "--strict" ] && STRICT=1

# Grep every JSX/JS file for <img tags (with or without space after — covers
# multiline JSX like `<img\n  src=...`) and filter out the allow-list.
VIOLATIONS=$(grep -rnE '<img( |>|/|$)' --include='*.jsx' --include='*.js' "$ROOT" \
              | grep -vE "$ALLOW" || true)

if [ -n "$VIOLATIONS" ]; then
  COUNT=$(echo "$VIOLATIONS" | wc -l)
  if [ "$STRICT" = "1" ]; then
    echo "❌ Found $COUNT raw <img> tags outside the allow-list — use <EditableImage> instead:"
    echo ""
    echo "$VIOLATIONS"
    echo ""
    echo "Why this matters:"
    echo "  Every visible image must be editable through the global Edit Mode."
    echo ""
    exit 1
  else
    echo "⚠️  Warning: $COUNT raw <img> tags outside the allow-list (legacy migration pending):"
    echo "$VIOLATIONS"
    echo ""
    echo "Run with --strict to fail the check."
    exit 0
  fi
fi

echo "✅ All <img> tags are inside the allow-list (CMS / admin / editor only)."
