// All entry points open the single modal mounted by GlobalDictationWidget.
export const OPEN_DICTATION_MODAL_EVENT = "xaluca:open-dictation-modal";

export function requestDictationModal(trigger) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_DICTATION_MODAL_EVENT, { detail: { trigger } }));
}
