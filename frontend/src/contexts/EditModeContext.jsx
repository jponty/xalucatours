import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const EditModeContext = createContext({
  editMode: false,
  toggle: () => {},
});

export const EditModeProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const toggle = useCallback(() => setEditMode((p) => !p), []);

  /* Global click guard.
     While edit mode is ON, any click that would navigate (via an <a> or
     <Link> wrapping an editable image area) is intercepted in the capture
     phase before React Router can act on it.

     We never block:
       • Clicks inside the cropper modal (`[role="dialog"]`)
       • The "Editar" button itself          (`[data-testid^="editable-edit-btn-"]`)
       • The edit-mode toggle in the header (`[data-testid="header-edit-mode-toggle"]`)
       • Any element with `data-edit-allow="true"`
       • Links that do not wrap an editable image (so the side menu, language
         switcher and footer remain functional for cross-page editing).
  */
  useEffect(() => {
    if (!editMode) return undefined;

    const handler = (e) => {
      const t = e.target;

      // Always allow the modal, the edit button, the toggle and explicit opt-outs
      if (t.closest('[role="dialog"]')) return;
      if (t.closest('[data-testid^="editable-edit-btn-"]')) return;
      if (t.closest('[data-testid="header-edit-mode-toggle"]')) return;
      if (t.closest('[data-edit-allow="true"]')) return;

      // Find the nearest anchor ancestor
      const link = t.closest('a');
      if (link) {
        // Block if the link wraps an editable image area
        if (link.querySelector('[data-testid^="editable-overlay-"]')) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }

      // Buttons that explicitly call navigate() are harder to detect without
      // a marker — block any element marked with `data-edit-block="true"`.
      if (t.closest('[data-edit-block="true"]')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [editMode]);

  /* While edit mode is on, give the page a subtle visual hint that links
     are paused for editing. */
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
