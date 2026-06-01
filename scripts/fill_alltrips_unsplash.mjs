/**
 * fill_alltrips_unsplash.mjs
 * ------------------------------------------------------------------
 * Sets a REAL, itinerary-relevant Unsplash photo for every card in the
 * Home "40 viajes disponibles" section (slots `home.all-trips.<routeId>`).
 *
 * Rate-limit aware: the configured Unsplash key is a DEMO key (50 req/h),
 * so we run ONE search per *theme* (cached, ~17 calls), then download the
 * chosen photos straight from the Unsplash CDN (no API quota) and push the
 * bytes into each slot through the existing self-hosting upload endpoint
 * `POST /api/slots/{slot}/upload`. Each card gets a UNIQUE photo.
 *
 * Usage:  node scripts/fill_alltrips_unsplash.mjs
 * Requires UNSPLASH_ACCESS_KEY in backend/.env.
 * ------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function readEnv(key) {
  const env = fs.readFileSync(path.join(ROOT, "backend", ".env"), "utf8");
  const line = env.split("\n").find((l) => l.startsWith(`${key}=`));
  if (!line) throw new Error(`${key} not found in backend/.env`);
  return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
}

const UNSPLASH_KEY = readEnv("UNSPLASH_ACCESS_KEY");
const BACKEND = "http://localhost:8001";
const UNSPLASH = "https://api.unsplash.com";

/* ---- Theme queries (kept small so cached searches stay within quota) ---- */
const Q = {
  dunes:     "Erg Chebbi Sahara dunes Morocco",
  kasbah:    "Ait Benhaddou kasbah Morocco",
  atlas:     "Atlas mountains Morocco landscape",
  camel:     "Sahara desert camel caravan Morocco",
  marrakech: "Marrakech medina Morocco",
  koutoubia: "Marrakech Koutoubia mosque Morocco",
  essaouira: "Essaouira Morocco port",
  fez:       "Fez medina Morocco",
  tannery:   "Fez tannery Morocco",
  chef:      "Chefchaouen blue city Morocco",
  imperial:  "Meknes Bab Mansour Morocco",
  volubilis: "Volubilis Roman ruins Morocco",
  tangier:   "Tangier Morocco city",
  gorge:     "Todra gorge Dades valley Morocco",
  agafay:    "Agafay desert Marrakech Morocco",
  enduro:    "motorcycle desert dunes adventure Morocco",
  nye:       "Sahara desert night stars camp Morocco",
};

/* ---- routeId → theme (each card mapped to its most relevant theme) ---- */
const ROUTE_THEME = {
  // Atlas ↔ Desierto
  tourAtlasDesierto45: "dunes",
  tourAtlasDesierto56: "kasbah",
  tourAtlasDesierto67: "atlas",
  tourDesiertoAtlas45: "camel",
  tourDesiertoAtlas67: "gorge",
  // Marrakech → Erg Chebbi
  tourMarrakechErg45: "koutoubia",
  tourMarrakechErg56: "dunes",
  tourMarrakechErg67: "atlas",
  // Loop Marrakech
  tourMarrakechLoop34: "marrakech",
  tourMarrakechLoop45: "dunes",
  tourMarrakechLoop56: "kasbah",
  tourMarrakechLoop67: "camel",
  // Marrakech & Essaouira
  tourMarrakechEss45: "essaouira",
  tourMarrakechEss67: "essaouira",
  // Fez ↔ Marrakech
  tourFezRak67: "fez",
  tourFezRak78: "tannery",
  tourMarrakechFez67: "marrakech",
  tourMarrakechFez89: "volubilis",
  tourMarrakechFez910: "atlas",
  // Tánger ↔ Marrakech
  tourTangerRak89: "chef",
  tourTangerRak910: "chef",
  // Ciudades Imperiales
  tourCiudadesImperiales45: "fez",
  tourCiudadesImperiales67: "imperial",
  tourCiudadesImperialesRif67: "chef",
  tourCiudadesImperialesRif78: "chef",
  // Tánger ↔ Fez
  tourTangerFez45: "tangier",
  tourTangerFez56: "chef",
  tourFezTanger56: "fez",
  tourFezTanger67: "tangier",
  // Escapadas
  tourEscapadaMarrakech23: "marrakech",
  tourEscapadaRakAgafay34: "agafay",
  tourEscapadaRakErgRak23: "dunes",
  tourEscapadaRakErgRak34: "camel",
  tourEscapadaFez23: "fez",
  tourEscapadaFez34: "tannery",
  tourEscapadaAtlas34: "atlas",
  tourEscapadaDesierto34: "dunes",
  // Aventura · Enduro
  tourEnduroAventura45: "enduro",
  tourEnduroAventura67: "enduro",
  // Eventos
  tourFinDeAno2025: "nye",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const searchCache = new Map(); // theme -> { photos:[], ptr:0 }

async function loadTheme(theme) {
  if (searchCache.has(theme)) return searchCache.get(theme);
  const query = Q[theme];
  const url = `${UNSPLASH}/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape&content_filter=high&client_id=${UNSPLASH_KEY}`;
  const res = await fetch(url);
  if (res.status === 403) {
    throw new Error("Unsplash rate limit hit (403). Try again later.");
  }
  if (!res.ok) throw new Error(`Unsplash search failed (${res.status}) for "${query}"`);
  const json = await res.json();
  const photos = (json.results || []).filter((p) => p.urls && (p.urls.raw || p.urls.full));
  const entry = { photos, ptr: 0 };
  searchCache.set(theme, entry);
  console.log(`  · theme "${theme}" → ${photos.length} landscape photos`);
  await sleep(250);
  return entry;
}

function sizedUrl(photo) {
  const raw = photo.urls.raw || photo.urls.full;
  const sep = raw.includes("?") ? "&" : "?";
  // 4:3 smart crop to match the card aspect ratio.
  return `${raw}${sep}w=1400&h=1050&fit=crop&crop=entropy&q=80&fm=jpg&auto=compress`;
}

async function setSlot(routeId, photo) {
  const slot = `home.all-trips.${routeId}`;
  const imgUrl = sizedUrl(photo);
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) throw new Error(`CDN download failed (${imgRes.status})`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const blob = new Blob([buf], { type: "image/jpeg" });
  const form = new FormData();
  const credit = (photo.user && photo.user.name) || "Unsplash";
  form.append("file", blob, `unsplash_${photo.id}.jpg`);
  const up = await fetch(`${BACKEND}/api/slots/${encodeURIComponent(slot)}/upload`, {
    method: "POST",
    body: form,
  });
  if (!up.ok) {
    const t = await up.text();
    throw new Error(`slot upload failed (${up.status}): ${t.slice(0, 160)}`);
  }
  return { credit, kb: Math.round(buf.length / 1024) };
}

async function main() {
  const routes = Object.keys(ROUTE_THEME);
  console.log(`Filling ${routes.length} all-trips cards from Unsplash…\n`);
  const usedIds = new Set();
  let ok = 0;
  const failures = [];

  for (const routeId of routes) {
    const theme = ROUTE_THEME[routeId];
    try {
      const entry = await loadTheme(theme);
      // pick next unused landscape photo for this theme
      let photo = null;
      for (let i = 0; i < entry.photos.length; i++) {
        const cand = entry.photos[(entry.ptr + i) % entry.photos.length];
        if (!usedIds.has(cand.id)) {
          photo = cand;
          entry.ptr = (entry.ptr + i + 1) % entry.photos.length;
          break;
        }
      }
      if (!photo) photo = entry.photos[entry.ptr++ % entry.photos.length]; // exhausted → allow reuse
      if (!photo) throw new Error(`no photos for theme "${theme}"`);
      usedIds.add(photo.id);

      const { credit, kb } = await setSlot(routeId, photo);
      ok++;
      console.log(`✓ ${routeId.padEnd(30)} [${theme}] ${kb}KB · © ${credit}`);
      await sleep(200);
    } catch (err) {
      failures.push({ routeId, error: err.message });
      console.log(`✗ ${routeId.padEnd(30)} ${err.message}`);
      if (String(err.message).includes("rate limit")) break;
    }
  }

  console.log(`\nDone. ${ok}/${routes.length} cards updated.`);
  if (failures.length) {
    console.log("Failures:");
    failures.forEach((f) => console.log(`  - ${f.routeId}: ${f.error}`));
    process.exitCode = 1;
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
