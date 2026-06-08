import React, { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { EditableImage } from "@/components/EditableImage";

/* Shared placeholder narration. Every cinematic VideoSection currently plays
   this same audio until page-specific narrations are provided (the caller can
   override it per section via the `audioSrc` prop). */
const DEFAULT_NARRATION_AUDIO =
  "https://customer-assets.emergentagent.com/job_0632360a-eb69-4f78-ae22-95f777acd98d/artifacts/ind8dgb7_ElevenLabs_Xaluca_Tours_Sur_de_Marruecos.mp3";

/* Module-level reference to the audio element currently playing across ALL
   VideoSection instances on the page. Ensures only one narration plays at a
   time — starting a new one automatically pauses the previous. */
let activeAudioEl = null;

/* ----------------------------------------------------------------
   <VideoSection />
   Inmersive, cinematic responsive media block. Used below the
   main editorial sections to reinforce the visual narrative.

   Supports two modes (identical visual design / UX):
     • Video mode (default): plays a muted, looping background video.
     • Audio mode: when `audioSrc` is provided, the section keeps the
       editorial poster as background and the Play / Mute controls
       drive an HTML5 <audio> narration instead. No autoplay, volume
       on by default, mute/unmute available.

   Props:
     src       string (mp4 url)
     audioSrc  string (mp3 url) — enables audio mode when present
     poster    string (image url) — fallback while video loads / audio bg
     eyebrow   trilingual {es,en,fr}
     title     trilingual {es,en,fr}
     caption   trilingual {es,en,fr} — short caption shown on hover/mobile
     testid    string
     autoPlay  boolean (video mode only; default true)
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
  const audioRef = useRef(null);
  const sectionRef = useRef(null);
  // Audio mode never autoplays; video mode keeps previous behaviour.
  const [playing, setPlaying] = useState(isAudio ? false : autoPlay);
  // Audio: sound on by default. Video: muted by default (browser policy).
  const [muted, setMuted] = useState(isAudio ? false : true);
  const [loaded, setLoaded] = useState(false);

  const togglePlay = useCallback(() => {
    const m = isAudio ? audioRef.current : videoRef.current;
    if (!m) return;
    if (m.paused) {
      m.play().catch(() => {});
      setPlaying(true);
    } else {
      m.pause();
      setPlaying(false);
    }
  }, [isAudio]);

  const toggleMute = useCallback(() => {
    const m = isAudio ? audioRef.current : videoRef.current;
    if (!m) return;
    m.muted = !m.muted;
    setMuted(m.muted);
  }, [isAudio]);

  // Audio mode: playback must continue while the user stays on the page
  // (scrolling / switching sections must NOT pause or restart it). It is
  // only stopped when the component unmounts (i.e. the user navigates away
  // to another page) — handled by the cleanup below.
  useEffect(() => {
    if (!isAudio) return;
    const el = audioRef.current;
    return () => {
      if (el) {
        if (activeAudioEl === el) activeAudioEl = null;
        el.pause();
        el.currentTime = 0;
      }
    };
  }, [isAudio]);

  // Video mode: pause when off-screen for performance; autoplay back when
  // visible.
  useEffect(() => {
    if (isAudio) return;
    const v = videoRef.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          v.pause();
          setPlaying(false);
        } else if (autoPlay) {
          v.play().catch(() => {});
          setPlaying(true);
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, [autoPlay, isAudio]);

  // Keep play/pause state in sync with native audio events
  const onEnded = useCallback(() => {
    if (activeAudioEl === audioRef.current) activeAudioEl = null;
    setPlaying(false);
  }, []);

  return (
    <section
      ref={sectionRef}
      data-testid={testid}
      className="relative bg-[#1A1513] py-12 md:py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl md:rounded-2xl shadow-2xl bg-[#2C2621] group">
          {/* Editable poster layer — the still image of this section. In
              video mode it sits behind the video; in audio mode it is the
              permanent cinematic background. Detected by the CMS like every
              other <EditableImage>. */}
          <EditableImage
            slot={`video.${testid}.poster`}
            fallback={poster}
            alt={title ? pick(title, lang) : ""}
            aspectRatio="16/9"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {isAudio ? (
            <audio
              ref={audioRef}
              data-testid={`${testid}-audio`}
              src={audioSrc}
              preload="metadata"
              onPlay={(e) => {
                const el = e.currentTarget;
                if (activeAudioEl && activeAudioEl !== el) {
                  activeAudioEl.pause();
                }
                activeAudioEl = el;
                setPlaying(true);
              }}
              onPause={(e) => {
                if (activeAudioEl === e.currentTarget) activeAudioEl = null;
                setPlaying(false);
              }}
              onEnded={onEnded}
              onLoadedMetadata={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              className="hidden"
            />
          ) : (
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

          {/* Caption layer */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pointer-events-none">
            <div className="max-w-xl">
              {eyebrow && (
                <span className="block text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#D4A373] mb-3">
                  {pick(eyebrow, lang)}
                </span>
              )}
              {title && (
                <h3 className="font-serif-x text-2xl md:text-3xl lg:text-4xl text-[#FDFBF7] leading-[1.1]">
                  {pick(title, lang)}
                </h3>
              )}
              {caption && (
                <p className="mt-3 text-sm md:text-base text-[#FDFBF7]/80 leading-relaxed">
                  {pick(caption, lang)}
                </p>
              )}
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
            </div>
          </div>

          {/* Loading shimmer (video mode only) */}
          {!isAudio && !loaded && !editMode && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C2621] via-[#3A2E25] to-[#2C2621] animate-pulse pointer-events-none" />
          )}
        </div>
      </div>
    </section>
  );
}
