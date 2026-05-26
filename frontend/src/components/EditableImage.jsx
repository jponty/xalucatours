import React, { useEffect, useState, useRef } from "react";
import { Pencil, X, Upload, Check, Loader2, AlertCircle } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";

const API = process.env.REACT_APP_BACKEND_URL;

/* Resolve a slot url. Server URLs starting with `/api/uploads/...` are
   served by the backend domain, so prefix REACT_APP_BACKEND_URL.
   External URLs are returned untouched. */
const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("/api/")) return `${API}${url}`;
  return url;
};

/**
 * <EditableImage> — drop-in <img>-like component with inline edit support.
 *
 * Props:
 *   slot        Unique slot id, e.g. "home.hero.0"
 *   fallback    Default URL when the slot has no saved image
 *   alt         Default alt text
 *   className   Forwarded to <img>
 *   imgProps    Extra <img> attributes (loading, sizes, etc.)
 *
 * When the global edit mode is OFF, this renders exactly as a normal <img>.
 * When it is ON, an overlay appears with a pencil button.
 */
export const EditableImage = ({
  slot,
  fallback,
  alt = "",
  className = "",
  imgProps = {},
}) => {
  const { editMode } = useEditMode();
  const [url, setUrl] = useState(fallback);
  const [open, setOpen] = useState(false);

  // Load the saved slot value once on mount (and refetch when slot changes)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/api/slots/${encodeURIComponent(slot)}`);
        const data = await res.json();
        if (!cancelled && data && data.url) {
          setUrl(data.url);
        }
      } catch (e) {
        /* ignore — keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slot]);

  const onSaved = (newUrl) => {
    setUrl(newUrl);
    setOpen(false);
  };

  return (
    <>
      <img
        src={resolveUrl(url) || fallback}
        alt={alt}
        className={className}
        {...imgProps}
      />
      {editMode && (
        <div
          aria-hidden="true"
          data-testid={`editable-overlay-${slot}`}
          className="absolute inset-0 z-[45] pointer-events-none flex items-center justify-center"
        >
          {/* dashed editor frame */}
          <div className="absolute inset-2 border-2 border-dashed border-[#FDFBF7] opacity-70 animate-pulse" />
          {/* slot badge top-left */}
          <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#1A1513]/85 text-[#FDFBF7] text-[9px] tracking-[0.2em] uppercase px-2 py-1 max-w-[60%] truncate">
            {slot}
          </span>
          {/* edit button — centered, always reachable regardless of card size */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
            data-testid={`editable-edit-btn-${slot}`}
            className="pointer-events-auto relative inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-4 py-2.5 text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 shadow-lg"
          >
            <Pencil className="w-3 h-3" strokeWidth={1.8} />
            <span>Editar</span>
          </button>
        </div>
      )}
      {open && (
        <EditModal slot={slot} currentUrl={url} onClose={() => setOpen(false)} onSaved={onSaved} />
      )}
    </>
  );
};

/* ============================================================
   EditModal — upload-only flavour (Phase 1 test)
============================================================ */
const EditModal = ({ slot, currentUrl, onClose, onSaved }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onPick = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Solo se aceptan archivos de imagen (JPG, PNG, WEBP).");
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setError("La imagen supera el límite de 8 MB.");
      return;
    }
    setError(null);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPick(e.dataTransfer.files?.[0]);
  };

  const onSubmit = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `${API}/api/slots/${encodeURIComponent(slot)}/upload`,
        { method: "POST", body: fd }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Error al subir la imagen.");
      }
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
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1513]/72 backdrop-blur-sm"
      />
      {/* dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xl bg-[#FDFBF7] border border-[#2C2621]/15 shadow-2xl"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2C2621]/10">
          <div>
            <span className="block text-[10px] tracking-[0.3em] uppercase text-[#C16542] font-semibold">
              Editar imagen
            </span>
            <p className="font-serif-x text-[20px] text-[#2C2621] leading-snug mt-1 break-all">
              {slot}
            </p>
          </div>
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

        {/* body */}
        <div className="p-6 space-y-5">
          {/* Current image preview (small) */}
          {currentUrl && !previewUrl && (
            <div>
              <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">
                Imagen actual
              </span>
              <div className="aspect-[16/9] overflow-hidden bg-[#F2EBE1] border border-[#2C2621]/10">
                <img
                  src={resolveUrl(currentUrl)}
                  alt="Imagen actual"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* New image picker / preview */}
          <div>
            <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">
              {previewUrl ? "Nueva imagen" : "Subir nueva imagen"}
            </span>
            {previewUrl ? (
              <div className="relative aspect-[16/9] overflow-hidden bg-[#F2EBE1] border border-[#C16542]">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setFile(null);
                  }}
                  className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 bg-[#FDFBF7]/95 text-[#2C2621] hover:bg-[#FDFBF7]"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.6} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={onDrop}
                data-testid={`edit-modal-dropzone-${slot}`}
                className="w-full flex flex-col items-center justify-center gap-3 py-12 px-6 border-2 border-dashed border-[#2C2621]/25 hover:border-[#C16542] hover:bg-[#FDF5EB] transition-colors duration-300 cursor-pointer"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C16542]/10 text-[#C16542]">
                  <Upload className="w-5 h-5" strokeWidth={1.6} />
                </span>
                <span className="text-[14px] text-[#2C2621] font-medium">
                  Arrastra una imagen aquí o haz click para seleccionar
                </span>
                <span className="text-[11px] text-[#5C5248]">JPG · PNG · WEBP — máx. 8 MB</span>
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              data-testid={`edit-modal-file-input-${slot}`}
              onChange={(e) => onPick(e.target.files?.[0])}
            />
          </div>

          {/* Error */}
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

        {/* footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F8F2E6] border-t border-[#2C2621]/10">
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
            disabled={!file || busy}
            data-testid={`edit-modal-save-${slot}`}
            className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-5 py-3 text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.8} />
            ) : (
              <Check className="w-3.5 h-3.5" strokeWidth={1.8} />
            )}
            <span>{busy ? "Subiendo…" : "Guardar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableImage;
