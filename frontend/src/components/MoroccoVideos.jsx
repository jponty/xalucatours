import React, { useRef, useState, useEffect, useCallback } from "react";
import { Play, Film, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";

/* ============================================================
   Editorial video gallery — "Morocco From Above".
   Each card's play button opens a video dialog (lightbox) that
   streams the YouTube piece. Posters use the official YouTube
   thumbnail and remain editable via the CMS (slot home.video.{id}).
============================================================ */
const yt = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

const VIDEOS = [
  {
    id: "WGoSnw5Y3nE",
    accent: "#C16542",
    eyebrow: { es: "Marrakech", en: "Marrakesh", fr: "Marrakech" },
    title: {
      es: "Marrakech, la escapada definitiva",
      en: "Marrakesh, the ultimate getaway",
      fr: "Marrakech, l'escapade ultime",
    },
    desc: {
      es: "La escapada por excelencia: la plaza Jemaa el-Fna, riads de ensueño, el Jardín Majorelle y el bullicio eterno de la medina roja.",
      en: "The ultimate getaway: Jemaa el-Fnaa square, dreamlike riads, the Majorelle Garden and the eternal bustle of the red medina.",
      fr: "L'escapade par excellence : la place Jemaa el-Fna, des riads de rêve, le Jardin Majorelle et l'effervescence de la médina rouge.",
    },
  },
  {
    id: "ErBC2qPK68w",
    accent: "#D97742",
    eyebrow: { es: "Merzouga · Sáhara", en: "Merzouga · Sahara", fr: "Merzouga · Sahara" },
    title: {
      es: "Merzouga: dromedarios, vivac y mucho más",
      en: "The ultimate trip to Merzouga: camels, camping & more",
      fr: "Merzouga : dromadaires, bivouac et bien plus",
    },
    desc: {
      es: "Dromedarios, vivac y noches estrelladas: la experiencia definitiva en las dunas doradas del Erg Chebbi.",
      en: "Camels, camping and starry nights: the ultimate experience in the golden dunes of Erg Chebbi.",
      fr: "Dromadaires, bivouac et nuits étoilées : l'expérience ultime dans les dunes dorées de l'Erg Chebbi.",
    },
  },
  {
    id: "4CQ0irysD8s",
    accent: "#5A7F9C",
    eyebrow: { es: "Chefchaouen · Rif", en: "Chefchaouen · Rif", fr: "Chefchaouen · Rif" },
    title: {
      es: "Chefchaouen: vistas aéreas y calles azules",
      en: "Chefchaouen: aerial views and the blue streets",
      fr: "Chefchaouen : vues aériennes et ruelles bleues",
    },
    desc: {
      es: "Vistas aéreas y callejones índigo: piérdete por las calles azules de la joya del Rif, la inconfundible ciudad azul.",
      en: "Aerial views and indigo alleys: get lost in the blue streets of the Rif's jewel, the unmistakable blue city.",
      fr: "Vues aériennes et ruelles indigo : perdez-vous dans les rues bleues du joyau du Rif, l'incomparable ville bleue.",
    },
  },
  {
    id: "kYxBn98X3Ig",
    accent: "#A07042",
    eyebrow: { es: "Fez · Ciudad Imperial", en: "Fez · Imperial City", fr: "Fès · Ville impériale" },
    title: {
      es: "Fez: un viaje por la historia y la tradición",
      en: "Fez: a journey through history and tradition",
      fr: "Fès : un voyage à travers l'histoire et la tradition",
    },
    desc: {
      es: "Un viaje por la historia y la tradición: la medina medieval más viva del mundo, sus zocos, sus curtidurías y la universidad más antigua.",
      en: "A journey through history and tradition: the world's liveliest medieval medina, its souks, tanneries and the oldest university.",
      fr: "Un voyage à travers l'histoire et la tradition : la médina médiévale la plus vivante du monde, ses souks et ses tanneries.",
    },
  },
  {
    id: "si2uNbjU1jA",
    accent: "#3A4A5F",
    eyebrow: { es: "Casablanca · Costa Atlántica", en: "Casablanca · Atlantic Coast", fr: "Casablanca · Côte Atlantique" },
    title: {
      es: "Casablanca y sus alrededores: lugares imprescindibles",
      en: "Discover Casablanca & its surroundings: must-see spots",
      fr: "Casablanca et ses environs : les lieux incontournables",
    },
    desc: {
      es: "La capital económica deslumbra con su patrimonio Art Déco y la monumental Mezquita Hassan II, cuyo minarete se asoma al Atlántico.",
      en: "The economic capital dazzles with its Art Deco heritage and the monumental Hassan II Mosque, its minaret rising over the Atlantic.",
      fr: "La capitale économique éblouit par son patrimoine Art déco et la monumentale mosquée Hassan II, dont le minaret surplombe l'Atlantique.",
    },
  },
  {
    id: "WrDlEphvlR8",
    accent: "#C98A5E",
    eyebrow: { es: "Rabat · Capital", en: "Rabat · Capital", fr: "Rabat · Capitale" },
    title: {
      es: "Rabat: sumérgete en la cultura y el patrimonio de Marruecos",
      en: "Rabat: dive into Morocco's vibrant culture and heritage",
      fr: "Rabat : plongez dans la culture et le patrimoine du Maroc",
    },
    desc: {
      es: "Sumérgete en la cultura de la capital del Reino: la Kasbah de los Oudayas, la Torre Hassan y jardines junto al río Bouregreg.",
      en: "Dive into the culture of the Kingdom's capital: the Kasbah of the Udayas, the Hassan Tower and gardens along the Bouregreg.",
      fr: "Plongez dans la culture de la capitale : la Kasbah des Oudayas, la Tour Hassan et les jardins au bord du Bouregreg.",
    },
  },
  {
    id: "OGjn7ON-60c",
    accent: "#5A7F9C",
    eyebrow: { es: "Tánger · Estrecho", en: "Tangier · Strait", fr: "Tanger · Détroit" },
    title: {
      es: "Tánger, el destino definitivo para viajar entre amigos",
      en: "Tangier, the ultimate friends' travel destination",
      fr: "Tanger, la destination ultime pour voyager entre amis",
    },
    desc: {
      es: "El destino definitivo entre amigos: la mítica kasbah, su corniche y un cruce único entre el Mediterráneo y el Atlántico.",
      en: "The ultimate friends' destination: the mythical kasbah, its corniche and a unique crossroads between Mediterranean and Atlantic.",
      fr: "La destination ultime entre amis : la kasbah mythique, sa corniche et un carrefour unique entre Méditerranée et Atlantique.",
    },
  },
  {
    id: "joRZxY4gcyQ",
    accent: "#3A4A5F",
    eyebrow: { es: "Essaouira · Atlántico", en: "Essaouira · Atlantic", fr: "Essaouira · Atlantique" },
    title: {
      es: "Esto es Essaouira: aventura, cultura y mucho más",
      en: "This is Essaouira: adventure, culture and more",
      fr: "Voici Essaouira : aventure, culture et bien plus",
    },
    desc: {
      es: "Aventura, cultura y mar: la ciudad del viento seduce con sus murallas portuguesas, su puerto azul y sus playas atlánticas.",
      en: "Adventure, culture and sea: the windy city charms with its Portuguese ramparts, blue port and Atlantic beaches.",
      fr: "Aventure, culture et mer : la cité du vent séduit par ses remparts portugais, son port bleu et ses plages atlantiques.",
    },
  },
  {
    id: "Jqds5jTCVN0",
    accent: "#D4A373",
    eyebrow: { es: "Tetuán · Norte", en: "Tetouan · North", fr: "Tétouan · Nord" },
    title: {
      es: "Tetuán: tu próximo destino soñado",
      en: "Tetouan: your next dream destination",
      fr: "Tétouan : votre prochaine destination de rêve",
    },
    desc: {
      es: "Tu próximo destino soñado: la 'paloma blanca' del norte despliega una medina Patrimonio de la Humanidad de raíces andalusíes.",
      en: "Your next dream destination: the northern 'white dove' unfolds a UNESCO-listed medina of Andalusian roots.",
      fr: "Votre prochaine destination de rêve : la « colombe blanche » du nord déploie une médina andalouse classée à l'UNESCO.",
    },
  },
  {
    id: "VDZXbZYhTwc",
    accent: "#C16542",
    eyebrow: { es: "Norte y Rif", en: "North & Rif", fr: "Nord et Rif" },
    title: {
      es: "Descubre por qué el norte de Marruecos rebosa aventura",
      en: "See why the north of Morocco is filled with adventure",
      fr: "Découvrez pourquoi le nord du Maroc regorge d'aventure",
    },
    desc: {
      es: "Descubre por qué el norte de Marruecos rebosa aventura: montañas del Rif, cascadas escondidas y senderos junto al mar.",
      en: "See why northern Morocco is filled with adventure: the Rif mountains, hidden waterfalls and trails by the sea.",
      fr: "Découvrez pourquoi le nord du Maroc regorge d'aventure : les montagnes du Rif, des cascades cachées et des sentiers en bord de mer.",
    },
  },
  {
    id: "Jgowl-UAJ0Q",
    accent: "#D97742",
    eyebrow: { es: "Ifrane · Atlas Medio", en: "Ifrane · Middle Atlas", fr: "Ifrane · Moyen Atlas" },
    title: {
      es: "Ifrane: el idílico pueblo entre bosques y montañas",
      en: "Ifrane: the idyllic town surrounded by forests and mountains",
      fr: "Ifrane : le village idyllique entre forêts et montagnes",
    },
    desc: {
      es: "La 'pequeña Suiza' de Marruecos: un pueblo idílico de tejados puntiagudos rodeado de bosques de cedros y macacos.",
      en: "Morocco's 'little Switzerland': an idyllic town of pointed roofs surrounded by cedar forests and Barbary macaques.",
      fr: "La « petite Suisse » du Maroc : un village idyllique aux toits pointus entouré de forêts de cèdres et de magots.",
    },
  },
  {
    id: "Nea2OFEUkSY",
    accent: "#A07042",
    eyebrow: { es: "Alto Atlas", en: "High Atlas", fr: "Haut Atlas" },
    title: {
      es: "La gran escapada al aire libre por las montañas del Atlas",
      en: "The ultimate outdoorsy trip in the Atlas Mountains",
      fr: "La grande échappée en plein air dans les montagnes de l'Atlas",
    },
    desc: {
      es: "La gran escapada al aire libre por las montañas del Atlas: aldeas bereberes, valles verdes y cumbres nevadas.",
      en: "The ultimate outdoorsy trip across the Atlas Mountains: Berber villages, green valleys and snow-capped peaks.",
      fr: "La grande échappée en plein air dans les montagnes de l'Atlas : villages berbères, vallées verdoyantes et sommets enneigés.",
    },
  },
  {
    id: "OfNCALW5pm4",
    accent: "#C98A5E",
    eyebrow: { es: "Aït Ben Haddou", en: "Aït Ben Haddou", fr: "Aït Ben Haddou" },
    title: {
      es: "Explora Aït Ben Haddou a caballo",
      en: "Explore Aït Ben Haddou on horseback",
      fr: "Explorez Aït Ben Haddou à cheval",
    },
    desc: {
      es: "Explora a caballo el ksar de Aït Ben Haddou, ciudadela de adobe Patrimonio de la Humanidad y plató de cine legendario.",
      en: "Explore on horseback the ksar of Aït Ben Haddou, a UNESCO adobe citadel and legendary film set.",
      fr: "Explorez à cheval le ksar d'Aït Ben Haddou, citadelle d'adobe classée à l'UNESCO et plateau de cinéma légendaire.",
    },
  },
  {
    id: "G7RTB1fXGOs",
    accent: "#3A4A5F",
    eyebrow: { es: "Gargantas del Dadès", en: "Dadès Gorges", fr: "Gorges du Dadès" },
    title: {
      es: "Recorre las sinuosas carreteras de las gargantas del Dadès",
      en: "Drive down the winding roads of Dadès Gorges",
      fr: "Parcourez les routes sinueuses des gorges du Dadès",
    },
    desc: {
      es: "Recorre las sinuosas carreteras de las gargantas del Dadès, entre formaciones rocosas y kasbahs suspendidas sobre el valle.",
      en: "Drive the winding roads of the Dadès Gorges, between rock formations and kasbahs suspended over the valley.",
      fr: "Parcourez les routes sinueuses des gorges du Dadès, entre formations rocheuses et kasbahs suspendues au-dessus de la vallée.",
    },
  },
];

const COPY = {
  overline: { es: "Marruecos en imágenes", en: "Morocco in motion", fr: "Le Maroc en images" },
  title: {
    es: "El país que escapa de las palabras.",
    en: "A country that escapes words.",
    fr: "Un pays qui échappe aux mots.",
  },
  body: {
    es: "Una selección editorial de piezas filmadas en localización para que sientas el ritmo, los colores y el silencio de Marruecos antes de poner un pie en él.",
    en: "An editorial selection of pieces filmed on location — so you can feel Morocco's rhythm, colours and silence before setting foot in it.",
    fr: "Une sélection éditoriale de pièces tournées sur place — pour ressentir le rythme, les couleurs et le silence du Maroc avant d'y poser le pied.",
  },
  play: { es: "Reproducir", en: "Play", fr: "Lire" },
  prev: { es: "Anterior", en: "Previous", fr: "Précédent" },
  next: { es: "Siguiente", en: "Next", fr: "Suivant" },
  watch: { es: "Ver en YouTube", en: "Watch on YouTube", fr: "Voir sur YouTube" },
  close: { es: "Cerrar", en: "Close", fr: "Fermer" },
  attribution: {
    es: "Creado por Visit Morocco Originals",
    en: "Created by Visit Morocco Originals",
    fr: "Créé par Visit Morocco Originals",
  },
};

const pickL = (obj, lang) => (obj && (obj[lang] || obj.es)) || "";

const VideoCard = ({ video, lang, onPlay }) => (
  <article
    data-testid={`video-card-${video.id}`}
    className="group relative shrink-0 w-[88vw] sm:w-[420px] lg:w-[460px] snap-start"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1513] border border-[#FDFBF7]/10">
      <EditableImage
        slot={`home.video.${video.id}`}
        fallback={yt(video.id)}
        alt={pickL(video.title, lang)}
        imgProps={{ loading: "lazy" }}
        aspectRatio="16/9"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/35 to-transparent" />
      <span className="film-grain" />
      <XalucaLogoBadge testid={`video-logo-${video.id}`} />
      <div className="absolute top-5 left-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/85">
        <Film className="w-3 h-3" strokeWidth={1.6} style={{ color: video.accent }} />
        {pickL(video.eyebrow, lang)}
      </div>
      <button
        type="button"
        onClick={() => onPlay(video)}
        data-testid={`video-play-${video.id}`}
        aria-label={pickL(COPY.play, lang)}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FDFBF7]/95 text-[#1A1513] shadow-lg transition-transform duration-500 group-hover:scale-110"
          style={{ boxShadow: `0 0 0 1px ${video.accent}55, 0 30px 60px -20px ${video.accent}88` }}
        >
          <Play className="w-6 h-6 ml-1" strokeWidth={1.5} />
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: video.accent }}
          />
        </span>
      </button>
    </div>
    <div className="mt-6 pl-1">
      <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: video.accent }}>
        {pickL(video.eyebrow, lang)}
      </span>
      <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.15] tracking-tight mt-3 text-[#FDFBF7]">
        {pickL(video.title, lang)}
      </h3>
      <p className="mt-3 text-sm text-[#FDFBF7]/65 leading-relaxed max-w-[44ch] line-clamp-3">
        {pickL(video.desc, lang)}
      </p>
    </div>
  </article>
);

const VideoDialog = ({ video, lang, onClose }) => {
  useEffect(() => {
    if (!video) return undefined; // only lock scroll while a video is open
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      data-testid="video-dialog"
      role="dialog"
      aria-modal="true"
      aria-label={pickL(video.title, lang)}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-[#0F0C0A]/92 backdrop-blur-md p-4 md:p-8 animate-[fadeIn_.25s_ease]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-5xl">
        <button
          type="button"
          onClick={onClose}
          data-testid="video-dialog-close"
          aria-label={pickL(COPY.close, lang)}
          className="absolute -top-12 right-0 md:-right-2 inline-flex items-center gap-2 text-[#FDFBF7]/80 hover:text-[#FDFBF7] text-[11px] tracking-[0.22em] uppercase transition-colors"
        >
          {pickL(COPY.close, lang)}
          <X className="w-5 h-5" strokeWidth={1.7} />
        </button>

        <div className="relative w-full aspect-video bg-black overflow-hidden border border-[#FDFBF7]/15 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
          <iframe
            title={pickL(video.title, lang)}
            data-testid="video-dialog-iframe"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <div className="mt-5 max-h-[28vh] overflow-y-auto pr-1 no-scrollbar">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: video.accent }}>
            {pickL(video.eyebrow, lang)}
          </span>
          <h3 className="font-serif-x text-2xl md:text-3xl text-[#FDFBF7] leading-tight mt-2">
            {pickL(video.title, lang)}
          </h3>
          <p className="mt-3 text-sm md:text-[15px] text-[#FDFBF7]/70 leading-relaxed">
            {pickL(video.desc, lang)}
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="video-dialog-youtube"
            className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#D4A373] hover:text-[#FDFBF7] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
            {pickL(COPY.watch, lang)}
          </a>
        </div>
      </div>
    </div>
  );
};

export default function MoroccoVideos() {
  const { lang } = useLanguage();
  const [dialogVideo, setDialogVideo] = useState(null);
  const railRef = useRef(null);

  const closeDialog = useCallback(() => setDialogVideo(null), []);

  const scrollBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = rail.clientWidth * 0.85 * (dir === "next" ? 1 : -1);
    rail.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id="videos"
      data-testid="morocco-videos"
      className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-[0.07] pointer-events-none" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-14 md:mb-20">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-[#D4A373] text-[11px] tracking-[0.35em] uppercase">
              <Film className="w-3.5 h-3.5" strokeWidth={1.6} />
              <EditableText slot="home.videos.overline" defaults={COPY.overline} multiline={false} />
              <span className="w-10 h-px bg-[#D4A373]/50" />
            </span>
            <EditableText as="h2" slot="home.videos.title" defaults={COPY.title}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-6 text-[#FDFBF7] block" />
          </div>
          <div className="lg:col-span-5">
            <EditableText as="p" slot="home.videos.body" defaults={COPY.body}
              className="text-base md:text-lg text-[#FDFBF7]/70 leading-relaxed block" />
            <EditableText as="p" slot="home.videos.attribution" defaults={COPY.attribution}
              className="mt-4 text-[11px] tracking-[0.28em] uppercase text-[#D4A373] block" />
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollBy("prev")}
                aria-label={pickL(COPY.prev, lang)}
                data-testid="videos-prev"
                className="inline-flex items-center justify-center w-12 h-12 border border-[#FDFBF7]/25 hover:border-[#D4A373] hover:text-[#D4A373] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy("next")}
                aria-label={pickL(COPY.next, lang)}
                data-testid="videos-next"
                className="inline-flex items-center justify-center w-12 h-12 border border-[#FDFBF7]/25 hover:border-[#D4A373] hover:text-[#D4A373] transition-colors"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          data-testid="videos-rail"
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-6 md:-mx-12 px-6 md:px-12 no-scrollbar"
        >
          {VIDEOS.map((v) => (
            <VideoCard key={v.id} video={v} lang={lang} onPlay={setDialogVideo} />
          ))}
        </div>
      </div>

      <VideoDialog video={dialogVideo} lang={lang} onClose={closeDialog} />
    </section>
  );
}
