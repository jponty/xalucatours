# Xaluca Tours — PRD / Estado

## Problema original
App full-stack (React + FastAPI + MongoDB) para agencia de viajes a medida por Marruecos, heredando el sistema de diseño premium "Grup Xaluca" (Dark Academia, zellige, acentos dorados #D4A373). Trilingüe (es/en/fr), mapas Leaflet, CMS global editable por slots, audio global persistente, notificaciones por email (Resend), galería Pexels/Unsplash, precios por ruta.

## Arquitectura
- backend/server.py — CMS slots, leads CRUD, files, integraciones, Resend
- frontend/src/lib/{routes.js, routeComponents.js, allTripsCatalog.js, pricing.js, programPricing.js, preciosData.js, homeCarousels.js}
- frontend/src/pages/{PreciosPage.jsx, AdminPage.jsx}
- Idioma por defecto (es) en raíz; en/fr bajo /<lang>/<slug>

## Implementado (jun 2026)
- **Galería visual por día (jun 2026) — COMPLETADO**: En las páginas de programa (`ProgramTemplate.jsx` → `DayBlock`), cada día pasó de 1 imagen a una galería de 6 (1 principal 5/6 + 5 cuadradas 1:1). Nuevo `DayImageGallery.jsx`: visor grande + carrusel horizontal de miniaturas cuadradas, click en miniatura→principal, flechas prev/next recorren las 6, miniatura activa resaltada, swipe en móvil, contador "n/6". Cada imagen es un slot CMS (`day.<id>.image` + `day.<id>.slide.0..4`) dentro de `<EditableGroup>` → editor de galería con subida múltiple (añadir/quitar sin código). EXTRA_COUNT configurable. Verificado por screenshot + interacción (thumb click, prev/next, 5 días).
- **Canal de contacto preferido + "¿Qué sucede después?" (jun 2026) — COMPLETADO**: PlannerForm y ContactForm con bloque "¿Qué sucede después?" y campo obligatorio multi-selección "¿Cómo prefieres que te contactemos?" (📞/✉️). `FormExtras.jsx`. Backend `preferred_contact: List[str]` (coerción str→[str]) + email. Admin: columna "Canal pref.". Verificado (testing agent iteration_30 + curl).
- **Asistente Virtual (Chatbase) ubicuo (jun 2026)**: botones/iconos en TravelCategories, AllTripsCarousel, HomeCategoryCarousel, HubOptionsPreview, DayBlock (con "Contactar" → /planifica-tu-viaje?trip=routeId que pre-rellena el planner). Pestaña "Asistente Virtual" y "Cita previa" (componente reutilizable `BookingSession.jsx`) en `FormTabs` (`Elige cómo contactarnos`). Marca X reposicionada a top-left en HubOptionsPreview para evitar conflicto con el icono de asistente.
- **/precios ampliado (P0) — COMPLETADO**: Sección "Todos nuestros viajes y sus precios". Recorre ALL_TRIPS agrupado por región (TRIP_REGIONS). Cada viaje: nombre (enlace a su itinerario vía pathFor), región, ritmo, nº noches, precio "Desde" y tabla por persona (tramos 2-4 pax existentes) en temporada baja/alta. Usa getProgramTiers() o pricing global/admin. Todo CMS-editable (EditableText). Verificado por screenshot.
- CMS global, catálogo de viajes, Leads Dashboard, audio global, emails Resend con imágenes branded, flipbook Publuu Dark Academia, gestión de emails de notificación en Admin.

## Backlog / Próximas tareas
- P1: Phase 2 Navegación/Linking "Marruecos de norte a sur"
- P1: Phase 3 Navegación/Linking "Escapadas cortas"
- P1: Phase 4 Navegación/Linking "La riqueza del norte"
- P2: Aliases POI no mapeados en textos narrativos (lib/programs/, dayPlaceGazetteer.js)
- P2: Refactor server.py (>2400 líneas) → routers; dividir AdminPage.jsx
- P2: Aliases/redirects para slugs inconsistentes (evitar 404)
- P3: Stripe Checkout en /proximas_salidas

## Credenciales
- /admin password: xaluca (ver /app/memory/test_credentials.md)
