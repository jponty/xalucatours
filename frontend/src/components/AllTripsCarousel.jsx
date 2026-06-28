import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { tripHeroSlot, tripHeroImage, tripTextSlot } from "@/lib/tripHero";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import TripCardActions from "@/components/TripCardActions";
import FromPrice from "@/components/FromPrice";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import xMonogram from "@/assets/monograma-x-white.png";

/* ============================================================
   AllTripsCarousel — quick-access rail with every concrete tour
   -------------------------------------------------------------
   Sits below the "Our Trips" categories section. Each card links
   directly to the program detail page.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  overline: T("Explora y compara", "Browse & compare", "Explorez et comparez"),
  title:    T("Desliza entre todas nuestras rutas", "Swipe through all our routes", "Faites défiler toutes nos routes"),
  body:     T(
    "Un vistazo rápido a cada viaje, con su precio orientativo y duración. Desliza el carrusel y abre la ficha que más te inspire.",
    "A quick glance at every trip, with its indicative price and length. Swipe the carousel and open the one that inspires you most.",
    "Un aperçu rapide de chaque voyage, avec son prix indicatif et sa durée. Faites défiler le carrousel et ouvrez la fiche qui vous inspire le plus.",
  ),
  cta:      T("Ver itinerario", "See itinerary", "Voir l'itinéraire"),
  prev:     T("Anterior", "Previous", "Précédent"),
  next:     T("Siguiente", "Next", "Suivant"),
};

const TAGS = {
  desert: T("Desierto", "Desert", "Désert"),
  atlas:  T("Atlas",    "Atlas",  "Atlas"),
  loop:   T("Marrakech",  "Marrakech",  "Marrakech"),
  imperial: T("Imperiales", "Imperial",  "Impériales"),
  north:    T("Norte",      "North",     "Nord"),
  full:     T("Travesía",   "Crossing",  "Traversée"),
  short:    T("Escapada",   "Short",     "Escapade"),
};

const IMG_DESERT = "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1400&q=85";
const IMG_KASBAH = "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1400&q=85";
const IMG_ATLAS  = "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1400&q=85";
const IMG_ZELL   = "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1400&q=85";
const IMG_MOS    = "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1400&q=85";
const IMG_ROCKY  = "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1400&q=85";

// Trip cards — each links to its program detail page.
const TRIPS = [
  // SUR — Atlas + Desierto
  { id: "ad-4-5", routeId: "tourAtlasDesierto45", nights: "4n / 5d", tag: "atlas",  accent: "#A07042", image: IMG_ATLAS,
    title: T("Atlas · Desierto · 4n/5d", "Atlas · Desert · 4n/5d", "Atlas · Désert · 4n/5j"),
    desc:  T("Cruza el Alto Atlas por Tizi n'Tichka hasta las dunas doradas del Erg Chebbi, con noche en jaima bajo las estrellas del Sáhara.", "Cross the High Atlas over Tizi n'Tichka to the golden dunes of Erg Chebbi, with a night in a desert camp under Saharan stars.", "Traversez le Haut Atlas par le Tizi n'Tichka jusqu'aux dunes dorées de l'Erg Chebbi, avec une nuit en bivouac sous les étoiles.") },
  { id: "ad-5-6", routeId: "tourAtlasDesierto56", nights: "5n / 6d", tag: "atlas",  accent: "#A07042", image: IMG_ATLAS,
    title: T("Atlas · Desierto · 5n/6d", "Atlas · Desert · 5n/6d", "Atlas · Désert · 5n/6j"),
    desc:  T("El gran clásico con una noche extra en el desierto y las espectaculares gargantas del Todra talladas en roca rojiza.", "The great classic with an extra desert night and the spectacular Todra Gorges carved into red rock.", "Le grand classique avec une nuit de plus au désert et les spectaculaires gorges du Todra taillées dans la roche rouge.") },
  { id: "ad-6-7", routeId: "tourAtlasDesierto67", nights: "6n / 7d", tag: "atlas",  accent: "#A07042", image: IMG_ATLAS,
    title: T("Atlas · Desierto · 6n/7d", "Atlas · Desert · 6n/7d", "Atlas · Désert · 6n/7j"),
    desc:  T("Versión amplia y sin prisas por el valle del Drâa, los palmerales de Skoura y las kasbahs de tierra del sur.", "A spacious, unhurried version through the Drâa Valley, Skoura's palm groves and the earthen kasbahs of the south.", "Version ample et sans hâte par la vallée du Drâa, les palmeraies de Skoura et les kasbahs de terre du sud.") },

  // SUR — Desierto + Atlas (sentido inverso)
  { id: "da-4-5", routeId: "tourDesiertoAtlas45", nights: "4n / 5d", tag: "desert", accent: "#C16542", image: IMG_DESERT,
    title: T("Desierto · Atlas · 4n/5d", "Desert · Atlas · 4n/5d", "Désert · Atlas · 4n/5j"),
    desc:  T("La ruta a la inversa: primero el silencio del Sáhara y, después, el regreso entre valles y cumbres del Alto Atlas.", "The reverse route: first the silence of the Sahara, then the return through the valleys and peaks of the High Atlas.", "L'itinéraire inversé : d'abord le silence du Sahara, puis le retour entre vallées et sommets du Haut Atlas.") },
  { id: "da-5-6", routeId: "tourDesiertoAtlas56", nights: "5n / 6d", tag: "desert", accent: "#C16542", image: IMG_DESERT,
    title: T("Desierto · Atlas · 5n/6d", "Desert · Atlas · 5n/6d", "Désert · Atlas · 5n/6j"),
    desc:  T("Sáhara primero, con una noche extra en bivouac premium frente a las dunas, y vuelta panorámica por el Atlas.", "Sahara first, with an extra night in a premium bivouac facing the dunes, and a scenic return across the Atlas.", "Sahara d'abord, avec une nuit en bivouac premium face aux dunes, et retour panoramique par l'Atlas.") },
  { id: "da-6-7", routeId: "tourDesiertoAtlas67", nights: "6n / 7d", tag: "desert", accent: "#C16542", image: IMG_DESERT,
    title: T("Desierto · Atlas · 6n/7d", "Desert · Atlas · 6n/7d", "Désert · Atlas · 6n/7j"),
    desc:  T("La travesía completa en sentido inverso: dunas, gargantas del Todra y Dadès, valles y kasbahs sin dejarte nada.", "The full crossing in reverse: dunes, the Todra and Dadès gorges, valleys and kasbahs — nothing left out.", "La traversée complète en sens inverse : dunes, gorges du Todra et du Dadès, vallées et kasbahs.") },

  // NORTE
  { id: "ci-4-5",   routeId: "tourCiudadesImperiales45",    nights: "4n / 5d", tag: "imperial", accent: "#D97742", image: IMG_ZELL,
    title: T("Ciudades imperiales · 4n/5d", "Imperial cities · 4n/5d", "Cités impériales · 4n/5j"),
    desc:  T("Las cuatro ciudades imperiales en un solo viaje: Casablanca, Rabat, Meknès y la milenaria medina de Fez.", "The four imperial cities in a single trip: Casablanca, Rabat, Meknès and the millennial medina of Fez.", "Les quatre cités impériales en un seul voyage : Casablanca, Rabat, Meknès et la médina millénaire de Fès.") },
  { id: "cirf-6-7", routeId: "tourCiudadesImperialesRif67", nights: "6n / 7d", tag: "imperial", accent: "#D97742", image: IMG_MOS,
    title: T("Imperiales + Rif · 6n/7d", "Imperial + Rif · 6n/7d", "Impériales + Rif · 6n/7j"),
    desc:  T("Del Mediterráneo al desierto: Tánger, la mágica Chefchaouen, Fez y Marrakech enlazadas en una gran ruta.", "From the Mediterranean to the desert: Tangier, magical Chefchaouen, Fez and Marrakech linked in one grand route.", "De la Méditerranée au désert : Tanger, la magique Chefchaouen, Fès et Marrakech reliées en une grande route.") },
  { id: "tf-4-5", routeId: "tourTangerFez45", nights: "4n / 5d", tag: "north", accent: "#5A7F9C", image: IMG_MOS,
    title: T("Tánger – Fez · 4n/5d", "Tangier – Fez · 4n/5d", "Tanger – Fès · 4n/5j"),
    desc:  T("Costa mediterránea, montañas del Rif y la azul Chefchaouen camino de las ciudades imperiales del norte.", "Mediterranean coast, the Rif mountains and blue Chefchaouen on the way to the northern imperial cities.", "Côte méditerranéenne, montagnes du Rif et la bleue Chefchaouen vers les cités impériales du nord.") },
  { id: "tf-5-6", routeId: "tourTangerFez56", nights: "5n / 6d", tag: "north", accent: "#5A7F9C", image: IMG_KASBAH,
    title: T("Tánger – Asilah – Fez · 5n/6d", "Tangier – Asilah – Fez · 5n/6d", "Tanger – Asilah – Fès · 5n/6j"),
    desc:  T("Las murallas portuguesas de Asilah, el Rif y Chefchaouen antes de adentrarte en la histórica Fez.", "Asilah's Portuguese ramparts, the Rif and Chefchaouen before diving into historic Fez.", "Les remparts portugais d'Asilah, le Rif et Chefchaouen avant de plonger dans Fès l'historique.") },
  { id: "ft-5-6", routeId: "tourFezTanger56", nights: "5n / 6d", tag: "north", accent: "#3A4A5F", image: IMG_ZELL,
    title: T("Fez – Tánger · 5n/6d", "Fez – Tangier · 5n/6d", "Fès – Tanger · 5n/6j"),
    desc:  T("De la medina más antigua del mundo árabe hasta el Mediterráneo, pasando por Chefchaouen y el Rif.", "From the oldest medina in the Arab world to the Mediterranean, via Chefchaouen and the Rif.", "De la plus ancienne médina du monde arabe à la Méditerranée, en passant par Chefchaouen et le Rif.") },
  { id: "ft-6-7", routeId: "tourFezTanger67", nights: "6n / 7d", tag: "north", accent: "#3A4A5F", image: IMG_ZELL,
    title: T("Fez – Asilah – Tánger · 6n/7d", "Fez – Asilah – Tangier · 6n/7d", "Fès – Asilah – Tanger · 6n/7j"),
    desc:  T("Norte cultural y costa atlántica: Fez, Volubilis, Chefchaouen y las playas blancas de Asilah.", "Cultural north and Atlantic coast: Fez, Volubilis, Chefchaouen and the white beaches of Asilah.", "Nord culturel et côte atlantique : Fès, Volubilis, Chefchaouen et les plages blanches d'Asilah.") },

  // FULL — Fez–Marrakech
  { id: "fr-6-7", routeId: "tourMarrakechFez67", nights: "6n / 7d", tag: "full", accent: "#C16542", image: IMG_DESERT,
    title: T("Marrakech – Fez · 6n/7d", "Marrakech – Fez · 6n/7d", "Marrakech – Fès · 6n/7j"),
    desc:  T("La travesía clásica de norte a sur: dos ciudades imperiales unidas por el Atlas y las puertas del desierto.", "The classic north-south crossing: two imperial cities linked by the Atlas and the gateway to the desert.", "La traversée classique nord-sud : deux cités impériales reliées par l'Atlas et les portes du désert.") },
  { id: "fr-7-8", routeId: "tourMarrakechFez78", nights: "7n / 8d", tag: "full", accent: "#C16542", image: IMG_DESERT,
    title: T("Marrakech – Fez · 7n/8d", "Marrakech – Fez · 7n/8d", "Marrakech – Fès · 7n/8j"),
    desc:  T("La gran travesía con una noche extra en el Sáhara para vivir el amanecer sobre las dunas sin prisas.", "The grand crossing with an extra Sahara night to savour sunrise over the dunes, unhurried.", "La grande traversée avec une nuit de plus au Sahara pour savourer le lever du soleil sur les dunes.") },
  { id: "fr-8-9", routeId: "tourMarrakechFez89", nights: "8n / 9d", tag: "full", accent: "#C16542", image: IMG_KASBAH,
    title: T("Marrakech – Fez · 8n/9d", "Marrakech – Fez · 8n/9d", "Marrakech – Fès · 8n/9j"),
    desc:  T("Ruta extendida entre Marrakech y Fez con Skoura, palmerales y kasbahs, para descubrir el sur en profundidad.", "Extended Marrakech-to-Fez route with Skoura, palm groves and kasbahs, exploring the south in depth.", "Itinéraire étendu de Marrakech à Fès avec Skoura, palmeraies et kasbahs, pour explorer le sud en profondeur.") },
  { id: "fr-9-10", routeId: "tourMarrakechFez910", nights: "9n / 10d", tag: "full", accent: "#C16542", image: IMG_KASBAH,
    title: T("Marrakech – Fez · 9n/10d", "Marrakech – Fez · 9n/10d", "Marrakech – Fès · 9n/10j"),
    desc:  T("La versión más amplia y pausada: Marruecos de punta a punta, con tiempo para cada valle, ciudad y duna.", "The most spacious, leisurely version: Morocco end to end, with time for every valley, city and dune.", "La version la plus ample et tranquille : le Maroc de bout en bout, avec le temps pour chaque vallée, ville et dune.") },

  // ESCAPADAS
  { id: "esc-des", routeId: "tourEscapadaDesierto34", nights: "3n / 4d", tag: "short", accent: "#A07042", image: IMG_DESERT,
    title: T("Escapada · Sáhara", "Escape · Sahara", "Escapade · Sahara"),
    desc:  T("Tres días para escaparte al Erg Chebbi: dunas infinitas, paseo en dromedario y noche mágica en campamento.", "Three days to escape to Erg Chebbi: endless dunes, a camel ride and a magical night at camp.", "Trois jours pour s'évader à l'Erg Chebbi : dunes infinies, balade à dromadaire et nuit magique au campement.") },
  { id: "esc-atl", routeId: "tourEscapadaAtlas34", nights: "3n / 4d", tag: "short", accent: "#5A6B4F", image: IMG_ATLAS,
    title: T("Escapada · Alto Atlas", "Escape · High Atlas", "Escapade · Haut Atlas"),
    desc:  T("Trekking suave entre pueblos bereberes, valles verdes y cumbres nevadas, a un paso de Marrakech.", "Gentle trekking through Berber villages, green valleys and snow-capped peaks, a step from Marrakech.", "Trekking doux entre villages berbères, vallées verdoyantes et sommets enneigés, à deux pas de Marrakech.") },
  { id: "esc-fez", routeId: "tourEscapadaFez", nights: "2n / 3d", tag: "short", accent: "#C16542", image: IMG_ZELL,
    title: T("Escapada · Fez", "Escape · Fez", "Escapade · Fès"),
    desc:  T("Piérdete en la medina más antigua del mundo árabe: zocos, curtidurías y arte andalusí en estado puro.", "Lose yourself in the oldest medina in the Arab world: souks, tanneries and pure Andalusian art.", "Perdez-vous dans la plus ancienne médina du monde arabe : souks, tanneries et art andalou à l'état pur.") },
  { id: "esc-mrk", routeId: "tourEscapadaMarrakech", nights: "2n / 3d", tag: "short", accent: "#D97742", image: IMG_MOS,
    title: T("Escapada · Marrakech", "Escape · Marrakech", "Escapade · Marrakech"),
    desc:  T("La ciudad roja en estado puro: Jemaa el-Fna, palacios, jardines y el laberinto de zocos de la medina.", "The red city at its purest: Jemaa el-Fna, palaces, gardens and the labyrinth of medina souks.", "La ville rouge à l'état pur : Jemaa el-Fna, palais, jardins et le labyrinthe des souks de la médina.") },
  { id: "esc-tng", routeId: "tourEscapadaTanger", nights: "2n / 3d", tag: "short", accent: "#3A4A5F", image: IMG_ROCKY,
    title: T("Escapada · Tánger", "Escape · Tangier", "Escapade · Tanger"),
    desc:  T("Cabo Espartel, la azul Chefchaouen y la elegante Tetuán: el norte más cosmopolita en una escapada.", "Cape Spartel, blue Chefchaouen and elegant Tetouan: the most cosmopolitan north in one short escape.", "Cap Spartel, la bleue Chefchaouen et l'élégante Tétouan : le nord le plus cosmopolite en une escapade.") },
];

/* ============================================================ */
export default function AllTripsCarousel() {
  const { lang } = useLanguage();
  const railRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const rail = railRef.current;
    if (!rail) return;
    setCanPrev(rail.scrollLeft > 8);
    setCanNext(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 8);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    updateArrows();
    rail.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      rail.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: rail.clientWidth * 0.85 * (dir === "next" ? 1 : -1), behavior: "smooth" });
  };

  return (
    <section
      id="all-trips"
      data-testid="all-trips-carousel"
      className="relative bg-[#FBF5EA] text-[#2C2621] py-20 md:py-28 overflow-hidden border-t border-[#2C2621]/5"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end mb-12 md:mb-16">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#A07042]">
              <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
              <EditableText slot="home.alltrips.overline" defaults={COPY.overline} multiline={false} />
              <span className="w-10 h-px bg-[#A07042]/40" />
            </span>
            <EditableText as="h2" slot="home.alltrips.title" defaults={COPY.title}
              className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mt-5 text-[#2C2621] block" />
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <EditableText as="p" slot="home.alltrips.body" defaults={COPY.body}
              className="text-base text-[#5C5248] leading-relaxed lg:max-w-sm lg:ml-auto block" />
            <div className="mt-6 flex items-center gap-3 lg:justify-end">
              <button
                type="button"
                onClick={() => scrollBy("prev")}
                aria-label={pick(COPY.prev, lang)}
                data-testid="all-trips-prev"
                data-edit-allow="true"
                disabled={!canPrev}
                className="inline-flex items-center justify-center w-11 h-11 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#2C2621]"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy("next")}
                aria-label={pick(COPY.next, lang)}
                data-testid="all-trips-next"
                data-edit-allow="true"
                disabled={!canNext}
                className="inline-flex items-center justify-center w-11 h-11 border border-[#2C2621]/25 hover:border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#2C2621]"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          data-testid="all-trips-rail"
          className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-6 md:-mx-12 px-6 md:px-12 no-scrollbar"
        >
          {TRIPS.map((trip) => (
            <div
              key={trip.id}
              data-testid={`all-trips-card-${trip.id}`}
              className="group relative shrink-0 w-[78vw] sm:w-[320px] md:w-[340px] snap-start bg-white border border-[#2C2621]/8 hover:border-[#2C2621]/30 transition-colors flex flex-col"
            >
              <Link
                to={pathFor(lang, trip.routeId)}
                data-testid={`all-trips-link-${trip.id}`}
                className="block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#1A1513]">
                  <EditableImage
                    slot={tripHeroSlot(trip.routeId)}
                    fallback={tripHeroImage(trip.routeId) || trip.image}
                    alt={pick(trip.title, lang)}
                    imgProps={{ loading: "lazy" }}
                    aspectRatio="4/5"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/90 via-[#1A1513]/30 to-[#1A1513]/8" />
                  <span className="film-grain opacity-40" aria-hidden="true" />
                  <XalucaLogoBadge testid={`all-trips-logo-${trip.id}`} />

                  <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-2.5 py-1 text-[9px] tracking-[0.3em] uppercase text-[#FDFBF7] text-on-image"
                    style={{ background: `${trip.accent}f0` }}>
                    <EditableText
                      slot={tripTextSlot(trip.routeId, "tag")}
                      defaults={TAGS[trip.tag]}
                      as="span"
                      multiline={false}
                    />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/80 mb-2 text-on-image">
                      <EditableText
                        slot={tripTextSlot(trip.routeId, "duration")}
                        defaults={{ es: trip.nights, en: trip.nights, fr: trip.nights }}
                        as="span"
                        multiline={false}
                        noTranslate
                      />
                    </span>
                    <EditableText
                      as="h3"
                      slot={tripTextSlot(trip.routeId, "title")}
                      defaults={trip.title}
                      multiline={false}
                      className="font-serif-x text-[#FDFBF7] text-on-image text-xl md:text-[22px] leading-[1.15] tracking-tight pr-12 block"
                    />
                  </div>

                  {/* Xaluca "X" monogram — bottom-right of each image */}
                  <img
                    src={xMonogram}
                    alt=""
                    aria-hidden="true"
                    data-testid={`all-trips-monogram-${trip.id}`}
                    className="pointer-events-none select-none absolute bottom-3 right-3 w-9 h-9 md:w-10 md:h-10 object-contain opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] z-[3]"
                  />
                </div>

                <div className="px-5 pt-5">
                  <EditableText
                    as="p"
                    slot={tripTextSlot(trip.routeId, "summary")}
                    defaults={trip.desc}
                    className="text-[13px] text-[#5C5248] leading-[1.7] min-h-[4.4em] block"
                  />
                  <div className="mt-4">
                    <FromPrice tone="dark" size="md" routeId={trip.routeId} testid={`all-trips-from-${trip.id}`} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#2C2621]/10">
                    <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#A07042] group-hover:text-[#C16542] transition-colors">
                      <EditableText
                        slot="home.alltrips.card_cta"
                        defaults={COPY.cta}
                        as="span"
                        multiline={false}
                      />
                      <ArrowUpRight
                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                </div>
              </Link>

              <div className="px-5 pb-5 pt-4 mt-auto">
                <TripCardActions lang={lang} routeId={trip.routeId} testidBase={`all-trips-${trip.id}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
