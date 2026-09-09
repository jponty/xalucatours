import React, { useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  title: T("Estamos preparando su mensaje", "We’re preparing their message", "Nous préparons son message"),
  beforeName: T("Muy pronto podrás escuchar el mensaje personal de ", "Soon you’ll be able to hear a personal message from ", "Très bientôt, vous pourrez écouter le message personnel de "),
  afterName: T(" y conocer de primera mano su historia y su visión de Xaluca.", " and discover their story and vision for Xaluca in their own words.", " et découvrir son histoire et sa vision de Xaluca à travers ses propres mots."),
  soon: T("Próximamente disponible.", "Coming soon.", "Bientôt disponible."),
  close: T("Cerrar", "Close", "Fermer"),
};

// Leave src empty until this founder's own recording is available. Adding the
// final URL enables the existing player without changing the surrounding card.
export default function FounderAudioButton({ src = null, founderName, playLabel, pauseLabel, testid }) {
  const { lang } = useLanguage();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio && window.__xalucaFounderAudio === audio) {
        audio.pause();
        delete window.__xalucaFounderAudio;
      }
    };
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (window.__xalucaFounderAudio && window.__xalucaFounderAudio !== audio) {
        window.__xalucaFounderAudio.pause();
      }
      window.__xalucaFounderAudio = audio;
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  };

  const button = (
    <button
      type="button"
      onClick={src ? toggle : undefined}
      data-testid={testid}
      aria-pressed={src ? playing : undefined}
      aria-label={playing ? pauseLabel : playLabel}
      className={`inline-flex min-h-11 items-center gap-2.5 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C16542] ${playing
        ? "bg-[#C16542] text-[#FDFBF7]"
        : "border border-[#C16542]/40 text-[#C16542] hover:bg-[#C16542] hover:text-[#FDFBF7]"}`}
    >
      {playing ? <Pause className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" /> : <Play className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />}
      {playing ? pauseLabel : playLabel}
    </button>
  );

  if (!src) return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent
        data-testid={`${testid}-pending-modal`}
        overlayClassName="z-[190]"
        closeLabel={pick(COPY.close, lang)}
        className="z-[200] w-[calc(100%-2rem)] max-w-lg max-h-[90dvh] overflow-y-auto gap-0 border border-[#2C2621]/15 bg-[#FDFBF7] p-6 text-left text-[#2C2621] shadow-[0_30px_80px_-30px_rgba(26,21,19,0.65)] sm:rounded-none sm:p-9"
      >
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#C16542]/20 bg-[#C16542]/10 text-[#C16542]" aria-hidden="true"><Headphones className="h-5 w-5" strokeWidth={1.5} /></span>
        <DialogTitle className="pr-4 font-serif-x text-3xl font-normal leading-tight tracking-normal sm:text-4xl">{pick(COPY.title, lang)}</DialogTitle>
        <DialogDescription className="mt-5 text-sm leading-7 text-[#675D54] sm:text-base">
          {pick(COPY.beforeName, lang)}<strong className="font-semibold text-[#2C2621]">{founderName}</strong>{pick(COPY.afterName, lang)}
        </DialogDescription>
        <p className="mt-5 text-xs font-semibold text-[#9C482C]">{pick(COPY.soon, lang)}</p>
        <div className="mt-7 border-t border-[#2C2621]/10 pt-6 sm:text-right">
          <DialogClose asChild>
            <button type="button" data-testid={`${testid}-pending-close`} className="min-h-12 w-full bg-[#C16542] px-7 py-3 text-[11px] uppercase tracking-[0.18em] text-[#FDFBF7] transition-colors hover:bg-[#A35133] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C16542] sm:w-auto">{pick(COPY.close, lang)}</button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );

  return <>{button}<audio ref={audioRef} src={src} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} /></>;
}
