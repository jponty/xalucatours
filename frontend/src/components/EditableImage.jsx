import React, { useEffect, useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Pencil, X, Upload, Check, Loader2, AlertCircle, RotateCcw, ImageOff } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";

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
  // Match to common ratios with small tolerance
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
  // Empty-state placeholder — neutral cream area matching the slot's intent
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
  const [url, setUrl] = useState(fallback || null);
  const [open, setOpen] = useState(false);

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

  const onSaved = (newUrl) => {
    setUrl(newUrl);
    setOpen(false);
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
          {/* Full-area click trap. CAPTURE-phase handlers intercept the click
              before it can bubble up to a wrapping <Link>, so navigation is
              completely disabled while edit mode is on. */}
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
          {/* Decorative layer — pointer-events-none so the click trap below
              always receives the input. */}
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
          {/* Visible "Editar" pill — decorative, but matches the click trap below */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 bg-[#C16542] text-[#FDFBF7] px-4 py-2.5 text-[10px] tracking-[0.3em] uppercase shadow-lg pointer-events-none">
            <Pencil className="w-3 h-3" strokeWidth={1.8} />
            <span>Editar</span>
          </span>
        </div>
      )}
      {open && (
        <EditModal
          slot={slot}
          currentUrl={url}
          aspectRatio={aspectRatio}
          onClose={() => setOpen(false)}
          onSaved={onSaved}
        />
      )}
    </>
  );
};

/* ============================================================
   EditModal — upload + free crop & reposition
   ------------------------------------------------------------
   - SOLID opaque backdrop, fixed full-viewport, max z-index.
   - Body scroll locked while open.
   - Aspect-ratio aware: crop area uses target ratio.
   - Drag to reposition + zoom slider.
   - Save: crops on canvas → POSTs the JPEG blob to the slot upload.
============================================================ */
const CROP_OUTPUT_SIZE = 1800; // longer side in px of the saved crop

const cropImageToBlob = async (imageSrc, croppedAreaPixels) => {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Scale output to a max longer-side while preserving the crop ratio
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
    0,
    0,
    outW,
    outH,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas to blob failed"))),
      "image/jpeg",
      0.92,
    );
  });
};

const EditModal = ({ slot, currentUrl, aspectRatio, onClose, onSaved }) => {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const ratio = parseRatio(aspectRatio);
  const rLabel = ratioLabel(aspectRatio);

  // Lock body scroll + ESC to close
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const onPick = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Solo se aceptan archivos de imagen (JPG, PNG, WEBP).");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("La imagen supera el límite de 20 MB.");
      return;
    }
    setError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(f);
  };

  const reset = () => {
    setFile(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);
  };

  const onSubmit = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await cropImageToBlob(imageSrc, croppedAreaPixels);
      const fd = new FormData();
      fd.append("file", new File([blob], `${slot.replace(/[^a-z0-9._-]/gi, "_")}.jpg`, { type: "image/jpeg" }));
      const res = await fetch(
        `${API}/api/slots/${encodeURIComponent(slot)}/upload`,
        { method: "POST", body: fd }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Error al subir la imagen.");
      onSaved(data.url);
    } catch (e) {
      setError(e.message || "Error inesperado.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid={`edit-modal-${slot}`}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-3 py-4 md:py-8"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      role="presentation"
    >
      {/* Solid backdrop — no transparency so the page below is fully covered. */}
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
        className="relative w-full max-w-3xl bg-[#FDFBF7] border border-[#2C2621]/15 shadow-2xl max-h-[95vh] flex flex-col"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b border-[#2C2621]/10 shrink-0">
          <div className="min-w-0">
            <span className="block text-[10px] tracking-[0.3em] uppercase text-[#C16542] font-semibold">
              Editar imagen
            </span>
            <p className="font-serif-x text-[18px] md:text-[20px] text-[#2C2621] leading-snug mt-1 break-all">
              {slot}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              data-testid={`edit-modal-ratio-${slot}`}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#F2EBE1] text-[#2C2621] px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase"
              title={`Proporción requerida: ${rLabel.code}`}
            >
              {rLabel.label} · {rLabel.code}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              data-testid={`edit-modal-close-${slot}`}
              className="inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/20 text-[#5C5248] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-all duration-300"
            >
              <X className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
          {/* Aspect ratio hint */}
          <div className="sm:hidden">
            <span
              className="inline-flex items-center gap-1.5 bg-[#F2EBE1] text-[#2C2621] px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase"
            >
              {rLabel.label} · {rLabel.code}
            </span>
          </div>

          {!imageSrc ? (
            <>
              {currentUrl && (
                <div>
                  <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">
                    Imagen actual
                  </span>
                  <div
                    className="overflow-hidden bg-[#F2EBE1] border border-[#2C2621]/10"
                    style={{ aspectRatio: ratio }}
                  >
                    <img
                      src={resolveUrl(currentUrl)}
                      alt="Imagen actual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div>
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">
                  {currentUrl ? "Subir nueva imagen" : "Subir imagen"}
                </span>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onPick(e.dataTransfer.files?.[0]);
                  }}
                  data-testid={`edit-modal-dropzone-${slot}`}
                  className="w-full flex flex-col items-center justify-center gap-3 py-12 px-6 border-2 border-dashed border-[#2C2621]/25 hover:border-[#C16542] hover:bg-[#FDF5EB] transition-colors duration-300 cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C16542]/10 text-[#C16542]">
                    <Upload className="w-5 h-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-[14px] text-[#2C2621] font-medium">
                    Arrastra una imagen o haz click para seleccionar
                  </span>
                  <span className="text-[11px] text-[#5C5248]">JPG · PNG · WEBP — máx. 20 MB</span>
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  data-testid={`edit-modal-file-input-${slot}`}
                  onChange={(e) => onPick(e.target.files?.[0])}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                  Encuadra la imagen · arrastra para mover · usa el zoom
                </span>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#C16542] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" strokeWidth={1.7} />
                  Cambiar imagen
                </button>
              </div>
              {/* Crop area */}
              <div
                data-testid={`edit-modal-cropper-${slot}`}
                className="relative bg-[#1A1513] overflow-hidden"
                style={{ aspectRatio: ratio, maxHeight: "60vh" }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={ratio}
                  minZoom={1}
                  maxZoom={5}
                  showGrid={true}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  objectFit="contain"
                />
              </div>
              {/* Zoom control */}
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] shrink-0">
                  Zoom
                </span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#C16542]"
                  data-testid={`edit-modal-zoom-${slot}`}
                />
                <span className="text-[11px] text-[#5C5248] tabular-nums w-10 text-right">
                  {zoom.toFixed(2)}×
                </span>
              </div>
            </>
          )}

          {error && (
            <div
              data-testid={`edit-modal-error-${slot}`}
              className="flex items-start gap-3 p-3 bg-[#FBE9E0] border border-[#C16542]/30 text-[13px] text-[#A35133]"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.7} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 md:px-6 py-4 bg-[#F8F2E6] border-t border-[#2C2621]/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="text-[11px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#2C2621] px-4 py-2 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!imageSrc || !croppedAreaPixels || busy}
            data-testid={`edit-modal-save-${slot}`}
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
  );
};

export default EditableImage;
