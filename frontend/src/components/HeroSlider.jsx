import React, { useEffect, useState } from "react";
import { ArrowRight, Compass, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { CONTACT } from "@/lib/data";
import { translations } from "@/lib/i18n";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";

const SLIDES = [
  { image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2000&q=85",
    place: { en: "Erg Chebbi · Sahara",     fr: "Erg Chebbi · Sahara",       es: "Erg Chebbi · Sáhara" } },
  { image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=85",
    place: { en: "Aït Benhaddou · Atlas",   fr: "Aït Benhaddou · Atlas",     es: "Aït Benhaddou · Atlas" } },
  { image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2000&q=85",
    place: { en: "Fez · Imperial Cities",   fr: "Fès · Cités impériales",    es: "Fez · Ciudades imperiales" } },
  { image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2000&q=85",
    place: { en: "Marrakech · Palm groves", fr: "Marrakech · Palmeraies",    es: "Marrakech · Palmerales" } },
];

export const HeroSlider = () => {
  const { t, lang } = useLanguage();
  const { imageEditMode, textEditMode } = useEditMode();
  const editMode = imageEditMode || textEditMode;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (editMode) return undefined; // pause autoplay while editing
    const id = setInterval(() => setIdx((p) => (p + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, [editMode]);

  return (
    <section
      data-testid="hero-section"
      className="relative h-[100svh] min-h-[820px] w-full overflow-hidden bg-[#1A1513]"
    >
      {SLIDES.map((s, i) => (
        <div
          key={i}
          aria-hidden={i !== idx}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${
            i === idx ? "opacity-100" : "opacity-0"
          } ${
            /* Only the visible slide receives pointer events. Without this,
               every stacked <EditableImage> overlay would catch clicks based
               on DOM order, so the user would end up editing a hidden slide
               instead of the one they actually see. */
            i === idx ? "pointer-events-auto" : "pointer-events-none"
          } ${editMode && i === idx ? "z-[3]" : ""}`}
        >
          <EditableImage
            slot={`home.hero.${i}`}
            fallback={s.image}
            alt=""
            className="ken-burns absolute inset-0 w-full h-full object-cover"
            imgProps={{ loading: i === 0 ? "eager" : "lazy" }}
            aspectRatio="16/9"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/30" />
      <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
      <span className="film-grain" />

      {/* In edit mode, expose prev/next so each hero slide can be edited
          independently (slides 2-4 are otherwise hidden behind opacity-0).
          Z-[60] keeps them above the per-slide edit overlay (z-45). */}
      {editMode && (
        <div className="absolute top-1/2 inset-x-0 z-[60] flex items-center justify-between px-4 md:px-8 pointer-events-none -translate-y-1/2">
          <button
            type="button"
            data-testid="hero-edit-prev"
            data-edit-allow="true"
            onClick={() => setIdx((p) => (p - 1 + SLIDES.length) % SLIDES.length)}
            aria-label="Slide anterior"
            className="pointer-events-auto inline-flex items-center justify-center w-12 h-12 bg-[#FDFBF7]/95 text-[#2C2621] hover:bg-[#FDFBF7] shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            data-testid="hero-edit-next"
            data-edit-allow="true"
            onClick={() => setIdx((p) => (p + 1) % SLIDES.length)}
            aria-label="Slide siguiente"
            className="pointer-events-auto inline-flex items-center justify-center w-12 h-12 bg-[#FDFBF7]/95 text-[#2C2621] hover:bg-[#FDFBF7] shadow-lg"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
          </button>
        </div>
      )}

      <div className={`relative z-10 h-full flex flex-col ${editMode ? "pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto" : ""}`}>
        <div className="flex-1 flex items-end pt-32 md:pt-40 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-3xl">
              <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
                <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
                <EditableText
                  slot="home.hero.eyebrow"
                  defaults={translations.hero_eyebrow}
                  multiline={false}
                  className="text-[11px] tracking-[0.35em] uppercase font-semibold"
                />
                <span className="w-8 h-px bg-[#D4A373]/50" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80">
                  {SLIDES[idx].place[lang] || SLIDES[idx].place.es}
                </span>
              </div>

              <EditableText
                key={`title-${idx}`}
                as="h1"
                slot="home.hero.title"
                defaults={translations.hero_title}
                multiline={false}
                className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-on-image text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 block"
              />

              <EditableText
                as="p"
                slot="home.hero.sub"
                defaults={translations.hero_sub}
                className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/90 leading-relaxed text-on-image block"
              />

              <EditableText
                as="p"
                slot="home.hero.support"
                defaults={translations.hero_support}
                className="fade-up fade-up-delay-3 mt-4 max-w-2xl text-sm md:text-base text-[#FDFBF7]/75 leading-relaxed text-on-image block"
              />

              <div className="fade-up fade-up-delay-4 mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  data-testid="hero-cta-primary"
                  className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  <EditableText
                    slot="home.hero.cta_primary"
                    defaults={translations.cta_plan}
                    multiline={false}
                  />
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
                </a>
                <a
                  href="#categories"
                  data-testid="hero-cta-secondary"
                  className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
                >
                  <EditableText
                    slot="home.hero.cta_secondary"
                    defaults={translations.cta_explore_routes}
                    multiline={false}
                  />
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </div>

              {/* Quick contact pill */}
              <div className="fade-up fade-up-delay-4 mt-10 inline-flex flex-wrap items-center gap-x-6 gap-y-3 bg-[#1A1513]/55 backdrop-blur-md border border-[#FDFBF7]/15 px-5 py-3"
                   data-testid="hero-quick-contact">
                <EditableText
                  slot="home.hero.quick_label"
                  defaults={translations.hero_quick}
                  multiline={false}
                  className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]"
                />
                <a
                  href={`tel:${CONTACT.phoneRaw}`}
                  data-testid="hero-phone"
                  className="inline-flex items-center gap-2 text-sm text-[#FDFBF7] hover:text-[#D4A373] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.5} />
                  {CONTACT.phone}
                </a>
                <span className="w-px h-4 bg-[#FDFBF7]/20 hidden sm:inline-block" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  data-testid="hero-email"
                  className="inline-flex items-center gap-2 text-sm text-[#FDFBF7] hover:text-[#D4A373] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.5} />
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="pb-8 md:pb-12 max-w-7xl mx-auto px-6 md:px-12 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                data-testid={`hero-slide-indicator-${i}`}
                data-edit-allow="true"
                className={`h-px transition-all duration-500 ${
                  i === idx ? "w-12 bg-[#D4A373]" : "w-6 bg-[#FDFBF7]/35"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55 hidden md:block">
            {String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
