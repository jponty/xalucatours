/* ============================================================
   chatbase — single source of truth for opening the Chatbase
   "Asistente Virtual" widget across the whole site.

   Use openChatbaseAssistant as a click handler anywhere:
     <button onClick={openChatbaseAssistant} />
   It safely calls preventDefault/stopPropagation when an event is
   passed (e.g. inside clickable cards/links) and falls back to the
   public help URL when the embedded widget isn't available yet.
============================================================ */

// Public fallback URL (used when the embedded widget hasn't loaded).
export const CHATBASE_HELP_URL = "https://www.chatbase.co/0g0xD-K8_amm7Ihz-vPj2/help";

export const openChatbaseAssistant = (e) => {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  if (e && typeof e.stopPropagation === "function") e.stopPropagation();
  try {
    if (window.chatbase && typeof window.chatbase.open === "function") {
      window.chatbase.open();
      return;
    }
  } catch (_) { /* fall through to URL */ }
  window.open(CHATBASE_HELP_URL, "_blank", "noopener,noreferrer");
};
