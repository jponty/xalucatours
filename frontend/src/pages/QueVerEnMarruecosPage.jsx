import SectionNav from "@/components/SectionNav";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from "react-leaflet";
import MapBaseLayers from "@/components/MapBaseLayers";
import MapLogoBadge from "@/components/MapLogoBadge";
import {
  Home, ChevronRight, Compass, MapPin, ArrowRight, ArrowUpRight,
  Crown, Tent, Mountain, Waves, Building2, Sparkles, Star, X,
  Calendar, ThermometerSun, ThermometerSnowflake,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { IMG, banner } from "@/lib/imageBank";
import { REGIONS as CLIMATE_REGIONS } from "@/lib/bestTimeData";
import EditableImage from "@/components/EditableImage";
import HeroMonogram from "@/components/HeroMonogram";
import CardBrandOverlay from "@/components/CardBrandOverlay";
import FromPrice from "@/components/FromPrice";
import { priceRouteIds } from "@/lib/programNav";
import CircuitTestimonials from "@/components/CircuitTestimonials";
import { getPlaceTestimonials } from "@/lib/placeTestimonials";
import { SlotScope } from "@/components/slotScope";

/* ============================================================
   Doc title per language — same pattern as HomePage to avoid
   the i18n title bug recurrence.
============================================================ */
const DOC_TITLES = {
  es: "Qué ver en Marruecos · Guía visual de destinos · Xaluca",
  en: "What to see in Morocco · Visual destination guide · Xaluca",
  fr: "Que voir au Maroc · Guide visuel des destinations · Xaluca",
};

/* ============================================================
   Static copy
============================================================ */
const COPY = {
  breadcrumb: { es: "Inicio", en: "Home", fr: "Accueil" },
  guides:     { es: "Guías",  en: "Guides", fr: "Guides" },
  current:    { es: "Qué ver en Marruecos", en: "What to see in Morocco", fr: "Que voir au Maroc" },
  hero: {
    eyebrow: { es: "Inspiración para tu viaje", en: "Trip inspiration", fr: "Inspiration de voyage" },
    place:   { es: "Marruecos · Norte a Sur",   en: "Morocco · North to South", fr: "Maroc · Du Nord au Sud" },
    title: {
      es: "Cada ciudad, cada duna, cada montaña — un viaje distinto.",
      en: "Each city, each dune, each mountain — a different journey.",
      fr: "Chaque ville, chaque dune, chaque montagne — un voyage différent.",
    },
    subtitle: {
      es: "Esta guía visual reúne los destinos imprescindibles de Marruecos. Pulsa cualquier tarjeta para descubrir los viajes que los atraviesan.",
      en: "This visual guide gathers Morocco's must-see destinations. Click any card to discover the journeys that travel through them.",
      fr: "Ce guide visuel rassemble les incontournables du Maroc. Cliquez sur n'importe quelle carte pour découvrir les voyages qui les traversent.",
    },
  },
  intro: {
    overline: { es: "El país que cabe en un viaje", en: "A country that fits in one journey", fr: "Un pays qui tient dans un voyage" },
    title: {
      es: "Cuatro cordilleras, tres mares, un desierto inmenso y cuatro ciudades imperiales.",
      en: "Four mountain ranges, three seas, a vast desert and four imperial cities.",
      fr: "Quatre chaînes de montagnes, trois mers, un désert immense et quatre cités impériales.",
    },
    body: {
      es: "Marruecos no se recorre en línea recta. Lo construyes a partir de los lugares que te llaman: las medinas medievales de Fez, las playas atlánticas de Essaouira, las dunas naranjas del Erg Chebbi, las kasbahs de tierra del valle del Drâa. Aquí los reunimos todos para que elijas tu próxima parada — y a partir de ahí, te mostramos los viajes que la atraviesan.",
      en: "Morocco is never travelled in a straight line. You build it from the places that call to you: Fez's medieval medinas, Essaouira's Atlantic beaches, the orange dunes of Erg Chebbi, the earthen kasbahs of the Drâa valley. We gather them all here so you can pick your next stop — and from there, we show you the journeys that pass through it.",
      fr: "Le Maroc ne se parcourt jamais en ligne droite. Vous le construisez à partir des lieux qui vous appellent : les médinas médiévales de Fès, les plages atlantiques d'Essaouira, les dunes orangées de l'Erg Chebbi, les kasbahs de terre de la vallée du Drâa. Nous les rassemblons ici pour que vous choisissiez votre prochaine étape — et de là, nous vous montrons les voyages qui la traversent.",
    },
  },
  tripsCta: { es: "Ver viajes", en: "View trips", fr: "Voir les voyages" },
  catLabel: { es: "Categoría", en: "Category", fr: "Catégorie" },
  map: {
    overline: { es: "Tráza tu próxima ruta", en: "Plot your next route", fr: "Tracez votre prochaine route" },
    title: {
      es: "Los 17 destinos, en un solo mapa",
      en: "All 17 destinations, on a single map",
      fr: "Les 17 destinations, sur une seule carte",
    },
    body: {
      es: "Pulsa cualquier punto para descubrir el destino y los viajes que lo atraviesan. Cada color corresponde a una sección de la guía.",
      en: "Click any point to discover the destination and the journeys that pass through it. Each colour matches a section of the guide.",
      fr: "Cliquez sur n'importe quel point pour découvrir la destination et les voyages qui la traversent. Chaque couleur correspond à une section du guide.",
    },
    hint: {
      es: "Pulsa un destino para ver el detalle",
      en: "Click a destination to see details",
      fr: "Cliquez sur une destination pour voir les détails",
    },
    legend: { es: "Leyenda", en: "Legend", fr: "Légende" },
    reset: { es: "Limpiar selección", en: "Clear selection", fr: "Effacer la sélection" },
    routesLabel: { es: "Rutas destacadas", en: "Featured routes", fr: "Itinéraires phares" },
    routesHint:  { es: "Selecciona una ruta para dibujarla en el mapa", en: "Pick a route to draw it on the map", fr: "Choisissez un itinéraire pour le tracer" },
    routeStops:  { es: "Etapas del viaje", en: "Trip stops", fr: "Étapes du voyage" },
    routeCta:    { es: "Ver este viaje", en: "View this trip", fr: "Voir ce voyage" },
    routeBadge:  { es: "Ruta destacada", en: "Featured route", fr: "Itinéraire phare" },
    bestWindow:  { es: "Mejor época", en: "Best window", fr: "Meilleure période" },
    avoidWindow: { es: "Evita",        en: "Avoid",       fr: "À éviter" },
    seeGuide:    { es: "Ver guía climática completa", en: "See full climate guide", fr: "Voir le guide climatique complet" },
  },
  finalCta: {
    eyebrow: { es: "¿Lo tienes claro?", en: "Made up your mind?", fr: "C'est décidé ?" },
    title: {
      es: "Combina los destinos que más te llaman — diseñamos tu itinerario a medida.",
      en: "Mix the destinations that call to you most — we'll design your itinerary.",
      fr: "Combinez les destinations qui vous appellent — nous concevons votre itinéraire.",
    },
    primary: { es: "Planifica tu viaje", en: "Plan my journey", fr: "Planifier mon voyage" },
    secondary: { es: "Ver todos los viajes", en: "Browse all journeys", fr: "Voir tous les voyages" },
  },
};

/* ============================================================
   Section + Destination data
   - id: stable slug used for testids + SlotScope auto-ids
   - cat: category badge (i18n)
   - image: fallback IMG bank key
   - name / blurb: i18n strings
   - trips: ordered list of { routeId, label } → SPA <Link>
============================================================ */
const SECTIONS = [
  {
    id: "imperiales",
    icon: Crown,
    accent: "#C16542",
    overline: { es: "Las cuatro coronas", en: "The four crowns", fr: "Les quatre couronnes" },
    title: {
      es: "Ciudades imperiales",
      en: "Imperial cities",
      fr: "Cités impériales",
    },
    body: {
      es: "Marrakech, Fez, Meknès y Rabat fueron capitales de Marruecos en distintos momentos de la historia. Hoy son los grandes centros culturales del país: medinas Patrimonio de la Humanidad, riads escondidos tras puertas tachonadas, mezquitas y palacios en piedra rosada.",
      en: "Marrakech, Fez, Meknès and Rabat each served as Morocco's capital at different points in history. Today they are the country's great cultural centres: UNESCO medinas, riads hidden behind studded doors, mosques and palaces in rose stone.",
      fr: "Marrakech, Fès, Meknès et Rabat ont tour à tour été capitales du Maroc. Elles sont aujourd'hui les grands centres culturels du pays : médinas classées UNESCO, riads cachés derrière des portes cloutées, mosquées et palais en pierre rose.",
    },
    cards: [
      {
        id: "marrakech",
        cat: { es: "Ciudad imperial", en: "Imperial city", fr: "Cité impériale" },
        image: IMG.koutoubia,
        name: { es: "Marrakech", en: "Marrakech", fr: "Marrakech" },
        blurb: {
          es: "La capital del sur. Jemaa el-Fna al atardecer, jardines Majorelle, la silueta de la Koutoubia y los zocos teñidos de cobre.",
          en: "The southern capital. Jemaa el-Fna at sunset, Majorelle Gardens, the Koutoubia silhouette and copper-stained souks.",
          fr: "La capitale du sud. Jemaa el-Fna au coucher du soleil, jardins Majorelle, la silhouette de la Koutoubia et des souks teintés de cuivre.",
        },
        trips: [
          { routeId: "tourEscapadaMarrakech",   label: { es: "Escapada a Marrakech", en: "Marrakech short escape", fr: "Escapade à Marrakech" } },
          { routeId: "tourMarrakechLoopHub",    label: { es: "Marrakech · Erg Chebbi · Marrakech", en: "Marrakech · Erg Chebbi · Marrakech", fr: "Marrakech · Erg Chebbi · Marrakech" } },
          { routeId: "tourMarrakechEssHub",     label: { es: "Marrakech ⇄ Essaouira", en: "Marrakech ⇄ Essaouira", fr: "Marrakech ⇄ Essaouira" } },
          { routeId: "tourMarrakechErgHub",     label: { es: "Marrakech → Erg Chebbi", en: "Marrakech → Erg Chebbi", fr: "Marrakech → Erg Chebbi" } },
          { routeId: "tourGransurFezRak",       label: { es: "Fez ⇄ Marrakech (Gran Sur)", en: "Fez ⇄ Marrakech (Grand South)", fr: "Fès ⇄ Marrakech (Grand Sud)" } },
        ],
      },
      {
        id: "fez",
        cat: { es: "Ciudad imperial", en: "Imperial city", fr: "Cité impériale" },
        image: IMG.medinaPeople,
        name: { es: "Fez", en: "Fez", fr: "Fès" },
        blurb: {
          es: "La medina viva más grande del mundo. Curtidurías Chouara, al-Qarawiyyin (universidad más antigua del planeta), callejuelas que no caben en un GPS.",
          en: "The world's largest living medina. Chouara tanneries, al-Qarawiyyin (the planet's oldest university), alleys that no GPS can map.",
          fr: "La plus grande médina vivante du monde. Tanneries Chouara, al-Qarawiyyin (la plus ancienne université du monde), ruelles qu'aucun GPS ne peut cartographier.",
        },
        trips: [
          { routeId: "tourEscapadaFez",             label: { es: "Escapada a Fez", en: "Fez short escape", fr: "Escapade à Fès" } },
          { routeId: "tourNorteCiudadesImperiales", label: { es: "Ciudades imperiales", en: "Imperial cities", fr: "Cités impériales" } },
          { routeId: "tourNorteTangerFez",          label: { es: "Tánger ⇄ Fez", en: "Tangier ⇄ Fez", fr: "Tanger ⇄ Fès" } },
          { routeId: "tourGransurFezRak",           label: { es: "Fez → Marrakech (Gran Sur)", en: "Fez → Marrakech (Grand South)", fr: "Fès → Marrakech (Grand Sud)" } },
          { routeId: "tourFezAtlasErr56",           label: { es: "Fez · Atlas · Errachidia", en: "Fez · Atlas · Errachidia", fr: "Fès · Atlas · Errachidia" } },
        ],
      },
      {
        id: "meknes",
        cat: { es: "Ciudad imperial", en: "Imperial city", fr: "Cité impériale" },
        image: IMG.riadInterior,
        name: { es: "Meknès", en: "Meknès", fr: "Meknès" },
        blurb: {
          es: "La pequeña Versalles marroquí. Bab Mansour, las cuadras reales y los graneros de Moulay Ismail al borde de los olivares.",
          en: "Morocco's miniature Versailles. Bab Mansour, the royal stables and Moulay Ismail's granaries bordering vast olive groves.",
          fr: "La petite Versailles marocaine. Bab Mansour, les écuries royales et les greniers de Moulay Ismaïl bordés d'oliveraies.",
        },
        trips: [
          { routeId: "tourNorteCiudadesImperiales", label: { es: "Ciudades imperiales", en: "Imperial cities", fr: "Cités impériales" } },
          { routeId: "tourCiudadesImperialesRif67", label: { es: "Imperiales + Rif (6n/7d)", en: "Imperial + Rif (6n/7d)", fr: "Impériales + Rif (6n/7j)" } },
          { routeId: "tourTangerFez56",             label: { es: "Tánger → Fez (5n/6d)", en: "Tangier → Fez (5n/6d)", fr: "Tanger → Fès (5n/6j)" } },
        ],
      },
      {
        id: "rabat",
        cat: { es: "Ciudad imperial", en: "Imperial city", fr: "Cité impériale" },
        image: IMG.riadFountain,
        name: { es: "Rabat", en: "Rabat", fr: "Rabat" },
        blurb: {
          es: "La capital política. Kasbah de los Udayas sobre el Atlántico, el mausoleo Mohammed V y la torre Hassan inacabada.",
          en: "Morocco's political capital. The Udayas Kasbah over the Atlantic, the Mohammed V mausoleum and the unfinished Hassan Tower.",
          fr: "La capitale politique. Kasbah des Oudayas surplombant l'Atlantique, mausolée Mohammed V et tour Hassan inachevée.",
        },
        trips: [
          { routeId: "tourNorteCiudadesImperiales", label: { es: "Ciudades imperiales", en: "Imperial cities", fr: "Cités impériales" } },
          { routeId: "tourCiudadesImperialesRif67", label: { es: "Imperiales + Rif (6n/7d)", en: "Imperial + Rif (6n/7d)", fr: "Impériales + Rif (6n/7j)" } },
          { routeId: "tourCiudadesImperialesRif78", label: { es: "Imperiales + Rif (7n/8d)", en: "Imperial + Rif (7n/8d)", fr: "Impériales + Rif (7n/8j)" } },
        ],
      },
    ],
  },
  {
    id: "sahara",
    icon: Tent,
    accent: "#D4A373",
    overline: { es: "El sur infinito", en: "The infinite south", fr: "Le sud infini" },
    title: {
      es: "Desierto del Sáhara",
      en: "Sahara Desert",
      fr: "Désert du Sahara",
    },
    body: {
      es: "Las dunas naranjas del Erg Chebbi son el destino más fotografiado del país, pero el sur es mucho más: kasbahs de barro en Ouarzazate, la fortaleza UNESCO de Aït Ben Haddou y los oasis del valle del Drâa.",
      en: "The orange dunes of Erg Chebbi are Morocco's most photographed destination, yet the south is far more: earthen kasbahs in Ouarzazate, the UNESCO fortress of Aït Ben Haddou and the oases of the Drâa valley.",
      fr: "Les dunes orangées de l'Erg Chebbi sont la destination la plus photographiée du pays, mais le sud va bien au-delà : kasbahs de terre à Ouarzazate, forteresse UNESCO d'Aït Ben Haddou et oasis de la vallée du Drâa.",
    },
    cards: [
      {
        id: "ergchebbi",
        cat: { es: "Desierto · dunas", en: "Desert · dunes", fr: "Désert · dunes" },
        image: IMG.dunes,
        name: { es: "Erg Chebbi · Merzouga", en: "Erg Chebbi · Merzouga", fr: "Erg Chebbi · Merzouga" },
        blurb: {
          es: "Las dunas más altas de Marruecos, hasta 150 m. Bivouac bajo las estrellas, paseo en dromedario y amanecer en Tombouctou.",
          en: "Morocco's highest dunes, up to 150 m. Bivouac under the stars, camel ride and sunrise over Tombouctou.",
          fr: "Les plus hautes dunes du Maroc, jusqu'à 150 m. Bivouac sous les étoiles, balade à dromadaire et lever de soleil sur Tombouctou.",
        },
        trips: [
          { routeId: "tourEscapadaDesierto34",    label: { es: "Escapada al desierto (3n/4d)", en: "Desert escape (3n/4d)", fr: "Escapade au désert (3n/4j)" } },
          { routeId: "tourEscapadaRakErgRakHub",  label: { es: "Marrakech ⇄ Erg ⇄ Marrakech", en: "Marrakech ⇄ Erg ⇄ Marrakech", fr: "Marrakech ⇄ Erg ⇄ Marrakech" } },
          { routeId: "tourMarrakechErgHub",       label: { es: "Marrakech → Erg Chebbi", en: "Marrakech → Erg Chebbi", fr: "Marrakech → Erg Chebbi" } },
          { routeId: "tourErgChebbiMarrakechHub", label: { es: "Erg Chebbi → Marrakech", en: "Erg Chebbi → Marrakech", fr: "Erg Chebbi → Marrakech" } },
          { routeId: "tourMarrakechLoopHub",      label: { es: "Marrakech circular (loop)", en: "Marrakech loop", fr: "Marrakech en boucle" } },
          { routeId: "tourFezAtlasErr56",         label: { es: "Fez · Atlas · Errachidia", en: "Fez · Atlas · Errachidia", fr: "Fès · Atlas · Errachidia" } },
        ],
      },
      {
        id: "ouarzazate",
        cat: { es: "Puerta del desierto", en: "Desert gateway", fr: "Porte du désert" },
        image: IMG.kasbahArch,
        name: { es: "Ouarzazate · Skoura", en: "Ouarzazate · Skoura", fr: "Ouarzazate · Skoura" },
        blurb: {
          es: "La puerta del desierto y capital del cine marroquí. Kasbah de Taourirt, estudios de Atlas y el palmeral milenario de Skoura.",
          en: "The desert gateway and capital of Moroccan cinema. Taourirt Kasbah, Atlas studios and Skoura's thousand-year-old palm grove.",
          fr: "La porte du désert et capitale du cinéma marocain. Kasbah de Taourirt, studios d'Atlas et la palmeraie millénaire de Skoura.",
        },
        trips: [
          { routeId: "tourAtlasDesiertoHub",     label: { es: "Atlas · Desierto", en: "Atlas · Desert", fr: "Atlas · Désert" } },
          { routeId: "tourGransurOuarzaFez",     label: { es: "Ouarzazate · Sidi Ali · Fez", en: "Ouarzazate · Sidi Ali · Fez", fr: "Ouarzazate · Sidi Ali · Fès" } },
          { routeId: "tourAtlasDesiertoFezHub",  label: { es: "Atlas · Desierto · Fez", en: "Atlas · Desert · Fez", fr: "Atlas · Désert · Fès" } },
        ],
      },
      {
        id: "aitbenhaddou",
        cat: { es: "Patrimonio UNESCO", en: "UNESCO heritage", fr: "Patrimoine UNESCO" },
        image: IMG.kasbahGate,
        name: { es: "Aït Ben Haddou", en: "Aït Ben Haddou", fr: "Aït Ben Haddou" },
        blurb: {
          es: "La ksar de tierra más célebre del Atlas, Patrimonio de la Humanidad. Gladiator, Juego de Tronos y Lawrence de Arabia se rodaron entre sus murallas.",
          en: "The most famous earthen ksar of the Atlas, a UNESCO World Heritage site. Gladiator, Game of Thrones and Lawrence of Arabia were all filmed within its walls.",
          fr: "Le ksar de terre le plus célèbre de l'Atlas, classé Patrimoine Mondial. Gladiator, Game of Thrones et Lawrence d'Arabie y ont été tournés.",
        },
        trips: [
          { routeId: "tourAtlasDesiertoHub", label: { es: "Atlas · Desierto", en: "Atlas · Desert", fr: "Atlas · Désert" } },
          { routeId: "tourGransurFezRak",    label: { es: "Fez ⇄ Marrakech (Gran Sur)", en: "Fez ⇄ Marrakech (Grand South)", fr: "Fès ⇄ Marrakech (Grand Sud)" } },
          { routeId: "tourMarrakechErgHub",  label: { es: "Marrakech → Erg Chebbi", en: "Marrakech → Erg Chebbi", fr: "Marrakech → Erg Chebbi" } },
        ],
      },
    ],
  },
  {
    id: "atlas",
    icon: Mountain,
    accent: "#5A6B4F",
    overline: { es: "La cordillera mítica", en: "The mythical range", fr: "La chaîne mythique" },
    title: {
      es: "Atlas y montañas",
      en: "Atlas & mountains",
      fr: "Atlas & montagnes",
    },
    body: {
      es: "Tres cordilleras paralelas atraviesan Marruecos. El Alto Atlas culmina en el Toubkal (4 167 m). Las gargantas del Dadès y el Todra esculpen el desierto en piedra. Pueblos bereberes adobe, valles nogales, picos nevados en marzo.",
      en: "Three parallel ranges cross Morocco. The High Atlas peaks at Toubkal (4,167 m). The Dadès and Todra gorges carve the desert into stone. Berber adobe villages, walnut valleys, snow-capped peaks until March.",
      fr: "Trois chaînes parallèles traversent le Maroc. Le Haut Atlas culmine au Toubkal (4 167 m). Les gorges du Dadès et du Todra sculptent le désert dans la pierre. Villages berbères en pisé, vallées noyer, sommets enneigés jusqu'en mars.",
    },
    cards: [
      {
        id: "altoatlas",
        cat: { es: "Cordillera", en: "Mountain range", fr: "Chaîne de montagnes" },
        image: IMG.atlasSnowy,
        name: { es: "Alto Atlas", en: "High Atlas", fr: "Haut Atlas" },
        blurb: {
          es: "Cumbres nevadas, valles de almendros en flor, puertos a 2 260 m. La columna vertebral del país, visible incluso desde Marrakech.",
          en: "Snow-capped summits, almond-blossom valleys, mountain passes at 2,260 m. Morocco's spine, visible even from Marrakech.",
          fr: "Sommets enneigés, vallées d'amandiers en fleurs, cols à 2 260 m. La colonne vertébrale du Maroc, visible jusqu'à Marrakech.",
        },
        trips: [
          { routeId: "tourAtlasDesiertoHub", label: { es: "Atlas · Desierto", en: "Atlas · Desert", fr: "Atlas · Désert" } },
          { routeId: "tourEscapadaAtlas34",  label: { es: "Escapada al Atlas (3n/4d)", en: "Atlas escape (3n/4d)", fr: "Escapade en Atlas (3n/4j)" } },
          { routeId: "tourFezAtlasErr56",    label: { es: "Fez · Atlas · Errachidia", en: "Fez · Atlas · Errachidia", fr: "Fès · Atlas · Errachidia" } },
        ],
      },
      {
        id: "imlil",
        cat: { es: "Senderismo · Toubkal", en: "Trekking · Toubkal", fr: "Randonnée · Toubkal" },
        image: IMG.atlasValley,
        name: { es: "Imlil · Toubkal", en: "Imlil · Toubkal", fr: "Imlil · Toubkal" },
        blurb: {
          es: "Base de los trekkings al Toubkal (4 167 m). Pueblos de piedra, mulas en los senderos, refugios bereberes a 3 200 m.",
          en: "Base camp for Toubkal treks (4,167 m). Stone villages, mules on the trails, Berber refuges at 3,200 m.",
          fr: "Camp de base des treks du Toubkal (4 167 m). Villages en pierre, mules sur les sentiers, refuges berbères à 3 200 m.",
        },
        trips: [
          { routeId: "tourEscapadaAtlas34", label: { es: "Escapada al Atlas (3n/4d)", en: "Atlas escape (3n/4d)", fr: "Escapade en Atlas (3n/4j)" } },
          { routeId: "tourAdventure",       label: { es: "Viajes de aventura", en: "Adventure tours", fr: "Voyages aventure" } },
        ],
      },
      {
        id: "dades-todra",
        cat: { es: "Gargantas · ríos", en: "Gorges · rivers", fr: "Gorges · rivières" },
        image: IMG.atlasMisty,
        name: { es: "Dadès y Todra", en: "Dadès & Todra", fr: "Dadès & Todra" },
        blurb: {
          es: "Las dos gargantas más espectaculares del Atlas: paredes verticales de 300 m, palmerales escondidos y la curva infinita de la 'cola de mono' del Dadès.",
          en: "The Atlas's two most spectacular gorges: 300 m vertical walls, hidden palm groves and the endless curve of Dadès' 'monkey-tail'.",
          fr: "Les deux gorges les plus spectaculaires de l'Atlas : parois verticales de 300 m, palmeraies cachées et la courbe infinie de la « queue de singe » du Dadès.",
        },
        trips: [
          { routeId: "tourMarrakechErgHub", label: { es: "Marrakech → Erg Chebbi", en: "Marrakech → Erg Chebbi", fr: "Marrakech → Erg Chebbi" } },
          { routeId: "tourGransurFezRak",   label: { es: "Fez ⇄ Marrakech (Gran Sur)", en: "Fez ⇄ Marrakech (Grand South)", fr: "Fès ⇄ Marrakech (Grand Sud)" } },
          { routeId: "tourFezAtlasErr56",   label: { es: "Fez · Atlas · Errachidia", en: "Fez · Atlas · Errachidia", fr: "Fès · Atlas · Errachidia" } },
        ],
      },
    ],
  },
  {
    id: "norte",
    icon: Sparkles,
    accent: "#5A7F9C",
    overline: { es: "El norte azul", en: "The blue north", fr: "Le nord bleu" },
    title: {
      es: "Norte mediterráneo y Rif",
      en: "Mediterranean north & Rif",
      fr: "Nord méditerranéen & Rif",
    },
    body: {
      es: "El norte de Marruecos es otro país: Tánger mira a Tarifa, Chefchaouen está pintado de azul indigo, Asilah es la respuesta marroquí a Cádiz. Influencia andalusí, fortalezas portuguesas, montañas del Rif.",
      en: "Morocco's north is another country: Tangier looks across at Tarifa, Chefchaouen is painted indigo blue, Asilah is the Moroccan answer to Cádiz. Andalusi heritage, Portuguese fortresses, Rif mountains.",
      fr: "Le nord du Maroc est un autre pays : Tanger regarde Tarifa, Chefchaouen est peinte en bleu indigo, Asilah est la réponse marocaine à Cadix. Patrimoine andalou, forteresses portugaises, monts du Rif.",
    },
    cards: [
      {
        id: "tanger",
        cat: { es: "Estrecho · puerto", en: "Strait · port", fr: "Détroit · port" },
        image: IMG.essaouiraPort,
        name: { es: "Tánger", en: "Tangier", fr: "Tanger" },
        blurb: {
          es: "La puerta entre dos continentes. Café Hafa, kasbah sobre el Estrecho, la medina escrita por Bowles y Burroughs.",
          en: "The gateway between two continents. Café Hafa, kasbah over the Strait, the medina written about by Bowles and Burroughs.",
          fr: "La porte entre deux continents. Café Hafa, kasbah sur le Détroit, la médina chantée par Bowles et Burroughs.",
        },
        trips: [
          { routeId: "tourEscapadaTanger",      label: { es: "Escapada a Tánger", en: "Tangier short escape", fr: "Escapade à Tanger" } },
          { routeId: "tourNorteTangerFez",      label: { es: "Tánger ⇄ Fez", en: "Tangier ⇄ Fez", fr: "Tanger ⇄ Fès" } },
          { routeId: "tourGransurTangerRak",    label: { es: "Tánger → Marrakech (Gran Sur)", en: "Tangier → Marrakech (Grand South)", fr: "Tanger → Marrakech (Grand Sud)" } },
        ],
      },
      {
        id: "chefchaouen",
        cat: { es: "Pueblo azul · Rif", en: "Blue town · Rif", fr: "Village bleu · Rif" },
        image: IMG.chefBlueCity,
        name: { es: "Chefchaouen", en: "Chefchaouen", fr: "Chefchaouen" },
        blurb: {
          es: "La medina pintada de azul indigo entre las montañas del Rif. Mezquita roja, plaza Uta el-Hammam, cascadas de Akchour a 30 minutos.",
          en: "The medina painted indigo blue between the Rif mountains. Red mosque, Uta el-Hammam square, Akchour waterfalls just 30 min away.",
          fr: "La médina peinte en bleu indigo entre les monts du Rif. Mosquée rouge, place Uta el-Hammam, cascades d'Akchour à 30 minutes.",
        },
        trips: [
          { routeId: "tourCiudadesImperialesRif67", label: { es: "Imperiales + Rif (6n/7d)", en: "Imperial + Rif (6n/7d)", fr: "Impériales + Rif (6n/7j)" } },
          { routeId: "tourCiudadesImperialesRif78", label: { es: "Imperiales + Rif (7n/8d)", en: "Imperial + Rif (7n/8d)", fr: "Impériales + Rif (7n/8j)" } },
          { routeId: "tourNorteTangerFez",          label: { es: "Tánger ⇄ Fez", en: "Tangier ⇄ Fez", fr: "Tanger ⇄ Fès" } },
        ],
      },
      {
        id: "asilah",
        cat: { es: "Pueblo blanco · costa", en: "White town · coast", fr: "Village blanc · côte" },
        image: IMG.chefStreet,
        name: { es: "Asilah", en: "Asilah", fr: "Asilah" },
        blurb: {
          es: "La medina blanca con murales pintados cada verano. Murallas portuguesas del XV, playas atlánticas vacías y festival internacional de arte.",
          en: "The white medina with murals painted each summer. 15th-century Portuguese walls, empty Atlantic beaches and an international art festival.",
          fr: "La médina blanche aux fresques repeintes chaque été. Remparts portugais du XVe, plages atlantiques désertes et festival d'art international.",
        },
        trips: [
          { routeId: "tourCiudadesImperialesRif67", label: { es: "Imperiales + Rif (6n/7d)", en: "Imperial + Rif (6n/7d)", fr: "Impériales + Rif (6n/7j)" } },
          { routeId: "tourCiudadesImperialesRif78", label: { es: "Imperiales + Rif (7n/8d)", en: "Imperial + Rif (7n/8d)", fr: "Impériales + Rif (7n/8j)" } },
        ],
      },
    ],
  },
  {
    id: "costa",
    icon: Waves,
    accent: "#3F6B7A",
    overline: { es: "Atlántico marroquí", en: "Moroccan Atlantic", fr: "Atlantique marocain" },
    title: {
      es: "Costa atlántica",
      en: "Atlantic coast",
      fr: "Côte atlantique",
    },
    body: {
      es: "1 800 km de costa atlántica desde Tánger hasta el Sáhara. Vientos de alisios, surf, gaviotas, sardinas frescas en el puerto y dos joyas patrimoniales: Essaouira y Casablanca.",
      en: "1,800 km of Atlantic coast from Tangier to the Sahara. Trade winds, surf, gulls, fresh sardines at the port and two heritage jewels: Essaouira and Casablanca.",
      fr: "1 800 km de côte atlantique de Tanger au Sahara. Alizés, surf, mouettes, sardines fraîches au port et deux joyaux : Essaouira et Casablanca.",
    },
    cards: [
      {
        id: "essaouira",
        cat: { es: "Patrimonio UNESCO · costa", en: "UNESCO · coast", fr: "UNESCO · côte" },
        image: IMG.essaouiraPort,
        name: { es: "Essaouira · Mogador", en: "Essaouira · Mogador", fr: "Essaouira · Mogador" },
        blurb: {
          es: "Murallas portuguesas, gaviotas, vientos de alisios y una de las medinas más fotogénicas del país. Capital del gnaoua y del kitesurf.",
          en: "Portuguese walls, gulls, trade winds and one of Morocco's most photogenic medinas. Capital of gnawa music and kitesurfing.",
          fr: "Remparts portugais, mouettes, alizés et l'une des médinas les plus photogéniques du Maroc. Capitale du gnawa et du kitesurf.",
        },
        trips: [
          { routeId: "tourMarrakechEssHub",   label: { es: "Marrakech ⇄ Essaouira", en: "Marrakech ⇄ Essaouira", fr: "Marrakech ⇄ Essaouira" } },
          { routeId: "tourMarrakechEss45",    label: { es: "Marrakech · Essaouira (4n/5d)", en: "Marrakech · Essaouira (4n/5d)", fr: "Marrakech · Essaouira (4n/5j)" } },
          { routeId: "tourMarrakechEss67",    label: { es: "Marrakech · Essaouira (6n/7d)", en: "Marrakech · Essaouira (6n/7d)", fr: "Marrakech · Essaouira (6n/7j)" } },
        ],
      },
      {
        id: "casablanca",
        cat: { es: "Metrópolis · Art Déco", en: "Metropolis · Art Deco", fr: "Métropole · Art Déco" },
        image: IMG.marketBaskets,
        name: { es: "Casablanca", en: "Casablanca", fr: "Casablanca" },
        blurb: {
          es: "La capital económica. Mezquita Hassan II sobre el Atlántico (uno de los minaretes más altos del mundo) y el mejor Art Déco del Magreb.",
          en: "Morocco's economic capital. The Hassan II Mosque over the Atlantic (one of the tallest minarets on earth) and the Maghreb's best Art Deco.",
          fr: "La capitale économique. Mosquée Hassan II au-dessus de l'Atlantique (l'un des plus hauts minarets du monde) et le meilleur Art Déco du Maghreb.",
        },
        trips: [
          { routeId: "tourNorteCiudadesImperiales", label: { es: "Ciudades imperiales", en: "Imperial cities", fr: "Cités impériales" } },
          { routeId: "tourCiudadesImperialesRif67", label: { es: "Imperiales + Rif (6n/7d)", en: "Imperial + Rif (6n/7d)", fr: "Impériales + Rif (6n/7j)" } },
        ],
      },
    ],
  },
  {
    id: "joyas",
    icon: Star,
    accent: "#8C6A3D",
    overline: { es: "Lo que pocos conocen", en: "What few know", fr: "Ce que peu connaissent" },
    title: {
      es: "Joyas escondidas",
      en: "Hidden gems",
      fr: "Joyaux cachés",
    },
    body: {
      es: "Lugares que casi nadie cita pero que cambian un viaje. Las ruinas romanas de Volubilis, el lago Aguelmane Sidi Ali a 2 100 m, los pueblos de tierra de Boumalne. Detalles que solo descubres con guía local.",
      en: "Places almost nobody mentions yet they change a journey. The Roman ruins of Volubilis, Aguelmane Sidi Ali lake at 2,100 m, the earthen villages of Boumalne. Details you only discover with a local guide.",
      fr: "Des lieux que presque personne ne mentionne mais qui changent un voyage. Les ruines romaines de Volubilis, le lac Aguelmane Sidi Ali à 2 100 m, les villages en pisé de Boumalne. Des détails qu'on ne découvre qu'avec un guide local.",
    },
    cards: [
      {
        id: "volubilis",
        cat: { es: "Patrimonio UNESCO · romano", en: "UNESCO · Roman", fr: "UNESCO · Romain" },
        image: IMG.atlasVillage,
        name: { es: "Volubilis", en: "Volubilis", fr: "Volubilis" },
        blurb: {
          es: "La ciudad romana mejor conservada del norte de África. Mosaicos in situ, basílica, Arco de Caracalla y vistas sobre los campos de Mulay Idris.",
          en: "North Africa's best-preserved Roman city. In-situ mosaics, basilica, Arch of Caracalla and views over Moulay Idris fields.",
          fr: "La cité romaine la mieux conservée d'Afrique du Nord. Mosaïques in situ, basilique, Arc de Caracalla et vues sur les champs de Moulay Idriss.",
        },
        trips: [
          { routeId: "tourNorteCiudadesImperiales", label: { es: "Ciudades imperiales", en: "Imperial cities", fr: "Cités impériales" } },
          { routeId: "tourNorteTangerFez",          label: { es: "Tánger ⇄ Fez", en: "Tangier ⇄ Fez", fr: "Tanger ⇄ Fès" } },
          { routeId: "tourTangerFez56",             label: { es: "Tánger → Fez (5n/6d)", en: "Tangier → Fez (5n/6d)", fr: "Tanger → Fès (5n/6j)" } },
        ],
      },
      {
        id: "sidiali",
        cat: { es: "Medio Atlas · lago", en: "Middle Atlas · lake", fr: "Moyen Atlas · lac" },
        image: IMG.atlasMisty,
        name: { es: "Aguelmane Sidi Ali", en: "Aguelmane Sidi Ali", fr: "Aguelmane Sidi Ali" },
        blurb: {
          es: "Lago volcánico del Medio Atlas a 2 100 m. Macacos berberiscos en el cedral, nieblas matinales sobre el agua negra, pastores transhumantes.",
          en: "Volcanic lake of the Middle Atlas at 2,100 m. Barbary macaques in the cedar forest, morning mist over the dark water, transhumant shepherds.",
          fr: "Lac volcanique du Moyen Atlas à 2 100 m. Macaques de Barbarie dans la cédraie, brouillards matinaux sur l'eau noire, bergers transhumants.",
        },
        trips: [
          { routeId: "tourGransurFezSidiali",         label: { es: "Fez · Sidi Ali · Marrakech", en: "Fez · Sidi Ali · Marrakech", fr: "Fès · Sidi Ali · Marrakech" } },
          { routeId: "tourGransurOuarzaFez",          label: { es: "Ouarzazate · Sidi Ali · Fez", en: "Ouarzazate · Sidi Ali · Fez", fr: "Ouarzazate · Sidi Ali · Fès" } },
          { routeId: "tourMarrakechSidialiFez78",     label: { es: "Marrakech · Sidi Ali · Fez (7n/8d)", en: "Marrakech · Sidi Ali · Fez (7n/8d)", fr: "Marrakech · Sidi Ali · Fès (7n/8j)" } },
        ],
      },
    ],
  },
];

/* ============================================================
   Sub-components
============================================================ */
const InlineBreadcrumb = ({ lang }) => (
  <nav
    aria-label="Breadcrumb"
    data-testid="qvm-breadcrumbs"
    className="inline-flex items-center gap-2 bg-[#1A1513]/55 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7]/90"
  >
    <Link to={pathFor(lang, "home")} data-testid="qvm-bc-home" className="flex items-center gap-1.5 hover:text-[#D4A373] transition-colors">
      <Home className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
      <span>{pick(COPY.breadcrumb, lang)}</span>
    </Link>
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    <span>{pick(COPY.guides, lang)}</span>
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    <span className="text-[#D4A373]">{pick(COPY.current, lang)}</span>
  </nav>
);

const Hero = ({ lang }) => (
  <section
    data-testid="qvm-hero"
    className="relative min-h-[100svh] w-full overflow-hidden bg-[#1A1513]"
  >
    <EditableImage
      slot="que-ver-en-marruecos.hero"
      fallback={banner("atlasSnowy", 2400)}
      alt=""
      priority
      aspectRatio="auto"
      imgProps={{ loading: "eager" }}
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/50 to-[#1A1513]/30 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-40 pointer-events-none" aria-hidden="true" />
    <span className="film-grain pointer-events-none" />
    <HeroMonogram />

    <div className="relative z-10 min-h-[100svh] flex flex-col">
      <div className="pt-[112px] md:pt-[132px] px-6 md:px-12 max-w-7xl mx-auto w-full">
        <InlineBreadcrumb lang={lang} />
      </div>
      <div className="flex-1 flex items-end pt-32 md:pt-44 pb-24 md:pb-32">
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

const Intro = ({ lang }) => (
  <section id="qvm-intro" data-testid="qvm-intro" className="relative bg-[#FDFBF7] py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
      <div className="md:col-span-5">
        <span className="overline inline-flex items-center gap-2 text-[#C16542]">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
          {pick(COPY.intro.overline, lang)}
        </span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.06] tracking-tight mt-5 text-[#2C2621]">
          {pick(COPY.intro.title, lang)}
        </h2>
      </div>
      <div className="md:col-span-7 md:pt-2">
        <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">{pick(COPY.intro.body, lang)}</p>
      </div>
    </div>
  </section>
);

const DestinationCard = ({ card, sectionAccent, lang }) => (
  <SlotScope id={card.id}>
    <article
      data-testid={`qvm-card-${card.id}`}
      className="group relative bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#2C2621]/30 transition-colors duration-300 flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1513]">
        <EditableImage
          name="image"
          fallback={card.image}
          alt={pick(card.name, lang)}
          aspectRatio="4/3"
          imgProps={{ loading: "lazy" }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/65 via-[#1A1513]/10 to-transparent pointer-events-none" />
        <span
          data-testid={`qvm-card-cat-${card.id}`}
          className="absolute top-3 left-3 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
          style={{ color: sectionAccent }}
        >
          <MapPin className="w-3 h-3" strokeWidth={1.6} />
          {pick(card.cat, lang)}
        </span>
        <CardBrandOverlay slug={`qvm-card-${card.id}`} testid={`qvm-card-${card.id}`} />
      </div>

      <div className="p-6 md:p-7 flex flex-col flex-1">
        <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.12] text-[#2C2621]">
          {pick(card.name, lang)}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#5C5248]">
          {pick(card.blurb, lang)}
        </p>

        <CircuitTestimonials slug={`qvm-${card.id}`} items={getPlaceTestimonials(card.id)} programRouteId={priceRouteIds(card.trips[0]?.routeId)[0]} accent={sectionAccent} autoRotate={false} verifiedBelow />

        <div className="mt-6 pt-5 border-t border-[#2C2621]/10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">
            {pick(COPY.tripsCta, lang)}
          </p>
          <ul className="flex flex-col gap-1.5">
            {card.trips.map((trip, i) => (
              <li key={trip.routeId}>
                <Link
                  to={pathFor(lang, trip.routeId)}
                  data-testid={`qvm-trip-${card.id}-${i}`}
                  className="group/link flex items-center justify-between gap-3 px-3 py-2 -mx-3 hover:bg-[#F2EBE1] transition-colors duration-200 rounded-sm"
                  style={{ borderLeft: `2px solid ${sectionAccent}55` }}
                >
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm text-[#2C2621] group-hover/link:text-[#C16542] transition-colors">
                      {pick(trip.label, lang)}
                    </span>
                    <FromPrice tone="dark" size="xs" routeIds={priceRouteIds(trip.routeId)} testid={`qvm-trip-from-${card.id}-${i}`} />
                  </span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-[#5C5248] group-hover/link:text-[#C16542] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all flex-shrink-0"
                    strokeWidth={1.8}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  </SlotScope>
);

const Section = ({ section, lang }) => {
  const Icon = section.icon || Sparkles;
  return (
    <SlotScope id={`destinations.${section.id}`}>
      <section
        data-testid={`qvm-section-${section.id}`}
        className="relative bg-[#FDFBF7] py-20 md:py-28 border-t border-[#2C2621]/10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
            <div className="md:col-span-7">
              <span
                className="overline inline-flex items-center gap-2"
                style={{ color: section.accent }}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.6} />
                {pick(section.overline, lang)}
              </span>
              <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#2C2621]">
                {pick(section.title, lang)}
              </h2>
            </div>
            <div className="md:col-span-5">
              <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">
                {pick(section.body, lang)}
              </p>
            </div>
          </div>

          <div
            className={`grid gap-6 md:gap-8 ${
              section.cards.length <= 2
                ? "grid-cols-1 sm:grid-cols-2"
                : section.cards.length === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {section.cards.map((card) => (
              <DestinationCard
                key={card.id}
                card={card}
                sectionAccent={section.accent}
                lang={lang}
              />
            ))}
          </div>
        </div>
      </section>
    </SlotScope>
  );
};

/* ============================================================
   Interactive mini-map · all 17 destinations
============================================================ */
const DESTINATION_COORDS = {
  marrakech:    [31.6295, -7.9811],
  fez:          [34.0331, -4.9998],
  meknes:       [33.8932, -5.5547],
  rabat:        [34.0209, -6.8416],
  ergchebbi:    [31.1335, -3.9785],
  ouarzazate:   [30.9189, -6.8939],
  aitbenhaddou: [31.0470, -7.1294],
  altoatlas:    [31.2117, -7.9233],
  imlil:        [31.1366, -7.9192],
  "dades-todra":[31.4900, -5.7300],
  tanger:       [35.7595, -5.8330],
  chefchaouen:  [35.1690, -5.2636],
  asilah:       [35.4650, -6.0341],
  essaouira:    [31.5085, -9.7595],
  casablanca:   [33.5731, -7.5898],
  volubilis:    [34.0727, -5.5556],
  sidiali:      [33.0703, -5.0014],
};

const ALL_DESTINATIONS = SECTIONS.flatMap((s) =>
  s.cards
    .map((c) => {
      const coords = DESTINATION_COORDS[c.id];
      if (!coords) return null;
      return { card: c, section: s, coords };
    })
    .filter(Boolean)
);

/* Featured "best-selling" routes — each connects existing destination ids
   and resolves to a real itinerary hub/program in the catalogue. */
const FEATURED_ROUTES = [
  {
    id: "gran-sur-fez-rak",
    color: "#C16542",
    routeId: "tourGransurFezRak",
    bestRegionId: "sahara",
    waypoints: ["fez", "sidiali", "ergchebbi", "dades-todra", "aitbenhaddou", "marrakech"],
    label: {
      es: "Gran Sur · Fez → Marrakech",
      en: "Grand South · Fez → Marrakech",
      fr: "Grand Sud · Fès → Marrakech",
    },
    body: {
      es: "El recorrido emblemático que atraviesa el Medio Atlas, las dunas del Erg Chebbi y las gargantas hasta Marrakech.",
      en: "The signature route across the Middle Atlas, the dunes of Erg Chebbi and the gorges down to Marrakech.",
      fr: "L'itinéraire emblématique à travers le Moyen Atlas, les dunes de l'Erg Chebbi et les gorges jusqu'à Marrakech.",
    },
  },
  {
    id: "tanger-rak-norte-sur",
    color: "#8C6A3D",
    routeId: "tourGransurTangerRak",
    bestRegionId: "sahara",
    waypoints: ["tanger", "chefchaouen", "fez", "ergchebbi", "dades-todra", "aitbenhaddou", "marrakech"],
    label: {
      es: "Tánger → Marrakech · Norte a Sur",
      en: "Tangier → Marrakech · North to South",
      fr: "Tanger → Marrakech · Du Nord au Sud",
    },
    body: {
      es: "El gran viaje épico, del Mediterráneo a las puertas del Sáhara cruzando todo el país.",
      en: "The epic journey from the Mediterranean to the gates of the Sahara, end to end.",
      fr: "Le grand voyage épique, de la Méditerranée aux portes du Sahara.",
    },
  },
  {
    id: "imperial-cities",
    color: "#5A7F9C",
    routeId: "tourNorteCiudadesImperiales",
    bestRegionId: "marrakech",
    waypoints: ["casablanca", "rabat", "meknes", "volubilis", "fez", "marrakech"],
    label: {
      es: "Ciudades imperiales",
      en: "Imperial cities",
      fr: "Cités impériales",
    },
    body: {
      es: "Las cuatro capitales históricas conectadas en un solo circuito cultural: Rabat, Meknès, Fez y Marrakech.",
      en: "The four historic capitals connected in a single cultural circuit: Rabat, Meknès, Fez and Marrakech.",
      fr: "Les quatre capitales historiques réunies en un seul circuit : Rabat, Meknès, Fès et Marrakech.",
    },
  },
  {
    id: "marrakech-loop",
    color: "#D4A373",
    routeId: "tourMarrakechLoopHub",
    bestRegionId: "sahara",
    waypoints: ["marrakech", "aitbenhaddou", "dades-todra", "ergchebbi", "dades-todra", "marrakech"],
    label: {
      es: "Marrakech ↻ Erg Chebbi ↻ Marrakech",
      en: "Marrakech ↻ Erg Chebbi ↻ Marrakech",
      fr: "Marrakech ↻ Erg Chebbi ↻ Marrakech",
    },
    body: {
      es: "El clásico circular: Atlas, valles de kasbahs, dunas naranjas y vuelta al punto de partida.",
      en: "The classic loop: Atlas, kasbah valleys, orange dunes and back to where you started.",
      fr: "La boucle classique : Atlas, vallées des kasbahs, dunes orangées et retour au point de départ.",
    },
  },
  {
    id: "tanger-fez-rif",
    color: "#5A6B4F",
    routeId: "tourNorteTangerFez",
    bestRegionId: "north",
    waypoints: ["tanger", "asilah", "chefchaouen", "volubilis", "meknes", "fez"],
    label: {
      es: "Tánger · Rif · Fez",
      en: "Tangier · Rif · Fez",
      fr: "Tanger · Rif · Fès",
    },
    body: {
      es: "El norte mediterráneo: kasbah de Tánger, murallas de Asilah, Chefchaouen azul y Volubilis romano hasta Fez.",
      en: "The Mediterranean north: Tangier's kasbah, Asilah's walls, blue Chefchaouen and Roman Volubilis through to Fez.",
      fr: "Le nord méditerranéen : kasbah de Tanger, remparts d'Asilah, Chefchaouen bleue et Volubilis romain jusqu'à Fès.",
    },
  },
];

/* Resolve waypoints (by id) into coord tuples, ignoring missing ids. */
const resolveRouteCoords = (route) =>
  route.waypoints
    .map((id) => DESTINATION_COORDS[id])
    .filter(Boolean);

/* Resolve waypoints into rich {id, name, coords} for the side panel. */
const resolveRouteStops = (route) =>
  route.waypoints
    .map((id) => {
      const found = ALL_DESTINATIONS.find((d) => d.card.id === id);
      if (!found) return null;
      return { id, card: found.card, coords: found.coords };
    })
    .filter(Boolean);

const DestinationsMap = ({ lang }) => {
  const [activeId, setActiveId] = useState(null);
  const [activeRouteId, setActiveRouteId] = useState(null);

  const active = useMemo(
    () => ALL_DESTINATIONS.find((d) => d.card.id === activeId) || null,
    [activeId]
  );
  const activeRoute = useMemo(
    () => FEATURED_ROUTES.find((r) => r.id === activeRouteId) || null,
    [activeRouteId]
  );
  const activeRouteCoords = useMemo(
    () => (activeRoute ? resolveRouteCoords(activeRoute) : []),
    [activeRoute]
  );
  const activeRouteStops = useMemo(
    () => (activeRoute ? resolveRouteStops(activeRoute) : []),
    [activeRoute]
  );

  return (
    <section
      id="qvm-map-section" data-testid="qvm-map-section"
      className="relative bg-[#1A1513] py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-10 md:mb-14">
          <div className="md:col-span-7">
            <span className="overline inline-flex items-center gap-2 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              {pick(COPY.map.overline, lang)}
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight mt-4 text-[#FDFBF7]">
              {pick(COPY.map.title, lang)}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">{pick(COPY.map.body, lang)}</p>
          </div>
        </div>

        {/* Route toggle row */}
        <div data-testid="qvm-routes-toolbar" className="mb-6 md:mb-8">
          <div className="flex items-baseline gap-4 mb-3 flex-wrap">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]">
              {pick(COPY.map.routesLabel, lang)}
            </span>
            <span className="text-[11px] text-[#FDFBF7]/55">
              {pick(COPY.map.routesHint, lang)}
            </span>
          </div>
          <div role="tablist" aria-label="Featured routes" className="flex flex-wrap gap-2">
            {FEATURED_ROUTES.map((r) => {
              const isActive = activeRouteId === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  data-testid={`qvm-route-chip-${r.id}`}
                  onClick={() => setActiveRouteId(isActive ? null : r.id)}
                  className={`group inline-flex items-center gap-2 px-3.5 py-2 text-[11px] tracking-[0.18em] uppercase border transition-all duration-200 ${
                    isActive
                      ? "text-[#1A1513] border-transparent"
                      : "text-[#FDFBF7]/80 border-[#FDFBF7]/20 hover:text-[#FDFBF7] hover:border-[#FDFBF7]/40"
                  }`}
                  style={isActive ? { backgroundColor: r.color } : { backgroundColor: "transparent" }}
                  aria-pressed={isActive}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: isActive ? "#1A1513" : r.color }}
                  />
                  {pick(r.label, lang)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Map */}
          <div className="lg:col-span-7 relative">
            <div
              data-testid="qvm-leaflet-wrapper"
              className="relative h-[460px] md:h-[560px] w-full overflow-hidden border border-[#FDFBF7]/15 bg-[#221A16]"
            >
              <MapContainer
                center={[31.7917, -7.0926]}
                zoom={6}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%", background: "#1A1513" }}
                attributionControl={false}
              >
                <MapBaseLayers variant="dark" />

                {/* Optional polyline for the selected route */}
                {activeRoute && activeRouteCoords.length >= 2 && (
                  <Polyline
                    positions={activeRouteCoords}
                    pathOptions={{
                      color: activeRoute.color,
                      weight: 4,
                      opacity: 0.85,
                      dashArray: "1 8",
                      lineCap: "round",
                    }}
                  />
                )}

                {ALL_DESTINATIONS.map(({ card, section, coords }) => {
                  const isActive = activeId === card.id;
                  const onRoute = activeRoute?.waypoints.includes(card.id);
                  const radius = isActive ? 11 : onRoute ? 9 : 7;
                  return (
                    <CircleMarker
                      key={card.id}
                      center={coords}
                      radius={radius}
                      pathOptions={{
                        color: onRoute ? activeRoute.color : section.accent,
                        fillColor: onRoute ? activeRoute.color : section.accent,
                        fillOpacity: isActive ? 0.95 : onRoute ? 0.9 : 0.7,
                        weight: isActive ? 3 : onRoute ? 2.5 : 2,
                      }}
                      eventHandlers={{
                        click: () => setActiveId(card.id),
                        mouseover: (e) => e.target.openTooltip(),
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -6]} opacity={1} className="qvm-tooltip">
                        <span className="font-serif-x text-sm text-[#2C2621]">
                          {pick(card.name, lang)}
                        </span>
                      </Tooltip>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
              <MapLogoBadge />
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55">
                {pick(COPY.map.legend, lang)}
              </span>
              {SECTIONS.map((s) => (
                <span
                  key={s.id}
                  data-testid={`qvm-map-legend-${s.id}`}
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-[#FDFBF7]/80"
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: s.accent }}
                  />
                  {pick(s.title, lang)}
                </span>
              ))}
            </div>
          </div>

          {/* Side panel — destination detail > route detail > hint */}
          <div className="lg:col-span-5">
            {active ? (
              <article
                data-testid={`qvm-map-detail-${active.card.id}`}
                className="bg-[#FDFBF7] text-[#2C2621] h-full flex flex-col animate-slide-down"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1513]">
                  <EditableImage
                    slot={`que-ver.map-detail.${active.card.id}.image`}
                    fallback={active.card.image}
                    alt={pick(active.card.name, lang)}
                    aspectRatio="4/3"
                    imgProps={{ loading: "lazy" }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 to-transparent pointer-events-none" />
                  <span
                    className="absolute top-3 left-3 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
                    style={{ color: active.section.accent }}
                  >
                    <MapPin className="w-3 h-3" strokeWidth={1.6} />
                    {pick(active.card.cat, lang)}
                  </span>
                  <button
                    type="button"
                    data-testid="qvm-map-detail-close"
                    onClick={() => setActiveId(null)}
                    aria-label={pick(COPY.map.reset, lang)}
                    className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1A1513]/70 hover:bg-[#1A1513] text-[#FDFBF7] backdrop-blur-sm transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={1.8} />
                  </button>
                </div>
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.12]">
                    {pick(active.card.name, lang)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5C5248]">
                    {pick(active.card.blurb, lang)}
                  </p>
                  <CircuitTestimonials slug={`qvm-map-${active.card.id}`} items={getPlaceTestimonials(active.card.id)} programRouteId={priceRouteIds(active.card.trips[0]?.routeId)[0]} accent={active.section.accent} autoRotate={false} verifiedBelow />
                  <div className="mt-5 pt-5 border-t border-[#2C2621]/10">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">
                      {pick(COPY.tripsCta, lang)}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {active.card.trips.map((trip, i) => (
                        <li key={trip.routeId}>
                          <Link
                            to={pathFor(lang, trip.routeId)}
                            data-testid={`qvm-map-trip-${active.card.id}-${i}`}
                            className="group/link flex items-center justify-between gap-3 px-3 py-2 -mx-3 hover:bg-[#F2EBE1] transition-colors duration-200 rounded-sm"
                            style={{ borderLeft: `2px solid ${active.section.accent}55` }}
                          >
                            <span className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-sm group-hover/link:text-[#C16542] transition-colors">
                                {pick(trip.label, lang)}
                              </span>
                              <FromPrice tone="dark" size="xs" routeIds={priceRouteIds(trip.routeId)} testid={`qvm-map-trip-from-${active.card.id}-${i}`} />
                            </span>
                            <ArrowUpRight
                              className="w-3.5 h-3.5 text-[#5C5248] group-hover/link:text-[#C16542] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all flex-shrink-0"
                              strokeWidth={1.8}
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ) : activeRoute ? (
              <article
                data-testid={`qvm-route-detail-${activeRoute.id}`}
                className="bg-[#FDFBF7] text-[#2C2621] h-full flex flex-col animate-slide-down"
                style={{ borderTop: `4px solid ${activeRoute.color}` }}
              >
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
                      style={{ backgroundColor: `${activeRoute.color}1A`, color: activeRoute.color }}
                    >
                      <Compass className="w-3 h-3" strokeWidth={1.6} />
                      {pick(COPY.map.routeBadge, lang)}
                    </span>
                    <button
                      type="button"
                      data-testid="qvm-route-detail-close"
                      onClick={() => setActiveRouteId(null)}
                      aria-label={pick(COPY.map.reset, lang)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1A1513]/85 hover:bg-[#1A1513] text-[#FDFBF7] transition-colors"
                    >
                      <X className="w-4 h-4" strokeWidth={1.8} />
                    </button>
                  </div>
                  <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.12] mt-4">
                    {pick(activeRoute.label, lang)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5C5248]">
                    {pick(activeRoute.body, lang)}
                  </p>

                  {/* Climate window — pulled from bestTimeData REGIONS */}
                  {(() => {
                    const climate = CLIMATE_REGIONS.find((r) => r.id === activeRoute.bestRegionId);
                    if (!climate) return null;
                    return (
                      <div
                        data-testid={`qvm-route-climate-${activeRoute.id}`}
                        className="mt-5 bg-[#F2EBE1] border-l-2 px-4 py-3.5"
                        style={{ borderLeftColor: climate.accent }}
                      >
                        <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2 inline-flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" strokeWidth={1.8} />
                          {pick(climate.name, lang)}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <ThermometerSun className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: climate.accent }} strokeWidth={1.6} />
                            <div>
                              <p className="text-[10px] tracking-[0.22em] uppercase text-[#5C5248]">
                                {pick(COPY.map.bestWindow, lang)}
                              </p>
                              <p className="text-[#2C2621] font-medium">{pick(climate.best, lang)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <ThermometerSnowflake className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#5C5248]" strokeWidth={1.6} />
                            <div>
                              <p className="text-[10px] tracking-[0.22em] uppercase text-[#5C5248]">
                                {pick(COPY.map.avoidWindow, lang)}
                              </p>
                              <p className="text-[#5C5248]">{pick(climate.avoid, lang)}</p>
                            </div>
                          </div>
                        </div>
                        <Link
                          to={pathFor(lang, "whenToTravel")}
                          data-testid={`qvm-route-climate-link-${activeRoute.id}`}
                          className="mt-3 inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-[#C16542] hover:text-[#A8533A] border-b border-[#C16542]/40 pb-0.5"
                        >
                          {pick(COPY.map.seeGuide, lang)}
                          <ArrowUpRight className="w-3 h-3" strokeWidth={1.8} />
                        </Link>
                      </div>
                    );
                  })()}

                  {/* Numbered stop rail */}
                  <div className="mt-6">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">
                      {pick(COPY.map.routeStops, lang)} · {activeRouteStops.length}
                    </p>
                    <ol className="flex flex-col gap-1.5">
                      {activeRouteStops.map((stop, i) => (
                        <li
                          key={`${activeRoute.id}-stop-${i}`}
                          data-testid={`qvm-route-stop-${activeRoute.id}-${i}`}
                          className="flex items-center gap-3 px-3 py-1.5 -mx-3 hover:bg-[#F2EBE1] cursor-pointer transition-colors"
                          onClick={() => setActiveId(stop.card.id)}
                        >
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-medium tabular-nums"
                            style={{ backgroundColor: activeRoute.color, color: "#FDFBF7" }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm text-[#2C2621]">{pick(stop.card.name, lang)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#2C2621]/10">
                    <Link
                      to={pathFor(lang, activeRoute.routeId)}
                      data-testid={`qvm-route-cta-${activeRoute.id}`}
                      className="inline-flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7] transition-colors"
                      style={{ backgroundColor: activeRoute.color }}
                    >
                      {pick(COPY.map.routeCta, lang)}
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div
                data-testid="qvm-map-hint"
                className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-8 py-10 border border-dashed border-[#FDFBF7]/20 text-[#FDFBF7]/75"
              >
                <Compass className="w-8 h-8 text-[#D4A373] mb-4" strokeWidth={1.4} />
                <p className="font-serif-x text-2xl text-[#FDFBF7] leading-tight">
                  {pick(COPY.map.hint, lang)}
                </p>
                <p className="mt-3 text-xs tracking-[0.2em] uppercase text-[#FDFBF7]/50">
                  17 · {pick(COPY.current, lang)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const FinalCta = ({ lang }) => (
  <section
    id="qvm-final-cta" data-testid="qvm-final-cta"
    className="relative bg-[#1A1513] py-24 md:py-32 overflow-hidden"
  >
    <EditableImage
      slot="que-ver-en-marruecos.final.bg"
      fallback={banner("dunes", 2400)}
      alt=""
      aspectRatio="auto"
      imgProps={{ loading: "lazy" }}
      className="absolute inset-0 w-full h-full object-cover opacity-25"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/85 to-[#1A1513]/65 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />

    <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
      <span className="overline inline-flex items-center gap-2 text-[#D4A373]">
        <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
        {pick(COPY.finalCta.eyebrow, lang)}
      </span>
      <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#FDFBF7]">
        {pick(COPY.finalCta.title, lang)}
      </h2>
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          to={pathFor(lang, "planTrip")}
          data-testid="qvm-final-cta-plan"
          className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.finalCta.primary, lang)}
          <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
        </Link>
        <Link
          to={pathFor(lang, "toursLanding")}
          data-testid="qvm-final-cta-tours"
          className="inline-flex items-center gap-2 border border-[#FDFBF7]/40 hover:border-[#D4A373] hover:text-[#D4A373] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
        >
          {pick(COPY.finalCta.secondary, lang)}
          <Building2 className="w-4 h-4" strokeWidth={1.6} />
        </Link>
      </div>
    </div>
  </section>
);

/* ============================================================
   Page
============================================================ */
export default function QueVerEnMarruecosPage() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = DOC_TITLES[lang] || DOC_TITLES.es;
  }, [lang]);

  return (
    <div data-testid="qvm-page" className="bg-[#FDFBF7]">
      <Hero lang={lang} />
      <SectionNav
        testid="qvm-nav"
        items={[
          { id: "qvm-intro", label: { es: "Introducción", en: "Overview", fr: "Introduction" } },
          { id: "qvm-map-section", label: { es: "Mapa y lugares", en: "Map & places", fr: "Carte & lieux" } },
          { id: "qvm-final-cta", label: { es: "Contacto", en: "Contact", fr: "Contact" } },
        ]}
      />
      <Intro lang={lang} />
      {SECTIONS.map((section) => (
        <Section key={section.id} section={section} lang={lang} />
      ))}
      <DestinationsMap lang={lang} />
      <FinalCta lang={lang} />
    </div>
  );
}
