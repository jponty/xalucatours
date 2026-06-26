/* ============================================================
   PolaroidWall — a warm, editorial "travel memories" strip shown
   below the WhyXaluca cards. Printed-photo (polaroid) frames,
   slightly tilted and overlapping, with handwritten-style captions.

   • Images go through <Img> → responsive srcSet + AVIF/WebP +
     lazy loading + blur-up, so the strip stays light and never
     blocks rendering.
   • Captions are CMS-editable (EditableText, slots home.why.polaroid.*).
   • Responsive: 2-col grid on mobile, an overlapping tilted strip
     on md+. Tilt straightens and the photo lifts on hover.
============================================================ */
import React from "react";
import { Camera } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import Img from "@/components/Img";

const COPY = {
  overline: { es: "Memorias de viaje", en: "Travel memories", fr: "Souvenirs de voyage" },
  title: {
    es: "Instantáneas de un Marruecos que se vive de cerca.",
    en: "Snapshots of a Morocco lived up close.",
    fr: "Instantanés d'un Maroc vécu de près.",
  },
};

/* Each polaroid: image + trilingual caption + a tilt/offset for the
   scattered, hand-pinned look (deterministic, never random). */
const PHOTOS = [
  {
    id: "dunes",
    src: "https://images.pexels.com/photos/8357638/pexels-photo-8357638.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "Caravana en el Erg Chebbi", en: "Caravan in Erg Chebbi", fr: "Caravane à l'Erg Chebbi" },
    rotate: -5,
    offset: "md:mt-8",
  },
  {
    id: "tea",
    src: "https://images.pexels.com/photos/30498764/pexels-photo-30498764.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "Té a la menta, siempre", en: "Mint tea, always", fr: "Thé à la menthe, toujours" },
    rotate: 3,
    offset: "md:mt-0",
  },
  {
    id: "souk",
    src: "https://images.pexels.com/photos/36209446/pexels-photo-36209446.jpeg",
    caption: { es: "Colores del zoco de Marrakech", en: "Colours of the Marrakech souk", fr: "Couleurs du souk de Marrakech" },
    rotate: -3,
    offset: "md:mt-10",
  },
  {
    id: "chefchaouen",
    src: "https://images.pexels.com/photos/5472518/pexels-photo-5472518.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "La perla azul, Chefchaouen", en: "The blue pearl, Chefchaouen", fr: "La perle bleue, Chefchaouen" },
    rotate: 5,
    offset: "md:mt-2",
  },
  {
    id: "riad",
    src: "https://images.pexels.com/photos/29125650/pexels-photo-29125650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "Patios de riad al atardecer", en: "Riad courtyards at dusk", fr: "Patios de riad au crépuscule" },
    rotate: -4,
    offset: "md:mt-9",
  },
  {
    id: "artisan",
    src: "https://images.unsplash.com/photo-1517227298311-f248d35b1a18",
    caption: { es: "Manos que guardan oficios", en: "Hands keeping crafts alive", fr: "Des mains gardiennes des métiers" },
    rotate: 2,
    offset: "md:mt-1",
  },
];

const Polaroid = ({ photo, lang }) => (
  <figure
    data-testid={`polaroid-${photo.id}`}
    className={`group/polaroid relative bg-[#FDFBF7] p-2.5 pb-9 md:p-3 md:pb-11 shadow-[0_18px_40px_-18px_rgba(26,21,19,0.5)] ring-1 ring-[#2C2621]/8 transition-transform duration-500 ease-out hover:z-20 hover:!rotate-0 hover:-translate-y-2 md:-ml-6 md:first:ml-0 w-full md:w-auto ${photo.offset}`}
    style={{ transform: `rotate(${photo.rotate}deg)` }}
  >
    {/* washi-tape accent at the top */}
    <span
      className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-5 bg-[#C16542]/20 border border-[#C16542]/25 rotate-[-2deg]"
      aria-hidden="true"
    />
    <div className="overflow-hidden bg-[#2C2621]/5">
      <Img
        src={photo.src}
        alt=""
        width={520}
        sizes="(max-width: 768px) 45vw, 240px"
        className="block w-full aspect-[4/5] object-cover md:w-[220px] lg:w-[240px]"
      />
    </div>
    <EditableText
      as="figcaption"
      slot={`home.why.polaroid.${photo.id}.caption`}
      defaults={photo.caption}
      multiline={false}
      className="block text-center font-serif-x-italic text-[12px] md:text-[13px] text-[#5C5248] mt-2.5 px-1 leading-snug"
    />
  </figure>
);

export const PolaroidWall = () => {
  const { lang } = useLanguage();

  return (
    <div className="relative mt-20 md:mt-28" data-testid="why-polaroid-wall">
      <div className="text-center max-w-2xl mx-auto">
        <span className="overline inline-flex items-center gap-2 text-[#C16542] justify-center">
          <Camera className="w-3.5 h-3.5" strokeWidth={1.7} />
          <EditableText
            slot="home.why.polaroid.overline"
            defaults={COPY.overline}
            as="span"
            multiline={false}
            className="inline"
          />
        </span>
        <EditableText
          as="h3"
          slot="home.why.polaroid.title"
          defaults={COPY.title}
          className="font-serif-x text-2xl md:text-3xl lg:text-4xl leading-[1.1] tracking-tight mt-4 text-[#2C2621] block"
        />
      </div>

      <div className="mt-12 md:mt-16 grid grid-cols-2 gap-5 sm:gap-6 md:flex md:flex-row md:flex-wrap md:justify-center md:items-start md:gap-0">
        {PHOTOS.map((p) => (
          <Polaroid key={p.id} photo={p} lang={lang} />
        ))}
      </div>
    </div>
  );
};

export default PolaroidWall;
