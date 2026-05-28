import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home, ChevronRight, Compass, Sparkles, ArrowRight, ArrowUpRight,
  Briefcase, Trophy, Music2, Heart, Phone, Mail, Clock, MapPin,
  CalendarCheck, Building2, Globe2, Tent, Users, TrendingUp,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { IMG, banner } from "@/lib/imageBank";
import EditableImage from "@/components/EditableImage";
import { SlotScope } from "@/components/slotScope";

const DOC_TITLES = {
  es: "Incentivos · Eventos corporativos en Marruecos · Xaluca",
  en: "Incentives · Corporate events in Morocco · Xaluca",
  fr: "Incentives · Événements d'entreprise au Maroc · Xaluca",
};

const COPY = {
  breadcrumb: { es: "Inicio", en: "Home", fr: "Accueil" },
  cluster:    { es: "Servicios", en: "Services", fr: "Services" },
  current:    { es: "Incentivos", en: "Incentives", fr: "Incentives" },
  hero: {
    eyebrow: { es: "Organizadores de eventos · 360°", en: "Event organisers · 360°", fr: "Organisateurs d'événements · 360°" },
    place:   { es: "Sur de Marruecos · Erg Chebbi", en: "Southern Morocco · Erg Chebbi", fr: "Sud du Maroc · Erg Chebbi" },
    title: {
      es: "Descubre todo lo que podemos ofrecerte como organizadores de eventos.",
      en: "Discover everything we can offer you as event organisers.",
      fr: "Découvrez tout ce que nous pouvons vous offrir en tant qu'organisateurs d'événements.",
    },
    subtitle: {
      es: "Disponemos de una gran infraestructura en Marruecos capaz de ofrecer un servicio integral 360° para la organización y celebración de eventos nacionales e internacionales.",
      en: "We operate a wide-ranging infrastructure in Morocco able to deliver a 360° turnkey service for national and international events.",
      fr: "Nous disposons d'une vaste infrastructure au Maroc, capable d'offrir un service intégral à 360° pour l'organisation d'événements nationaux et internationaux.",
    },
  },
  trust: {
    overline: { es: "Confían en nosotros", en: "They trust us", fr: "Ils nous font confiance" },
    body: {
      es: "Marcas internacionales que han elegido el sur de Marruecos para celebrar sus eventos corporativos con Grup Xaluca.",
      en: "International brands that chose southern Morocco to host their corporate events with Grup Xaluca.",
      fr: "Des marques internationales qui ont choisi le sud du Maroc pour leurs événements avec Grup Xaluca.",
    },
  },
  brands: [
    "Coca-Cola", "Jeep", "MINI", "Mitsubishi", "IBM", "BMW",
    "Vodafone", "Volkswagen", "Tag Heuer", "Nissan", "Carglass", "Seat", "Heineken",
  ],
  verticals: {
    overline: { es: "Qué organizamos", en: "What we organise", fr: "Ce que nous organisons" },
    title: {
      es: "Cuatro formatos, una misma infraestructura.",
      en: "Four formats, one shared infrastructure.",
      fr: "Quatre formats, une seule infrastructure.",
    },
    items: [
      {
        id: "negocios",
        icon: "Briefcase",
        image: IMG.kasbahArch,
        title: { es: "Eventos de negocios", en: "Business events", fr: "Événements d'affaires" },
        body: {
          es: "En los últimos años el sur de Marruecos se ha convertido en el destino escogido por cientos de empresas de distintos sectores de todo el mundo para sus eventos corporativos. Marcas internacionales como BMW, Vodafone, Volkswagen, Coca-Cola, IBM, Tag Heuer, Nissan, Carglass, Seat o Heineken han confiado en Grup Xaluca para organizar sus encuentros en el corazón del desierto.",
          en: "In recent years, southern Morocco has become the destination of choice for hundreds of companies across every sector to host their corporate events. International brands such as BMW, Vodafone, Volkswagen, Coca-Cola, IBM, Tag Heuer, Nissan, Carglass, Seat and Heineken have trusted Grup Xaluca to deliver their gatherings in the heart of the desert.",
          fr: "Ces dernières années, le sud du Maroc est devenu la destination de choix pour des centaines d'entreprises de tous secteurs. Des marques internationales comme BMW, Vodafone, Volkswagen, Coca-Cola, IBM, Tag Heuer, Nissan, Carglass, Seat ou Heineken ont fait confiance à Grup Xaluca pour leurs rencontres au cœur du désert.",
        },
        chips: ["Convenciones", "Lanzamientos", "Team building", "Incentivos"],
      },
      {
        id: "deportivos",
        icon: "Trophy",
        image: IMG.dunesRocky,
        title: { es: "Eventos deportivos", en: "Sporting events", fr: "Événements sportifs" },
        body: {
          es: "Nuestros establecimientos e infraestructura logística están situados en una región célebre por la celebración de competiciones de fama internacional como la Garmin Titan Desert, el Marathon des Sables, el Rally Merzouga o la Desert Run, entre muchas otras. Grup Xaluca ofrece soporte logístico a eventos nacionales e internacionales en todo el mundo.",
          en: "Our hotels and logistics infrastructure sit in a region famed for hosting world-class competitions such as the Garmin Titan Desert, the Marathon des Sables, the Merzouga Rally or the Desert Run, among many others. Grup Xaluca provides logistical support to national and international events worldwide.",
          fr: "Nos établissements et notre logistique se trouvent dans une région réputée pour des compétitions de renommée internationale : Garmin Titan Desert, Marathon des Sables, Rallye Merzouga, Desert Run, entre autres. Grup Xaluca apporte un soutien logistique à des événements nationaux et internationaux dans le monde entier.",
        },
        chips: ["Titan Desert", "Marathon des Sables", "Rally Merzouga", "Desert Run"],
      },
      {
        id: "festivales",
        icon: "Music2",
        image: IMG.medinaPeople,
        title: { es: "Festivales", en: "Festivals", fr: "Festivals" },
        body: {
          es: "Disponemos de la infraestructura y la capacidad de organización suficientes para producir cualquier tipo de festival o evento cultural en el sur de Marruecos. Sea lo que sea lo que tengas en mente, nuestro equipo se pondrá a trabajar contigo para asegurar el éxito de tu próxima edición.",
          en: "We have the infrastructure and the production capacity to deliver any kind of festival or cultural event in southern Morocco. Whatever you have in mind, our team will work alongside yours to ensure the success of the next edition.",
          fr: "Nous disposons de l'infrastructure et de la capacité de production pour organiser tout type de festival ou d'événement culturel dans le sud du Maroc. Quel que soit votre projet, notre équipe travaillera avec la vôtre pour assurer le succès de la prochaine édition.",
        },
        chips: ["Música", "Cine", "Arte", "Gastronomía"],
      },
      {
        id: "celebraciones",
        icon: "Heart",
        image: IMG.dunes,
        title: { es: "Celebraciones", en: "Celebrations", fr: "Célébrations" },
        body: {
          es: "El marco incomparable del sur de Marruecos, la belleza de sus montañas y la espectacularidad del desierto del Erg Chebbi convierten cualquier celebración en un recuerdo inolvidable. Aventúrate y celebra tu boda en medio de las dunas, brinda por un aniversario entre valles y montañas o reencuentra a tu promoción en el corazón de un oasis. Lo que imagines, con Grup Xaluca es posible.",
          en: "Southern Morocco's incomparable setting, the beauty of its mountains and the sheer drama of the Erg Chebbi dunes turn any celebration into a lifelong memory. Marry among the dunes, toast an anniversary between valleys and mountains, or reunite your class in the heart of a palm-grove oasis. Whatever you can picture, with Grup Xaluca it's possible.",
          fr: "Le cadre incomparable du sud du Maroc, la beauté de ses montagnes et la splendeur des dunes de l'Erg Chebbi transforment toute célébration en souvenir inoubliable. Mariez-vous dans les dunes, fêtez un anniversaire entre vallées et montagnes, ou retrouvez vos camarades de classe au cœur d'une palmeraie. Tout ce que vous imaginez, avec Grup Xaluca est possible.",
        },
        chips: ["Bodas", "Aniversarios", "Reuniones", "Renovación de votos"],
      },
    ],
  },
  cases: {
    overline: { es: "Casos de éxito", en: "Success stories", fr: "Cas de réussite" },
    title: {
      es: "Lo que ya hemos hecho — y volveríamos a hacer.",
      en: "What we've already delivered — and would deliver again.",
      fr: "Ce que nous avons déjà livré — et que nous referions.",
    },
    body: {
      es: "Tres encuentros reales producidos íntegramente por Grup Xaluca en el sur de Marruecos. Cifras de los propios clientes, no de nuestro equipo de marketing.",
      en: "Three real gatherings entirely produced by Grup Xaluca in southern Morocco. Figures shared by the clients themselves, not our marketing team.",
      fr: "Trois rencontres réelles produites intégralement par Grup Xaluca dans le sud du Maroc. Chiffres communiqués par les clients eux-mêmes.",
    },
    attendeesLabel: { es: "Asistentes", en: "Attendees", fr: "Participants" },
    daysLabel:      { es: "Días",       en: "Days",      fr: "Jours" },
    metricLabel:    { es: "Resultado",  en: "Result",    fr: "Résultat" },
    items: [
      {
        id: "bmw-launch",
        brand: "BMW",
        image: IMG.kasbahArch,
        event:    { es: "Lanzamiento de gama M",          en: "M-Series product launch",       fr: "Lancement gamme M" },
        location: { es: "Ouarzazate · Aït Ben Haddou",   en: "Ouarzazate · Aït Ben Haddou",   fr: "Ouarzazate · Aït Ben Haddou" },
        attendees: 240,
        days: 4,
        metric: { es: "+96% satisfacción", en: "+96% satisfaction", fr: "+96 % de satisfaction" },
        body: {
          es: "Test drive sobre las pistas del Anti-Atlas, gala en kasbah privada y cena bereber bajo las estrellas. Producción audiovisual, transfers y catering 100% in-house.",
          en: "Test drive across Anti-Atlas tracks, gala in a private kasbah and Berber dinner under the stars. Audiovisual production, transfers and catering 100% in-house.",
          fr: "Essais sur les pistes de l'Anti-Atlas, gala dans une kasbah privée et dîner berbère sous les étoiles. Production audiovisuelle, transferts et restauration 100 % en interne.",
        },
      },
      {
        id: "vodafone-emea",
        brand: "Vodafone",
        image: IMG.dunes,
        event:    { es: "Convención anual EMEA",  en: "EMEA annual convention",     fr: "Convention annuelle EMEA" },
        location: { es: "Erg Chebbi · Merzouga", en: "Erg Chebbi · Merzouga",       fr: "Erg Chebbi · Merzouga" },
        attendees: 180,
        days: 3,
        metric: { es: "+92 NPS interno", en: "+92 internal NPS", fr: "+92 NPS interne" },
        body: {
          es: "Convención dividida en tres campamentos haima sobre las dunas. Workshops por la mañana, paseos en 4x4 al atardecer y cierre con concierto gnaoua acústico.",
          en: "Convention split across three haima camps on the dunes. Morning workshops, 4x4 drives at dusk and a closing acoustic gnawa concert.",
          fr: "Convention répartie sur trois campements haima dans les dunes. Ateliers le matin, sorties 4x4 au crépuscule, clôture en concert gnawa acoustique.",
        },
      },
      {
        id: "heineken-incentive",
        brand: "Heineken",
        image: IMG.riadFountain,
        event:    { es: "Incentivo comercial regional", en: "Regional sales incentive", fr: "Incentive commercial régional" },
        location: { es: "Marrakech · Atlas",           en: "Marrakech · Atlas",         fr: "Marrakech · Atlas" },
        attendees: 320,
        days: 5,
        metric: { es: "+98% recomendación", en: "+98% would recommend", fr: "+98 % recommandent" },
        body: {
          es: "Incentivo para el top 320 de la fuerza comercial. Cena de bienvenida en riad privatizado, hike por el valle del Ourika y noche de gala con showcooking marroquí.",
          en: "Incentive trip for the top 320 of the sales force. Welcome dinner in a privatised riad, hike through the Ourika valley and gala night with Moroccan showcooking.",
          fr: "Voyage incentive pour le top 320 de la force commerciale. Dîner de bienvenue dans un riad privatisé, randonnée dans la vallée de l'Ourika et soirée de gala avec showcooking marocain.",
        },
      },
    ],
  },
  process: {
    overline: { es: "Tu viaje 100% a tu medida", en: "Your trip, 100% bespoke", fr: "Votre voyage 100 % sur mesure" },
    title: {
      es: "Tres pasos para empezar a diseñar tu próximo evento.",
      en: "Three steps to start designing your next event.",
      fr: "Trois étapes pour commencer à concevoir votre prochain événement.",
    },
    body: {
      es: "Sin compromiso, completa el formulario o pide cita previa online o en nuestras oficinas. Nos pondremos en contacto contigo para empezar a organizar tu próxima aventura por Marruecos.",
      en: "With no commitment, fill in the form or book a slot online or at our offices. We'll get back to you to start planning your next Morocco adventure.",
      fr: "Sans engagement, remplissez le formulaire ou prenez rendez-vous en ligne ou dans nos bureaux. Nous vous contacterons pour commencer à organiser votre prochaine aventure marocaine.",
    },
    steps: [
      {
        id: "create",
        icon: "Building2",
        title: { es: "Crea tu viaje de empresa a medida", en: "Design your bespoke corporate trip", fr: "Créez votre voyage d'entreprise sur mesure" },
        body: {
          es: "Planifica tu próximo viaje de incentivo por Marruecos y resuelve todas tus dudas en sesiones telefónicas o presenciales con nuestros agentes especialistas, listos para adaptar la experiencia a tu equipo.",
          en: "Plan your next incentive trip through Morocco and clear up every question over phone or in-person sessions with our specialist agents — ready to tailor the experience to your team.",
          fr: "Planifiez votre prochain voyage incentive au Maroc et clarifiez toutes vos questions lors de sessions par téléphone ou en personne avec nos agents spécialistes, prêts à adapter l'expérience à votre équipe.",
        },
      },
      {
        id: "explore",
        icon: "Globe2",
        title: { es: "Planifica tu aventura por Marruecos", en: "Plan your Morocco adventure", fr: "Planifiez votre aventure marocaine" },
        body: {
          es: "Visita nuestra sección de viajes e infórmate sobre todas las opciones disponibles. Resolvemos cualquier duda en sesiones informativas online o en nuestras oficinas de la calle Latorre 52, Sabadell (Barcelona).",
          en: "Browse our trips section and explore every available option. We answer any question in online info sessions or at our offices on Latorre 52, Sabadell (Barcelona).",
          fr: "Parcourez notre section voyages et explorez toutes les options. Nous répondons à toutes vos questions lors de sessions d'information en ligne ou dans nos bureaux du 52 Carrer Latorre, Sabadell (Barcelone).",
        },
      },
      {
        id: "schedule",
        icon: "CalendarCheck",
        title: { es: "Reserva día y hora", en: "Book your slot", fr: "Réservez votre créneau" },
        body: {
          es: "Sólo necesitamos tu nombre, correo electrónico y el día y la hora que prefieras para la sesión online o presencial. Del resto, nos ocupamos nosotros.",
          en: "We just need your name, email and the day and time you prefer for the online or in-person session. We'll take it from there.",
          fr: "Nous avons juste besoin de votre nom, votre email et du jour et de l'heure que vous préférez pour la session en ligne ou en personne. Nous nous occupons du reste.",
        },
      },
    ],
    planCta:    { es: "Planifica tu viaje", en: "Plan my journey", fr: "Planifier mon voyage" },
    contactCta: { es: "Pedir cita previa",   en: "Book a session",  fr: "Prendre rendez-vous" },
  },
  cta: {
    eyebrow: { es: "Una aventura distinta para tu empresa", en: "A different adventure for your team", fr: "Une aventure différente pour votre entreprise" },
    title: {
      es: "Una aventura distinta para tu empresa — que nunca olvidaréis.",
      en: "A different adventure for your team — one you'll never forget.",
      fr: "Une aventure différente pour votre entreprise — que vous n'oublierez jamais.",
    },
    body: {
      es: "Si quieres disfrutar de la mejor experiencia en Marruecos, contacta con Xaluca Tours y descubre la mejor forma de organizar tu viaje.",
      en: "If you want to enjoy the best Morocco experience, get in touch with Xaluca Tours and discover the best way to organise your trip.",
      fr: "Si vous souhaitez vivre la meilleure expérience marocaine, contactez Xaluca Tours et découvrez la meilleure façon d'organiser votre voyage.",
    },
    phoneLabel: { es: "Teléfono",      en: "Phone",        fr: "Téléphone" },
    emailLabel: { es: "Email",         en: "Email",        fr: "Email" },
    hoursLabel: { es: "Horario de oficina", en: "Office hours", fr: "Heures de bureau" },
    hours: {
      es: "Lunes a viernes · 10 h – 20 h",
      en: "Monday to Friday · 10 am – 8 pm",
      fr: "Lundi au vendredi · 10 h – 20 h",
    },
    planCta:    { es: "Planifica tu evento", en: "Plan my event", fr: "Planifier mon événement" },
    contactCta: { es: "Escríbenos",          en: "Write to us",    fr: "Nous écrire" },
  },
};

const ICON_MAP = {
  Briefcase, Trophy, Music2, Heart, CalendarCheck, Building2, Globe2, Tent,
};

/* ============================================================
   Sub-components
============================================================ */
const InlineBreadcrumb = ({ lang }) => (
  <nav
    aria-label="Breadcrumb"
    data-testid="inc-breadcrumbs"
    className="inline-flex items-center gap-2 bg-[#1A1513]/55 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7]/90"
  >
    <Link to={pathFor(lang, "home")} data-testid="inc-bc-home" className="flex items-center gap-1.5 hover:text-[#D4A373] transition-colors">
      <Home className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
      <span>{pick(COPY.breadcrumb, lang)}</span>
    </Link>
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    <span>{pick(COPY.cluster, lang)}</span>
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    <span className="text-[#D4A373]">{pick(COPY.current, lang)}</span>
  </nav>
);

const Hero = ({ lang }) => (
  <section data-testid="inc-hero" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#1A1513]">
    <EditableImage
      slot="incentivos.hero"
      fallback={banner("dunes", 2400)}
      alt=""
      aspectRatio="auto"
      imgProps={{ loading: "eager" }}
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/35 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-35 pointer-events-none" aria-hidden="true" />
    <span className="film-grain pointer-events-none" />

    <div className="relative z-10 h-full flex flex-col">
      <div className="pt-[88px] md:pt-[96px] px-6 md:px-12 max-w-7xl mx-auto w-full">
        <InlineBreadcrumb lang={lang} />
      </div>
      <div className="flex-1 flex items-end pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">{pick(COPY.hero.eyebrow, lang)}</span>
              <span className="w-8 h-px bg-[#D4A373]/50" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80">{pick(COPY.hero.place, lang)}</span>
            </div>
            <h1 className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6">
              {pick(COPY.hero.title, lang)}
            </h1>
            <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed">
              {pick(COPY.hero.subtitle, lang)}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TrustBar = ({ lang }) => (
  <section
    data-testid="inc-trust"
    className="relative bg-[#FDFBF7] py-16 md:py-20 border-b border-[#2C2621]/10"
  >
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-8 md:mb-12">
        <div className="md:col-span-5">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.trust.overline, lang)}
          </span>
        </div>
        <div className="md:col-span-7">
          <p className="text-sm md:text-base text-[#5C5248] leading-relaxed">
            {pick(COPY.trust.body, lang)}
          </p>
        </div>
      </div>

      <ul
        data-testid="inc-brands"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10"
      >
        {COPY.brands.map((b) => (
          <li
            key={b}
            data-testid={`inc-brand-${b.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="bg-[#FDFBF7] flex items-center justify-center px-4 py-6 md:py-7 hover:bg-[#F2EBE1] transition-colors duration-300"
          >
            <span className="font-serif-x text-base md:text-lg text-[#2C2621]/70 hover:text-[#2C2621] tracking-tight transition-colors">
              {b}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const VerticalRow = ({ item, index, lang }) => {
  const Icon = ICON_MAP[item.icon] || Briefcase;
  const reverse = index % 2 === 1;
  return (
    <SlotScope id={item.id}>
      <article
        data-testid={`inc-vertical-${item.id}`}
        className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
      >
        <div className="md:col-span-6 relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1513]">
            <EditableImage
              name="image"
              fallback={item.image}
              alt={pick(item.title, lang)}
              aspectRatio="4/3"
              imgProps={{ loading: "lazy" }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1513]/40 via-transparent to-transparent pointer-events-none" />
            <span className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase text-[#C16542]">
              <Icon className="w-3 h-3" strokeWidth={1.6} />
              {String(index + 1).padStart(2, "0")} · {pick(item.title, lang)}
            </span>
          </div>
        </div>
        <div className="md:col-span-6">
          <h3 className="font-serif-x text-3xl md:text-[40px] leading-[1.08] tracking-tight text-[#2C2621]">
            {pick(item.title, lang)}
          </h3>
          <p className="mt-5 text-base md:text-lg text-[#5C5248] leading-relaxed">
            {pick(item.body, lang)}
          </p>
          {item.chips?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {item.chips.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center px-3 py-1.5 text-[10px] tracking-[0.22em] uppercase text-[#C16542] bg-[#F2EBE1] border border-[#C16542]/20"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </SlotScope>
  );
};

const Verticals = ({ lang }) => (
  <SlotScope id="verticals">
    <section
      data-testid="inc-verticals"
      className="relative bg-[#FDFBF7] py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.verticals.overline, lang)}
          </span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
            {pick(COPY.verticals.title, lang)}
          </h2>
        </div>

        <div className="flex flex-col gap-20 md:gap-28">
          {COPY.verticals.items.map((item, i) => (
            <VerticalRow key={item.id} item={item} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  </SlotScope>
);

const Cases = ({ lang }) => (
  <SlotScope id="cases">
    <section
      data-testid="inc-cases"
      className="relative bg-[#1A1513] py-20 md:py-28 overflow-hidden border-t border-[#FDFBF7]/10"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2 text-[#D4A373]">
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pick(COPY.cases.overline, lang)}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#FDFBF7]">
              {pick(COPY.cases.title, lang)}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">
              {pick(COPY.cases.body, lang)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {COPY.cases.items.map((c) => (
            <SlotScope key={c.id} id={c.id}>
              <article
                data-testid={`inc-case-${c.id}`}
                className="group relative bg-[#FDFBF7] flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1513]">
                  <EditableImage
                    name="image"
                    fallback={c.image}
                    alt={`${c.brand} · ${pick(c.event, lang)}`}
                    aspectRatio="4/3"
                    imgProps={{ loading: "lazy" }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/30 to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 bg-[#FDFBF7] text-[#2C2621] font-serif-x text-base px-3 py-1.5 tracking-tight">
                    {c.brand}
                  </span>
                  <p className="absolute bottom-3 left-3 right-3 text-[10px] tracking-[0.22em] uppercase text-[#FDFBF7]/90">
                    {pick(c.location, lang)}
                  </p>
                </div>

                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#C16542]">
                    {pick(c.event, lang)}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[#5C5248] flex-1">
                    {pick(c.body, lang)}
                  </p>

                  {/* Stats row */}
                  <dl
                    data-testid={`inc-case-stats-${c.id}`}
                    className="mt-6 pt-5 border-t border-[#2C2621]/10 grid grid-cols-3 gap-3"
                  >
                    <div>
                      <dt className="text-[9px] tracking-[0.22em] uppercase text-[#5C5248] flex items-center gap-1">
                        <Users className="w-3 h-3" strokeWidth={1.8} />
                        {pick(COPY.cases.attendeesLabel, lang)}
                      </dt>
                      <dd className="font-serif-x text-2xl text-[#2C2621] mt-1 tabular-nums">{c.attendees}</dd>
                    </div>
                    <div>
                      <dt className="text-[9px] tracking-[0.22em] uppercase text-[#5C5248] flex items-center gap-1">
                        <CalendarCheck className="w-3 h-3" strokeWidth={1.8} />
                        {pick(COPY.cases.daysLabel, lang)}
                      </dt>
                      <dd className="font-serif-x text-2xl text-[#2C2621] mt-1 tabular-nums">{c.days}</dd>
                    </div>
                    <div>
                      <dt className="text-[9px] tracking-[0.22em] uppercase text-[#5C5248] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" strokeWidth={1.8} />
                        {pick(COPY.cases.metricLabel, lang)}
                      </dt>
                      <dd className="font-serif-x text-lg leading-tight text-[#C16542] mt-1">
                        {pick(c.metric, lang)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            </SlotScope>
          ))}
        </div>
      </div>
    </section>
  </SlotScope>
);

const Process = ({ lang }) => (
  <SlotScope id="process">
    <section
      data-testid="inc-process"
      className="relative bg-[#F2EBE1] py-20 md:py-28 border-t border-[#2C2621]/10 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2 text-[#C16542]">
              <CalendarCheck className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pick(COPY.process.overline, lang)}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
              {pick(COPY.process.title, lang)}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">
              {pick(COPY.process.body, lang)}
            </p>
          </div>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
          {COPY.process.steps.map((step, i) => {
            const Icon = ICON_MAP[step.icon] || Building2;
            return (
              <li
                key={step.id}
                data-testid={`inc-step-${step.id}`}
                className="bg-[#FDFBF7] p-7 md:p-9 flex flex-col"
              >
                <div className="flex items-center gap-4">
                  <span className="font-serif-x text-3xl text-[#C16542]/60 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#F2EBE1] text-[#C16542]">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </span>
                </div>
                <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.15] text-[#2C2621] mt-6">
                  {pick(step.title, lang)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1">
                  {pick(step.body, lang)}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 md:mt-12 flex flex-wrap gap-4 justify-center">
          <Link
            to={pathFor(lang, "planTrip")}
            data-testid="inc-process-plan"
            className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-6 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors"
          >
            {pick(COPY.process.planCta, lang)}
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
          </Link>
          <Link
            to={pathFor(lang, "contact")}
            data-testid="inc-process-contact"
            className="inline-flex items-center gap-2 border border-[#2C2621]/25 hover:border-[#C16542] hover:text-[#C16542] text-[#2C2621] px-6 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors"
          >
            {pick(COPY.process.contactCta, lang)}
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </section>
  </SlotScope>
);

const FinalCta = ({ lang }) => (
  <section
    data-testid="inc-final-cta"
    className="relative bg-[#1A1513] py-24 md:py-32 overflow-hidden"
  >
    <EditableImage
      slot="incentivos.final.bg"
      fallback={banner("camelCaravan", 2400)}
      alt=""
      aspectRatio="auto"
      imgProps={{ loading: "lazy" }}
      className="absolute inset-0 w-full h-full object-cover opacity-25"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/85 to-[#1A1513]/65 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />

    <div className="relative max-w-5xl mx-auto px-6 md:px-12">
      <div className="text-center max-w-3xl mx-auto">
        <span className="overline inline-flex items-center gap-2 text-[#D4A373]">
          <Tent className="w-3.5 h-3.5" strokeWidth={1.6} />
          {pick(COPY.cta.eyebrow, lang)}
        </span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#FDFBF7]">
          {pick(COPY.cta.title, lang)}
        </h2>
        <p className="mt-6 text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed">
          {pick(COPY.cta.body, lang)}
        </p>
      </div>

      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15 max-w-4xl mx-auto">
        <a
          href={`tel:${CONTACT.phoneRaw}`}
          data-testid="inc-contact-phone"
          className="bg-[#1A1513]/70 hover:bg-[#221A16] backdrop-blur-sm p-6 md:p-7 flex items-start gap-4 transition-colors"
        >
          <Phone className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">
              {pick(COPY.cta.phoneLabel, lang)}
            </p>
            <p className="mt-1 text-base text-[#FDFBF7]">{CONTACT.phone}</p>
          </div>
        </a>
        <a
          href={`mailto:${CONTACT.email}`}
          data-testid="inc-contact-email"
          className="bg-[#1A1513]/70 hover:bg-[#221A16] backdrop-blur-sm p-6 md:p-7 flex items-start gap-4 transition-colors"
        >
          <Mail className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">
              {pick(COPY.cta.emailLabel, lang)}
            </p>
            <p className="mt-1 text-base text-[#FDFBF7] break-all">{CONTACT.email}</p>
          </div>
        </a>
        <div
          data-testid="inc-contact-hours"
          className="bg-[#1A1513]/70 backdrop-blur-sm p-6 md:p-7 flex items-start gap-4"
        >
          <Clock className="w-5 h-5 text-[#D4A373] mt-1 flex-shrink-0" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">
              {pick(COPY.cta.hoursLabel, lang)}
            </p>
            <p className="mt-1 text-base text-[#FDFBF7]">{pick(COPY.cta.hours, lang)}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          to={pathFor(lang, "planTrip")}
          data-testid="inc-cta-plan"
          className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.cta.planCta, lang)}
          <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
        </Link>
        <Link
          to={pathFor(lang, "contact")}
          data-testid="inc-cta-contact"
          className="inline-flex items-center gap-2 border border-[#FDFBF7]/40 hover:border-[#D4A373] hover:text-[#D4A373] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.cta.contactCta, lang)}
          <MapPin className="w-4 h-4" strokeWidth={1.6} />
        </Link>
      </div>
    </div>
  </section>
);

/* ============================================================
   Page
============================================================ */
export default function IncentivosPage() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = DOC_TITLES[lang] || DOC_TITLES.es;
  }, [lang]);

  return (
    <div data-testid="inc-page" className="bg-[#FDFBF7]">
      <Hero lang={lang} />
      <TrustBar lang={lang} />
      <Verticals lang={lang} />
      <Cases lang={lang} />
      <Process lang={lang} />
      <FinalCta lang={lang} />
    </div>
  );
}
