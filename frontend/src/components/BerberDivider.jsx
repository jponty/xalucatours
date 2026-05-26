import React from "react";

/* ============================================================
   Berber / Arab / Nomadic decorative dividers
   -------------------------------------------------------------
   Two legacy named exports (used by Footer + FeaturedJourneys)
   PLUS a default export with full-bleed editorial variants.
============================================================ */

/* ---------- Legacy inline mini-dividers ---------- */
export const BerberDiamondDivider = ({ className = "" }) => (
  <div className={`flex items-center justify-center gap-3 py-2 ${className}`} aria-hidden="true">
    <span className="h-px w-12 md:w-20 bg-[#2C2621]/15" />
    <svg width="44" height="14" viewBox="0 0 44 14" fill="none" className="text-[#C16542]">
      <path d="M22 1 L31 7 L22 13 L13 7 Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="22" cy="7" r="1.4" fill="currentColor" />
      <path d="M2 7 L10 7 M34 7 L42 7" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
    <span className="h-px w-12 md:w-20 bg-[#2C2621]/15" />
  </div>
);

export const BerberZigzagDivider = ({ className = "", inverted = false }) => (
  <div
    className={`berber-bg-zigzag h-3 w-full ${className}`}
    style={inverted ? { filter: "invert(0.8)" } : undefined}
    aria-hidden="true"
  />
);

/* ---------- Full-bleed editorial section dividers ---------- */

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
    data-testid="berber-divider-zellige"
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

/* Variant 2 — Berber rug (diamond + zigzag) */
const BerberRugDivider = ({ color, bg }) => (
  <div
    data-testid="berber-divider-rug"
    className="relative w-full overflow-hidden"
    style={{ background: bg }}
  >
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="xMidYMid meet"
      className="block w-full h-[52px] md:h-[60px]"
      aria-hidden="true"
    >
      <path
        d="M 0 18 L 30 10 L 60 18 L 90 10 L 120 18 L 150 10 L 180 18 L 210 10 L 240 18 L 270 10 L 300 18 L 330 10 L 360 18 L 390 10 L 420 18 L 450 10 L 480 18 L 510 10 L 540 18 L 570 10 L 600 18 L 630 10 L 660 18 L 690 10 L 720 18 L 750 10 L 780 18 L 810 10 L 840 18 L 870 10 L 900 18 L 930 10 L 960 18 L 990 10 L 1020 18 L 1050 10 L 1080 18 L 1110 10 L 1140 18 L 1170 10 L 1200 18"
        stroke={color} strokeWidth="1" fill="none" opacity="0.5"
      />
      <g fill="none" stroke={color} strokeWidth="0.9" opacity="0.65">
        {Array.from({ length: 24 }).map((_, i) => {
          const cx = 25 + i * 50;
          return (
            <g key={i}>
              <polygon points={`${cx},27 ${cx + 10},37 ${cx},47 ${cx - 10},37`} />
              <circle cx={cx} cy="37" r="1.6" fill={color} stroke="none" opacity="0.9" />
            </g>
          );
        })}
      </g>
      <path
        d="M 0 55 L 30 50 L 60 55 L 90 50 L 120 55 L 150 50 L 180 55 L 210 50 L 240 55 L 270 50 L 300 55 L 330 50 L 360 55 L 390 50 L 420 55 L 450 50 L 480 55 L 510 50 L 540 55 L 570 50 L 600 55 L 630 50 L 660 55 L 690 50 L 720 55 L 750 50 L 780 55 L 810 50 L 840 55 L 870 50 L 900 55 L 930 50 L 960 55 L 990 50 L 1020 55 L 1050 50 L 1080 55 L 1110 50 L 1140 55 L 1170 50 L 1200 55"
        stroke={color} strokeWidth="0.7" fill="none" opacity="0.35"
      />
    </svg>
  </div>
);

/* Variant 3 — Nomadic (caravan dotted line + compass medallion) */
const NomadicDivider = ({ color, bg, label = "Xaluca · Tours" }) => (
  <div
    data-testid="berber-divider-nomadic"
    className="relative w-full overflow-hidden"
    style={{ background: bg }}
  >
    <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-8 md:py-10 flex items-center gap-5">
      <span
        className="flex-1 h-px"
        style={{ background: `repeating-linear-gradient(to right, ${color} 0 2px, transparent 2px 8px)`, opacity: 0.55 }}
      />
      <span
        className="relative inline-flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full"
        style={{ border: `1px solid ${color}66` }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={color} strokeWidth="1.4">
          <path d="M 12 2 L 13 11 L 22 12 L 13 13 L 12 22 L 11 13 L 2 12 L 11 11 Z" />
          <circle cx="12" cy="12" r="1.4" fill={color} stroke="none" />
        </svg>
      </span>
      <span className="text-[10px] tracking-[0.4em] uppercase shrink-0" style={{ color: `${color}cc` }}>
        {label}
      </span>
      <span
        className="flex-1 h-px"
        style={{ background: `repeating-linear-gradient(to right, ${color} 0 2px, transparent 2px 8px)`, opacity: 0.55 }}
      />
    </div>
  </div>
);

export default function BerberDivider({
  variant = "berber",
  tone = "cream",
  color = "#A07042",
  label,
}) {
  const bg = BG_COLORS[tone] || tone;
  if (variant === "zellige") return <ZelligeDivider color={color} bg={bg} />;
  if (variant === "nomadic") return <NomadicDivider color={color} bg={bg} label={label} />;
  return <BerberRugDivider color={color} bg={bg} />;
}
