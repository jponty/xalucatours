import React from "react";

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
