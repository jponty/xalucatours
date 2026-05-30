import React from "react";
import { Camera } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { DAY_GALLERIES, GALLERY_KIND_LABELS } from "@/lib/dayGalleries";
import EditableImage from "@/components/EditableImage";
import { useSlotId } from "@/components/slotScope";

const SECTION_LABELS = {
  es: { eyebrow: "Galería del día", title: "El recorrido en imágenes.", count_singular: "imagen", count_plural: "imágenes" },
  en: { eyebrow: "Day gallery", title: "The journey in pictures.", count_singular: "image", count_plural: "images" },
  fr: { eyebrow: "Galerie du jour", title: "L'itinéraire en images.", count_singular: "image", count_plural: "images" },
};

// Pre-defined column/row spans per cell for the asymmetric editorial collage.
// Tiles the 6-column grid perfectly across 10 cells (fixed-height rows).
const LAYOUT = [
  "md:col-span-3 md:row-span-2", // 0 — feature large (3×2)
  "md:col-span-3 md:row-span-1", // 1 — top right wide
  "md:col-span-3 md:row-span-1", // 2 — under the feature, right side
  "md:col-span-2 md:row-span-1", // 3
  "md:col-span-2 md:row-span-1", // 4
  "md:col-span-2 md:row-span-1", // 5
  "md:col-span-3 md:row-span-1", // 6
  "md:col-span-3 md:row-span-1", // 7
  "md:col-span-4 md:row-span-1", // 8 — wide
  "md:col-span-2 md:row-span-1", // 9
];

/**
 * DayGallery — purely visual, static (non-clickable) editorial collage of up
 * to 10 images per day. No lightbox / pop-up / navigation: the images are
 * fixed content within the page layout.
 */
export const DayGallery = ({ day, accent = "#C16542" }) => {
  const { lang } = useLanguage();
  const t = SECTION_LABELS[lang] || SECTION_LABELS.es;
  const images = DAY_GALLERIES[day.route_id];
  // Page-namespaced base so the gallery is independent per itinerary URL,
  // even when several programmes reuse the same shared `route_id`.
  const galleryBase = useSlotId(`day.${day.route_id}.gallery`);

  if (!images || images.length === 0) return null;

  // Up to 10 cells for a richer visual overview. Each cell carries its slot id
  // so every tile remains CMS-editable.
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

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px]">
          {cells.map((img, i) => {
            const kindLabel = GALLERY_KIND_LABELS[img.kind];
            return (
              <figure
                key={img.slot}
                data-testid={`day-gallery-tile-${day.route_id}-${i}`}
                className={`relative overflow-hidden bg-[#1A1513] h-[180px] md:h-auto ${LAYOUT[i] || "md:col-span-2 md:row-span-1"}`}
              >
                <EditableImage
                  slot={img.slot}
                  fallback={img.src}
                  alt={pick(img.caption, lang)}
                  aspectRatio="3/2"
                  imgProps={{ loading: "lazy" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/20 to-transparent opacity-90 pointer-events-none" />
                <span className="film-grain pointer-events-none" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-left text-[#FDFBF7] pointer-events-none">
                  {kindLabel && (
                    <span className="block text-[9px] md:text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>
                      {pick(kindLabel, lang)}
                    </span>
                  )}
                  <span className="block font-serif-x text-sm md:text-[15px] leading-[1.2] mt-1.5 line-clamp-2">
                    {pick(img.caption, lang)}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DayGallery;
