import React from "react";
import { Compass } from "lucide-react";
import EditableText from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";

/* ============================================================
   FoundersSection — Home, just below "Nuestra historia".
   Warm, human, nostalgic tribute to the founders of Grup Xaluca
   & Xaluca Tours: a tilted polaroid photo paired with a
   handwritten note on aged paper for each founder.
   All copy/images are CMS-editable via slots (trilingual).
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

const PONT_IMG =
  "https://customer-assets.emergentagent.com/job_0632360a-eb69-4f78-ae22-95f777acd98d/artifacts/qa8e8tkj_Llui%CC%81s%20Pont.jpg";
const TAYEB_IMG =
  "https://customer-assets.emergentagent.com/job_0632360a-eb69-4f78-ae22-95f777acd98d/artifacts/odcogxxd_Tayeb%20Ettaiek.jpg";

const COPY = {
  eyebrow: T("Nuestros fundadores", "Our founders", "Nos fondateurs"),
  title: T(
    "Las personas detrás de cada viaje",
    "The people behind every journey",
    "Les personnes derrière chaque voyage",
  ),
  subtitle: T(
    "Dos orígenes, una misma pasión por Marruecos. Una historia familiar, viajera y humana que sigue viva en cada experiencia.",
    "Two origins, one shared passion for Morocco. A family, travelling and human story that lives on in every experience.",
    "Deux origines, une même passion pour le Maroc. Une histoire familiale, voyageuse et humaine, vivante dans chaque expérience.",
  ),
  role: T("Cofundador · Grup Xaluca · Xaluca Tours", "Co-founder · Grup Xaluca · Xaluca Tours", "Cofondateur · Grup Xaluca · Xaluca Tours"),
};

const FOUNDERS = [
  {
    id: "pont",
    img: PONT_IMG,
    tilt: "-rotate-3",
    paperTilt: "rotate-[0.6deg]",
    tapeRotate: "-rotate-6",
    name: T("Lluís Pont", "Lluís Pont", "Lluís Pont"),
    origin: T("Sabadell, España", "Sabadell, Spain", "Sabadell, Espagne"),
    note1: T(
      "Desde Sabadell, Lluís Pont impulsó una manera de viajar basada en la confianza, la cercanía y el respeto por el destino. Su visión ayudó a construir el puente entre quienes sueñan con descubrir Marruecos y quienes lo viven desde dentro cada día.",
      "From Sabadell, Lluís Pont championed a way of travelling built on trust, closeness and respect for the destination. His vision helped build the bridge between those who dream of discovering Morocco and those who live it from within every day.",
      "Depuis Sabadell, Lluís Pont a impulsé une façon de voyager fondée sur la confiance, la proximité et le respect de la destination. Sa vision a aidé à bâtir le pont entre ceux qui rêvent de découvrir le Maroc et ceux qui le vivent de l'intérieur chaque jour.",
    ),
    note2: T(
      "Una historia familiar, viajera y humana que sigue inspirando cada experiencia de Grup Xaluca y Xaluca Tours.",
      "A family, travelling and human story that still inspires every Grup Xaluca and Xaluca Tours experience.",
      "Une histoire familiale, voyageuse et humaine qui continue d'inspirer chaque expérience de Grup Xaluca et Xaluca Tours.",
    ),
  },
  {
    id: "tayeb",
    img: TAYEB_IMG,
    tilt: "rotate-3",
    paperTilt: "-rotate-[0.6deg]",
    tapeRotate: "rotate-6",
    name: T("Tayeb Ettaiek", "Tayeb Ettaiek", "Tayeb Ettaiek"),
    origin: T("Arfoud, Marruecos", "Arfoud, Morocco", "Arfoud, Maroc"),
    note1: T(
      "Desde Arfoud, Tayeb Ettaiek representa el alma local, la hospitalidad marroquí y el profundo conocimiento del sur de Marruecos. Su mirada sobre el territorio, sus gentes y sus tradiciones ha sido clave para dar forma a experiencias auténticas, cuidadas y profundamente conectadas con el lugar.",
      "From Arfoud, Tayeb Ettaiek embodies the local soul, Moroccan hospitality and a deep knowledge of southern Morocco. His insight into the land, its people and its traditions has been key to shaping authentic, carefully crafted experiences deeply connected to the place.",
      "Depuis Arfoud, Tayeb Ettaiek incarne l'âme locale, l'hospitalité marocaine et la connaissance profonde du sud du Maroc. Son regard sur le territoire, ses habitants et ses traditions a été essentiel pour façonner des expériences authentiques, soignées et profondément liées au lieu.",
    ),
    note2: T(
      "Su legado vive en cada bienvenida, en cada ruta y en cada detalle que convierte un viaje en una experiencia memorable.",
      "His legacy lives on in every welcome, every route and every detail that turns a trip into a memorable experience.",
      "Son héritage vit dans chaque accueil, chaque itinéraire et chaque détail qui transforme un voyage en une expérience mémorable.",
    ),
  },
];

const FounderBlock = ({ f, reverse }) => (
  <div
    data-testid={`founder-${f.id}`}
    className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-16 lg:gap-24`}
  >
    {/* Polaroid photo */}
    <div className="shrink-0 w-full max-w-[290px] sm:max-w-[330px]">
      <figure
        className={`group relative bg-[#FDFBF7] p-3.5 pb-2 shadow-[0_38px_72px_-30px_rgba(26,21,19,0.6)] ${f.tilt} hover:rotate-0 transition-transform duration-700 ease-out will-change-transform`}
      >
        <span
          className={`postcard-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-7 ${f.tapeRotate}`}
          aria-hidden="true"
        />
        <div className="relative overflow-hidden bg-[#EDE4D6]">
          <EditableImage
            slot={`home.founders.${f.id}.photo`}
            fallback={f.img}
            alt={`${f.name.es} · ${f.origin.es}`}
            aspectRatio="4/5"
            imgProps={{ loading: "lazy" }}
            className="w-full h-full object-cover"
          />
        </div>
        <figcaption className="pt-4 pb-3 text-center">
          <EditableText
            as="p"
            slot={`home.founders.${f.id}.caption_name`}
            defaults={f.name}
            multiline={false}
            noTranslate
            className="font-hand text-[32px] leading-none text-[#2C2621]"
          />
          <EditableText
            as="p"
            slot={`home.founders.${f.id}.caption_origin`}
            defaults={f.origin}
            multiline={false}
            className="font-hand text-xl text-[#A07042] mt-1.5"
          />
        </figcaption>
      </figure>
    </div>

    {/* Handwritten note on aged paper */}
    <div className="flex-1 w-full">
      <div
        className={`postcard-paper relative border border-[#2C2621]/10 shadow-[0_34px_66px_-38px_rgba(26,21,19,0.5)] px-7 py-9 md:px-11 md:py-12 ${f.paperTilt}`}
      >
        {/* letter-style left margin */}
        <span className="absolute left-4 md:left-6 top-6 bottom-6 w-px bg-[#C16542]/25" aria-hidden="true" />
        <div className="pl-4 md:pl-6">
          <EditableText
            as="p"
            slot={`home.founders.${f.id}.note_name`}
            defaults={f.name}
            multiline={false}
            noTranslate
            className="font-hand text-4xl md:text-[42px] leading-none text-[#C16542]"
          />
          <span className="block w-16 h-px bg-[#2C2621]/20 my-5" aria-hidden="true" />
          <EditableText
            as="p"
            slot={`home.founders.${f.id}.note1`}
            defaults={f.note1}
            className="font-hand text-[23px] md:text-[26px] leading-[1.55] text-[#3A322B]"
          />
          <EditableText
            as="p"
            slot={`home.founders.${f.id}.note2`}
            defaults={f.note2}
            className="font-hand text-[23px] md:text-[26px] leading-[1.55] text-[#3A322B] mt-5"
          />
          <div className="mt-8 text-right">
            <EditableText
              as="p"
              slot={`home.founders.${f.id}.signature`}
              defaults={f.name}
              multiline={false}
              noTranslate
              className="font-hand text-[34px] leading-none text-[#2C2621]"
            />
            <EditableText
              as="p"
              slot={`home.founders.${f.id}.role`}
              defaults={COPY.role}
              multiline={false}
              className="mt-2 text-[10px] tracking-[0.28em] uppercase text-[#8A7C64]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const FoundersSection = () => (
  <section
    data-testid="founders-section"
    className="relative bg-[#F2EBE1] overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-cross opacity-[0.05] pointer-events-none" aria-hidden="true" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A373]/50 to-transparent" aria-hidden="true" />

    <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-flex items-center gap-3 text-[#C16542]">
          <Compass className="w-4 h-4" strokeWidth={1.7} />
          <EditableText
            slot="home.founders.eyebrow"
            defaults={COPY.eyebrow}
            multiline={false}
            className="text-[11px] tracking-[0.35em] uppercase font-semibold"
          />
        </span>
        <EditableText
          as="h2"
          slot="home.founders.title"
          defaults={COPY.title}
          multiline={false}
          className="font-serif-x text-[#2C2621] text-4xl md:text-5xl leading-[1.05] tracking-tight mt-5"
        />
        <EditableText
          as="p"
          slot="home.founders.subtitle"
          defaults={COPY.subtitle}
          className="mt-5 text-base md:text-lg text-[#5C5248] leading-relaxed"
        />
      </div>

      {/* Founder blocks */}
      <div className="mt-16 md:mt-24 space-y-24 md:space-y-32">
        {FOUNDERS.map((f, i) => (
          <FounderBlock key={f.id} f={f} reverse={i % 2 === 1} />
        ))}
      </div>
    </div>
  </section>
);

export default FoundersSection;
