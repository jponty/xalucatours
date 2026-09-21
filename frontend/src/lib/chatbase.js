import { resolvePath } from "./routes";

// Shared entry point for the site's own virtual-assistant page.
// Legacy Chatbase-named exports are retained for existing consumers.
export const VIRTUAL_ASSISTANT_PATH = "/asistente";
export const VIRTUAL_ASSISTANT_OPEN_EVENT = "xaluca:open-virtual-assistant";
export const CHATBASE_HELP_URL = VIRTUAL_ASSISTANT_PATH;
export const VIRTUAL_ASSISTANT_INFO_EVENT = "xaluca:open-virtual-assistant-info";

export const openVirtualAssistant = (e) => {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  if (e && typeof e.stopPropagation === "function") e.stopPropagation();
  if (typeof window === "undefined") return;

  if (resolvePath(window.location.pathname)?.routeId === "asistente") {
    window.dispatchEvent(new CustomEvent(VIRTUAL_ASSISTANT_OPEN_EVENT));
    return;
  }

  window.location.assign(VIRTUAL_ASSISTANT_PATH);
};

export const openChatbaseAssistant = openVirtualAssistant;
export const launchChatbaseAssistant = openVirtualAssistant;
