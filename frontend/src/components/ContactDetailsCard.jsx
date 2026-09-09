import React from "react";
import { Mail, Phone } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { CONTACT } from "@/lib/data";

export default function ContactDetailsCard({ className = "mt-8", testIdPrefix = "contact" }) {
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
      </div>
    </aside>
  );
}
