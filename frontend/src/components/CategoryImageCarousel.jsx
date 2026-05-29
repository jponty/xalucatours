import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditableImage from "@/components/EditableImage";

/* ============================================================
   CategoryImageCarousel
   ----------------------------------------------------------
   Drop-in replacement for the single <EditableImage> used in
   TravelCategories. Auto-rotates between `images` (passed by
   parent) every `interval` ms, with prev/next arrows and dots.

   Each slide is a real <EditableImage> with a stable slot
   (`{slotBase}.image-{i}`) so the CMS keeps per-slide control.

   Props:
   - slug:        category slug — used to derive the slot base.
   - images:      string[] — fallback urls (1+).
   - alt:         localized alt text.
   - aspectRatio: passed through to EditableImage.
   - interval:    ms between auto-advances (default 5000).
============================================================ */
export default function CategoryImageCarousel({
  slug,
  images,
  alt,
  aspectRatio = "4/5",
  interval = 5000,
}) {
  const list = Array.isArray(images) && images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = list.length;

  const go = useCallback((i) => setActive(((i % total) + total) % total), [total]);
  const next = useCallback(() => go(active + 1), [active, go]);
  const prev = useCallback((e) => {
    if (e?.preventDefault) e.preventDefault();
    go(active - 1);
  }, [active, go]);
  const handleNext = useCallback((e) => {
    if (e?.preventDefault) e.preventDefault();
    next();
  }, [next]);

  useEffect(() => {
    if (paused || total <= 1) return undefined;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [paused, total, interval, next]);

  if (total === 0) return null;

  return (
    <div
      data-testid={`cat-carousel-${slug}`}
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {list.map((img, i) => (
        <EditableImage
          key={i}
          slot={`home.cat.${slug}.image-${i}`}
          fallback={img}
          alt={alt}
          imgProps={{ loading: i === 0 ? "eager" : "lazy" }}
          aspectRatio={aspectRatio}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            data-testid={`cat-carousel-prev-${slug}`}
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-10 h-10 bg-[#1A1513]/55 hover:bg-[#1A1513]/85 backdrop-blur-md border border-[#FDFBF7]/20 text-[#FDFBF7] transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            data-testid={`cat-carousel-next-${slug}`}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-10 h-10 bg-[#1A1513]/55 hover:bg-[#1A1513]/85 backdrop-blur-md border border-[#FDFBF7]/20 text-[#FDFBF7] transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
          </button>

          {/* Dots */}
          <div
            data-testid={`cat-carousel-dots-${slug}`}
            className="absolute bottom-5 right-6 z-10 inline-flex items-center gap-1.5"
          >
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === active}
                onClick={(e) => { e.preventDefault(); go(i); }}
                className={`h-1.5 transition-all duration-300 border-0 ${
                  i === active
                    ? "w-7 bg-[#FDFBF7]"
                    : "w-3 bg-[#FDFBF7]/40 hover:bg-[#FDFBF7]/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
