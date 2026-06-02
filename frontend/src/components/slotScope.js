/* ============================================================
   slotScope.js — Auto-namespaced slot ids for the inline CMS.
   ----
   Tiny helper module that lets ANY component derive a unique
   slot id from its surrounding context, without prop-drilling
   ids manually.

   Two primitives are exposed:

     <SlotScope id="hub.gransur-fez-rak">
       … your sub-tree, possibly several layers deep …
       <EditableImage name="program.fr-6-7" fallback=... />
     </SlotScope>

   The image above will resolve its slot to:
        `{pagePath}.hub.gransur-fez-rak.program.fr-6-7`

   ── usage notes ────────────────────────────────────────────
   1. `name` is a SHORT, semantic identifier (no spaces).
      Stack `<SlotScope id="cards">` to add another segment.
   2. Pass an absolute `slot="literal.id"` to bypass the scope
      entirely (back-compat with the original CMS API).
   3. The current page path is auto-prepended (and `/en|/fr/`
      stripped) so the same slot reads the same record across
      the three language URLs.

   This module is a 2017-style React context wrapper and does
   NOT import any heavy UI — it can be used from any component
   without creating circular dependencies.
============================================================ */
import React, { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { resolvePath, ROUTES } from "@/lib/routes";

/** Internal: current scope path as an array of dot-joined ids. */
export const SectionContext = createContext({ path: [] });

/** Map ANY localized pathname (ES/EN/FR) to a LANGUAGE-INDEPENDENT slot
 *  namespace so every language variant of a page reads & writes the SAME
 *  CMS slots. We resolve the path to its `routeId` and use the canonical
 *  ES slug as the namespace:
 *
 *    /viajes/norte/tanger_fez/...      (es)  ┐
 *    /en/tours/northern/tangier-fez/.. (en)  ├─► "viajes.norte.tanger_fez..."
 *    /fr/voyages/nord/tanger-fes/...   (fr)  ┘
 *
 *  Because ES pages already use their ES slug as the namespace, existing
 *  slot ids are UNCHANGED (no migration); only EN/FR pages now converge
 *  onto the same shared slots. Images become identical across languages,
 *  while text keeps its per-language {es,en,fr} values inside one slot.
 *
 *  Fallback: unregistered routes keep the legacy behaviour (strip the
 *  /en|/fr prefix) so nothing breaks for dynamic/unknown paths. */
const normalisePathname = (pathname) => {
  const { routeId } = resolvePath(pathname);
  if (routeId && ROUTES[routeId]) {
    const canonical = (ROUTES[routeId].es || "")
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean)
      .join(".");
    return canonical || "home";
  }
  // Legacy fallback for paths not registered in ROUTES.
  const clean = (pathname || "/").replace(/^\/+|\/+$/g, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts[0] === "en" || parts[0] === "fr") parts.shift();
  // Join with "." (not "/") so slot ids are safe for FastAPI path params
  // (FastAPI rejects encoded slashes in `{slot_id}` and the slot id is
  // also used as a Mongo _id where dots are the established separator).
  return parts.join(".") || "home";
};

/** Hook: returns the current page path (minus language prefix). */
export const usePageNamespace = () => {
  const loc = useLocation();
  return useMemo(() => normalisePathname(loc.pathname), [loc.pathname]);
};

/** Hook: returns the active scope path as a dot-joined string
 *  (without the page prefix). Useful for read-only consumers. */
export const useSlotPath = () => {
  const ctx = useContext(SectionContext);
  return useMemo(() => ctx.path.join("."), [ctx.path]);
};

/** Hook: build a full slot id from the current scope + a local
 *  `name`. The page prefix is prepended automatically. */
export const useSlotId = (name) => {
  const page = usePageNamespace();
  const ctx = useContext(SectionContext);
  return useMemo(() => {
    const parts = [page, ...ctx.path, name].filter(Boolean);
    return parts.join(".");
  }, [page, ctx.path, name]);
};

/**
 * <SlotScope id="namespace"> — pushes an extra segment onto the
 * scope path. Children can use `name=` props to auto-derive
 * slots without knowing the parent's id.
 *
 * Props:
 *   id       short, semantic, stable. Lower-case, no spaces.
 *   as       wrapper element tag (default `React.Fragment`).
 *   children any sub-tree.
 *
 * Multiple <SlotScope id="a"><SlotScope id="b">… can be nested
 * to compose dotted ids like `a.b.<name>`.
 */
export const SlotScope = ({ id, as: Tag = React.Fragment, children, ...rest }) => {
  const parent = useContext(SectionContext);
  const value = useMemo(
    () => ({ path: id ? [...parent.path, id] : parent.path }),
    [parent.path, id],
  );
  if (Tag === React.Fragment) {
    return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>;
  }
  return (
    <SectionContext.Provider value={value}>
      <Tag data-slot-scope={id} {...rest}>{children}</Tag>
    </SectionContext.Provider>
  );
};
