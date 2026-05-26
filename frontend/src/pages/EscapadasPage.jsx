import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { ESCAPADAS_ITEMS, ESCAPADAS_EDITORIAL, ESCAPADAS_PILLARS } from "@/lib/escapadasItineraries";
import {
  JourneyHero,
  StickyNav,
  ItinerariesOverview,
  ItineraryBlock,
  EditorialBlock,
  WhyXaluca,
  CatalogTeaser,
  CommunityCta,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";
import SectionGallery from "@/components/SectionGallery";
import { ESCAPADAS_GALLERIES } from "@/lib/sectionGalleries";

/* ============================================================
   Trilingual copy for /viajes/escapadas
============================================================ */
const COPY = {
  es: {
    docTitle: "Escapadas por Marruecos · Xaluca Tours",
    hero: {
      eyebrow: "¿Tienes pocos días?",
      place: "Fez · Marrakech · Atlas · Desierto",
      title: "Escapadas por Marruecos.",
      subtitle: "Para descubrir Marruecos en pocos días — desconexión, cultura y aventura sin renunciar a nada.",
      intro: "Si estás buscando una escapada de pocos días, Fez y Marrakech son dos opciones perfectas. Además, tanto las montañas del Atlas como el desierto de Merzouga se encuentran relativamente cerca, convirtiendo estas ciudades en el punto de partida ideal para descubrir el sur de Marruecos.",
      primaryCta: "Ver escapadas", secondaryCta: "Pedir asesoramiento", scroll: "Desplázate",
    },
    nav: {
      itineraries: "Escapadas",
      desierto: "Desierto",
      atlas: "Alto Atlas",
      fez: "Fez",
      marrakech: "Marrakech",
      tanger: "Tánger",
      why: "Por qué Xaluca",
      community: "Contacto",
    },
    overview: {
      overline: "Cinco escapadas", title: "Cinco maneras de viajar en pocos días.",
      body: "Desierto, montaña, Fez, Marrakech o el norte azul de Chefchaouen. Elige la tuya — o combínalas para crear una escapada a medida.",
      cta: "Ver escapada",
    },
    block: { cta_request: "Solicitar escapada", cta_view: "Ver escapada", cta_info: "Más información" },
    why: {
      overline: "Razones para viajar con Xaluca Tours",
      title: "Cuatro razones que marcan la diferencia.",
      body: "Atención personalizada, viajes 100% a medida, máxima calidad asegurada y la garantía Grup Xaluca: una red propia de hoteles y campamentos en el sur de Marruecos.",
    },
    catalog: {
      overline: "Descubre todos nuestros circuitos",
      title: "El Marruecos más auténtico te espera.",
      body: "Descubre nuestros viajes y escapadas diseñadas para explorar desiertos, montañas, ciudades imperiales y pueblos tradicionales.",
      cta: "Ver todos los circuitos",
    },
    community: {
      overline: "Únete a nuestra comunidad de viajeros",
      title: "¿Tienes preguntas?",
      subtitle: "Asesoramiento online en tiempo real o ven a visitarnos a nuestras oficinas.",
      body: "Planifica tu próxima escapada por Marruecos y resuelve todas tus dudas directamente con nuestros agentes especializados. Reserva una cita telefónica o solicita una visita presencial en nuestras oficinas de la Calle Latorre 52, Sabadell, Barcelona.",
      phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
      hours_value: "Lun – Vie · 10h – 20h",
      cta_primary: "Contactar ahora",
    },
  },
  en: {
    docTitle: "Morocco short escapes · Xaluca Tours",
    hero: {
      eyebrow: "Just a few days?",
      place: "Fez · Marrakech · Atlas · Desert",
      title: "Morocco short escapes.",
      subtitle: "Discover Morocco in just a few days — disconnection, culture and adventure with no compromise.",
      intro: "If you are looking for a short escape, Fez and Marrakech are two perfect choices. Both the Atlas mountains and the Merzouga desert are relatively close — making these cities an ideal starting point to discover southern Morocco.",
      primaryCta: "View escapes", secondaryCta: "Get advice", scroll: "Scroll",
    },
    nav: {
      itineraries: "Escapes",
      desierto: "Desert",
      atlas: "High Atlas",
      fez: "Fez",
      marrakech: "Marrakech",
      tanger: "Tangier",
      why: "Why Xaluca",
      community: "Contact",
    },
    overview: {
      overline: "Five escapes", title: "Five ways to travel in just a few days.",
      body: "Desert, mountains, Fez, Marrakech or the blue north of Chefchaouen. Pick yours — or combine them into a tailor-made escape.",
      cta: "See escape",
    },
    block: { cta_request: "Request escape", cta_view: "View escape", cta_info: "More info" },
    why: {
      overline: "Reasons to travel with Xaluca Tours",
      title: "Four reasons that make the difference.",
      body: "Personal attention, fully tailor-made trips, top-tier quality and the Grup Xaluca guarantee: a private network of hotels and camps across southern Morocco.",
    },
    catalog: {
      overline: "Discover all our circuits",
      title: "The most authentic Morocco awaits.",
      body: "Discover our trips and escapes crafted to uncover deserts, mountains, imperial cities and traditional villages.",
      cta: "See all circuits",
    },
    community: {
      overline: "Join our community of travellers",
      title: "Any questions?",
      subtitle: "Real-time online advice or visit us at our offices.",
      body: "Plan your next Moroccan escape and resolve every doubt with our specialised agents. Book a phone call or visit us at Calle Latorre 52, Sabadell, Barcelona.",
      phone_label: "Phone", email_label: "Email", hours_label: "Hours",
      hours_value: "Mon – Fri · 10:00 – 20:00",
      cta_primary: "Get in touch",
    },
  },
  fr: {
    docTitle: "Escapades au Maroc · Xaluca Tours",
    hero: {
      eyebrow: "Peu de jours ?",
      place: "Fès · Marrakech · Atlas · Désert",
      title: "Escapades au Maroc.",
      subtitle: "Découvrir le Maroc en quelques jours — déconnexion, culture et aventure sans compromis.",
      intro: "Si vous cherchez une escapade courte, Fès et Marrakech sont deux choix parfaits. Les montagnes de l'Atlas et le désert de Merzouga ne sont pas loin — faisant de ces villes le point de départ idéal pour découvrir le sud du Maroc.",
      primaryCta: "Voir les escapades", secondaryCta: "Demander conseil", scroll: "Faites défiler",
    },
    nav: {
      itineraries: "Escapades",
      desierto: "Désert",
      atlas: "Haut Atlas",
      fez: "Fès",
      marrakech: "Marrakech",
      tanger: "Tanger",
      why: "Pourquoi Xaluca",
      community: "Contact",
    },
    overview: {
      overline: "Cinq escapades", title: "Cinq façons de voyager en quelques jours.",
      body: "Désert, montagne, Fès, Marrakech ou le nord bleu de Chefchaouen. Choisissez la vôtre — ou combinez-les pour une escapade sur mesure.",
      cta: "Voir l'escapade",
    },
    block: { cta_request: "Demander l'escapade", cta_view: "Voir l'escapade", cta_info: "Plus d'infos" },
    why: {
      overline: "Pourquoi voyager avec Xaluca Tours",
      title: "Quatre raisons qui font la différence.",
      body: "Attention personnalisée, voyages 100% sur mesure, qualité maximale et la garantie Grup Xaluca : un réseau propre d'hôtels et de campements dans le sud du Maroc.",
    },
    catalog: {
      overline: "Découvrez tous nos circuits",
      title: "Le Maroc le plus authentique vous attend.",
      body: "Découvrez nos voyages et escapades conçus pour explorer désert, montagnes, cités impériales et villages traditionnels.",
      cta: "Voir tous les circuits",
    },
    community: {
      overline: "Rejoignez notre communauté de voyageurs",
      title: "Des questions ?",
      subtitle: "Conseil en ligne en temps réel ou rendez-vous à nos bureaux.",
      body: "Planifiez votre prochaine escapade au Maroc et levez tous vos doutes avec nos agents spécialisés. Réservez un appel ou rendez-vous au Calle Latorre 52, Sabadell, Barcelone.",
      phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
      hours_value: "Lun – Ven · 10h – 20h",
      cta_primary: "Nous contacter",
    },
  },
};

export default function EscapadasPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  const navItems = [
    { id: "itineraries",label: t.nav.itineraries },
    { id: "desierto",   label: t.nav.desierto },
    { id: "alto-atlas", label: t.nav.atlas },
    { id: "fez",        label: t.nav.fez },
    { id: "marrakech",  label: t.nav.marrakech },
    { id: "tanger",     label: t.nav.tanger },
    { id: "why-xaluca", label: t.nav.why },
    { id: "community",  label: t.nav.community },
  ];

  return (
    <div data-testid="escapadas-page">
      <JourneyHero
        image="https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=2400&q=85"
        eyebrow={t.hero.eyebrow}
        place={t.hero.place}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        intro={t.hero.intro}
        primaryCta={t.hero.primaryCta}
        primaryHref="#itineraries"
        secondaryCta={t.hero.secondaryCta}
        secondaryHref="#community"
        scroll={t.hero.scroll}
        testid="escapadas-hero"
      />

      <StickyNav items={navItems} testid="escapadas-nav" />

      <ItinerariesOverview itineraries={ESCAPADAS_ITEMS} t={t.overview} lang={lang} />

      {ESCAPADAS_ITEMS.map((it, i) => (
        <React.Fragment key={it.id}>
          <EditorialBlock block={ESCAPADAS_EDITORIAL[i]} lang={lang} />
          {ESCAPADAS_GALLERIES[i] && (
            <SectionGallery {...ESCAPADAS_GALLERIES[i]} testid={`escapadas-gallery-${it.id}`} />
          )}
          <ItineraryBlock
            itinerary={it}
            index={i}
            lang={lang}
            t={t.block}
            ctaTarget={pathFor(lang, "contact")}
          />
        </React.Fragment>
      ))}

      <WhyXaluca pillars={ESCAPADAS_PILLARS} t={t.why} lang={lang} testid="escapadas-why" />

      <CatalogTeaser
        t={t.catalog}
        lang={lang}
        image="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85"
        testid="escapadas-catalog"
      />

      <CommunityCta
        t={t.community}
        lang={lang}
        image="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=85"
        testid="escapadas-community"
      />

      <ContactForm />
    </div>
  );
}
