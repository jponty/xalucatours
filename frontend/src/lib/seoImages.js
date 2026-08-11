/*
 * Social preview images are generated at 1200x630 in public/og.
 * Keeping the URL derivation here means every React-rendered page and the
 * build-time static social pages use the exact same asset convention.
 */
export const SEO_IMAGE_VERSION = "20260811";

export const seoImageForRoute = (routeId) =>
  routeId === "home" || !routeId
    ? `/og-image.jpg?v=${SEO_IMAGE_VERSION}`
    : `/og/routes/${routeId}.jpg?v=${SEO_IMAGE_VERSION}`;

export const seoImageForBlogPost = (slug) =>
  slug
    ? `/og/blog/${slug}.jpg?v=${SEO_IMAGE_VERSION}`
    : `/og/routes/blog.jpg?v=${SEO_IMAGE_VERSION}`;

export default seoImageForRoute;
