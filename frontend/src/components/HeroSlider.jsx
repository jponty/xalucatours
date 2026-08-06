import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Phone, Mail, Headset, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { translations } from "@/lib/i18n";
import EditableText from "@/components/EditableText";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";
import HeroMonogram from "@/components/HeroMonogram";
import { preloadImageLink } from "@/lib/imageUrl";
import { requestIdealTripWizard } from "@/components/IdealTripWizard";
/* ============================================================
   Hero (formerly HeroSlider)
   ----
   Full-bleed background video using a native <video> element
   (muted autoplay + seamless loop + playsInline, no chrome).
   The clip is layered under a brand-coloured gradient + berber
   pattern so the title, CTAs and quick-contact pill stay legible.

   • Source: Sendspark video (delivered via Mux progressive mp4).
   • object-cover keeps the 16:9 clip filling any viewport.
   • Component kept named `HeroSlider` to avoid touching imports.
============================================================ */
const HERO_VIDEO_SRC = "https://stream.mux.com/HlwGpYi2dBcP007P3601vNiRiY9acrPyBB/high.mp4";
const HERO_VIDEO_POSTER =
  "https://image.mux.com/HlwGpYi2dBcP007P3601vNiRiY9acrPyBB/thumbnail.jpg?width=1280&time=0";

const ASSISTANT_LABEL = { es: "Asistente Virtual", en: "Virtual Assistant", fr: "Assistant Virtuel" };
const VIEW_TRIPS_LABEL = { es: "Ver viajes", en: "View trips", fr: "Voir les voyages" };
const IDEAL_TRIP_LABEL = { es: "Encontrar viaje ideal", en: "Find ideal journey", fr: "Trouver le voyage idéal" };

// Open the Chatbase virtual assistant (centralised in lib/chatbase).
import { openChatbaseAssistant } from "@/lib/chatbase";

const HERO_PLACE = {
  en: "Morocco · From north to south",
  fr: "Maroc · Du nord au sud",
  es: "Marruecos · De norte a sur",
};

export const HeroSlider = () => {
  const { lang } = useLanguage();
  const videoRef = useRef(null);

  /* Force muted autoplay (some mobile browsers ignore the attribute alone). */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => { /* autoplay blocked — poster shows */ });
  }, []);

  /* Preload the video poster (the home LCP element shown before the clip
     plays) at high priority so it appears as fast as possible. */
  useEffect(() => preloadImageLink(HERO_VIDEO_POSTER, { width: 1280 }), []);

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
        <video
          ref={videoRef}
          data-testid="hero-video"
          className="absolute inset-0 w-full h-full object-cover select-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_VIDEO_POSTER}
          tabIndex={-1}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      {/* ---------- Legibility overlays (in order, bottom → top) ---------- */}
      {/* 1. Brand-tinted dark gradient — readability for the headline */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/65 to-[#1A1513]/45 pointer-events-none" />
      {/* 2. Vignette + side fade for any letterbox slivers on ultrawide screens */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(26,21,19,0.6)_100%)] pointer-events-none" />
      {/* 3. Berber pattern + film-grain (consistent with the rest of the site) */}
      <div className="absolute inset-0 berber-bg-cross opacity-30 pointer-events-none" aria-hidden="true" />
      <span className="film-grain" />
      {/* 4. Bottom-right corner mask — hides the Xaluca watermark baked into the
            background video, blending into the existing brand vignette. */}
      <div
        className="absolute bottom-0 right-0 w-80 h-64 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(130% 130% at 100% 100%, #1A1513 0%, rgba(26,21,19,0.92) 42%, rgba(26,21,19,0) 75%)" }}
        aria-hidden="true"
      />
      {/* Xaluca brand monogram integrated into the bottom-right edge (desktop). */}
      <HeroMonogram zClass="z-[3]" />

      {/* ---------- Foreground content ---------- */}
      <div className="relative z-10 min-h-[100svh] flex flex-col">
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
                  <EditableText
                    slot="home.hero.place"
                    defaults={HERO_PLACE}
                    as="span"
                    multiline={false}
                  />
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
                <Link
                  to={pathFor(lang, "planTrip")}
                  data-testid="hero-cta-primary"
                  className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  <EditableText
                    slot="home.hero.cta_primary"
                    defaults={translations.cta_plan}
                    multiline={false}
                  />
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
                </Link>
                <Link
                  to={pathFor(lang, "toursLanding")}
                  data-testid="hero-cta-tours"
                  className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300 whitespace-nowrap"
                >
                  <EditableText
                    slot="home.hero.cta_tours"
                    defaults={VIEW_TRIPS_LABEL}
                    multiline={false}
                  />
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </Link>
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
                <button
                  type="button"
                  onClick={openChatbaseAssistant}
                  data-testid="hero-cta-assistant"
                  className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300 whitespace-nowrap"
                >
                  <Headset className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
                  <EditableText
                    slot="home.hero.cta_assistant"
                    defaults={ASSISTANT_LABEL}
                    multiline={false}
                  />
                </button>
                <button
                  type="button"
                  onClick={requestIdealTripWizard}
                  data-testid="hero-cta-ideal-trip"
                  className="inline-flex items-center gap-3 border border-[#D4A373]/70 bg-[#D4A373]/10 px-7 py-4 text-[11px] uppercase tracking-[0.25em] text-[#FDFBF7] transition-all duration-300 hover:border-[#D4A373] hover:bg-[#D4A373] hover:text-[#1A1513] whitespace-nowrap"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                  <EditableText
                    slot="home.hero.cta_ideal_trip"
                    defaults={IDEAL_TRIP_LABEL}
                    multiline={false}
                  />
                </button>
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
