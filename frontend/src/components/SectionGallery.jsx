import React, { useState, useEffect, useCallback } from "react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/* ============================================================
   SectionGallery — Editorial mosaic gallery used inside the
   regional pages right after each EditorialBlock.
   - Asymmetric premium grid (no perfect 3-col blandness)
   - Lightbox with keyboard navigation
   - Accepts: overline, title, body, images[], accent
============================================================ */

const COPY = {
  view: { es: "Galería", en: "Gallery", fr: "Galerie" },
  count: { es: "imágenes", en: "images", fr: "images" },
  close: { es: "Cerrar", en: "Close", fr: "Fermer" },
  prev: { es: "Anterior", en: "Previous", fr: "Précédent" },
  next: { es: "Siguiente", en: "Next", fr: "Suivant" },
};

const pickLang = (val, lang) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.es || val.en || "";
};

const Lightbox = ({ images, index, onClose, onPrev, onNext, lang }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const img = images[index];
  if (!img) return null;
  return (
    <div
      data-testid="section-gallery-lightbox"
      className="fixed inset-0 z-[120] bg-[#1A1513]/96 backdrop-blur-sm flex items-center justify-center px-4 md:px-10 py-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label={COPY.close[lang] || COPY.close.es}
        data-testid="lightbox-close"
        className="absolute top-6 right-6 inline-flex items-center justify-center w-11 h-11 border border-[#FDFBF7]/30 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] transition-colors"
      >
        <X className="w-4 h-4" strokeWidth={1.6} />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label={COPY.prev[lang] || COPY.prev.es}
        data-testid="lightbox-prev"
        className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 border border-[#FDFBF7]/25 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] transition-colors"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={1.6} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label={COPY.next[lang] || COPY.next.es}
        data-testid="lightbox-next"
        className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 border border-[#FDFBF7]/25 text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] transition-colors"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
      </button>

      <figure
        className="relative max-w-6xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] bg-[#1A1513] overflow-hidden">
          <img
            src={img.src}
            alt={pickLang(img.caption, lang)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <figcaption className="mt-5 flex items-baseline justify-between gap-6 text-[#FDFBF7]/85">
          <p className="font-serif-x text-lg md:text-xl leading-tight">
            {pickLang(img.caption, lang)}
          </p>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55 shrink-0">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>
    </div>
  );
};

export default function SectionGallery({
  id,
  overline,
  title,
  body,
  images = [],
  accent = "#C16542",
  testid = "section-gallery",
}) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(null);

  const close = useCallback(() => setOpen(null), []);
  const prev  = useCallback(() => setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length]);
  const next  = useCallback(() => setOpen((i) => (i === null ? null : (i + 1) % images.length)), [images.length]);

  if (!images.length) return null;

  // Editorial spans (asymmetric) — repeats every 6 to keep rhythm.
  const SPAN_CLASSES = [
    "col-span-12 md:col-span-7 row-span-2 aspect-[4/3] md:aspect-auto md:min-h-[480px]",
    "col-span-6  md:col-span-5 aspect-[4/3] md:aspect-[5/4]",
    "col-span-6  md:col-span-5 aspect-[4/3] md:aspect-[5/4]",
    "col-span-12 md:col-span-4 aspect-[4/3] md:aspect-[4/5]",
    "col-span-6  md:col-span-4 aspect-[4/3] md:aspect-[4/5]",
    "col-span-6  md:col-span-4 aspect-[4/3] md:aspect-[4/5]",
  ];

  return (
    <section
      id={id}
      data-testid={testid}
      className="relative bg-[#F2EBE1] py-20 md:py-28 overflow-hidden border-t border-[#2C2621]/5"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-[0.08] pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-10 md:mb-14">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase" style={{ color: accent }}>
              <Camera className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pickLang(overline, lang)}
              <span className="w-10 h-px" style={{ background: `${accent}66` }} />
            </span>
            {title && (
              <h3 className="font-serif-x text-3xl md:text-4xl lg:text-[42px] leading-[1.08] tracking-tight mt-5 text-[#2C2621]">
                {pickLang(title, lang)}
              </h3>
            )}
            {body && (
              <p className="mt-5 max-w-2xl text-[15px] md:text-base text-[#5C5248] leading-[1.85]">
                {pickLang(body, lang)}
              </p>
            )}
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
              {String(images.length).padStart(2, "0")} {COPY.count[lang] || COPY.count.es}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 md:gap-4">
          {images.map((img, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setOpen(i)}
              data-testid={`${testid}-image-${i}`}
              className={`group relative overflow-hidden bg-[#1A1513] ${SPAN_CLASSES[i % SPAN_CLASSES.length]} focus:outline-none`}
              aria-label={pickLang(img.caption, lang)}
            >
              <img
                src={img.src}
                alt={pickLang(img.caption, lang)}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/80 via-[#1A1513]/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="film-grain opacity-40" />
              <span
                className="absolute top-4 left-4 inline-block w-1.5 h-1.5"
                style={{ background: accent }}
                aria-hidden="true"
              />
              <span className="absolute left-5 right-5 bottom-5 text-left">
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block font-serif-x text-[#FDFBF7] text-base md:text-lg leading-snug mt-1 line-clamp-2">
                  {pickLang(img.caption, lang)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <Lightbox
          images={images}
          index={open}
          onClose={close}
          onPrev={prev}
          onNext={next}
          lang={lang}
        />
      )}
    </section>
  );
}
