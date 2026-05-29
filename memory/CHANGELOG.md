
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
