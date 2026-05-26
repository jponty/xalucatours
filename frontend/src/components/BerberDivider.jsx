import React from "react";

/* ============================================================
   Arab / Moroccan classical ornament dividers
   -------------------------------------------------------------
   Pure Andalusian-Arabic visual language: 8-point zellige stars,
   arabesque flourishes, hairline ornaments. No tribal motifs.

   Default export accepts a `variant` prop for compatibility with
   existing call sites — every variant resolves to an Arabic
   ornament. Legacy variants ("berber", "nomadic") map to the
   safe Arabic defaults.
============================================================ */

/* ---------- Legacy inline mini-dividers (kept for back-compat) ---------- */
export const BerberDiamondDivider = ({ className = "" }) => (
  <div className={`flex items-center justify-center gap-3 py-2 ${className}`} aria-hidden="true">
    <span className="h-px w-12 md:w-20 bg-[#2C2621]/15" />
    <svg width="56" height="14" viewBox="0 0 56 14" fill="none" className="text-[#C16542]">
      {/* 8-point Andalusian star */}
      <g transform="translate(28 7)" stroke="currentColor" strokeWidth="0.9">
        <polygon points="-6,0 -4,-4 0,-6 4,-4 6,0 4,4 0,6 -4,4" fill="none" />
        <polygon points="0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2" fill="none" transform="rotate(22.5)" />
        <circle r="1.4" fill="currentColor" />
      </g>
      <path d="M2 7 L18 7 M38 7 L54 7" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
    <span className="h-px w-12 md:w-20 bg-[#2C2621]/15" />
  </div>
);

export const BerberZigzagDivider = ({ className = "" }) => (
  <div
    className={`berber-bg-zigzag h-3.5 w-full ${className}`}
    aria-hidden="true"
  />
);

/* ---------- Editorial Arab section dividers ---------- */

const BG_COLORS = {
  cream:  "#F5EFE3",
  ivory:  "#FBF5EA",
  paper:  "#FDFBF7",
  warm:   "#F2EBE1",
  dark:   "#1A1513",
};

/* Variant 1 — Zellige (Andalusian Arabic tile) */
const ZelligeDivider = ({ color, bg }) => (
  <div
    data-testid="arabic-divider-zellige"
    className="relative w-full overflow-hidden"
    style={{ background: bg }}
  >
    <svg
      viewBox="0 0 1200 70"
      preserveAspectRatio="xMidYMid meet"
      className="block w-full h-[60px] md:h-[70px]"
      aria-hidden="true"
    >
      <defs>
        <pattern id="zellige-tile" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <g transform="translate(30 30)" fill="none" stroke={color} strokeWidth="0.8" opacity="0.55">
            <polygon points="-14,0 -10,-10 0,-14 10,-10 14,0 10,10 0,14 -10,10" />
            <polygon points="0,-14 5,-5 14,0 5,5 0,14 -5,5 -14,0 -5,-5" transform="rotate(22.5)" />
            <circle r="3" />
          </g>
        </pattern>
      </defs>
      <line x1="0" y1="6" x2="1200" y2="6" stroke={color} strokeOpacity="0.18" />
      <rect x="0" y="10" width="1200" height="50" fill="url(#zellige-tile)" />
      <line x1="0" y1="63" x2="1200" y2="63" stroke={color} strokeOpacity="0.18" />
    </svg>
  </div>
);

/* Variant 2 — Arabesque hairline flourish with central medallion */
const ArabesqueDivider = ({ color, bg, label = "Xaluca · Tours" }) => (
  <div
    data-testid="arabic-divider-arabesque"
    className="relative w-full overflow-hidden"
    style={{ background: bg }}
  >
    <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-8 md:py-10 flex items-center gap-5">
      {/* Left hairline + small ornament */}
      <span className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)`, opacity: 0.55 }} />
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="shrink-0" aria-hidden="true">
        <g stroke={color} strokeWidth="0.9" opacity="0.6" fill="none">
          <path d="M2 11 C 6 11, 6 5, 11 5 C 16 5, 16 11, 20 11" />
          <path d="M2 11 C 6 11, 6 17, 11 17 C 16 17, 16 11, 20 11" />
          <circle cx="11" cy="11" r="1.4" fill={color} stroke="none" />
        </g>
      </svg>

      {/* Central medallion — Andalusian 8-point star inscribed in a circle */}
      <span
        className="relative inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full"
        style={{ border: `1px solid ${color}66` }}
      >
        <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none" stroke={color} strokeWidth="1">
          <polygon points="14,3 17,11 25,11 19,16 21,24 14,19 7,24 9,16 3,11 11,11" />
          <circle cx="14" cy="14" r="1.6" fill={color} stroke="none" />
        </svg>
      </span>

      <span className="text-[10px] tracking-[0.4em] uppercase shrink-0" style={{ color: `${color}cc` }}>
        {label}
      </span>

      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="shrink-0" aria-hidden="true">
        <g stroke={color} strokeWidth="0.9" opacity="0.6" fill="none">
          <path d="M2 11 C 6 11, 6 5, 11 5 C 16 5, 16 11, 20 11" />
          <path d="M2 11 C 6 11, 6 17, 11 17 C 16 17, 16 11, 20 11" />
          <circle cx="11" cy="11" r="1.4" fill={color} stroke="none" />
        </g>
      </svg>
      <span className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)`, opacity: 0.55 }} />
    </div>
  </div>
);

export default function BerberDivider({
  variant = "zellige",
  tone = "cream",
  color = "#A07042",
  label,
}) {
  const bg = BG_COLORS[tone] || tone;
  // Legacy variants "berber" / "nomadic" / "rug" map to Arabic equivalents.
  const v = variant === "nomadic" ? "arabesque"
          : (variant === "zellige" || variant === "arabesque") ? variant
          : "zellige"; // berber / rug / unknown -> zellige
  if (v === "arabesque") return <ArabesqueDivider color={color} bg={bg} label={label} />;
  return <ZelligeDivider color={color} bg={bg} />;
}
