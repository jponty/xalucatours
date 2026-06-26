import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin, Clock, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BerberZigzagDivider } from "./BerberDivider";
import { pathFor, rewriteForLang, SUPPORTED_LANGS } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { translations } from "@/lib/i18n";
import EditableText from "@/components/EditableText";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";
import xMonogramBorde from "@/assets/monograma-x-borde.png";

const FOOTER_LANGS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export const Footer = () => {
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const onChangeLang = (newLang) => {
    if (!SUPPORTED_LANGS.includes(newLang) || newLang === lang) return;
    navigate(rewriteForLang(location.pathname, newLang) + (location.hash || ""));
    setLang(newLang);
  };

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
      {/* X monogram composed for the corner (provided asset), anchored
          to the footer's bottom-right edge and partially clipped —
          discreet brand watermark behind all content. */}
      <img
        src={xMonogramBorde}
        alt=""
        aria-hidden="true"
        data-testid="footer-monogram"
        className="pointer-events-none select-none absolute bottom-0 right-0 h-[125%] w-auto opacity-[0.18] z-0"
      />
      <BerberZigzagDivider className="opacity-60" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <img
              src={grupXalucaLogo}
              alt="Xaluca"
              data-testid="footer-logo"
              className="w-24 h-24 md:w-28 md:h-28 object-contain mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            />
            <EditableText
              slot="footer.brand"
              defaults={{ es: "Xaluca · Tours", en: "Xaluca · Tours", fr: "Xaluca · Tours" }}
              as="span"
              multiline={false}
              noTranslate
              className="overline text-[#D4A373]"
            />
            <EditableText
              as="h3"
              slot="footer.tag"
              defaults={translations.footer_tag}
              className="font-serif-x text-4xl md:text-5xl leading-[1.05] mt-6 tracking-tight block"
            />
            <Link
              to={pathFor(lang, "planTrip")}
              data-testid="footer-enquire-button"
              className="mt-10 inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              <EditableText slot="footer.cta" defaults={translations.cta_plan} multiline={false} />
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
            </Link>
          </div>

          <div className="md:col-span-3">
            <EditableText
              as="p"
              slot="footer.explore_label"
              defaults={translations.footer_explore}
              multiline={false}
              className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373] mb-5 block"
            />
            <ul className="space-y-3 text-sm text-[#FDFBF7]/80">
              {exploreLinks.map((l) => (
                <li key={l.routeId}>
                  <Link to={pathFor(lang, l.routeId)} className="hover:text-[#D4A373] transition-colors">
                    <EditableText slot={`footer.link.${l.k}`} defaults={labels[l.k]} as="span" multiline={false} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <EditableText
              as="p"
              slot="footer.contact_label"
              defaults={translations.footer_contact}
              multiline={false}
              className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373] mb-5 block"
            />
            <ul className="space-y-4 text-sm text-[#FDFBF7]/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#D4A373]" strokeWidth={1.5} />
                <span>
                  <EditableText
                    slot="footer.address.line1"
                    defaults={{ es: "Grup Xaluca · Barcelona, España", en: "Grup Xaluca · Barcelona, Spain", fr: "Grup Xaluca · Barcelone, Espagne" }}
                    as="span"
                    multiline={false}
                  />
                  <br />
                  <EditableText
                    slot="footer.address.line2"
                    defaults={{ es: "Sede & operaciones en Marruecos", en: "Headquarters & operations in Morocco", fr: "Siège & opérations au Maroc" }}
                    as="span"
                    multiline={false}
                  />
                </span>
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
                  <EditableText
                    slot="footer.office_hours_label"
                    defaults={translations.office_hours_label}
                    as="span"
                    multiline={false}
                    className="block text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55"
                  />
                  <EditableText
                    slot="footer.office_hours_value"
                    defaults={translations.office_hours_value}
                    as="span"
                    multiline={false}
                  />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#FDFBF7]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <EditableText
            as="p"
            slot="footer.rights"
            defaults={translations.footer_rights}
            multiline={false}
            className="text-xs text-[#FDFBF7]/55 block"
          />

          {/* Language selector — integrated in the footer */}
          <div
            data-testid="footer-language-switcher"
            className="inline-flex items-center gap-2"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.6} aria-hidden="true" />
            {FOOTER_LANGS.map((l, i) => (
              <React.Fragment key={l.code}>
                {i > 0 && <span className="w-px h-3 bg-[#FDFBF7]/20" />}
                <button
                  onClick={() => onChangeLang(l.code)}
                  data-testid={`footer-lang-button-${l.code}`}
                  aria-pressed={lang === l.code}
                  className={`px-1.5 py-1 text-[11px] tracking-[0.25em] transition-colors ${
                    lang === l.code
                      ? "text-[#D4A373] border-b border-[#D4A373]"
                      : "text-[#FDFBF7]/60 hover:text-[#FDFBF7]"
                  }`}
                >
                  {l.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          <EditableText
            as="p"
            slot="footer.contact_24_7"
            defaults={translations.contact_24_7}
            multiline={false}
            className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/40 block"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
