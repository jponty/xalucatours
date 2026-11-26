/*
 * The approved 1200x630 brand card is shared by every public route and post.
 * Browser-rendered and build-time HTML use the same asset.
 */
export const SEO_IMAGE_VERSION = "20261126-4";
export const BRAND_SOCIAL_IMAGE = `/og-brand-sand.jpg?v=${SEO_IMAGE_VERSION}`;

export const seoImageForRoute = () => BRAND_SOCIAL_IMAGE;

export const seoImageForBlogPost = () => BRAND_SOCIAL_IMAGE;

export default seoImageForRoute;
