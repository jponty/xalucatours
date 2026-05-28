/* ============================================================
   imageBank.js
   ----
   Centralised Unsplash photo bank.

   Every ID in this file has been:
     1) downloaded as a thumbnail
     2) verified to return HTTP 200
     3) visually identified as authentically MOROCCAN content
        matching the semantic key it is mapped to.

   Use:
     import { IMG, banner } from "@/lib/imageBank";
     <img src={IMG.koutoubia} ... />
     <img src={banner("dunes", 1600)} ... />

   When adding new images, paste the unsplash photo ID, run a
   curl HEAD check (200) and add a comment with what it shows.
============================================================ */

const U = (id, w = 1200, q = 85) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

/* Semantic, verified Moroccan photo IDs.
   Annotation format:  // {SUBJECT} · {PHOTOGRAPHER if known} */
export const IMG = {
  /* --- Sahara · dunes · camels --------------------------- */
  dunes:           U("photo-1542401886-65d6c61db217"),   // golden Sahara dunes
  dunesRocky:      U("photo-1547234935-80c7145ec969"),   // rocky desert plateau
  camelCaravan:    U("photo-1489493585363-d69421e0edd3"), // camel caravan dunes
  camelDunes:      U("photo-1559586616-361e18714958"),   // camels in dunes
  desertWoman:     U("photo-1488161628813-04466f872be2"), // woman + camels (Sahara)

  /* --- Atlas · mountains · valleys ----------------------- */
  atlasMisty:      U("photo-1469474968028-56623f02e42e"), // misty Atlas range
  atlasSnowy:      U("photo-1597212618440-806262de4f6b"), // Koutoubia + snow Atlas
  atlasValley:     U("photo-1568241360857-e23e825c4e08"), // aerial valley + houses
  atlasVillage:    U("photo-1489749798305-4fea3ae63d43"), // Berber adobe houses

  /* --- Chefchaouen · blue city --------------------------- */
  chefBlueCity:    U("photo-1569383746724-6f1b882b8f46"), // blue houses on cliff
  chefAlley:       U("photo-1538600838042-6a0c694ffab5"), // blue alley + carpets
  chefCourtyard:   U("photo-1564507004663-b6dfb3c824d5"), // blue courtyard + plants
  chefStreet:      U("photo-1515386474292-47555758ef2e"), // blue street + boats

  /* --- Kasbahs · adobe · gates --------------------------- */
  kasbahArch:      U("photo-1549140600-78c9b8275e9d"),   // arched brick kasbah
  kasbahGate:      U("photo-1570133435536-7ececf000ef6"), // ornate arched entry

  /* --- Marrakech · Koutoubia · medina ------------------- */
  koutoubia:       U("photo-1653323792487-6ecc6217040b"), // Koutoubia minaret + carriage
  medinaPeople:    U("photo-1587974928442-77dc3e0dba72"), // crowded medina street

  /* --- Riad · mosaic · interior -------------------------- */
  riadFountain:    U("photo-1539020140153-e479b8c22e70"), // mosaic courtyard fountain
  riadInterior:    U("photo-1559925523-10de9e23cf90"),   // ornate fountain interior

  /* --- Market · zoco · baskets --------------------------- */
  marketBaskets:   U("photo-1580746738099-1cb74f972feb"), // market wicker baskets

  /* --- Essaouira · coast · port -------------------------- */
  essaouiraPort:   U("photo-1519594445471-0e5f86b3fb09"), // fishing boats + sunset
};

/* Convenience: variable-width helper for hero banners. */
export const banner = (key, w = 1600) => {
  const url = IMG[key];
  if (!url) return IMG.atlasSnowy;
  return url.replace(/w=\d+/, `w=${w}`);
};

/* Curated multi-image collections for hub / category banners.
   Each pick is thematically aligned with the destination. */
export const COLLECTIONS = {
  sur:        [IMG.dunes, IMG.camelCaravan, IMG.kasbahArch, IMG.atlasSnowy],
  norte:      [IMG.chefBlueCity, IMG.chefAlley, IMG.essaouiraPort, IMG.riadFountain],
  escapadas:  [IMG.koutoubia, IMG.medinaPeople, IMG.marketBaskets, IMG.riadInterior],
  aventura:   [IMG.atlasMisty, IMG.atlasValley, IMG.dunesRocky, IMG.kasbahGate],
  marruecos:  [IMG.atlasSnowy, IMG.koutoubia, IMG.dunes, IMG.chefBlueCity],
};

export default IMG;
