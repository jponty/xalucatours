/* Generate public crawler/discovery assets from the application's route registry.
 * No credentials, network calls, or secondary route inventory are needed.
 */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { parse } = require("@babel/parser");

const ROOT = path.resolve(__dirname, "..");
const API = "https://xaluca-tours-api.onrender.com";
const SKILL_PATH = ".well-known/agent-skills/explore-xaluca-trips/SKILL.md";
const NON_INDEXED = new Set(["favorites"]);
const escapeXml = (value) => String(value).replace(/[<>&"']/g, (char) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
}[char]));

// routes.js and siteConfig.js are dependency-free ESM, so Node can load their
// actual exports. Blog slugs are read from the POSTS declaration's AST (not a
// regex that depends on indentation or accidentally captures unrelated fields).
const importData = (file) => import(`data:text/javascript;base64,${Buffer.from(fs.readFileSync(path.join(ROOT, file), "utf8")).toString("base64")}`);
async function loadSiteData() {
  const registry = await importData("src/lib/routes.js");
  const config = await importData("src/lib/siteConfig.js");
  const ast = parse(fs.readFileSync(path.join(ROOT, "src/lib/blog.js"), "utf8"), { sourceType: "module" });
  const posts = ast.program.body.flatMap((node) => node.declaration?.declarations || []).find((node) => node.id.name === "POSTS");
  if (posts?.init?.type !== "ArrayExpression") throw new Error("POSTS must be an explicit array; update the discovery generator for the new data source.");
  const blogSlugs = posts.init.elements.map((post) => {
    const slug = post.properties.find((property) => (property.key.name || property.key.value) === "slug");
    if (slug?.value?.type !== "StringLiteral") throw new Error("Blog slug must be a string literal.");
    return slug.value.value;
  });
  return { ...registry, ...config, blogSlugs };
}

function buildPages({ ROUTES, SUPPORTED_LANGS, pathFor, blogSlugs }) {
  const pages = new Map();
  for (const routeId of Object.keys(ROUTES)) {
    if (NON_INDEXED.has(routeId)) continue;
    const alternates = Object.fromEntries(SUPPORTED_LANGS.map((lang) => [lang, pathFor(lang, routeId)]));
    for (const lang of SUPPORTED_LANGS) {
      const url = alternates[lang];
      if (!pages.has(url)) pages.set(url, { path: url, lang, routeId, alternates });
    }
  }
  for (const slug of blogSlugs) {
    const alternates = Object.fromEntries(SUPPORTED_LANGS.map((lang) => [lang, `${pathFor(lang, "blog")}/${slug}`]));
    for (const lang of SUPPORTED_LANGS) pages.set(alternates[lang], { path: alternates[lang], lang, slug, alternates });
  }
  return [...pages.values()];
}

function buildRobots(site, blockedPaths) {
  // AI-specific usage permissions await the owner's policy decision. Do not
  // infer training consent or change it just to satisfy a third-party scanner.
  return [
    "# Xaluca Tours - public pages are crawlable; private/technical areas are not.",
    "# robots.txt is not access control. Protected endpoints still require authentication.",
    "User-agent: *", "Allow: /", ...blockedPaths.map((item) => `Disallow: ${item}`),
    "", `Sitemap: ${site}/sitemap.xml`, "",
  ].join("\n");
}

async function generate(output = path.join(ROOT, "public")) {
  const data = await loadSiteData();
  const site = data.PUBLIC_SITE_ORIGIN;
  const absolute = (pathname) => data.canonicalUrl(pathname);
  const pages = buildPages(data);
  const write = (file, contents) => {
    const target = path.join(output, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  };
  const json = (file, value) => write(file, `${JSON.stringify(value, null, 2)}\n`);
  const blocks = ["/admin", "/api/", ...data.SUPPORTED_LANGS.map((lang) => data.pathFor(lang, "favorites"))];
  write("robots.txt", buildRobots(site, blocks));
  write("sitemap.xml", [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...pages.map((page) => [
      "  <url>", `    <loc>${escapeXml(absolute(page.path))}</loc>`,
      ...Object.entries({ ...page.alternates, "x-default": page.alternates.es }).map(([lang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(absolute(href))}" />`),
      "  </url>",
    ].join("\n")),
    "</urlset>", "",
  ].join("\n"));
  json(".well-known/api-catalog", { linkset: [{
    anchor: `${API}/api/`,
    "service-desc": [{ href: `${API}/openapi.json`, type: "application/json" }],
    "service-doc": [{ href: `${API}/docs`, type: "text/html" }],
    status: [{ href: `${API}/api/`, type: "application/json" }],
  }] });
  const skill = fs.readFileSync(path.join(ROOT, "public", SKILL_PATH));
  json(".well-known/agent-skills/index.json", {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [{ name: "explore-xaluca-trips", type: "skill-md",
      description: "Find public Xaluca Tours itineraries and practical travel information. Read-only; no bookings or private data.",
      url: absolute(`/${SKILL_PATH}`), digest: `sha256:${crypto.createHash("sha256").update(skill).digest("hex")}` }],
  });
  // Only advertise resources we actually serve; no fictitious MCP/A2A server.
  json(".well-known/ai-catalog.json", {
    specVersion: "1.0",
    host: { displayName: "Xaluca Tours", identifier: site },
    entries: [
      { identifier: `urn:air:${new URL(site).hostname}:catalog:pages`, displayName: "Public pages and travel itineraries",
        type: "application/xml", url: absolute("/sitemap.xml"),
        representativeQueries: ["Find Xaluca Tours trips in Morocco", "Find practical information for a Morocco itinerary"] },
      { identifier: `urn:air:${new URL(site).hostname}:skill:explore-trips`, displayName: "Explore Xaluca Tours trips",
        type: "text/markdown", url: absolute(`/${SKILL_PATH}`),
        representativeQueries: ["Compare desert and Atlas itineraries", "Find short trips to Morocco"] },
    ],
  });
  console.log(`Generated discovery resources: ${pages.length} canonical URLs, API catalog, skill index and AI catalog.`);
  return { pages, site };
}

if (require.main === module) {
  const index = process.argv.indexOf("--output");
  generate(index < 0 ? undefined : path.resolve(process.argv[index + 1])).catch((error) => { console.error(error); process.exitCode = 1; });
}
module.exports = { loadSiteData, buildPages, buildRobots, generate };
