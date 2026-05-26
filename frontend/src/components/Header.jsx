import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ArrowRight, ImagePlus, Check } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { SideMenu } from "./SideMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { pathFor } from "@/lib/routes";

export const Header = () => {
  const { t, lang } = useLanguage();
  const { editMode, toggle } = useEditMode();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const SCROLL_THRESHOLD = 12; // px movement required to flip direction
    const TOP_OFFSET = 24;       // header always visible above this Y

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > TOP_OFFSET);

      const delta = y - lastY;
      if (y <= TOP_OFFSET) {
        // Always visible near the top
        setHidden(false);
      } else if (Math.abs(delta) > SCROLL_THRESHOLD) {
        setHidden(delta > 0); // scroll down → hide, scroll up → show
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep header visible while side menu is open so the close button stays reachable
  const isHeaderHidden = hidden && !open;

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
        aria-hidden={isHeaderHidden}
        style={{ willChange: "transform" }}
        className={`fixed top-0 inset-x-0 z-40 transform-gpu transition-[transform,background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHeaderHidden ? "-translate-y-full" : "translate-y-0"
        } ${
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

          <div className="flex items-center gap-2 md:gap-3">
            {/* Image edit mode toggle — icon-only, dev tool */}
            <button
              type="button"
              onClick={toggle}
              aria-pressed={editMode}
              aria-label={editMode ? "Salir del modo edición de imágenes" : "Activar modo edición de imágenes"}
              data-testid="header-edit-mode-toggle"
              className={`inline-flex items-center justify-center w-10 h-10 md:w-11 md:h-11 border transition-colors duration-300 ${
                editMode
                  ? "bg-[#C16542] border-[#C16542] text-[#FDFBF7] hover:bg-[#A35133]"
                  : "border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621]"
              }`}
              title={editMode ? "Edición ON · clic para salir" : "Activar edición de imágenes"}
            >
              {editMode ? (
                <Check className="w-4 h-4" strokeWidth={1.8} />
              ) : (
                <ImagePlus className="w-4 h-4" strokeWidth={1.7} />
              )}
            </button>

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
        </div>
      </header>

      <SideMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
