/* ============================================================
   tripPackingNotes.js
   ----
   Route-specific "travel notes" written like sticky notes / post-its
   left by someone who already did the route — practical packing tips
   to prepare before departure. Trilingual (es/en/fr).

   First pilot: tourAtlasDesierto67 (/viajes/atlas_desierto/programa_6n_7d).
   To replicate on other trips, add another entry keyed by routeId.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

export const TRIP_PACKING_NOTES = {
  // Atlas + Desierto · 6 noches / 7 días
  tourAtlasDesierto67: [
    {
      theme: "clothing",
      accent: "#C16542",
      tint: "#FBF1DD",
      tagline: T("Por capas", "Layer up", "En couches"),
      title: T(
        "Ropa para el Atlas y el desierto",
        "Clothing for the Atlas & the desert",
        "Vêtements pour l'Atlas et le désert",
      ),
      items: [
        T(
          "Viste por capas: una mañana fresca en el Alto Atlas puede ser una tarde calurosa en las dunas.",
          "Dress in layers: a cool High Atlas morning can turn into a hot afternoon on the dunes.",
          "Habillez-vous en couches : une matinée fraîche dans le Haut Atlas peut devenir un après-midi chaud sur les dunes.",
        ),
        T(
          "Un forro polar o jersey para las noches: tanto en el Atlas como en el desierto refresca al caer el sol.",
          "A fleece or jumper for the nights: both the Atlas and the desert cool down after sunset.",
          "Une polaire ou un pull pour les nuits : l'Atlas comme le désert se rafraîchissent au coucher du soleil.",
        ),
        T(
          "Calzado cerrado y ya usado para caminar por kasbahs, gargantas y arena.",
          "Closed, broken-in shoes for walking through kasbahs, gorges and sand.",
          "Des chaussures fermées et déjà rodées pour marcher dans les kasbahs, les gorges et le sable.",
        ),
        T(
          "Un pañuelo grande (cheche): protege del sol, del viento y de la arena fina.",
          "A large scarf (cheche): it shields you from sun, wind and fine sand.",
          "Un grand foulard (cheche) : il protège du soleil, du vent et du sable fin.",
        ),
      ],
    },
    {
      theme: "accessories",
      accent: "#A07042",
      tint: "#F3EEE0",
      tagline: T("No los olvides", "Don't forget", "À ne pas oublier"),
      title: T(
        "Accesorios imprescindibles",
        "Must-have accessories",
        "Accessoires indispensables",
      ),
      items: [
        T(
          "Gafas de sol y protección solar SPF 50: el sol del Sáhara aprieta de verdad.",
          "Sunglasses and SPF 50 sunscreen: the Sahara sun is no joke.",
          "Lunettes de soleil et crème SPF 50 : le soleil du Sahara tape fort.",
        ),
        T(
          "Gorra o sombrero de ala ancha para las horas centrales del día.",
          "A cap or wide-brimmed hat for the midday hours.",
          "Une casquette ou un chapeau à large bord pour les heures les plus chaudes.",
        ),
        T(
          "Crema labial e hidratante: el ambiente es muy seco y la piel lo nota.",
          "Lip balm and moisturiser: the air is very dry and your skin will feel it.",
          "Baume à lèvres et crème hydratante : l'air est très sec et la peau le ressent.",
        ),
        T(
          "Botella reutilizable y gel de manos para los trayectos en 4x4.",
          "A reusable bottle and hand gel for the 4x4 legs.",
          "Une gourde réutilisable et du gel hydroalcoolique pour les trajets en 4x4.",
        ),
      ],
    },
    {
      theme: "desert",
      accent: "#5A7F9C",
      tint: "#ECEFF1",
      tagline: T("Bajo las estrellas", "Under the stars", "Sous les étoiles"),
      title: T(
        "Noches en el desierto y rutas",
        "Desert nights & travel days",
        "Nuits au désert et trajets",
      ),
      items: [
        T(
          "Linterna frontal y batería externa: en el bivouac no siempre hay enchufes.",
          "A head torch and a power bank: the bivouac doesn't always have plugs.",
          "Une lampe frontale et une batterie externe : le bivouac n'a pas toujours de prises.",
        ),
        T(
          "Una bolsa pequeña para la noche en el campamento; la maleta grande se queda en el 4x4.",
          "A small bag for the night at camp; your big suitcase stays in the 4x4.",
          "Un petit sac pour la nuit au campement ; la grande valise reste dans le 4x4.",
        ),
        T(
          "Algo de abrigo para dormir: el desierto sorprende con su frescor nocturno.",
          "Something warm for sleeping: the desert surprises with its cool nights.",
          "De quoi vous couvrir pour dormir : le désert surprend par ses nuits fraîches.",
        ),
        T(
          "Algo de efectivo en dírhams para propinas, té y pequeñas compras por el camino.",
          "Some cash in dirhams for tips, mint tea and small purchases along the way.",
          "Un peu d'espèces en dirhams pour les pourboires, le thé et les petits achats en route.",
        ),
      ],
    },
  ],
};

export const getTripPackingNotes = (routeId) => TRIP_PACKING_NOTES[routeId] || null;
