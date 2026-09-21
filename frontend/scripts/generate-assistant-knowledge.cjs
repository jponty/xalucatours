/* Build the assistant's extractive corpus from the same committed programme
 * modules used by ProgramTemplate. No crawling, remote data, model or training.
 * Run from any directory; --check reports a stale committed corpus without writes.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { transformSync } = require("@babel/core");
const { parse } = require("@babel/parser");

const FRONTEND = path.resolve(__dirname, "..");
const LIB = path.join(FRONTEND, "src/lib");
const OUTPUT = path.resolve(FRONTEND, "../backend/assistant_knowledge.json");
const MAX_TEXT_LENGTH = 1799;
const RETIRED_ROUTES = new Set(["tourEnduroAventura67"]);
const LANGS = ["es", "en", "fr"];
const MODULES = new Set([
  "routes.js", "tripPrograms.js", "programData.js", "programMeta.js",
  "allTripsCatalog.js", "imageBank.js", "tripPackingNotes.js",
]);

// Execute only the project's committed data modules (including their small
// programme factories). No browser globals, built-ins, arbitrary dependencies,
// network requests or externally scraped JavaScript are available to imports.
function dataLoader() {
  const cache = new Map();
  function load(file) {
    const absolute = fs.realpathSync(file);
    const relative = path.relative(LIB, absolute).split(path.sep).join("/");
    if (!MODULES.has(relative) && !/^programs\/[\w-]+\.js$/.test(relative)) {
      throw new Error(`Assistant data import is outside the allowed modules: ${relative}`);
    }
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const module = { exports: {} };
    cache.set(absolute, module);
    const compiled = transformSync(fs.readFileSync(absolute, "utf8"), {
      filename: absolute, configFile: false, babelrc: false,
      plugins: [require.resolve("@babel/plugin-transform-modules-commonjs")],
    }).code;
    const localRequire = (specifier) => {
      let resolved;
      if (specifier.startsWith("@/lib/")) resolved = path.join(LIB, specifier.slice(6));
      else if (specifier.startsWith("./") || specifier.startsWith("../")) resolved = path.resolve(path.dirname(absolute), specifier);
      else throw new Error(`Assistant data cannot import dependency: ${specifier}`);
      return load(resolved.endsWith(".js") ? resolved : `${resolved}.js`);
    };
    vm.runInNewContext(compiled, { module, exports: module.exports, require: localRequire }, {
      filename: absolute, timeout: 5000,
    });
    return module.exports;
  }
  return (file) => load(path.join(LIB, file));
}

// Read literal labels/contact facts without loading React, departure dates,
// prices, CMS clients or any of the surrounding component/module machinery.
function literalExport(file, name) {
  const ast = parse(fs.readFileSync(file, "utf8"), { sourceType: "module", plugins: ["jsx"] });
  const declarations = ast.program.body.flatMap((node) => (node.declaration || node).declarations || []);
  const root = declarations.find((node) => node.id.name === name)?.init;
  function value(node) {
    if (node?.type === "StringLiteral") return node.value;
    if (node?.type === "ObjectExpression") return Object.fromEntries(node.properties.map((property) => {
      if (property.type !== "ObjectProperty" || property.computed) throw new Error(`Non-literal ${name} property`);
      return [property.key.name || property.key.value, value(property.value)];
    }));
    throw new Error(`${name} must remain a literal object of strings; review the corpus generator`);
  }
  return value(root);
}

function loadSources() {
  const load = dataLoader();
  return {
    ...load("routes.js"), ...load("tripPrograms.js"), ...load("programData.js"),
    ...load("programMeta.js"), ...load("allTripsCatalog.js"), ...load("tripPackingNotes.js"),
    LABELS: literalExport(path.join(FRONTEND, "src/components/ProgramTemplate.jsx"), "LABELS"),
    CONTACT: literalExport(path.join(LIB, "data.js"), "CONTACT"),
  };
}

const plainText = (value) => typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
const normalized = (value) => plainText(value).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// Fail closed on mutable commercial facts, medical/legal/document advice and
// unsupported promotional claims. Filtering removes complete source sentences;
// it never rewrites their meaning or manufactures a replacement answer.
const BLOCKED_TEXT = [
  /(?:https?:|www\.|mailto:|tel:|\/\/|\b[\w-]+\.(?:com|org|net|es|ma|fr|io)\b)/i,
  /[€$£%]/,
  /\b(?:eur|usd|mad|euros?|dollars?|dirhams?)\b/i,
  /\b(?:precio\w*|tarif\w*|price\w*|pricing|rates?|coste\w*|costs?|cout\w*|supplements?|suplement\w*|supplement\w*|descuent\w*|discount\w*|reduction\w*|taxes?|tasas?|fianza\w*|deposit\w*|acompte\w*|paga y senal)\b/i,
  /\b(?:disponib\w*|indisponib\w*|availab\w*|unavailab\w*|plazas?|places restantes|spots? left|sold out|completo[sa]?|complets?|limited|limitad[oa]s?|limites?|alta ocupacion|high occupancy|forte occupation)\b/i,
  /\b(?:royal air maroc|vueling|ryanair|air arabia|opciones de vuelos|flight options|options de vol|se confirma\w* tras la reserva|confirmed (?:after|on|upon) booking|confirme\w* apres reservation)\b/i,
  /\b\d{1,2}(?::\d{2}|h\d{2})\b/,
  /\b(?:edad minima|minimum age|age minimum|proteccion solar|sun protection|protection solaire)\b/i,
  /\b(?:pasaport\w*|passport\w*|passeport\w*|visados?|visa|consular\w*|consulaires?|vaccin\w*|vacun\w*|medic\w*|medical\w*|sante|salud|health|spf|crema\w*|creme\w*|sunscreen|hydration|hidrat\w*|hydrat\w*|pharmac\w*|farmac\w*)\b/i,
  /\b(?:seguro\w*|insurance\w*|assurance\w*|cancel\w*|annul\w*|refund\w*|reembols\w*|rembours\w*|penali\w*|legal\w*|juridi\w*|contrat\w*|contract\w*|conditions generales|general terms|condiciones generales)\b/i,
  /\b(?:garanti\w*|guarantee\w*|testimoni\w*|opiniones|reviews?|avis clients|best[ -]seller|mas vendid\w*|mas autent\w*|most authentic|plus authent\w*|unforgettable|inolvidable|inoubliable|spectacular|espectacular\w*|spectaculaire\w*|emblematic\w*|emblemati\w*|unica?\w*|unique\w*|magiqu\w*|magic\w*|magico\w*|famos\w*|famed|famous|celebre\w*)\b/i,
  /\b(?:mas (?:alto|grande|cercano)|most (?:famous|beautiful)|(?:world.s|africa.s) (?:largest|tallest)|plus (?:haut|grand|proche)|closest|largest|tallest|millones de anos|million years|millions d.annees)\b/i,
];
const isAllowedText = (value) => Boolean(plainText(value)) && !BLOCKED_TEXT.some((pattern) => pattern.test(normalized(value)));

function safeSentences(value, lang) {
  const text = plainText(value);
  if (!text) return [];
  // Reject links before sentence splitting (e.g. a dot in a URL).
  if (BLOCKED_TEXT[0].test(text)) return [];
  return [...new Intl.Segmenter(lang, { granularity: "sentence" }).segment(text)]
    .map((item) => item.segment.trim()).filter((item) => item.length <= MAX_TEXT_LENGTH && isAllowedText(item));
}

function chunks(parts, prefix = "") {
  const result = [];
  let current = prefix;
  for (const part of parts) {
    if (!part || part.length + prefix.length + 1 > MAX_TEXT_LENGTH) continue;
    const candidate = current ? `${current}\n${part}` : part;
    if (candidate.length > MAX_TEXT_LENGTH) {
      if (current !== prefix) result.push(current);
      current = prefix ? `${prefix}\n${part}` : part;
    } else current = candidate;
  }
  if (current && current !== prefix) result.push(current);
  return result;
}

function buildCorpus(sources = loadSources()) {
  const { ROUTES, pathFor, TRIP_PROGRAMS, VARIANT_COPY, SHARED_DETAILS, ALL_TRIPS, LABELS, CONTACT, getTripPackingNotes } = sources;
  const documents = [];
  const catalog = new Map(ALL_TRIPS.map((trip) => [trip.routeId, trip]));
  const add = ({ routeId, lang, section, title, parts, keywords, kind = "trip", prefix = "" }) => {
    const pathname = pathFor(lang, routeId);
    if (!ROUTES[routeId]?.[lang] || !/^\/(?!\/)[^?#\s]*$/.test(pathname)
      || (lang !== "es" && !pathname.startsWith(`/${lang}/`))
      || (lang === "es" && /^\/(en|fr)\//.test(pathname))) throw new Error(`Invalid localized source path: ${routeId}/${lang}`);
    chunks(parts, prefix).forEach((text, index) => documents.push({
      id: `${lang}:${routeId}:${section}:${index + 1}`, lang, title: plainText(title), path: pathname, text,
      keywords: [...new Set(keywords.map(plainText).filter(isAllowedText))], kind,
    }));
  };

  // Only actual detail programmes are answer sources: hub/placeholder cards and
  // dated special departures do not become invented complete itineraries.
  for (const routeId of Object.keys(TRIP_PROGRAMS).sort()) {
    if (RETIRED_ROUTES.has(routeId)) continue;
    const { program, variant } = TRIP_PROGRAMS[routeId];
    for (const lang of LANGS) {
      const labels = LABELS[lang];
      const meta = { ...VARIANT_COPY[variant]?.[lang], ...program.meta?.[lang] };
      const sourceTitle = isAllowedText(meta.title) ? plainText(meta.title)
        : plainText(meta.title).split(/\s*·\s*/).filter(isAllowedText).join(" · ");
      const title = [sourceTitle, plainText(program.duration?.[lang])].filter(Boolean).join(" · ");
      if (!title || !isAllowedText(title)) throw new Error(`Programme needs a safe localized title: ${routeId}/${lang}`);
      const keywords = [catalog.get(routeId)?.title?.[lang], meta.title,
        ...plainText(meta.quick_places || meta.place).split(/\s*[·→]\s*/),
        ...plainText(meta.highlights).split(/\s*·\s*/)];
      const base = { routeId, lang, title, keywords };
      add({ ...base, section: "overview", parts: [
        plainText(catalog.get(routeId)?.title?.[lang]), plainText(meta.title),
        `${labels.card_duration}: ${plainText(program.duration?.[lang])}`,
        meta.airports ? `${labels.card_airports}: ${plainText(meta.airports)}` : "",
        meta.quick_places ? `${labels.card_places}: ${plainText(meta.quick_places)}` : "",
        plainText(meta.riding_summary),
      ].filter(isAllowedText) });

      (program.days || []).forEach((day, index) => {
        const dayTitle = plainText(day.title?.[lang]);
        if (!dayTitle || !isAllowedText(dayTitle)) return;
        const heading = `${labels.day_label} ${index + 1}: ${dayTitle}`;
        add({ ...base, section: `day:${index + 1}`, title: `${title} · ${heading}`,
          parts: [heading, ...safeSentences(day.body?.[lang], lang)] });
      });

      const details = program.details || SHARED_DETAILS;
      for (const section of ["includes", "excludes", "notes"]) {
        const heading = labels[`tab_${section}`];
        // Each detail is an atomic source claim. A condition/rate anywhere in
        // an item excludes the entire item instead of dropping its qualifier.
        add({ ...base, section, title: `${title} · ${heading}`, kind: section === "notes" ? "practical" : "trip",
          prefix: `${heading}:`, parts: (details[section]?.[lang] || []).map(plainText).filter(isAllowedText) });
      }
      (getTripPackingNotes(routeId) || []).forEach((note, index) => {
        const heading = plainText(note.title?.[lang]);
        if (!isAllowedText(heading)) return;
        add({ ...base, section: `packing:${index + 1}`, kind: "practical", title: `${title} · ${heading}`,
          prefix: `${heading}:`, parts: (note.items || []).map((item) => plainText(item[lang])).filter(isAllowedText) });
      });
    }
  }
  for (const lang of LANGS) {
    const labels = LABELS[lang];
    add({ routeId: "contact", lang, section: "contact", kind: "contact", title: labels.nav_contact,
      keywords: [labels.nav_contact, labels.phone_label, labels.email_label, "Xaluca Tours"], parts: [
        `${labels.phone_label}: ${plainText(CONTACT.phone)}`,
        `${labels.email_label}: ${plainText(CONTACT.email)}`,
        plainText(CONTACT.address[lang]),
      ] });
  }
  return { version: 1, documents };
}

const serializeCorpus = (corpus) => `${JSON.stringify(corpus, null, 2)}\n`;
function main(args = process.argv.slice(2)) {
  if (args.some((arg) => arg !== "--check")) throw new Error("Usage: node generate-assistant-knowledge.cjs [--check]");
  const corpus = buildCorpus();
  const contents = serializeCorpus(corpus);
  if (args.includes("--check")) {
    if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, "utf8") !== contents) {
      throw new Error("Assistant corpus is stale. Run: node frontend/scripts/generate-assistant-knowledge.cjs");
    }
    console.log(`Assistant corpus is current (${corpus.documents.length} documents).`);
  } else {
    fs.writeFileSync(OUTPUT, contents);
    console.log(`Generated ${corpus.documents.length} assistant source documents at ${OUTPUT}`);
  }
}

module.exports = { buildCorpus, loadSources, serializeCorpus, safeSentences, isAllowedText, MAX_TEXT_LENGTH, OUTPUT, main };
if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
