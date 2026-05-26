import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Compass, Mountain, Bike, Sparkles, MapPin, Calendar,
  Phone, MessageCircle, Mail, Building2, ChevronDown,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import ContactForm from "@/components/ContactForm";

/* ============================================================
   Section 1 — Hero
============================================================ */
const Hero = ({ t }) => (
  <section
    data-testid="viajes-hero"
    className="relative h-[100svh] min-h-[660px] w-full overflow-hidden bg-[#1A1513]"
  >
    <img
      src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=85"
      alt=""
      loading="eager"
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/35" />
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />

    <div className="relative z-10 h-full flex flex-col">
      <div className="flex-1 flex items-end pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">
                {t.eyebrow}
              </span>
              <span className="w-8 h-px bg-[#D4A373]/50" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80">
                {t.eyebrow_place}
              </span>
            </div>

            <h1 className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6">
              {t.title}
            </h1>

            <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed">
              {t.subtitle}
            </p>

            <p className="fade-up fade-up-delay-3 mt-4 max-w-2xl text-sm md:text-base text-[#FDFBF7]/65 leading-relaxed">
              {t.intro}
            </p>

            <div className="fade-up fade-up-delay-4 mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#categorias"
                data-testid="viajes-hero-cta-primary"
                className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
              >
                {t.cta_primary}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </a>
              <a
                href="#proximas"
                data-testid="viajes-hero-cta-secondary"
                className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
              >
                {t.cta_secondary}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#intro-viajes"
        data-testid="viajes-scroll-indicator"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 text-[#FDFBF7]/65 hover:text-[#D4A373] transition-colors"
      >
        <span className="text-[10px] tracking-[0.35em] uppercase">{t.scroll}</span>
        <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={1.5} />
      </a>
    </div>
  </section>
);

/* ============================================================
   Section 2 — Editorial intro
============================================================ */
const EditorialIntro = ({ t }) => (
  <section
    id="intro-viajes"
    data-testid="viajes-intro"
    className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
  >
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="md:col-span-5 relative aspect-[4/5] overflow-hidden bg-[#F2EBE1]">
          <img
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=85"
            alt=""
            loading="lazy"
            className="ken-burns absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1513]/35 via-transparent to-transparent" />
        </div>

        <div className="md:col-span-7">
          <span className="overline">{t.eyebrow}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.title}
          </h2>
          <div className="mt-8 space-y-5 text-base md:text-lg leading-relaxed text-[#5C5248] max-w-2xl">
            <p className="font-serif-x-italic text-xl md:text-2xl text-[#2C2621] leading-[1.4]">
              {t.p1}
            </p>
            <p>{t.p2}</p>
            <p>{t.p3}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ============================================================
   Section 3 — Aventura cards
============================================================ */
const Aventura = ({ t, lang }) => {
  const CARDS = [
    {
      icon: Bike,
      accent: "#C16542",
      image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85",
      title: { es: "Enduro por el Sáhara", en: "Sahara enduro", fr: "Enduro au Sahara" },
      body: { es: "Expediciones de varios días por las dunas y pistas del sur. Grupos reducidos, soporte mecánico y bivouacs de noche.",
              en: "Multi-day expeditions across southern dunes and tracks. Small groups, mechanical support, bivouac nights.",
              fr: "Expéditions de plusieurs jours sur les dunes et pistes du sud. Petits groupes, soutien mécanique, bivouacs nocturnes." },
    },
    {
      icon: Mountain,
      accent: "#5A6B4F",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=85",
      title: { es: "Trekking Alto Atlas", en: "High Atlas trekking", fr: "Trekking Haut Atlas" },
      body: { es: "Rutas adaptadas a cada nivel: ascensión al Toubkal, valle de Aït Bouguemez, gargantas del Mgoun y aldeas perdidas.",
              en: "Routes for every level — Toubkal summit, Aït Bouguemez valley, Mgoun gorges and lost villages.",
              fr: "Itinéraires pour tous les niveaux — Toubkal, vallée d'Aït Bouguemez, gorges du Mgoun et villages perdus." },
    },
    {
      icon: Sparkles,
      accent: "#D97742",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85",
      title: { es: "4x4 Anti-Atlas", en: "4x4 Anti-Atlas", fr: "4x4 Anti-Atlas" },
      body: { es: "Expediciones todoterreno por pistas perdidas, oasis dormidos y palmerales secretos del sur profundo.",
              en: "Off-road expeditions across forgotten tracks, sleeping oases and the secret palm groves of the deep south.",
              fr: "Expéditions tout-terrain sur des pistes oubliées, oasis endormies et palmeraies secrètes du grand sud." },
    },
  ];

  return (
    <section
      id="aventura"
      data-testid="viajes-aventura"
      className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-50 pointer-events-none" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl">
          <span className="overline text-[#D4A373]">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5">
            {t.title}
          </h2>
          <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">
            {t.desc}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <article
                key={i}
                data-testid={`aventura-card-${i}`}
                className="group relative bg-[#1A1513] hover:bg-[#221A16] transition-colors duration-500 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={c.image}
                    alt={pick(c.title, lang)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/75 to-transparent" />
                  <span
                    className="absolute bottom-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-full border bg-[#1A1513]/60 backdrop-blur-sm"
                    style={{ borderColor: `${c.accent}99`, color: c.accent }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </span>
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1]">
                    {pick(c.title, lang)}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#FDFBF7]/70 flex-1">
                    {pick(c.body, lang)}
                  </p>
                  <span
                    className="mt-6 h-px w-10 transition-all duration-500 group-hover:w-20"
                    style={{ background: c.accent }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Section 4 — Descubre Marruecos (highlight pills)
============================================================ */
const DescubreMarruecos = ({ t, lang }) => {
  const HIGHLIGHTS = [
    { es: "Fez",                  en: "Fez",                 fr: "Fès" },
    { es: "Marrakech",            en: "Marrakech",           fr: "Marrakech" },
    { es: "Desierto del Sáhara",  en: "Sahara desert",       fr: "Désert du Sahara" },
    { es: "Alto Atlas",           en: "High Atlas",          fr: "Haut Atlas" },
    { es: "Pueblos bereberes",    en: "Berber villages",     fr: "Villages berbères" },
    { es: "Rutas culturales",     en: "Cultural routes",     fr: "Itinéraires culturels" },
    { es: "Campamentos de lujo",  en: "Luxury camps",        fr: "Camps de luxe" },
  ];

  return (
    <section
      id="descubre"
      data-testid="viajes-descubre"
      className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-50 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <span className="overline">{t.overline}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t.title}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.body}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          {HIGHLIGHTS.map((h, i) => (
            <span
              key={i}
              data-testid={`descubre-pill-${i}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FDFBF7]/80 backdrop-blur-sm border border-[#2C2621]/15 text-sm text-[#2C2621] hover:border-[#C16542] hover:text-[#C16542] transition-colors duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C16542]" />
              {pick(h, lang)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Section 5 — Categorías grid (4 cards)
============================================================ */
const CategoriasGrid = ({ t, lang }) => {
  const CARDS = [
    {
      slug: "south", routeId: "tourSouth", accent: "#C16542",
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=85",
      title: { es: "La magia del Sur de Marruecos", en: "The magic of Southern Morocco", fr: "La magie du Sud marocain" },
      body:  { es: "Descubre el desierto del Erg Chebbi, los paisajes del Alto Atlas y ciudades llenas de contrastes como Marrakech.",
               en: "Discover Erg Chebbi, the High Atlas landscapes and cities full of contrasts like Marrakech.",
               fr: "Découvrez l'Erg Chebbi, les paysages du Haut Atlas et des villes pleines de contrastes comme Marrakech." },
    },
    {
      slug: "full", routeId: "tourFull", accent: "#A07042",
      image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1800&q=85",
      title: { es: "Marruecos al completo, de norte a sur", en: "Full Morocco, north to south", fr: "Maroc intégral, du nord au sud" },
      body:  { es: "Rutas completas por todo el país descubriendo ciudades imperiales, el desierto y las montañas del Atlas.",
               en: "Complete routes — imperial cities, desert and Atlas mountains.",
               fr: "Des itinéraires complets — cités impériales, désert et Atlas." },
    },
    {
      slug: "short", routeId: "tourShort", accent: "#D97742",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1800&q=85",
      title: { es: "Escapadas por Marruecos", en: "Short escapes across Morocco", fr: "Escapades au Maroc" },
      body:  { es: "Escapadas cortas para quienes tienen pocos días disponibles pero quieren vivir la esencia de Marruecos.",
               en: "Short escapes for travellers with limited time who still want Morocco's essence.",
               fr: "Escapades courtes pour ceux qui ont peu de temps mais veulent l'essence du Maroc." },
    },
    {
      slug: "north", routeId: "tourNorth", accent: "#3A4A5F",
      image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1800&q=85",
      title: { es: "La riqueza y belleza del Norte de Marruecos", en: "The richness of Northern Morocco", fr: "La richesse du Nord marocain" },
      body:  { es: "Descubre ciudades blancas y azules, medinas históricas, fortificaciones y paisajes mediterráneos.",
               en: "Discover blue and white towns, historic medinas, fortifications and Mediterranean landscapes.",
               fr: "Découvrez villes bleues et blanches, médinas historiques, fortifications et paysages méditerranéens." },
    },
  ];

  return (
    <section
      id="categorias"
      data-testid="viajes-categorias"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-14">
          <span className="overline">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CARDS.map((c) => (
            <Link
              key={c.slug}
              to={pathFor(lang, c.routeId)}
              data-testid={`categoria-card-${c.slug}`}
              className="group relative block overflow-hidden h-[60vh] min-h-[420px] max-h-[640px]"
            >
              <img
                src={c.image}
                alt={pick(c.title, lang)}
                loading="lazy"
                className="ken-burns absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/45 to-[#1A1513]/15" />
              <span className="film-grain" />

              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end text-[#FDFBF7]">
                <span
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: c.accent === "#3A4A5F" ? "#D4A373" : c.accent }}
                >
                  <span className="w-6 h-px" style={{ background: "currentColor" }} />
                  {t.region_pill}
                </span>
                <h3 className="font-serif-x text-3xl md:text-4xl leading-[1.05] mt-4 max-w-md">
                  {pick(c.title, lang)}
                </h3>
                <p className="mt-4 text-sm md:text-base text-[#FDFBF7]/80 leading-relaxed max-w-md">
                  {pick(c.body, lang)}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#D4A373] group-hover:gap-4 transition-all duration-300">
                  {t.cta}
                  <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Section 6 — Próximas salidas (horizontal trip cards)
============================================================ */
const ProximasSalidas = ({ t, lang }) => {
  const DEPARTURES = [
    {
      season: { es: "Semana Santa 2026",  en: "Easter 2026",   fr: "Pâques 2026" },
      dates:  "28 Mar — 04 Abr",
      title:  { es: "Sáhara & Alto Atlas",       en: "Sahara & High Atlas",      fr: "Sahara & Haut Atlas" },
      spots: 4, accent: "#C16542",
      image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85",
    },
    {
      season: { es: "Verano 2026",        en: "Summer 2026",   fr: "Été 2026" },
      dates:  "12 Jul — 23 Jul",
      title:  { es: "Norte de Marruecos & costas", en: "Northern Morocco & coasts", fr: "Nord du Maroc & côtes" },
      spots: 6, accent: "#3A4A5F",
      image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85",
    },
    {
      season: { es: "Otoño 2026",         en: "Autumn 2026",   fr: "Automne 2026" },
      dates:  "10 Oct — 21 Oct",
      title:  { es: "Marruecos al completo",     en: "Full Morocco",             fr: "Maroc intégral" },
      spots: 8, accent: "#A07042",
      image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1600&q=85",
    },
    {
      season: { es: "Fin de año 2026", en: "New Year 2026",    fr: "Nouvel An 2026" },
      dates:  "27 Dic — 03 Ene",
      title:  { es: "Bivouac Erg Chigaga", en: "Erg Chigaga bivouac", fr: "Bivouac Erg Chigaga" },
      spots: 2, accent: "#D97742",
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85",
    },
  ];

  return (
    <section
      id="proximas"
      data-testid="viajes-proximas"
      className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-14">
          <div className="md:col-span-7">
            <span className="overline">{t.overline}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t.title}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{t.body}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTURES.map((d, i) => (
            <article
              key={i}
              data-testid={`proxima-card-${i}`}
              className="group relative bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#2C2621]/30 transition-colors duration-300 flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-[#1A1513]">
                <img
                  src={d.image}
                  alt={pick(d.title, lang)}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <span
                  className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: d.accent }}
                >
                  <Calendar className="w-3 h-3" strokeWidth={1.6} />
                  {pick(d.season, lang)}
                </span>
                {d.spots <= 2 && (
                  <span className="absolute top-4 right-4 bg-[#C16542] text-[#FDFBF7] px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase">
                    {t.last_spots}
                  </span>
                )}
              </div>
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <p className="font-serif-x-italic text-base text-[#5C5248]">{d.dates}</p>
                <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.15] mt-2 text-[#2C2621]">
                  {pick(d.title, lang)}
                </h3>
                <div className="mt-auto pt-5 border-t border-[#2C2621]/10 flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
                    {d.spots} {t.spots}
                  </span>
                  <Link
                    to={pathFor(lang, "contact")}
                    data-testid={`proxima-cta-${i}`}
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#C16542] hover:gap-3 transition-all duration-300"
                  >
                    {t.reserve}
                    <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Section 7 — Asesoramiento personalizado (glass cards)
============================================================ */
const Asesoramiento = ({ t, lang }) => {
  const OPTIONS = [
    { icon: Phone,         k_title: "phone_t",   k_body: "phone_b",   k_cta: "phone_cta",   accent: "#C16542",
      href: `tel:${CONTACT.phoneRaw}` },
    { icon: Calendar,      k_title: "visit_t",   k_body: "visit_b",   k_cta: "visit_cta",   accent: "#D4A373",
      href: pathFor(lang, "appointment") },
    { icon: MessageCircle, k_title: "spec_t",    k_body: "spec_b",    k_cta: "spec_cta",    accent: "#3A4A5F",
      href: pathFor(lang, "contact") },
  ];

  return (
    <section
      id="asesoramiento"
      data-testid="viajes-asesoramiento"
      className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <img
        src="https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=2000&q=85"
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1513]/90 via-[#1A1513]/75 to-[#1A1513]/95" />
      <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl text-center mx-auto">
          <span className="overline text-[#D4A373]">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5">
            {t.title}
          </h2>
          <p className="mt-5 font-serif-x-italic text-xl md:text-2xl text-[#D4A373]/90">
            {t.subtitle}
          </p>
          <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">
            {t.body}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {OPTIONS.map((o, i) => {
            const Icon = o.icon;
            const isExternal = o.href.startsWith("tel:") || o.href.startsWith("http") || o.href.startsWith("mailto:");
            const Wrapper = isExternal ? "a" : Link;
            const props = isExternal ? { href: o.href } : { to: o.href };
            return (
              <Wrapper
                key={i}
                {...props}
                data-testid={`asesoramiento-card-${i}`}
                className="group relative bg-[#FDFBF7]/[0.05] backdrop-blur-md border border-[#FDFBF7]/15 hover:border-[#D4A373]/50 transition-all duration-500 p-8 md:p-10 flex flex-col overflow-hidden"
              >
                <div className="absolute -top-3 -right-3 berber-bg-cross w-24 h-24 opacity-25" aria-hidden="true" />
                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full border"
                  style={{ borderColor: `${o.accent}88`, color: o.accent }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1] mt-8 text-[#FDFBF7]">
                  {t[o.k_title]}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#FDFBF7]/70 flex-1">
                  {t[o.k_body]}
                </p>
                <span
                  className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase border-b pb-1 self-start group-hover:gap-3 transition-all duration-300"
                  style={{ borderColor: `${o.accent}66`, color: o.accent }}
                >
                  {t[o.k_cta]}
                  <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </span>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Section 8 — Contact intro + WhatsApp CTA
============================================================ */
const ContactIntro = ({ t }) => (
  <section
    data-testid="viajes-contact-intro"
    className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
  >
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="md:col-span-7">
          <span className="overline">{t.overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.title}
          </h2>
          <p className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed max-w-2xl">
            {t.body}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              data-testid="viajes-contact-cta-form"
              className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              {t.cta_form}
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
            </a>
            <a
              href={`https://wa.me/${CONTACT.phoneRaw.replace("+", "")}`}
              target="_blank"
              rel="noreferrer"
              data-testid="viajes-contact-cta-wa"
              className="inline-flex items-center gap-3 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
            >
              <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.6} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#F2EBE1] border border-[#2C2621]/10 p-6 md:p-7">
            <span className="overline">{t.phone_label}</span>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="mt-3 flex items-center gap-3 font-serif-x text-2xl text-[#2C2621] hover:text-[#C16542] transition-colors"
            >
              <Phone className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} />
              {CONTACT.phone}
            </a>
          </div>
          <div className="bg-[#F2EBE1] border border-[#2C2621]/10 p-6 md:p-7">
            <span className="overline">{t.email_label}</span>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#2C2621] hover:text-[#C16542] transition-colors break-all"
            >
              <Mail className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} />
              {CONTACT.email}
            </a>
          </div>
          <div className="bg-[#F2EBE1] border border-[#2C2621]/10 p-6 md:p-7">
            <span className="overline">{t.hours_label}</span>
            <p className="mt-3 flex items-center gap-3 text-sm text-[#2C2621]">
              <Building2 className="w-4 h-4 text-[#C16542]" strokeWidth={1.5} />
              {t.hours_value}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ============================================================
   Trilingual copy for this page only
============================================================ */
const COPY = {
  es: {
    docTitle: "Viajes por Marruecos · Xaluca Tours",
    hero: {
      eyebrow: "Xaluca Tours · Viajes",
      eyebrow_place: "Erg Chebbi · Sáhara",
      title: "Viajes por Marruecos",
      subtitle: "Descubre rutas únicas, escapadas exclusivas y aventuras inolvidables por el corazón de Marruecos.",
      intro: "En este apartado te proponemos diferentes circuitos organizados por nuestro equipo, con fechas cerradas y salidas en grupo durante todo el año: fin de año, Semana Santa, verano y ocasiones especiales.",
      cta_primary: "Ver categorías",
      cta_secondary: "Próximas salidas",
      scroll: "Desplázate",
    },
    intro: {
      eyebrow: "Una aventura, un país",
      title: "Marruecos es el destino perfecto para vivir una aventura.",
      p1: "Si buscas una aventura, Marruecos es el destino perfecto. Desde hacer senderismo en las montañas del Atlas hasta explorar el desierto del Sáhara encima de una moto, Marruecos ofrece experiencias inolvidables para todos los viajeros.",
      p2: "Hacer trekking en Marruecos permite descubrir paisajes impresionantes, pueblos perdidos y rutas adaptadas a diferentes niveles físicos y estilos de viaje.",
      p3: "Y si lo tuyo son las motos, explorar el desierto sobre una moto de enduro es una experiencia de otro nivel: una aventura en grupo que jamás olvidaréis.",
    },
    aventura: {
      overline: "Aventura · Xaluca Tours",
      title: "Viajes de Aventura por Marruecos",
      desc: "Descubre nuestras propuestas de viajes de aventura, ya sea encima de una moto de enduro o recorriendo Marruecos a pie a través de rutas de trekking únicas.",
    },
    descubre: {
      overline: "Descubre Marruecos",
      title: "Descubre todos nuestros viajes por el corazón de Marruecos.",
      body: "Marruecos es un destino imprescindible para quienes buscan una experiencia auténtica y fascinante. Su riqueza cultural, histórica y paisajística permite descubrir desde ciudades imperiales hasta oasis escondidos y noches mágicas bajo las estrellas del Sáhara.",
    },
    categorias: {
      overline: "Categorías",
      title: "Cuatro maneras de descubrir Marruecos.",
      region_pill: "Categoría",
      cta: "Descubrir rutas",
    },
    proximas: {
      overline: "Próximas salidas",
      title: "Próximas salidas a Marruecos.",
      body: "Circuitos organizados con fechas cerradas y salidas en grupo durante Semana Santa, verano, fin de año y otras ocasiones especiales.",
      last_spots: "Últimas plazas",
      spots: "plazas",
      reserve: "Reservar",
    },
    asesoramiento: {
      overline: "Asesoramiento personalizado",
      title: "¿Tienes preguntas sobre tu viaje a Marruecos?",
      subtitle: "Descubre nuestro asesoramiento online en tiempo real o ven a visitarnos a nuestras oficinas.",
      body: "Planifica tu próxima aventura por Marruecos y resuelve todas tus dudas con nuestros especialistas en viajes.",
      phone_t: "Reservar cita telefónica", phone_b: "Habla con un especialista por teléfono cuando mejor te venga.", phone_cta: "Llamar ahora",
      visit_t: "Pedir cita previa", visit_b: "Acércate a nuestras oficinas y planifica tu viaje en persona.", visit_cta: "Pedir cita",
      spec_t: "Contactar con un especialista", spec_b: "Asesoramiento online en tiempo real con nuestro equipo experto.", spec_cta: "Escribir ahora",
    },
    contact: {
      overline: "Contacto",
      title: "¿Te interesan nuestros viajes por Marruecos?",
      body: "Sin ningún compromiso, rellena el formulario de contacto o solicita una cita previa y nuestro equipo te ayudará a organizar tu próxima aventura.",
      cta_form: "Rellenar formulario",
      phone_label: "Teléfono",
      email_label: "Email",
      hours_label: "Horario",
      hours_value: "De lunes a viernes · 10h – 20h",
    },
  },
  en: {
    docTitle: "Morocco journeys · Xaluca Tours",
    hero: {
      eyebrow: "Xaluca Tours · Journeys",
      eyebrow_place: "Erg Chebbi · Sahara",
      title: "Morocco journeys",
      subtitle: "Discover unique routes, exclusive escapes and unforgettable adventures across the heart of Morocco.",
      intro: "Browse the curated departures our team organises year-round: New Year, Easter, summer and special occasions.",
      cta_primary: "View categories",
      cta_secondary: "Upcoming departures",
      scroll: "Scroll",
    },
    intro: {
      eyebrow: "An adventure, a country",
      title: "Morocco is the perfect destination for an adventure.",
      p1: "If you're after adventure, Morocco is the perfect destination. From hiking the Atlas mountains to crossing the Sahara on an enduro motorcycle — Morocco offers unforgettable experiences for every traveller.",
      p2: "Trekking in Morocco reveals breathtaking landscapes, hidden villages and routes adapted to every level and travel style.",
      p3: "And if motorbikes are your thing, crossing the desert on an enduro is a level above: a group adventure you'll never forget.",
    },
    aventura: {
      overline: "Adventure · Xaluca Tours",
      title: "Adventure tours across Morocco",
      desc: "Discover our adventure proposals — whether riding an enduro or hiking unique trekking routes.",
    },
    descubre: {
      overline: "Discover Morocco",
      title: "Discover all our journeys across the heart of Morocco.",
      body: "Morocco is an essential destination for those seeking an authentic and fascinating experience. Its cultural, historical and natural richness reveals imperial cities, hidden oases and magical nights under the Sahara stars.",
    },
    categorias: {
      overline: "Categories",
      title: "Four ways to discover Morocco.",
      region_pill: "Category",
      cta: "Discover routes",
    },
    proximas: {
      overline: "Upcoming departures",
      title: "Upcoming Morocco departures.",
      body: "Curated group departures with fixed dates throughout Easter, summer, New Year and other special occasions.",
      last_spots: "Last spots",
      spots: "spots",
      reserve: "Book",
    },
    asesoramiento: {
      overline: "Personal consultation",
      title: "Questions about your Morocco trip?",
      subtitle: "Get online advice in real time or visit us at our offices.",
      body: "Plan your next Moroccan adventure and clear every doubt with our travel specialists.",
      phone_t: "Book a phone call", phone_b: "Speak with a specialist whenever it suits you.", phone_cta: "Call now",
      visit_t: "Book an in-person visit", visit_b: "Come to our offices and plan your trip face-to-face.", visit_cta: "Book a visit",
      spec_t: "Talk to a specialist", spec_b: "Real-time online advice from our expert team.", spec_cta: "Write now",
    },
    contact: {
      overline: "Contact",
      title: "Interested in our Morocco journeys?",
      body: "No commitment — fill out the contact form or request an appointment, and our team will help you plan your next adventure.",
      cta_form: "Open the form",
      phone_label: "Phone",
      email_label: "Email",
      hours_label: "Hours",
      hours_value: "Monday — Friday · 10:00 – 20:00",
    },
  },
  fr: {
    docTitle: "Voyages au Maroc · Xaluca Tours",
    hero: {
      eyebrow: "Xaluca Tours · Voyages",
      eyebrow_place: "Erg Chebbi · Sahara",
      title: "Voyages au Maroc",
      subtitle: "Découvrez des itinéraires uniques, des escapades exclusives et des aventures inoubliables au cœur du Maroc.",
      intro: "Parcourez les circuits organisés par notre équipe toute l'année : Nouvel An, Pâques, été et grandes occasions.",
      cta_primary: "Voir les catégories",
      cta_secondary: "Prochains départs",
      scroll: "Faites défiler",
    },
    intro: {
      eyebrow: "Une aventure, un pays",
      title: "Le Maroc est la destination parfaite pour une aventure.",
      p1: "Si vous cherchez une aventure, le Maroc est la destination idéale. De la randonnée dans l'Atlas à la traversée du Sahara en moto d'enduro, le Maroc offre des expériences inoubliables à tous les voyageurs.",
      p2: "Le trekking au Maroc révèle des paysages saisissants, des villages perdus et des itinéraires adaptés à tous les niveaux.",
      p3: "Et si la moto vous tente, traverser le désert en enduro est une aventure de groupe que vous n'oublierez jamais.",
    },
    aventura: {
      overline: "Aventure · Xaluca Tours",
      title: "Voyages d'aventure au Maroc",
      desc: "Découvrez nos propositions — en moto d'enduro ou à pied à travers des itinéraires de trekking uniques.",
    },
    descubre: {
      overline: "Découvrir le Maroc",
      title: "Découvrez tous nos voyages au cœur du Maroc.",
      body: "Le Maroc est une destination incontournable pour ceux qui recherchent une expérience authentique et fascinante. Sa richesse culturelle et naturelle dévoile cités impériales, oasis secrètes et nuits magiques sous les étoiles du Sahara.",
    },
    categorias: {
      overline: "Catégories",
      title: "Quatre façons de découvrir le Maroc.",
      region_pill: "Catégorie",
      cta: "Découvrir les itinéraires",
    },
    proximas: {
      overline: "Prochains départs",
      title: "Prochains départs au Maroc.",
      body: "Départs en groupe à dates fixes pendant Pâques, l'été, le Nouvel An et d'autres occasions spéciales.",
      last_spots: "Dernières places",
      spots: "places",
      reserve: "Réserver",
    },
    asesoramiento: {
      overline: "Conseil personnalisé",
      title: "Des questions sur votre voyage au Maroc ?",
      subtitle: "Conseil en ligne en temps réel ou rendez-vous à nos bureaux.",
      body: "Planifiez votre prochaine aventure au Maroc et levez tous vos doutes avec nos spécialistes.",
      phone_t: "Réserver un appel", phone_b: "Parlez à un spécialiste au téléphone quand vous voulez.", phone_cta: "Appeler",
      visit_t: "Prendre rendez-vous", visit_b: "Venez à nos bureaux et planifiez votre voyage en personne.", visit_cta: "Prendre rendez-vous",
      spec_t: "Contacter un spécialiste", spec_b: "Conseil en ligne en temps réel avec notre équipe experte.", spec_cta: "Écrire",
    },
    contact: {
      overline: "Contact",
      title: "Nos voyages au Maroc vous intéressent ?",
      body: "Sans engagement — remplissez le formulaire ou demandez un rendez-vous, notre équipe organisera votre prochaine aventure.",
      cta_form: "Ouvrir le formulaire",
      phone_label: "Téléphone",
      email_label: "Email",
      hours_label: "Horaires",
      hours_value: "Lundi — Vendredi · 10h – 20h",
    },
  },
};

/* ============================================================
   Page
============================================================ */
export default function ToursLandingPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  return (
    <div data-testid="tours-landing-page">
      <Hero t={t.hero} />
      <EditorialIntro t={t.intro} />
      <Aventura t={t.aventura} lang={lang} />
      <DescubreMarruecos t={t.descubre} lang={lang} />
      <CategoriasGrid t={t.categorias} lang={lang} />
      <ProximasSalidas t={t.proximas} lang={lang} />
      <Asesoramiento t={t.asesoramiento} lang={lang} />
      <ContactIntro t={t.contact} />
      <ContactForm />
    </div>
  );
}
