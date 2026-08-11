import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Star } from "lucide-react";
import EditableText from "@/components/EditableText";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { HOME_HELP_COPY, HOME_HELP_OPTIONS } from "@/lib/homeHelpOptions";

const COPY = {
  eyebrow: {
    es: "La confianza de viajar con especialistas",
    en: "The confidence of travelling with specialists",
    fr: "La confiance de voyager avec des spécialistes",
  },
  title: {
    es: "Marruecos es nuestro destino. Cuidar tu viaje, nuestra experiencia.",
    en: "Morocco is our destination. Caring for your journey is our expertise.",
    fr: "Le Maroc est notre destination. Prendre soin de votre voyage, notre expertise.",
  },
  specialist: {
    es: "Agencia de viajes especializada en Marruecos",
    en: "Travel agency specialising in Morocco",
    fr: "Agence de voyages spécialiste du Maroc",
  },
  experience: {
    es: "Años de experiencia creando viajes",
    en: "Years of experience creating journeys",
    fr: "Années d’expérience dans la création de voyages",
  },
  travellers: {
    es: "Más de 1.000.000 de viajeros han confiado en nosotros",
    en: "More than 1,000,000 travellers have trusted us",
    fr: "Plus de 1 000 000 de voyageurs nous ont fait confiance",
  },
  rating: {
    es: "Valoraciones que avalan nuestra trayectoria",
    en: "Reviews that endorse our track record",
    fr: "Des avis qui témoignent de notre parcours",
  },
  ratingValue: {
    es: "4,9",
    en: "4,9",
    fr: "4,9",
  },
  ratingLabel: {
    es: "Valoración media",
    en: "Average rating",
    fr: "Note moyenne",
  },
  preferredValue: {
    es: "Nº 1",
    en: "No. 1",
    fr: "Nº 1",
  },
  preferred: {
    es: "La elección de nuestros viajeros para descubrir Marruecos",
    en: "Our travellers’ choice for discovering Morocco",
    fr: "Le choix de nos voyageurs pour découvrir le Maroc",
  },
};

const StatCell = ({ value, children, className = "" }) => (
  <div
    className={`relative flex min-h-[150px] flex-col items-center justify-center border-t border-[#2C2621]/12 px-6 py-5 text-center sm:px-7 lg:min-h-[190px] lg:border-l lg:border-t-0 lg:py-6 ${className}`}
  >
    {value ? (
      <div>
        <div className="font-serif-x text-[clamp(3rem,5vw,4.75rem)] leading-none tracking-[-0.045em] text-[#2C2621]">
          {value}
        </div>
        <div className="mx-auto mt-3 max-w-[16rem] text-[10px] font-medium uppercase leading-relaxed tracking-[0.19em] text-[#6E6258]">
          {children}
        </div>
      </div>
    ) : children}
  </div>
);

export default function HomeTrustStrip() {
  const { lang } = useLanguage();
  const text = (key) => COPY[key][lang] || COPY[key].es;

  return (
    <section
      data-testid="home-trust-strip"
      aria-labelledby="home-trust-title"
      className="relative overflow-hidden border-b border-[#2C2621]/10 bg-[#F7EFE2]"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_100%_50%,rgba(193,101,66,0.11),transparent_68%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-12">
        <div className="grid grid-cols-2 overflow-hidden border border-[#2C2621]/12 bg-[#FDFBF7]/75 shadow-[0_22px_65px_rgba(44,38,33,0.06)] lg:grid-cols-12">
          <div className="col-span-2 flex min-h-[178px] flex-col items-center justify-center px-6 py-5 text-center sm:px-8 lg:col-span-3 lg:min-h-[190px] lg:py-6">
            <div className="text-[#A95739]">
              <EditableText
                slot="home.trust.eyebrow"
                defaults={COPY.eyebrow}
                multiline={false}
                className="text-[10px] font-semibold uppercase tracking-[0.24em]"
              />
            </div>
            <div>
              <EditableText
                as="h2"
                id="home-trust-title"
                slot="home.trust.title"
                defaults={COPY.title}
                className="mx-auto mt-5 max-w-md font-serif-x text-2xl leading-[1.13] text-[#2C2621] sm:text-3xl"
              />
              <div className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.17em] text-[#6E6258]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C16542]" aria-hidden="true" />
                <EditableText
                  slot="home.trust.specialist"
                  defaults={COPY.specialist}
                  multiline={false}
                />
              </div>
            </div>
          </div>

          <StatCell value={text("preferredValue")} className="col-span-2 lg:col-span-2">
            <EditableText
              slot="home.trust.preferred"
              defaults={COPY.preferred}
              multiline={false}
            />
          </StatCell>

          <StatCell value="+30" className="col-span-1 lg:col-span-2">
            <EditableText
              slot="home.trust.experience"
              defaults={COPY.experience}
              multiline={false}
            />
          </StatCell>

          <StatCell value="1M+" className="col-span-1 border-l border-[#2C2621]/12 lg:col-span-2">
            <EditableText
              slot="home.trust.travellers"
              defaults={COPY.travellers}
              multiline={false}
            />
          </StatCell>

          <StatCell className="col-span-2 lg:col-span-3">
            <div>
              <div>
                <div className="flex items-baseline justify-center gap-2 whitespace-nowrap">
                  <EditableText
                    as="span"
                    slot="home.trust.rating_value"
                    defaults={COPY.ratingValue}
                    multiline={false}
                    noTranslate
                    className="font-serif-x text-[clamp(2.7rem,4vw,4rem)] leading-none tracking-[-0.04em] text-[#2C2621]"
                  />
                </div>
                <EditableText
                  as="span"
                  slot="home.trust.rating_label"
                  defaults={COPY.ratingLabel}
                  multiline={false}
                  className="mt-2 block text-[9px] font-medium uppercase tracking-[0.18em] text-[#6E6258]"
                />
              </div>
              <div className="mt-3 flex justify-center gap-1.5 text-[#E2AE36]" aria-label={`${text("ratingValue")} · ${text("ratingLabel")}`}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-6 w-6 fill-current sm:h-7 sm:w-7"
                    strokeWidth={1.2}
                    aria-hidden="true"
                  />
                ))}
                <span className="relative block h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
                  <Star className="absolute inset-0 h-full w-full text-[#E2AE36]/35" strokeWidth={1.2} />
                  <span className="absolute inset-y-0 left-0 w-[90%] overflow-hidden">
                    <Star className="h-6 w-6 fill-[#E2AE36] text-[#E2AE36] sm:h-7 sm:w-7" strokeWidth={1.2} />
                  </span>
                </span>
              </div>
              <EditableText
                as="p"
                slot="home.trust.rating"
                defaults={COPY.rating}
                className="mx-auto mt-4 max-w-xs text-[10px] font-medium uppercase leading-relaxed tracking-[0.19em] text-[#6E6258]"
              />
            </div>
          </StatCell>

        </div>

        <div
          data-testid="home-help-options"
          className="mt-6 overflow-hidden border border-[#2C2621]/12 bg-[#211A16] text-white shadow-[0_22px_65px_rgba(44,38,33,0.09)]"
        >
          <div className="grid border-b border-white/12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="px-6 py-7 sm:px-8 md:py-8 lg:px-10">
              <div className="inline-flex items-center gap-2 text-[#DDA27F]">
                <Compass className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] sm:text-[10px]">
                  {pick(HOME_HELP_COPY.eyebrow, lang)}
                </span>
              </div>
              <h3 className="mt-3 max-w-xl font-serif-x text-[clamp(2rem,4vw,3.35rem)] font-normal leading-[1.03] tracking-[-0.025em]">
                {pick(HOME_HELP_COPY.title, lang)}
              </h3>
            </div>
            <div className="flex items-center border-t border-white/12 px-6 py-6 sm:px-8 lg:border-l lg:border-t-0 lg:px-10">
              <p className="max-w-2xl text-[13px] leading-[1.75] text-white/65 sm:text-[15px]">
                {pick(HOME_HELP_COPY.intro, lang)}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5">
            {HOME_HELP_OPTIONS.map((option, index) => (
              <Link
                key={option.routeId}
                to={pathFor(lang, option.routeId)}
                data-testid={`home-trust-help-${option.routeId}`}
                className="group relative isolate flex min-h-[210px] overflow-hidden border-b border-white/12 text-white focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#DDA27F] sm:min-h-[235px] sm:border-r lg:min-h-[270px] lg:border-b-0 last:sm:border-r-0"
              >
                <img
                  src={option.image}
                  alt=""
                  aria-hidden="true"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="absolute inset-0 -z-20 h-full w-full object-cover opacity-48 transition duration-[900ms] ease-out group-hover:scale-[1.055] group-hover:opacity-60"
                />
                <span className="absolute inset-0 -z-10 bg-gradient-to-t from-[#17120F]/95 via-[#17120F]/46 to-[#17120F]/12" />

                <span className="flex w-full flex-col justify-between p-5 sm:p-6">
                  <span className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold tracking-[0.28em] text-[#E8B493]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center border border-white/38 bg-[#17120F]/18 transition-all duration-300 group-hover:border-[#DDA27F] group-hover:bg-[#C16542]">
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                  </span>

                  <span>
                    <span className="block font-serif-x text-[1.45rem] leading-[1.08] sm:text-[1.55rem]">
                      {pick(option.label, lang)}
                    </span>
                    <span className="mt-2 block text-[11px] leading-[1.55] text-white/68 sm:text-xs">
                      {pick(option.detail, lang)}
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
