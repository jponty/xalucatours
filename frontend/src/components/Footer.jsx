import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BerberZigzagDivider } from "./BerberDivider";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";

export const Footer = () => {
  const { t, lang } = useLanguage();

  const exploreLinks = [
    { routeId: "tourAll",       k: "menu_all" },
    { routeId: "tourSouth",     k: "menu_south" },
    { routeId: "tourFull",      k: "menu_full" },
    { routeId: "tourShort",     k: "menu_short" },
    { routeId: "tourNorth",     k: "menu_north" },
    { routeId: "tourAdventure", k: "menu_adventure" },
  ];

  // Fallback labels — pulled from MENU_TREE via translations table-like dictionary
  const labels = {
    menu_all:       { es: "Todos los viajes",      en: "All tours",        fr: "Tous les voyages" },
    menu_south:     { es: "Sur de Marruecos",      en: "Southern Morocco", fr: "Sud du Maroc" },
    menu_full:      { es: "Marruecos al completo", en: "Full Morocco",     fr: "Maroc intégral" },
    menu_short:     { es: "Escapadas cortas",      en: "Short escapes",    fr: "Escapades courtes" },
    menu_north:     { es: "Norte de Marruecos",    en: "Northern Morocco", fr: "Nord du Maroc" },
    menu_adventure: { es: "Aventura",              en: "Adventure",        fr: "Aventure" },
  };

  return (
    <footer data-testid="site-footer" className="relative bg-[#1A1513] text-[#FDFBF7] overflow-hidden">
      <div className="absolute inset-0 berber-bg-cross opacity-60" aria-hidden="true" />
      <BerberZigzagDivider className="opacity-60" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <span className="overline text-[#D4A373]">Xaluca · Tours</span>
            <h3 className="font-serif-x text-4xl md:text-5xl leading-[1.05] mt-6 tracking-tight">
              {t("footer_tag")}
            </h3>
            <Link
              to={pathFor(lang, "contact")}
              data-testid="footer-enquire-button"
              className="mt-10 inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              {t("cta_plan")}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
            </Link>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373] mb-5">
              {t("footer_explore")}
            </p>
            <ul className="space-y-3 text-sm text-[#FDFBF7]/80">
              {exploreLinks.map((l) => (
                <li key={l.routeId}>
                  <Link to={pathFor(lang, l.routeId)} className="hover:text-[#D4A373] transition-colors">
                    {labels[l.k][lang] || labels[l.k].es}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373] mb-5">
              {t("footer_contact")}
            </p>
            <ul className="space-y-4 text-sm text-[#FDFBF7]/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#D4A373]" strokeWidth={1.5} />
                <span>Grup Xaluca · Barcelona, España<br />Sede & operaciones en Marruecos</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4A373]" strokeWidth={1.5} />
                <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-[#D4A373] transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4A373]" strokeWidth={1.5} />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-[#D4A373] transition-colors">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-[#D4A373]" strokeWidth={1.5} />
                <span>
                  <span className="block text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">{t("office_hours_label")}</span>
                  {t("office_hours_value")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#FDFBF7]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-[#FDFBF7]/55">{t("footer_rights")}</p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/40">
            {t("contact_24_7")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
