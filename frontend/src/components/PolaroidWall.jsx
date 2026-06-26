/* ============================================================
   PolaroidWall — a warm, editorial "travel memories" carousel shown
   below the WhyXaluca cards. Printed-photo (polaroid) frames slide
   horizontally with snap scrolling and prev/next controls.

   • Images go through <Img> → responsive srcSet + AVIF/WebP +
     lazy loading + blur-up, so the strip stays light and never
     blocks the home page render.
   • Captions are CMS-editable (EditableText, slots home.why.polaroid.*).
   • Frames use the brand orange (#C16542) — washi tape, ring and
     focus outline — for a coherent visual identity across the site.
   • Slight, alternating tilt for the hand-pinned feel; straightens
     and lifts on hover. Fully responsive (touch-swipe + buttons).
============================================================ */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import Img from "@/components/Img";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import xMonogram from "@/assets/monograma-x-white.png";

const COPY = {
  overline: { es: "Memorias de viaje", en: "Travel memories", fr: "Souvenirs de voyage" },
  title: {
    es: "Instantáneas de un Marruecos que se vive de cerca.",
    en: "Snapshots of a Morocco lived up close.",
    fr: "Instantanés d'un Maroc vécu de près.",
  },
  prev: { es: "Anterior", en: "Previous", fr: "Précédent" },
  next: { es: "Siguiente", en: "Next", fr: "Suivant" },
};

const PHOTOS = [
  {
    id: "dunes",
    src: "https://images.pexels.com/photos/8357638/pexels-photo-8357638.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "Caravana en el Erg Chebbi", en: "Caravan in Erg Chebbi", fr: "Caravane à l'Erg Chebbi" },
    signature: { es: "Marta & Javier · Abril 1998", en: "Marta & Javier · April 1998", fr: "Marta & Javier · Avril 1998" },
    rotate: -4,
  },
  {
    id: "tea",
    src: "https://images.pexels.com/photos/30498764/pexels-photo-30498764.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "Té a la menta, siempre", en: "Mint tea, always", fr: "Thé à la menthe, toujours" },
    signature: { es: "Elena R. · Septiembre 2007", en: "Elena R. · September 2007", fr: "Elena R. · Septembre 2007" },
    rotate: 3,
  },
  {
    id: "souk",
    src: "https://images.pexels.com/photos/36209446/pexels-photo-36209446.jpeg",
    caption: { es: "Colores del zoco de Marrakech", en: "Colours of the Marrakech souk", fr: "Couleurs du souk de Marrakech" },
    signature: { es: "Carlos D. · Marzo 1992", en: "Carlos D. · March 1992", fr: "Carlos D. · Mars 1992" },
    rotate: -3,
  },
  {
    id: "chefchaouen",
    src: "https://images.pexels.com/photos/5472518/pexels-photo-5472518.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "La perla azul, Chefchaouen", en: "The blue pearl, Chefchaouen", fr: "La perle bleue, Chefchaouen" },
    signature: { es: "Lucía F. · Junio 2015", en: "Lucía F. · June 2015", fr: "Lucía F. · Juin 2015" },
    rotate: 4,
  },
  {
    id: "riad",
    src: "https://images.pexels.com/photos/29125650/pexels-photo-29125650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "Patios de riad al atardecer", en: "Riad courtyards at dusk", fr: "Patios de riad au crépuscule" },
    signature: { es: "Andrés P. · Octubre 2021", en: "Andrés P. · October 2021", fr: "Andrés P. · Octobre 2021" },
    rotate: -3,
  },
  {
    id: "artisan",
    src: "https://images.unsplash.com/photo-1517227298311-f248d35b1a18",
    caption: { es: "Manos que guardan oficios", en: "Hands keeping crafts alive", fr: "Des mains gardiennes des métiers" },
    signature: { es: "Nuria & Hugo · Mayo 2026", en: "Nuria & Hugo · May 2026", fr: "Nuria & Hugo · Mai 2026" },
    rotate: 2,
  },
];

const Polaroid = ({ photo }) => (
  <figure
    data-testid={`polaroid-${photo.id}`}
    className="group/polaroid relative shrink-0 snap-center w-[68vw] sm:w-[270px] md:w-[290px] bg-[#FDFBF7] p-2.5 pb-9 md:p-3 md:pb-11 shadow-[0_18px_40px_-18px_rgba(26,21,19,0.5)] ring-1 ring-[#C16542]/30 transition-transform duration-500 ease-out hover:z-20 hover:!rotate-0 hover:-translate-y-2"
    style={{ transform: `rotate(${photo.rotate}deg)` }}
  >
    {/* washi-tape accent */}
    <span
      className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#C16542]/25 border border-[#C16542]/35 rotate-[-2deg]"
      aria-hidden="true"
    />
    <div className="relative overflow-hidden bg-[#C16542]/5">
      <Img
        src={photo.src}
        alt=""
        width={520}
        sizes="(max-width: 640px) 68vw, 290px"
        className="block w-full aspect-[4/5] object-cover"
      />
      {/* Xaluca brand overlay — logo top-right + "X" monogram bottom-right,
          same style/position as the rest of the site's images. */}
      <XalucaLogoBadge
        className="top-3 right-3 w-9 h-9 md:w-10 md:h-10"
        testid={`polaroid-${photo.id}-logo`}
      />
      <img
        src={xMonogram}
        alt=""
        aria-hidden="true"
        data-testid={`polaroid-${photo.id}-monogram`}
        className="pointer-events-none select-none absolute bottom-3 right-3 w-9 h-9 md:w-10 md:h-10 object-contain opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] z-[3]"
      />
    </div>
    <figcaption className="text-center mt-2.5 px-1">
      <EditableText
        as="span"
        slot={`home.why.polaroid.${photo.id}.caption`}
        defaults={photo.caption}
        multiline={false}
        className="block font-serif-x-italic text-[12px] md:text-[13px] text-[#5C5248] leading-snug"
      />
      <EditableText
        as="span"
        slot={`home.why.polaroid.${photo.id}.signature`}
        defaults={photo.signature}
        multiline={false}
        className="block font-serif-x-italic text-[11px] md:text-[12px] text-[#C16542]/90 leading-snug mt-1"
      />
    </figcaption>
  </figure>
);

export const PolaroidWall = () => {
  const { lang } = useLanguage();
  const railRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanPrev(rail.scrollLeft > 8);
    setCanNext(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    updateArrows();
    rail.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      rail.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: rail.clientWidth * 0.8 * (dir === "next" ? 1 : -1), behavior: "smooth" });
  };

  return (
    <div className="relative mt-20 md:mt-28" data-testid="why-polaroid-wall">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
        <div className="max-w-2xl">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
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

        {/* Carousel controls — brand orange */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => scrollBy("prev")}
            aria-label={pick(COPY.prev, lang)}
            data-testid="polaroid-prev"
            disabled={!canPrev}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#C16542]/40 text-[#C16542] hover:bg-[#C16542] hover:text-[#FDFBF7] hover:border-[#C16542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#C16542]"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("next")}
            aria-label={pick(COPY.next, lang)}
            data-testid="polaroid-next"
            disabled={!canNext}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#C16542] text-[#FDFBF7] hover:bg-[#A35133] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] focus-visible:ring-offset-2 transition-colors duration-300 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        data-testid="polaroid-rail"
        className="mt-12 md:mt-16 flex items-start gap-7 md:gap-9 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pt-4 pb-6 -mx-6 md:-mx-12 px-6 md:px-12 focus-visible:outline-none"
      >
        {PHOTOS.map((p) => (
          <Polaroid key={p.id} photo={p} />
        ))}
      </div>
    </div>
  );
};

export default PolaroidWall;
