/* ============================================================
   chatbase — single source of truth for opening the Chatbase
   "Asistente Virtual" widget across the whole site.

   Use openChatbaseAssistant as a click handler anywhere:
     <button onClick={openChatbaseAssistant} />
   It opens the shared informational modal before launching the widget.
   launchChatbaseAssistant is reserved for the modal's confirmed action.
============================================================ */

// Public fallback URL (used when the embedded widget hasn't loaded).
export const CHATBASE_HELP_URL = "https://www.chatbase.co/0g0xD-K8_amm7Ihz-vPj2/help";
export const VIRTUAL_ASSISTANT_INFO_EVENT = "xaluca:open-virtual-assistant-info";

export const launchChatbaseAssistant = () => {
  try {
    if (window.chatbase && typeof window.chatbase.open === "function") {
      window.chatbase.open();
      return;
    }
  } catch (_) { /* fall through to URL */ }
  window.open(CHATBASE_HELP_URL, "_blank", "noopener,noreferrer");
};

export const openChatbaseAssistant = (e) => {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  if (e && typeof e.stopPropagation === "function") e.stopPropagation();
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VIRTUAL_ASSISTANT_INFO_EVENT));
};
