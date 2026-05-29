
## Standardised pricing system (placeholder) (Feb 2026)
- **User mandate**: every itinerary page needs a dedicated 2-season (High/Low) × traveller-tier (2/3/4) pricing table for the "Accommodation & Excursions · 4x4" package + season definitions + occupancy note; every trip card/listing/featured/related/overview/planner-reco/upcoming must show "From €790 per person" (lowest configured). Prices placeholder now, stored centrally AND editable from /admin ("on both sides"), updatable globally with no page/design changes.
- **Centralised config** `lib/pricing.js`: `DEFAULT_PRICING` (tiers 2p:1010/1085, 3p:865/920, 4p:790/835; trilingual labels, season defs, note), `getFromPrice` (min across tiers→€790), `fmtEuro`, `mergePricing`. `lib/pricingStore.js`: bulk-loads `/api/pricing` once + `usePricing()` hook + `setPricingOverride`.
- **Backend** `server.py`: `GET /api/pricing` (DB override doc or {}), `PUT /api/pricing` (admin-token protected, validates tiers via PricingPayload/PricingTier, upserts config doc). Pytest `tests/test_pricing.py` 4/4.
- **Components**: `PricingSection.jsx` (dedicated dark section, table + season chips + note + From + CTA; used by `ProgramTemplate` replacing the old 4-season block) and `FromPrice.jsx` (universal "Desde €790 por persona" label, tones light/dark/plain).
- **From-price wired into** every rendered surface: HomeAllTripsCatalog, ItineraryHubPage program cards, JourneyPageSections ItineraryBlock + ItinerariesOverview, ToursLandingPage region/trip/proxima cards, PlanificaTuViajePage RecoCard, ProximasSalidasPage departure cards. (FeaturedJourneys also wired but that component is currently unused/unrendered.)
- **Admin**: new "Precios" tab in `/admin` (PricingEditor) — edit people/low/high matrix, auto "Desde" preview, Save → PUT (Bearer token) → updates live store + reloads preview.
- **Verified**: backend pytest 4/4 + testing agent iteration_21 (backend 100%). Program pricing section perfect (3 tiers, 7 high-season chips, note, From €790, sticky-nav anchor). Trilingual ES/EN/FR localises section + From label. Admin editor saves & previews. From labels confirmed on: home catalog (40), hub program cards (3 on /viajes/sur/desierto_atlas), region/trip/proxima cards, itinerary blocks (4), overview cards (4), planner recos (14 after region select), departures. (testing agent's 3 "missing" flags were test-navigation artifacts — invalid hub URL + region not selected + unused FeaturedJourneys.)


## Responsive images + WebP/AVIF proxy + lazy optimization (Feb 2026)
- **User mandate**: responsive delivery (srcset/sizes), modern formats (WebP/AVIF), comprehensive lazy loading with eager/high-priority hero (LCP), no flicker / no CLS / no placeholder flashes.
- **Backend** (`server.py` `GET /api/files/{path}`): optional `?w=<width>&fmt=auto|webp|avif`. Pillow downscales (LANCZOS, never upscale) + converts (`fmt=auto`→WebP when `Accept: image/webp`, else AVIF; explicit `avif` uses speed=6). Variants are content-addressed and **disk-cached** in `backend/img_cache/` (cache-hit ~0.1s); served with `Cache-Control: public, max-age=31536000, immutable`. No-param requests = original bytes (zero regression). Width snapped to buckets [320…2400] to maximise cache hits. Pillow 12.2 has native WebP+AVIF.
- **Frontend** `lib/imageUrl.js`: `optimizedSrc`/`buildSrcSet`/`defaultSizes`/`isOptimizable` — Unsplash (`auto=format` negotiates WebP/AVIF + `w`), Pexels (`auto=compress`+`w`), and our `/api/files` proxy (`w`+`fmt=auto`). Skips data:/.svg/.gif/unknown hosts.
- **`SmartImage`** (in `EditableImage.jsx`): renders `src=optimizedSrc(currentSrc, priority?1920:960)` + `srcSet=buildSrcSet(...)` + `sizes` (priority→100vw, else card heuristic). `src` is ALWAYS set (never withheld) with native `loading="lazy"` (browser's intersection-based loader); `priority` → `eager` + `fetchPriority="high"` for hero/LCP. Keeps shimmer skeleton + blur-to-sharp fade + cached-image guard + `data-cms-image-slot`/`data-cms-alt`.
  - NOTE: an experimental manual IntersectionObserver that *withheld* `src` was tried and **reverted** — withholding src collapses no-dimension images to 0px (0 area → IO threshold never fires → never load). Native lazy avoids this and is more efficient. A custom IO prefetch was also dropped to avoid double-downloads with `srcset`.
- **Measured**: a 300KB JPEG → 22KB WebP at w=640 (~93% smaller); program hero WebP 136KB vs 183KB JPEG.
- **Verified** by testing agent (iteration_20): 100% frontend, 0 bugs across home/viajes/sur/marruecos/program — 130+ imgs with srcset, /api/files imgs carry `w=&fmt=auto`, WebP served (Content-Type image/webp), 0 broken / 0 stuck / 0 black / no collapse on scroll, hero eager+fp=high at w=1920; Edit Mode (134 overlays) + /admin Pexels fill still work.
- **Known preview-only limitation**: the preview ingress/Cloudflare overrides `Cache-Control` to `no-store` for all `/api/*` (backend sends the correct immutable header on :8001). Browser long-term caching is weaker in preview but the backend disk cache keeps re-fetches ~0.1s; production (user-controlled headers) will honour the immutable cache.


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
