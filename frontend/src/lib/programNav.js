/* ============================================================
   programNav.js
   ----
   Site-architecture lookup map used by <Breadcrumbs /> and
   <HubPeerNav /> to wire programs ↔ hubs ↔ sections.
   ----
   Phase 1 scope: "Sur de Marruecos" (sectionRouteId: tourSouth)
   Phase 2 scope: "Marruecos de norte a sur" (sectionRouteId: tourFull)
   Future phases: add hubs to the matching SECTION_HUBS array.
============================================================ */

import {
  HUB_ATLAS_DESIERTO,
  HUB_DESIERTO_ATLAS,
  HUB_MARRAKECH_ERG,
  HUB_ERGCHEBBI_MARRAKECH,
  HUB_MARRAKECH_LOOP,
  HUB_MARRAKECH_ESSAOUIRA,
  HUB_ERRACHIDIA_ATLAS_FEZ,
  HUB_GRANSUR_FEZ_RAK,
  HUB_GRANSUR_FEZ_SIDIALI_RAK,
  HUB_GRANSUR_OUARZA_FEZ,
  HUB_GRANSUR_TANGER_RAK,
  HUB_AVENTURA_ENDURO,
} from "@/lib/itineraryHubs";

/* ----- Sections (top-level cluster a hub belongs to) ----- */
export const SECTIONS = {
  tourSouth:     { label: { es: "Sur de Marruecos",       en: "Southern Morocco",   fr: "Sud du Maroc" } },
  tourNorth:     { label: { es: "Norte de Marruecos",     en: "Northern Morocco",   fr: "Nord du Maroc" } },
  tourShort:     { label: { es: "Escapadas cortas",       en: "Short escapes",      fr: "Escapades courtes" } },
  tourFull:      { label: { es: "Marruecos de norte a sur", en: "Morocco · north to south", fr: "Maroc · nord au sud" } },
  tourAdventure: { label: { es: "Aventura",               en: "Adventure",          fr: "Aventure" } },
  toursLanding:  { label: { es: "Viajes",                 en: "Tours",              fr: "Voyages" } },
};

export const HOME_LABEL = { es: "Inicio", en: "Home", fr: "Accueil" };

/* ----- Section → ordered list of hubs.
   When a new section/phase is wired, add entries here. ----- */
const SECTION_HUBS = {
  tourSouth: [
    { routeId: "tourAtlasDesiertoHub",       hub: HUB_ATLAS_DESIERTO },
    { routeId: "tourDesiertoAtlasHub",       hub: HUB_DESIERTO_ATLAS },
    { routeId: "tourMarrakechErgHub",        hub: HUB_MARRAKECH_ERG },
    { routeId: "tourErgChebbiMarrakechHub",  hub: HUB_ERGCHEBBI_MARRAKECH },
    { routeId: "tourMarrakechLoopHub",       hub: HUB_MARRAKECH_LOOP },
    { routeId: "tourMarrakechEssHub",        hub: HUB_MARRAKECH_ESSAOUIRA },
    { routeId: "tourErrAtlasFezHub",         hub: HUB_ERRACHIDIA_ATLAS_FEZ },
  ],
  tourFull: [
    { routeId: "tourGransurFezRak",          hub: HUB_GRANSUR_FEZ_RAK },
    { routeId: "tourGransurFezSidiali",      hub: HUB_GRANSUR_FEZ_SIDIALI_RAK },
    { routeId: "tourGransurOuarzaFez",       hub: HUB_GRANSUR_OUARZA_FEZ },
    { routeId: "tourGransurTangerRak",       hub: HUB_GRANSUR_TANGER_RAK },
  ],
  tourAdventure: [
    { routeId: "tourAventuraEnduroHub",      hub: HUB_AVENTURA_ENDURO },
  ],
};

/* ----- Build lookups ----- */
export const HUB_NAV = {};       // hubRouteId  → { section, hubRouteId, hub }
export const PROGRAM_NAV = {};   // programRouteId → { section, hubRouteId, hub, program }
export const SECTION_HUB_ROUTES = {}; // sectionRouteId → [hubRouteId]

for (const [section, entries] of Object.entries(SECTION_HUBS)) {
  SECTION_HUB_ROUTES[section] = entries.map((e) => e.routeId);
  for (const { routeId, hub } of entries) {
    HUB_NAV[routeId] = { section, hubRouteId: routeId, hub };
    for (const p of hub.programs || []) {
      if (p.link && !PROGRAM_NAV[p.link]) {
        PROGRAM_NAV[p.link] = { section, hubRouteId: routeId, hub, program: p };
      }
    }
  }
}

/* ----- Public helpers ----- */
export const pickT = (obj, lang) =>
  obj && (obj[lang] ?? obj.es ?? Object.values(obj)[0]) || "";

export const sectionLabel = (sectionRouteId, lang) =>
  pickT(SECTIONS[sectionRouteId]?.label, lang);

export const lookupProgram = (routeId) => PROGRAM_NAV[routeId] || null;
export const lookupHub     = (routeId) => HUB_NAV[routeId] || null;

/* hubLabel: prefer hub.hero.title, fall back to hub.intro.overline */
export const hubLabel = (hub, lang) => {
  const t = pickT(hub?.hero?.title, lang) || pickT(hub?.intro?.overline, lang) || "";
  // strip trailing dot for breadcrumb tidiness
  return t.replace(/\.+\s*$/, "");
};

/* programLabel: built from program nights (e.g., "6 noches · 7 días") */
const NIGHTS_LABEL = {
  "2n3d": { es: "2 noches · 3 días", en: "2 nights · 3 days", fr: "2 nuits · 3 jours" },
  "3n4d": { es: "3 noches · 4 días", en: "3 nights · 4 days", fr: "3 nuits · 4 jours" },
  "4n5d": { es: "4 noches · 5 días", en: "4 nights · 5 days", fr: "4 nuits · 5 jours" },
  "5n6d": { es: "5 noches · 6 días", en: "5 nights · 6 days", fr: "5 nuits · 6 jours" },
  "6n7d": { es: "6 noches · 7 días", en: "6 nights · 7 days", fr: "6 nuits · 7 jours" },
  "7n8d": { es: "7 noches · 8 días", en: "7 nights · 8 days", fr: "7 nuits · 8 jours" },
  "8n9d": { es: "8 noches · 9 días", en: "8 nights · 9 days", fr: "8 nuits · 9 jours" },
  "9n10d":{ es: "9 noches · 10 días", en: "9 nights · 10 days", fr: "9 nuits · 10 jours" },
};

export const programLabel = (program, lang) =>
  pickT(NIGHTS_LABEL[program?.nights], lang) || "";

/* peerPrograms: same hub, excluding the current program */
export const peerPrograms = (hub, currentRouteId) =>
  (hub?.programs || []).filter((p) => p.link && p.link !== currentRouteId);
