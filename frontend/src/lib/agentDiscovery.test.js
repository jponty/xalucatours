import { registerPublicPageTool, searchPublicPages } from "./agentDiscovery";
import { buildNavigationCatalog } from "./navigationCatalog";
import { canonicalUrl } from "./siteConfig";

describe("read-only public page discovery", () => {
  test.each(["es", "en", "fr"])("uses the existing catalogue and canonical %s URLs without private pages", (language) => {
    const expected = buildNavigationCatalog().filter((entry) => entry.type !== "restricted" && entry.id !== "favorites");
    const pages = [];
    for (let offset = 0; offset < expected.length; offset += 25) {
      const result = searchPublicPages({ language, limit: 25, offset });
      expect(result.total).toBe(expected.length);
      pages.push(...result.pages);
    }
    expect(pages).toEqual(expected.map((entry) => ({ title: entry.title[language], category: entry.category,
      type: entry.type, url: canonicalUrl(entry.urls.find((url) => url.lang === language).path) })));
    expect(pages.some((page) => page.url.includes("localhost") || page.url.includes("/admin"))).toBe(false);
    expect(searchPublicPages({ query: "/admin", language }).pages).toEqual([]);
  });

  test("finds an exact programme, supports accents, and handles no results", () => {
    const result = searchPublicPages({ query: "/viajes/desierto_atlas/programa_4n_5d" });
    expect(result.total).toBe(1);
    expect(result.pages[0]).toMatchObject({ type: "program", url: canonicalUrl("/viajes/desierto_atlas/programa_4n_5d") });
    expect(searchPublicPages({ query: "Tánger" })).toEqual(searchPublicPages({ query: "tanger" }));
    expect(searchPublicPages({ query: "no-such-programme-9876" }).pages).toEqual([]);
  });

  test.each([null, [], { query: 1 }, { query: "x".repeat(201) }, { language: "de" }, { limit: 0 },
    { limit: 26 }, { limit: 1.5 }, { offset: -1 }, { offset: 1001 }, { email: "private@example.com" }])("rejects malformed input %p", (input) => {
    expect(() => searchPublicPages(input)).toThrow();
  });

  test("degrades to a no-op when WebMCP is unavailable", () => {
    expect(() => registerPublicPageTool(undefined)()).not.toThrow();
    expect(() => registerPublicPageTool({})()).not.toThrow();
  });

  test("registers one read-only tool and uses an abort signal for the current draft", async () => {
    const context = { registerTool: jest.fn().mockResolvedValue(undefined) };
    const cleanup = registerPublicPageTool(context);
    const [tool, options] = context.registerTool.mock.calls[0];
    expect(tool.name).toBe("xaluca_search_pages");
    expect(tool.annotations.readOnlyHint).toBe(true);
    expect(tool.inputSchema.additionalProperties).toBe(false);
    expect(options.signal.aborted).toBe(false);
    const output = await tool.execute({ query: "/info" });
    expect(JSON.parse(output.content[0].text)).toEqual(searchPublicPages({ query: "/info" }));
    await expect(tool.execute({ limit: 100 })).rejects.toThrow();
    cleanup();
    expect(options.signal.aborted).toBe(true);
  });

  test("unregisters legacy browser tools without leaving duplicate registrations", () => {
    const context = { registerTool: jest.fn(), unregisterTool: jest.fn() };
    const cleanup = registerPublicPageTool(context);
    cleanup();
    cleanup();
    expect(context.unregisterTool).toHaveBeenCalledTimes(1);
    expect(context.unregisterTool).toHaveBeenCalledWith("xaluca_search_pages");
  });

  test("cleans up a registration resolving after unmount", async () => {
    let resolve;
    const context = { registerTool: () => new Promise((done) => { resolve = done; }), unregisterTool: jest.fn() };
    registerPublicPageTool(context)();
    resolve();
    await Promise.resolve();
    expect(context.unregisterTool).toHaveBeenCalledWith("xaluca_search_pages");
  });

  test("experimental registration and cleanup failures never crash the site", async () => {
    const failure = () => { throw new Error("Unsupported preview"); };
    expect(() => registerPublicPageTool({ registerTool: failure })()).not.toThrow();
    expect(() => registerPublicPageTool({ registerTool: jest.fn(), unregisterTool: failure })()).not.toThrow();
    registerPublicPageTool({ registerTool: () => Promise.reject(new Error("Disabled")) })();
    await Promise.resolve();
  });
});
