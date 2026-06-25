import React, { useState, useRef, useCallback, useEffect } from "react";
import { Search, Loader2, X, ImageOff, Sparkles, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Img } from "@/components/Img";

const API = process.env.REACT_APP_BACKEND_URL;

const T = {
  es: {
    eyebrow: "Banco de imágenes · Pexels",
    title: "Busca imágenes de cualquier lugar de Marruecos",
    subtitle:
      "Escribe el nombre de un sitio —una kasbah, un pueblo, un oasis— y explora una galería de fotografías libres de derechos.",
    placeholder: "Ej. Chefchaouen, Aït Ben Haddou, Merzouga…",
    search: "Buscar",
    searching: "Buscando…",
    suggestions: "Sugerencias",
    noResults: "No encontramos imágenes para esa búsqueda. Prueba con otro término.",
    error: "No se pudo completar la búsqueda. Inténtalo de nuevo.",
    results: "imágenes",
    photoBy: "Foto de",
    loadMore: "Cargar más imágenes",
    close: "Cerrar",
  },
  en: {
    eyebrow: "Image library · Pexels",
    title: "Search images of any place in Morocco",
    subtitle:
      "Type the name of a site —a kasbah, a village, an oasis— and explore a gallery of royalty-free photographs.",
    placeholder: "e.g. Chefchaouen, Aït Ben Haddou, Merzouga…",
    search: "Search",
    searching: "Searching…",
    suggestions: "Suggestions",
    noResults: "We couldn't find images for that search. Try another term.",
    error: "The search could not be completed. Please try again.",
    results: "images",
    photoBy: "Photo by",
    loadMore: "Load more images",
    close: "Close",
  },
  fr: {
    eyebrow: "Banque d'images · Pexels",
    title: "Cherchez des images de n'importe quel lieu du Maroc",
    subtitle:
      "Saisissez le nom d'un site —une kasbah, un village, une oasis— et explorez une galerie de photographies libres de droits.",
    placeholder: "ex. Chefchaouen, Aït Ben Haddou, Merzouga…",
    search: "Rechercher",
    searching: "Recherche…",
    suggestions: "Suggestions",
    noResults: "Aucune image trouvée pour cette recherche. Essayez un autre terme.",
    error: "La recherche n'a pas pu aboutir. Réessayez.",
    results: "images",
    photoBy: "Photo par",
    loadMore: "Charger plus d'images",
    close: "Fermer",
  },
};

const SUGGESTIONS = [
  "Chefchaouen",
  "Aït Ben Haddou",
  "Merzouga",
  "Marrakech",
  "Fez",
  "Essaouira",
  "Sahara",
];

const PER_PAGE = 24;

// Drop low-resolution photos so the gallery never shows pixelated/blurry images.
const MIN_W = 1200;
const MIN_H = 800;
const isHighQuality = (p) => (p.width || 0) >= MIN_W && (p.height || 0) >= MIN_H;

export default function PexelsImageSearch({ lang = "es" }) {
  const t = T[lang] || T.es;
  const [query, setQuery] = useState("");
  const [activeTerm, setActiveTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const scrollByCards = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" });
  }, []);

  const fetchPage = useCallback(
    async (term, pageNum) => {
      const q = `${term} Morocco`.trim();
      const res = await fetch(
        `${API}/api/pexels/search?query=${encodeURIComponent(q)}&per_page=${PER_PAGE}&page=${pageNum}`
      );
      if (!res.ok) throw new Error("bad status");
      return res.json();
    },
    []
  );

  const runSearch = useCallback(
    async (term) => {
      const q = (term ?? query).trim();
      if (!q) return;
      setLoading(true);
      setError(false);
      setSearched(true);
      setActiveTerm(q);
      try {
        const data = await fetchPage(q, 1);
        const hq = (data.photos || []).filter(isHighQuality);
        setPhotos(hq);
        setPage(1);
        setHasMore(Boolean(data.next_page));
        setTotal(data.total_results || hq.length);
      } catch (e) {
        setError(true);
        setPhotos([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [query, fetchPage]
  );

  const loadMore = useCallback(async () => {
    if (!activeTerm || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await fetchPage(activeTerm, next);
      const hq = (data.photos || []).filter(isHighQuality);
      setPhotos((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...hq.filter((p) => !seen.has(p.id))];
      });
      setPage(next);
      setHasMore(Boolean(data.next_page));
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [activeTerm, page, loadingMore, fetchPage]);

  const onSuggestion = (s) => {
    setQuery(s);
    runSearch(s);
  };

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <section
      data-testid="image-search-section"
      className="relative bg-[#161616] overflow-hidden border-t border-[#000]/40"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-[0.06] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-[#D4A373]">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.7} />
            {t.eyebrow}
          </span>
          <h2 className="font-serif-x text-3xl sm:text-4xl lg:text-[44px] leading-[1.08] text-[#FDFBF7] mt-5">
            {t.title}
          </h2>
          <p className="mt-5 text-[15px] md:text-base text-[#FDFBF7]/65 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
          className="mt-9 flex flex-col sm:flex-row gap-3 max-w-2xl"
        >
          <div className="relative flex-1 group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FDFBF7]/40 group-focus-within:text-[#D4A373] transition-colors"
              strokeWidth={1.7}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              data-testid="image-search-input"
              className="w-full bg-[#FDFBF7]/[0.06] border border-[#FDFBF7]/20 focus:border-[#D4A373] text-[#FDFBF7] placeholder:text-[#FDFBF7]/35 pl-14 pr-5 py-4 text-base outline-none transition-colors backdrop-blur-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            data-testid="image-search-submit"
            className="inline-flex items-center justify-center gap-2 bg-[#C16542] hover:bg-[#a9512f] disabled:opacity-50 disabled:cursor-not-allowed text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.28em] uppercase transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                {t.searching}
              </>
            ) : (
              <>
                <Search className="w-4 h-4" strokeWidth={2} />
                {t.search}
              </>
            )}
          </button>
        </form>

        {/* Suggestions */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-[0.22em] uppercase text-[#FDFBF7]/40 mr-1">
            {t.suggestions}
          </span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggestion(s)}
              data-testid={`image-suggestion-${s.replace(/\s+/g, "-").toLowerCase()}`}
              className="px-3.5 py-1.5 text-[12px] text-[#FDFBF7]/75 border border-[#FDFBF7]/15 hover:border-[#D4A373] hover:text-[#D4A373] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-12">
          {error && (
            <p data-testid="image-search-error" className="text-[#FDFBF7]/70 text-sm flex items-center gap-2">
              <ImageOff className="w-4 h-4" strokeWidth={1.7} />
              {t.error}
            </p>
          )}

          {!error && searched && !loading && photos.length === 0 && (
            <p data-testid="image-search-empty" className="text-[#FDFBF7]/70 text-sm flex items-center gap-2">
              <ImageOff className="w-4 h-4" strokeWidth={1.7} />
              {t.noResults}
            </p>
          )}

          {photos.length > 0 && (
            <div data-testid="image-search-results">
              <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
                <div>
                  <span className="block text-[10px] tracking-[0.3em] uppercase text-[#D4A373]">
                    {activeTerm}
                  </span>
                  <h3 className="font-serif-x text-2xl md:text-3xl text-[#FDFBF7] mt-1.5">
                    {photos.length} {t.results}
                  </h3>
                </div>
              </div>

              {/* Horizontal carousel — uniform cards, side by side */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => scrollByCards(-1)}
                  aria-label="Anterior"
                  data-testid="image-carousel-prev"
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-[#FDFBF7] text-[#1A1513] hover:bg-[#D4A373] shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCards(1)}
                  aria-label="Siguiente"
                  data-testid="image-carousel-next"
                  className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full bg-[#FDFBF7] text-[#1A1513] hover:bg-[#D4A373] shadow-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={1.8} />
                </button>

                <div
                  ref={scrollRef}
                  data-testid="image-carousel"
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
                >
                  {photos.map((ph, i) => (
                    <button
                      type="button"
                      key={`${ph.id}-${i}`}
                      onClick={() => setLightbox(ph)}
                      data-testid={`image-photo-${i}`}
                      className="group relative overflow-hidden bg-[#2C2621] shrink-0 snap-start w-[260px] sm:w-[300px] md:w-[340px] aspect-[4/3]"
                      style={ph.avg_color ? { backgroundColor: ph.avg_color } : undefined}
                    >
                      <Img
                        src={ph.preview_url || ph.grid_url || ph.thumb_url}
                        alt={ph.alt || activeTerm}
                        width={480}
                        sizes="340px"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {ph.photographer && (
                        <span className="absolute left-3 bottom-3 right-3 text-[10px] tracking-[0.06em] text-[#FDFBF7]/90 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                          {t.photoBy} {ph.photographer}
                        </span>
                      )}
                    </button>
                  ))}

                  {hasMore && (
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loadingMore}
                      data-testid="image-load-more"
                      className="group relative shrink-0 snap-start w-[180px] aspect-[4/3] border border-[#FDFBF7]/25 hover:border-[#D4A373] text-[#FDFBF7] hover:text-[#D4A373] flex flex-col items-center justify-center gap-2 text-[10px] tracking-[0.26em] uppercase transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                      ) : (
                        <>
                          <ChevronRight className="w-6 h-6" strokeWidth={1.6} />
                          {t.loadMore}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          data-testid="image-lightbox"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[80] bg-[#0D0B0A]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-10"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label={t.close}
            data-testid="image-lightbox-close"
            className="absolute top-5 right-5 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FDFBF7]/10 hover:bg-[#FDFBF7]/25 text-[#FDFBF7] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.7} />
          </button>
          <Img
            src={lightbox.preview_url}
            alt={lightbox.alt || activeTerm}
            width={1280}
            sizes="100vw"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl"
          />
          {lightbox.photographer && (
            <a
              href={lightbox.pexels_url || lightbox.photographer_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              data-testid="image-lightbox-credit"
              className="mt-4 inline-flex items-center gap-2 text-[12px] tracking-[0.06em] text-[#FDFBF7]/70 hover:text-[#D4A373] transition-colors"
            >
              {t.photoBy} {lightbox.photographer} · Pexels
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.7} />
            </a>
          )}
        </div>
      )}
    </section>
  );
}
