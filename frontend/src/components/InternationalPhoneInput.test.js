jest.mock("./ui/popover", () => ({
  Popover: ({ children }) => children,
  PopoverContent: ({ children }) => children,
  PopoverTrigger: ({ children }) => children,
}));

jest.mock("./ui/command", () => ({
  Command: ({ children }) => children,
  CommandEmpty: () => null,
  CommandInput: () => null,
  CommandItem: ({ children }) => children,
  CommandList: ({ children }) => children,
}));

import {
  countryForCallingCode,
  isValidInternationalPhone,
  normalizeIncompleteInternationalPhone,
  normalizeInternationalPhone,
} from "./InternationalPhoneInput";
import { calculateInclusiveTripDays } from "../lib/utils";

describe("international phone helpers", () => {
  test("normalizes formatted international numbers to E.164", () => {
    expect(normalizeInternationalPhone("+34 612 345 678")).toBe("+34612345678");
    expect(normalizeInternationalPhone("+44 20 7946 0958")).toBe("+442079460958");
  });

  test("recognizes unique international prefixes", () => {
    expect(countryForCallingCode("+34")).toBe("ES");
    expect(countryForCallingCode("+212")).toBe("MA");
    expect(countryForCallingCode("+1")).toBe("US");
  });

  test("preserves the plus sign while an international prefix is incomplete", () => {
    expect(normalizeIncompleteInternationalPhone("+")).toBe("+");
    expect(normalizeIncompleteInternationalPhone("+3")).toBe("+3");
  });

  test("requires an international calling code", () => {
    expect(isValidInternationalPhone("+33 6 12 34 56 78")).toBe(true);
    expect(isValidInternationalPhone("612 345 678")).toBe(false);
  });
});
describe("travel duration helpers", () => {
  test("counts both the departure and return dates", () => {
    expect(calculateInclusiveTripDays("2026-10-12", "2026-10-18")).toBe(7);
    expect(calculateInclusiveTripDays("2026-10-12", "2026-10-12")).toBe(1);
  });

  test("does not report incomplete or reversed ranges", () => {
    expect(calculateInclusiveTripDays("2026-10-12", "")).toBeNull();
    expect(calculateInclusiveTripDays("2026-10-18", "2026-10-12")).toBeNull();
  });
});
