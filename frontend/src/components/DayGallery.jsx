import React, { useState, useEffect } from "react";
import { X, Camera, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { DAY_GALLERIES, GALLERY_KIND_LABELS } from "@/lib/dayGalleries";
import EditableImage from "@/components/EditableImage";
import { useSlotId } from "@/components/slotScope";

const SECTION_LABELS = {
  es: { eyebrow: "Galería del día", title: "El recorrido en imágenes.", count_singular: "imagen", count_plural: "imágenes", close: "Cerrar", prev: "Anterior", next: "Siguiente" },
  en: { eyebrow: "Day gallery", title: "The journey in pictures.", count_singular: "image", count_plural: "images", close: "Close", prev: "Previous", next: "Next" },
  fr: { eyebrow: "Galerie du jour", title: "L'itinéraire en images.", count_singular: "image", count_plural: "images", close: "Fermer", prev: "Précédent", next: "Suivant" },
};

/* Full-screen viewer — opens a single image in a larger format. */
const Lightbox = ({ images, idx, onClose, onPrev, onNext, lang, t }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const current = images[idx];
  if (!current) return null;
  const kindLabel = GALLERY_KIND_LABELS[current.kind];

  return (
    <div data-testid="day-gallery-lightbox"
         className="fixed inset-0 z-[1000] bg-[#1A1513]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
         onClick={onClose}>
      <span className="film-grain pointer-events-none" />
      <button
        data-testid="lightbox-close"
        onClick={onClose}
        className="absolute top-5 right-5 md:top-7 md:right-7 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/80 hover:text-[#D4A373] transition-colors z-10"
      >
        {t.close}<X className="w-4 h-4" strokeWidth={1.6} />
      </button>
      <button
        data-testid="lightbox-prev"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label={t.prev}
        className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-14 md:h-14 border border-[#FDFBF7]/30 hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] transition-all duration-300 z-10"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={1.6} />
      </button>
      <button
        data-testid="lightbox-next"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label={t.next}
        className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-14 md:h-14 border border-[#FDFBF7]/30 hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] transition-all duration-300 z-10"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
      </button>

      <figure className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full max-h-[78vh] flex items-center justify-center bg-[#1A1513]">
          <EditableImage
            slot={current.slot}
            fallback={current.src}
            alt={pick(current.caption, lang)}
            aspectRatio="3/2"
            imgProps={{ loading: "eager" }}
            className="max-w-full max-h-[78vh] w-auto h-auto object-contain"
          />
        </div>
        <figcaption className="mt-5 md:mt-6 flex flex-wrap items-center justify-between gap-4 text-[#FDFBF7]">
          <div>
            {kindLabel && (
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]">
                {pick(kindLabel, lang)}
              </span>
            )}
            <p className="font-serif-x text-lg md:text-xl mt-1.5">{pick(current.caption, lang)}</p>
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/60">
            {String(idx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>
    </div>
  );
};

/**
 * DayGallery — clickable square-tile collage of up to 10 images per day.
 * Clicking a tile opens it in a larger format (lightbox) with prev/next nav.
 */
export const DayGallery = ({ day, accent = "#C16542" }) => {
  const { lang } = useLanguage();
  const t = SECTION_LABELS[lang] || SECTION_LABELS.es;
  const images = DAY_GALLERIES[day.route_id];
  const [open, setOpen] = useState(null);
  // Page-namespaced base so the gallery is independent per itinerary URL,
  // even when several programmes reuse the same shared `route_id`.
  const galleryBase = useSlotId(`day.${day.route_id}.gallery`);

  if (!images || images.length === 0) return null;

  // Up to 10 square cells. Each cell carries its slot id so the tile and the
  // lightbox share the same CMS-editable surface.
  const cells = images.slice(0, 10).map((img, i) => ({
    ...img,
    slot: `${galleryBase}.${i}`,
  }));

  const showNext = () => setOpen((i) => (i + 1) % cells.length);
  const showPrev = () => setOpen((i) => (i - 1 + cells.length) % cells.length);

  return (
    <section data-testid={`day-gallery-${day.route_id}`}
             className="relative bg-[#FDFBF7] py-14 md:py-20 border-t border-[#2C2621]/10">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <span className="overline inline-flex items-center gap-2" style={{ color: accent }}>
              <Camera className="w-3 h-3" strokeWidth={1.8} />
              {t.eyebrow}
            </span>
            <h4 className="font-serif-x text-2xl md:text-3xl lg:text-4xl text-[#2C2621] mt-3 leading-[1.1] tracking-tight">
              {t.title}
            </h4>
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
            {cells.length} {cells.length === 1 ? t.count_singular : t.count_plural}
          </span>
        </div>

        {/* Uniform square grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {cells.map((img, i) => {
            const kindLabel = GALLERY_KIND_LABELS[img.kind];
            return (
              <button
                key={img.slot}
                type="button"
                onClick={() => setOpen(i)}
                data-testid={`day-gallery-tile-${day.route_id}-${i}`}
                className="group relative aspect-square overflow-hidden bg-[#1A1513] cursor-zoom-in"
              >
                <EditableImage
                  slot={img.slot}
                  fallback={img.src}
                  alt={pick(img.caption, lang)}
                  aspectRatio="1/1"
                  imgProps={{ loading: "lazy" }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <span className="film-grain pointer-events-none" />

                {/* Zoom hint */}
                <span className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 bg-[#1A1513]/45 text-[#FDFBF7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Maximize2 className="w-4 h-4" strokeWidth={1.6} />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-left text-[#FDFBF7] pointer-events-none">
                  {kindLabel && (
                    <span className="block text-[9px] md:text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>
                      {pick(kindLabel, lang)}
                    </span>
                  )}
                  <span className="block font-serif-x text-sm md:text-[15px] leading-[1.2] mt-1 line-clamp-2">
                    {pick(img.caption, lang)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {open !== null && (
        <Lightbox
          images={cells}
          idx={open}
          onClose={() => setOpen(null)}
          onPrev={showPrev}
          onNext={showNext}
          lang={lang}
          t={t}
        />
      )}
    </section>
  );
};

export default DayGallery;
