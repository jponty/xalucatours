import React, { useRef, useState } from "react";
import { Play, Film, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EditableImage from "@/components/EditableImage";

/* ============================================================
   Editorial video gallery — Morocco through the lens.
   Replace VIDEOS[].id with real YouTube IDs whenever ready.
============================================================ */
const VIDEOS = [
  {
    id: "k8FtwzRCo3M",
    accent: "#C16542",
    poster: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=85",
    eyebrow: { es: "Erg Chebbi", en: "Erg Chebbi", fr: "Erg Chebbi" },
    title: {
      es: "Una noche bajo las estrellas del Sáhara",
      en: "A night under the Sahara stars",
      fr: "Une nuit sous les étoiles du Sahara",
    },
    desc: {
      es: "Dunas, fuego y silencio absoluto en el desierto del Erg Chebbi.",
      en: "Dunes, fire and absolute silence in the Erg Chebbi desert.",
      fr: "Dunes, feu et silence absolu dans le désert de l'Erg Chebbi.",
    },
  },
  {
    id: "8U_yU4o6cTM",
    accent: "#A07042",
    poster: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=85",
    eyebrow: { es: "Fez · UNESCO", en: "Fez · UNESCO", fr: "Fès · UNESCO" },
    title: {
      es: "Fez el-Bali, el laberinto vivo",
      en: "Fez el-Bali, the living labyrinth",
      fr: "Fès el-Bali, le labyrinthe vivant",
    },
    desc: {
      es: "Tenerías centenarias, gremios artesanales y la medina más antigua del mundo árabe.",
      en: "Centuries-old tanneries, artisan guilds and the oldest medina in the Arab world.",
      fr: "Tanneries séculaires, corporations d'artisans et la plus ancienne médina du monde arabe.",
    },
  },
  {
    id: "OXIb4F7K63A",
    accent: "#5A7F9C",
    poster: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=85",
    eyebrow: { es: "Chefchaouen", en: "Chefchaouen", fr: "Chefchaouen" },
    title: {
      es: "Chefchaouen, el añil que cuelga del Rif",
      en: "Chefchaouen, the indigo hanging from the Rif",
      fr: "Chefchaouen, l'indigo accroché au Rif",
    },
    desc: {
      es: "Callejuelas azules, lavaderos de Sebbanin y la kasbah del siglo XVII.",
      en: "Blue alleyways, Sebbanin laundries and the 17th-century kasbah.",
      fr: "Ruelles bleues, lavoirs de Sebbanin et kasbah du XVIIe siècle.",
    },
  },
  {
    id: "p9bD8oOMpdY",
    accent: "#D97742",
    poster: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=85",
    eyebrow: { es: "Marrakech", en: "Marrakech", fr: "Marrakech" },
    title: {
      es: "Jemaa el-Fna al caer la noche",
      en: "Jemaa el-Fna at nightfall",
      fr: "Jemaa el-Fna à la tombée de la nuit",
    },
    desc: {
      es: "Patrimonio oral e inmaterial: narradores, músicos y aromas en la plaza más viva del Magreb.",
      en: "Oral and intangible heritage: storytellers, musicians and aromas in the Maghreb's liveliest square.",
      fr: "Patrimoine oral et immatériel : conteurs, musiciens et arômes sur la place la plus vivante du Maghreb.",
    },
  },
  {
    id: "M7lc1UVf-VE",
    accent: "#7C8B5C",
    poster: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85",
    eyebrow: { es: "Alto Atlas", en: "High Atlas", fr: "Haut Atlas" },
    title: {
      es: "Travesía del Alto Atlas",
      en: "Crossing the High Atlas",
      fr: "Traversée du Haut Atlas",
    },
    desc: {
      es: "Pueblos imazighen, gargantas del Todra y Dades, valles olvidados a 2.000 m.",
      en: "Imazighen villages, Todra and Dades gorges, forgotten valleys at 2,000 m.",
      fr: "Villages imazighen, gorges du Todra et du Dadès, vallées oubliées à 2 000 m.",
    },
  },
  {
    id: "ZbZSe6N_BXs",
    accent: "#3A4A5F",
    poster: "https://images.unsplash.com/photo-1570133435536-7ececf000ef6?auto=format&fit=crop&w=1600&q=85",
    eyebrow: { es: "Essaouira", en: "Essaouira", fr: "Essaouira" },
    title: {
      es: "Essaouira, la perla del Atlántico",
      en: "Essaouira, the Atlantic pearl",
      fr: "Essaouira, la perle de l'Atlantique",
    },
    desc: {
      es: "Murallas portuguesas, gaviotas y mar abierto en la antigua Mogador.",
      en: "Portuguese ramparts, gulls and open sea in ancient Mogador.",
      fr: "Remparts portugais, mouettes et grand large dans l'ancienne Mogador.",
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
};

const VideoCard = ({ video, lang, isActive, onPlay }) => (
  <article
    data-testid={`video-card-${video.id}`}
    className="group relative shrink-0 w-[88vw] sm:w-[420px] lg:w-[460px] snap-start"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1513] border border-[#FDFBF7]/10">
      {isActive ? (
        <iframe
          title={video.title[lang] || video.title.es}
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <>
          <EditableImage
            slot={`home.video.${video.id}`}
            fallback={video.poster}
            alt={video.title[lang] || video.title.es}
            imgProps={{ loading: "lazy" }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/35 to-transparent" />
          <span className="film-grain" />
          <div className="absolute top-5 left-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/85">
            <Film className="w-3 h-3" strokeWidth={1.6} style={{ color: video.accent }} />
            {video.eyebrow[lang] || video.eyebrow.es}
          </div>
          <button
            type="button"
            onClick={() => onPlay(video.id)}
            data-testid={`video-play-${video.id}`}
            aria-label={COPY.play[lang] || COPY.play.es}
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
        </>
      )}
    </div>
    <div className="mt-6 pl-1">
      <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: video.accent }}>
        {video.eyebrow[lang] || video.eyebrow.es}
      </span>
      <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.15] tracking-tight mt-3 text-[#FDFBF7]">
        {video.title[lang] || video.title.es}
      </h3>
      <p className="mt-3 text-sm text-[#FDFBF7]/65 leading-relaxed max-w-[44ch]">
        {video.desc[lang] || video.desc.es}
      </p>
    </div>
  </article>
);

export default function MoroccoVideos() {
  const { lang } = useLanguage();
  const [activeId, setActiveId] = useState(null);
  const railRef = useRef(null);

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
              {COPY.overline[lang] || COPY.overline.es}
              <span className="w-10 h-px bg-[#D4A373]/50" />
            </span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-6 text-[#FDFBF7]">
              {COPY.title[lang] || COPY.title.es}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base md:text-lg text-[#FDFBF7]/70 leading-relaxed">
              {COPY.body[lang] || COPY.body.es}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollBy("prev")}
                aria-label={COPY.prev[lang] || COPY.prev.es}
                data-testid="videos-prev"
                className="inline-flex items-center justify-center w-12 h-12 border border-[#FDFBF7]/25 hover:border-[#D4A373] hover:text-[#D4A373] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy("next")}
                aria-label={COPY.next[lang] || COPY.next.es}
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
            <VideoCard
              key={v.id}
              video={v}
              lang={lang}
              isActive={activeId === v.id}
              onPlay={setActiveId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
