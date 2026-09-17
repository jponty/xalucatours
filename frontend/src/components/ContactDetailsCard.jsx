import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { CONTACT } from "@/lib/data";
import { pathFor } from "@/lib/routes";
import { WhatsAppIcon, WHATSAPP_URL } from "@/components/WhatsAppIcon";

export default function ContactDetailsCard({ className = "mt-8", testIdPrefix = "contact", showContactCta = false }) {
  const { lang } = useLanguage();

  return (
    <aside
      data-testid={`${testIdPrefix}-details-card`}
      aria-label={pick({ es: "Datos de contacto de Xaluca Tours", en: "Xaluca Tours contact details", fr: "Coordonnées de Xaluca Tours" }, lang)}
      className={`relative w-full overflow-hidden border border-[#2C2621]/12 bg-[#F7F0E6] text-[#2C2621] shadow-[0_12px_35px_-24px_rgba(44,38,33,.3)] ${className}`}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-[#C16542]" aria-hidden="true" />
      <div className="px-6 py-6 sm:px-7 sm:py-7">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.32em] text-[#A07042]">
          {pick({ es: "Contacto directo", en: "Direct contact", fr: "Contact direct" }, lang)}
        </span>
        <h3 className="mt-2 font-serif-x text-3xl leading-none text-[#2C2621]">Xaluca Tours</h3>

        <div className="mt-5 grid gap-2 border-t border-[#2C2621]/12 pt-4 sm:grid-cols-2 sm:gap-3">
          <a
            href={`tel:${CONTACT.phoneRaw || "+34937268366"}`}
            data-testid={`${testIdPrefix}-card-phone`}
            className="group flex min-h-14 items-center gap-3 border border-[#2C2621]/10 bg-white/55 px-4 py-3 transition-colors hover:border-[#C16542]/55 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542]"
          >
            <Phone className="h-4 w-4 shrink-0 text-[#C16542]" strokeWidth={1.6} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-[8px] font-semibold uppercase tracking-[0.22em] text-[#74685E]">
                {pick({ es: "Teléfono", en: "Phone", fr: "Téléphone" }, lang)}
              </span>
              <span className="mt-1 block whitespace-nowrap text-sm font-medium text-[#2C2621] group-hover:text-[#C16542]">
                {(CONTACT.phone || "+34 937 268 366").replace(/^\+34\s*/, "")}
              </span>
            </span>
          </a>

          <a
            href={`mailto:${CONTACT.email || "xalucatours@xaluca.com"}`}
            data-testid={`${testIdPrefix}-card-email`}
            className="group flex min-h-14 items-center gap-3 border border-[#2C2621]/10 bg-white/55 px-4 py-3 transition-colors hover:border-[#C16542]/55 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542]"
          >
            <Mail className="h-4 w-4 shrink-0 text-[#C16542]" strokeWidth={1.6} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-[8px] font-semibold uppercase tracking-[0.22em] text-[#74685E]">Email</span>
              <span className="mt-1 block break-all text-sm font-medium text-[#2C2621] group-hover:text-[#C16542]">
                {CONTACT.email || "xalucatours@xaluca.com"}
              </span>
            </span>
          </a>
        </div>

        {showContactCta && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to={pathFor(lang, "contact")}
              data-testid={`${testIdPrefix}-card-cta`}
              className="inline-flex min-h-12 w-full min-w-0 max-w-full items-center justify-center gap-3 bg-[#C16542] px-6 py-3.5 text-center text-[11px] leading-relaxed font-semibold uppercase tracking-[0.2em] text-[#FDFBF7] transition-colors hover:bg-[#A35133] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] focus-visible:ring-offset-2 sm:w-auto"
            >
              <span className="min-w-0 break-words">
                {pick({ es: "Contacta con nosotros", en: "Contact us", fr: "Contactez-nous" }, lang)}
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-whatsapp-direct="true"
              data-testid={`${testIdPrefix}-card-whatsapp`}
              className="inline-flex min-h-12 w-full min-w-0 max-w-full items-center justify-center gap-3 border border-[#15803D] bg-[#15803D] px-6 py-3.5 text-center text-[11px] leading-relaxed font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-[#166534] hover:bg-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] focus-visible:ring-offset-2 sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
              <span className="min-w-0 break-words">
                {pick({ es: "Habla con nosotros por WhatsApp", en: "Chat with us on WhatsApp", fr: "Échangez avec nous sur WhatsApp" }, lang)}
              </span>
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
