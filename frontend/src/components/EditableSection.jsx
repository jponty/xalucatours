import React, { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { EditableText } from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";

/* ============================================================
   Global Inline-CMS Auto-Slot API
   ---------------------------------------------------------------
   The original CMS exposes two primitives that persist content
   per "slot" id in MongoDB:

     <EditableText  slot="home.hero.title" defaults={...}/>
     <EditableImage slot="home.hero.bg"    src=... />

   This module wraps them in an ergonomic, auto-namespaced API so
   ANY page or component can declare editable surfaces with one
   line and ZERO manual slot bookkeeping:

     <EditableSection id="hero">
       <E name="eyebrow" defaults={{ es: "Especialistas…" }} />
       <E name="title"   as="h1">Tu viaje a medida.</E>
       <EImg name="bg" src="https://..." aspect="16/9" />
     </EditableSection>

   How the slot id is built:
     `${pagePath}.${section1}.${section2…}.${name}`

     • pagePath comes from useLocation(). The language prefix is
       stripped so the same slot reads the same record regardless
       of language.
     • Section ids stack through nesting (a section inside a
       section concatenates with a dot).
     • `name` is the only manual bit — semantic and stable across
       refactors. We strongly recommend giving every <E> / <EImg>
       a meaningful name (e.g. "title", "subtitle", "bg").

   Coexistence with the legacy API:
     Pages already wired with `<EditableText slot="literal.id" />`
     keep working unchanged — they bypass the auto-slot context.
============================================================ */

const SectionContext = createContext({
  path: [], // array of section ids, joined with dots
});

/** Strip /en/ or /fr/ prefix from the current location so the
 *  slot id is identical across the three language URLs. */
const normalisePathname = (pathname) => {
  const clean = (pathname || "/").replace(/^\/+|\/+$/g, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts[0] === "en" || parts[0] === "fr") parts.shift();
  return parts.join("/") || "home";
};

/** Top-level page namespace. Hooked once per render. */
const usePageNamespace = () => {
  const loc = useLocation();
  return useMemo(() => normalisePathname(loc.pathname), [loc.pathname]);
};

/**
 * <EditableSection id="hero"> — declares a logical section in the
 * editable tree. Sections compose: nesting `<EditableSection id="cta">`
 * inside `<EditableSection id="hero">` produces slot ids like
 * `<page>.hero.cta.<name>`.
 *
 * Props:
 *   id          short, semantic, stable. Lower-case, no spaces.
 *   as          element tag (default "div"). Pass `Fragment` to skip
 *               the wrapper element. Forwards remaining props.
 */
export const EditableSection = ({ id, as: Tag = "div", children, ...rest }) => {
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
      <Tag data-edit-section={id} {...rest}>{children}</Tag>
    </SectionContext.Provider>
  );
};

/** Compose the final slot id from current section path + a local name. */
const useSlotId = (name) => {
  const page = usePageNamespace();
  const section = useContext(SectionContext);
  return useMemo(() => {
    const parts = [page, ...section.path, name].filter(Boolean);
    return parts.join(".");
  }, [page, section.path, name]);
};

/**
 * <E name="title" defaults={{...}}> — short alias around
 * <EditableText>. The slot id is derived automatically.
 *
 * Either give it a `defaults` prop (preferred) or use the
 * `children` shorthand — the first child string becomes the
 * Spanish default and is also used for English/French until
 * translated.
 */
export const E = ({ name, defaults, children, as = "span", multiline = true, className, ...rest }) => {
  const slot = useSlotId(name);
  // Allow `<E name="title">Hello</E>` as a shorthand for
  //        `<E name="title" defaults={{ es: "Hello" }} />`
  let resolvedDefaults = defaults;
  if (!resolvedDefaults && typeof children === "string") {
    resolvedDefaults = { es: children, en: children, fr: children };
  }
  return (
    <EditableText
      slot={slot}
      defaults={resolvedDefaults || {}}
      as={as}
      multiline={multiline}
      className={className}
      {...rest}
    />
  );
};

/**
 * <EImg name="bg" src="..." aspectRatio="16/9" /> — short alias around
 * <EditableImage>. Same auto-slot derivation as <E>.
 *
 * The `src` prop maps to <EditableImage>'s `fallback` (it is the
 * placeholder image shown when the slot has no override stored).
 * Pass `aspectRatio` ("1/1", "4/5", "16/9", "21/9", …) to tell the
 * cropper which placeholder ratio to enforce.
 */
export const EImg = ({ name, src, alt, className, aspectRatio, imgProps, forceVisible, ...rest }) => {
  const slot = useSlotId(name);
  return (
    <EditableImage
      slot={slot}
      fallback={src}
      alt={alt}
      className={className}
      aspectRatio={aspectRatio}
      imgProps={imgProps}
      forceVisible={forceVisible}
      {...rest}
    />
  );
};

export default EditableSection;
