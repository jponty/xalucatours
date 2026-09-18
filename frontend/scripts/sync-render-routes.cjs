/* Keep Render's HTML rewrites aligned with the public route registry.
 * Run with --write after adding/removing routes; --check is part of prebuild.
 * Only the marked static-site block is changed. No API settings or secrets.
 */
const fs = require("node:fs");
const path = require("node:path");
const { loadSiteData } = require("./generate-discovery.cjs");
const START = "      # BEGIN generated public HTML rewrites";
const END = "      # END generated public HTML rewrites";
const BLUEPRINT = path.resolve(__dirname, "../../render.yaml");

async function publicPaths() {
  const { ROUTES, SUPPORTED_LANGS, pathFor, blogSlugs } = await loadSiteData();
  const paths = new Set(Object.keys(ROUTES).flatMap((id) => SUPPORTED_LANGS.map((lang) => pathFor(lang, id))));
  for (const slug of blogSlugs) for (const lang of SUPPORTED_LANGS) paths.add(`${pathFor(lang, "blog")}/${slug}`);
  return [...new Set([...paths].map((url) => url.replace(/\/$/, "")))].filter(Boolean).sort();
}

async function publicRewrites() {
  const { pathFor } = await loadSiteData();
  const paths = await publicPaths();
  // Limit patterns to public travel/blog namespaces. No catch-all HTML rewrite:
  // admin, API, assets and all other paths keep the existing SPA fallback.
  const prefixes = ["es", "en", "fr"].flatMap((lang) => [pathFor(lang, "toursLanding"), pathFor(lang, "blog")]);
  const rules = prefixes.map((prefix) => ({ type: "rewrite", source: `${prefix}/*`, destination: `${prefix}/*/index.html` }));
  for (const lang of ["en", "fr"]) rules.push({ type: "rewrite", source: `/${lang}/:page`, destination: `/${lang}/:page/index.html` });
  for (const url of paths) {
    if (prefixes.some((prefix) => url.startsWith(`${prefix}/`)) || /^\/(en|fr)\/[^/]+$/.test(url)) continue;
    rules.push({ type: "rewrite", source: url, destination: `${url}/index.html` });
  }
  return rules;
}

async function sync(write = false, file = BLUEPRINT) {
  const rules = await publicRewrites();
  const block = [START, ...rules.flatMap(({ type, source, destination }) => [
    `      - type: ${type}`, `        source: ${source}`, `        destination: ${destination}`,
  ]), END].join("\n");
  const before = fs.readFileSync(file, "utf8");
  const start = before.indexOf(START), end = before.indexOf(END);
  if (start < 0 || end < start) throw new Error("Missing generated route markers in render.yaml");
  const after = before.slice(0, start) + block + before.slice(end + END.length);
  if (before !== after) {
    if (!write) throw new Error("Render routes are out of date. Run npm run sync:render-routes and commit render.yaml.");
    fs.writeFileSync(file, after);
  }
  console.log(`Render HTML rewrites ${write ? "synchronized" : "verified"}: ${rules.length} rules covering ${(await publicPaths()).length} paths.`);
}

if (require.main === module) sync(process.argv.includes("--write")).catch((error) => {
  console.error(error.message); process.exitCode = 1;
});
module.exports = { publicPaths, publicRewrites, sync };
