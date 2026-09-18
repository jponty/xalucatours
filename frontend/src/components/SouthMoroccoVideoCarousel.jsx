import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Film, Play } from "lucide-react";
import Img from "@/components/Img";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  eyebrow: T("El sur, en movimiento", "The south in motion", "Le sud en mouvement"),
  title: T(
    "Paisajes que empiezan a sentirse antes de viajar.",
    "Landscapes you can feel before you travel.",
    "Des paysages que l’on ressent avant même de voyager.",
  ),
  body: T(
    "Recorre el Atlas, las kasbahs, los valles y el Sáhara a través de una selección audiovisual que también revela las ciudades y costas que conectan cada ruta por Marruecos.",
    "Travel through the Atlas, kasbahs, valleys and Sahara in a film collection that also reveals the cities and coastlines connecting every Moroccan route.",
    "Parcourez l’Atlas, les kasbahs, les vallées et le Sahara à travers une sélection de films qui révèle aussi les villes et les côtes reliant chaque itinéraire marocain.",
  ),
  play: T("Reproducir vídeo", "Play video", "Lire la vidéo"),
  youtube: T("Abrir en YouTube", "Open on YouTube", "Ouvrir sur YouTube"),
  close: T("Cerrar vídeo", "Close video", "Fermer la vidéo"),
  previous: T("Vídeos anteriores", "Previous videos", "Vidéos précédentes"),
  next: T("Vídeos siguientes", "Next videos", "Vidéos suivantes"),
  counter: T("vídeos", "videos", "vidéos"),
};

const VIDEOS = [
  { id: "Jgowl-UAJ0Q", region: T("Medio Atlas", "Middle Atlas", "Moyen Atlas"), title: T("Ifrane entre bosques y montañas", "Ifrane among forests and mountains", "Ifrane entre forêts et montagnes") },
  { id: "kYxBn98X3Ig", region: T("Fez", "Fez", "Fès"), title: T("Historia y tradición en Fez", "History and tradition in Fez", "Histoire et traditions à Fès") },
  { id: "4CQ0irysD8s", region: T("Rif", "Rif", "Rif"), title: T("Chefchaouen desde el cielo", "Chefchaouen from above", "Chefchaouen vue du ciel") },
  { id: "PE-MljUK7Ok", region: T("Alto Atlas", "High Atlas", "Haut Atlas"), title: T("Atardecer mágico en el Atlas", "A magical Atlas sunset", "Un coucher de soleil magique dans l’Atlas") },
  { id: "mqYw_3Oovmo", region: T("Chefchaouen", "Chefchaouen", "Chefchaouen"), title: T("La perla azul de Marruecos", "Morocco’s blue pearl", "La perle bleue du Maroc") },
  { id: "r3rGNezvyOA", region: T("Alto Atlas", "High Atlas", "Haut Atlas"), title: T("Amanecer sobre las montañas", "Sunrise over the mountains", "Lever de soleil sur les montagnes") },
  { id: "ErBC2qPK68w", region: T("Merzouga", "Merzouga", "Merzouga"), title: T("Aventura entre las dunas", "An adventure among the dunes", "Une aventure au cœur des dunes") },
  { id: "G7RTB1fXGOs", region: T("Valle del Dadès", "Dadès Valley", "Vallée du Dadès"), title: T("Las curvas de las gargantas del Dadès", "The winding Dadès Gorges", "Les routes sinueuses des gorges du Dadès") },
  { id: "OfNCALW5pm4", region: T("Aït Ben Haddou", "Aït Ben Haddou", "Aït Ben Haddou"), title: T("La kasbah a caballo", "The kasbah on horseback", "La kasbah à cheval") },
  { id: "94sDICGmLcU", region: T("Drâa · Telouet · Merzouga", "Drâa · Telouet · Merzouga", "Drâa · Telouet · Merzouga"), title: T("Un anticipo del Sáhara", "A foretaste of the Sahara", "Un avant-goût du Sahara") },
  { id: "WGoSnw5Y3nE", region: T("Marrakech", "Marrakech", "Marrakech"), title: T("La escapada definitiva", "The ultimate getaway", "L’escapade ultime") },
  { id: "AqAioBGccms", region: T("Aït Ben Haddou", "Aït Ben Haddou", "Aït Ben Haddou"), title: T("Historia entre muros de tierra", "History within earthen walls", "L’histoire entre des murs de terre") },
  { id: "uLu-t1Vi4Jg", region: T("Atlas · Ouzoud · Costa", "Atlas · Ouzoud · Coast", "Atlas · Ouzoud · Côte"), title: T("Marruecos desde el cielo", "Morocco from above", "Le Maroc vu du ciel") },
  { id: "Nea2OFEUkSY", region: T("Montañas del Atlas", "Atlas Mountains", "Montagnes de l’Atlas"), title: T("Naturaleza y aventura en el Atlas", "Nature and adventure in the Atlas", "Nature et aventure dans l’Atlas") },
  { id: "Q7loeqQiT68", region: T("Gargantas del Dadès", "Dadès Gorges", "Gorges du Dadès"), title: T("La carretera más espectacular del sur", "The south’s most spectacular road", "La route la plus spectaculaire du sud") },
  { id: "joRZxY4gcyQ", region: T("Essaouira", "Essaouira", "Essaouira"), title: T("Aventura y cultura junto al Atlántico", "Adventure and culture by the Atlantic", "Aventure et culture au bord de l’Atlantique") },
  { id: "syAHn3r04LI", region: T("Marruecos", "Morocco", "Maroc"), title: T("La belleza de todo un país desde el aire", "A country’s beauty from above", "La beauté de tout un pays vue du ciel") },
];

const thumbnail = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const videoUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

export default function SouthMoroccoVideoCarousel() {
  const { lang } = useLanguage();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(null);

  const updateActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector("[data-video-card]");
    if (!firstCard) return;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    setActive(Math.max(0, Math.min(VIDEOS.length - 1, Math.round(track.scrollLeft / step))));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    track.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => track.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector("[data-video-card]");
    const distance = firstCard ? firstCard.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section id="mar-video-regions" data-testid="mar-video-carousel" className="relative overflow-hidden bg-[#F2EBE1] py-20 md:py-28">
      <div className="absolute inset-0 berber-bg-diamond opacity-35 pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C16542]">
              <Film className="h-4 w-4" strokeWidth={1.5} />
              {pick(COPY.eyebrow, lang)}
            </span>
            <h2 className="mt-5 max-w-4xl font-serif-x text-4xl font-normal leading-[1.04] tracking-tight text-[#2C2621] sm:text-5xl lg:text-6xl">
              {pick(COPY.title, lang)}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-sm leading-relaxed text-[#5C5248] sm:text-base">{pick(COPY.body, lang)}</p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => move(-1)}
                disabled={active === 0}
                aria-label={pick(COPY.previous, lang)}
                data-testid="mar-video-prev"
                className="flex h-12 w-12 items-center justify-center border border-[#2C2621]/20 bg-[#FDFBF7] text-[#2C2621] transition-colors hover:border-[#C16542] hover:text-[#C16542] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                disabled={active >= VIDEOS.length - 1}
                aria-label={pick(COPY.next, lang)}
                data-testid="mar-video-next"
                className="flex h-12 w-12 items-center justify-center border border-[#2C2621]/20 bg-[#FDFBF7] text-[#2C2621] transition-colors hover:border-[#C16542] hover:text-[#C16542] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </button>
              <span className="ml-2 text-[10px] uppercase tracking-[0.24em] text-[#74685E]" aria-live="polite">
                {String(active + 1).padStart(2, "0")} / {String(VIDEOS.length).padStart(2, "0")} {pick(COPY.counter, lang)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        data-testid="mar-video-track"
        className="relative mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 md:mt-16 md:gap-6 md:px-[max(3rem,calc((100vw-80rem)/2+3rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {VIDEOS.map((video, index) => (
          <button
            key={video.id}
            type="button"
            data-video-card
            data-testid={`mar-video-card-${video.id}`}
            onClick={() => setSelected(video)}
            aria-label={`${pick(COPY.play, lang)}: ${pick(video.title, lang)}`}
            className="group relative w-[82vw] max-w-[430px] shrink-0 snap-start overflow-hidden bg-[#1A1513] text-left text-white shadow-[0_28px_65px_-32px_rgba(26,21,19,.75)] sm:w-[58vw] lg:w-[31vw]"
          >
            <span className="relative block aspect-video overflow-hidden bg-black">
              <Img
                src={thumbnail(video.id)}
                alt={pick(video.title, lang)}
                width={960}
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 58vw, 31vw"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/25" aria-hidden="true" />
              <span className="absolute left-5 top-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/85">
                {String(index + 1).padStart(2, "0")} · {pick(video.region, lang)}
              </span>
              <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/55 bg-[#C16542]/95 shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-6 w-6 fill-current" strokeWidth={1.4} />
                </span>
              </span>
            </span>
            <span className="block min-h-[132px] px-6 py-6">
              <span className="block font-serif-x text-2xl leading-[1.12]">{pick(video.title, lang)}</span>
              <span className="mt-4 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#D4A373]">
                {pick(COPY.play, lang)}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.6} />
              </span>
            </span>
          </button>
        ))}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(isOpen) => { if (!isOpen) setSelected(null); }}>
        <DialogContent
          data-testid="mar-video-carousel-modal"
          closeLabel={pick(COPY.close, lang)}
          overlayClassName="z-[12100] bg-[#120E0C]/90 backdrop-blur-sm"
          className="z-[12110] w-[calc(100%-1.25rem)] max-w-6xl gap-0 overflow-hidden border border-white/15 bg-[#120E0C] p-0 text-white shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)] sm:rounded-none [&>button]:right-3 [&>button]:top-3 [&>button]:z-20 [&>button]:bg-black/60 [&>button]:p-2 [&>button]:text-white [&>button]:opacity-100"
        >
          {selected && (
            <>
              <div className="sr-only">
                <DialogTitle>{pick(selected.title, lang)}</DialogTitle>
                <DialogDescription>{pick(selected.region, lang)}</DialogDescription>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  data-testid="mar-video-carousel-iframe"
                  src={`https://www.youtube-nocookie.com/embed/${selected.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={pick(selected.title, lang)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.24em] text-[#D4A373]">{pick(selected.region, lang)}</span>
                  <p className="mt-1 font-serif-x text-xl sm:text-2xl">{pick(selected.title, lang)}</p>
                </div>
                <a
                  href={videoUrl(selected.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-[#D4A373] hover:text-white"
                >
                  {pick(COPY.youtube, lang)}
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.6} />
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
