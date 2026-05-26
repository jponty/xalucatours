import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useEditMode } from "@/contexts/EditModeContext";
import EditableImage from "@/components/EditableImage";

/* Curated Moroccan-only Unsplash imagery — each frame carries a
   trilingual caption to keep the editorial feel of the original. */
const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1597212720159-d4e91f47cbe2?auto=format&fit=crop&w=1400&q=85",
    caption: {
      es: "Arfoud — la puerta del desierto.",
      en: "Arfoud — the gateway to the desert.",
      fr: "Arfoud — la porte du désert.",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=85",
    caption: {
      es: "Erg Chebbi — el mar de dunas.",
      en: "Erg Chebbi — the sea of dunes.",
      fr: "Erg Chebbi — la mer de dunes.",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1400&q=85",
    caption: {
      es: "Fez — la medina más viva del país.",
      en: "Fez — the country's most alive medina.",
      fr: "Fès — la médina la plus vivante du pays.",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1400&q=85",
    caption: {
      es: "Alto Atlas — cumbres bereberes.",
      en: "High Atlas — Berber peaks.",
      fr: "Haut Atlas — sommets berbères.",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1400&q=85",
    caption: {
      es: "Ait Ben Haddou — kasbahs de adobe.",
      en: "Aït Ben Haddou — adobe kasbahs.",
      fr: "Aït Ben Haddou — kasbahs en pisé.",
    },
  },
];

const AUTOPLAY_MS = 5200;

export const EmotionalIntro = () => {
  const { t, lang } = useLanguage();
  const { editMode } = useEditMode();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next) => {
    setIdx((p) => (next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || editMode) return undefined;
    const id = setInterval(() => {
      setIdx((p) => (p + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, editMode]);

  return (
    <section
      id="story"
      data-testid="emotional-intro-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="md:col-span-6 lg:col-span-7 order-2 md:order-1">
            <span className="overline">{t("intro_overline")}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t("intro_title")}
            </h2>

            <div className="mt-10 space-y-6 text-base md:text-lg leading-relaxed text-[#5C5248] max-w-2xl">
              <p className="font-serif-x-italic text-xl md:text-2xl text-[#2C2621] leading-[1.4]">
                {t("intro_p1")}
              </p>
              <p>{t("intro_p2")}</p>
              <p>{t("intro_p3")}</p>
              <p className="font-serif-x text-2xl md:text-3xl text-[#C16542] leading-[1.2]">
                {t("intro_p4")}
              </p>
            </div>

            <p className="mt-10 text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
              {t("intro_signature")}
            </p>
          </div>

          {/* Autoplay image carousel */}
          <div className="md:col-span-6 lg:col-span-5 order-1 md:order-2">
            <div
              data-testid="emotional-intro-carousel"
              className="relative aspect-[4/5] overflow-hidden bg-[#F2EBE1] group"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
            >
              {SLIDES.map((s, i) => (
                <EditableImage
                  key={s.src}
                  slot={`home.intro.${i}`}
                  fallback={s.src}
                  alt={pick(s.caption, lang)}
                  imgProps={{
                    loading: i === 0 ? "eager" : "lazy",
                    "data-testid": `emotional-intro-slide-${i}`,
                  }}
                  className={`ken-burns absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out ${
                    i === idx ? "opacity-100" : "opacity-0"
                  }`}
                  aspectRatio="4/5"
                />
              ))}

              {/* Soft overlay for caption readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 via-[#1A1513]/10 to-transparent pointer-events-none" />
              <span className="film-grain pointer-events-none" />

              {/* Caption — trilingual, fades with the slide */}
              <span
                key={`cap-${idx}`}
                className="landmark-image-fade absolute bottom-6 left-6 right-16 text-[#FDFBF7] text-on-image font-serif-x-italic text-lg md:text-xl leading-[1.3]"
                data-testid={`emotional-intro-caption-${idx}`}
              >
                {pick(SLIDES[idx].caption, lang)}
              </span>

              {/* Manual nav arrows — only on hover, subtle */}
              <button
                type="button"
                onClick={() => go(idx - 1)}
                aria-label="Prev"
                data-testid="emotional-intro-prev"
                className={`absolute top-1/2 left-3 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 bg-[#FDFBF7]/85 backdrop-blur-sm text-[#2C2621] transition-opacity duration-300 hover:bg-[#FDFBF7] ${
                  editMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => go(idx + 1)}
                aria-label="Next"
                data-testid="emotional-intro-next"
                className={`absolute top-1/2 right-3 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 bg-[#FDFBF7]/85 backdrop-blur-sm text-[#2C2621] transition-opacity duration-300 hover:bg-[#FDFBF7] ${
                  editMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === idx}
                    data-testid={`emotional-intro-dot-${i}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === idx ? "w-6 bg-[#FDFBF7]" : "w-1.5 bg-[#FDFBF7]/45 hover:bg-[#FDFBF7]/75"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalIntro;
