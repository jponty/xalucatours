import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { translations } from "@/lib/i18n";
import { SUPPORTED_LANGS, DEFAULT_LANG, resolvePath, rewriteForLang } from "@/lib/routes";

const LanguageContext = createContext({ lang: DEFAULT_LANG, setLang: () => {}, t: () => "" });

export const LanguageProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initial language priority: URL > localStorage > default (es)
  const [lang, setLangState] = useState(() => {
    const fromUrl = resolvePath(location.pathname).lang;
    if (fromUrl) return fromUrl;
    try {
      const stored = localStorage.getItem("xaluca-tours-lang");
      if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    } catch (err) {
      // localStorage can throw in private-mode Safari — non-fatal, fall through to default.
      console.warn("[LanguageContext] localStorage read failed:", err);
    }
    return DEFAULT_LANG;
  });

  // Keep <html lang>, localStorage and URL in sync
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("xaluca-tours-lang", lang);
    } catch (err) {
      console.warn("[LanguageContext] localStorage write failed:", err);
    }
  }, [lang]);

  // If URL has a different language than state — let URL win.
  useEffect(() => {
    const fromUrl = resolvePath(location.pathname).lang;
    if (fromUrl && fromUrl !== lang) setLangState(fromUrl);
  }, [location.pathname, lang]);

  const setLang = useCallback((newLang) => {
    if (!SUPPORTED_LANGS.includes(newLang) || newLang === lang) return;
    const nextPath = rewriteForLang(location.pathname, newLang);
    setLangState(newLang);
    navigate(nextPath + (location.hash || ""));
  }, [lang, location.pathname, location.hash, navigate]);

  const t = useCallback((key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.es || entry.en || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const pick = (obj, lang) => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.es || obj.en || obj.fr || "";
};
