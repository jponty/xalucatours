/*
 * Create physical HTML files for every public URL after the CRA build.
 * Render serves an existing static resource before applying the SPA rewrite,
 * so social crawlers can read route-specific Open Graph tags without JS.
 */
const fs = require("fs");
const path = require("path");
const { loadSiteData } = require("./generate-discovery.cjs");

const ROOT = path.resolve(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const IMAGE_VERSION = "20260811-2";

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const template = read("build/index.html");

async function main() {
  const { ROUTES, SUPPORTED_LANGS, pathFor, canonicalUrl, PUBLIC_SITE_ORIGIN: SITE, blogSlugs } = await loadSiteData();
  const written = new Set();

  const replaceMeta = (html, { lang, url, image }) => {
    const canonical = canonicalUrl(url);
    const absoluteImage = `${SITE}${image}`;
    return html
      .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${absoluteImage}" />`)
      .replace(/<meta property="og:image:secure_url" content="[^"]*"\s*\/>/, `<meta property="og:image:secure_url" content="${absoluteImage}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${absoluteImage}" />`);
  };

  const writeRoute = ({ lang, url, image }) => {
    const normalizedUrl = url === "/" ? url : url.replace(/\/$/, "");
    if (written.has(normalizedUrl)) return;
    written.add(normalizedUrl);
    const relative = normalizedUrl.replace(/^\//, "");
    const output = path.join(BUILD, relative, "index.html");
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, replaceMeta(template, { lang, url: normalizedUrl, image }));
  };

  for (const routeId of Object.keys(ROUTES)) {
    for (const lang of SUPPORTED_LANGS) {
      const url = pathFor(lang, routeId);
      if (routeId === "home") {
        writeRoute({ lang, url, image: `/og-image.jpg?v=${IMAGE_VERSION}` });
        continue;
      }
      const imageRoute = { practicalInfo: "whenToTravel", navigationMap: "archive" }[routeId] || routeId;
      writeRoute({ lang, url, image: `/og/routes/${imageRoute}.jpg?v=${IMAGE_VERSION}` });
    }
  }

  for (const slug of blogSlugs) {
    for (const lang of SUPPORTED_LANGS) {
      writeRoute({ lang, url: `${pathFor(lang, "blog")}/${slug}`, image: `/og/blog/${slug}.jpg?v=${IMAGE_VERSION}` });
    }
  }

  console.log(`Generated static social HTML for ${written.size} distinct URLs.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
