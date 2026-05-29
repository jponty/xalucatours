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
ALLOW='components/EditableImage\.jsx|components/EditableImageMeta\.jsx|pages/AdminPage\.jsx|pages/ImageEditorPage\.jsx|lib/imageBank\.js'

# Grep every JSX/JS file for "<img " and filter out the allow-list.
VIOLATIONS=$(grep -rn '<img ' --include='*.jsx' --include='*.js' "$ROOT" \
              | grep -vE "$ALLOW" || true)

if [ -n "$VIOLATIONS" ]; then
  echo "❌ Found raw <img> tags outside the allow-list — use <EditableImage> instead:"
  echo ""
  echo "$VIOLATIONS"
  echo ""
  echo "Why this matters:"
  echo "  Every visible image must be editable through the global Edit Mode."
  echo "  Replace the raw <img> with:"
  echo ""
  echo "    <EditableImage"
  echo "      slot=\"page.section.id\"      (or name=\"local\" inside a <SlotScope>)"
  echo "      fallback={IMG.someKey}"
  echo "      alt=\"description\""
  echo "      aspectRatio=\"16/9\""
  echo "      className=\"...\""
  echo "    />"
  echo ""
  exit 1
fi

echo "✅ All <img> tags are inside the allow-list (CMS / admin / editor only)."
