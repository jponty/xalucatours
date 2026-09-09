import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { TEAM_MEMBERS } from "@/lib/teamMembers";
import { getTestimonialsForThemes } from "@/lib/testimonials";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: "es" }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("@/components/SectionNav", () => () => null);
jest.mock("@/components/HeroMonogram", () => () => null);
jest.mock("@/components/Testimonials", () => () => null);
jest.mock("@/components/EditableImage", () => ({ fallback, alt }) => <img src={fallback} alt={alt} />);
jest.mock("@/components/slotScope", () => ({ SlotScope: ({ children }) => <>{children}</> }));
jest.mock("@/components/EditableSection", () => ({
  E: ({ as: Tag = "span", defaults }) => <Tag>{defaults.es}</Tag>,
  EImg: ({ src, alt }) => <img src={src} alt={alt} />,
}));
jest.mock("@/components/FounderContactModal", () => ({ open, initialRecipient, contactType, onOpenChange }) => open ? (
  <div role="dialog" data-recipient={initialRecipient} data-contact-type={contactType}>
    <button onClick={() => onOpenChange(false)}>Cerrar</button>
  </div>
) : null);

import EquipoPage from "./EquipoPage";

describe("the complete Xaluca team", () => {
  let root;
  let container;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(<EquipoPage />));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  });

  test("lists the four profiles in the requested order", () => {
    expect(TEAM_MEMBERS.map((member) => member.name.es)).toEqual([
      "Noemi Aparicio", "Elena Xaluca", "Sanaa Xaluca", "Magda Xaluca",
    ]);
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(4);
    expect(container.querySelector('[role="tab"][aria-selected="true"]').getAttribute("data-testid")).toBe("eq-team-dot-noemi");
  });

  test.each(TEAM_MEMBERS)("shows $name.es and directs Contactar to that same person", (member) => {
    act(() => container.querySelector(`[data-testid="eq-team-dot-${member.id}"]`).click());
    const card = container.querySelector(`[data-testid="eq-team-card-${member.id}"]`);
    const note = container.querySelector(`[data-testid="eq-team-note-${member.id}"]`);
    expect(card.textContent).toContain(member.name.es);
    expect(card.textContent).toContain(member.role.es);
    expect(card.querySelector("img").getAttribute("src")).toBe(member.photo);
    expect(note.textContent).toContain(member.note1.es);
    expect(note.textContent).toContain(member.note2.es);
    act(() => card.querySelector("button").click());
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog.dataset.recipient).toBe(member.id);
    expect(dialog.dataset.contactType).toBe("team");
    act(() => dialog.querySelector("button").click());
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  test("uses the same specialist role in each supported language for all three advisors", () => {
    const advisors = TEAM_MEMBERS.filter((member) => member.id !== "noemi");
    for (const member of advisors) {
      expect(member.role.es).toBe("Asesora de viajes · Especialista en Marruecos");
      for (const lang of ["es", "en", "fr"]) {
        expect(member.role[lang]).toBe(advisors[0].role[lang]);
        expect(member.note1[lang].length).toBeGreaterThan(100);
        expect(member.note2[lang].length).toBeGreaterThan(100);
      }
    }
  });

  test("does not attribute another person's testimonials to Magda", () => {
    const magda = TEAM_MEMBERS.find((member) => member.id === "magda");
    expect(getTestimonialsForThemes([magda.reviewTheme], 6, { pad: false })).toEqual([]);
  });
});
