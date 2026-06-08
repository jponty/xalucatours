import React from "react";
import EditableImage from "@/components/EditableImage";
import { Camera } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import xMonogram from "@/assets/monograma-x-white.png";

/* ============================================================
   SectionGallery — Editorial mosaic gallery used inside the
   regional pages right after each EditorialBlock.
   - Asymmetric premium grid (no perfect 3-col blandness)
   - Branded: Xaluca logo (top-right) + "X" monogram watermark
   - Non-interactive: images are NOT clickable (no lightbox)
   - Accepts: overline, title, body, images[], accent
============================================================ */

const COPY = {
  view: { es: "Galería", en: "Gallery", fr: "Galerie" },
  count: { es: "imágenes", en: "images", fr: "images" },
};

const pickLang = (val, lang) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.es || val.en || "";
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
            <figure
              key={img.src || `${testid}-img-${i}`}
              data-testid={`${testid}-image-${i}`}
              className={`group relative overflow-hidden bg-[#1A1513] ${SPAN_CLASSES[i % SPAN_CLASSES.length]}`}
            >
              <EditableImage
                slot={`${testid}.image.${i}`}
                fallback={img.src}
                alt={pickLang(img.caption, lang)}
                aspectRatio="4/3"
                imgProps={{ loading: "lazy" }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/80 via-[#1A1513]/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <span className="film-grain opacity-40 pointer-events-none" />

              {/* Brand: Xaluca logo (top-right) */}
              <XalucaLogoBadge
                className="top-4 right-4 w-10 h-10 md:w-12 md:h-12"
                testid={`${testid}-logo-${i}`}
              />

              {/* Brand: "X" monogram (bottom-right) */}
              <img
                src={xMonogram}
                alt=""
                aria-hidden="true"
                data-testid={`${testid}-monogram-${i}`}
                className="pointer-events-none select-none absolute bottom-3 right-3 w-10 h-10 md:w-12 md:h-12 object-contain opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] z-[3]"
              />

              <span
                className="absolute top-4 left-4 inline-block w-1.5 h-1.5 pointer-events-none"
                style={{ background: accent }}
                aria-hidden="true"
              />
              <span className="absolute left-5 right-16 bottom-5 text-left pointer-events-none">
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block font-serif-x text-[#FDFBF7] text-base md:text-lg leading-snug mt-1 line-clamp-2">
                  {pickLang(img.caption, lang)}
                </span>
              </span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
