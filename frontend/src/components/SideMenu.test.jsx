import React, { act } from "react";
import { createRoot } from "react-dom/client";
import SideMenu from "./SideMenu";
import { MENU_TREE } from "@/lib/menu";
import { pathFor } from "@/lib/routes";

let mockLang = "es";
let mockPath = "/";
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: mockPath }),
  useNavigate: () => mockNavigate,
}));
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ lang: mockLang, t: () => "Cerrar menú" }),
}));
jest.mock("./EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults?.[mockLang]}</Tag>);

let root, container;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  mockNavigate.mockClear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test.each([
  ["es", "Catálogo", "/catalogo"],
  ["en", "Catalogue", "/en/catalogue"],
  ["fr", "Catalogue", "/fr/catalogue"],
])("the %s drawer has one catalogue link with the shared style and close behavior", async (lang, label, url) => {
  mockLang = lang;
  mockPath = pathFor(lang, "contact");
  const onClose = jest.fn();
  await act(async () => root.render(<SideMenu open onClose={onClose} />));
  onClose.mockClear();
  const links = container.querySelectorAll('[data-testid="menu-link-catalog"]');
  expect(links).toHaveLength(1);
  const link = links[0];
  const archive = container.querySelector('[data-testid="menu-link-archive"]');
  expect(link.getAttribute("href")).toBe(url);
  expect(link.textContent).toContain(label);
  expect(link.className).toBe(archive.className);
  expect(archive.parentElement.nextElementSibling).toBe(link.parentElement);
  expect(MENU_TREE.filter((item) => item.routeId === "catalog")).toHaveLength(1);
  await act(async () => link.click());
  expect(mockNavigate).toHaveBeenCalledWith(url);
  expect(onClose).toHaveBeenCalledTimes(1);

  mockPath = url;
  await act(async () => root.render(<SideMenu open onClose={onClose} />));
  expect(container.querySelector('[data-testid="menu-link-catalog"]').getAttribute("aria-current")).toBe("page");
});
