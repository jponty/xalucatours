import React from "react";
import xMonogramBorde from "@/assets/monograma-x-borde.png";

/* ============================================================
   HeroMonogram — large Xaluca "X" border monogram, integrated into
   the bottom-right edge of a hero. DESKTOP ONLY (hidden on mobile so
   the mobile hero keeps its current design). Same treatment, size and
   opacity used across the site (footer / galleries / cards). The parent
   hero must be position:relative + overflow-hidden.
============================================================ */
export const HeroMonogram = ({ className = "", zClass = "z-[1]", testid = "hero-monogram" }) => (
  <img
    src={xMonogramBorde}
    alt=""
    aria-hidden="true"
    data-testid={testid}
    className={`hidden md:block pointer-events-none select-none absolute bottom-0 right-0 h-[120%] w-auto max-w-none object-contain opacity-[0.18] ${zClass} ${className}`}
  />
);

export default HeroMonogram;
