import { PROGRAM_CI_45 } from "./programs/ciudadesImperiales45";
import { PROGRAM_CI_56 } from "./programs/ciudadesImperiales56";
import { PROGRAM_CI_RIF_67 } from "./programs/ciudadesImperialesRif67";
import { PROGRAM_CI_RIF_78 } from "./programs/ciudadesImperialesRif78";
import { HUB_NORTE_CIUDADES_IMPERIALES } from "./itineraryHubs";
import { TRIP_PROGRAMS } from "./tripPrograms";
import { ALL_TRIPS } from "./allTripsCatalog";
import { pathFor, resolvePath } from "./routes";
import { getProgramTiers } from "./programPricing";

const programmes = [
  [PROGRAM_CI_45, 4, "programa_4n_5d"],
  [PROGRAM_CI_56, 5, "programa_5n_6d"],
  [PROGRAM_CI_RIF_67, 6, "programa_6n_7d"],
  [PROGRAM_CI_RIF_78, 7, "programa_7n_8d"],
];

describe("Ciudades Imperiales 2026 documents", () => {
  test.each(programmes)("has a dedicated route and one day per calendar day", (program, nights, slug) => {
    expect(program.days).toHaveLength(nights + 1);
    expect(TRIP_PROGRAMS[program.routeId].program).toBe(program);
    expect(ALL_TRIPS.some((trip) => trip.routeId === program.routeId && trip.nights === nights)).toBe(true);
    for (const lang of ["es", "en", "fr"]) {
      const path = pathFor(lang, program.routeId);
      const duration = slug.replace("programa_", "");
      const suffix = lang === "es" ? `programa_${duration}` : `${lang === "en" ? "program" : "programme"}-${duration.replaceAll("_", "-").replace(/d$/, lang === "fr" ? "j" : "d")}`;
      expect(path).toContain(suffix);
      expect(resolvePath(path)).toMatchObject({ routeId: program.routeId, lang });
      expect(program.days.every((day) => day.body[lang])).toBe(true);
    }
    expect(HUB_NORTE_CIUDADES_IMPERIALES.programs.some((item) => item.link === program.routeId)).toBe(true);
    expect(getProgramTiers(program.routeId)).toHaveLength(3);
  });

  test("keeps the five-night route distinct from the old six-night Casablanca–Marrakech route", () => {
    expect(PROGRAM_CI_56.meta.es.airports).toContain("Salida Fez");
    expect(PROGRAM_CI_56.days[1].title.es).toContain("Chefchaouen");
    expect(PROGRAM_CI_56.days[2].title.es).toContain("Volubilis");
    expect(HUB_NORTE_CIUDADES_IMPERIALES.programs.some((item) => item.link === "tourCiudadesImperiales67")).toBe(false);
  });
});
