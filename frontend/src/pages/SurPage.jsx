import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { SUR_ITINERARIES, SUR_EDITORIAL, SUR_PILLARS } from "@/lib/surItineraries";
import {
  HUB_ATLAS_DESIERTO,
  HUB_MARRAKECH_ERG,
  HUB_MARRAKECH_LOOP,
  HUB_MARRAKECH_ESSAOUIRA,
} from "@/lib/itineraryHubs";
import {
  JourneyHero,
  StickyNav,
  ItinerariesOverview,
  ItineraryBlock,
  EditorialBlock,
  WhyXaluca,
  CatalogTeaser,
  CommunityCta,
  HubOptionsPreview,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";
import SectionGallery from "@/components/SectionGallery";
import BerberDivider from "@/components/BerberDivider";
import { SUR_GALLERIES } from "@/lib/sectionGalleries";

/* ============================================================
   Trilingual copy for /viajes/surdemarruecos
============================================================ */
const COPY = {
  es: {
    docTitle: "Viajes por el Sur de Marruecos · Xaluca Tours",
    hero: {
      eyebrow: "Viajes por el Sur de Marruecos",
      place: "Atlas · Merzouga · Erg Chebbi",
      title: "Sur de Marruecos.",
      subtitle: "Desierto, kasbahs, oasis y pueblos tradicionales del Sahara — la travesía más auténtica del país.",
      intro: "Cuatro circuitos cinematográficos por la ruta de las mil kasbahs, el Alto Atlas y las dunas del Erg Chebbi.",
      primaryCta: "Ver circuitos", secondaryCta: "Pedir asesoramiento", scroll: "Desplázate",
    },
    nav: {
      kasbahs: "Mil kasbahs",
      itineraries: "Circuitos",
      route1: "Ouarzazate · Erg Chebbi",
      puerta: "Puerta del desierto",
      route2: "Marrakech · Erg Chebbi",
      atlas: "Atlas & Sahara",
      route3: "Marrakech circular",
      essaouira: "Marrakech & Essaouira",
      route4: "Marrakech · Essaouira",
      why: "Por qué Xaluca",
      community: "Contacto",
    },
    overview: {
      overline: "Cuatro circuitos", title: "Elige tu travesía por el sur.",
      body: "Del Alto Atlas a las dunas del Erg Chebbi, pasando por el Atlántico de Essaouira — cuatro circuitos diseñados para descubrir el alma del sur de Marruecos.",
      cta: "Ver circuito",
    },
    block: { cta_request: "Ver opciones de viaje", cta_info: "Más información" },
    why: {
      overline: "Razones para viajar con Xaluca Tours",
      title: "Cuatro razones que marcan la diferencia.",
      body: "Atención personalizada, viajes 100% a medida, máxima calidad asegurada y la garantía Grup Xaluca: una red propia de hoteles y campamentos en el sur de Marruecos.",
    },
    catalog: {
      overline: "Descubre todos nuestros circuitos",
      title: "El Marruecos más auténtico te espera.",
      body: "Explora nuestros viajes, rutas y experiencias diseñadas para descubrir el desierto, las montañas, las kasbahs y las ciudades imperiales.",
      cta: "Ver todos los circuitos",
    },
    community: {
      overline: "Únete a nuestra comunidad de aventureros",
      title: "¿Tienes preguntas?",
      subtitle: "Asesoramiento online en tiempo real o ven a visitarnos a nuestras oficinas.",
      body: "Planifica tu próxima aventura por Marruecos y resuelve todas tus dudas directamente con nuestros agentes especializados, quienes te ayudarán a diseñar la experiencia que mejor se adapte a ti.",
      phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
      hours_value: "Lun – Vie · 10h – 20h",
      cta_primary: "Contactar ahora",
    },
  },
  en: {
    docTitle: "Southern Morocco journeys · Xaluca Tours",
    hero: {
      eyebrow: "Southern Morocco journeys",
      place: "Atlas · Merzouga · Erg Chebbi",
      title: "Southern Morocco.",
      subtitle: "Desert, kasbahs, oases and traditional villages of the Sahara — the country's most authentic crossing.",
      intro: "Four cinematic itineraries along the route of a thousand kasbahs, the High Atlas and the Erg Chebbi dunes.",
      primaryCta: "View circuits", secondaryCta: "Get advice", scroll: "Scroll",
    },
    nav: {
      kasbahs: "Thousand kasbahs",
      itineraries: "Circuits",
      route1: "Ouarzazate · Erg Chebbi",
      puerta: "Gate of the desert",
      route2: "Marrakech · Erg Chebbi",
      atlas: "Atlas & Sahara",
      route3: "Marrakech loop",
      essaouira: "Marrakech & Essaouira",
      route4: "Marrakech · Essaouira",
      why: "Why Xaluca",
      community: "Contact",
    },
    overview: {
      overline: "Four circuits", title: "Choose your southern crossing.",
      body: "From the High Atlas to the Erg Chebbi dunes, by way of Essaouira's Atlantic — four circuits to discover the soul of southern Morocco.",
      cta: "See circuit",
    },
    block: { cta_request: "View travel options", cta_info: "More info" },
    why: {
      overline: "Reasons to travel with Xaluca Tours",
      title: "Four reasons that make the difference.",
      body: "Personal attention, 100% tailor-made trips, top-tier quality and the Grup Xaluca guarantee: a private network of hotels and camps across southern Morocco.",
    },
    catalog: {
      overline: "Discover all our circuits",
      title: "The most authentic Morocco awaits.",
      body: "Explore our journeys, routes and experiences crafted to uncover the desert, the mountains, the kasbahs and the imperial cities.",
      cta: "See all circuits",
    },
    community: {
      overline: "Join our community of adventurers",
      title: "Any questions?",
      subtitle: "Real-time online advice or visit us at our offices.",
      body: "Plan your next Moroccan adventure and resolve every doubt with our specialised agents — they'll help you design the experience that suits you best.",
      phone_label: "Phone", email_label: "Email", hours_label: "Hours",
      hours_value: "Mon – Fri · 10:00 – 20:00",
      cta_primary: "Get in touch",
    },
  },
  fr: {
    docTitle: "Voyages au Sud du Maroc · Xaluca Tours",
    hero: {
      eyebrow: "Voyages au Sud du Maroc",
      place: "Atlas · Merzouga · Erg Chebbi",
      title: "Sud du Maroc.",
      subtitle: "Désert, kasbahs, oasis et villages traditionnels du Sahara — la traversée la plus authentique du pays.",
      intro: "Quatre itinéraires cinématographiques le long de la route des mille kasbahs, du Haut Atlas et des dunes de l'Erg Chebbi.",
      primaryCta: "Voir les circuits", secondaryCta: "Demander conseil", scroll: "Faites défiler",
    },
    nav: {
      kasbahs: "Mille kasbahs",
      itineraries: "Circuits",
      route1: "Ouarzazate · Erg Chebbi",
      puerta: "Porte du désert",
      route2: "Marrakech · Erg Chebbi",
      atlas: "Atlas & Sahara",
      route3: "Boucle Marrakech",
      essaouira: "Marrakech & Essaouira",
      route4: "Marrakech · Essaouira",
      why: "Pourquoi Xaluca",
      community: "Contact",
    },
    overview: {
      overline: "Quatre circuits", title: "Choisissez votre traversée du sud.",
      body: "Du Haut Atlas aux dunes de l'Erg Chebbi, en passant par l'Atlantique d'Essaouira — quatre circuits pour découvrir l'âme du sud du Maroc.",
      cta: "Voir le circuit",
    },
    block: { cta_request: "Voir les options", cta_info: "Plus d'infos" },
    why: {
      overline: "Pourquoi voyager avec Xaluca Tours",
      title: "Quatre raisons qui font la différence.",
      body: "Attention personnalisée, voyages 100% sur mesure, qualité maximale assurée et la garantie Grup Xaluca : un réseau propre d'hôtels et de campements dans le sud du Maroc.",
    },
    catalog: {
      overline: "Découvrez tous nos circuits",
      title: "Le Maroc le plus authentique vous attend.",
      body: "Explorez nos voyages, itinéraires et expériences conçus pour découvrir le désert, les montagnes, les kasbahs et les cités impériales.",
      cta: "Voir tous les circuits",
    },
    community: {
      overline: "Rejoignez notre communauté d'aventuriers",
      title: "Des questions ?",
      subtitle: "Conseil en ligne en temps réel ou rendez-vous à nos bureaux.",
      body: "Planifiez votre prochaine aventure au Maroc et levez tous vos doutes avec nos agents spécialisés — ils vous aideront à concevoir l'expérience qui vous correspond.",
      phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
      hours_value: "Lun – Ven · 10h – 20h",
      cta_primary: "Nous contacter",
    },
  },
};

export default function SurPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  const navItems = [
    { id: "mil-kasbahs",                     label: t.nav.kasbahs },
    { id: "itineraries",                     label: t.nav.itineraries },
    { id: "ouarzazate-erg-chebbi",           label: t.nav.route1 },
    { id: "puerta-del-desierto",             label: t.nav.puerta },
    { id: "marrakech-erg-chebbi-errachidia", label: t.nav.route2 },
    { id: "marrakech-atlas-sahara",          label: t.nav.atlas },
    { id: "marrakech-erg-chebbi-marrakech",  label: t.nav.route3 },
    { id: "marrakech-essaouira-intro",       label: t.nav.essaouira },
    { id: "marrakech-essaouira",             label: t.nav.route4 },
    { id: "why-xaluca",                      label: t.nav.why },
    { id: "community",                       label: t.nav.community },
  ];

  return (
    <div data-testid="sur-page">
      <JourneyHero
        image="https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85"
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
        testid="sur-hero"
      />

      <StickyNav items={navItems} testid="sur-nav" />

      {/* 1. Editorial opener: the route of a thousand kasbahs */}
      <EditorialBlock block={SUR_EDITORIAL[0]} lang={lang} />
      <SectionGallery {...SUR_GALLERIES[0]} testid="sur-gallery-kasbahs" />
      <BerberDivider variant="zellige" tone="cream" color="#A07042" />

      {/* 2. Itineraries overview (4 cards) */}
      <ItinerariesOverview itineraries={SUR_ITINERARIES} t={t.overview} lang={lang} />

      {/* 3. Itinerary 1: Ouarzazate -> Errachidia (links to Atlas+Desierto hub) */}
      <ItineraryBlock itinerary={SUR_ITINERARIES[0]} index={0} lang={lang} t={t.block} ctaTarget={pathFor(lang, "tourAtlasDesiertoHub")} />
      <HubOptionsPreview hub={HUB_ATLAS_DESIERTO} lang={lang} testid="sur-preview-atlas-desierto" />

      {/* 4. Editorial: gate of the desert */}
      <EditorialBlock block={SUR_EDITORIAL[1]} lang={lang} />
      <SectionGallery {...SUR_GALLERIES[1]} testid="sur-gallery-desierto" />
      <BerberDivider variant="berber" tone="cream" color="#A07042" />

      {/* 5. Itinerary 2: Marrakech -> Errachidia (links to Marrakech-Erg Chebbi hub) */}
      <ItineraryBlock itinerary={SUR_ITINERARIES[1]} index={1} lang={lang} t={t.block} ctaTarget={pathFor(lang, "tourMarrakechErgHub")} />
      <HubOptionsPreview hub={HUB_MARRAKECH_ERG} lang={lang} testid="sur-preview-marrakech-erg" />

      {/* 6. Editorial: Marrakech, Atlas & Sahara */}
      <EditorialBlock block={SUR_EDITORIAL[2]} lang={lang} />
      <SectionGallery {...SUR_GALLERIES[2]} testid="sur-gallery-atlas-sahara" />
      <BerberDivider variant="nomadic" tone="paper" color="#A07042" label="Atlas · Sáhara" />

      {/* 7. Itinerary 3: Marrakech loop (links to Marrakech-Erg Chebbi-Marrakech hub) */}
      <ItineraryBlock itinerary={SUR_ITINERARIES[2]} index={2} lang={lang} t={t.block} ctaTarget={pathFor(lang, "tourMarrakechLoopHub")} />
      <HubOptionsPreview hub={HUB_MARRAKECH_LOOP} lang={lang} testid="sur-preview-marrakech-loop" />

      {/* 8. Editorial: Marrakech & Essaouira intro */}
      <EditorialBlock block={SUR_EDITORIAL[3]} lang={lang} />
      <SectionGallery {...SUR_GALLERIES[3]} testid="sur-gallery-essaouira" />

      {/* 9. Itinerary 4: Marrakech – Essaouira (links to Marrakech-Essaouira hub) */}
      <ItineraryBlock itinerary={SUR_ITINERARIES[3]} index={3} lang={lang} t={t.block} ctaTarget={pathFor(lang, "tourMarrakechEssHub")} />
      <HubOptionsPreview hub={HUB_MARRAKECH_ESSAOUIRA} lang={lang} testid="sur-preview-marrakech-essaouira" />
      {/* 10. Why Xaluca - 4 brand pillars */}
      <WhyXaluca pillars={SUR_PILLARS} t={t.why} lang={lang} testid="sur-why" />

      {/* 11. Catalog teaser */}
      <BerberDivider variant="zellige" tone="cream" color="#A07042" />
      <CatalogTeaser
        t={t.catalog}
        lang={lang}
        image="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85"
        testid="sur-catalog"
      />

      {/* 12. Community CTA */}
      <CommunityCta
        t={t.community}
        lang={lang}
        image="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=85"
        testid="sur-community"
      />

      <ContactForm />
    </div>
  );
}
