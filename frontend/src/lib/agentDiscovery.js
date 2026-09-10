import { buildNavigationCatalog, filterNavigationCatalog } from "./navigationCatalog";
import { canonicalUrl } from "./siteConfig";

// The same catalogue powers /nav. Never expose admin or personal favourites.
const publicPages = buildNavigationCatalog().filter((entry) => entry.type !== "restricted" && entry.id !== "favorites");

export function searchPublicPages(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Expected an object.");
  const { query = "", language = "es", limit = 10, offset = 0 } = input;
  if (Object.keys(input).some((key) => !["query", "language", "limit", "offset"].includes(key))) throw new Error("Unknown search parameter.");
  if (typeof query !== "string" || query.length > 200) throw new Error("Query must be at most 200 characters.");
  if (!["es", "en", "fr"].includes(language)) throw new Error("Language must be es, en or fr.");
  if (!Number.isInteger(limit) || limit < 1 || limit > 25) throw new Error("Limit must be 1–25.");
  if (!Number.isInteger(offset) || offset < 0 || offset > 1000) throw new Error("Offset must be 0–1000.");
  const matches = filterNavigationCatalog(publicPages, { query, language });
  return { total: matches.length, offset, pages: matches.slice(offset, offset + limit).map((entry) => ({
    title: entry.title[language], type: entry.type, category: entry.category,
    url: canonicalUrl(entry.urls[0].path),
  })) };
}

export function registerPublicPageTool(context) {
  if (!context || typeof context.registerTool !== "function") return () => {};
  const abort = new AbortController();
  const name = "xaluca_search_pages";
  const tool = {
    name,
    description: "Search public Xaluca Tours trip pages and practical travel information. Returns titles and canonical URLs only. Does not navigate, submit forms, book trips or access private data.",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      query: { type: "string", maxLength: 200, description: "Place, trip title or itinerary path to find." },
      language: { type: "string", enum: ["es", "en", "fr"], default: "es" },
      limit: { type: "integer", minimum: 1, maximum: 25, default: 10 },
      offset: { type: "integer", minimum: 0, maximum: 1000, default: 0 },
    } },
    annotations: { readOnlyHint: true },
    execute: async (input) => ({ content: [{ type: "text", text: JSON.stringify(searchPublicPages(input)) }] }),
  };
  let registered = false;
  const unregisterLegacy = () => {
    if (registered && typeof context.unregisterTool === "function") {
      try { context.unregisterTool(name); } catch { /* A browser may already have removed it on abort. */ }
      registered = false;
    }
  };
  try {
    // Current draft: document.modelContext + abort signal. Older browser
    // previews expose navigator.modelContext and unregisterTool instead.
    const result = context.registerTool(tool, { signal: abort.signal });
    if (result?.then) result.then(() => { registered = true; if (abort.signal.aborted) unregisterLegacy(); }).catch(() => {});
    else registered = true;
  } catch {
    // Experimental support must never stop normal navigation or forms.
  }
  return () => { abort.abort(); unregisterLegacy(); };
}
