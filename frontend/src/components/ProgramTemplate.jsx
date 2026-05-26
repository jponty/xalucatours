import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Compass, ChevronDown, ChevronUp, MapPin, Plane, Clock,
  Calendar, Mountain, Sparkles, Phone, Mail, MessageCircle, Camera,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { StickyNav } from "@/components/JourneyPageSections";
import { SHARED_SEASONS, SHARED_DETAILS } from "@/lib/programData";
import { DayRouteMap } from "@/components/DayRouteMap";
import { DayGallery } from "@/components/DayGallery";
import { TripOverview } from "@/components/TripOverview";
import { TripRouteMap } from "@/components/TripRouteMap";
import ContactForm from "@/components/ContactForm";

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
    type_da: "Desierto + Atlas", type_ad: "Atlas + Desierto", type_frz: "Fez · Erg Chebbi · Marrakech", type_frm: "Marrakech · Erg Chebbi · Fez", type_atlas: "Alto Atlas · Drâa", type_desierto: "Sáhara · Erg Chebbi",
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
    type_da: "Desert + Atlas", type_ad: "Atlas + Desert", type_frz: "Fez · Erg Chebbi · Marrakech", type_frm: "Marrakech · Erg Chebbi · Fez", type_atlas: "High Atlas · Drâa", type_desierto: "Sahara · Erg Chebbi",
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
    type_da: "Désert + Atlas", type_ad: "Atlas + Désert", type_frz: "Fès · Erg Chebbi · Marrakech", type_frm: "Marrakech · Erg Chebbi · Fès", type_atlas: "Haut Atlas · Drâa", type_desierto: "Sahara · Erg Chebbi",
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
   Hero
============================================================ */
const ProgramHero = ({ vt, t, program, lang }) => (
  <section data-testid="program-hero" className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-[#1A1513]">
    <img src={vt.hero_image} alt="" loading="eager"
         className="ken-burns absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/35" />
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />
    <div className="relative z-10 h-full flex flex-col">
      <div className="flex-1 flex items-end pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-4xl">
            <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">{vt.eyebrow_prefix} · {pick(program.duration, lang)}</span>
              <span className="w-8 h-px bg-[#D4A373]/50" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80">{vt.place}</span>
            </div>
            <h1 className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6">
              {vt.title}
            </h1>
            <p className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed">
              {vt.subtitle}
            </p>
            <dl className="fade-up fade-up-delay-3 mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15 max-w-3xl">
              {[
                { Icon: Clock,    label: t.eyebrow_duration,   value: pick(program.duration, lang) },
                { Icon: Plane,    label: t.eyebrow_airports,   value: vt.airports },
                { Icon: Sparkles, label: t.eyebrow_highlights, value: vt.highlights },
              ].map(({ Icon, label, value }, i) => (
                <div key={i} className="bg-[#1A1513]/80 backdrop-blur-md p-5 flex flex-col gap-2">
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
                {t.cta_primary}<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </a>
              <a href="#itinerary" data-testid="program-hero-cta-secondary"
                 className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300">
                {t.cta_secondary}<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <a href="#description" className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 text-[#FDFBF7]/65 hover:text-[#D4A373] transition-colors">
        <span className="text-[10px] tracking-[0.35em] uppercase">{t.scroll}</span>
        <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={1.5} />
      </a>
    </div>
  </section>
);

const Description = ({ vt, t }) => (
  <section id="description" data-testid="program-description"
           className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
    <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
      <span className="overline">{t.desc_overline}</span>
      <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
        {vt.description_title}
      </h2>
      <div className="mt-8 space-y-5 text-[15px] md:text-base text-[#5C5248] leading-[1.85]">
        {vt.description.map((p, i) => (
          <p key={i} className={i === 0 ? "font-serif-x-italic text-xl md:text-2xl text-[#C16542]" : ""}>{p}</p>
        ))}
      </div>
    </div>
  </section>
);

const QuickInfo = ({ t, vt, program, lang, variant }) => {
  const cards = [
    { Icon: Clock,    label: t.card_duration,   value: pick(program.duration, lang) },
    { Icon: MapPin,   label: t.card_places,     value: vt.quick_places },
    { Icon: Plane,    label: t.card_airports,   value: vt.quick_airports },
    { Icon: Mountain, label: t.card_type,       value: variant === "frz" ? (t.type_frz || "Fez · Erg Chebbi · Marrakech") : variant === "frm" ? (t.type_frm || "Marrakech · Erg Chebbi · Fez") : variant === "atlas" ? (t.type_atlas || "Alto Atlas · Drâa") : variant === "desierto" ? (t.type_desierto || "Sáhara · Erg Chebbi") : (variant === "ad" ? t.type_ad : t.type_da) },
    { Icon: Sparkles, label: t.card_experiences,value: t.experiences_value },
  ];
  return (
    <section id="quick" data-testid="program-quick"
             className="relative bg-[#F2EBE1] py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 berber-bg-diamond opacity-30 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="overline">{t.quick_overline}</span>
          <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.quick_title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
          {cards.map((c, i) => (
            <div key={i} data-testid={`program-quick-${i}`}
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

const DayBlock = ({ day, idx, total, lang, t }) => {
  const reverse = idx % 2 === 1;
  const dayNum = String(idx + 1).padStart(2, "0");
  return (
    <article id={day.id} data-testid={`program-day-${day.id}`}
             className="relative bg-[#FDFBF7] py-20 md:py-24 overflow-hidden border-b border-[#2C2621]/10">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <div className="lg:col-span-6 lg:[direction:ltr]">
            <div className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-[#1A1513] sticky lg:top-24">
              <img src={day.image} alt={pick(day.title, lang)} loading="lazy"
                   className="ken-burns absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 via-transparent to-transparent" />
              <span className="film-grain" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-3 bg-[#FDFBF7]/95 backdrop-blur-sm px-4 py-2">
                <span className="font-serif-x text-xl leading-none" style={{ color: day.accent }}>
                  {t.day_label} {dayNum}
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 lg:[direction:ltr]">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase" style={{ color: day.accent }}>
              <span className="w-6 h-px" style={{ background: "currentColor" }} />
              {t.day_label} {dayNum}
            </span>
            <h3 className="font-serif-x text-3xl md:text-4xl lg:text-[42px] leading-[1.1] tracking-tight mt-5 text-[#2C2621]">
              {pick(day.title, lang)}
            </h3>
            <p className="mt-8 text-[15px] md:text-base text-[#5C5248] leading-[1.85]">
              {pick(day.body, lang)}
            </p>
            {day.wellness && (
              <div className="mt-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-3">{t.wellness_label}</p>
                <ul className="flex flex-wrap gap-2">
                  {day.wellness.map((w, i) => (
                    <li key={i} className="text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 border"
                        style={{ borderColor: `${day.accent}55`, color: day.accent }}>
                      {pick(w, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-4 inline-flex items-center gap-2">
                <Camera className="w-3 h-3" strokeWidth={1.6} style={{ color: day.accent }} />
                {t.culture_label}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {day.culture.map((c, i) => (
                  <div key={i} className="bg-[#F2EBE1] border-l-2 p-5" style={{ borderColor: day.accent }}>
                    <p className="font-serif-x text-base md:text-lg text-[#2C2621] leading-snug">
                      {pick(c.title, lang)}
                    </p>
                    <p className="mt-2 text-sm text-[#5C5248] leading-relaxed">
                      {pick(c.body, lang)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DayRouteMap day={day} idx={idx} total={total} accent={day.accent} />
      <DayGallery day={day} accent={day.accent} />
    </article>
  );
};

const Itinerary = ({ t, lang, days }) => (
  <section id="itinerary" data-testid="program-itinerary"
           className="relative bg-[#FDFBF7] pt-20 md:pt-28">
    <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center mb-12">
      <span className="overline">{t.itinerary_overline}</span>
      <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
        {t.itinerary_title}
      </h2>
    </div>
    {days.map((d, i) => (
      <DayBlock key={`${d.id}-${i}`} day={d} idx={i} total={days.length} lang={lang} t={t} />
    ))}
  </section>
);

const Pricing = ({ t, lang, program }) => (
  <section id="pricing" data-testid="program-pricing"
           className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
    <span className="film-grain" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
        <div className="md:col-span-7">
          <span className="overline text-[#D4A373]">{t.pricing_overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5">
            {t.pricing_title}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed">{t.pricing_body}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#FDFBF7]/10 border border-[#FDFBF7]/15">
        {SHARED_SEASONS.map((s) => (
          <div key={s.id} data-testid={`program-season-${s.id}`}
               className="bg-[#1A1513] hover:bg-[#221A16] transition-colors duration-300 p-6 md:p-7 flex flex-col gap-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]">{t.pricing_season}</span>
            <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.1]">{pick(s.label, lang)}</h3>
            <p className="text-sm text-[#FDFBF7]/65">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#FDFBF7]/45 block mb-1">{t.pricing_months}</span>
              {pick(s.months, lang)}
            </p>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4].map((lv) => (
                <span key={lv} className={`h-1 w-6 ${lv <= s.level ? "bg-[#C16542]" : "bg-[#FDFBF7]/15"}`} />
              ))}
            </div>
            <div className="mt-auto pt-5 border-t border-[#FDFBF7]/10">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#FDFBF7]/55">{t.pricing_from}</span>
              <p className="font-serif-x text-3xl text-[#FDFBF7] mt-1">€{program.prices[s.id].toLocaleString()}</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#FDFBF7]/55 mt-1">{t.pricing_per}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <a href="#contact" data-testid="program-pricing-cta"
           className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
          {t.pricing_cta}<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
        </a>
      </div>
    </div>
  </section>
);

const DetailsAccordion = ({ t, lang, program }) => {
  const [open, setOpen] = useState("includes");
  const tabs = [
    { id: "includes", label: t.tab_includes },
    { id: "excludes", label: t.tab_excludes },
    { id: "notes",    label: t.tab_notes },
    { id: "terms",    label: t.tab_terms },
  ];
  return (
    <section id="includes" data-testid="program-details"
             className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="overline">{t.details_overline}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
            {t.details_title}
          </h2>
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
                  <span className="font-serif-x text-lg md:text-xl text-[#2C2621]">{tab.label}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#C16542]" strokeWidth={1.6} /> : <ChevronDown className="w-4 h-4 text-[#5C5248]" strokeWidth={1.6} />}
                </button>
                {isOpen && (
                  <div className="px-6 md:px-8 pb-6 bg-[#FDFBF7]">
                    <ul className="space-y-3 text-[15px] text-[#5C5248] leading-relaxed">
                      {items.map((it, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C16542" }} />
                          <span>{it}</span>
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
        <span className="overline">{t.contact_overline}</span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
          {t.contact_title}
        </h2>
        <p className="mt-6 font-serif-x-italic text-xl md:text-2xl text-[#5C5248]">{t.contact_body}</p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
        <a href={`tel:${CONTACT.phoneRaw}`} data-testid="program-contact-phone"
           className="group bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#C16542]/40 p-6 md:p-7 transition-all duration-500">
          <span className="overline">{t.phone_label}</span>
          <p className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#2C2621] group-hover:text-[#C16542] transition-colors">
            <Phone className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} />{CONTACT.phone}
          </p>
        </a>
        <a href={`mailto:${CONTACT.email}`} data-testid="program-contact-email"
           className="group bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#C16542]/40 p-6 md:p-7 transition-all duration-500">
          <span className="overline">{t.email_label}</span>
          <p className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#2C2621] group-hover:text-[#C16542] transition-colors break-all">
            <Mail className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} />{CONTACT.email}
          </p>
        </a>
        <div className="bg-[#FDFBF7] border border-[#2C2621]/10 p-6 md:p-7">
          <span className="overline">{t.hours_label}</span>
          <p className="mt-3 flex items-center gap-3 font-serif-x text-xl text-[#2C2621]">
            <Calendar className="w-5 h-5 text-[#C16542]" strokeWidth={1.5} />{t.hours_value}
          </p>
        </div>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <a href="#form" data-testid="program-cta-budget"
           className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
          {t.cta_budget}<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
        </a>
        <Link to={pathFor(lang, "appointment")} data-testid="program-cta-appointment"
              className="inline-flex items-center gap-3 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300">
          <Calendar className="w-3.5 h-3.5" strokeWidth={1.6} />{t.cta_appointment}
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
      <ProgramHero vt={vt} t={t} program={program} lang={lang} />
      <StickyNav items={navItems} testid="program-nav" />
      {program.route && <TripRouteMap route={program.route} />}
      <Description vt={vt} t={t} />
      <QuickInfo t={t} vt={vt} program={program} lang={lang} variant={variant} />
      <Itinerary t={t} lang={lang} days={program.days} />
      <TripOverview days={program.days} />
      <Pricing t={t} lang={lang} program={program} />
      <DetailsAccordion t={t} lang={lang} program={program} />
      <ContactBand t={t} lang={lang} />
      <div id="form"><ContactForm /></div>
    </div>
  );
}
