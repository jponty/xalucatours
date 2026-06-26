import React, { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Headset } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { EditableImage } from "@/components/EditableImage";
import {
  subscribeNarration,
  getNarrationState,
  toggleNarration,
  toggleNarrationMuted,
} from "@/lib/narrationStore";

// Open the Chatbase virtual assistant (centralised in lib/chatbase).
import { openChatbaseAssistant } from "@/lib/chatbase";

/* Shared placeholder narration. Every cinematic VideoSection currently plays
   this same audio until page-specific narrations are provided (the caller can
   override it per section via the `audioSrc` prop). */
const DEFAULT_NARRATION_AUDIO =
  "https://customer-assets.emergentagent.com/job_0632360a-eb69-4f78-ae22-95f777acd98d/artifacts/ind8dgb7_ElevenLabs_Xaluca_Tours_Sur_de_Marruecos.mp3";

/* ----------------------------------------------------------------
   <VideoSection />
   Inmersive, cinematic responsive media block.

   Supports two modes (identical visual design / UX):
     • Video mode (default): plays a muted, looping background video.
     • Audio mode: when `audioSrc` is provided, the section keeps the
       editorial poster as background and the Play / Mute controls
       drive a single GLOBAL narration (see lib/narrationStore). The
       narration keeps playing in the background across page
       navigation until the user stops it.
---------------------------------------------------------------- */
export default function VideoSection({
  src,
  audioSrc = DEFAULT_NARRATION_AUDIO,
  poster,
  eyebrow,
  title,
  caption,
  testid = "video-section",
  autoPlay = true,
}) {
  const { lang } = useLanguage();
  const { editMode } = useEditMode();
  const isAudio = Boolean(audioSrc);
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  /* -------- Audio mode: reflect the global narration state -------- */
  const [narration, setNarration] = useState(getNarrationState());
  useEffect(() => {
    if (!isAudio) return undefined;
    return subscribeNarration(setNarration);
  }, [isAudio]);

  const isCurrent = isAudio && narration.src === audioSrc;
  const audioPlaying = isCurrent && narration.playing;
  const audioMuted = isCurrent && narration.muted;

  const scrollSectionIntoView = useCallback(() => {
    const sec = document.querySelector(`[data-testid="${testid}"]`);
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    const vh = window.innerHeight;
    const centeredVisible = r.top < vh * 0.5 && r.bottom > vh * 0.5;
    if (!centeredVisible) sec.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [testid]);

  /* -------- Video mode controls -------- */
  const [videoPlaying, setVideoPlaying] = useState(autoPlay);
  const [videoMuted, setVideoMuted] = useState(true);

  const togglePlay = useCallback(() => {
    if (isAudio) {
      const willStart = !audioPlaying;
      toggleNarration(audioSrc, {
        title: title ? pick(title, lang) : "",
        eyebrow: eyebrow ? pick(eyebrow, lang) : "",
        sectionTestId: testid,
      });
      if (willStart) scrollSectionIntoView();
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setVideoPlaying(true);
    } else {
      v.pause();
      setVideoPlaying(false);
    }
  }, [isAudio, audioPlaying, audioSrc, title, eyebrow, lang, testid, scrollSectionIntoView]);

  const toggleMute = useCallback(() => {
    if (isAudio) {
      if (isCurrent) toggleNarrationMuted();
      else
        // not the active narration yet — start it (unmuted)
        toggleNarration(audioSrc, {
          title: title ? pick(title, lang) : "",
          eyebrow: eyebrow ? pick(eyebrow, lang) : "",
          sectionTestId: testid,
        });
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVideoMuted(v.muted);
  }, [isAudio, isCurrent, audioSrc, title, eyebrow, lang, testid]);

  // Video mode: pause when off-screen for performance; autoplay back when visible.
  useEffect(() => {
    if (isAudio) return undefined;
    const v = videoRef.current;
    if (!v) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          v.pause();
          setVideoPlaying(false);
        } else if (autoPlay) {
          v.play().catch(() => {});
          setVideoPlaying(true);
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, [autoPlay, isAudio]);

  const playing = isAudio ? audioPlaying : videoPlaying;
  const muted = isAudio ? audioMuted : videoMuted;

  /* Editorial text (eyebrow / title / caption). Reused in two responsive
     slots: as a cinematic OVERLAY on `md+`, and BELOW the media on mobile
     (where the short 16/9 box would otherwise clip it). No data-testid here,
     so rendering it in both slots creates no duplicate test ids. */
  const textContent = (
    <>
      {eyebrow && (
        <span className="block text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#D4A373] mb-3">
          {pick(eyebrow, lang)}
        </span>
      )}
      {title && (
        <h3 className="font-serif-x text-2xl md:text-3xl lg:text-4xl text-[#FDFBF7] leading-[1.15] md:leading-[1.1]">
          {pick(title, lang)}
        </h3>
      )}
      {caption && (
        <p className="mt-3 text-sm md:text-base text-[#FDFBF7]/80 leading-relaxed">
          {pick(caption, lang)}
        </p>
      )}
    </>
  );

  return (
    <section
      data-testid={testid}
      className="relative bg-[#1A1513] py-12 md:py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl md:rounded-2xl shadow-2xl bg-[#2C2621] group">
          {/* Editable poster layer — the still image of this section. In
              video mode it sits behind the video; in audio mode it is the
              permanent cinematic background. */}
          <EditableImage
            slot={`video.${testid}.poster`}
            fallback={poster}
            alt={title ? pick(title, lang) : ""}
            aspectRatio="16/9"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {!isAudio && (
            <video
              ref={videoRef}
              data-testid={`${testid}-video`}
              src={src}
              playsInline
              loop
              muted
              autoPlay={autoPlay}
              preload="metadata"
              onLoadedData={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                editMode ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />
          )}

          {/* Cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/80 via-[#1A1513]/15 to-[#1A1513]/30 pointer-events-none" />
          <span className="film-grain pointer-events-none" />

          {/* Caption layer — text shown as a cinematic overlay only from `md`
              upward (where the box is tall enough). Controls stay overlaid at
              all sizes. */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pointer-events-none">
            <div className="hidden md:block max-w-xl">
              {textContent}
            </div>

            {/* Controls */}
            <div className="pointer-events-auto inline-flex items-center gap-2 self-end md:self-auto">
              <button
                type="button"
                onClick={togglePlay}
                data-testid={`${testid}-toggle-play`}
                aria-label={playing ? "Pause" : "Play"}
                className="inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#FDFBF7]/12 hover:bg-[#FDFBF7]/25 backdrop-blur-md border border-[#FDFBF7]/30 text-[#FDFBF7] transition-colors"
              >
                {playing ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.6} />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5 translate-x-[1px]" strokeWidth={1.6} />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                data-testid={`${testid}-toggle-mute`}
                aria-label={muted ? "Unmute" : "Mute"}
                className="inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#FDFBF7]/12 hover:bg-[#FDFBF7]/25 backdrop-blur-md border border-[#FDFBF7]/30 text-[#FDFBF7] transition-colors"
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.6} />
                ) : (
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.6} />
                )}
              </button>
              <button
                type="button"
                onClick={openChatbaseAssistant}
                data-testid={`${testid}-assistant`}
                aria-label="Asistente Virtual"
                title="Asistente Virtual"
                className="inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#FDFBF7]/12 hover:bg-[#FDFBF7]/25 backdrop-blur-md border border-[#FDFBF7]/30 text-[#FDFBF7] transition-colors"
              >
                <Headset className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.6} />
              </button>
            </div>
          </div>

          {/* Loading shimmer (video mode only) */}
          {!isAudio && !loaded && !editMode && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C2621] via-[#3A2E25] to-[#2C2621] animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Mobile only: full editorial text below the media so it is never
            clipped by the short 16/9 box. Hidden from `md` upward (overlay). */}
        <div className="md:hidden mt-6 max-w-xl">
          {textContent}
        </div>

      </div>
    </section>
  );
}
