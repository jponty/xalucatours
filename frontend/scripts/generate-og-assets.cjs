/* eslint-disable no-console */
/*
 * One-off/repeatable branded Open Graph asset generator.
 * Run from frontend with a Node runtime that provides `sharp`:
 *   NODE_PATH=/path/to/node_modules node scripts/generate-og-assets.cjs
 *
 * It deliberately reuses the same image sources as the React pages. The
 * official logo and monogram are then composited without generative changes.
 */
const fs = require("fs");
const path = require("path");

let sharp;
try {
  sharp = require("sharp");
} catch (error) {
  throw new Error(
    "The OG maintenance script requires sharp. Run it with a NODE_PATH that provides sharp or install sharp temporarily."
  );
}

const ROOT = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const routeSource = read("src/lib/routes.js");
const imageBankSource = read("src/lib/imageBank.js");
const catalogSource = read("src/lib/allTripsCatalog.js");
const blogSource = read("src/lib/blog.js");
const itineraryHubsSource = read("src/lib/itineraryHubs.js");

const routeRe = /^\s{2}([A-Za-z0-9_]+):\s*\{\s*es:\s*"([^"]*)",\s*en:\s*"([^"]*)",\s*fr:\s*"([^"]*)"\s*\},?/gm;
const routes = [...routeSource.matchAll(routeRe)].map((m) => ({ routeId: m[1], es: m[2] }));

const bank = {};
for (const m of imageBankSource.matchAll(/^\s{2}([A-Za-z0-9_]+):\s+U\("([^"]+)"\)/gm)) {
  bank[m[1]] = `https://images.unsplash.com/${m[2]}?auto=format&fit=crop&w=1600&q=88`;
}

const routeImages = {};
const routeImageBlock = catalogSource.match(/export const ROUTE_IMAGES = \{([\s\S]*?)\n\};/);
if (routeImageBlock) {
  for (const m of routeImageBlock[1].matchAll(/^\s{2}([A-Za-z0-9_]+):\s*"([^"]+)"/gm)) {
    routeImages[m[1]] = m[2];
  }
}

for (const m of catalogSource.matchAll(/mk\(\{\s*routeId:\s*"([^"]+)"[\s\S]*?image:\s*IMG\.([A-Za-z0-9_]+)[\s\S]*?\}\),/g)) {
  if (!routeImages[m[1]] && bank[m[2]]) routeImages[m[1]] = bank[m[2]];
}

// Several programme pages are driven by the itinerary hub registry rather
// than ALL_TRIPS. Its card image is also the real visual source used for that
// specific itinerary, so prefer it before any thematic fallback.
for (const m of itineraryHubsSource.matchAll(/image:\s*"([^"]+)"[\s\S]{0,220}?link:\s*"([^"]+)"/g)) {
  if (!routeImages[m[2]]) routeImages[m[2]] = m[1];
}

// This programme is not listed as an individual hub card; its ProgramTemplate
// falls back to the FOZ 7n/8d hero declared in programMeta (rocky desert).
if (!routeImages.tourFezSidialiOzz78) {
  routeImages.tourFezSidialiOzz78 = bank.dunesRocky;
}

const programmeRoutesWithoutOwnSource = routes.filter(
  (route) => route.es.includes("programa_") && !routeImages[route.routeId]
);
if (programmeRoutesWithoutOwnSource.length) {
  throw new Error(
    `Programme routes without a page image: ${programmeRoutesWithoutOwnSource
      .map((route) => route.routeId)
      .join(", ")}`
  );
}

const semanticKey = (routeId) => {
  const id = routeId.toLowerCase();
  if (/tanger|north|norte|rif|chef|ciudadesimperiales/.test(id)) return "chefBlueCity";
  if (/essaouira|vuelos/.test(id)) return "essaouiraPort";
  if (/enduro|adventure|aventura/.test(id)) return "dunesRocky";
  if (/atlas/.test(id)) return "atlasValley";
  if (/fez|blog|whatwe|about|equipo|opiniones|feedback/.test(id)) return "riadFountain";
  if (/marrakech|appointment|plan|contact|bespoke|fasttrack/.test(id)) return "koutoubia";
  if (/morocco|marruecos|catalog|archive|tourslanding|whatto|galeria/.test(id)) return "kasbahArch";
  if (/juego|concurso|events|incentivos/.test(id)) return "marketBaskets";
  if (/when|timeline|precios|upcoming|findeano/.test(id)) return "camelCaravan";
  return "dunes";
};

const postRows = [];
for (const m of blogSource.matchAll(/\{\s*\n\s*id:\s*"[^"]+",\s*\n\s*slug:\s*"([^"]+)"[\s\S]*?cover:\s*IMG\.([A-Za-z0-9_]+)/g)) {
  postRows.push({ slug: m[1], source: bank[m[2]] || bank.dunes });
}

const logoPath = path.join(ROOT, "src/assets/grup-xaluca-logo.webp");
// Use the same edge-integrated monogram asset as the journey cards. Unlike
// the square watermark, this artwork is designed to be cropped by the image
// boundary so the X reads as part of the composition rather than a floating
// icon.
const monogramPath = path.join(ROOT, "src/assets/monograma-x-crop.png");
const homeSource = path.join(ROOT, "scripts/assets/home-erg-chebbi.png");
const outRoutes = path.join(ROOT, "public/og/routes");
const outBlog = path.join(ROOT, "public/og/blog");
fs.mkdirSync(outRoutes, { recursive: true });
fs.mkdirSync(outBlog, { recursive: true });

const cache = new Map();
const fetchImage = async (source) => {
  if (!/^https?:/.test(source)) return fs.readFileSync(source);
  if (cache.has(source)) return cache.get(source);
  const promise = (async () => {
    const response = await fetch(source, { headers: { "User-Agent": "XalucaTours-OG-Builder/1.0" } });
    if (!response.ok) throw new Error(`${response.status} ${source}`);
    return Buffer.from(await response.arrayBuffer());
  })();
  cache.set(source, promise);
  return promise;
};

const overlaySvg = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1a1513" stop-opacity="0.12"/>
        <stop offset="0.52" stop-color="#1a1513" stop-opacity="0.03"/>
        <stop offset="1" stop-color="#1a1513" stop-opacity="0.34"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#shade)"/>
  </svg>`);

const brandAsset = async (source, output) => {
  let input;
  try {
    input = await fetchImage(source);
  } catch (error) {
    console.warn(`Falling back to dunes for ${output}: ${error.message}`);
    input = await fetchImage(bank.dunes);
  }

  const logo = await sharp(logoPath).resize(238, 238, { fit: "contain" }).png().toBuffer();
  const oversizedMonogram = await sharp(monogramPath).resize({ height: 760, fit: "contain" }).png().toBuffer();
  const oversizedMeta = await sharp(oversizedMonogram).metadata();
  // Crop the oversized artwork before compositing: this recreates the cards'
  // overflow-hidden edge treatment while keeping Sharp's overlay within the
  // 1200x630 social canvas.
  const monogram = await sharp(oversizedMonogram)
    .extract({ left: 0, top: 65, width: oversizedMeta.width, height: 630 })
    .png()
    .toBuffer();
  const monogramMeta = await sharp(monogram).metadata();
  const monogramSvg = Buffer.from(`<svg width="${monogramMeta.width}" height="${monogramMeta.height}" xmlns="http://www.w3.org/2000/svg"><image width="${monogramMeta.width}" height="${monogramMeta.height}" opacity="0.34" href="data:image/png;base64,${monogram.toString("base64")}"/></svg>`);

  await sharp(input)
    .rotate()
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.82, saturation: 0.94 })
    .composite([
      { input: overlaySvg, left: 0, top: 0 },
      {
        input: monogramSvg,
        left: 1200 - monogramMeta.width,
        top: 0,
      },
      { input: logo, left: 481, top: 196 },
    ])
    .jpeg({ quality: 87, progressive: true, chromaSubsampling: "4:4:4" })
    .toFile(output);
};

(async () => {
  await brandAsset(homeSource, path.join(ROOT, "public/og-image.jpg"));

  for (const [index, route] of routes.entries()) {
    if (route.routeId === "home") continue;
    const source = routeImages[route.routeId] || bank[semanticKey(route.routeId)] || bank.dunes;
    await brandAsset(source, path.join(outRoutes, `${route.routeId}.jpg`));
    process.stdout.write(`\rRoutes ${index + 1}/${routes.length}`);
  }
  process.stdout.write("\n");

  for (const [index, post] of postRows.entries()) {
    await brandAsset(post.source, path.join(outBlog, `${post.slug}.jpg`));
    process.stdout.write(`\rBlog ${index + 1}/${postRows.length}`);
  }
  process.stdout.write("\n");

  const expectedRoutes = routes.filter((r) => r.routeId !== "home");
  const missing = expectedRoutes.filter((r) => !fs.existsSync(path.join(outRoutes, `${r.routeId}.jpg`)));
  if (missing.length) throw new Error(`Missing OG assets: ${missing.map((r) => r.routeId).join(", ")}`);
  console.log(`Generated ${expectedRoutes.length + 1} route images and ${postRows.length} blog images.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
