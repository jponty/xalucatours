import { getTripProgram } from "@/lib/tripPrograms";
import { metaAllLangs } from "@/lib/programMeta";

const LANGS = ["es", "en", "fr"];

const DURATION = {
  es: (days) => `${Math.max(days - 1, 1)} noches · ${days} días`,
  en: (days) => `${Math.max(days - 1, 1)} nights · ${days} days`,
  fr: (days) => `${Math.max(days - 1, 1)} nuits · ${days} jours`,
};

const cleanTitle = (value = "") => String(value).trim().replace(/[.\s]+$/, "");

/** Canonical programme label used by every testimonial surface. */
export const testimonialProgramLabel = (routeId, fallback = null) => {
  const entry = getTripProgram(routeId);
  if (!entry) return fallback || { es: "Programa Xaluca Tours", en: "Xaluca Tours programme", fr: "Programme Xaluca Tours" };

  const title = metaAllLangs(entry.program, entry.variant, "title");
  const days = Math.max(entry.program?.days?.length || 0, 1);
  return Object.fromEntries(
    LANGS.map((lang) => {
      const resolvedTitle = cleanTitle(title[lang] || title.es);
      return [lang, `${resolvedTitle} · ${DURATION[lang](days)}`];
    })
  );
};

// The home circuit carousel rotates through real, bookable programmes.
export const CIRCUIT_TESTIMONIAL_PROGRAMS = {
  sahara: ["tourMarrakechErg67", "tourDesiertoAtlas56", "tourAtlasDesierto67"],
  imperial: ["tourCiudadesImperiales45", "tourCiudadesImperiales67", "tourCiudadesImperialesRif78"],
  atlas: ["tourEscapadaAtlas34", "tourAtlasDesierto45", "tourFezAtlasErr56"],
  kasbahs: ["tourDesiertoAtlas45", "tourMarrakechFez78", "tourOzzSidialiFez67"],
  north: ["tourTangerFez45", "tourFezTanger56", "tourCiudadesImperialesRif67"],
  short: ["tourEscapadaDesierto34", "tourEscapadaFez23", "tourEscapadaMarrakech23"],
  adventure: ["tourEnduroAventura45", "tourEnduroAventura67", "tourMarrakechLoop56"],
};

export const circuitTestimonialProgram = (slug, index) => {
  const routes = CIRCUIT_TESTIMONIAL_PROGRAMS[slug] || [];
  return routes.length ? routes[index % routes.length] : null;
};
