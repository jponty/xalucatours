import React, { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { CIRCUITS } from "@/lib/data";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";

// Visual companion for each circuit — short summary + image
const DETAILS = {
  sahara: {
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
    blurb: { en: "Erg Chebbi, Erg Chigaga and the silent dunes south of Mhamid.",
             fr: "Erg Chebbi, Erg Chigaga et les dunes silencieuses au sud de Mhamid.",
             es: "Erg Chebbi, Erg Chigaga y las dunas silenciosas al sur de Mhamid." },
  },
  imperial: {
    image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85",
    blurb: { en: "Marrakech, Fez, Meknès and Rabat — four cities, four kingdoms.",
             fr: "Marrakech, Fès, Meknès et Rabat — quatre cités, quatre royaumes.",
             es: "Marrakech, Fez, Mequinez y Rabat — cuatro ciudades, cuatro reinos." },
  },
  atlas: {
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
    blurb: { en: "Cedar passes, Berber villages, mule treks under snow-capped peaks.",
             fr: "Cols de cèdres, villages berbères, randonnées muletières sous des sommets enneigés.",
             es: "Pasos de cedros, aldeas bereberes, caminatas con mulas bajo cumbres nevadas." },
  },
  kasbahs: {
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85",
    blurb: { en: "From Ouarzazate to Aït Benhaddou along the legendary Dadès Valley.",
             fr: "D'Ouarzazate à Aït Benhaddou le long de la légendaire vallée du Dadès.",
             es: "De Uarzazat a Aït Benhaddou por el legendario valle del Dadès." },
  },
  north: {
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1800&q=85",
    blurb: { en: "Chefchaouen's indigo lanes, Tangier's hush and the Rif's hidden cheese-makers.",
             fr: "Les ruelles indigo de Chefchaouen, le calme de Tanger et les fromagers cachés du Rif.",
             es: "Los callejones índigo de Chefchaouen, la calma de Tánger y los queseros ocultos del Rif." },
  },
  short: {
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1800&q=85",
    blurb: { en: "Four nights from Marrakech to a desert bivouac — Morocco distilled.",
             fr: "Quatre nuits de Marrakech à un bivouac dans le désert — le Maroc concentré.",
             es: "Cuatro noches de Marrakech a un vivac en el desierto — Marruecos esencial." },
  },
  adventure: {
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
    blurb: { en: "4x4 expeditions, summit pushes on Toubkal, and lost trails of the Anti-Atlas.",
             fr: "Expéditions 4x4, ascensions du Toubkal et sentiers perdus de l'Anti-Atlas.",
             es: "Expediciones en 4x4, ascensiones al Toubkal y senderos perdidos del Antiatlas." },
  },
};

export const MoroccoCircuits = () => {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(CIRCUITS[0].slug);

  const current = useMemo(() => DETAILS[active] || DETAILS.sahara, [active]);
  const currentCircuit = useMemo(
    () => CIRCUITS.find((c) => c.slug === active) || CIRCUITS[0],
    [active]
  );

  return (
    <section
      id="circuits"
      data-testid="circuits-section"
      className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl">
          <EditableText slot="home.circuits.overline" defaults={translations.circ_overline} multiline={false} className="overline" />
          <EditableText as="h2" slot="home.circuits.title" defaults={translations.circ_title}
            className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621] block" />
          <EditableText as="p" slot="home.circuits.sub" defaults={translations.circ_sub}
            className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed block" />
        </div>

        {/* Chip filter row */}
        <div
          role="tablist"
          aria-label="Morocco circuits"
          className="mt-12 flex flex-wrap gap-3"
        >
          {CIRCUITS.map((c) => (
            <button
              key={c.slug}
              role="tab"
              aria-selected={active === c.slug}
              data-testid={`circuit-chip-${c.slug}`}
              onClick={() => setActive(c.slug)}
              className={`px-5 py-2.5 text-[10px] tracking-[0.3em] uppercase transition-all duration-300 ${
                active === c.slug
                  ? "bg-[#2C2621] text-[#FDFBF7] border border-[#2C2621]"
                  : "border border-[#2C2621]/20 text-[#5C5248] hover:border-[#C16542] hover:text-[#C16542]"
              }`}
            >
              {pick(c.label, lang)}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-7 relative h-[420px] md:h-[520px] overflow-hidden bg-[#1A1513]"
               data-testid={`circuit-image-${active}`}>
            <EditableImage
              key={active}
              slot={`home.circuit.${active}`}
              fallback={current.image}
              alt={pick(currentCircuit.label, lang)}
              imgProps={{ loading: "lazy" }}
              aspectRatio="16/10"
              className="ken-burns absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/35 to-[#1A1513]/10" />
            <span className="film-grain" />
            <span className="absolute bottom-6 left-6 font-serif-x text-[#FDFBF7] text-3xl md:text-4xl leading-[1.05]">
              {pick(currentCircuit.label, lang)}
            </span>
          </div>

          <div className="md:col-span-5 bg-[#FDFBF7] border border-[#2C2621]/10 p-8 md:p-10 flex flex-col">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C16542]">
              {pick(currentCircuit.label, lang)}
            </span>
            <p className="font-serif-x-italic text-2xl md:text-[26px] mt-5 leading-[1.3] text-[#2C2621]">
              {pick(current.blurb, lang)}
            </p>
            <div className="mt-auto pt-8">
              <a
                href="#contact"
                data-testid={`circuit-cta-${active}`}
                className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-3.5 text-[10px] tracking-[0.3em] uppercase transition-colors"
              >
                {t("cta_discover_routes")}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoroccoCircuits;
