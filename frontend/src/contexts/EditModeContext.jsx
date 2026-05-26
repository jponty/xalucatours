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

  // 1. Capture-phase navigation guard.
  //    Editing must be completely isolated from navigation: no link should
  //    fire, no card should redirect, no middle-click should open a new
  //    tab. We intercept every gesture that browsers/SPA routers can hook
  //    into — click, auxclick (middle-click), mousedown, pointerdown —
  //    in the capture phase so we beat React's own bubble-phase listeners
  //    AND any document-level navigation library.
  useEffect(() => {
    if (!editMode) return undefined;

    const isAllowed = (target) =>
      target.closest('[role="dialog"]') ||
      target.closest('[data-testid^="editable-edit-btn-"]') ||
      target.closest('[data-testid="header-edit-mode-toggle"]') ||
      target.closest('[data-edit-allow="true"]');

    const block = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation?.();
    };

    const handler = (e) => {
      const t = e.target;
      if (!t) return;

      // Middle-click (button 1) inside an <a> would open a new tab even
      // if the immediate target is a whitelisted button. Block it
      // unconditionally — middle-click has no meaning while editing.
      const isMiddle = e.button === 1 || e.type === "auxclick";
      if (isMiddle && t.closest("a")) return block(e);

      if (isAllowed(t)) return;

      // Block ALL anchor clicks unconditionally (covers React Router <Link>
      // since it renders an <a> and binds onClick in bubble phase).
      if (t.closest("a")) return block(e);

      // Opt-in extra block (cards/buttons explicitly tagged as navigation).
      if (t.closest('[data-edit-block="true"]')) return block(e);
    };

    // Suppress native image dragging while editing — a stray drag could
    // start a ghost image and trigger unintended browser behaviours.
    const dragHandler = (e) => {
      const t = e.target;
      if (isAllowed(t)) return;
      if (t.tagName === "IMG" || t.tagName === "A" || t.closest("a")) block(e);
    };

    document.addEventListener("click", handler, true);
    document.addEventListener("auxclick", handler, true);
    document.addEventListener("mousedown", handler, true);
    document.addEventListener("pointerdown", handler, true);
    document.addEventListener("dragstart", dragHandler, true);

    return () => {
      document.removeEventListener("click", handler, true);
      document.removeEventListener("auxclick", handler, true);
      document.removeEventListener("mousedown", handler, true);
      document.removeEventListener("pointerdown", handler, true);
      document.removeEventListener("dragstart", dragHandler, true);
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

  // 3. (Removed) `beforeunload` prompt — caused a spurious native dialog
  //    "¿Quieres salir del sitio web?" while interacting with the upload modal
  //    in some browsers. The combination of click interception + history
  //    sentinel + keyboard guards already prevents accidental in-app
  //    navigation, which is the only thing we actually want to lock down.
  //    Explicit F5 / closing the tab is a voluntary user action and must
  //    not block the upload workflow.

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
