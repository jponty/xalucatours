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
- **Panel "Used in" en el diálogo de eliminar** (Feb 2026, latest):
  - Nuevo endpoint `GET /api/files/{id}/usage` que busca en `image_slots` toda referencia al `storage_path` (uploads directos + reusos vía library).
  - `ImageLibraryPicker` **precarga las usages** en bloque (lazy, throttle 30 ids) al abrirse y refresca tras delete/upload.
  - Cada miniatura muestra un **badge superior izquierdo** con el contador de usos (`Eye + N`). Verde si > 0, neutro si 0.
  - El **diálogo de confirmación** ahora incluye un panel "Used in":
    - Si count === 0 → "No se usa en ninguna página, se puede eliminar".
    - Si count > 0 → banner ámbar "Atención: esta imagen se usa en N páginas" + lista scrolleable de `slot_id` con enlaces "ver" externos (mapeo `slotToPath`) + botón cambiado a **"Eliminar de todos modos"** (color rojo oscuro).
  - Bug descubierto y arreglado durante la verificación: el `LibraryThumb` no recibía el prop `usage` en la grid (regresión en una edit anterior).
  - Verificado en navegador real: badges visibles (1 y 3), panel correctamente mostrado con slot_id `home.hero.3 · LIBRARY` y enlace "ver".


- **Image Library — gestión completa** (Feb 2026, latest):
  - Backend: `POST /api/library/upload` (bulk hasta 30 archivos, valida MIME y 8 MB por archivo, devuelve uploaded+skipped); `PATCH /api/files/{id}` (rename + tags normalizadas: lowercase/trim/dedup, máx 20 tags); `DELETE /api/files/{id}` (soft-delete); `POST /api/files/{id}/replace` (sube nuevos bytes manteniendo el id); `GET /api/library/tags` (chips con count); `GET /api/files?tag=duna` (filtro por tag).
  - Frontend: rewrite de `ImageLibraryPicker.jsx` con bulk-upload (`Subir varias`), chips de tags (`Todas` + por tag), búsqueda por nombre/tag/slot, hover actions por miniatura (reemplazar / renombrar / eliminar), drawer inline de edición (nombre + tags coma-separadas), banner verde de confirmación tras upload.
  - Header: nuevo icono `Library` (`header-library-toggle`) que solo aparece cuando `imageEditMode === true` — atajo directo a la biblioteca desde cualquier página, sin necesidad de abrir un slot.
  - Soft-delete: los bytes permanecen en Emergent storage (no hay API DELETE) pero quedan ocultos en listings — comportamiento esperado del playbook.
  - Verificado por testing agent iteration_11: **24/24 PASS** (7 backend + 17 frontend), sin issues.

- **Biblioteca de imágenes reutilizable** (Feb 2026):
  - New backend `GET /api/files?limit=&skip=&q=` — lists every previously-uploaded image (most recent first), excludes soft-deleted, supports filename / slot-id search. Returns `{items, total, has_more, limit, skip}`.
  - New frontend `components/ImageLibraryPicker.jsx` — modal-over-modal grid picker with search, debounced 250 ms, esc/backdrop close, hover overlay "Usar esta".
  - `EditableImage.jsx` now exposes a **"Biblioteca"** button next to the upload dropzone. Selecting a thumbnail calls `PUT /api/slots/{slot}` (no re-upload), updates parent + local mirror, and closes the picker — same photo can be reused across pages without bumping storage usage.
  - Verified via curl: 4 files listed (test pixels + 1 real upload), `q=library` returns 2 matches.

- **Emergent Object Storage integration** (Feb 2026):
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


## Editorial guide — Cuándo viajar a Marruecos (Feb 2026)
- New top-level cluster "Guías de viaje" in `lib/menu.js` (icon `book-open`).
- New trilingual route `whenToTravel`:
  - es: `/cuando-viajar`
  - en: `/en/when-to-travel`
  - fr: `/fr/quand-partir`
- Page: `pages/WhenToTravelPage.jsx`. Content lives in `lib/bestTimeData.js` (HERO, INTRO, 4 SEASONS, 5 REGIONS, 6 TRAVEL_STYLES, 12 MONTHS, FAQ, INTERNAL_LINKS) — fully trilingual.
- Sections rendered: cinematic hero w/ slow-zoom + breadcrumb chip (Inicio › Guías › Cuándo viajar) → editorial intro (asymmetric 5/7 grid) → 4 seasons in alternating left/right blocks color-coded by accent → 5 climate region cards + region×month visual strip (Jan–Dec bars per region) → travel-style matrix as 6 shadcn Tabs (Desierto / Senderismo / Ciudades / Playa & surf / Lujo / Fotografía) each with `MonthBar`, body, and a contextual "suggested itinerary" link to existing hubs → 12-month timeline grid (4×3 on desktop, click-to-expand detail panel) on dark `#1A1513` background → interactive Leaflet map with 5 colored `CircleMarker` per climate region + popup with best/avoid months → shadcn Accordion FAQ → internal cross-links to all main hubs (Sur, Norte, Escapadas, Marruecos, Aventura, Fin de Año) → final "Plan your trip" CTA band.
- New icons registered in `SideMenu.jsx`: `BookOpen`, `Sunrise`.
- Self-contained: no edits required to the global Breadcrumbs system or `programNav.js`.
- Reusable `MonthBar` and `parseBestMonths` helpers inside the page for the visual scheduling components.
- Tested: ES/EN/FR routes render correctly; SideMenu "Guías" cluster expands and navigates; tab switching, month expansion, and Leaflet popups all functional.


## Floating "Best month for my trip" FAB (Feb 2026)
- New component `components/BestMonthFab.jsx`, mounted globally inside `Layout.jsx`.
- Floating pill `bottom-24 right-6` (sits above the "Made with Emergent" badge), glassmorphic dark theme with the region's accent colour on the icon badge.
- Smart `routeToRegion(routeId)` mapping picks the relevant climate region per page: Sur / desert / gran-sur / Erg Chebbi / Marrakech routes → **sahara**; Marrakech-Essaouira → **coast**; Aventura / Enduro / Atlas-Fez / Errachidia-Atlas-Fez → **atlas**; Bespoke / Marrakech escapes → **marrakech**; Norte / imperial cities / Tangier / Fez / Chefchaouen escapes → **north**.
- Hidden on: `home`, `contact`, `whenToTravel`, `planTrip`, `appointment`, `toursLanding`, `catalog`, `morocco`, `events`, `about`, `whatWeDo`, `whatToSee`, `upcomingDepartures`, and any unknown route.
- Side modal (460–520px from the right) opens with:
  - Eyebrow "Tu mejor ventana / Your sweet spot / Votre meilleure fenêtre" in region accent
  - Region name as big serif title in accent colour
  - 12-month visual `MonthBar` highlighting the best window
  - Best / Avoid month strings from `bestTimeData.REGIONS`
  - Climate body excerpt with left border in accent colour
  - "Dos meses destacados" — pulls the first two best-window months from `bestTimeData.MONTHS` with their `temp` + `highlight`
  - Sticky bottom CTAs: "Planificar mi viaje" (→ `planTrip`, primary orange) and "Ver guía completa" (→ `whenToTravel`, outline)
- Trilingual via the existing `pick()` helper.
- Tested on Sur (Sáhara), Norte (Rif y Tánger), Aventura (Alto Atlas), Marrakech-Essaouira (Costa atlántica), EN `/en/tours/adventure` (High Atlas). FAB correctly hidden on `/`, `/cuando-viajar`, `/contacto`.


## Per-day "Mapa del día" — universal coverage (Feb 2026)
- **Mandate**: every day inside `ProgramTemplate` itinerary must have its own independent "Mapa del día" section, in addition to the global "Resumen visual del viaje" (`TripRouteMap`).
- New helper `lib/dayRouteResolver.js` with a `CITY_TABLE` of ~50 Moroccan place tokens (tanger, fez, marrakech, essaouira, ozz, sidiali, dades, todra, erfoud, khamlia, rissani, ergchebbi, volubilis, akchour, chefchaouen, etc.) and a `resolveDayRoute(routeId)` parser that:
  1. First looks up `DAY_ROUTES[routeId]` (curated 14 routes)
  2. Otherwise splits the `route_id` on `-`/`_` and matches each token against the dictionary (skipping program-prefix tokens like `tf45-`, `ci-`, `cirf-`, `enduro-d#-`, `return`, `arrival`, `medina`, etc.)
  3. Returns waypoints tuples `[name, lat, lng, kind]`. Tags first as `start`, last as `overnight`.
- `components/DayRouteMap.jsx` rewritten as a tier-aware section that always renders SOMETHING:
  - **Tier 1 (landmarks)** — when `DAY_LANDMARKS[route_id]` exists. Rich Leaflet map + landmark carousel + selectable side list (unchanged).
  - **Tier 2 (waypoints)** — when `resolveDayRoute` returns ≥ 2 points. Polyline + numbered `CircleMarker`s with start/stop/overnight colour coding (`#5A6B4F`, `#C16542`, `#A07042`, `#5A7F9C`), plus side panel with "01/02… stops", approximate km (Haversine sum) and progress bar.
  - **Tier 3 (stay)** — single anchor or no data. Editorial centred card: overline "Mapa del día" · serif title "Día sin desplazamientos" / "Mapa del día" · home pin with location · trilingual editorial body · progress bar.
- The `data-tier="landmarks|waypoints|stay"` attribute on every section enables QA/CMS to inspect coverage.
- **Coverage gained** by the parser alone — verified live on three programs:
  - `desierto_atlas/programa_4n_5d` → 5/5 days (3 curated + 2 parsed)
  - `norte/tanger_fez/programa_4n_5d` → 5/5 (3 parsed waypoints + 2 stay)
  - `norte/ciudades_imperiales/programa_4n_5d` → 5/5 (3 parsed + 2 stay)
- Tokens like `casa-rabat`, `volubilis-meknes-fez`, `tanger-tetuan`, `akchour-chefchaouen`, `meknes-fez`, `da-return-ouarzazate` now auto-resolve into real polylines without any data backfill.
- Trilingual labels (ES/EN/FR) cover all three tiers.


## Universal clickable galleries on every Tier (Feb 2026)
- **Mandate (user re-emphasis)**: every map point on every day — including the parsed-token Tier 2 polylines and the Tier 3 stationary days — must be clickable and open the same `<LandmarkCarousel>` drawer used on the curated `atlas_desierto` reference page (title · kind eyebrow · blurb · 3-card image carousel).
- New data file `lib/cityProfiles.js` exports `CITY_PROFILES`, a token-keyed dictionary covering ~32 Moroccan places (Tánger, Chefchaouen, Tetuán, Asilah, Akchour, Rabat, Casablanca, Fez, Meknès, Volubilis, Marrakech, Agafay, Essaouira, Ifrane, Sidi Ali, Imlil, Toubkal, Atlas, M'Goun, Anti-Atlas, Ouarzazate, Aït Ben Haddou, Skoura, Dadès, Todra, Tinerhir, Drâa, Erfoud, Errachidia, Rissani, Khamlia, Merdani, Erg Chebbi, Merzouga, Kem Kem, Ziz). Each entry exposes `{ kind, name (ES/EN/FR), blurb (ES/EN/FR), gallery: [{src, title, description} × 3] }`. All Unsplash IDs verified to return HTTP 200.
- `lib/dayRouteResolver.js` extended: each `CITY_TABLE` token now carries a resolved `profileKey` (5th tuple element), and a coord-based reverse index `COORD_TO_PROFILE` lets curated `DAY_ROUTES` waypoints find their profile too via `getProfileKeyForCoord(lat, lng)`. The public `resolveDayRoute` returns 5-tuples `[name, lat, lng, kind, profileKey?]`.
- `components/LandmarkCarousel.jsx` now reads images from either the legacy `LANDMARK_GALLERIES[landmark.id]` table or an inline `landmark.gallery` prop, enabling synthetic city-profile landmarks to render with zero duplication.
- `components/DayRouteMap.jsx` refactor:
  - **Tier 2 (WaypointMode)** is now interactive: pre-computes synthetic landmarks via `waypointToLandmark`, holds `activeIdx` state with click handlers on both the `CircleMarker` and the side-list rows (only when the waypoint has a profile), pulses + ring-highlights the selected marker, flies the map to it via `MapController`, and renders `<LandmarkCarousel>` (or the hint card) below the grid.
  - **Tier 3 (StayCard)** auto-upgrades into `<StayInteractive>` whenever the anchor has a `CITY_PROFILES` entry: full Leaflet mini-map + side panel mirroring the Tier 1 visual hierarchy with a single clickable POI button and the carousel drawer. Falls back to the original editorial card only when no profile is available.
- Smoke test verified on `viajes/gransur/tanger-rak/programa_8n_9d`:
  - Tier 2 day `trk89-tanger-chefchaouen` → click on "Tánger" waypoint highlights marker, opens drawer with 3 trilingual cards (Medina sobre el Estrecho, Café Hafa, Kasbah y Petit Socco), all images naturalWidth=1200 and complete.
  - Tier 3 day `trk89-fez-discover` → "Día sin desplazamientos" with mini-map on Fez; click on the side button opens the same drawer with 3 cards (Curtidurías Chouara, al-Qarawiyyin, Bab Boujloud).
- `data-testid` additions: `day-waypoint-btn-{routeId}-{idx}`, `day-stay-btn-{routeId}` and existing `landmark-carousel-{landmarkId}` / `landmark-card-{idx}` selectors stay consistent across tiers.

## Universal galleries — testing-agent regression fix (Feb 2026)
- Iteration 12 testing agent flagged that `escapadas/marrakech/programa_2n_3d` Tier 3 stays (`escrak-arrival`, `escrak-medina`, `escrak23-return`) did NOT upgrade to clickable `StayInteractive` even though Marrakech is canonical.
- Root cause: `tokenToProfileKey("rak")` returned `null`. The token "rak" matched `CITY_TABLE["rak"]` for coordinates, but the loose-contains profile lookup only checked `profileKey ⊂ token`, never `token ⊂ profileKey`. "rak" is too short to contain "marrakech".
- Fix in `lib/dayRouteResolver.js`:
  1. Added explicit `CITY_TO_PROFILE` bridge: `{ rak: "marrakech", tan: "tanger", tet: "tetuan", fes: "fez", casa: "casablanca", ozz/ouarza: "ouarzazate", ait/ben/haddou/aitbenhaddou: "aitben", ergchebbi/dunes: "chebbi", zagora: "draa", fossils: "kemkem" }`.
  2. `tokenToProfileKey` now consults the bridge first, then direct, then alias, then loose-contains BOTH ways (`token.includes(key) || key.includes(token)`).
- Verified: `viajes/escapadas/marrakech/programa_2n_3d` → all 3 stays expose `day-stay-btn-*`, drawer opens with 3 image cards (Jemaa el-Fna, Medersa Ben Youssef, Jardín Majorelle) — all `naturalWidth=1200, complete=true`.
