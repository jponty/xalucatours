import React, { useEffect } from "react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { NORTE_ITINERARIES, NORTE_EDITORIAL, NORTE_CITIES } from "@/lib/norteItineraries";
import {
  JourneyHero,
  StickyNav,
  ItinerariesOverview,
  ItineraryBlock,
  EditorialBlock,
  CtaBand,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";

/* ============================================================
   Trilingual copy for the Norte de Marruecos gateway
============================================================ */
const COPY = {
  es: {
    docTitle: "Viajes al Norte de Marruecos · Xaluca Tours",
    hero: {
      eyebrow: "Viajes al Norte de Marruecos",
      place: "Fez · Chefchaouen · Tánger",
      title: "Norte de Marruecos.",
      subtitle: "Ciudades imperiales, medinas históricas, mar Mediterráneo y los pueblos azules del Rif.",
      intro: "Una mirada cultural y paisajística al Marruecos más antiguo — donde la arquitectura, la historia y la luz del Mediterráneo se encuentran.",
      primaryCta: "Ver itinerarios", secondaryCta: "Pedir asesoramiento", scroll: "Desplázate",
    },
    nav: {
      itineraries: "Itinerarios",
      route1: "Ciudades imperiales",
      route2: "Fez · Tánger",
      editorial1: "El alma del Norte",
      editorial2: "Mosaico del Norte",
      cities: "Ciudades",
      contact: "Contacto",
    },
    overview: {
      overline: "Dos travesías culturales", title: "Elige tu ruta por el norte.",
      body: "Dos maneras de descubrir el norte de Marruecos: una inmersión cultural en las ciudades imperiales o una travesía completa de Fez a Tánger.",
      cta: "Ver itinerario",
    },
    block: { cta_request: "Solicitar viaje", cta_info: "Más información" },
    cities: {
      overline: "Ciudades destacadas",
      title: "Seis joyas del norte marroquí.",
      body: "Cada ciudad ofrece una experiencia diferente: de la espiritualidad de Fez al ambiente cosmopolita de Tánger, pasando por la serenidad azul de Chefchaouen.",
    },
    cta: {
      overline: "Asesoramiento",
      title: "Diseña tu viaje cultural a medida.",
      body: "Ambos itinerarios pueden adaptarse a tu ritmo, fechas y número de viajeros. Habla con nuestro equipo y lo afinamos juntos.",
      cta_primary: "Contactar",
      cta_secondary: "Pedir cita previa",
    },
  },
  en: {
    docTitle: "Northern Morocco journeys · Xaluca Tours",
    hero: {
      eyebrow: "Northern Morocco journeys",
      place: "Fez · Chefchaouen · Tangier",
      title: "Northern Morocco.",
      subtitle: "Imperial cities, historic medinas, the Mediterranean coast and the blue villages of the Rif.",
      intro: "A cultural and scenic look at the oldest Morocco — where architecture, history and Mediterranean light meet.",
      primaryCta: "View itineraries", secondaryCta: "Get advice", scroll: "Scroll",
    },
    nav: {
      itineraries: "Itineraries",
      route1: "Imperial cities",
      route2: "Fez · Tangier",
      editorial1: "Soul of the North",
      editorial2: "Northern mosaic",
      cities: "Cities",
      contact: "Contact",
    },
    overview: {
      overline: "Two cultural crossings", title: "Choose your northern route.",
      body: "Two ways to discover northern Morocco: a cultural immersion in the imperial cities, or a full crossing from Fez to Tangier.",
      cta: "See itinerary",
    },
    block: { cta_request: "Request journey", cta_info: "More info" },
    cities: {
      overline: "Featured cities",
      title: "Six jewels of the Moroccan north.",
      body: "Each city offers a different experience — from the spirituality of Fez to the cosmopolitan air of Tangier, by way of Chefchaouen's blue serenity.",
    },
    cta: {
      overline: "Advice",
      title: "Design your cultural journey, tailor-made.",
      body: "Both itineraries can be adapted to your pace, dates and group size. Talk to our team and we'll fine-tune it together.",
      cta_primary: "Get in touch",
      cta_secondary: "Book an appointment",
    },
  },
  fr: {
    docTitle: "Voyages au Nord du Maroc · Xaluca Tours",
    hero: {
      eyebrow: "Voyages au Nord du Maroc",
      place: "Fès · Chefchaouen · Tanger",
      title: "Nord du Maroc.",
      subtitle: "Cités impériales, médinas historiques, mer Méditerranée et villages bleus du Rif.",
      intro: "Un regard culturel et paysager sur le Maroc le plus ancien — là où architecture, histoire et lumière méditerranéenne se rencontrent.",
      primaryCta: "Voir les itinéraires", secondaryCta: "Demander conseil", scroll: "Faites défiler",
    },
    nav: {
      itineraries: "Itinéraires",
      route1: "Cités impériales",
      route2: "Fès · Tanger",
      editorial1: "L'âme du Nord",
      editorial2: "Mosaïque du Nord",
      cities: "Villes",
      contact: "Contact",
    },
    overview: {
      overline: "Deux traversées culturelles", title: "Choisissez votre route du nord.",
      body: "Deux façons de découvrir le nord du Maroc : une immersion culturelle dans les cités impériales ou une traversée complète de Fès à Tanger.",
      cta: "Voir l'itinéraire",
    },
    block: { cta_request: "Demander ce voyage", cta_info: "Plus d'infos" },
    cities: {
      overline: "Villes phares",
      title: "Six joyaux du nord marocain.",
      body: "Chaque ville offre une expérience différente — de la spiritualité de Fès à l'atmosphère cosmopolite de Tanger, en passant par la sérénité bleue de Chefchaouen.",
    },
    cta: {
      overline: "Conseil",
      title: "Concevez votre voyage culturel sur mesure.",
      body: "Les deux itinéraires s'adaptent à votre rythme, vos dates et la taille du groupe. Parlez-en avec notre équipe et nous l'affinons ensemble.",
      cta_primary: "Nous contacter",
      cta_secondary: "Prendre rendez-vous",
    },
  },
};

/* ============================================================
   Cities row — 6 northern jewels chip-grid
============================================================ */
const CitiesRow = ({ t, lang }) => (
  <section
    id="cities"
    data-testid="norte-cities"
    className="relative bg-[#F2EBE1] py-20 md:py-28 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-diamond opacity-30 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
        <div className="md:col-span-7">
          <span className="overline">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.title}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.body}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {NORTE_CITIES.map((c) => (
          <div
            key={c.id}
            data-testid={`norte-city-${c.id}`}
            className="bg-[#FDFBF7] p-5 md:p-6 flex flex-col gap-2 hover:bg-[#F2EBE1] transition-colors duration-300"
          >
            <span className="font-serif-x text-xl md:text-[22px] text-[#2C2621]">
              {pick(c.label, lang)}
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
              {pick(c.hint, lang)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function NortePage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  const navItems = [
    { id: "itineraries",        label: t.nav.itineraries },
    { id: "ciudades-imperiales",label: t.nav.route1 },
    { id: "fez-tanger",         label: t.nav.route2 },
    { id: "riqueza-belleza",    label: t.nav.editorial1 },
    { id: "ciudades-historicas",label: t.nav.editorial2 },
    { id: "cities",             label: t.nav.cities },
    { id: "asesoramiento",      label: t.nav.contact },
  ];

  return (
    <div data-testid="norte-page">
      <JourneyHero
        image="https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85"
        eyebrow={t.hero.eyebrow}
        place={t.hero.place}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        intro={t.hero.intro}
        primaryCta={t.hero.primaryCta}
        primaryHref="#itineraries"
        secondaryCta={t.hero.secondaryCta}
        secondaryHref="#asesoramiento"
        scroll={t.hero.scroll}
        testid="norte-hero"
      />

      <StickyNav items={navItems} testid="norte-nav" />

      <ItinerariesOverview itineraries={NORTE_ITINERARIES} t={t.overview} lang={lang} />

      {/* Itinerary 1 */}
      <ItineraryBlock
        itinerary={NORTE_ITINERARIES[0]}
        index={0}
        lang={lang}
        t={t.block}
        ctaTarget={pathFor(lang, "contact")}
      />

      {/* Editorial 1 — between itineraries */}
      <EditorialBlock block={NORTE_EDITORIAL[0]} lang={lang} />

      {/* Itinerary 2 */}
      <ItineraryBlock
        itinerary={NORTE_ITINERARIES[1]}
        index={1}
        lang={lang}
        t={t.block}
        ctaTarget={pathFor(lang, "contact")}
      />

      {/* Editorial 2 — closing narrative */}
      <EditorialBlock block={NORTE_EDITORIAL[1]} lang={lang} />

      {/* Cities row */}
      <CitiesRow t={t.cities} lang={lang} />

      <CtaBand t={t.cta} lang={lang} testid="norte-cta-band" />

      <ContactForm />
    </div>
  );
}
