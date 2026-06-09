/* ============================================================
   publuuCatalogues.js
   ----
   Per-route Publuu flipbook catalogue ids. Keyed by routeId
   (see lib/routes.js). ProgramTemplate looks up the current
   routeId here and renders the "Folleto interactivo" section
   automatically — no per-page wiring needed.

   Final embed URL:
     https://publuu.com/flip-book/1044718/<ID>?embed&transparent
============================================================ */

export const PUBLUU_BOOK_ID = "1044718";

export const PUBLUU_BY_ROUTE = {
  // ── Gran Sur · Marrakech → Fez ──
  tourMarrakechFez67:  "2316449",
  tourMarrakechFez78:  "2316347",
  tourMarrakechFez89:  "2316295",
  tourMarrakechFez910: "2316303",
  // ── Gran Sur · Fez → Marrakech ──
  tourFezRak67:  "2316332",
  tourFezRak78:  "2358860",
  tourFezRak89:  "2358983",
  tourFezRak910: "2316346",
  // ── Gran Sur · Fez · Sidi Ali · Marrakech ──
  tourFezSidialiRak78:  "2316334",
  tourFezSidialiRak89:  "2358988",
  tourFezSidialiRak910: "2316346",
  // ── Gran Sur · Marrakech · Sidi Ali · Fez ──
  tourMarrakechSidialiFez78:  "2316302",
  tourMarrakechSidialiFez89:  "2316492",
  tourMarrakechSidialiFez910: "2358957",
  // ── Gran Sur · Tánger → Marrakech ──
  tourTangerRak89:  "2316341",
  tourTangerRak910: "2316342",
  // ── Gran Sur · Ouarzazate · Sidi Ali · Fez ──
  tourOzzSidialiFez56: "2358963",
  tourOzzSidialiFez67: "2358966",
  tourOzzSidialiFez78: "2316304",
  // ── Gran Sur · Fez · Sidi Ali · Ouarzazate ──
  tourFezSidialiOzz56: "2358963",
  tourFezSidialiOzz67: "2358945",
  tourFezSidialiOzz78: "2358958",
  // ── Sur · Marrakech ↔ Essaouira ──
  tourMarrakechEss45: "2316447",
  tourMarrakechEss67: "2316450",
  // ── Sur · Loop Marrakech (Marrakech · Erg Chebbi · Marrakech) ──
  tourMarrakechLoop23: "2358911",
  tourMarrakechLoop34: "2358922",
  tourMarrakechLoop56: "2359935",
  tourMarrakechLoop67: "2316454",
  tourMarrakechLoop78: "2316345",
  // ── Sur · Marrakech → Erg Chebbi ──
  tourMarrakechErg45: "2316453",
  tourMarrakechErg56: "2316291",
  tourMarrakechErg67: "2316451",
  tourMarrakechErg78: "2316292",
  // ── Sur · Erg Chebbi → Marrakech ──
  tourErgMarrakech45: "2316288",
  tourErgMarrakech56: "2316309",
  tourErgMarrakech67: "2316310",
  tourErgMarrakech78: "2316311",
  // ── Sur · Atlas → Desierto ──
  tourAtlasDesierto45: "2316276",
  tourAtlasDesierto56: "2316275",
  tourAtlasDesierto67: "2359864",
  // ── Sur · Errachidia · Atlas · Fez / Fez · Atlas · Errachidia ──
  tourErrAtlasFez56: "2359670",
  tourFezAtlasErr56: "2316286",
  // ── Sur · Desierto → Atlas ──
  tourDesiertoAtlas45: "2316281",
  tourDesiertoAtlas56: "2316312",
  tourDesiertoAtlas67: "2359909",
  // ── Norte · Tánger → Fez ──
  tourTangerFez45: "2316280",
  tourTangerFez56: "2359912",
  // ── Norte · Fez → Tánger ──
  tourFezTanger56: "2316285",
  tourFezTanger67: "2316282",
  // ── Norte · Ciudades imperiales ──
  tourCiudadesImperiales45: "2316493",
  tourCiudadesImperiales67: "2316287",
  // ── Norte · Ciudades imperiales + Rif ──
  tourCiudadesImperialesRif67: "2316290",
  tourCiudadesImperialesRif78: "2359872",
  // ── Escapadas cortas ──
  tourEscapadaFez23:        "2358923",
  tourEscapadaFez34:        "2316323",
  tourEscapadaFezSidiali34: "2316326",
  tourEscapadaFezSidiali45: "2316325",
  tourEscapadaAtlas34:      "2316320",
  tourEscapadaMarrakech23:  "2316314",
  tourEscapadaRakAgafay34:  "2316315",
  tourEscapadaDesierto34:   "2316321",
  tourEscapadaTanger:       "2316316",
};

/* Build the full Publuu embed URL for a given routeId (or "" if none). */
export const publuuSrcFor = (routeId) => {
  const id = PUBLUU_BY_ROUTE[routeId];
  return id ? `https://publuu.com/flip-book/${PUBLUU_BOOK_ID}/${id}?embed&transparent` : "";
};
