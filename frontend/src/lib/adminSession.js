export const ADMIN_TOKEN_KEY = "xaluca_admin_token";
export const ADMIN_SESSION_EVENT = "xaluca:admin-session-changed";

export const getAdminToken = () => {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const adminAuthHeaders = (headers = {}) => {
  const token = getAdminToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : { ...headers };
};

export const notifyAdminSessionChanged = () => {
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
};
