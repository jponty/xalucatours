import React, { useMemo } from "react";
import { Camera } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { DEFAULT_DAY_GALLERY } from "@/lib/dayGalleries";
import { buildDayNarrativeGallery } from "@/lib/dayNarrativeGallery";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import { useSlotId } from "@/components/slotScope";

const SECTION_LABELS = {
  es: { count_singular: "imagen", count_plural: "imágenes" },
  en: { count_singular: "image", count_plural: "images" },
  fr: { count_singular: "image", count_plural: "images" },
};

/* Trilingual defaults for the editable section chrome. These use GLOBAL
   slots so editing the heading once updates every day gallery across the
   site (consistent section chrome). */
const DAY_UI = {
  eyebrow: { es: "Galería del día", en: "Day gallery", fr: "Galerie du jour" },
  title: { es: "El recorrido en imágenes.", en: "The journey in pictures.", fr: "L'itinéraire en images." },
};

/**
 * DayGallery — clean square-tile collage of up to 10 images per day.
 * Images only: no per-image captions, badges or overlaid text, and tiles
 * are non-interactive (no lightbox / modal / zoom on click).
 */
export const DayGallery = ({ day, accent = "#C16542" }) => {
  const { lang } = useLanguage();
  const t = SECTION_LABELS[lang] || SECTION_LABELS.es;
  // The day gallery is a visual narration of the itinerary: up to 10
  // images, in chronological order, derived STRICTLY from the points
  // explicitly named in this day's own description. Captions/data stay in
  // the model (for alt text and future re-enabling) but are not rendered.
  const images = useMemo(() => {
    const narrative = buildDayNarrativeGallery(day);
    return narrative.length > 0 ? narrative : DEFAULT_DAY_GALLERY;
  }, [day]);
  // Page-namespaced base so the gallery is independent per itinerary URL,
  // even when several programmes reuse the same shared `route_id`.
  const galleryBase = useSlotId(`day.${day.route_id || day.id}.gallery`);

  if (!images || images.length === 0) return null;

  // Up to 10 square cells. Each cell keeps its slot id so the tile stays
  // CMS-editable (image swap) even though no caption is shown.
  const cells = images.slice(0, 10).map((img, i) => ({
    ...img,
    slot: `${galleryBase}.${i}`,
  }));

  return (
    <section data-testid={`day-gallery-${day.route_id}`}
             className="relative bg-[#FDFBF7] py-14 md:py-20 border-t border-[#2C2621]/10">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <span className="overline inline-flex items-center gap-2" style={{ color: accent }}>
              <Camera className="w-3 h-3" strokeWidth={1.8} />
              <EditableText slot="gallery-ui.day.eyebrow" defaults={DAY_UI.eyebrow} as="span" multiline={false} />
            </span>
            <EditableText
              slot="gallery-ui.day.title"
              defaults={DAY_UI.title}
              as="h4"
              className="font-serif-x text-2xl md:text-3xl lg:text-4xl text-[#2C2621] mt-3 leading-[1.1] tracking-tight"
            />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
            {cells.length} {cells.length === 1 ? t.count_singular : t.count_plural}
          </span>
        </div>

        {/* Uniform square grid — images only, non-interactive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {cells.map((img) => (
            <div
              key={img.slot}
              data-testid={`day-gallery-tile-${day.route_id}-${img.slot}`}
              className="relative aspect-square overflow-hidden bg-[#1A1513]"
            >
              <EditableImage
                slot={img.slot}
                fallback={img.src}
                alt={pick(img.caption, lang)}
                aspectRatio="1/1"
                imgProps={{ loading: "lazy" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DayGallery;
