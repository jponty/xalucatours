/**
 * fill_day_galleries_pexels.mjs
 * ------------------------------------------------------------------
 * Auto-fills each itinerary day's 10-image "Galería del día" with REAL,
 * stage-specific photos from Pexels and coherent overlaid captions.
 *
 * How it stays "specific to each stage":
 *   • Captions are REUSED from the day's own trilingual content:
 *       1) landmark names (lib/dayLandmarks.js) — most specific
 *       2) culture[].title (lib/programData.js)
 *       3) the day title
 *       4) themed templates built from the day's main place (to reach 10)
 *   • Pexels search queries are derived from the place names + theme of
 *     each caption, so every image matches the stage it illustrates.
 *
 * Output: frontend/src/lib/dayGalleriesGenerated.js
 *
 * Usage:  node scripts/fill_day_galleries_pexels.mjs
 * Requires PEXELS_API_KEY in backend/.env.
 * ------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LIB = path.join(ROOT, "frontend", "src", "lib");
const TMP = path.join(__dirname, ".gen");
const OUT = path.join(LIB, "dayGalleriesGenerated.js");

/* ---------- env ---------- */
function readEnv(key) {
  const env = fs.readFileSync(path.join(ROOT, "backend", ".env"), "utf8");
  const line = env.split("\n").find((l) => l.startsWith(`${key}=`));
  if (!line) throw new Error(`${key} not found in backend/.env`);
  return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
}
const PEXELS_KEY = readEnv("PEXELS_API_KEY");

/* ---------- load JS data modules (copy to .mjs so Node parses ESM) ---------- */
async function loadModule(srcFile) {
  fs.mkdirSync(TMP, { recursive: true });
  const dst = path.join(TMP, path.basename(srcFile).replace(/\.js$/, ".mjs"));
  fs.copyFileSync(path.join(LIB, srcFile), dst);
  return import(pathToFileURL(dst).href);
}

/* deep-walk exported values to collect every "day object" by route_id */
function collectDays(mod) {
  const days = {};
  const seen = new Set();
  const walk = (v) => {
    if (!v || typeof v !== "object" || seen.has(v)) return;
    seen.add(v);
    if (typeof v.route_id === "string" && v.title && typeof v.title === "object") {
      days[v.route_id] = v;
    }
    if (Array.isArray(v)) v.forEach(walk);
    else Object.values(v).forEach(walk);
  };
  Object.values(mod).forEach(walk);
  return days;
}

/* ---------- place + theme dictionaries ---------- */
// ordered: longer / more specific first
const PLACES = [
  [/a[iï]t ?ben ?haddou/i, { q: "Ait Ben Haddou kasbah", name: "Aït Ben Haddou" }],
  [/erg ?chebbi/i, { q: "Erg Chebbi dunes", name: "Erg Chebbi" }],
  [/merzouga/i, { q: "Merzouga desert", name: "Merzouga" }],
  [/todra|todgha/i, { q: "Todra Gorge Morocco", name: "Todra" }],
  [/dad[eèé]s/i, { q: "Dades Gorge Morocco", name: "Dadès" }],
  [/ouarzazate/i, { q: "Ouarzazate kasbah", name: "Ouarzazate" }],
  [/skoura/i, { q: "Skoura palmeraie Morocco", name: "Skoura" }],
  [/m[' ]?goun|mgoun/i, { q: "Mgoun valley Morocco", name: "M'Goun" }],
  [/boumalne/i, { q: "Boumalne Dades Morocco", name: "Boumalne" }],
  [/errachidia/i, { q: "Errachidia Morocco", name: "Errachidia" }],
  [/erfoud/i, { q: "Erfoud Morocco desert", name: "Erfoud" }],
  [/rissani/i, { q: "Rissani Morocco ksar", name: "Rissani" }],
  [/khamlia/i, { q: "Gnawa musicians Morocco", name: "Khamlia" }],
  [/marrakech|marrakesh/i, { q: "Marrakech medina Morocco", name: "Marrakech" }],
  [/essaouira/i, { q: "Essaouira Morocco coast", name: "Essaouira" }],
  [/f[eèé]z|f[eè]s/i, { q: "Fez medina Morocco", name: "Fez" }],
  [/sidi ?ali/i, { q: "Sidi Ali lake Morocco", name: "Sidi Ali" }],
  [/ziz/i, { q: "Ziz valley Morocco oasis", name: "Valle del Ziz" }],
  [/atlas/i, { q: "Atlas mountains Morocco", name: "Atlas" }],
  [/casablanca/i, { q: "Casablanca Morocco", name: "Casablanca" }],
  [/rosas|roses/i, { q: "rose valley Morocco", name: "Valle de las Rosas" }],
];
const DEFAULT_PLACE = { q: "Morocco Sahara landscape", name: "Marruecos" };

function detectPlace(text = "") {
  for (const [re, info] of PLACES) if (re.test(text)) return info;
  return DEFAULT_PLACE;
}

// landmark.kind -> gallery kind (for the coloured label) + query theme word
const KIND_MAP = {
  kasbah:    { gallery: "cultura",     theme: "kasbah" },
  gorges:    { gallery: "paisaje",     theme: "gorge canyon" },
  palm:      { gallery: "paisaje",     theme: "palm grove oasis" },
  viewpoint: { gallery: "paisaje",     theme: "viewpoint landscape" },
  market:    { gallery: "cultura",     theme: "market souk spices" },
  dunes:     { gallery: "paisaje",     theme: "sand dunes" },
  music:     { gallery: "cultura",     theme: "gnawa musicians" },
  hotel:     { gallery: "hotel",       theme: "riad hotel pool" },
  fossils:   { gallery: "cultura",     theme: "fossils ammonite" },
  airport:   { gallery: "ruta",        theme: "airplane window" },
  village:   { gallery: "cultura",     theme: "berber village" },
  mountain:  { gallery: "paisaje",     theme: "mountains" },
};

// themed fill templates (used to reach 10) — placeholders filled with place name
const FILL = [
  { gallery: "paisaje",     theme: "landscape",          es: (p) => `Paisajes de ${p}`,        en: (p) => `Landscapes of ${p}`,        fr: (p) => `Paysages de ${p}` },
  { gallery: "cultura",     theme: "culture people",     es: (p) => `Cultura y vida en ${p}`,  en: (p) => `Culture and life in ${p}`,  fr: (p) => `Culture et vie à ${p}` },
  { gallery: "gastronomia", theme: "moroccan food tagine", es: (p) => `Sabores de ${p}`,        en: (p) => `Flavours of ${p}`,          fr: (p) => `Saveurs de ${p}` },
  { gallery: "actividad",   theme: "travel experience",  es: (p) => `Experiencias en ${p}`,    en: (p) => `Experiences in ${p}`,       fr: (p) => `Expériences à ${p}` },
  { gallery: "ruta",        theme: "road trip",          es: (p) => `En ruta por ${p}`,        en: (p) => `On the road through ${p}`,  fr: (p) => `Sur la route de ${p}` },
  { gallery: "hotel",       theme: "riad hotel",         es: (p) => `Alojamiento en ${p}`,     en: (p) => `Stay in ${p}`,              fr: (p) => `Hébergement à ${p}` },
];

/* verified Unsplash fallbacks if Pexels has nothing */
const FALLBACK_SRCS = [
  "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85",
];

/* ---------- Pexels (cached per query) ---------- */
const pexelsCache = new Map(); // query -> [photos]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pexelsPool(query) {
  if (pexelsCache.has(query)) return pexelsCache.get(query);
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`;
  let photos = [];
  try {
    const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
    if (res.ok) {
      const data = await res.json();
      photos = (data.photos || []).map((p) => ({ id: p.id, src: p.src.large2x || p.src.large }));
    } else {
      console.warn(`  Pexels ${res.status} for "${query}"`);
    }
  } catch (e) {
    console.warn(`  Pexels error for "${query}": ${e.message}`);
  }
  pexelsCache.set(query, photos);
  await sleep(120); // be gentle with rate limits
  return photos;
}

async function pickPhoto(query, usedIds, fallbackIdx) {
  const pool = await pexelsPool(query);
  for (const ph of pool) {
    if (!usedIds.has(ph.id)) { usedIds.add(ph.id); return ph.src; }
  }
  // fallback to a verified Unsplash image
  return FALLBACK_SRCS[fallbackIdx % FALLBACK_SRCS.length];
}

/* ---------- build the 10 cells for one day ---------- */
function buildCellSpecs(day, landmarks) {
  const specs = [];
  const titleText = day.title?.es || "";
  const mainPlace = detectPlace(titleText);

  // 1) landmarks (most specific)
  for (const lm of landmarks || []) {
    const km = KIND_MAP[lm.kind] || { gallery: "cultura", theme: "" };
    const place = detectPlace(`${lm.name?.es || ""} ${titleText}`);
    specs.push({
      caption: lm.name,
      kind: km.gallery,
      query: `${place.q} ${km.theme}`.trim(),
    });
  }

  // 2) culture titles
  for (const c of day.culture || []) {
    const place = detectPlace(`${c.title?.es || ""} ${titleText}`);
    specs.push({ caption: c.title, kind: "cultura", query: `${place.q} culture`.trim() });
  }

  // 3) day title
  specs.push({ caption: day.title, kind: "paisaje", query: `${mainPlace.q} landscape`.trim() });

  // 4) themed fills until we reach 10
  let fi = 0;
  while (specs.length < 10) {
    const f = FILL[fi % FILL.length];
    specs.push({
      caption: { es: f.es(mainPlace.name), en: f.en(mainPlace.name), fr: f.fr(mainPlace.name) },
      kind: f.gallery,
      query: `${mainPlace.q} ${f.theme}`.trim(),
    });
    fi += 1;
  }

  return specs.slice(0, 10);
}

/* ---------- serialise ---------- */
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
function serialiseCell(c) {
  return (
    `    { src: "${c.src}", kind: "${c.kind}", ` +
    `caption: { es: "${esc(c.caption.es)}", en: "${esc(c.caption.en)}", fr: "${esc(c.caption.fr)}" } },`
  );
}

/* ---------- main ---------- */
async function main() {
  console.log("Loading data modules…");
  const [pd, lm] = await Promise.all([loadModule("programData.js"), loadModule("dayLandmarks.js")]);
  const days = collectDays(pd);
  const landmarks = lm.DAY_LANDMARKS || {};
  const routeIds = Object.keys(days).sort();
  console.log(`Found ${routeIds.length} itinerary days.`);

  const out = {};
  for (const rid of routeIds) {
    const specs = buildCellSpecs(days[rid], landmarks[rid]);
    const usedIds = new Set();
    const cells = [];
    for (let i = 0; i < specs.length; i++) {
      const src = await pickPhoto(specs[i].query, usedIds, i);
      cells.push({ src, kind: specs[i].kind, caption: specs[i].caption });
    }
    out[rid] = cells;
    console.log(`  ✓ ${rid} (${cells.length} imgs)`);
  }

  const body = Object.entries(out)
    .map(([rid, cells]) => `  "${rid}": [\n${cells.map(serialiseCell).join("\n")}\n  ],`)
    .join("\n");

  const file =
    `// AUTO-GENERATED by scripts/fill_day_galleries_pexels.mjs — do not edit by hand.\n` +
    `// Stage-specific Pexels imagery + trilingual overlay captions per itinerary day.\n` +
    `// Re-run the script to refresh. Captions are derived from each day's own content.\n\n` +
    `export const DAY_GALLERIES_GENERATED = {\n${body}\n};\n`;

  fs.writeFileSync(OUT, file, "utf8");
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`\nWrote ${OUT}`);
  console.log(`Pexels queries cached: ${pexelsCache.size}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
