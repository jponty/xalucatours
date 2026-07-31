import React, { useState, useEffect, useReducer } from "react";
import { optimizedSrc, buildSrcSet, defaultSizes, isOptimizable, lqipSrc, preloadImageLink } from "@/lib/imageUrl";

const API = process.env.REACT_APP_BACKEND_URL || "";

/* ============================================================
   URL → CMS resolution for NON-slot imagery.
   ------------------------------------------------------------
   Cards / postcards / posters render remote Unsplash·Pexels URLs
   directly (hotlinked). To centralise everything in the CMS we:
     1. report each remote URL to the backend (it gets imported
        into our storage by the "migrate" job), and
     2. swap the remote URL for its /api/files copy via the map
        below — so the image is served from the CMS, not hotlinked.
   Loaded once per session; before it loads, the remote URL is used
   (identical to today), then it re-renders to the CMS copy.
============================================================ */
const isRemoteStock = (u) =>
  typeof u === "string" && /images\.(unsplash|pexels)\.com/.test(u);

const urlMapStore = { map: null, loading: false, subs: new Set() };

const ensureUrlMap = () => {
  if (urlMapStore.map !== null || urlMapStore.loading) return;
  urlMapStore.loading = true;
  fetch(`${API}/api/image-url-map`)
    .then((r) => r.json())
    .then((d) => {
      urlMapStore.map = (d && d.map) || {};
      urlMapStore.subs.forEach((fn) => fn());
    })
    .catch(() => { urlMapStore.map = {}; })
    .finally(() => { urlMapStore.loading = false; });
};

const resolveCmsUrl = (src) => {
  const m = urlMapStore.map;
  return m && m[src] ? m[src] : src;
};

const remoteReg = { known: new Set(), queue: new Set(), timer: null };
const flushRemoteReg = () => {
  remoteReg.timer = null;
  if (remoteReg.queue.size === 0) return;
  const urls = Array.from(remoteReg.queue);
  remoteReg.queue.clear();
  fetch(`${API}/api/image_urls/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  }).catch(() => {});
};
const registerRemoteUrl = (src) => {
  if (!isRemoteStock(src) || remoteReg.known.has(src)) return;
  remoteReg.known.add(src);
  remoteReg.queue.add(src);
  if (!remoteReg.timer) remoteReg.timer = setTimeout(flushRemoteReg, 1500);
};

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
  aspectRatio,
  className = "",
  style,
  onLoad,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    ensureUrlMap();
    if (isRemoteStock(src)) registerRemoteUrl(src);
    const sub = () => force();
    urlMapStore.subs.add(sub);
    return () => urlMapStore.subs.delete(sub);
  }, [src]);
  // Preload above-the-fold (priority) imagery at high fetch priority so the
  // browser starts the fetch before paint — improves LCP. No-op otherwise.
  useEffect(() => {
    if (!priority || !src) return undefined;
    const r = resolveCmsUrl(src);
    const opt = isOptimizable(r);
    return preloadImageLink(r, {
      srcSet: opt ? buildSrcSet(r) : undefined,
      sizes: sizes || defaultSizes(true),
      width,
    });
  }, [priority, src, sizes, width]);
  if (!src) return null;
  const resolved = resolveCmsUrl(src);
  const opt = isOptimizable(resolved);
  const srcSet = opt ? buildSrcSet(resolved) : undefined;
  const lqip = opt ? lqipSrc(resolved) : undefined;
  // Reserve layout space (prevents CLS) when an aspect ratio is provided and
  // the element isn't already sized by its container. Opt-in / non-breaking.
  const ratioStyle = aspectRatio ? { aspectRatio } : undefined;
  const handleLoad = (e) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };
  return (
    <img
      src={opt ? optimizedSrc(resolved, width) : resolved}
      srcSet={srcSet}
      sizes={srcSet ? (sizes || defaultSizes(priority)) : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      onLoad={handleLoad}
      className={lqip ? `${className} img-blurup${loaded ? " is-loaded" : ""}` : className}
      style={
        lqip && !loaded
          ? { backgroundImage: `url("${lqip}")`, ...ratioStyle, ...style }
          : { ...ratioStyle, ...style }
      }
      {...rest}
    />
  );
};

export default Img;
