let loadYouTubeAPI;

beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  delete window.YT;
  delete window.onYouTubeIframeAPIReady;
  document.getElementById("youtube-iframe-api")?.remove();
  ({ loadYouTubeAPI } = require("./youtubeApi"));
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  document.getElementById("youtube-iframe-api")?.remove();
  delete window.YT;
  delete window.onYouTubeIframeAPIReady;
});

test("all components share one script and one pending API promise", async () => {
  const previous = jest.fn();
  window.onYouTubeIframeAPIReady = previous;
  const first = loadYouTubeAPI();
  expect(loadYouTubeAPI()).toBe(first);
  expect(document.querySelectorAll("#youtube-iframe-api")).toHaveLength(1);
  window.YT = { Player: jest.fn() };
  window.onYouTubeIframeAPIReady();
  await expect(first).resolves.toBe(window.YT);
  expect(previous).toHaveBeenCalledTimes(1);
  expect(window.onYouTubeIframeAPIReady).toBe(previous);
  expect(jest.getTimerCount()).toBe(0);
});

test("uses an already loaded API without injecting another script", async () => {
  window.YT = { Player: jest.fn() };
  await expect(loadYouTubeAPI()).resolves.toBe(window.YT);
  expect(document.getElementById("youtube-iframe-api")).toBeNull();
});

test.each(["network", "timeout"])("rejects on %s failure and allows a later retry", async (failure) => {
  const first = loadYouTubeAPI();
  const failed = expect(first).rejects.toThrow("unavailable");
  if (failure === "network") document.getElementById("youtube-iframe-api").dispatchEvent(new Event("error"));
  else jest.advanceTimersByTime(20000);
  await failed;
  expect(document.getElementById("youtube-iframe-api")).toBeNull();
  const retry = loadYouTubeAPI();
  expect(retry).not.toBe(first);
  window.YT = { Player: jest.fn() };
  window.onYouTubeIframeAPIReady();
  await expect(retry).resolves.toBe(window.YT);
});
