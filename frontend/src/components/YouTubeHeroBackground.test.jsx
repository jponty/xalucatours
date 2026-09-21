import React, { act, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import YouTubeHeroBackground from "./YouTubeHeroBackground";
import { loadYouTubeAPI } from "@/lib/youtubeApi";
import { preloadImageLink } from "@/lib/imageUrl";

jest.mock("@/lib/youtubeApi", () => ({ loadYouTubeAPI: jest.fn() }));
jest.mock("@/lib/imageUrl", () => ({ preloadImageLink: jest.fn(() => jest.fn()) }));

let container, root, api, players, preference, resizeObserver;
const originalMatchMedia = window.matchMedia;
const originalResizeObserver = window.ResizeObserver;
const clip = { videoId: "hVvEISFw9w0", startSeconds: 0, endSeconds: 275 };
const render = async (element = <YouTubeHeroBackground videoId={clip.videoId} endSeconds={275}><img alt="" data-testid="poster" /></YouTubeHeroBackground>) => {
  await act(async () => root.render(element));
};
const state = () => container.querySelector('[data-testid="youtube-hero-background"]').dataset.playing;
const emit = async (name, data) => act(async () => {
  const latest = players[players.length - 1];
  latest.events[name]({ target: latest.player, data });
});

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  loadYouTubeAPI.mockReset();
  preloadImageLink.mockClear();
  preference = { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() };
  window.matchMedia = jest.fn(() => preference);
  window.ResizeObserver = jest.fn(callback => {
    resizeObserver = { callback, observe: jest.fn(), disconnect: jest.fn() };
    return resizeObserver;
  });
  players = [];
  api = {
    PlayerState: { PLAYING: 1, PAUSED: 2, ENDED: 0 },
    Player: jest.fn((holder, options) => {
      const iframe = document.createElement("iframe");
      holder.replaceWith(iframe);
      const player = { mute: jest.fn(), loadVideoById: jest.fn(), destroy: jest.fn(() => iframe.remove()), getIframe: () => iframe };
      players.push({ player, ...options });
      return player;
    }),
  };
  loadYouTubeAPI.mockResolvedValue(api);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  window.matchMedia = originalMatchMedia;
  window.ResizeObserver = originalResizeObserver;
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test("starts muted, inline, with no controls and a hard 275-second boundary", async () => {
  await render();
  expect(players[0].videoId).toBe(clip.videoId);
  expect(players[0].playerVars).toMatchObject({ autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, playsinline: 1, start: 0, end: 275, origin: window.location.origin });
  const iframe = container.querySelector("iframe");
  expect(iframe.tabIndex).toBe(-1);
  expect(iframe.getAttribute("aria-hidden")).toBe("true");
  expect(iframe.getAttribute("allow")).toContain("autoplay");
  expect(state()).toBe("false");
  await emit("onReady");
  expect(players[0].player.mute).toHaveBeenCalledTimes(1);
  expect(players[0].player.loadVideoById).toHaveBeenLastCalledWith(clip);
  expect(players[0].player.mute.mock.invocationCallOrder[0]).toBeLessThan(players[0].player.loadVideoById.mock.invocationCallOrder[0]);
  await emit("onStateChange", api.PlayerState.PLAYING);
  expect(state()).toBe("true");
});

test("keeps an eagerly loaded cover poster beneath the video during loading and failures", async () => {
  await render(
    <YouTubeHeroBackground
      videoId={clip.videoId}
      endSeconds={275}
      posterSrc="/shared-hero-poster.jpg"
      posterTestId="shared-poster"
    />,
  );
  const poster = container.querySelector('[data-testid="shared-poster"]');
  expect(poster.getAttribute("src")).toBe("/shared-hero-poster.jpg");
  expect(poster.getAttribute("loading")).toBe("eager");
  expect(poster.classList.contains("object-cover")).toBe(true);
  expect(preloadImageLink).toHaveBeenCalledWith("/shared-hero-poster.jpg", { width: 1280 });
  expect(state()).toBe("false");
  await emit("onStateChange", api.PlayerState.PLAYING);
  expect(state()).toBe("true");
  await emit("onError", 100);
  expect(state()).toBe("false");
  expect(container.querySelector('[data-testid="shared-poster"]')).toBe(poster);
});

test("every loop starts at zero and reapplies the clip boundary instead of seeking", async () => {
  await render();
  await emit("onReady");
  for (let cycle = 0; cycle < 3; cycle += 1) {
    await emit("onStateChange", api.PlayerState.PLAYING);
    await emit("onStateChange", api.PlayerState.ENDED);
    expect(state()).toBe("false");
    expect(players[0].player.loadVideoById).toHaveBeenLastCalledWith(clip);
  }
  expect(players[0].player.loadVideoById).toHaveBeenCalledTimes(4);
});

test.each(["onAutoplayBlocked", "onError"])("keeps the poster without player UI when %s fires", async (event) => {
  await render();
  await emit("onStateChange", api.PlayerState.PLAYING);
  await emit(event);
  expect(state()).toBe("false");
  expect(container.querySelector('[data-testid="poster"]')).not.toBeNull();
});

test("keeps the fallback on API failure, without an unhandled rejection", async () => {
  loadYouTubeAPI.mockRejectedValue(new Error("offline"));
  await render();
  expect(state()).toBe("false");
  expect(api.Player).not.toHaveBeenCalled();
});

test("reduced motion avoids loading the video and can be changed at runtime", async () => {
  preference.matches = true;
  await render();
  expect(loadYouTubeAPI).not.toHaveBeenCalled();
  const onChange = preference.addEventListener.mock.calls[0][1];
  await act(async () => { preference.matches = false; onChange(); });
  expect(api.Player).toHaveBeenCalledTimes(1);
  await emit("onStateChange", api.PlayerState.PLAYING);
  await act(async () => { preference.matches = true; onChange(); });
  expect(players[0].player.destroy).toHaveBeenCalledTimes(1);
  expect(state()).toBe("false");
});

test.each([[320, 900], [390, 844], [768, 1024], [1024, 768], [1440, 900], [2560, 800]])("covers a %s × %s hero without stretching the video", async (width, height) => {
  await render();
  const background = container.querySelector('[data-testid="youtube-hero-background"]');
  background.getBoundingClientRect = () => ({ width, height });
  resizeObserver.callback();
  const stage = container.querySelector('[data-testid="youtube-hero-stage"]');
  expect(parseFloat(stage.style.width)).toBeGreaterThanOrEqual(width);
  expect(parseFloat(stage.style.height)).toBeGreaterThanOrEqual(height);
  expect(parseFloat(stage.style.width) / parseFloat(stage.style.height)).toBeCloseTo(16 / 9, 2);
  expect(background.classList.contains("overflow-hidden")).toBe(true);
  expect(background.classList.contains("pointer-events-none")).toBe(true);
});

test("cleans up the player and listeners and handles StrictMode without duplicate iframes", async () => {
  await render(<StrictMode><YouTubeHeroBackground videoId={clip.videoId} endSeconds={275} /></StrictMode>);
  expect(container.querySelectorAll("iframe")).toHaveLength(1);
  await render(null);
  expect(players[0].player.destroy).toHaveBeenCalledTimes(1);
  expect(resizeObserver.disconnect).toHaveBeenCalled();
  expect(preference.removeEventListener).toHaveBeenCalled();
  expect(container.querySelectorAll("iframe")).toHaveLength(0);
});

test("navigation away during API loading never mounts a stale player", async () => {
  let resolveAPI;
  loadYouTubeAPI.mockReturnValue(new Promise(resolve => { resolveAPI = resolve; }));
  await render();
  await render(null);
  await act(async () => resolveAPI(api));
  expect(api.Player).not.toHaveBeenCalled();
});
