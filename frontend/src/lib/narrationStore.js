/* ----------------------------------------------------------------
   Global narration store
   ------------------------------------------------------------
   Tiny pub/sub that tracks the single <audio> narration currently
   active across all VideoSection instances on a page. Powers the
   floating mini-player so the user can control playback from
   anywhere on the page.
---------------------------------------------------------------- */
let state = { el: null, title: "", eyebrow: "", playing: false };
const listeners = new Set();

const emit = () => {
  for (const fn of listeners) fn(state);
};

export const subscribeNarration = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const getNarrationState = () => state;

/* A narration started playing — becomes the active one. */
export const setNarration = (el, meta = {}) => {
  state = { el, title: meta.title || "", eyebrow: meta.eyebrow || "", playing: true };
  emit();
};

/* Sync the play/pause flag for the active narration only. */
export const updateNarrationPlaying = (playing) => {
  if (!state.el) return;
  state = { ...state, playing };
  emit();
};

/* Clear the active narration (ended, closed or unmounted). */
export const clearNarration = (el) => {
  if (el && state.el !== el) return;
  state = { el: null, title: "", eyebrow: "", playing: false };
  emit();
};
