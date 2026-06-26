/* ============================================================
   FavoritesContext — local (no auth) "favourite trips" store.
   Persists an array of trip routeIds in localStorage and keeps the
   header badge, trip pages and the /favoritos page in sync. Also
   syncs across browser tabs via the `storage` event.
============================================================ */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const KEY = "xaluca:favorites";
const FavoritesContext = createContext(null);

const readStore = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(readStore);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites));
    } catch {
      /* storage unavailable — keep working in-memory */
    }
  }, [favorites]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setFavorites(readStore());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleFavorite = useCallback((id) => {
    if (!id) return;
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((x) => x !== id));
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, count: favorites.length, toggleFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};

export default FavoritesContext;
