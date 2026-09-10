// Public origin shared by canonical tags and generated discovery resources.
// Keep this aligned with the primary custom domain in Render.
export const PUBLIC_SITE_ORIGIN = "https://xalucatravel.com";

export function canonicalUrl(pathname = "/") {
  const path = String(pathname).split(/[?#]/)[0].replace(/^\/+|\/+$/g, "");
  return `${PUBLIC_SITE_ORIGIN}/${path}`;
}
