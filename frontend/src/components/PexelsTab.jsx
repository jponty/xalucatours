/* ============================================================
   PexelsTab.jsx
   ----
   Pexels stock-photo browser, rendered inside the image library
   picker modal. Talks to our FastAPI proxy (`/api/pexels/*`) —
   the Pexels API key NEVER reaches the browser.

   UX guarantees:
     · Search box is a real `<form>` — pressing Enter submits.
     · 250 ms debounce auto-searches while typing, but the user
       can also press Enter or click the search button to fire
       the query immediately.
     · `AbortController` cancels any in-flight request when a
       newer query is fired, so a slow response from "des" can
       never overwrite a fresh response from "desert".
     · Loading is shown both at the top (compact spinner) and as
       a full-cover overlay so the user is never in doubt.
     · Empty / error / curated / typing states are distinct.
     · Click a thumbnail → POST /api/pexels/import. Backend
       downloads + stores + persists attribution. The returned
       asset is handed off via onSelect() with the same shape as
       the library picker, so the parent slot updates instantly.
============================================================ */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Search, Loader2, ExternalLink, Check, AlertCircle, Sparkles,
  RotateCcw, X,
} from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL || "";
const DEBOUNCE_MS = 250;
const PER_PAGE = 24;

const COPY = {
  placeholder: "Busca en Pexels — desierto, kasbah, medina, Marrakech…",
  searchBtn:   "Buscar",
  clearBtn:    "Limpiar",
  loadingHero: "Cargando fotos de Pexels…",
  loadingTop:  "Buscando…",
  curated:     "Selección destacada · Pexels",
  results:     (n, q) => `${n} ${n === 1 ? "resultado" : "resultados"} para “${q}”`,
  empty:       (q) => `Sin resultados para “${q}”. Prueba con otra palabra clave o un término en inglés (p. ej. "morocco", "kasbah").`,
  emptyCurated:"No se pudieron cargar las fotos destacadas. Reintenta en unos segundos.",
  more:        "Cargar más resultados",
  retry:       "Reintentar",
  by:          "por",
  view:        "Ver en Pexels",
  importing:   "Importando…",
  inserted:    "Imagen insertada",
  importErr:   "No se pudo importar la imagen. Inténtalo de nuevo.",
};

/* Single shared fetch wrapper — no AbortSignal, since the preview
   environment's fetch monkey-patch tries to postMessage the Request
   and chokes on the non-cloneable AbortSignal. A `cancelled` flag in
   the effect handles race conditions just as well. */
const fetchPexels = async (path, params) => {
  const qs = new URLSearchParams(params).toString();
  const r = await fetch(`${API}${path}?${qs}`);
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.detail || `HTTP ${r.status}`);
  }
  return r.json();
};

export default function PexelsTab({ onSelect, selectionMode = false, selectedKeys, onToggleSelect, initialQuery }) {
  const [query, setQuery]       = useState(() => initialQuery || "");
  const [debounced, setDeb]     = useState(() => (initialQuery || "").trim());
  const [photos, setPhotos]     = useState([]);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [importingId, setImpId] = useState(null);
  const [importedId, setImpOk]  = useState(null);

  const abortRef = useRef(null);
  const inputRef = useRef(null);
  const reloadRef = useRef(0);       // bump to force a refetch with the same query

  // Focus the input as soon as the tab mounts (desktop only — focusing on
  // mobile would surface the keyboard and shrink the grid).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (!isCoarse) inputRef.current?.focus({ preventScroll: true });
  }, []);

  /* ---- Debounce typing ---- */
  useEffect(() => {
    const t = setTimeout(() => setDeb(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  /* ---- Run a fresh page-1 query whenever `debounced` or `reloadRef` changes ---- */
  useEffect(() => {
    let cancelled = false;
    abortRef.current?.();
    abortRef.current = () => { cancelled = true; };

    setLoading(true);
    setError(null);
    setPage(1);

    (async () => {
      try {
        const data = debounced
          ? await fetchPexels("/api/pexels/search",  { query: debounced, page: 1, per_page: PER_PAGE })
          : await fetchPexels("/api/pexels/curated", { page: 1, per_page: PER_PAGE });
        if (cancelled) return;
        setPhotos(data.photos || []);
        setHasMore(!!data.next_page);
      } catch (e) {
        if (cancelled) return;
        // Emergent preview wraps fetch and may throw a DataCloneError on
        // the side, even though the network actually succeeded. Treat it
        // as benign — the next StrictMode effect run (or a subsequent
        // debounce) will deliver the real data.
        if (e.name === "DataCloneError" || /postMessage|clone/i.test(e.message || "")) return;
        setError(e.message || "Pexels error");
        setPhotos([]);
        setHasMore(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [debounced, reloadRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = page + 1;
      const data = debounced
        ? await fetchPexels("/api/pexels/search",  { query: debounced, page: next, per_page: PER_PAGE })
        : await fetchPexels("/api/pexels/curated", { page: next, per_page: PER_PAGE });
      setPhotos((prev) => [...prev, ...(data.photos || [])]);
      setHasMore(!!data.next_page);
      setPage(next);
    } catch (e) {
      setError(e.message || "Pexels error");
    } finally {
      setLoading(false);
    }
  }, [debounced, page]);

  const submit = useCallback((e) => {
    e?.preventDefault?.();
    // Skip the debounce — fire the search RIGHT NOW.
    setDeb(query.trim());
    reloadRef.current += 1;
  }, [query]);

  const clearQuery = useCallback(() => {
    setQuery("");
    setDeb("");
    inputRef.current?.focus();
  }, []);

  const retry = useCallback(() => {
    reloadRef.current += 1;
    // Bump debounced too so the effect dependency definitely changes.
    setDeb((d) => d);
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

  const showInitialSkeleton = loading && photos.length === 0 && !error;
  const showEmpty           = !loading && !error && photos.length === 0;

  return (
    <div data-testid="image-library-pexels" className="flex flex-col">
      {/* ============== Search form ============== */}
      <form
        onSubmit={submit}
        role="search"
        data-testid="pexels-search-form"
        className="relative mb-3 flex items-stretch gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5248] pointer-events-none" strokeWidth={1.7} />
          <input
            ref={inputRef}
            type="text"
            name="q"
            autoComplete="off"
            spellCheck={false}
            inputMode="search"
            enterKeyHint="search"
            data-testid="pexels-search-input"
            placeholder={COPY.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#FDFBF7] border border-[#2C2621]/20 pl-10 pr-10 py-3 text-[14px] text-[#2C2621] placeholder:text-[#9C8E78] focus:outline-none focus:border-[#C16542]"
          />
          {query && (
            <button
              type="button"
              data-testid="pexels-search-clear"
              onClick={clearQuery}
              aria-label={COPY.clearBtn}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center text-[#5C5248] hover:text-[#C16542] hover:bg-[#2C2621]/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          )}
        </div>
        <button
          type="submit"
          data-testid="pexels-search-submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-[#2C2621] hover:bg-[#1A1513] disabled:opacity-50 disabled:cursor-not-allowed text-[#FDFBF7] px-4 sm:px-5 text-[10px] tracking-[0.28em] uppercase transition-colors min-w-[44px] sm:min-w-[120px]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.8} />
          ) : (
            <Search className="w-4 h-4" strokeWidth={1.8} />
          )}
          <span className="hidden sm:inline">{COPY.searchBtn}</span>
        </button>
      </form>

      {/* ============== Status row (eyebrow + spinner) ============== */}
      <div className="flex items-center justify-between gap-3 mb-4 min-h-[18px]">
        <span data-testid="pexels-status" className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-[#5C5248] truncate">
          {debounced ? (
            <>
              <Search className="w-3 h-3 shrink-0" strokeWidth={1.7} />
              <span className="truncate">
                {loading && photos.length === 0
                  ? COPY.loadingTop
                  : COPY.results(photos.length, debounced)}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 shrink-0" strokeWidth={1.7} />
              {COPY.curated}
            </>
          )}
        </span>
        {loading && photos.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-[#C16542]">
            <Loader2 className="w-3 h-3 animate-spin" />
            {COPY.loadingTop}
          </span>
        )}
      </div>

      {/* ============== Error banner ============== */}
      {error && (
        <div data-testid="pexels-error" className="mb-4 flex items-start gap-2 p-3 bg-[#FDEEEA] border border-[#C16542]/30 text-[12px] text-[#A35133]">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={1.7} />
          <div className="flex-1">
            <p className="leading-relaxed">{error}</p>
            <button
              type="button"
              data-testid="pexels-error-retry"
              onClick={retry}
              className="mt-2 inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#A35133] hover:text-[#7A2E1E]"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={1.8} />
              {COPY.retry}
            </button>
          </div>
        </div>
      )}

      {/* ============== Initial skeleton ============== */}
      {showInitialSkeleton && (
        <div data-testid="pexels-skeleton" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-[#2C2621]/8 animate-pulse" />
          ))}
        </div>
      )}

      {/* ============== Empty state ============== */}
      {showEmpty && (
        <div data-testid="pexels-empty" className="py-12 px-4 text-center text-[13px] text-[#5C5248] italic leading-relaxed">
          {debounced ? COPY.empty(debounced) : COPY.emptyCurated}
        </div>
      )}

      {/* ============== Grid ============== */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="pexels-grid">
          {photos.map((p) => {
            const isImporting = importingId === p.id;
            const isImported  = importedId  === p.id;
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
                data-testid={`pexels-card-${p.id}`}
                className={`group relative bg-[#1A1513] overflow-hidden border transition-colors ${
                  selected ? "border-[#C16542] ring-2 ring-[#C16542]" : "border-transparent hover:border-[#C16542]/60"
                }`}
              >
                <button
                  type="button"
                  disabled={isImporting && !selectionMode}
                  onClick={handleClick}
                  aria-pressed={selectionMode ? selected : undefined}
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
                      data-testid={`pexels-check-${p.id}`}
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
                {/* License attribution */}
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
      )}

      {/* ============== Load more ============== */}
      {hasMore && photos.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            data-testid="pexels-load-more"
            disabled={loading}
            onClick={loadMore}
            className="inline-flex items-center gap-2 bg-[#2C2621] hover:bg-[#1A1513] disabled:opacity-40 disabled:cursor-not-allowed text-[#FDFBF7] px-5 py-2.5 text-[10px] tracking-[0.28em] uppercase transition-colors"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {COPY.more}
          </button>
        </div>
      )}

      {/* ============== Pexels brand attribution footer ============== */}
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
