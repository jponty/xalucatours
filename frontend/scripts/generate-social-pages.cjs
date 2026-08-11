/*
 * Create physical HTML files for every public URL after the CRA build.
 * Render serves an existing static resource before applying the SPA rewrite,
 * so social crawlers can read route-specific Open Graph tags without JS.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const SITE = "https://xalucatravel.com";
const IMAGE_VERSION = "20260811";

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const template = read("build/index.html");

const routeSource = read("src/lib/routes.js");
const routeRe = /^\s{2}([A-Za-z0-9_]+):\s*\{\s*es:\s*"([^"]*)",\s*en:\s*"([^"]*)",\s*fr:\s*"([^"]*)"\s*\},?/gm;
const routes = [...routeSource.matchAll(routeRe)].map((m) => ({
  routeId: m[1],
  paths: { es: m[2], en: m[3], fr: m[4] },
}));

const blogSource = read("src/lib/blog.js");
const blogSlugs = [...blogSource.matchAll(/^\s{4}slug:\s*"([^"]+)",/gm)].map((m) => m[1]);

const replaceMeta = (html, { lang, url, image }) => {
  const canonical = `${SITE}${url}`;
  const absoluteImage = `${SITE}${image}`;
  return html
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${absoluteImage}" />`)
    .replace(/<meta property="og:image:secure_url" content="[^"]*"\s*\/>/, `<meta property="og:image:secure_url" content="${absoluteImage}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${absoluteImage}" />`);
};

const writeRoute = ({ lang, slug, image }) => {
  const url = lang === "es" ? `/${slug}` : `/${lang}/${slug}`;
  const normalizedUrl = url === "/" || url === "/en/" || url === "/fr/" ? url : url.replace(/\/$/, "");
  if (normalizedUrl === "/") return;
  const relative = normalizedUrl.replace(/^\//, "");
  const output = path.join(BUILD, relative, "index.html");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, replaceMeta(template, { lang, url: normalizedUrl, image }));
};

for (const route of routes) {
  for (const lang of ["es", "en", "fr"]) {
    const slug = route.paths[lang];
    if (route.routeId === "home") {
      if (lang === "es") continue; // build/index.html is already the ES Home.
      writeRoute({ lang, slug: "", image: `/og-image.jpg?v=${IMAGE_VERSION}` });
      continue;
    }
    writeRoute({ lang, slug, image: `/og/routes/${route.routeId}.jpg?v=${IMAGE_VERSION}` });
  }
}

for (const slug of blogSlugs) {
  for (const lang of ["es", "en", "fr"]) {
    const base = lang === "es" ? "blog" : "blog";
    writeRoute({ lang, slug: `${base}/${slug}`, image: `/og/blog/${slug}.jpg?v=${IMAGE_VERSION}` });
  }
}

console.log(`Generated static social HTML for ${routes.length} routes and ${blogSlugs.length} blog posts.`);
