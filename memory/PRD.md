# Xaluca Tours — PRD

## Original Problem Statement
Build "Xaluca Tours", a Moroccan travel agency front. Trilingual (ES default, EN, FR), MongoDB-backed contact, premium cinematic UI inspired by Grup Xaluca (glassmorphism, desert tones, serif typography, berber patterns, ken-burns + film grain).

## Architecture
- React 19 + Tailwind v3 + Shadcn UI · FastAPI · MongoDB
- Trilingual via `LanguageContext` + `lib/routes.js`. ES at root, EN under `/en/*`, FR under `/fr/*`.
- 3-tier navigation hierarchy:
  - **Region landing pages** (`/viajes/marruecos`, `/viajes/surdemarruecos`, etc.)
  - **Hub pages** intermediate, listing duration variants (`/viajes/sur/atlas_desierto`, `/viajes/gransur/fez-rak`, etc.) — powered by `components/ItineraryHubPage.jsx`
  - **Program detail pages** day-by-day — powered by `components/ProgramTemplate.jsx`

## Implemented (Feb 2026)

### Inline CMS — Image & Text editing
- Two mutually-exclusive admin modes triggered from the header:
  • Image edit (`<ImagePlus>` icon) — opens `<EditableImage>` overlays
  • Text edit (`<Type>` icon) — turns every `<EditableText>` into contenteditable
- Navigation is fully locked while either mode is active (capture-phase JS guard
  + CSS `pointer-events:none` lockdown on `<a>` + Portal-rendered editor panel).
- **Image editor** is a slide-in side panel (`createPortal` to `<body>`):
  - Aspect-ratio selector chip group; "Placeholder" preset highlighted as recommended
  - Smart objectFit (vertical/horizontal-cover) → cropped frame always filled
  - Drag + zoom + rotation (continuous slider + 90° quick action)
  - CSS-based live final-preview at placeholder ratio (no canvas redraw lag)
  - Bulk upload: drop N files → distributed across the gallery's sibling slots
  - Save-all button for batched persistence
  - High-quality output (2400 px JPEG @ 0.94)
- **Text editor** wraps every key piece of copy in `<EditableText slot="…">`:
  - 29 slots wired so far across hero, emotional intro, and the 5 home category
    carousels (eyebrow / title / description × {south, full, short, north, upcoming})
  - Per-language storage in MongoDB `text_slots` (es / en / fr)
  - Save-on-blur, ESC to revert, plain-text paste, dirty-ring affordance
  - Bulk pre-fetch via `/api/text_slots` to hydrate without N round-trips
- Backend collections: `image_slots`, `text_slots`. Static `/api/uploads/*`.

- `/` — Home with 5 TravelCategory cards routing to regional pages
- `/viajes/marruecos` — 4 itinerary blocks + intro editorial + WhyXaluca pillars + CatalogTeaser + CommunityCta
- `/viajes/nortedemarruecos`
- `/viajes/surdemarruecos` — 4 itinerary blocks (Ouarzazate, Marrakech→ErgChebbi, Marrakech circular, Marrakech-Essaouira), each linking to its hub
- `/viajes/aventura`
- `/viajes/escapadas`
- `/viajesamedida`
- `/proximas_salidas`

### Hub pages (intermediate — duration variants)
- `/viajes/sur/atlas_desierto` (Atlas–Desierto, 6 programs)
- `/viajes/sur/marrakech_ergchebbi` (4 ida + 4 vuelta)
- `/viajes/marrakech_ergchebbi_marrakech` (3 circular)
- `/viajes/sur/marrakech_essaouira` (2 options)
- `/viajes/gransur/fez-rak` (4 ida + 4 vuelta)
- `/viajes/gransur/fez-sidiali-rak` (3 ida + 3 vuelta)
- `/viajes/gransur/ouarzazate-sidiali-fez` (3 ida + 3 vuelta)
- `/viajes/gransur/tanger-rak` (2 options)

### Program detail pages (universal `ProgramTemplate`)
- `/viajes/desierto_atlas/programa_6n_7d`, `_5n_6d`, `_4n_5d`
- `/viajes/atlas_desierto/programa_4n_5d`, `_5n_6d`, `_6n_7d`
- `/viajes/gransur/fez_marrakech/programa_9n_10d` (Feb 2026 — variant `frz`, 10-day cinematic itinerary)
- `/viajes/gransur/marrakech_fez/programa_6n_7d`, `_7n_8d`, `_8n_9d`, `_9n_10d` (Feb 2026 — variant `frm`, full reverse Gran Sur route)

### Reusable infrastructure (Feb 2026)
- `lib/programs/marrakechFezShared.js` — exported shared days (`DAY_FRM_ARRIVAL_LIGHT`, `DAY_FRM_MARRAKECH_MEDINA`, `DAY_FRM_MGOUN`, `DAY_FRM_DADES_TODRA_ERFOUD_LIGHT`, `DAY_FRM_SUNRISE_TOMBOUCTOU`, `DAY_FRM_RISSANI_RELAX_ONLY`) + shared excludes/notes/terms policy block (`SHARED_FRM_DETAILS`). Used by all 4 Marrakech→Fez programmes.
- `components/TripRouteMap.jsx` — global mini-map with the full programme route drawn as a polyline, one CircleMarker per day, hover/click sync with a numbered side rail (01→10), legend by stop type and total km estimator. Auto-renders after the hero when a program defines a `route` array.

### Hub cards now support per-card `link` prop
`ItineraryHubPage` falls back to the global contact CTA when a program has no `link`, but jumps directly to the program detail page when `link` is set. Wired: `fr-9-10`, `rf-6-7`, `rf-7-8`, `rf-8-9`, `rf-9-10` cards in `HUB_GRANSUR_FEZ_RAK`.

## Backlog / P1
- Build individual day-by-day pages for the new Marrakech↔ErgChebbi, Marrakech loop, Marrakech-Essaouira options (currently CTAs land on contact form)
- Build individual day-by-day pages for the 22 Gran Sur duration variants
- Real photo set (Unsplash placeholders today)
- Replace mocked stub-content for non-tour routes (about, contact intermediate, etc.)
- Mobile QA pass on all 25+ pages

## Backlog / P2
- Sticky-nav active-state improvements on long pages
- Sitemap / SEO meta per page
- Stripe Checkout for `/proximas_salidas` deposits
- Replace remaining non-Moroccan Unsplash IDs in landmark galleries (e.g. `oasis-picnic` card 1) with verified Moroccan-only photos.

## Recent additions (Feb 2026 — session)
- **Day map interactive carousel** — Selecting a landmark on the map or the side list reveals an editorial card carousel below the map: vertical 4:5 cards, each with image + title + short curiosity (trilingual). 28 landmarks × 3-4 cards in `lib/landmarkGalleries.js`. Component: `components/LandmarkCarousel.jsx`.
- Increased spacing between "Bloques culturales destacados" and "Mapa del día" sections (`mt-12 md:mt-16 pt-14 md:pt-20`).
- Added "Planifica tu viaje" link in `SideMenu` → group "Nuestros viajes / Experiencias y formatos" (between *Viajes a medida* and *Próximas salidas*), trilingual, icon `wand-2`.
- Verified `/planifica-tu-viaje` end-to-end submission against `POST /api/trip-planner` (HTTP 200, MongoDB persisted).

## Stack & integrations
- MongoDB enquiries (POST `/api/contact`)
- Leaflet maps (existing components)
- No 3rd-party LLM integrations needed yet

## Key files of reference
- `frontend/src/App.js` · LocalizedRouter wiring of all 25+ pages
- `frontend/src/lib/routes.js` · Trilingual slugs (incl. 4 new tourGransur* + 3 Marrakech hubs)
- `frontend/src/lib/itineraryHubs.js` · Hub configurations (7 hubs total)
- `frontend/src/lib/marruecosItineraries.js`, `surItineraries.js`, etc.
- `frontend/src/components/ItineraryHubPage.jsx` · Universal hub template
- `frontend/src/components/ProgramTemplate.jsx` · Universal day-by-day program template
- `frontend/src/components/JourneyPageSections.jsx` · Shared editorial sections (hero, sticky nav, itinerary block, pillars, catalog teaser, community CTA)

## Testing status
- `iteration_4.json` (Feb 2026): 14 pages passed flawlessly.
- Latest (Feb 2026): All 4 new gran-sur hubs render with correct option counts (8/6/6/2); MarruecosPage editorial intro + pillars + catalog + community CTA visually verified; Sur block titles match user spec and CTAs land on correct hubs.
