import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { translations } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import EditableImage from "@/components/EditableImage";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import ImageContactBubble from "@/components/ImageContactBubble";
import EditableText from "@/components/EditableText";

/* Curated Moroccan-only Unsplash imagery — each frame carries a
   trilingual caption to keep the editorial feel of the original. */
const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1559586616-361e18714958?auto=format&fit=crop&w=1400&q=85",
    caption: {
      es: "Arfoud — la puerta del desierto.",
      en: "Arfoud — the gateway to the desert.",
      fr: "Arfoud — la porte du désert.",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1400&q=85",
    caption: {
      es: "Erg Chebbi — el mar de dunas.",
      en: "Erg Chebbi — the sea of dunes.",
      fr: "Erg Chebbi — la mer de dunes.",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1400&q=85",
    caption: {
      es: "Fez — la medina más viva del país.",
      en: "Fez — the country's most alive medina.",
      fr: "Fès — la médina la plus vivante du pays.",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1400&q=85",
    caption: {
      es: "Alto Atlas — cumbres bereberes.",
      en: "High Atlas — Berber peaks.",
      fr: "Haut Atlas — sommets berbères.",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1549140600-78c9b8275e9d?auto=format&fit=crop&w=1400&q=85",
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
  const { anyEditMode } = useEditMode();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next) => {
    setIdx((p) => (next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || anyEditMode) return undefined;
    const id = setInterval(() => {
      setIdx((p) => (p + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, anyEditMode]);

  return (
    <section
      id="story"
      data-testid="emotional-intro-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="md:col-span-6 lg:col-span-7 order-2 md:order-1">
            <EditableText
              slot="home.intro.overline"
              defaults={translations.intro_overline}
              multiline={false}
              className="overline"
            />
            <EditableText
              as="h2"
              slot="home.intro.title"
              defaults={translations.intro_title}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621] block"
            />

            <div className="mt-10 space-y-6 text-base md:text-lg leading-relaxed text-[#5C5248] max-w-2xl">
              <EditableText
                as="p"
                slot="home.intro.p1"
                defaults={translations.intro_p1}
                className="font-serif-x-italic text-xl md:text-2xl text-[#2C2621] leading-[1.4] block"
              />
              <EditableText as="p" slot="home.intro.p2" defaults={translations.intro_p2} className="block" />
              <EditableText as="p" slot="home.intro.p3" defaults={translations.intro_p3} className="block" />
              <EditableText
                as="p"
                slot="home.intro.p4"
                defaults={translations.intro_p4}
                className="font-serif-x text-2xl md:text-3xl text-[#C16542] leading-[1.2] block"
              />
            </div>

            <EditableText
              as="p"
              slot="home.intro.signature"
              defaults={translations.intro_signature}
              multiline={false}
              className="mt-10 text-[10px] tracking-[0.3em] uppercase text-[#5C5248] block"
            />
            <Link
              to={pathFor(lang, "whatWeDo")}
              data-testid="emotional-intro-what-we-do"
              className="mt-8 inline-flex items-center gap-3 bg-[#C16542] px-6 py-3.5 text-[10px] uppercase tracking-[0.24em] text-[#FDFBF7] transition-all duration-300 hover:gap-4 hover:bg-[#A35133] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] focus-visible:ring-offset-2"
            >
              {t("intro_cta")}
              <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
            </Link>
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
                <div
                  key={s.src}
                  aria-hidden={i !== idx}
                  className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
                    i === idx ? "opacity-100" : "opacity-0"
                  } ${
                    /* Only the visible slide receives clicks so edit-mode
                       targets the currently shown image (and its overlay)
                       instead of a hidden stacked one. We intentionally
                       leave z-index in `auto` so carousel controls
                       (positioned later in the DOM with explicit z-[50])
                       always paint above the edit overlay. */
                    i === idx ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                >
                  <EditableImage
                    slot={`home.intro.${i}`}
                    fallback={s.src}
                    alt={pick(s.caption, lang)}
                    imgProps={{
                      loading: i === 0 ? "eager" : "lazy",
                      "data-testid": `emotional-intro-slide-${i}`,
                    }}
                    className="ken-burns absolute inset-0 w-full h-full object-cover"
                    aspectRatio="4/5"
                  />
                </div>
              ))}

              {/* Soft overlay for caption readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 via-[#1A1513]/10 to-transparent pointer-events-none" />
              <span className="film-grain pointer-events-none" />
              <XalucaLogoBadge testid="emotional-intro-logo" />

              {/* Quick contact bubble — top-left of the story image */}
              <ImageContactBubble slug="home-story" align="left" vertical="top" zClass="z-[40]" />

              {/* Caption — trilingual, fades with the slide. Editable per slide
                  so each frame's copy is managed independently from the CMS. */}
              <span
                key={`cap-${idx}`}
                className="landmark-image-fade absolute bottom-6 left-6 right-16 text-[#FDFBF7] text-on-image font-serif-x-italic text-lg md:text-xl leading-[1.3]"
                data-testid={`emotional-intro-caption-${idx}`}
              >
                <EditableText
                  as="span"
                  slot={`home.intro.caption.${idx}`}
                  defaults={SLIDES[idx].caption}
                  multiline={false}
                />
              </span>

              {/* Manual nav arrows — always above the edit overlay (z-50)
                  so users can swap between slides while edit mode is on. */}
              <button
                type="button"
                onClick={() => go(idx - 1)}
                aria-label="Prev"
                data-testid="emotional-intro-prev"
                data-edit-allow="true"
                className={`absolute top-1/2 left-3 -translate-y-1/2 z-[50] inline-flex items-center justify-center w-9 h-9 bg-[#FDFBF7]/85 backdrop-blur-sm text-[#2C2621] transition-opacity duration-300 hover:bg-[#FDFBF7] ${
                  anyEditMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => go(idx + 1)}
                aria-label="Next"
                data-testid="emotional-intro-next"
                data-edit-allow="true"
                className={`absolute top-1/2 right-3 -translate-y-1/2 z-[50] inline-flex items-center justify-center w-9 h-9 bg-[#FDFBF7]/85 backdrop-blur-sm text-[#2C2621] transition-opacity duration-300 hover:bg-[#FDFBF7] ${
                  anyEditMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 right-4 z-[50] flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === idx}
                    data-testid={`emotional-intro-dot-${i}`}
                    data-edit-allow="true"
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
