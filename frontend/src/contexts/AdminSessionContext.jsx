import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  ADMIN_SESSION_EVENT,
  ADMIN_TOKEN_KEY,
  getAdminToken,
} from "@/lib/adminSession";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminSessionContext = createContext({
  authenticated: false,
  checking: true,
  refresh: async () => false,
});

export const AdminSessionProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      setAuthenticated(false);
      setChecking(false);
      return false;
    }

    try {
      const response = await fetch(`${API}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) localStorage.removeItem(ADMIN_TOKEN_KEY);
        setAuthenticated(false);
        return false;
      }
      setAuthenticated(true);
      return true;
    } catch {
      // Fail closed: if the backend cannot validate the token, editing tools
      // stay hidden. Keep the token so a temporary outage doesn't log out the admin.
      setAuthenticated(false);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = (event) => {
      if (!event.key || event.key === ADMIN_TOKEN_KEY) refresh();
    };
    const onFocus = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener(ADMIN_SESSION_EVENT, refresh);
    window.addEventListener("focus", onFocus);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(ADMIN_SESSION_EVENT, refresh);
      window.removeEventListener("focus", onFocus);
      window.clearInterval(timer);
    };
  }, [refresh]);

  return (
    <AdminSessionContext.Provider value={{ authenticated, checking, refresh }}>
      {children}
    </AdminSessionContext.Provider>
  );
};

export const useAdminSession = () => useContext(AdminSessionContext);
