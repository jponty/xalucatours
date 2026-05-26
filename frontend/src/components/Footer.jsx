import React from "react";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BerberZigzagDivider } from "./BerberDivider";

export const Footer = () => {
  const { t } = useLanguage();

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
            <a
              href="#contact"
              data-testid="footer-enquire-button"
              className="mt-10 inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              {t("cta_enquire")}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373] mb-5">
              {t("footer_explore")}
            </p>
            <ul className="space-y-3 text-sm text-[#FDFBF7]/80">
              <li><a href="#journeys" className="hover:text-[#D4A373] transition-colors">{t("nav_journeys")}</a></li>
              <li><a href="#camps" className="hover:text-[#D4A373] transition-colors">{t("nav_camps")}</a></li>
              <li><a href="#culture" className="hover:text-[#D4A373] transition-colors">{t("nav_culture")}</a></li>
              <li><a href="#journal" className="hover:text-[#D4A373] transition-colors">{t("nav_journal")}</a></li>
              <li><a href="#map" className="hover:text-[#D4A373] transition-colors">{t("nav_map")}</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373] mb-5">
              {t("footer_contact")}
            </p>
            <ul className="space-y-4 text-sm text-[#FDFBF7]/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#D4A373]" strokeWidth={1.5} />
                <span>Av. Hassan II, Riad El Mansour<br />40000 Marrakech, Morocco</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4A373]" strokeWidth={1.5} />
                <a href="tel:+212524000000" className="hover:text-[#D4A373] transition-colors">+212 524 000 000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4A373]" strokeWidth={1.5} />
                <a href="mailto:contact@xalucatours.ma" className="hover:text-[#D4A373] transition-colors">contact@xalucatours.ma</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#FDFBF7]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-[#FDFBF7]/55">{t("footer_rights")}</p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/40">
            Bespoke · Cinematic · Slow
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
