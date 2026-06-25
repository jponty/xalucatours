import React, { useState } from "react";
import { optimizedSrc, buildSrcSet, defaultSizes, isOptimizable, lqipSrc } from "@/lib/imageUrl";

/* ============================================================
   <Img> — drop-in <img> replacement for NON-editable imagery
   (carousels, galleries, catalogs, admin thumbnails…). Routes
   the source through the responsive/modern-format pipeline:
     • srcSet + sizes  → browser picks the lightest variant
     • optimized src    → width-capped, AVIF/WebP where supported
     • lazy + async decode by default (eager for `priority`)
     • blur-up (LQIP)   → a tiny preview shows instantly and the
       image sharpens in once decoded — never a black box.
   Non-optimizable sources (SVG/data:/unknown hosts) pass through
   untouched. Editable slot imagery keeps using <SmartImage>.
============================================================ */
export const Img = ({
  src,
  alt = "",
  width = 1280,
  sizes,
  priority = false,
  className = "",
  style,
  onLoad,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  if (!src) return null;
  const opt = isOptimizable(src);
  const srcSet = opt ? buildSrcSet(src) : undefined;
  const lqip = opt ? lqipSrc(src) : undefined;
  const handleLoad = (e) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };
  return (
    <img
      src={opt ? optimizedSrc(src, width) : src}
      srcSet={srcSet}
      sizes={srcSet ? (sizes || defaultSizes(priority)) : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchpriority={priority ? "high" : undefined}
      onLoad={handleLoad}
      className={lqip ? `${className} img-blurup${loaded ? " is-loaded" : ""}` : className}
      style={lqip && !loaded ? { backgroundImage: `url("${lqip}")`, ...style } : style}
      {...rest}
    />
  );
};

export default Img;
