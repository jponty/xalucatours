import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/lib/i18n";

const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: () => "" });

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem("xaluca-tours-lang");
      if (stored && ["en", "fr", "es"].includes(stored)) return stored;
    } catch (_) {}
    return "en";
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try { localStorage.setItem("xaluca-tours-lang", newLang); } catch (_) {}
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  };

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
  return obj[lang] || obj.en || obj.fr || obj.es || "";
};
