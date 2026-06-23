import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const EditModeContext = createContext({
  imageEditMode: false,
  textEditMode: false,
  anyEditMode: false,         // imageEditMode || textEditMode
  editMode: false,            // legacy alias = imageEditMode
  toggle: () => {},           // legacy alias = toggleImage
  toggleImage: () => {},
  toggleText: () => {},
  exitAll: () => {},
});

/* ====================================================================
   EditModeProvider — two independent editing modes share the same
   navigation lockdown infrastructure.

   • imageEditMode → enables <EditableImage> click overlays + cropper
   • textEditMode  → enables <EditableText>  contenteditable surfaces

   The two modes are mutually exclusive (activating one disables the
   other) so the admin UI only ever shows one set of affordances at a
   time, but the lock-down code below treats them uniformly: while
   ANY mode is on, every link / card / navigation gesture is blocked.
==================================================================== */
export const EditModeProvider = ({ children }) => {
  const [imageEditMode, setImageEditMode] = useState(false);
  const [textEditMode, setTextEditMode] = useState(false);

  const toggleImage = useCallback(() => {
    setImageEditMode((p) => {
      const next = !p;
      if (next) setTextEditMode(false);
      return next;
    });
  }, []);
  const toggleText = useCallback(() => {
    setTextEditMode((p) => {
      const next = !p;
      if (next) setImageEditMode(false);
      return next;
    });
  }, []);
  const exitAll = useCallback(() => {
    setImageEditMode(false);
    setTextEditMode(false);
  }, []);

  const anyMode = imageEditMode || textEditMode;

  // 1. Capture-phase navigation guard.
  //    Editing must be completely isolated from navigation: no link should
  //    fire, no card should redirect, no middle-click should open a new
  //    tab. We intercept every gesture that browsers/SPA routers can hook
  //    into — click, auxclick (middle-click), mousedown, pointerdown —
  //    in the capture phase so we beat React's own bubble-phase listeners
  //    AND any document-level navigation library.
  useEffect(() => {
    if (!anyMode) return undefined;

    const isAllowed = (target) =>
      target.closest('[role="dialog"]') ||
      target.closest('[data-testid^="editable-edit-btn-"]') ||
      target.closest('[data-testid^="editable-text-"]') ||
      target.closest('[data-testid="header-edit-mode-toggle"]') ||
      target.closest('[data-testid="header-text-edit-toggle"]') ||
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

    // Suppress native image dragging while editing.
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
  }, [anyMode]);

  // 2. SPA + browser history lock-down: deposit a sentinel in history and
  //    immediately undo any back/forward gesture.
  useEffect(() => {
    if (!anyMode) return undefined;
    // history.pushState / history.back can throw in sandboxed iframes or when
    // permissions block them. These failures are non-actionable — the edit
    // lock simply degrades gracefully — so we explicitly debug-log them.
    try { window.history.pushState({ __editLock: true }, ""); }
    catch (err) { console.debug("[editLock] pushState blocked:", err); }
    const onPop = () => {
      try { window.history.pushState({ __editLock: true }, ""); }
      catch (err) { console.debug("[editLock] pushState blocked:", err); }
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      try {
        if (window.history.state && window.history.state.__editLock) {
          window.history.back();
        }
      } catch (err) { console.debug("[editLock] history.back blocked:", err); }
    };
  }, [anyMode]);

  // 3. Block keyboard navigation shortcuts that would change the route
  useEffect(() => {
    if (!anyMode) return undefined;
    const onKey = (e) => {
      const t = e.target;
      if (t.closest('[role="dialog"]')) return;
      // While text-edit is on, typing inside an EditableText must work
      if (t.closest('[data-testid^="editable-text-"]')) return;
      if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [anyMode]);

  // 4. Visual hint — separate body classes so CSS can target each mode
  useEffect(() => {
    document.body.classList.toggle("edit-mode-on", anyMode);
    document.body.classList.toggle("edit-mode-image", imageEditMode);
    document.body.classList.toggle("edit-mode-text", textEditMode);
    return () => {
      document.body.classList.remove("edit-mode-on", "edit-mode-image", "edit-mode-text");
    };
  }, [anyMode, imageEditMode, textEditMode]);

  const value = {
    imageEditMode,
    textEditMode,
    anyEditMode: anyMode,       // image OR text edit is active
    editMode: imageEditMode,    // legacy alias
    toggle: toggleImage,        // legacy alias
    toggleImage,
    toggleText,
    exitAll,
  };

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => useContext(EditModeContext);

export default EditModeContext;
