/* ============================================================
   BackgroundMusic — ambient soundtrack control for the navbar.
   Plays a looping MP3 on its own <audio> layer so it runs
   independently from the audio guides (both can play at once).
   Controls: play/pause, mute/unmute, volume and stop.
============================================================ */
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Music, Play, Pause, Square, Volume2, VolumeX } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useLanguage, pick } from "@/contexts/LanguageContext";

const SRC = "/background-music.mp3";

const COPY = {
  aria:    { es: "Música de ambiente", en: "Background music", fr: "Musique d'ambiance" },
  title:   { es: "Música de ambiente", en: "Background music", fr: "Musique d'ambiance" },
  note:    {
    es: "Suena junto a las audioguías, sin interrumpirlas.",
    en: "Plays alongside the audio guides, without interrupting them.",
    fr: "Joue en même temps que les audioguides, sans les interrompre.",
  },
  play:    { es: "Reproducir", en: "Play",  fr: "Lire" },
  pause:   { es: "Pausar",     en: "Pause", fr: "Pause" },
  stop:    { es: "Detener",    en: "Stop",  fr: "Arrêter" },
  mute:    { es: "Silenciar",  en: "Mute",  fr: "Couper" },
  unmute:  { es: "Activar sonido", en: "Unmute", fr: "Activer le son" },
  volume:  { es: "Volumen",    en: "Volume", fr: "Volume" },
  label:   { es: "Música",     en: "Music",  fr: "Musique" },
};

export default function BackgroundMusic({ variant = "navbar" }) {
  const { lang } = useLanguage();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);

  /* Keep the audio element in sync with volume / mute state. */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const togglePlay = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
      } catch (_) {
        /* autoplay/gesture issues — state synced via events */
      }
    } else {
      a.pause();
    }
  }, []);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const onVolume = useCallback((vals) => {
    const v = (vals?.[0] ?? 0) / 100;
    setVolume(v);
    if (v > 0 && muted) setMuted(false);
  }, [muted]);

  return (
    <>
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="auto"
        data-testid="bg-music-audio"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <Popover>
        <PopoverTrigger asChild>
          {variant === "bar" ? (
            <button
              type="button"
              data-testid="bg-music-button"
              aria-label={pick(COPY.aria, lang)}
              title={pick(COPY.title, lang)}
              className="relative inline-flex items-center gap-2 text-[#FDFBF7]/90 hover:text-[#D4A373] transition-colors duration-300 whitespace-nowrap outline-none focus-visible:text-[#D4A373]"
            >
              <Music className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.8} />
              <span className="hidden sm:inline text-[#D4A373] uppercase tracking-[0.2em]">
                {pick(COPY.label, lang)}
              </span>
              {playing && !muted && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] animate-pulse" aria-hidden="true" />
              )}
            </button>
          ) : (
            <button
              type="button"
              data-testid="bg-music-button"
              aria-label={pick(COPY.aria, lang)}
              title={pick(COPY.title, lang)}
              className="relative inline-flex items-center justify-center w-9 h-9 text-[#2C2621] hover:text-[#C16542] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#C16542]/40 rounded-full"
            >
              <Music className="w-[18px] h-[18px]" strokeWidth={1.6} />
              {playing && !muted && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C16542] animate-pulse"
                  aria-hidden="true"
                />
              )}
            </button>
          )}
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={10}
          collisionPadding={12}
          data-testid="bg-music-panel"
          className="w-72 bg-[#FDFBF7] border-[#2C2621]/12 text-[#2C2621] shadow-[0_20px_50px_-20px_rgba(26,21,19,0.4)]"
        >
          <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#C16542] font-semibold">
            <Music className="w-3.5 h-3.5" strokeWidth={1.6} />
            {pick(COPY.title, lang)}
          </div>
          <p className="mt-2 text-[12px] text-[#5C5248] leading-snug">{pick(COPY.note, lang)}</p>

          {/* Transport controls */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              data-testid="bg-music-play-toggle"
              aria-label={pick(playing ? COPY.pause : COPY.play, lang)}
              className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase transition-colors flex-1 justify-center"
            >
              {playing ? <Pause className="w-3.5 h-3.5" strokeWidth={1.8} /> : <Play className="w-3.5 h-3.5" strokeWidth={1.8} />}
              {pick(playing ? COPY.pause : COPY.play, lang)}
            </button>
            <button
              type="button"
              onClick={stop}
              data-testid="bg-music-stop"
              aria-label={pick(COPY.stop, lang)}
              title={pick(COPY.stop, lang)}
              className="inline-flex items-center justify-center w-10 h-10 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors"
            >
              <Square className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          </div>

          {/* Volume + mute */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMute}
              data-testid="bg-music-mute-toggle"
              aria-label={pick(muted ? COPY.unmute : COPY.mute, lang)}
              title={pick(muted ? COPY.unmute : COPY.mute, lang)}
              className="text-[#2C2621] hover:text-[#C16542] transition-colors shrink-0"
            >
              {muted || volume === 0 ? <VolumeX className="w-[18px] h-[18px]" strokeWidth={1.6} /> : <Volume2 className="w-[18px] h-[18px]" strokeWidth={1.6} />}
            </button>
            <Slider
              data-testid="bg-music-volume"
              aria-label={pick(COPY.volume, lang)}
              value={[muted ? 0 : Math.round(volume * 100)]}
              max={100}
              step={1}
              onValueChange={onVolume}
              className="flex-1 [&_[data-orientation=horizontal]>span]:bg-[#C16542]/20 [&_span[role=slider]]:border-[#C16542] [&_.bg-primary]:bg-[#C16542]"
            />
            <span className="text-[11px] text-[#5C5248] w-8 text-right tabular-nums">
              {muted ? 0 : Math.round(volume * 100)}
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
