# Imágenes editables — Guía rápida

> **Regla global**: cada `<img>` que represente un placeholder de contenido
> (hero, sección, card, galería, carrusel, fondo, testimonio, etc.) debe
> usar `<EditableImage>` en lugar de `<img>` para que el modo edición lo
> reconozca y permita reemplazarlo sin tocar código.

## Cuándo usar EditableImage

✅ Sí (todo lo editorial):
- Hero / banner de página
- Cards en grids o carruseles
- Imágenes de sección (fondo + foreground)
- Galería de día / lugar
- Testimonios (avatar)
- Cualquier `<img>` que un editor de contenido quisiera cambiar

❌ No (UI funcional, no contenido):
- Iconos SVG (usa lucide-react)
- Logo del header (controlado por el branding)
- Imágenes generadas por usuario en runtime (uploads no-CMS)
- Visores de zoom / lightbox que reflejan otra imagen ya editable

## Patrón estándar

```jsx
import EditableImage from "@/components/EditableImage";

// El padre DEBE tener position:relative (ya viene en la mayoría de cards)
<div className="relative aspect-[4/3] overflow-hidden">
  <EditableImage
    slot="page.section.item"          // único, deterministico
    fallback={originalSrcUrl}          // imagen por defecto si CMS no tiene
    alt={pick(item.title, lang)}
    aspectRatio="4/3"                  // mismo aspecto que el contenedor
    imgProps={{ loading: "lazy" }}
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* gradientes / overlays decorativos siempre con pointer-events-none */}
  <div className="absolute inset-0 ... pointer-events-none" />
</div>
```

## Cómo nombrar el `slot`

Patrón: `<scope>.<section>.<identifier>`

Ejemplos del proyecto:
| Uso                                | Slot                                              |
|------------------------------------|---------------------------------------------------|
| Hero de programa                   | `program.${vt.id}.hero`                           |
| Imagen del día N                   | `day.${day.id}.image`                             |
| Card del drawer (galería landmark) | `landmark.${landmark.id}.gallery.${idx}`          |
| Tile de galería diaria             | `day.${day.route_id}.gallery.${idx}`              |
| Card de programa en hub            | `hub.${hub.id}.program.${p.id}`                   |
| Card de región (Viajes)            | `viajes.region.${r.id}`                           |
| Card de experiencia                | `viajes.experience.${e.id}`                       |
| Card de tour                       | `viajes.trip.${trip.id}`                          |
| Fondo de sección CTA               | `section.${testid}.bg`                            |
| Avatar de testimonio               | `testimonial.${t.id}.avatar`                      |

**Reglas**:
- minúsculas, sin espacios, separa con `.`
- usar IDs estables (no índices) cuando exista un id de negocio
- si la sección se reusa con un `testid` único, deriva el slot del testid

## Carruseles / sliders apilados

Los slides ocultos siguen estando en el DOM. Para que el editor sólo capture
clics del slide visible, envuelve cada slide en un wrapper que conmute
`pointer-events`:

```jsx
<div className={`absolute inset-0 ${i === idx ? "pointer-events-auto" : "pointer-events-none"}`}>
  <EditableImage slot={`hero.${i}`} fallback={s.image} ... />
</div>
```

Si aún así la edición no llega al slide visible, añade `forceVisible` a
`<EditableImage>` para elevar su overlay por encima de las transiciones.

## Comportamiento en modo edición

Cuando `editMode === true`:
- Aparece un borde discontinuo animado sobre la imagen
- Una etiqueta superior izquierda muestra el `slot` (para depuración)
- Una etiqueta superior derecha muestra el `aspectRatio`
- Un botón "EDITAR" central abre el modal de subida + crop + librería
- Cualquier `<Link>` o `<button onClick>` padre queda **bloqueado** mientras
  esté abierto el overlay (no se dispara navegación)

## Sistema de slots (backend)

- Los valores guardados se persisten en MongoDB en la colección `image_slots`
  con `_id = slot`, `url`, `alt`, `source`, `updated_at`.
- API: `GET /api/slots/{slot}` · `PUT /api/slots/{slot}` ·
  `POST /api/slots/{slot}/upload`
- Si el slot no existe → se muestra el `fallback` del componente.

## Sin EditableSection: cuándo elegir cuál

- `<EditableImage>` directo cuando quieres total control del `slot`.
- `<EImg name="x">` (dentro de un `<EditableSection id="...">`) cuando
  reproduces una página entera CMS-friendly y quieres slots auto-generados
  a partir del árbol de secciones (`page.hero.bg`, `page.hero.cta.icon`...).

## Para nuevas páginas

1. Importa `EditableImage` arriba del archivo.
2. Para CADA `<img>` que renderices, sustituye por `<EditableImage>` con
   slot derivado del id estable del item.
3. Verifica que el contenedor tiene `relative` y `overflow-hidden`.
4. Verifica que gradients/film-grain encima tienen `pointer-events-none`.
5. Activa edit-mode (botón en el header) y confirma que aparece el borde
   discontinuo y el botón "EDITAR".

## Cobertura actual

Todos los archivos auditados (Feb 2026):
- `components/EmotionalIntro.jsx`, `HeroSlider.jsx`, `OurTrips.jsx`,
  `HomeCategoryCarousel.jsx`, `AllTripsCarousel.jsx`, `TravelCategories.jsx`,
  `MoroccoCircuits.jsx`, `MoroccoVideos.jsx`, `WhatJourneysFeelLike.jsx`,
  `FeaturedQuote.jsx`, `PersonalConsultation.jsx` (ya editables desde antes)
- `components/Testimonials.jsx`, `LandmarkCarousel.jsx`, `DayGallery.jsx`,
  `ItineraryHubPage.jsx`, `JourneyPageSections.jsx`, `ProgramTemplate.jsx`,
  `pages/ToursLandingPage.jsx`, `pages/AtlasDesiertoHubPage.jsx`
  (convertidas en esta auditoría)

Únicos `<img>` raw restantes (intencionales):
- `components/DayGallery.jsx` Lightbox → es un zoom fullscreen del tile
  que ya es editable; no es un placeholder propio.
- `pages/ImageEditorPage.jsx` y `components/ImageLibraryPicker.jsx` →
  son la pantalla administrativa donde el editor PREVISUALIZA imágenes
  del CMS; no deben ser editables (sería recursión).
