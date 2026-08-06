import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleMarker, MapContainer, Polyline, Tooltip, useMap } from "react-leaflet";
import {
  ArrowLeft, ArrowRight, Compass, ExternalLink, Film, MapPin, Play,
  Route, Sparkles,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { IMG } from "@/lib/imageBank";
import Img from "@/components/Img";
import MapBaseLayers from "@/components/MapBaseLayers";
import MapLogoBadge from "@/components/MapLogoBadge";
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from "@/components/ui/dialog";

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  eyebrow: T("Experiencia virtual · Sur de Marruecos", "Virtual experience · Southern Morocco", "Expérience virtuelle · Sud du Maroc"),
  title: T("Recorre el sur antes de viajar.", "Travel through the south before you leave.", "Parcourez le sud avant de partir."),
  body: T(
    "Un viaje interactivo por ciudades, montañas, kasbahs, valles y desierto. Explora cada etapa desde el mapa y descubre sus imágenes, historias y lugares imprescindibles.",
    "An interactive journey through cities, mountains, kasbahs, valleys and desert. Explore every stage on the map and discover its images, stories and essential landmarks.",
    "Un voyage interactif entre villes, montagnes, kasbahs, vallées et désert. Explorez chaque étape sur la carte et découvrez ses images, ses histoires et ses lieux incontournables.",
  ),
  open: T("Iniciar experiencia virtual", "Start the virtual experience", "Commencer l’expérience virtuelle"),
  preview: T("6 etapas · mapa · imágenes · vídeos", "6 stages · map · images · films", "6 étapes · carte · images · vidéos"),
  modalTitle: T("El sur de Marruecos, etapa a etapa", "Southern Morocco, stage by stage", "Le sud du Maroc, étape par étape"),
  modalDescription: T("Selecciona una etapa o utiliza los controles para recorrer el territorio.", "Select a stage or use the controls to travel through the territory.", "Sélectionnez une étape ou utilisez les commandes pour parcourir le territoire."),
  stage: T("Etapa", "Stage", "Étape"),
  map: T("Mapa del recorrido", "Journey map", "Carte du parcours"),
  landmarks: T("Puntos de interés", "Points of interest", "Points d’intérêt"),
  fact: T("Un dato para viajar", "A travel insight", "Un repère pour voyager"),
  film: T("Ver esta etapa en vídeo", "Watch this stage on film", "Voir cette étape en vidéo"),
  hideFilm: T("Cerrar vídeo", "Close film", "Fermer la vidéo"),
  related: T("Explorar viajes relacionados", "Explore related journeys", "Explorer les voyages associés"),
  recommendations: T("Viajes que conectan con esta etapa", "Journeys connected to this stage", "Voyages liés à cette étape"),
  recommendationsBody: T("Dos propuestas para continuar descubriendo este territorio.", "Two ideas for continuing to explore this territory.", "Deux idées pour poursuivre la découverte de ce territoire."),
  viewTrip: T("Ver viaje", "View journey", "Voir le voyage"),
  proposal: T("Solicitar propuesta personalizada", "Request a personalised proposal", "Demander une proposition personnalisée"),
  previous: T("Etapa anterior", "Previous stage", "Étape précédente"),
  next: T("Siguiente etapa", "Next stage", "Étape suivante"),
  close: T("Cerrar experiencia virtual", "Close virtual experience", "Fermer l’expérience virtuelle"),
};

const STAGES = [
  {
    id: "marrakech",
    name: T("Marrakech", "Marrakech", "Marrakech"),
    kicker: T("La puerta del sur", "Gateway to the south", "La porte du sud"),
    coords: [31.6295, -7.9811], zoom: 10, route: "tourEscapadaMarrakech", video: "WGoSnw5Y3nE",
    intro: T("La ciudad roja abre el recorrido entre jardines, palacios, zocos y la energía inagotable de Jemaa el-Fna.", "The red city opens the journey with gardens, palaces, souks and the boundless energy of Jemaa el-Fna.", "La ville rouge ouvre le voyage entre jardins, palais, souks et l’énergie inépuisable de Jemaa el-Fna."),
    interests: [T("Medina y Jemaa el-Fna", "Medina and Jemaa el-Fna", "Médina et Jemaa el-Fna"), T("Palacio de la Bahía", "Bahia Palace", "Palais de la Bahia"), T("Jardín Majorelle", "Majorelle Garden", "Jardin Majorelle")],
    fact: T("La medina histórica es Patrimonio Mundial y funciona como un gran museo vivo.", "The historic medina is a World Heritage Site and feels like a vast living museum.", "La médina historique est inscrite au patrimoine mondial et fonctionne comme un immense musée vivant."),
    images: [IMG.koutoubia, IMG.medinaPeople, IMG.riadFountain],
    relatedTrips: [
      { route: "tourEscapadaMarrakech23", image: IMG.riadFountain, duration: T("2 noches · 3 días", "2 nights · 3 days", "2 nuits · 3 jours"), title: T("Escapada a Marrakech", "Marrakech city break", "Escapade à Marrakech") },
      { route: "tourEscapadaRakAgafay34", image: IMG.dunesRocky, duration: T("3 noches · 4 días", "3 nights · 4 days", "3 nuits · 4 jours"), title: T("Marrakech y desierto de Agafay", "Marrakech and Agafay Desert", "Marrakech et désert d’Agafay") },
    ],
  },
  {
    id: "atlas",
    name: T("Alto Atlas", "High Atlas", "Haut Atlas"),
    kicker: T("Puertos y aldeas bereberes", "Passes and Berber villages", "Cols et villages berbères"),
    coords: [31.0544, -7.9161], zoom: 8, route: "tourEscapadaAtlas34", video: "PE-MljUK7Ok",
    intro: T("La carretera asciende entre valles, cumbres y pueblos de tierra antes de cruzar el histórico puerto de Tizi n’Tichka.", "The road climbs through valleys, summits and earthen villages before crossing the historic Tizi n’Tichka pass.", "La route monte entre vallées, sommets et villages de terre avant de franchir le col historique du Tizi n’Tichka."),
    interests: [T("Tizi n’Tichka", "Tizi n’Tichka", "Tizi n’Tichka"), T("Valle de Ounila", "Ounila Valley", "Vallée de l’Ounila"), T("Aldeas del Atlas", "Atlas villages", "Villages de l’Atlas")],
    fact: T("En pocos kilómetros el paisaje cambia del palmeral a las cumbres de más de 4.000 metros.", "Within a few kilometres, palm groves give way to peaks over 4,000 metres high.", "En quelques kilomètres, les palmeraies laissent place à des sommets de plus de 4 000 mètres."),
    images: [IMG.atlasSnowy, IMG.atlasVillage, IMG.atlasValley],
    relatedTrips: [
      { route: "tourEscapadaAtlas34", image: IMG.atlasVillage, duration: T("3 noches · 4 días", "3 nights · 4 days", "3 nuits · 4 jours"), title: T("Escapada al Alto Atlas", "High Atlas escape", "Escapade dans le Haut Atlas") },
      { route: "tourAtlasDesierto45", image: IMG.atlasValley, duration: T("4 noches · 5 días", "4 nights · 5 days", "4 nuits · 5 jours"), title: T("Del Atlas al desierto", "From the Atlas to the desert", "De l’Atlas au désert") },
    ],
  },
  {
    id: "ait-ben-haddou",
    name: T("Aït Ben Haddou y Ouarzazate", "Aït Ben Haddou and Ouarzazate", "Aït Ben Haddou et Ouarzazate"),
    kicker: T("Kasbahs de cine", "Cinematic kasbahs", "Kasbahs de cinéma"),
    coords: [31.0472, -7.1298], zoom: 10, route: "tourMarrakechErgHub", video: "AqAioBGccms",
    intro: T("Arquitectura de tierra, antiguas rutas caravaneras y escenarios cinematográficos marcan la entrada al gran sur.", "Earthen architecture, ancient caravan routes and film locations mark the entrance to the deep south.", "Architecture de terre, anciennes routes caravanières et décors de cinéma marquent l’entrée du Grand Sud."),
    interests: [T("Ksar de Aït Ben Haddou", "Aït Ben Haddou ksar", "Ksar d’Aït Ben Haddou"), T("Kasbah de Taourirt", "Taourirt Kasbah", "Kasbah de Taourirt"), T("Estudios de cine", "Film studios", "Studios de cinéma")],
    fact: T("Aït Ben Haddou conserva uno de los conjuntos de arquitectura de tierra más emblemáticos de Marruecos.", "Aït Ben Haddou preserves one of Morocco’s most emblematic earthen architecture ensembles.", "Aït Ben Haddou conserve l’un des ensembles d’architecture de terre les plus emblématiques du Maroc."),
    images: [IMG.kasbahArch, IMG.kasbahGate, IMG.dunesRocky],
    relatedTrips: [
      { route: "tourMarrakechErg45", image: IMG.kasbahArch, duration: T("4 noches · 5 días", "4 nights · 5 days", "4 nuits · 5 jours"), title: T("De Marrakech a Erg Chebbi", "Marrakech to Erg Chebbi", "De Marrakech à l’Erg Chebbi") },
      { route: "tourMarrakechLoop45", image: IMG.kasbahGate, duration: T("4 noches · 5 días", "4 nights · 5 days", "4 nuits · 5 jours"), title: T("Gran loop del sur", "Grand southern loop", "Grande boucle du sud") },
    ],
  },
  {
    id: "dades-todra",
    name: T("Dadès y Todra", "Dadès and Todra", "Dadès et Todra"),
    kicker: T("Valles, palmerales y gargantas", "Valleys, palms and gorges", "Vallées, palmeraies et gorges"),
    coords: [31.58, -5.72], zoom: 9, route: "tourAtlasDesiertoHub", video: "G7RTB1fXGOs",
    intro: T("La Ruta de las Mil Kasbahs atraviesa oasis y formaciones rocosas hasta las paredes monumentales de las gargantas.", "The Road of a Thousand Kasbahs crosses oases and rock formations towards the monumental gorge walls.", "La route des Mille Kasbahs traverse oasis et formations rocheuses jusqu’aux parois monumentales des gorges."),
    interests: [T("Gargantas del Dadès", "Dadès Gorges", "Gorges du Dadès"), T("Gargantas del Todra", "Todra Gorges", "Gorges du Todra"), T("Valle de las Rosas", "Valley of Roses", "Vallée des Roses")],
    fact: T("Las paredes del Todra alcanzan hasta 300 metros y forman uno de los paisajes más verticales del sur.", "Todra’s walls rise to 300 metres, creating one of the south’s most dramatic vertical landscapes.", "Les parois du Todra atteignent 300 mètres et composent l’un des paysages les plus verticaux du sud."),
    images: [IMG.atlasMisty, IMG.atlasValley, IMG.desertWoman],
    relatedTrips: [
      { route: "tourAtlasDesierto56", image: IMG.atlasMisty, duration: T("5 noches · 6 días", "5 nights · 6 days", "5 nuits · 6 jours"), title: T("Atlas, gargantas y desierto", "Atlas, gorges and desert", "Atlas, gorges et désert") },
      { route: "tourDesiertoAtlas56", image: IMG.desertWoman, duration: T("5 noches · 6 días", "5 nights · 6 days", "5 nuits · 6 jours"), title: T("Del Sáhara al Alto Atlas", "From the Sahara to the High Atlas", "Du Sahara au Haut Atlas") },
    ],
  },
  {
    id: "merzouga",
    name: T("Merzouga y Erg Chebbi", "Merzouga and Erg Chebbi", "Merzouga et Erg Chebbi"),
    kicker: T("El gran mar de dunas", "The great sea of dunes", "La grande mer de dunes"),
    coords: [31.1335, -3.9785], zoom: 10, route: "tourErgMarrakechHub", video: "ErBC2qPK68w",
    intro: T("El asfalto termina frente a las dunas. Aquí el viaje continúa en 4x4, a pie o en dromedario hasta el campamento.", "The road ends before the dunes. From here the journey continues by 4x4, on foot or by camel to the camp.", "La route s’arrête devant les dunes. Le voyage se poursuit en 4x4, à pied ou à dos de dromadaire jusqu’au campement."),
    interests: [T("Dunas de Erg Chebbi", "Erg Chebbi dunes", "Dunes de l’Erg Chebbi"), T("Khamlia y música gnawa", "Khamlia and gnawa music", "Khamlia et musique gnawa"), T("Campamento en el desierto", "Desert camp", "Campement dans le désert")],
    fact: T("La luz transforma el color de las dunas durante todo el día: del oro suave al naranja intenso.", "Light transforms the dunes throughout the day, from soft gold to intense orange.", "La lumière transforme les dunes toute la journée, de l’or doux à l’orange intense."),
    images: [IMG.dunes, IMG.camelCaravan, IMG.camelDunes],
    relatedTrips: [
      { route: "tourMarrakechErg67", image: IMG.camelCaravan, duration: T("6 noches · 7 días", "6 nights · 7 days", "6 nuits · 7 jours"), title: T("Marrakech y las dunas de Erg Chebbi", "Marrakech and the Erg Chebbi dunes", "Marrakech et les dunes de l’Erg Chebbi") },
      { route: "tourErgMarrakech67", image: IMG.camelDunes, duration: T("6 noches · 7 días", "6 nights · 7 days", "6 nuits · 7 jours"), title: T("Del desierto a Marrakech", "From the desert to Marrakech", "Du désert à Marrakech") },
    ],
  },
  {
    id: "draa",
    name: T("Valle del Drâa", "Drâa Valley", "Vallée du Drâa"),
    kicker: T("Oasis y rutas caravaneras", "Oases and caravan routes", "Oasis et routes caravanières"),
    coords: [30.33, -5.84], zoom: 8, route: "tourDesiertoAtlasHub", video: "94sDICGmLcU",
    intro: T("Un corredor verde de palmeras y pueblos fortificados acompaña al río hasta las puertas del Sáhara más remoto.", "A green corridor of palms and fortified villages follows the river towards the gates of the remotest Sahara.", "Un corridor vert de palmiers et de villages fortifiés suit le fleuve jusqu’aux portes du Sahara le plus reculé."),
    interests: [T("Palmeral del Drâa", "Drâa palm grove", "Palmeraie du Drâa"), T("Tamnougalt", "Tamnougalt", "Tamnougalt"), T("Zagora y M’Hamid", "Zagora and M’Hamid", "Zagora et M’Hamid")],
    fact: T("El valle fue durante siglos una vía esencial para las caravanas entre Marrakech y Tombuctú.", "For centuries the valley was a vital caravan route between Marrakech and Timbuktu.", "Pendant des siècles, la vallée fut une voie caravanière essentielle entre Marrakech et Tombouctou."),
    images: [IMG.dunesRocky, IMG.kasbahGate, IMG.desertWoman],
    relatedTrips: [
      { route: "tourDesiertoAtlas67", image: IMG.dunesRocky, duration: T("6 noches · 7 días", "6 nights · 7 days", "6 nuits · 7 jours"), title: T("Desierto, Drâa y Atlas", "Desert, Drâa and Atlas", "Désert, Drâa et Atlas") },
      { route: "tourMarrakechLoop56", image: IMG.kasbahGate, duration: T("5 noches · 6 días", "5 nights · 6 days", "5 nuits · 6 jours"), title: T("Ruta circular por el gran sur", "Grand South circular route", "Circuit dans le Grand Sud") },
    ],
  },
];

const routeCoords = STAGES.map((stage) => stage.coords);
const youtubePoster = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const MapFocus = ({ stage }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(stage.coords, stage.zoom, { duration: 1.15 });
  }, [map, stage]);
  return null;
};

const JourneyMap = ({ active, onSelect, lang }) => (
  <div className="relative h-[250px] overflow-hidden border border-white/15 lg:h-[310px]">
    <MapContainer
      center={active.coords}
      zoom={active.zoom}
      scrollWheelZoom={false}
      attributionControl={false}
      style={{ height: "100%", width: "100%", background: "#1A1513" }}
    >
      <MapBaseLayers variant="dark" togglePosition="bottomleft" />
      <Polyline positions={routeCoords} pathOptions={{ color: "#D4A373", weight: 2, opacity: 0.65, dashArray: "6 8" }} />
      {STAGES.map((stage, index) => {
        const selected = stage.id === active.id;
        return (
          <CircleMarker
            key={stage.id}
            center={stage.coords}
            radius={selected ? 10 : 6}
            eventHandlers={{ click: () => onSelect(index) }}
            pathOptions={{ color: selected ? "#FDFBF7" : "#D4A373", fillColor: selected ? "#C16542" : "#D4A373", fillOpacity: 1, weight: selected ? 3 : 2 }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <span className="font-serif-x text-sm text-[#2C2621]">{pick(stage.name, lang)}</span>
            </Tooltip>
          </CircleMarker>
        );
      })}
      <MapFocus stage={active} />
    </MapContainer>
    <MapLogoBadge />
  </div>
);

export default function SouthMoroccoVirtualExperience() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showFilm, setShowFilm] = useState(false);
  const active = STAGES[index];

  useEffect(() => setShowFilm(false), [index]);
  const select = (next) => setIndex(Math.max(0, Math.min(STAGES.length - 1, next)));

  return (
    <section id="mar-virtual-tour" data-testid="mar-virtual-tour" className="relative overflow-hidden bg-[#1A1513] py-20 text-[#FDFBF7] md:py-28">
      <div className="pointer-events-none absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 md:px-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4A373]">
            <Compass className="h-4 w-4" strokeWidth={1.5} />
            {pick(COPY.eyebrow, lang)}
          </span>
          <h2 className="mt-5 font-serif-x text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">{pick(COPY.title, lang)}</h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">{pick(COPY.body, lang)}</p>
          <button
            type="button"
            data-testid="mar-virtual-tour-open"
            onClick={() => { setIndex(0); setOpen(true); }}
            className="mt-8 inline-flex items-center gap-3 bg-[#C16542] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors hover:bg-[#A8533A]"
          >
            {pick(COPY.open, lang)}
            <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <p className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/45">
            <Sparkles className="h-3.5 w-3.5 text-[#D4A373]" /> {pick(COPY.preview, lang)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setIndex(0); setOpen(true); }}
          aria-label={pick(COPY.open, lang)}
          className="group relative grid h-[430px] grid-cols-2 gap-1 overflow-hidden lg:col-span-7 lg:h-[520px]"
        >
          {[IMG.dunes, IMG.atlasVillage, IMG.kasbahArch].map((image, imageIndex) => (
            <span key={image} className={`relative overflow-hidden ${imageIndex === 0 ? "row-span-2" : ""}`}>
              <Img src={image} alt="" sizes="(min-width: 1024px) 28vw, 50vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
            </span>
          ))}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/60 bg-[#1A1513]/65 backdrop-blur-md transition-transform group-hover:scale-110">
              <Play className="ml-1 h-7 w-7" fill="currentColor" strokeWidth={1.3} />
            </span>
          </span>
          <span className="absolute bottom-5 left-5 flex items-center gap-2 bg-[#FDFBF7] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#2C2621]">
            <Route className="h-3.5 w-3.5 text-[#C16542]" /> {pick(COPY.preview, lang)}
          </span>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-testid="mar-virtual-tour-modal"
          closeLabel={pick(COPY.close, lang)}
          overlayClassName="bg-[#0B0807]/90 backdrop-blur-md"
          className="h-[94svh] w-[96vw] max-w-[1440px] gap-0 overflow-hidden rounded-none border border-white/15 bg-[#171210] p-0 text-[#FDFBF7] sm:rounded-none"
        >
          <DialogTitle className="sr-only">{pick(COPY.modalTitle, lang)}</DialogTitle>
          <DialogDescription className="sr-only">{pick(COPY.modalDescription, lang)}</DialogDescription>

          <div className="flex h-full min-h-0 flex-col">
            <header className="shrink-0 border-b border-white/10 px-5 py-4 pr-14 md:px-8 md:py-5 md:pr-16">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-[#D4A373]">Xaluca · Tours</p>
                  <p className="mt-1 font-serif-x text-xl md:text-2xl">{pick(COPY.modalTitle, lang)}</p>
                </div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">
                  {pick(COPY.stage, lang)} {index + 1} / {STAGES.length}
                </p>
              </div>
              <div className="mt-4 flex gap-1" aria-label={`${pick(COPY.stage, lang)} ${index + 1} / ${STAGES.length}`}>
                {STAGES.map((stage, stageIndex) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => select(stageIndex)}
                    aria-label={`${pick(COPY.stage, lang)} ${stageIndex + 1}: ${pick(stage.name, lang)}`}
                    aria-current={stageIndex === index ? "step" : undefined}
                    className={`h-1 flex-1 transition-colors ${stageIndex <= index ? "bg-[#C16542]" : "bg-white/15"}`}
                  />
                ))}
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid min-h-full lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)]">
                <div className="border-b border-white/10 lg:border-b-0 lg:border-r">
                  <div className="p-4 md:p-6">
                    <p className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-[#D4A373]">
                      <MapPin className="h-3.5 w-3.5" /> {pick(COPY.map, lang)}
                    </p>
                    <JourneyMap active={active} onSelect={select} lang={lang} />
                  </div>

                  <div className="grid grid-cols-3 gap-1 px-4 pb-4 md:px-6 md:pb-6">
                    {active.images.map((image, imageIndex) => (
                      <div key={image} className={`overflow-hidden ${imageIndex === 0 ? "aspect-[4/3]" : "aspect-[4/3]"}`}>
                        <Img src={image} alt={`${pick(active.name, lang)} ${imageIndex + 1}`} sizes="(min-width: 1024px) 20vw, 33vw" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="px-4 pb-5 md:px-6 md:pb-6">
                    {showFilm ? (
                      <div className="relative aspect-video overflow-hidden bg-black">
                        <iframe
                          title={`${pick(active.name, lang)} · ${pick(COPY.film, lang)}`}
                          src={`https://www.youtube-nocookie.com/embed/${active.video}?autoplay=1&rel=0&modestbranding=1`}
                          allow="autoplay; encrypted-media; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full border-0"
                        />
                      </div>
                    ) : (
                      <button type="button" onClick={() => setShowFilm(true)} className="group relative block aspect-video w-full overflow-hidden bg-black text-left">
                        <img src={youtubePoster(active.video)} alt="" className="h-full w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-105" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-black/45"><Play className="ml-1 h-6 w-6" fill="currentColor" /></span></span>
                        <span className="absolute bottom-4 left-4 text-[9px] font-semibold uppercase tracking-[0.22em]">{pick(COPY.film, lang)}</span>
                      </button>
                    )}
                  </div>
                </div>

                <article className="flex flex-col p-6 md:p-9 lg:p-10">
                  <div className="flex-1">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C16542]">{String(index + 1).padStart(2, "0")} · {pick(active.kicker, lang)}</p>
                    <h3 className="mt-4 font-serif-x text-4xl leading-[1.02] md:text-5xl">{pick(active.name, lang)}</h3>
                    <p className="mt-6 text-sm leading-7 text-white/70 md:text-base">{pick(active.intro, lang)}</p>

                    <div className="mt-8 border-t border-white/10 pt-6">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#D4A373]">{pick(COPY.landmarks, lang)}</p>
                      <ul className="mt-4 space-y-3">
                        {active.interests.map((interest, interestIndex) => (
                          <li key={interestIndex} className="flex items-center gap-3 text-sm text-white/85">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#D4A373]/45 text-[9px] text-[#D4A373]">{interestIndex + 1}</span>
                            {pick(interest, lang)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 border-l-2 border-[#C16542] bg-white/[0.04] p-5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#D4A373]">{pick(COPY.fact, lang)}</p>
                      <p className="mt-3 text-sm leading-6 text-white/70">{pick(active.fact, lang)}</p>
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-7" data-testid="mar-virtual-recommendations">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#D4A373]">{pick(COPY.recommendations, lang)}</p>
                      <p className="mt-2 text-xs leading-5 text-white/50">{pick(COPY.recommendationsBody, lang)}</p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {active.relatedTrips.map((trip) => (
                          <Link
                            key={trip.route}
                            to={pathFor(lang, trip.route)}
                            data-testid={`mar-virtual-related-${trip.route}`}
                            className="group overflow-hidden border border-white/15 bg-white/[0.035] transition-colors hover:border-[#D4A373]/70"
                          >
                            <span className="relative block aspect-[16/9] overflow-hidden">
                              <Img src={trip.image} alt={pick(trip.title, lang)} sizes="(min-width: 1024px) 18vw, 50vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                              <span className="absolute bottom-3 left-3 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/80">{pick(trip.duration, lang)}</span>
                            </span>
                            <span className="block p-4">
                              <span className="block font-serif-x text-lg leading-tight text-white">{pick(trip.title, lang)}</span>
                              <span className="mt-3 inline-flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#D4A373]">
                                {pick(COPY.viewTrip, lang)} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <Link to={pathFor(lang, "archive")} className="inline-flex items-center justify-center gap-2 bg-[#C16542] px-5 py-4 text-center text-[9px] font-semibold uppercase tracking-[0.18em] hover:bg-[#A8533A]">
                        {pick(COPY.related, lang)} <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Link to={pathFor(lang, "planTrip")} className="inline-flex items-center justify-center gap-2 border border-white/25 px-5 py-4 text-center text-[9px] font-semibold uppercase tracking-[0.18em] hover:border-[#D4A373] hover:text-[#D4A373]">
                        {pick(COPY.proposal, lang)} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-5">
                    <button type="button" disabled={index === 0} onClick={() => select(index - 1)} className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-25">
                      <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">{pick(COPY.previous, lang)}</span>
                    </button>
                    <button type="button" disabled={index === STAGES.length - 1} onClick={() => select(index + 1)} className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-25">
                      <span className="hidden sm:inline">{pick(COPY.next, lang)}</span> <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
