import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { E } from "@/components/EditableSection";

const ADDRESS = "Calle Latorre, 52, 08201 Sabadell, Barcelona, España";
// Coordinates verified against the Google Maps location supplied for this office.
const WAZE_URL = `https://www.waze.com/ul?ll=41.5391383%2C2.1110407&q=${encodeURIComponent(ADDRESS)}&navigate=yes&utm_source=xaluca_tours`;

const COPY = {
  title: { es: "En nuestras oficinas", en: "At our offices", fr: "Dans nos bureaux" },
  body: {
    es: "Visítanos en nuestras oficinas de Sabadell y habla personalmente con nuestro equipo para empezar a planificar tu próxima aventura por Marruecos.",
    en: "Visit our offices in Sabadell and speak personally with our team to start planning your next Moroccan adventure.",
    fr: "Rendez-nous visite dans nos bureaux de Sabadell et échangez avec notre équipe pour commencer à préparer votre prochaine aventure au Maroc.",
  },
  country: { es: "España", en: "Spain", fr: "Espagne" },
  google: { es: "Cómo llegar con Google Maps", en: "Directions with Google Maps", fr: "Itinéraire avec Google Maps" },
  waze: { es: "Cómo llegar con Waze", en: "Directions with Waze", fr: "Itinéraire avec Waze" },
};

export default function OfficeContactCard() {
  return (
    <div
      data-testid="contact-office-card"
      className="min-w-0 border border-[#2C2621]/12 p-7 md:p-9 hover:border-[#C16542]/50 transition-colors flex flex-col"
    >
      <MapPin className="w-6 h-6 text-[#C16542] mb-5" strokeWidth={1.6} aria-hidden="true" />
      <E name="contact.officeTitle" defaults={COPY.title} multiline={false} as="h3"
         className="font-serif text-2xl text-[#2C2621] mb-3" />
      <div className="flex-1">
        <E name="contact.officeBody" defaults={COPY.body} as="p"
           className="text-[14px] text-[#5C5248] leading-relaxed mb-5" />
        <address className="not-italic text-[14px] text-[#5C5248] leading-relaxed mb-7">
          <strong className="block font-medium text-[#2C2621]">Xaluca Tours</strong>
          Calle Latorre, 52<br />
          08201 Sabadell, Barcelona<br />
          <E name="contact.officeCountry" defaults={COPY.country} multiline={false} />
        </address>
      </div>
      <div className="flex flex-col gap-3">
        <a
          href="https://maps.app.goo.gl/sDqBMWwyJcTmLTZQ9"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="contact-office-google-maps"
          className="inline-flex w-full min-w-0 items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-4 py-3.5 text-[11px] leading-relaxed tracking-[0.16em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C16542]"
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
          <E name="contact.officeGoogleCta" defaults={COPY.google} multiline={false} className="min-w-0 break-words" />
        </a>
        <a
          href={WAZE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="contact-office-waze"
          className="inline-flex w-full min-w-0 items-center gap-3 border border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-4 py-3.5 text-[11px] leading-relaxed tracking-[0.16em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2C2621]"
        >
          <Navigation className="w-3.5 h-3.5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
          <E name="contact.officeWazeCta" defaults={COPY.waze} multiline={false} className="min-w-0 break-words" />
        </a>
      </div>
    </div>
  );
}
