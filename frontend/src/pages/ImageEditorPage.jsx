import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Cropper from "react-easy-crop";
import {
  Upload, Check, Loader2, AlertCircle, RotateCcw, ImageOff,
  ChevronLeft, ChevronRight, Images, Layers, ArrowLeft, X,
} from "lucide-react";
import { getImageGroup, getGroupSlot } from "@/lib/imageGroups";
import SlotUsagePanel from "@/components/SlotUsagePanel";

const API = process.env.REACT_APP_BACKEND_URL || "";

/* =========================================================
   URL contract
   ---------------------------------------------------------
   /image-editor?page=home&section=hero&image=0[&back=/]

   • page    — namespace (e.g. "home", "sur", "tour-ad-67")
   • section — group inside the page (e.g. "hero", "intro",
               "cat-south", "all-trips")
   • image   — 0-based index in the group's slots (or slot id)
   • back    — optional return path (defaults to group.backRoute or "/")
========================================================= */

/* ---------- helpers ---------- */
const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("/api/")) return `${API}${url}`;
  return url;
};
const parseRatio = (ratio) => {
  if (!ratio) return 16 / 9;
  if (typeof ratio === "number") return ratio;
  const m = String(ratio).match(/^(\d+(?:\.\d+)?)\s*[/:]\s*(\d+(?:\.\d+)?)$/);
  if (m) return parseFloat(m[1]) / parseFloat(m[2]);
  const n = parseFloat(ratio);
  return Number.isFinite(n) && n > 0 ? n : 16 / 9;
};
const ratioLabel = (ratio) => {
  const r = parseRatio(ratio);
  const known = [
    { r: 21 / 9, label: "Cinemascope", code: "21:9" },
    { r: 16 / 9, label: "Panorámico",  code: "16:9" },
    { r: 3 / 2,  label: "Foto clásica", code: "3:2" },
    { r: 4 / 3,  label: "Horizontal",  code: "4:3" },
    { r: 1,      label: "Cuadrado",    code: "1:1" },
    { r: 4 / 5,  label: "Vertical",    code: "4:5" },
    { r: 3 / 4,  label: "Vertical",    code: "3:4" },
    { r: 2 / 3,  label: "Retrato",     code: "2:3" },
    { r: 9 / 16, label: "Vertical",    code: "9:16" },
  ];
  let best = known[0];
  for (const k of known) if (Math.abs(k.r - r) < Math.abs(best.r - r)) best = k;
  return { label: best.label, code: best.code };
};

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
    if (outW >= outH) { outW = CROP_OUTPUT_SIZE; outH = Math.round(CROP_OUTPUT_SIZE / ratio); }
    else { outH = CROP_OUTPUT_SIZE; outW = Math.round(CROP_OUTPUT_SIZE * ratio); }
  }
  canvas.width = outW;
  canvas.height = outH;
  ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, outW, outH);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas to blob failed"))), "image/jpeg", 0.92);
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
  const res = await fetch(`${API}/api/slots/${encodeURIComponent(slot)}/upload`, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || "Error al subir la imagen.");
  return data.url;
};
const safeFilename = (slot) => `${slot.replace(/[^a-z0-9._-]/gi, "_")}.jpg`;
const newDraft = () => ({
  imageSrc: null, crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null,
  fileName: null, dirty: false,
});

/* ============================================================
   ImageEditorPage
============================================================ */
export default function ImageEditorPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = params.get("page");
  const section = params.get("section");
  const imageRef = params.get("image") ?? "0";
  const backParam = params.get("back");

  const group = useMemo(() => getImageGroup(page, section), [page, section]);
  const initialSlot = useMemo(() => getGroupSlot(group, imageRef), [group, imageRef]);

  const backHref = backParam || group?.backRoute || "/";

  /* Invalid group → friendly fallback */
  if (!group || !initialSlot) {
    return (
      <NotFoundEditor backHref={backHref} page={page} section={section} />
    );
  }

  return (
    <EditorBody
      group={group}
      initialIndex={initialSlot.index}
      backHref={backHref}
      page={page}
      section={section}
      onCancel={() => navigate(backHref)}
    />
  );
}

/* ============================================================
   NotFoundEditor — section unknown
============================================================ */
const NotFoundEditor = ({ backHref, page, section }) => (
  <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] px-6 py-16">
    <div className="max-w-lg w-full bg-white border border-[#2C2621]/10 p-8 md:p-10 text-center">
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FBE9E0] text-[#C16542] mx-auto">
        <AlertCircle className="w-5 h-5" strokeWidth={1.6} />
      </span>
      <h1 className="font-serif-x text-2xl md:text-3xl text-[#2C2621] mt-5">
        Sección no encontrada
      </h1>
      <p className="mt-3 text-[14px] text-[#5C5248]">
        No existe ningún grupo editable para
        <span className="font-mono mx-1 px-2 py-0.5 bg-[#F2EBE1] text-[#2C2621] text-[12px]">
          {page || "(sin página)"} / {section || "(sin sección)"}
        </span>
        .
      </p>
      <Link
        to={backHref}
        data-testid="image-editor-back-notfound"
        className="mt-7 inline-flex items-center gap-2 bg-[#2C2621] hover:bg-[#1A1513] text-[#FDFBF7] px-5 py-3 text-[11px] tracking-[0.25em] uppercase transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.8} />
        Volver
      </Link>
    </div>
  </div>
);

/* ============================================================
   EditorBody — main editing UI
============================================================ */
const EditorBody = ({ group, initialIndex, backHref, page, section, onCancel }) => {
  const slots = group.slots;
  const isGallery = slots.length > 1;

  const [currentIdx, setCurrentIdx] = useState(initialIndex);
  const current = slots[currentIdx];
  const ratio = parseRatio(current.aspectRatio || group.aspectRatio);
  const rLabel = ratioLabel(current.aspectRatio || group.aspectRatio);

  /* Drafts per slot (in-memory, persist while on this route) */
  const draftsRef = useRef(new Map());
  const [, force] = useState(0);
  const rerender = useCallback(() => force((x) => x + 1), []);
  const getDraft = (slotId) => {
    if (!draftsRef.current.has(slotId)) draftsRef.current.set(slotId, newDraft());
    return draftsRef.current.get(slotId);
  };
  const mutateDraft = (slotId, patch) => {
    Object.assign(getDraft(slotId), patch);
    rerender();
  };
  const currentDraft = getDraft(current.id);

  /* Persisted slot URLs (fetched + updated after save) */
  const [slotUrls, setSlotUrls] = useState({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = {};
      await Promise.all(slots.map(async (s) => {
        try {
          const res = await fetch(`${API}/api/slots/${encodeURIComponent(s.id)}`);
          const data = await res.json();
          if (data && data.url) next[s.id] = data.url;
        } catch {
          // Slot not yet persisted or offline — keep placeholder fallback.
        }
      }));
      if (!cancelled) {
        setSlotUrls((p) => ({ ...next, ...p })); // p wins so freshly saved values persist
      }
    })();
    return () => { cancelled = true; };
  }, [slots]);

  /* Keyboard nav */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
      if (isGallery && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        const t = e.target;
        const tag = (t && t.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setCurrentIdx((p) => {
          const n = slots.length;
          return e.key === "ArrowLeft" ? (p - 1 + n) % n : (p + 1) % n;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isGallery, slots.length, onCancel]);

  /* File pickers + bulk distribution */
  const inputSingleRef = useRef(null);
  const inputMultiRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [busyAll, setBusyAll] = useState(false);
  const [error, setError] = useState(null);

  const acceptFile = (f) => {
    if (!f) return null;
    if (!f.type.startsWith("image/")) { setError("Solo se aceptan archivos de imagen (JPG, PNG, WEBP)."); return null; }
    if (f.size > 20 * 1024 * 1024) { setError("La imagen supera el límite de 20 MB."); return null; }
    return f;
  };
  const onPickSingle = async (file) => {
    const f = acceptFile(file);
    if (!f) return;
    setError(null);
    const src = await fileToDataURL(f);
    mutateDraft(current.id, { imageSrc: src, crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null, fileName: f.name, dirty: true });
  };
  const onPickMultiple = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const files = Array.from(fileList).filter((f) => acceptFile(f));
    if (files.length === 0) return;
    const targets = [];
    for (let i = 0; i < files.length && currentIdx + i < slots.length; i++) {
      targets.push({ slot: slots[currentIdx + i].id, file: files[i] });
    }
    if (files.length > targets.length) {
      setError(`Se han recibido ${files.length} imágenes y solo hay ${targets.length} espacios libres desde la posición actual. Las imágenes sobrantes se han descartado.`);
    }
    for (const { slot: slotId, file } of targets) {
      // eslint-disable-next-line no-await-in-loop
      const src = await fileToDataURL(file);
      const d = getDraft(slotId);
      d.imageSrc = src; d.crop = { x: 0, y: 0 }; d.zoom = 1; d.croppedAreaPixels = null; d.fileName = file.name; d.dirty = true;
    }
    if (targets.length > 0) {
      const idx = slots.findIndex((s) => s.id === targets[0].slot);
      if (idx >= 0) setCurrentIdx(idx);
    }
    rerender();
  };
  const resetCurrent = () => { draftsRef.current.set(current.id, newDraft()); setError(null); rerender(); };

  /* Save handlers */
  const saveOne = async (slotId) => {
    const d = getDraft(slotId);
    if (!d.imageSrc || !d.croppedAreaPixels) throw new Error("No hay imagen para guardar en este espacio.");
    const blob = await cropImageToBlob(d.imageSrc, d.croppedAreaPixels);
    const url = await uploadBlobToSlot(slotId, blob, safeFilename(slotId));
    setSlotUrls((p) => ({ ...p, [slotId]: url }));
    draftsRef.current.set(slotId, newDraft());
    return url;
  };
  const onSaveCurrent = async () => {
    setBusy(true); setError(null);
    try {
      await saveOne(current.id);
      if (isGallery) {
        const nextPending = slots.findIndex((s, i) => i > currentIdx && getDraft(s.id).dirty && getDraft(s.id).imageSrc);
        if (nextPending !== -1) setCurrentIdx(nextPending);
      }
    } catch (e) {
      setError(e.message || "Error inesperado.");
    } finally {
      setBusy(false); rerender();
    }
  };
  const pendingDraftCount = () =>
    Array.from(draftsRef.current.values()).filter((d) => d.dirty && d.imageSrc && d.croppedAreaPixels).length;
  const totalDirty = Array.from(draftsRef.current.values()).filter((d) => d.dirty && d.imageSrc).length;
  const onSaveAll = async () => {
    setBusyAll(true); setError(null);
    const failed = [];
    try {
      for (const s of slots) {
        const d = getDraft(s.id);
        if (d.dirty && d.imageSrc && d.croppedAreaPixels) {
          try { /* eslint-disable-next-line no-await-in-loop */ await saveOne(s.id); }
          catch (e) { failed.push(s.id); }
        }
      }
      if (failed.length > 0) setError(`Algunas imágenes no se han podido guardar: ${failed.join(", ")}`);
    } finally {
      setBusyAll(false); rerender();
    }
  };

  const onCropComplete = useCallback((_, areaPixels) => {
    mutateDraft(current.id, { croppedAreaPixels: areaPixels });
  }, [current.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-testid="image-editor-page" className="min-h-screen bg-[#FDFBF7]">
      {/* Sticky topbar */}
      <header className="sticky top-0 z-40 bg-[#1A1513] text-[#FDFBF7] border-b border-[#FDFBF7]/10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center gap-4">
          <Link
            to={backHref}
            data-testid="image-editor-back"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#FDFBF7]/85 hover:text-[#FDFBF7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.7} />
            Volver
          </Link>
          <span className="hidden md:inline-block w-px h-5 bg-[#FDFBF7]/15" />
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-[#D4A373]">
              {isGallery ? <Layers className="w-3 h-3" strokeWidth={1.9} /> : <Images className="w-3 h-3" strokeWidth={1.9} />}
              Editor de imagen · {page || ""} / {section || ""}
            </span>
            <h1 className="font-serif-x text-[20px] md:text-[24px] leading-tight mt-0.5 truncate">
              {group.label?.es || group.label || "Editar imagen"}
              <span className="text-[#FDFBF7]/55 font-sans text-[14px] ml-3 tabular-nums">
                {currentIdx + 1} / {slots.length}
              </span>
            </h1>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#FDFBF7]/8 text-[#FDFBF7] px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase border border-[#FDFBF7]/15">
            {rLabel.label} · {rLabel.code}
          </span>
        </div>
      </header>

      {/* Layout: rail + canvas */}
      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Slot rail (gallery only) */}
        {isGallery && (
          <aside className="lg:sticky lg:top-[88px] lg:self-start" data-testid="image-editor-rail">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                Imágenes del grupo
              </span>
              <span className="text-[10px] tabular-nums text-[#9C8E78]">
                {slots.length}
              </span>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
              {slots.map((s, i) => {
                const d = getDraft(s.id);
                const previewSrc = d.imageSrc || resolveUrl(slotUrls[s.id] || s.fallback || null);
                const active = i === currentIdx;
                const itRatio = parseRatio(s.aspectRatio || group.aspectRatio);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentIdx(i)}
                    data-testid={`image-editor-thumb-${i}`}
                    title={s.label || s.id}
                    className={`relative overflow-hidden transition-all duration-200 ${
                      active ? "ring-2 ring-[#C16542] ring-offset-2 ring-offset-[#FDFBF7]" : "opacity-75 hover:opacity-100"
                    }`}
                    style={{ aspectRatio: itRatio }}
                  >
                    {previewSrc ? (
                      <img src={previewSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center bg-[#EDE5D5] text-[#9C8E78]">
                        <ImageOff className="w-3 h-3" strokeWidth={1.7} />
                      </span>
                    )}
                    {d.dirty && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-[#C16542] rounded-full border border-[#FDFBF7]" aria-label="Cambio pendiente" />
                    )}
                    <span className="absolute bottom-0 left-0 right-0 bg-[#1A1513]/80 text-[#FDFBF7] text-[9px] text-center py-0.5 tabular-nums">
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {isGallery && (
              <div className="hidden lg:flex items-center justify-between mt-4 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIdx((p) => (p - 1 + slots.length) % slots.length)}
                  data-testid="image-editor-prev"
                  aria-label="Imagen anterior"
                  className="inline-flex items-center justify-center w-10 h-10 border border-[#2C2621]/25 hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
                </button>
                <span className="text-[11px] tracking-[0.25em] uppercase text-[#5C5248] tabular-nums">
                  {currentIdx + 1} / {slots.length}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentIdx((p) => (p + 1) % slots.length)}
                  data-testid="image-editor-next"
                  aria-label="Imagen siguiente"
                  className="inline-flex items-center justify-center w-10 h-10 border border-[#2C2621]/25 hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
                </button>
              </div>
            )}
          </aside>
        )}

        {/* Canvas */}
        <section className="min-w-0">
          <div className="mb-5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
              {current.label || current.id}
            </span>
            <p className="font-mono text-[12px] text-[#9C8E78] mt-1 break-all">
              {current.id}
            </p>
            <SlotUsagePanel slotId={current.id} />
          </div>

          {!currentDraft.imageSrc ? (
            <div className="space-y-6">
              {slotUrls[current.id] && (
                <div>
                  <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">
                    Imagen actual
                  </span>
                  <div
                    data-testid="image-editor-current-preview"
                    className="overflow-hidden bg-[#F2EBE1] border border-[#2C2621]/10"
                    style={{ aspectRatio: ratio, maxHeight: "55vh" }}
                  >
                    <img src={resolveUrl(slotUrls[current.id])} alt="Imagen actual" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => inputSingleRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onPickSingle(e.dataTransfer.files?.[0]); }}
                  data-testid="image-editor-dropzone-single"
                  className="flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed border-[#2C2621]/25 hover:border-[#C16542] hover:bg-[#FDF5EB] transition-colors cursor-pointer text-center"
                >
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C16542]/10 text-[#C16542]">
                    <Upload className="w-5 h-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-[14px] text-[#2C2621] font-medium">Subir una imagen</span>
                  <span className="text-[11px] text-[#5C5248]">JPG · PNG · WEBP — máx. 20 MB</span>
                </button>
                {isGallery && (
                  <button
                    type="button"
                    onClick={() => inputMultiRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onPickMultiple(e.dataTransfer.files); }}
                    data-testid="image-editor-dropzone-multi"
                    className="flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#F2EBE1] transition-colors cursor-pointer text-center"
                  >
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2C2621]/10 text-[#2C2621]">
                      <Images className="w-5 h-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-[14px] text-[#2C2621] font-medium">Subir varias a la vez</span>
                    <span className="text-[11px] text-[#5C5248]">
                      Rellenan los espacios desde el actual ({slots.length - currentIdx} libres)
                    </span>
                  </button>
                )}
              </div>
              <input
                ref={inputSingleRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                data-testid="image-editor-file-input-single"
                onChange={(e) => { onPickSingle(e.target.files?.[0]); if (e.target) e.target.value = ""; }}
              />
              {isGallery && (
                <input
                  ref={inputMultiRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  data-testid="image-editor-file-input-multi"
                  onChange={(e) => { onPickMultiple(e.target.files); if (e.target) e.target.value = ""; }}
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                  Encuadra la imagen · arrastra para mover · usa el zoom
                </span>
                <button
                  type="button"
                  onClick={resetCurrent}
                  data-testid="image-editor-reset"
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#C16542] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" strokeWidth={1.7} />
                  Cambiar imagen
                </button>
              </div>
              <div
                data-testid="image-editor-cropper"
                className="relative bg-[#1A1513] overflow-hidden"
                style={{ aspectRatio: ratio, maxHeight: "65vh" }}
              >
                <Cropper
                  image={currentDraft.imageSrc}
                  crop={currentDraft.crop}
                  zoom={currentDraft.zoom}
                  aspect={ratio}
                  minZoom={1}
                  maxZoom={5}
                  showGrid={true}
                  onCropChange={(c) => mutateDraft(current.id, { crop: c })}
                  onZoomChange={(z) => mutateDraft(current.id, { zoom: z })}
                  onCropComplete={onCropComplete}
                  objectFit="contain"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] shrink-0">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.01}
                  value={currentDraft.zoom}
                  onChange={(e) => mutateDraft(current.id, { zoom: parseFloat(e.target.value) })}
                  className="flex-1 accent-[#C16542]"
                  data-testid="image-editor-zoom"
                />
                <span className="text-[11px] text-[#5C5248] tabular-nums w-10 text-right">
                  {currentDraft.zoom.toFixed(2)}×
                </span>
              </div>
            </div>
          )}

          {error && (
            <div data-testid="image-editor-error" className="mt-5 flex items-start gap-3 p-3 bg-[#FBE9E0] border border-[#C16542]/30 text-[13px] text-[#A35133]">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.7} />
              <span>{error}</span>
            </div>
          )}
        </section>
      </main>

      {/* Sticky bottom action bar */}
      <footer className="sticky bottom-0 z-30 bg-[#F8F2E6] border-t border-[#2C2621]/10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex flex-wrap items-center gap-3">
          {isGallery && (
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setCurrentIdx((p) => (p - 1 + slots.length) % slots.length)}
                data-testid="image-editor-prev-mobile"
                aria-label="Imagen anterior"
                className="inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/25 hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#5C5248] tabular-nums px-1">
                {currentIdx + 1} / {slots.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentIdx((p) => (p + 1) % slots.length)}
                data-testid="image-editor-next-mobile"
                aria-label="Imagen siguiente"
                className="inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/25 hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
              </button>
            </div>
          )}
          {totalDirty > 0 && (
            <span data-testid="image-editor-dirty-count" className="inline-flex items-center gap-1 bg-[#C16542]/10 text-[#A35133] text-[10px] tracking-[0.2em] uppercase px-2 py-1">
              {totalDirty} sin guardar
            </span>
          )}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy || busyAll}
              data-testid="image-editor-cancel"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#2C2621] px-4 py-2 transition-colors disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.7} />
              Cancelar
            </button>
            {isGallery && pendingDraftCount() > 1 && (
              <button
                type="button"
                onClick={onSaveAll}
                disabled={busy || busyAll}
                data-testid="image-editor-save-all"
                className="inline-flex items-center gap-2 border border-[#2C2621] text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] px-4 py-3 text-[11px] tracking-[0.25em] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busyAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.8} /> : <Layers className="w-3.5 h-3.5" strokeWidth={1.8} />}
                <span>{busyAll ? "Guardando…" : `Guardar todo (${pendingDraftCount()})`}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onSaveCurrent}
              disabled={!currentDraft.imageSrc || !currentDraft.croppedAreaPixels || busy || busyAll}
              data-testid="image-editor-save"
              className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-5 py-3 text-[11px] tracking-[0.25em] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.8} /> : <Check className="w-3.5 h-3.5" strokeWidth={1.8} />}
              <span>{busy ? "Guardando…" : "Guardar"}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
