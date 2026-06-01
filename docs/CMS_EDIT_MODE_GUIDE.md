# Guía: CMS inline con Modo Edición de Texto e Imagen

Esta guía explica, paso a paso, cómo está implementado el CMS editable in‑situ de
Xaluca Tours (modo edición de **texto** y de **imagen**), con los fragmentos de
código clave para replicarlo en otro proyecto **React + FastAPI + MongoDB**.

---

## 0. Concepto central: "slots"

Cada texto/imagen editable tiene un **id único** (ej. `home.hero.title`). En el
código pones un componente especial con un **valor por defecto** (hardcoded). En
runtime:

- Si la BD tiene un valor guardado para ese slot → se muestra el guardado.
- Si no → se muestra el **default del código**.

Propiedad clave: **el sitio funciona sin BD** (siempre hay fallback); la BD solo
guarda las *ediciones*.

Dos modos independientes y mutuamente excluyentes (Context global):
- `imageEditMode` → overlays/lápiz sobre imágenes.
- `textEditMode` → textos `contentEditable`.

---

## 1. Backend (FastAPI + MongoDB)

### 1.1 Colecciones

```
image_slots:  { _id: "home.hero.bg",    url, cleared, alt_i18n, source }
text_slots:   { _id: "home.hero.title", values: { es, en, fr } }
```

El `_id` ES el slot (string con puntos como separador; seguro para Mongo `_id` y
para los path params de FastAPI).

### 1.2 Endpoints de TEXTO

```python
@api_router.get("/text_slots")            # bulk: { slots: { id: {es,en,fr} } }
@api_router.get("/text_slots/{slot_id}")  # uno
@api_router.put("/text_slots/{slot_id}")  # upsert  body: { values: {es,en,fr} }
@api_router.delete("/text_slots/{slot_id}")  # reset: ?lang=es borra un idioma; sin lang, todo
```

```python
class TextSlotPayload(BaseModel):
    values: Dict[str, Optional[str]]   # { es, en, fr }

@api_router.put("/text_slots/{slot_id}")
async def put_text_slot(slot_id: str, payload: TextSlotPayload):
    doc = {"values": payload.values, "updated_at": datetime.now(timezone.utc).isoformat()}
    await db.text_slots.update_one({"_id": slot_id}, {"$set": doc}, upsert=True)
    return {"slot_id": slot_id, **doc}

@api_router.delete("/text_slots/{slot_id}")
async def delete_text_slot(slot_id: str, lang: Optional[str] = None):
    if lang:
        d = await db.text_slots.find_one({"_id": slot_id})
        values = (d or {}).get("values") or {}
        values.pop(lang, None)
        if values:
            await db.text_slots.update_one({"_id": slot_id}, {"$set": {"values": values}})
            return {"slot_id": slot_id, "values": values}
        await db.text_slots.delete_one({"_id": slot_id})
        return {"slot_id": slot_id, "values": {}}
    await db.text_slots.delete_one({"_id": slot_id})
    return {"slot_id": slot_id, "values": {}}
```

### 1.3 Endpoints de IMAGEN

```python
@api_router.get("/slots")                 # bulk: { slots: [ {slot_id, url, cleared, alt_i18n} ] }
@api_router.put("/slots/{slot_id}")       # actualización SELECTIVA (exclude_unset)
@api_router.delete("/slots/{slot_id}")    # marca cleared:true, url:null (placeholder)
@api_router.post("/slots/{slot_id}/upload")   # multipart -> object storage
@api_router.get("/files/{path}")          # sirve el binario
```

```python
@api_router.put("/slots/{slot_id}")
async def put_slot(slot_id: str, payload: SlotPayload):
    update = {"updated_at": datetime.now(timezone.utc).isoformat()}
    payload_dict = payload.model_dump(exclude_unset=True)   # <- solo lo enviado
    for key in ("url", "alt", "alt_i18n", "caption_i18n", "cleared", "source"):
        if key in payload_dict:
            update[key] = payload_dict[key]
    if update.get("url"):
        update["url"] = _relativize_url(update["url"])      # <- URL relativa
        update["cleared"] = False
    await db.image_slots.update_one({"_id": slot_id}, {"$set": update}, upsert=True)
    doc = await db.image_slots.find_one({"_id": slot_id}, {"_id": 0})
    return {"slot_id": slot_id, "exists": True, **(doc or {})}
```

Upload directo al object storage (evita límites de proxy):

```python
@api_router.post("/slots/{slot_id}/upload")
async def upload_slot_image(slot_id: str, file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(415, "Unsupported file type")
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "File too large")
    ext = {"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/avif":"avif"}[file.content_type]
    safe = "".join(c for c in slot_id if c.isalnum() or c in "._-")[:60] or "slot"
    path = f"app/slots/{safe}/{uuid.uuid4().hex}.{ext}"
    result = put_object(path, data, file.content_type)        # storage SDK
    public_url = f"/api/files/{result.get('path', path)}"
    await db.image_slots.update_one(
        {"_id": slot_id},
        {"$set": {"url": public_url, "source": "objstore",
                  "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True)
    return {"slot_id": slot_id, "url": public_url}
```

### 1.4 Dos detalles backend CRÍTICOS (bugs reales)

**a) URLs relativas** — guarda las URLs de imágenes propias SIN dominio
(`/api/files/...`). Si guardas la absoluta con el dominio del preview, al migrar a
producción la imagen carga cross‑domain, falla y revierte al fallback. Los CDNs
externos (Unsplash/Pexels) se dejan intactos.

```python
def _relativize_url(url):
    if not url or not isinstance(url, str):
        return url
    # quita scheme+host solo si apunta a NUESTRO /api/...
    m = re.match(r"^https?://[^/]+(/api/.*)$", url)
    return m.group(1) if m else url
```

**b) `Cache-Control: no-store`** — middleware global en todas las rutas de datos
`/api/*`; sin esto, proxies/CDN cachean respuestas viejas y las ediciones
"parecen revertirse" en otros dispositivos.

```python
@app.middleware("http")
async def no_store(request, call_next):
    resp = await call_next(request)
    if request.url.path.startswith("/api/"):
        resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    return resp
```

---

## 2. Frontend — Context de modos (`EditModeProvider`)

Expone `imageEditMode`, `textEditMode`, `toggleImage()`, `toggleText()`. Al activar
uno, desactiva el otro. Mientras CUALQUIER modo está activo, **bloquea toda
navegación** (editar y navegar no pueden coexistir):

1. Guard en **fase de captura** sobre `click/auxclick/mousedown/pointerdown/dragstart`
   en `document` (gana a React Router). Bloquea cualquier `<a>` salvo elementos
   whitelisted (`[data-edit-allow="true"]`, el modal, los `EditableText`, los toggles).
2. **Lock de history**: `pushState` sentinel + revertir back/forward.
3. Bloquea `Alt+←/→`.
4. Clases en `<body>`: `edit-mode-on`, `edit-mode-image`, `edit-mode-text`.

```jsx
export const EditModeProvider = ({ children }) => {
  const [imageEditMode, setImageEditMode] = useState(false);
  const [textEditMode, setTextEditMode] = useState(false);
  const toggleImage = useCallback(() => setImageEditMode(p => { const n=!p; if(n) setTextEditMode(false); return n; }), []);
  const toggleText  = useCallback(() => setTextEditMode(p => { const n=!p; if(n) setImageEditMode(false); return n; }), []);
  const anyMode = imageEditMode || textEditMode;

  useEffect(() => {
    if (!anyMode) return;
    const isAllowed = (t) =>
      t.closest('[role="dialog"]') ||
      t.closest('[data-testid^="editable-text-"]') ||
      t.closest('[data-edit-allow="true"]');
    const block = (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation?.(); };
    const handler = (e) => {
      const t = e.target; if (!t) return;
      if ((e.button === 1 || e.type === "auxclick") && t.closest("a")) return block(e);
      if (isAllowed(t)) return;
      if (t.closest("a")) return block(e);
    };
    ["click","auxclick","mousedown","pointerdown"].forEach(ev =>
      document.addEventListener(ev, handler, true));
    return () => ["click","auxclick","mousedown","pointerdown"].forEach(ev =>
      document.removeEventListener(ev, handler, true));
  }, [anyMode]);

  // ...history lock + body classes...
  return (
    <EditModeContext.Provider value={{ imageEditMode, textEditMode, toggleImage, toggleText }}>
      {children}
    </EditModeContext.Provider>
  );
};
export const useEditMode = () => useContext(EditModeContext);
```

---

## 3. Frontend — IDs automáticos (`slotScope`)

`useSlotId("title")` antepone el **pathname** de la página (quitando `/en`/`/fr`) →
`home.title`, así el mismo slot lee el mismo registro en las 3 URLs de idioma.
`<SlotScope id="cards">` añade segmentos: `home.cards.title`.

```jsx
const SectionContext = createContext({ path: [] });
const normalisePathname = (p) => {
  const parts = (p||"/").replace(/^\/+|\/+$/g,"").split("/").filter(Boolean);
  if (parts[0]==="en"||parts[0]==="fr") parts.shift();
  return parts.join(".") || "home";   // puntos, NO barras
};
export const usePageNamespace = () => {
  const loc = useLocation();
  return useMemo(() => normalisePathname(loc.pathname), [loc.pathname]);
};
export const useSlotId = (name) => {
  const page = usePageNamespace();
  const ctx = useContext(SectionContext);
  return useMemo(() => [page, ...ctx.path, name].filter(Boolean).join("."), [page, ctx.path, name]);
};
export const SlotScope = ({ id, children }) => {
  const parent = useContext(SectionContext);
  const value = useMemo(() => ({ path: id ? [...parent.path, id] : parent.path }), [parent.path, id]);
  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>;
};
```

---

## 4. Frontend — `<EditableText>`

Uso:
```jsx
<EditableText slot="home.hero.title" defaults={{es:"Hola",en:"Hi",fr:"Salut"}} as="h1" />
```

Patrón **cache + coordinador global**: UNA petición `GET /api/text_slots` hidrata
todos los slots; cada instancia se suscribe a su slot.

```jsx
const cache = { ready:false, loading:null, values:new Map(), subscribers:new Map() };
const notify = (slot) => cache.subscribers.get(slot)?.forEach(cb => cb(cache.values.get(slot)));

const ensureLoaded = async () => {
  if (cache.ready) return;
  if (cache.loading) return cache.loading;
  cache.loading = (async () => {
    try {
      const data = await (await fetch(`${API}/api/text_slots`)).json();
      for (const [slot, vals] of Object.entries(data.slots || {})) cache.values.set(slot, vals||{});
    } catch (e) { console.debug(e); }
    cache.ready = true; cache.loading = null;
    for (const slot of cache.subscribers.keys()) notify(slot);
  })();
  return cache.loading;
};

const persistSlot = async (slot, values) => {
  cache.values.set(slot, values); notify(slot);
  await fetch(`${API}/api/text_slots/${encodeURIComponent(slot)}`, {
    method:"PUT", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ values }),
  });
};

export const EditableText = ({ slot, defaults={}, as:Tag="span", multiline=true, className="" }) => {
  const { textEditMode } = useEditMode();
  const { lang } = useLanguage();
  const [stored, setStored] = useState(() => cache.values.get(slot));
  const elRef = useRef(null);

  useEffect(() => {
    if (!cache.subscribers.has(slot)) cache.subscribers.set(slot, new Set());
    const cb = (v) => setStored(v ? {...v} : v);
    cache.subscribers.get(slot).add(cb);
    ensureLoaded();
    return () => cache.subscribers.get(slot)?.delete(cb);
  }, [slot]);

  const value = (stored && stored[lang]) || defaults[lang] || defaults.es || "";

  const save = useCallback(async () => {
    const newText = elRef.current.innerText.replace(/\u00A0/g," ").trim();
    const original = (stored && stored[lang]) ?? defaults[lang] ?? "";
    if (newText === original) return;             // diff: evita PUTs vacíos
    await persistSlot(slot, { ...(stored||{}), [lang]: newText });  // guarda POR idioma
  }, [slot, lang, stored, defaults]);

  // sincroniza el contentEditable cuando cambia el valor desde fuera
  useEffect(() => {
    if (!elRef.current || document.activeElement === elRef.current) return;
    elRef.current.innerText = value;
  }, [value]);

  if (!textEditMode) return <Tag className={className}>{value}</Tag>;   // OFF: render normal

  return (
    <Tag ref={elRef} data-testid={`editable-text-${slot}`} contentEditable suppressContentEditableWarning
      onBlur={save}
      onKeyDown={(e)=>{ if(!multiline&&e.key==="Enter"){e.preventDefault();elRef.current?.blur();}
                       if(e.key==="Escape"){elRef.current.innerText=value;elRef.current?.blur();} }}
      onPaste={(e)=>{ e.preventDefault(); document.execCommand("insertText",false,e.clipboardData.getData("text/plain")); }}
      onMouseDownCapture={(e)=>e.stopPropagation()}   // no dispara navegación
      className={`${className} outline-none ring-1 ring-orange-400/40 hover:ring-orange-400`}>
      {value}
    </Tag>
  );
};
```

Puntos clave:
- OFF = render idéntico a lo que ve el usuario (cero overhead).
- ON = el MISMO tag pero `contentEditable` (no cambia la tipografía).
- Guardado por idioma preservando los otros; diff en `onBlur`; `Escape` revierte.
- Paste como texto plano; `stopPropagation` para no navegar.

---

## 5. Frontend — `<EditableImage>`

Uso:
```jsx
<EditableImage slot="home.hero.bg" fallback={IMG.hero} alt="" aspectRatio="16/9" priority />
```

Mismo cache global (`GET /api/slots` en bloque) → cada imagen conoce su URL
definitiva de forma síncrona y nunca parpadea el fallback.

```jsx
const imgCache = { ready:false, loading:null, values:new Map(), subscribers:new Map() };
const resolveUrl = (url) => !url ? null : url.startsWith("/api/") ? `${API}${url}` : url;

const ensureImgLoaded = () => {
  if (imgCache.ready) return Promise.resolve();
  if (imgCache.loading) return imgCache.loading;
  imgCache.loading = (async () => {
    const data = await (await fetch(`${API}/api/slots`)).json();
    for (const s of (data.slots||[])) if (s?.slot_id)
      imgCache.values.set(s.slot_id, { url:s.url??null, cleared:!!s.cleared, alt_i18n:s.alt_i18n||null });
    imgCache.ready = true; imgCache.loading = null;
    for (const slot of imgCache.subscribers.keys()) notifyImg(slot);
  })();
  return imgCache.loading;
};
```

**`SmartImage`** (carga sin flicker):
- Mientras precarga la URL definitiva → **skeleton shimmer** (color cálido, nunca
  negro) con el `aspect-ratio` exacto → sin CLS.
- Al cargar → fade + blur‑to‑sharp.
- `loading="lazy"` por defecto; `priority` → `eager` + `fetchPriority="high"`.
- Si la URL definitiva falla → intenta el fallback de código → si también falla,
  "Sin imagen".

**Modo edición ON** → overlay con lápiz sobre cada imagen; al hacer clic, un
**modal** (`createPortal`) con:
- Subir archivo → `POST /api/slots/{id}/upload`.
- Recortar/rotar/zoom (`react-easy-crop`).
- Biblioteca reutilizable (`POST /api/library/upload` sube sin slot; luego se elige).
- `alt` multilingüe.
- Reset (vuelve al fallback) / Vaciar (`DELETE` → placeholder).

Esqueleto:
```jsx
export default function EditableImage({ slot: slotProp, name, fallback, alt="", aspectRatio, priority, className }) {
  const slot = slotProp || useSlotId(name);
  const { imageEditMode } = useEditMode();
  const [data, setData] = useState(() => imgCache.values.get(slot));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!imgCache.subscribers.has(slot)) imgCache.subscribers.set(slot, new Set());
    const cb = (v) => setData(v ? {...v} : v);
    imgCache.subscribers.get(slot).add(cb);
    ensureImgLoaded();
    return () => imgCache.subscribers.get(slot)?.delete(cb);
  }, [slot]);

  const definitive = data?.cleared ? null : resolveUrl(data?.url);
  const src = definitive || fallback;

  return (
    <div className="relative" data-cms-image-slot={slot} data-cms-alt={alt}>
      <SmartImage src={src} fallback={fallback} alt={alt} aspectRatio={aspectRatio} priority={priority} className={className} />
      {imageEditMode && (
        <button data-edit-allow="true" data-testid={`editable-edit-btn-${slot}`}
          onClick={() => setEditing(true)} className="absolute top-2 right-2 ...">
          <Pencil className="w-4 h-4" />
        </button>
      )}
      {editing && createPortal(<EditModal slot={slot} ... onClose={()=>setEditing(false)} />, document.body)}
    </div>
  );
}
```

---

## 6. Pasos para replicar (checklist)

1. **Backend**: colecciones `image_slots`/`text_slots` con `_id = slot`; endpoints
   GET‑bulk / PUT / DELETE; middleware `no-store`; `_relativize_url`; object
   storage para `/upload` y `/files`.
2. **Context**: `EditModeProvider` (modos + lockdown) en la raíz.
3. **slotScope**: `useSlotId` + `<SlotScope>`.
4. **EditableText**: cache‑coordinador + `contentEditable`. Sustituye cada copy
   estático por `<EditableText>`.
5. **EditableImage**: `imgCache` + `SmartImage` + modal (cropper/upload/librería).
   Sustituye cada `<img>` por `<EditableImage>`.
6. **Toggles** en el header (solo admin) → `toggleText()` / `toggleImage()`.
7. (Opcional) Panel `/admin` con listado masivo de slots + export/import entre
   entornos.

### Reglas de oro (evitan los bugs más comunes)
- **Default en el código** → el sitio nunca depende de la BD para renderizar.
- **URLs relativas** de imágenes propias (independencia de dominio preview↔prod).
- **`no-store`** en rutas de datos.
- **Una sola** petición bulk para hidratar todos los slots.
- Mientras editas, **bloquea toda navegación** en fase de captura.
