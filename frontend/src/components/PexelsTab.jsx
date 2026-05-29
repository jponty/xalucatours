/* ============================================================
   PexelsTab.jsx
   ----
   Pexels stock-photo browser, rendered inside the image library
   picker modal. Talks to our FastAPI proxy (`/api/pexels/*`) —
   the Pexels API key NEVER reaches the browser.

   UX:
     · Search box with 350 ms debounce; empty query falls back to
       the Pexels curated feed.
     · Editorial grid with photographer credit + Pexels link
       (license-compliant attribution).
     · "Load more" appends the next page in place.
     · Click a thumbnail → POST /api/pexels/import. The backend
       downloads the original, stores it in the same object
       storage as user uploads, and returns a library asset that
       we hand off via onSelect(url, attribution).
============================================================ */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Search, Loader2, ExternalLink, Check, AlertCircle, Sparkles,
} from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL || "";

const COPY = {
  placeholder: "Busca en Pexels — desierto, kasbah, medina…",
  loading:     "Buscando en Pexels…",
  curated:     "Selección destacada",
  empty:       "Sin resultados · prueba con otra palabra clave.",
  more:        "Cargar más resultados",
  by:          "por",
  on:          "en",
  view:        "Ver en Pexels",
  importing:   "Importando…",
  inserted:    "Imagen insertada",
  importErr:   "No se pudo importar la imagen. Inténtalo de nuevo.",
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

export default function PexelsTab({ onSelect, onClose }) {
  const [query, setQuery]       = useState("");
  const [debounced, setDeb]     = useState("");
  const [photos, setPhotos]     = useState([]);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [importingId, setImpId] = useState(null);
  const [importedId, setImpOk]  = useState(null);
  const abortRef                = useRef(null);

  /* ---- 350 ms debounce on the search input ---- */
  useEffect(() => {
    const t = setTimeout(() => setDeb(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  /* ---- Reset and load page 1 whenever the query changes ---- */
  useEffect(() => {
    let cancelled = false;
    if (abortRef.current) abortRef.current.abort?.();
    setError(null);
    setLoading(true);
    setPage(1);
    (async () => {
      try {
        const data = debounced
          ? await fetchPexels("/api/pexels/search",  { query: debounced, page: 1, per_page: 24 })
          : await fetchPexels("/api/pexels/curated", { page: 1, per_page: 24 });
        if (cancelled) return;
        setPhotos(data.photos || []);
        setHasMore(!!data.next_page);
      } catch (e) {
        if (!cancelled) setError(e.message || "Pexels error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debounced]);

  const loadMore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = page + 1;
      const data = debounced
        ? await fetchPexels("/api/pexels/search",  { query: debounced, page: next, per_page: 24 })
        : await fetchPexels("/api/pexels/curated", { page: next, per_page: 24 });
      setPhotos((prev) => [...prev, ...(data.photos || [])]);
      setHasMore(!!data.next_page);
      setPage(next);
    } catch (e) {
      setError(e.message || "Pexels error");
    } finally {
      setLoading(false);
    }
  }, [debounced, page]);

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
      // Build absolute URL so the parent can treat this item identically to
      // a local LibraryThumb pick (its onSelect expects an item with .url).
      const absUrl = j.url.startsWith("http") ? j.url : `${API}${j.url}`;
      setImpOk(photo.id);
      onSelect?.({ ...j, url: absUrl });
    } catch (e) {
      setError(e.message || COPY.importErr);
    } finally {
      setImpId(null);
    }
  }, [onSelect]);

  return (
    <div data-testid="image-library-pexels" className="flex flex-col">
      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5248]" strokeWidth={1.7} />
        <input
          type="search"
          data-testid="pexels-search-input"
          placeholder={COPY.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#FDFBF7] border border-[#2C2621]/20 pl-10 pr-4 py-2.5 text-[14px] text-[#2C2621] placeholder:text-[#9C8E78] focus:outline-none focus:border-[#C16542]"
        />
      </div>

      {/* Eyebrow row — curated label or result count */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
          {debounced ? (
            <>
              <Search className="w-3 h-3" strokeWidth={1.7} />
              "{debounced}" · {photos.length} {photos.length === 1 ? "resultado" : "resultados"}
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" strokeWidth={1.7} />
              {COPY.curated}
            </>
          )}
        </span>
        {loading && (
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-[#C16542]">
            <Loader2 className="w-3 h-3 animate-spin" />
            {COPY.loading}
          </span>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div data-testid="pexels-error" className="mb-4 flex items-center gap-2 p-3 bg-[#FDEEEA] border border-[#C16542]/30 text-[12px] text-[#A35133]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.7} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && photos.length === 0 && (
        <div data-testid="pexels-empty" className="py-12 text-center text-[13px] text-[#5C5248] italic">
          {COPY.empty}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="pexels-grid">
        {photos.map((p) => {
          const isImporting = importingId === p.id;
          const isImported  = importedId  === p.id;
          return (
            <div
              key={p.id}
              data-testid={`pexels-card-${p.id}`}
              className="group relative bg-[#1A1513] overflow-hidden border border-transparent hover:border-[#C16542]/60 transition-colors"
            >
              <button
                type="button"
                disabled={isImporting}
                onClick={() => importPhoto(p)}
                data-testid={`pexels-pick-${p.id}`}
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
                {/* Hover overlay */}
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
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
                </span>
              </button>
              {/* Attribution strip — required by Pexels license */}
              <div className="px-2.5 py-2 bg-[#FDFBF7] border-t border-[#2C2621]/10 flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#5C5248] truncate flex-1">
                  {COPY.by}{" "}
                  <a
                    href={p.photographer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#2C2621] hover:text-[#C16542] underline-offset-2 hover:underline"
                  >
                    {p.photographer || "Pexels"}
                  </a>
                </span>
                <a
                  href={p.pexels_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={COPY.view}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#5C5248] hover:text-[#C16542] shrink-0"
                  data-testid={`pexels-link-${p.id}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.7} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load more */}
      {hasMore && photos.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            data-testid="pexels-load-more"
            disabled={loading}
            onClick={loadMore}
            className="inline-flex items-center gap-2 bg-[#2C2621] hover:bg-[#1A1513] disabled:opacity-40 disabled:cursor-not-allowed text-[#FDFBF7] px-5 py-2.5 text-[10px] tracking-[0.28em] uppercase transition-colors"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {COPY.more}
          </button>
        </div>
      )}

      {/* Pexels brand attribution footer */}
      <div className="mt-6 pt-4 border-t border-[#2C2621]/10 text-[10px] tracking-[0.2em] uppercase text-[#5C5248] text-center">
        Photos provided by{" "}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2C2621] hover:text-[#C16542] underline-offset-2 hover:underline"
        >
          Pexels
        </a>
      </div>
    </div>
  );
}
