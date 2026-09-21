import * as assistantApi from "./assistantApi";
import { assistantAvailable, identifyForAssistant, loadAssistantGuide, safeAssistantSourcePath } from "./assistantApi";

const originalFetch = global.fetch;
beforeEach(() => { global.fetch = jest.fn(); });
afterEach(() => { global.fetch = originalFetch; jest.useRealTimers(); });
const respond = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: jest.fn().mockResolvedValue(body) });

test("availability is an uncached GET and requires literal true", async () => {
  const signal = new AbortController().signal;
  fetch.mockResolvedValueOnce(respond({ available: true }));
  await expect(assistantAvailable(signal)).resolves.toBe(true);
  expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/assistant\/status$/), expect.objectContaining({ method: "GET", signal, cache: "no-store" }));
  expect(fetch.mock.calls[0][1]).not.toHaveProperty("body");
  for (const value of [false, "true", 1, null, undefined]) {
    fetch.mockResolvedValueOnce(respond({ available: value }));
    await expect(assistantAvailable(signal)).resolves.toBe(false);
  }
});

test("identification is a JSON POST with consent and preferences but no session token", async () => {
  const signal = new AbortController().signal;
  const body = { full_name: "Test Traveller", email: "test@example.com", phone: "+34612345678", language: "es", privacy_consent: true, preferred_contact: ["email"], capture_type: "assistant", submission_id: "test-id" };
  fetch.mockResolvedValueOnce(respond({ token: "memory-only-token" }));
  await expect(identifyForAssistant(body, signal)).resolves.toEqual({ token: "memory-only-token" });
  expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/assistant\/session$/), {
    method: "POST", cache: "no-store", signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  expect(fetch.mock.calls[0][0]).not.toContain(body.email);
  expect(fetch.mock.calls[0][0]).not.toContain(body.phone);
});

test("guided selections authenticate in a header, not in a URL or the body", async () => {
  const signal = new AbortController().signal;
  const body = { language: "es", topic: "trips", duration: 3, program_id: "es:tourEnduroAventura34:overview:1", section: "itinerary", page: 2 };
  const guide = { title: "Etapas del Enduro", description: "Información publicada", options: [], sources: [], selection: body, pagination: { page: 2, pages: 2, previous: { ...body, page: 1 }, next: null }, handoff: false };
  fetch.mockResolvedValueOnce(respond(guide));
  await expect(loadAssistantGuide("session-secret", body, signal)).resolves.toEqual(guide);
  expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/assistant\/guide$/), {
    method: "POST", cache: "no-store", signal,
    headers: { "Content-Type": "application/json", Authorization: "Bearer session-secret" }, body: JSON.stringify(body),
  });
  expect(fetch.mock.calls[0][0]).not.toContain("session-secret");
  expect(fetch.mock.calls[0][1].body).not.toContain("session-secret");
  expect(JSON.parse(fetch.mock.calls[0][1].body)).not.toHaveProperty("message");
  expect(assistantApi).not.toHaveProperty("askAssistant");
});

test("the initial guide only sends the requested language and never calls the old messages endpoint", async () => {
  fetch.mockResolvedValueOnce(respond({ title: "Explore", options: [], sources: [] }));
  await loadAssistantGuide("session-secret", { language: "en" });
  expect(fetch.mock.calls[0][0]).toMatch(/\/api\/assistant\/guide$/);
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ language: "en" });
});

test.each([401, 429, 503])("HTTP %s preserves only the safe error status", async status => {
  const response = respond({ detail: "private database failure" }, status);
  fetch.mockResolvedValueOnce(response);
  await expect(loadAssistantGuide("secret", { language: "es" })).rejects.toMatchObject({ message: "assistant_request_failed", status });
  expect(response.json).not.toHaveBeenCalled();
});

test("abort and malformed-JSON failures reach the UI without fabricated guide content", async () => {
  const abort = new DOMException("Cancelled", "AbortError");
  fetch.mockRejectedValueOnce(abort);
  await expect(assistantAvailable(new AbortController().signal)).rejects.toBe(abort);
  fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.reject(new SyntaxError("bad JSON")) });
  await expect(loadAssistantGuide("secret", { language: "es" })).rejects.toBeInstanceOf(SyntaxError);
});

test("the caller's cancellation aborts the underlying fetch and removes its listener", async () => {
  const controller = new AbortController();
  const remove = jest.spyOn(controller.signal, "removeEventListener");
  fetch.mockImplementationOnce((_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(new DOMException("Cancelled", "AbortError")), { once: true });
  }));
  const pending = loadAssistantGuide("secret", { language: "es" }, controller.signal);
  const rejected = expect(pending).rejects.toMatchObject({ name: "AbortError" });
  controller.abort();
  await rejected;
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  expect(remove).toHaveBeenCalledWith("abort", expect.any(Function));
});

test("a stalled fetch times out instead of leaving the assistant permanently pending", async () => {
  jest.useFakeTimers();
  fetch.mockImplementationOnce((_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(new DOMException("Timed out", "AbortError")), { once: true });
  }));
  const pending = loadAssistantGuide("secret", { language: "es" });
  const rejected = expect(pending).rejects.toMatchObject({ name: "AbortError" });
  jest.advanceTimersByTime(30000);
  await rejected;
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  expect(jest.getTimerCount()).toBe(0);
});

test.each(["/viajes/desierto_atlas/programa_4n_5d", "/en/tours/desert-atlas/program-4n-5d", "/fr/voyages/desert-atlas/programme-4n-5j", "/contacto", "/info#equipaje"])("accepts public source path %s", pathname => {
  expect(safeAssistantSourcePath(pathname)).toBe(pathname);
});

test.each([undefined, null, {}, "", "https://evil.example/", "//evil.example/", "javascript:alert(1)", "/\\evil.example", "/%2f%2fevil", "/../admin", "/contacto?token=secret", "/api", "/api/private", "/admin", "/admin/settings", "/admin#settings", "/api#docs", "/en/admin#settings", "/fr/api/private", "/API/private"])("rejects unsafe/private source path %s", pathname => {
  expect(safeAssistantSourcePath(pathname)).toBeNull();
});
