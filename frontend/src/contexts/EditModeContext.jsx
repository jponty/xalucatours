import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const EditModeContext = createContext({
  editMode: false,
  toggle: () => {},
});

export const EditModeProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const toggle = useCallback(() => setEditMode((p) => !p), []);

  /* ===================================================================
     Lock-down: while edit mode is ON, the page becomes an editing
     environment. ALL navigation is blocked until the admin toggles it
     off — links, history changes and back/forward gestures included.

     Only the editing UI keeps working:
       • The modal cropper                                    (`[role="dialog"]`)
       • The "Editar" button on each slot       (`[data-testid^="editable-edit-btn-"]`)
       • The edit-mode toggle in the header   (`[data-testid="header-edit-mode-toggle"]`)
       • Any element opted in via             `data-edit-allow="true"`
  =================================================================== */

  // 1. Capture-phase click guard for <a> and opt-in elements
  useEffect(() => {
    if (!editMode) return undefined;

    const allowed = (target) =>
      target.closest('[role="dialog"]') ||
      target.closest('[data-testid^="editable-edit-btn-"]') ||
      target.closest('[data-testid="header-edit-mode-toggle"]') ||
      target.closest('[data-edit-allow="true"]');

    const handler = (e) => {
      const t = e.target;
      if (allowed(t)) return;

      // Block ALL anchor clicks unconditionally
      if (t.closest("a")) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        return;
      }

      // Block any element explicitly marked as a navigation source
      if (t.closest('[data-edit-block="true"]')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
      }
    };

    document.addEventListener("click", handler, true);
    document.addEventListener("auxclick", handler, true); // middle-click
    return () => {
      document.removeEventListener("click", handler, true);
      document.removeEventListener("auxclick", handler, true);
    };
  }, [editMode]);

  // 2. Lock browser history — block back/forward & mobile swipe gestures
  useEffect(() => {
    if (!editMode) return undefined;

    // Push a sentinel state so any back gesture lands here and bounces
    const sentinel = { __editLock: true };
    window.history.pushState(sentinel, "");

    const onPop = () => {
      // Immediately re-push to cancel the navigation
      window.history.pushState(sentinel, "");
    };
    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("popstate", onPop);
      // Best-effort cleanup of the sentinel state
      try {
        if (window.history.state && window.history.state.__editLock) {
          window.history.back();
        }
      } catch (e) { /* noop */ }
    };
  }, [editMode]);

  // 3. Block the navigator beforeunload (refresh / close / external nav)
  useEffect(() => {
    if (!editMode) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editMode]);

  // 4. Block keyboard navigation shortcuts that would change the route
  useEffect(() => {
    if (!editMode) return undefined;
    const onKey = (e) => {
      const t = e.target;
      // Allow typing inside the modal (inputs, textareas, range sliders)
      if (t.closest('[role="dialog"]')) return;
      // Alt+Left / Alt+Right (browser nav)
      if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Cmd/Ctrl + L (focus address bar) — can't fully block but we try
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [editMode]);

  // 5. Visual hint
  useEffect(() => {
    if (editMode) document.body.classList.add("edit-mode-on");
    else document.body.classList.remove("edit-mode-on");
    return () => document.body.classList.remove("edit-mode-on");
  }, [editMode]);

  return (
    <EditModeContext.Provider value={{ editMode, toggle }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => useContext(EditModeContext);

export default EditModeContext;
