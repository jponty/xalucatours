import React, { act } from "react";
import { createRoot } from "react-dom/client";
import useClimate from "./useClimate";

let root, container, result;
const interval = 15 * 60 * 1000;
function Test() { result = useClimate("current", interval); return <div>{result.data?.source || "empty"}</div>; }
const success = { ok: true, json: async () => ({ source: "MET Norway", generated_at: "2026-09-18T12:00:00Z", locations: [] }) };
const originalFetch = global.fetch;
beforeEach(() => {
  jest.useFakeTimers(); global.IS_REACT_ACT_ENVIRONMENT = true;
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
  global.fetch = jest.fn().mockResolvedValue(success);
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount()); container.remove();
  global.fetch = originalFetch; delete document.visibilityState;
  jest.useRealTimers(); delete global.IS_REACT_ACT_ENVIRONMENT;
});
test("polls every 15 min, pauses when hidden, resumes when visible and aborts on unmount", async () => {
  await act(async () => root.render(<Test />));
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch.mock.calls[0][0]).toMatch(/\/api\/climate\/current$/);
  await act(async () => jest.advanceTimersByTime(interval));
  expect(global.fetch).toHaveBeenCalledTimes(2);
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
  await act(async () => jest.advanceTimersByTime(interval));
  expect(global.fetch).toHaveBeenCalledTimes(2);
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
  await act(async () => document.dispatchEvent(new Event("visibilitychange")));
  expect(global.fetch).toHaveBeenCalledTimes(3);
  const signal = global.fetch.mock.calls[2][1].signal;
  await act(async () => root.render(null)); expect(signal.aborted).toBe(true);
});
test("failed refresh clears the old snapshot and retry restores it", async () => {
  await act(async () => root.render(<Test />)); expect(result.data.source).toBe("MET Norway");
  global.fetch.mockRejectedValueOnce(new Error("offline"));
  await act(async () => jest.advanceTimersByTime(interval));
  expect(result.error).toBe(true); expect(result.data).toBeNull();
  await act(async () => result.refresh()); expect(result.data.source).toBe("MET Norway");
});
test("HTML or malformed payloads cannot become weather data", async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
  await act(async () => root.render(<Test />)); expect(result.error).toBe(true); expect(result.loading).toBe(false);
});
