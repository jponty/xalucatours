import React, { useEffect, useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Pencil, X, Upload, Check, Loader2, AlertCircle, RotateCcw, ImageOff,
  ChevronLeft, ChevronRight, Images, Layers,
} from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";
import { useEditableGroup } from "@/contexts/EditableGroupContext";

const API = process.env.REACT_APP_BACKEND_URL;

/* Resolve relative API URLs to absolute. External URLs are kept as-is. */
const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("/api/")) return `${API}${url}`;
  return url;
};

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

/* Render the saved/cropped image. Empty-state placeholder when no source. */
const ImageOrPlaceholder = ({ url, alt, className, imgProps, aspectRatio }) => {
  if (url) {
    return <img src={resolveUrl(url)} alt={alt} className={className} {...imgProps} />;
  }
  return (
    <div
      className={`${className} flex items-center justify-center bg-[#EDE5D5]`}
      style={{ aspectRatio: parseRatio(aspectRatio) || undefined }}
      aria-label={alt || "Imagen sin definir"}
    >
      <span className="inline-flex items-center gap-2 text-[#9C8E78] text-[10px] tracking-[0.32em] uppercase">
        <ImageOff className="w-3.5 h-3.5" strokeWidth={1.5} />
        Sin imagen
      </span>
    </div>
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
export const EditableImage = ({
  slot,
  fallback,
  alt = "",
  className = "",
  imgProps = {},
  aspectRatio,
  forceVisible = false,
}) => {
  const { editMode } = useEditMode();
  const group = useEditableGroup();
  const [url, setUrl] = useState(fallback || null);
  const [open, setOpen] = useState(false);

  // Always-fresh refs so a stale registration entry can still update
  // this child's image after a save.
  const setUrlRef = useRef(setUrl);
  setUrlRef.current = setUrl;
  const urlRef = useRef(url);
  urlRef.current = url;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/api/slots/${encodeURIComponent(slot)}`);
        const data = await res.json();
        if (!cancelled && data && data.url) setUrl(data.url);
      } catch (e) {
        /* keep fallback */
      }
    })();
    return () => { cancelled = true; };
  }, [slot]);

  // Self-register with the surrounding gallery group, if any.
  useEffect(() => {
    if (!group) return undefined;
    return group.register({
      slot,
      fallback: fallback || null,
      aspectRatio,
      alt,
      getUrl: () => urlRef.current,
      setUrl: (u) => setUrlRef.current(u),
    });
  }, [group, slot, fallback, aspectRatio, alt]);

  const onSavedOne = (newUrl) => {
    setUrl(newUrl);
  };

  return (
    <>
      <ImageOrPlaceholder
        url={url}
        alt={alt}
        className={className}
        imgProps={imgProps}
        aspectRatio={aspectRatio}
      />
      {editMode && (
        <div
          data-testid={`editable-overlay-${slot}`}
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
          <div className="absolute inset-2 border-2 border-dashed border-[#FDFBF7] opacity-70 animate-pulse pointer-events-none" />
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
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 bg-[#C16542] text-[#FDFBF7] px-4 py-2.5 text-[10px] tracking-[0.3em] uppercase shadow-lg pointer-events-none">
            {group ? <Images className="w-3 h-3" strokeWidth={1.8} /> : <Pencil className="w-3 h-3" strokeWidth={1.8} />}
            <span>{group ? "Editar galería" : "Editar"}</span>
          </span>
        </div>
      )}
      {open && (
        <EditModal
          initialSlot={slot}
          singleFallback={{ aspectRatio, alt, currentUrl: url, fallback }}
          group={group}
          onClose={() => setOpen(false)}
          onSavedOne={onSavedOne}
        />
      )}
    </>
  );
};

/* ============================================================
   Helpers — image loading + canvas crop
============================================================ */
const CROP_OUTPUT_SIZE = 1800;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });

const cropImageToBlob = async (imageSrc, croppedAreaPixels) => {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

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
    image,
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
      0.92,
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

const safeFilename = (slot) => `${slot.replace(/[^a-z0-9._-]/gi, "_")}.jpg`;

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
  croppedAreaPixels: null,
  fileName: null,
  dirty: false,
});

const EditModal = ({ initialSlot, singleFallback, group, onClose, onSavedOne }) => {
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
  const inputSingleRef = useRef(null);
  const inputMultiRef = useRef(null);

  const currentDraft = getDraft(current.slot);
  const ratio = parseRatio(current.aspectRatio);
  const rLabel = ratioLabel(current.aspectRatio);

  // Lock body scroll + ESC to close
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
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
  }, [onClose, isGallery, items.length]);

  const onCropComplete = useCallback(
    (_, areaPixels) => {
      mutateDraft(current.slot, { croppedAreaPixels: areaPixels });
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
    const blob = await cropImageToBlob(d.imageSrc, d.croppedAreaPixels);
    const newUrl = await uploadBlobToSlot(slot, blob, safeFilename(slot));
    // Update parent child + local mirror
    const it = items.find((i) => i.slot === slot);
    it?.setUrl?.(newUrl);
    setSlotUrls((p) => ({ ...p, [slot]: newUrl }));
    // Clear draft for this slot — it's now persisted
    draftsRef.current.set(slot, newDraft());
    return newUrl;
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
          if (!hasAnyPendingDraft()) onClose();
        }
      } else {
        onClose();
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
        onClose();
      }
    } finally {
      setBusyAll(false);
      rerender();
    }
  };

  const pendingCount = pendingDraftCount();
  const totalDirty = Array.from(draftsRef.current.values()).filter((d) => d.dirty && d.imageSrc).length;

  return (
    <div
      data-testid={`edit-modal-${initialSlot}`}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-3 py-4 md:py-8"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      role="presentation"
    >
      {/* Solid backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1513] cursor-default"
        style={{ opacity: 0.97 }}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#FDFBF7] border border-[#2C2621]/15 shadow-2xl max-h-[95vh] flex flex-col"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b border-[#2C2621]/10 shrink-0">
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
              onClick={onClose}
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
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">
                  {slotUrls[current.slot] ? "Subir nueva imagen" : "Subir imagen"}
                </span>
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
            </>
          ) : (
            <>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                  Encuadra la imagen · arrastra para mover · usa el zoom
                </span>
                <button
                  type="button"
                  onClick={resetCurrent}
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#C16542] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" strokeWidth={1.7} />
                  Cambiar imagen
                </button>
              </div>
              <div
                data-testid={`edit-modal-cropper-${current.slot}`}
                className="relative bg-[#1A1513] overflow-hidden"
                style={{ aspectRatio: ratio, maxHeight: "55vh" }}
              >
                <Cropper
                  image={currentDraft.imageSrc}
                  crop={currentDraft.crop}
                  zoom={currentDraft.zoom}
                  aspect={ratio}
                  minZoom={1}
                  maxZoom={5}
                  showGrid={true}
                  onCropChange={(c) => mutateDraft(current.slot, { crop: c })}
                  onZoomChange={(z) => mutateDraft(current.slot, { zoom: z })}
                  onCropComplete={onCropComplete}
                  objectFit="contain"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] shrink-0">
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
                <span className="text-[11px] text-[#5C5248] tabular-nums w-10 text-right">
                  {currentDraft.zoom.toFixed(2)}×
                </span>
              </div>
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
              onClick={onClose}
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
      </div>
    </div>
  );
};

export default EditableImage;
