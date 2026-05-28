import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { MARRUECOS_ITINERARIES } from "@/lib/marruecosItineraries";
import { SUR_PILLARS } from "@/lib/surItineraries";
import {
  JourneyHero,
  StickyNav,
  ItinerariesOverview,
  ItineraryBlock,
  EditorialBlock,
  WhyXaluca,
  CatalogTeaser,
  CommunityCta,
  CtaBand,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";
import SectionGallery from "@/components/SectionGallery";
import VideoSection from "@/components/VideoSection";
import { MARRUECOS_VIDEOS } from "@/lib/sectionVideos";
import Testimonials from "@/components/Testimonials";
import { MARRUECOS_GALLERIES } from "@/lib/sectionGalleries";

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
    nav: { intro: "Introducción", itineraries: "Itinerarios", route1: "Gran Sur", route2: "Sur + Medio Atlas", route3: "Atlas · Desierto · Fez", route4: "Tánger · Marrakech", contact: "Contacto" },
    overview: {
      overline: "Cuatro travesías", title: "Elige tu travesía por Marruecos.",
      body: "Cada ruta es una manera diferente de cruzar el país. Misma exigencia, mismos detalles cuidados — itinerarios distintos.",
      cta: "Ver itinerario",
    },
    block: { cta_request: "Ver opciones", cta_info: "Más información", variants_overline: "Opciones de viaje" },
    intro: {
      id: "intro-marruecos",
      image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      eyebrow: { es: "Xaluca Tours · Especialistas en Marruecos", en: "Xaluca Tours · Morocco specialists", fr: "Xaluca Tours · Spécialistes du Maroc" },
      title: { es: "Marruecos, de norte a sur.", en: "Morocco, north to south.", fr: "Le Maroc, du nord au sud." },
      body: {
        es: [
          "Marruecos es un país de contrastes infinitos. En unos pocos cientos de kilómetros se pasa del Mediterráneo al Sahara, de la nieve del Atlas al palmeral, del azul de Chefchaouen al rojo de Marrakech.",
          "En Xaluca Tours somos especialistas en circuitos a medida por todo el país. Diseñamos cada viaje desde Barcelona con nuestro equipo en destino, una red propia de hoteles, riads y campamentos de lujo, y vehículos 4x4 con conductor-guía bereber.",
          "Nuestra propuesta para descubrir Marruecos de norte a sur se articula en cuatro grandes travesías que combinan ciudades imperiales, bosques de cedros, gargantas, kasbahs y noches en el desierto.",
        ],
        en: [
          "Morocco is a country of infinite contrasts. Within a few hundred kilometres you move from the Mediterranean to the Sahara, from the Atlas snow to the palm grove, from Chefchaouen blue to Marrakech red.",
          "At Xaluca Tours we specialise in tailor-made tours across the country. We design every trip from Barcelona with our on-the-ground team, a private network of hotels, riads and luxury camps, and 4x4 vehicles with a Berber driver-guide.",
          "Our north-to-south Morocco programme unfolds in four great crossings that combine imperial cities, cedar forests, gorges, kasbahs and nights in the desert.",
        ],
        fr: [
          "Le Maroc est un pays aux contrastes infinis. En quelques centaines de kilomètres, on passe de la Méditerranée au Sahara, de la neige de l'Atlas à la palmeraie, du bleu de Chefchaouen au rouge de Marrakech.",
          "Chez Xaluca Tours, nous sommes spécialistes des voyages sur mesure dans tout le pays. Nous concevons chaque circuit depuis Barcelone avec notre équipe sur place, un réseau propre d'hôtels, de riads et de bivouacs de luxe et des véhicules 4x4 avec chauffeur-guide berbère.",
          "Notre programme pour découvrir le Maroc du nord au sud se décline en quatre grandes traversées mêlant cités impériales, forêts de cèdres, gorges, kasbahs et nuits au désert.",
        ],
      },
    },
    why: {
      overline: "Razones para viajar con Xaluca Tours",
      title: "Cuatro razones que marcan la diferencia.",
      body: "Atención personalizada, viajes 100% a medida, máxima calidad asegurada y la garantía Grup Xaluca: una red propia de hoteles, riads y campamentos por todo Marruecos.",
    },
    catalog: {
      overline: "Descubre todos nuestros circuitos",
      title: "El Marruecos más auténtico te espera.",
      body: "Más allá de las cuatro grandes travesías, explora todos nuestros viajes, rutas y experiencias diseñadas para descubrir el desierto, las montañas, las kasbahs y las ciudades imperiales.",
      cta: "Ver todos los circuitos",
    },
    community: {
      overline: "Asesoramiento online y cita previa",
      title: "Diseña tu viaje con nosotros.",
      subtitle: "Asesoramiento online en tiempo real o ven a visitarnos a nuestras oficinas de Barcelona.",
      body: "Planifica tu próxima travesía por Marruecos y resuelve todas tus dudas directamente con nuestro equipo. Te ayudaremos a diseñar el itinerario que mejor se adapte a tus fechas, ritmo e intereses.",
      phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
      hours_value: "Lun – Vie · 10h – 20h",
      cta_primary: "Contactar ahora",
    },
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
    nav: { intro: "Overview", itineraries: "Itineraries", route1: "Grand South", route2: "South + Middle Atlas", route3: "Atlas · Desert · Fez", route4: "Tangier · Marrakech", contact: "Contact" },
    overview: {
      overline: "Four crossings", title: "Choose your Morocco journey.",
      body: "Each route is a different way of crossing the country. Same care, same attention to detail — different itineraries.",
      cta: "See itinerary",
    },
    block: { cta_request: "View options", cta_info: "More info", variants_overline: "Trip options" },
    intro: {
      id: "intro-marruecos",
      image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      eyebrow: { es: "Xaluca Tours · Especialistas en Marruecos", en: "Xaluca Tours · Morocco specialists", fr: "Xaluca Tours · Spécialistes du Maroc" },
      title: { es: "Marruecos, de norte a sur.", en: "Morocco, north to south.", fr: "Le Maroc, du nord au sud." },
      body: {
        es: [
          "Marruecos es un país de contrastes infinitos. En unos pocos cientos de kilómetros se pasa del Mediterráneo al Sahara, de la nieve del Atlas al palmeral, del azul de Chefchaouen al rojo de Marrakech.",
          "En Xaluca Tours somos especialistas en circuitos a medida por todo el país. Diseñamos cada viaje desde Barcelona con nuestro equipo en destino, una red propia de hoteles, riads y campamentos de lujo, y vehículos 4x4 con conductor-guía bereber.",
          "Nuestra propuesta para descubrir Marruecos de norte a sur se articula en cuatro grandes travesías que combinan ciudades imperiales, bosques de cedros, gargantas, kasbahs y noches en el desierto.",
        ],
        en: [
          "Morocco is a country of infinite contrasts. Within a few hundred kilometres you move from the Mediterranean to the Sahara, from the Atlas snow to the palm grove, from Chefchaouen blue to Marrakech red.",
          "At Xaluca Tours we specialise in tailor-made tours across the country. We design every trip from Barcelona with our on-the-ground team, a private network of hotels, riads and luxury camps, and 4x4 vehicles with a Berber driver-guide.",
          "Our north-to-south Morocco programme unfolds in four great crossings that combine imperial cities, cedar forests, gorges, kasbahs and nights in the desert.",
        ],
        fr: [
          "Le Maroc est un pays aux contrastes infinis. En quelques centaines de kilomètres, on passe de la Méditerranée au Sahara, de la neige de l'Atlas à la palmeraie, du bleu de Chefchaouen au rouge de Marrakech.",
          "Chez Xaluca Tours, nous sommes spécialistes des voyages sur mesure dans tout le pays. Nous concevons chaque circuit depuis Barcelone avec notre équipe sur place, un réseau propre d'hôtels, de riads et de bivouacs de luxe et des véhicules 4x4 avec chauffeur-guide berbère.",
          "Notre programme pour découvrir le Maroc du nord au sud se décline en quatre grandes traversées mêlant cités impériales, forêts de cèdres, gorges, kasbahs et nuits au désert.",
        ],
      },
    },
    why: {
      overline: "Reasons to travel with Xaluca Tours",
      title: "Four reasons that make the difference.",
      body: "Personal attention, 100% tailor-made trips, top-tier quality and the Grup Xaluca guarantee: a private network of hotels, riads and camps across Morocco.",
    },
    catalog: {
      overline: "Discover all our circuits",
      title: "The most authentic Morocco awaits.",
      body: "Beyond the four great crossings, explore all our journeys, routes and experiences designed to uncover the desert, the mountains, the kasbahs and the imperial cities.",
      cta: "See all circuits",
    },
    community: {
      overline: "Online advice & appointments",
      title: "Design your journey with us.",
      subtitle: "Real-time online advice or visit us at our Barcelona offices.",
      body: "Plan your next Moroccan crossing and resolve every doubt with our team. We'll help you design the itinerary that best fits your dates, pace and interests.",
      phone_label: "Phone", email_label: "Email", hours_label: "Hours",
      hours_value: "Mon – Fri · 10:00 – 20:00",
      cta_primary: "Get in touch",
    },
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
    block: { cta_request: "Voir les options", cta_info: "Plus d'infos", variants_overline: "Options de voyage" },
    intro: {
      id: "intro-marruecos",
      image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      eyebrow: { es: "Xaluca Tours · Especialistas en Marruecos", en: "Xaluca Tours · Morocco specialists", fr: "Xaluca Tours · Spécialistes du Maroc" },
      title: { es: "Marruecos, de norte a sur.", en: "Morocco, north to south.", fr: "Le Maroc, du nord au sud." },
      body: {
        es: [
          "Marruecos es un país de contrastes infinitos. En unos pocos cientos de kilómetros se pasa del Mediterráneo al Sahara, de la nieve del Atlas al palmeral, del azul de Chefchaouen al rojo de Marrakech.",
          "En Xaluca Tours somos especialistas en circuitos a medida por todo el país. Diseñamos cada viaje desde Barcelona con nuestro equipo en destino, una red propia de hoteles, riads y campamentos de lujo, y vehículos 4x4 con conductor-guía bereber.",
          "Nuestra propuesta para descubrir Marruecos de norte a sur se articula en cuatro grandes travesías que combinan ciudades imperiales, bosques de cedros, gargantas, kasbahs y noches en el desierto.",
        ],
        en: [
          "Morocco is a country of infinite contrasts. Within a few hundred kilometres you move from the Mediterranean to the Sahara, from the Atlas snow to the palm grove, from Chefchaouen blue to Marrakech red.",
          "At Xaluca Tours we specialise in tailor-made tours across the country. We design every trip from Barcelona with our on-the-ground team, a private network of hotels, riads and luxury camps, and 4x4 vehicles with a Berber driver-guide.",
          "Our north-to-south Morocco programme unfolds in four great crossings that combine imperial cities, cedar forests, gorges, kasbahs and nights in the desert.",
        ],
        fr: [
          "Le Maroc est un pays aux contrastes infinis. En quelques centaines de kilomètres, on passe de la Méditerranée au Sahara, de la neige de l'Atlas à la palmeraie, du bleu de Chefchaouen au rouge de Marrakech.",
          "Chez Xaluca Tours, nous sommes spécialistes des voyages sur mesure dans tout le pays. Nous concevons chaque circuit depuis Barcelone avec notre équipe sur place, un réseau propre d'hôtels, de riads et de bivouacs de luxe et des véhicules 4x4 avec chauffeur-guide berbère.",
          "Notre programme pour découvrir le Maroc du nord au sud se décline en quatre grandes traversées mêlant cités impériales, forêts de cèdres, gorges, kasbahs et nuits au désert.",
        ],
      },
    },
    why: {
      overline: "Pourquoi voyager avec Xaluca Tours",
      title: "Quatre raisons qui font la différence.",
      body: "Attention personnalisée, voyages 100% sur mesure, qualité maximale assurée et la garantie Grup Xaluca : un réseau propre d'hôtels, de riads et de campements dans tout le Maroc.",
    },
    catalog: {
      overline: "Découvrez tous nos circuits",
      title: "Le Maroc le plus authentique vous attend.",
      body: "Au-delà des quatre grandes traversées, explorez tous nos voyages, itinéraires et expériences pour découvrir le désert, les montagnes, les kasbahs et les cités impériales.",
      cta: "Voir tous les circuits",
    },
    community: {
      overline: "Conseil en ligne & rendez-vous",
      title: "Concevez votre voyage avec nous.",
      subtitle: "Conseil en ligne en temps réel ou rendez-vous à nos bureaux de Barcelone.",
      body: "Planifiez votre prochaine traversée du Maroc et levez tous vos doutes avec notre équipe. Nous vous aiderons à concevoir l'itinéraire qui correspond à vos dates, votre rythme et vos centres d'intérêt.",
      phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
      hours_value: "Lun – Ven · 10h – 20h",
      cta_primary: "Nous contacter",
    },
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
    { id: "intro-marruecos", label: t.nav.intro || "Introducción" },
    { id: "itineraries", label: t.nav.itineraries },
    { id: "gran-sur-fez-marrakech",  label: t.nav.route1 },
    { id: "gran-sur-medio-atlas",    label: t.nav.route2 },
    { id: "alto-atlas-desierto-fez", label: t.nav.route3 },
    { id: "tanger-marrakech",        label: t.nav.route4 },
    { id: "why-xaluca", label: t.why.overline ? "Razones" : "Why" },
    { id: "community", label: t.nav.contact },
  ];

  // Each itinerary now exposes its own primary `hubLink` and a list of `variants`.
  // The ItineraryBlock will render variants and related hubs as clickable cards.

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
        secondaryHref="#community"
        scroll={t.hero.scroll}
        testid="marruecos-hero"
      />

      <StickyNav items={navItems} testid="marruecos-nav" />

      <EditorialBlock block={t.intro} lang={lang} />
      <VideoSection {...MARRUECOS_VIDEOS.intro} testid="marruecos-video-intro" />
      <SectionGallery {...MARRUECOS_GALLERIES[0]} testid="marruecos-gallery-intro" />

      <ItinerariesOverview itineraries={MARRUECOS_ITINERARIES} t={t.overview} lang={lang} />

      {MARRUECOS_ITINERARIES.map((it, i) => (
        <React.Fragment key={it.id}>
          <ItineraryBlock
            itinerary={it}
            index={i}
            lang={lang}
            t={t.block}
            ctaTarget={pathFor(lang, it.hubLink || "contact")}
          />
          {/* Per-itinerary themed testimonials */}
          {it.id === "gran-sur-fez-marrakech" && (
            <Testimonials
              variant="compact"
              themes={["fez", "imperial", "medina", "riad", "desert", "stars"]}
              limit={2}
              tone="cream"
              eyebrow={{ es: "De la medina de Fez al silencio del Sahara", en: "From Fez medina to Saharan silence", fr: "De la médina de Fès au silence saharien" }}
              testid="marruecos-testi-fez-rak"
            />
          )}
          {it.id === "gran-sur-medio-atlas" && (
            <Testimonials
              variant="compact"
              themes={["atlas", "berber-village", "gorges", "desert"]}
              limit={2}
              tone="sand"
              eyebrow={{ es: "Travesía del Atlas central", en: "Crossing the central Atlas", fr: "Traversée de l'Atlas central" }}
              testid="marruecos-testi-medio-atlas"
            />
          )}
          {it.id === "alto-atlas-desierto-fez" && (
            <Testimonials
              variant="compact"
              themes={["mgoun", "trekking", "atlas", "fez"]}
              limit={2}
              tone="sage"
              eyebrow={{ es: "Cumbres del Alto Atlas", en: "High Atlas summits", fr: "Sommets du Haut Atlas" }}
              testid="marruecos-testi-alto-atlas"
            />
          )}
          {it.id === "tanger-marrakech" && (
            <Testimonials
              variant="compact"
              themes={["tangier", "chefchaouen", "marrakech", "imperial"]}
              limit={2}
              tone="cream"
              eyebrow={{ es: "De Tánger a Marrakech", en: "From Tangier to Marrakech", fr: "De Tanger à Marrakech" }}
              testid="marruecos-testi-tanger-rak"
            />
          )}
        </React.Fragment>
      ))}

      <CtaBand t={t.cta} lang={lang} testid="marruecos-cta-band" />

      <WhyXaluca pillars={SUR_PILLARS} t={t.why} lang={lang} testid="marruecos-why" />

      <Testimonials
        themes={["marruecos", "general"]}
        limit={3}
        tone="sand"
        testid="marruecos-testimonials"
      />

      <CatalogTeaser
        t={t.catalog}
        lang={lang}
        image="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85"
        testid="marruecos-catalog"
      />

      <CommunityCta
        t={t.community}
        lang={lang}
        image="https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85"
        testid="marruecos-community"
      />

      <ContactForm />
    </div>
  );
}
