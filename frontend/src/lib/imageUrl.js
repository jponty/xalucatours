/* ============================================================
   imageUrl — responsive + modern-format delivery helpers.
   ------------------------------------------------------------
   All site imagery flows through <SmartImage> (EditableImage).
   These helpers turn a single source URL into:
     • an optimized `src` at a target width
     • a `srcSet` (multiple widths) so the browser picks the
       lightest variant for the device / DPR
   Works for the three real sources on this site:
     • Unsplash  (images.unsplash.com) — native param resize +
       `auto=format` negotiates WebP/AVIF.
     • Pexels    (images.pexels.com)   — native param resize.
     • Our proxy (/api/files/...)       — backend resize + fmt=auto
       (WebP/AVIF) endpoint.
   Unknown hosts / data: / .svg / .gif are left untouched.
============================================================ */

export const RESPONSIVE_WIDTHS = [320, 480, 640, 768, 960, 1280, 1600, 1920];

const isStorageProxy = (url) => /\/api\/files\//.test(url);
const isUnsplash = (url) => /images\.unsplash\.com/.test(url);
const isPexels = (url) => /images\.pexels\.com/.test(url);
const MEDIA_CDN_URL = (process.env.REACT_APP_MEDIA_CDN_URL || "").replace(/\/$/, "");

/* During the Bunny preview, keep the canonical `/api/files/<storage_path>`
   relationship in Supabase but deliver the bytes directly from the Pull Zone.
   Removing REACT_APP_MEDIA_CDN_URL is an instant frontend rollback to the
   backend proxy; no database URLs need to be rewritten. */
export const mediaDeliveryUrl = (url) => {
  if (!MEDIA_CDN_URL || !url || typeof url !== "string") return url;
  const match = url.match(/\/api\/files\/(.+)$/);
  if (!match) return url;
  return `${MEDIA_CDN_URL}/${match[1]}`;
};

const isBunnyMedia = (url) =>
  Boolean(MEDIA_CDN_URL) && typeof url === "string" && url.startsWith(`${MEDIA_CDN_URL}/`);

/* ------------------------------------------------------------------
   Browser format support, detected once and persisted. Lets the
   storage-proxy request an EXPLICIT format (`fmt=avif|webp`) so every
   variant is a distinct, fully CDN-cacheable URL (no `Vary` cache
   fragmentation). Until the async AVIF probe resolves on a first-ever
   visit we emit `fmt=auto` so the backend negotiates via the Accept
   header (still correct + AVIF-capable). WebP is assumed when AVIF is
   unsupported (universally available in every browser since ~2020). */
let _avif = null; // null = unknown, true/false once known
try {
  const s = typeof localStorage !== "undefined" && localStorage.getItem("xt_avif");
  if (s === "1") _avif = true;
  else if (s === "0") _avif = false;
} catch { /* ignore (private mode / SSR) */ }

const _AVIF_PROBE =
  "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=";

if (_avif === null && typeof window !== "undefined" && typeof Image !== "undefined") {
  const probe = new Image();
  const done = (ok) => {
    _avif = ok;
    try { localStorage.setItem("xt_avif", ok ? "1" : "0"); } catch { /* ignore */ }
  };
  probe.onload = () => done(probe.width > 0 && probe.height > 0);
  probe.onerror = () => done(false);
  probe.src = _AVIF_PROBE;
}

const proxyFormat = () => (_avif === true ? "avif" : _avif === false ? "webp" : "auto");

/* Can this URL be width-optimized at all? */
export const isOptimizable = (url) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("data:")) return false;
  if (/\.svg(\?|$)/i.test(url) || /\.gif(\?|$)/i.test(url)) return false;
  return isStorageProxy(url) || isBunnyMedia(mediaDeliveryUrl(url)) || isUnsplash(url) || isPexels(url);
};

/* Set/override query params, preserving relative vs absolute form. */
const withParams = (url, params) => {
  try {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const u = new URL(url, base);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined) u.searchParams.set(k, String(v));
    });
    const wasRelative = url.startsWith("/");
    return wasRelative && u.origin === base ? u.pathname + u.search : u.toString();
  } catch {
    return url;
  }
};

/* A single optimized URL at the given width. */
export const optimizedSrc = (url, w) => {
  if (!isOptimizable(url)) return url;
  const delivered = mediaDeliveryUrl(url);
  if (isUnsplash(url)) {
    return withParams(url, { auto: "format", fit: "crop", q: 80, w });
  }
  if (isPexels(url)) {
    return withParams(url, { auto: "compress", cs: "tinysrgb", w });
  }
  if (isBunnyMedia(delivered)) {
    const format = proxyFormat();
    return withParams(delivered, {
      width: w,
      quality: 80,
      // While AVIF support is still being detected, omit the format and let
      // Bunny's automatic optimization negotiate the best supported output.
      format: format === "auto" ? undefined : format,
    });
  }
  // Our storage proxy → backend resize + format negotiation. Request an
  // explicit modern format once detected (CDN-cacheable per format), falling
  // back to server-side Accept negotiation (`auto`) on a first-ever visit.
  return withParams(delivered, { w, fmt: proxyFormat() });
};

/* A srcSet string ("url 320w, url 640w, …") or undefined if not optimizable. */
export const buildSrcSet = (url, widths = RESPONSIVE_WIDTHS) => {
  if (!isOptimizable(url)) return undefined;
  return widths.map((w) => `${optimizedSrc(url, w)} ${w}w`).join(", ");
};

/* A tiny low-quality image placeholder (LQIP, ~24px) for blur-up: a few
   hundred bytes in a modern format, upscaled + blurred via CSS so the user
   sees a soft preview instantly instead of a black/empty box. Returns
   undefined for non-optimizable sources (local assets, SVG, data:). */
export const LQIP_WIDTH = 24;
export const lqipSrc = (url) => (isOptimizable(url) ? optimizedSrc(url, LQIP_WIDTH) : undefined);

/* Sensible default `sizes`. Full-bleed (hero/banner) → 100vw; otherwise a
   card-friendly heuristic. Callers can override via the `sizes` prop. */
export const defaultSizes = (priority) =>
  priority
    ? "100vw"
    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px";

/* Warm the browser cache for an image likely to be viewed next
   (carousel slides, gallery prev/next, related content). */
const prefetched = new Set();
export const prefetchImage = (url, w = 960) => {
  if (!url || prefetched.has(url) || typeof Image === "undefined") return;
  prefetched.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = optimizedSrc(url, w);
};

/* ------------------------------------------------------------------
   LCP preload — inject a high-priority `<link rel="preload" as="image">`
   for an above-the-fold (hero/banner) image so the browser starts the
   fetch as EARLY as possible, before the <img> element even paints.
   Responsive `imagesrcset` / `imagesizes` make the browser preload the
   SAME variant the <img> will request → no double download. De-duped &
   ref-counted by href; returns a cleanup that removes the tag once no
   mounted image still needs it. No-op on the server / when unsupported. */
const _preloadRefs = new Map(); // href → { count, link }
export const preloadImageLink = (url, { srcSet, sizes, width = 1920 } = {}) => {
  if (typeof document === "undefined" || !url) return () => {};
  const href = isOptimizable(url) ? optimizedSrc(url, width) : url;
  let entry = _preloadRefs.get(href);
  if (entry) {
    entry.count += 1;
  } else {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    link.setAttribute("fetchpriority", "high");
    if (srcSet) {
      link.setAttribute("imagesrcset", srcSet);
      link.setAttribute("imagesizes", sizes || "100vw");
    }
    document.head.appendChild(link);
    entry = { count: 1, link };
    _preloadRefs.set(href, entry);
  }
  return () => {
    const e = _preloadRefs.get(href);
    if (!e) return;
    e.count -= 1;
    if (e.count <= 0) {
      try { e.link.remove(); } catch { /* ignore */ }
      _preloadRefs.delete(href);
    }
  };
};
