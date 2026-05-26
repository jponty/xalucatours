import React, { createContext, useContext, useRef, useCallback, useMemo } from "react";

/* ============================================================
   EditableGroup — gathers a section's <EditableImage> siblings
   into a single editable gallery.
   ------------------------------------------------------------
   Each <EditableImage> auto-registers itself on mount inside
   the closest <EditableGroup>. The modal reads the snapshot
   via `list()` to expose:

     • Thumbnail strip (navigate between sibling slots)
     • Prev / next sibling
     • Bulk upload (drop N files → distributed across slots)

   Registration order = DOM order, which matches the carousel
   visual order (slides, cards, etc.).
============================================================ */

const EditableGroupContext = createContext(null);

export const EditableGroup = ({ id, label, children }) => {
  // Stable mutable list of registered items. We don't render it,
  // we just snapshot it when the modal opens — so a ref is enough
  // and avoids re-renders on every child mount.
  const itemsRef = useRef([]);

  const register = useCallback((item) => {
    // Replace any existing entry for the same slot, preserve order.
    const idx = itemsRef.current.findIndex((i) => i.slot === item.slot);
    if (idx === -1) itemsRef.current = [...itemsRef.current, item];
    else {
      const next = itemsRef.current.slice();
      next[idx] = item;
      itemsRef.current = next;
    }
    return () => {
      itemsRef.current = itemsRef.current.filter((i) => i.slot !== item.slot);
    };
  }, []);

  const list = useCallback(() => itemsRef.current.slice(), []);

  const value = useMemo(() => ({ id, label, register, list }), [id, label, register, list]);

  return (
    <EditableGroupContext.Provider value={value}>
      {children}
    </EditableGroupContext.Provider>
  );
};

export const useEditableGroup = () => useContext(EditableGroupContext);

export default EditableGroupContext;
