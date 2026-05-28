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

## Full Unsplash image audit (Feb 2026)
- **User mandate**: all imagery must be authentically Moroccan and visually coherent with the section's text.
- Pre-audit state: 39 unique Unsplash IDs across the codebase. Visual analysis revealed ~12 were off-topic (Taj Mahal, car wheels, Burj Al Arab, Italian coast, gym interior, hotel rooms, generic silhouettes) or HTTP-broken.
- **New `lib/imageBank.js`**: centralised whitelist of 20 verified Morocco photo IDs grouped semantically (dunes, atlas, chefchaouen, kasbah, koutoubia, medina, riad, market, essaouira). Each entry annotated with subject. New `banner(key, w)` helper for variable widths and `COLLECTIONS` mapping for hub themes.
- Sourced 13 new Morocco-specific photo IDs by scraping the official Unsplash search page for the query "morocco", visually confirming each via thumbnail + AI vision pass.
- **Global replacement script** updated 29 files / 65 occurrences with the new bank, mapping each off-topic ID to a thematically equivalent verified one (Taj Mahal → riad fountain, car wheels → Chefchaouen alley, gym → Atlas misty, etc.). The 19 portrait IDs in `lib/testimonials.js` were intentionally preserved (correct usage for client testimonials).
- **`lib/cityProfiles.js`**: replaced its inline 35-key IMG bank with imports from `imageBank.js`, diversified so each city's 3 gallery cards reference 3 *different* bank images (no more "all-3-identical" galleries). Each mapping commented with intent (e.g. `marrakech → koutoubia`, `fezTannery → marketBaskets`).
- **`components/EmotionalIntro.jsx`**: re-aligned the 5 home-hero slide image↔caption pairs so the visible image matches the editorial caption (Arfoud → camel caravan, Erg Chebbi → dunes, Fez → crowded medina, Alto Atlas → snow peaks + Koutoubia, Aït Ben Haddou → kasbah arch).
- **CMS slot cleanup**: deleted 5 stale `home.intro.*` + `home.trips.south` MongoDB overrides that were forcing the old Chefchaouen image into the "Erg Chebbi" slot. Code defaults now render.
- **Final state**: 40 unique Unsplash IDs in the codebase = 21 verified Morocco bank + 19 testimonial portraits. Zero off-topic. Zero broken (verified HTTP 200 for all).
- Verified end-to-end: home hero, Tier 2 drawer (Tánger waypoints), Tier 3 drawer (Marrakech stays) — all naturally Moroccan, visually distinct, coherent with text.

## Global editable images mandate (Feb 2026)
- **User mandate**: every image placeholder across the site (heroes, sections, cards, galleries, carousels, backgrounds, testimonials, trip images) must be editable in Edit Mode, without triggering navigation. Pattern must be reusable for future pages.
- **Audit baseline**: 16 raw `<img>` tags remained outside the `<EditableImage>` wrapper in 8 files (mostly hub cards, tour landing cards, day-image, gallery drawer, testimonials, program hero).
- **Conversions performed** in this iteration (all swapped from `<img>` → `<EditableImage slot fallback alt aspectRatio className imgProps>`):
  - `components/Testimonials.jsx` — testimonial avatar (`testimonial.${t.id}.avatar`).
  - `components/LandmarkCarousel.jsx` — day-map drawer gallery cards (`landmark.${landmark.id}.gallery.${i}`).
  - `components/DayGallery.jsx` — collage tiles (`day.${day.route_id}.gallery.${i}`). Lightbox kept as plain `<img>` (it's a fullscreen zoom of an already-editable tile).
  - `components/ItineraryHubPage.jsx` — hub program cards (`hub.${hub.id}.program.${p.id}`).
  - `pages/AtlasDesiertoHubPage.jsx` — special hub cards (`hub.atlasdesierto.program.${p.id}`).
  - `components/JourneyPageSections.jsx` — `CommunityCta` bg, hub preview cards, `CatalogTeaser` bg (all derive slot from `testid`/`hub.id`).
  - `components/ProgramTemplate.jsx` — program hero (`program.${vt.id}.hero`) and per-day image (`day.${day.id}.image`).
  - `pages/ToursLandingPage.jsx` — region cards, experience cards, trip cards, próxima salida cards, and the Asesoramiento section background (5 slots: `viajes.region.${id}`, `viajes.experience.${id}`, `viajes.trip.${id}`, `viajes.proxima.${i}`, `viajes.asesoramiento.bg`).
- **Decorative overlays** (gradients, film-grain) added `pointer-events-none` so the `<EditableImage>` overlay receives the edit clicks instead of the underlying `<Link>`.
- **Smoke test** at `/viajes` and `/viajes/gransur/tanger-rak/programa_8n_9d` with edit-mode toggled ON:
  - All region, experience, trip cards expose `[data-testid^=editable-overlay-]` with dashed border + "EDITAR" button + slot label visible.
  - Drawer gallery (Tier 2): 3 landmark cards editable independently (`landmark.trk89-tanger-chefchaouen-tanger-0.gallery.0/1/2`).
  - Day blocks: each day image editable (`day.trk89-d2.image` etc.).
  - Navigation blocked while overlay open (footer shows "MODO IMÁGENES · NAVEGACIÓN BLOQUEADA").
- **Developer guide** added at `/app/memory/EDITABLE_IMAGES_GUIDE.md` with slot-naming conventions, parent positioning rules, carousel `pointer-events` trick, and a checklist for every new page.
- Only remaining raw `<img>` tags (intentional): `DayGallery` Lightbox (zoom of already-editable tile), `ImageEditorPage`/`ImageLibraryPicker` (admin previewers).

## Expandable stage dropdown · TripRouteMap (Feb 2026)
- **User mandate**: in the "El recorrido completo · Tu travesía en un solo mapa" section, every stage (both the map marker and the right-rail button) must be clickable to open an expandable dropdown showing that day's title, parsed route, key stops, highlights and short description — without leaving the map section.
- **`components/TripRouteMap.jsx` refactor**:
  - Signature extended to `({ route, days })`. Caller `ProgramTemplate.jsx` now passes `days={program.days}`.
  - Builds an `O(1)` `dayByNumber` index keyed by `day_number || (i+1)`.
  - Removed the previous `onMouseEnter`/marker `mouseover` auto-activation so the dropdown is strictly click-driven (single source of truth via `activeDay` state — toggles closed when clicking the same stage twice).
  - Added a hint above the rail: "Pulsa una etapa para ver el detalle" (trilingual).
  - The chevron icon rotates 180° on expand; the open card shows `aria-expanded` and `aria-controls` for accessibility.
- **New `DayDetail` sub-component** rendered inline below the active button:
  - Day badge: "DÍA NN" tinted with the stop's type color.
  - Day title (`day.title`) in serif.
  - Parsed `Ruta del día` line derived from `day.route_id` via a small `prettifyRouteId()` helper (strips programme prefix and meta tokens like `return`, `discover`, `loop`).
  - "Lo destacado" — first 3 entries of `day.culture[]` with title + body, numbered tabular-nums.
  - "El día, en detalle" — full `day.body` description in the active language.
  - Close pill (X) at top right with `data-testid="trip-route-detail-close-{n}"`.
  - Smooth `.animate-slide-down` CSS animation (new keyframe in `index.css`) with `prefers-reduced-motion` already handled at the file scope.
- **`data-testid` additions**: `trip-route-detail-{day}`, `trip-route-detail-close-{day}`, `trip-route-hint`.
- Smoke test on `programa_8n_9d`: clicking the right-rail "02 Volubilis · Meknes · Fez" expands a fully populated dropdown (route `VOLUBILIS → MEKNES → FEZ`, 3 highlights with full body, full day description). Clicking "05 Erg Chebbi · Bivouac" closes day-2 and opens day-5 (only `trip-route-detail-5` remains in DOM). Marker click on the Leaflet map produces the same behaviour.

## Marruecos itineraries · full nav wiring (Feb 2026)
- **User mandate**: every main block and every option ("4 nights / 5 days", etc.) on the `/viajes/marruecos` page must be clickable and route to the correct hub/programme URL — no orphan CTAs.
- **`lib/marruecosItineraries.js`** extended schema:
  - `hubLink` — primary hub route key (replaces the old `ROUTE_BY_ID` mapping in the page).
  - `relatedHubs[]` — optional list `{ label, link }` rendered as chips below the main CTA (e.g. reverse-direction hubs, general aggregator hubs).
  - `variants[]` — list `{ label, link }` of concrete programmes with duration. Rendered as a 2-column responsive button grid below the main CTA.
- **`components/JourneyPageSections.jsx · ItineraryBlock`**:
  - Adds related-hub chips with `ArrowLeftRight` icon, `data-testid="itinerary-related-link-{id}-{i}"`.
  - Adds the variants grid with `data-testid="itinerary-variant-link-{id}-{i}"`, accent-colour left bar, hover state that inverts to dark.
  - Reads localised `t.variants_overline` from `MarruecosPage.jsx` (es: "Opciones de viaje", en: "Trip options", fr: "Options de voyage").
- **`pages/MarruecosPage.jsx`** removed the inline `ROUTE_BY_ID` dict; now uses `it.hubLink` directly so itinerary data owns its routing.
- **Coverage** (verified 200 OK on preview URL):
  - **Gran Sur · Fez – Marrakech**: main `→ /viajes/gransur/fez-rak`, 8 programme variants (4 fez→marrakech + 4 marrakech→fez), 1 related hub `→ /viajes/gransur/rak-fez`.
  - **Gran Sur + Medio Atlas**: main `→ /viajes/gransur/fez-sidiali-rak`, 6 programme variants (3 fez→sidiali→marrakech + 3 reverse).
  - **Alto Atlas · Desierto · Fez**: main `→ /viajes/gransur/ouarzazate-sidiali-fez`, 6 programme variants (3 ozz→sidiali→fez + 3 reverse), 1 related hub `→ /viajes/atlas-desierto-fez`.
  - **Tánger – Marrakech**: main `→ /viajes/gransur/tanger-rak`, 2 programme variants (8n/9d, 9n/10d).
- Total: 4 main hub links + 22 programme deep-links + 2 related-hub chips = 28 navigation paths wired, all returning HTTP 200.

## SlotScope · auto-namespaced editable slots (Feb 2026)
- **Pain point**: integrating `<EditableImage>` in a deeply-nested sub-component required prop-drilling parent ids manually (e.g. passing `hubId` from `ItineraryHubPage` → `OptionsGrid`). Easy to forget → produced the `hub is not defined` runtime error that the user spotted on `/viajes/gransur/fez-rak`.
- **Fix**: extracted a tiny standalone module `components/slotScope.js` exposing:
  - `SectionContext` — single source of truth for the scope path.
  - `useSlotId(name)` — joins `pagePath + scope.path + name` into a final dotted slot id (`/en` and `/fr` URL prefixes stripped so the slot is shared across languages).
  - `useSlotPath()` — read-only access to the scope (without name).
  - `usePageNamespace()` — current page prefix.
  - `<SlotScope id="...">` — pushes one extra segment onto the scope. Renders no DOM element by default (uses `React.Fragment`); pass `as="div"` if a wrapper is desired.
- `EditableSection.jsx` now re-uses this module instead of duplicating the context. Its semantic `<E>` / `<EImg>` DSL is unchanged.
- `EditableImage.jsx` now accepts EITHER:
  - `slot="literal.id"` (absolute · back-compat) OR
  - `name="local"` (relative · auto-resolved against the surrounding `<SlotScope>` / `<EditableSection>`).
  Guards added so that when neither prop is provided the component still renders the fallback (no fetch, no overlay) — prevents crashes on legacy raw `<img>` patches.
- **Proof of concept** in `components/ItineraryHubPage.jsx`:
  - Removed the `hubId` prop and any reference to `hub.id` inside `OptionsGrid`.
  - Wrapped the `<OptionsGrid>` in `<SlotScope id={`hub.${hub.id}`}>`.
  - `EditableImage` inside cards now uses `name={`program.${p.id}`}`.
  - Resolved slot id verified at runtime: `viajes/gransur/fez-rak.hub.gransur-fez-rak.program.fr-6-7` for the first card.
- Guide updated at `/app/memory/EDITABLE_IMAGES_GUIDE.md` with the before/after diff and 3 new hooks.

## /incentivos · "Casos de éxito" block (Feb 2026)
- Added a B2B case-study section between `<Verticals>` and `<Process>` on `/incentivos`.
- Dark `#1A1513` background with `berber-bg-cross` overlay to contrast against the white verticals and `#F2EBE1` process — creates the rhythm requested for the page.
- 3 case-study cards (`COPY.cases.items`), each with hero editable image (`<EditableImage name="image">` inside `<SlotScope id="cases"><SlotScope id="{cid}">`), brand pill, location eyebrow, event type, body and a 3-col stats row (`Asistentes` · `Días` · `Resultado`) using Lucide `Users` / `CalendarCheck` / `TrendingUp`:
  1. **BMW · Lanzamiento de gama M** — Ouarzazate · Aït Ben Haddou — 240 asistentes · 4 días · **+96% satisfacción**.
  2. **Vodafone · Convención anual EMEA** — Erg Chebbi · Merzouga — 180 asistentes · 3 días · **+92 NPS interno**.
  3. **Heineken · Incentivo comercial regional** — Marrakech · Atlas — 320 asistentes · 5 días · **+98% recomendación**.
- All metrics framed as "Cifras de los propios clientes, no de nuestro equipo de marketing" in the section intro for honesty + credibility.
- New testids: `inc-cases`, `inc-case-{cid}`, `inc-case-stats-{cid}`.
- Smoke verified: 3 cards render, stats text confirmed (`ASISTENTES 240 · DÍAS 4 · RESULTADO +96% satisfacción`), images load, brand pills appear in serif on each hero.

## /incentivos · Incentives B2B landing (Feb 2026)
- **User mandate**: redact the existing route `events` (`/incentivos` · `/en/incentives` · `/fr/incentives`) with the supplied corporate copy.
- **New page** `pages/IncentivosPage.jsx` wired in `App.js` (`if (routeId === "events") return <IncentivosPage />`). Trilingual ES/EN/FR.
- **Sections**:
  - Cinematic hero (dunes banner) with breadcrumb `Inicio › Servicios › Incentivos`, eyebrow `Organizadores de eventos · 360°`.
  - **Trust bar** with 13 brand cards (Coca-Cola, Jeep, MINI, Mitsubishi, IBM, BMW, Vodafone, Volkswagen, Tag Heuer, Nissan, Carglass, Seat, Heineken) — typographic treatment (no logo assets needed) in a 7-col grid with kebab-cased testids `inc-brand-{slug}`.
  - **Verticals** `<Verticals>`: 4 alternating rows (img/copy → copy/img). Each card has a numbered+iconed badge, editable image, body copy and category chips:
    1. **Eventos de negocios** (Briefcase, kasbah arch) — chips: Convenciones · Lanzamientos · Team building · Incentivos.
    2. **Eventos deportivos** (Trophy, rocky dunes) — chips: Titan Desert · Marathon des Sables · Rally Merzouga · Desert Run.
    3. **Festivales** (Music2, medina) — chips: Música · Cine · Arte · Gastronomía.
    4. **Celebraciones** (Heart, dunes) — chips: Bodas · Aniversarios · Reuniones · Renovación de votos.
  - **Process** `<Process>` band on `#F2EBE1` with berber-diamond overlay: 3 numbered steps (Crea tu viaje de empresa a medida · Planifica tu aventura por Marruecos · Reserva día y hora) with icons (Building2 · Globe2 · CalendarCheck) + two CTAs (`Planifica tu viaje` → `/planifica-tu-viaje`, `Pedir cita previa` → `/contacto`).
  - **Final CTA band** with camel-caravan editable bg + 3-col contact card pulled from `lib/data.js · CONTACT` (phone, email, hours) + two CTAs.
- **Editable images mandate respected**: hero, final-bg and each vertical image via `<EditableImage>`. Each vertical wrapped in `<SlotScope id="verticals"><SlotScope id="{id}">` → ids resolve to `incentivos.verticals.{id}.image`. Process steps + content blocks ready for granular CMS overrides via `<SlotScope id="process">`.
- **Doc title i18n** handled with `useEffect([lang])`.
- **`data-testid`s**: `inc-page`, `inc-hero`, `inc-breadcrumbs`, `inc-trust`, `inc-brands`, `inc-brand-{slug}`, `inc-verticals`, `inc-vertical-{id}`, `inc-process`, `inc-step-{id}`, `inc-process-plan`, `inc-process-contact`, `inc-final-cta`, `inc-contact-phone/email/hours`, `inc-cta-plan/contact`.
- **Smoke verified**: H1 correct in ES, all 13 brands render, 4 verticals render with alternating layout + chips, 3 process steps render with numbered badges, contact hrefs correct (`tel:+34937268366`, `mailto:xalucatours@xaluca.com`, `/planifica-tu-viaje`).

## /quehacemos · testimonials block (Feb 2026)
- Inserted a 3-card testimonials section between `<Reasons />` and `<FinalCta />` on the `/quehacemos` page, reusing `lib/testimonials.js` (no new data file).
- Curated `FEATURED_TESTIMONIAL_IDS = ["amelie-family", "david-4x4", "carlos-bespoke"]` — one per traveller archetype the copy emphasises:
  - **amelie-family** → `VIAJE EN FAMILIA` (Heart icon).
  - **david-4x4**     → `GRUPO DE AMIGOS` (Users icon).
  - **carlos-bespoke**→ `VIAJE A MEDIDA & EMPRESAS` (Briefcase icon).
- Card design: glassy watermark `Quote` icon top-right, profile badge in `#F2EBE1`, serif italic quote ~xl, separator + avatar (editable via `<EditableImage name="avatar">` inside `<SlotScope id="testimonials"><SlotScope id="{tid}">`), name + location + trip eyebrow in accent.
- New COPY.testimonials block (overline · title · body · profile labels) trilingual; quote/trip/name inherited from `TESTIMONIALS` entries (already i18n).
- Section sits on `#F2EBE1` with `berber-bg-diamond` overlay, mirroring the existing `<TripPillars>` visual rhythm.
- New testids: `qh-testimonials`, `qh-testimonial-{tid}`, `qh-testimonial-profile-{tid}`.
- Smoke verified: 3 cards render, profile labels correct (`VIAJE EN FAMILIA`, `GRUPO DE AMIGOS`, `VIAJE A MEDIDA & EMPRESAS`), avatars + serif quotes load.

## /quehacemos · "Qué hacemos" page (Feb 2026)
- **User mandate**: redact the existing route `whatWeDo` (`/quehacemos` · `/en/what-we-do` · `/fr/ce-que-nous-faisons`) using the provided copy. Previously routed to `<StubPage />`.
- **New page** `pages/QueHacemosPage.jsx` wired in `App.js` (`if (routeId === "whatWeDo") return <QueHacemosPage />`). Trilingual ES/EN/FR.
- **Sections**:
  - Cinematic hero (Atlas misty banner) with inline breadcrumb `Inicio › Sobre nosotros › Qué hacemos`, eyebrow + title + subtitle.
  - **Intro** (5/7 asymmetric grid): two paragraphs covering the wide range of traveller profiles (solo, family, groups, companies, incentives, themed, motoring, wellness) + clarification on "Propuestas de Circuitos" and "Próximas Salidas". Two CTAs: `Ver propuestas` → `/viajes`, `Ver próximas salidas` → `/proximas_salidas`.
  - **3 pillars · "Cómo son nuestros viajes"** (`F2EBE1` background + berber-bg-diamond): Experiencias únicas (Sparkles + dunas), Alojamientos singulares (BedDouble + riad fountain), Equipo humano local (Users + camel caravan). Each pillar wrapped in `<SlotScope id="pillars"><SlotScope id="{pid}">` so card images auto-resolve to `quehacemos.pillars.{pid}.image`.
  - **4 reasons · "Razones para viajar con Xaluca Tours"**: numbered 01–04 with circular Lucide icons in `#F2EBE1` — Disponibilidad 24/7 (Clock), Viajes 100% personalizados (Wand2), Máxima calidad asegurada (ShieldCheck), Garantía Grup Xaluca (BadgeCheck).
  - **Final CTA band** with camel-caravan editable background + 3-column contact card pulled from `lib/data.js · CONTACT`:
    - Phone: `tel:+34937268366` (`+34 937 268 366`)
    - Email: `mailto:xalucatours@xaluca.com`
    - Office hours: `Lunes a viernes · 10 h – 20 h` (trilingual)
  - Two final CTAs: `Planifica tu viaje` → `/planifica-tu-viaje`, `Escríbenos` → `/contacto`.
- **Editable images mandate respected**: hero, final-CTA background, and each pillar image are `<EditableImage>` with auto-resolved slot ids via `<SlotScope>`.
- **Doc title i18n** handled with `useEffect([lang])` (HomePage regression pattern preserved).
- **`data-testid`s**: `qh-page`, `qh-hero`, `qh-breadcrumbs`, `qh-intro`, `qh-intro-proposals`, `qh-intro-upcoming`, `qh-pillars`, `qh-pillar-{pid}`, `qh-reasons`, `qh-reason-{rid}`, `qh-final-cta`, `qh-contact-phone`, `qh-contact-email`, `qh-contact-hours`, `qh-cta-plan`, `qh-cta-contact`.
- **Smoke verified**: ES H1 correct, FR H1 correct (`Le Maroc a beaucoup à découvrir — et nous, beaucoup à organiser pour vous.`), 3 pillars + 4 reasons render, `tel:` / `mailto:` / `/planifica-tu-viaje` hrefs correct.

## Destination guide · climate window on featured routes (Feb 2026)
- Anchored each `FEATURED_ROUTES` entry to a climate region from `lib/bestTimeData.js` via a new `bestRegionId` field:
  - `gran-sur-fez-rak`, `tanger-rak-norte-sur`, `marrakech-loop` → **sahara** (Oct–Abr / evita Jun–Ago).
  - `imperial-cities` → **marrakech** (Mar–Mayo · Oct–Nov / evita Jul–Ago).
  - `tanger-fez-rif` → **north** (Abr–Jun · Sep–Oct / evita Nov–Feb lluvias).
- Route detail panel now renders a climate block under the body description, before the numbered stop rail. Block contents:
  - Calendar eyebrow with the climate region's localised name (`SÁHARA`, `NORTE (RIF Y TÁNGER)`, etc.).
  - Two-column grid: `Mejor época` (ThermometerSun icon in the region's accent) + `Evita` (ThermometerSnowflake).
  - Link `Ver guía climática completa ↗` → `pathFor(lang, "whenToTravel")` for the full month-by-month guide.
- New testids: `qvm-route-climate-{rid}`, `qvm-route-climate-link-{rid}`. Trilingual via the existing `pick()` helper and reuses the climate accent palette already present elsewhere on the site.
- Verified live: clicking "Gran Sur" shows `MEJOR ÉPOCA Oct – Abr · EVITA Jun – Ago` with the Sáhara accent; switching to "Tánger · Rif · Fez" updates to `Abr – Jun · Sep – Oct · EVITA Nov – Feb (lluvias)`; `Ver guía climática completa` correctly resolves to `/cuando-viajar`.

## Destination guide · featured-route polylines (Feb 2026)
- Layered an opt-in route visualiser on top of the destination map (`pages/QueVerEnMarruecosPage.jsx`).
- New `FEATURED_ROUTES` list with **5 best-selling itineraries**, each referencing existing destination ids:
  1. **Gran Sur · Fez → Marrakech** (`tourGransurFezRak`) — Fez · Sidi Ali · Erg Chebbi · Dadès · Aït Ben Haddou · Marrakech.
  2. **Tánger → Marrakech · Norte a Sur** (`tourGransurTangerRak`) — full N-S transect (7 stops).
  3. **Ciudades imperiales** (`tourNorteCiudadesImperiales`) — Casablanca · Rabat · Meknès · Volubilis · Fez · Marrakech.
  4. **Marrakech ↻ Erg Chebbi ↻ Marrakech** (`tourMarrakechLoopHub`) — classic loop via Aït Ben Haddou + Dadès.
  5. **Tánger · Rif · Fez** (`tourNorteTangerFez`) — Tangier · Asilah · Chefchaouen · Volubilis · Meknès · Fez.
- Toggle row above the map: pill-style chips with route accent dot, fill when active. `aria-pressed` set for accessibility; clicking again deselects.
- Active route renders a **dashed `Polyline`** with the route's accent colour and bumps the affected markers (radius 7→9, opacity 0.7→0.9, weight 2→2.5) so the chosen path stands out without hiding the rest.
- Side panel state machine: destination detail > route detail > hint. Route detail shows accent-bordered card with `RUTA DESTACADA` badge, label, body, numbered stop rail (clickable → swaps to that destination's detail, polyline stays), and a `Ver este viaje` CTA wired to `pathFor(lang, route.routeId)`.
- New testids: `qvm-routes-toolbar`, `qvm-route-chip-{rid}`, `qvm-route-detail-{rid}`, `qvm-route-detail-close`, `qvm-route-stop-{rid}-{i}`, `qvm-route-cta-{rid}`.
- Smoke-verified: 5 chips render, selecting Gran Sur draws polyline + opens the route panel with 6 numbered stops, CTA href correct (`/viajes/gransur/fez-rak`), clicking stop 03 swaps to the Erg Chebbi destination detail with polyline still drawn.

## Destination guide · interactive mini-map (Feb 2026)
- Added a 12-col Leaflet map section just before the final CTA on `/que-ver-en-Marruecos`.
- Module-level `DESTINATION_COORDS` lookup (17 entries, lat/lng) keeps the SECTIONS data untouched and is consumed via `ALL_DESTINATIONS = SECTIONS.flatMap(...)`.
- `MapContainer` renders the CartoDB `dark_all` basemap (matches the page's `#1A1513` palette) with one `CircleMarker` per destination, coloured with its section accent. Active marker grows (radius 7→11) and opacity bumps to 95 %.
- Side panel (5/12) shows either a compass hint card (default) or the selected destination's detail (image · category badge · serif name · blurb · trip chips), each chip a real `<Link to={pathFor(lang, routeId)}>` so SPA navigation is preserved.
- Legend chips below the map list the 6 sections with their accent dots, fully trilingual via the existing `pick()` helper.
- New `data-testid`s: `qvm-map-section`, `qvm-leaflet-wrapper`, `qvm-map-legend-{sid}`, `qvm-map-hint`, `qvm-map-detail-{cid}`, `qvm-map-detail-close`, `qvm-map-trip-{cid}-{i}`.
- Smoke-verified: 17 markers rendered, hint visible by default, click on a marker opens the detail panel with the correct slug (`/viajes/escapadas/marrakech` for Marrakech's first chip), close button resets to hint.

## Destination guide · /que-ver-en-Marruecos (Feb 2026)
- **User mandate**: build an inspirational visual guide for Morocco's must-see destinations, with clickable cards that route via SPA to the existing trips passing through each destination. Editable images/text, responsive, trilingual.
- **New page** `pages/QueVerEnMarruecosPage.jsx` wired to the existing `whatToSee` route (`/que-ver-en-Marruecos` · `/en/what-to-see-in-morocco` · `/fr/que-voir-au-maroc`). Registered in `App.js` (`if (routeId === "whatToSee") return <QueVerEnMarruecosPage />`).
- **Structure**:
  - Cinematic hero with Koutoubia + Atlas, ken-burns + film-grain + berber pattern, inline breadcrumb chip `Inicio › Guías › Qué ver en Marruecos` (i18n).
  - Asymmetric editorial intro (5/7 grid).
  - **6 thematic sections** with 17 destination cards total:
    1. **Ciudades imperiales** (4): Marrakech, Fez, Meknès, Rabat.
    2. **Desierto del Sáhara** (3): Erg Chebbi · Merzouga, Ouarzazate · Skoura, Aït Ben Haddou.
    3. **Atlas y montañas** (3): Alto Atlas, Imlil · Toubkal, Dadès y Todra.
    4. **Norte mediterráneo y Rif** (3): Tánger, Chefchaouen, Asilah.
    5. **Costa atlántica** (2): Essaouira, Casablanca.
    6. **Joyas escondidas** (2): Volubilis, Aguelmane Sidi Ali.
  - Final cinematic CTA band with `Planifica tu viaje` (primary) + `Ver todos los viajes`.
- **Each card** includes: category badge (i18n, accent-coloured), serif name, blurb (full trilingual), and a **vertical list of all relevant trip links** (3–6 chips per destination, total **55 SPA links**). Every chip is a React Router `<Link to={pathFor(lang, routeId)}>` so navigation stays single-page.
- **Editable images mandate respected**: every image uses `<EditableImage>` — the hero (`que-ver-en-marruecos.hero`), final-CTA background (`que-ver-en-marruecos.final.bg`), and each card image auto-resolves via `<SlotScope id="destinations.{section}"><SlotScope id="{card.id}"><EditableImage name="image" />` to `que-ver-en-marruecos.destinations.{section}.{card}.image`.
- **Doc title i18n** handled with `useEffect([lang])` to avoid the recurring `HomePage` bug pattern.
- **`data-testid`s**: `qvm-page`, `qvm-hero`, `qvm-breadcrumbs`, `qvm-intro`, `qvm-section-{sid}`, `qvm-card-{cid}`, `qvm-card-cat-{cid}`, `qvm-trip-{cid}-{i}`, `qvm-final-cta`, `qvm-final-cta-plan`, `qvm-final-cta-tours`.
- **Smoke verified** in browser: ES/EN/FR all render with proper titles, hero, breadcrumb, 6 sections, 17 cards (34 testids: card + category), 55 SPA trip links. SPA navigation confirmed: click `Escapada a Marrakech` from `/en/what-to-see-in-morocco` lands on `/en/tours/short-escapes/marrakech` without page reload.

## Code review · critical & important fixes (Feb 2026)
- **Backend (server.py)** — defensive initialisation for the 3 variables flagged as "possibly undefined on all code paths" (false positives from the linter caused by `try / except → raise HTTPException`, but worth silencing for clarity):
  - `result: Dict = {}` at the top of `replace_library_image()`.
  - `data: bytes = b""; content_type: str = "application/octet-stream"` at the top of `serve_uploaded_file()`.
- **Backend `is` vs `==` comparisons** — intentionally **kept as-is**: all flagged lines (186, 187, 200, 378, 383, 605 in `server.py`, 132 in `test_contact_api.py`) are `is None` / `is not None` checks, which are the official PEP 8 idiom for None comparisons. Switching to `==` would *introduce* lint warnings from Python's own `pycodestyle`.
- **Frontend hook dependency hygiene** — clarified intent with inline comments in `WhenToTravelPage.jsx` (the warnings were false positives caused by local variables / module-level constants the strict linter mis-classified as missing deps). Project's actual ESLint config (CRA default) reports `✅ No issues found` across all touched files.
- **`HomePage.jsx` document.title i18n bug** (recurrence #6, finally **resolved**):
  - Added `useLanguage()` import and trilingual `DOC_TITLES` map.
  - `useEffect` now depends on `[lang]` so the tab title updates correctly when the user switches ES/EN/FR.
- **Array-index-as-key** — fixed all 16 flagged instances across the 4 top-priority pages (`FinDeAno2026Page`, `ToursLandingPage`, `ProximasSalidasPage`, `AtlasDesiertoHubPage`). Each `key={i}` was replaced with a stable derivative (e.g. `key={value}`, `key={pick(item, 'es') + i}`, `key={o.k}`, `key={`upcoming-step-${i}`}`).
- **All 6 affected page URLs** (`/`, `/viajes`, `/viajes/marruecos`, `/viajes/gransur/fez-rak`, `/cuando-viajar`, `/proximas_salidas`) verified HTTP 200 + no runtime errors in DOM.
- **Deferred** for a dedicated refactoring iteration (high regression risk, requires testing-agent run):
  - Backend complexity: `climate_current_month()` (CC 17), `upload_slot_image()`, `upload_library_images()` — touch core business logic.
  - Frontend complexity: `App.js:117` routing (CC 101!) — should move to a separate routing-config file.
  - `BestMonthFab.jsx` and `DayRouteMap.jsx` complex helpers (the latter just rewritten for the universal-gallery mandate).
  - Oversized components: `EditableImage.jsx` (~1330 lines), `ImageEditorPage.jsx` (657), `WhenToTravelPage.jsx` (790), `ImageLibraryPicker.jsx` (424).
  - Remaining ~95 hook-dep strict warnings (all false positives or stable-ref cases).
