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
- `/viajes/marrakech_ergchebbi/programa_4n_5d`, `_5n_6d`, `_6n_7d`, `_7n_8d` (variant `me`)
- `/viajes/ergchebbi_marrakech/programa_4n_5d`, `_5n_6d` (Feb 2026 — `PROGRAM_EM_45`/`PROGRAM_EM_56`), `_6n_7d`, `_7n_8d` (variant `em`)
- `/viajes/marrakech_ergchebbi_marrakech/programa_2n_3d`, `_3n_4d`, `_4n_5d`, `_5n_6d`, `_6n_7d`, `_7n_8d` (variant `mem`)
- `/viajes/marrakech_essaouira/programa_4n_5d`, `_6n_7d` (variant `mes`)
- `/viajes/fez-atlas-errachidia/programa_5n_6d` (variant `fae`)
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

## Recent additions (Feb 2026 — session, latest)
- **Emergent Object Storage integration** (Feb 2026, latest):
  - Backend now persists CMS image uploads to **Emergent Object Storage** (cloud, stateless) instead of the local `backend/uploads/` disk.
  - New module `backend/storage.py` (`init_storage`, `put_object`, `get_object`) — session-scoped key, auto-refresh on 403.
  - `POST /api/slots/{slot_id}/upload` rewritten: validates MIME + 8 MB cap → uploads to `xaluca/slots/{slot_id}/{uuid}.{ext}` → stores `storage_path` + metadata in `image_slots` collection (Mongo) and bookkeeping in `files` collection (with `is_deleted` soft-delete flag).
  - New endpoint `GET /api/files/{path:path}` — public proxy that streams objects from Emergent storage with `Cache-Control: public, max-age=86400`. Used directly by `<img src>` so editors can upload + see results without any auth dance.
  - Legacy `/api/uploads/*` static mount kept for backward-compat with pre-migration files.
  - Frontend `EditableImage.jsx` already used `POST /api/slots/{slot}/upload` + reads `data.url` — no change required, transparent migration.
  - `EMERGENT_LLM_KEY` added to `backend/.env`.
  - Verified end-to-end via curl: upload → slot read → file fetch returned exact bytes (HTTP 200 · 68 B for the test PNG).
  - Tested via testing agent iteration 8/9/10 (previous tasks); this integration was self-tested via curl per the playbook ("upload succeeds + download returns matching bytes").

- **Aventura → Enduro hub + videos en Sur** (Feb 2026):
  - New **Enduro hub** `/viajes/aventura/enduro` (`AventuraEnduroHubPage` → `ItineraryHubPage` + `HUB_AVENTURA_ENDURO`) with two programmes:
    - `/viajes/aventura/enduro/programa_4n_5d` — 5 days (`PROGRAM_ENDURO_45`): Llegada · Oasis · La Momia · Grandes Dunas · Regreso.
    - `/viajes/aventura/enduro/programa_6n_7d` — 7 days (`PROGRAM_ENDURO_67`): Llegada · Kemkem · Saghro · Atlas · Anti Atlas · Bereberes · Regreso.
  - Both routes trilingual (es/en/fr). New variant `enduro` registered in `ProgramTemplate.jsx` (`type_enduro` LABELS + QuickInfo case).
  - Aventura section wired into `programNav.js` → breadcrumbs `Inicio › Viajes › Aventura › Enduro por Marruecos › [Programa]` + HubPeerNav between programs.
  - `AventuraPage.jsx` now exposes the new hub via the "Enduro en el desierto" experience card + a dedicated "Ver opciones de enduro" CTA below the Enduro editorial.
  - New cinematic `<VideoSection />` (`components/VideoSection.jsx`) with autoplay-muted, play/pause + mute controls, IntersectionObserver auto-pause, rounded corners and glass overlay. Inserted below the 3 main editorials of `/viajes/surdemarruecos` (Mil Kasbahs · Puerta del Desierto · Marrakech+Atlas+Sahara). Video sources centralised in `SUR_VIDEOS` dict (Google sample CDN — easy to swap from edit mode).
  - Verified by `testing_agent_v3_fork` iteration_9.json: 10/10 PASS across ES/EN/FR + mobile responsive, breadcrumbs + peer-nav + controls work; only side-issue was Pexels-CDN 403s, fixed by switching to `commondatastorage.googleapis.com/gtv-videos-bucket` sample videos and adding `onError` fallback in `VideoSection`.

- **Phase 1 "Opción B" · Sur de Marruecos navigation & cross-linking** (Feb 2026):
  - New global `<Breadcrumbs />` mounted in `Layout.jsx` — auto-detects routeId via `resolvePath()` and renders a glassy strip over the hero. Trail: `Inicio › Viajes › <Sección> › <Hub> › <Programa>`. Trilingual (es/en/fr). Hidden on home & unwired routes.
  - New `<HubPeerNav />` at the bottom of every Sur program page (`ProgramTemplate.jsx`, before the contact form): "Volver al hub" CTA + grid of peer programs from the same hub.
  - New lookup map `lib/programNav.js`: `SECTION_HUBS.tourSouth` lists the 7 Sur hubs; derived `HUB_NAV` + `PROGRAM_NAV` indexes drive the breadcrumb & peer-nav lookups. Phase 2/3/4 will simply add more entries to `SECTION_HUBS`.
  - Testids: `breadcrumbs`, `bc-home`, `bc-tours`, `bc-section[-current]`, `bc-hub[-current]`, `bc-program-current`, `hub-peer-nav`, `hub-peer-nav-back`, `hub-peer-program-{id}`.
  - Verified by `testing_agent_v3_fork` iteration_8.json: 11/11 criteria PASS in ES/EN/FR, zero console errors.

- **Marrakech → Sidi Ali → Fez family** — created the three Gran-Sur itineraries that climb back from the desert through Aguelmane Sidi Ali on the way to Fez:
  - `/viajes/gransur/marrakech_sidiali_fez/programa_7n_8d` (`PROGRAM_MSF_78`, ~2090–3090 €, 7n/8d, Fez return on day 8)
  - `/viajes/gransur/marrakech_sidiali_fez/programa_8n_9d` (`PROGRAM_MSF_89`, ~2290–3290 €, adds 1 Fez riad night)
  - `/viajes/gransur/marrakech_sidiali_fez/programa_9n_10d` (`PROGRAM_MSF_910`, ~2490–3490 €, adds Boumalne M'Goun day)
- Modular reuse from `marrakechFezShared`, `marrakechFez67` and `ouarzazateSidialiFez67`. Two brand-new shared days: `DAY_MSF_ZIZ_SIDIALI`, `DAY_MSF_SIDIALI_IFRANE_FEZ_RETURN` (78); `DAY_MSF_SIDIALI_FEZ_MEDINA`, `DAY_MSF_FEZ_RETURN` (89 + 910 reuse). All trilingual (es/en/fr).
- Routes registered in `lib/routes.js`, page components wired in `App.js`. ⚠️ Pending: `marrakech_sidiali_fez` hub page (P2) to surface the three variants from a single landing.

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
