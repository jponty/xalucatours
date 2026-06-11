/* ============================================================
   Per-program price matrices (PER PERSON, in EUR).
   ------------------------------------------------------------
   The site has a single GLOBAL pricing block (see lib/pricing.js +
   the /admin "Precios" tab). Some itineraries, however, carry their
   OWN commercial tariff. Any routeId listed here overrides the global
   tiers inside <PricingSection> for that specific program page.

   Shape per route: [{ people, low, high }] — `low` = Temporada baja,
   `high` = Temporada alta. Routes NOT listed here keep using the
   global/admin pricing.

   To update a program's price later: edit its row below (or add a new
   routeId). No component changes required.
============================================================ */

export const PROGRAM_PRICING = {
  // ── Atlas → Desierto ──
  tourAtlasDesierto45: [
    { people: 2, low: 1010, high: 1085 },
    { people: 3, low: 865,  high: 920 },
    { people: 4, low: 790,  high: 835 },
  ],
  tourAtlasDesierto56: [
    { people: 2, low: 1255, high: 1350 },
    { people: 3, low: 1075, high: 1145 },
    { people: 4, low: 985,  high: 1045 },
  ],
  tourAtlasDesierto67: [
    { people: 2, low: 1430, high: 1535 },
    { people: 3, low: 1215, high: 1295 },
    { people: 4, low: 1105, high: 1170 },
  ],

  // ── Desierto → Atlas ──
  tourDesiertoAtlas45: [
    { people: 2, low: 1010, high: 1085 },
    { people: 3, low: 865,  high: 920 },
    { people: 4, low: 790,  high: 835 },
  ],
  tourDesiertoAtlas56: [
    { people: 2, low: 1230, high: 1325 },
    { people: 3, low: 1050, high: 1120 },
    { people: 4, low: 960,  high: 1020 },
  ],
  tourDesiertoAtlas67: [
    { people: 2, low: 1430, high: 1535 },
    { people: 3, low: 1215, high: 1295 },
    { people: 4, low: 1105, high: 1170 },
  ],

  // ── Gran Sur · Marrakech → Fez ──
  tourMarrakechFez67: [
    { people: 2, low: 1485, high: 1700 },
    { people: 3, low: 1250, high: 1400 },
    { people: 4, low: 1135, high: 1250 },
  ],

  // ── Gran Sur · Fez → Marrakech ──
  tourFezRak67: [
    { people: 2, low: 1485, high: 1700 },
    { people: 3, low: 1250, high: 1400 },
    { people: 4, low: 1135, high: 1250 },
  ],
  tourFezRak78: [
    { people: 2, low: 1600, high: 1815 },
    { people: 3, low: 1370, high: 1515 },
    { people: 4, low: 1250, high: 1370 },
  ],
  tourFezRak89: [
    { people: 2, low: 1815, high: 2050 },
    { people: 3, low: 1550, high: 1715 },
    { people: 4, low: 1415, high: 1545 },
  ],
  tourFezRak910: [
    { people: 2, low: 1990, high: 2235 },
    { people: 3, low: 1690, high: 1865 },
    { people: 4, low: 1540, high: 1675 },
  ],

  // ── Gran Sur · Fez → Sidi Ali → Marrakech ──
  tourFezSidialiRak78: [
    { people: 2, low: 1770, high: 2000 },
    { people: 3, low: 1505, high: 1660 },
    { people: 4, low: 1370, high: 1495 },
  ],
  tourFezSidialiRak89: [
    { people: 2, low: 1895, high: 2120 },
    { people: 3, low: 1625, high: 1785 },
    { people: 4, low: 1495, high: 1615 },
  ],
  tourFezSidialiRak910: [
    { people: 2, low: 2105, high: 2350 },
    { people: 3, low: 1805, high: 1975 },
    { people: 4, low: 1655, high: 1790 },
  ],
};

/* Returns the per-program tier array for a routeId, or null if the route
   uses the global pricing. */
export const getProgramTiers = (routeId) =>
  (routeId && PROGRAM_PRICING[routeId]) || null;
