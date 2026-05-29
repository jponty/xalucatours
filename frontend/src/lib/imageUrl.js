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

/* Can this URL be width-optimized at all? */
export const isOptimizable = (url) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("data:")) return false;
  if (/\.svg(\?|$)/i.test(url) || /\.gif(\?|$)/i.test(url)) return false;
  return isStorageProxy(url) || isUnsplash(url) || isPexels(url);
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
  if (isUnsplash(url)) {
    return withParams(url, { auto: "format", fit: "crop", q: 80, w });
  }
  if (isPexels(url)) {
    return withParams(url, { auto: "compress", cs: "tinysrgb", w });
  }
  // Our storage proxy → backend resize + format negotiation.
  return withParams(url, { w, fmt: "auto" });
};

/* A srcSet string ("url 320w, url 640w, …") or undefined if not optimizable. */
export const buildSrcSet = (url, widths = RESPONSIVE_WIDTHS) => {
  if (!isOptimizable(url)) return undefined;
  return widths.map((w) => `${optimizedSrc(url, w)} ${w}w`).join(", ");
};

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
