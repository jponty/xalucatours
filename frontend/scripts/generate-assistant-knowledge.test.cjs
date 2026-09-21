const assert = require("node:assert/strict");
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const {
  buildCorpus, loadSources, serializeCorpus, safeSentences, isAllowedText, MAX_TEXT_LENGTH, OUTPUT,
} = require("./generate-assistant-knowledge.cjs");

const sources = loadSources();
const corpus = buildCorpus(sources);
const plain = (value) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

test("committed corpus is current and deterministic across independent source loads", () => {
  const contents = serializeCorpus(corpus);
  assert.equal(contents, fs.readFileSync(OUTPUT, "utf8"), "Run the knowledge generator after source edits");
  assert.equal(contents, serializeCorpus(buildCorpus()));
  const check = spawnSync(process.execPath, [require.resolve("./generate-assistant-knowledge.cjs"), "--check"], { encoding: "utf8" });
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /corpus is current/);
});

test("schema, source paths and IDs are bounded and strictly local", () => {
  assert.equal(corpus.version, 1);
  assert.ok(corpus.documents.length > 0);
  assert.equal(new Set(corpus.documents.map((doc) => doc.id)).size, corpus.documents.length);
  for (const doc of corpus.documents) {
    assert.deepEqual(Object.keys(doc), ["id", "lang", "title", "path", "text", "keywords", "kind"]);
    assert.ok(["es", "en", "fr"].includes(doc.lang));
    assert.ok(["trip", "practical", "contact"].includes(doc.kind));
    assert.ok(doc.title && doc.text && doc.text.length <= MAX_TEXT_LENGTH, doc.id);
    assert.ok(doc.keywords.every((word) => typeof word === "string" && word.length));
    assert.doesNotMatch(doc.path, /https?:|\/\/|[?#\s]|admin|api\//);
    const routeId = doc.id.split(":")[1];
    assert.equal(doc.path, sources.pathFor(doc.lang, routeId));
    assert.ok(sources.ROUTES[routeId][doc.lang]);
    if (doc.lang === "es") assert.doesNotMatch(doc.path, /^\/(?:en|fr)\//);
    else assert.ok(doc.path.startsWith(`/${doc.lang}/`));
    assert.doesNotMatch(doc.text, /https?:|www\.|<[^>]+>/);
    if (doc.kind !== "contact") assert.ok(isAllowedText(doc.text), doc.id);
  }
});

test("every active programme has a localized overview and daily itinerary", () => {
  for (const [routeId, { program }] of Object.entries(sources.TRIP_PROGRAMS)) {
    if (routeId === "tourEnduroAventura67") continue;
    for (const lang of ["es", "en", "fr"]) {
      assert.ok(corpus.documents.find((doc) => doc.id === `${lang}:${routeId}:overview:1`), `${routeId}/${lang}`);
      for (let day = 1; day <= program.days.length; day += 1) {
        const sourceTitle = program.days[day - 1].title?.[lang];
        if (isAllowedText(sourceTitle)) assert.ok(corpus.documents.find((doc) => doc.id === `${lang}:${routeId}:day:${day}:1`), `${routeId}/${lang}/${day}`);
      }
    }
  }
});

test("current Enduro 3/4 and 4/5 are indexed; retired 6/7 and dated departures are not", () => {
  const contents = serializeCorpus(corpus);
  assert.match(contents, /tourEnduroAventura34/);
  assert.match(contents, /tourEnduroAventura45/);
  assert.doesNotMatch(contents, /tourEnduroAventura67|enduro[^"\n]*(?:6n[-_]7|6n_7)/i);
  assert.doesNotMatch(contents, /tourFinDeAno2025|DEPARTURE_CATALOG/);
  const short = corpus.documents.find((doc) => doc.id === "es:tourEnduroAventura34:overview:1");
  assert.match(short.text, /3 noches \/ 4 días/);
  assert.match(short.text, /2 días de moto de enduro con guía/);
});

test("every itinerary sentence is an exact extract from its same-language day body", () => {
  for (const doc of corpus.documents.filter((item) => item.id.includes(":day:"))) {
    const [, routeId, , number] = doc.id.split(":");
    const day = sources.TRIP_PROGRAMS[routeId].program.days[Number(number) - 1];
    const [heading, ...sentences] = doc.text.split("\n");
    assert.equal(heading, `${sources.LABELS[doc.lang].day_label} ${number}: ${plain(day.title[doc.lang])}`);
    const sourceBody = plain(day.body?.[doc.lang] || "");
    for (const sentence of sentences) assert.ok(sourceBody.includes(sentence), `${doc.id}: ${sentence}`);
  }
});

test("details keep source wording and inclusion/exclusion labels without qualification loss", () => {
  for (const doc of corpus.documents.filter((item) => /:(?:includes|excludes|notes):/.test(item.id))) {
    const [, routeId, section] = doc.id.split(":");
    const details = sources.TRIP_PROGRAMS[routeId].program.details || sources.SHARED_DETAILS;
    const sourceItems = (details[section]?.[doc.lang] || []).map(plain);
    const [label, ...items] = doc.text.split("\n");
    assert.equal(label, `${sources.LABELS[doc.lang][`tab_${section}`]}:`);
    for (const item of items) assert.ok(sourceItems.includes(item), `${doc.id}: ${item}`);
  }
  const excluded = corpus.documents.find((doc) => doc.id === "es:tourEnduroAventura34:excludes:1");
  assert.match(excluded.text, /^Qué no incluye:/);
  assert.match(excluded.text, /Vuelos\./);
});

test("the corpus contains no currency/rate, passport, insurance or availability claims", () => {
  const contents = corpus.documents.map((doc) => `${doc.title} ${doc.text}`).join("\n");
  assert.doesNotMatch(contents, /[€$£%]|\b(?:EUR|USD|MAD|pasaporte|passport|passeport|insurance|assurance|disponibilidad|availability|disponibilité)\b/i);
  for (const [text, lang] of [
    ["Precio desde 999 €. El pasaporte debe tener seis meses de vigencia. Disponibilidad garantizada. Testimonios de clientes. Paseo por las dunas.", "es"],
    ["From €999. Passport validity must be six months. Two spots left. Guaranteed availability. A walk on the dunes.", "en"],
    ["Prix 999 EUR. Passeport valable six mois. Disponibilité garantie. Une balade dans les dunes.", "fr"],
  ]) {
    const extracted = safeSentences(text, lang);
    assert.equal(extracted.length, 1, `${lang}: ${extracted}`);
    assert.ok(/dunas|dunes/.test(extracted[0]));
  }
  assert.deepEqual(safeSentences("Más información en xaluca.com", "es"), []);
  assert.deepEqual(safeSentences("See https://example.com/a for information.", "en"), []);
});

test("missing translations cannot silently index Spanish copy into English or French", () => {
  const routeId = "tourEnduroAventura34";
  const entry = sources.TRIP_PROGRAMS[routeId];
  const program = JSON.parse(JSON.stringify(entry.program));
  delete program.days[0].body.en;
  delete program.details.notes.en;
  const fixture = buildCorpus({ ...sources, TRIP_PROGRAMS: { [routeId]: { ...entry, program } } });
  const day = fixture.documents.find((doc) => doc.id === `en:${routeId}:day:1:1`);
  assert.equal(day.text.split("\n").length, 1);
  assert.ok(!fixture.documents.find((doc) => doc.id === `en:${routeId}:notes:1`));
  assert.doesNotMatch(day.text, /Salida de Barcelona/);
});

test("contact details come only from the central public contact constants", () => {
  for (const lang of ["es", "en", "fr"]) {
    const doc = corpus.documents.find((item) => item.id === `${lang}:contact:contact:1`);
    assert.equal(doc.kind, "contact");
    assert.ok(doc.text.includes(sources.CONTACT.phone));
    assert.ok(doc.text.includes(sources.CONTACT.email));
    assert.ok(doc.text.includes(sources.CONTACT.address[lang]));
    assert.equal(doc.path, sources.pathFor(lang, "contact"));
  }
});
