
## CMS: "Editar" abre la biblioteca de imágenes directamente (Feb 2026)
- **User request**: en modo edición, al pulsar "Editar" en una imagen debe abrirse directamente el diálogo de la biblioteca de imágenes, manteniendo disponible el uploader.
- **Implementación**: `EditableImage.jsx` (componente `EditModal`) — `showLibrary` ahora inicia en `true`, de modo que al abrir el editor el `ImageLibraryPicker` aparece directamente sobre él. El uploader queda disponible tanto en el propio picker (Subir varias / Subir carpeta) como en el editor de detrás (subida single/multi + recorte). Al cerrar la biblioteca se vuelve al editor.
- **Validado**: modo edición → clic "Editar" abre "Biblioteca de imágenes" con pestañas (Biblioteca/Pexels/Unsplash/Selección) y botones de subida visibles.


## Galería del día narrativa + Galería del lugar garantizada (Feb 2026)
- **User request 1**: La "Galería del día – El recorrido en imágenes" debe tener exactamente 10 imágenes, en el orden cronológico real del itinerario, derivadas EXCLUSIVAMENTE de los puntos mencionados en el texto del día (ciudades, kasbahs, valles, gargantas, dunas, oasis, actividades, mercados, hoteles, bivouacs, experiencias). Captions de SOLO el nombre. Sin aeropuertos. Lugares importantes pueden repetirse con otra imagen.
- **User request 2**: En el "Mapa del día – Puntos de interés del día", cada POI debe abrir obligatoriamente su "Galería del lugar" con sus 3 cards. Algunos POIs no abrían porque no tenían cards asociadas.
- **Implementación**:
  - NUEVO `lib/dayNarrativeGallery.js`: extractor narrativo global. `buildDayNarrativeGallery(day)` escanea `day.body.es` contra un léxico (lugares del gazetteer + actividades/experiencias + alojamientos), ordena por aparición en el texto, excluye aeropuertos/contexto de vuelo, y devuelve exactamente 10 cells con captions name-only (trilingües) e imágenes temáticas verificadas del `imageBank`. Si hay <10 puntos, repite los puntos en orden con imagen alternativa.
  - `components/DayGallery.jsx`: ahora usa `buildDayNarrativeGallery(day)` (useMemo) en lugar de las galerías estáticas. Fallback a `DEFAULT_DAY_GALLERY`.
  - NUEVO `lib/placeGalleries.js`: `buildPlaceGallery(entry)` garantiza SIEMPRE 3 cards: (1) galería propia de CITY_PROFILES vía `profileKey` o `ALIAS_PROFILE` (enlaza imlil/toubkal/mgoun/tinerhir/ziz/draa/dades/atlas/antiatlas/merzouga/boumalne a perfiles existentes), (2) `CURATED_PLACE_CARDS` (14 lugares sin perfil: moulayidriss, midelt, ouzoud, rif, boutaghrar, rosevalley, fossils, zagora, cabospartel, grutashercules + 4 alojamientos), (3) fallback temático por `kind` (nunca vacío).
  - `lib/dayPlaceGazetteer.js` `buildLandmark`: `gallery: buildPlaceGallery(entry)` (antes `null` cuando no había perfil).
  - Limpieza: eliminado `lib/dayGalleriesGenerated.js` (558 líneas, código muerto).
- **Validado** (Playwright e2e, ES+FR): 6 galerías del día con 10 imágenes en orden narrativo correcto; 21/21 POIs abren su carrusel con exactamente 3 cards. Todo CMS-editable (mismos slots por índice).


## Sincronización CMS entre entornos (export/import sin redeploy) (Feb 2026)
- **User request**: script de export/import de slots CMS para sincronizar producción con las ediciones del preview con un clic, sin depender del redeploy de la BD.
- **Backend** (`server.py`):
  - `GET /api/cms/export` (lectura): devuelve `image_slots` + `text_slots` + `pricing` con metadatos y counts (datetimes a ISO).
  - `POST /api/cms/import` (protegido por token admin Bearer): upsert por `_id` de image/text slots + pricing; relativiza URLs propias al importar; flag `wipe` para espejo completo.
- **Script** `scripts/sync_cms.mjs` (Node):
  - `sync --from <SRC> --to <DST> --password <pwd>` → un comando: export del origen + import al destino.
  - `export --from <URL> --out file.json` y `import --to <URL> --in file.json --password <pwd>`.
  - Defaults: `--from` = REACT_APP_BACKEND_URL (preview); `--password` = backend/.env ADMIN_PASSWORD. Flag `--wipe` opcional.
- Las imágenes (binarios) viven en object storage COMPARTIDO entre entornos → basta sincronizar los registros de la BD.
- **Verificado**: export (311 img + 19 txt + pricing); import sin auth → 401; `sync` preview→preview idempotente OK; modo fichero export/import OK. 10 tests pytest pasan (`test_cms_sync.py` + relativize + slot_usage).


## Garantía de persistencia y frescura del CMS en producción (Feb 2026)
- **User request**: asegurar que en la versión publicada (no solo preview) toda edición de imagen/texto se guarde en BD y persista tras refrescos, sesiones nuevas, despliegues y otros dispositivos, sin revertir.
- **Auditoría/verificación**:
  - Texto: PUT `/api/text_slots/{slot}` → GET single + bulk → persiste en MongoDB. Verificado E2E real desde la UI (editar título de galería en modo texto → guardar en blur → recargar → valor persistido en BD).
  - Imagen: ya cubierto por el fix de URLs relativas (sesión previa) + persistencia en BD.
- **Fix de frescura (clave para "consistente entre dispositivos/refrescos")**: middleware backend `no_store_for_dynamic_api` que añade `Cache-Control: no-store, no-cache, must-revalidate` (+ Pragma/Expires) a TODOS los endpoints de datos `/api/...`, EXCEPTO los binarios de imagen `/api/files/*` y `/api/uploads/*` (que conservan su caché larga para rendimiento). Antes, en producción `/api/slots` y `/api/text_slots` no enviaban `no-store`, lo que podía hacer que un navegador sirviera datos CMS obsoletos.
- **Verificado (headers crudos backend)**: `/api/slots` → `no-store`; `/api/files/...` → `public, max-age=86400` (caché intacta); `/api/uploads` → estático. Lint PY limpio. 41 tests relevantes pasan.
- **Nota**: efectos en producción tras **redeploy**. Los datos viven en MongoDB → sobreviven a despliegues.
- **Pre-existente (fuera de alcance)**: `tests/test_text_slots_reset.py` (3) falla porque el endpoint DELETE de "Restablecer texto original" nunca se implementó (ni el frontend lo invoca). No afecta a la persistencia de guardados.


## FIX: imágenes CMS revertían a fallback (URLs absolutas con dominio incrustado) (Feb 2026)
- **Síntoma**: al subir o seleccionar imagen (Pexels/Unsplash) en modo edición, las imágenes revertían a la versión fallback. Observado en producción.
- **Causa raíz**: los imports de Pexels/Unsplash guardaban la URL del slot ABSOLUTA (`${origin}/api/files/...`) con el dominio incrustado. Al desplegar el contenido del preview a producción, varios slots quedaban apuntando al dominio del PREVIEW (`https://morocco-trips-2.preview.emergentagent.com/...`). En producción, esa carga cross-domain fallaba y `<SmartImage>` (handleError) revertía automáticamente al fallback del código → "todas las imágenes vuelven a fallback".
- **Diagnóstico**: preview funcionaba (subida/guardado OK y persistía); producción servía imágenes con 200; pero `/api/slots` tenía 14 (prod) / 18 (preview) slots con URL absoluta, algunos con el dominio del preview. Los mismos ficheros cargan 200 por ruta RELATIVA en producción (storage compartido).
- **Fix (domain-independent)**:
  - Backend `server.py`: helper `_relativize_url()` que convierte cualquier URL propia `https?://host/api/...` → `/api/...` (las CDNs externas como images.unsplash.com/pexels.com se dejan intactas). Aplicado al ESCRIBIR (`PUT /slots`) y al LEER (`GET /slots` lista + `GET /slots/{id}`), por lo que TODOS los slots existentes con URL absoluta se sirven ya relativos sin migrar la BD.
  - Frontend `EditableImage.jsx`: helper `toRelativeUrl()` en `useLibraryImage` (defensa adicional al guardar).
- **Verificado**: `/api/slots` ya devuelve 0 URLs absolutas propias; PUT con URL absoluta se guarda relativa; CDNs externas intactas; los ficheros cargan 200 por ruta relativa en producción. 7 tests pytest pasan (`tests/test_relativize_slots.py` + `test_slot_usage.py`). Lint JS/PY limpio.
- **Nota**: el fix está en código; en producción surtirá efecto tras **volver a desplegar**.


## Precios por-programa (tarifas distintas por itinerario) (Feb 2026)
- **User request**: aplicar precios DISTINTOS a 6 itinerarios Atlas↔Desierto (el sistema antes solo tenía un precio global).
- **Nuevo** `lib/programPricing.js`: matriz de tarifas por `routeId` (`[{people, low, high}]`, low=Temporada baja, high=Temporada alta). `getProgramTiers(routeId)` devuelve la tarifa propia o `null` (fallback al precio global).
- **`PricingSection.jsx`**: nueva prop `routeId`; usa `getProgramTiers(routeId) || pricing.tiers` para la matriz y recalcula el "Desde" por programa.
- **`ProgramTemplate.jsx`**: pasa `routeId` (de `resolvePath`) al `PricingSection`.
- Rutas configuradas: tourAtlasDesierto45 (1010/1085·865/920·790/835), AtlasDesierto56 (1255/1350·1075/1145·985/1045), AtlasDesierto67 (1430/1535·1215/1295·1105/1170), DesiertoAtlas45 (=45), DesiertoAtlas56 (1230/1325·1050/1120·960/1020), DesiertoAtlas67 (=67).
- En código (no DB) → se despliega limpio a producción. Las rutas no listadas siguen con el precio global/admin. Texto de temporadas/observaciones sin cambios (global, ya coincide en significado).
- **Verificado** (screenshots): las 6 rutas muestran sus tarifas correctas y distintas; "Desde" recalculado. Lint JS limpio.


## Imágenes reales de Unsplash en las 40 tarjetas de "viajes disponibles" (Feb 2026)
- **User request**: actualizar las imágenes de TODAS las tarjetas de la sección "40 viajes disponibles" (Home) con fotos reales y relevantes de Unsplash por itinerario.
- **Script** `scripts/fill_alltrips_unsplash.mjs`: mapea cada `routeId` a un tema (dunas, kasbah, Atlas, camello, Marrakech, Koutoubia, Essaouira, Fez, curtiembre, Chefchaouen, Meknes, Volúbilis, Tánger, gargantas, Agafay, enduro, fin de año). Hace 1 búsqueda por tema (cacheada, `orientation=landscape`), reparte fotos ÚNICAS por tarjeta (dedupe por id), descarga el JPEG recortado 4:3 del CDN de Unsplash y lo sube al slot `home.all-trips.{routeId}` vía `POST /api/slots/{slot}/upload` (auto-hospedado).
- **Rate-limit aware**: la clave Unsplash es DEMO (50/h). Solo las ~17 búsquedas consumen cuota; las 40 descargas van por CDN (sin cuota). Resultado: **40/40 tarjetas actualizadas** en una pasada.
- Relevancia verificada: Volúbilis → viaje con Volúbilis, Chefchaouen → Tánger/Rif, patio imperial → Ciudades Imperiales, Atlas/dunas/camello según ruta. 1 sola repetición (tema "dunes" con 4 fotos landscape para 5 usos).
- **Verificado** (screenshot Home): 40 tarjetas renderizadas, 12/12 imágenes muestreadas cargadas (naturalWidth>0). Imágenes auto-hospedadas vía `/api/files` (robustas).
- **Nota deploy**: las imágenes se guardan como slots CMS en la base de datos (igual que el resto del sitio). Para verlas en producción hay que volver a desplegar.


## "Mapa del día – Puntos de interés del día" totalmente editable (Feb 2026)
- **User request**: hacer 100% editable desde el modo edición la sección del mapa del día (títulos, descripciones, nombres de POIs, contenido de desplegables, textos asociados, imágenes, galerías). Criterio general: todas las secciones de todas las páginas deben ser editables sin excepciones.
- **`DayRouteMap.jsx`** (3 tiers: landmarks / waypoints / stay) instrumentado con `<EditableText>`:
  - **Chrome de sección (slots GLOBALES `daymap-ui.*`)**: eyebrow "Mapa del día", títulos ("Puntos de interés del día", "Etapas del trayecto", "Día sin desplazamientos", no-data), label "Progreso del viaje", "Día" del ProgressBar, palabras de conteo (punto destacado/etapa/km aprox.), cuerpos editoriales de estancia/no-data, "En". Helpers `<UI k>` y `UI_DEF` (trilingüe).
  - **Etiquetas de tipo (taxonomía, GLOBAL por tipo `daymap-ui.kind.{kind}`)**: leyenda del mapa + kind de cada POI en la lista lateral, sincronizados.
  - **Contenido por POI (page-scoped vía `useSlotId("daymap")`)**: nombre (`{base}.lm/.wp/.stay.{id|i}.name`) y descripción del desplegable (`...blurb`). En el modo estancia, el indicador "En {lugar}" y el nombre de la lista comparten slot (sincronizados).
  - Las galerías del mapa (LandmarkCarousel) ya eran editables (tarea anterior). Tooltips de Leaflet quedan como display (reflejan el nombre).
- Sin cambios de backend (reusa `EditableText` → `/api/text_slots`). Limpieza de props `t`/`lang` sin uso en los tiers.
- **Verificado** (screenshot en modo texto, Tier 1): eyebrow+título+progreso editables, 31 etiquetas de tipo, 16 nombres de POI, blurb editable al seleccionar un POI. Lint JS limpio. Tiers 2/3 mismo patrón, página renderiza sin errores.


## Textos editables en "Galería del día" y "Galería del lugar" (Feb 2026)
- **User request**: en las páginas de viaje, hacer editables desde el modo edición de texto TODOS los textos de ambas galerías (títulos, subtítulos, descripciones, captions, textos superpuestos y cualquier texto asociado a las imágenes).
- **`DayGallery.jsx` (Galería del día)**: eyebrow + título de sección → `<EditableText>` con slots GLOBALES (`gallery-ui.day.eyebrow`, `gallery-ui.day.title`, una edición aplica a todas las páginas). Por imagen: kind (`{base}.{i}.kind`) + caption (`{base}.{i}.caption`) page-scoped vía `useSlotId`. El lightbox comparte los mismos slots que la grid (editar uno actualiza ambos). `pointer-events` del overlay y `line-clamp` se desactivan en modo texto; el botón de tile no abre el lightbox mientras se edita.
- **`LandmarkCarousel.jsx` (Galería del lugar)**: eyebrow de sección (`gallery-ui.place.eyebrow`) y helper del hint (`gallery-ui.place.helper`) globales; por tarjeta: kind (`{slot}.kind`), título (`{slot}.title`) y descripción (`{slot}.desc`) page-scoped. `pointer-events` del badge de kind se reactiva en modo texto.
- Persistencia vía la infra existente `EditableText`/`/api/text_slots` (sin cambios de backend). Captions independientes por URL de itinerario; chrome de sección compartido.
- **Verificado** (2 screenshots en modo texto): Galería del día → eyebrow+título+70 captions+70 kinds con anillo de edición; Galería del lugar → eyebrow+helper+3 títulos+3 descripciones+3 kinds editables. Lint JS limpio.


## Image Usage Tracker — "Dónde se usa esta imagen" en el editor (Feb 2026)
- **User request (msg 10)**: al seleccionar una imagen en el editor, mostrar en qué páginas/secciones se usa esa misma foto en todo el sitio.
- **Backend**: nuevo endpoint `GET /api/slots/{slot_id}/usage` (server.py) — lee la imagen del slot (`storage_path`/`url`) y devuelve todos los slots que renderizan la misma foto, con flag `is_current` y el slot actual primero. Reusa el patrón de matching de `/api/files/{id}/usage`. Añadido `import re` a nivel de módulo.
- **Frontend**: nuevo componente reutilizable `components/SlotUsagePanel.jsx` (panel + `describeSlot()` que mapea slot_id → página legible + sección + href). Maneja slots page-namespaced (`viajes/gransur/fez-rak.hub…` → `/viajes/gransur/fez-rak`) y prefijos literales (`home.* → Inicio`, `surdemarruecos.* → Sur de Marruecos`, etc.). Enlaces "Ver" abren la página en pestaña nueva (no se pierden los borradores del editor).
- **Integrado** en el editor real `EditModal` (dentro de `EditableImage.jsx`, el panel deslizante que ve el usuario en modo edición) y también en la página huérfana `ImageEditorPage.jsx` (DRY).
- Aviso contextual: si la imagen se usa en >1 ubicación, banner ámbar "Atención: esta imagen se usa en N ubicaciones… cada espacio es independiente"; si solo se usa ahí, mensaje tranquilizador.
- **NOTA**: `ImageEditorPage.jsx` (ruta `/image-editor`) NO está enrutada en `App.js`/`routeComponents.js` — es código huérfano; el editor real es el `EditModal` de `EditableImage`.
- **Verificado**: 3 pytest `tests/test_slot_usage.py` (sin uso / único / compartido) PASS; screenshot real del `EditModal` muestra el panel (1 ubicación, badge "Aquí", enlace "Ver"). Lint JS/PY limpio.


## Pexels auto-fill of Day Galleries — stage-specific imagery + captions (Feb 2026)
- New re-runnable script `scripts/fill_day_galleries_pexels.mjs` (Node 20): loads `programData.js` + `dayLandmarks.js`, and for each of the 46 itinerary days builds 10 cells with **real Pexels photos** matched to the stage and **trilingual overlay captions reused from the day's own content** (landmark names → culture titles → day title → themed fills built from the day's main place). Pexels queries are derived from place names + theme; results cached per query (110 unique queries) to respect rate limits.
- Output: `frontend/src/lib/dayGalleriesGenerated.js` — `DAY_GALLERIES_GENERATED` keyed by `route_id`, 460 cells, **all 460 from Pexels (0 fallbacks)**.
- `DayGallery.jsx` priority: `DAY_GALLERIES_GENERATED[route_id] || DAY_GALLERIES[route_id] || DEFAULT_DAY_GALLERY`. Each cell stays CMS-editable per day/URL via its slot.
- Captions match the stage (e.g. Marrakech day → "Djemaa el-Fna al caer la tarde", "Vivir en un riad de la Medina", "Aeropuerto Menara de Marrakech"…). Verified: 70/70 gallery imgs on a 7-day program resolve to `images.pexels.com`, 0 broken; lint clean. Re-run the script anytime to refresh imagery.

## Day Gallery on ALL itineraries (Feb 2026)
- The "Galería del día · El recorrido en imágenes" section now appears on **every day of every trip page**. `DayGallery` is already rendered per day in `ProgramTemplate`; it previously returned `null` for the ~41 of 46 days without a curated gallery.
- Added `DEFAULT_DAY_GALLERY` (10 square, clickable, CMS-editable images with trilingual captions covering varied themes: landscapes, medina, route, Atlas, kasbahs, desert, food, stay, souks, oasis) in `dayGalleries.js`.
- `DayGallery.jsx`: `images = DAY_GALLERIES[day.route_id] || DEFAULT_DAY_GALLERY`; slot base hardened to `day.${route_id || id}.gallery`. Curated days keep their specific images; all others get the default (still editable per day).
- Verified on Marrakech–Essaouira 6n/7d (previously 0 galleries): 7 day galleries × 10 square tiles each. Lint clean.

## Day Gallery → clickable + square tiles (Feb 2026)
- Re-enabled click-to-enlarge: tiles are now `<button>` (cursor zoom-in) that open the image in a **larger format lightbox** with prev/next, close and keyboard (Esc / ← / →) navigation. The `Maximize2` hover icon hints clickability.
- Changed the layout from the asymmetric wide collage to a **uniform square grid** (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`, `aspect-square` tiles) so images read square rather than narrow/rectangular. Still 10 images per day; each tile + lightbox share the same CMS slot.
- Verified on `/viajes/atlas_desierto/programa_6n_7d`: 10 square `BUTTON` tiles (w/h ratio 1.00), click opens lightbox, close/next work. Lint clean.

## Day Gallery → 10 static, non-clickable images (Feb 2026)
- Expanded the per-day gallery on individual itinerary pages from 6/7 to **10 images** for a richer visual overview. Added 3-5 new themed entries (verified Moroccan Unsplash, trilingual captions + kind) to each of the 5 galleries in `dayGalleries.js`.
- `DayGallery.jsx`: rewrote as a **purely visual, static** collage — removed the Lightbox entirely (no pop-up, expansion, keyboard nav or image switching). Tiles are now non-interactive `<figure>` elements (no `onClick`, no `cursor-zoom-in`, no hover-zoom). Removed unused state/imports (`useState`, `useEffect`, `X`, `ChevronLeft/Right`).
- Extended the asymmetric `LAYOUT` to 10 cells that tile the 6-col grid perfectly. Each tile keeps its CMS-editable slot (`day.${route_id}.gallery.${i}`).
- Verified on `/viajes/atlas_desierto/programa_6n_7d`: 10 `FIGURE` tiles, no lightbox in DOM, `cursor:auto`, clicking a tile does nothing. Lint clean.

## CTA routing fixes (Feb 2026)
- **"Planificar mi viaje"** buttons now link to `/planifica-tu-viaje` (route `planTrip`): Header CTA (removed old scroll-to-contact handler + cleaned unused `useNavigate`/`useLocation`), Home hero primary CTA (`<a href="#contact">` → router `Link`), Footer CTA, and the Community/PersonalConsultation CTA. StubPage primary CTA too.
- **"Pedir asesoramiento"** buttons now link to `/citaprevia` (route `appointment`): the JourneyHero `secondaryCta` on Sur, Norte, Escapadas, Aventura, Marruecos, Próximas Salidas, Atlas-Desierto hub and `ItineraryHubPage`. `JourneyHero` now renders a router `Link` when `secondaryHref` is an internal route (starts with `/`), else a plain anchor.
- ViajesAMedida secondary ("Crear mi viaje") and "Más información" (`cta_info`) buttons left unchanged. Verified via DOM checks: all 4 plan CTAs → `/planifica-tu-viaje`; Sur hero secondary → `/citaprevia`. Lint clean.

## Hero background video → clean, chrome-free (Feb 2026)
- Reworked the Home hero background video (`HeroSlider.jsx`) from a static `youtube-nocookie` iframe to the **YouTube IFrame Player API** (same proven pattern as `ToursVideoSection`).
- No YouTube chrome at all: `controls=0`, `modestbranding`, `rel=0`, `disablekb`, `fs=0`, iframe `pointer-events:none` + `aria-hidden`/`tabindex=-1` (no hover title bar, share/watch-later buttons or clicks).
- Muted autoplay + seamless loop driven by the API (`onReady` → mute+play, `onStateChange` ENDED → seek(0)+play). End-screen / related-video grid suppressed by looping back ~1.2s before the clip ends (400ms poll).
- Iframe over-scaled with `scale-[1.35]` inside the aspect-cover wrapper so the title bar (top) and any progress/branding (bottom) are cropped outside the frame. Brand gradient + berber + grain overlays unchanged.

## Travel postcard editorial block · /viajes (Feb 2026)
- Added an emotional **postcard block** inside the "Marruecos, explorado a tu manera" intro section (`TravelPostcard` in `ToursLandingPage.jsx`).
- Aged-paper card (rotated, tape corners, faint berber texture), handwritten **Caveat** font (`.font-hand`), "POSTAL DESDE MARRUECOS" label, handwritten tagline "El viaje lejano más cercano", greeting + 2-paragraph message + "Nos vemos en el camino." + "Xaluca Tours" signature.
- Perforated postage stamp with CMS-editable image (slot `viajes.postcard.stamp`, fallback Sahara dunes) + circular ink postmark (plane + destination). Trilingual copy in `COPY.postcard` (es/en/fr).
- Added `Caveat` Google font import + `.font-hand` / `.postcard-*` styles in `index.css`. Verified via screenshot (stamp renders, all elements visible); lint clean.

## Legacy <img> → EditableImage migration · global editability (Feb 2026)
- Migrated all editorial raw `<img>` tags to `<EditableImage>` so 100% of content images are CMS-editable. Guardrail `lint-no-native-img.sh` now passes (0 violations outside allow-list).
- Converted images in: ToursLandingPage hero, ProximasSalidas departures, WhenToTravel hero + season blocks, ViajesAMedida types, SurPage cards, AventuraPage experiences, PlanificaTuViaje hero, QueVer map detail, FinDeAno hero/day/contact, EscapadaIntroPage hero+gallery (passed `routeId`), HubPeerNav peers, SectionGallery grid, JourneyPageSections (ItineraryBlock/EditorialBlock via `useSlotId`, ItinerariesOverview literal slots).
- Slots use page/section-scoped ids (e.g. `proximas.departure.${id}.image`, `escapada.${routeId}.hero`). All overlays add `pointer-events-none`.
- **Deleted 4 dead unused components**: FeaturedJourneys, CulturalExperiences, JournalSection, LuxuryCamps.
- Allow-listed intentional raw imgs: HeroSlider logo, ToursVideoSection poster, UnsplashTab/PexelsTab admin UI, SectionGallery lightbox, StubPage placeholder, AdminPage/ImageEditorPage.
- Verified: edit mode shows overlays on converted slots (6 departure overlays), 0 broken images across pages, lint clean.

## Recommended itineraries → card carousel · /cuando-viajar (Feb 2026)
- The "Itinerarios recomendados" subsection inside each of the 4 "Cuatro estaciones" blocks was upgraded from a simple vertical link list into a **horizontal card carousel** (`SeasonRecommendedCarousel` in `WhenToTravelPage.jsx`).
- Each card shows: CMS-editable image (`EditableImage` slot `when-travel.season.{id}.reco.{i}`, 4:3, fallback from verified `imageBank.js`), region badge with `MapPin` (season accent), serif title, short trilingual description, duration with `Clock` icon, dynamic **"Desde €X por persona"** via the centralised `<FromPrice tone="dark">`, and an accent CTA button → `pathFor(lang, route)`.
- `lib/bestTimeData.js`: each `recommended` item enriched with `image`, `duration`, `region`, `desc` (all trilingual). 12 items across spring/summer/autumn/winter.
- Carousel: `overflow-x-auto` + scroll-snap; desktop prev/next arrow buttons (`season-recommended-prev/next-{id}`) scroll by one card width. Cards are 260–280px, snap-start.
- Testids preserved/added: `season-recommended-{id}`, `season-recommended-{id}-{i}` (now on the card), `season-recommended-cta-{id}-{i}`, `season-recommended-prev/next-{id}`.
- Note: pricing is global (single configured "from" price, /admin-editable) per user confirmation — all cards show the same "Desde" value by design.
- Verified via screenshot: spring shows 3 cards, region badges, durations, "Desde €790 por persona", working nav arrows; lint clean.

- Per agency policy (travellers welcome year-round), reframed the "Avoid months" concept into neutral seasonal guidance across the "When to Travel" page and the "Best month for my trip" panel (`BestMonthFab`).
- `lib/bestTimeData.js`: the per-region `avoid` values now describe seasonal characteristics instead of months to skip (e.g. "Jun–Ago: calor intenso de día", "Dic–Feb: mar fresco para el baño"). Narrative bodies for the desert travel-style and the "cheapest months" FAQ were rewritten to suggest alternatives (Atlas/coast) rather than telling users to skip months.
- Label renamed everywhere from "Evita / Avoid / À éviter" → "A tener en cuenta / Good to know / À noter" (`WhenToTravelPage.jsx` COPY.labels.avoid, `BestMonthFab.jsx` COPY.avoid + intro). No red/warning iconography. Visual tone stays neutral.
- Verified on `/cuando-viajar`: no "Evita/Avoid/À éviter" remains; cards/map popup show the reframed label + values.
- **Recommended itineraries per season** (Feb 2026): inside the "Cuatro estaciones" section, each season block now has an "Itinerarios recomendados" subsection (`season-recommended-{id}`) listing 3 concrete program itineraries linking to real `programa_*` pages — new `recommended` array per season in `SEASONS` (spring→Atlas&desert/imperial/Erg Chebbi, summer→Essaouira coast/Imperial&Rif/Imperial, autumn→Fez–Marrakech grand route/Erg Chebbi/Atlas&desert, winter→Erg Chebbi/Imperial/Desert&Atlas). Trilingual labels. Verified: subsections render under all 4 seasons with correct hrefs; lint OK.

## /juego — interactive gamified Morocco explorer (Feb 2026)
- New public page at `/juego` (en: `/en/game`, fr: `/fr/jeu`) — registered in `routes.js`, `routeComponents.js`, and linked from the side menu (`menu-link-juego`).
- **Concept**: users tick off Moroccan places they've visited/know across 9 categories (Regiones, Ciudades, Pueblos y Kasbahs, Desiertos, Montañas y Valles, Playas y Costa, Monumentos e Historia, Atracciones, Experiencias Clave). 73 curated trilingual places in `lib/juegoData.js`, each tagged with a region + (most) map coords.
- **Gamification**: 6 levels/badges unlocked by overall exploration % — Explorador Principiante (0%), Viajero Curioso (10%), Aventurero del Atlas (30%), Nómada del Desierto (50%), Conquistador de Marruecos (75%), Leyenda de Marruecos (100%). Level-up shows a celebration banner.
- **Dashboard**: hero progress ring (total %), stat cards (exploration %, places X/73, regions completed X/6, current badge), visual rank stepper (6 levels + progress-to-next bar), interactive Leaflet map (CartoDB light) where clicking a marker toggles visited (synced with category chips), and per-category progress bars. Reset button with confirm.
- **Persistence**: client-side only — localStorage key `xaluca_juego_visited_v1` (no login; chosen by user). Personal visual rank (no global leaderboard).
- **Files**: `pages/JuegoPage.jsx`, `lib/juegoData.js`; route/menu wiring in `lib/routes.js`, `lib/routeComponents.js`, `lib/menu.js`.
- Verified by testing agent (iteration_23): 100% — load, toggle+stats, persistence, level-up @10%, reset, trilingual routing, menu link. No bugs.
- **Visual cards upgrade** (Feb 2026): the selection pills were replaced by visual selectable cards — each with a representative image (`EditableImage`, CMS-editable, slot `juego.{id}.image`, lazy 4:3), clear title and a short trilingual description (educational/exploratory). Selection state is obvious (terracotta border + check badge + "Marcado" ribbon; unselected cards are dimmed). Whole card toggles on click. 73 representative images sourced via the Pexels API (one per place, baked as `image` fallbacks in `juegoData.js`); each place also gained a trilingual `desc`.

## /viajes region map · video section · carousel editability · per-page image slots (Feb 2026)
- **P0 — Independent image slots per program page**: program images were sharing CMS slots across itineraries that reuse the same `route_id`/`day.id` (text was already page-scoped). Fixed by namespacing all program image slots with the page URL via `useSlotId`:
  - `ProgramTemplate.jsx`: hero now `useSlotId("hero")` (previously `${tripKey}.hero` with `tripKey` undefined → ALL heroes shared `undefined.hero`); day image now `useSlotId(`day.${day.id}.image`)`.
  - `DayGallery.jsx`: gallery cells now `${useSlotId(`day.${route_id}.gallery`)}.${i}`.
  - `LandmarkCarousel.jsx`: day-map gallery now `${useSlotId(`landmark.${id}.gallery`)}.${i}`.
  - Verified by testing agent (iteration_22): zero slot overlap between two programs sharing a location; images still render.
  - NOTE: prior edits stored under the old shared ids no longer surface (expected; fallbacks render).
- **Home carousels fully editable in image edit mode**: `CategoryImageCarousel.jsx` (TravelCategories) was unfixable in edit mode — autoplay kept rotating and all stacked slides intercepted clicks (topmost/hidden slide caught them). Fix mirrors the working `EmotionalIntro` pattern: autoplay pauses while `editMode` is on; only the active slide is `pointer-events-auto`; arrows/dots got `data-edit-allow="true"`, `z-[50]` and stay visible in edit mode. `HomeCategoryCarousel`/`AllTripsCarousel` already had `data-edit-allow` and non-stacked cards (no change). Verified by testing agent (iteration_22): visible slide's overlay opens the editor for its own slot; nav works in edit mode.
- **/viajes inspirational video section** (`ToursVideoSection.jsx`): new premium rounded card inserted between the "Una aventura, un país" intro and the regions block. Embeds YouTube `nzD3e3Qr7g8` via the **YouTube IFrame Player API** with `controls:0, modestbranding:1, rel:0, disablekb:1, fs:0` — NO YouTube chrome. Custom controls only: center play (`viajes-video-play`), bottom play/pause (`viajes-video-toggle`), mute (`viajes-video-mute`), plus a transparent click-to-toggle layer. Cover poster (maxres thumb) with fade-in, skeleton while booting, stable `aspect-video` (no layout shift), iframe `title` set for a11y. Verified (iteration_22 + smoke): renders ES `/viajes` + EN `/en/tours`, controls wired.
- **/viajes interactive region map** (`ToursRegionMap.jsx`): placed within the "Una aventura, un país" section (cream `#FDFBF7`, connects to the intro). Leaflet light CartoDB basemap with 6 region `CircleMarker`s (Norte, Ciudades Imperiales, Costa Atlántica, Atlas y valles, Desierto del Sáhara, Sur). Hover/click a marker OR a region chip → flyTo + an editorial detail card updates with: name, description, highlighted experiences (chips), related itineraries (SPA links), and a "Ver viajes de {región}" CTA to the region route. Trilingual. Testids: `viajes-region-map`, `region-map-chip-{id}`, `region-map-card-{id}`, `region-map-exp-{id}-{i}`, `region-map-itinerary-{id}-{i}`, `region-map-cta-{id}`. Smoke-verified: chip switch updates card + CTA + experiences + itineraries.
- **CMS text-edit wiring for the new blocks** (Feb 2026): the video section and region map copy are now editable via the header "Editar texto" mode using `EditableText` with dedicated trilingual slots. Video: `viajes.video.eyebrow|title|caption`. Region map section: `viajes.region-map.eyebrow|title|helper`. Per zone: `viajes.region-map.{id}.desc` and `viajes.region-map.{id}.exp.{i}` (these swap with the active region). Zone names, itinerary labels and CTAs intentionally stay data-driven so the chip/marker/CTA labels remain in sync. Verified in text-edit mode: all editable-text surfaces render for both blocks.
- **Region map live trip counter** (Feb 2026): each region card shows a "{n} itinerarios disponibles" badge (`region-map-count-{id}`) computed from the live `ROUTES` registry — every `programa_*` route is assigned to a single zone by `zoneForPath` (path-prefix rules), so counts auto-update with the data. Current real counts: Norte 6 · Ciudades Imperiales 8 · Costa Atlántica 2 · Atlas y valles 6 · Desierto del Sáhara 23 · Sur de Marruecos 22 (67 itineraries total). Trilingual singular/plural. Verified via smoke test across all six zones.
- **Region map embedded on all zone landing pages** (Feb 2026): `ToursRegionMap` now also renders (before `<ContactForm/>`) on `MarruecosPage`, `NortePage`, `SurPage`, `AventuraPage`, `EscapadasPage`. Added props `defaultZone` (preselects the page's zone: Sur→south, Norte→north, Aventura→sahara, Marruecos/Escapadas→north) and `topPadClass` (zone pages use `pt-20 md:pt-28` for standalone spacing; `/viajes` keeps the connected `pt-4`). EditableText slots are literal (`viajes.region-map.*`) so map copy stays consistent across every page. Verified on all five routes: section + correct default card + counts render.

## /citaprevia page (book-appointment) (Feb 2026)
- **User request**: complement the `/citaprevia` page with the provided 3-step copy + the Calendly integration accesses.
- The `appointment` route (`citaprevia` / `book-appointment` / `prendre-rendez-vous`) existed in routes.js but was unmapped. Now wired to a new **`CitaPreviaPage.jsx`** in routeComponents.js.
- **New page** `pages/CitaPreviaPage.jsx` (SlotScope id="citaprevia", trilingual, fully `<E>`-editable): hero ("Planifica tu próxima aventura por Marruecos" + intro paragraph), **3 detailed steps using the user's exact ES copy** (1·Planifica tu próxima aventura → 2·Selecciona el día y hora → 3·Confirma la sesión), a **Calendly booking surface with phone/office tabs**, and an outro CTA to /contacto + phone. Hero image priority-loaded; SEO keywords injected as a `<meta name=keywords>`.
- **DRY refactor**: extracted the Calendly bootstrap + inline-widget into shared `components/CalendlyEmbed.jsx` (`useCalendlyScript`, `CalendlyEmbed`, `CALENDLY_PHONE`, `CALENDLY_OFFICE`). `ContactPage.jsx` now imports from it (removed ~50 lines of duplicate); its booking testids/behaviour unchanged.
- **Verified** (smoke test): /citaprevia renders page+hero+3 steps+booking+2 tabs, document.title correct; Calendly phone embed loads (1 iframe) and switching to the office tab loads the office widget; /contacto booking still loads its iframe (no regression). Uses the existing Calendly account URLs (xalucatours/cita-previa-telefonica & -oficinas) — no new keys.


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


## CMS Sync UI + DELETE text-slot reset endpoint (Feb 2026)
- **DELETE `/api/text_slots/{slot_id}`** implemented in `server.py`. Supports `?lang=<es|en|fr>` to clear a single language (deletes the doc when no langs remain) or no param to remove the whole slot. Powers the "Restablecer texto original" button. Fixes 3 failing pytests in `tests/test_text_slots_reset.py` (all pass).
- **Sync panel in `/admin`** (`AdminPage.jsx` → new `SyncPanel`, tab "Sincronizar"): one-click publish of CMS content (image slots + text slots + global pricing) from the current env to a target (production). Browser flow: `GET /api/cms/export` → `POST {target}/api/admin/login` → `POST {target}/api/cms/import` (Bearer). Optional "Reemplazo total" (wipe) checkbox + "Snapshot" JSON download for manual backups. Live progress log. Target URL persisted in localStorage.
- **Verified**: 3/3 pytests pass; curl export/DELETE OK via external URL; screenshot of Sync tab confirms UI renders.

### Verificación post-publicación (Feb 2026)
- Tras importar, `SyncPanel` consulta `GET {target}/api/cms/export` y compara los conteos origen↔destino. Banner visual `admin-sync-verify`: verde "✓ Producción sincronizada" (modo wipe = espejo exacto; upsert = destino ≥ origen) o ámbar "⚠ Revisar sincronización" con los conteos. Log incluye línea de verificación.

## Formularios en pestañas: Detallado + Contacto rápido (Feb 2026)
- **Petición**: dos formularios accesibles vía pestañas — "Planificación detallada" (multi-paso) y "Contacto rápido" (formulario compacto de /contacto) — en AMBAS páginas (`/planifica-tu-viaje` y `/contacto`), con "Detallado" activo por defecto.
- **Nuevo `components/PlannerForm.jsx`**: extracción del formulario detallado multi-paso (fechas, viajeros, alojamiento, regiones+recomendaciones, actividades, datos) desde `PlanificaTuViajePage`. Slots CMS siguen page-namespaced vía `useSlotId` → ediciones existentes en /planifica-tu-viaje se conservan. POST `/api/trip-planner`.
- **Nuevo `components/FormTabs.jsx`**: selector de pestañas trilingüe (Detallado/Contacto rápido), default configurable. Renderiza `PlannerForm` o `ContactForm` (compacto, POST `/api/contact-requests`).
- **`PlanificaTuViajePage.jsx`** adelgazado: hero + `<FormTabs defaultTab="detailed" />`. **`ContactPage.jsx`**: reemplazado `<ContactForm/>` por `<FormTabs defaultTab="detailed" />` (manteniendo ancla `#contact-form`).
- **Verificado**: lint OK; screenshots de ambas páginas con cambio de pestaña funcionando; curl 200 en `/api/contact-requests` y `/api/trip-planner`.

## Botón "Traer de producción" (sync inverso, Feb 2026)
- Nueva función `pullFromProd` + botón `admin-sync-pull` en la pestaña Sincronizar del `/admin`: trae el contenido de PRODUCCIÓN e iguala el entorno actual (preview) con un clic. Flujo browser: `GET {prod}/api/cms/export` → `POST {preview}/api/cms/import` (token admin de la sesión actual; export es público, no requiere contraseña de producción). Reutiliza el campo URL destino y el checkbox wipe; muestra el mismo banner de verificación.
- Aviso UI: la contraseña solo es necesaria para "Publicar" (escribir en producción); "Traer" solo lee de producción.
- **Bug corregido durante la edición**: se eliminó accidentalmente `return (` al insertar la función (compilación babel fallaba aunque eslint pasaba) → restaurado.
- **Verificado**: clic en navegador trae 318 imágenes + 24 textos + precios, banner verde "Producción sincronizada".

## Sincronización de contenido entre idiomas + autotraducción ES→EN/FR (Feb 2026)
- **Petición**: el contenido editado en la versión ES de una página debe sincronizarse con EN/FR — IMÁGENES compartidas (misma imagen en los 3 idiomas), TEXTO con su propia traducción por idioma.
- **Causa raíz**: los ids de slot se derivaban del path de la URL, pero EN/FR usan slugs localizados distintos (`viajes/norte/...` vs `tours/northern/...` vs `voyages/nord/...`) → ids de slot distintos por idioma → las imágenes NO se compartían.
- **Fix central (`slotScope.js` → `normalisePathname`)**: ahora resuelve cualquier ruta (ES/EN/FR) a su `routeId` vía `resolvePath`/`ROUTES` y usa el slug **canónico ES** como namespace. Las páginas ES conservan sus ids actuales (sin migración); EN/FR convergen a los mismos slots. Verificado: ES/EN/FR de la página Tánger-Fez exponen 67 `data-cms-image-slot` idénticos.
- **Autotraducción (Emergent LLM key)**: nuevo `POST /api/translate` en `server.py` (emergentintegrations `LlmChat`, modelo `gpt-4o-mini`) traduce a EN+FR en una sola llamada JSON. `EditableText.save()`: al editar en ES, persiste ES al instante y luego rellena EN/FR; prop `noTranslate` para campos que no deban traducirse. Editar en EN/FR solo guarda ese idioma (ajuste manual).
- **Tests**: `tests/test_translate.py` (3) + e2e del flujo. 10/10 backend PASS; agente de pruebas confirmó identidad de slots entre idiomas y autotraducción ES→EN/FR persistida en el mismo slot. Sin issues.
- **Nota redeploy**: `emergentintegrations==0.1.2` ya en requirements.txt; `EMERGENT_LLM_KEY` en backend/.env (debe existir también en producción tras el redeploy).

## Optimización automática de imágenes al subir (Feb 2026)
- **Petición**: que toda imagen subida por el CMS se optimice sola para web.
- **Implementado**: helper `optimize_image()` en `server.py` (Pillow) — redimensiona a máx. 2000 px de ancho (sin ampliar), convierte a **WebP calidad 80**, respeta orientación EXIF y preserva transparencia (RGBA). Si una imagen no se puede procesar, hace fallback al original (la subida nunca falla por la optimización).
- Integrado en los 3 endpoints de subida de usuario: `POST /api/slots/{id}/upload`, `POST /api/library/upload` (lote), `POST /api/files/{id}/replace`.
- `MAX_UPLOAD_BYTES` subido de 8MB → **20MB** (coincide con el límite del frontend) ya que ahora comprimimos en servidor.
- Añadido `Pillow==12.2.0` a requirements.txt.
- **Verificado**: 3000x2000 JPG (5.2MB) → 2000x1333 WebP (1.27MB); 500px no se amplía; PNG RGBA conserva alpha. Tests `tests/test_image_optimize.py` (2) + suite: 8/8 PASS.
- Nota: las imágenes ya guardadas no se reprocesan; solo las nuevas subidas. Las de Unsplash/Pexels ya vienen optimizadas por su CDN.

## Importar carpetas completas a la biblioteca (Feb 2026)
- **Petición**: poder subir carpetas enteras; todas las imágenes se añaden a la galería y se agrupan bajo un tag con el nombre de la carpeta.
- **Backend** (`POST /api/library/upload`): nuevo campo opcional `tag` (Form). Se normaliza con `_slug_tag()` ('Marrakech 2026' → 'marrakech-2026') y se añade a cada imagen junto a 'library'. Compatible hacia atrás (sin tag = solo 'library').
- **Frontend** (`ImageLibraryPicker.jsx`): nuevo botón **"Subir carpeta"** con input `webkitdirectory`/`directory` (ref callback para fijar atributos al montar el modal). Deriva el nombre de la carpeta de `webkitRelativePath`, sube por **lotes** (máx. 8 archivos / 25MB por request para respetar límites del proxy), muestra **progreso** (done/total) y al terminar filtra automáticamente por el nuevo tag. Las imágenes se optimizan a WebP igual que el resto.
- **Verificado**: curl (tag 'Marrakech 2026' → 'marrakech-2026', filtrable en /files y /library/tags), e2e en navegador (botón + atributos webkitdirectory + subida + agrupación + banner). Tests `tests/test_folder_upload.py` (2) PASS.

## Deduplicación por hash + añadir a tag existente + fix rendimiento subidas (Feb 2026)
- **Petición**: añadir imágenes a un tag existente en cualquier momento (sin crear uno nuevo) y deduplicación fiable por hash de archivo para no almacenar la misma imagen dos veces (incluso desde carpetas/sesiones distintas).
- **Deduplicación (backend `/library/upload`)**: se calcula `sha256` + `size_original` de los bytes originales. Si ya existe en la galería, NO se vuelve a almacenar; si se pidió un tag, se añade ese tag al registro existente (`$addToSet`). Respuesta incluye `duplicates[]`. `sha256` también se guarda en subidas a slot y replace (detección cruzada). Índice `files.sha256` creado en startup.
- **Añadir a tag existente (frontend `ImageLibraryPicker.jsx`)**: «Subir varias» ahora envía el tag activo (cuando hay un filtro de tag seleccionado) → las imágenes se unen a ese grupo. Pista visual `image-library-active-tag-hint`. Importar una carpeta con el mismo nombre que un tag también fusiona automáticamente. Banner muestra subidas / duplicadas / omitidas.
- **Fix rendimiento (crítico)**: `put_object` (requests síncrono) bloqueaba el event loop de async durante toda la subida, congelando el backend. Ahora todas las llamadas a `put_object` se ejecutan en thread pool (`asyncio.to_thread`). Resultado medido: subida de 2 imágenes 14.5s → 0.83s, y otros endpoints responden en paralelo durante subidas.
- **Verificado**: e2e en navegador (carpeta→tag, añadir a tag activo, duplicado detectado sin almacenar) + tests `test_dedupe.py` (2) y `test_folder_upload.py` (2) PASS.

## Tag de día en la Galería del día (Feb 2026)
- **Petición**: en las páginas de viaje, en la sección "Galería del día", sustituir las tags de categoría de cada imagen (CULTURA, GASTRONOMÍA, PAISAJE…) por la tag del día del itinerario (DÍA 1, DÍA 2…).
- **Implementado** (`DayGallery.jsx` + `ProgramTemplate.jsx`): `DayBlock` pasa `dayNumber={idx+1}` a `<DayGallery>`. La tag de cada imagen (tile y lightbox) ahora muestra "DÍA N" (trilingüe: Día/Day/Jour, renderizado en mayúsculas por CSS) en color de acento del día. Se eliminó el uso de `GALLERY_KIND_LABELS` y los `kindSlot` editables de la galería; la caption sigue siendo editable.
- **Verificado**: página Tánger-Fez muestra Día 1→Día 6 correctamente, una tag por galería. Aplica a todas las páginas que usan ProgramTemplate. Lint OK.

## Ubicación de imágenes Unsplash en la biblioteca (Feb 2026)
- **Petición**: mostrar la ubicación de cada imagen de Unsplash (cuando tiene metadatos de localización) en la sección de búsqueda Unsplash de la biblioteca; omitir si no la tiene.
- **Hallazgo**: la API de búsqueda `/search/photos` NO incluye `location` (solo el endpoint de detalle `/photos/{id}` la trae). Por tanto hay que pedir el detalle por foto.
- **Backend** (`server.py`): `_unsplash_location()` obtiene la ubicación por foto y la adjunta a cada resultado de `/api/unsplash/search` y `/api/unsplash/featured`. `_format_location()` construye un `display` limpio (name o city+country). Mitigaciones de rate limit: caché **en memoria** + caché **persistente en MongoDB** (`unsplash_locations`, cada foto cuesta como máximo 1 llamada para siempre), concurrencia limitada (semáforo 8), y degradación elegante (si hay 429, se omite la ubicación y la búsqueda sigue devolviendo fotos).
- **Frontend** (`UnsplashTab.jsx`): cada tarjeta muestra la ubicación con icono de pin (`unsplash-location-{id}`) sobre el fotógrafo, cuando existe; se omite si no.
- **Verificado**: búsqueda 'marrakech' mostró ubicación en 12/24 tarjetas (ej. "Marrakech, Morocco", "Tinmel Mosque, Tinmel, Morocco"); las demás omiten el campo. Tests `test_unsplash_location.py` (toleran 429).
- ⚠️ **Tradeoff rate limit**: enriquecer ubicaciones añade ~1 llamada extra por foto. Con una key de Unsplash demo (~50 req/h) esto agota el cupo rápido. La caché persistente reduce el coste a largo plazo, pero para uso intensivo conviene una key de Unsplash de producción (5000 req/h).

## 2026-02-02 — Fix: botón de enlace externo (flecha) en tarjetas de Pexels/Unsplash
- **Problema reportado**: el botón cuadrado con flecha de cada tarjeta de imagen (Biblioteca de imágenes → Pexels/Unsplash) no abría la página de origen de la foto.
- **Causa raíz**: el guard de captura de `EditModeContext` bloquea TODOS los clics en `<a>` mientras el modo edición está activo, salvo los que estén dentro de un ancestro `[role="dialog"]`. El `ImageLibraryPicker` se renderiza como **hermano** del `<aside role="dialog">` del editor (no como hijo) y **no tenía** `role="dialog"`, por lo que sus anclas de enlace externo quedaban con `preventDefault`. (Seleccionar imágenes seguía funcionando porque usa `<button>`, no `<a>`.)
- **Fix**: añadido `role="dialog"` + `aria-modal="true"` + `aria-label` al div raíz de `ImageLibraryPicker.jsx`. Esto incluye al picker en la lista blanca del guard.
- **Verificado** (Playwright, localhost:3000 por wake-page del preview): `pickerRole=dialog`, ancla DENTRO del picker `defaultPrevented=False` (el enlace navega), ancla FUERA `defaultPrevented=True` (la navegación de página sigue bloqueada → sin regresión del lockdown de edición). Lint OK.

## 2026-02-02 — Feature: Arrastrar y soltar para reemplazar imágenes (Modo edición)
- **Qué**: En Modo edición de imágenes, ahora se puede arrastrar un archivo desde el escritorio y soltarlo directamente sobre cualquier placeholder de imagen de la página para reemplazar/actualizar ese slot al instante, sin abrir el editor.
- **Frontend** (`EditableImage.jsx`):
  - Nuevo helper `uploadFileToSlot(slot, file)` que sube el archivo original (preserva el tipo; el backend re-optimiza a WebP) a `POST /api/slots/{slot}/upload`.
  - Handlers `onDragEnter/onDragOver/onDragLeave/onDrop` en el overlay `editable-overlay-{slot}`, con contador de profundidad para evitar parpadeo. Validación de tipo (JPG/PNG/WEBP/AVIF) y tamaño (máx 20 MB).
  - Feedback visual: resaltado naranja al arrastrar ("Soltar para reemplazar"), overlay con spinner ("Subiendo…"), flash de éxito ("Imagen actualizada") y flash de error. Nuevos data-testids: `editable-drop-prompt/busy/ok/error-{slot}`.
  - Al completar, actualiza el slot vía `onSavedOne` (estado + caché global de slots), por lo que la imagen se ve actualizada inmediatamente.
- **Verificado** (Playwright, localhost:3000): drop sintético de un PNG sobre `editable-overlay-home.all-trips.tourAtlasDesierto45` → `POST .../upload` devolvió **200** y la tarjeta mostró la nueva imagen. Imagen de prueba restaurada en BD tras el test. Lint OK.

## 2026-02-02 — Fix: "Failed to fetch" al arrastrar y soltar imágenes
- **Síntoma**: al soltar una imagen sobre un placeholder, el upload fallaba con "Failed to fetch".
- **Diagnóstico**: "Failed to fetch" es un fallo a nivel de red (sin respuesta). El flujo de subida del editor (recorte) funciona porque sube un Blob generado por canvas (en memoria); el drag&drop subía el **`File` original del SO** sin procesar. El `fetch` instrumentado del entorno de preview puede fallar al serializar un File respaldado por el SO, y los originales muy grandes añaden riesgo en el ingress.
- **Fix** (`EditableImage.jsx`): `uploadFileToSlot` ahora **re-codifica la imagen vía `<canvas>` a un Blob en memoria** (`prepareUploadBlob`) antes de subir — reduce a máx. 2560 px de lado mayor, conserva alfa usando WebP para PNG/WEBP/AVIF (JPEG para el resto, con fallback si el navegador no codifica WebP). Esto replica el camino probado del recorte y evita el problema de clonado del File.
- **Verificado** (Playwright, localhost:3000): drop de un JPEG real 1600×1067 → re-codificado (~28 KB) → `POST .../upload` **200**, sin `requestfailed`, imagen actualizada. *Nota: el problema original solo ocurre en el preview instrumentado (no reproducible en localhost); pendiente de confirmación del usuario en el preview.*

## 2026-02-02 — Fix: "No se pudo leer la imagen" en drag&drop (regresión del fix anterior)
- **Síntoma**: tras el fix de re-codificación con canvas, soltar una imagen mostraba "No se pudo leer la imagen" y no actualizaba el slot.
- **Causa**: `prepareUploadBlob` cargaba el archivo en un `<img>` usando una URL `blob:` (`URL.createObjectURL`). El entorno instrumentado (preview/producción) bloquea `blob:` en la CSP `img-src`, por lo que `<img>` dispara `onerror`. El flujo de recorte que sí funciona carga las imágenes vía **data: URL** (`FileReader`).
- **Fix** (`EditableImage.jsx`): `prepareUploadBlob` ahora usa `fileToDataURL` (data: URL) + el helper `loadImage` existente, en vez de `createObjectURL`. Mismo método probado del recorte; el resto (downscale a 2560 px, WebP/JPEG, upload del Blob en memoria) se mantiene.
- **Verificado** (Playwright, localhost): drop de JPEG real → re-codificado (~16 KB) → `POST .../upload` **200**, sin error, imagen actualizada. Lint OK.

## 2026-02-02 — Feature: "Selección Pexels" (galerías por destino, context-aware)
- **Qué**: Nueva pestaña "Selección" en el uploader del Modo edición que detecta los destinos presentes en los itinerarios del sitio y ofrece galerías Pexels específicas por destino. Pulsar una imagen la importa y reemplaza el placeholder activo (mismo flujo que la pestaña Pexels).
- **Detección dinámica** (`lib/destinationKeywords.js`): construye el índice de destinos desde los datos estructurados existentes (`DESTINATIONS` + complemento Casablanca/Merzouga/Skoura) y lo **ordena por frecuencia** escaneando todo el contenido de itinerarios (`SUR/NORTE/MARRUECOS/ESCAPADAS`, `itineraryHubs`, `DAY_LANDMARKS`, descripciones). Al añadir/editar itinerarios, el ranking se actualiza solo en el siguiente build. Cada destino tiene una query Pexels optimizada en inglés (ej. "Erg Chebbi Sahara dunes Morocco").
- **UI** (`components/PexelsSelectionTab.jsx`): chips agrupados por categoría (Ciudad Imperial, Desierto, Kasbah, Costa, Cultura, Montaña, Oasis, Naturaleza) con punto de color; al pulsar un destino se abre su galería (24 fotos), cacheada por query para no re-llamar a la API. Importar reutiliza `/api/pexels/import`.
- **Integración** (`components/ImageLibraryPicker.jsx`): 4ª pestaña con `overflow-x-auto` para móvil; subtítulo y footer contextuales.
- **Verificado** (Playwright, localhost): 8 grupos / 27 destinos correctamente categorizados y rankeados; "Erg Chebbi" → `GET /api/pexels/search` 200 → 24 fotos de dunas del Sáhara on-topic con overlay "Usar esta". Lint OK. *(La importación final no se ejecutó en test para no sobrescribir slots reales; usa el flujo idéntico ya probado de la pestaña Pexels.)*

## 2026-02-02 — Feature: botón "Cargar más resultados" en Selección Pexels
- Añadida paginación a las galerías por destino de la pestaña "Selección" (`PexelsSelectionTab.jsx`): botón "Cargar más resultados" que carga la siguiente página de Pexels y la añade a la cuadrícula. Estados `page`/`hasMore`/`loadingMore`; la caché por destino guarda `{photos, page, hasMore}` para restaurar el set completo al volver. Mismo estilo que el botón de la pestaña Pexels.
- **Verificado** (Playwright, localhost): Erg Chebbi → 24 fotos → "Cargar más" → 48 fotos (páginas 1 y 2). Lint OK.

## 2026-02-02 — UI: más espacio entre pestañas y contenido del uploader
- `ImageLibraryPicker.jsx`: reestructurada la fila de pestañas (Biblioteca/Pexels/Unsplash/Selección). El `overflow-x-auto` estaba en el mismo elemento que las pestañas y recortaba el texto verticalmente; ahora va en un wrapper exterior (que lleva el `border-b` y `pt-5`), con la tablist scrolleable dentro usando `-mb-px` para una línea activa limpia. Botones a `py-3`.
- Aumentado el espacio superior del contenido: sección de búsqueda (Biblioteca) `py-4` → `pt-6 pb-4`; áreas de Pexels/Unsplash/Selección `py-6` → `pt-8 pb-6`.
- **Verificado** (screenshot): texto de pestañas ya no se recorta, línea activa limpia y separación clara con el contenido. Lint OK.

## 2026-02-02 — Code review: limpieza segura (opción A+B)
- **(A) Eliminados los 11 `console.*`** de bloques catch en: `pricingStore.js`, `EditableText.jsx` (x2), `EditableImage.jsx`, `SlotUsagePanel.jsx`, `ImageEditorPage.jsx`, `JuegoPage.jsx`, `ContactForm.jsx`, `ToursVideoSection.jsx` (x2). Convertidos a `catch {` sin binding (sin variables sin usar). Lógica de manejo de errores intacta.
- **(B) Dependencias de hooks**: tras inspección, NO había dependencias realmente ausentes — los ítems del informe eran constantes/funciones de módulo (`MONTHS`, `TRIPS`, `ALL_DESTINATIONS`, `FEATURED_ROUTES`, `resolveRouteCoords`, `seasonOf`), correctamente excluidas por `react-hooks`, o variables de callback (`m`, `d`, `titles` local). ESLint real pasa limpio. Falsos positivos del informe.
- **Rechazado** del informe (incorrecto/arriesgado): `is None`→`==None` (PEP8 correcto), index-key en skeletons estáticos, localStorage→cookies (rompería persistencia de edición).
- **Verificado**: ESLint sin issues en los 12 archivos; smoke test (home + modo edición) OK, sin errores de consola.

## 2026-02-02 — Feature GLOBAL: "Mapa del día" derivado del texto del itinerario
- **Qué**: La sección "Puntos de interés del día" ahora muestra, en TODOS los itinerarios, únicamente los lugares explícitamente mencionados en la descripción (`body`) de cada día. Se eliminan atracciones cercanas genéricas y aeropuertos.
- **Nuevo** `lib/dayPlaceGazetteer.js`: gazetteer geolocalizado (~50 lugares: ciudades, kasbahs, gargantas, valles, montañas, oasis, hoteles/vivac) con alias trilingües normalizados (sin acentos). `deriveDayPlaces(day, lang)` escanea `day.body[lang]`, devuelve los lugares mencionados ordenados por aparición. Excluye aeropuertos por diseño (no hay entradas de aeropuerto) y excluye hubs de conexión (Casablanca) cuando solo aparecen en contexto de vuelo (heurística de ventana con palabras "vuelo/conexión/aeropuerto…").
- `lib/dayLandmarks.js`: añadidos kinds `town`, `valley`, `camp`, `site`. `DAY_LANDMARKS` (lista curada con atracciones incorrectas) ya no se usa.
- `components/DayRouteMap.jsx`: Tier 1 ahora usa `deriveDayPlaces` (memoizado) como fuente global; galería del landmark soporta `gallery` inline (vía CITY_PROFILES).
- **Verificado** (Playwright, 2 itinerarios):
  - Desierto día 1 `ad-ouarzazate-dades` → Ouarzazate · Boumalne Dades · Alto Atlas · Hotel Xaluca Dades (coincide exactamente con el ejemplo del usuario; sin Casablanca/aeropuertos/Skoura/Patas de Mono/Gargantas).
  - Norte día 1 `trk89-tanger-chefchaouen` → Tánger · Cabo Espartel · Grutas de Hércules · Chefchaouen · Rif. Días 2-5 correctos. Lint OK.
