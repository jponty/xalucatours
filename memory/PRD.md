# Xaluca Tours — PRD

## Original Problem Statement
Build "Xaluca Tours", a Moroccan travel agency front. Trilingual (ES default, EN, FR), MongoDB-backed contact, premium cinematic UI inspired by Grup Xaluca (glassmorphism, desert tones, serif typography, berber patterns, ken-burns + film grain).

## Architecture
- React 19 + Tailwind v3 + Shadcn UI · FastAPI · MongoDB
- Trilingual via `LanguageContext` + `lib/routes.js`. ES at root, EN under `/en/*`, FR under `/fr/*`.
- Universal Program template at `components/ProgramTemplate.jsx` powers all desert/atlas program detail pages from `lib/programData.js`.

## Implemented (this session, Feb 2026)
### Journey landing pages
- `/viajes/marruecos` — 4 country-wide itineraries
- `/viajes/nortedemarruecos` — 2 northern itineraries + 2 editorial essays + 6 cities row
- `/viajes/surdemarruecos` — 4 southern itineraries + editorials + brand pillars
- `/viajes/aventura` — adventure narrative + 8 adventure experience cards
- `/viajes/escapadas` — 5 short-escape itineraries
- `/viajesamedida` — 6 tailor-made trip types + 10 sports + 3-step process

### Program detail pages (universal template)
- `/viajes/sur/atlas_desierto` — HUB linking to 6 programmes
- `/viajes/desierto_atlas/programa_6n_7d`, `_5n_6d`, `_4n_5d`
- `/viajes/atlas_desierto/programa_4n_5d`, `_5n_6d`, `_6n_7d`

### Home page navigation
- 5 TravelCategory cards now navigate to corresponding pages via `routeId`:
  - magic-south → `/viajes/surdemarruecos`
  - north-to-south → `/viajes/marruecos`
  - short-escapes → `/viajes/escapadas`
  - northern-morocco → `/viajes/nortedemarruecos`
  - group-departures → `/proximas_salidas`

## Backlog / P1
- Build dedicated `/proximas_salidas` page (currently falls back to StubPage)
- Provide real photo set (Unsplash placeholders today)
- Replace mocked stub-content for non-tour routes (about, contact intermediate, etc.)
- Final integration testing for contact form → MongoDB enqueue
- Mobile QA pass on the 14 newly built pages

## Backlog / P2
- Sticky-nav active-state improvements on long pages
- Sitemap / SEO meta per page
- Replace stock Unsplash imagery with curated Xaluca photo library

## Stack & integrations
- MongoDB enquiries (POST `/api/contact`)
- Leaflet maps (existing components)
- No 3rd-party LLM integrations needed yet

## Key files of reference
- `frontend/src/App.js` · LocalizedRouter wiring of all 20+ pages
- `frontend/src/lib/routes.js` · Trilingual slugs (now incl. tourUpcoming)
- `frontend/src/lib/data.js` · TRAVEL_CATEGORIES with routeIds
- `frontend/src/components/TravelCategories.jsx` · Now uses `Link` when `routeId` present
- `frontend/src/components/ProgramTemplate.jsx` · Universal Atlas/Desert program template (variant "da"/"ad")
- `frontend/src/components/JourneyPageSections.jsx` · Shared hero/stickyNav/itinerary/editorial blocks
- `frontend/src/lib/programData.js` · 6 programmes + day building blocks
- `frontend/src/lib/marruecosItineraries.js`, `norteItineraries.js`, `surItineraries.js`, `aventuraExperiences.js`, `escapadasItineraries.js`

## Testing status
- `iteration_4.json` (Feb 2026): 14 new pages — all rendering, language switcher preserved, all hub-to-program links work, 0 console errors.
- Home category links (5/5) self-tested: all hrefs and click-through to `/viajes/surdemarruecos` verified ✓
