import React from "react";
import { optimizedSrc, buildSrcSet, defaultSizes, isOptimizable } from "@/lib/imageUrl";

/* ============================================================
   <Img> — drop-in <img> replacement for NON-editable imagery
   (carousels, galleries, catalogs, admin thumbnails…). Routes
   the source through the responsive/modern-format pipeline:
     • srcSet + sizes  → browser picks the lightest variant
     • optimized src    → width-capped, WebP/AVIF where supported
     • lazy + async decode by default (eager for `priority`)
   Non-optimizable sources (SVG/data:/unknown hosts) pass through
   untouched. Editable slot imagery keeps using <SmartImage>.
============================================================ */
export const Img = ({
  src,
  alt = "",
  width = 1280,
  sizes,
  priority = false,
  className,
  style,
  ...rest
}) => {
  if (!src) return null;
  const opt = isOptimizable(src);
  const srcSet = opt ? buildSrcSet(src) : undefined;
  return (
    <img
      src={opt ? optimizedSrc(src, width) : src}
      srcSet={srcSet}
      sizes={srcSet ? (sizes || defaultSizes(priority)) : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchpriority={priority ? "high" : undefined}
      className={className}
      style={style}
      {...rest}
    />
  );
};

export default Img;
