/* ============================================================
   SeoHead.jsx — Dynamic <head> manager for SEO + Open Graph
   + JSON-LD structured data, with zero new dependencies.

   Used by editorial pages (blog index, blog post) to expose:
     - <title>, <meta name="description">
     - OpenGraph (og:*)
     - Twitter card (twitter:*)
     - rel=canonical
     - rel=alternate hreflang × {es, en, fr, x-default}
     - one or more <script type="application/ld+json">

   All injected nodes are tagged `data-seo="dynamic"` so we can
   sweep them between renders without touching unrelated tags
   (e.g. the static <meta charset>, viewport, etc. from index.html).
============================================================ */
import { useEffect } from "react";
import { resolvePath } from "@/lib/routes";
import { seoImageForBlogPost, seoImageForRoute } from "@/lib/seoImages";

const SEO_FLAG = "data-seo";
const SEO_FLAG_VAL = "dynamic";

const OG_LOCALE = { es: "es_ES", en: "en_GB", fr: "fr_FR" };

const absolutize = (url, origin) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (!origin) return url;
  return origin + (url.startsWith("/") ? url : "/" + url);
};

const ensureMeta = (head, attrName, attrValue, content) => {
  // Remove any pre-existing tag (static or dynamic) with the same selector,
  // so our value takes precedence over whatever was hard-coded in index.html.
  head.querySelectorAll(`meta[${attrName}="${attrValue}"]`).forEach((n) => n.remove());
  const node = document.createElement("meta");
  node.setAttribute(attrName, attrValue);
  node.setAttribute("content", content);
  node.setAttribute(SEO_FLAG, SEO_FLAG_VAL);
  head.appendChild(node);
};

const ensureLink = (head, rel, href, extras = {}) => {
  // For rel=canonical there should only ever be one; remove any duplicates.
  if (rel === "canonical") {
    head.querySelectorAll(`link[rel="canonical"]`).forEach((n) => n.remove());
  }
  const node = document.createElement("link");
  node.setAttribute("rel", rel);
  node.setAttribute("href", href);
  Object.entries(extras).forEach(([k, v]) => node.setAttribute(k, v));
  node.setAttribute(SEO_FLAG, SEO_FLAG_VAL);
  head.appendChild(node);
};

const ensureScript = (head, json) => {
  const node = document.createElement("script");
  node.setAttribute("type", "application/ld+json");
  node.setAttribute(SEO_FLAG, SEO_FLAG_VAL);
  node.text = JSON.stringify(json);
  head.appendChild(node);
};

export default function SeoHead({
  title,
  description,
  image,
  type = "website",       // "website" | "article"
  lang = "es",
  hreflang,               // { es, en, fr } absolute or relative paths
  jsonLd,                 // object | array of structured-data objects
  siteName = "Xaluca Tours",
  twitterCard = "summary_large_image",
}) {
  useEffect(() => {
    const head = document.head;
    if (!head) return undefined;

    const origin =
      typeof window !== "undefined" && window.location ? window.location.origin : "";
    const currentUrl =
      typeof window !== "undefined" && window.location ? window.location.href : "";
    const pathname =
      typeof window !== "undefined" && window.location ? window.location.pathname : "";
    const blogMatch = pathname.match(/^\/(?:en\/|fr\/)?blog\/([^/?#]+)\/?$/);
    const { routeId } = resolvePath(pathname || "/");
    // Always use the controlled Grup Xaluca composition for public pages.
    // This also prevents a nested page-level SeoHead from replacing it with
    // an unbranded remote Unsplash/Pexels URL.
    const controlledImage = blogMatch
      ? seoImageForBlogPost(blogMatch[1])
      : seoImageForRoute(routeId);
    const absImage = absolutize(controlledImage || image, origin);

    // 1. <title> and <html lang>
    if (title) document.title = title;
    document.documentElement.setAttribute("lang", lang);

    // 2. Sweep previously injected dynamic tags
    head.querySelectorAll(`[${SEO_FLAG}="${SEO_FLAG_VAL}"]`).forEach((n) => n.remove());

    // 3. Description
    if (description) ensureMeta(head, "name", "description", description);

    // 4. OpenGraph
    if (title)       ensureMeta(head, "property", "og:title", title);
    if (description) ensureMeta(head, "property", "og:description", description);
    ensureMeta(head, "property", "og:type", type);
    if (currentUrl)  ensureMeta(head, "property", "og:url", currentUrl);
    ensureMeta(head, "property", "og:site_name", siteName);
    ensureMeta(head, "property", "og:locale", OG_LOCALE[lang] || OG_LOCALE.es);
    if (absImage) {
      ensureMeta(head, "property", "og:image", absImage);
      ensureMeta(head, "property", "og:image:secure_url", absImage);
      ensureMeta(head, "property", "og:image:type", "image/jpeg");
      ensureMeta(head, "property", "og:image:width", "1200");
      ensureMeta(head, "property", "og:image:height", "630");
      ensureMeta(head, "property", "og:image:alt", title || siteName);
    }

    // 5. Twitter
    ensureMeta(head, "name", "twitter:card", twitterCard);
    if (title)       ensureMeta(head, "name", "twitter:title", title);
    if (description) ensureMeta(head, "name", "twitter:description", description);
    if (absImage) {
      ensureMeta(head, "name", "twitter:image", absImage);
      ensureMeta(head, "name", "twitter:image:alt", title || siteName);
    }

    // 6. Canonical + hreflang
    if (currentUrl) ensureLink(head, "canonical", currentUrl);
    if (hreflang) {
      const map = {
        es: absolutize(hreflang.es, origin),
        en: absolutize(hreflang.en, origin),
        fr: absolutize(hreflang.fr, origin),
      };
      Object.entries(map).forEach(([code, href]) => {
        if (href) ensureLink(head, "alternate", href, { hreflang: code });
      });
      if (map.es) ensureLink(head, "alternate", map.es, { hreflang: "x-default" });
    }

    // 7. JSON-LD
    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      arr.forEach((j) => j && ensureScript(head, j));
    }

    return () => {
      head.querySelectorAll(`[${SEO_FLAG}="${SEO_FLAG_VAL}"]`).forEach((n) => n.remove());
    };
  }, [
    title, description, image, type, lang, siteName, twitterCard,
    // serialize complex props to a stable dep
    JSON.stringify(hreflang || null),
    JSON.stringify(jsonLd || null),
  ]);

  return null;
}
