import React from "react";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import xMonogram from "@/assets/monograma-x-white.png";
import { useBrandedImages } from "@/contexts/BrandedImagesContext";

/* ----------------------------------------------------------------
   <ImageBrandBadges />
   Xaluca brand overlay for static images — Xaluca logo (top-right)
   + "X" monogram (bottom-right). Same style/size/position used in
   the Gallery. Non-interactive (clicks pass through). Renders only
   when inside a <BrandedImagesProvider>. The parent must be
   position:relative.
---------------------------------------------------------------- */
export const ImageBrandBadges = ({ testid, monogramPosition = "bottom-right" }) => {
  const branded = useBrandedImages();
  if (!branded) return null;
  const monogramPos =
    monogramPosition === "top-left" ? "top-3 left-3" : "bottom-3 right-3";
  return (
    <>
      <XalucaLogoBadge
        className="top-4 right-4 w-10 h-10 md:w-12 md:h-12"
        testid={testid ? `${testid}-logo` : undefined}
      />
      <img
        src={xMonogram}
        alt=""
        aria-hidden="true"
        data-testid={testid ? `${testid}-monogram` : undefined}
        className={`pointer-events-none select-none absolute ${monogramPos} w-10 h-10 md:w-12 md:h-12 object-contain opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] z-[3]`}
      />
    </>
  );
};

export default ImageBrandBadges;
