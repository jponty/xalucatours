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
  // ── Gran Sur · Marrakech → Fez ──
  tourMarrakechFez67: [
    { people: 2, low: 1485, high: 1700 },
    { people: 3, low: 1250, high: 1400 },
    { people: 4, low: 1135, high: 1250 },
  ],
  tourMarrakechFez78: [
    { people: 2, low: 1600, high: 1815 },
    { people: 3, low: 1370, high: 1515 },
    { people: 4, low: 1250, high: 1370 },
  ],
  tourMarrakechFez89: [
    { people: 2, low: 1815, high: 2050 },
    { people: 3, low: 1550, high: 1715 },
    { people: 4, low: 1415, high: 1545 },
  ],
  tourMarrakechFez910: [
    { people: 2, low: 1990, high: 2235 },
    { people: 3, low: 1690, high: 1865 },
    { people: 4, low: 1540, high: 1675 },
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

  // ── Gran Sur · Marrakech → Sidi Ali → Fez ──
  tourMarrakechSidialiFez78: [
    { people: 2, low: 1780, high: 2005 },
    { people: 3, low: 1515, high: 1675 },
    { people: 4, low: 1385, high: 1510 },
  ],
  tourMarrakechSidialiFez89: [
    { people: 2, low: 1895, high: 2120 },
    { people: 3, low: 1625, high: 1785 },
    { people: 4, low: 1495, high: 1615 },
  ],
  tourMarrakechSidialiFez910: [
    { people: 2, low: 2105, high: 2350 },
    { people: 3, low: 1805, high: 1975 },
    { people: 4, low: 1655, high: 1790 },
  ],

  // ── Gran Sur · Tánger → Marrakech ──
  tourTangerRak89: [
    { people: 2, low: 2070, high: 2325 },
    { people: 3, low: 1715, high: 1890 },
    { people: 4, low: 1535, high: 1675 },
  ],
  tourTangerRak910: [
    { people: 2, low: 2280, high: 2555 },
    { people: 3, low: 1890, high: 2080 },
    { people: 4, low: 1695, high: 1845 },
  ],

  // ── Gran Sur · Ouarzazate → Sidi Ali → Fez ──
  tourOzzSidialiFez56: [
    { people: 2, low: 1360, high: 1500 },
    { people: 3, low: 1160, high: 1260 },
    { people: 4, low: 1060, high: 1135 },
  ],
  tourOzzSidialiFez67: [
    { people: 2, low: 1540, high: 1705 },
    { people: 3, low: 1305, high: 1425 },
    { people: 4, low: 1190, high: 1280 },
  ],
  tourOzzSidialiFez78: [
    { people: 2, low: 1750, high: 1935 },
    { people: 3, low: 1485, high: 1615 },
    { people: 4, low: 1350, high: 1455 },
  ],

  // ── Gran Sur · Fez → Sidi Ali → Ouarzazate ──
  tourFezSidialiOzz56: [
    { people: 2, low: 1360, high: 1500 },
    { people: 3, low: 1160, high: 1260 },
    { people: 4, low: 1060, high: 1135 },
  ],
  tourFezSidialiOzz67: [
    { people: 2, low: 1540, high: 1705 },
    { people: 3, low: 1305, high: 1425 },
    { people: 4, low: 1190, high: 1280 },
  ],
  tourFezSidialiOzz78: [
    { people: 2, low: 1750, high: 1935 },
    { people: 3, low: 1485, high: 1615 },
    { people: 4, low: 1350, high: 1455 },
  ],

  // ── Marrakech ↔ Essaouira (precio único, sin temporada) ──
  tourMarrakechEss45: [
    { people: 2, low: 790, high: 790 },
    { people: 3, low: 710, high: 710 },
    { people: 4, low: 665, high: 665 },
  ],
  tourMarrakechEss67: [
    { people: 2, low: 1040, high: 1040 },
    { people: 3, low: 955, high: 955 },
    { people: 4, low: 915, high: 915 },
  ],

  // ── Marrakech → Erg Chebbi → Marrakech (loop) ──
  tourMarrakechLoop56: [
    { people: 2, low: 1225, high: 1400 },
    { people: 3, low: 1070, high: 1185 },
    { people: 4, low: 990, high: 1080 },
  ],
  tourMarrakechLoop67: [
    { people: 2, low: 1405, high: 1600 },
    { people: 3, low: 1220, high: 1350 },
    { people: 4, low: 1125, high: 1225 },
  ],
  tourMarrakechLoop78: [
    { people: 2, low: 1565, high: 1780 },
    { people: 3, low: 1345, high: 1490 },
    { people: 4, low: 1230, high: 1350 },
  ],

  // ── Marrakech → Erg Chebbi (ida) ──
  tourMarrakechErg45: [
    { people: 2, low: 1035, high: 1155 },
    { people: 3, low: 890, high: 970 },
    { people: 4, low: 815, high: 880 },
  ],
  tourMarrakechErg56: [
    { people: 2, low: 1235, high: 1370 },
    { people: 3, low: 1055, high: 1150 },
    { people: 4, low: 960, high: 1040 },
  ],
  tourMarrakechErg67: [
    { people: 2, low: 1350, high: 1490 },
    { people: 3, low: 1170, high: 1270 },
    { people: 4, low: 1080, high: 1155 },
  ],
  tourMarrakechErg78: [
    { people: 2, low: 1560, high: 1720 },
    { people: 3, low: 1345, high: 1460 },
    { people: 4, low: 1240, high: 1330 },
  ],

  // ── Atlas → Desierto ──
  tourAtlasDesierto45: [
    { people: 2, low: 1560, high: 1720 },
    { people: 3, low: 1345, high: 1460 },
    { people: 4, low: 1240, high: 1330 },
  ],
  tourAtlasDesierto56: [
    { people: 2, low: 1255, high: 1350 },
    { people: 3, low: 1075, high: 1145 },
    { people: 4, low: 985, high: 1045 },
  ],
  tourAtlasDesierto67: [
    { people: 2, low: 1455, high: 1560 },
    { people: 3, low: 1240, high: 1320 },
    { people: 4, low: 1130, high: 1195 },
  ],

  // ── Errachidia · Atlas · Fez (ambas direcciones) ──
  tourErrAtlasFez56: [
    { people: 2, low: 1265, high: 1395 },
    { people: 3, low: 1085, high: 1175 },
    { people: 4, low: 995, high: 1065 },
  ],
  tourFezAtlasErr56: [
    { people: 2, low: 1305, high: 1435 },
    { people: 3, low: 1120, high: 1215 },
    { people: 4, low: 1030, high: 1105 },
  ],

  // ── Desierto → Atlas ──
  tourDesiertoAtlas45: [
    { people: 2, low: 1030, high: 1105 },
    { people: 3, low: 885, high: 940 },
    { people: 4, low: 810, high: 855 },
  ],
  tourDesiertoAtlas56: [
    { people: 2, low: 1255, high: 1350 },
    { people: 3, low: 1075, high: 1145 },
    { people: 4, low: 985, high: 1045 },
  ],
  tourDesiertoAtlas67: [
    { people: 2, low: 1465, high: 1560 },
    { people: 3, low: 1240, high: 1320 },
    { people: 4, low: 1130, high: 1195 },
  ],

  // ── Norte · Tánger → Fez ──
  tourTangerFez45: [
    { people: 2, low: 980, high: 1020 },
    { people: 3, low: 810, high: 835 },
    { people: 4, low: 725, high: 745 },
  ],
  tourTangerFez56: [
    { people: 2, low: 1105, high: 1165 },
    { people: 3, low: 900, high: 945 },
    { people: 4, low: 800, high: 835 },
  ],

  // ── Norte · Fez → Tánger ──
  tourFezTanger56: [
    { people: 2, low: 1100, high: 1140 },
    { people: 3, low: 925, high: 950 },
    { people: 4, low: 835, high: 855 },
  ],
  tourFezTanger67: [
    { people: 2, low: 1240, high: 1305 },
    { people: 3, low: 1030, high: 1075 },
    { people: 4, low: 925, high: 965 },
  ],

  // ── Norte · Ciudades imperiales ──
  tourCiudadesImperiales45: [
    { people: 2, low: 1050, high: 1105 },
    { people: 3, low: 860, high: 895 },
    { people: 4, low: 760, high: 785 },
  ],
  tourCiudadesImperiales67: [
    { people: 2, low: 1050, high: 1105 },
    { people: 3, low: 860, high: 895 },
    { people: 4, low: 760, high: 785 },
  ],

  // ── Norte · Ciudades imperiales + Rif ──
  tourCiudadesImperialesRif67: [
    { people: 2, low: 1470, high: 1540 },
    { people: 3, low: 1225, high: 1270 },
    { people: 4, low: 1100, high: 1135 },
  ],
  tourCiudadesImperialesRif78: [
    { people: 2, low: 1745, high: 1825 },
    { people: 3, low: 1450, high: 1505 },
    { people: 4, low: 1300, high: 1340 },
  ],

  // ── Escapadas · Fez (precio único, sin temporada) ──
  tourEscapadaFez23: [
    { people: 2, low: 320, high: 320 },
    { people: 3, low: 285, high: 285 },
    { people: 4, low: 270, high: 270 },
  ],
  tourEscapadaFez34: [
    { people: 2, low: 595, high: 595 },
    { people: 3, low: 510, high: 510 },
    { people: 4, low: 470, high: 470 },
  ],

  // ── Escapadas · Fez + Sidi Ali ──
  tourEscapadaFezSidiali34: [
    { people: 2, low: 845, high: 885 },
    { people: 3, low: 730, high: 755 },
    { people: 4, low: 670, high: 690 },
  ],
  tourEscapadaFezSidiali45: [
    { people: 2, low: 1105, high: 1275 },
    { people: 3, low: 935, high: 1045 },
    { people: 4, low: 850, high: 930 },
  ],

  // ── Escapadas · Atlas ──
  tourEscapadaAtlas34: [
    { people: 2, low: 685, high: 735 },
    { people: 3, low: 575, high: 615 },
    { people: 4, low: 525, high: 560 },
  ],

  // ── Escapadas · Marrakech (precio único, sin temporada) ──
  tourEscapadaMarrakech23: [
    { people: 2, low: 340, high: 340 },
    { people: 3, low: 320, high: 320 },
    { people: 4, low: 310, high: 310 },
  ],
  tourEscapadaRakAgafay34: [
    { people: 2, low: 840, high: 840 },
    { people: 3, low: 745, high: 745 },
    { people: 4, low: 700, high: 700 },
  ],

  // ── Escapadas · Desierto ──
  tourEscapadaDesierto34: [
    { people: 2, low: 775, high: 815 },
    { people: 3, low: 675, high: 705 },
    { people: 4, low: 625, high: 655 },
  ],

  // ── Escapadas · Tánger ──
  tourEscapadaTanger: [
    { people: 2, low: 710, high: 760 },
    { people: 3, low: 580, high: 615 },
    { people: 4, low: 515, high: 545 },
  ],
};

/* Returns the per-program tier array for a routeId, or null if the route
   uses the global pricing. */
export const getProgramTiers = (routeId) =>
  (routeId && PROGRAM_PRICING[routeId]) || null;
