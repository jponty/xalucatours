import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { execFileSync } from "child_process";
import { ROUTES, SUPPORTED_LANGS, pathFor } from "./routes";
import { POSTS } from "./blog";
import { PUBLIC_SITE_ORIGIN, canonicalUrl } from "./siteConfig";
const { LINK, CONTENT_TYPES, discoveryMiddleware } = require("../../scripts/discovery-headers.cjs");
const YAML = require("yaml");

describe("public discovery files generated from real routes", () => {
  let output;
  const read = (file) => fs.readFileSync(path.join(output, file), "utf8");
  beforeAll(() => {
    output = fs.mkdtempSync(path.join(os.tmpdir(), "xaluca-discovery-test-"));
    execFileSync(process.execPath, [path.resolve("scripts/generate-discovery.cjs"), "--output", output]);
  });
  afterAll(() => { if (output) fs.rmSync(output, { recursive: true, force: true }); });

  test("generates valid XML covering every public canonical URL, with no duplicates or retired links", () => {
    const xml = new DOMParser().parseFromString(read("sitemap.xml"), "application/xml");
    expect(xml.querySelector("parsererror")).toBeNull();
    const urls = [...xml.getElementsByTagName("url")];
    const locations = urls.map((node) => node.getElementsByTagName("loc")[0].textContent);
    const expected = new Set([
      ...Object.keys(ROUTES).filter((id) => id !== "favorites").flatMap((id) => SUPPORTED_LANGS.map((lang) => canonicalUrl(pathFor(lang, id)))),
      ...POSTS.flatMap((post) => SUPPORTED_LANGS.map((lang) => canonicalUrl(`${pathFor(lang, "blog")}/${post.slug}`))),
    ]);
    expect(locations.sort()).toEqual([...expected].sort());
    expect(new Set(locations).size).toBe(locations.length);
    expect(locations.some((url) => /localhost|127\.0\.0\.1|findeano2025|\/admin|\/favoritos/.test(url))).toBe(false);
    for (const url of urls) {
      const alternates = [...url.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "link")];
      expect(alternates.map((link) => link.getAttribute("hreflang"))).toEqual(["es", "en", "fr", "x-default"]);
      alternates.forEach((link) => expect(expected.has(link.getAttribute("href"))).toBe(true));
    }
    expect(xml.getElementsByTagName("lastmod")).toHaveLength(0); // No invented modification dates.
  });

  test("publishes clear crawl boundaries and the actual sitemap location", () => {
    const robots = read("robots.txt");
    expect(robots).toContain("User-agent: *\nAllow: /");
    expect(robots).toContain(`Sitemap: ${PUBLIC_SITE_ORIGIN}/sitemap.xml`);
    ["/admin", "/api/", ...SUPPORTED_LANGS.map((lang) => pathFor(lang, "favorites"))].forEach((blocked) => {
      expect(robots).toContain(`Disallow: ${blocked}\n`);
    });
    expect(robots).not.toMatch(/<html/i);
  });

  test("advertises the existing API, not an invented OAuth or MCP service", () => {
    const catalog = JSON.parse(read(".well-known/api-catalog"));
    expect(catalog.linkset).toEqual([{
      anchor: "https://xaluca-tours-api.onrender.com/api/",
      "service-desc": [{ href: "https://xaluca-tours-api.onrender.com/openapi.json", type: "application/json" }],
      "service-doc": [{ href: "https://xaluca-tours-api.onrender.com/docs", type: "text/html" }],
      status: [{ href: "https://xaluca-tours-api.onrender.com/api/", type: "application/json" }],
    }]);
    [".well-known/oauth-authorization-server", ".well-known/oauth-protected-resource", ".well-known/mcp/server-card.json"].forEach((file) => {
      expect(fs.existsSync(path.join(output, file))).toBe(false);
    });
  });

  test("the skill digest matches the exact bytes being published", () => {
    const index = JSON.parse(read(".well-known/agent-skills/index.json"));
    expect(index.$schema).toContain("/0.2.0/schema.json");
    const skill = index.skills[0];
    const bytes = fs.readFileSync(path.join("public", new URL(skill.url).pathname));
    expect(skill.digest).toBe(`sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`);
    expect(skill.type).toBe("skill-md");
    const text = bytes.toString();
    const frontmatter = YAML.parse(text.match(/^---\n([\s\S]*?)\n---/)[1]);
    expect(Object.keys(frontmatter).sort()).toEqual(["description", "name"]);
    expect(frontmatter.name).toBe("explore-xaluca-trips");
    expect(frontmatter.name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(frontmatter.name.length).toBeLessThanOrEqual(64);
    expect(typeof frontmatter.description).toBe("string");
    expect(frontmatter.description.length).toBeGreaterThan(0);
    expect(frontmatter.description.length).toBeLessThanOrEqual(1024);
    expect(frontmatter.description).not.toMatch(/[<>]/);
    expect(text).not.toContain("[TODO:");
  });

  test("ARD contains only real public resources with exactly one URL and useful sample queries", () => {
    const catalog = JSON.parse(read(".well-known/ai-catalog.json"));
    expect(catalog.specVersion).toBe("1.0");
    expect(catalog.host.identifier).toBe(PUBLIC_SITE_ORIGIN);
    catalog.entries.forEach((entry) => {
      expect(entry.identifier).toMatch(/^urn:air:xalucatravel\.com:/);
      expect(entry.url).toMatch(/^https:\/\/xalucatravel\.com\//);
      expect(entry).not.toHaveProperty("data");
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
      const pathname = new URL(entry.url).pathname;
      expect(fs.existsSync(path.join(output, pathname)) || fs.existsSync(path.join("public", pathname))).toBe(true);
    });
  });

  test("Render declares the same discovery headers and media types as the local server", () => {
    const blueprint = YAML.parse(fs.readFileSync(path.resolve("../render.yaml"), "utf8"));
    const headers = blueprint.services.find((service) => service.name === "xaluca-tours-web").headers;
    expect(headers).toContainEqual({ path: "/*", name: "Link", value: LINK });
    Object.entries(CONTENT_TYPES).forEach(([route, value]) => {
      expect(headers).toContainEqual({ path: route, name: "Content-Type", value });
    });
    expect(headers.filter((header) => header.name === "Access-Control-Allow-Origin")).toEqual([
      { path: "/.well-known/ai-catalog.json", name: "Access-Control-Allow-Origin", value: "*" },
    ]);
  });

  test("local serving bypasses the SPA only for named discovery files", () => {
    const middleware = discoveryMiddleware(output);
    for (const route of Object.keys(CONTENT_TYPES)) {
      const res = { setHeader: jest.fn(), sendFile: jest.fn() };
      const next = jest.fn();
      middleware({ path: route, method: "GET" }, res, next);
      expect(res.sendFile).toHaveBeenCalledWith(path.join(output, route), { dotfiles: "allow" }, expect.any(Function));
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", CONTENT_TYPES[route]);
      expect(next).not.toHaveBeenCalled();
      const failure = new Error("File not generated");
      res.sendFile.mock.calls[0][2](failure);
      expect(next).toHaveBeenCalledWith(failure);
    }
    for (const route of ["/", "/admin", "/api/leads", "/.well-known/../../.env", "/.env"]) {
      const res = { setHeader: jest.fn(), sendFile: jest.fn() };
      const next = jest.fn();
      middleware({ path: route, method: "GET" }, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.sendFile).not.toHaveBeenCalled();
    }
  });
});

test.each([["/", `${PUBLIC_SITE_ORIGIN}/`], ["/en/", `${PUBLIC_SITE_ORIGIN}/en`],
  ["/contacto?trip=example#contact-form", `${PUBLIC_SITE_ORIGIN}/contacto`]])("canonical URLs normalize %s", (input, expected) => {
  expect(canonicalUrl(input)).toBe(expected);
});
