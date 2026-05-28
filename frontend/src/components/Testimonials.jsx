import React from "react";
import { Quote, Star, MapPin } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { getTestimonialsForThemes } from "@/lib/testimonials";
import EditableImage from "@/components/EditableImage";

/* ============================================================
   Testimonials — minimalist editorial section
   ------------------------------------------------------------
   Props:
     • eyebrow    — small uppercase tagline (string or trilingual object)
     • title      — section headline (string or trilingual object)
     • subtitle   — supporting copy (string or trilingual object) [optional]
     • themes     — string[] of theme keys (matches lib/testimonials.js)
     • limit      — max number of testimonials to display (default 3)
     • testid     — root data-testid suffix
     • tone       — "cream" | "sand" | "sage"  — controls background palette
============================================================ */
const TONES = {
  cream: { bg: "#F9F2E6", card: "#FFFDF8", border: "#2C2621", quote: "#A07042" },
  sand:  { bg: "#F2EBE1", card: "#FDFBF7", border: "#2C2621", quote: "#C16542" },
  sage:  { bg: "#EAE9DD", card: "#FBFAF3", border: "#3D4A3A", quote: "#5A6B4F" },
};

const SECTION_LABELS = {
  es: {
    default_eyebrow: "Lo que dicen quienes han viajado",
    default_title: "Voces de viajeros que han descubierto Marruecos con Xaluca.",
  },
  en: {
    default_eyebrow: "What travellers say",
    default_title: "Voices from those who discovered Morocco with Xaluca.",
  },
  fr: {
    default_eyebrow: "Ce que disent les voyageurs",
    default_title: "Voix de voyageurs qui ont découvert le Maroc avec Xaluca.",
  },
};

const INTER_FAMILY = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

const Avatar = ({ src, name, tone, slot }) => {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-full overflow-hidden shrink-0"
      style={{ background: tone.bg, color: tone.quote, boxShadow: `inset 0 0 0 1px ${tone.border}22` }}
    >
      {src ? (
        <EditableImage
          slot={slot}
          fallback={src}
          alt={name}
          aspectRatio={1}
          className="w-full h-full object-cover"
          imgProps={{ loading: "lazy" }}
        />
      ) : (
        <span className="text-[12px] tracking-[0.06em]" style={{ fontFamily: INTER_FAMILY, fontWeight: 600 }}>
          {initials}
        </span>
      )}
    </span>
  );
};

const TestimonialCard = ({ t, tone, lang, idx }) => (
  <article
    data-testid={`testimonial-card-${t.id}`}
    style={{
      animationDelay: `${idx * 0.08}s`,
      fontFamily: INTER_FAMILY,
      background: tone.card,
      borderColor: `${tone.border}1A`,
    }}
    className="fade-up fade-up-delay-1 group relative flex flex-col gap-5 p-7 md:p-8 border transition-shadow duration-500 hover:shadow-[0_28px_50px_-30px_rgba(26,21,19,0.28)]"
  >
    <Quote
      className="absolute top-5 right-5 w-7 h-7 opacity-25"
      style={{ color: tone.quote }}
      strokeWidth={1.3}
    />
    <div className="flex items-center gap-1" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className="w-3.5 h-3.5" fill={tone.quote} stroke="none" />
      ))}
    </div>

    <p
      className="text-[15px] md:text-[15.5px] leading-[1.75] text-[#3D352C]"
      style={{ fontFamily: INTER_FAMILY, fontWeight: 400 }}
    >
      “{pick(t.quote, lang)}”
    </p>

    <div className="mt-auto pt-5 flex items-center gap-4 border-t" style={{ borderColor: `${tone.border}14` }}>
      <Avatar src={t.avatar} name={t.name} tone={tone} slot={`testimonial.${t.id}.avatar`} />
      <div className="min-w-0">
        <p className="text-[14.5px] text-[#2C2621] truncate" style={{ fontFamily: INTER_FAMILY, fontWeight: 600 }}>
          {t.name}
        </p>
        <p
          className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[#5C5248] truncate"
          style={{ fontFamily: INTER_FAMILY, fontWeight: 400 }}
        >
          <MapPin className="w-3 h-3 shrink-0" style={{ color: tone.quote }} strokeWidth={1.6} />
          <span className="truncate">{t.location}</span>
          <span className="opacity-40">·</span>
          <span className="truncate">{pick(t.trip, lang)}</span>
        </p>
      </div>
    </div>
  </article>
);

export const Testimonials = ({
  eyebrow,
  title,
  subtitle,
  themes = ["general"],
  limit = 3,
  testid = "testimonials",
  tone = "cream",
  variant = "full", // "full" | "compact"
}) => {
  const { lang } = useLanguage();
  const palette = TONES[tone] || TONES.cream;
  const items = getTestimonialsForThemes(themes, limit);
  if (items.length === 0) return null;

  const labels = SECTION_LABELS[lang] || SECTION_LABELS.es;
  const resolvedEyebrow = eyebrow
    ? (typeof eyebrow === "string" ? eyebrow : pick(eyebrow, lang))
    : labels.default_eyebrow;
  const resolvedTitle = title
    ? (typeof title === "string" ? title : pick(title, lang))
    : labels.default_title;
  const resolvedSub = subtitle
    ? (typeof subtitle === "string" ? subtitle : pick(subtitle, lang))
    : null;

  const isCompact = variant === "compact";
  const sectionCls = isCompact ? "relative py-12 md:py-16" : "relative py-20 md:py-28";
  const containerCls = isCompact
    ? "relative max-w-7xl mx-auto px-6 md:px-12"
    : "relative max-w-7xl mx-auto px-6 md:px-12";
  const headerCls = isCompact ? "max-w-3xl mb-7 md:mb-9" : "max-w-3xl mb-12 md:mb-16";
  const gridCls = isCompact
    ? "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6";

  return (
    <section
      data-testid={testid}
      className={sectionCls}
      style={{ background: palette.bg }}
    >
      <div className={containerCls}>
        <header className={headerCls}>
          <span
            className="inline-flex items-center gap-3 text-[10px] tracking-[0.32em] uppercase"
            style={{ color: palette.quote, fontFamily: INTER_FAMILY, fontWeight: 600 }}
          >
            <span className="w-6 h-px" style={{ background: palette.quote, opacity: 0.5 }} />
            {resolvedEyebrow}
          </span>
          {!isCompact && (
            <h2 className="font-serif-x text-3xl md:text-4xl lg:text-[44px] leading-[1.1] tracking-tight mt-5 text-[#2C2621]">
              {resolvedTitle}
            </h2>
          )}
          {isCompact && (resolvedTitle && resolvedTitle !== labels.default_title) && (
            <h3 className="font-serif-x text-2xl md:text-3xl leading-[1.15] tracking-tight mt-3 text-[#2C2621]">
              {resolvedTitle}
            </h3>
          )}
          {resolvedSub && !isCompact && (
            <p
              className="mt-5 text-[15px] md:text-base text-[#5C5248] leading-[1.8] max-w-2xl"
              style={{ fontFamily: INTER_FAMILY, fontWeight: 400 }}
            >
              {resolvedSub}
            </p>
          )}
        </header>

        <div className={gridCls}>
          {items.map((t, i) => (
            <TestimonialCard key={t.id} t={t} tone={palette} lang={lang} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
