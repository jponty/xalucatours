import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Calendar, Users, MapPin, Sparkles, ShieldCheck,
  Flame, Check, Clock,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { UPCOMING_DEPARTURES } from "@/lib/upcomingDepartures";
import {
  JourneyHero,
  StickyNav,
  CommunityCta,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";

/* ============================================================
   Trilingual copy
============================================================ */
const COPY = {
  es: {
    docTitle: "Próximas salidas a Marruecos · Xaluca Tours",
    hero: {
      eyebrow: "Salidas en grupo · Fechas confirmadas",
      place: "Semana Santa · Verano · Fin de Año",
      title: "Próximas salidas a Marruecos.",
      subtitle: "Fechas establecidas, grupos reducidos y experiencias diseñadas alrededor de momentos especiales del año.",
      intro: "Itinerarios cuidadosamente organizados por nuestro equipo con salidas en grupo en momentos específicos como fin de año, Semana Santa, verano, así como en varios puentes u ocasiones especiales a lo largo del año.",
      primaryCta: "Ver salidas disponibles", secondaryCta: "Pedir asesoramiento", scroll: "Desplázate",
    },
    nav: { departures: "Salidas", filters: "Filtros", process: "Cómo reservar", why: "Por qué", community: "Contacto" },
    filters: {
      all: { es: "Todas", en: "All", fr: "Toutes" },
      easter: "Semana Santa",
      summer: "Verano",
      bridge: "Puentes",
      nye: "Fin de Año",
      carnival: "Carnaval",
    },
    list: {
      overline: "Calendario de salidas",
      title: "Elige tu fecha.",
      body: "Cada salida tiene plazas limitadas. Reserva con un depósito reducido y el resto 30 días antes de la salida.",
      filter_label: "Filtrar por temporada",
      reserve: "Reservar plaza",
      detail: "Ver itinerario",
      from: "Desde",
      per_person: "por persona",
      deposit: "Depósito",
      spots_left: "plazas disponibles",
      spots_left_one: "plaza disponible",
      capacity: "de un grupo de",
      route: "Ruta",
      highlights: "Lo destacado",
      duration_label: "Duración",
      status_open: "Abierta",
      status_last: "Últimas plazas",
      status_sold: "Completa",
      no_results: "No hay salidas para este filtro. Prueba con otra temporada.",
    },
    process: {
      overline: "Cómo reservar",
      title: "Tres pasos para asegurar tu plaza.",
      body: "Sin sorpresas: depósito reducido al confirmar, pago final 30 días antes de la salida y atención 24/7 durante todo el viaje.",
      steps: [
        { n: "01", title: "Elige tu salida",
          body: "Selecciona la fecha que mejor encaje con tu agenda y confirma las plazas que necesitas." },
        { n: "02", title: "Confirma con depósito",
          body: "Aseguramos tu plaza con un depósito desde 300 €. Recibirás el documento de viaje y la lista de equipaje." },
        { n: "03", title: "Viaja con Xaluca",
          body: "Pago final 30 días antes de la salida. Te acompañamos antes, durante y después del viaje." },
      ],
    },
    why: {
      overline: "Por qué viajar en grupo con Xaluca",
      title: "Grupos reducidos, atención cuidada.",
      pillars: [
        { icon: "Users",       title: "Grupos reducidos",       body: "Máximo 14 viajeros por salida. Atención personal asegurada." },
        { icon: "Calendar",    title: "Fechas confirmadas",     body: "Salidas cerradas con vuelos, hoteles y guías ya reservados." },
        { icon: "ShieldCheck", title: "Garantía Grup Xaluca",   body: "Hoteles y campamentos propios en el sur de Marruecos." },
        { icon: "Flame",       title: "Experiencias singulares", body: "Cenas, conciertos Gnawa y noches en el desierto reservadas exclusivamente para el grupo." },
      ],
    },
    community: {
      overline: "Únete a nuestra comunidad de viajeros",
      title: "¿Te interesa alguna salida?",
      subtitle: "Resuelve dudas en tiempo real con nuestro equipo especializado.",
      body: "Contacta sin compromiso para reservar tu plaza, pedir el dossier completo de una salida o diseñar una salida privada para tu grupo.",
      phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
      hours_value: "Lun – Vie · 10h – 20h",
      cta_primary: "Reservar plaza",
    },
  },
  en: {
    docTitle: "Upcoming Morocco departures · Xaluca Tours",
    hero: {
      eyebrow: "Group departures · Fixed dates",
      place: "Easter · Summer · NYE",
      title: "Upcoming Morocco departures.",
      subtitle: "Fixed dates, small groups and experiences designed around special moments of the year.",
      intro: "Itineraries carefully organised by our team with group departures around specific times — New Year, Easter, summer, long weekends and other special occasions throughout the year.",
      primaryCta: "View available departures", secondaryCta: "Get advice", scroll: "Scroll",
    },
    nav: { departures: "Departures", filters: "Filters", process: "How to book", why: "Why", community: "Contact" },
    filters: { all: { en: "All" }, easter: "Easter", summer: "Summer", bridge: "Bridge", nye: "NYE", carnival: "Carnival" },
    list: {
      overline: "Departure calendar",
      title: "Pick your date.",
      body: "Each departure has limited places. Book with a small deposit and pay the rest 30 days before departure.",
      filter_label: "Filter by season",
      reserve: "Reserve a spot",
      detail: "View itinerary",
      from: "From",
      per_person: "per person",
      deposit: "Deposit",
      spots_left: "spots left",
      spots_left_one: "spot left",
      capacity: "of a group of",
      route: "Route",
      highlights: "Highlights",
      duration_label: "Duration",
      status_open: "Open",
      status_last: "Last spots",
      status_sold: "Sold out",
      no_results: "No departures match this filter. Try another season.",
    },
    process: {
      overline: "How to book",
      title: "Three steps to lock your spot.",
      body: "No surprises: a small deposit at booking, final payment 30 days before departure, and 24/7 support throughout the journey.",
      steps: [
        { n: "01", title: "Pick your departure", body: "Choose the date that best fits your agenda and confirm the spots you need." },
        { n: "02", title: "Confirm with deposit", body: "Secure your spot with a deposit from €300. You'll get the travel document and packing list." },
        { n: "03", title: "Travel with Xaluca", body: "Final payment 30 days before departure. We support you before, during and after the trip." },
      ],
    },
    why: {
      overline: "Why travel in a group with Xaluca",
      title: "Small groups, careful attention.",
      pillars: [
        { icon: "Users",       title: "Small groups",        body: "Max 14 travellers per departure. Personal attention guaranteed." },
        { icon: "Calendar",    title: "Confirmed dates",     body: "Closed departures with flights, hotels and guides already secured." },
        { icon: "ShieldCheck", title: "Grup Xaluca guarantee", body: "Our own hotels and camps across southern Morocco." },
        { icon: "Flame",       title: "Singular experiences", body: "Dinners, Gnawa concerts and desert nights booked exclusively for the group." },
      ],
    },
    community: {
      overline: "Join our community of travellers",
      title: "Interested in a departure?",
      subtitle: "Real-time advice with our specialised team.",
      body: "Reach out — no commitment — to reserve a spot, request the full dossier of a departure or design a private departure for your group.",
      phone_label: "Phone", email_label: "Email", hours_label: "Hours",
      hours_value: "Mon – Fri · 10:00 – 20:00",
      cta_primary: "Reserve a spot",
    },
  },
  fr: {
    docTitle: "Prochains départs au Maroc · Xaluca Tours",
    hero: {
      eyebrow: "Départs en groupe · Dates fixes",
      place: "Pâques · Été · Nouvel An",
      title: "Prochains départs au Maroc.",
      subtitle: "Dates fixes, petits groupes et expériences conçues autour des moments forts de l'année.",
      intro: "Itinéraires soigneusement organisés par notre équipe avec des départs en groupe autour de moments spécifiques — Nouvel An, Pâques, été, ponts et autres occasions tout au long de l'année.",
      primaryCta: "Voir les départs disponibles", secondaryCta: "Demander conseil", scroll: "Faites défiler",
    },
    nav: { departures: "Départs", filters: "Filtres", process: "Comment réserver", why: "Pourquoi", community: "Contact" },
    filters: { all: { fr: "Tous" }, easter: "Pâques", summer: "Été", bridge: "Pont", nye: "Nouvel An", carnival: "Carnaval" },
    list: {
      overline: "Calendrier des départs",
      title: "Choisissez votre date.",
      body: "Chaque départ a des places limitées. Réservez avec un acompte réduit et le solde 30 jours avant le départ.",
      filter_label: "Filtrer par saison",
      reserve: "Réserver une place",
      detail: "Voir l'itinéraire",
      from: "Dès",
      per_person: "par personne",
      deposit: "Acompte",
      spots_left: "places disponibles",
      spots_left_one: "place disponible",
      capacity: "d'un groupe de",
      route: "Itinéraire",
      highlights: "Points forts",
      duration_label: "Durée",
      status_open: "Ouvert",
      status_last: "Dernières places",
      status_sold: "Complet",
      no_results: "Aucun départ pour ce filtre. Essayez une autre saison.",
    },
    process: {
      overline: "Comment réserver",
      title: "Trois étapes pour bloquer votre place.",
      body: "Aucune surprise : acompte réduit à la réservation, solde 30 jours avant le départ et assistance 24/7 pendant tout le voyage.",
      steps: [
        { n: "01", title: "Choisissez votre départ", body: "Sélectionnez la date qui correspond le mieux à votre agenda et confirmez les places nécessaires." },
        { n: "02", title: "Confirmez avec acompte", body: "Sécurisez votre place avec un acompte dès 300 €. Vous recevrez le carnet de voyage et la liste de bagages." },
        { n: "03", title: "Voyagez avec Xaluca", body: "Solde 30 jours avant le départ. Nous vous accompagnons avant, pendant et après le voyage." },
      ],
    },
    why: {
      overline: "Pourquoi voyager en groupe avec Xaluca",
      title: "Petits groupes, attention soignée.",
      pillars: [
        { icon: "Users",       title: "Petits groupes",         body: "Max 14 voyageurs par départ. Attention personnelle garantie." },
        { icon: "Calendar",    title: "Dates confirmées",       body: "Départs fermés avec vols, hôtels et guides déjà réservés." },
        { icon: "ShieldCheck", title: "Garantie Grup Xaluca",   body: "Nos propres hôtels et campements dans le sud du Maroc." },
        { icon: "Flame",       title: "Expériences singulières",body: "Dîners, concerts Gnawa et nuits dans le désert réservés exclusivement au groupe." },
      ],
    },
    community: {
      overline: "Rejoignez notre communauté de voyageurs",
      title: "Un départ vous intéresse ?",
      subtitle: "Conseil en temps réel avec notre équipe spécialisée.",
      body: "Contactez-nous sans engagement pour réserver une place, demander le dossier complet d'un départ ou concevoir un départ privé pour votre groupe.",
      phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
      hours_value: "Lun – Ven · 10h – 20h",
      cta_primary: "Réserver une place",
    },
  },
};

const ICONS = { Users, Calendar, ShieldCheck, Flame };

// Filter slug from departure id.
const seasonOf = (id) => {
  if (id.includes("easter"))    return "easter";
  if (id.includes("summer"))    return "summer";
  if (id.includes("bridge"))    return "bridge";
  if (id.includes("nye"))       return "nye";
  if (id.includes("carnival"))  return "carnival";
  return "other";
};

/* ============================================================
   Departure card
============================================================ */
const DepartureCard = ({ dep, t, lang }) => {
  const statusLabel =
    dep.status === "last" ? t.status_last :
    dep.status === "sold-out" ? t.status_sold :
    t.status_open;
  const statusColor =
    dep.status === "last" ? "#C16542" :
    dep.status === "sold-out" ? "#8C8C8C" :
    "#5A6B4F";
  const spotsLabel = dep.spots === 1 ? t.spots_left_one : t.spots_left;
  const highlights = pick(dep.highlights, lang);

  return (
    <article
      data-testid={`departure-card-${dep.id}`}
      className="group grid grid-cols-1 lg:grid-cols-12 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10 overflow-hidden"
    >
      {/* Image side */}
      <div className="lg:col-span-5 relative bg-[#1A1513] overflow-hidden min-h-[280px] lg:min-h-[420px]">
        <img
          src={dep.image}
          alt={pick(dep.title, lang)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/15 to-transparent" />
        <span className="film-grain" />
        {/* Season badge */}
        <span
          className="absolute top-5 left-5 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase"
          style={{ color: dep.badgeColor }}
        >
          {pick(dep.badge, lang)}
        </span>
        {/* Status pill */}
        <span
          className="absolute top-5 right-5 inline-flex items-center gap-2 bg-[#1A1513]/65 backdrop-blur-md text-[#FDFBF7] px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase border"
          style={{ borderColor: `${statusColor}80`, color: statusColor === "#8C8C8C" ? "#FDFBF7" : "#FDFBF7" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
          {statusLabel}
        </span>
        {/* Bottom info */}
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[#FDFBF7]">
          <div>
            <p className="font-serif-x text-2xl md:text-[28px] leading-[1.05]">
              {pick(dep.title, lang)}
            </p>
          </div>
        </div>
      </div>

      {/* Detail side */}
      <div className="lg:col-span-7 bg-[#FDFBF7] p-7 md:p-10 flex flex-col gap-5">
        {/* Meta row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] tracking-[0.25em] uppercase">
          <div>
            <p className="text-[#5C5248] mb-1.5 inline-flex items-center gap-2">
              <Calendar className="w-3 h-3" strokeWidth={1.6} style={{ color: dep.badgeColor }} />
              {pick(dep.badge, lang)}
            </p>
            <p className="text-[#2C2621] font-serif-x text-sm normal-case tracking-normal">{pick(dep.dates, lang)}</p>
          </div>
          <div>
            <p className="text-[#5C5248] mb-1.5 inline-flex items-center gap-2">
              <Clock className="w-3 h-3" strokeWidth={1.6} style={{ color: dep.badgeColor }} />
              {t.duration_label}
            </p>
            <p className="text-[#2C2621] font-serif-x text-sm normal-case tracking-normal">{pick(dep.nights, lang)}</p>
          </div>
          <div>
            <p className="text-[#5C5248] mb-1.5 inline-flex items-center gap-2">
              <Users className="w-3 h-3" strokeWidth={1.6} style={{ color: dep.badgeColor }} />
              {t.spots_left}
            </p>
            <p className="text-[#2C2621] font-serif-x text-sm normal-case tracking-normal">
              <b style={{ color: dep.spots <= 3 ? "#C16542" : "#2C2621" }}>{dep.spots}</b> {t.capacity} {dep.capacity}
            </p>
          </div>
          <div>
            <p className="text-[#5C5248] mb-1.5 inline-flex items-center gap-2">
              <Sparkles className="w-3 h-3" strokeWidth={1.6} style={{ color: dep.badgeColor }} />
              {t.from}
            </p>
            <p className="text-[#2C2621] font-serif-x text-base normal-case tracking-normal">
              €{dep.price.toLocaleString()}
              <span className="block text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">{t.per_person}</span>
            </p>
          </div>
        </div>

        {/* Route */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2 inline-flex items-center gap-2">
            <MapPin className="w-3 h-3" strokeWidth={1.6} style={{ color: dep.badgeColor }} />
            {t.route}
          </p>
          <p className="text-[15px] text-[#2C2621] leading-relaxed">{pick(dep.route, lang)}</p>
        </div>

        {/* Highlights */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">{t.highlights}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-[#5C5248]">
            {highlights.map((h, i) => (
              <li key={pick(h, 'es') + i} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 mt-1 shrink-0" strokeWidth={2} style={{ color: dep.badgeColor }} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deposit + CTAs */}
        <div className="mt-auto pt-5 border-t border-[#2C2621]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-[#5C5248]">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]/80 block mb-0.5">{t.deposit}</span>
            <span className="font-serif-x text-lg text-[#2C2621]">€{dep.deposit}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#form"
              data-testid={`departure-cta-reserve-${dep.id}`}
              className={`inline-flex items-center gap-3 px-6 py-3 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${
                dep.status === "sold-out"
                  ? "bg-[#2C2621]/15 text-[#2C2621]/45 pointer-events-none"
                  : "bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7]"
              }`}
            >
              {t.reserve}
              <ArrowRight className="w-3 h-3" strokeWidth={1.6} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ============================================================
   Process timeline
============================================================ */
const ProcessTimeline = ({ t }) => (
  <section
    id="process"
    data-testid="upcoming-process"
    className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-diamond opacity-30" aria-hidden="true" />
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
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {t.steps.map((s, i) => (
          <li
            key={`upcoming-step-${i}`}
            data-testid={`upcoming-step-${i + 1}`}
            className="relative bg-[#FDFBF7] p-7 md:p-9 flex flex-col gap-5"
          >
            <span className="font-serif-x text-6xl md:text-7xl leading-none text-[#C16542]/85">{s.n}</span>
            <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1] text-[#2C2621]">{s.title}</h3>
            <p className="text-sm leading-relaxed text-[#5C5248]">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/* ============================================================
   Why pillars (dark variant)
============================================================ */
const WhyPillars = ({ t }) => (
  <section
    id="why"
    data-testid="upcoming-why"
    className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
  >
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="overline text-[#D4A373]">{t.overline}</span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5">
          {t.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15">
        {t.pillars.map((p, i) => {
          const Icon = ICONS[p.icon] || ShieldCheck;
          return (
            <article
              key={`upcoming-pillar-${i}`}
              data-testid={`upcoming-pillar-${i}`}
              className="bg-[#1A1513] hover:bg-[#221A16] transition-colors duration-500 p-7 md:p-9 flex flex-col gap-4"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D4A373]/50 text-[#D4A373]">
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </span>
              <h3 className="font-serif-x text-xl md:text-[22px] leading-[1.1]">{p.title}</h3>
              <p className="text-sm leading-relaxed text-[#FDFBF7]/75">{p.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

/* ============================================================
   Departures list with season filter
============================================================ */
const DeparturesList = ({ t, filters_t, lang }) => {
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => {
    if (filter === "all") return UPCOMING_DEPARTURES;
    return UPCOMING_DEPARTURES.filter((d) => seasonOf(d.id) === filter);
  }, [filter]);

  const allLabel = pick(filters_t.all, lang) || "Todas";
  const filterChips = [
    { id: "all",      label: allLabel },
    { id: "easter",   label: filters_t.easter },
    { id: "summer",   label: filters_t.summer },
    { id: "bridge",   label: filters_t.bridge },
    { id: "nye",      label: filters_t.nye },
    { id: "carnival", label: filters_t.carnival },
  ];

  return (
    <section
      id="departures"
      data-testid="upcoming-departures-list"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />
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

        {/* Filter chips */}
        <div id="filters" className="flex flex-wrap gap-2 mb-10" data-testid="upcoming-filters">
          <span className="self-center text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mr-2">
            {t.filter_label} ·
          </span>
          {filterChips.map((c) => (
            <button
              key={c.id}
              data-testid={`upcoming-filter-${c.id}`}
              onClick={() => setFilter(c.id)}
              className={`text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-colors duration-300 ${
                filter === c.id
                  ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                  : "bg-transparent text-[#2C2621] border-[#2C2621]/20 hover:border-[#2C2621]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <p className="text-center text-base text-[#5C5248] py-16 italic">{t.no_results}</p>
        ) : (
          <div className="space-y-8">
            {filtered.map((d) => (
              <DepartureCard key={d.id} dep={d} t={t} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ============================================================
   Page
============================================================ */
export default function ProximasSalidasPage() {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.es;

  useEffect(() => {
    document.title = t.docTitle;
    window.scrollTo(0, 0);
  }, [t.docTitle]);

  const navItems = [
    { id: "departures", label: t.nav.departures },
    { id: "filters",    label: t.nav.filters },
    { id: "process",    label: t.nav.process },
    { id: "why",        label: t.nav.why },
    { id: "community",  label: t.nav.community },
  ];

  return (
    <div data-testid="upcoming-page">
      <JourneyHero
        image="https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85"
        eyebrow={t.hero.eyebrow}
        place={t.hero.place}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        intro={t.hero.intro}
        primaryCta={t.hero.primaryCta}
        primaryHref="#departures"
        secondaryCta={t.hero.secondaryCta}
        secondaryHref="#community"
        scroll={t.hero.scroll}
        testid="upcoming-hero"
      />

      <StickyNav items={navItems} testid="upcoming-nav" />

      <DeparturesList t={t.list} filters_t={t.filters} lang={lang} />

      <ProcessTimeline t={t.process} />

      <WhyPillars t={t.why} />

      <CommunityCta
        t={t.community}
        lang={lang}
        image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85"
        testid="upcoming-community"
      />

      <div id="form"><ContactForm /></div>
    </div>
  );
}
