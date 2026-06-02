import React, { useEffect, useRef, useState, useCallback } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const API = process.env.REACT_APP_BACKEND_URL;

/* ============================================================
   Lightweight in-memory cache + global fetch coordinator.
   Many <EditableText> instances render at once; we bulk-load
   /api/text_slots once on first mount and let every instance
   subscribe to its own slot value.
============================================================ */
const cache = {
  ready: false,
  loading: null,                // Promise while initial fetch is in flight
  values: new Map(),            // slot_id → { es?, en?, fr? }
  subscribers: new Map(),       // slot_id → Set<callback>
};

const notify = (slot) => {
  const subs = cache.subscribers.get(slot);
  if (subs) subs.forEach((cb) => cb(cache.values.get(slot)));
};

const ensureLoaded = async () => {
  if (cache.ready) return;
  if (cache.loading) return cache.loading;
  cache.loading = (async () => {
    try {
      const res = await fetch(`${API}/api/text_slots`);
      const data = await res.json();
      const slots = (data && data.slots) || {};
      for (const [slot, vals] of Object.entries(slots)) {
        cache.values.set(slot, vals || {});
      }
    } catch {
      // Network/parse failure — keep cache empty so defaults render.
    }
    cache.ready = true;
    cache.loading = null;
    // Notify every subscriber so they re-render with hydrated values
    for (const slot of cache.subscribers.keys()) notify(slot);
  })();
  return cache.loading;
};

const pickStored = (slot, lang) => {
  const v = cache.values.get(slot);
  if (!v) return null;
  return v[lang] ?? v.es ?? v.en ?? v.fr ?? null;
};

const persistSlot = async (slot, values) => {
  cache.values.set(slot, values);
  notify(slot);
  const res = await fetch(`${API}/api/text_slots/${encodeURIComponent(slot)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });
  if (!res.ok) throw new Error("save-failed");
};

/* ============================================================
   <EditableText> — replaces a static piece of copy with an
   inline-editable element when textEditMode is ON.

   Props:
     slot       unique id, e.g. "home.hero.title"
     defaults   { es?, en?, fr? } — fallback strings used when the
                slot has nothing stored yet
     as         element tag (default "span") — use the existing tag
                so the surrounding typography doesn't change
     multiline  allow line breaks (default true). When false, Enter
                blurs the field instead of inserting \n.
     className  forwarded to the element
============================================================ */
export const EditableText = ({
  slot,
  defaults = {},
  as: Tag = "span",
  multiline = true,
  className = "",
  noTranslate = false,  // skip ES->EN/FR autotranslation (dates, numbers, codes)
  children,             // ignored — kept for ergonomic markup
  ...rest
}) => {
  const { textEditMode } = useEditMode();
  const { lang } = useLanguage();
  const [stored, setStored] = useState(() => cache.values.get(slot));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const elRef = useRef(null);

  // Subscribe to cache updates
  useEffect(() => {
    if (!cache.subscribers.has(slot)) cache.subscribers.set(slot, new Set());
    const cb = (v) => setStored(v ? { ...v } : v);
    cache.subscribers.get(slot).add(cb);
    ensureLoaded();
    return () => {
      const s = cache.subscribers.get(slot);
      if (s) s.delete(cb);
    };
  }, [slot]);

  const value = (stored && stored[lang]) || defaults[lang] || defaults.es || defaults.en || defaults.fr || "";

  // Save current contents on blur. We diff against the stored value to
  // avoid creating empty save requests when the user just focused.
  const save = useCallback(async () => {
    if (!elRef.current) return;
    const newText = elRef.current.innerText.replace(/\u00A0/g, " ").trim();
    const original = (stored && stored[lang]) ?? defaults[lang] ?? "";
    if (newText === original) {
      setDirty(false);
      return;
    }
    setSaving(true);
    try {
      const baseValues = { ...(stored || {}), [lang]: newText };
      // Persist the edited language first so the edit is saved instantly.
      await persistSlot(slot, baseValues);
      setDirty(false);

      // Autotranslation: when editing Spanish (source of truth), generate
      // English & French so every language variant stays synchronized.
      if (lang === "es" && newText && !noTranslate) {
        try {
          const res = await fetch(`${API}/api/translate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newText, source: "es", targets: ["en", "fr"] }),
          });
          if (res.ok) {
            const data = await res.json();
            const tr = (data && data.translations) || {};
            if (tr.en || tr.fr) {
              const merged = { ...baseValues };
              if (tr.en) merged.en = tr.en;
              if (tr.fr) merged.fr = tr.fr;
              await persistSlot(slot, merged);
            }
          }
        } catch {
          // Translation is best-effort; the ES edit is already saved.
        }
      }
    } catch {
      // Save failed (offline, 5xx). Caller can retry by re-editing.
    } finally {
      setSaving(false);
    }
  }, [slot, lang, stored, defaults, noTranslate]);

  const onInput = () => setDirty(true);
  const onKeyDown = (e) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      elRef.current?.blur();
    }
    if (e.key === "Escape") {
      // Revert to stored value
      if (elRef.current) elRef.current.innerText = value;
      setDirty(false);
      elRef.current?.blur();
    }
  };

  // Keep the contentEditable surface in sync when the underlying value
  // changes from outside (e.g. another user saves, or lang switches).
  useEffect(() => {
    if (!elRef.current) return;
    if (document.activeElement === elRef.current) return; // don't fight typing
    elRef.current.innerText = value;
  }, [value]);

  // STATIC RENDER (text-edit mode OFF) — render exactly what users see
  if (!textEditMode) {
    return (
      <Tag className={className} {...rest}>
        {value}
      </Tag>
    );
  }

  // EDIT RENDER (text-edit mode ON) — contenteditable surface
  return (
    <Tag
      ref={elRef}
      data-testid={`editable-text-${slot}`}
      data-slot={slot}
      contentEditable
      suppressContentEditableWarning
      onInput={onInput}
      onBlur={save}
      onKeyDown={onKeyDown}
      onPaste={(e) => {
        // Paste plain text only — prevents pulling weird formatting
        e.preventDefault();
        const txt = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, txt);
      }}
      onClickCapture={(e) => {
        // Inside <a>, the click would still navigate. Cancel here
        // (the document-level guard also catches it, but defence in
        // depth keeps the caret behaviour clean).
        e.stopPropagation();
      }}
      onMouseDownCapture={(e) => e.stopPropagation()}
      onPointerDownCapture={(e) => e.stopPropagation()}
      className={[
        className,
        "outline-none transition-shadow duration-200",
        "ring-offset-[3px] ring-offset-transparent",
        dirty ? "ring-2 ring-[#C16542]" : "ring-1 ring-[#C16542]/40 hover:ring-[#C16542]",
        saving ? "opacity-60" : "",
      ].filter(Boolean).join(" ")}
      style={{ cursor: "text" }}
      spellCheck={true}
      {...rest}
    >
      {value}
    </Tag>
  );
};

export default EditableText;
