import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Film } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";

/* ============================================================
   ToursVideoSection — inspirational intermediate video block
   ------------------------------------------------------------
   Embeds a YouTube video inside a premium, rounded card WITHOUT
   any YouTube chrome (no controls, branding, related videos or
   keyboard handling). Playback is driven entirely by our own
   custom controls via the YouTube IFrame Player API.

   • Stable 16/9 ratio (aspect-video) → zero layout shift.
   • Cover poster + skeleton with a smooth fade-in on load.
   • Custom play / pause / mute controls.
============================================================ */

/* Lazy-load the YouTube IFrame API exactly once (shared promise). */
let ytApiPromise = null;
const loadYouTubeAPI = () => {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      resolve(window.YT);
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
  return ytApiPromise;
};

const COPY = {
  es: {
    eyebrow: "Marruecos en movimiento",
    title: "Déjate inspirar antes de elegir tu ruta.",
    caption:
      "Paisajes, colores y silencio del desierto — la mejor forma de imaginar el viaje que estás buscando.",
    play: "Reproducir",
    pause: "Pausar",
    mute: "Silenciar",
    unmute: "Activar sonido",
  },
  en: {
    eyebrow: "Morocco in motion",
    title: "Let yourself be inspired before choosing your route.",
    caption:
      "Landscapes, colours and the silence of the desert — the best way to picture the journey you're after.",
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Unmute",
  },
  fr: {
    eyebrow: "Le Maroc en mouvement",
    title: "Laissez-vous inspirer avant de choisir votre itinéraire.",
    caption:
      "Paysages, couleurs et silence du désert — la meilleure façon d'imaginer le voyage que vous recherchez.",
    play: "Lire",
    pause: "Pause",
    mute: "Couper le son",
    unmute: "Activer le son",
  },
};

export const ToursVideoSection = ({ videoId = "nzD3e3Qr7g8" }) => {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;
  // Trilingual defaults for the inline text-edit (CMS) surfaces.
  const D = (k) => ({ es: COPY.es[k], en: COPY.en[k], fr: COPY.fr[k] });

  const stageRef = useRef(null);   // stable wrapper that holds the iframe
  const playerRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const cover = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    // Fresh holder each run so React StrictMode re-mounts don't clash with
    // the iframe element the API injects in place of the holder.
    const holder = document.createElement("div");
    holder.className = "absolute inset-0 w-full h-full";
    stage.appendChild(holder);

    let cancelled = false;
    let player = null;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !YT) return;
      player = new YT.Player(holder, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          fs: 0,
          disablekb: 1,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            setMuted(true);
            setReady(true);
            try {
              const f = e.target.getIframe && e.target.getIframe();
              if (f) f.setAttribute("title", "Xaluca Tours — Marruecos");
            } catch (err) {
              console.warn("ToursVideoSection: no se pudo ajustar el título del iframe", err);
            }
          },
          onStateChange: (e) => {
            const S = window.YT.PlayerState;
            if (e.data === S.PLAYING) {
              setPlaying(true);
              setStarted(true);
            } else if (e.data === S.PAUSED || e.data === S.ENDED) {
              setPlaying(false);
            }
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      try {
        if (player && player.destroy) player.destroy();
      } catch (err) {
        console.warn("ToursVideoSection: error al destruir el reproductor", err);
      }
      playerRef.current = null;
      stage.replaceChildren();
    };
  }, [videoId]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  return (
    <section
      id="viajes-video"
      data-testid="viajes-video-section"
      className="relative bg-[#F2EBE1] py-20 md:py-28 overflow-hidden"
    >
      <div
        className="absolute inset-0 berber-bg-diamond opacity-30 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Film className="w-3.5 h-3.5" strokeWidth={1.8} />
            <EditableText slot="viajes.video.eyebrow" defaults={D("eyebrow")} multiline={false} />
          </span>
          <EditableText
            as="h2"
            slot="viajes.video.title"
            defaults={D("title")}
            multiline={false}
            className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.06] tracking-tight mt-5 text-[#2C2621] block"
          />
          <EditableText
            as="p"
            slot="viajes.video.caption"
            defaults={D("caption")}
            className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed block"
          />
        </div>

        {/* Video card */}
        <div
          data-testid="viajes-video-card"
          className="group relative rounded-3xl overflow-hidden bg-[#1A1513] border border-[#2C2621]/10 shadow-[0_40px_90px_-45px_rgba(26,21,19,0.65)]"
        >
          <div className="relative w-full aspect-video">
            {/* YouTube iframe is injected here (stable 16/9 stage) */}
            <div ref={stageRef} className="absolute inset-0 w-full h-full" />

            {/* Skeleton while the player boots */}
            {!ready && (
              <div className="absolute inset-0 animate-pulse bg-[#211c18]" aria-hidden="true" />
            )}

            {/* Cover poster — fades out once playback has started */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                started ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              aria-hidden={started}
            >
              <img
                src={cover}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/80 via-[#1A1513]/25 to-[#1A1513]/35" />
              <span className="film-grain pointer-events-none" />
            </div>

            {/* Transparent click layer — click anywhere on the video toggles
                play/pause without exposing any YouTube interaction. */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? t.pause : t.play}
              data-testid="viajes-video-stage-toggle"
              className="absolute inset-0 z-[20] w-full h-full bg-transparent cursor-pointer focus:outline-none"
            />

            {/* Center play button — visible whenever paused */}
            {!playing && (
              <div className="absolute inset-0 z-[30] flex items-center justify-center pointer-events-none">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={t.play}
                  data-testid="viajes-video-play"
                  className="pointer-events-auto inline-flex items-center justify-center w-[72px] h-[72px] md:w-20 md:h-20 rounded-full bg-[#FDFBF7]/95 text-[#1A1513] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105"
                >
                  <Play className="w-7 h-7 md:w-8 md:h-8 ml-1" strokeWidth={1.6} fill="currentColor" />
                </button>
              </div>
            )}

            {/* Bottom control bar */}
            <div
              className={`absolute bottom-0 inset-x-0 z-[30] flex items-center justify-between gap-3 p-4 md:p-5 bg-gradient-to-t from-[#1A1513]/75 via-[#1A1513]/20 to-transparent transition-opacity duration-300 ${
                playing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? t.pause : t.play}
                data-testid="viajes-video-toggle"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FDFBF7]/15 hover:bg-[#FDFBF7]/30 backdrop-blur-md border border-[#FDFBF7]/25 text-[#FDFBF7] transition-colors duration-300"
              >
                {playing ? (
                  <Pause className="w-4 h-4" strokeWidth={1.8} fill="currentColor" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" strokeWidth={1.8} fill="currentColor" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? t.unmute : t.mute}
                data-testid="viajes-video-mute"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FDFBF7]/15 hover:bg-[#FDFBF7]/30 backdrop-blur-md border border-[#FDFBF7]/25 text-[#FDFBF7] transition-colors duration-300"
              >
                {muted ? (
                  <VolumeX className="w-4 h-4" strokeWidth={1.8} />
                ) : (
                  <Volume2 className="w-4 h-4" strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToursVideoSection;
