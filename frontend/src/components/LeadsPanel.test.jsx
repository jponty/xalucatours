import React, { act } from "react";
import { createRoot } from "react-dom/client";
import LeadsPanel from "./LeadsPanel";

jest.mock("@/lib/adminSession", () => ({ adminAuthHeaders: extra => ({ ...extra, Authorization: "Bearer test-admin" }) }));
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }) => open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  DialogDescription: ({ children }) => <p>{children}</p>,
}));
const lead = { id: "contact:1", record_id: "1", source: "contact", first_name: "Ana", last_name: "García", full_name: "Ana García", email: "ana@example.com", phone: "+34612345678", type_label: "Antes de irte", type: "exit_intent", source_url: "/contacto", created_at: "2026-09-17T10:00:00Z", status: "new" };
let root, container;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  global.fetch = jest.fn(async (url, options = {}) => ({ ok: true, json: async () => url.includes("/contact/1") ? { ...lead, status: options.method === "PATCH" ? "reviewed" : "new", details: { message: "Familia con dos niños", preferred_contact_phone: "+33612345678", activities: ["Sáhara", "Atlas"], source_url: "/contacto" } } : { items: [lead], total: 1, all_total: 1, types: { exit_intent: "Antes de irte", newsletter: "Newsletter" } } }));
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.useRealTimers(); delete global.fetch; delete global.IS_REACT_ACT_ENVIRONMENT; });
async function render() { await act(async () => root.render(<LeadsPanel />)); await act(async () => jest.advanceTimersByTime(300)); }
function button(text) { return Array.from(container.querySelectorAll("button")).find(el => el.textContent.includes(text)); }
function input(el, value) { act(() => { Object.getOwnPropertyDescriptor(el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype, "value").set.call(el, value); el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true })); }); }

test("loads all leads with admin auth and displays origin and phone", async () => {
  await render();
  expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer test-admin");
  expect(container.textContent).toContain("Todos los leads");
  expect(container.textContent).toContain("Ana García");
  expect(container.querySelector("dl").textContent).toContain("NombreAna");
  expect(container.querySelector("dl").textContent).toContain("Apellido(s)García");
  expect(container.textContent).toContain("+34612345678");
  expect(container.textContent).toContain("/contacto");
});

test("filters at the server by type and search without losing URL context", async () => {
  await render();
  input(container.querySelector('[data-testid="admin-leads-search"]'), "ana@example.com");
  input(container.querySelector("select"), "newsletter");
  await act(async () => jest.advanceTimersByTime(300));
  expect(fetch.mock.calls.at(-1)[0]).toContain("q=ana%40example.com&kind=newsletter");
});

test("opens all submitted data and saves management state on the original lead", async () => {
  await render();
  await act(async () => button("Ver ficha").click());
  expect(container.querySelector('[role="dialog"]').textContent).toContain("Familia con dos niños");
  expect(container.querySelector('[role="dialog"] dl').textContent).toContain("NombreAnaApellido(s)García");
  expect(container.textContent).toContain("+33612345678");
  expect(container.textContent).toContain("Sáhara");
  await act(async () => input(container.querySelector('[data-testid="lead-status"]'), "reviewed"));
  expect(fetch.mock.calls.at(-1)).toEqual([expect.stringContaining("/contact/1"), expect.objectContaining({ method: "PATCH", body: '{"status":"reviewed"}' })]);
});

test("shows failure instead of presenting an empty dashboard as success", async () => {
  fetch.mockResolvedValue({ ok: false, status: 503 });
  await render();
  expect(container.querySelector('[role="alert"]').textContent).toContain("No se pudieron cargar todos los leads");
});
