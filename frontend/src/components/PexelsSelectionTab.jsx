/* ============================================================
   PexelsSelectionTab.jsx
   ----
   "Selección Pexels" — context-aware destination galleries.

   Detects the destinations featured across the site's itineraries
   (via lib/destinationKeywords) and presents them as category-grouped
   chips. Picking a destination runs an optimised Pexels search and
   shows its gallery; picking a photo imports it and applies it to the
   active image slot (same flow as <PexelsTab />).

   Results are cached per query for the lifetime of the modal so
   re-opening a destination is instant and never re-hits the API.
============================================================ */
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Loader2, Check, AlertCircle, MapPin, ChevronLeft, Compass, RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDestinationGroups } from "@/lib/destinationKeywords";

const API = process.env.REACT_APP_BACKEND_URL || "";
const PER_PAGE = 24;

const COPY = {
  intro:     "Galerías por destino · detectadas de tus itinerarios",
  back:      "Destinos",
  loading:   "Cargando fotos…",
  empty:     (d) => `Sin resultados de Pexels para “${d}”. Prueba con otro destino.`,
  retry:     "Reintentar",
  importing: "Importando…",
  inserted:  "Imagen insertada",
  importErr: "No se pudo importar la imagen. Inténtalo de nuevo.",
  by:        "por",
  more:      "Cargar más resultados",
};

const fetchPexels = async (path, params) => {
  const qs = new URLSearchParams(params).toString();
  const r = await fetch(`${API}${path}?${qs}`);
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.detail || `HTTP ${r.status}`);
  }
  return r.json();
};

export default function PexelsSelectionTab({ onSelect, selectionMode = false, selectedKeys, onToggleSelect }) {
  const { lang } = useLanguage();
  const groups = useMemo(() => getDestinationGroups(lang), [lang]);

  const [active, setActive] = useState(null);   // { id, label, query }
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const [importingId, setImpId] = useState(null);
  const [importedId, setImpOk] = useState(null);

  const cacheRef = useRef(new Map());            // query → { photos, page, hasMore }

  const openDestination = useCallback(async (dest) => {
    setActive(dest);
    setError(null);
    setImpOk(null);
    const cached = cacheRef.current.get(dest.query);
    if (cached) {
      setPhotos(cached.photos);
      setPage(cached.page);
      setHasMore(cached.hasMore);
      setLoading(false);
      return;
    }
    setPhotos([]);
    setPage(1);
    setHasMore(false);
    setLoading(true);
    try {
      const data = await fetchPexels("/api/pexels/search", {
        query: dest.query, page: 1, per_page: PER_PAGE,
      });
      const list = data.photos || [];
      const more = !!data.next_page;
      cacheRef.current.set(dest.query, { photos: list, page: 1, hasMore: more });
      setPhotos(list);
      setHasMore(more);
      setPage(1);
    } catch (e) {
      if (e.name === "DataCloneError" || /postMessage|clone/i.test(e.message || "")) return;
      setError(e.message || "Pexels error");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!active || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const next = page + 1;
      const data = await fetchPexels("/api/pexels/search", {
        query: active.query, page: next, per_page: PER_PAGE,
      });
      const more = !!data.next_page;
      setPhotos((prev) => {
        const merged = [...prev, ...(data.photos || [])];
        cacheRef.current.set(active.query, { photos: merged, page: next, hasMore: more });
        return merged;
      });
      setHasMore(more);
      setPage(next);
    } catch (e) {
      if (e.name === "DataCloneError" || /postMessage|clone/i.test(e.message || "")) return;
      setError(e.message || "Pexels error");
    } finally {
      setLoadingMore(false);
    }
  }, [active, page, loadingMore]);

  const back = useCallback(() => {
    setActive(null);
    setPhotos([]);
    setError(null);
    setHasMore(false);
    setPage(1);
  }, []);

  const importPhoto = useCallback(async (photo) => {
    setImpId(photo.id);
    setImpOk(null);
    setError(null);
    try {
      const r = await fetch(`${API}/api/pexels/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pexels_id: photo.id }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail || `HTTP ${r.status}`);
      const absUrl = j.url.startsWith("http") ? j.url : `${API}${j.url}`;
      setImpOk(photo.id);
      onSelect?.({ ...j, url: absUrl });
    } catch (e) {
      setError(e.message || COPY.importErr);
    } finally {
      setImpId(null);
    }
  }, [onSelect]);

  /* ----------------------------- Gallery view ----------------------------- */
  if (active) {
    return (
      <div data-testid="image-library-pexels-selection-gallery" className="flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={back}
            data-testid="pexels-selection-back"
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#5C5248] hover:text-[#C16542] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.8} />
            {COPY.back}
          </button>
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-[#7C3B23] truncate">
            <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.8} />
            <span className="truncate">{active.label}</span>
          </span>
        </div>

        {error && (
          <div data-testid="pexels-selection-error" className="mb-4 flex items-start gap-2 p-3 bg-[#FDEEEA] border border-[#C16542]/30 text-[12px] text-[#A35133]">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={1.7} />
            <div className="flex-1">
              <p className="leading-relaxed">{error}</p>
              <button
                type="button"
                onClick={() => openDestination(active)}
                className="mt-2 inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#A35133] hover:text-[#7A2E1E]"
              >
                <RotateCcw className="w-3 h-3" strokeWidth={1.8} />
                {COPY.retry}
              </button>
            </div>
          </div>
        )}

        {loading && photos.length === 0 && (
          <div data-testid="pexels-selection-skeleton">
            <div className="flex items-center justify-center gap-2 mb-4 text-[11px] tracking-[0.25em] uppercase text-[#5C5248]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C16542]" strokeWidth={1.8} />
              {COPY.loading}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-[#2C2621]/12 animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && photos.length === 0 && (
          <div data-testid="pexels-selection-empty" className="py-12 px-4 text-center text-[13px] text-[#5C5248] italic leading-relaxed">
            {COPY.empty(active.label)}
          </div>
        )}

        {photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="pexels-selection-grid">
            {photos.map((p) => {
              const isImporting = importingId === p.id;
              const isImported = importedId === p.id;
              const selKey = `pexels-${p.id}`;
              const selected = selectionMode && selectedKeys?.has(selKey);
              const handleClick = () => {
                if (selectionMode) {
                  onToggleSelect?.({
                    _key: selKey,
                    _pexelsId: p.id,
                    _needsImport: true,
                    thumb_url: p.thumb_url,
                    original_filename: p.alt || `Pexels ${p.id}`,
                  });
                } else {
                  importPhoto(p);
                }
              };
              return (
                <div
                  key={p.id}
                  data-testid={`pexels-selection-card-${p.id}`}
                  className={`group relative bg-[#1A1513] overflow-hidden border transition-colors ${
                    selected ? "border-[#C16542] ring-2 ring-[#C16542]" : "border-transparent hover:border-[#C16542]/60"
                  }`}
                >
                  <button
                    type="button"
                    disabled={isImporting && !selectionMode}
                    onClick={handleClick}
                    aria-pressed={selectionMode ? selected : undefined}
                    data-testid={`pexels-selection-pick-${p.id}`}
                    className="block w-full aspect-[4/3] relative cursor-pointer disabled:cursor-progress"
                    aria-label={`Insertar foto de ${p.photographer}`}
                  >
                    <img
                      src={p.thumb_url}
                      alt={p.alt || `Photo by ${p.photographer} on Pexels`}
                      loading="lazy"
                      style={{ backgroundColor: p.avg_color || "#1A1513" }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className={`absolute inset-0 transition-colors flex items-center justify-center ${
                      selected ? "bg-black/35" : "bg-black/0 group-hover:bg-black/35"
                    }`}>
                      {selectionMode ? (
                        !selected && (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 bg-[#C16542] text-[#FDFBF7] px-3 py-2 text-[10px] tracking-[0.25em] uppercase">
                            <Check className="w-3.5 h-3.5" strokeWidth={2} />
                            Seleccionar
                          </span>
                        )
                      ) : (
                        <>
                          {isImporting && (
                            <span className="inline-flex items-center gap-2 bg-[#FDFBF7] text-[#2C2621] px-3 py-2 text-[10px] tracking-[0.25em] uppercase">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              {COPY.importing}
                            </span>
                          )}
                          {isImported && !isImporting && (
                            <span className="inline-flex items-center gap-2 bg-[#5A6B4F] text-[#FDFBF7] px-3 py-2 text-[10px] tracking-[0.25em] uppercase">
                              <Check className="w-3.5 h-3.5" />
                              {COPY.inserted}
                            </span>
                          )}
                          {!isImporting && !isImported && (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 bg-[#C16542] text-[#FDFBF7] px-3 py-2 text-[10px] tracking-[0.25em] uppercase">
                              <Check className="w-3.5 h-3.5" strokeWidth={2} />
                              Usar esta
                            </span>
                          )}
                        </>
                      )}
                    </span>
                    {selectionMode && (
                      <span
                        data-testid={`pexels-selection-check-${p.id}`}
                        className={`absolute bottom-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all ${
                          selected
                            ? "bg-[#C16542] border-[#C16542] text-[#FDFBF7] scale-100"
                            : "bg-[#FDFBF7]/80 border-[#FDFBF7] text-transparent scale-90 group-hover:scale-100"
                        }`}
                      >
                        <Check className="w-4 h-4" strokeWidth={2.4} />
                      </span>
                    )}
                  </button>
                  <div className="px-2.5 py-2 bg-[#FDFBF7] border-t border-[#2C2621]/10">
                    <span className="text-[10px] text-[#5C5248] truncate block">
                      {COPY.by} {p.photographer || "Pexels"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasMore && photos.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              data-testid="pexels-selection-load-more"
              disabled={loadingMore}
              onClick={loadMore}
              className="inline-flex items-center gap-2 bg-[#2C2621] hover:bg-[#1A1513] disabled:opacity-40 disabled:cursor-not-allowed text-[#FDFBF7] px-5 py-2.5 text-[10px] tracking-[0.28em] uppercase transition-colors"
            >
              {loadingMore && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {COPY.more}
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#2C2621]/10 text-[10px] tracking-[0.2em] uppercase text-[#5C5248] text-center">
          Photos provided by{" "}
          <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-[#2C2621] hover:text-[#C16542] underline-offset-2 hover:underline">
            Pexels
          </a>
        </div>
      </div>
    );
  }

  /* --------------------------- Destinations view -------------------------- */
  return (
    <div data-testid="image-library-pexels-selection" className="flex flex-col">
      <div className="flex items-center gap-1.5 mb-5 text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
        <Compass className="w-3 h-3 shrink-0" strokeWidth={1.7} />
        <span className="truncate">{COPY.intro}</span>
      </div>

      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.category} data-testid={`pexels-selection-group-${g.category}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#2C2621] font-semibold">{g.label}</span>
              <span className="text-[10px] text-[#9C8E78]">· {g.items.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => openDestination(d)}
                  data-testid={`pexels-selection-dest-${d.id}`}
                  className="group inline-flex items-center gap-2 border border-[#2C2621]/20 hover:border-[#C16542] hover:bg-[#C16542]/5 px-3.5 py-2 text-[12px] text-[#2C2621] transition-colors"
                  title={`Ver fotos de ${d.label} en Pexels`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C16542] shrink-0" strokeWidth={1.8} />
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
