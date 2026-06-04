/* ============================================================
   programs/index.js
   ----
   Auto-collected registry of every trip program defined in
   lib/programs/*.js. A "program" is any exported object that
   carries both a `routeId` (string, matching lib/routes.js +
   allTripsCatalog) and a `days` array. Shared day fragments and
   helpers are ignored.

   Using webpack's require.context keeps this list in sync with no
   manual maintenance — adding a new program file is enough.
============================================================ */

const ALL_PROGRAMS = [];

// eslint-disable-next-line no-undef
const ctx = require.context("./", false, /\.js$/);
const seen = new Set();
ctx.keys().forEach((key) => {
  if (key.includes("index")) return;
  const mod = ctx(key);
  Object.keys(mod).forEach((name) => {
    const v = mod[name];
    if (
      v &&
      typeof v === "object" &&
      typeof v.routeId === "string" &&
      Array.isArray(v.days) &&
      !seen.has(v.routeId)
    ) {
      seen.add(v.routeId);
      ALL_PROGRAMS.push(v);
    }
  });
});

export { ALL_PROGRAMS };
export default ALL_PROGRAMS;
