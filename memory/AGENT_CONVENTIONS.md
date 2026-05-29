# Xaluca Tours — Editing & CMS Conventions

> Read this before adding any new page, section or component.
> The whole site is editable through a global Edit Mode and the
> conventions below are what keep it that way.

## 1. Every visible image MUST use `<EditableImage>`

**Why** — When the admin user toggles Edit Mode from the header, every image
must surface an editable overlay. Raw `<img>` tags bypass the CMS entirely.

✅ Do this:
```jsx
import EditableImage from "@/components/EditableImage";

<EditableImage
  slot="page.section.unique-id"        // OR name="local" inside <SlotScope>
  fallback={IMG.koutoubia}              // from /app/frontend/src/lib/imageBank.js
  alt="Marrakech · Koutoubia minaret"   // baseline alt; CMS can override per language
  aspectRatio="16/9"                    // pick the closest of the cropper presets
  imgProps={{ loading: "lazy" }}
  className="absolute inset-0 w-full h-full object-cover"
/>
```

❌ Don't do this:
```jsx
<img src={someUrl} alt="..." />
<div style={{ backgroundImage: `url(${someUrl})` }} />
```

**Allow-list** — Only these files may render raw `<img>`:
- `components/EditableImage.jsx` — internal renderer
- `components/EditableImageMeta.jsx` — preview pane
- `pages/AdminPage.jsx` — admin dashboard
- `pages/ImageEditorPage.jsx` — image editor surface

Check compliance any time:
```bash
bash /app/scripts/lint-no-native-img.sh
```

## 2. Use slot scoping, not hard-coded ids

Wrap any section with `<SlotScope id="...">` and let nested `<EditableImage>` /
`<EditableSection>` derive their slot id automatically. The page namespace is
prepended for you, so the same logical slot is shared across `/path`,
`/en/path` and `/fr/path`.

```jsx
<SlotScope id="testimonials">
  {items.map(t => (
    <SlotScope key={t.id} id={t.id}>
      <EditableImage name="avatar" fallback={t.avatar} alt={t.name} />
    </SlotScope>
  ))}
</SlotScope>
```

→ Resolved slot id: `<page>.testimonials.<id>.avatar`.

## 3. Galleries → wrap with `<EditableGroup>`

`<EditableGroup id="..." label="...">` turns the modal into a gallery editor
(thumbnail rail, prev/next, bulk upload). One per logical gallery.

## 4. Alt text & captions live in the CMS

`<EditableImage>` ships with a built-in **trilingual metadata panel**
(alt_i18n + caption_i18n in ES/EN/FR) — the `alt` prop is just the seed
fallback. Editors override it per language from the editor UI, and the
component automatically picks the active language at render time.

To consume the editor-controlled caption in a custom component, read it
from the slot doc via `GET /api/slots/<id>` and the `caption_i18n` field.

## 5. Routing additions

Routes are declared in two places, in this order:

1. `/app/frontend/src/lib/routes.js` — register the localized paths.
2. `/app/frontend/src/lib/routeComponents.js` — map `routeId → Component`.

`App.js` itself doesn't need any change.

## 6. SEO

Public, indexable pages must include a `<SeoHead>` (see
`/app/frontend/src/components/SeoHead.jsx`) with title, description,
OpenGraph image, canonical, hreflang × {es,en,fr,x-default}, and the
appropriate JSON-LD schema (`Article`, `Blog`, `BreadcrumbList`, …).
