import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Mic, Phone } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { CONTACT } from "@/lib/data";
import { pathFor } from "@/lib/routes";
import { WhatsAppIcon, WHATSAPP_URL } from "@/components/WhatsAppIcon";
import { requestDictationModal } from "@/lib/dictationModal";

const ctaClass = "xaluca-button inline-flex min-h-12 w-full min-w-0 max-w-full items-center justify-center gap-3 px-5 py-3.5 text-center text-[11px] leading-relaxed font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

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
            className="xaluca-button group flex min-h-14 items-center gap-3 border border-[#2C2621]/10 bg-white/55 px-4 py-3 transition-colors hover:border-[#C16542]/55 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542]"
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
            className="xaluca-button group flex min-h-14 items-center gap-3 border border-[#2C2621]/10 bg-white/55 px-4 py-3 transition-colors hover:border-[#C16542]/55 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542]"
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
          <div data-testid={`${testIdPrefix}-card-actions`} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to={pathFor(lang, "contact")}
              data-testid={`${testIdPrefix}-card-cta`}
              className={`${ctaClass} bg-[#C16542] text-[#FDFBF7] hover:bg-[#A35133] focus-visible:ring-[#C16542]`}
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
              className={`${ctaClass} bg-[#25D366] text-white hover:bg-[#1EBE5A] focus-visible:ring-[#15803D]`}
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
              <span className="min-w-0 break-words">
                {pick({ es: "Habla con nosotros por WhatsApp", en: "Chat with us on WhatsApp", fr: "Échangez avec nous sur WhatsApp" }, lang)}
              </span>
            </a>
            <button
              type="button"
              data-testid={`${testIdPrefix}-card-dictation`}
              aria-haspopup="dialog"
              onClick={event => requestDictationModal(event.currentTarget)}
              className={`${ctaClass} bg-[#2C2621] text-[#FDFBF7] hover:bg-[#46382F] focus-visible:ring-[#C16542] sm:col-span-2 lg:col-span-1`}
            >
              <Mic className="h-5 w-5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
              <span className="min-w-0 break-words">
                {pick({ es: "Tu viaje, con tus palabras", en: "Your trip, in your own words", fr: "Votre voyage, avec vos mots" }, lang)}
              </span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
