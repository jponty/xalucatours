import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import {
  Pencil, X, Upload, Check, Loader2, AlertCircle, RotateCcw, ImageOff,
  ChevronLeft, ChevronRight, Images, Layers, RotateCw, Maximize2, Target,
  Library,
} from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";
import { useEditableGroup } from "@/contexts/EditableGroupContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSlotId } from "@/components/slotScope";
import ImageLibraryPicker from "@/components/ImageLibraryPicker";
import EditableImageMeta from "@/components/EditableImageMeta";
import SlotUsagePanel from "@/components/SlotUsagePanel";
import { buildSrcSet, optimizedSrc, defaultSizes, isOptimizable, lqipSrc } from "@/lib/imageUrl";

const API = process.env.REACT_APP_BACKEND_URL;

/* Resolve relative API URLs to absolute. External URLs are kept as-is. */
const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("/api/")) return `${API}${url}`;
  return url;
};

/* ============================================================
   Global image-slot cache — bulk-load /api/slots ONCE so every
   <EditableImage> knows its definitive URL synchronously and we
   never flash the code fallback before the saved/Pexels image.
   Mirrors the coordinator pattern used by <EditableText>.
============================================================ */
const imgCache = {
  ready: false,
  loading: null,
  values: new Map(),        // slot_id → { url, cleared, alt_i18n }
  subscribers: new Map(),   // slot_id → Set<cb>
};

const notifyImg = (slot) => {
  const subs = imgCache.subscribers.get(slot);
  if (subs) subs.forEach((cb) => cb(imgCache.values.get(slot)));
};

const ensureImgLoaded = () => {
  if (imgCache.ready) return Promise.resolve();
  if (imgCache.loading) return imgCache.loading;
  imgCache.loading = (async () => {
    try {
      const res = await fetch(`${API}/api/slots`);
      const data = await res.json();
      const slots = (data && data.slots) || [];
      for (const s of slots) {
        if (!s || !s.slot_id) continue;
        imgCache.values.set(s.slot_id, {
          url: s.url ?? null,
          cleared: !!s.cleared,
          alt_i18n: s.alt_i18n || null,
        });
      }
    } catch {
      // Network/parse failure — keep cache empty so code fallbacks render.
    }
    imgCache.ready = true;
    imgCache.loading = null;
    // Notify every mounted instance so it re-renders with hydrated data.
    for (const slot of imgCache.subscribers.keys()) notifyImg(slot);
  })();
  return imgCache.loading;
};

const subscribeImg = (slot, cb) => {
  if (!imgCache.subscribers.has(slot)) imgCache.subscribers.set(slot, new Set());
  imgCache.subscribers.get(slot).add(cb);
  return () => {
    const subs = imgCache.subscribers.get(slot);
    if (subs) { subs.delete(cb); if (!subs.size) imgCache.subscribers.delete(slot); }
  };
};

const imgCacheSet = (slot, val) => {
  if (!slot) return;
  const prev = imgCache.values.get(slot) || {};
  imgCache.values.set(slot, { ...prev, ...val });
  notifyImg(slot);
};

/* Read the persisted (CMS-overridden) URL for a slot from the global cache.
   Returns null when the slot is unset or was explicitly cleared. Used by the
   inline day-gallery editor to seed exactly what the page is displaying.
   The cache is warmed by the EditableImage instances already on the page;
   callers that may run before any mount can await ensureSlotsLoaded(). */
export const getSlotUrl = (slotId) => {
  if (!slotId) return null;
  const v = imgCache.values.get(slotId);
  return v && !v.cleared ? (v.url || null) : null;
};
export const ensureSlotsLoaded = ensureImgLoaded;

/* URLs already loaded+decoded this session → render instantly (no shimmer,
   no fade) on subsequent mounts/navigations, on top of the browser HTTP
   cache. Gives the "immediate on repeat visits" behaviour. */
const loadedUrls = new Set();

/* Parse "16/9" → 1.7777…  ·  "4/5" → 0.8 · 1 → 1 */
const parseRatio = (ratio) => {
  if (!ratio) return 16 / 9;
  if (typeof ratio === "number") return ratio;
  const m = String(ratio).match(/^(\d+(?:\.\d+)?)\s*[/:]\s*(\d+(?:\.\d+)?)$/);
  if (m) return parseFloat(m[1]) / parseFloat(m[2]);
  const n = parseFloat(ratio);
  return Number.isFinite(n) && n > 0 ? n : 16 / 9;
};

/* Human-friendly aspect ratio label */
const ratioLabel = (ratio) => {
  const r = parseRatio(ratio);
  const known = [
    { r: 21 / 9, label: "Cinemascope", code: "21:9" },
    { r: 16 / 9, label: "Panorámico",  code: "16:9" },
    { r: 16 / 10, label: "Horizontal", code: "16:10" },
    { r: 3 / 2,  label: "Foto clásica", code: "3:2" },
    { r: 4 / 3,  label: "Horizontal",  code: "4:3" },
    { r: 1,      label: "Cuadrado",    code: "1:1" },
    { r: 3 / 4,  label: "Vertical",    code: "3:4" },
    { r: 4 / 5,  label: "Vertical",    code: "4:5" },
    { r: 2 / 3,  label: "Retrato",     code: "2:3" },
    { r: 9 / 16, label: "Vertical",    code: "9:16" },
  ];
  let best = known[0];
  for (const k of known) {
    if (Math.abs(k.r - r) < Math.abs(best.r - r)) best = k;
  }
  return { label: best.label, code: best.code };
};

/* Empty / failed state — warm neutral box, never black. */
const EmptyState = ({ className, aspectRatio, alt, slot }) => (
  <div
    className={`${className} flex items-center justify-center bg-[#EDE5D5]`}
    style={aspectRatio ? { aspectRatio: parseRatio(aspectRatio) } : undefined}
    aria-label={alt || "Imagen sin definir"}
    data-cms-image-slot={slot || undefined}
    data-cms-alt={alt || undefined}
  >
    <span className="inline-flex items-center gap-2 text-[#9C8E78] text-[10px] tracking-[0.32em] uppercase">
      <ImageOff className="w-3.5 h-3.5" strokeWidth={1.5} />
      Sin imagen
    </span>
  </div>
);

/* ------------------------------------------------------------
   <SmartImage> — flicker-free, lazy, responsive image surface.
   • While the slot cache is loading → neutral shimmer skeleton
     in the exact box (no CLS, never the fallback, never black).
   • IntersectionObserver gates loading: non-priority images only
     fetch when within 400px of the viewport (no native-lazy-only),
     then preload (opacity 0 + blur) and fade/sharpen in on load.
   • `priority` images (hero/banner/LCP) are never lazy — they load
     eagerly with high fetchpriority.
   • Responsive `srcSet`/`sizes` + modern formats (WebP/AVIF) via
     lib/imageUrl for Unsplash / Pexels / our /api/files proxy.
   • Falls back to the code default ONLY if the real image errors.
------------------------------------------------------------ */
const SmartImage = ({ url, fallback, alt, className, imgProps, aspectRatio, slot, priority, sizes, ready }) => {
  const resolved = resolveUrl(url);
  const resolvedFallback = resolveUrl(fallback);

  const [src, setSrc] = useState(resolved || null);
  const [loaded, setLoaded] = useState(() => (resolved ? loadedUrls.has(resolved) : false));
  const [failed, setFailed] = useState(false);
  const triedFallback = useRef(false);
  const imgRef = useRef(null);

  const currentSrc = src || resolvedFallback;
  const canOptimize = isOptimizable(currentSrc);

  useEffect(() => {
    const r = resolveUrl(url);
    triedFallback.current = false;
    setFailed(false);
    setSrc(r || null);
    setLoaded(r ? loadedUrls.has(r) : false);
  }, [url]);

  // Guard against React's cached-image race: if the browser already had the
  // image in cache, `onLoad` may never fire, leaving it stuck at opacity 0.
  useEffect(() => {
    const node = imgRef.current;
    if (node && node.complete && node.naturalWidth > 0) {
      if (node.currentSrc) loadedUrls.add(node.currentSrc);
      setLoaded(true);
    }
  }, [src, ready]);

  const ratioStyle = aspectRatio ? { aspectRatio: parseRatio(aspectRatio) } : undefined;

  // 1) Slot cache still resolving → reserve the box with a shimmer skeleton.
  if (!ready) {
    return (
      <div
        className={`${className} cms-skeleton`}
        style={ratioStyle}
        aria-busy="true"
        aria-label={alt || "Cargando imagen"}
        data-cms-image-slot={slot || undefined}
        data-cms-alt={alt || undefined}
      />
    );
  }

  // 2) Ready but no image to show (cleared / no fallback) or every src failed.
  if (!currentSrc || failed) {
    return <EmptyState className={className} aspectRatio={aspectRatio} alt={alt} slot={slot} />;
  }

  const handleLoad = () => {
    if (currentSrc) loadedUrls.add(currentSrc);
    setLoaded(true);
  };
  const handleError = () => {
    if (!triedFallback.current && resolvedFallback && currentSrc !== resolvedFallback) {
      triedFallback.current = true;
      setSrc(resolvedFallback);
      setLoaded(loadedUrls.has(resolvedFallback));
    } else {
      setFailed(true);
    }
  };

  // Responsive + modern-format delivery (AVIF/WebP via lib/imageUrl).
  const finalSrc = canOptimize ? optimizedSrc(currentSrc, priority ? 1920 : 960) : currentSrc;
  const finalSrcSet = canOptimize ? buildSrcSet(currentSrc) : undefined;
  const finalSizes = finalSrcSet ? (sizes || defaultSizes(priority)) : undefined;
  // Blur-up: show a tiny LQIP (a real, soft preview of the photo) behind the
  // image while it decodes — never a black/empty box. Non-optimizable sources
  // (local assets, SVG, …) keep the warm shimmer skeleton instead.
  const lqip = canOptimize ? lqipSrc(currentSrc) : undefined;
  const skeletonClass = loaded ? " is-loaded" : (lqip ? "" : " cms-skeleton");
  const blurStyle = lqip && !loaded
    ? {
        backgroundImage: `url("${lqip}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#2b2622",
      }
    : undefined;

  return (
    <img
      ref={imgRef}
      src={finalSrc}
      srcSet={finalSrcSet}
      sizes={finalSizes}
      alt={alt}
      className={`${className} cms-img-fade${skeletonClass}`}
      style={{ ...ratioStyle, ...blurStyle }}
      onLoad={handleLoad}
      onError={handleError}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      data-cms-image-slot={slot || undefined}
      data-cms-alt={alt || undefined}
      {...imgProps}
    />
  );
};

/**
 * <EditableImage> — drop-in editable image.
 *
 * If wrapped in <EditableGroup> the modal becomes a gallery editor for
 * all sibling slots: thumbnail navigation, prev/next, and bulk upload.
 *
 * Props:
 *   slot          required, unique slot id (e.g. "home.hero.0")
 *   fallback      optional default URL when slot has no saved image
 *   alt           default alt text
 *   className     forwarded to <img>
 *   imgProps      extra <img> attributes
 *   aspectRatio   target ratio for the cropper (e.g. "16/9", "4/5", 1, 1.77)
 *   forceVisible  if true, keep edit overlay above stacked carousels' transitions
 */
/**
 * <EditableImage> — central, CMS-managed image surface.
 *
 * Two ways to identify the slot:
 *   • Absolute: `slot="literal.id.path"` — overrides everything.
 *   • Relative: `name="program.fr-6-7"` + a wrapping `<SlotScope id="...">`
 *               (or `<EditableSection id="...">`) somewhere up the tree.
 *               The page path is auto-prepended and scope segments joined
 *               with dots. Eliminates the need to drill ids through props.
 *
 * Either prop must be supplied; if both are passed, `slot` wins.
 */
export const EditableImage = ({
  slot: explicitSlot,
  name,
  fallback,
  alt = "",
  className = "",
  imgProps = {},
  aspectRatio,
  priority = false,
  sizes,
  forceVisible = false,
}) => {
  const scopedSlot = useSlotId(name);
  const slot = explicitSlot || (name ? scopedSlot : null);
  const { editMode } = useEditMode();
  const { lang } = useLanguage();
  const group = useEditableGroup();

  // Hydrate synchronously from the global slot cache when it is already
  // warm — so a definitive (saved/Pexels) URL renders on the very first
  // paint and we never flash the code fallback.
  const initial = slot ? imgCache.values.get(slot) : undefined;
  const [url, setUrl] = useState(initial ? initial.url : (fallback || null));
  const [cleared, setCleared] = useState(initial ? !!initial.cleared : false);
  const [altI18n, setAltI18n] = useState(initial ? (initial.alt_i18n || null) : null);
  const [ready, setReady] = useState(slot ? imgCache.ready : true);
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [dropBusy, setDropBusy] = useState(false);
  const [dropError, setDropError] = useState(null);
  const [dropOk, setDropOk] = useState(false);
  const dragDepth = useRef(0);

  // Effective alt: persisted localized alt wins, falls back to the prop.
  const effectiveAlt = (altI18n && altI18n[lang]) || alt;
  // When the user explicitly cleared the image, override fallback with null
  // so the empty-state placeholder renders instead of the original asset.
  const effectiveUrl = cleared ? null : (url ?? fallback ?? null);

  // Always-fresh ref so a stale registration entry can still read this
  // child's current url after a save.
  const urlRef = useRef(effectiveUrl);
  urlRef.current = effectiveUrl;

  // Hydrate from the global slot cache (single bulk fetch) + live updates.
  useEffect(() => {
    if (!slot) { setReady(true); return undefined; }
    let active = true;
    const apply = (val) => {
      if (!active) return;
      if (val) {
        setUrl(val.url ?? null);
        setCleared(!!val.cleared);
        if (val.alt_i18n) setAltI18n(val.alt_i18n);
      } else {
        // No stored override → render the code default.
        setUrl(fallback || null);
        setCleared(false);
      }
    };
    apply(imgCache.values.get(slot));
    const unsub = subscribeImg(slot, apply);
    ensureImgLoaded().then(() => { if (active) setReady(true); });
    return () => { active = false; unsub(); };
  }, [slot, fallback]);

  // Self-register with the surrounding gallery group, if any.
  useEffect(() => {
    if (!group || !slot) return undefined;
    return group.register({
      slot,
      fallback: fallback || null,
      aspectRatio,
      alt,
      getUrl: () => urlRef.current,
      setUrl: (u) => imgCacheSet(slot, { url: u, cleared: !u }),
    });
  }, [group, slot, fallback, aspectRatio, alt]);

  const onSavedOne = (newUrl) => {
    setUrl(newUrl);
    setCleared(false);   // a fresh upload always re-activates the slot
    imgCacheSet(slot, { url: newUrl, cleared: false });
  };

  const onClearedFromMeta = () => {
    setCleared(true);
    setUrl(null);
    imgCacheSet(slot, { url: null, cleared: true });
  };

  const onMetaSaved = (meta) => {
    if (meta?.alt_i18n) {
      setAltI18n(meta.alt_i18n);
      imgCacheSet(slot, { alt_i18n: meta.alt_i18n });
    }
  };

  /* ---- In-page drag-and-drop quick-replace (Image Edit Mode only) ----
     Drop an image file straight onto a placeholder to replace its slot
     instantly, without opening the editor. */
  const flashDropError = useCallback((msg) => {
    setDropError(msg);
    setTimeout(() => setDropError(null), 4000);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current += 1;
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragActive(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setDragActive(false);
    if (!slot || dropBusy) return;
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const typeOk = DND_ALLOWED_TYPES.includes(file.type) || DND_IMG_RE.test(file.name || "");
    if (!typeOk) {
      flashDropError("Formato no válido · usa JPG, PNG, WEBP o AVIF");
      return;
    }
    if (file.size > DND_MAX_BYTES) {
      flashDropError("La imagen supera el límite de 20 MB");
      return;
    }
    setDropBusy(true);
    setDropError(null);
    try {
      const newUrl = await uploadFileToSlot(slot, file);
      onSavedOne(toRelativeUrl(newUrl));
      setDropOk(true);
      setTimeout(() => setDropOk(false), 1600);
    } catch (err) {
      flashDropError(err.message || "No se pudo subir la imagen");
    } finally {
      setDropBusy(false);
    }
  }, [slot, dropBusy, flashDropError]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SmartImage
        url={effectiveUrl}
        fallback={cleared ? null : fallback}
        alt={effectiveAlt}
        className={className}
        imgProps={imgProps}
        aspectRatio={aspectRatio}
        slot={slot}
        priority={priority}
        sizes={sizes}
        ready={ready}
      />
      {editMode && slot && (
        <div
          data-testid={`editable-overlay-${slot}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="absolute inset-0 z-[45]"
        >
          <button
            type="button"
            data-testid={`editable-edit-btn-${slot}`}
            aria-label={`Editar imagen ${slot}`}
            onClickCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent?.stopImmediatePropagation?.();
              setOpen(true);
            }}
            onMouseDownCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onPointerDownCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStartCapture={(e) => {
              e.stopPropagation();
            }}
            className="absolute inset-0 w-full h-full bg-transparent cursor-pointer focus:outline-none"
          />
          <div
            className={`absolute inset-2 border-2 border-dashed pointer-events-none transition-colors duration-150 ${
              dragActive
                ? "border-[#C16542] border-solid bg-[#C16542]/15"
                : "border-[#FDFBF7] opacity-70 animate-pulse"
            }`}
          />
          <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#1A1513]/85 text-[#FDFBF7] text-[9px] tracking-[0.2em] uppercase px-2 py-1 max-w-[60%] truncate pointer-events-none">
            {slot}
          </span>
          {aspectRatio && (
            <span
              data-testid={`editable-ratio-${slot}`}
              className="absolute top-2 right-2 md:top-3 md:right-3 bg-[#FDFBF7]/95 text-[#2C2621] text-[9px] tracking-[0.2em] uppercase px-2 py-1 pointer-events-none"
            >
              {ratioLabel(aspectRatio).code}
            </span>
          )}

          {/* Default hint badge — hidden while dragging / busy */}
          {!dragActive && !dropBusy && !dropOk && !dropError && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 bg-[#C16542] text-[#FDFBF7] px-4 py-2.5 text-[10px] tracking-[0.3em] uppercase shadow-lg pointer-events-none">
              {group ? <Images className="w-3 h-3" strokeWidth={1.8} /> : <Pencil className="w-3 h-3" strokeWidth={1.8} />}
              <span>{group ? "Editar galería" : "Editar"}</span>
            </span>
          )}

          {/* Drag-over prompt */}
          {dragActive && !dropBusy && (
            <span
              data-testid={`editable-drop-prompt-${slot}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 bg-[#1A1513] text-[#FDFBF7] px-4 py-2.5 text-[10px] tracking-[0.3em] uppercase shadow-lg pointer-events-none"
            >
              <Upload className="w-3 h-3" strokeWidth={1.8} />
              <span>Soltar para reemplazar</span>
            </span>
          )}

          {/* Uploading state */}
          {dropBusy && (
            <span
              data-testid={`editable-drop-busy-${slot}`}
              className="absolute inset-0 flex items-center justify-center bg-[#1A1513]/60 pointer-events-none"
            >
              <span className="inline-flex items-center gap-2 bg-[#FDFBF7] text-[#2C2621] px-4 py-2.5 text-[10px] tracking-[0.3em] uppercase shadow-lg">
                <Loader2 className="w-3 h-3 animate-spin" strokeWidth={1.8} />
                <span>Subiendo…</span>
              </span>
            </span>
          )}

          {/* Success flash */}
          {dropOk && !dropBusy && (
            <span
              data-testid={`editable-drop-ok-${slot}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 bg-[#5A6B4F] text-[#FDFBF7] px-4 py-2.5 text-[10px] tracking-[0.3em] uppercase shadow-lg pointer-events-none"
            >
              <Check className="w-3 h-3" strokeWidth={2} />
              <span>Imagen actualizada</span>
            </span>
          )}

          {/* Error flash */}
          {dropError && !dropBusy && (
            <span
              data-testid={`editable-drop-error-${slot}`}
              className="absolute left-1/2 bottom-2 -translate-x-1/2 inline-flex items-center gap-2 bg-[#7C3B23] text-[#FDFBF7] px-3 py-2 text-[9px] tracking-[0.2em] uppercase shadow-lg pointer-events-none max-w-[90%] text-center"
            >
              <AlertCircle className="w-3 h-3 shrink-0" strokeWidth={1.8} />
              <span>{dropError}</span>
            </span>
          )}
        </div>
      )}
      {open && (
        <EditModal
          initialSlot={slot}
          singleFallback={{ aspectRatio, alt, currentUrl: url, fallback }}
          group={group}
          onClose={() => setOpen(false)}
          onSavedOne={onSavedOne}
          onClearedFromMeta={onClearedFromMeta}
          onMetaSaved={onMetaSaved}
        />
      )}
    </>
  );
};

/* ============================================================
   Helpers — image loading + canvas crop
============================================================ */
const CROP_OUTPUT_SIZE = 2400; // longer side in px of the saved crop — hi-DPI ready
const CROP_OUTPUT_QUALITY = 0.94;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });

/* Crop + optional rotation. The cropper returns croppedAreaPixels in
   the rotated source-image coordinate space, so we draw the image into
   a rotated intermediate canvas first and then crop from that. */
const cropImageToBlob = async (imageSrc, croppedAreaPixels, rotation = 0) => {
  const image = await loadImage(imageSrc);
  const rot = ((rotation % 360) + 360) % 360;
  const radians = (rot * Math.PI) / 180;

  // Rotate into an intermediate canvas sized to the bounding box.
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const rotW = image.width * cos + image.height * sin;
  const rotH = image.width * sin + image.height * cos;

  const rotCanvas = document.createElement("canvas");
  rotCanvas.width = rotW;
  rotCanvas.height = rotH;
  const rotCtx = rotCanvas.getContext("2d");
  rotCtx.imageSmoothingEnabled = true;
  rotCtx.imageSmoothingQuality = "high";
  rotCtx.translate(rotW / 2, rotH / 2);
  rotCtx.rotate(radians);
  rotCtx.drawImage(image, -image.width / 2, -image.height / 2);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const ratio = croppedAreaPixels.width / croppedAreaPixels.height;
  let outW = croppedAreaPixels.width;
  let outH = croppedAreaPixels.height;
  if (Math.max(outW, outH) > CROP_OUTPUT_SIZE) {
    if (outW >= outH) {
      outW = CROP_OUTPUT_SIZE;
      outH = Math.round(CROP_OUTPUT_SIZE / ratio);
    } else {
      outH = CROP_OUTPUT_SIZE;
      outW = Math.round(CROP_OUTPUT_SIZE * ratio);
    }
  }
  canvas.width = outW;
  canvas.height = outH;
  ctx.drawImage(
    rotCanvas,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0, 0, outW, outH,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas to blob failed"))),
      "image/jpeg",
      CROP_OUTPUT_QUALITY,
    );
  });
};

const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

const uploadBlobToSlot = async (slot, blob, filename) => {
  const fd = new FormData();
  fd.append("file", new File([blob], filename, { type: "image/jpeg" }));
  const res = await fetch(
    `${API}/api/slots/${encodeURIComponent(slot)}/upload`,
    { method: "POST", body: fd },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "Error al subir la imagen.");
  return data.url;
};

/* Upload an original (un-cropped) file straight to a slot — used by the
   in-page drag-and-drop quick-replace. Preserves the file's real type so
   PNG transparency survives; the backend re-optimises to WebP. */
const DND_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const DND_MAX_BYTES = 20 * 1024 * 1024;
const DND_IMG_RE = /\.(jpe?g|png|webp|avif)$/i;

/* Re-encode a dropped image through a canvas to a downscaled in-memory
   Blob BEFORE uploading. We load the file via a **data: URL** (FileReader),
   NOT a blob: URL — the instrumented preview/production may block `blob:` in
   the CSP `img-src`, which makes `<img src=blob:…>` fail to decode → the
   "No se pudo leer la imagen" error. The crop flow loads images the same way
   (data: URL) and works reliably in every environment. */
const DND_MAX_DIM = 2560;
const DND_ENCODE_QUALITY = 0.9;

const prepareUploadBlob = async (file) => {
  let img;
  try {
    const dataUrl = await fileToDataURL(file);
    img = await loadImage(dataUrl);
  } catch {
    throw new Error("No se pudo leer la imagen.");
  }
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  if (!w || !h) throw new Error("No se pudo leer la imagen.");
  const longest = Math.max(w, h);
  if (longest > DND_MAX_DIM) {
    const scale = DND_MAX_DIM / longest;
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen.");
  ctx.drawImage(img, 0, 0, w, h);
  const wantsAlpha = /png|webp|avif/i.test(file.type || file.name || "");
  const primary = wantsAlpha ? "image/webp" : "image/jpeg";
  const result = await new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob && blob.size > 0) { resolve({ blob, type: blob.type || primary }); return; }
        // Fallback for browsers without WebP encode support.
        canvas.toBlob(
          (b2) => resolve(b2 ? { blob: b2, type: "image/jpeg" } : null),
          "image/jpeg",
          DND_ENCODE_QUALITY,
        );
      },
      primary,
      DND_ENCODE_QUALITY,
    );
  });
  if (!result) throw new Error("No se pudo procesar la imagen.");
  return result;
};

const uploadFileToSlot = async (slot, file) => {
  const { blob, type } = await prepareUploadBlob(file);
  const ext = type === "image/webp" ? "webp" : "jpg";
  const fd = new FormData();
  fd.append("file", new File([blob], `${safeFilename(slot).replace(/\.jpg$/i, "")}.${ext}`, { type }));
  const res = await fetch(
    `${API}/api/slots/${encodeURIComponent(slot)}/upload`,
    { method: "POST", body: fd },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "Error al subir la imagen.");
  return data.url;
};

const safeFilename = (slot) => `${slot.replace(/[^a-z0-9._-]/gi, "_")}.jpg`;

/* Normalise any image URL that points at our own backend to a RELATIVE
   path (`/api/...`). Pexels/Unsplash imports hand back an absolute URL with
   the current origin baked in; storing that in the DB breaks the image when
   the same record is served from a different domain (preview ↔ production),
   which then trips <SmartImage>'s onError → code fallback. Keeping URLs
   domain-independent fixes that. External (non-/api) URLs are left as-is. */
const toRelativeUrl = (u) => {
  if (!u || typeof u !== "string") return u;
  try {
    const parsed = new URL(u, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    if (parsed.pathname.startsWith("/api/")) return parsed.pathname + parsed.search;
    return u;
  } catch {
    return u;
  }
};

/* ============================================================
   LivePreview — final result preview at the placeholder's aspect
   ------------------------------------------------------------
   CSS-only render: the image is scaled / positioned via percentages
   derived from the cropper's `croppedAreaPercent`. No canvas redraws
   per frame, so the preview tracks drag / zoom / rotation smoothly.
============================================================ */
const LivePreview = ({ imageSrc, croppedAreaPercent, ratio, ratioCode, slot }) => {
  if (!imageSrc) return null;
  const area = croppedAreaPercent || { x: 0, y: 0, width: 100, height: 100 };

  const w = area.width || 100;
  const h = area.height || 100;
  const imgStyle = {
    position: "absolute",
    width: `${(100 / w) * 100}%`,
    height: `${(100 / h) * 100}%`,
    left: `${-(area.x / w) * 100}%`,
    top: `${-(area.y / h) * 100}%`,
    objectFit: "fill",
  };

  return (
    <div
      data-testid={`edit-modal-live-preview-${slot}`}
      className="border border-[#2C2621]/12 bg-[#FDFBF7]"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2C2621]/10 bg-[#F8F2E6]">
        <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
          <Maximize2 className="w-3 h-3" strokeWidth={1.8} />
          Vista previa final · {ratioCode}
        </span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#9C8E78]">
          tiempo real
        </span>
      </div>
      <div className="p-3 bg-[repeating-linear-gradient(45deg,#F2EBE1_0_8px,#FDFBF7_8px_16px)] flex justify-center">
        <div
          className="relative overflow-hidden bg-[#1A1513] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.4)]"
          style={{
            height: 180,
            width: Math.round(180 * ratio),
            maxWidth: "100%",
          }}
        >
          <img
            src={imageSrc}
            alt="Vista previa final"
            style={imgStyle}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   EditModal — gallery-aware uploader
   ------------------------------------------------------------
   Two modes:
     • Single (no group)   — behaves like before
     • Group (gallery)     — thumbnail rail, prev/next siblings,
                             single + multi-file upload, save all
============================================================ */
const newDraft = () => ({
  imageSrc: null,
  crop: { x: 0, y: 0 },
  zoom: 1,
  minZoom: 1,
  rotation: 0,
  overrideRatio: null, // null = use placeholder default
  croppedAreaPixels: null,
  croppedAreaPercent: null,
  mediaSize: null,
  fileName: null,
  dirty: false,
});

/* Preset aspect ratios offered in the cropper. The placeholder default is
   always available as a special "Placeholder" preset which is the
   recommended option. */
const RATIO_PRESETS = [
  { code: "21:9",  value: 21 / 9 },
  { code: "16:9",  value: 16 / 9 },
  { code: "3:2",   value: 3 / 2 },
  { code: "4:3",   value: 4 / 3 },
  { code: "1:1",   value: 1 },
  { code: "4:5",   value: 4 / 5 },
  { code: "3:4",   value: 3 / 4 },
  { code: "2:3",   value: 2 / 3 },
  { code: "9:16",  value: 9 / 16 },
];

const EditModal = ({ initialSlot, singleFallback, group, onClose, onSavedOne, onClearedFromMeta, onMetaSaved }) => {
  // Build the list of items the modal operates on. In single mode we
  // synthesise a one-item list so the rest of the UI is uniform.
  const groupSnapshot = group ? group.list() : [];
  const isGallery = !!group && groupSnapshot.length > 1;

  const items = isGallery
    ? groupSnapshot
    : [{
        slot: initialSlot,
        aspectRatio: singleFallback?.aspectRatio,
        alt: singleFallback?.alt || "",
        fallback: singleFallback?.fallback || null,
        getUrl: () => singleFallback?.currentUrl || null,
        setUrl: onSavedOne,
      }];

  // Current visible slot inside the modal
  const initialIdx = Math.max(0, items.findIndex((i) => i.slot === initialSlot));
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const current = items[currentIdx] || items[0];

  // Per-slot draft (ephemeral upload + crop state). Persists across
  // navigation inside the modal session.
  const draftsRef = useRef(new Map());
  const [, force] = useState(0);
  const rerender = useCallback(() => force((x) => x + 1), []);
  const getDraft = (slot) => {
    if (!draftsRef.current.has(slot)) draftsRef.current.set(slot, newDraft());
    return draftsRef.current.get(slot);
  };
  const mutateDraft = (slot, patch) => {
    const d = getDraft(slot);
    Object.assign(d, patch);
    rerender();
  };

  // Live mirror of each slot's persisted URL (updated after save).
  const [slotUrls, setSlotUrls] = useState(() => {
    const m = {};
    for (const it of items) m[it.slot] = it.getUrl?.() || it.fallback || null;
    return m;
  });

  const [busy, setBusy] = useState(false);
  const [busyAll, setBusyAll] = useState(false);
  const [error, setError] = useState(null);
  // Clicking "Editar" opens the image library dialog directly. The uploader
  // stays available both inside the library picker (bulk/folder upload) and
  // in the editor panel behind it (single/multi upload + crop tools).
  const [showLibrary, setShowLibrary] = useState(true);
  const inputSingleRef = useRef(null);
  const inputMultiRef = useRef(null);

  // Slide-in / slide-out animation state for the side panel
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const requestClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose(), 250);
  }, [onClose]);

  const currentDraft = getDraft(current.slot);
  const placeholderRatio = parseRatio(current.aspectRatio);
  const ratio = currentDraft.overrideRatio || placeholderRatio;
  const rLabel = ratioLabel(ratio);
  const isOverridden = currentDraft.overrideRatio && Math.abs(currentDraft.overrideRatio - placeholderRatio) > 0.001;

  // Lock body scroll + ESC to close
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") requestClose();
      if (isGallery && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        // Only navigate when not focused inside an input
        const t = e.target;
        const tag = (t && t.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setCurrentIdx((p) => {
          const n = items.length;
          return e.key === "ArrowLeft" ? (p - 1 + n) % n : (p + 1) % n;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [requestClose, isGallery, items.length]);

  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      mutateDraft(current.slot, {
        croppedAreaPixels,
        croppedAreaPercent: croppedArea,
      });
    },
    [current.slot], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Called by react-easy-crop once the image is loaded. We capture the
  // image dimensions so the rotation logic (which swaps width/height)
  // and the smart objectFit can work correctly. Coverage of the crop
  // frame is guaranteed by objectFit, so we always start at zoom=1.
  const onMediaLoaded = useCallback(
    (mediaSize) => {
      mutateDraft(current.slot, {
        mediaSize,
        minZoom: 1,
        zoom: 1,
        crop: { x: 0, y: 0 },
      });
    },
    [current.slot], // eslint-disable-line react-hooks/exhaustive-deps
  );

  /* ---- File pickers ---- */
  const acceptFile = (f) => {
    if (!f) return null;
    if (!f.type.startsWith("image/")) {
      setError("Solo se aceptan archivos de imagen (JPG, PNG, WEBP).");
      return null;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("La imagen supera el límite de 20 MB.");
      return null;
    }
    return f;
  };

  const onPickSingle = async (file) => {
    const f = acceptFile(file);
    if (!f) return;
    setError(null);
    const src = await fileToDataURL(f);
    mutateDraft(current.slot, {
      imageSrc: src,
      crop: { x: 0, y: 0 },
      zoom: 1,
      croppedAreaPixels: null,
      fileName: f.name,
      dirty: true,
    });
  };

  const onPickMultiple = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const files = Array.from(fileList).filter((f) => acceptFile(f));
    if (files.length === 0) return;

    // Distribute files across slots, starting from current. Wrap nothing —
    // extra files beyond the last slot are dropped with a soft warning.
    const targets = [];
    for (let i = 0; i < files.length && currentIdx + i < items.length; i++) {
      targets.push({ slot: items[currentIdx + i].slot, file: files[i] });
    }
    if (files.length > targets.length) {
      setError(
        `Se han recibido ${files.length} imágenes y solo hay ${targets.length} espacios libres desde la posición actual. Las imágenes sobrantes se han descartado.`,
      );
    }
    for (const { slot, file } of targets) {
      // eslint-disable-next-line no-await-in-loop
      const src = await fileToDataURL(file);
      const d = getDraft(slot);
      d.imageSrc = src;
      d.crop = { x: 0, y: 0 };
      d.zoom = 1;
      d.croppedAreaPixels = null;
      d.fileName = file.name;
      d.dirty = true;
    }
    // Jump to the first newly-queued slot and refresh the UI
    if (targets.length > 0) {
      const idx = items.findIndex((i) => i.slot === targets[0].slot);
      if (idx >= 0) setCurrentIdx(idx);
    }
    rerender();
  };

  const resetCurrent = () => {
    draftsRef.current.set(current.slot, newDraft());
    setError(null);
    rerender();
  };

  /* ---- Save handlers ---- */
  const saveOne = async (slot) => {
    const d = getDraft(slot);
    if (!d.imageSrc || !d.croppedAreaPixels) {
      throw new Error("No hay imagen para guardar en este espacio.");
    }
    const blob = await cropImageToBlob(d.imageSrc, d.croppedAreaPixels, d.rotation || 0);
    const newUrl = await uploadBlobToSlot(slot, blob, safeFilename(slot));
    // Update parent child + local mirror
    const it = items.find((i) => i.slot === slot);
    it?.setUrl?.(newUrl);
    setSlotUrls((p) => ({ ...p, [slot]: newUrl }));
    // Clear draft for this slot — it's now persisted
    draftsRef.current.set(slot, newDraft());
    return newUrl;
  };

  /* ---- Library reuse — pick a previously-uploaded image without
         re-cropping. Persist via PUT /api/slots/{slot}. ---- */
  const useLibraryImage = async (libItem) => {
    if (!libItem?.url) return;
    setBusy(true);
    setError(null);
    try {
      const slot = current.slot;
      const relUrl = toRelativeUrl(libItem.url);
      const res = await fetch(`${API}/api/slots/${encodeURIComponent(slot)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: relUrl,
          alt: libItem.original_filename || null,
          source: "library",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || "No se pudo aplicar la imagen.");
      }
      const data = await res.json();
      const newUrl = data.url || relUrl;
      const it = items.find((i) => i.slot === slot);
      it?.setUrl?.(newUrl);
      setSlotUrls((p) => ({ ...p, [slot]: newUrl }));
      draftsRef.current.set(slot, newDraft());
      setShowLibrary(false);
      rerender();
    } catch (e) {
      setError(e?.message || "Error al usar la imagen de la biblioteca.");
    } finally {
      setBusy(false);
    }
  };

  const onSaveCurrent = async () => {
    setBusy(true);
    setError(null);
    try {
      await saveOne(current.slot);
      // Auto-advance in gallery mode if there are still pending drafts
      if (isGallery) {
        const nextPending = items.findIndex(
          (it, i) => i > currentIdx && getDraft(it.slot).dirty && getDraft(it.slot).imageSrc,
        );
        if (nextPending !== -1) {
          setCurrentIdx(nextPending);
        } else {
          // Nothing else pending — close on single-slot edits, keep open otherwise.
          if (!hasAnyPendingDraft()) requestClose();
        }
      } else {
        requestClose();
      }
    } catch (e) {
      setError(e.message || "Error inesperado.");
    } finally {
      setBusy(false);
      rerender();
    }
  };

  const hasAnyPendingDraft = () =>
    Array.from(draftsRef.current.entries()).some(
      ([, d]) => d.dirty && d.imageSrc && d.croppedAreaPixels,
    );

  const pendingDraftCount = () =>
    Array.from(draftsRef.current.entries()).filter(
      ([, d]) => d.dirty && d.imageSrc && d.croppedAreaPixels,
    ).length;

  const onSaveAll = async () => {
    setBusyAll(true);
    setError(null);
    const failed = [];
    try {
      for (const it of items) {
        const d = getDraft(it.slot);
        if (d.dirty && d.imageSrc && d.croppedAreaPixels) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await saveOne(it.slot);
          } catch (e) {
            failed.push(it.slot);
          }
        }
      }
      if (failed.length > 0) {
        setError(`Algunas imágenes no se han podido guardar: ${failed.join(", ")}`);
      } else {
        requestClose();
      }
    } finally {
      setBusyAll(false);
      rerender();
    }
  };

  const pendingCount = pendingDraftCount();
  const totalDirty = Array.from(draftsRef.current.values()).filter((d) => d.dirty && d.imageSrc).length;

  // Hard click-isolation: every pointer/click/wheel event captured at the
  // panel root is contained. The page underneath cannot receive any of
  // them, even on bubbling-phase listeners attached elsewhere.
  //
  // We also call preventDefault — critical because the modal is rendered
  // via Portal so its host is <body>, but even so, browsers can interpret
  // events inside ancestor <a> elements as activations. With preventDefault
  // there is no way a stray click follows a link.
  const stop = (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };
  const stopAndPrevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  return createPortal(
    (
    <div
      data-testid={`edit-modal-${initialSlot}`}
      className="fixed inset-0 z-[9999] flex"
      onMouseDown={stopAndPrevent}
      onMouseUp={stop}
      onClick={stop}
      onPointerDown={stopAndPrevent}
      onTouchStart={stop}
      onWheelCapture={stop}
      onContextMenu={stop}
      role="presentation"
    >
      {/* Backdrop — softer than a modal so the page stays visible behind
          the side panel, signalling that the page is still here. */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={requestClose}
        data-testid={`edit-panel-backdrop-${initialSlot}`}
        className={`absolute inset-0 bg-[#1A1513] cursor-default transition-opacity duration-300 ${
          entered && !exiting ? "opacity-60" : "opacity-0"
        }`}
      />
      {/* Side panel (drawer). Slides in from the right; full-screen on
          mobile, fixed-width on tablet+. All interaction lives inside it. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={isGallery ? "Editor de galería" : "Editor de imagen"}
        onClick={stop}
        onMouseDown={stop}
        onPointerDown={stop}
        onWheel={stop}
        className={`relative ml-auto h-full w-full sm:max-w-[560px] md:max-w-[640px] bg-[#FDFBF7] border-l border-[#2C2621]/15 shadow-[ -24px_0_60px_-20px_rgba(0,0,0,0.45) ] flex flex-col transform transition-transform duration-300 ease-out will-change-transform ${
          entered && !exiting ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Top brand stripe — makes the panel feel like a dedicated
            editing surface rather than a centred dialog. */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C16542] via-[#D4A373] to-[#C16542]"
        />
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b border-[#2C2621]/10 shrink-0 mt-1">
          <div className="min-w-0">
            <span className="block text-[10px] tracking-[0.3em] uppercase text-[#C16542] font-semibold inline-flex items-center gap-2">
              {isGallery ? <Layers className="w-3 h-3" strokeWidth={1.9} /> : <Pencil className="w-3 h-3" strokeWidth={1.9} />}
              {isGallery
                ? `Editar galería · ${group?.id || "grupo"}`
                : "Editar imagen"}
            </span>
            <p className="font-serif-x text-[18px] md:text-[20px] text-[#2C2621] leading-snug mt-1 break-all">
              {isGallery
                ? `${current.slot}  ·  ${currentIdx + 1} / ${items.length}`
                : current.slot}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              data-testid={`edit-modal-ratio-${current.slot}`}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#F2EBE1] text-[#2C2621] px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase"
              title={`Proporción requerida: ${rLabel.code}`}
            >
              {rLabel.label} · {rLabel.code}
            </span>
            <button
              type="button"
              onClick={requestClose}
              aria-label="Cerrar"
              data-testid={`edit-modal-close-${initialSlot}`}
              className="inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/20 text-[#5C5248] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-all duration-300"
            >
              <X className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {/* Gallery thumbnail rail — only in gallery mode */}
        {isGallery && (
          <div className="px-5 md:px-6 py-3 border-b border-[#2C2621]/10 bg-[#F8F2E6] shrink-0">
            <div
              data-testid="edit-modal-thumbs"
              className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1"
            >
              {items.map((it, i) => {
                const d = getDraft(it.slot);
                const previewSrc = d.imageSrc
                  ? d.imageSrc
                  : resolveUrl(slotUrls[it.slot] || it.fallback || null);
                const active = i === currentIdx;
                const itRatio = parseRatio(it.aspectRatio);
                return (
                  <button
                    key={it.slot}
                    type="button"
                    onClick={() => setCurrentIdx(i)}
                    data-testid={`edit-modal-thumb-${it.slot}`}
                    title={it.slot}
                    className={`relative shrink-0 overflow-hidden transition-all duration-200 ${
                      active
                        ? "ring-2 ring-[#C16542] ring-offset-2 ring-offset-[#F8F2E6]"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ width: 72, height: Math.round(72 / itRatio) || 72 }}
                  >
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center bg-[#EDE5D5] text-[#9C8E78]">
                        <ImageOff className="w-3 h-3" strokeWidth={1.7} />
                      </span>
                    )}
                    {d.dirty && (
                      <span
                        className="absolute top-1 right-1 w-2 h-2 bg-[#C16542] rounded-full border border-[#FDFBF7]"
                        aria-label="Cambio pendiente"
                      />
                    )}
                    <span className="absolute bottom-0 left-0 right-0 bg-[#1A1513]/80 text-[#FDFBF7] text-[9px] text-center py-0.5 tabular-nums">
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
          {/* Aspect ratio hint (mobile) */}
          <div className="sm:hidden">
            <span className="inline-flex items-center gap-1.5 bg-[#F2EBE1] text-[#2C2621] px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase">
              {rLabel.label} · {rLabel.code}
            </span>
          </div>

          {/* Where this image is used across the site */}
          <SlotUsagePanel slotId={current.slot} compact />

          {!currentDraft.imageSrc ? (
            <>
              {/* Current image preview */}
              {slotUrls[current.slot] && (
                <div>
                  <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">
                    Imagen actual
                  </span>
                  <div
                    className="overflow-hidden bg-[#F2EBE1] border border-[#2C2621]/10"
                    style={{ aspectRatio: ratio, maxHeight: "40vh" }}
                  >
                    <img
                      src={resolveUrl(slotUrls[current.slot])}
                      alt="Imagen actual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Upload zone */}
              <div>
                <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                    {slotUrls[current.slot] ? "Subir nueva imagen" : "Subir imagen"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLibrary(true)}
                    data-testid={`edit-modal-open-library-${current.slot}`}
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#2C2621] hover:text-[#C16542] border-b border-[#2C2621]/30 hover:border-[#C16542] pb-0.5 transition-colors"
                  >
                    <Library className="w-3.5 h-3.5" strokeWidth={1.7} />
                    Biblioteca
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => inputSingleRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPickSingle(e.dataTransfer.files?.[0]);
                    }}
                    data-testid={`edit-modal-dropzone-${current.slot}`}
                    className="flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed border-[#2C2621]/25 hover:border-[#C16542] hover:bg-[#FDF5EB] transition-colors duration-300 cursor-pointer text-center"
                  >
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C16542]/10 text-[#C16542]">
                      <Upload className="w-5 h-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-[14px] text-[#2C2621] font-medium">
                      Subir una imagen
                    </span>
                    <span className="text-[11px] text-[#5C5248]">JPG · PNG · WEBP — máx. 20 MB</span>
                  </button>

                  {isGallery && (
                    <button
                      type="button"
                      onClick={() => inputMultiRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onPickMultiple(e.dataTransfer.files);
                      }}
                      data-testid="edit-modal-bulk-dropzone"
                      className="flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#F2EBE1] transition-colors duration-300 cursor-pointer text-center"
                    >
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2C2621]/10 text-[#2C2621]">
                        <Images className="w-5 h-5" strokeWidth={1.6} />
                      </span>
                      <span className="text-[14px] text-[#2C2621] font-medium">
                        Subir varias a la vez
                      </span>
                      <span className="text-[11px] text-[#5C5248]">
                        Rellenan los espacios desde el actual ({items.length - currentIdx} libres)
                      </span>
                    </button>
                  )}
                </div>

                <input
                  ref={inputSingleRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  data-testid={`edit-modal-file-input-${current.slot}`}
                  onChange={(e) => onPickSingle(e.target.files?.[0])}
                />
                {isGallery && (
                  <input
                    ref={inputMultiRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    data-testid="edit-modal-file-input-multi"
                    onChange={(e) => {
                      onPickMultiple(e.target.files);
                      // Allow re-selecting the same files later
                      if (e.target) e.target.value = "";
                    }}
                  />
                )}
              </div>

              {/* Metadata editor — alt text + caption (trilingual) +
                  destructive "clear" action. Always visible in the upload
                  pane so editors can manage SEO/accessibility without
                  having to first re-upload the picture. */}
              <EditableImageMeta
                slot={current.slot}
                hasImage={!!slotUrls[current.slot]}
                onCleared={() => {
                  setSlotUrls((p) => ({ ...p, [current.slot]: null }));
                  // Tell the page-level <EditableImage> so it switches to placeholder.
                  const it = items.find((i) => i.slot === current.slot);
                  it?.setUrl?.(null);
                  onClearedFromMeta?.();
                }}
                onMetaSaved={(meta) => onMetaSaved?.(meta)}
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                  Encuadra para el formato <strong className="text-[#C16542] tracking-[0.25em]">{rLabel.code}</strong>
                </span>
                <button
                  type="button"
                  onClick={resetCurrent}
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#C16542] transition-colors"
                  data-testid={`edit-modal-change-image-${current.slot}`}
                >
                  <RotateCcw className="w-3 h-3" strokeWidth={1.7} />
                  Cambiar imagen
                </button>
              </div>

              {/* Aspect ratio selector — placeholder default is highlighted
                  in terracotta. Users may pick a non-default preset but
                  the image will then need to be re-fitted by CSS in the
                  page itself, so we keep the recommended option obvious. */}
              <div
                data-testid={`edit-modal-ratio-presets-${current.slot}`}
                className="flex items-center gap-1.5 flex-wrap"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mr-1">
                  Formato
                </span>
                <button
                  type="button"
                  onClick={() => mutateDraft(current.slot, {
                    overrideRatio: null,
                    crop: { x: 0, y: 0 },
                    zoom: 1,
                  })}
                  data-testid={`edit-modal-ratio-preset-placeholder-${current.slot}`}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                    !isOverridden
                      ? "bg-[#C16542] text-[#FDFBF7] border border-[#C16542]"
                      : "bg-transparent text-[#5C5248] border border-[#2C2621]/20 hover:border-[#C16542] hover:text-[#C16542]"
                  }`}
                  title={`Recomendado para este espacio · ${ratioLabel(placeholderRatio).code}`}
                >
                  <Target className="w-3 h-3" strokeWidth={1.8} />
                  Placeholder · {ratioLabel(placeholderRatio).code}
                </button>
                {RATIO_PRESETS
                  .filter((p) => Math.abs(p.value - placeholderRatio) > 0.001)
                  .map((p) => {
                    const active = isOverridden && Math.abs(currentDraft.overrideRatio - p.value) < 0.001;
                    return (
                      <button
                        key={p.code}
                        type="button"
                        onClick={() => mutateDraft(current.slot, {
                          overrideRatio: p.value,
                          crop: { x: 0, y: 0 },
                          zoom: 1,
                        })}
                        data-testid={`edit-modal-ratio-preset-${p.code.replace(":", "x")}-${current.slot}`}
                        className={`inline-flex items-center px-2.5 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                          active
                            ? "bg-[#2C2621] text-[#FDFBF7] border border-[#2C2621]"
                            : "bg-transparent text-[#5C5248] border border-[#2C2621]/15 hover:border-[#2C2621] hover:text-[#2C2621]"
                        }`}
                      >
                        {p.code}
                      </button>
                    );
                })}
              </div>

              {isOverridden && (
                <div className="flex items-start gap-2 p-2.5 bg-[#FDF5EB] border border-[#C16542]/25 text-[11px] text-[#A35133]">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={1.7} />
                  <span>
                    Has elegido un formato distinto al recomendado para este espacio
                    ({ratioLabel(placeholderRatio).code}). La página recortará la imagen para encajarla.
                  </span>
                </div>
              )}
              {/* Cropper — locked to the placeholder aspect ratio.
                  objectFit is chosen dynamically so the image always covers
                  the frame at zoom=1 (no letterbox, no dead space in the
                  cropped area). */}
              <div
                data-testid={`edit-modal-cropper-${current.slot}`}
                className="relative bg-[#1A1513] overflow-hidden"
                style={{ aspectRatio: ratio, maxHeight: "44vh" }}
              >
                <Cropper
                  image={currentDraft.imageSrc}
                  crop={currentDraft.crop}
                  zoom={currentDraft.zoom}
                  rotation={currentDraft.rotation || 0}
                  aspect={ratio}
                  minZoom={1}
                  maxZoom={5}
                  zoomSpeed={0.5}
                  showGrid={true}
                  restrictPosition={true}
                  onCropChange={(c) => mutateDraft(current.slot, { crop: c })}
                  onZoomChange={(z) => mutateDraft(current.slot, { zoom: z })}
                  onRotationChange={(r) => mutateDraft(current.slot, { rotation: r })}
                  onCropComplete={onCropComplete}
                  onMediaLoaded={onMediaLoaded}
                  objectFit={
                    currentDraft.mediaSize
                      ? (currentDraft.mediaSize.width / currentDraft.mediaSize.height) > ratio
                        ? "vertical-cover"
                        : "horizontal-cover"
                      : "horizontal-cover"
                  }
                />
                {/* Crop-frame badge so the admin always sees the exact ratio */}
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 bg-[#FDFBF7]/95 text-[#2C2621] text-[10px] tracking-[0.25em] uppercase px-2 py-1 pointer-events-none">
                  Marco · {rLabel.code}
                </span>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-2 flex-wrap" data-testid={`edit-modal-quick-actions-${current.slot}`}>
                <button
                  type="button"
                  onClick={() => mutateDraft(current.slot, {
                    crop: { x: 0, y: 0 },
                    zoom: 1,
                    rotation: 0,
                  })}
                  data-testid={`edit-modal-center-${current.slot}`}
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase border border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] px-3 py-2 transition-colors"
                >
                  <Target className="w-3 h-3" strokeWidth={1.8} />
                  Centrar
                </button>
                <button
                  type="button"
                  onClick={() => mutateDraft(current.slot, { zoom: 1 })}
                  data-testid={`edit-modal-fit-${current.slot}`}
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase border border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] px-3 py-2 transition-colors"
                >
                  <Maximize2 className="w-3 h-3" strokeWidth={1.8} />
                  Ajustar
                </button>
                <button
                  type="button"
                  onClick={() => mutateDraft(current.slot, {
                    rotation: ((currentDraft.rotation || 0) + 90) % 360,
                    zoom: 1,
                    crop: { x: 0, y: 0 },
                  })}
                  data-testid={`edit-modal-rotate-${current.slot}`}
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase border border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] px-3 py-2 transition-colors"
                  title="Rotar 90°"
                >
                  <RotateCw className="w-3 h-3" strokeWidth={1.8} />
                  Rotar
                </button>
              </div>

              {/* Zoom + rotation sliders */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] shrink-0 w-14">
                    Zoom
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={0.01}
                    value={currentDraft.zoom}
                    onChange={(e) =>
                      mutateDraft(current.slot, { zoom: parseFloat(e.target.value) })
                    }
                    className="flex-1 accent-[#C16542]"
                    data-testid={`edit-modal-zoom-${current.slot}`}
                  />
                  <span className="text-[11px] text-[#5C5248] tabular-nums w-12 text-right">
                    {currentDraft.zoom.toFixed(2)}×
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] shrink-0 w-14">
                    Rotar
                  </span>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={currentDraft.rotation || 0}
                    onChange={(e) =>
                      mutateDraft(current.slot, { rotation: parseFloat(e.target.value) })
                    }
                    className="flex-1 accent-[#C16542]"
                    data-testid={`edit-modal-rotation-${current.slot}`}
                  />
                  <span className="text-[11px] text-[#5C5248] tabular-nums w-12 text-right">
                    {Math.round(currentDraft.rotation || 0)}°
                  </span>
                </div>
              </div>

              {/* Live final preview — exactly the aspect of the placeholder */}
              <LivePreview
                imageSrc={currentDraft.imageSrc}
                croppedAreaPercent={currentDraft.croppedAreaPercent}
                rotation={currentDraft.rotation || 0}
                ratio={ratio}
                ratioCode={rLabel.code}
                slot={current.slot}
              />
            </>
          )}

          {error && (
            <div
              data-testid={`edit-modal-error-${initialSlot}`}
              className="flex items-start gap-3 p-3 bg-[#FBE9E0] border border-[#C16542]/30 text-[13px] text-[#A35133]"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.7} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-4 bg-[#F8F2E6] border-t border-[#2C2621]/10 shrink-0 flex-wrap">
          {/* Left — gallery navigation */}
          <div className="flex items-center gap-2">
            {isGallery && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentIdx((p) => (p - 1 + items.length) % items.length)}
                  disabled={busy || busyAll}
                  data-testid="edit-modal-prev"
                  aria-label="Imagen anterior"
                  className="inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/25 hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
                </button>
                <span className="text-[11px] tracking-[0.25em] uppercase text-[#5C5248] tabular-nums px-1">
                  {currentIdx + 1} / {items.length}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentIdx((p) => (p + 1) % items.length)}
                  disabled={busy || busyAll}
                  data-testid="edit-modal-next"
                  aria-label="Imagen siguiente"
                  className="inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/25 hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
                </button>
                {totalDirty > 0 && (
                  <span
                    data-testid="edit-modal-dirty-count"
                    className="ml-2 inline-flex items-center gap-1 bg-[#C16542]/10 text-[#A35133] text-[10px] tracking-[0.2em] uppercase px-2 py-1"
                  >
                    {totalDirty} sin guardar
                  </span>
                )}
              </>
            )}
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={requestClose}
              disabled={busy || busyAll}
              className="text-[11px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#2C2621] px-4 py-2 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            {isGallery && pendingCount > 1 && (
              <button
                type="button"
                onClick={onSaveAll}
                disabled={busy || busyAll}
                data-testid="edit-modal-save-all"
                className="inline-flex items-center gap-2 border border-[#2C2621] text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] px-4 py-3 text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busyAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.8} />
                ) : (
                  <Layers className="w-3.5 h-3.5" strokeWidth={1.8} />
                )}
                <span>{busyAll ? "Guardando…" : `Guardar todo (${pendingCount})`}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onSaveCurrent}
              disabled={
                !currentDraft.imageSrc || !currentDraft.croppedAreaPixels || busy || busyAll
              }
              data-testid={`edit-modal-save-${current.slot}`}
              className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-5 py-3 text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.8} />
              ) : (
                <Check className="w-3.5 h-3.5" strokeWidth={1.8} />
              )}
              <span>{busy ? "Guardando…" : "Guardar"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Library picker — modal-over-modal */}
      <ImageLibraryPicker
        open={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelect={useLibraryImage}
      />
    </div>
    ),
    document.body,
  );
};

export default EditableImage;
