/* ============================================================
   Per-program price matrices (PER PERSON, in EUR).
   ------------------------------------------------------------
   The site has a single GLOBAL pricing block (see lib/pricing.js +
   the /admin "Precios" tab). Most itineraries carry their OWN
   commercial tariff, listed here — it overrides the global tiers
   inside <PricingSection> for that specific program page.

   Shape per route:
     {
       tiers: [{ people, low, high }],   // low = Temporada baja (TB), high = Temporada alta (TA)
       supplement?: { low, high },        // Suplemento individual (opcional)
       child?:      { low, high },        // Niño (opcional)
     }
   `low === high` means a single price (no season split).
   Routes NOT listed here fall back to the global/admin pricing.

   Source: official price sheet (62 programmes with a registered URL).
============================================================ */

export const PROGRAM_PRICING = {
  // 1. GRAN SUR RAK-FEZ 6n7d (1 noche Rak)  (/viajes/gransur/marrakech_fez/programa_6n_7d)
  tourMarrakechFez67: {
    tiers: [
      { people: 2, low: 1485, high: 1700 },
      { people: 3, low: 1250, high: 1400 },
      { people: 4, low: 1135, high: 1250 },
    ],
    supplement: { low: 375, high: 375 },
    child: { low: 300, high: 315 },
  },

  // 3. GRAN SUR RAK-FEZ 7n8d  (/viajes/gransur/marrakech_fez/programa_7n_8d)
  tourMarrakechFez78: {
    tiers: [
      { people: 2, low: 1600, high: 1815 },
      { people: 3, low: 1370, high: 1515 },
      { people: 4, low: 1250, high: 1370 },
    ],
    supplement: { low: 485, high: 485 },
    child: { low: 305, high: 325 },
  },

  // 4. GRAN SUR RAK-FEZ 8n9d  (/viajes/gransur/marrakech_fez/programa_8n_9d)
  tourMarrakechFez89: {
    tiers: [
      { people: 2, low: 1815, high: 2050 },
      { people: 3, low: 1550, high: 1715 },
      { people: 4, low: 1415, high: 1545 },
    ],
    supplement: { low: 535, high: 535 },
    child: { low: 350, high: 370 },
  },

  // 5. GRAN SUR RAK-FEZ 9n10d  (/viajes/gransur/marrakech_fez/programa_9n_10d)
  tourMarrakechFez910: {
    tiers: [
      { people: 2, low: 2000, high: 2250 },
      { people: 3, low: 1700, high: 1880 },
      { people: 4, low: 1550, high: 1690 },
    ],
    supplement: { low: 580, high: 580 },
    child: { low: 400, high: 420 },
  },

  // 6. GRAN SUR FEZ-RAK 6n7d (1 noche Rak)  (/viajes/gransur/fez_marrakech/programa_6n_7d)
  tourFezRak67: {
    tiers: [
      { people: 2, low: 1485, high: 1700 },
      { people: 3, low: 1250, high: 1400 },
      { people: 4, low: 1135, high: 1250 },
    ],
    supplement: { low: 375, high: 375 },
    child: { low: 300, high: 315 },
  },

  // 8. GRAN SUR FEZ-RAK 7n8d  (/viajes/gransur/fez_marrakech/programa_7n_8d)
  tourFezRak78: {
    tiers: [
      { people: 2, low: 1600, high: 1815 },
      { people: 3, low: 1370, high: 1515 },
      { people: 4, low: 1250, high: 1370 },
    ],
    supplement: { low: 485, high: 485 },
    child: { low: 305, high: 325 },
  },

  // 9. GRAN SUR FEZ-RAK 8n9d  (/viajes/gransur/fez_marrakech/programa_8n_9d)
  tourFezRak89: {
    tiers: [
      { people: 2, low: 1815, high: 2050 },
      { people: 3, low: 1550, high: 1715 },
      { people: 4, low: 1415, high: 1545 },
    ],
    supplement: { low: 535, high: 535 },
    child: { low: 350, high: 370 },
  },

  // 10. GRAN SUR FEZ-RAK 9n10d  (/viajes/gransur/fez_marrakech/programa_9n_10d)
  tourFezRak910: {
    tiers: [
      { people: 2, low: 2000, high: 2250 },
      { people: 3, low: 1700, high: 1880 },
      { people: 4, low: 1550, high: 1690 },
    ],
    supplement: { low: 580, high: 580 },
    child: { low: 400, high: 420 },
  },

  // 11. GRAN SUR FEZ-RAK 7n8d con Sidi Ali  (/viajes/gransur/fez_sidiali_marrakech/programa_7n_8d)
  tourFezSidialiRak78: {
    tiers: [
      { people: 2, low: 1770, high: 2000 },
      { people: 3, low: 1505, high: 1660 },
      { people: 4, low: 1370, high: 1495 },
    ],
    supplement: { low: 475, high: 475 },
    child: { low: 380, high: 400 },
  },

  // 12. GRAN SUR FEZ-RAK 8n9d con Sidi Ali  (/viajes/gransur/fez_sidiali_marrakech/programa_8n_9d)
  tourFezSidialiRak89: {
    tiers: [
      { people: 2, low: 1895, high: 2120 },
      { people: 3, low: 1625, high: 1785 },
      { people: 4, low: 1495, high: 1615 },
    ],
    supplement: { low: 585, high: 585 },
    child: { low: 390, high: 405 },
  },

  // 13. GRAN SUR FEZ-RAK 9n10d con Sidi Ali  (/viajes/gransur/fez_sidiali_marrakech/programa_9n_10d)
  tourFezSidialiRak910: {
    tiers: [
      { people: 2, low: 2105, high: 2350 },
      { people: 3, low: 1805, high: 1975 },
      { people: 4, low: 1655, high: 1790 },
    ],
    supplement: { low: 635, high: 635 },
    child: { low: 440, high: 455 },
  },

  // 14. GRAN SUR RAK-FEZ 7n8d con Sidi Ali  (/viajes/gransur/marrakech_sidiali_fez/programa_7n_8d)
  tourMarrakechSidialiFez78: {
    tiers: [
      { people: 2, low: 1780, high: 2005 },
      { people: 3, low: 1515, high: 1675 },
      { people: 4, low: 1385, high: 1510 },
    ],
    supplement: { low: 550, high: 550 },
    child: { low: 335, high: 355 },
  },

  // 15. GRAN SUR RAK-FEZ 8n9d con Sidi Ali  (/viajes/gransur/marrakech_sidiali_fez/programa_8n_9d)
  tourMarrakechSidialiFez89: {
    tiers: [
      { people: 2, low: 1895, high: 2120 },
      { people: 3, low: 1625, high: 1785 },
      { people: 4, low: 1495, high: 1615 },
    ],
    supplement: { low: 585, high: 585 },
    child: { low: 390, high: 405 },
  },

  // 16. GRAN SUR RAK-FEZ 9n10d con Sidi Ali  (/viajes/gransur/marrakech_sidiali_fez/programa_9n_10d)
  tourMarrakechSidialiFez910: {
    tiers: [
      { people: 2, low: 2105, high: 2350 },
      { people: 3, low: 1805, high: 1975 },
      { people: 4, low: 1655, high: 1790 },
    ],
    supplement: { low: 635, high: 635 },
    child: { low: 440, high: 455 },
  },

  // 17. Tanger - Marrakech 8n9d  (/viajes/gransur/tanger-rak/programa_8n_9d)
  tourTangerRak89: {
    tiers: [
      { people: 2, low: 2070, high: 2325 },
      { people: 3, low: 1715, high: 1890 },
      { people: 4, low: 1535, high: 1675 },
    ],
    supplement: { low: 430, high: 430 },
    child: { low: 395, high: 415 },
  },

  // 18. Tanger - Marrakech 9n10d  (/viajes/gransur/tanger-rak/programa_9n_10d)
  tourTangerRak910: {
    tiers: [
      { people: 2, low: 2280, high: 2555 },
      { people: 3, low: 1890, high: 2080 },
      { people: 4, low: 1695, high: 1845 },
    ],
    supplement: { low: 480, high: 480 },
    child: { low: 440, high: 465 },
  },

  // 28. Ozz-Fez + LL 5n6d  (/viajes/gransur/ozz_sidiali_fez/programa_5n_6d)
  tourOzzSidialiFez56: {
    tiers: [
      { people: 2, low: 1360, high: 1500 },
      { people: 3, low: 1160, high: 1260 },
      { people: 4, low: 1060, high: 1135 },
    ],
    supplement: { low: 315, high: 315 },
    child: { low: 325, high: 335 },
  },

  // 29. Ozz-Fez + LL 6n7d  (/viajes/gransur/ozz_sidiali_fez/programa_6n_7d)
  tourOzzSidialiFez67: {
    tiers: [
      { people: 2, low: 1540, high: 1705 },
      { people: 3, low: 1305, high: 1425 },
      { people: 4, low: 1190, high: 1280 },
    ],
    supplement: { low: 360, high: 360 },
    child: { low: 370, high: 380 },
  },

  // 30. Ozz-Fez + LL 7n8d  (/viajes/gransur/ozz_sidiali_fez/programa_7n_8d)
  tourOzzSidialiFez78: {
    tiers: [
      { people: 2, low: 1750, high: 1935 },
      { people: 3, low: 1485, high: 1615 },
      { people: 4, low: 1350, high: 1455 },
    ],
    supplement: { low: 405, high: 405 },
    child: { low: 415, high: 435 },
  },

  // 31. Fez-Ozz + LL 5n6d  (/viajes/gransur/fez_sidiali_ozz/programa_5n_6d)
  tourFezSidialiOzz56: {
    tiers: [
      { people: 2, low: 1360, high: 1500 },
      { people: 3, low: 1160, high: 1260 },
      { people: 4, low: 1060, high: 1135 },
    ],
    supplement: { low: 315, high: 315 },
    child: { low: 325, high: 335 },
  },

  // 32. Fez-Ozz + LL 6n7d  (/viajes/gransur/fez_sidiali_ozz/programa_6n_7d)
  tourFezSidialiOzz67: {
    tiers: [
      { people: 2, low: 1540, high: 1705 },
      { people: 3, low: 1305, high: 1425 },
      { people: 4, low: 1190, high: 1280 },
    ],
    supplement: { low: 360, high: 360 },
    child: { low: 370, high: 380 },
  },

  // 33. Fez-Ozz + LL 7n8d  (/viajes/gransur/fez_sidiali_ouarzazate/programa_7n_8d)
  tourFezSidialiOzz78: {
    tiers: [
      { people: 2, low: 1750, high: 1935 },
      { people: 3, low: 1485, high: 1615 },
      { people: 4, low: 1350, high: 1455 },
    ],
    supplement: { low: 405, high: 405 },
    child: { low: 415, high: 435 },
  },

  // 40. Marrakech - Essaouira 4n5d  (/viajes/marrakech_essaouira/programa_4n_5d)
  tourMarrakechEss45: {
    tiers: [
      { people: 2, low: 790, high: 790 },
      { people: 3, low: 710, high: 710 },
      { people: 4, low: 665, high: 665 },
    ],
  },

  // 41. Marrakech - Essaouira 6n7d  (/viajes/marrakech_essaouira/programa_6n_7d)
  tourMarrakechEss67: {
    tiers: [
      { people: 2, low: 1040, high: 1040 },
      { people: 3, low: 955, high: 955 },
      { people: 4, low: 915, high: 915 },
    ],
  },

  // 42. Rak - Erg Chebbi - Rak 5n6d  (/viajes/marrakech_ergchebbi_marrakech/programa_5n_6d)
  tourMarrakechLoop56: {
    tiers: [
      { people: 2, low: 1225, high: 1400 },
      { people: 3, low: 1070, high: 1185 },
      { people: 4, low: 990, high: 1080 },
    ],
    supplement: { low: 470, high: 470 },
    child: { low: 170, high: 175 },
  },

  // 43. Rak - Erg Chebbi - Rak 6n7d  (/viajes/marrakech_ergchebbi_marrakech/programa_6n_7d)
  tourMarrakechLoop67: {
    tiers: [
      { people: 2, low: 1405, high: 1600 },
      { people: 3, low: 1220, high: 1350 },
      { people: 4, low: 1125, high: 1225 },
    ],
    supplement: { low: 515, high: 515 },
    child: { low: 215, high: 215 },
  },

  // 44. Rak - Erg Chebbi - Rak 7n8d  (/viajes/marrakech_ergchebbi_marrakech/programa_7n_8d)
  tourMarrakechLoop78: {
    tiers: [
      { people: 2, low: 1590, high: 1805 },
      { people: 3, low: 1370, high: 1515 },
      { people: 4, low: 1255, high: 1375 },
    ],
    supplement: { low: 560, high: 560 },
    child: { low: 260, high: 280 },
  },

  // 45. Rak - Erh 4n5d  (/viajes/marrakech_ergchebbi/programa_4n_5d)
  tourMarrakechErg45: {
    tiers: [
      { people: 2, low: 1035, high: 1155 },
      { people: 3, low: 890, high: 970 },
      { people: 4, low: 815, high: 880 },
    ],
    supplement: { low: 290, high: 290 },
    child: { low: 200, high: 210 },
  },

  // 46. Rak - Erh 5n6d (1 noche Rak)  (/viajes/marrakech_ergchebbi/programa_5n_6d)
  tourMarrakechErg56: {
    tiers: [
      { people: 2, low: 1235, high: 1370 },
      { people: 3, low: 1055, high: 1150 },
      { people: 4, low: 960, high: 1040 },
    ],
    supplement: { low: 335, high: 335 },
    child: { low: 240, high: 255 },
  },

  // 48. Rak - Erh 6n7d  (/viajes/marrakech_ergchebbi/programa_6n_7d)
  tourMarrakechErg67: {
    tiers: [
      { people: 2, low: 1350, high: 1490 },
      { people: 3, low: 1170, high: 1270 },
      { people: 4, low: 1080, high: 1155 },
    ],
    supplement: { low: 450, high: 450 },
    child: { low: 250, high: 260 },
  },

  // 49. Rak - Erh 7n8d  (/viajes/marrakech_ergchebbi/programa_7n_8d)
  tourMarrakechErg78: {
    tiers: [
      { people: 2, low: 1560, high: 1720 },
      { people: 3, low: 1345, high: 1460 },
      { people: 4, low: 1240, high: 1330 },
    ],
    supplement: { low: 495, high: 495 },
    child: { low: 300, high: 315 },
  },

  // 50. Erh - Rak 4n5d  (/viajes/ergchebbi_marrakech/programa_4n_5d)
  tourErgMarrakech45: {
    tiers: [
      { people: 2, low: 1035, high: 1155 },
      { people: 3, low: 890, high: 970 },
      { people: 4, low: 815, high: 880 },
    ],
    supplement: { low: 290, high: 290 },
    child: { low: 200, high: 210 },
  },

  // 51. Erh - Rak 5n6d  (/viajes/ergchebbi_marrakech/programa_5n_6d)
  tourErgMarrakech56: {
    tiers: [
      { people: 2, low: 1235, high: 1370 },
      { people: 3, low: 1055, high: 1150 },
      { people: 4, low: 960, high: 1040 },
    ],
    supplement: { low: 335, high: 335 },
    child: { low: 240, high: 255 },
  },

  // 52. Erh - Rak 6n7d  (/viajes/ergchebbi_marrakech/programa_6n_7d)
  tourErgMarrakech67: {
    tiers: [
      { people: 2, low: 1445, high: 1600 },
      { people: 3, low: 1230, high: 1340 },
      { people: 4, low: 1120, high: 1215 },
    ],
    supplement: { low: 380, high: 380 },
    child: { low: 290, high: 310 },
  },

  // 53. Erh - Rak 7n8d  (/viajes/ergchebbi_marrakech/programa_7n_8d)
  tourErgMarrakech78: {
    tiers: [
      { people: 2, low: 1560, high: 1720 },
      { people: 3, low: 1345, high: 1460 },
      { people: 4, low: 1240, high: 1330 },
    ],
    supplement: { low: 495, high: 495 },
    child: { low: 300, high: 315 },
  },

  // 54. Combinado Atlas - Desierto 4n5d  (/viajes/atlas_desierto/programa_4n_5d)
  tourAtlasDesierto45: {
    tiers: [
      { people: 2, low: 1030, high: 1105 },
      { people: 3, low: 885, high: 940 },
      { people: 4, low: 810, high: 855 },
    ],
    supplement: { low: 220, high: 220 },
    child: { low: 235, high: 235 },
  },

  // 55. Combinado Atlas - Desierto 5n6d  (/viajes/atlas_desierto/programa_5n_6d)
  tourAtlasDesierto56: {
    tiers: [
      { people: 2, low: 1255, high: 1350 },
      { people: 3, low: 1075, high: 1145 },
      { people: 4, low: 985, high: 1045 },
    ],
    supplement: { low: 270, high: 270 },
    child: { low: 285, high: 300 },
  },

  // 56. Combinado Atlas - Desierto 6n7d  (/viajes/atlas_desierto/programa_6n_7d)
  tourAtlasDesierto67: {
    tiers: [
      { people: 2, low: 1455, high: 1560 },
      { people: 3, low: 1240, high: 1320 },
      { people: 4, low: 1130, high: 1195 },
    ],
    supplement: { low: 300, high: 300 },
    child: { low: 325, high: 340 },
  },

  // 58. ERH-LAC-FEZ 5n6d  (/viajes/errachidia-atlas-fez/programa_5n_6d)
  tourErrAtlasFez56: {
    tiers: [
      { people: 2, low: 1265, high: 1395 },
      { people: 3, low: 1085, high: 1175 },
      { people: 4, low: 995, high: 1065 },
    ],
    supplement: { low: 315, high: 315 },
    child: { low: 320, high: 330 },
  },

  // 60. FEZ-LAC-ERH 5n6d  (/viajes/fez-atlas-errachidia/programa_5n_6d)
  tourFezAtlasErr56: {
    tiers: [
      { people: 2, low: 1305, high: 1435 },
      { people: 3, low: 1120, high: 1215 },
      { people: 4, low: 1030, high: 1105 },
    ],
    supplement: { low: 315, high: 315 },
    child: { low: 320, high: 335 },
  },

  // 61. Combinado Desierto - Atlas 4n5d  (/viajes/desierto_atlas/programa_4n_5d)
  tourDesiertoAtlas45: {
    tiers: [
      { people: 2, low: 1030, high: 1105 },
      { people: 3, low: 885, high: 940 },
      { people: 4, low: 810, high: 855 },
    ],
    supplement: { low: 220, high: 220 },
    child: { low: 235, high: 245 },
  },

  // 62. Combinado Desierto - Atlas 5n6d  (/viajes/desierto_atlas/programa_5n_6d)
  tourDesiertoAtlas56: {
    tiers: [
      { people: 2, low: 1255, high: 1350 },
      { people: 3, low: 1075, high: 1145 },
      { people: 4, low: 985, high: 1045 },
    ],
    supplement: { low: 270, high: 270 },
    child: { low: 285, high: 300 },
  },

  // 63. Combinado Desierto - Atlas 6n7d  (/viajes/desierto_atlas/programa_6n_7d)
  tourDesiertoAtlas67: {
    tiers: [
      { people: 2, low: 1455, high: 1560 },
      { people: 3, low: 1240, high: 1320 },
      { people: 4, low: 1130, high: 1195 },
    ],
    supplement: { low: 300, high: 300 },
    child: { low: 325, high: 340 },
  },

  // 64. Tanger a Fez 4n5d  (/viajes/norte/tanger_fez/programa_4n_5d)
  tourTangerFez45: {
    tiers: [
      { people: 2, low: 1050, high: 1050 },
      { people: 3, low: 865, high: 865 },
      { people: 4, low: 775, high: 775 },
    ],
  },

  // 65. Tanger a Fez 5n6d  (/viajes/norte/tanger_fez/programa_5n_6d)
  tourTangerFez56: {
    tiers: [
      { people: 2, low: 1245, high: 1245 },
      { people: 3, low: 1025, high: 1025 },
      { people: 4, low: 915, high: 915 },
    ],
  },

  // 66. Fez a Tanger 5n6d  (/viajes/norte/fez_tanger/programa_5n_6d)
  tourFezTanger56: {
    tiers: [
      { people: 2, low: 1200, high: 1200 },
      { people: 3, low: 1010, high: 1010 },
      { people: 4, low: 920, high: 920 },
    ],
  },

  // 67. Fez a Tanger 6n7d  (/viajes/norte/fez_tanger/programa_6n_7d)
  tourFezTanger67: {
    tiers: [
      { people: 2, low: 1380, high: 1380 },
      { people: 3, low: 1155, high: 1155 },
      { people: 4, low: 1040, high: 1040 },
    ],
  },

  // 68. Ciudades Imperiales 4n5d  (/viajes/norte/ciudades_imperiales/programa_4n_5d)
  tourCiudadesImperiales45: {
    tiers: [
      { people: 2, low: 1175, high: 1175 },
      { people: 3, low: 965, high: 965 },
      { people: 4, low: 860, high: 860 },
    ],
  },

  // 69. Ciudades Imperiales 6n7d  (/viajes/norte/ciudades_imperiales/programa_6n_7d)
  tourCiudadesImperiales67: {
    tiers: [
      { people: 2, low: 1450, high: 1450 },
      { people: 3, low: 1190, high: 1190 },
      { people: 4, low: 1060, high: 1060 },
    ],
  },

  // 70. Ciudades Imperiales - Rif 6n7d  (/viajes/norte/ciudadesimperiales_rif/programa_6n_7d)
  tourCiudadesImperialesRif67: {
    tiers: [
      { people: 2, low: 1580, high: 1580 },
      { people: 3, low: 1310, high: 1310 },
      { people: 4, low: 1175, high: 1175 },
    ],
  },

  // 71. Ciudades Imperiales - Rif 7n8d  (/viajes/norte/ciudadesimperiales_rif/programa_7n_8d)
  tourCiudadesImperialesRif78: {
    tiers: [
      { people: 2, low: 1865, high: 1865 },
      { people: 3, low: 1545, high: 1545 },
      { people: 4, low: 1380, high: 1380 },
    ],
  },

  // 72. Escapate a Fez 2n3d  (/viajes/escapadas/fez/programa_2n_3d)
  tourEscapadaFez23: {
    tiers: [
      { people: 2, low: 320, high: 320 },
      { people: 3, low: 285, high: 285 },
      { people: 4, low: 270, high: 270 },
    ],
  },

  // 73. Escapada a Fez y Meknes 3n4d  (/viajes/escapadas/fez/programa_3n_4d)
  tourEscapadaFez34: {
    tiers: [
      { people: 2, low: 595, high: 595 },
      { people: 3, low: 510, high: 510 },
      { people: 4, low: 470, high: 470 },
    ],
  },

  // 74. Fez + Aguelmame 3n4d  (/viajes/escapadas/fez_sidiali/programa_3n_4d)
  tourEscapadaFezSidiali34: {
    tiers: [
      { people: 2, low: 805, high: 805 },
      { people: 3, low: 705, high: 705 },
      { people: 4, low: 650, high: 650 },
    ],
  },

  // 75. Fez + Aguelmame 4n5d  (/viajes/escapadas/fez_sidiali/programa_4n_5d)
  tourEscapadaFezSidiali45: {
    tiers: [
      { people: 2, low: 1080, high: 1080 },
      { people: 3, low: 920, high: 920 },
      { people: 4, low: 840, high: 840 },
    ],
  },

  // 76. Escapate al Atlas Ozz-Ozz 3n4d  (/viajes/escapadas/atlas/programa_3n_4d)
  tourEscapadaAtlas34: {
    tiers: [
      { people: 2, low: 685, high: 735 },
      { people: 3, low: 575, high: 615 },
      { people: 4, low: 525, high: 560 },
    ],
    supplement: { low: 125, high: 125 },
    child: { low: 140, high: 150 },
  },

  // 77. Marrakech Escapada 2n3d  (/viajes/escapadas/marrakech/programa_2n_3d)
  tourEscapadaMarrakech23: {
    tiers: [
      { people: 2, low: 340, high: 340 },
      { people: 3, low: 320, high: 320 },
      { people: 4, low: 310, high: 310 },
    ],
  },

  // 78. Marrakech - Agafay 3n4d  (/viajes/escapadas/marrakech_agafay/programa_3n_4d)
  tourEscapadaRakAgafay34: {
    tiers: [
      { people: 2, low: 860, high: 860 },
      { people: 3, low: 765, high: 765 },
      { people: 4, low: 720, high: 720 },
    ],
  },

  // 79. Escapate al Desierto Erh-Erh 3n4d  (/viajes/escapadas/desierto/programa_3n_4d)
  tourEscapadaDesierto34: {
    tiers: [
      { people: 2, low: 775, high: 815 },
      { people: 3, low: 675, high: 705 },
      { people: 4, low: 625, high: 655 },
    ],
    supplement: { low: 175, high: 175 },
    child: { low: 185, high: 195 },
  },

  // 80. Escapada a Tanger 3n4d  (/viajes/escapadas/tanger)
  tourEscapadaTanger: {
    tiers: [
      { people: 2, low: 805, high: 805 },
      { people: 3, low: 660, high: 660 },
      { people: 4, low: 590, high: 590 },
    ],
  },

  // 81. Rak - Erg Chebbi - Rak 2n3d  (/viajes/marrakech_ergchebbi_marrakech/programa_2n_3d)
  tourMarrakechLoop23: {
    tiers: [
      { people: 2, low: 855, high: 930 },
      { people: 3, low: 690, high: 740 },
      { people: 4, low: 605, high: 645 },
    ],
    supplement: { low: 130, high: 130 },
    child: { low: 145, high: 150 },
  },

  // 82. Rak - Erg Chebbi - Rak 3n4d  (/viajes/marrakech_ergchebbi_marrakech/programa_3n_4d)
  tourMarrakechLoop34: {
    tiers: [
      { people: 2, low: 1060, high: 1155 },
      { people: 3, low: 860, high: 925 },
      { people: 4, low: 760, high: 815 },
    ],
    supplement: { low: 175, high: 175 },
    child: { low: 195, high: 205 },
  },
};

let _override = {};

/* Fed by the program-pricing store (admin overrides from /api/program-pricing).
   When a routeId has an override it wins over the hardcoded default above. */
export const setProgramOverride = (map) => {
  _override = map || {};
};

const _entry = (routeId) =>
  (routeId && (_override[routeId] || PROGRAM_PRICING[routeId])) || null;

/* Per-program tier array for a routeId, or null (route uses global pricing). */
export const getProgramTiers = (routeId) => {
  const e = _entry(routeId);
  return (e && e.tiers) || null;
};

/* Per-program single-supplement / child prices, or null when the program
   has neither. Shape: { supplement: {low,high}|null, child: {low,high}|null }. */
export const getProgramExtras = (routeId) => {
  const e = _entry(routeId);
  if (!e) return null;
  const supplement = e.supplement || null;
  const child = e.child || null;
  if (!supplement && !child) return null;
  return { supplement, child };
};
