import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Backpack, Bike, Building2, Camera, Check,
  ChevronRight, Clock3, Coffee, Compass, Crown, Footprints, Gem,
  Heart, Hotel, Map as MapIcon, MapPin, Mountain, Palmtree, PartyPopper, Play,
  RotateCcw, Route, ShieldCheck, Sparkles, Sun, TentTree, Trees,
  Users, Utensils, Waves, X,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { pathFor } from "@/lib/routes";
import { ALL_TRIPS, ROUTE_IMAGES } from "@/lib/allTripsCatalog";
import { setTripContext } from "@/lib/tripContext";
import { IMG } from "@/lib/imageBank";
import ImageContactBubble from "@/components/ImageContactBubble";
import Img from "@/components/Img";

const T = (es, en, fr) => ({ es, en, fr });
const IDEAL_TRIP_WIZARD_EVENT = "xaluca:open-ideal-trip-wizard";

export const requestIdealTripWizard = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(IDEAL_TRIP_WIZARD_EVENT));
};

const COPY = {
  section: {
    overline: T("Recomendador de viajes", "Trip recommender", "Recommandation de voyages"),
    title: T("Encuentra el viaje que encaja contigo.", "Find the journey that fits you.", "Trouvez le voyage qui vous ressemble."),
    body: T(
      "Elige visualmente tus preferencias y compara tus respuestas con todos nuestros itinerarios. En menos de dos minutos descubrirás las rutas con mayor afinidad.",
      "Choose your preferences visually and compare them with every itinerary we offer. In under two minutes, discover the routes with the strongest match.",
      "Choisissez visuellement vos préférences et comparez-les à tous nos itinéraires. En moins de deux minutes, découvrez les parcours les plus compatibles."
    ),
    cta: T("Encontrar mi viaje ideal", "Find my ideal journey", "Trouver mon voyage idéal"),
    note: T("Sin formularios · Sin escribir · Resultado inmediato", "No forms · No typing · Instant result", "Sans formulaire · Sans écrire · Résultat immédiat"),
    preview: T("Todo lo que podrás descubrir", "Everything you can discover", "Tout ce que vous pourrez découvrir"),
    previewCount: T("13 experiencias para explorar", "13 experiences to explore", "13 expériences à explorer"),
  },
  modalTitle: T("Encuentra tu viaje ideal", "Find your ideal journey", "Trouvez votre voyage idéal"),
  step: T("Paso", "Step", "Étape"),
  of: T("de", "of", "sur"),
  multiple: T("Puedes elegir varias opciones", "You can choose several options", "Vous pouvez choisir plusieurs options"),
  single: T("Elige una opción", "Choose one option", "Choisissez une option"),
  previous: T("Anterior", "Previous", "Précédent"),
  next: T("Continuar", "Continue", "Continuer"),
  finish: T("Ver mis recomendaciones", "See my recommendations", "Voir mes recommandations"),
  restart: T("Reiniciar", "Start again", "Recommencer"),
  close: T("Cerrar recomendador", "Close recommender", "Fermer le configurateur"),
  selected: T("seleccionadas", "selected", "sélectionnées"),
  results: {
    overline: T("Tus mejores coincidencias", "Your best matches", "Vos meilleures correspondances"),
    title: T("Estos viajes encajan mejor contigo.", "These journeys fit you best.", "Ces voyages vous correspondent le mieux."),
    body: T(
      "La compatibilidad se calcula comparando tus respuestas con la duración, ritmo, regiones y características reales de cada programa.",
      "Compatibility is calculated by comparing your answers with the real duration, pace, regions and features of each programme.",
      "La compatibilité est calculée en comparant vos réponses à la durée, au rythme, aux régions et aux caractéristiques réelles de chaque programme."
    ),
    compatible: T("Compatible", "Match", "Compatible"),
    days: T("días", "days", "jours"),
    why: T("Por qué encaja", "Why it matches", "Pourquoi il convient"),
    view: T("Ver viaje", "View journey", "Voir le voyage"),
    info: T("Solicitar información", "Request information", "Demander des informations"),
    favoriteAdd: T("Añadir a favoritos", "Add to favourites", "Ajouter aux favoris"),
    favoriteRemove: T("Quitar de favoritos", "Remove from favourites", "Retirer des favoris"),
    noneTitle: T("¿No has encontrado exactamente lo que buscabas?", "Haven't found exactly what you wanted?", "Vous n'avez pas trouvé exactement ce que vous cherchiez ?"),
    noneBody: T("Nuestro equipo puede convertir tus preferencias en un itinerario completamente personalizado.", "Our team can turn your preferences into a completely bespoke itinerary.", "Notre équipe peut transformer vos préférences en un itinéraire entièrement personnalisé."),
    bespoke: T("Diseñar mi viaje a medida", "Design my bespoke journey", "Créer mon voyage sur mesure"),
  },
};

const EXPERIENCE_OPTIONS = [
  { id: "adventure", icon: Backpack, label: T("Aventura", "Adventure", "Aventure") },
  { id: "relax", icon: Coffee, label: T("Relax", "Relaxation", "Détente") },
  { id: "cultural", icon: Building2, label: T("Cultural", "Culture", "Culture") },
  { id: "desert", icon: Sun, label: T("Desierto", "Desert", "Désert") },
  { id: "mountain", icon: Mountain, label: T("Montaña", "Mountains", "Montagne") },
  { id: "nature", icon: Trees, label: T("Naturaleza", "Nature", "Nature") },
  { id: "photography", icon: Camera, label: T("Fotografía", "Photography", "Photographie") },
  { id: "luxury", icon: Crown, label: T("Lujo", "Luxury", "Luxe") },
  { id: "couple", icon: Heart, label: T("En pareja", "As a couple", "En couple") },
  { id: "family", icon: Users, label: T("En familia", "As a family", "En famille") },
  { id: "friends", icon: PartyPopper, label: T("Con amigos", "With friends", "Entre amis") },
  { id: "honeymoon", icon: Gem, label: T("Luna de miel", "Honeymoon", "Lune de miel") },
  { id: "combined", icon: Route, label: T("Combinado", "Combined", "Combiné") },
];

const EXPERIENCE_PREVIEW_REGIONS = {
  adventure: "aventura",
  relax: "escapadas",
  cultural: "norte",
  desert: "sur",
  mountain: "aventura",
  nature: "norte",
  photography: "completo",
  luxury: "completo",
  couple: "escapadas",
  family: "norte",
  friends: "sur",
  honeymoon: "escapadas",
  combined: "completo",
};

const buildExperiencePreviews = () => {
  const usedImages = new Set();

  return EXPERIENCE_OPTIONS.map((option) => {
    const preferredRegion = EXPERIENCE_PREVIEW_REGIONS[option.id];
    const candidates = [
      ...ALL_TRIPS.filter((trip) => trip.region === preferredRegion),
      ...ALL_TRIPS.filter((trip) => trip.region !== preferredRegion),
    ];
    const trip = candidates.find((candidate) => candidate.image && !usedImages.has(candidate.image));
    if (trip?.image) usedImages.add(trip.image);
    return { ...option, image: trip?.image };
  });
};

const EXPERIENCE_PREVIEWS = buildExperiencePreviews();

const DURATION_OPTIONS = [
  { id: "3-5", icon: Clock3, label: T("3–5 días", "3–5 days", "3–5 jours") },
  { id: "6-8", icon: Clock3, label: T("6–8 días", "6–8 days", "6–8 jours") },
  { id: "9-12", icon: Clock3, label: T("9–12 días", "9–12 days", "9–12 jours") },
  { id: "13-16", icon: Clock3, label: T("13–16 días", "13–16 days", "13–16 jours") },
  { id: "16+", icon: Clock3, label: T("Más de 16 días", "More than 16 days", "Plus de 16 jours") },
];

const PACE_OPTIONS = [
  { id: "very-calm", icon: Coffee, label: T("Muy tranquilo", "Very relaxed", "Très tranquille") },
  { id: "balanced", icon: Compass, label: T("Equilibrado", "Balanced", "Équilibré") },
  { id: "active", icon: Footprints, label: T("Activo", "Active", "Actif") },
  { id: "adventurous", icon: Bike, label: T("Muy aventurero", "Very adventurous", "Très aventureux") },
];

const PLACE_OPTIONS = [
  { id: "marrakech", icon: Palmtree, label: T("Marrakech", "Marrakesh", "Marrakech") },
  { id: "merzouga", icon: Sun, label: T("Merzouga · Erg Chebbi", "Merzouga · Erg Chebbi", "Merzouga · Erg Chebbi") },
  { id: "atlas", icon: Mountain, label: T("Cordillera del Atlas", "Atlas Mountains", "Massif de l'Atlas") },
  { id: "dades", icon: MapIcon, label: T("Dadès · Todra", "Dadès · Todra", "Dadès · Todra") },
  { id: "fez", icon: Building2, label: T("Fez", "Fez", "Fès") },
  { id: "chefchaouen", icon: MapPin, label: T("Chefchaouen · Rif", "Chefchaouen · Rif", "Chefchaouen · Rif") },
  { id: "essaouira", icon: Waves, label: T("Essaouira · Costa Atlántica", "Essaouira · Atlantic coast", "Essaouira · Côte atlantique") },
  { id: "imperial", icon: Building2, label: T("Ciudades imperiales", "Imperial cities", "Villes impériales") },
  { id: "full-morocco", icon: Route, label: T("Marruecos de norte a sur", "Morocco north to south", "Maroc du nord au sud") },
];

const COMPANION_OPTIONS = [
  { id: "solo", icon: Compass, label: T("Solo", "Solo", "Solo") },
  { id: "couple", icon: Heart, label: T("En pareja", "As a couple", "En couple") },
  { id: "family", icon: Users, label: T("En familia", "As a family", "En famille") },
  { id: "friends", icon: PartyPopper, label: T("Grupo de amigos", "Group of friends", "Groupe d'amis") },
  { id: "group", icon: ShieldCheck, label: T("Grupo organizado", "Organised group", "Groupe organisé") },
];

const PRIORITY_OPTIONS = [
  { id: "charming-stays", icon: Hotel, label: T("Alojamientos con encanto", "Charming stays", "Hébergements de charme") },
  { id: "luxury-hotels", icon: Crown, label: T("Hoteles de lujo", "Luxury hotels", "Hôtels de luxe") },
  { id: "desert-camps", icon: TentTree, label: T("Campamentos en el desierto", "Desert camps", "Campements dans le désert") },
  { id: "landscapes", icon: Mountain, label: T("Paisajes espectaculares", "Spectacular landscapes", "Paysages spectaculaires") },
  { id: "gastronomy", icon: Utensils, label: T("Gastronomía", "Gastronomy", "Gastronomie") },
  { id: "local-culture", icon: Building2, label: T("Cultura local", "Local culture", "Culture locale") },
  { id: "activities", icon: Sparkles, label: T("Actividades", "Activities", "Activités") },
  { id: "hiking", icon: Footprints, label: T("Senderismo", "Hiking", "Randonnée") },
  { id: "camels", icon: Palmtree, label: T("Dromedarios", "Camel rides", "Dromadaires") },
  { id: "four-wheel", icon: Route, label: T("Rutas en 4x4", "4x4 routes", "Circuits en 4x4") },
  { id: "wellness", icon: Heart, label: T("Bienestar & Spa", "Wellness & Spa", "Bien-être & Spa") },
  { id: "photography", icon: Camera, label: T("Fotografía", "Photography", "Photographie") },
  { id: "authentic", icon: Gem, label: T("Experiencias auténticas", "Authentic experiences", "Expériences authentiques") },
];

/* Curated visual for every choice shown inside the wizard. Reusing the
   semantic image bank keeps the treatment coherent and routes stock imagery
   through the same CMS/Bunny optimisation pipeline as the rest of the site. */
const OPTION_IMAGES = {
  experiences: {
    adventure: ROUTE_IMAGES.tourEnduroAventura45,
    relax: IMG.riadFountain,
    cultural: ROUTE_IMAGES.tourFezRak67,
    desert: ROUTE_IMAGES.tourMarrakechLoop45,
    mountain: ROUTE_IMAGES.tourMarrakechErg67,
    nature: ROUTE_IMAGES.tourMarrakechLoop67,
    photography: ROUTE_IMAGES.tourEscapadaFez34,
    luxury: ROUTE_IMAGES.tourMarrakechFez67,
    couple: ROUTE_IMAGES.tourMarrakechEss45,
    family: ROUTE_IMAGES.tourCiudadesImperialesRif67,
    friends: ROUTE_IMAGES.tourEscapadaRakErgRak23,
    honeymoon: IMG.riadInterior,
    combined: ROUTE_IMAGES.tourMarrakechFez910,
  },
  duration: {
    "3-5": ROUTE_IMAGES.tourAtlasDesierto45,
    "6-8": ROUTE_IMAGES.tourAtlasDesierto56,
    "9-12": ROUTE_IMAGES.tourTangerRak910,
    "13-16": ROUTE_IMAGES.tourMarrakechFez89,
    "16+": ROUTE_IMAGES.tourFinDeAno2025,
  },
  pace: {
    "very-calm": ROUTE_IMAGES.tourEscapadaMarrakech23,
    balanced: ROUTE_IMAGES.tourDesiertoAtlas45,
    active: ROUTE_IMAGES.tourAtlasDesierto67,
    adventurous: ROUTE_IMAGES.tourEnduroAventura67,
  },
  places: {
    marrakech: ROUTE_IMAGES.tourMarrakechErg45,
    merzouga: ROUTE_IMAGES.tourMarrakechErg56,
    atlas: ROUTE_IMAGES.tourEscapadaAtlas34,
    dades: ROUTE_IMAGES.tourDesiertoAtlas67,
    fez: ROUTE_IMAGES.tourFezRak78,
    chefchaouen: ROUTE_IMAGES.tourTangerRak89,
    essaouira: ROUTE_IMAGES.tourMarrakechEss67,
    imperial: ROUTE_IMAGES.tourCiudadesImperiales45,
    "full-morocco": ROUTE_IMAGES.tourCiudadesImperiales67,
  },
  companions: {
    solo: ROUTE_IMAGES.tourCiudadesImperialesRif78,
    couple: IMG.chefAlley,
    family: ROUTE_IMAGES.tourTangerFez45,
    friends: IMG.camelCaravan,
    group: ROUTE_IMAGES.tourTangerFez56,
  },
  priorities: {
    "charming-stays": ROUTE_IMAGES.tourEscapadaFez23,
    "luxury-hotels": IMG.kasbahGate,
    "desert-camps": ROUTE_IMAGES.tourEscapadaDesierto34,
    landscapes: IMG.atlasMisty,
    gastronomy: IMG.marketBaskets,
    "local-culture": ROUTE_IMAGES.tourMarrakechLoop34,
    activities: ROUTE_IMAGES.tourEscapadaRakAgafay34,
    hiking: ROUTE_IMAGES.tourEscapadaRakErgRak34,
    camels: IMG.desertWoman,
    "four-wheel": IMG.dunesRocky,
    wellness: IMG.essaouiraPort,
    photography: ROUTE_IMAGES.tourFezTanger67,
    authentic: ROUTE_IMAGES.tourMarrakechLoop56,
  },
};

const STEPS = [
  { id: "experiences", multi: true, title: T("¿Qué tipo de experiencia buscas?", "What kind of experience are you looking for?", "Quel type d'expérience recherchez-vous ?"), options: EXPERIENCE_OPTIONS },
  { id: "duration", multi: true, title: T("¿Cuántos días quieres viajar?", "How many days would you like to travel?", "Combien de jours souhaitez-vous voyager ?"), options: DURATION_OPTIONS },
  { id: "pace", multi: true, title: T("¿Qué ritmo prefieres?", "What pace do you prefer?", "Quel rythme préférez-vous ?"), options: PACE_OPTIONS },
  { id: "places", multi: true, title: T("¿Qué lugares te gustaría descubrir?", "Which places would you like to discover?", "Quels lieux aimeriez-vous découvrir ?"), options: PLACE_OPTIONS },
  { id: "companions", multi: true, title: T("¿Con quién viajas?", "Who are you travelling with?", "Avec qui voyagez-vous ?"), options: COMPANION_OPTIONS },
  { id: "priorities", multi: true, title: T("¿Qué es lo más importante para ti?", "What matters most to you?", "Qu'est-ce qui compte le plus pour vous ?"), options: PRIORITY_OPTIONS },
];

const EMPTY_ANSWERS = {
  experiences: [], duration: [], pace: [], places: [], companions: [], priorities: [],
};

const normalize = (value = "") => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const includesAny = (text, needles) => needles.some((needle) => text.includes(normalize(needle)));

const enrichTrip = (trip) => {
  const text = normalize(`${trip.routeId} ${trip.title?.es || ""} ${trip.summary?.es || ""}`);
  const tags = new Set(["authentic", "photography"]);
  const places = new Set();
  const companions = new Set(["solo", "couple", "friends"]);

  if (trip.region === "sur") {
    ["desert", "nature", "adventure", "landscapes", "desert-camps", "camels", "four-wheel", "charming-stays"].forEach((tag) => tags.add(tag));
    ["merzouga", "atlas", "dades"].forEach((place) => places.add(place));
  }
  if (trip.region === "norte") {
    ["cultural", "nature", "gastronomy", "local-culture", "charming-stays", "relax"].forEach((tag) => tags.add(tag));
    ["fez", "chefchaouen", "imperial"].forEach((place) => places.add(place));
  }
  if (trip.region === "completo") {
    ["combined", "cultural", "desert", "nature", "landscapes", "local-culture", "gastronomy", "charming-stays"].forEach((tag) => tags.add(tag));
    ["marrakech", "fez", "merzouga", "atlas", "dades", "imperial", "full-morocco"].forEach((place) => places.add(place));
  }
  if (trip.region === "escapadas") ["relax", "cultural", "charming-stays", "gastronomy"].forEach((tag) => tags.add(tag));
  if (trip.region === "aventura") ["adventure", "mountain", "nature", "hiking", "activities", "four-wheel", "landscapes"].forEach((tag) => tags.add(tag));

  if (includesAny(text, ["marrakech", "rak", "loop"])) places.add("marrakech");
  if (includesAny(text, ["erg", "desierto", "sahara", "merzouga"])) places.add("merzouga");
  if (includesAny(text, ["atlas", "ait benhaddou", "ouarzazate"])) places.add("atlas");
  if (includesAny(text, ["dades", "todra", "kasbah"])) places.add("dades");
  if (includesAny(text, ["fez", "fes"])) places.add("fez");
  if (includesAny(text, ["chefchaouen", "rif", "tanger", "tetuan"])) places.add("chefchaouen");
  if (includesAny(text, ["essaouira", "atlantico", "sidi kaouki"])) {
    places.add("essaouira");
    ["relax", "nature", "gastronomy"].forEach((tag) => tags.add(tag));
  }
  if (includesAny(text, ["imperial", "ciudades", "rabat", "meknes"])) places.add("imperial");
  if (includesAny(text, ["enduro", "4x4", "aventura"])) ["adventure", "activities", "four-wheel"].forEach((tag) => tags.add(tag));
  if (includesAny(text, ["atlas", "montana", "trek", "hike"])) ["mountain", "hiking", "nature"].forEach((tag) => tags.add(tag));
  if (includesAny(text, ["riad", "marrakech", "fez", "imperial"])) ["cultural", "local-culture", "gastronomy"].forEach((tag) => tags.add(tag));

  if (trip.pace !== "intenso" && trip.nights <= 8) companions.add("family");
  if (trip.region === "eventos") companions.add("group");
  if (trip.nights >= 6 || trip.region === "completo") tags.add("luxury");
  if (tags.has("luxury")) ["luxury-hotels", "wellness", "honeymoon"].forEach((tag) => tags.add(tag));
  if (tags.has("relax")) tags.add("wellness");
  if (tags.has("desert")) ["desert-camps", "camels"].forEach((tag) => tags.add(tag));
  if (trip.pace === "calmo") tags.add("relax");
  if (trip.pace === "intenso") ["active", "adventure"].forEach((tag) => tags.add(tag));

  return { ...trip, days: trip.nights + 1, tags, places, companions };
};

const durationMatches = (days, bucket) => (
  (bucket === "3-5" && days >= 3 && days <= 5)
  || (bucket === "6-8" && days >= 6 && days <= 8)
  || (bucket === "9-12" && days >= 9 && days <= 12)
  || (bucket === "13-16" && days >= 13 && days <= 16)
  || (bucket === "16+" && days > 16)
);

const paceMatches = (pace, answer) => (
  (answer === "very-calm" && pace === "calmo")
  || (answer === "balanced" && pace === "equilibrado")
  || (answer === "active" && ["equilibrado", "intenso"].includes(pace))
  || (answer === "adventurous" && pace === "intenso")
);

const scoreTrips = (answers, lang) => {
  const optionLabels = new Map(
    STEPS.flatMap((step) => step.options.map((option) => [option.id, pick(option.label, lang)]))
  );

  const maxScore = Math.max(
    1,
    25 + 18 + 12 + answers.experiences.length * 8 + answers.places.length * 10 + answers.priorities.length * 7
  );

  return ALL_TRIPS.map(enrichTrip).map((trip) => {
    let score = 0;
    const reasons = [];
    const duration = answers.duration.find((id) => durationMatches(trip.days, id));
    const pace = answers.pace.find((id) => paceMatches(trip.pace, id));
    const companion = answers.companions.find((id) => trip.companions.has(id));

    if (duration) score += 25;
    else if (answers.duration.length) {
      const ranges = { "3-5": 4, "6-8": 7, "9-12": 10.5, "13-16": 14.5, "16+": 18 };
      if (answers.duration.some((id) => Math.abs(trip.days - ranges[id]) <= 2.5)) score += 10;
    }
    if (pace) score += 18;
    if (companion) score += 12;

    answers.experiences.forEach((id) => {
      if (trip.tags.has(id) || trip.companions.has(id)) {
        score += 8;
        reasons.push(optionLabels.get(id));
      }
    });
    answers.places.forEach((id) => {
      if (trip.places.has(id)) {
        score += 10;
        reasons.push(optionLabels.get(id));
      }
    });
    answers.priorities.forEach((id) => {
      if (trip.tags.has(id)) {
        score += 7;
        reasons.push(optionLabels.get(id));
      }
    });

    if (duration) reasons.unshift(`${trip.days} ${pick(COPY.results.days, lang)}`);
    if (pace) reasons.push(optionLabels.get(pace));
    if (companion) reasons.push(optionLabels.get(companion));
    const compatibility = Math.min(98, Math.max(38, Math.round(38 + (score / maxScore) * 60)));
    return { ...trip, score, compatibility, reasons: [...new Set(reasons)].slice(0, 4) };
  }).sort((a, b) => b.score - a.score || a.nights - b.nights).slice(0, 3);
};

const OptionCard = ({ option, image, selected, onClick, lang }) => {
  const Icon = option.icon || Sparkles;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-testid={`ideal-trip-option-${option.id}`}
      className={`group relative overflow-hidden border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] focus-visible:ring-offset-2 ${
        selected
          ? "border-[#C16542] bg-[#C16542] text-white shadow-[0_18px_34px_-22px_rgba(193,101,66,0.85)]"
          : "border-[#2C2621]/12 bg-[#FDFBF7] text-[#2C2621] hover:-translate-y-0.5 hover:border-[#C16542]/55 hover:shadow-[0_18px_34px_-28px_rgba(44,38,33,0.7)]"
      }`}
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-[#E8DFD2] sm:aspect-[16/9]">
        <Img
          src={image}
          alt=""
          width={480}
          sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 20vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className={`absolute inset-0 transition-colors ${selected ? "bg-[#8D3F28]/25" : "bg-gradient-to-t from-[#1A1513]/45 via-transparent to-transparent"}`} aria-hidden="true" />
        <span className={`absolute bottom-2.5 left-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-colors sm:bottom-3 sm:left-3 sm:h-10 sm:w-10 ${selected ? "bg-[#C16542] text-white" : "bg-[#FDFBF7]/95 text-[#C16542]"}`}>
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.55} />
        </span>
      </span>
      <span className="flex min-h-[58px] items-center px-3 py-3 sm:min-h-[64px] sm:px-4">
        <span className="block font-serif-x text-sm leading-tight sm:text-base lg:text-lg">{pick(option.label, lang)}</span>
      </span>
      {selected && (
        <span className="absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#C16542] shadow-md sm:right-3 sm:top-3">
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      )}
    </button>
  );
};

const Results = ({ answers, lang, onRestart, onClose }) => {
  const results = useMemo(() => scoreTrips(answers, lang), [answers, lang]);
  const { isFavorite, toggleFavorite } = useFavorites();
  return (
    <div data-testid="ideal-trip-results" className="px-5 pb-8 pt-7 sm:px-8 md:px-10 md:pb-10">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C16542]">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />
          {pick(COPY.results.overline, lang)}
        </span>
        <h2 className="mt-3 font-serif-x text-3xl leading-tight text-[#2C2621] sm:text-4xl">
          {pick(COPY.results.title, lang)}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5C5248]">{pick(COPY.results.body, lang)}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {results.map((trip, index) => {
          const favorite = isFavorite(trip.routeId);
          const favoriteLabel = pick(favorite ? COPY.results.favoriteRemove : COPY.results.favoriteAdd, lang);
          return (
          <article key={trip.routeId} data-testid={`ideal-trip-result-${trip.routeId}`} className="overflow-hidden border border-[#2C2621]/10 bg-white shadow-[0_20px_45px_-34px_rgba(26,21,19,0.5)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1513]">
              <img src={trip.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/75 via-transparent to-[#1A1513]/10" />
              <span className="absolute left-3 top-3 bg-[#FDFBF7] px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#C16542]">
                #{index + 1} · {trip.compatibility}% {pick(COPY.results.compatible, lang)}
              </span>
              <button
                type="button"
                onClick={() => toggleFavorite(trip.routeId)}
                data-testid={`ideal-trip-favorite-${trip.routeId}`}
                aria-label={favoriteLabel}
                title={favoriteLabel}
                aria-pressed={favorite}
                className={`absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur transition-all active:scale-95 ${
                  favorite
                    ? "bg-[#C16542] text-white"
                    : "bg-[#FDFBF7]/95 text-[#C16542] hover:bg-[#C16542] hover:text-white"
                }`}
              >
                <Heart className="h-4 w-4" strokeWidth={1.7} fill={favorite ? "currentColor" : "none"} />
              </button>
              <ImageContactBubble
                slug={`ideal-trip-${trip.routeId}`}
                align="left"
                vertical="bottom"
                zClass="z-[10]"
                modalZClass="z-[12000]"
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-[#1A1513]/75 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur">
                <Clock3 className="h-3 w-3" strokeWidth={1.7} /> {trip.days} {pick(COPY.results.days, lang)}
              </span>
            </div>
            <div className="flex flex-col p-5">
              <h3 className="font-serif-x text-xl leading-tight text-[#2C2621]">{pick(trip.title, lang)}</h3>
              <p className="mt-3 text-xs leading-relaxed text-[#5C5248]">{pick(trip.summary, lang)}</p>
              <div className="mt-5">
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#5C5248]">{pick(COPY.results.why, lang)}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {trip.reasons.map((reason) => (
                    <span key={reason} className="border border-[#C16542]/25 bg-[#F2EBE1] px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-[#C16542]">{reason}</span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 border-t border-[#2C2621]/10 pt-4">
                <Link
                  to={pathFor(lang, trip.routeId)}
                  onClick={onClose}
                  data-testid={`ideal-trip-view-${trip.routeId}`}
                  className="inline-flex items-center gap-2 bg-[#C16542] px-4 py-2.5 text-[9px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#A35133]"
                >
                  {pick(COPY.results.view, lang)} <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  to={pathFor(lang, "planTrip")}
                  onClick={() => { setTripContext(trip.routeId); onClose(); }}
                  data-testid={`ideal-trip-info-${trip.routeId}`}
                  className="inline-flex items-center border border-[#2C2621]/20 px-4 py-2.5 text-[9px] uppercase tracking-[0.15em] text-[#2C2621] transition-colors hover:border-[#C16542] hover:text-[#C16542]"
                >
                  {pick(COPY.results.info, lang)}
                </Link>
              </div>
            </div>
          </article>
          );
        })}
      </div>

      <div className="mt-7 grid gap-5 border border-[#2C2621]/10 bg-[#F2EBE1] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-7">
        <div>
          <h3 className="font-serif-x text-2xl text-[#2C2621]">{pick(COPY.results.noneTitle, lang)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">{pick(COPY.results.noneBody, lang)}</p>
        </div>
        <Link
          to={pathFor(lang, "planTrip")}
          onClick={onClose}
          data-testid="ideal-trip-bespoke"
          className="inline-flex items-center justify-center gap-2 bg-[#2C2621] px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#C16542]"
        >
          {pick(COPY.results.bespoke, lang)} <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <button type="button" onClick={onRestart} className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#C16542]">
        <RotateCcw className="h-3.5 w-3.5" /> {pick(COPY.restart, lang)}
      </button>
    </div>
  );
};

class WizardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div data-testid="ideal-trip-render-error" className="m-8 border border-red-300 bg-red-50 p-6 text-sm text-red-900">
          {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

const WizardModal = ({ open, onClose, lang }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [showResults, setShowResults] = useState(false);
  const dialogRef = useRef(null);
  const step = STEPS[stepIndex];

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => dialogRef.current?.querySelector("button")?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const toggle = (id) => {
    setAnswers((current) => ({
      ...current,
      [step.id]: step.multi
        ? current[step.id].includes(id)
          ? current[step.id].filter((value) => value !== id)
          : [...current[step.id], id]
        : [id],
    }));
  };

  const restart = () => {
    setAnswers(EMPTY_ANSWERS);
    setStepIndex(0);
    setShowResults(false);
  };

  return createPortal(
    <div
      data-testid="ideal-trip-modal-backdrop"
      className="fixed inset-0 z-[11000] flex items-center justify-center bg-[#1A1513]/80 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ideal-trip-modal-title"
        data-testid="ideal-trip-modal"
        className="relative flex max-h-[94svh] w-full max-w-6xl flex-col overflow-hidden bg-[#F7F0E6] shadow-[0_35px_100px_-20px_rgba(0,0,0,0.65)]"
      >
        <header className="relative shrink-0 border-b border-[#2C2621]/10 bg-[#FDFBF7] px-5 py-4 pr-16 sm:px-8 sm:py-5">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-[#C16542]">Xaluca · Tours</p>
              <h1 id="ideal-trip-modal-title" className="mt-1 font-serif-x text-xl text-[#2C2621] sm:text-2xl">{pick(COPY.modalTitle, lang)}</h1>
            </div>
            {!showResults && (
              <p className="mr-12 hidden shrink-0 text-[10px] uppercase tracking-[0.2em] text-[#5C5248] sm:block lg:mr-10">
                {pick(COPY.step, lang)} {stepIndex + 1} {pick(COPY.of, lang)} {STEPS.length}
              </p>
            )}
          </div>
          {!showResults && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#2C2621]/8">
              <span className="block h-full bg-[#C16542] transition-[width] duration-500" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={pick(COPY.close, lang)}
            data-testid="ideal-trip-close"
            className="absolute right-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#2C2621]/15 text-[#2C2621] transition-colors hover:border-[#C16542] hover:text-[#C16542]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {showResults ? (
            <WizardErrorBoundary>
              <Results answers={answers} lang={lang} onRestart={restart} onClose={onClose} />
            </WizardErrorBoundary>
          ) : (
            <div key={step.id} data-testid={`ideal-trip-step-${step.id}`} className="px-5 py-7 sm:px-8 sm:py-9 md:px-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-[#C16542]">{pick(COPY.step, lang)} {stepIndex + 1}</p>
                  <h2 className="mt-2 max-w-3xl font-serif-x text-3xl leading-tight text-[#2C2621] sm:text-4xl">{pick(step.title, lang)}</h2>
                  <p className="mt-2 text-xs text-[#5C5248]">{pick(step.multi ? COPY.multiple : COPY.single, lang)}</p>
                </div>
                {step.multi && answers[step.id].length > 0 && (
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#C16542]">{answers[step.id].length} {pick(COPY.selected, lang)}</span>
                )}
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {step.options.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    image={OPTION_IMAGES[step.id]?.[option.id] || IMG.atlasValley}
                    selected={answers[step.id].includes(option.id)}
                    onClick={() => toggle(option.id)}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {!showResults && (
          <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-[#2C2621]/10 bg-[#FDFBF7] px-5 py-4 sm:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
                disabled={stepIndex === 0}
                data-testid="ideal-trip-previous"
                className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#5C5248] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {pick(COPY.previous, lang)}
              </button>
              <button type="button" onClick={restart} className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#C16542] sm:inline-flex">
                <RotateCcw className="h-3.5 w-3.5" /> {pick(COPY.restart, lang)}
              </button>
            </div>
            <button
              type="button"
              disabled={answers[step.id].length === 0}
              onClick={() => {
                if (stepIndex === STEPS.length - 1) setShowResults(true);
                else setStepIndex((index) => index + 1);
              }}
              data-testid="ideal-trip-next"
              className="inline-flex items-center gap-2 bg-[#C16542] px-5 py-3 text-[9px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#A35133] disabled:cursor-not-allowed disabled:bg-[#2C2621]/20 sm:px-6 sm:text-[10px]"
            >
              {pick(stepIndex === STEPS.length - 1 ? COPY.finish : COPY.next, lang)} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
};

export default function IdealTripWizard() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const openWizard = () => setOpen(true);
    window.addEventListener(IDEAL_TRIP_WIZARD_EVENT, openWizard);
    return () => window.removeEventListener(IDEAL_TRIP_WIZARD_EVENT, openWizard);
  }, []);

  const scrollPreview = (direction) => {
    previewRef.current?.scrollBy({
      left: direction * Math.min(640, previewRef.current.clientWidth * 0.82),
      behavior: "smooth",
    });
  };

  return (
    <>
      <section id="ideal-trip" data-testid="ideal-trip-section" className="relative isolate overflow-hidden border-y border-[#B48361]/20 bg-[#E9DCC9] py-20 text-[#2C2621] md:py-28">
        <div className="absolute inset-0 berber-bg-cross opacity-[0.08] pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-8">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#A95739]">
              <Compass className="h-3.5 w-3.5" strokeWidth={1.6} /> {pick(COPY.section.overline, lang)}
            </span>
            <h2 className="mt-5 max-w-4xl font-serif-x text-4xl leading-[1.04] tracking-tight md:text-5xl lg:text-6xl">{pick(COPY.section.title, lang)}</h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#514940] md:text-lg">{pick(COPY.section.body, lang)}</p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <button
              type="button"
              onClick={() => setOpen(true)}
              data-testid="ideal-trip-open"
              className="group inline-flex w-full items-center justify-between gap-5 bg-[#C16542] px-6 py-5 text-left text-[10px] uppercase tracking-[0.2em] text-white shadow-[0_25px_55px_-28px_rgba(193,101,66,0.8)] transition-colors hover:bg-[#A35133] sm:w-auto sm:min-w-[280px]"
            >
              <span>{pick(COPY.section.cta, lang)}</span>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 transition-transform group-hover:translate-x-1">
                <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={1.5} />
              </span>
            </button>
            <p className="mt-4 text-[8px] uppercase tracking-[0.2em] text-[#8A5D44] sm:text-[9px]">{pick(COPY.section.note, lang)}</p>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-7xl px-6 md:mt-16 md:px-12">
          <div className="mb-5 flex items-end justify-between gap-5 border-t border-[#8A5D44]/20 pt-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-[#A95739]">{pick(COPY.section.preview, lang)}</p>
              <p className="mt-1 font-serif-x text-xl text-[#2C2621] sm:text-2xl">{pick(COPY.section.previewCount, lang)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => scrollPreview(-1)}
                aria-label={pick(T("Ver anteriores", "View previous", "Voir les précédentes"), lang)}
                data-testid="ideal-trip-preview-previous"
                className="inline-flex h-11 w-11 items-center justify-center border border-[#2C2621]/20 bg-[#F7F0E6]/70 text-[#2C2621] transition-colors hover:border-[#C16542] hover:bg-[#C16542] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => scrollPreview(1)}
                aria-label={pick(T("Ver siguientes", "View next", "Voir les suivantes"), lang)}
                data-testid="ideal-trip-preview-next"
                className="inline-flex h-11 w-11 items-center justify-center border border-[#2C2621]/20 bg-[#F7F0E6]/70 text-[#2C2621] transition-colors hover:border-[#C16542] hover:bg-[#C16542] hover:text-white"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>

          <div
            ref={previewRef}
            data-testid="ideal-trip-preview-carousel"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {EXPERIENCE_PREVIEWS.map((option) => {
              const Icon = option.icon;
              return (
                <article
                  key={option.id}
                  data-testid={`ideal-trip-preview-${option.id}`}
                  className="group relative aspect-[4/3] min-w-[220px] snap-start overflow-hidden bg-[#1A1513] sm:min-w-[260px] lg:min-w-[285px]"
                >
                  <img
                    src={option.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/90 via-[#1A1513]/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                    <h3 className="font-serif-x text-xl leading-tight sm:text-2xl">{pick(option.label, lang)}</h3>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-[#1A1513]/25 backdrop-blur-sm">
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <WizardModal open={open} onClose={() => setOpen(false)} lang={lang} />
    </>
  );
}
