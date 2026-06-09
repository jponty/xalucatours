import React, { useState, useRef, useCallback, useEffect } from "react";
import { Search, MapPin, Loader2, X, ImageOff, Sparkles } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

const T = {
  es: {
    eyebrow: "Buscador de lugares · Google Places",
    title: "Busca imágenes de cualquier lugar de Marruecos",
    subtitle:
      "Escribe el nombre de un sitio —una kasbah, un pueblo, un oasis— y descubre fotografías reales del lugar.",
    placeholder: "Ej. Chefchaouen, Aït Ben Haddou, Merzouga…",
    search: "Buscar",
    searching: "Buscando…",
    suggestions: "Sugerencias",
    noResults: "No encontramos imágenes para ese lugar. Prueba con otro nombre.",
    noPhotos: "Sin fotografías disponibles para este lugar.",
    error: "No se pudo completar la búsqueda. Inténtalo de nuevo.",
    results: "Resultados",
    photosOf: "Fotografías de",
    close: "Cerrar",
  },
  en: {
    eyebrow: "Place finder · Google Places",
    title: "Search images of any place in Morocco",
    subtitle:
      "Type the name of a site —a kasbah, a village, an oasis— and discover real photographs of the place.",
    placeholder: "e.g. Chefchaouen, Aït Ben Haddou, Merzouga…",
    search: "Search",
    searching: "Searching…",
    suggestions: "Suggestions",
    noResults: "We couldn't find images for that place. Try another name.",
    noPhotos: "No photographs available for this place.",
    error: "The search could not be completed. Please try again.",
    results: "Results",
    photosOf: "Photographs of",
    close: "Close",
  },
  fr: {
    eyebrow: "Recherche de lieux · Google Places",
    title: "Cherchez des images de n'importe quel lieu du Maroc",
    subtitle:
      "Saisissez le nom d'un site —une kasbah, un village, une oasis— et découvrez de vraies photographies du lieu.",
    placeholder: "ex. Chefchaouen, Aït Ben Haddou, Merzouga…",
    search: "Rechercher",
    searching: "Recherche…",
    suggestions: "Suggestions",
    noResults: "Aucune image trouvée pour ce lieu. Essayez un autre nom.",
    noPhotos: "Aucune photographie disponible pour ce lieu.",
    error: "La recherche n'a pas pu aboutir. Réessayez.",
    results: "Résultats",
    photosOf: "Photographies de",
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
  "Ouarzazate",
];

const SPANS = [
  "col-span-12 sm:col-span-6 lg:col-span-5 row-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[360px]",
  "col-span-6 lg:col-span-4 aspect-[4/3]",
  "col-span-6 lg:col-span-3 aspect-[4/3]",
  "col-span-6 lg:col-span-4 aspect-[4/3]",
  "col-span-6 lg:col-span-5 aspect-[4/3]",
  "col-span-12 lg:col-span-3 aspect-[4/3] lg:aspect-[3/4]",
];

export default function GooglePlaceSearch({ lang = "es" }) {
  const t = T[lang] || T.es;
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);
  const [places, setPlaces] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [detailsCache, setDetailsCache] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const inputRef = useRef(null);

  const runSearch = useCallback(
    async (term) => {
      const q = (term ?? query).trim();
      if (!q) return;
      setLoading(true);
      setError(false);
      setSearched(true);
      try {
        const res = await fetch(
          `${API}/api/places/search?q=${encodeURIComponent(q)}&lang=${lang}&limit=8`
        );
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        const withPhotos = (data.places || []).filter((p) => p.photos && p.photos.length);
        setPlaces(withPhotos);
        setActiveIdx(0);
      } catch (e) {
        setError(true);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    },
    [query, lang]
  );

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

  const active = places[activeIdx] || null;
  const photoUrl = (rel) => `${API}${rel}`;

  // Fetch the full photo set (Place Details, up to 10) for the active place.
  const activeId = active && active.id;
  useEffect(() => {
    if (!activeId) return undefined;
    let cancelled = false;
    (async () => {
      // Skip if already cached.
      let cached = false;
      setDetailsCache((c) => {
        cached = Boolean(c[activeId]);
        return c;
      });
      if (cached) return;
      setDetailsLoading(true);
      try {
        const res = await fetch(
          `${API}/api/places/details?place_id=${encodeURIComponent(activeId)}&lang=${lang}`
        );
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        if (!cancelled) setDetailsCache((c) => ({ ...c, [activeId]: data.photos || [] }));
      } catch (e) {
        if (!cancelled) setDetailsCache((c) => ({ ...c, [activeId]: [] }));
      } finally {
        if (!cancelled) setDetailsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId, lang]);

  // Prefer the richer Place Details gallery; fall back to the search thumbnail.
  const displayPhotos =
    active && detailsCache[active.id] && detailsCache[active.id].length > 0
      ? detailsCache[active.id]
      : active
      ? active.photos
      : [];

  return (
    <section
      data-testid="place-search-section"
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
              data-testid="place-search-input"
              className="w-full bg-[#FDFBF7]/[0.06] border border-[#FDFBF7]/20 focus:border-[#D4A373] text-[#FDFBF7] placeholder:text-[#FDFBF7]/35 pl-14 pr-5 py-4 text-base outline-none transition-colors backdrop-blur-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            data-testid="place-search-submit"
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
              data-testid={`place-suggestion-${s.replace(/\s+/g, "-").toLowerCase()}`}
              className="px-3.5 py-1.5 text-[12px] text-[#FDFBF7]/75 border border-[#FDFBF7]/15 hover:border-[#D4A373] hover:text-[#D4A373] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-12">
          {error && (
            <p data-testid="place-search-error" className="text-[#FDFBF7]/70 text-sm flex items-center gap-2">
              <ImageOff className="w-4 h-4" strokeWidth={1.7} />
              {t.error}
            </p>
          )}

          {!error && searched && !loading && places.length === 0 && (
            <p data-testid="place-search-empty" className="text-[#FDFBF7]/70 text-sm flex items-center gap-2">
              <ImageOff className="w-4 h-4" strokeWidth={1.7} />
              {t.noResults}
            </p>
          )}

          {places.length > 0 && (
            <div data-testid="place-search-results">
              {/* Place tabs (when several matches) */}
              {places.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-7">
                  {places.map((p, i) => (
                    <button
                      key={p.id || i}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      data-testid={`place-result-tab-${i}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-[12px] tracking-[0.06em] transition-colors border ${
                        i === activeIdx
                          ? "bg-[#FDFBF7] text-[#1A1513] border-[#FDFBF7]"
                          : "text-[#FDFBF7]/70 border-[#FDFBF7]/20 hover:border-[#FDFBF7]/60"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" strokeWidth={1.7} />
                      {p.name}
                    </button>
                  ))}
                </div>
              )}

              {active && (
                <>
                  <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
                    <div>
                      <span className="block text-[10px] tracking-[0.3em] uppercase text-[#D4A373]">
                        {t.photosOf}
                      </span>
                      <h3 className="font-serif-x text-2xl md:text-3xl text-[#FDFBF7] mt-1.5 inline-flex items-center gap-2.5">
                        <MapPin className="w-5 h-5 text-[#C16542]" strokeWidth={1.7} />
                        {active.name}
                      </h3>
                      {active.address && (
                        <p className="text-[13px] text-[#FDFBF7]/50 mt-1.5">{active.address}</p>
                      )}
                    </div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/40">
                      {detailsLoading
                        ? t.searching
                        : `${String(displayPhotos.length).padStart(2, "0")} ${t.results}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-3 md:gap-4">
                    {displayPhotos.map((ph, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setLightbox(photoUrl(ph.preview_url))}
                        data-testid={`place-photo-${i}`}
                        className={`group relative overflow-hidden bg-[#2C2621] ${SPANS[i % SPANS.length]}`}
                      >
                        <img
                          src={photoUrl(ph.thumb_url)}
                          alt={`${active.name} ${i + 1}`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute top-3 left-3 inline-block w-1.5 h-1.5 bg-[#D4A373]" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          data-testid="place-lightbox"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[80] bg-[#0D0B0A]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label={t.close}
            data-testid="place-lightbox-close"
            className="absolute top-5 right-5 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FDFBF7]/10 hover:bg-[#FDFBF7]/25 text-[#FDFBF7] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.7} />
          </button>
          <img
            src={lightbox}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
