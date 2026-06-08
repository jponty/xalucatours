import React, { useEffect, useState } from "react";
import { Play, Pause, X, AudioLines } from "lucide-react";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";
import {
  subscribeNarration,
  getNarrationState,
  clearNarration,
} from "@/lib/narrationStore";

/* ----------------------------------------------------------------
   <NarrationMiniPlayer />
   Floating "Ahora suena…" pill. Appears whenever a VideoSection
   narration is active and lets the user play / pause and jump back
   to the section from anywhere on the page. Mounted once globally
   in <Layout/>.
---------------------------------------------------------------- */
export default function NarrationMiniPlayer() {
  const [snap, setSnap] = useState(getNarrationState());

  useEffect(() => subscribeNarration(setSnap), []);

  const { el, title, eyebrow, playing } = snap;
  if (!el) return null;

  const toggle = () => {
    const node = getNarrationState().el;
    if (!node) return;
    if (node.paused) node.play().catch(() => {});
    else node.pause();
  };

  const goToSection = () => {
    const node = getNarrationState().el;
    const sec = node && node.closest("section");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const close = () => {
    const node = getNarrationState().el;
    if (node) {
      try {
        node.pause();
        node.currentTime = 0;
      } catch {
        /* element may already be detached */
      }
    }
    clearNarration(node);
  };

  return (
    <div
      data-testid="narration-mini-player"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md"
    >
      <div className="flex items-center gap-3 rounded-full bg-[#1A1513]/95 backdrop-blur-md border border-[#D4A373]/30 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] pl-3 pr-2 py-2">
        {/* Xaluca brand logo */}
        <img
          src={grupXalucaLogo}
          alt="Xaluca"
          data-testid="narration-mini-logo"
          className="shrink-0 w-8 h-8 md:w-9 md:h-9 object-contain select-none"
        />

        {/* Play / Pause */}
        <button
          type="button"
          onClick={toggle}
          data-testid="narration-mini-toggle"
          aria-label={playing ? "Pausar narración" : "Reproducir narración"}
          className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#D4A373] text-[#1A1513] hover:bg-[#e0b487] transition-colors"
        >
          {playing ? (
            <Pause className="w-4 h-4" strokeWidth={2} fill="currentColor" />
          ) : (
            <Play className="w-4 h-4 translate-x-[1px]" strokeWidth={2} fill="currentColor" />
          )}
        </button>

        {/* Meta — click jumps to the section */}
        <button
          type="button"
          onClick={goToSection}
          data-testid="narration-mini-goto"
          className="flex-1 min-w-0 text-left"
        >
          <span className="flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase text-[#D4A373]">
            <AudioLines
              className={`w-3 h-3 ${playing ? "animate-pulse" : ""}`}
              strokeWidth={1.8}
            />
            {playing ? "Ahora suena" : "En pausa"}
          </span>
          <span className="block truncate text-sm text-[#FDFBF7] leading-tight mt-0.5">
            {eyebrow || title || "Narración"}
          </span>
        </button>

        {/* Close */}
        <button
          type="button"
          onClick={close}
          data-testid="narration-mini-close"
          aria-label="Cerrar narración"
          className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full text-[#FDFBF7]/60 hover:text-[#FDFBF7] hover:bg-[#FDFBF7]/10 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
