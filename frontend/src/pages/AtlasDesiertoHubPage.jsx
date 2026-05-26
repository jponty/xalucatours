import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Mountain, Sparkles, MapPin } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import {
  JourneyHero,
  StickyNav,
  EditorialBlock,
  CommunityCta,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";

/* ============================================================
   Six combined Atlas + Desert programmes
============================================================ */
const PROGRAMS = [
  { id: "ad-4-5",  routeId: "tourAtlasDesierto45", direction: "ad", nights: "4n / 5d",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1800&q=85",
    accent: "#5A6B4F" },
  { id: "ad-5-6",  routeId: "tourAtlasDesierto56", direction: "ad", nights: "5n / 6d",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
    accent: "#7C8B5C" },
  { id: "ad-6-7",  routeId: "tourAtlasDesierto67", direction: "ad", nights: "6n / 7d",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85",
    accent: "#A07042" },
  { id: "da-4-5",  routeId: "tourDesiertoAtlas45", direction: "da", nights: "4n / 5d",
    image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?auto=format&fit=crop&w=1800&q=85",
    accent: "#C16542" },
  { id: "da-5-6",  routeId: "tourDesiertoAtlas56", direction: "da", nights: "5n / 6d",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
    accent: "#D97742" },
  { id: "da-6-7",  routeId: "tourDesiertoAtlas67", direction: "da", nights: "6n / 7d",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=85",
    accent: "#D4A373" },
];

const DURATIONS = {
  "4n / 5d": { es: "4 noches / 5 días", en: "4 nights / 5 days", fr: "4 nuits / 5 jours" },
  "5n / 6d": { es: "5 noches / 6 días", en: "5 nights / 6 days", fr: "5 nuits / 6 jours" },
  "6n / 7d": { es: "6 noches / 7 días", en: "6 nights / 7 days", fr: "6 nuits / 7 jours" },
};

const COPY = {
  es: {
    docTitle: "Atlas + Desierto del Erg Chebbi · Xaluca Tours",
    hero: {
      eyebrow: "Viajes por Marruecos · Sur",
      place: "Atlas · Drâa-Tafilalet · Erg Chebbi",
      title: "Atlas marroquí + Desierto del Erg Chebbi.",
      subtitle: "Viajes por Marruecos descubriendo la cordillera del Atlas y el desierto de dunas del Erg Chebbi, en el Sahara.",
      intro: "Una escapada al desierto de dunas más cercano a Europa. La ruta combina montañas bereberes, valles, gargantas y la magia del Sahara.",
      primaryCta: "Ver opciones de viaje", secondaryCta: "Pedir asesoramiento", scroll: "Desplázate",
    },
    nav: { intro: "Atlas & Desierto", options: "Opciones", draa: "Drâa-Tafilalet", spirit: "Naturaleza", community: "Contacto" },
    intro: {
      overline: "Atlas marroquí + Desierto del Erg Chebbi",
      title: "Dos mundos, una sola travesía.",
      body: [
        "¿Quieres desconectar unos días y vivir una experiencia mágica? Te proponemos una escapada al desierto de dunas más cercano a Europa: el Erg Chebbi, en el sur de Marruecos.",
        "La ruta empieza en la cordillera del Alto Atlas. En vehículo 4x4 con chófer recorreremos poblados Imazighen donde el tiempo parece haberse detenido. Atravesaremos valles y gargantas hasta llegar a la «puerta del desierto», donde la magia del lugar nos envolverá.",
        "Las tradiciones ancestrales de sus gentes, sus mercados, sus colores y una noche bajo las estrellas convertirán estos días en un viaje inolvidable.",
      ],
    },
    options: {
      overline: "Opciones de viaje combinado",
      title: "Elige tu travesía Atlas + Desierto.",
      body: "Seis programas diseñados según los días disponibles y la dirección preferida — del Atlas al Sahara o del Sahara al Atlas.",
      cta: "Ver programa completo",
      group_ad: { es: "Atlas + Desierto", en: "Atlas + Desert", fr: "Atlas + Désert" },
      group_da: { es: "Desierto + Atlas", en: "Desert + Atlas", fr: "Désert + Atlas" },
    },
    spirit: {
      overline: "Naturaleza, cultura y aventura",
      title: "Para quienes buscan otra forma de viajar.",
      body: "Antiguas rutas caravaneras, pueblos tradicionales, mercados locales, oasis, gargantas, kasbahs y paisajes saharianos. Ideal para viajeros que buscan historia, cultura, desierto, montaña, aventura, viajes en 4x4, experiencias auténticas y noches bajo las estrellas.",
      tags: ["Historia", "Cultura", "Desierto", "Montaña", "Aventura", "4x4", "Experiencias auténticas", "Noches bajo las estrellas"],
    },
    community: {
      overline: "¿Te interesa este viaje por Marruecos?",
      title: "Empieza a planificar tu próxima aventura.",
      subtitle: "Asesoramiento online en tiempo real o ven a visitarnos a nuestras oficinas.",
      body: "Contacta sin compromiso con el equipo de Xaluca Tours para planificar los detalles de tu próxima aventura.",
      phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
      hours_value: "Lun – Vie · 10h – 20h",
      cta_primary: "Contactar ahora",
    },
  },
  en: {
    docTitle: "Atlas + Erg Chebbi desert · Xaluca Tours",
    hero: {
      eyebrow: "Morocco journeys · South",
      place: "Atlas · Drâa-Tafilalet · Erg Chebbi",
      title: "Moroccan Atlas + Erg Chebbi desert.",
      subtitle: "Journeys across Morocco discovering the Atlas range and the dune desert of the Erg Chebbi, in the Sahara.",
      intro: "An escape to the closest dune desert to Europe. The route blends Berber mountains, valleys, gorges and the magic of the Sahara.",
      primaryCta: "View travel options", secondaryCta: "Get advice", scroll: "Scroll",
    },
    nav: { intro: "Atlas & Desert", options: "Options", draa: "Drâa-Tafilalet", spirit: "Nature", community: "Contact" },
    intro: {
      overline: "Moroccan Atlas + Erg Chebbi desert",
      title: "Two worlds, one crossing.",
      body: [
        "Want to disconnect for a few days and live something truly magical? We propose an escape to the closest dune desert to Europe: the Erg Chebbi, in southern Morocco.",
        "The route starts in the High Atlas range. A 4x4 with private driver takes us through Imazighen villages frozen in time. We cross valleys and gorges all the way to the «gate of the desert», where the magic of the place wraps us in.",
        "The ancestral traditions of its people, their markets, their colours and a night under the stars turn these days into an unforgettable journey.",
      ],
    },
    options: {
      overline: "Combined journey options",
      title: "Choose your Atlas + Desert crossing.",
      body: "Six programmes designed for your available days and preferred direction — Atlas to Sahara or Sahara to Atlas.",
      cta: "See full programme",
      group_ad: { es: "Atlas + Desierto", en: "Atlas + Desert", fr: "Atlas + Désert" },
      group_da: { es: "Desierto + Atlas", en: "Desert + Atlas", fr: "Désert + Atlas" },
    },
    spirit: {
      overline: "Nature, culture and adventure",
      title: "For those who travel differently.",
      body: "Ancient caravan routes, traditional villages, local markets, oases, gorges, kasbahs and Saharan landscapes. Ideal for travellers seeking history, culture, desert, mountain, adventure, 4x4 trips, authentic experiences and nights under the stars.",
      tags: ["History", "Culture", "Desert", "Mountain", "Adventure", "4x4", "Authentic experiences", "Nights under the stars"],
    },
    community: {
      overline: "Interested in this Moroccan journey?",
      title: "Start planning your next adventure.",
      subtitle: "Real-time online advice or visit us at our offices.",
      body: "Reach out — no commitment — to the Xaluca Tours team to start planning the details of your next adventure.",
      phone_label: "Phone", email_label: "Email", hours_label: "Hours",
      hours_value: "Mon – Fri · 10:00 – 20:00",
      cta_primary: "Get in touch",
    },
  },
  fr: {
    docTitle: "Atlas + Désert de l'Erg Chebbi · Xaluca Tours",
    hero: {
      eyebrow: "Voyages au Maroc · Sud",
      place: "Atlas · Drâa-Tafilalet · Erg Chebbi",
      title: "Atlas marocain + Désert de l'Erg Chebbi.",
      subtitle: "Voyages au Maroc à la découverte de l'Atlas et du désert de dunes de l'Erg Chebbi, dans le Sahara.",
      intro: "Une escapade vers le désert de dunes le plus proche de l'Europe. L'itinéraire mêle montagnes berbères, vallées, gorges et la magie du Sahara.",
      primaryCta: "Voir les options de voyage", secondaryCta: "Demander conseil", scroll: "Faites défiler",
    },
    nav: { intro: "Atlas & Désert", options: "Options", draa: "Drâa-Tafilalet", spirit: "Nature", community: "Contact" },
    intro: {
      overline: "Atlas marocain + Désert de l'Erg Chebbi",
      title: "Deux mondes, une traversée.",
      body: [
        "Envie de déconnecter quelques jours et vivre une expérience magique ? Nous vous proposons une escapade vers le désert de dunes le plus proche de l'Europe : l'Erg Chebbi, au sud du Maroc.",
        "L'itinéraire débute dans la cordillère du Haut Atlas. En 4x4 avec chauffeur, nous parcourons des villages imazighen figés dans le temps. Nous traversons vallées et gorges jusqu'à la « porte du désert », où la magie du lieu nous enveloppe.",
        "Les traditions ancestrales de ses habitants, ses marchés, ses couleurs et une nuit sous les étoiles transforment ces journées en un voyage inoubliable.",
      ],
    },
    options: {
      overline: "Options de voyage combiné",
      title: "Choisissez votre traversée Atlas + Désert.",
      body: "Six programmes conçus selon vos jours disponibles et la direction préférée — de l'Atlas au Sahara ou du Sahara à l'Atlas.",
      cta: "Voir le programme complet",
      group_ad: { es: "Atlas + Desierto", en: "Atlas + Desert", fr: "Atlas + Désert" },
      group_da: { es: "Desierto + Atlas", en: "Desert + Atlas", fr: "Désert + Atlas" },
    },
    spirit: {
      overline: "Nature, culture et aventure",
      title: "Pour ceux qui voyagent autrement.",
      body: "Anciennes routes caravanières, villages traditionnels, marchés locaux, oasis, gorges, kasbahs et paysages sahariens. Idéal pour les voyageurs en quête d'histoire, de culture, de désert, de montagne, d'aventure, de 4x4, d'expériences authentiques et de nuits sous les étoiles.",
      tags: ["Histoire", "Culture", "Désert", "Montagne", "Aventure", "4x4", "Expériences authentiques", "Nuits sous les étoiles"],
    },
    community: {
      overline: "Ce voyage au Maroc vous intéresse ?",
      title: "Commencez à planifier votre prochaine aventure.",
      subtitle: "Conseil en ligne en temps réel ou rendez-vous à nos bureaux.",
      body: "Contactez sans engagement l'équipe Xaluca Tours pour planifier les détails de votre prochaine aventure.",
      phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
      hours_value: "Lun – Ven · 10h – 20h",
      cta_primary: "Nous contacter",
    },
  },
};

/* ============================================================
   Drâa-Tafilalet editorial block
============================================================ */
const DRAA_BLOCK = {
  id: "draa",
  image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2200&q=85",
  eyebrow: { es: "La región", en: "The region", fr: "La région" },
  title: { es: "La región de Drâa-Tafilalet", en: "The Drâa-Tafilalet region", fr: "La région du Drâa-Tafilalet" },
  body: {
    es: [
      "La región de Drâa-Tafilalet es una tierra de contrastes. Desde las montañas del Atlas hasta las dunas del Sahara, esta zona del sur de Marruecos ofrece paisajes únicos, historia, cultura y aventura.",
      "Es una región marcada por la convivencia de culturas bereberes, árabes y francesas, con una gran riqueza patrimonial y natural.",
      "Aquí se encuentran algunos de los paisajes más espectaculares del país: oasis, palmerales, valles, montañas, antiguas kasbahs y el gran desierto del Erg Chebbi.",
    ],
    en: [
      "Drâa-Tafilalet is a land of contrasts. From the Atlas mountains to the dunes of the Sahara, this region of southern Morocco offers unique landscapes, history, culture and adventure.",
      "It is a region shaped by Berber, Arab and French cultural layers, with rich heritage and nature.",
      "Some of the country's most spectacular landscapes lie here: oases, palm groves, valleys, mountains, ancient kasbahs and the great Erg Chebbi desert.",
    ],
    fr: [
      "Le Drâa-Tafilalet est une terre de contrastes. Des montagnes de l'Atlas aux dunes du Sahara, cette région du sud du Maroc offre paysages uniques, histoire, culture et aventure.",
      "C'est une région façonnée par la cohabitation des cultures berbères, arabes et françaises, riche en patrimoine et en nature.",
      "On y trouve certains des paysages les plus spectaculaires du pays : oasis, palmeraies, vallées, montagnes, anciennes kasbahs et le grand désert de l'Erg Chebbi.",
    ],
  },
};

/* ============================================================
   Programmes grid section
============================================================ */
const ProgramsGrid = ({ t, lang }) => {
  const groups = [
    { id: "ad", label: pick(t.group_ad, lang), items: PROGRAMS.filter((p) => p.direction === "ad") },
    { id: "da", label: pick(t.group_da, lang), items: PROGRAMS.filter((p) => p.direction === "da") },
  ];
  return (
    <section id="options" data-testid="atlas-desierto-hub-options"
             className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
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

        {groups.map((g) => (
          <div key={g.id} className="mb-14 last:mb-0">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-serif-x text-2xl md:text-3xl text-[#2C2621]">{g.label}</span>
              <span className="flex-1 h-px bg-[#2C2621]/15" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {g.items.map((p) => (
                <Link
                  key={p.id}
                  to={pathFor(lang, p.routeId)}
                  data-testid={`hub-program-${p.id}`}
                  className="group relative block overflow-hidden h-[440px]"
                >
                  <img src={p.image} alt="" loading="lazy"
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/50 to-[#1A1513]/10" />
                  <span className="film-grain" />
                  <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end text-[#FDFBF7]">
                    <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: p.accent }}>
                      {g.label}
                    </span>
                    <h3 className="font-serif-x text-2xl md:text-[30px] leading-[1.05] mt-3 inline-flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#D4A373]" strokeWidth={1.4} />
                      {pick(DURATIONS[p.nights], lang)}
                    </h3>
                    <span className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#D4A373] group-hover:gap-4 transition-all duration-300">
                      {t.cta}<ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============================================================
   Spirit / tags section
============================================================ */
const SpiritSection = ({ t }) => (
  <section id="spirit" data-testid="atlas-desierto-hub-spirit"
           className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />
    <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
      <span className="overline text-[#D4A373]">{t.overline}</span>
      <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5">
        {t.title}
      </h2>
      <p className="mt-8 text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed max-w-3xl mx-auto">
        {t.body}
      </p>
      <ul className="mt-12 flex flex-wrap justify-center gap-2">
        {t.tags.map((tag, i) => (
          <li key={i} className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 border border-[#D4A373]/50 text-[#D4A373]">
            {tag}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ============================================================
   Page
============================================================ */
export default function AtlasDesiertoHubPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  const navItems = [
    { id: "intro",    label: t.nav.intro },
    { id: "options",  label: t.nav.options },
    { id: "draa",     label: t.nav.draa },
    { id: "spirit",   label: t.nav.spirit },
    { id: "community",label: t.nav.community },
  ];

  return (
    <div data-testid="atlas-desierto-hub-page">
      <JourneyHero
        image="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=85"
        eyebrow={t.hero.eyebrow}
        place={t.hero.place}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        intro={t.hero.intro}
        primaryCta={t.hero.primaryCta}
        primaryHref="#options"
        secondaryCta={t.hero.secondaryCta}
        secondaryHref="#community"
        scroll={t.hero.scroll}
        testid="hub-hero"
      />

      <StickyNav items={navItems} testid="hub-nav" />

      {/* Editorial intro */}
      <section id="intro" data-testid="atlas-desierto-hub-intro"
               className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
          <span className="overline">{t.intro.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.intro.title}
          </h2>
          <div className="mt-8 space-y-5 text-[15px] md:text-base text-[#5C5248] leading-[1.85]">
            {t.intro.body.map((p, i) => (
              <p key={i} className={i === 0 ? "font-serif-x-italic text-xl md:text-2xl text-[#C16542]" : ""}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <ProgramsGrid t={t.options} lang={lang} />

      <EditorialBlock block={DRAA_BLOCK} lang={lang} />

      <SpiritSection t={t.spirit} />

      <CommunityCta
        t={t.community}
        lang={lang}
        image="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=85"
        testid="hub-community"
      />

      <ContactForm />
    </div>
  );
}
