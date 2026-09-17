import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Footer } from "./Footer";
import { MENU_TREE } from "@/lib/menu";
import { pathFor, resolvePath, SUPPORTED_LANGS } from "@/lib/routes";
import { useLanguage } from "@/contexts/LanguageContext";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: "/", hash: "" }),
  useNavigate: () => jest.fn(),
}));
jest.mock("@/contexts/LanguageContext", () => ({ useLanguage: jest.fn() }));
jest.mock("./EditableText", () => ({ as: Tag = "span", defaults }) => <Tag>{defaults?.es}</Tag>);

const menuRoutes = (nodes) => nodes.flatMap((node) => [
  node.routeId,
  node.routeIdHeader,
  ...menuRoutes(node.children || []),
  ...menuRoutes(node.groups || []),
  ...menuRoutes(node.items || []),
]).filter(Boolean);

test("the shared menu hides the navigation map and keeps practical information", () => {
  const routes = menuRoutes(MENU_TREE);
  expect(routes).not.toContain("navigationMap");
  expect(routes).toContain("practicalInfo");
});

test.each(SUPPORTED_LANGS)("the %s footer hides /nav but the direct route remains available", (lang) => {
  useLanguage.mockReturnValue({ lang, setLang: jest.fn() });
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<Footer />);
  const links = [...container.querySelectorAll("a")].map((link) => link.getAttribute("href"));
  expect(links).not.toContain(pathFor(lang, "navigationMap"));
  expect(links).toContain(pathFor(lang, "practicalInfo"));
  expect(links).toContain(pathFor(lang, "toursLanding"));
  expect(resolvePath(pathFor(lang, "navigationMap"))).toMatchObject({ routeId: "navigationMap", lang });
});
