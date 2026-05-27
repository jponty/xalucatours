import React, { useEffect, useState, useCallback } from "react";
import { Library, Search, X, Loader2, Check, AlertCircle } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL || "";

/* ============================================================
   <ImageLibraryPicker />
   ----
   Modal picker that lists every image previously uploaded via the
   Emergent Object Storage. Used by EditableImage as the "reuse an
   existing photo" shortcut so the team doesn't re-upload the same
   dune shot in every page.

   Props:
     open      boolean
     onClose   () => void
     onSelect  (item) => void   // item = { url, storage_path, ... }
============================================================ */
export default function ImageLibraryPicker({ open, onClose, onSelect }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(id);
  }, [q]);

  // Load list when open + on search change
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit: "120" });
        if (debounced) params.set("q", debounced);
        const res = await fetch(`${API}/api/files?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setItems(data.items || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "No se pudo cargar la biblioteca.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, debounced]);

  // Close on Escape
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") onClose?.();
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div
      data-testid="image-library-picker"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1A1513]/85 backdrop-blur-sm p-4 md:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#FDFBF7] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 border-b border-[#2C2621]/12">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#C16542]/10 text-[#C16542] flex-shrink-0">
              <Library className="w-5 h-5" strokeWidth={1.6} />
            </span>
            <div className="min-w-0">
              <h3 className="font-serif-x text-xl md:text-2xl text-[#2C2621] leading-tight">
                Biblioteca de imágenes
              </h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#5C5248] mt-0.5 truncate">
                {loading ? "Cargando…" : `${items.length} foto${items.length === 1 ? "" : "s"} disponibles`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="image-library-close"
            aria-label="Cerrar biblioteca"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#2C2621]/10 text-[#2C2621] transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 md:px-8 py-4 border-b border-[#2C2621]/10 bg-[#F8F2E6]/40">
          <label className="flex items-center gap-3 bg-[#FDFBF7] border border-[#2C2621]/15 focus-within:border-[#C16542] px-4 py-2.5 transition-colors">
            <Search className="w-4 h-4 text-[#5C5248] flex-shrink-0" strokeWidth={1.6} />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre de archivo o slot…"
              data-testid="image-library-search"
              className="flex-1 bg-transparent border-0 outline-none text-sm text-[#2C2621] placeholder-[#5C5248]/60"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="text-[#5C5248] hover:text-[#C16542]"
                aria-label="Limpiar"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.8} />
              </button>
            )}
          </label>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 bg-[#FDFBF7]">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-[#FBE4DC] border border-[#C16542]/40 text-[#7C3B23] text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
              <span>{error}</span>
            </div>
          )}
          {loading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#5C5248]">
              <Loader2 className="w-6 h-6 animate-spin" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.25em] uppercase">Cargando biblioteca</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#5C5248] text-center">
              <Library className="w-10 h-10 text-[#5C5248]/40" strokeWidth={1.3} />
              <p className="text-sm">
                {debounced
                  ? `Ninguna imagen coincide con "${debounced}".`
                  : "Tu biblioteca está vacía — sube tu primera foto desde el modo edit."}
              </p>
            </div>
          ) : (
            <div
              data-testid="image-library-grid"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
            >
              {items.map((it) => (
                <LibraryThumb key={it.id || it.storage_path} item={it} onSelect={onSelect} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 border-t border-[#2C2621]/10 flex items-center justify-between gap-3 text-[11px] text-[#5C5248]">
          <span className="tracking-[0.2em] uppercase">
            Las fotos se reutilizan al pulsar — no se vuelven a subir.
          </span>
          <button
            type="button"
            onClick={onClose}
            data-testid="image-library-cancel"
            className="text-[#2C2621] hover:text-[#C16542] tracking-[0.25em] uppercase font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LibraryThumb — single picker card
============================================================ */
function LibraryThumb({ item, onSelect }) {
  const fullUrl = item.url?.startsWith("http") ? item.url : `${API}${item.url}`;
  const niceName = item.original_filename || item.slot_id || item.storage_path?.split("/").pop();
  const sizeKb = item.size ? Math.max(1, Math.round(item.size / 1024)) : null;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item)}
      data-testid={`image-library-item-${(item.id || item.storage_path || "x").slice(0, 24)}`}
      className="group relative flex flex-col bg-[#FDFBF7] border border-[#2C2621]/12 hover:border-[#C16542] focus:border-[#C16542] focus:outline-none transition-colors text-left"
    >
      <div className="relative aspect-square overflow-hidden bg-[#F2EBE1]">
        <img
          src={fullUrl}
          alt={niceName}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.style.opacity = "0.2"; }}
        />
        <div className="absolute inset-0 bg-[#1A1513]/0 group-hover:bg-[#1A1513]/35 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 bg-[#C16542] text-[#FDFBF7] px-4 py-2 text-[10px] tracking-[0.25em] uppercase">
            <Check className="w-3.5 h-3.5" strokeWidth={2} />
            Usar esta
          </span>
        </div>
      </div>
      <div className="p-2.5 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-[#2C2621] truncate">{niceName}</span>
        {sizeKb && <span className="text-[#5C5248] flex-shrink-0">{sizeKb} KB</span>}
      </div>
    </button>
  );
}
