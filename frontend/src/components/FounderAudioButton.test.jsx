import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";

let mockLang = "es";
// CRA's Jest resolver does not understand Radix's conditional subpath export.
// Supply only its build-time flag; exercise the actual Dialog implementation.
jest.mock("@radix-ui/primitive/is-development", () => ({ IS_DEVELOPMENT: true }), { virtual: true });
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }),
  pick: (copy, lang) => copy[lang] || copy.es,
}));
jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock("@/components/FounderContactModal", () => () => null);
jest.mock("@/components/EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults.es}</Tag>);
jest.mock("@/components/EditableImage", () => ({ fallback, alt }) => <img src={fallback} alt={alt} />);

import FounderAudioButton from "./FounderAudioButton";
import FoundersSection from "./FoundersSection";

describe("founder messages awaiting recordings", () => {
  let container;
  let root;
  let play;
  let pause;

  beforeEach(() => {
    mockLang = "es";
    global.IS_REACT_ACT_ENVIRONMENT = true;
    jest.useFakeTimers();
    play = jest.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    pause = jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => { root.unmount(); jest.runOnlyPendingTimers(); });
    container.remove();
    play.mockRestore();
    pause.mockRestore();
    delete window.__xalucaFounderAudio;
    jest.useRealTimers();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  });

  const renderButton = (name, src = null) => act(() => root.render(<FounderAudioButton founderName={name} src={src} playLabel={`Escuchar a ${name}`} pauseLabel="Pausar" testid="founder-test" />));
  const open = () => {
    const trigger = container.querySelector("button");
    act(() => { trigger.focus(); trigger.click(); jest.runOnlyPendingTimers(); });
    return trigger;
  };

  test.each(["Lluís", "Tayeb"])("shows the personalised notice for %s without loading or playing audio", (name) => {
    renderButton(name);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    const trigger = open();
    const dialog = document.querySelector('[role="dialog"]');
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(dialog.textContent).toContain("Estamos preparando su mensaje");
    expect(dialog.textContent).toContain(`Muy pronto podrás escuchar el mensaje personal de ${name} y conocer de primera mano su historia y su visión de Xaluca.`);
    expect(dialog.textContent).toContain("Próximamente disponible.");
    expect(document.querySelector("audio")).toBeNull();
    expect(play).not.toHaveBeenCalled();
    act(() => dialog.querySelector('[data-testid="founder-test-pending-close"]').click());
    act(() => jest.runOnlyPendingTimers());
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test("closes with Escape and restores focus to the original button", () => {
    renderButton("Tayeb");
    const trigger = open();
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    act(() => jest.runOnlyPendingTimers());
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test.each([["en", "Coming soon."], ["fr", "Bientôt disponible."]])("supports the %s language", (lang, text) => {
    mockLang = lang;
    renderButton("Lluís");
    open();
    expect(document.querySelector('[role="dialog"]').textContent).toContain(text);
    expect(document.querySelector('[role="dialog"] strong').textContent).toBe("Lluís");
  });

  test("retains the player path for a future founder-specific recording", async () => {
    renderButton("Lluís", "/founders/lluis.mp3");
    const audio = container.querySelector("audio");
    expect(audio.getAttribute("src")).toBe("/founders/lluis.mp3");
    expect(audio.preload).toBe("none");
    await act(async () => { container.querySelector("button").click(); });
    expect(play).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    act(() => audio.dispatchEvent(new Event("play")));
    expect(container.querySelector("button").textContent).toBe("Pausar");
  });

  test("both homepage founders use the unavailable state, not the generic history recording", () => {
    const markup = renderToStaticMarkup(<FoundersSection />);
    const page = document.createElement("div");
    page.innerHTML = markup;
    for (const id of ["pont", "tayeb"]) expect(page.querySelector(`[data-testid="founder-audio-${id}"]`).getAttribute("aria-haspopup")).toBe("dialog");
    expect(page.querySelector("audio")).toBeNull();
    expect(markup).not.toContain("grup-xaluca.mp3");
  });
});
