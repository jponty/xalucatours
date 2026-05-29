
## Global Edit-Text rollout — Phase 1: ProgramTemplate (Feb 2026)
- Instrumented shared `ProgramTemplate.jsx` (56 itinerary pages) so EVERY visible text is editable in Edit-Text mode.
- Two helpers added: `<L k>` = global UI label (slot `program-ui.<k>`, one edit applies to all program pages); `<C name>` = per-page content (auto-slot `<page>.program.<name>`); `<G k defaults>` for shared season data.
- Covered: hero (eyebrow, duration, place, title, subtitle, quick stats, CTAs, scroll), description (overline, title, paragraphs), quick info (overline/title, 5 cards), day blocks (day label, title, body, wellness, culture), itinerary header, pricing (all labels + season label/months), details accordion (overline/title, tab labels, all list items), contact band (all labels/CTAs).
- StickyNav left out (in-page anchor nav; labels duplicate editable section titles; contentEditable risks scroll).
- Verified by testing agent (iteration_16): 165 editable surfaces on one program page; content + global edits persist via PUT /api/text_slots (200) and survive reload. Frontend 95%. Test seed slots cleaned up.
- Note (pre-existing, out of scope): in-page language pill on program pages lacks data-testid='lang-*' and switching behavior is unclear.

## Global Edit-Text rollout — Phase 2: ItineraryHubPage (Feb 2026)
- Instrumented shared `ItineraryHubPage.jsx` (16 hub pages) — all visible text now editable in Edit-Text mode.
- Helpers <L>/<C>/<G> mirror ProgramTemplate. Hero text passed as editable nodes into the shared JourneyHero; community band passed as editable nodes into CommunityCta (no change needed to those shared components — they render nodes).
- Covered: hero (eyebrow/place/title/subtitle/CTAs/scroll), opposite-hub toggle label, intro (overline/title/paragraphs), options (overline/title/body/group labels/card blurbs/nights/cta_card), community band (all labels/CTAs). StickyNav anchor labels left out (consistency with Phase 1).
- Verified by testing agent (iteration_17): 63 editable surfaces (Marrakech hub) / 70 (Gransur hub); per-page + global edits persist via PUT 200 and survive reload; navigation regression OK. Frontend 100%. Test slots cleaned up.
- Progress: Phases 1+2 cover 72 of ~96 pages. Remaining: Phase 3 (key standalone pages), Phase 4 (region/thematic pages — will instrument shared JourneyPageSections sections), Phase 5 (remaining shared components: footer, menus, forms, tooltips).

## Pexels bulk image fill — Phase 1 (cards + hub heroes) (Feb 2026)
- New backend endpoint POST /api/pexels/bulk-fill: imports contextually-relevant Pexels photos into many image slots at once. One Pexels API search per UNIQUE query (image downloads from images.pexels.com don't count against API rate limit); distinct photos spread across slots sharing a query. Stores RELATIVE /api/files/... URLs (host-independent) + alt + alt_i18n + photographer attribution. Overwrites by default (force=true).
- storage.put_object now retries on transient 5xx (+ existing 403 key refresh).
- Filled (all Morocco destination-specific queries): 40 trip catalog cards (home.all-trips.*) + 40 planner reco covers (plan-recos.*.cover) + 11 itinerary-hub heroes (<page>.hero.bg). 91 images total, verified loading (0 broken) on home grid + hub hero (e.g. Marrakech Koutoubia dusk).
- JourneyHero (JourneyPageSections.jsx) converted from raw <img> to <EditableImage slot=`<page>.hero.bg`> — makes hub & region heroes CMS-editable AND bulk-fillable. fallback={image} preserves prior behavior until a slot is set.
- Scripts: /app/scripts/pexels_fill_phase1_cards.py , /app/scripts/pexels_fill_phase1_heroes.py (call bulk-fill via localhost:8001 to bypass ingress timeout on long batches).
- NOTE: external ingress returns 403 on long POSTs to bulk-fill — run batches server-side via localhost:8001.

### Remaining image-fill batches (P1/P2)
- Region/landing page heroes (Sur, Norte, Aventura, Escapadas, Marruecos, QueVer, etc.) via the now-editable JourneyHero slot `<page>.hero.bg` + any custom hero slots (sur.hero, atlas-desierto.hero...).
- Home section/module images (TravelCategories, OurTrips carousel, MoroccoCircuits, MapSection, testimonials, etc.).
- 56 program itineraries: hero (program hero uses EditableImage slot `<page>...`), per-day gallery images, quick-info — largest batch, throttle by Pexels 200/hr.


## Smart image loading — flicker-free / shimmer / fade-in (Feb 2026)
- **User mandate**: eliminate the visible fallback→definitive image swap, any black placeholder, and layout shifts (CLS). Show a neutral shimmer skeleton while the final image preloads, then fade/blur-to-sharp; lazy-load off-viewport, eager-load critical heroes; fallback shown ONLY if the real image truly fails.
- **Central change in `components/EditableImage.jsx`** (all site imagery flows through it):
  - New global `imgCache` (mirrors `<EditableText>` coordinator): one bulk `GET /api/slots` fetch hydrates a `slot_id → {url, cleared, alt_i18n}` map + subscriber notify. `EditableImage` now reads its definitive URL synchronously from the cache instead of doing a per-component `/api/slots/{slot}` fetch → no fallback flash; on SPA navigation the cache is already warm so images render their definitive URL on first paint.
  - New `<SmartImage>` renderer (replaces `ImageOrPlaceholder`): while `ready===false` shows a `.cms-skeleton` shimmer box (warm `#EDE5D5`, never black) sized to the exact aspect-ratio (no CLS); once ready, renders the `<img>` with `.cms-img-fade` (opacity 0 + blur 12px + scale 1.015) → `.is-loaded` on load (fade/blur-to-sharp). Error recovery: tries the code fallback only if the definitive image errors, then `EmptyState` ("Sin imagen"). Session-level `loadedUrls` Set renders previously-loaded URLs instantly. Cached-image race guarded via a `useEffect` re-checking `img.complete && naturalWidth>0`.
  - `loading="lazy"` + `decoding="async"` by default; new `priority` prop → `loading="eager"` + `fetchPriority="high"` (wired on `JourneyHero` and `ProgramTemplate` hero).
  - `data-cms-image-slot` + `data-cms-alt` preserved on every render path (img/skeleton/empty) so the /admin Pexels-fill button keeps detecting slots.
- **Backend**: `GET /api/slots` list now also returns `cleared` + `alt_i18n` (parity with the per-slot endpoint) so the bulk cache is complete.
- **CSS** (`index.css`): `@keyframes cms-shimmer`, `.cms-skeleton`, `.cms-img-fade`/`.is-loaded`, with `prefers-reduced-motion` fallback.
- **Verified** by testing agent (iteration_19): 100% frontend, 0 bugs across /, /viajes, /viajes/surdemarruecos, /viajes/marruecos, a program page — 0 broken images, 0 black placeholders, 0 stuck-invisible images; skeletons resolve on scroll; hero sharp; image Edit Mode (134 overlays) + /admin Pexels fill (36 slots detected) still work.
- **Backlog note**: `EditableImage.jsx` is now ~1550 lines — split `SmartImage`/`imgCache`/`EditModal`/`LivePreview` into modules in a future refactor.
