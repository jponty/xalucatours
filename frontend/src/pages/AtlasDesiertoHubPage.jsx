import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import {
  JourneyHero,
  StickyNav,
  EditorialBlock,
  CommunityCta,
} from "@/components/JourneyPageSections";
import ContactForm from "@/components/ContactForm";
import EditableImage from "@/components/EditableImage";
import { tripHeroSlot, tripHeroImage, usesTripMaster } from "@/lib/tripHero";

/* ============================================================
   Six combined Atlas + Desert programmes — with route stages
   and per-duration descriptions so travellers can pick faster.
============================================================ */
const PROGRAMS = [
  {
    id: "ad-4-5", routeId: "tourAtlasDesierto45", direction: "ad", nights: "4n / 5d",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
    accent: "#5A6B4F",
    stages: ["Ouarzazate", "Alto Atlas", "Tinghir", "Erg Chebbi", "Errachidia"],
    blurb: {
      es: "La versión más esencial: el Alto Atlas, las gargantas del Todra y una noche en el desierto. Ideal para escapadas cortas.",
      en: "The most essential version: the High Atlas, the Todra gorges and one night in the desert. Ideal for short escapes.",
      fr: "La version la plus essentielle : le Haut Atlas, les gorges du Todra et une nuit au désert. Idéal pour les escapades courtes.",
    },
    nights_count: 1, has_dades: false,
  },
  {
    id: "ad-5-6", routeId: "tourAtlasDesierto56", direction: "ad", nights: "5n / 6d",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
    accent: "#7C8B5C",
    stages: ["Ouarzazate", "Alto Atlas", "Gargantas Dades", "Tinghir", "Erg Chebbi", "Errachidia"],
    blurb: {
      es: "Añade las gargantas del Dades y una segunda noche en el desierto — más tiempo en cada paisaje y un ritmo más sereno.",
      en: "Adds the Dades gorges and a second night in the desert — more time in every landscape and a calmer pace.",
      fr: "Ajoute les gorges du Dadès et une deuxième nuit au désert — plus de temps dans chaque paysage, un rythme plus serein.",
    },
    nights_count: 2, has_dades: true,
  },
  {
    id: "ad-6-7", routeId: "tourAtlasDesierto67", direction: "ad", nights: "6n / 7d",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1800&q=85",
    accent: "#A07042",
    stages: ["Ouarzazate", "Aït Benhaddou", "Alto Atlas", "Gargantas Dades", "Tinghir", "Erg Chebbi", "Errachidia"],
    blurb: {
      es: "La travesía completa: incorpora Aït Benhaddou (kasbah UNESCO) y permite un día entero en el desierto del Erg Chebbi.",
      en: "The full crossing: adds Aït Benhaddou (UNESCO kasbah) and allows a full day in the Erg Chebbi desert.",
      fr: "La traversée complète : ajoute Aït Benhaddou (kasbah UNESCO) et permet une journée entière dans l'Erg Chebbi.",
    },
    nights_count: 2, has_dades: true,
  },
  {
    id: "da-4-5", routeId: "tourDesiertoAtlas45", direction: "da", nights: "4n / 5d",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1800&q=85",
    accent: "#C16542",
    stages: ["Errachidia", "Erg Chebbi", "Tinghir", "Alto Atlas", "Ouarzazate"],
    blurb: {
      es: "La ruta clásica empezando por el desierto: noche en las dunas, gargantas del Todra y descenso por el Atlas hasta Ouarzazate.",
      en: "The classic route starting in the desert: night in the dunes, Todra gorges and descent through the Atlas to Ouarzazate.",
      fr: "L'itinéraire classique en commençant par le désert : nuit dans les dunes, gorges du Todra et descente par l'Atlas jusqu'à Ouarzazate.",
    },
    nights_count: 1, has_dades: false,
  },
  {
    id: "da-5-6", routeId: "tourDesiertoAtlas56", direction: "da", nights: "5n / 6d",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1800&q=85",
    accent: "#D97742",
    stages: ["Errachidia", "Erg Chebbi", "Tinghir", "Gargantas Dades", "Alto Atlas", "Ouarzazate"],
    blurb: {
      es: "Dos noches en el desierto, gargantas del Todra y del Dades, y la ruta de las mil kasbahs a la bajada del Atlas.",
      en: "Two nights in the desert, the Todra and Dades gorges, and the route of a thousand kasbahs as you descend the Atlas.",
      fr: "Deux nuits au désert, gorges du Todra et du Dadès, et la route des mille kasbahs en descendant l'Atlas.",
    },
    nights_count: 2, has_dades: true,
  },
  {
    id: "da-6-7", routeId: "tourDesiertoAtlas67", direction: "da", nights: "6n / 7d",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=85",
    accent: "#D4A373",
    stages: ["Errachidia", "Erg Chebbi", "Tinghir", "Gargantas Dades", "Alto Atlas", "Aït Benhaddou", "Ouarzazate"],
    blurb: {
      es: "La travesía completa partiendo del desierto: dos noches en las dunas, kasbah UNESCO de Aït Benhaddou y travesía total del Atlas.",
      en: "The full crossing starting from the desert: two nights in the dunes, the UNESCO kasbah of Aït Benhaddou and a full Atlas traverse.",
      fr: "La traversée complète depuis le désert : deux nuits dans les dunes, kasbah UNESCO d'Aït Benhaddou et traversée intégrale de l'Atlas.",
    },
    nights_count: 2, has_dades: true,
  },
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
    nav: { intro: "Atlas & Desierto", options: "Opciones", compare: "Cómo elegir", draa: "Drâa-Tafilalet", spirit: "Naturaleza", community: "Contacto" },
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
      body: "Seis programas diseñados según los días disponibles y la dirección preferida. Cuanto más larga sea la ruta, más etapas e historia descubrirás.",
      cta: "Ver programa completo",
      group_ad: { es: "Atlas + Desierto", en: "Atlas + Desert", fr: "Atlas + Désert" },
      group_da: { es: "Desierto + Atlas", en: "Desert + Atlas", fr: "Désert + Atlas" },
      group_ad_body: "Empezamos en Ouarzazate y cruzamos el Alto Atlas hasta dormir en las dunas del Erg Chebbi. Acabamos en Errachidia para regresar fácilmente en avión.",
      group_da_body: "Empezamos en Errachidia, dormimos directamente en el desierto y bajamos por los oasis hasta Ouarzazate. Ideal si llegas en vuelo a Errachidia.",
      nights_label: "noche(s) en el desierto",
      route_label: "Recorrido",
      direction_label: "Dirección",
    },
    compare: {
      overline: "Cómo elegir tu ruta",
      title: "Tres preguntas para decidirte.",
      items: [
        { q: "¿Cuántos días tengo?", a: "4 noches para una escapada exprés · 5 noches para un ritmo más relajado · 6 noches para la travesía más completa con Aït Benhaddou (kasbah UNESCO)." },
        { q: "¿En qué dirección viajo?", a: "Si llegas a Marrakech, empieza desde Ouarzazate (Atlas + Desierto). Si llegas a Errachidia, empieza por el desierto (Desierto + Atlas). Ambas direcciones recorren el mismo paisaje, sólo cambia el orden." },
        { q: "¿Cuántas noches en el desierto?", a: "Las opciones de 4 noches incluyen 1 noche en bivouac de lujo entre las dunas. Las opciones de 5 y 6 noches incluyen 2 noches en el desierto — mucho más recomendado para vivir el amanecer en las dunas." },
      ],
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
    nav: { intro: "Atlas & Desert", options: "Options", compare: "How to choose", draa: "Drâa-Tafilalet", spirit: "Nature", community: "Contact" },
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
      body: "Six programmes designed for your available days and preferred direction. The longer the route, the more stages and history you'll uncover.",
      cta: "See full programme",
      group_ad: { es: "Atlas + Desierto", en: "Atlas + Desert", fr: "Atlas + Désert" },
      group_da: { es: "Desierto + Atlas", en: "Desert + Atlas", fr: "Désert + Atlas" },
      group_ad_body: "We start in Ouarzazate and cross the High Atlas to sleep in the Erg Chebbi dunes. We finish in Errachidia for an easy flight home.",
      group_da_body: "We start in Errachidia, sleep straight in the desert and descend through the oases to Ouarzazate. Ideal if you fly into Errachidia.",
      nights_label: "night(s) in the desert",
      route_label: "Route",
      direction_label: "Direction",
    },
    compare: {
      overline: "How to choose your route",
      title: "Three questions to decide.",
      items: [
        { q: "How many days do I have?", a: "4 nights for a quick getaway · 5 nights for a more relaxed pace · 6 nights for the most complete crossing including Aït Benhaddou (UNESCO kasbah)." },
        { q: "Which direction should I travel?", a: "Flying into Marrakech? Start from Ouarzazate (Atlas + Desert). Flying into Errachidia? Start from the desert (Desert + Atlas). Both directions cross the same landscapes — only the order changes." },
        { q: "How many nights in the desert?", a: "4-night options include 1 night in a luxury bivouac among the dunes. 5- and 6-night options include 2 nights in the desert — strongly recommended to truly live the sunrise on the dunes." },
      ],
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
    nav: { intro: "Atlas & Désert", options: "Options", compare: "Comment choisir", draa: "Drâa-Tafilalet", spirit: "Nature", community: "Contact" },
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
      body: "Six programmes conçus selon vos jours disponibles et la direction préférée. Plus l'itinéraire est long, plus d'étapes et d'histoire vous découvrirez.",
      cta: "Voir le programme complet",
      group_ad: { es: "Atlas + Desierto", en: "Atlas + Desert", fr: "Atlas + Désert" },
      group_da: { es: "Desierto + Atlas", en: "Desert + Atlas", fr: "Désert + Atlas" },
      group_ad_body: "Nous partons d'Ouarzazate et traversons le Haut Atlas pour dormir dans les dunes de l'Erg Chebbi. Fin du voyage à Errachidia pour repartir facilement en avion.",
      group_da_body: "Nous partons d'Errachidia, dormons directement au désert et descendons par les oasis jusqu'à Ouarzazate. Idéal si vous arrivez en vol à Errachidia.",
      nights_label: "nuit(s) au désert",
      route_label: "Parcours",
      direction_label: "Direction",
    },
    compare: {
      overline: "Comment choisir votre itinéraire",
      title: "Trois questions pour décider.",
      items: [
        { q: "Combien de jours j'ai ?", a: "4 nuits pour une escapade rapide · 5 nuits pour un rythme plus détendu · 6 nuits pour la traversée la plus complète incluant Aït Benhaddou (kasbah UNESCO)." },
        { q: "Dans quel sens voyager ?", a: "Vous arrivez à Marrakech ? Commencez par Ouarzazate (Atlas + Désert). Vous arrivez à Errachidia ? Commencez par le désert (Désert + Atlas). Les deux directions parcourent les mêmes paysages — seul l'ordre change." },
        { q: "Combien de nuits au désert ?", a: "Les options 4 nuits incluent 1 nuit en bivouac de luxe parmi les dunes. Les options 5 et 6 nuits incluent 2 nuits au désert — fortement recommandé pour vivre pleinement le lever du soleil sur les dunes." },
      ],
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
   Programmes grid section — richer cards with stages + blurb
============================================================ */
const ProgramsGrid = ({ t, lang }) => {
  const groups = [
    { id: "ad", label: pick(t.group_ad, lang), body: t.group_ad_body, items: PROGRAMS.filter((p) => p.direction === "ad") },
    { id: "da", label: pick(t.group_da, lang), body: t.group_da_body, items: PROGRAMS.filter((p) => p.direction === "da") },
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
          <div key={g.id} className="mb-16 last:mb-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-8 items-start">
              <div className="md:col-span-5">
                <span className="overline">{t.direction_label}</span>
                <h3 className="font-serif-x text-3xl md:text-4xl text-[#2C2621] mt-3 leading-[1.1]">{g.label}</h3>
              </div>
              <div className="md:col-span-7">
                <p className="text-[15px] md:text-base text-[#5C5248] leading-[1.85]">{g.body}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {g.items.map((p) => (
                <Link
                  key={p.id}
                  to={pathFor(lang, p.routeId)}
                  data-testid={`hub-program-${p.id}`}
                  className="group relative flex flex-col bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#2C2621]/25 overflow-hidden transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <EditableImage
                      slot={usesTripMaster(p.routeId) ? tripHeroSlot(p.routeId) : `hub.atlasdesierto.program.${p.id}`}
                      fallback={(usesTripMaster(p.routeId) && tripHeroImage(p.routeId)) || p.image}
                      alt=""
                      aspectRatio="4/3"
                      imgProps={{ loading: "lazy" }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/20 to-transparent pointer-events-none" />
                    <span className="film-grain" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#FDFBF7]/95 px-3 py-1.5">
                      <Clock className="w-3.5 h-3.5" style={{ color: p.accent }} strokeWidth={1.6} />
                      <span className="font-serif-x text-base text-[#2C2621]">{pick(DURATIONS[p.nights], lang)}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#FDFBF7]/90">
                      <span className="inline-flex items-center gap-1.5 bg-[#1A1513]/55 backdrop-blur-sm px-2.5 py-1">
                        {p.nights_count} {t.nights_label}
                      </span>
                      {p.has_dades && (
                        <span className="inline-flex items-center gap-1.5 bg-[#1A1513]/55 backdrop-blur-sm px-2.5 py-1">Dades</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-5 md:p-6 flex flex-col">
                    <span className="overline" style={{ color: p.accent }}>{t.route_label}</span>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {p.stages.map((s, i) => (
                        <li key={pick(s, "es") + i} className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase px-2 py-1 border" style={{ borderColor: `${p.accent}40`, color: "#2C2621" }}>
                          <MapPin className="w-2.5 h-2.5" style={{ color: p.accent }} strokeWidth={1.8} />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[14px] text-[#5C5248] leading-[1.65] flex-1">
                      {pick(p.blurb, lang)}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-semibold group-hover:gap-4 transition-all duration-300" style={{ color: p.accent }}>
                      {t.cta}<ArrowRight className="w-3 h-3" strokeWidth={1.8} />
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
   CompareSection — Q&A "Cómo elegir tu ruta"
============================================================ */
const CompareSection = ({ t }) => (
  <section id="compare" data-testid="atlas-desierto-hub-compare"
           className="relative bg-[#F2EBE1] py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 berber-bg-cross opacity-25 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-5xl mx-auto px-6 md:px-12">
      <div className="text-center mb-14">
        <span className="overline">{t.overline}</span>
        <h2 className="font-serif-x text-4xl md:text-5xl lg:text-[54px] leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
          {t.title}
        </h2>
      </div>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2C2621]/10 border border-[#2C2621]/10">
        {t.items.map((item, i) => (
          <li key={item.title || `item-${i}`} className="bg-[#FDFBF7] p-7 md:p-8 flex flex-col gap-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373] font-semibold">0{i + 1}</span>
            <h3 className="font-serif-x text-[22px] md:text-2xl text-[#2C2621] leading-[1.2]">{item.q}</h3>
            <p className="text-[14px] md:text-[15px] text-[#5C5248] leading-[1.75]">{item.a}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

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
          <li key={tag} className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 border border-[#D4A373]/50 text-[#D4A373]">
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
    { id: "compare",  label: t.nav.compare },
    { id: "draa",     label: t.nav.draa },
    { id: "spirit",   label: t.nav.spirit },
    { id: "community",label: t.nav.community },
  ];

  return (
    <div data-testid="atlas-desierto-hub-page">
      <JourneyHero
        image="https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=2400&q=85"
        eyebrow={t.hero.eyebrow}
        place={t.hero.place}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        intro={t.hero.intro}
        primaryCta={t.hero.primaryCta}
        primaryHref="#options"
        secondaryCta={t.hero.secondaryCta}
        secondaryHref={pathFor(lang, "appointment")}
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
              <p key={`intro-${i}`} className={i === 0 ? "font-serif-x-italic text-xl md:text-2xl text-[#C16542]" : ""}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <ProgramsGrid t={t.options} lang={lang} />

      <CompareSection t={t.compare} />

      <EditorialBlock block={DRAA_BLOCK} lang={lang} />

      <SpiritSection t={t.spirit} />

      <CommunityCta
        t={t.community}
        lang={lang}
        image="https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=2400&q=85"
        testid="hub-community"
      />

      <ContactForm />
    </div>
  );
}
