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

/** Internal: current scope path as an array of dot-joined ids. */
export const SectionContext = createContext({ path: [] });

/** Strip /en/ or /fr/ from the location pathname so the slot id
 *  is identical across language variants. */
const normalisePathname = (pathname) => {
  const clean = (pathname || "/").replace(/^\/+|\/+$/g, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts[0] === "en" || parts[0] === "fr") parts.shift();
  return parts.join("/") || "home";
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
