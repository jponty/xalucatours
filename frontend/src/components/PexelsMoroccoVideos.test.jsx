import React, { act } from "react";
import { createRoot } from "react-dom/client";
import PexelsMoroccoVideos, { mergeUnique } from "./PexelsMoroccoVideos";

let mockLang = "es";
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang }),
  pick: (copy, lang) => copy?.[lang] || copy?.es || "",
}));

const video = (id, url = `https://videos.pexels.com/${id}.mp4`) => ({
  id,
  width: 1920,
  height: 1080,
  poster_url: `https://images.pexels.com/${id}.jpg`,
  video_url: url,
  video_width: 1280,
  video_height: 720,
  file_type: "video/mp4",
  photographer: `Creator ${id}`,
  photographer_url: `https://www.pexels.com/@creator-${id}`,
  pexels_url: `https://www.pexels.com/video/${id}/`,
});

let container;
let root;
let originalFetch;

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

beforeEach(() => {
  mockLang = "es";
  global.IS_REACT_ACT_ENVIRONMENT = true;
  originalFetch = global.fetch;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  global.fetch = originalFetch;
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("deduplicates the dynamic feed and keeps every player lazy, landscape and user-controlled", async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ videos: [video(1), video(1), video(2)], next_page: true }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ videos: [video(2), video(3)], next_page: false }),
    });

  await act(async () => root.render(<PexelsMoroccoVideos />));
  await flush();

  expect(global.fetch.mock.calls[0][0]).toContain("/api/pexels/videos/morocco?");
  expect(global.fetch.mock.calls[0][0]).toContain("page=1");
  expect(container.querySelectorAll("[data-pexels-video-card]")).toHaveLength(2);
  expect(container.textContent).not.toContain("Creator 1");
  expect(container.querySelector('[data-testid="pexels-attribution"]')).not.toBeNull();
  expect(container.querySelector('[data-testid="pexels-videos-track"]').className).toContain("overflow-x-auto");
  for (const player of container.querySelectorAll("video")) {
    expect(player.hasAttribute("controls")).toBe(true);
    expect(player.hasAttribute("autoplay")).toBe(false);
    expect(player.getAttribute("preload")).toBe("none");
    expect(player.getAttribute("poster")).toContain("images.pexels.com");
  }

  await act(async () => container.querySelector('[data-testid="pexels-videos-more"]').click());
  await flush();
  expect(global.fetch.mock.calls[1][0]).toContain("page=2");
  expect(container.querySelectorAll("[data-pexels-video-card]")).toHaveLength(3);
  expect(container.querySelector('[data-testid="pexels-videos-more"]')).toBeNull();
});

test("shows a clean localized fallback instead of broken media when the proxy fails", async () => {
  mockLang = "fr";
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 503,
    json: async () => ({ detail: "Pexels API key not configured." }),
  });

  await act(async () => root.render(<PexelsMoroccoVideos />));
  await flush();

  expect(container.querySelector('[data-testid="pexels-videos-fallback"]')).not.toBeNull();
  expect(container.textContent).toContain("Les vidéos ne sont pas disponibles pour le moment.");
  expect(container.querySelector("video")).toBeNull();
});

test("mergeUnique rejects duplicate ids, duplicate files and incomplete media", () => {
  expect(mergeUnique([video(1)], [video(1), video(2, video(1).video_url), { id: 3 }])).toHaveLength(1);
});

test("mergeUnique rejects portrait source videos", () => {
  expect(mergeUnique([], [
    { ...video(1), width: 720, height: 1280 },
    { ...video(2), video_width: 720, video_height: 1280 },
    video(3),
  ])).toEqual([video(3)]);
});
