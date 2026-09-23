import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { queueAdminRegistry, useAdminRegistryEntry } from "./adminRegistry";
import { ADMIN_TOKEN_KEY, ADMIN_SESSION_EVENT } from "./adminSession";

beforeEach(() => {
  jest.useFakeTimers();
  localStorage.clear();
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });
const flush = async () => {
  jest.advanceTimersByTime(1600);
  for (let i = 0; i < 10; i++) await Promise.resolve();
};

test("public visitors do not register any kind of content", async () => {
  for (const kind of ["text_slots", "image_slots", "image_urls"]) {
    queueAdminRegistry(kind, "guest", { slot_id: "guest" });
  }
  await flush();
  expect(fetch).not.toHaveBeenCalled();
});

test("admin registration is authenticated, deduplicated and batched", async () => {
  localStorage.setItem(ADMIN_TOKEN_KEY, "signed-admin");
  for (let i = 0; i < 120; i++) {
    const entry = { slot_id: `batch-${i}`, defaults: { es: "Hola" } };
    queueAdminRegistry("text_slots", entry.slot_id, entry);
    queueAdminRegistry("text_slots", entry.slot_id, entry);
  }
  await flush();
  expect(fetch).toHaveBeenCalledTimes(2);
  const [url, options] = fetch.mock.calls[0];
  expect(url).toContain("/api/text_slots/register");
  expect(options.headers.Authorization).toBe("Bearer signed-admin");
  expect(JSON.parse(options.body).slots).toHaveLength(100);
  expect(JSON.parse(fetch.mock.calls[1][1].body).slots).toHaveLength(20);
});

test("logging out before the timer fires cancels registration", async () => {
  localStorage.setItem(ADMIN_TOKEN_KEY, "signed-admin");
  queueAdminRegistry("image_slots", "logout", { slot_id: "logout" });
  localStorage.clear();
  await flush();
  expect(fetch).not.toHaveBeenCalled();
});

test("remote URLs use the existing contract and failed batches can retry on revisit", async () => {
  localStorage.setItem(ADMIN_TOKEN_KEY, "signed-admin");
  fetch.mockResolvedValueOnce({ ok: false });
  const url = "https://images.unsplash.com/retry.jpg";
  queueAdminRegistry("image_urls", url, url);
  await flush();
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ urls: [url] });
  queueAdminRegistry("image_urls", url, url);
  await flush();
  expect(fetch).toHaveBeenCalledTimes(2);
});

test("a page mounted before admin login registers when the session changes", async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const node = document.createElement("div");
  const root = createRoot(node);
  function Page() {
    useAdminRegistryEntry("text_slots", "login-page", { slot_id: "login-page", defaults: { es: "Viajes" } });
    return null;
  }
  try {
    act(() => root.render(React.createElement(Page)));
    await flush();
    expect(fetch).not.toHaveBeenCalled();
    localStorage.setItem(ADMIN_TOKEN_KEY, "signed-admin");
    act(() => window.dispatchEvent(new Event(ADMIN_SESSION_EVENT)));
    await flush();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetch.mock.calls[0][1].body).slots[0].slot_id).toBe("login-page");
  } finally {
    act(() => root.unmount());
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
