import React, { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditableImage from "@/components/EditableImage";
import { useEditMode } from "@/contexts/EditModeContext";
import xMonogram from "@/assets/monograma-x-white.png";

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
  const { editMode } = useEditMode();
  const total = list.length;
  const touchStartX = useRef(null);
  const SWIPE_THRESHOLD = 50; // px

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

  // Swipe gestures (mobile)
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    setPaused(true); // pause auto-advance while user is interacting
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null || total <= 1) { setPaused(false); return; }
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (delta <= -SWIPE_THRESHOLD)      go(active + 1); // swipe left → next
    else if (delta >= SWIPE_THRESHOLD)  go(active - 1); // swipe right → prev
    setPaused(false);
  };

  useEffect(() => {
    // Never auto-advance while editing — the user needs the visible slide
    // to stay put so they can click it and open its image editor.
    if (paused || editMode || total <= 1) return undefined;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [paused, editMode, total, interval, next]);

  if (total === 0) return null;

  return (
    <div
      data-testid={`cat-carousel-${slug}`}
      className="absolute inset-0 touch-pan-y"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {list.map((img, i) => (
        <div
          key={i}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          } ${
            /* Only the visible slide receives clicks so edit-mode targets
               the currently shown image instead of a hidden stacked one. */
            i === active ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <EditableImage
            slot={`home.cat.${slug}.image-${i}`}
            fallback={img}
            alt={alt}
            imgProps={{ loading: i === 0 ? "eager" : "lazy" }}
            aspectRatio={aspectRatio}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            data-testid={`cat-carousel-prev-${slug}`}
            data-edit-allow="true"
            className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-[50] inline-flex items-center justify-center w-10 h-10 bg-[#1A1513]/55 hover:bg-[#1A1513]/85 backdrop-blur-md border border-[#FDFBF7]/20 text-[#FDFBF7] transition-opacity duration-300 ${
              editMode ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            data-testid={`cat-carousel-next-${slug}`}
            data-edit-allow="true"
            className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-[50] inline-flex items-center justify-center w-10 h-10 bg-[#1A1513]/55 hover:bg-[#1A1513]/85 backdrop-blur-md border border-[#FDFBF7]/20 text-[#FDFBF7] transition-opacity duration-300 ${
              editMode ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            }`}
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
          </button>

          {/* Dots — square navigation indicators, with the Xaluca "X"
              monogram superimposed over them as a brand mark. */}
          <div
            data-testid={`cat-carousel-dots-${slug}`}
            className="absolute bottom-5 right-6 z-[50] inline-flex items-center gap-1.5"
          >
            <img
              src={xMonogram}
              alt=""
              aria-hidden="true"
              data-testid={`cat-carousel-monogram-${slug}`}
              className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 object-contain opacity-95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] z-[51]"
            />
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === active}
                data-edit-allow="true"
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
