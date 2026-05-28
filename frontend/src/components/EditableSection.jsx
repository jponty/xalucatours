import React, { useContext, useMemo } from "react";
import { EditableText } from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";
import {
  SectionContext,
  useSlotId,
  SlotScope,
} from "@/components/slotScope";

/* ============================================================
   Global Inline-CMS Auto-Slot API
   ---------------------------------------------------------------
   This module is a thin, semantic façade on top of `slotScope.js`.
   It pre-exists in the codebase and exposes a richer DSL:

     <EditableSection id="hero">
       <E name="eyebrow" defaults={{ es: "Especialistas…" }} />
       <E name="title"   as="h1">Tu viaje a medida.</E>
       <EImg name="bg" src="https://..." aspect="16/9" />
     </EditableSection>

   Slot ids are built as:
       `${pagePath}.${section1}.${section2…}.${name}`

   The same context is consumed by `<EditableImage name="x" />`
   so any deeply-nested component can declare an editable image
   without knowing the parent section ids.
============================================================ */

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

/* Re-export the bare scope primitive for components that don't want
   to render an extra wrapper element. */
export { SlotScope, useSlotId };

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
