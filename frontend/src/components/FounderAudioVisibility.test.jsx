import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// CRA's Jest resolver predates Radix's conditional subpath export.
jest.mock("@radix-ui/primitive/is-development", () => ({ IS_DEVELOPMENT: true }), { virtual: true });
jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ lang: "es" }) }));
jest.mock("@/components/FounderContactModal", () => () => null);
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults.es}</Tag>);
jest.mock("@/components/EditableImage", () => ({ fallback, alt }) => <img src={fallback} alt={alt} />);

import FoundersSection from "./FoundersSection";
import FounderAudioButton from "./FounderAudioButton";
import { SHOW_FOUNDER_AUDIO_CONTROLS } from "@/lib/featureFlags";

test("temporarily hides every founder audio access through one reversible flag", () => {
  expect(SHOW_FOUNDER_AUDIO_CONTROLS).toBe(false);
  expect(renderToStaticMarkup(
    <FounderAudioButton
      founderName="Lluís"
      src="/founders/lluis.mp3"
      playLabel="Escuchar a Lluís"
      pauseLabel="Pausar"
      testid="founder-audio-direct"
    />,
  )).toBe("");
});

test("the founder cards leave no empty audio control while preserving their aligned contact action", () => {
  const page = document.createElement("div");
  page.innerHTML = renderToStaticMarkup(<FoundersSection />);

  expect(page.querySelector('[data-testid="founder-audio-pont"]')).toBeNull();
  expect(page.querySelector('[data-testid="founder-audio-tayeb"]')).toBeNull();
  expect(page.textContent).not.toContain("Escuchar a Lluís");
  expect(page.textContent).not.toContain("Escuchar a Tayeb");
  for (const id of ["pont", "tayeb"]) {
    const contact = page.querySelector(`[data-testid="founder-contact-${id}"]`);
    expect(contact).not.toBeNull();
    expect(contact.parentElement.children).toHaveLength(1);
    expect(contact.parentElement.classList.contains("justify-end")).toBe(true);
  }
});
