import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { MARRUECOS_ITINERARIES } from "@/lib/marruecosItineraries";
import {
  JourneyHero,
  StickyNav,
  ItinerariesOverview,
  ItineraryBlock,
  CtaBand,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";

/* ============================================================
   Trilingual copy for the Marruecos gateway
============================================================ */
const COPY = {
  es: {
    docTitle: "Viajes por todo Marruecos · Xaluca Tours",
    hero: {
      eyebrow: "Viajes por todo Marruecos",
      place: "Fez · Atlas · Sáhara · Marrakech",
      title: "Viajes por todo Marruecos.",
      subtitle: "Travesías completas para descubrir el país de norte a sur — del Mediterráneo al Sáhara, sin atajos.",
      intro: "Cuatro itinerarios cinematográficos que combinan ciudades imperiales, montañas del Atlas, bosques de cedros y noches en las dunas del Erg Chebbi.",
      primaryCta: "Ver itinerarios", secondaryCta: "Pedir asesoramiento", scroll: "Desplázate",
    },
    nav: { itineraries: "Itinerarios", route1: "Gran Sur", route2: "Sur + Medio Atlas", route3: "Atlas · Desierto · Fez", route4: "Tánger · Marrakech", contact: "Contacto" },
    overview: {
      overline: "Cuatro travesías", title: "Elige tu travesía por Marruecos.",
      body: "Cada ruta es una manera diferente de cruzar el país. Misma exigencia, mismos detalles cuidados — itinerarios distintos.",
      cta: "Ver itinerario",
    },
    block: { cta_request: "Solicitar viaje", cta_info: "Más información" },
    cta: {
      overline: "Asesoramiento",
      title: "Diseña tu travesía a medida.",
      body: "Cada uno de estos itinerarios puede adaptarse a tu ritmo, fechas y número de viajeros. Habla con nuestro equipo y lo afinamos juntos.",
      cta_primary: "Contactar",
      cta_secondary: "Pedir cita previa",
    },
  },
  en: {
    docTitle: "Morocco-wide journeys · Xaluca Tours",
    hero: {
      eyebrow: "Morocco-wide journeys",
      place: "Fez · Atlas · Sahara · Marrakech",
      title: "Journeys across Morocco.",
      subtitle: "Full crossings of the country, north to south — from the Mediterranean to the Sahara, no shortcuts.",
      intro: "Four cinematic itineraries blending imperial cities, the Atlas mountains, cedar forests and nights in the Erg Chebbi dunes.",
      primaryCta: "View itineraries", secondaryCta: "Get advice", scroll: "Scroll",
    },
    nav: { itineraries: "Itineraries", route1: "Grand South", route2: "South + Middle Atlas", route3: "Atlas · Desert · Fez", route4: "Tangier · Marrakech", contact: "Contact" },
    overview: {
      overline: "Four crossings", title: "Choose your Morocco journey.",
      body: "Each route is a different way of crossing the country. Same care, same attention to detail — different itineraries.",
      cta: "See itinerary",
    },
    block: { cta_request: "Request journey", cta_info: "More info" },
    cta: {
      overline: "Advice",
      title: "Design your tailor-made crossing.",
      body: "Every itinerary can be adapted to your pace, dates and group size. Talk to our team and we'll fine-tune it together.",
      cta_primary: "Get in touch",
      cta_secondary: "Book an appointment",
    },
  },
  fr: {
    docTitle: "Voyages dans tout le Maroc · Xaluca Tours",
    hero: {
      eyebrow: "Voyages dans tout le Maroc",
      place: "Fès · Atlas · Sahara · Marrakech",
      title: "Voyages à travers le Maroc.",
      subtitle: "Traversées complètes du pays, du nord au sud — de la Méditerranée au Sahara, sans raccourcis.",
      intro: "Quatre itinéraires cinématographiques mêlant cités impériales, montagnes de l'Atlas, forêts de cèdres et nuits dans les dunes de l'Erg Chebbi.",
      primaryCta: "Voir les itinéraires", secondaryCta: "Demander conseil", scroll: "Faites défiler",
    },
    nav: { itineraries: "Itinéraires", route1: "Grand Sud", route2: "Sud + Moyen Atlas", route3: "Atlas · Désert · Fès", route4: "Tanger · Marrakech", contact: "Contact" },
    overview: {
      overline: "Quatre traversées", title: "Choisissez votre voyage au Maroc.",
      body: "Chaque itinéraire est une façon différente de traverser le pays. Même soin, même attention aux détails — itinéraires distincts.",
      cta: "Voir l'itinéraire",
    },
    block: { cta_request: "Demander ce voyage", cta_info: "Plus d'infos" },
    cta: {
      overline: "Conseil",
      title: "Concevez votre traversée sur mesure.",
      body: "Chaque itinéraire s'adapte à votre rythme, vos dates et la taille du groupe. Parlez-en avec notre équipe et nous l'affinons ensemble.",
      cta_primary: "Nous contacter",
      cta_secondary: "Prendre rendez-vous",
    },
  },
};

export default function MarruecosPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  const navItems = [
    { id: "itineraries", label: t.nav.itineraries },
    { id: "gran-sur-fez-marrakech",  label: t.nav.route1 },
    { id: "gran-sur-medio-atlas",    label: t.nav.route2 },
    { id: "alto-atlas-desierto-fez", label: t.nav.route3 },
    { id: "tanger-marrakech",        label: t.nav.route4 },
    { id: "asesoramiento", label: t.nav.contact },
  ];

  return (
    <div data-testid="marruecos-page">
      <JourneyHero
        image="https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85"
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
        testid="marruecos-hero"
      />

      <StickyNav items={navItems} testid="marruecos-nav" />

      <ItinerariesOverview itineraries={MARRUECOS_ITINERARIES} t={t.overview} lang={lang} />

      {MARRUECOS_ITINERARIES.map((it, i) => (
        <ItineraryBlock
          key={it.id}
          itinerary={it}
          index={i}
          lang={lang}
          t={t.block}
          ctaTarget={pathFor(lang, "contact")}
        />
      ))}

      <CtaBand t={t.cta} lang={lang} testid="marruecos-cta-band" />

      <ContactForm />
    </div>
  );
}
