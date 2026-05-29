/* ============================================================
   MoroccoIntroVideo.jsx
   ----
   Cinematic Morocco intro video, placed right under the Hero on
   the Home page. Uses a privacy-friendly "lite-embed" pattern:
       1. First render: a still thumbnail + brand-styled play button.
          (No iframe, no YouTube cookies, no 1 MB JS payload.)
       2. On click / keyboard activation: the iframe replaces the
          thumbnail and starts playing with autoplay=1.
   The video itself is stable content (a destination film), so we
   don't expose it through the CMS — only the eyebrow / title /
   subtitle copy is editable via <EditableSection>.
============================================================ */
import React, { useState, useCallback } from "react";
import { Play } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableSection from "@/components/EditableSection";
import { SlotScope } from "@/components/slotScope";

// Marrakech / Sahara aerial — Source: youtube.com/watch?v=yo38KP4ikfg
const VIDEO_ID = "yo38KP4ikfg";
// `hqdefault` is the most reliable thumbnail across all videos.
const POSTER = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const POSTER_FALLBACK = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;

const COPY = {
  eyebrow: { es: "Marruecos en movimiento",        en: "Morocco in motion",          fr: "Le Maroc en mouvement" },
  title:   { es: "Tres minutos para sentir el país antes de viajarlo",
             en: "Three minutes to feel the country before you travel it",
             fr: "Trois minutes pour ressentir le pays avant de le parcourir" },
  body:    { es: "Dunas, medinas vivas, oasis al amanecer y caravanas de camellos. La imagen que llevamos en la cabeza cuando preparamos tu viaje a medida.",
             en: "Dunes, living medinas, oases at dawn and camel caravans. The image we hold in mind when we craft your tailor-made journey.",
             fr: "Dunes, médinas vivantes, oasis à l'aube et caravanes de chameaux. L'image que nous gardons en tête quand nous façonnons votre voyage sur mesure." },
  play:    { es: "Reproducir vídeo", en: "Play video", fr: "Lire la vidéo" },
};

const MoroccoIntroVideo = () => {
  const { lang } = useLanguage();
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => setPlaying(true), []);
  const onKey = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        play();
      }
    },
    [play],
  );

  return (
    <SlotScope id="home.intro-video">
      <section
        data-testid="home-intro-video"
        className="relative w-full bg-[#1A1513] py-16 md:py-24"
      >
        {/* Soft top fade so the section sits gracefully under the Hero */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FDFBF7]/0 to-transparent pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {/* Editorial header — left-aligned to match the rest of the site */}
          <div className="max-w-3xl mb-10 md:mb-14">
            <EditableSection
              name="eyebrow"
              fallback={pick(COPY.eyebrow, lang)}
              as="span"
              className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4"
            />
            <EditableSection
              name="title"
              fallback={pick(COPY.title, lang)}
              as="h2"
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#FDFBF7] leading-tight tracking-tight"
            />
            <EditableSection
              name="body"
              fallback={pick(COPY.body, lang)}
              as="p"
              className="mt-5 text-[#D4A373]/90 text-sm md:text-base leading-relaxed max-w-2xl"
            />
          </div>

          {/* Video frame · 16:9 · click-to-load */}
          <div
            data-testid="home-intro-video-frame"
            className="relative w-full overflow-hidden bg-[#0F0B09] aspect-video shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
          >
            {!playing && (
              <button
                type="button"
                data-testid="home-intro-video-play"
                onClick={play}
                onKeyDown={onKey}
                aria-label={pick(COPY.play, lang)}
                className="group absolute inset-0 w-full h-full cursor-pointer"
              >
                <img
                  src={POSTER}
                  onError={(e) => { e.currentTarget.src = POSTER_FALLBACK; }}
                  alt={pick(COPY.title, lang)}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                {/* Cinematic vignette */}
                <span className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55" />
                {/* Brand play affordance */}
                <span className="relative z-10 flex h-full w-full items-center justify-center">
                  <span className="flex items-center gap-4 bg-[#C16542]/95 backdrop-blur-sm text-[#FDFBF7] px-6 py-4 md:px-8 md:py-5 shadow-[0_18px_50px_-10px_rgba(193,101,66,0.6)] transition-transform duration-300 group-hover:scale-[1.04]">
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" strokeWidth={1.6} />
                    <span className="text-[11px] md:text-[12px] tracking-[0.32em] uppercase">
                      {pick(COPY.play, lang)}
                    </span>
                  </span>
                </span>
              </button>
            )}

            {playing && (
              <iframe
                data-testid="home-intro-video-iframe"
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={pick(COPY.title, lang)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </div>
      </section>
    </SlotScope>
  );
};

export default MoroccoIntroVideo;
