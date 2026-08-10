import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";
import { Img } from "@/components/Img";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";

const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  previous: T("Imagen anterior", "Previous image", "Image précédente"),
  next: T("Imagen siguiente", "Next image", "Image suivante"),
  label: T("Imágenes reales del viaje", "Real journey images", "Images réelles du voyage"),
};

export default function TripImageCarousel({
  images = [],
  title,
  lang,
  className = "aspect-[16/10]",
  imageClassName = "",
  priorityFirst = false,
  showBadge = true,
  showCount = true,
  testidPrefix = "trip-carousel",
  children,
}) {
  const [active, setActive] = useState(0);
  const touch = useRef(null);
  const suppressClickUntil = useRef(0);
  const total = images.length;
  const safeActive = total ? active % total : 0;

  useEffect(() => { setActive(0); }, [images]);

  const move = (event, direction) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (total > 1) setActive((current) => (current + direction + total) % total);
  };
  const onTouchStart = (event) => {
    const point = event.touches?.[0];
    touch.current = point ? { x: point.clientX, y: point.clientY } : null;
  };
  const onTouchEnd = (event) => {
    const start = touch.current;
    const point = event.changedTouches?.[0];
    touch.current = null;
    if (!start || !point || total <= 1) return;
    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
    suppressClickUntil.current = Date.now() + 450;
    event.stopPropagation();
    setActive((current) => (current + (dx < 0 ? 1 : -1) + total) % total);
  };
  const stopSwipeClick = (event) => {
    if (Date.now() < suppressClickUntil.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  if (!total) {
    return (
      <div className={`flex items-center justify-center bg-[#EEE4D7] text-[#9A6B4D] ${className}`} data-testid={`${testidPrefix}-empty`}>
        <Images className="h-6 w-6" strokeWidth={1.3} />
        {children}
      </div>
    );
  }

  return (
    <div
      className={`group/carousel relative overflow-hidden bg-[#E9DED0] touch-pan-y ${className}`}
      aria-roledescription="carousel"
      aria-label={`${pick(COPY.label, lang)} · ${title}`}
      data-testid={testidPrefix}
      data-image-count={total}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClickCapture={stopSwipeClick}
    >
      <Img
        key={images[safeActive]}
        src={images[safeActive]}
        alt={`${title} · ${safeActive + 1}`}
        width={720}
        priority={priorityFirst && safeActive === 0}
        className={`absolute inset-0 h-full w-full object-cover animate-in fade-in duration-500 ${imageClassName}`}
      />
      {children}
      {showBadge && (
        <XalucaLogoBadge className="right-2 top-2 h-8 w-8 md:h-9 md:w-9" testid={`${testidPrefix}-logo`} />
      )}
      {showCount && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] bg-gradient-to-t from-[#1A1513]/70 to-transparent px-3 pb-2 pt-8">
          <span className="text-[9px] font-semibold tracking-[0.16em] text-white">{safeActive + 1} / {total}</span>
        </div>
      )}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => move(event, -1)}
            aria-label={pick(COPY.previous, lang)}
            data-testid={`${testidPrefix}-previous`}
            className="absolute left-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/45 bg-[#1A1513]/55 text-white opacity-100 backdrop-blur-sm transition-all hover:bg-[#C16542] md:opacity-0 md:group-hover/carousel:opacity-100 md:focus-visible:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={(event) => move(event, 1)}
            aria-label={pick(COPY.next, lang)}
            data-testid={`${testidPrefix}-next`}
            className="absolute right-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/45 bg-[#1A1513]/55 text-white opacity-100 backdrop-blur-sm transition-all hover:bg-[#C16542] md:opacity-0 md:group-hover/carousel:opacity-100 md:focus-visible:opacity-100"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </>
      )}
    </div>
  );
}
