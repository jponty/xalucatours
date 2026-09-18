import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ArrowRight, Mail, Heart, Compass } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { SideMenu } from "./SideMenu";
import TopInfoBar from "./TopInfoBar";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { translations } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import EditableText from "@/components/EditableText";
import EditModeFAB from "@/components/EditModeFAB";
import { WhatsAppIcon, WHATSAPP_URL } from "@/components/WhatsAppIcon";
import PlanTripInfoModal from "@/components/PlanTripInfoModal";
import { requestWhatsAppContact } from "@/components/WhatsAppContactModal";

const CONTACT_LABEL = { es: "Contacto", en: "Contact", fr: "Contact" };

export const Header = () => {
  const { t, lang } = useLanguage();
  const { count: favCount } = useFavorites();
  const [open, setOpen] = useState(false);
  const [planTripOpen, setPlanTripOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

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

  return (
    <>
      <header
        data-testid="site-header"
        aria-hidden={isHeaderHidden}
        style={{ willChange: "transform" }}
        className={`fixed top-0 inset-x-0 z-40 transform-gpu transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#FDFBF7] ${
          isHeaderHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "border-b border-[#2C2621]/12 shadow-[0_10px_30px_-22px_rgba(26,21,19,0.35)]"
            : "border-b border-[#2C2621]/8 shadow-[0_1px_0_rgba(44,38,33,0.05)]"
        }`}
      >
        <TopInfoBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-16 md:h-20 flex items-center justify-between gap-2">
          <button
            data-testid="header-menu-button"
            onClick={() => setOpen(true)}
            data-edit-allow="true"
            className="inline-flex shrink-0 items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#2C2621] hover:text-[#C16542] transition-colors"
            aria-label={t("nav_menu")}
          >
            <Menu className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">
              <EditableText
                slot="header.nav_menu"
                defaults={translations.nav_menu}
                multiline={false}
              />
            </span>
          </button>

          <BrandMark compactHeader />

          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => requestWhatsAppContact(WHATSAPP_URL)}
              aria-label="WhatsApp"
              data-testid="header-whatsapp-button"
              className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#25D366] hover:bg-[#1EBE5A] text-[#FDFBF7] transition-colors duration-300 shadow-[0_8px_20px_-10px_rgba(37,211,102,0.8)]"
            >
              <WhatsAppIcon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </button>
            <Link
              to={pathFor(lang, "favorites")}
              data-testid="header-favorites-button"
              aria-label={{ es: "Favoritos", en: "Favourites", fr: "Favoris" }[lang] || "Favoritos"}
              className="xaluca-button relative inline-flex items-center justify-center w-10 h-10 text-[#2C2621] hover:text-[#C16542] transition-colors"
            >
              <Heart className="w-5 h-5" strokeWidth={1.6} fill={favCount > 0 ? "#C16542" : "none"} />
              {favCount > 0 && (
                <span
                  data-testid="header-favorites-count"
                  className="absolute top-0 right-0 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C16542] text-[#FDFBF7] text-[9px] font-semibold leading-none flex items-center justify-center"
                >
                  {favCount}
                </span>
              )}
            </Link>
            <Link
              to={pathFor(lang, "contact")}
              data-testid="header-contact-button"
              aria-label={pick(CONTACT_LABEL, lang)}
              className="xaluca-button inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] px-3 lg:px-5 py-2 lg:py-3 text-[10px] lg:text-[11px] tracking-[0.12em] lg:tracking-[0.25em] uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C16542]"
            >
              <Mail className="hidden sm:block w-3.5 h-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
              <EditableText slot="header.cta_contact" defaults={CONTACT_LABEL} multiline={false} />
            </Link>

            <button
              type="button"
              onClick={() => setPlanTripOpen(true)}
              data-testid="header-enquire-button"
              aria-label={pick(translations.cta_plan, lang)}
              aria-haspopup="dialog"
              className="inline-flex min-h-10 items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-3 sm:px-4 lg:px-6 py-2.5 md:py-3 text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              {/* Small screens: compact planner control keeps Contact visible. */}
              <Compass className="w-4 h-4 lg:hidden" strokeWidth={1.6} aria-hidden="true" />
              {/* Desktop: full label + arrow */}
              <span className="hidden lg:inline">
                <EditableText slot="header.cta_plan" defaults={translations.cta_plan} multiline={false} />
              </span>
              <ArrowRight className="hidden lg:inline-block w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      <SideMenu open={open} onClose={() => setOpen(false)} />
      <PlanTripInfoModal open={planTripOpen} onOpenChange={setPlanTripOpen} />
      <EditModeFAB />
    </>
  );
};

export default Header;
