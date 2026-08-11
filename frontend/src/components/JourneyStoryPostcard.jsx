import React from "react";
import { Compass, MapPin, Sparkles } from "lucide-react";
import EditableImage from "@/components/EditableImage";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import xMonogramCrop from "@/assets/monograma-x-crop.png";

const META = {
  eyebrow: { es: "Postal de viaje", en: "Travel postcard", fr: "Carte postale de voyage" },
  title: {
    es: "Una postal para imaginar este viaje.",
    en: "A postcard to picture this journey.",
    fr: "Une carte postale pour imaginer ce voyage.",
  },
  edition: { es: "Edición del viaje", en: "Journey edition", fr: "Édition du voyage" },
  addressee: { es: "Para quien sueña con Marruecos", en: "For those who dream of Morocco", fr: "Pour ceux qui rêvent du Maroc" },
};

export default function JourneyStoryPostcard({ content, image, tripTitle, duration }) {
  const { lang } = useLanguage();

  if (!content) return null;

  const eyebrow = content.eyebrow || META.eyebrow;
  const title = content.title || META.title;
  const destination = content.destination || tripTitle || { es: "Marruecos", en: "Morocco", fr: "Maroc" };
  const durationLabel = pick(duration, lang) || pick(META.edition, lang);
  const closingText = pick(content.closing, lang);
  const compactClosing = closingText.length > 90;

  return (
    <section
      data-testid="journey-story-postcard"
      aria-labelledby="journey-story-postcard-title"
      className="relative overflow-hidden bg-[#F1E8DA] py-20 md:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #5C4636 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10 lg:px-12">
        <article className="relative grid overflow-hidden border border-[#2C2621]/15 bg-[#FBF7EF] shadow-[0_28px_80px_rgba(75,52,35,0.16)] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-[430px] overflow-hidden sm:min-h-[520px] lg:min-h-full">
            <EditableImage
              name="journey-postcard.cover"
              fallback={image}
              alt={pick(destination, lang)}
              aspectRatio="4/5"
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/10 to-[#1A1513]/10" />
            <XalucaLogoBadge className="right-5 top-5 h-14 w-14 md:right-7 md:top-7 md:h-16 md:w-16" />

            <div className="absolute inset-x-0 bottom-0 p-7 text-[#FDFBF7] md:p-10">
              <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#E9C08F]">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} />
                {pick(destination, lang)}
              </div>
              <p className="max-w-sm font-serif-x text-3xl leading-[1.08] md:text-4xl">
                {pick(title, lang)}
              </p>
            </div>

            <img
              src={xMonogramCrop}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[5%] -right-[9%] hidden h-[76%] w-auto max-w-none select-none object-contain opacity-[0.2] md:block"
            />
          </div>

          <div className="relative px-7 py-10 sm:px-10 md:px-14 md:py-14 lg:px-16 lg:py-16">
            <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden border-l border-dashed border-[#A8896D]/50 lg:block" />

            <header className="relative mb-9 flex flex-col gap-7 border-b border-[#2C2621]/15 pb-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#A14E32]">
                  <Compass className="h-4 w-4" strokeWidth={1.4} />
                  {pick(eyebrow, lang)}
                </div>
                <h2
                  id="journey-story-postcard-title"
                  className="max-w-xl font-serif-x text-3xl leading-[1.08] text-[#2C2621] sm:text-4xl lg:text-[42px]"
                >
                  {pick(title, lang)}
                </h2>
              </div>

              <div className="relative flex h-24 w-24 shrink-0 rotate-3 items-center justify-center border-2 border-[#A14E32]/55 text-center text-[#A14E32] sm:h-28 sm:w-28">
                <div className="absolute inset-1 border border-[#A14E32]/30" />
                <div className="relative px-2 text-[9px] uppercase leading-relaxed tracking-[0.2em]">
                  <Sparkles className="mx-auto mb-2 h-4 w-4" strokeWidth={1.5} />
                  Xaluca Tours
                  <span className="mt-1 block text-[8px]">{durationLabel}</span>
                </div>
              </div>
            </header>

            <div className="mb-8 text-[10px] uppercase tracking-[0.25em] text-[#8B7767]">
              {pick(META.addressee, lang)}
            </div>

            <div className="columns-1 gap-10 text-[14px] leading-[1.8] text-[#51483F] xl:columns-2">
              {content.paragraphs.map((paragraph, index) => (
                <p
                  key={`${pick(paragraph, lang).slice(0, 24)}-${index}`}
                  className={`mb-4 break-inside-avoid ${index === 0 ? "font-serif-x-italic text-lg leading-[1.65] text-[#A14E32]" : ""}`}
                >
                  {pick(paragraph, lang)}
                </p>
              ))}
            </div>

            <footer className="mt-8 flex items-end justify-between gap-6 border-t border-[#2C2621]/15 pt-7">
              <p
                className={`font-serif-x-italic text-[#2C2621] ${compactClosing ? "max-w-2xl text-lg leading-relaxed sm:text-xl" : "text-2xl sm:text-3xl"}`}
              >
                {closingText}
              </p>
              <span aria-hidden="true" className="hidden text-[10px] uppercase tracking-[0.28em] text-[#A14E32] sm:block">
                Xaluca · Tours
              </span>
            </footer>
          </div>
        </article>
      </div>
    </section>
  );
}
