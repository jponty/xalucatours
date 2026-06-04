import React from "react";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";

/* "Hablan de nosotros" — press & media mentions on the home page.
   Real article links open in a new tab. Section heading uses the global
   CMS (EditableText) like the rest of the site. */

const COPY = {
  eyebrow: { es: "Prensa y medios", en: "Press & media", fr: "Presse & médias" },
  title: { es: "Hablan de nosotros", en: "They talk about us", fr: "Ils parlent de nous" },
  subtitle: {
    es: "Lo que la prensa cuenta sobre Xaluca: reconocimientos, historias y el desierto que enamora.",
    en: "What the press says about Xaluca: awards, stories and the desert that wins everyone over.",
    fr: "Ce que la presse dit de Xaluca : distinctions, récits et le désert qui séduit.",
  },
};

const PRESS = [
  {
    id: "abc",
    outlet: "ABC",
    section: "Crónicas Nómada · África",
    title: "Viajar con Xaluca: un imperio sobre la arena",
    url: "https://abcblogs.abc.es/cronicas-nomada/africa/viajar-xaluca-un-imperio-sobre-la-arena.html",
  },
  {
    id: "larazon",
    outlet: "La Razón",
    section: "Cataluña",
    title: "Xaluca Tours recibe el premio a Mejor Seller 2023 de Royal Air Maroc",
    url: "https://www.larazon.es/cataluna/xaluca-tours-recibe-premio-mejor-seller-2023-royal-air-maroc_20231028653d51bde8e7a500015e1c43.html",
  },
  {
    id: "elperiodico",
    outlet: "El Periódico",
    section: "Barcelona · Sabadell",
    title: "Una agencia de Sabadell, tras el primer hotel de cinco estrellas en el desierto de Marruecos",
    url: "https://www.elperiodico.com/es/barcelona/sabadell/20240310/agencia-viajes-sabadell-primer-hotel-cinco-estrellas-desierto-marruecos-99203519",
  },
  {
    id: "lavanguardia",
    outlet: "La Vanguardia",
    section: "La Contra",
    title: "Lluís Pont: «En el desierto hay algo que hace que todos vuelvan»",
    url: "https://www.lavanguardia.com/lacontra/20240627/9762578/lluis-pont-desierto-hay-todos-vuelven.html",
  },
];

export default function PressMentions() {
  const { lang } = useLanguage();
  return (
    <section data-testid="home-press-mentions" className="bg-[#F2EBE1] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <EditableText
            slot="home.press.eyebrow"
            defaults={COPY.eyebrow}
            as="span"
            multiline={false}
            className="inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-[#C16542]"
          />
          <EditableText
            slot="home.press.title"
            defaults={COPY.title}
            as="h2"
            className="font-serif-x text-3xl sm:text-4xl lg:text-5xl text-[#2C2621] leading-[1.08] mt-4"
          />
          <EditableText
            slot="home.press.subtitle"
            defaults={COPY.subtitle}
            as="p"
            className="mt-5 text-base text-[#5C5248] leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-12">
          {PRESS.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`press-link-${p.id}`}
              className="group relative flex flex-col p-6 md:p-7 bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#C16542]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-24px_rgba(26,21,19,0.35)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2.5">
                  <Newspaper className="w-4 h-4 text-[#C16542]" strokeWidth={1.7} />
                  <span className="font-serif-x text-lg text-[#2C2621] group-hover:text-[#C16542] transition-colors">
                    {p.outlet}
                  </span>
                </span>
                <ArrowUpRight
                  className="w-4 h-4 text-[#C16542] opacity-50 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  strokeWidth={2}
                />
              </div>
              <span className="mt-1 text-[9px] tracking-[0.28em] uppercase text-[#A0937F]">
                {p.section}
              </span>
              <p className="mt-4 text-[15px] md:text-base text-[#3A332C] leading-snug">
                {p.title}
              </p>
            </a>
          ))}
        </div>

        <p className="sr-only">{pick(COPY.subtitle, lang)}</p>
      </div>
    </section>
  );
}
