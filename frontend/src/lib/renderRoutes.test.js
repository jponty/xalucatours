import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { ROUTES, SUPPORTED_LANGS, pathFor } from "./routes";
import { POSTS } from "./blog";
const YAML = require("yaml");

const blueprint = YAML.parse(fs.readFileSync(path.resolve("../render.yaml"), "utf8"));
const rules = blueprint.services.find((service) => service.name === "xaluca-tours-web").routes;

function resolveRule(url) {
  for (const rule of rules) {
    const tokens = rule.source.split(/(\*|:[a-z]+)/g);
    const captures = [];
    const expression = tokens.map((token) => {
      if (token === "*" || token.startsWith(":")) { captures.push(token); return token === "*" ? "(.*)" : "([^/]+)"; }
      return token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
    const match = url.match(new RegExp(`^${expression}$`));
    if (match) {
      let destination = rule.destination;
      captures.forEach((token, index) => { destination = destination.replace(token, match[index + 1]); });
      return { type: rule.type, destination };
    }
  }
  return null;
}

test("every generated public HTML page resolves to its own file ahead of the SPA fallback", () => {
  const paths = new Set([
    ...Object.keys(ROUTES).flatMap((id) => SUPPORTED_LANGS.map((lang) => pathFor(lang, id))),
    ...POSTS.flatMap((post) => SUPPORTED_LANGS.map((lang) => `${pathFor(lang, "blog")}/${post.slug}`)),
  ].map((url) => url.replace(/\/$/, "")).filter(Boolean));
  expect(rules.at(-1)).toEqual({ type: "rewrite", source: "/*", destination: "/index.html" });
  expect(rules.length).toBeLessThan(60);
  expect(new Set(rules.map((rule) => rule.source)).size).toBe(rules.length);
  for (const url of paths) {
    expect(resolveRule(url)).toEqual({ type: "rewrite", destination: `${url}/index.html` });
  }
  for (const url of ["/admin", "/admin/leads", "/api/contact-requests", "/static/example.js", "/unknown"]) {
    expect(resolveRule(url)).toEqual({ type: "rewrite", destination: "/index.html" });
  }
});

test("retired campaign redirects retain precedence and the generated block is current", () => {
  expect(rules.slice(0, 6).every((rule) => rule.type === "redirect")).toBe(true);
  expect(rules[0]).toEqual({ type: "redirect", source: "/findeano2025", destination: "/findeano2026" });
  expect(() => execFileSync(process.execPath, [path.resolve("scripts/sync-render-routes.cjs"), "--check"])).not.toThrow();
});
