import React, { useMemo, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableImage from "@/components/EditableImage";
import { EditableGroup } from "@/contexts/EditableGroupContext";
import { useSlotId } from "@/components/slotScope";
import { useDayGallery, resolveGalleryUrl, dayGallerySegment } from "@/lib/dayGalleryStore";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";
import monogramaX from "@/assets/monograma-x-crop.png";

/* ============================================================
   DayImageGallery — per-day visual gallery for trip itineraries.
   ------------------------------------------------------------
   1 large main image (the existing `day.<id>.image` slot, 5/6) +
   N additional square (1:1) images (`day.<id>.slide.<i>`).

   • A large viewer shows the active image.
   • A horizontal rail of square thumbnails below it.
   • Click a thumbnail → it becomes the main image.
   • Prev/next arrows cycle through ALL gallery images.
   • Active thumbnail is highlighted; swipe supported on mobile.

   Every image is a CMS slot wrapped in <EditableGroup>, so the
   gallery editor (thumbnail nav + bulk upload) lets editors add /
   replace images without code changes. To grow/shrink the gallery
   in the future, only EXTRA_COUNT needs adjusting (or make it
   CMS-driven) — the slot structure stays the same.
============================================================ */

// Total images per day = 1 main + EXTRA_COUNT additional squares.
const EXTRA_COUNT = 9;

const buildImages = (base, day) => {
  const extras = Array.isArray(day.gallery) ? day.gallery : [];
  const images = [
    { slot: `${base}.image`, ratio: "5/6", fallback: day.image, isMain: true },
  ];
  for (let i = 0; i < EXTRA_COUNT; i += 1) {
    images.push({
      slot: `${base}.slide.${i}`,
      ratio: "1/1",
      fallback: extras[i] || day.image,
      isMain: false,
    });
  }
  return images;
};

export const DayImageGallery = ({ day, dayLabel, dayNum, dayIndex }) => {
  const { lang } = useLanguage();
  // Page-namespaced base → legacy inline-CMS slots, independent per URL.
  const base = useSlotId(`day.${day.id}`);
  // Index-based key for the admin-managed dynamic gallery, so each day is
  // fully INDEPENDENT even when two days in a programme share the same
  // `day.id`. `dayIndex` is the day's 1-based position (from ProgramTemplate);
  // fall back to parsing `dayNum` ("01" → 1) for safety.
  const idx1 = dayIndex || parseInt(dayNum, 10) || 1;
  const galleryKey = useSlotId(dayGallerySegment(idx1, day.id));
  const alt = pick(day.title, lang);

  // Dynamic CMS gallery (managed from /admin). When present it overrides
  // the legacy fixed slots. images[0] is the featured/main image.
  const dynamic = useDayGallery(galleryKey);

  const slides = useMemo(() => {
    if (dynamic && dynamic.length) {
      return dynamic.map((im, i) => ({
        id: `dyn-${i}`,
        url: resolveGalleryUrl(im.url),
        alt: im.alt || alt,
        ratio: i === 0 ? "5/6" : "1/1",
      }));
    }
    return buildImages(base, day).map((im) => ({ ...im, id: im.slot }));
  }, [dynamic, base, day, alt]);

  const [active, setActive] = useState(0);
  const touchX = useRef(null);
  const railRef = useRef(null);

  const total = slides.length;
  const go = (dir) => setActive((p) => (p + dir + total) % total);
  // Clamp active if the gallery shrank (e.g. images deleted in admin).
  const safeActive = active < total ? active : 0;
  const current = slides[safeActive] || slides[0];

  const renderImg = (slide, thumb) =>
    slide.slot ? (
      <EditableImage
        slot={slide.slot}
        fallback={slide.fallback}
        alt={thumb ? `${alt} · ${slide.id}` : alt}
        aspectRatio={thumb ? "1/1" : slide.ratio}
        imgProps={{ loading: "lazy" }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : (
      <img
        src={slide.url}
        alt={slide.alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    );

  // Keep the active thumbnail visible inside the rail after prev/next —
  // scrolls ONLY the rail (never the page).
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const el = rail.querySelector(`[data-thumb-idx="${safeActive}"]`);
    if (!el) return;
    const viewLeft = rail.scrollLeft;
    const viewRight = viewLeft + rail.clientWidth;
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    if (elLeft < viewLeft) {
      rail.scrollTo({ left: Math.max(0, elLeft - 12), behavior: "smooth" });
    } else if (elRight > viewRight) {
      rail.scrollTo({ left: elRight - rail.clientWidth + 12, behavior: "smooth" });
    }
  }, [safeActive]);

  const onTouchStart = (e) => { touchX.current = e.touches[0]?.clientX ?? null; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <EditableGroup id={base} label={`Galería · ${dayLabel} ${dayNum}`}>
      <div className="sticky lg:top-24">
        {/* ---- Main viewer ---- */}
        <div
          data-testid={`day-gallery-viewer-${day.id}`}
          className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-[#1A1513]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div key={current.id} className="ken-burns absolute inset-0">
            {renderImg(current, false)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 via-transparent to-transparent pointer-events-none" />
          <span className="film-grain" />

          {/* Xaluca "X" monogram — bottom-right edge */}
          <img
            src={monogramaX}
            alt=""
            aria-hidden="true"
            data-testid={`day-monogram-${day.id}`}
            className="pointer-events-none select-none absolute right-0 bottom-0 h-[82%] w-auto object-contain opacity-55 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] z-[2]"
          />
          {/* Xaluca logo — top-right corner */}
          <div className="absolute top-4 right-4 z-[3] pointer-events-none">
            <img
              src={grupXalucaLogo}
              alt="Xaluca"
              data-testid={`day-logo-${day.id}`}
              className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
            />
          </div>
          {/* Day label chip — top-left */}
          <div className="absolute top-5 left-5 z-[3] inline-flex items-center gap-3 bg-[#FDFBF7]/95 backdrop-blur-sm px-4 py-2 pointer-events-none">
            <span className="font-serif-x text-xl leading-none" style={{ color: day.accent }}>
              {dayLabel} {dayNum}
            </span>
          </div>

          {/* Image counter */}
          <span
            className="absolute bottom-4 right-4 z-[4] bg-[#1A1513]/70 text-[#FDFBF7] text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 tabular-nums pointer-events-none"
            data-testid={`day-gallery-counter-${day.id}`}
          >
            {safeActive + 1} / {total}
          </span>

          {/* Prev / next arrows */}
          <button
            type="button"
            data-testid={`day-gallery-prev-${day.id}`}
            aria-label="Imagen anterior"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-[20] inline-flex items-center justify-center w-10 h-10 bg-[#1A1513]/55 hover:bg-[#1A1513]/85 text-[#FDFBF7] backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            data-testid={`day-gallery-next-${day.id}`}
            aria-label="Imagen siguiente"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-[20] inline-flex items-center justify-center w-10 h-10 bg-[#1A1513]/55 hover:bg-[#1A1513]/85 text-[#FDFBF7] backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.7} />
          </button>
        </div>

        {/* ---- Thumbnail rail ---- */}
        {/* Same width as the main viewer (both full-width children of the
            sticky wrapper); horizontal scroll keeps thumbs inside that
            width on every breakpoint. */}
        <div
          data-testid={`day-gallery-thumbs-${day.id}`}
          ref={railRef}
          className="mt-4 flex gap-2.5 overflow-x-auto no-scrollbar px-1 py-1.5 scroll-smooth w-full"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {slides.map((img, i) => {
            const on = i === safeActive;
            return (
              <button
                key={img.id}
                type="button"
                data-thumb-idx={i}
                data-testid={`day-gallery-thumb-${day.id}-${i}`}
                aria-label={`Ver imagen ${i + 1}`}
                aria-current={on}
                onClick={() => setActive(i)}
                className={`relative shrink-0 w-[72px] h-[72px] md:w-[84px] md:h-[84px] overflow-hidden bg-[#1A1513] transition-all duration-200 ${
                  on ? "ring-2 ring-offset-2 ring-offset-[#FDFBF7]" : "opacity-70 hover:opacity-100"
                }`}
                style={on ? { ["--tw-ring-color"]: day.accent } : undefined}
              >
                {renderImg(img, true)}
              </button>
            );
          })}
        </div>
      </div>
    </EditableGroup>
  );
};

export default DayImageGallery;
