import React from "react";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import ImageContactBubble from "@/components/ImageContactBubble";
import xMonogramBorde from "@/assets/monograma-x-borde.png";

/* ----------------------------------------------------------------
   <CardBrandOverlay />
   Full Xaluca brand treatment for static card images, matching the
   Polaroids / hubs:
     - Xaluca logo            → top-right
     - Large "X" border       → bottom-right, integrated into the edge
                                 (clipped by the overflow-hidden parent)
     - Appointment widget      → bottom-left (ImageContactBubble, /citaprevia)
   The parent must be position:relative + overflow-hidden. Renders
   unconditionally (no BrandedImagesProvider needed).

   hideBubbleOnMobile: when true, the appointment widget is hidden on
   mobile (kept only md+) for small images — avoids clutter on tiny tiles.
---------------------------------------------------------------- */
export const CardBrandOverlay = ({ slug, testid, hideBubbleOnMobile = false }) => (
  <>
    <XalucaLogoBadge
      className="top-3 right-3 w-10 h-10 md:w-12 md:h-12"
      testid={testid ? `${testid}-logo` : undefined}
    />
    <img
      src={xMonogramBorde}
      alt=""
      aria-hidden="true"
      data-testid={testid ? `${testid}-monogram` : undefined}
      className="pointer-events-none select-none absolute bottom-0 right-0 h-[118%] w-auto max-w-none object-contain opacity-[0.22] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] z-[2]"
    />
    {hideBubbleOnMobile ? (
      <span className="hidden md:block">
        <ImageContactBubble slug={slug} align="left" />
      </span>
    ) : (
      <ImageContactBubble slug={slug} align="left" />
    )}
  </>
);

export default CardBrandOverlay;
