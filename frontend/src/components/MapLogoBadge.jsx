import React from "react";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";

/* ============================================================
   MapLogoBadge — Xaluca brand logo overlaid on the top-right
   corner of a Leaflet map. The PARENT wrapper of <MapContainer>
   must be position:relative. Sits above Leaflet panes/controls
   (z-[1000]) and is non-interactive so map gestures pass through.
   Same visual style as the site-wide logo badge.
============================================================ */
export const MapLogoBadge = ({ className = "" }) => (
  <img
    src={grupXalucaLogo}
    alt="Xaluca"
    aria-hidden="true"
    data-testid="map-logo-badge"
    className={`pointer-events-none select-none absolute top-3 right-3 w-10 h-10 md:w-11 md:h-11 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] z-[1000] ${className}`}
  />
);

export default MapLogoBadge;
