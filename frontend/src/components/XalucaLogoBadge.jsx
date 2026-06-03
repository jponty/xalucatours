import React from "react";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";

/* ============================================================
   XalucaLogoBadge — decorative Xaluca brand logo overlaid on
   the top-right corner of an image. The parent must be
   position:relative. Non-interactive (clicks pass through).
   Override placement/size via `className`.
============================================================ */
export const XalucaLogoBadge = ({ className = "", testid }) => (
  <img
    src={grupXalucaLogo}
    alt="Xaluca"
    aria-hidden="true"
    data-testid={testid}
    className={`pointer-events-none select-none absolute object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] z-[3] ${
      className || "top-3 right-3 w-11 h-11"
    }`}
  />
);

export default XalucaLogoBadge;
