import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import TripPackingNotes from "./TripPackingNotes";
import { getTripPackingNotes } from "../lib/tripPackingNotes";

jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("@/components/EditableText", () => ({
  __esModule: true,
  default: ({ slot, defaults, as: Tag = "span", className }) => <Tag data-slot={slot} className={className}>{defaults.es}</Tag>,
}));

test("hub and programme layouts read exactly the same content and editable slots", () => {
  const routeId = "tourDesiertoAtlas45";
  const carousel = renderToStaticMarkup(<TripPackingNotes routeId={routeId} />);
  const grid = renderToStaticMarkup(<TripPackingNotes routeId={routeId} layout="grid" />);
  const slots = (html) => [...html.matchAll(/data-slot="([^"]+)"/g)].map((match) => match[1]);
  expect(slots(grid)).toEqual(slots(carousel));
  expect(slots(grid).every((slot) => slot.startsWith(`trip.${routeId}.packing.note.`))).toBe(true);
  getTripPackingNotes(routeId).forEach((note) => {
    expect(grid).toContain(note.title.es);
    note.items.forEach((item) => expect(grid).toContain(item.es));
  });
  expect(carousel).toContain('data-testid="packing-notes-next"');
  expect(carousel).toContain('data-testid="packing-notes-dots"');
  expect(grid).not.toContain('data-testid="packing-notes-next"');
  expect(grid).not.toContain('data-testid="packing-notes-dots"');
});

test("does not invent notes without a trip", () => {
  expect(renderToStaticMarkup(<TripPackingNotes />)).toBe("");
});
