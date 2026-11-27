import { buildMonthOptions } from "./tripFinder";

test.each(["es", "en", "fr"])("trip finder offers only the next 12 months in %s", (lang) => {
  const months = buildMonthOptions(lang, new Date(2026, 10, 27));
  expect(months).toHaveLength(12);
  expect(months[0]).toMatchObject({ value: "2026-11", year: 2026, month: 11 });
  expect(months.at(-1)).toMatchObject({ value: "2027-10", year: 2027, month: 10 });
});
