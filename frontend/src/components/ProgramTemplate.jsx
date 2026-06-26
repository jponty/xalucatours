import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight, Compass, ChevronDown, ChevronUp, MapPin, Plane, Clock,
  Calendar, Mountain, Sparkles, Phone, Mail, MessageCircle, Camera, Download, Tag, Headset,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor, resolvePath } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { StickyNav } from "@/components/JourneyPageSections";
import { SHARED_DETAILS } from "@/lib/programData";
import { DayRouteMap } from "@/components/DayRouteMap";
import { DayGallery } from "@/components/DayGallery";
import { TripOverview } from "@/components/TripOverview";
import ProgramFlipbook from "@/components/ProgramFlipbook";
import { TripRouteMap } from "@/components/TripRouteMap";
import ContactForm from "@/components/ContactForm";
import HubPeerNav from "@/components/HubPeerNav";
import RelatedJourneys from "@/components/RelatedJourneys";
import TripPostcards from "@/components/TripPostcards";
import { deriveTripRoute } from "@/lib/deriveTripRoute";
import { useSlotId } from "@/components/EditableSection";
import { tripHeroSlot, tripHeroImage } from "@/lib/tripHero";
import EditableImage from "@/components/EditableImage";
import { DayImageGallery } from "@/components/DayImageGallery";
import DayTravelNotes from "@/components/DayTravelNotes";
import DayTestimonial from "@/components/DayTestimonial";
import DayCultureCTA from "@/components/DayCultureCTA";
import EditableText from "@/components/EditableText";
import PricingSection from "@/components/PricingSection";
import FromPrice from "@/components/FromPrice";
import DownloadProgramModal from "@/components/DownloadProgramModal";
import VideoSection from "@/components/VideoSection";

const DOWNLOAD_LABEL = { es: "Descargar programa", en: "Download programme", fr: "Télécharger le programme" };
const ASSISTANT_LABEL = { es: "Asistente Virtual", en: "Virtual Assistant", fr: "Assistant Virtuel" };
const CONTACT_LABEL = { es: "Contactar", en: "Contact us", fr: "Contacter" };

// Open the Chatbase virtual assistant (centralised in lib/chatbase).
import { openChatbaseAssistant } from "@/lib/chatbase";

const PRICE_LABEL = { es: "Precio", en: "Price", fr: "Prix" };

/* Pull a trilingual field {es,en,fr} out of a program's `meta` override
 * or fall back to the variant copy block. Used to feed defaults={...}
 * to inline <E> editors so editing persists per language. */
import { metaAllLangs, VARIANT_COPY } from "@/lib/programMeta";

const LABELS = {
  es: {
    eyebrow_duration: "Duración", eyebrow_airports: "Aeropuertos", eyebrow_highlights: "Lugares destacados",
    cta_primary: "Solicitar información", cta_secondary: "Ver programa completo", scroll: "Desplázate",
    nav_description: "El viaje", nav_quick: "Datos", nav_itinerary: "Itinerario",
    nav_pricing: "Precios", nav_includes: "Incluye", nav_contact: "Contacto",
    desc_overline: "Descripción del viaje",
    quick_overline: "Información rápida", quick_title: "Lo esencial del viaje.",
    card_duration: "Duración", card_places: "Lugares", card_airports: "Aeropuertos",
    card_type: "Tipo", card_experiences: "Experiencias",
    type_da: "Desierto + Atlas", type_ad: "Atlas + Desierto", type_frz: "Fez · Erg Chebbi · Marrakech", type_frm: "Marrakech · Erg Chebbi · Fez", type_me: "Marrakech · Atlas · Erg Chebbi", type_em: "Erg Chebbi · Atlas · Marrakech", type_mem: "Marrakech · Erg Chebbi · Marrakech", type_mes: "Marrakech · Essaouira · Marrakech", type_fae: "Fez · Alto Atlas · Erg Chebbi · Errachidia", type_eaf: "Errachidia · Erg Chebbi · Alto Atlas · Fez", type_atlas: "Alto Atlas · Drâa", type_desierto: "Sáhara · Erg Chebbi", type_fez: "Medina de Fez · UNESCO", type_rak: "Marrakech · ciudad imperial", type_raga: "Marrakech · Agafay", type_enduro: "Enduro · Erg Chebbi · Saghro · Anti Atlas",
    experiences_value: "4x4 · dromedarios · bivouac · pueblos bereberes · gargantas · oasis",
    itinerary_overline: "Itinerario completo", itinerary_title: "Día a día, sin atajos.",
    culture_label: "Bloques culturales destacados",
    wellness_label: "Wellness en el hotel",
    pricing_overline: "Precios y personalización",
    pricing_title: "Diseñado a medida para cada viajero.",
    pricing_body: "En Xaluca Tours, todos los programas se diseñan de manera personalizada adaptándose a cada viajero. Los precios indicados son orientativos por persona en habitación doble — consulta categorías superiores, suplementos individuales y servicios opcionales.",
    pricing_from: "Desde", pricing_per: "por persona", pricing_cta: "Ver programa con detalle de precios",
    pricing_season: "Temporada", pricing_months: "Meses orientativos",
    details_overline: "El viaje incluye", details_title: "Todos los detalles, sobre la mesa.",
    tab_includes: "Qué incluye", tab_excludes: "Qué no incluye",
    tab_notes: "Notas importantes", tab_terms: "Condiciones & cancelación",
    contact_overline: "¿Te interesa este viaje por Marruecos?",
    contact_title: "Empieza a planificar tu próxima aventura.",
    contact_body: "Contacta sin compromiso con el equipo de Xaluca Tours para empezar a planificar los detalles de tu viaje.",
    cta_budget: "Solicitar presupuesto", cta_appointment: "Reservar cita", cta_form: "Rellenar formulario",
    phone_label: "Teléfono", email_label: "Email", hours_label: "Horario",
    hours_value: "Lun – Vie · 10h – 20h",
    day_label: "Día",
  },
  en: {
    eyebrow_duration: "Duration", eyebrow_airports: "Airports", eyebrow_highlights: "Highlights",
    cta_primary: "Request information", cta_secondary: "Full programme", scroll: "Scroll",
    nav_description: "The trip", nav_quick: "Quick facts", nav_itinerary: "Itinerary",
    nav_pricing: "Pricing", nav_includes: "Includes", nav_contact: "Contact",
    desc_overline: "Trip description",
    quick_overline: "Quick facts", quick_title: "The essentials.",
    card_duration: "Duration", card_places: "Places", card_airports: "Airports",
    card_type: "Type", card_experiences: "Experiences",
    type_da: "Desert + Atlas", type_ad: "Atlas + Desert", type_frz: "Fez · Erg Chebbi · Marrakech", type_frm: "Marrakech · Erg Chebbi · Fez", type_me: "Marrakech · Atlas · Erg Chebbi", type_em: "Erg Chebbi · Atlas · Marrakech", type_mem: "Marrakech · Erg Chebbi · Marrakech", type_mes: "Marrakech · Essaouira · Marrakech", type_fae: "Fez · High Atlas · Erg Chebbi · Errachidia", type_eaf: "Errachidia · Erg Chebbi · High Atlas · Fez", type_atlas: "High Atlas · Drâa", type_desierto: "Sahara · Erg Chebbi", type_fez: "Fez Medina · UNESCO", type_rak: "Marrakech · imperial city", type_raga: "Marrakech · Agafay", type_enduro: "Enduro · Erg Chebbi · Saghro · Anti Atlas",
    experiences_value: "4x4 · camels · bivouac · Berber villages · gorges · oases",
    itinerary_overline: "Full itinerary", itinerary_title: "Day by day, no shortcuts.",
    culture_label: "Cultural highlights", wellness_label: "Hotel wellness",
    pricing_overline: "Pricing & personalisation",
    pricing_title: "Tailor-made for every traveller.",
    pricing_body: "Every Xaluca Tours programme is designed personally for each traveller. Prices shown are guideline per person in double room — ask about higher accommodation categories, single supplements and optional services.",
    pricing_from: "From", pricing_per: "per person", pricing_cta: "See full pricing detail",
    pricing_season: "Season", pricing_months: "Indicative months",
    details_overline: "The trip includes", details_title: "Every detail, on the table.",
    tab_includes: "What's included", tab_excludes: "What's not included",
    tab_notes: "Important notes", tab_terms: "Terms & cancellation",
    contact_overline: "Interested in this Moroccan journey?",
    contact_title: "Start planning your next adventure.",
    contact_body: "Reach out — no commitment — to the Xaluca Tours team and start sketching the details of your trip.",
    cta_budget: "Request quote", cta_appointment: "Book an appointment", cta_form: "Fill the form",
    phone_label: "Phone", email_label: "Email", hours_label: "Hours",
    hours_value: "Mon – Fri · 10:00 – 20:00",
    day_label: "Day",
  },
  fr: {
    eyebrow_duration: "Durée", eyebrow_airports: "Aéroports", eyebrow_highlights: "Points forts",
    cta_primary: "Demander des infos", cta_secondary: "Programme complet", scroll: "Faites défiler",
    nav_description: "Le voyage", nav_quick: "Infos", nav_itinerary: "Itinéraire",
    nav_pricing: "Tarifs", nav_includes: "Inclus", nav_contact: "Contact",
    desc_overline: "Description du voyage",
    quick_overline: "Infos rapides", quick_title: "L'essentiel.",
    card_duration: "Durée", card_places: "Lieux", card_airports: "Aéroports",
    card_type: "Type", card_experiences: "Expériences",
    type_da: "Désert + Atlas", type_ad: "Atlas + Désert", type_frz: "Fès · Erg Chebbi · Marrakech", type_frm: "Marrakech · Erg Chebbi · Fès", type_me: "Marrakech · Atlas · Erg Chebbi", type_em: "Erg Chebbi · Atlas · Marrakech", type_mem: "Marrakech · Erg Chebbi · Marrakech", type_mes: "Marrakech · Essaouira · Marrakech", type_fae: "Fès · Haut Atlas · Erg Chebbi · Errachidia", type_eaf: "Errachidia · Erg Chebbi · Haut Atlas · Fès", type_atlas: "Haut Atlas · Drâa", type_desierto: "Sahara · Erg Chebbi", type_fez: "Médina de Fès · UNESCO", type_rak: "Marrakech · cité impériale", type_raga: "Marrakech · Agafay", type_enduro: "Enduro · Erg Chebbi · Saghro · Anti Atlas",
    experiences_value: "4x4 · dromadaires · bivouac · villages berbères · gorges · oasis",
    itinerary_overline: "Itinéraire complet", itinerary_title: "Jour après jour.",
    culture_label: "Points culturels", wellness_label: "Bien-être à l'hôtel",
    pricing_overline: "Tarifs et personnalisation",
    pricing_title: "Sur mesure pour chaque voyageur.",
    pricing_body: "Chaque programme Xaluca Tours est conçu personnellement pour chaque voyageur. Les prix indiqués sont des références par personne en chambre double — demandez catégories supérieures, suppléments et services optionnels.",
    pricing_from: "Dès", pricing_per: "par personne", pricing_cta: "Voir le détail des tarifs",
    pricing_season: "Saison", pricing_months: "Mois indicatifs",
    details_overline: "Le voyage inclut", details_title: "Tous les détails, sur la table.",
    tab_includes: "Ce qui est inclus", tab_excludes: "Ce qui n'est pas inclus",
    tab_notes: "Notes importantes", tab_terms: "Conditions & annulation",
    contact_overline: "Ce voyage au Maroc vous intéresse ?",
    contact_title: "Commencez à planifier votre prochaine aventure.",
    contact_body: "Contactez sans engagement l'équipe Xaluca Tours pour démarrer les détails de votre voyage.",
    cta_budget: "Demander un devis", cta_appointment: "Prendre rendez-vous", cta_form: "Remplir le formulaire",
    phone_label: "Téléphone", email_label: "Email", hours_label: "Horaires",
    hours_value: "Lun – Ven · 10h – 20h",
    day_label: "Jour",
  },
};

/* ============================================================
   Inline-CMS text helpers
   ---------------------------------------------------------------
   <L> — Global UI label, shared across EVERY program page. Editing
         it once updates the label on all 56 itineraries.
         Slot: `program-ui.<k>`  (bypasses the page namespace).
   <C> — Per-page CONTENT text. Auto-namespaced by the current page
         path so each itinerary keeps its own copy.
         Slot: `<page>.program.<name>`.
   <G> — Global content text keyed by an explicit id (used for data
         shared across pages, e.g. seasons). Slot: `program-ui.<k>`.
============================================================ */
const L = ({ k, as = "span", className, multiline = false, ...rest }) => (
  <EditableText
    slot={`program-ui.${k}`}
    defaults={{ es: LABELS.es[k], en: LABELS.en[k], fr: LABELS.fr[k] }}
    as={as}
    multiline={multiline}
    className={className}
    {...rest}
  />
);

const C = ({ name, defaults, as = "span", className, multiline = true, ...rest }) => {
  const slot = useSlotId(`program.${name}`);
  return (
    <EditableText slot={slot} defaults={defaults || {}} as={as} multiline={multiline} className={className} {...rest} />
  );
};

const G = ({ k, defaults, as = "span", className, multiline = false, ...rest }) => (
  <EditableText
    slot={`program-ui.${k}`}
    defaults={defaults || {}}
    as={as}
    multiline={multiline}
    className={className}
    {...rest}
  />
);

/* ============================================================
   Hero
============================================================ */
const ProgramHero = ({ vt, t, program, lang, variant, routeId, onDownload }) => {
  // MASTER trip image: a single global slot shared by the Hero and every
  // card/listing of this trip across the site (see lib/tripHero.js), so
  // editing it anywhere updates everywhere automatically.
  const heroSlot = tripHeroSlot(routeId);
  return (
  <section data-testid="program-hero" className="relative min-h-[100svh] w-full overflow-hidden bg-[#1A1513]">
    <EditableImage
      slot={heroSlot}
      fallback={tripHeroImage(routeId) || vt.hero_image}
      alt=""
      aspectRatio="21/9"
      priority
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/35 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />
    <div className="relative z-10 min-h-[100svh] flex flex-col">
      <div className="flex-1 flex items-end pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-4xl">
            <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">
                <C name="hero.eyebrow" defaults={metaAllLangs(program, variant, "eyebrow_prefix")} multiline={false} /> · <C name="hero.duration" defaults={program.duration} multiline={false} />
              </span>
              <span className="w-8 h-px bg-[#D4A373]/50" />
              <C name="hero.place" defaults={metaAllLangs(program, variant, "place")} multiline={false} className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80" />
            </div>
            <h1 className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-on-image text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6">
              <C name="hero.title" defaults={metaAllLangs(program, variant, "title")} multiline={false} />
            </h1>
            <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/90 leading-relaxed text-on-image">
              <C name="hero.subtitle" defaults={metaAllLangs(program, variant, "subtitle")} />
            </p>
            <dl className="fade-up fade-up-delay-3 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15 max-w-3xl">
              {[
                { id: "duration",   Icon: Clock,    label: <L k="eyebrow_duration" />,   value: <C name="hero.q.duration" defaults={program.duration} multiline={false} /> },
                { id: "airports",   Icon: Plane,    label: <L k="eyebrow_airports" />,   value: <C name="hero.q.airports" defaults={metaAllLangs(program, variant, "airports")} multiline={false} /> },
                { id: "highlights", Icon: Sparkles, label: <L k="eyebrow_highlights" />, value: <C name="hero.q.highlights" defaults={metaAllLangs(program, variant, "highlights")} multiline={false} /> },
              ].map(({ id, Icon, label, value }) => (
                <div key={id} className="bg-[#1A1513]/80 backdrop-blur-md p-5 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#D4A373]">
                    <Icon className="w-3 h-3" strokeWidth={1.6} />{label}
                  </div>
                  <span className="text-sm md:text-[15px] text-[#FDFBF7] leading-snug">{value}</span>
                </div>
              ))}
              {/* Price "from" — anchors to the full pricing table */}
              <a
                href="#pricing"
                data-testid="program-hero-price"
                className="group bg-[#1A1513]/80 hover:bg-[#C16542]/90 backdrop-blur-md p-5 flex flex-col gap-2 transition-colors"
              >
                <div className="inline-flex items-center justify-between gap-2 text-[10px] tracking-[0.3em] uppercase text-[#D4A373] group-hover:text-[#FDFBF7] transition-colors">
                  <span className="inline-flex items-center gap-2"><Tag className="w-3 h-3" strokeWidth={1.6} />{pick(PRICE_LABEL, lang)}</span>
                  <ArrowRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" strokeWidth={1.7} />
                </div>
                <span className="text-sm md:text-[15px] text-[#FDFBF7] leading-snug">
                  <FromPrice tone="light" layout="stacked" routeId={routeId} testid="program-hero-from-price" />
                </span>
              </a>
            </dl>
          </div>
          {/* Action buttons live OUTSIDE the max-w-4xl text column so they can
              use the full content width and sit on a single row on desktop;
              flex-wrap reflows them cleanly (no clipping/overlap) on tablet/mobile. */}
          <div className="fade-up fade-up-delay-4 mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link to={pathFor(lang, "contact")} data-testid="program-hero-cta-primary"
               className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-6 lg:px-7 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors whitespace-nowrap">
              <L k="cta_primary" /><ArrowRight className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
            </Link>
            <a href="#itinerary" data-testid="program-hero-cta-secondary"
               className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-6 lg:px-7 py-4 text-[11px] tracking-[0.22em] uppercase transition-all duration-300 whitespace-nowrap">
              <L k="cta_secondary" /><ArrowRight className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            </a>
            <button type="button" onClick={onDownload} data-testid="program-hero-download"
               className="inline-flex items-center gap-3 bg-[#FDFBF7] hover:bg-[#D4A373] text-[#1A1513] px-6 lg:px-7 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors whitespace-nowrap">
              {pick(DOWNLOAD_LABEL, lang)}<Download className="w-3.5 h-3.5 shrink-0" strokeWidth={1.7} />
            </button>
            <button type="button" onClick={openChatbaseAssistant} data-testid="program-hero-assistant"
               className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-6 lg:px-7 py-4 text-[11px] tracking-[0.22em] uppercase transition-all duration-300 whitespace-nowrap">
              <Headset className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />{pick(ASSISTANT_LABEL, lang)}
            </button>
          </div>
        </div>
      </div>
      <a href="#description" className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 text-[#FDFBF7]/65 hover:text-[#D4A373] transition-colors">
        <L k="scroll" className="text-[10px] tracking-[0.35em] uppercase" />
        <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={1.5} />
      </a>
    </div>
  </section>
  );
};

const Description = ({ vt, t, program, variant }) => {
  const descAll = metaAllLangs(program, variant, "description");
  const descLen = Array.isArray(vt.description) ? vt.description.length : 0;
  return (
    <section id="description" data-testid="program-description"
             className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
        <L k="desc_overline" className="overline" />
        <C
          name="desc.title"
          as="h2"
          multiline={false}
          defaults={metaAllLangs(program, variant, "description_title")}
          className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]"
        />
        <div className="mt-8 space-y-5 text-[15px] md:text-base text-[#5C5248] leading-[1.85]">
          {Array.from({ length: descLen }).map((_, i) => (
            <C
              key={`desc-${i}`}
              name={`desc.p${i}`}
              as="p"
              defaults={{
                es: (descAll.es || [])[i] || "",
                en: (descAll.en || [])[i] || "",
                fr: (descAll.fr || [])[i] || "",
              }}
              className={i === 0 ? "font-serif-x-italic text-xl md:text-2xl text-[#C16542]" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TYPE_KEY = {
  frz: "type_frz", frm: "type_frm", me: "type_me", em: "type_em", mem: "type_mem",
  mes: "type_mes", fae: "type_fae", eaf: "type_eaf", atlas: "type_atlas",
  desierto: "type_desierto", fez: "type_fez", rak: "type_rak", raga: "type_raga",
  enduro: "type_enduro", ad: "type_ad", da: "type_da",
};

const QuickInfo = ({ t, vt, program, lang, variant }) => {
  const typeKey = TYPE_KEY[variant] || "type_da";
  const cards = [
    { id: "duration",    Icon: Clock,    label: <L k="card_duration" />,    value: <C name="quick.duration" defaults={program.duration} multiline={false} /> },
    { id: "places",      Icon: MapPin,   label: <L k="card_places" />,      value: <C name="quick.places" defaults={metaAllLangs(program, variant, "quick_places")} /> },
    { id: "airports",    Icon: Plane,    label: <L k="card_airports" />,    value: <C name="quick.airports" defaults={metaAllLangs(program, variant, "quick_airports")} multiline={false} /> },
    { id: "type",        Icon: Mountain, label: <L k="card_type" />,        value: <L k={typeKey} /> },
    { id: "experiences", Icon: Sparkles, label: <L k="card_experiences" />, value: <L k="experiences_value" multiline /> },
  ];
  return (
    <section id="quick" data-testid="program-quick"
             className="relative bg-[#F2EBE1] py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 berber-bg-diamond opacity-30 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <L k="quick_overline" className="overline" />
          <L k="quick_title" as="h2" className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
          {cards.map((c, i) => (
            <div key={c.id} data-testid={`program-quick-${i}`}
                 className="bg-[#FDFBF7] p-5 md:p-6 flex flex-col gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#C16542]/40 text-[#C16542]">
                <c.Icon className="w-4 h-4" strokeWidth={1.6} />
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">{c.label}</span>
              <span className="font-serif-x text-[15px] leading-snug text-[#2C2621]">{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DayBlock = ({ day, idx, total, lang, t, routeId, hideDayGallery = false }) => {
  const reverse = idx % 2 === 1;
  const dayNum = String(idx + 1).padStart(2, "0");
  return (
    <article id={day.id} data-testid={`program-day-${day.id}`}
             className="relative bg-[#FDFBF7] py-20 md:py-24 overflow-hidden border-b border-[#2C2621]/10">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <div className="lg:col-span-6 lg:[direction:ltr]">
            <DayImageGallery day={day} dayLabel={t.day_label} dayNum={dayNum} dayIndex={idx + 1} />
            <DayTravelNotes routeId={routeId} dayId={day.id} dayIndex={idx + 1} />
          </div>
          <div className="lg:col-span-6 lg:[direction:ltr]">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase" style={{ color: day.accent }}>
              <span className="w-6 h-px" style={{ background: "currentColor" }} />
              <L k="day_label" /> {dayNum}
            </span>
            <C
              name={`day.${day.id}.title`}
              as="h3"
              multiline={false}
              defaults={day.title}
              className="font-serif-x text-3xl md:text-4xl lg:text-[42px] leading-[1.1] tracking-tight mt-5 text-[#2C2621]"
            />
            <C
              name={`day.${day.id}.body`}
              as="p"
              defaults={day.body}
              className="mt-8 text-[15px] md:text-base text-[#5C5248] leading-[1.85]"
            />
            {day.wellness && (
              <div className="mt-8">
                <L k="wellness_label" as="p" className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3" />
                <ul className="flex flex-wrap gap-2">
                  {day.wellness.map((w, i) => (
                    <C
                      key={`${day.id}-w-${i}`}
                      name={`day.${day.id}.wellness.${i}`}
                      as="li"
                      multiline={false}
                      defaults={w}
                      className="text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 border"
                      style={{ borderColor: `${day.accent}55`, color: day.accent }}
                    />
                  ))}
                </ul>
              </div>
            )}
            {day.culture && day.culture.length > 0 && (
              <div className="mt-10">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-4 inline-flex items-center gap-2">
                  <Camera className="w-3 h-3" strokeWidth={1.6} style={{ color: day.accent }} />
                  <L k="culture_label" />
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {day.culture.map((c, i) => (
                    <div key={`${day.id}-c-${i}`} className="bg-[#F2EBE1] border-l-2 p-5" style={{ borderColor: day.accent }}>
                      <C
                        name={`day.${day.id}.culture.${i}.title`}
                        as="p"
                        multiline={false}
                        defaults={c.title}
                        className="font-serif-x text-base md:text-lg text-[#2C2621] leading-snug"
                      />
                      <C
                        name={`day.${day.id}.culture.${i}.body`}
                        as="p"
                        defaults={c.body}
                        className="mt-2 text-sm text-[#5C5248] leading-relaxed"
                      />
                    </div>
                  ))}
                  {/* Balance the 2-col grid: when there's an odd number of
                      cultural blocks, fill the empty cell with a CTA card.
                      Applied to every programme. */}
                  {day.culture.length % 2 === 1 && (
                    <DayCultureCTA accent={day.accent} />
                  )}
                </div>
              </div>
            )}

            {/* Per-day action buttons — chat assistant + contact */}
            <div className="mt-10 pt-8 border-t border-[#2C2621]/10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openChatbaseAssistant}
                data-testid={`day-assistant-${day.id}`}
                className="inline-flex items-center gap-2.5 text-[#FDFBF7] px-6 py-3.5 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-90"
                style={{ background: day.accent }}
              >
                <Headset className="w-4 h-4" strokeWidth={1.6} />
                {pick(ASSISTANT_LABEL, lang)}
              </button>
              <Link
                to={`${pathFor(lang, "planTrip")}${routeId ? `?trip=${routeId}` : ""}`}
                data-testid={`day-contact-${day.id}`}
                className="inline-flex items-center gap-2.5 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-6 py-3.5 text-[10px] tracking-[0.25em] uppercase transition-all duration-300"
              >
                <Mail className="w-4 h-4" strokeWidth={1.6} />
                {pick(CONTACT_LABEL, lang)}
              </Link>
            </div>

            {/* Day-specific traveller testimonial (pilot: only renders where
                a testimonial is defined for this trip + day). */}
            <DayTestimonial routeId={routeId} day={day} dayIndex={idx + 1} accent={day.accent} />
          </div>
        </div>
      </div>
      <DayRouteMap day={day} idx={idx} total={total} accent={day.accent} />
      {/* DayGallery hidden on a per-page basis (e.g. tourMarrakechErg56).
          Section/code/data kept intact for easy re-enabling later. */}
      {!hideDayGallery && (
        <DayGallery day={day} accent={day.accent} dayNumber={idx + 1} />
      )}
    </article>
  );
};

/* Sticky horizontal day timeline — sits right below the tabs nav and stays
   visible while the user scrolls the trip page. Each day jumps to its section. */
const DayTimeline = ({ days, lang, t }) => {
  if (!Array.isArray(days) || days.length === 0) return null;
  const jump = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 116; // clear sticky bars
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  return (
    <div
      data-testid="program-day-timeline"
      className="sticky top-[50px] md:top-[58px] z-20 bg-[#1A1513]/95 backdrop-blur-md border-y border-[#FDFBF7]/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-stretch gap-2 md:gap-2.5 overflow-x-auto py-2.5 md:py-3 no-scrollbar">
          {days.map((d, i) => (
            <a
              key={`${d.id}-${i}`}
              href={`#${d.id}`}
              onClick={(e) => jump(e, d.id)}
              data-testid={`day-timeline-item-${d.id}`}
              title={`${t.day_label} ${i + 1} · ${pick(d.title, lang)}`}
              className="group shrink-0 flex flex-col gap-0.5 px-3.5 py-2 border border-[#FDFBF7]/15 hover:border-[#D4A373] hover:bg-[#D4A373]/10 transition-colors min-w-[148px] max-w-[230px]"
            >
              <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-[#D4A373] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.accent || "#D4A373" }} />
                {t.day_label} {i + 1}
              </span>
              <span className="text-[11px] md:text-xs text-[#FDFBF7]/85 leading-snug truncate group-hover:text-[#FDFBF7]">
                {pick(d.title, lang)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const Itinerary = ({ t, lang, days, routeId, hideDayGallery = false }) => (
  <section id="itinerary" data-testid="program-itinerary"
           className="relative bg-[#FDFBF7] pt-20 md:pt-28">
    <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center mb-12">
      <L k="itinerary_overline" className="overline" />
      <L k="itinerary_title" as="h2" className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]" />
    </div>
    {days.map((d, i) => (
      <DayBlock key={`${d.id}-${i}`} day={d} idx={i} total={days.length} lang={lang} t={t} routeId={routeId} hideDayGallery={hideDayGallery} />
    ))}
  </section>
);

const DetailsAccordion = ({ t, lang, program }) => {
  const [open, setOpen] = useState("includes");
  const tabs = [
    { id: "includes", lk: "tab_includes" },
    { id: "excludes", lk: "tab_excludes" },
    { id: "notes",    lk: "tab_notes" },
    { id: "terms",    lk: "tab_terms" },
  ];
  return (
    <section id="includes" data-testid="program-details"
             className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <L k="details_overline" className="overline" />
          <L k="details_title" as="h2" className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]" />
        </div>
        <div className="border border-[#2C2621]/15">
          {tabs.map((tab) => {
            const isOpen = open === tab.id;
            const detailsObj = (program && program.details) || SHARED_DETAILS;
            const items = detailsObj[tab.id]?.[lang] || detailsObj[tab.id]?.es || [];
            return (
              <div key={tab.id} className="border-b border-[#2C2621]/10 last:border-b-0">
                <button data-testid={`program-detail-tab-${tab.id}`}
                        onClick={() => setOpen(isOpen ? null : tab.id)}
                        className="w-full px-6 md:px-8 py-5 flex items-center justify-between text-left hover:bg-[#F2EBE1] transition-colors">
                  <L k={tab.lk} className="font-serif-x text-lg md:text-xl text-[#2C2621]" />
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#C16542]" strokeWidth={1.6} /> : <ChevronDown className="w-4 h-4 text-[#5C5248]" strokeWidth={1.6} />}
                </button>
                {isOpen && (
                  <div className="px-6 md:px-8 pb-6 bg-[#FDFBF7]">
                    <ul className="space-y-3 text-[15px] text-[#5C5248] leading-relaxed">
                      {items.map((it, i) => (
                        <li key={`${tab.id}-${i}`} className="flex items-start gap-3">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C16542" }} />
                          <C
                            name={`details.${tab.id}.${i}`}
                            defaults={{
                              es: detailsObj[tab.id]?.es?.[i] || "",
                              en: detailsObj[tab.id]?.en?.[i] || "",
                              fr: detailsObj[tab.id]?.fr?.[i] || "",
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ContactBand = ({ t, lang }) => (
  <section id="contact" data-testid="program-contact"
           className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 berber-bg-diamond opacity-30" aria-hidden="true" />
    <div className="relative max-w-5xl mx-auto px-6 md:px-12">
      <div className="text-center max-w-3xl mx-auto">
        <L k="contact_overline" className="overline" />
        <L k="contact_title" as="h2" className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]" />
        <L k="contact_body" multiline as="p" className="mt-6 font-serif-x-italic text-xl md:text-2xl text-[#5C5248]" />
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
        <a href={`tel:${CONTACT.phoneRaw}`} data-testid="program-contact-phone"
           className="group bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#C16542]/40 p-6 md:p-7 transition-all duration-500">
          <L k="phone_label" className="overline" />
          <p className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#2C2621] group-hover:text-[#C16542] transition-colors">
            <Phone className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} />{CONTACT.phone}
          </p>
        </a>
        <a href={`mailto:${CONTACT.email}`} data-testid="program-contact-email"
           className="group bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#C16542]/40 p-6 md:p-7 transition-all duration-500">
          <L k="email_label" className="overline" />
          <p className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#2C2621] group-hover:text-[#C16542] transition-colors break-all">
            <Mail className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} />{CONTACT.email}
          </p>
        </a>
        <div className="bg-[#FDFBF7] border border-[#2C2621]/10 p-6 md:p-7">
          <L k="hours_label" className="overline" />
          <p className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#2C2621]">
            <Calendar className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} /><L k="hours_value" />
          </p>
        </div>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <a href="#form" data-testid="program-cta-budget"
           className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
          <L k="cta_budget" /><ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
        </a>
        <Link to={pathFor(lang, "appointment")} data-testid="program-cta-appointment"
              className="inline-flex items-center gap-3 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300">
          <Calendar className="w-3.5 h-3.5" strokeWidth={1.6} /><L k="cta_appointment" />
        </Link>
        <a href={`https://wa.me/${CONTACT.phoneRaw.replace("+", "")}`} target="_blank" rel="noreferrer"
           data-testid="program-cta-whatsapp"
           className="inline-flex items-center gap-3 border border-[#25D366]/60 hover:bg-[#25D366] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300">
          <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.6} />WhatsApp
        </a>
      </div>
    </div>
  </section>
);

/* ============================================================
   Default export — universal Program page template
============================================================ */
export default function ProgramTemplate({ program, variant = "da", flipbookSrc }) {
  const { lang } = useLanguage();
  const location = useLocation();
  const { routeId } = resolvePath(location.pathname);
  const t = LABELS[lang] || LABELS.es;
  const [downloadOpen, setDownloadOpen] = useState(false);
  const baseVt = (VARIANT_COPY[variant] && VARIANT_COPY[variant][lang]) || VARIANT_COPY.da.es;
  // Per-program meta overrides VARIANT_COPY (trilingual `meta: { es, en, fr }`)
  const metaOverride = program.meta && (program.meta[lang] || program.meta.es) || null;
  const vt = metaOverride ? { ...baseVt, ...metaOverride } : baseVt;

  useEffect(() => {
    document.title = `${vt.title} · ${pick(program.duration, lang)} · Xaluca Tours`;
    window.scrollTo(0, 0);
  }, [vt.title, program.duration, lang]);

  const navOverview = { es: "Resumen", en: "Overview", fr: "Résumé" };

  // Full-journey overview route: use the curated `route` when present,
  // otherwise derive one per-day from this program's own itinerary so
  // every trip page shows its own correct map.
  const tripRoute = useMemo(
    () => (program.route && program.route.length >= 2 ? program.route : deriveTripRoute(program)),
    [program]
  );

  const navItems = [
    { id: "description", label: t.nav_description },
    { id: "quick",       label: t.nav_quick },
    { id: "itinerary",   label: t.nav_itinerary },
    { id: "overview",    label: pick(navOverview, lang) },
    { id: "pricing",     label: t.nav_pricing },
    { id: "includes",    label: t.nav_includes },
    { id: "contact",     label: t.nav_contact },
  ];

  // Pilot reorder (only this program for now):
  // Description → Quick → Audio → Map.
  const reorderSections = routeId === "tourAtlasDesierto67";
  const audioSection = (
    <VideoSection
      testid={`program-audio-${routeId || program.duration_key}`}
      poster="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85"
      eyebrow={{ es: "Escucha este viaje", en: "Listen to this journey", fr: "Écoutez ce voyage" }}
      title={{
        es: "Deja que te contemos la ruta.",
        en: "Let us tell you the route.",
        fr: "Laissez-nous vous raconter l'itinéraire.",
      }}
      caption={{
        es: "Una narración para imaginar cada etapa antes de partir.",
        en: "A narration to picture every stage before you set off.",
        fr: "Une narration pour imaginer chaque étape avant le départ.",
      }}
    />
  );

  return (
    <div data-testid={`program-page-${program.duration_key}`}>
      <ProgramHero vt={vt} t={t} program={program} lang={lang} variant={variant} routeId={routeId} onDownload={() => setDownloadOpen(true)} />
      <StickyNav items={navItems} testid="program-nav" />
      {(() => {
        const mapSection = tripRoute && tripRoute.length >= 2
          ? <TripRouteMap route={tripRoute} days={program.days} routeId={routeId} />
          : null;
        const descSection = <Description vt={vt} t={t} program={program} variant={variant} />;
        const quickSection = <QuickInfo t={t} vt={vt} program={program} lang={lang} variant={variant} />;
        return reorderSections ? (
          <>
            {descSection}
            {quickSection}
            {audioSection}
            {mapSection}
          </>
        ) : (
          <>
            {mapSection}
            {descSection}
            {quickSection}
          </>
        );
      })()}
      {reorderSections ? null : audioSection}
      <DayTimeline days={program.days} lang={lang} t={t} />
      <Itinerary t={t} lang={lang} days={program.days} routeId={routeId} hideDayGallery={routeId === "tourMarrakechErg56"} />
      <TripPostcards routeId={routeId} />
      <ProgramFlipbook src={flipbookSrc} routeId={routeId} />
      <TripOverview days={program.days} />
      <PricingSection id="pricing" testid="program-pricing" routeId={routeId} />
      <DetailsAccordion t={t} lang={lang} program={program} />
      <HubPeerNav routeId={routeId} />
      <RelatedJourneys routeId={routeId} />
      <ContactBand t={t} lang={lang} />
      <div id="form"><ContactForm /></div>
      <DownloadProgramModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        routeId={routeId}
        programTitle={vt.title}
      />
    </div>
  );
}
