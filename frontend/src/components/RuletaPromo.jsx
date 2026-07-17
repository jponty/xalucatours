import React from "react";
import { Link } from "react-router-dom";
import { Gift, Sparkles, Star, PartyPopper, ArrowRight, Ticket } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import monogramWhite from "@/assets/monograma-x-white.png";

/* ============================================================
   RuletaPromo — playful promo banner for the "Ruleta Xaluca"
   giveaway (/concurso). Fun, surprise & reward vibe: a
   decorative prize wheel that spins slowly, twinkling rim
   lights, floating gift/sparkle icons and a bold CTA.
============================================================ */

const COPY = {
  eyebrow: { es: "La Ruleta Xaluca", en: "The Xaluca Wheel", fr: "La Roue Xaluca" },
  title: {
    es: "Gira la ruleta y llévate un premio",
    en: "Spin the wheel and win a prize",
    fr: "Tournez la roue et gagnez un lot",
  },
  text: {
    es: "Masajes, cenas, estancias, descuentos… y hasta ¡un viaje gratuito! Deja tus datos, gira la ruleta y descubre al instante tu regalo de Xaluca Tours. Sin sorteos ni esperas: siempre hay premio.",
    en: "Massages, dinners, stays, discounts… and even a free trip! Leave your details, spin the wheel and instantly discover your gift from Xaluca Tours. No draws, no waiting: there's always a prize.",
    fr: "Massages, dîners, séjours, réductions… et même un voyage gratuit ! Laissez vos coordonnées, tournez la roue et découvrez aussitôt votre cadeau Xaluca Tours. Sans tirage ni attente : il y a toujours un lot.",
  },
  cta: { es: "Prueba tu suerte", en: "Try your luck", fr: "Tentez votre chance" },
  note: {
    es: "Gratis · Una participación por email",
    en: "Free · One entry per email",
    fr: "Gratuit · Une participation par e-mail",
  },
  f1: { es: "Gira", en: "Spin", fr: "Tournez" },
  f2: { es: "Sorpréndete", en: "Get surprised", fr: "Surprenez-vous" },
  f3: { es: "Gana", en: "Win", fr: "Gagnez" },
  badge: { es: "15 premios", en: "15 prizes", fr: "15 lots" },
};

const SEG_COLORS = [
  "#C16542", "#D4A373", "#7A4A32", "#B8862F",
  "#A35133", "#E0A85C", "#6E2D17", "#C99A5B",
  "#C16542", "#D4A373", "#7A4A32", "#B8862F",
];

const polar = (deg, r) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
};

const STAR = "M0 -5 L1.3 -1.6 L5 -1.6 L2 0.6 L3.1 4.3 L0 2 L-3.1 4.3 L-2 0.6 L-5 -1.6 L-1.3 -1.6 Z";

const DecorWheel = () => {
  const n = SEG_COLORS.length;
  const seg = 360 / n;
  const segments = SEG_COLORS.map((color, i) => {
    const start = i * seg;
    const end = (i + 1) * seg;
    const [x1, y1] = polar(start, 92);
    const [x2, y2] = polar(end, 92);
    const large = seg > 180 ? 1 : 0;
    const d = `M100 100 L ${x1.toFixed(2)} ${y1.toFixed(2)} A 92 92 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    const [sx, sy] = polar(start + seg / 2, 62);
    return { d, color, sx, sy, star: i % 3 === 0 };
  });
  const lights = Array.from({ length: 24 }, (_, i) => {
    const [x, y] = polar(i * 15, 97);
    return { x, y, i };
  });

  return (
    <div className="relative w-[min(78vw,400px)] aspect-square mx-auto select-none" aria-hidden="true">
      {/* Pointer */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-1.5 z-30"
        style={{
          width: 0, height: 0,
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderTop: "30px solid #E0A85C",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))",
        }}
      />
      {/* Bezel + rotating wheel */}
      <div className="absolute inset-0 rounded-full p-3 bg-[#14100E] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-[#E0A85C]/30">
        <div className="relative w-full h-full rounded-full overflow-hidden animate-[ruleta-spin_22s_linear_infinite] motion-reduce:animate-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {segments.map((s, i) => (
              <g key={i}>
                <path d={s.d} fill={s.color} stroke="#FDFBF7" strokeWidth="0.7" />
                {s.star && (
                  <path d={STAR} transform={`translate(${s.sx} ${s.sy}) scale(1.5)`} fill="#FDFBF7" fillOpacity="0.85" />
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>
      {/* Twinkling rim lights (static ring, on top of the spinning wheel) */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {lights.map((l) => (
          <circle
            key={l.i}
            cx={l.x} cy={l.y} r="2.4"
            fill={l.i % 2 ? "#E0A85C" : "#FDFBF7"}
            className="animate-[ruleta-twinkle_1.8s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{ animationDelay: `${(l.i % 6) * 0.12}s` }}
          />
        ))}
      </svg>
      {/* Hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[20%] h-[20%] rounded-full bg-[#1A1513] border-[3px] border-[#E0A85C] shadow-lg flex items-center justify-center">
        <img src={monogramWhite} alt="" className="w-1/2 h-1/2 object-contain" />
      </div>
    </div>
  );
};

const Float = ({ icon: Icon, className, delay = 0 }) => (
  <span
    className={`absolute z-30 text-[#E0A85C] animate-[ruleta-float_4s_ease-in-out_infinite] motion-reduce:animate-none ${className}`}
    style={{ animationDelay: `${delay}s` }}
    aria-hidden="true"
  >
    <Icon className="w-full h-full" strokeWidth={1.6} />
  </span>
);

const Step = ({ n, label }) => (
  <span className="inline-flex items-center gap-2 text-[13px] tracking-[0.04em] text-[#FDFBF7]/85">
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C16542] text-[#FDFBF7] text-[11px] font-semibold">{n}</span>
    {label}
  </span>
);

export default function RuletaPromo() {
  const { lang } = useLanguage();
  return (
    <section data-testid="home-ruleta-promo" className="relative bg-[#1A1513] text-[#FDFBF7] overflow-hidden">
      <style>{`
        @keyframes ruleta-spin { to { transform: rotate(360deg); } }
        @keyframes ruleta-twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes ruleta-float { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-14px) rotate(6deg); } }
      `}</style>

      {/* Warm glow + pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,rgba(224,168,92,0.20),transparent_55%),radial-gradient(circle_at_10%_15%,rgba(193,101,66,0.22),transparent_50%)]" aria-hidden="true" />
      <div className="absolute inset-0 berber-bg-diamond opacity-[0.07] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E0A85C]/60 to-transparent" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <span className="overline inline-flex items-center gap-2 text-[#E0A85C]">
            <PartyPopper className="w-4 h-4" strokeWidth={1.8} /> {pick(COPY.eyebrow, lang)}
          </span>
          <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.06] tracking-tight mt-4">
            {pick(COPY.title, lang)}
          </h2>
          <p className="text-base text-[#FDFBF7]/80 leading-relaxed mt-5 max-w-xl mx-auto lg:mx-0">
            {pick(COPY.text, lang)}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-7 gap-y-3">
            <Step n="1" label={pick(COPY.f1, lang)} />
            <Step n="2" label={pick(COPY.f2, lang)} />
            <Step n="3" label={pick(COPY.f3, lang)} />
          </div>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to={pathFor(lang, "concurso")}
              data-testid="home-ruleta-cta"
              className="group inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A85231] text-[#FDFBF7] text-[13px] tracking-[0.2em] uppercase font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:gap-5 shadow-[0_18px_40px_-16px_rgba(193,101,66,0.8)]"
            >
              <Gift className="w-4 h-4" strokeWidth={2} />
              {pick(COPY.cta, lang)}
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <span className="inline-flex items-center gap-2 text-[12px] text-[#FDFBF7]/60">
              <Ticket className="w-4 h-4 text-[#E0A85C]" strokeWidth={1.8} /> {pick(COPY.note, lang)}
            </span>
          </div>
        </div>

        {/* Wheel */}
        <div className="order-1 lg:order-2 relative flex items-center justify-center py-4">
          {/* floating decorations */}
          <Float icon={Gift} className="w-9 h-9 top-2 left-[12%]" delay={0} />
          <Float icon={Sparkles} className="w-7 h-7 top-[18%] right-[8%] text-[#FDFBF7]/80" delay={0.8} />
          <Float icon={Star} className="w-6 h-6 bottom-[12%] left-[6%]" delay={1.6} />
          <Float icon={Sparkles} className="w-8 h-8 bottom-3 right-[16%]" delay={1.1} />

          <DecorWheel />

          {/* reward badge */}
          <span
            data-testid="home-ruleta-badge"
            className="absolute z-30 -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 whitespace-nowrap bg-[#B8862F] text-[#1A1513] text-[11px] font-bold tracking-[0.14em] uppercase px-3.5 py-1.5 rounded-full shadow-lg"
          >
            <Star className="w-3.5 h-3.5 shrink-0" fill="#1A1513" strokeWidth={0} /> {pick(COPY.badge, lang)}
          </span>
        </div>
      </div>
    </section>
  );
}
