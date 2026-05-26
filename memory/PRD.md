# Xaluca Tours — Product Requirements Document

_Last updated: 2026-02 · Initial MVP_

## Problem Statement
Build **Xaluca Tours**, a trilingual marketing site for a bespoke Morocco travel agency that is part of Grup Xaluca. Must inherit the Grup Xaluca design system (editorial · cinematic · slow · earthy · hand-made) and adapt the color palette to desert-inspired hues (sand, terracotta, indigo, gold, sunset orange) with Moroccan imagery and Berber patterns.

## Architecture
- **Frontend**: React 19 + CRA (craco) + Tailwind 3 + shadcn/ui (Radix). Routing via react-router-dom v7. Maps via `react-leaflet` v5 / `leaflet`. Toasts via `sonner`.
- **Backend**: FastAPI + Motor (async MongoDB). Single `/api/contact-requests` collection.
- **i18n**: React Context (LanguageContext) with EN/FR/ES persisted to `localStorage`.
- **State**: pure `useState` + `useEffect`. No Redux/Zustand/React-Query.

## User Personas
1. **Couple/family planning a bespoke trip** — submits an enquiry through the cinematic contact section, expects warm editorial tone.
2. **Returning traveller browsing journal posts** — exploring Featured Journeys and Cultural Experiences.
3. **Operations/Concierge team** — reviews submitted enquiries (`GET /api/contact-requests`) to follow up within 24 h.

## Core Requirements (static)
- Trilingual (EN/FR/ES) every user-facing string.
- Strict adherence to Grup Xaluca design system: Cormorant Garamond + Outfit, cream/charcoal/terracotta palette, 2 px square radius, generous spacing (py-24 to py-32), ken-burns + film-grain on cinematic stages, Berber pattern utilities at low opacity.
- Fully responsive (mobile-first, breakpoints 640/768/1024/1280).
- Reduced-motion respected via `@media (prefers-reduced-motion: reduce)`.

## Implemented (2026-02)
- [x] Hero slider (3 cinematic slides + ken-burns + film grain + overline ticker)
- [x] Featured Journeys (6 curated trips, card grid, currency, duration chip)
- [x] Luxury Camps (3 editorial blocks alternating sides, dark cinematic stage)
- [x] Cultural Experiences (6 tile pattern with icon medallions)
- [x] Testimonials (auto-rotating editorial blockquote)
- [x] Journal (3 article cards)
- [x] Interactive Map of Morocco (Leaflet + 12 marker points + CartoDB editorial tiles)
- [x] Contact form → POST `/api/contact-requests` (validated Pydantic / EmailStr)
- [x] Sticky header + side drawer nav (left, 80vw / 480px)
- [x] Floating EN/FR/ES language switcher (bottom-left)
- [x] Trilingual i18n table for all UI copy + per-record content `{en, fr, es}`
- [x] Berber pattern SVG utilities (diamond, cross, zigzag, watermark) + grain + ken-burns
- [x] Sonner toast on contact submit
- [x] Marquee strip beneath hero

## Backlog (P1 / P2)
- P1: Per-journey detail pages with deeper itinerary, gallery, day-by-day.
- P1: Per-camp detail pages.
- P1: Email notifications for new enquiries (Resend/SendGrid integration).
- P2: Newsletter/journal email capture.
- P2: Concierge chatbot widget (Emergent LLM Key).
- P2: Admin dashboard for /api/contact-requests review.
- P2: SEO meta, Open Graph image, sitemap.xml.

## Next Action Items
1. Validate end-to-end submission flow via testing agent.
2. Iterate on user-supplied imagery once provided.
3. Build journey/camp detail routes when copy is finalised.
