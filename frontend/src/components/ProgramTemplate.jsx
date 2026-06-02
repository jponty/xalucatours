import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight, Compass, ChevronDown, ChevronUp, MapPin, Plane, Clock,
  Calendar, Mountain, Sparkles, Phone, Mail, MessageCircle, Camera,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor, resolvePath } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { StickyNav } from "@/components/JourneyPageSections";
import { SHARED_DETAILS } from "@/lib/programData";
import { DayRouteMap } from "@/components/DayRouteMap";
import { DayGallery } from "@/components/DayGallery";
import { TripOverview } from "@/components/TripOverview";
import { TripRouteMap } from "@/components/TripRouteMap";
import ContactForm from "@/components/ContactForm";
import HubPeerNav from "@/components/HubPeerNav";
import { useSlotId } from "@/components/EditableSection";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import PricingSection from "@/components/PricingSection";

/* Pull a trilingual field {es,en,fr} out of a program's `meta` override
 * or fall back to the variant copy block. Used to feed defaults={...}
 * to inline <E> editors so editing persists per language. */
const metaAllLangs = (program, variant, field) => {
  const out = {};
  for (const lg of ["es", "en", "fr"]) {
    out[lg] =
      (program?.meta && program.meta[lg] && program.meta[lg][field]) ??
      (VARIANT_COPY[variant] && VARIANT_COPY[variant][lg] && VARIANT_COPY[variant][lg][field]) ??
      "";
  }
  return out;
};

/* ============================================================
   Trilingual labels & copy variants (Desierto→Atlas vs Atlas→Desierto)
============================================================ */
const VARIANT_COPY = {
  // Errachidia → Ouarzazate
  da: {
    es: {
      title: "Erg Chebbi y el Alto Atlas.",
      eyebrow_prefix: "Circuito combinado · Desierto + Atlas",
      place: "Erg Chebbi · Alto Atlas",
      subtitle: "Descubriendo el sur de Marruecos en un circuito 4x4 entre dunas, oasis y pueblos bereberes.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Errachidia · Salida Ouarzazate",
      quick_airports: "Errachidia / Ouarzazate",
      quick_places: "Errachidia · Erg Chebbi · Merdani · Rissani · Erfoud · Tinerhir · Boumalne Dades · Ouarzazate",
      highlights: "Erg Chebbi · Khamlia · Todra · Dades · M'Goun",
      description_title: "Una escapada al desierto más cercano a Europa.",
      description: [
        "¿Quieres desconectar unos días y vivir una experiencia mágica?",
        "Te proponemos una escapada al Desierto de Dunas más cercano a Europa: el Erg Chebbi, en el sur de Marruecos.",
        "La ruta comienza en Erfoud, conocida como «la puerta del desierto», desde donde nos adentraremos en el Sahara en un vehículo 4x4 con chófer.",
        "Las tradiciones ancestrales, los mercados, los colores del desierto y una noche bajo las estrellas convertirán esta experiencia en un viaje inolvidable.",
        "Más tarde continuaremos hacia la Cordillera del Alto Atlas, atravesando valles, gargantas y poblados Imazighen donde el tiempo parece haberse detenido.",
      ],
    },
    en: {
      title: "Erg Chebbi and the High Atlas.",
      eyebrow_prefix: "Combined circuit · Desert + Atlas",
      place: "Erg Chebbi · High Atlas",
      subtitle: "Discovering southern Morocco on a 4x4 circuit through dunes, oases and Berber villages.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "In Errachidia · Out Ouarzazate",
      quick_airports: "Errachidia / Ouarzazate",
      quick_places: "Errachidia · Erg Chebbi · Merdani · Rissani · Erfoud · Tinerhir · Boumalne Dades · Ouarzazate",
      highlights: "Erg Chebbi · Khamlia · Todra · Dades · M'Goun",
      description_title: "An escape to the closest desert to Europe.",
      description: [
        "Want to disconnect for a few days and live something truly magical?",
        "We propose an escape to the closest dune desert to Europe: the Erg Chebbi, in southern Morocco.",
        "The route begins in Erfoud, known as «the gate of the desert», from where we head into the Sahara in a 4x4 with private driver.",
        "Ancestral traditions, markets, desert colours and a night under the stars turn this experience into an unforgettable journey.",
        "We then continue across the High Atlas range, crossing valleys, gorges and Imazighen villages where time seems to have stopped.",
      ],
    },
    fr: {
      title: "Erg Chebbi et le Haut Atlas.",
      eyebrow_prefix: "Circuit combiné · Désert + Atlas",
      place: "Erg Chebbi · Haut Atlas",
      subtitle: "À la découverte du sud du Maroc en circuit 4x4 entre dunes, oasis et villages berbères.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Errachidia · Sortie Ouarzazate",
      quick_airports: "Errachidia / Ouarzazate",
      quick_places: "Errachidia · Erg Chebbi · Merdani · Rissani · Erfoud · Tinerhir · Boumalne Dadès · Ouarzazate",
      highlights: "Erg Chebbi · Khamlia · Todra · Dadès · M'Goun",
      description_title: "Une escapade vers le désert le plus proche de l'Europe.",
      description: [
        "Envie de déconnecter quelques jours et vivre une expérience magique ?",
        "Nous vous proposons une escapade vers le désert de dunes le plus proche de l'Europe : l'Erg Chebbi, au sud du Maroc.",
        "L'itinéraire commence à Erfoud, « porte du désert », d'où nous pénétrons dans le Sahara en 4x4 avec chauffeur.",
        "Les traditions ancestrales, les marchés, les couleurs du désert et une nuit sous les étoiles rendent cette expérience inoubliable.",
        "Nous poursuivons ensuite vers la cordillère du Haut Atlas, traversant vallées, gorges et villages imazighen où le temps semble s'être arrêté.",
      ],
    },
  },
  // Desert escape (Errachidia → Erfoud → Erg Chebbi → Errachidia)
  desierto: {
    es: {
      title: "Escapada al desierto del Erg Chebbi.",
      eyebrow_prefix: "Escapadas Marruecos · Desierto",
      place: "Errachidia · Erfoud · Erg Chebbi · Khamlia · Rissani",
      subtitle: "Una aventura inolvidable en el corazón del Sáhara marroquí, durmiendo bajo un cielo lleno de estrellas.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Llegada y salida Errachidia",
      quick_airports: "Errachidia",
      quick_places: "Errachidia · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Valle del Ziz",
      highlights: "Erg Chebbi · Bivouac de lujo · Khamlia · Rissani · Valle del Ziz",
      description_title: "Donde los relojes se detienen.",
      description: [
        "¿Sueñas con hacer una escapada mágica? Ahora es el momento ideal para escapar a un lugar donde los relojes se detienen, donde reencontrarnos con valores casi olvidados en nuestra sociedad y dejarnos llevar por el ritmo pausado de la vida del desierto.",
        "Escápate al sur de Marruecos y vive una aventura inolvidable: duerme bajo un cielo lleno de estrellas, recorre en 4x4 las doradas dunas del Erg Chebbi, contempla la puesta de sol a lomos de un dromedario y descubre algunos de los paisajes más espectaculares del Sáhara marroquí.",
        "Ahora es el momento.",
      ],
    },
    en: {
      title: "Escape to the Erg Chebbi desert.",
      eyebrow_prefix: "Morocco short escapes · Desert",
      place: "Errachidia · Erfoud · Erg Chebbi · Khamlia · Rissani",
      subtitle: "An unforgettable adventure in the heart of the Moroccan Sahara, sleeping under a sky full of stars.",
      hero_image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=85",
      airports: "In and out Errachidia",
      quick_airports: "Errachidia",
      quick_places: "Errachidia · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Ziz Valley",
      highlights: "Erg Chebbi · Luxury bivouac · Khamlia · Rissani · Ziz Valley",
      description_title: "Where clocks come to a halt.",
      description: [
        "Dreaming of a magical escape? Now is the right moment to escape to a place where clocks come to a halt, where we reconnect with values almost forgotten and let ourselves be carried by the slow rhythm of desert life.",
        "Escape to southern Morocco and live an unforgettable adventure: sleep under a sky full of stars, drive the golden dunes of the Erg Chebbi in 4x4, watch the sunset from camelback and discover some of the most spectacular landscapes of the Moroccan Sahara.",
        "Now is the moment.",
      ],
    },
    fr: {
      title: "Escapade au désert de l'Erg Chebbi.",
      eyebrow_prefix: "Escapades Maroc · Désert",
      place: "Errachidia · Erfoud · Erg Chebbi · Khamlia · Rissani",
      subtitle: "Une aventure inoubliable au cœur du Sahara marocain, dormant sous un ciel d'étoiles.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée et sortie Errachidia",
      quick_airports: "Errachidia",
      quick_places: "Errachidia · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Vallée du Ziz",
      highlights: "Erg Chebbi · Bivouac de luxe · Khamlia · Rissani · Vallée du Ziz",
      description_title: "Là où les horloges s'arrêtent.",
      description: [
        "Vous rêvez d'une escapade magique ? C'est le moment de partir vers un lieu où les horloges s'arrêtent, où l'on retrouve des valeurs presque oubliées et où l'on se laisse porter par le rythme lent du désert.",
        "Évadez-vous au sud du Maroc et vivez une aventure inoubliable : dormez sous un ciel d'étoiles, parcourez les dunes dorées de l'Erg Chebbi en 4x4, contemplez le coucher de soleil à dos de dromadaire et découvrez quelques-uns des paysages les plus spectaculaires du Sahara marocain.",
        "C'est le moment.",
      ],
    },
  },
  // Atlas escape (Ouarzazate → M'Goun → N'Kob → Drâa → Ouarzazate)
  atlas: {
    es: {
      title: "Escapada de 4 días por el Atlas.",
      eyebrow_prefix: "Escapadas Marruecos · Alto Atlas",
      place: "Ouarzazate · Boumalne Dadès · M'Goun · N'Kob · Valle del Drâa",
      subtitle: "Una inmersión cultural y paisajística en el corazón Amazigh del sur marroquí.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Llegada y salida Ouarzazate",
      quick_airports: "Ouarzazate",
      quick_places: "Ouarzazate · Boumalne Dadès · Boutaghrar · Amskar · M'Goun · N'Kob · Djebel Saghro · Valle del Drâa",
      highlights: "Aldeas Imazighen · Familias nómadas · M'Goun · N'Kob · Drâa",
      description_title: "Cuatro días para descubrir la cultura Amazigh.",
      description: [
        "¿Quieres desconectar unos días y descubrir la cultura Amazigh? Te proponemos una escapada a la cordillera del Alto Atlas, en el sur de Marruecos.",
        "Nuestra ruta empieza en Boumalne Dadès. En un 4x4 con chófer recorreremos algunos poblados Imazighen donde el tiempo parece haberse detenido. Atravesaremos valles y gargantas, visitaremos familias nómadas que todavía habitan en grutas en las montañas y descubriremos algunos de los paisajes más espectaculares del sur marroquí.",
        "Continuaremos más al sur atravesando el Anti-Atlas y recorreremos el Valle del Drâa hasta regresar a Ouarzazate. Una escapada auténtica, cultural y paisajística que no deja indiferente.",
      ],
    },
    en: {
      title: "4-day escape through the Atlas.",
      eyebrow_prefix: "Morocco short escapes · High Atlas",
      place: "Ouarzazate · Boumalne Dades · M'Goun · N'Kob · Drâa Valley",
      subtitle: "A cultural and scenic immersion in the Amazigh heart of southern Morocco.",
      hero_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2400&q=85",
      airports: "In and out Ouarzazate",
      quick_airports: "Ouarzazate",
      quick_places: "Ouarzazate · Boumalne Dades · Boutaghrar · Amskar · M'Goun · N'Kob · Djebel Saghro · Drâa Valley",
      highlights: "Imazighen villages · Nomad families · M'Goun · N'Kob · Drâa",
      description_title: "Four days to discover the Amazigh culture.",
      description: [
        "Want to disconnect for a few days and discover the Amazigh culture? We propose an escape to the High Atlas range, in southern Morocco.",
        "Our route begins in Boumalne Dades. In a 4x4 with driver we visit Imazighen villages where time seems to have stopped. We cross valleys and gorges, visit nomadic families still living in mountain caves and discover some of the most spectacular landscapes of southern Morocco.",
        "We continue south across the Anti-Atlas and drive the Drâa Valley back to Ouarzazate. An authentic, cultural, scenic escape that leaves no traveller indifferent.",
      ],
    },
    fr: {
      title: "Escapade de 4 jours dans l'Atlas.",
      eyebrow_prefix: "Escapades Maroc · Haut Atlas",
      place: "Ouarzazate · Boumalne Dadès · M'Goun · N'Kob · Vallée du Drâa",
      subtitle: "Une immersion culturelle et paysagère au cœur amazigh du sud marocain.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée et sortie Ouarzazate",
      quick_airports: "Ouarzazate",
      quick_places: "Ouarzazate · Boumalne Dadès · Boutaghrar · Amskar · M'Goun · N'Kob · Djebel Saghro · Vallée du Drâa",
      highlights: "Villages imazighen · Familles nomades · M'Goun · N'Kob · Drâa",
      description_title: "Quatre jours pour découvrir la culture amazighe.",
      description: [
        "Envie de déconnecter quelques jours et découvrir la culture amazighe ? Nous vous proposons une escapade dans le Haut Atlas, au sud du Maroc.",
        "Notre itinéraire commence à Boumalne Dadès. En 4x4 avec chauffeur, nous parcourons des villages imazighen où le temps semble s'être arrêté. Vallées, gorges, familles nomades en grottes — quelques-uns des paysages les plus spectaculaires du sud marocain.",
        "Nous poursuivons vers le sud à travers l'Anti-Atlas et remontons la vallée du Drâa jusqu'à Ouarzazate. Une escapade authentique, culturelle et paysagère qui ne laisse personne indifférent.",
      ],
    },
  },
  // Marrakech → Fez (Gran Sur · reverse)
  frm: {
    es: {
      title: "Marrakech · Erg Chebbi · Fez.",
      eyebrow_prefix: "Circuito Gran Sur · Marrakech → Fez",
      place: "Marrakech · Alto Atlas · Erg Chebbi · Medio Atlas · Fez",
      subtitle: "De la ciudad roja al laberinto de Fez, cruzando el Atlas, el Sahara y el bosque de cedros.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Marrakech · Salida Fez",
      quick_airports: "Marrakech / Fez",
      quick_places: "Marrakech · Aït Ben Haddou · Ouarzazate · Boumalne Dades · Tinerhir · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Ifrane · Fez",
      highlights: "Djemaa el-Fna · Aït Ben Haddou · Erg Chebbi · Cedros · Medina UNESCO",
      description_title: "De la ciudad roja al laberinto de Fez.",
      description: [
        "«Gran Sur de Marruecos» es un viaje auténtico pensado para descubrir en profundidad el sur del país. La ruta en 4x4 comienza en Marrakech, una ciudad vibrante, llena de color, salpicada de artesanos y artistas, plazas maravillosas y aromas que quedarán grabados en nuestra memoria.",
        "Desde la ciudad, nos adentraremos en el Alto Atlas, dejando atrás sus paisajes montañosos para alcanzar el imponente Desierto del Erg Chebbi, un espectáculo para los sentidos. Las interminables dunas y la magia que envuelve estos lugares nos regalarán una noche inolvidable bajo las estrellas.",
        "El camino nos llevará por rincones únicos como los poblados de Rissani, con su mercado ancestral, o Ifrane, conocida como «la pequeña Suiza», rodeada de bosques de cedros gigantes, hasta llegar a Fez, cuya medina es considerada una joya del mundo árabe: un precioso laberinto donde perderse y encontrar ese recuerdo especial de Marruecos.",
      ],
    },
    en: {
      title: "Marrakech · Erg Chebbi · Fez.",
      eyebrow_prefix: "Grand South circuit · Marrakech → Fez",
      place: "Marrakech · High Atlas · Erg Chebbi · Middle Atlas · Fez",
      subtitle: "From the red city to the labyrinth of Fez, crossing the Atlas, the Sahara and the cedar forest.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "In Marrakech · Out Fez",
      quick_airports: "Marrakech / Fez",
      quick_places: "Marrakech · Aït Ben Haddou · Ouarzazate · Boumalne Dades · Tinerhir · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Ifrane · Fez",
      highlights: "Jemaa el-Fna · Aït Ben Haddou · Erg Chebbi · Cedars · UNESCO medina",
      description_title: "From the red city to the labyrinth of Fez.",
      description: [
        "«Grand South of Morocco» is an authentic journey to discover the south of the country in depth. The 4x4 route begins in Marrakech, a vibrant city full of colour, sprinkled with artisans and artists, marvellous squares and aromas that will linger in our memory.",
        "From the city we head into the High Atlas, leaving its mountain landscapes behind to reach the imposing Erg Chebbi desert — a feast for the senses. The endless dunes and the magical halo of these places will give us an unforgettable night under the stars.",
        "The road takes us through unique places such as Rissani with its ancestral market, or Ifrane — «little Switzerland» — surrounded by giant cedar forests, all the way to Fez, whose medina is a jewel of the Arab world: a beautiful labyrinth in which to get lost and find that special memory of Morocco.",
      ],
    },
    fr: {
      title: "Marrakech · Erg Chebbi · Fès.",
      eyebrow_prefix: "Circuit Grand Sud · Marrakech → Fès",
      place: "Marrakech · Haut Atlas · Erg Chebbi · Moyen Atlas · Fès",
      subtitle: "De la ville rouge au labyrinthe de Fès, en traversant l'Atlas, le Sahara et la forêt de cèdres.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Marrakech · Sortie Fès",
      quick_airports: "Marrakech / Fès",
      quick_places: "Marrakech · Aït Ben Haddou · Ouarzazate · Boumalne Dadès · Tinerhir · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Ifrane · Fès",
      highlights: "Jemaa el-Fna · Aït Ben Haddou · Erg Chebbi · Cèdres · Médina UNESCO",
      description_title: "De la ville rouge au labyrinthe de Fès.",
      description: [
        "« Grand Sud du Maroc » est un voyage authentique conçu pour découvrir en profondeur le sud du pays. L'itinéraire en 4x4 commence à Marrakech, ville vibrante et colorée, parsemée d'artisans et d'artistes, aux places merveilleuses et aux parfums qui marqueront notre mémoire.",
        "Depuis la ville, nous entrons dans le Haut Atlas, laissant derrière nous ses paysages montagneux pour rejoindre l'imposant désert de l'Erg Chebbi, un spectacle pour les sens. Les dunes infinies et le halo magique de ces lieux nous offriront une nuit inoubliable sous les étoiles.",
        "La route nous mène par des lieux uniques comme Rissani avec son marché ancestral, ou Ifrane — « la petite Suisse » — entourée de forêts de cèdres géants, jusqu'à Fès, dont la médina est un joyau du monde arabe : un magnifique labyrinthe pour se perdre et trouver ce souvenir spécial du Maroc.",
      ],
    },
  },
  // Fez → Marrakech (Gran Sur)
  frz: {
    es: {
      title: "Fez · Erg Chebbi · Marrakech.",
      eyebrow_prefix: "Circuito Gran Sur · Fez → Marrakech",
      place: "Fez · Medio Atlas · Erg Chebbi · Alto Atlas · Marrakech",
      subtitle: "De la medina más antigua del mundo árabe a la ciudad roja, cruzando el Sahara y la cordillera del Atlas.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Fez · Salida Marrakech",
      quick_airports: "Fez / Marrakech",
      quick_places: "Fez · Ifrane · Valle del Ziz · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Tinerhir · Todra · Boumalne Dades · M'Goun · Aït Ben Haddou · Marrakech",
      highlights: "Medina UNESCO · Cedros · Erg Chebbi · M'Goun · Aït Ben Haddou",
      description_title: "Una travesía cinematográfica del norte imperial al sur sahariano.",
      description: [
        "Gran Sur de Marruecos es un auténtico viaje para descubrir la esencia del sur del país. Esta ruta en 4x4 comienza en Fez, cuya medina, envidia del mundo árabe, es un precioso laberinto en el que perderse y dejarse llevar.",
        "El camino nos conduce por lugares tan singulares como Ifrane, conocida como la «pequeña Suiza», y sus majestuosos bosques de cedros gigantes, hasta alcanzar Erfoud, la puerta de entrada al Gran Desierto del Erg Chebbi.",
        "Allí nos espera un espectáculo para los sentidos: dunas infinitas y ese halo mágico que envuelve los lugares especiales nos regalarán una noche inolvidable bajo las estrellas.",
        "Dejaremos atrás el desierto para adentrarnos en el Alto Atlas, descubriendo paisajes únicos, deteniéndonos a contemplar su belleza, a conversar con los aldeanos y a saborear, sin prisas, la autenticidad de sus pueblos escondidos y de sus impresionantes gargantas.",
        "De la montaña, llegamos finalmente a la ciudad. Marrakech, vibrante y llena de color, nos recibe salpicada de artesanos y artistas, de plazas maravillosas y de aromas que quedarán grabados para siempre en nuestra memoria.",
      ],
    },
    en: {
      title: "Fez · Erg Chebbi · Marrakech.",
      eyebrow_prefix: "Grand South circuit · Fez → Marrakech",
      place: "Fez · Middle Atlas · Erg Chebbi · High Atlas · Marrakech",
      subtitle: "From the oldest medina in the Arab world to the red city, crossing the Sahara and the Atlas range.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "In Fez · Out Marrakech",
      quick_airports: "Fez / Marrakech",
      quick_places: "Fez · Ifrane · Ziz Valley · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Tinerhir · Todra · Boumalne Dades · M'Goun · Aït Ben Haddou · Marrakech",
      highlights: "UNESCO medina · Cedars · Erg Chebbi · M'Goun · Aït Ben Haddou",
      description_title: "A cinematic crossing from the imperial north to the Saharan south.",
      description: [
        "The Grand South of Morocco is an authentic journey to discover the soul of the country. This 4x4 route begins in Fez, whose medina — the envy of the Arab world — is a beautiful labyrinth in which to lose oneself.",
        "The route takes us through unique places such as Ifrane, the «little Switzerland», and its majestic giant cedar forests, all the way to Erfoud, the gateway to the great Erg Chebbi desert.",
        "There, a feast for the senses awaits: endless dunes and the magical halo of special places will offer us an unforgettable night under the stars.",
        "We leave the desert behind to enter the High Atlas, discovering unique landscapes, stopping to admire their beauty, chatting with villagers and savouring the authenticity of hidden villages and impressive gorges.",
        "From the mountains we reach the city. Marrakech, vibrant and full of colour, welcomes us with artisans and artists, marvellous squares and aromas that linger forever in our memory.",
      ],
    },
    fr: {
      title: "Fès · Erg Chebbi · Marrakech.",
      eyebrow_prefix: "Circuit Grand Sud · Fès → Marrakech",
      place: "Fès · Moyen Atlas · Erg Chebbi · Haut Atlas · Marrakech",
      subtitle: "De la plus ancienne médina du monde arabe à la ville rouge, en traversant le Sahara et la cordillère de l'Atlas.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Fès · Sortie Marrakech",
      quick_airports: "Fès / Marrakech",
      quick_places: "Fès · Ifrane · Vallée du Ziz · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Tinerhir · Todra · Boumalne Dadès · M'Goun · Aït Ben Haddou · Marrakech",
      highlights: "Médina UNESCO · Cèdres · Erg Chebbi · M'Goun · Aït Ben Haddou",
      description_title: "Une traversée cinématographique, du nord impérial au sud saharien.",
      description: [
        "Le Grand Sud du Maroc est un voyage authentique pour découvrir l'âme du pays. Cet itinéraire en 4x4 commence à Fès, dont la médina — envie du monde arabe — est un magnifique labyrinthe.",
        "La route nous mène à travers des lieux singuliers comme Ifrane, la « petite Suisse », et ses majestueuses forêts de cèdres géants, jusqu'à Erfoud, porte du grand désert de l'Erg Chebbi.",
        "Là, un spectacle pour les sens nous attend : dunes infinies et halo magique pour une nuit inoubliable sous les étoiles.",
        "Nous laissons le désert derrière nous pour entrer dans le Haut Atlas, paysages uniques, rencontres avec les villageois et villages cachés aux gorges impressionnantes.",
        "Des montagnes, nous arrivons à Marrakech, vibrante et colorée — artisans, artistes, places merveilleuses et parfums inoubliables.",
      ],
    },
  },
  // Ouarzazate → Errachidia
  ad: {
    es: {
      title: "El Atlas y las dunas del Erg Chebbi.",
      eyebrow_prefix: "Circuito combinado · Atlas + Desierto",
      place: "Alto Atlas · Erg Chebbi",
      subtitle: "Descubriendo el sur de Marruecos en un circuito 4x4 desde las montañas bereberes hasta las dunas del Sahara.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Ouarzazate · Salida Errachidia",
      quick_airports: "Ouarzazate / Errachidia",
      quick_places: "Ouarzazate · Boumalne Dades · Tinerhir · Erfoud · Erg Chebbi · Merdani · Rissani · Errachidia",
      highlights: "Alto Atlas · Boutaghrar · M'Goun · Todra · Erg Chebbi",
      description_title: "Del Alto Atlas a las puertas del Sahara.",
      description: [
        "¿Quieres desconectar unos días y vivir una experiencia mágica?",
        "Te proponemos una escapada al Desierto de Dunas más cercano a Europa: el Erg Chebbi, en el sur de Marruecos.",
        "La ruta comienza en la Cordillera del Alto Atlas, donde en vehículo 4x4 con chófer recorreremos poblados Imazighen donde el tiempo parece haberse detenido.",
        "Atravesaremos valles y gargantas hasta llegar a la puerta del desierto, donde la magia del Sahara envolverá cada momento del viaje.",
        "Las tradiciones ancestrales, los mercados, los colores del desierto y una noche bajo las estrellas convertirán esta experiencia en un viaje inolvidable.",
      ],
    },
    en: {
      title: "The Atlas and the Erg Chebbi dunes.",
      eyebrow_prefix: "Combined circuit · Atlas + Desert",
      place: "High Atlas · Erg Chebbi",
      subtitle: "Discovering southern Morocco on a 4x4 circuit from Berber mountains to the dunes of the Sahara.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "In Ouarzazate · Out Errachidia",
      quick_airports: "Ouarzazate / Errachidia",
      quick_places: "Ouarzazate · Boumalne Dades · Tinerhir · Erfoud · Erg Chebbi · Merdani · Rissani · Errachidia",
      highlights: "High Atlas · Boutaghrar · M'Goun · Todra · Erg Chebbi",
      description_title: "From the High Atlas to the gates of the Sahara.",
      description: [
        "Want to disconnect for a few days and live something truly magical?",
        "We propose an escape to the closest dune desert to Europe: the Erg Chebbi, in southern Morocco.",
        "The route begins in the High Atlas range, where a 4x4 with private driver takes us through Imazighen villages frozen in time.",
        "We cross valleys and gorges all the way to the gate of the desert, where the magic of the Sahara wraps every moment of the journey.",
        "Ancestral traditions, markets, desert colours and a night under the stars turn this experience into an unforgettable trip.",
      ],
    },
    fr: {
      title: "L'Atlas et les dunes de l'Erg Chebbi.",
      eyebrow_prefix: "Circuit combiné · Atlas + Désert",
      place: "Haut Atlas · Erg Chebbi",
      subtitle: "À la découverte du sud du Maroc en circuit 4x4, des montagnes berbères aux dunes du Sahara.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Ouarzazate · Sortie Errachidia",
      quick_airports: "Ouarzazate / Errachidia",
      quick_places: "Ouarzazate · Boumalne Dadès · Tinerhir · Erfoud · Erg Chebbi · Merdani · Rissani · Errachidia",
      highlights: "Haut Atlas · Boutaghrar · M'Goun · Todra · Erg Chebbi",
      description_title: "Du Haut Atlas aux portes du Sahara.",
      description: [
        "Envie de déconnecter quelques jours et vivre une expérience magique ?",
        "Nous vous proposons une escapade vers le désert de dunes le plus proche de l'Europe : l'Erg Chebbi, au sud du Maroc.",
        "L'itinéraire commence dans la cordillère du Haut Atlas, en 4x4 avec chauffeur à travers des villages imazighen figés dans le temps.",
        "Nous traversons vallées et gorges jusqu'à la porte du désert, où la magie du Sahara enveloppe chaque instant.",
        "Les traditions ancestrales, les marchés, les couleurs du désert et une nuit sous les étoiles font de cette expérience un voyage inoubliable.",
      ],
    },
  },
  // Marrakech → Erg Chebbi (entrada Marrakech, salida Errachidia, 4n/5d)
  me: {
    es: {
      title: "Marrakech y las dunas del Erg Chebbi.",
      eyebrow_prefix: "Circuito · Marrakech → Erg Chebbi",
      place: "Marrakech · Alto Atlas · Erg Chebbi",
      subtitle: "De la ciudad roja a las dunas del Sahara, cruzando el Alto Atlas, Aït Ben Haddou y las gargantas del Todra.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Marrakech · Salida Errachidia",
      quick_airports: "Marrakech / Errachidia",
      quick_places: "Marrakech · Ouarzazate · Boumalne Dades · Tinerhir · Erfoud · Erg Chebbi · Merdani · Rissani · Errachidia",
      highlights: "Medina de Marrakech · Aït Ben Haddou · Todra · Erg Chebbi · Khamlia",
      description_title: "Un circuito auténtico para conocer el sur de Marruecos.",
      description: [
        "«Marrakech – Erg Chebbi» es un viaje de lo más auténtico para conocer el sur del país. Esta ruta nos despierta en Marrakech, una ciudad llena de colores, salpicada de artesanos y artistas, de plazas maravillosas y de aromas que marcarán nuestro recuerdo.",
        "Desde la ciudad saldremos con un 4x4 hacia el Alto Atlas, descubriendo los paisajes a nuestro paso, deteniéndonos a contemplar su belleza, a conversar con los aldeanos y a disfrutar sin prisas de sus pueblos perdidos y de sus gargantas inmensas.",
        "Dejaremos atrás las montañas para llegar al Desierto del Erg Chebbi, un espectáculo para los sentidos, con interminables dunas y ese halo mágico que desprenden los lugares especiales, lo que nos permitirá pasar una noche inolvidable bajo las estrellas.",
        "El camino nos lleva por lugares tan originales como los poblados de Rissani, con su mercado ancestral, entre muchos otros.",
      ],
    },
    en: {
      title: "Marrakech and the Erg Chebbi dunes.",
      eyebrow_prefix: "Circuit · Marrakech → Erg Chebbi",
      place: "Marrakech · High Atlas · Erg Chebbi",
      subtitle: "From the red city to the dunes of the Sahara, crossing the High Atlas, Aït Ben Haddou and the Todra gorges.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "In Marrakech · Out Errachidia",
      quick_airports: "Marrakech / Errachidia",
      quick_places: "Marrakech · Ouarzazate · Boumalne Dades · Tinerhir · Erfoud · Erg Chebbi · Merdani · Rissani · Errachidia",
      highlights: "Marrakech medina · Aït Ben Haddou · Todra · Erg Chebbi · Khamlia",
      description_title: "An authentic circuit to discover southern Morocco.",
      description: [
        "«Marrakech – Erg Chebbi» is a truly authentic journey through the south of the country. The route wakes us up in Marrakech, a city full of colour, artisans and artists, marvellous squares and unforgettable aromas.",
        "From there we set off in a 4x4 towards the High Atlas, discovering landscapes along the way, stopping to chat with villagers and enjoying — without rush — its hidden hamlets and immense gorges.",
        "We leave the mountains behind to reach the Erg Chebbi desert, a feast for the senses with endless dunes and the magical halo of truly special places — the setting for an unforgettable night under the stars.",
        "The road takes us through original places such as Rissani, with its ancestral market, among many others.",
      ],
    },
    fr: {
      title: "Marrakech et les dunes de l'Erg Chebbi.",
      eyebrow_prefix: "Circuit · Marrakech → Erg Chebbi",
      place: "Marrakech · Haut Atlas · Erg Chebbi",
      subtitle: "De la ville rouge aux dunes du Sahara, en traversant le Haut Atlas, Aït Ben Haddou et les gorges du Todra.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Marrakech · Sortie Errachidia",
      quick_airports: "Marrakech / Errachidia",
      quick_places: "Marrakech · Ouarzazate · Boumalne Dadès · Tinerhir · Erfoud · Erg Chebbi · Merdani · Rissani · Errachidia",
      highlights: "Médina de Marrakech · Aït Ben Haddou · Todra · Erg Chebbi · Khamlia",
      description_title: "Un circuit authentique pour découvrir le sud du Maroc.",
      description: [
        "« Marrakech – Erg Chebbi » est un voyage authentique pour découvrir le sud du pays. L'itinéraire nous réveille à Marrakech, ville colorée, parsemée d'artisans, d'artistes, de places merveilleuses et de parfums inoubliables.",
        "Nous partons en 4x4 vers le Haut Atlas, en découvrant les paysages, en discutant avec les villageois et en savourant sans hâte les hameaux perdus et les gorges immenses.",
        "Nous laissons les montagnes derrière nous pour rejoindre le désert de l'Erg Chebbi, un spectacle pour les sens, avec ses dunes infinies et ce halo magique propre aux lieux d'exception — décor d'une nuit inoubliable sous les étoiles.",
        "Le chemin nous emmène à travers des lieux aussi originaux que Rissani et son marché ancestral, parmi bien d'autres.",
      ],
    },
  },
  // Erg Chebbi → Marrakech (entrada Errachidia, salida Marrakech)
  em: {
    es: {
      title: "Erg Chebbi y la ciudad roja de Marrakech.",
      eyebrow_prefix: "Circuito · Erg Chebbi → Marrakech",
      place: "Erg Chebbi · Alto Atlas · Marrakech",
      subtitle: "De las dunas del Sahara a Marrakech, atravesando el Alto Atlas, el Valle del Dadès y Aït Ben Haddou.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Errachidia · Salida Marrakech",
      quick_airports: "Errachidia / Marrakech",
      quick_places: "Errachidia · Erfoud · Erg Chebbi · Merdani · Rissani · Tinerhir · Boumalne Dades · Aït Ben Haddou · Marrakech",
      highlights: "Erg Chebbi · Khamlia · Todra · M'Goun · Aït Ben Haddou · Djemaa el-Fna",
      description_title: "Un circuito auténtico para conocer el sur de Marruecos.",
      description: [
        "«Erg Chebbi – Marrakech» es un viaje de lo más auténtico para conocer el sur del país. Esta ruta nos despierta en el Desierto del Erg Chebbi, un espectáculo para los sentidos, con interminables dunas y ese halo mágico que desprenden los lugares especiales, permitiéndonos pasar una noche inolvidable bajo las estrellas.",
        "Continuaremos con nuestro 4x4 hacia el Alto Atlas, descubriendo los paisajes a nuestro paso, deteniéndonos a contemplar su belleza, a conversar con los aldeanos y a disfrutar sin prisas de sus pueblos perdidos y de sus gargantas inmensas.",
        "La ruta finalizará en Marrakech, una ciudad llena de colores, salpicada de artesanos y artistas, de plazas maravillosas y de aromas que marcarán nuestro recuerdo.",
      ],
    },
    en: {
      title: "Erg Chebbi and the red city of Marrakech.",
      eyebrow_prefix: "Circuit · Erg Chebbi → Marrakech",
      place: "Erg Chebbi · High Atlas · Marrakech",
      subtitle: "From the Sahara dunes to Marrakech, crossing the High Atlas, the Dadès Valley and Aït Ben Haddou.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "In Errachidia · Out Marrakech",
      quick_airports: "Errachidia / Marrakech",
      quick_places: "Errachidia · Erfoud · Erg Chebbi · Merdani · Rissani · Tinerhir · Boumalne Dades · Aït Ben Haddou · Marrakech",
      highlights: "Erg Chebbi · Khamlia · Todra · M'Goun · Aït Ben Haddou · Djemaa el-Fna",
      description_title: "An authentic circuit to discover southern Morocco.",
      description: [
        "«Erg Chebbi – Marrakech» is one of the most authentic journeys through the south of the country. The route wakes us up in the Erg Chebbi desert — a feast for the senses, with endless dunes and that magical halo special places radiate — for an unforgettable night under the stars.",
        "We continue in our 4x4 towards the High Atlas, discovering the landscapes as we go, stopping to admire their beauty, to chat with villagers, and to enjoy — without rush — the hidden hamlets and immense gorges.",
        "The route ends in Marrakech, a city full of colour, scattered with artisans and artists, marvellous squares and aromas that will linger in our memory.",
      ],
    },
    fr: {
      title: "Erg Chebbi et la ville rouge de Marrakech.",
      eyebrow_prefix: "Circuit · Erg Chebbi → Marrakech",
      place: "Erg Chebbi · Haut Atlas · Marrakech",
      subtitle: "Des dunes du Sahara à Marrakech, en traversant le Haut Atlas, la Vallée du Dadès et Aït Ben Haddou.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Errachidia · Sortie Marrakech",
      quick_airports: "Errachidia / Marrakech",
      quick_places: "Errachidia · Erfoud · Erg Chebbi · Merdani · Rissani · Tinerhir · Boumalne Dadès · Aït Ben Haddou · Marrakech",
      highlights: "Erg Chebbi · Khamlia · Todra · M'Goun · Aït Ben Haddou · Djemaa el-Fna",
      description_title: "Un circuit authentique pour découvrir le sud du Maroc.",
      description: [
        "« Erg Chebbi – Marrakech » est l'un des voyages les plus authentiques pour découvrir le sud du pays. L'itinéraire nous réveille dans le désert de l'Erg Chebbi, un spectacle pour les sens, avec ses dunes infinies et ce halo magique propre aux lieux d'exception — pour une nuit inoubliable sous les étoiles.",
        "Nous poursuivons en 4x4 vers le Haut Atlas, à la découverte des paysages, en discutant avec les villageois et en savourant sans hâte les villages perdus et les gorges immenses.",
        "L'itinéraire s'achève à Marrakech, ville colorée parsemée d'artisans et d'artistes, aux places merveilleuses et aux parfums qui marqueront notre mémoire.",
      ],
    },
  },
  // Marrakech → Erg Chebbi → Marrakech (bucle, entrada y salida Marrakech)
  mem: {
    es: {
      title: "Escapada al Erg Chebbi desde Marrakech.",
      eyebrow_prefix: "Circuito · Marrakech ↻ Erg Chebbi",
      place: "Marrakech · Alto Atlas · Erg Chebbi · Marrakech",
      subtitle: "Una escapada exprés desde Marrakech al corazón del Sahara, cruzando el Alto Atlas, Aït Ben Haddou y las Gargantas del Todra.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada y salida Marrakech",
      quick_airports: "Marrakech",
      quick_places: "Marrakech · Tizi n'Tichka · Aït Ben Haddou · Ouarzazate · Boumalne Dades · Tinerhir · Todra · Erfoud · Erg Chebbi · Merdani · Alnif · Marrakech",
      highlights: "Tizi n'Tichka · Aït Ben Haddou · Todra · Erg Chebbi · Bivouac",
      description_title: "Una aventura completa, en pocos días.",
      description: [
        "Embárcate en una escapada inolvidable desde Marrakech hacia el majestuoso desierto del Erg Chebbi, un viaje que combina paisajes impresionantes del Alto Atlas, rincones emblemáticos como Aït Ben Haddou, valles cargados de vida y la inmensidad silenciosa del Sahara.",
        "A lo largo del recorrido descubrirás pueblos bereberes, antiguas kasbahs, gargantas espectaculares y pistas legendarias del Rally Dakar, hasta adentrarte en el corazón de las dunas a lomos de un dromedario para vivir una puesta de sol única y dormir en un bivouac bajo las estrellas.",
        "Una aventura completa y enriquecedora diseñada para quienes desean conectar con la esencia más auténtica de Marruecos.",
      ],
    },
    en: {
      title: "Erg Chebbi escape from Marrakech.",
      eyebrow_prefix: "Circuit · Marrakech ↻ Erg Chebbi",
      place: "Marrakech · High Atlas · Erg Chebbi · Marrakech",
      subtitle: "A short escape from Marrakech to the heart of the Sahara, crossing the High Atlas, Aït Ben Haddou and the Todra Gorges.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "In & out Marrakech",
      quick_airports: "Marrakech",
      quick_places: "Marrakech · Tizi n'Tichka · Aït Ben Haddou · Ouarzazate · Boumalne Dades · Tinerhir · Todra · Erfoud · Erg Chebbi · Merdani · Alnif · Marrakech",
      highlights: "Tizi n'Tichka · Aït Ben Haddou · Todra · Erg Chebbi · Bivouac",
      description_title: "A complete adventure, in just a few days.",
      description: [
        "Set off on an unforgettable escape from Marrakech to the majestic Erg Chebbi desert — a journey blending High Atlas landscapes, iconic places like Aït Ben Haddou, lush valleys and the silent vastness of the Sahara.",
        "Along the way you will discover Berber villages, ancient kasbahs, spectacular gorges and the legendary Dakar Rally tracks, before riding into the heart of the dunes on camelback for a unique sunset and a night at a bivouac under the stars.",
        "A complete and enriching adventure designed for travellers who want to connect with the most authentic essence of Morocco.",
      ],
    },
    fr: {
      title: "Escapade à l'Erg Chebbi depuis Marrakech.",
      eyebrow_prefix: "Circuit · Marrakech ↻ Erg Chebbi",
      place: "Marrakech · Haut Atlas · Erg Chebbi · Marrakech",
      subtitle: "Une escapade courte depuis Marrakech au cœur du Sahara, en traversant le Haut Atlas, Aït Ben Haddou et les Gorges du Todra.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée et sortie Marrakech",
      quick_airports: "Marrakech",
      quick_places: "Marrakech · Tizi n'Tichka · Aït Ben Haddou · Ouarzazate · Boumalne Dadès · Tinerhir · Todra · Erfoud · Erg Chebbi · Merdani · Alnif · Marrakech",
      highlights: "Tizi n'Tichka · Aït Ben Haddou · Todra · Erg Chebbi · Bivouac",
      description_title: "Une aventure complète, en quelques jours.",
      description: [
        "Embarquez pour une escapade inoubliable de Marrakech vers le majestueux désert de l'Erg Chebbi — un voyage mêlant paysages du Haut Atlas, lieux emblématiques comme Aït Ben Haddou, vallées vivantes et l'immensité silencieuse du Sahara.",
        "En chemin, vous découvrirez villages berbères, anciennes kasbahs, gorges spectaculaires et les pistes mythiques du Rallye Dakar, avant de pénétrer au cœur des dunes à dos de dromadaire pour un coucher de soleil unique et une nuit en bivouac sous les étoiles.",
        "Une aventure complète et enrichissante, conçue pour ceux qui souhaitent se connecter à l'essence la plus authentique du Maroc.",
      ],
    },
  },
  // Marrakech ↔ Essaouira (bucle costero, entrada y salida Marrakech)
  mes: {
    es: {
      title: "Marrakech y la perla del Atlántico.",
      eyebrow_prefix: "Combinado · Marrakech ↔ Essaouira",
      place: "Marrakech · Essaouira · Marrakech",
      subtitle: "Un combinado de dos imprescindibles: la vibrante medina de Marrakech y la luz atlántica de Essaouira, Patrimonio de la UNESCO.",
      hero_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada y salida Marrakech",
      quick_airports: "Marrakech",
      quick_places: "Marrakech · Essaouira",
      highlights: "Medina de Marrakech · Djemaa el-Fna · Essaouira · Atlántico",
      description_title: "Dos almas, un mismo viaje.",
      description: [
        "Te presentamos un combinado entre dos lugares imprescindibles de Marruecos. Por un lado, la vibrante Marrakech, con su famosa Plaza Djemaa el-Fna, sus zocos llenos de vida, palacios, jardines y talleres artesanales.",
        "Por otro lado, Essaouira, conocida como la «Perla del Atlántico» — una encantadora ciudad costera de pescadores ideal para relajarse y pasear, declarada Patrimonio de la Humanidad por la UNESCO.",
        "Un itinerario perfecto para combinar la intensidad de la ciudad roja con la calma azul del océano.",
      ],
    },
    en: {
      title: "Marrakech and the Atlantic pearl.",
      eyebrow_prefix: "Combined · Marrakech ↔ Essaouira",
      place: "Marrakech · Essaouira · Marrakech",
      subtitle: "A pairing of two essentials — Marrakech's vibrant medina and Essaouira's Atlantic light, UNESCO World Heritage.",
      hero_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2400&q=85",
      airports: "In & out Marrakech",
      quick_airports: "Marrakech",
      quick_places: "Marrakech · Essaouira",
      highlights: "Marrakech Medina · Djemaa el-Fna · Essaouira · Atlantic",
      description_title: "Two souls, one journey.",
      description: [
        "A pairing of two Moroccan essentials. On one hand the vibrant Marrakech, with its famous Djemaa el-Fna square, its lively souks, palaces, gardens and artisan workshops.",
        "On the other hand Essaouira, known as the «Pearl of the Atlantic» — a charming coastal fishing town ideal for strolling and unwinding, listed as UNESCO World Heritage.",
        "The perfect itinerary to combine the intensity of the red city with the blue calm of the ocean.",
      ],
    },
    fr: {
      title: "Marrakech et la perle de l'Atlantique.",
      eyebrow_prefix: "Combiné · Marrakech ↔ Essaouira",
      place: "Marrakech · Essaouira · Marrakech",
      subtitle: "Un combiné de deux incontournables : la médina vibrante de Marrakech et la lumière atlantique d'Essaouira, classée à l'UNESCO.",
      hero_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée et sortie Marrakech",
      quick_airports: "Marrakech",
      quick_places: "Marrakech · Essaouira",
      highlights: "Médina de Marrakech · Djemaa el-Fna · Essaouira · Atlantique",
      description_title: "Deux âmes, un seul voyage.",
      description: [
        "Un combiné de deux incontournables du Maroc. D'un côté la vibrante Marrakech, avec sa célèbre place Djemaa el-Fna, ses souks animés, palais, jardins et ateliers d'artisans.",
        "De l'autre Essaouira, « la Perle de l'Atlantique » — charmante ville côtière de pêcheurs idéale pour flâner et se détendre, classée Patrimoine de l'Humanité de l'UNESCO.",
        "L'itinéraire parfait pour combiner l'intensité de la ville rouge à la quiétude bleue de l'océan.",
      ],
    },
  },
  // Fez → Alto Atlas → Errachidia (entrada Fez, salida Errachidia)
  fae: {
    es: {
      title: "Fez, el Atlas y la puerta del Sahara.",
      eyebrow_prefix: "Circuito · Fez → Atlas → Errachidia",
      place: "Fez · Medio Atlas · Erg Chebbi · Errachidia",
      subtitle: "Una travesía que une la medina medieval de Fez con los cedros del Atlas y las dunas del Erg Chebbi.",
      hero_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Fez · Salida Errachidia",
      quick_airports: "Fez / Errachidia",
      quick_places: "Fez · Ifrane · Aguelmame Sidi Ali · Valle del Ziz · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Errachidia",
      highlights: "Medina de Fez · Bosques de cedros · Lago Sidi Ali · Erg Chebbi · Khamlia",
      description_title: "Cultura, naturaleza, desierto y oasis.",
      description: [
        "Explora la fascinante historia de Fez, considerada una de las medinas mejor conservadas del mundo, con sus callejuelas medievales, zocos y mezquitas históricas.",
        "El viaje continúa hacia el entorno natural de Aguelmame Sidi Ali, donde se encuentra un antiguo refugio de caza y pesca reconvertido en hotel boutique de montaña.",
        "Una experiencia que combina cultura, naturaleza, desierto, oasis, montañas del Atlas y tradiciones bereberes.",
      ],
    },
    en: {
      title: "Fez, the Atlas and the gate of the Sahara.",
      eyebrow_prefix: "Circuit · Fez → Atlas → Errachidia",
      place: "Fez · Middle Atlas · Erg Chebbi · Errachidia",
      subtitle: "A crossing that links the medieval medina of Fez with the cedars of the Atlas and the dunes of the Erg Chebbi.",
      hero_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2400&q=85",
      airports: "In Fez · Out Errachidia",
      quick_airports: "Fez / Errachidia",
      quick_places: "Fez · Ifrane · Aguelmame Sidi Ali · Ziz Valley · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Errachidia",
      highlights: "Fez Medina · Cedar forests · Sidi Ali Lake · Erg Chebbi · Khamlia",
      description_title: "Culture, nature, desert and oasis.",
      description: [
        "Explore the fascinating history of Fez, considered one of the best-preserved medinas in the world, with its medieval lanes, souks and historic mosques.",
        "The journey continues to the natural setting of Aguelmame Sidi Ali, home to a former hunting and fishing lodge turned mountain boutique hotel.",
        "An experience blending culture, nature, desert, oasis, Atlas mountains and Berber traditions.",
      ],
    },
    fr: {
      title: "Fès, l'Atlas et la porte du Sahara.",
      eyebrow_prefix: "Circuit · Fès → Atlas → Errachidia",
      place: "Fès · Moyen Atlas · Erg Chebbi · Errachidia",
      subtitle: "Une traversée qui relie la médina médiévale de Fès aux cèdres de l'Atlas et aux dunes de l'Erg Chebbi.",
      hero_image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Fès · Sortie Errachidia",
      quick_airports: "Fès / Errachidia",
      quick_places: "Fès · Ifrane · Aguelmame Sidi Ali · Vallée du Ziz · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Errachidia",
      highlights: "Médina de Fès · Forêts de cèdres · Lac Sidi Ali · Erg Chebbi · Khamlia",
      description_title: "Culture, nature, désert et oasis.",
      description: [
        "Explorez l'histoire fascinante de Fès, considérée comme l'une des médinas les mieux préservées au monde, avec ses ruelles médiévales, ses souks et ses mosquées historiques.",
        "Le voyage se poursuit vers le cadre naturel d'Aguelmame Sidi Ali, où un ancien refuge de chasse et de pêche reconverti en hôtel-boutique de montagne vous attend.",
        "Une expérience qui mêle culture, nature, désert, oasis, montagnes de l'Atlas et traditions berbères.",
      ],
    },
  },
  // Errachidia → Alto Atlas → Fez (entrada Errachidia, salida Fez)
  eaf: {
    es: {
      title: "Del desierto del Tafilalet al alma medieval de Fez.",
      eyebrow_prefix: "Circuito · Errachidia → Atlas → Fez",
      place: "Errachidia · Erg Chebbi · Medio Atlas · Fez",
      subtitle: "Una travesía que une el desierto del Erg Chebbi con los cedros del Atlas y la medina más antigua del mundo árabe.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Errachidia · Salida Fez",
      quick_airports: "Errachidia / Fez",
      quick_places: "Errachidia · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Valle del Ziz · Midelt · Ifrane · Aguelmame Sidi Ali · Fez",
      highlights: "Erg Chebbi · Khamlia · Rissani · Valle del Ziz · Lago Sidi Ali · Medina de Fez",
      description_title: "Cultura, historia, naturaleza, desierto y oasis.",
      description: [
        "Una combinación perfecta entre cultura, historia, naturaleza, desierto, oasis y montañas del Atlas — empezando por las dunas infinitas del Erg Chebbi y terminando en el corazón medieval de Fez.",
        "Atravesarás el Valle del Ziz con sus diez millones de palmeras, ascenderás al Medio Atlas para alojarte junto al lago natural más profundo del país y descubrirás los bosques de cedros gigantes habitados por monos magot.",
        "Y como remate, Fez: callejuelas medievales, zocos bulliciosos, mezquitas centenarias y palacios históricos en una de las medinas mejor conservadas del mundo.",
      ],
    },
    en: {
      title: "From the Tafilalet desert to the medieval soul of Fez.",
      eyebrow_prefix: "Circuit · Errachidia → Atlas → Fez",
      place: "Errachidia · Erg Chebbi · Middle Atlas · Fez",
      subtitle: "A crossing that links the Erg Chebbi desert with the Atlas cedars and the oldest medina in the Arab world.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "In Errachidia · Out Fez",
      quick_airports: "Errachidia / Fez",
      quick_places: "Errachidia · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Ziz Valley · Midelt · Ifrane · Aguelmame Sidi Ali · Fez",
      highlights: "Erg Chebbi · Khamlia · Rissani · Ziz Valley · Sidi Ali Lake · Fez Medina",
      description_title: "Culture, history, nature, desert and oasis.",
      description: [
        "A perfect blend of culture, history, nature, desert, oasis and Atlas mountains — starting with the endless dunes of the Erg Chebbi and ending in the medieval heart of Fez.",
        "You'll cross the Ziz Valley with its ten million palm trees, climb the Middle Atlas to stay beside the country's deepest natural lake, and explore the giant cedar forests inhabited by Barbary macaques.",
        "And as the finale: Fez — medieval lanes, lively souks, centuries-old mosques and historic palaces in one of the best-preserved medinas in the world.",
      ],
    },
    fr: {
      title: "Du désert du Tafilalet à l'âme médiévale de Fès.",
      eyebrow_prefix: "Circuit · Errachidia → Atlas → Fès",
      place: "Errachidia · Erg Chebbi · Moyen Atlas · Fès",
      subtitle: "Une traversée qui relie le désert de l'Erg Chebbi aux cèdres de l'Atlas et à la plus ancienne médina du monde arabe.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Errachidia · Sortie Fès",
      quick_airports: "Errachidia / Fès",
      quick_places: "Errachidia · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Vallée du Ziz · Midelt · Ifrane · Aguelmame Sidi Ali · Fès",
      highlights: "Erg Chebbi · Khamlia · Rissani · Vallée du Ziz · Lac Sidi Ali · Médina de Fès",
      description_title: "Culture, histoire, nature, désert et oasis.",
      description: [
        "Un mélange parfait de culture, d'histoire, de nature, de désert, d'oasis et de montagnes de l'Atlas — débutant par les dunes infinies de l'Erg Chebbi et s'achevant au cœur médiéval de Fès.",
        "Vous traverserez la Vallée du Ziz et ses dix millions de palmiers, monterez dans le Moyen Atlas pour séjourner au bord du lac naturel le plus profond du pays, et découvrirez les forêts de cèdres géants peuplées de macaques de Barbarie.",
        "Et en apothéose : Fès — ruelles médiévales, souks animés, mosquées centenaires et palais historiques dans l'une des médinas les mieux préservées au monde.",
      ],
    },
  },
  // Fez → Sidi Ali → Marrakech (Gran Sur extendido con Medio Atlas)
  fzs: {
    es: {
      title: "Fez, Sidi Ali y la travesía hasta Marrakech.",
      eyebrow_prefix: "Circuito Gran Sur · Fez → Sidi Ali → Marrakech",
      place: "Fez · Medio Atlas · Sidi Ali · Erg Chebbi · Marrakech",
      subtitle: "La gran travesía clásica enriquecida con el lago alpino de Aguelmame Sidi Ali — más altitud, más contraste, más Marruecos.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Fez · Salida Marrakech",
      quick_airports: "Fez / Marrakech",
      quick_places: "Fez · Ifrane · Aguelmame Sidi Ali · Valle del Ziz · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Tinerhir · Boumalne Dades · Aït Ben Haddou · Marrakech",
      highlights: "Medina UNESCO · Cedros · Lago Sidi Ali · Erg Chebbi · Todra · Aït Ben Haddou",
      description_title: "Cultura, montaña, oasis, desierto y ciudad imperial.",
      description: [
        "Una versión más amplia y serena de la ruta clásica Fez – Marrakech, con una noche extra en el corazón del Medio Atlas, a 2.200 m de altitud, junto al lago natural más profundo de Marruecos.",
        "El recorrido en 4x4 cruza el bosque de cedros gigantes, alimenta a los macacos magot, atraviesa los diez millones de palmeras del Valle del Ziz y desemboca en el Erg Chebbi para vivir una noche bajo las estrellas del Sahara.",
        "Y de vuelta a la civilización: Gargantas del Todra, Aït Ben Haddou y Marrakech — la guinda imperial que cierra el círculo.",
      ],
    },
    en: {
      title: "Fez, Sidi Ali and the great Marrakech crossing.",
      eyebrow_prefix: "Grand South circuit · Fez → Sidi Ali → Marrakech",
      place: "Fez · Middle Atlas · Sidi Ali · Erg Chebbi · Marrakech",
      subtitle: "The classic Grand South crossing enriched with the alpine lake of Aguelmame Sidi Ali — more altitude, more contrast, more Morocco.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "In Fez · Out Marrakech",
      quick_airports: "Fez / Marrakech",
      quick_places: "Fez · Ifrane · Aguelmame Sidi Ali · Ziz Valley · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Tinerhir · Boumalne Dades · Aït Ben Haddou · Marrakech",
      highlights: "UNESCO Medina · Cedars · Sidi Ali Lake · Erg Chebbi · Todra · Aït Ben Haddou",
      description_title: "Culture, mountain, oasis, desert and imperial city.",
      description: [
        "A broader, more serene version of the classic Fez – Marrakech route, with an extra night in the heart of the Middle Atlas, at 2,200 m altitude, beside Morocco's deepest natural lake.",
        "The 4x4 journey crosses the giant cedar forest, feeds the Barbary macaques, threads the ten million palms of the Ziz Valley and reaches the Erg Chebbi for a night under the stars of the Sahara.",
        "And back to civilisation: Todra Gorges, Aït Ben Haddou and Marrakech — the imperial finale that closes the circle.",
      ],
    },
    fr: {
      title: "Fès, Sidi Ali et la grande traversée vers Marrakech.",
      eyebrow_prefix: "Circuit Grand Sud · Fès → Sidi Ali → Marrakech",
      place: "Fès · Moyen Atlas · Sidi Ali · Erg Chebbi · Marrakech",
      subtitle: "La grande traversée classique enrichie du lac alpin d'Aguelmame Sidi Ali — plus d'altitude, plus de contraste, plus de Maroc.",
      hero_image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Fès · Sortie Marrakech",
      quick_airports: "Fès / Marrakech",
      quick_places: "Fès · Ifrane · Aguelmame Sidi Ali · Vallée du Ziz · Erfoud · Erg Chebbi · Merdani · Khamlia · Rissani · Tinerhir · Boumalne Dadès · Aït Ben Haddou · Marrakech",
      highlights: "Médina UNESCO · Cèdres · Lac Sidi Ali · Erg Chebbi · Todra · Aït Ben Haddou",
      description_title: "Culture, montagne, oasis, désert et ville impériale.",
      description: [
        "Une version plus ample et plus sereine de la route classique Fès – Marrakech, avec une nuit supplémentaire au cœur du Moyen Atlas, à 2 200 m d'altitude, au bord du lac naturel le plus profond du Maroc.",
        "Le voyage en 4x4 traverse la forêt de cèdres géants, nourrit les macaques de Barbarie, parcourt les dix millions de palmiers de la Vallée du Ziz et atteint l'Erg Chebbi pour une nuit sous les étoiles du Sahara.",
        "Et retour à la civilisation : Gorges du Todra, Aït Ben Haddou et Marrakech — l'apothéose impériale qui clôt le cercle.",
      ],
    },
  },
  // Tangier → Marrakech (Gran Sur Norte: del Mediterráneo al desierto)
  trk: {
    es: {
      title: "Del azul de Chefchaouen al rojo de Marrakech.",
      eyebrow_prefix: "Circuito Norte+Sur · Tánger → Marrakech",
      place: "Tánger · Chefchaouen · Volubilis · Fez · Erg Chebbi · Marrakech",
      subtitle: "La travesía más larga y completa de Marruecos — del Mediterráneo al desierto y de Volubilis a Aït Ben Haddou.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Tánger · Salida Marrakech",
      quick_airports: "Tánger / Marrakech",
      quick_places: "Tánger · Cabo Espartel · Chefchaouen · Volubilis · Moulay Idriss · Meknes · Fez · Ifrane · Cedros · Valle del Ziz · Erfoud · Erg Chebbi · Todra · Boumalne Dades · Aït Ben Haddou · Marrakech",
      highlights: "Chefchaouen azul · Volubilis UNESCO · Medina de Fez · Erg Chebbi · Todra · Aït Ben Haddou · Marrakech",
      description_title: "Norte, ciudades imperiales, desierto y sur.",
      description: [
        "La travesía más completa que puede hacerse en Marruecos: del Mediterráneo al Sahara y del azul de Chefchaouen al rojo de Marrakech, pasando por las cuatro ciudades imperiales y la ruta de las mil kasbahs.",
        "Empezamos en Tánger, cruce de civilizaciones, y bajamos por Chefchaouen, Volubilis romano, Moulay Idriss, Meknes y Fez — dos noches en su medina UNESCO. Luego cruzamos el Medio Atlas con sus cedros gigantes hasta dormir bajo las estrellas en el Erg Chebbi.",
        "Y de vuelta al norte por las gargantas del Todra, el valle del Dades, Aït Ben Haddou y el Alto Atlas por Tizi n'Tichka, cerrando el círculo en Marrakech con su medina, sus zocos y su plaza Djemaa el-Fna.",
      ],
    },
    en: {
      title: "From Chefchaouen blue to Marrakech red.",
      eyebrow_prefix: "North+South circuit · Tangier → Marrakech",
      place: "Tangier · Chefchaouen · Volubilis · Fez · Erg Chebbi · Marrakech",
      subtitle: "Morocco's longest and most complete crossing — from the Mediterranean to the desert, and from Volubilis to Aït Ben Haddou.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "In Tangier · Out Marrakech",
      quick_airports: "Tangier / Marrakech",
      quick_places: "Tangier · Cape Spartel · Chefchaouen · Volubilis · Moulay Idriss · Meknes · Fez · Ifrane · Cedars · Ziz Valley · Erfoud · Erg Chebbi · Todra · Boumalne Dades · Aït Ben Haddou · Marrakech",
      highlights: "Blue Chefchaouen · Volubilis UNESCO · Fez Medina · Erg Chebbi · Todra · Aït Ben Haddou · Marrakech",
      description_title: "North, imperial cities, desert and south.",
      description: [
        "The most complete crossing one can do in Morocco: from the Mediterranean to the Sahara and from the blue of Chefchaouen to the red of Marrakech, passing through the four imperial cities and the thousand-kasbahs route.",
        "We start in Tangier, crossroads of civilisations, and head down through Chefchaouen, Roman Volubilis, Moulay Idriss, Meknes and Fez — two nights in its UNESCO medina. Then we cross the Middle Atlas with its giant cedars and sleep under the stars in the Erg Chebbi.",
        "And back north through the Todra gorges, the Dades valley, Aït Ben Haddou and the High Atlas via Tizi n'Tichka, closing the circle in Marrakech with its medina, souks and Djemaa el-Fna square.",
      ],
    },
    fr: {
      title: "Du bleu de Chefchaouen au rouge de Marrakech.",
      eyebrow_prefix: "Circuit Nord+Sud · Tanger → Marrakech",
      place: "Tanger · Chefchaouen · Volubilis · Fès · Erg Chebbi · Marrakech",
      subtitle: "La traversée la plus longue et la plus complète du Maroc — de la Méditerranée au désert, et de Volubilis à Aït Ben Haddou.",
      hero_image: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Tanger · Sortie Marrakech",
      quick_airports: "Tanger / Marrakech",
      quick_places: "Tanger · Cap Spartel · Chefchaouen · Volubilis · Moulay Idriss · Meknès · Fès · Ifrane · Cèdres · Vallée du Ziz · Erfoud · Erg Chebbi · Todra · Boumalne Dadès · Aït Ben Haddou · Marrakech",
      highlights: "Chefchaouen bleue · Volubilis UNESCO · Médina de Fès · Erg Chebbi · Todra · Aït Ben Haddou · Marrakech",
      description_title: "Nord, villes impériales, désert et sud.",
      description: [
        "La traversée la plus complète que l'on puisse faire au Maroc : de la Méditerranée au Sahara et du bleu de Chefchaouen au rouge de Marrakech, en passant par les quatre cités impériales et la route des mille kasbahs.",
        "Nous commençons à Tanger, carrefour des civilisations, et descendons par Chefchaouen, Volubilis romaine, Moulay Idriss, Meknès et Fès — deux nuits dans sa médina UNESCO. Puis traversée du Moyen Atlas et de ses cèdres géants jusqu'à dormir sous les étoiles dans l'Erg Chebbi.",
        "Et retour vers le nord par les gorges du Todra, la vallée du Dadès, Aït Ben Haddou et le Haut Atlas par Tizi n'Tichka, pour fermer le cercle à Marrakech avec sa médina, ses souks et sa place Djemaa el-Fna.",
      ],
    },
  },
  // Fez → Sidi Ali → Ouarzazate (ruta inversa del Gran Sur)
  foz: {
    es: {
      title: "De Fez al Atlas, atravesando Sidi Ali y el desierto.",
      eyebrow_prefix: "Circuito Gran Sur · Fez → Sidi Ali → Ouarzazate",
      place: "Fez · Medio Atlas · Sidi Ali · Erg Chebbi · Ouarzazate",
      subtitle: "De la medina UNESCO de Fez a la puerta del cine marroquí — atravesando el oasis alpino de Sidi Ali, el Sahara y las gargantas del Atlas.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Fez · Salida Ouarzazate",
      quick_airports: "Fez / Ouarzazate",
      quick_places: "Fez · Ifrane · Aguelmame Sidi Ali · Parque Nacional de Khenifra · Valle del Ziz · Erfoud · Erg Chebbi · Todra · Boumalne Dades · Ouarzazate",
      highlights: "Medina UNESCO · Lago Sidi Ali · Parque Nacional Khenifra · Erg Chebbi · Todra · Atlas Studios",
      description_title: "Historia, montaña, desierto y cine.",
      description: [
        "Explora la fascinante historia de Fez, la mejor conservada medina del mundo árabe, con sus estrechas callejuelas, bulliciosos zocos y mezquitas centenarias.",
        "Después, escapa a la serenidad del Hotel Xaluca Spa Aguelmane Sidi Ali — antiguamente refugio de caza y pesca, hoy un hotel boutique de alta montaña a 2.200 m sobre el lago natural más profundo del país.",
        "El viaje combina historia, cultura, naturaleza, desierto y montaña, terminando en Ouarzazate, capital del cine marroquí y puerta sur del Atlas.",
      ],
    },
    en: {
      title: "From Fez to the Atlas, through Sidi Ali and the desert.",
      eyebrow_prefix: "Grand South circuit · Fez → Sidi Ali → Ouarzazate",
      place: "Fez · Middle Atlas · Sidi Ali · Erg Chebbi · Ouarzazate",
      subtitle: "From Fez's UNESCO medina to the gate of Moroccan cinema — crossing the Sidi Ali alpine oasis, the Sahara and the Atlas gorges.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "In Fez · Out Ouarzazate",
      quick_airports: "Fez / Ouarzazate",
      quick_places: "Fez · Ifrane · Aguelmame Sidi Ali · Khenifra National Park · Ziz Valley · Erfoud · Erg Chebbi · Todra · Boumalne Dades · Ouarzazate",
      highlights: "UNESCO Medina · Sidi Ali Lake · Khenifra National Park · Erg Chebbi · Todra · Atlas Studios",
      description_title: "History, mountain, desert and cinema.",
      description: [
        "Explore the fascinating history of Fez — the best-preserved medina in the Arab world — with its narrow alleys, lively souks and centuries-old mosques.",
        "Then escape to the serenity of Hotel Xaluca Spa Aguelmane Sidi Ali — once a hunting and fishing lodge, today a high-altitude boutique hotel at 2,200 m above Morocco's deepest natural lake.",
        "The journey combines history, culture, nature, desert and mountain — ending in Ouarzazate, capital of Moroccan cinema and southern gateway to the Atlas.",
      ],
    },
    fr: {
      title: "De Fès à l'Atlas, en passant par Sidi Ali et le désert.",
      eyebrow_prefix: "Circuit Grand Sud · Fès → Sidi Ali → Ouarzazate",
      place: "Fès · Moyen Atlas · Sidi Ali · Erg Chebbi · Ouarzazate",
      subtitle: "De la médina UNESCO de Fès à la porte du cinéma marocain — en traversant l'oasis alpine de Sidi Ali, le Sahara et les gorges de l'Atlas.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Fès · Sortie Ouarzazate",
      quick_airports: "Fès / Ouarzazate",
      quick_places: "Fès · Ifrane · Aguelmame Sidi Ali · Parc National de Khénifra · Vallée du Ziz · Erfoud · Erg Chebbi · Todra · Boumalne Dadès · Ouarzazate",
      highlights: "Médina UNESCO · Lac Sidi Ali · Parc National Khénifra · Erg Chebbi · Todra · Atlas Studios",
      description_title: "Histoire, montagne, désert et cinéma.",
      description: [
        "Explorez l'histoire fascinante de Fès — la médina la mieux conservée du monde arabe — avec ses ruelles, ses souks animés et ses mosquées centenaires.",
        "Puis évadez-vous dans la sérénité de l'Hôtel Xaluca Spa Aguelmane Sidi Ali — ancien relais de chasse et de pêche, aujourd'hui un hôtel-boutique d'altitude à 2 200 m, au bord du lac naturel le plus profond du pays.",
        "Le voyage allie histoire, culture, nature, désert et montagne — pour se terminer à Ouarzazate, capitale du cinéma marocain et porte sud de l'Atlas.",
      ],
    },
  },
  // Ouarzazate → Sidi Ali → Fez (Gran Sur en sentido inverso · de cine a medina)
  ozf: {
    es: {
      title: "De Ouarzazate al alma medieval de Fez, atravesando Sidi Ali.",
      eyebrow_prefix: "Circuito Gran Sur · Ouarzazate → Sidi Ali → Fez",
      place: "Ouarzazate · Erg Chebbi · Sidi Ali · Fez",
      subtitle: "Del «Hollywood marroquí» a la medina más antigua del mundo árabe — pasando por las dunas y el lago alpino del Atlas.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada Ouarzazate · Salida Fez",
      quick_airports: "Ouarzazate / Fez",
      quick_places: "Ouarzazate · Aït Ben Haddou · Boumalne Dades · Todra · Erfoud · Erg Chebbi · Khamlia · Rissani · Valle del Ziz · Aguelmame Sidi Ali · Ifrane · Fez",
      highlights: "Aït Ben Haddou UNESCO · Erg Chebbi · Khamlia · Lago Sidi Ali · Medina de Fez",
      description_title: "Cine, desierto, montaña y medina.",
      description: [
        "Explora la fascinante historia de Fez, la mejor conservada medina del mundo árabe, con sus estrechas callejuelas, bulliciosos zocos y mezquitas centenarias.",
        "Antes, el viaje habrá pasado por Aït Ben Haddou — escenario de Gladiator y Lawrence de Arabia — el desierto del Erg Chebbi y el lago Aguelmane Sidi Ali, antiguo refugio de caza reconvertido en hotel boutique de alta montaña.",
        "Un viaje único que combina historia, cultura, naturaleza, desierto y montaña — del «Hollywood marroquí» al corazón medieval del país.",
      ],
    },
    en: {
      title: "From Ouarzazate to the medieval heart of Fez, through Sidi Ali.",
      eyebrow_prefix: "Grand South circuit · Ouarzazate → Sidi Ali → Fez",
      place: "Ouarzazate · Erg Chebbi · Sidi Ali · Fez",
      subtitle: "From the «Moroccan Hollywood» to the oldest medina in the Arab world — crossing the dunes and the alpine Atlas lake.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "In Ouarzazate · Out Fez",
      quick_airports: "Ouarzazate / Fez",
      quick_places: "Ouarzazate · Aït Ben Haddou · Boumalne Dades · Todra · Erfoud · Erg Chebbi · Khamlia · Rissani · Ziz Valley · Aguelmame Sidi Ali · Ifrane · Fez",
      highlights: "Aït Ben Haddou UNESCO · Erg Chebbi · Khamlia · Sidi Ali Lake · Fez Medina",
      description_title: "Cinema, desert, mountain and medina.",
      description: [
        "Explore the fascinating history of Fez, the best-preserved medina in the Arab world, with its narrow alleys, lively souks and centuries-old mosques.",
        "Before that, the journey will have passed Aït Ben Haddou — Gladiator and Lawrence of Arabia set — the Erg Chebbi desert and the Aguelmane Sidi Ali lake, a former hunting lodge converted into a high-altitude boutique hotel.",
        "A unique journey combining history, culture, nature, desert and mountain — from the «Moroccan Hollywood» to the medieval heart of the country.",
      ],
    },
    fr: {
      title: "D'Ouarzazate au cœur médiéval de Fès, via Sidi Ali.",
      eyebrow_prefix: "Circuit Grand Sud · Ouarzazate → Sidi Ali → Fès",
      place: "Ouarzazate · Erg Chebbi · Sidi Ali · Fès",
      subtitle: "Du « Hollywood marocain » à la plus ancienne médina du monde arabe — en traversant les dunes et le lac alpin de l'Atlas.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée Ouarzazate · Sortie Fès",
      quick_airports: "Ouarzazate / Fès",
      quick_places: "Ouarzazate · Aït Ben Haddou · Boumalne Dadès · Todra · Erfoud · Erg Chebbi · Khamlia · Rissani · Vallée du Ziz · Aguelmame Sidi Ali · Ifrane · Fès",
      highlights: "Aït Ben Haddou UNESCO · Erg Chebbi · Khamlia · Lac Sidi Ali · Médina de Fès",
      description_title: "Cinéma, désert, montagne et médina.",
      description: [
        "Explorez l'histoire fascinante de Fès, la médina la mieux conservée du monde arabe, avec ses ruelles étroites, ses souks animés et ses mosquées centenaires.",
        "Avant cela, le voyage aura traversé Aït Ben Haddou — décor de Gladiator et de Lawrence d'Arabie — le désert de l'Erg Chebbi et le lac Aguelmane Sidi Ali, ancien relais de chasse reconverti en hôtel-boutique d'altitude.",
        "Un voyage unique qui mêle histoire, culture, nature, désert et montagne — du « Hollywood marocain » au cœur médiéval du pays.",
      ],
    },
  },
  // Marrakech short escape · only the imperial city (2n/3d)
  rak: {
    es: {
      title: "Escapada a Marrakech · la ciudad roja.",
      eyebrow_prefix: "Escapadas Marruecos · Marrakech",
      place: "Marrakech · Djemaa el-Fna · Koutoubia · Palacio de la Bahía",
      subtitle: "Dos noches para perderse en el ruido fértil de la Medina, ver caer la noche en Djemaa el-Fna y regatear en los zocos.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada y salida Marrakech",
      quick_airports: "Marrakech / Marrakech",
      quick_places: "Marrakech · Djemaa el-Fna · Koutoubia · Palacio de la Bahía · zocos · farmacia bereber",
      highlights: "Djemaa el-Fna UNESCO · Koutoubia · Palacio de la Bahía",
      description_title: "La medina que respira.",
      description: [
        "Marrakech sigue siendo una de las cuatro Ciudades Imperiales y la más turística de Marruecos gracias a su autenticidad y a la intensidad que transmite desde el primer momento. Su enorme muralla protege una Medina llena de callejones estrechos, palacios, jardines, talleres artesanales y tiendas tradicionales y modernas.",
        "Esta escapada está pensada para conocer la ciudad sin prisa: un guía local nos lleva a los hitos imprescindibles (Koutoubia, Palacio de la Bahía, zocos, farmacia bereber) y deja tiempo libre para vivir Djemaa el-Fna de día y de noche — dos plazas distintas en el mismo lugar.",
      ],
    },
    en: {
      title: "Escape to Marrakech · the red city.",
      eyebrow_prefix: "Morocco short escapes · Marrakech",
      place: "Marrakech · Jemaa el-Fna · Koutoubia · Bahia Palace",
      subtitle: "Two nights to get lost in the fertile noise of the Medina, watch the night fall on Jemaa el-Fna and haggle in the souks.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "In and out Marrakech",
      quick_airports: "Marrakech / Marrakech",
      quick_places: "Marrakech · Jemaa el-Fna · Koutoubia · Bahia Palace · souks · Berber pharmacy",
      highlights: "Jemaa el-Fna UNESCO · Koutoubia · Bahia Palace",
      description_title: "The breathing medina.",
      description: [
        "Marrakech remains one of Morocco's four Imperial Cities and the most touristed thanks to its authenticity and the intensity it transmits from the first minute. Its huge wall protects a Medina full of narrow alleys, palaces, gardens, artisan workshops, traditional and modern shops.",
        "This short escape is designed to know the city unhurried: a local guide takes us to the essentials (Koutoubia, Bahia Palace, souks, Berber pharmacy) and leaves free time to experience Jemaa el-Fna by day and by night — two different squares in the same place.",
      ],
    },
    fr: {
      title: "Escapade à Marrakech · la ville rouge.",
      eyebrow_prefix: "Escapades Maroc · Marrakech",
      place: "Marrakech · Jemaa el-Fna · Koutoubia · Palais de la Bahia",
      subtitle: "Deux nuits pour se perdre dans le bruit fertile de la médina, voir la nuit tomber sur Jemaa el-Fna et marchander dans les souks.",
      hero_image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée et sortie Marrakech",
      quick_airports: "Marrakech / Marrakech",
      quick_places: "Marrakech · Jemaa el-Fna · Koutoubia · Palais de la Bahia · souks · pharmacie berbère",
      highlights: "Jemaa el-Fna UNESCO · Koutoubia · Palais de la Bahia",
      description_title: "La médina qui respire.",
      description: [
        "Marrakech reste l'une des quatre Cités Impériales du Maroc et la plus touristique grâce à son authenticité et à l'intensité qu'elle dégage dès la première minute. Son immense muraille protège une médina pleine de ruelles étroites, palais, jardins, ateliers d'artisans, boutiques traditionnelles et modernes.",
        "Cette escapade est pensée pour découvrir la ville sans hâte : un guide local nous emmène vers les incontournables (Koutoubia, Palais de la Bahia, souks, pharmacie berbère) et laisse du temps libre pour vivre Jemaa el-Fna de jour et de nuit — deux places différentes au même endroit.",
      ],
    },
  },
  // Marrakech + Agafay short escape (3n/4d) · city + nearby «desert»
  raga: {
    es: {
      title: "Marrakech y el Desierto Marrakchi de Agafay.",
      eyebrow_prefix: "Escapadas Marruecos · Marrakech + Agafay",
      place: "Marrakech · Meseta del Kik · Agafay · bivouac",
      subtitle: "Dos noches en la Medina y una noche bajo las estrellas en el «Desierto Marrakchi» — sin dunas pero con el mismo silencio.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada y salida Marrakech",
      quick_airports: "Marrakech / Marrakech",
      quick_places: "Marrakech · Djemaa el-Fna · Koutoubia · Meseta del Kik · Lalla Takerkoust · Agafay",
      highlights: "Djemaa el-Fna · Koutoubia · Bivouac de lujo en Agafay · paseo en dromedario",
      description_title: "Una escapada combinada Marrakech + desierto.",
      description: [
        "Viaje combinado para descubrir Marrakech y la zona desértica más cercana a la ciudad, el Desierto de Agafay.",
        "Marrakech aporta la plaza Djemaa el-Fna, los zocos y el laberinto de callejuelas llenas de palacios, jardines y talleres artesanales.",
        "Agafay — conocido como «el Desierto Marrakchi» — está a los pies del Alto Atlas tras cruzar la Meseta del Kik. No tiene dunas de arena pero ofrece paisajes áridos espectaculares y la experiencia única de dormir bajo las estrellas a una hora escasa de la ciudad.",
      ],
    },
    en: {
      title: "Marrakech and the Marrakchi Agafay Desert.",
      eyebrow_prefix: "Morocco short escapes · Marrakech + Agafay",
      place: "Marrakech · Kik Plateau · Agafay · bivouac",
      subtitle: "Two nights in the Medina and one night under the stars in the «Marrakchi desert» — no dunes but the same silence.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "In and out Marrakech",
      quick_airports: "Marrakech / Marrakech",
      quick_places: "Marrakech · Jemaa el-Fna · Koutoubia · Kik Plateau · Lalla Takerkoust · Agafay",
      highlights: "Jemaa el-Fna · Koutoubia · Luxury bivouac in Agafay · camel ride",
      description_title: "A combined Marrakech + desert escape.",
      description: [
        "A combined trip to discover Marrakech and the closest desert to the city, the Agafay Desert.",
        "Marrakech brings Jemaa el-Fna square, the souks and the maze of narrow alleys filled with palaces, gardens and artisan workshops.",
        "Agafay — known as «the Marrakchi desert» — sits at the foot of the High Atlas after crossing the Kik Plateau. No sand dunes, but spectacular arid landscapes and the unique experience of sleeping under the stars only an hour from the city.",
      ],
    },
    fr: {
      title: "Marrakech et le désert marrakchi d'Agafay.",
      eyebrow_prefix: "Escapades Maroc · Marrakech + Agafay",
      place: "Marrakech · Plateau du Kik · Agafay · bivouac",
      subtitle: "Deux nuits dans la médina et une nuit sous les étoiles dans le « désert marrakchi » — sans dunes mais avec le même silence.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée et sortie Marrakech",
      quick_airports: "Marrakech / Marrakech",
      quick_places: "Marrakech · Jemaa el-Fna · Koutoubia · Plateau du Kik · Lalla Takerkoust · Agafay",
      highlights: "Jemaa el-Fna · Koutoubia · Bivouac de luxe à Agafay · balade à dromadaire",
      description_title: "Une escapade combinée Marrakech + désert.",
      description: [
        "Voyage combiné pour découvrir Marrakech et la zone désertique la plus proche de la ville, le désert d'Agafay.",
        "Marrakech apporte la place Jemaa el-Fna, les souks et le labyrinthe de ruelles remplies de palais, jardins et ateliers d'artisans.",
        "Agafay — surnommé « le désert marrakchi » — est au pied du Haut Atlas, après le plateau du Kik. Pas de dunes mais des paysages arides spectaculaires et l'expérience unique de dormir sous les étoiles à une heure à peine de la ville.",
      ],
    },
  },
  // Fez short escapes — Fez Medina (2n/3d) and Fez + Meknes / Volubilis (3n/4d)
  fez: {
    es: {
      title: "Escapada a Fez · la medina más auténtica del mundo árabe.",
      eyebrow_prefix: "Escapadas Marruecos · Fez",
      place: "Fez · Fez-el Bali · Chouara · Madraza Bou Inania",
      subtitle: "Dos o tres noches para perderse en nueve mil callejones medievales, descubrir los oficios milenarios y subir a un mirador para ver caer la última llamada a la oración.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Entrada y salida Fez",
      quick_airports: "Fez / Fez",
      quick_places: "Fez · Fez-el Bali · Chouara · Madraza · Meknès · Volubilis · Moulay Idriss",
      highlights: "Medina UNESCO · Tenerías de Chouara · Bou Inania · Volubilis",
      description_title: "Capital espiritual y cultural de Marruecos.",
      description: [
        "Fundada en 789 por Idris I, Fez es la ciudad más santa y cultural de las cuatro Ciudades Imperiales de Marruecos. Su medina — Patrimonio UNESCO desde 1981 — alberga la universidad más antigua del mundo en funcionamiento y nueve mil callejones intactos desde el siglo IX.",
        "Esta escapada está pensada para perderse a pie entre zocos, mezquitas, tenerías y palacios, acompañados por un guía local experto. La UNESCO prohibió hace décadas el acceso de vehículos a motor: solo hay carros, mulas y pies para descubrir uno de los tejidos urbanos medievales mejor conservados del mundo árabe.",
      ],
    },
    en: {
      title: "Escape to Fez · the most authentic medina in the Arab world.",
      eyebrow_prefix: "Morocco short escapes · Fez",
      place: "Fez · Fez-el Bali · Chouara · Bou Inania Madrasa",
      subtitle: "Two or three nights to wander nine thousand medieval alleys, discover millennia-old crafts and climb to a viewpoint to watch the last call to prayer fall.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "In and out Fez",
      quick_airports: "Fez / Fez",
      quick_places: "Fez · Fez-el Bali · Chouara · Madrasa · Meknès · Volubilis · Moulay Idriss",
      highlights: "UNESCO Medina · Chouara tanneries · Bou Inania · Volubilis",
      description_title: "Spiritual and cultural capital of Morocco.",
      description: [
        "Founded in 789 by Idris I, Fez is the holiest and most cultural of Morocco's four Imperial Cities. Its medina — UNESCO World Heritage since 1981 — hosts the world's oldest continuously running university and nine thousand alleys unchanged since the 9th century.",
        "This short escape is designed to get lost on foot among souks, mosques, tanneries and palaces with an expert local guide. UNESCO banned motor traffic decades ago: only carts, mules and feet to discover one of the best-preserved medieval urban fabrics in the Arab world.",
      ],
    },
    fr: {
      title: "Escapade à Fès · la médina la plus authentique du monde arabe.",
      eyebrow_prefix: "Escapades Maroc · Fès",
      place: "Fès · Fès-el Bali · Chouara · Médersa Bou Inania",
      subtitle: "Deux ou trois nuits pour se perdre dans neuf mille ruelles médiévales, découvrir les métiers millénaires et monter à un mirador pour le dernier appel à la prière.",
      hero_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85",
      airports: "Arrivée et sortie Fès",
      quick_airports: "Fès / Fès",
      quick_places: "Fès · Fès-el Bali · Chouara · Médersa · Meknès · Volubilis · Moulay Idriss",
      highlights: "Médina UNESCO · Tanneries de Chouara · Bou Inania · Volubilis",
      description_title: "Capitale spirituelle et culturelle du Maroc.",
      description: [
        "Fondée en 789 par Idriss Ier, Fès est la plus sainte et la plus culturelle des quatre Cités Impériales du Maroc. Sa médina — Patrimoine UNESCO depuis 1981 — abrite la plus ancienne université au monde en activité et neuf mille ruelles intactes depuis le IXe siècle.",
        "Cette escapade courte est pensée pour se perdre à pied parmi souks, mosquées, tanneries et palais, accompagné par un guide local expert. L'UNESCO a interdit la circulation motorisée il y a des décennies : il ne reste que charrettes, mulets et pas pour explorer l'un des tissus urbains médiévaux les mieux conservés du monde arabe.",
      ],
    },
  },
};

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
const ProgramHero = ({ vt, t, program, lang, variant }) => {
  // Namespaced by the current program URL so every itinerary keeps its
  // own independent hero image (text was already page-scoped via <C>).
  const heroSlot = useSlotId("hero");
  return (
  <section data-testid="program-hero" className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-[#1A1513]">
    <EditableImage
      slot={heroSlot}
      fallback={vt.hero_image}
      alt=""
      aspectRatio="21/9"
      priority
      className="ken-burns absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/35 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />
    <div className="relative z-10 h-full flex flex-col">
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
            <dl className="fade-up fade-up-delay-3 mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15 max-w-3xl">
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
            </dl>
            <div className="fade-up fade-up-delay-4 mt-10 flex flex-wrap items-center gap-4">
              <a href="#contact" data-testid="program-hero-cta-primary"
                 className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
                <L k="cta_primary" /><ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </a>
              <a href="#itinerary" data-testid="program-hero-cta-secondary"
                 className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300">
                <L k="cta_secondary" /><ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>
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

const DayBlock = ({ day, idx, total, lang, t, hideDayGallery = false }) => {
  const reverse = idx % 2 === 1;
  const dayNum = String(idx + 1).padStart(2, "0");
  // Page-namespaced so the day image is independent per itinerary URL,
  // even when several programmes reuse the same shared `day.id`.
  const dayImageSlot = useSlotId(`day.${day.id}.image`);
  return (
    <article id={day.id} data-testid={`program-day-${day.id}`}
             className="relative bg-[#FDFBF7] py-20 md:py-24 overflow-hidden border-b border-[#2C2621]/10">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <div className="lg:col-span-6 lg:[direction:ltr]">
            <div className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-[#1A1513] sticky lg:top-24">
              <EditableImage
                slot={dayImageSlot}
                fallback={day.image}
                alt={pick(day.title, lang)}
                aspectRatio="5/6"
                imgProps={{ loading: "lazy" }}
                className="ken-burns absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 via-transparent to-transparent pointer-events-none" />
              <span className="film-grain" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-3 bg-[#FDFBF7]/95 backdrop-blur-sm px-4 py-2">
                <span className="font-serif-x text-xl leading-none" style={{ color: day.accent }}>
                  <L k="day_label" /> {dayNum}
                </span>
              </div>
            </div>
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
                </div>
              </div>
            )}
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

const Itinerary = ({ t, lang, days, hideDayGallery = false }) => (
  <section id="itinerary" data-testid="program-itinerary"
           className="relative bg-[#FDFBF7] pt-20 md:pt-28">
    <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center mb-12">
      <L k="itinerary_overline" className="overline" />
      <L k="itinerary_title" as="h2" className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]" />
    </div>
    {days.map((d, i) => (
      <DayBlock key={`${d.id}-${i}`} day={d} idx={i} total={days.length} lang={lang} t={t} hideDayGallery={hideDayGallery} />
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
export default function ProgramTemplate({ program, variant = "da" }) {
  const { lang } = useLanguage();
  const location = useLocation();
  const { routeId } = resolvePath(location.pathname);
  const t = LABELS[lang] || LABELS.es;
  const baseVt = (VARIANT_COPY[variant] && VARIANT_COPY[variant][lang]) || VARIANT_COPY.da.es;
  // Per-program meta overrides VARIANT_COPY (trilingual `meta: { es, en, fr }`)
  const metaOverride = program.meta && (program.meta[lang] || program.meta.es) || null;
  const vt = metaOverride ? { ...baseVt, ...metaOverride } : baseVt;

  useEffect(() => {
    document.title = `${vt.title} · ${pick(program.duration, lang)} · Xaluca Tours`;
    window.scrollTo(0, 0);
  }, [vt.title, program.duration, lang]);

  const navOverview = { es: "Resumen", en: "Overview", fr: "Résumé" };
  const navItems = [
    { id: "description", label: t.nav_description },
    { id: "quick",       label: t.nav_quick },
    { id: "itinerary",   label: t.nav_itinerary },
    { id: "overview",    label: pick(navOverview, lang) },
    { id: "pricing",     label: t.nav_pricing },
    { id: "includes",    label: t.nav_includes },
    { id: "contact",     label: t.nav_contact },
  ];

  return (
    <div data-testid={`program-page-${program.duration_key}`}>
      <ProgramHero vt={vt} t={t} program={program} lang={lang} variant={variant} />
      <StickyNav items={navItems} testid="program-nav" />
      {program.route && <TripRouteMap route={program.route} days={program.days} />}
      <Description vt={vt} t={t} program={program} variant={variant} />
      <QuickInfo t={t} vt={vt} program={program} lang={lang} variant={variant} />
      <Itinerary t={t} lang={lang} days={program.days} hideDayGallery={routeId === "tourMarrakechErg56"} />
      <TripOverview days={program.days} />
      <PricingSection id="pricing" testid="program-pricing" ctaHref="#contact" routeId={routeId} />
      <DetailsAccordion t={t} lang={lang} program={program} />
      <HubPeerNav routeId={routeId} />
      <ContactBand t={t} lang={lang} />
      <div id="form"><ContactForm /></div>
    </div>
  );
}
