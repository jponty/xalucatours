import React, { useEffect, useRef } from "react";
import { ArrowRight, Compass, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONTACT } from "@/lib/data";
import { translations } from "@/lib/i18n";
import EditableText from "@/components/EditableText";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";

/* ============================================================
   Hero (formerly HeroSlider)
   ----
   The hero now uses a YouTube video as a full-bleed background
   instead of a cross-fading image carousel. The video is muted,
   loops automatically, hides its native controls, and is layered
   under a brand-coloured gradient + berber pattern so the title,
   CTAs and quick-contact pill stay perfectly legible.

   • Source: https://www.youtube.com/watch?v=yo38KP4ikfg
   • Aspect-cover trick: the iframe is sized with `vh/vw` so it
     always covers the 16:9-shaped section regardless of viewport
     orientation. `pointer-events-none` prevents accidental clicks
     on the YouTube surface and `tabindex=-1` keeps it out of the
     keyboard flow.
   • Component kept named `HeroSlider` to avoid touching imports
     elsewhere; default export is the same.
============================================================ */
const VIDEO_ID = "yo38KP4ikfg";

/* Lazy-load the YouTube IFrame Player API exactly once (shared promise). */
let ytApiPromise = null;
const loadYouTubeAPI = () => {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      resolve(window.YT);
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
  return ytApiPromise;
};

const HERO_PLACE = {
  en: "Morocco · From north to south",
  fr: "Maroc · Du nord au sud",
  es: "Marruecos · De norte a sur",
};

export const HeroSlider = () => {
  const { lang } = useLanguage();
  const stageRef = useRef(null);

  /* ---- Background video driven by the YouTube IFrame API ----
     No native chrome at all: muted autoplay, seamless loop, and the
     end-screen / related-video grid is skipped by looping back ~1.2s
     before the clip actually ends. The iframe is pointer-events-none
     and the whole surface is over-scaled + cropped so the title bar
     (top) and any branding/progress (bottom) sit outside the frame. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const holder = document.createElement("div");
    holder.className = "absolute inset-0 w-full h-full";
    stage.appendChild(holder);

    let cancelled = false;
    let player = null;
    let loopTimer = null;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !YT) return;
      player = new YT.Player(holder, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: VIDEO_ID,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          fs: 0,
          disablekb: 1,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e) => {
            try {
              e.target.mute();
              e.target.playVideo();
              const f = e.target.getIframe && e.target.getIframe();
              if (f) {
                f.setAttribute("title", "Marruecos · vídeo de fondo");
                f.setAttribute("tabindex", "-1");
                f.setAttribute("aria-hidden", "true");
              }
            } catch (_) { /* noop */ }
            // Skip the YouTube end-screen by looping just before the end.
            loopTimer = window.setInterval(() => {
              try {
                const d = e.target.getDuration ? e.target.getDuration() : 0;
                const c = e.target.getCurrentTime ? e.target.getCurrentTime() : 0;
                if (d > 0 && c >= d - 1.2) {
                  e.target.seekTo(0, true);
                  e.target.playVideo();
                }
              } catch (_) { /* noop */ }
            }, 400);
          },
          onStateChange: (e) => {
            const S = window.YT.PlayerState;
            if (e.data === S.ENDED) {
              try {
                e.target.seekTo(0, true);
                e.target.playVideo();
              } catch (_) { /* noop */ }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (loopTimer) window.clearInterval(loopTimer);
      try { if (player && player.destroy) player.destroy(); } catch (_) { /* noop */ }
      stage.innerHTML = "";
    };
  }, []);

  return (
    <section
      data-testid="hero-section"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#1A1513]"
    >
      {/* ---------- Background video ---------- */}
      <div
        data-testid="hero-bg-video"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Aspect-cover wrapper + extra scale so the YouTube title bar
            (top) and any progress/branding (bottom) are cropped away. */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.35]"
          style={{
            width:  "max(100vw, calc(100vh * 16 / 9))",
            height: "max(100vh, calc(100vw * 9 / 16))",
          }}
        >
          <div ref={stageRef} className="relative w-full h-full pointer-events-none select-none" />
        </div>
      </div>

      {/* ---------- Legibility overlays (in order, bottom → top) ---------- */}
      {/* 1. Brand-tinted dark gradient — readability for the headline */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/65 to-[#1A1513]/45 pointer-events-none" />
      {/* 2. Vignette + side fade for any letterbox slivers on ultrawide screens */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(26,21,19,0.6)_100%)] pointer-events-none" />
      {/* 3. Berber pattern + film-grain (consistent with the rest of the site) */}
      <div className="absolute inset-0 berber-bg-cross opacity-30 pointer-events-none" aria-hidden="true" />
      <span className="film-grain" />

      {/* ---------- Foreground content ---------- */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex items-end pt-32 md:pt-44 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-3xl">
              <img
                src={grupXalucaLogo}
                alt="Grup Xaluca · Morocco"
                data-testid="hero-logo"
                className="fade-up h-20 md:h-24 w-auto mb-7 drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] select-none"
                loading="eager"
                decoding="async"
              />
              <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
                <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
                <EditableText
                  slot="home.hero.eyebrow"
                  defaults={translations.hero_eyebrow}
                  multiline={false}
                  className="text-[11px] tracking-[0.35em] uppercase font-semibold"
                />
                <span className="w-8 h-px bg-[#D4A373]/50" />
                <span
                  data-testid="hero-place"
                  className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80"
                >
                  {HERO_PLACE[lang] || HERO_PLACE.es}
                </span>
              </div>

              <EditableText
                as="h1"
                slot="home.hero.title"
                defaults={translations.hero_title}
                multiline={false}
                className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-on-image text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 block"
              />

              <EditableText
                as="p"
                slot="home.hero.sub"
                defaults={translations.hero_sub}
                className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/90 leading-relaxed text-on-image block"
              />

              <EditableText
                as="p"
                slot="home.hero.support"
                defaults={translations.hero_support}
                className="fade-up fade-up-delay-3 mt-4 max-w-2xl text-sm md:text-base text-[#FDFBF7]/75 leading-relaxed text-on-image block"
              />

              <div className="fade-up fade-up-delay-4 mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  data-testid="hero-cta-primary"
                  className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  <EditableText
                    slot="home.hero.cta_primary"
                    defaults={translations.cta_plan}
                    multiline={false}
                  />
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
                </a>
                <a
                  href="#categories"
                  data-testid="hero-cta-secondary"
                  className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
                >
                  <EditableText
                    slot="home.hero.cta_secondary"
                    defaults={translations.cta_explore_routes}
                    multiline={false}
                  />
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </div>

              {/* Quick contact pill */}
              <div className="fade-up fade-up-delay-4 mt-10 inline-flex flex-wrap items-center gap-x-6 gap-y-3 bg-[#1A1513]/55 backdrop-blur-md border border-[#FDFBF7]/15 px-5 py-3"
                   data-testid="hero-quick-contact">
                <EditableText
                  slot="home.hero.quick_label"
                  defaults={translations.hero_quick}
                  multiline={false}
                  className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]"
                />
                <a
                  href={`tel:${CONTACT.phoneRaw}`}
                  data-testid="hero-phone"
                  className="inline-flex items-center gap-2 text-sm text-[#FDFBF7] hover:text-[#D4A373] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.5} />
                  {CONTACT.phone}
                </a>
                <span className="w-px h-4 bg-[#FDFBF7]/20 hidden sm:inline-block" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  data-testid="hero-email"
                  className="inline-flex items-center gap-2 text-sm text-[#FDFBF7] hover:text-[#D4A373] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={1.5} />
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
