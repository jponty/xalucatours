import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTripHighlights } from "@/lib/tripHighlights";

/* ============================================================
   CardHighlightsMarquee
   ----
   A continuous horizontal-scroll strip, anchored to the bottom edge of
   a trip card, showing that trip's "Lugares destacados" — the exact
   same places listed on the trip's detail page. Mirrors the visual
   language of the Home hero marquee (dark band · ◆ accents · uppercase).

   Props:
     • routeId  — trip route id used to look up the highlights.
     • variant  — "flow" (default, sits at the natural bottom of a
                  flex-column card) or "overlay" (absolutely pinned to
                  the bottom edge of a full-image card).
     • testid   — optional data-testid override.

   Renders nothing when the route has no registered highlights.
============================================================ */
export const CardHighlightsMarquee = ({ routeId, variant = "flow", testid, fallbackPlaces = [] }) => {
  const { lang } = useLanguage();
  const fromProgram = getTripHighlights(routeId, lang);
  // Program highlights when the route maps to a single program; otherwise fall
  // back to the card's own route places (aggregate/hub routes have no program),
  // so EVERY card shows the same animated highlights bar.
  const places = fromProgram.length ? fromProgram : (fallbackPlaces || []);
  if (!places.length) return null;

  // Repeat the base list until a single half-track comfortably exceeds a
  // card width, then duplicate it so the -50% loop is seamless with no gap.
  let half = [...places];
  while (half.length < 8) half = [...half, ...places];
  const loop = [...half, ...half];

  const isOverlay = variant === "overlay";

  return (
    <div
      data-testid={testid || `card-highlights-${routeId}`}
      aria-hidden="true"
      className={`${
        isOverlay ? "absolute inset-x-0 bottom-0 z-[3]" : "mt-auto"
      } w-full overflow-hidden bg-[#2C2621] border-t border-[#FDFBF7]/10`}
    >
      <div className="marquee-track py-2.5">
        {loop.map((place, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 px-3.5 text-[9px] md:text-[10px] tracking-[0.26em] uppercase text-[#FDFBF7]/85 whitespace-nowrap"
          >
            <span className="text-[#D4A373]">◆</span>
            {place}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CardHighlightsMarquee;
