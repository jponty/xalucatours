/* ----------------------------------------------------------------
   Global narration controller
   ------------------------------------------------------------
   A single module-level <audio> singleton drives all VideoSection
   narrations. Because it lives at module scope (not in the React
   tree), playback survives route changes: the audio keeps playing
   in the background as the user navigates the site, preserving the
   play/pause state and position until they stop it manually.

   Only one narration plays at a time (same element). The floating
   mini-player and every audio VideoSection subscribe to this store
   to reflect and control playback.
---------------------------------------------------------------- */
let audio = null;

let state = {
  src: null,
  title: "",
  eyebrow: "",
  sectionTestId: null,
  playing: false,
  muted: false,
  currentTime: 0,
  duration: 0,
};

const listeners = new Set();
const emit = () => {
  for (const fn of listeners) fn(state);
};
const set = (patch) => {
  state = { ...state, ...patch };
  emit();
};

function ensureAudio() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = "metadata";
  audio.addEventListener("play", () => set({ playing: true }));
  audio.addEventListener("pause", () => set({ playing: false }));
  audio.addEventListener("ended", () => set({ playing: false, currentTime: 0 }));
  audio.addEventListener("timeupdate", () => set({ currentTime: audio.currentTime }));
  audio.addEventListener("durationchange", () => set({ duration: audio.duration || 0 }));
  audio.addEventListener("loadedmetadata", () => set({ duration: audio.duration || 0 }));
  audio.addEventListener("volumechange", () => set({ muted: audio.muted }));
  return audio;
}

export const subscribeNarration = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const getNarrationState = () => state;

/* Start (or restart) a narration. If the same src is already loaded it
   simply resumes from its current position. */
export function playNarration(src, meta = {}) {
  const a = ensureAudio();
  if (state.src !== src) {
    a.src = src;
    try { a.currentTime = 0; } catch { /* not ready yet */ }
    set({
      src,
      title: meta.title ?? "",
      eyebrow: meta.eyebrow ?? "",
      sectionTestId: meta.sectionTestId ?? null,
      currentTime: 0,
    });
  } else {
    set({
      title: meta.title ?? state.title,
      eyebrow: meta.eyebrow ?? state.eyebrow,
      sectionTestId: meta.sectionTestId ?? state.sectionTestId,
    });
  }
  a.muted = false;
  a.play().catch(() => {});
}

export function pauseNarration() {
  if (audio) audio.pause();
}

/* Toggle a specific narration: pause it if it's the current one playing,
   otherwise (re)start it. */
export function toggleNarration(src, meta = {}) {
  if (state.src === src && state.playing) {
    pauseNarration();
  } else {
    playNarration(src, meta);
  }
}

/* Play/pause the current narration (used by the mini-player). */
export function toggleCurrentNarration() {
  const a = ensureAudio();
  if (state.playing) a.pause();
  else a.play().catch(() => {});
}

export function toggleNarrationMuted() {
  const a = ensureAudio();
  a.muted = !a.muted;
}

export function seekNarration(t) {
  if (audio) {
    try { audio.currentTime = t; } catch { /* ignore */ }
  }
}

/* Stop completely and clear — the user closed the player. */
export function stopNarration() {
  if (audio) {
    audio.pause();
    try { audio.currentTime = 0; } catch { /* ignore */ }
  }
  set({
    src: null,
    title: "",
    eyebrow: "",
    sectionTestId: null,
    playing: false,
    currentTime: 0,
    duration: 0,
  });
}
