/* ============================================================
   Centralised pricing configuration (single source of truth).
   ------------------------------------------------------------
   • The PRICE NUMBERS (`tiers`) can also be overridden globally
     from /admin (stored in Supabase) — see lib/pricingStore.js.
     The admin override is merged on top of these defaults.
   • Labels / season definitions / notes live here (trilingual)
     and rarely change.
   To roll out the FINAL commercial prices later: edit `tiers`
   here OR edit them from the /admin "Precios" tab — no page or
   component changes required anywhere on the site.
============================================================ */

export const DEFAULT_PRICING = {
  currency: "EUR",

  // --- Editable price matrix (also overridable from /admin) ---
  // Package: Accommodation & Excursions · By 4x4 vehicle.
  // Prices are PER PERSON, based on double/triple room occupancy.
  tiers: [
    { people: 2, low: 1010, high: 1085 },
    { people: 3, low: 865, high: 920 },
    { people: 4, low: 790, high: 835 },
  ],

  // --- Structure / copy (config-only, trilingual) ---
  package: {
    es: "Paquete de alojamiento y excursiones",
    en: "Accommodation & excursions package",
    fr: "Forfait hébergement et excursions",
  },
  vehicle: {
    es: "En vehículo 4x4",
    en: "By 4x4 vehicle",
    fr: "En véhicule 4x4",
  },
  seasons: {
    high: {
      label: { es: "Temporada alta", en: "High season", fr: "Haute saison" },
      months: {
        es: ["Abril", "Agosto", "Octubre", "Semana Santa", "Navidad", "Nochevieja", "Festivos nacionales (España)"],
        en: ["April", "August", "October", "Easter Week", "Christmas", "New Year's Eve", "Spanish national holidays"],
        fr: ["Avril", "Août", "Octobre", "Semaine Sainte", "Noël", "Saint-Sylvestre", "Jours fériés nationaux (Espagne)"],
      },
    },
    low: {
      label: { es: "Temporada baja", en: "Low season", fr: "Basse saison" },
      desc: {
        es: "Todas las fechas no incluidas en temporada alta.",
        en: "All dates not included in high season.",
        fr: "Toutes les dates non comprises en haute saison.",
      },
    },
  },
  note: {
    es: "* Precios por persona basados en ocupación en habitación doble y triple. Consúltanos para otras configuraciones de habitación y descuentos para niños.",
    en: "* Prices per person based on double and triple room occupancy. Please consult us for alternative room configurations and children's discounts.",
    fr: "* Prix par personne basés sur une occupation en chambre double et triple. Consultez-nous pour d'autres configurations de chambre et les réductions enfants.",
  },

  labels: {
    from: { es: "Desde", en: "From", fr: "Dès" },
    perPerson: { es: "por persona", en: "per person", fr: "par personne" },
    travellers: { es: "Viajeros", en: "Travellers", fr: "Voyageurs" },
    people: { es: "personas", en: "people", fr: "personnes" },
    overline: { es: "Precios", en: "Pricing", fr: "Tarifs" },
    title: { es: "Precios por persona", en: "Prices per person", fr: "Prix par personne" },
    subtitle: {
      es: "Paquete de alojamiento y excursiones en vehículo 4x4 con chófer. Dos temporadas, tarifa por persona según el número de viajeros.",
      en: "Accommodation & excursions package by chauffeured 4x4. Two seasons, per-person rate based on the number of travellers.",
      fr: "Forfait hébergement et excursions en 4x4 avec chauffeur. Deux saisons, tarif par personne selon le nombre de voyageurs.",
    },
    seasonsTitle: { es: "Definición de temporadas", en: "Season definitions", fr: "Définition des saisons" },
    cta: { es: "Solicitar este viaje", en: "Request this trip", fr: "Demander ce voyage" },
    placeholderNotice: {
      es: "Precios orientativos provisionales — sujetos a confirmación.",
      en: "Provisional indicative prices — subject to confirmation.",
      fr: "Prix indicatifs provisoires — sous réserve de confirmation.",
    },
  },
};

/* Merge an /admin override (numbers) on top of the config defaults. */
export const mergePricing = (override) => {
  if (!override || typeof override !== "object") return DEFAULT_PRICING;
  const tiers =
    Array.isArray(override.tiers) && override.tiers.length
      ? override.tiers.map((t) => ({
          people: Number(t.people),
          low: Number(t.low),
          high: Number(t.high),
        }))
      : DEFAULT_PRICING.tiers;
  return {
    ...DEFAULT_PRICING,
    currency: override.currency || DEFAULT_PRICING.currency,
    tiers,
  };
};

/* Lowest configured price across every tier & season → the "From" price. */
export const getFromPrice = (pricing = DEFAULT_PRICING) => {
  const tiers = (pricing && pricing.tiers) || DEFAULT_PRICING.tiers;
  let min = Infinity;
  for (const t of tiers) {
    if (typeof t.low === "number" && t.low > 0) min = Math.min(min, t.low);
    if (typeof t.high === "number" && t.high > 0) min = Math.min(min, t.high);
  }
  return Number.isFinite(min) ? min : null;
};

/* €1.010 style formatting (es-ES grouping). */
export const fmtEuro = (n) => `€${Number(n).toLocaleString("es-ES")}`;

/* Small trilingual picker helper. */
export const pickLang = (obj, lang) => (obj && (obj[lang] ?? obj.es)) || "";
