/* ============================================================
   UnsplashTab.jsx
   ----
   Unsplash stock-photo browser, mirrors PexelsTab.jsx for UX
   consistency. Talks to our FastAPI proxy (`/api/unsplash/*`) —
   the Unsplash Access Key NEVER reaches the browser.

   Same guarantees as PexelsTab:
     · Search form (Enter submits + explicit search button)
     · 250 ms debounce, AbortController for race-free state
     · Loading / empty / error states distinct and visible
     · "Load more" pagination
     · Click → POST /api/unsplash/import (downloads, pings the
       mandatory `download_location` endpoint, stores asset,
       persists attribution) → onSelect(asset)
============================================================ */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Img } from "@/components/Img";
import {
  Search, Loader2, ExternalLink, Check, AlertCircle, Sparkles,
  RotateCcw, X, MapPin,
} from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL || "";
const DEBOUNCE_MS = 250;
const PER_PAGE = 24;

const COPY = {
  placeholder: "Busca en Unsplash — desierto, kasbah, medina, Marrakech…",
  searchBtn:   "Buscar",
  clearBtn:    "Limpiar",
  loadingTop:  "Buscando…",
  featured:    "Selección destacada · Unsplash",
  results:     (n, q) => `${n} ${n === 1 ? "resultado" : "resultados"} para “${q}”`,
  empty:       (q) => `Sin resultados para “${q}”. Prueba con otra palabra clave o un término en inglés (p. ej. "morocco", "kasbah").`,
  emptyFeat:   "No se pudieron cargar las fotos destacadas. Reintenta en unos segundos.",
  more:        "Cargar más resultados",
  retry:       "Reintentar",
  by:          "por",
  view:        "Ver en Unsplash",
  importing:   "Importando…",
  inserted:    "Imagen insertada",
  importErr:   "No se pudo importar la imagen. Inténtalo de nuevo.",
};

const fetchUnsplash = async (path, params) => {
  const qs = new URLSearchParams(params).toString();
  const r = await fetch(`${API}${path}?${qs}`);
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.detail || `HTTP ${r.status}`);
  }
  return r.json();
};

export default function UnsplashTab({ onSelect }) {
  const [query, setQuery]       = useState("");
  const [debounced, setDeb]     = useState("");
  const [photos, setPhotos]     = useState([]);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [importingId, setImpId] = useState(null);
  const [importedId, setImpOk]  = useState(null);

  const abortRef  = useRef(null);
  const inputRef  = useRef(null);
  const reloadRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (!isCoarse) inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDeb(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

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
          ? await fetchUnsplash("/api/unsplash/search",   { query: debounced, page: 1, per_page: PER_PAGE })
          : await fetchUnsplash("/api/unsplash/featured", { page: 1, per_page: PER_PAGE });
        if (cancelled) return;
        setPhotos(data.photos || []);
        setHasMore(!!data.next_page);
      } catch (e) {
        if (cancelled) return;
        if (e.name === "DataCloneError" || /postMessage|clone/i.test(e.message || "")) return;
        setError(e.message || "Unsplash error");
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
        ? await fetchUnsplash("/api/unsplash/search",   { query: debounced, page: next, per_page: PER_PAGE })
        : await fetchUnsplash("/api/unsplash/featured", { page: next, per_page: PER_PAGE });
      setPhotos((prev) => [...prev, ...(data.photos || [])]);
      setHasMore(!!data.next_page);
      setPage(next);
    } catch (e) {
      setError(e.message || "Unsplash error");
    } finally {
      setLoading(false);
    }
  }, [debounced, page]);

  const submit = useCallback((e) => {
    e?.preventDefault?.();
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
    setDeb((d) => d);
  }, []);

  const importPhoto = useCallback(async (photo) => {
    setImpId(photo.id);
    setImpOk(null);
    setError(null);
    try {
      const r = await fetch(`${API}/api/unsplash/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unsplash_id: photo.id }),
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
    <div data-testid="image-library-unsplash" className="flex flex-col">
      <form
        onSubmit={submit}
        role="search"
        data-testid="unsplash-search-form"
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
            data-testid="unsplash-search-input"
            placeholder={COPY.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#FDFBF7] border border-[#2C2621]/20 pl-10 pr-10 py-3 text-[14px] text-[#2C2621] placeholder:text-[#9C8E78] focus:outline-none focus:border-[#C16542]"
          />
          {query && (
            <button
              type="button"
              data-testid="unsplash-search-clear"
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
          data-testid="unsplash-search-submit"
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

      <div className="flex items-center justify-between gap-3 mb-4 min-h-[18px]">
        <span data-testid="unsplash-status" className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-[#5C5248] truncate">
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
              {COPY.featured}
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

      {error && (
        <div data-testid="unsplash-error" className="mb-4 flex items-start gap-2 p-3 bg-[#FDEEEA] border border-[#C16542]/30 text-[12px] text-[#A35133]">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={1.7} />
          <div className="flex-1">
            <p className="leading-relaxed">{error}</p>
            <button
              type="button"
              data-testid="unsplash-error-retry"
              onClick={retry}
              className="mt-2 inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#A35133] hover:text-[#7A2E1E]"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={1.8} />
              {COPY.retry}
            </button>
          </div>
        </div>
      )}

      {showInitialSkeleton && (
        <div data-testid="unsplash-skeleton" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-[#2C2621]/8 animate-pulse" />
          ))}
        </div>
      )}

      {showEmpty && (
        <div data-testid="unsplash-empty" className="py-12 px-4 text-center text-[13px] text-[#5C5248] italic leading-relaxed">
          {debounced ? COPY.empty(debounced) : COPY.emptyFeat}
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="unsplash-grid">
          {photos.map((p) => {
            const isImporting = importingId === p.id;
            const isImported  = importedId  === p.id;
            return (
              <div
                key={p.id}
                data-testid={`unsplash-card-${p.id}`}
                className="group relative bg-[#1A1513] overflow-hidden border border-transparent hover:border-[#C16542]/60 transition-colors"
              >
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={() => importPhoto(p)}
                  data-testid={`unsplash-pick-${p.id}`}
                  className="block w-full aspect-[4/3] relative cursor-pointer disabled:cursor-progress"
                  aria-label={`Insertar foto de ${p.photographer}`}
                >
                  <Img
                    src={p.thumb_url}
                    alt={p.alt || `Photo by ${p.photographer} on Unsplash`}
                    width={400}
                    sizes="(max-width: 640px) 50vw, 300px"
                    style={{ backgroundColor: p.avg_color || "#1A1513" }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
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
                    {!isImporting && !isImported && (
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 bg-[#C16542] text-[#FDFBF7] px-3 py-2 text-[10px] tracking-[0.25em] uppercase">
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        Usar esta
                      </span>
                    )}
                  </span>
                </button>
                <div className="bg-[#FDFBF7] border-t border-[#2C2621]/10">
                  {p.location?.display && (
                    <div
                      data-testid={`unsplash-location-${p.id}`}
                      title={p.location.display}
                      className="px-2.5 pt-2 flex items-center gap-1 text-[10px] text-[#7C3B23]"
                    >
                      <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.8} />
                      <span className="truncate">{p.location.display}</span>
                    </div>
                  )}
                  <div className="px-2.5 py-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#5C5248] truncate flex-1">
                      {COPY.by}{" "}
                      <a
                        href={p.photographer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#2C2621] hover:text-[#C16542] underline-offset-2 hover:underline"
                      >
                        {p.photographer || "Unsplash"}
                      </a>
                    </span>
                    <a
                      href={p.unsplash_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={COPY.view}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#5C5248] hover:text-[#C16542] shrink-0"
                      data-testid={`unsplash-link-${p.id}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.7} />
                    </a>
                  </div>
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
            data-testid="unsplash-load-more"
            disabled={loading}
            onClick={loadMore}
            className="inline-flex items-center gap-2 bg-[#2C2621] hover:bg-[#1A1513] disabled:opacity-40 disabled:cursor-not-allowed text-[#FDFBF7] px-5 py-2.5 text-[10px] tracking-[0.28em] uppercase transition-colors"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {COPY.more}
          </button>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-[#2C2621]/10 text-[10px] tracking-[0.2em] uppercase text-[#5C5248] text-center">
        Photos provided by{" "}
        <a
          href={`https://unsplash.com/?utm_source=xaluca_tours&utm_medium=referral`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2C2621] hover:text-[#C16542] underline-offset-2 hover:underline"
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}
