import { journeyPostcardFor } from "./journeyPostcards";
import { metaAllLangs } from "./programMeta";
import { TRIP_PROGRAMS } from "./tripPrograms";

test.each(["tourMarrakechSidialiFez78", "tourMarrakechSidialiFez89", "tourMarrakechSidialiFez910"])(
  "%s has route-specific summary copy in all languages", (routeId) => {
    const { program, variant } = TRIP_PROGRAMS[routeId];
    expect(variant).toBe("msf");
    for (const lang of ["es", "en", "fr"]) {
      expect(metaAllLangs(program, variant, "title")[lang]).toContain("Sidi Ali");
      expect(metaAllLangs(program, variant, "description")[lang].join(" ")).toContain("Sidi Ali");
    }
  },
);

test.each(["23", "34", "45"])("short escape %s reuses its matching Marrakech loop postcard", (days) => {
  expect(journeyPostcardFor(`tourEscapadaRakErgRak${days}`)).toBe(
    journeyPostcardFor(`tourMarrakechLoop${days}`),
  );
});
