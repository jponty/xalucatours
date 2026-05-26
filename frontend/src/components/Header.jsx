import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ArrowRight } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { SideMenu } from "./SideMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

export const Header = () => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onEnquireClick = (e) => {
    e.preventDefault();
    const homePath = pathFor(lang, "home");
    const isHome = location.pathname === homePath || location.pathname === "/";
    if (isHome) {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(pathFor(lang, "contact"));
    }
  };

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#FDFBF7]/92 backdrop-blur-xl backdrop-saturate-150 border-b border-[#2C2621]/12 shadow-[0_10px_30px_-22px_rgba(26,21,19,0.35)]"
            : "bg-[#FDFBF7]/55 backdrop-blur-md backdrop-saturate-150 border-b border-[#FDFBF7]/15 shadow-[0_1px_0_rgba(44,38,33,0.05)]"
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

          <Link
            to={pathFor(lang, "contact")}
            onClick={onEnquireClick}
            data-testid="header-enquire-button"
            className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-4 md:px-6 py-2.5 md:py-3 text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-colors"
          >
            <span className="hidden sm:inline">{t("cta_plan")}</span>
            <span className="sm:hidden">{t("nav_contact")}</span>
            <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
          </Link>
        </div>
      </header>

      <SideMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
