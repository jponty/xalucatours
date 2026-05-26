import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { rewriteForLang, SUPPORTED_LANGS } from "@/lib/routes";

const LANGS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export const FloatingLanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const onChange = (newLang) => {
    if (!SUPPORTED_LANGS.includes(newLang) || newLang === lang) return;
    const nextPath = rewriteForLang(location.pathname, newLang);
    navigate(nextPath + (location.hash || ""));
    setLang(newLang);
  };

  return (
    <div
      data-testid="language-switcher"
      className="fixed bottom-6 left-6 z-30 inline-flex items-center gap-1 bg-[#FDFBF7]/95 backdrop-blur-md border border-[#2C2621]/10 px-3 py-2 shadow-[0_8px_24px_rgba(26,21,19,0.08)]"
    >
      {LANGS.map((l, i) => (
        <React.Fragment key={l.code}>
          {i > 0 && <span className="w-px h-3 bg-[#2C2621]/15" />}
          <button
            onClick={() => onChange(l.code)}
            data-testid={`lang-button-${l.code}`}
            className={`px-2 py-1 text-[11px] tracking-[0.25em] transition-colors ${
              lang === l.code
                ? "text-[#C16542] border-b border-[#C16542]"
                : "text-[#5C5248] hover:text-[#2C2621]"
            }`}
            aria-pressed={lang === l.code}
          >
            {l.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default FloatingLanguageSwitcher;
