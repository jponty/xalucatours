import React, { useEffect } from "react";
import EditableImage from "@/components/EditableImage";
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
import Testimonials from "@/components/Testimonials";
import { SUR_GALLERIES } from "@/lib/sectionGalleries";
import VideoSection from "@/components/VideoSection";
import ToursRegionMap from "@/components/ToursRegionMap";

/* ----------------------------------------------------------------
   Sur de Marruecos — 3 immersive videos paired to the editorial
   sections. URLs are centralized here so the editor can swap them
   easily in the future.
---------------------------------------------------------------- */
const SUR_VIDEOS = {
  kasbahs: {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "La ruta de las mil kasbahs", en: "The thousand-kasbahs route", fr: "La route des mille kasbahs" },
    title: {
      es: "Fortalezas de adobe, oasis y carreteras del Atlas.",
      en: "Adobe fortresses, oases and Atlas roads.",
      fr: "Forteresses en pisé, oasis et routes de l'Atlas.",
    },
    caption: {
      es: "Tomas aéreas y escenas culturales auténticas del sur marroquí.",
      en: "Aerial shots and authentic cultural scenes from southern Morocco.",
      fr: "Vues aériennes et scènes culturelles authentiques du sud marocain.",
    },
  },
  desierto: {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "La puerta del desierto", en: "The gate of the desert", fr: "La porte du désert" },
    title: {
      es: "Las dunas de Merzouga al amanecer.",
      en: "The Merzouga dunes at sunrise.",
      fr: "Les dunes de Merzouga au lever du soleil.",
    },
    caption: {
      es: "Caminatas entre dunas, atardeceres infinitos y el silencio del Erg Chebbi.",
      en: "Walks through the dunes, endless sunsets and the silence of the Erg Chebbi.",
      fr: "Marches dans les dunes, couchers de soleil infinis et silence de l'Erg Chebbi.",
    },
  },
  ciudadDesierto: {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    poster: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
    eyebrow: { es: "Marrakech, el Alto Atlas y el Sahara", en: "Marrakech, the High Atlas and the Sahara", fr: "Marrakech, le Haut Atlas et le Sahara" },
    title: {
      es: "De los zocos a las dunas — un mismo viaje, tres mundos.",
      en: "From the souks to the dunes — one journey, three worlds.",
      fr: "Des souks aux dunes — un seul voyage, trois mondes.",
    },
    caption: {
      es: "Carreteras panorámicas del Atlas, campamentos bajo cielos estrellados y la energía de Marrakech.",
      en: "Atlas panoramic roads, camps under starry skies and the energy of Marrakech.",
      fr: "Routes panoramiques de l'Atlas, campements sous les étoiles et l'énergie de Marrakech.",
    },
  },
};

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
        secondaryHref={pathFor(lang, "appointment")}
        scroll={t.hero.scroll}
        testid="sur-hero"
      />

      <StickyNav items={navItems} testid="sur-nav" />

      {/* 1. Editorial opener: the route of a thousand kasbahs */}
      <EditorialBlock block={SUR_EDITORIAL[0]} lang={lang} />
      <VideoSection {...SUR_VIDEOS.kasbahs} testid="sur-video-kasbahs" />
      <SectionGallery {...SUR_GALLERIES[0]} testid="sur-gallery-kasbahs" />

      {/* 2. Itineraries overview (4 cards) */}
      <ItinerariesOverview itineraries={SUR_ITINERARIES} t={t.overview} lang={lang} />

      {/* 3. Itinerary 1: Ouarzazate -> Errachidia (links to Atlas+Desierto hub) */}
      <ItineraryBlock itinerary={SUR_ITINERARIES[0]} index={0} lang={lang} t={t.block} ctaTarget={pathFor(lang, "tourAtlasDesiertoHub")} />
      <HubOptionsPreview hub={HUB_ATLAS_DESIERTO} lang={lang} testid="sur-preview-atlas-desierto" />

      {/* Testimonials · Atlas + Desert · 2 cards */}
      <Testimonials
        variant="compact"
        themes={["atlas", "gorges", "berber-village"]}
        limit={2}
        tone="sand"
        eyebrow={{ es: "Voces de quienes han vivido el Atlas", en: "Voices from the Atlas", fr: "Voix de l'Atlas" }}
        testid="sur-testi-atlas"
      />

      {/* 4. Editorial: gate of the desert */}
      <EditorialBlock block={SUR_EDITORIAL[1]} lang={lang} />
      <VideoSection {...SUR_VIDEOS.desierto} testid="sur-video-desierto" />
      <SectionGallery {...SUR_GALLERIES[1]} testid="sur-gallery-desierto" />

      {/* 5. Itinerary 2: Marrakech -> Errachidia (links to Marrakech-Erg Chebbi hub) */}
      <ItineraryBlock itinerary={SUR_ITINERARIES[1]} index={1} lang={lang} t={t.block} ctaTarget={pathFor(lang, "tourMarrakechErgHub")} />
      <HubOptionsPreview hub={HUB_MARRAKECH_ERG} lang={lang} testid="sur-preview-marrakech-erg" />

      {/* Testimonials · Marrakech → Sahara · 2 cards */}
      <Testimonials
        variant="compact"
        themes={["desert", "dunes", "bivouac", "stars", "nomads"]}
        limit={2}
        tone="cream"
        eyebrow={{ es: "Una noche bajo las estrellas del Erg Chebbi", en: "A night under the Erg Chebbi stars", fr: "Une nuit sous les étoiles de l'Erg Chebbi" }}
        testid="sur-testi-desierto"
      />

      {/* 6. Editorial: Marrakech, Atlas & Sahara */}
      <EditorialBlock block={SUR_EDITORIAL[2]} lang={lang} />
      <VideoSection {...SUR_VIDEOS.ciudadDesierto} testid="sur-video-ciudad-desierto" />
      <SectionGallery {...SUR_GALLERIES[2]} testid="sur-gallery-atlas-sahara" />

      {/* 7. Itinerary 3: Marrakech loop (links to Marrakech-Erg Chebbi-Marrakech hub) */}
      <ItineraryBlock itinerary={SUR_ITINERARIES[2]} index={2} lang={lang} t={t.block} ctaTarget={pathFor(lang, "tourMarrakechLoopHub")} />
      <HubOptionsPreview hub={HUB_MARRAKECH_LOOP} lang={lang} testid="sur-preview-marrakech-loop" />

      {/* Testimonials · Marrakech medina + riads · 2 cards */}
      <Testimonials
        variant="compact"
        themes={["marrakech", "riad", "medina", "gastronomy"]}
        limit={2}
        tone="sage"
        eyebrow={{ es: "Marrakech vista desde dentro", en: "Marrakech from within", fr: "Marrakech vue de l'intérieur" }}
        testid="sur-testi-marrakech"
      />

      {/* 8. Editorial: Marrakech & Essaouira intro */}
      <EditorialBlock block={SUR_EDITORIAL[3]} lang={lang} />
      <SectionGallery {...SUR_GALLERIES[3]} testid="sur-gallery-essaouira" />

      {/* 9. Itinerary 4: Marrakech – Essaouira (links to Marrakech-Essaouira hub) */}
      <ItineraryBlock itinerary={SUR_ITINERARIES[3]} index={3} lang={lang} t={t.block} ctaTarget={pathFor(lang, "tourMarrakechEssHub")} />
      <HubOptionsPreview hub={HUB_MARRAKECH_ESSAOUIRA} lang={lang} testid="sur-preview-marrakech-essaouira" />

      {/* Testimonials · Essaouira & Atlantic coast · 2 cards */}
      <Testimonials
        variant="compact"
        themes={["essaouira", "coast"]}
        limit={2}
        tone="sand"
        eyebrow={{ es: "El viento atlántico de Essaouira", en: "Essaouira's Atlantic breeze", fr: "Le vent atlantique d'Essaouira" }}
        testid="sur-testi-essaouira"
      />

      {/* 9.5 More routes block: cross-link to less-prominent South hubs */}
      <section data-testid="sur-more-routes" className="bg-[#F2EBE1] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-10">
            <span className="overline">
              {{ es: "Otras rutas del sur", en: "Other South routes", fr: "Autres routes du Sud" }[lang]}
            </span>
            <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mt-4 text-[#2C2621] max-w-3xl">
              {{
                es: "Más formas de descubrir el Marruecos del sur.",
                en: "More ways to discover Southern Morocco.",
                fr: "D'autres façons de découvrir le sud du Maroc.",
              }[lang]}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                target: "tourDesiertoAtlasHub",
                image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
                eyebrow: { es: "Sentido inverso · Erg Chebbi → Atlas → Marrakech", en: "Reverse · Erg Chebbi → Atlas → Marrakech", fr: "Sens inverse · Erg Chebbi → Atlas → Marrakech" },
                title: { es: "Desierto y Alto Atlas hacia Marrakech.", en: "Desert and High Atlas towards Marrakech.", fr: "Désert et Haut Atlas vers Marrakech." },
                cta: { es: "Ver 3 itinerarios", en: "See 3 itineraries", fr: "Voir 3 itinéraires" },
              },
              {
                target: "tourErgChebbiMarrakechHub",
                image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1800&q=85",
                eyebrow: { es: "Sentido inverso · Erg Chebbi → Marrakech", en: "Reverse · Erg Chebbi → Marrakech", fr: "Sens inverse · Erg Chebbi → Marrakech" },
                title: { es: "Del Sáhara a la ciudad roja.", en: "From the Sahara to the red city.", fr: "Du Sahara à la ville rouge." },
                cta: { es: "Ver 4 itinerarios", en: "See 4 itineraries", fr: "Voir 4 itinéraires" },
              },
              {
                target: "tourErrAtlasFezHub",
                image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1800&q=85",
                eyebrow: { es: "Eje sur · Errachidia → Atlas → Fez", en: "Southern axis · Errachidia → Atlas → Fez", fr: "Axe sud · Errachidia → Atlas → Fès" },
                title: { es: "Del desierto a Fez por el Atlas.", en: "From the desert to Fez through the Atlas.", fr: "Du désert à Fès par l'Atlas." },
                cta: { es: "Ver itinerarios", en: "See itineraries", fr: "Voir itinéraires" },
              },
            ].map((card) => (
              <a
                key={card.target}
                href={pathFor(lang, card.target)}
                data-testid={`sur-more-${card.target}`}
                className="group relative block overflow-hidden h-[360px] md:h-[400px]"
              >
                <EditableImage
                  slot={`sur.more.${card.target}.image`}
                  fallback={card.image}
                  alt={card.title[lang]}
                  aspectRatio="16/10"
                  imgProps={{ loading: "lazy" }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/10 pointer-events-none" />
                <span className="film-grain" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#E8C5A3] mb-3">{card.eyebrow[lang]}</p>
                  <h3 className="font-serif-x text-xl md:text-2xl text-white leading-snug mb-4">{card.title[lang]}</h3>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-white border-b border-white/40 pb-1 group-hover:border-white transition-colors">
                    {card.cta[lang]}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Why Xaluca - 4 brand pillars */}
      <WhyXaluca pillars={SUR_PILLARS} t={t.why} lang={lang} testid="sur-why" />

      {/* 10.5 Testimonials — South-themed */}
      <Testimonials
        themes={["sur", "atlas", "desert"]}
        limit={3}
        tone="sand"
        testid="sur-testimonials"
      />

      {/* 11. Catalog teaser */}
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
        image="https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85"
        testid="sur-community"
      />

      <ToursRegionMap defaultZone="south" topPadClass="pt-20 md:pt-28" />

      <ContactForm />
    </div>
  );
}
