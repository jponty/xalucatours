import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { useLanguage } from "@/contexts/LanguageContext";

const NAV_ITEMS = [
  { key: "nav_journeys", href: "#journeys" },
  { key: "nav_camps",    href: "#camps" },
  { key: "nav_culture",  href: "#culture" },
  { key: "nav_journal",  href: "#journal" },
  { key: "nav_map",      href: "#map" },
  { key: "nav_contact",  href: "#contact" },
];

export const Header = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#2C2621]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <button
            data-testid="header-menu-button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#2C2621] hover:text-[#C16542] transition-colors"
            aria-label={t("nav_menu")}
          >
            <Menu className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">{t("nav_menu")}</span>
          </button>

          <BrandMark />

          <a
            href="#contact"
            data-testid="header-enquire-button"
            className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-4 md:px-6 py-2.5 md:py-3 text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-colors"
          >
            <span className="hidden sm:inline">{t("cta_enquire")}</span>
            <span className="sm:hidden">{t("nav_contact")}</span>
            <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
          </a>
        </div>
      </header>

      {/* Side drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          data-testid="nav-drawer"
          className={`absolute left-0 top-0 h-full w-[80vw] md:w-[480px] bg-[#1A1513] text-[#FDFBF7] berber-bg-cross transition-transform duration-500 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="relative h-full flex flex-col p-8 md:p-12 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="overline text-[#D4A373]">Xaluca · Tours</span>
              <button
                data-testid="nav-drawer-close"
                onClick={() => setOpen(false)}
                aria-label={t("nav_close")}
                className="text-[#FDFBF7]/70 hover:text-[#C16542] transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="mt-16 flex flex-col gap-6">
              {NAV_ITEMS.map((item, idx) => (
                <a
                  key={item.key}
                  href={item.href}
                  data-testid={`nav-link-${item.key}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 hover:text-[#D4A373] transition-colors"
                >
                  <span className="text-[10px] tracking-[0.3em] opacity-50 w-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif-x text-3xl md:text-4xl leading-[1.05]">
                    {t(item.key)}
                  </span>
                </a>
              ))}
            </nav>

            <div className="mt-auto pt-12 border-t border-[#FDFBF7]/15">
              <p className="text-xs leading-relaxed text-[#FDFBF7]/60">
                Xaluca Tours · Av. Hassan II, Marrakech 40000<br />
                contact@xalucatours.ma · +212 524 000 000
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;
