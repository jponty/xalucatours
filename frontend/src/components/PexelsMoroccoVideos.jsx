import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Film, Loader2, RefreshCw } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";

const API = process.env.REACT_APP_BACKEND_URL || "";
const PER_PAGE = 12;
const LOCALE = { es: "es-ES", en: "en-US", fr: "fr-FR" };
const requestCache = new Map();

const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  eyebrow: T("Marruecos en movimiento", "Morocco in motion", "Le Maroc en mouvement"),
  title: T("Vídeos de Marruecos", "Videos of Morocco", "Vidéos du Maroc"),
  body: T(
    "Descubre paisajes, ciudades y experiencias del país a través de una selección audiovisual dinámica.",
    "Discover the country's landscapes, cities and experiences through a dynamic audiovisual selection.",
    "Découvrez les paysages, les villes et les expériences du pays grâce à une sélection audiovisuelle dynamique.",
  ),
  hint: T("Desliza para seguir explorando", "Swipe to keep exploring", "Faites glisser pour continuer à explorer"),
  previous: T("Vídeos anteriores", "Previous videos", "Vidéos précédentes"),
  next: T("Vídeos siguientes", "Next videos", "Vidéos suivantes"),
  videoLabel: T("Vídeo de Marruecos", "Morocco video", "Vidéo du Maroc"),
  attribution: T("Vídeos proporcionados por Pexels", "Videos provided by Pexels", "Vidéos fournies par Pexels"),
  more: T("Mostrar más vídeos", "Show more videos", "Voir plus de vidéos"),
  loading: T("Cargando vídeos de Marruecos", "Loading Morocco videos", "Chargement des vidéos du Maroc"),
  unavailable: T(
    "Los vídeos no están disponibles en este momento.",
    "The videos are not available right now.",
    "Les vidéos ne sont pas disponibles pour le moment.",
  ),
  empty: T(
    "No hay vídeos horizontales disponibles para esta selección.",
    "There are no landscape videos available for this selection.",
    "Aucune vidéo horizontale n’est disponible pour cette sélection.",
  ),
  retry: T("Volver a intentar", "Try again", "Réessayer"),
};

const mergeUnique = (current, incoming) => {
  const byId = new Map();
  [...current, ...incoming].forEach((video) => {
    if (!video?.id || !video.video_url || !video.poster_url) return;
    if (Number(video.width) <= Number(video.height)) return;
    if (Number(video.video_width) <= Number(video.video_height)) return;
    if (![...byId.values()].some((item) => item.video_url === video.video_url)) {
      byId.set(video.id, video);
    }
  });
  return [...byId.values()];
};

const fetchVideoPage = (page, lang) => {
  const locale = LOCALE[lang] || LOCALE.es;
  const key = `${page}:${locale}`;
  if (!requestCache.has(key)) {
    const query = new URLSearchParams({ page: String(page), per_page: String(PER_PAGE), locale });
    const request = fetch(`${API}/api/pexels/videos/morocco?${query}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.detail || `HTTP ${response.status}`);
        return payload;
      })
      .catch((error) => {
        requestCache.delete(key);
        throw error;
      });
    requestCache.set(key, request);
  }
  return requestCache.get(key);
};

export default function PexelsMoroccoVideos() {
  const { lang } = useLanguage();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [readyToLoad, setReadyToLoad] = useState(() => typeof IntersectionObserver === "undefined");
  const [videos, setVideos] = useState([]);
  const [failedIds, setFailedIds] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [active, setActive] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (readyToLoad) return undefined;
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setReadyToLoad(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReadyToLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [readyToLoad]);

  useEffect(() => {
    if (!readyToLoad) return undefined;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setVideos([]);
    setFailedIds(new Set());
    setPage(1);

    fetchVideoPage(1, lang)
      .then((payload) => {
        if (cancelled) return;
        setVideos(mergeUnique([], payload.videos || []));
        setHasMore(Boolean(payload.next_page));
      })
      .catch((requestError) => {
        if (cancelled) return;
        setError(requestError.message || "Pexels video error");
        setHasMore(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lang, readyToLoad, reloadKey]);

  const visibleVideos = useMemo(
    () => videos.filter((video) => !failedIds.has(video.id)),
    [failedIds, videos],
  );

  const updateRailState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = [...track.querySelectorAll("[data-pexels-video-card]")];
    if (!cards.length) {
      setActive(0);
      setCanPrevious(false);
      setCanNext(false);
      return;
    }
    const first = cards[0];
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = first.getBoundingClientRect().width + gap;
    setActive(Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / Math.max(step, 1)))));
    setCanPrevious(track.scrollLeft > 8);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !visibleVideos.length) return undefined;
    const onUpdate = () => window.requestAnimationFrame(updateRailState);
    track.addEventListener("scroll", onUpdate, { passive: true });
    window.addEventListener("resize", onUpdate);
    onUpdate();
    return () => {
      track.removeEventListener("scroll", onUpdate);
      window.removeEventListener("resize", onUpdate);
    };
  }, [updateRailState, visibleVideos.length]);

  const move = (direction) => {
    const track = trackRef.current;
    const first = track?.querySelector("[data-pexels-video-card]");
    if (!track || !first) return;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    track.scrollBy({
      left: direction * (first.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    setError(null);
    try {
      const payload = await fetchVideoPage(nextPage, lang);
      setVideos((current) => mergeUnique(current, payload.videos || []));
      setPage(nextPage);
      setHasMore(Boolean(payload.next_page));
    } catch (requestError) {
      setError(requestError.message || "Pexels video error");
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePlay = (event) => {
    const selected = event.currentTarget;
    trackRef.current?.querySelectorAll("video").forEach((video) => {
      if (video !== selected && !video.paused) video.pause();
    });
  };

  const handleVideoError = (videoId) => {
    setFailedIds((current) => new Set([...current, videoId]));
  };

  const showFallback = !loading && visibleVideos.length === 0;

  return (
    <section
      ref={sectionRef}
      id="videos-marruecos"
      data-testid="pexels-morocco-videos"
      className="relative overflow-hidden bg-[#1A1513] py-20 text-[#FDFBF7] md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 berber-bg-diamond opacity-[0.08]" aria-hidden="true" />
      <span className="film-grain" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D4A373]">
              <Film className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              {pick(COPY.eyebrow, lang)}
            </span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              {pick(COPY.title, lang)}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm leading-[1.8] text-white/70 sm:text-base">{pick(COPY.body, lang)}</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#D4A373]">
                {pick(COPY.hint, lang)}
              </span>
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  disabled={!canPrevious}
                  aria-label={pick(COPY.previous, lang)}
                  data-testid="pexels-videos-previous"
                  className="xaluca-button inline-flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:border-[#D4A373] hover:text-[#D4A373] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  disabled={!canNext}
                  aria-label={pick(COPY.next, lang)}
                  data-testid="pexels-videos-next"
                  className="xaluca-button inline-flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:border-[#D4A373] hover:text-[#D4A373] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && visibleVideos.length === 0 && (
          <div data-testid="pexels-videos-loading" aria-live="polite" className="mt-12 flex gap-5 overflow-hidden md:mt-16 md:gap-6">
            {[0, 1, 2].map((item) => (
              <div key={item} className="w-[82vw] max-w-[620px] shrink-0 md:w-[58vw] lg:w-[43%] xl:w-[36%]">
                <div className="aspect-video animate-pulse bg-white/10" />
                <div className="mt-4 h-3 w-36 animate-pulse bg-white/10" />
              </div>
            ))}
            <span className="sr-only">{pick(COPY.loading, lang)}</span>
          </div>
        )}

        {visibleVideos.length > 0 && (
          <>
            <div
              ref={trackRef}
              data-testid="pexels-videos-track"
              className="no-scrollbar -mx-6 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-4 md:-mx-12 md:mt-16 md:gap-6 md:px-12"
            >
              {visibleVideos.map((video, index) => (
                <article
                  key={video.id}
                  data-pexels-video-card
                  data-testid={`pexels-video-card-${video.id}`}
                  className="w-[84vw] max-w-[720px] shrink-0 snap-start sm:w-[68vw] lg:w-[46%] xl:w-[38%]"
                >
                  <div className="relative aspect-video overflow-hidden bg-black shadow-[0_30px_70px_-35px_rgba(0,0,0,0.9)]">
                    <video
                      controls
                      playsInline
                      preload="none"
                      poster={video.poster_url}
                      aria-label={`${pick(COPY.videoLabel, lang)} ${String(index + 1).padStart(2, "0")}`}
                      data-testid={`pexels-video-${video.id}`}
                      onPlay={handlePlay}
                      onError={() => handleVideoError(video.id)}
                      className="h-full w-full object-cover"
                    >
                      <source src={video.video_url} type={video.file_type || "video/mp4"} />
                    </video>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-white/12 pt-6">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45" aria-live="polite">
                  {String(Math.min(active + 1, visibleVideos.length)).padStart(2, "0")} / {String(visibleVideos.length).padStart(2, "0")}
                </span>
                <a
                  href="https://www.pexels.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="pexels-attribution"
                  className="text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-[#D4A373]"
                >
                  {pick(COPY.attribution, lang)}
                </a>
              </div>
              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  data-testid="pexels-videos-more"
                  className="xaluca-button inline-flex min-h-11 items-center gap-3 border border-[#D4A373]/60 px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#D4A373] transition-colors hover:bg-[#D4A373] hover:text-[#1A1513] disabled:cursor-wait disabled:opacity-60"
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {pick(COPY.more, lang)}
                </button>
              )}
            </div>
          </>
        )}

        {showFallback && (
          <div data-testid="pexels-videos-fallback" role="status" className="mt-12 border border-white/15 bg-white/[0.04] px-6 py-10 text-center md:mt-16">
            <p className="text-sm text-white/65">{pick(error ? COPY.unavailable : COPY.empty, lang)}</p>
            {error && (
              <button
                type="button"
                onClick={() => setReloadKey((value) => value + 1)}
                className="xaluca-button mt-6 inline-flex min-h-11 items-center gap-2 border border-white/25 px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-white hover:border-[#D4A373] hover:text-[#D4A373]"
              >
                <RefreshCw className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                {pick(COPY.retry, lang)}
              </button>
            )}
          </div>
        )}

        {error && visibleVideos.length > 0 && (
          <p role="status" className="mt-5 text-right text-xs text-white/50">{pick(COPY.unavailable, lang)}</p>
        )}
      </div>
    </section>
  );
}

export { mergeUnique };
