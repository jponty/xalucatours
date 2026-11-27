/*
 * Create physical HTML files for every public URL after the CRA build.
 * Publish both clean-URL .html files and directory indexes: the SPA rewrite
 * otherwise captures slashless paths before their directory index on Render.
 * Social crawlers must receive route-specific Open Graph tags without JS.
 */
const fs = require("fs");
const path = require("path");
const { loadSiteData } = require("./generate-discovery.cjs");

const ROOT = path.resolve(__dirname, "..");
const outputArg = process.argv.indexOf("--output");
const BUILD = outputArg < 0 ? path.join(ROOT, "build") : path.resolve(process.argv[outputArg + 1]);

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const template = fs.readFileSync(path.join(BUILD, "index.html"), "utf8");
const importData = (file) => import(`data:text/javascript;base64,${Buffer.from(read(file)).toString("base64")}`);
const escapeHtml = (value) => String(value).replace(/[<>&"']/g, (c) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;",
}[c]));

async function main() {
  const { ROUTES, SUPPORTED_LANGS, pathFor, canonicalUrl, PUBLIC_SITE_ORIGIN: SITE, blogPosts } = await loadSiteData();
  const { seoImageForRoute } = await importData("src/lib/seoImages.js");
  const { getSeoMeta } = await importData("src/lib/seoMeta.js");
  const written = new Set();

  const replaceMeta = (html, { lang, url, image, meta, alternates, noindex, article }) => {
    const canonical = canonicalUrl(url);
    const absoluteImage = `${SITE}${image}`;
    const result = html
      .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
      .replace(/<meta property="og:locale" content="[^"]*"\s*\/>/, `<meta property="og:locale" content="${{ es: "es_ES", en: "en_GB", fr: "fr_FR" }[lang]}" />`)
      .replace(/<meta property="og:type" content="[^"]*"\s*\/>/, `<meta property="og:type" content="${article ? "article" : "website"}" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${absoluteImage}" />`)
      .replace(/<meta property="og:image:secure_url" content="[^"]*"\s*\/>/, `<meta property="og:image:secure_url" content="${absoluteImage}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${absoluteImage}" />`);
    const withAlternates = result.replace("</head>", [
      ...Object.entries({ ...alternates, "x-default": alternates.es }).map(([code, path]) =>
        `<link rel="alternate" hreflang="${code}" href="${canonicalUrl(path)}" />`),
      ...(noindex ? ['<meta name="robots" content="noindex,follow" />'] : []),
      "</head>",
    ].join("\n"));
    const browseLabel = { es: "Explorar viajes", en: "Explore trips", fr: "Explorer les voyages" }[lang];
    const contactLabel = { es: "Contactar con el equipo", en: "Contact our team", fr: "Contacter notre équipe" }[lang];
    const browsePath = pathFor(lang, "toursLanding");
    const contactPath = pathFor(lang, "contact");
    // Useful HTML for crawlers and visitors without JavaScript. React replaces
    // this lightweight shell when the application starts.
    const semanticBody = `<main id="static-page-content" style="max-width:900px;margin:4rem auto;padding:2rem;font-family:system-ui,sans-serif;color:#2C2621"><h1>${escapeHtml(meta.title.replace(/ · Xaluca Tours$/, ""))}</h1><p>${escapeHtml(meta.description)}</p><nav aria-label="${escapeHtml(browseLabel)}"><a href="${escapeHtml(browsePath)}">${escapeHtml(browseLabel)}</a> · <a href="${escapeHtml(contactPath)}">${escapeHtml(contactLabel)}</a></nav></main>`;
    return withAlternates
      .replace('<div id="root"></div>', `<div id="root">${semanticBody}</div>`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);
  };

  const writeRoute = ({ lang, url, image, meta, alternates, noindex, article }) => {
    const normalizedUrl = url === "/" ? url : url.replace(/\/$/, "");
    if (written.has(normalizedUrl)) return;
    written.add(normalizedUrl);
    const relative = normalizedUrl.replace(/^\//, "");
    const output = path.join(BUILD, relative, "index.html");
    fs.mkdirSync(path.dirname(output), { recursive: true });
    const html = replaceMeta(template, { lang, url: normalizedUrl, image, meta, alternates, noindex, article });
    fs.writeFileSync(output, html);
    if (relative) fs.writeFileSync(path.join(BUILD, `${relative}.html`), html);
  };

  for (const routeId of Object.keys(ROUTES)) {
    if (routeId === "tourErrAtlasFez56") continue; // The route redirects to its hub.
    const alternates = Object.fromEntries(SUPPORTED_LANGS.map((code) => [code, pathFor(code, routeId)]));
    for (const lang of SUPPORTED_LANGS) {
      const url = pathFor(lang, routeId);
      writeRoute({ lang, url, image: seoImageForRoute(routeId),
        meta: getSeoMeta(routeId, lang, url), alternates, noindex: routeId === "favorites" });
    }
  }

  for (const post of blogPosts) {
    const alternates = Object.fromEntries(SUPPORTED_LANGS.map((code) => [code, `${pathFor(code, "blog")}/${post.slug}`]));
    for (const lang of SUPPORTED_LANGS) {
      writeRoute({ lang, url: alternates[lang], image: seoImageForRoute(),
        meta: { title: `${post.title[lang]} · Xaluca Tours`, description: post.excerpt[lang] }, alternates, article: true });
    }
  }

  console.log(`Generated static social HTML for ${written.size} distinct URLs.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
