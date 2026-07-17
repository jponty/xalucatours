import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Gift, Mail, User, Phone, Loader2, RotateCw, PartyPopper, X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import monogramWhite from "@/assets/monograma-x-white.png";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const T = (es, en, fr) => ({ es, en, fr });
const L = (o, lang) => (o && (o[lang] ?? o.es)) || "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s().-]{5,}$/;
const LEGAL_URL = "https://xalucatours.com/";
const PRIVACY_URL = "https://xalucatours.com/";
const CONFETTI_COLORS = ["#C16542", "#D4A373", "#B8862F", "#2C2621", "#F2EBE1"];

const UI = {
  eyebrow: T("Concurso Xaluca", "Xaluca Giveaway", "Concours Xaluca"),
  title: T("Ruleta de la Suerte", "Spin the Wheel", "Roue de la Chance"),
  subtitle: T(
    "Completa tus datos, gira la ruleta y descubre tu premio. Un pequeño regalo de Xaluca Tours para tu próxima aventura en Marruecos.",
    "Fill in your details, spin the wheel and discover your prize. A little gift from Xaluca Tours for your next Moroccan adventure.",
    "Renseignez vos coordonnées, tournez la roue et découvrez votre lot. Un petit cadeau de Xaluca Tours pour votre prochaine aventure au Maroc.",
  ),
  steps: [
    { t: T("Rellena tus datos", "Fill in your details", "Renseignez vos coordonnées"), b: T("Nombre, apellidos, teléfono y email de contacto.", "Name, surname, phone and contact email.", "Prénom, nom, téléphone et e-mail de contact.") },
    { t: T("Gira la ruleta", "Spin the wheel", "Tournez la roue"), b: T("Pulsa el botón y deja que la suerte decida.", "Press the button and let luck decide.", "Appuyez sur le bouton et laissez faire la chance.") },
    { t: T("Recibe tu premio", "Get your prize", "Recevez votre lot"), b: T("Te enviamos un email con tu premio y cómo canjearlo.", "We email you your prize and how to redeem it.", "Nous vous envoyons votre lot et comment en profiter.") },
  ],
  firstName: T("Nombre", "First name", "Prénom"),
  lastName: T("Apellidos", "Last name", "Nom"),
  phone: T("Teléfono", "Phone", "Téléphone"),
  email: T("Email de contacto", "Contact email", "E-mail de contact"),
  participate: T("Participar", "Enter", "Participer"),
  spin: T("¡Girar la ruleta!", "Spin the wheel!", "Tourner la roue !"),
  spinning: T("Girando…", "Spinning…", "La roue tourne…"),
  editData: T("Editar mis datos", "Edit my details", "Modifier mes informations"),
  readyMsg: T("¡Todo listo! Pulsa para girar.", "All set! Press to spin.", "Tout est prêt ! Appuyez pour tourner."),
  prizesTitle: T("Premios en juego", "Prizes up for grabs", "Lots à gagner"),
  errName: T("Indica tu nombre", "Please enter your name", "Indiquez votre prénom"),
  errLast: T("Indica tus apellidos", "Please enter your surname", "Indiquez votre nom"),
  errPhone: T("Introduce un teléfono válido", "Enter a valid phone number", "Saisissez un numéro de téléphone valide"),
  errEmail: T("Introduce un email válido", "Enter a valid email", "Saisissez un e-mail valide"),
  errAccept: T("Debes aceptar las bases legales para participar.", "You must accept the legal terms to participate.", "Vous devez accepter les conditions légales pour participer."),
  legalPre: T("He leído y acepto las ", "I have read and accept the ", "J'ai lu et j'accepte les "),
  legalBases: T("Bases Legales del Concurso", "Contest Legal Terms", "Conditions Légales du Concours"),
  legalMid: T(" y la ", " and the ", " et la "),
  legalPrivacy: T("Política de Privacidad", "Privacy Policy", "Politique de Confidentialité"),
  legalPost: T(".", ".", "."),
  dupError: T("Este email ya ha participado en el concurso.", "This email has already entered the giveaway.", "Cet e-mail a déjà participé au concours."),
  genericError: T("No se ha podido completar la participación. Inténtalo de nuevo.", "We couldn't complete your entry. Please try again.", "Impossible de finaliser la participation. Réessayez."),
  closedTitle: T("El concurso no está disponible", "The giveaway isn't available", "Le concours n'est pas disponible"),
  closedBody: T("Vuelve pronto para participar en nuestro próximo sorteo.", "Come back soon to enter our next giveaway.", "Revenez bientôt pour participer à notre prochain concours."),
  winTitle: T("¡Enhorabuena!", "Congratulations!", "Félicitations !"),
  winIntro: T("Has ganado", "You've won", "Vous avez gagné"),
  winEmail: T("Te hemos enviado un email con los detalles y cómo canjear tu premio.", "We've emailed you the details and how to redeem your prize.", "Nous vous avons envoyé un e-mail avec les détails et la marche à suivre."),
  winClose: T("Cerrar", "Close", "Fermer"),
  legalNote: T("Una participación por email. Premio sujeto a disponibilidad y a las bases del concurso.", "One entry per email. Prize subject to availability and to the contest terms.", "Une participation par e-mail. Lot soumis à disponibilité et aux conditions du concours."),
};

const polar = (deg, radius) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [100 + radius * Math.cos(a), 100 + radius * Math.sin(a)];
};

const Wheel = ({ prizes, rotation, lang, onSpinEnd }) => {
  const n = prizes.length || 1;
  const seg = 360 / n;
  const segments = prizes.map((p, i) => {
    const start = i * seg;
    const end = (i + 1) * seg;
    const [x1, y1] = polar(start, 100);
    const [x2, y2] = polar(end, 100);
    const large = seg > 180 ? 1 : 0;
    const d = `M100 100 L ${x1.toFixed(3)} ${y1.toFixed(3)} A 100 100 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`;
    const mid = start + seg / 2;
    const [lx, ly] = polar(mid, 60);
    let rot = mid - 90;
    if (mid > 180) rot += 180;
    return { d, color: p.color, label: L(p.short, lang), lx, ly, rot, grand: p.is_grand };
  });

  return (
    <div className="relative w-[min(86vw,440px)] aspect-square mx-auto select-none">
      {/* Pointer */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-1 z-30"
        style={{
          width: 0, height: 0,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderTop: "26px solid #C16542",
          filter: "drop-shadow(0 4px 4px rgba(26,21,19,0.35))",
        }}
        aria-hidden="true"
      />
      {/* Bezel (static) */}
      <div className="absolute inset-0 rounded-full p-2.5 bg-[#1A1513] shadow-[0_40px_80px_-30px_rgba(26,21,19,0.7)]">
        <div
          data-testid="concurso-wheel"
          className="relative w-full h-full rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "transform 5.2s cubic-bezier(0.16, 0.84, 0.28, 1)",
          }}
          onTransitionEnd={onSpinEnd}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {segments.map((s, i) => (
              <g key={i}>
                <path d={s.d} fill={s.color} stroke="#FDFBF7" strokeWidth="0.6" />
                <text
                  x={s.lx}
                  y={s.ly}
                  fill="#FDFBF7"
                  fontSize={s.grand ? "7" : "6"}
                  fontWeight={s.grand ? "800" : "600"}
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${s.rot} ${s.lx} ${s.ly})`}
                  style={{ letterSpacing: "0.2px" }}
                >
                  {s.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      {/* Hub (static) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[18%] h-[18%] rounded-full bg-[#1A1513] border-[3px] border-[#FDFBF7] shadow-lg flex items-center justify-center">
        <img src={monogramWhite} alt="Xaluca" className="w-1/2 h-1/2 object-contain" />
      </div>
    </div>
  );
};

export default function ConcursoPage() {
  const { lang } = useLanguage();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("form"); // form | ready | spinning | done
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "" });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null); // { prize }
  const [showModal, setShowModal] = useState(false);
  const spinLockRef = useRef(false);

  useEffect(() => {
    document.title = `${L(UI.title, lang)} · Xaluca Tours`;
  }, [lang]);

  useEffect(() => {
    let alive = true;
    axios
      .get(`${API}/contest/active`)
      .then((r) => { if (alive) setContest(r.data.contest); })
      .catch(() => { if (alive) setContest(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const open = contest && contest.open;
  const prizes = useMemo(() => (contest ? contest.prizes : []), [contest]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!form.first_name.trim()) err.first_name = L(UI.errName, lang);
    if (!form.last_name.trim()) err.last_name = L(UI.errLast, lang);
    if (!PHONE_RE.test(form.phone.trim())) err.phone = L(UI.errPhone, lang);
    if (!EMAIL_RE.test(form.email.trim())) err.email = L(UI.errEmail, lang);
    if (!accepted) err.accepted = L(UI.errAccept, lang);
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleParticipate = (e) => {
    e.preventDefault();
    if (validate()) setPhase("ready");
  };

  const fireConfetti = (grand) => {
    const base = { colors: CONFETTI_COLORS, disableForReducedMotion: true };
    confetti({ ...base, particleCount: grand ? 220 : 140, spread: grand ? 110 : 80, origin: { y: 0.55 } });
    if (grand) {
      setTimeout(() => confetti({ ...base, particleCount: 120, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } }), 250);
      setTimeout(() => confetti({ ...base, particleCount: 120, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } }), 400);
    }
  };

  const handleSpin = async () => {
    if (spinLockRef.current || phase === "spinning") return;
    spinLockRef.current = true;
    setPhase("spinning");
    try {
      const { data } = await axios.post(`${API}/contest/spin`, {
        contest_id: contest.id,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        language: lang,
      });
      setResult({ prize: data.prize });
      const n = prizes.length || 1;
      const seg = 360 / n;
      const mid = data.prize_index * seg + seg / 2;
      const targetMod = (360 - mid) % 360;
      const currentMod = ((rotation % 360) + 360) % 360;
      let delta = targetMod - currentMod;
      if (delta < 0) delta += 360;
      setRotation((r) => r + 5 * 360 + delta);
      // onSpinEnd (transitionEnd) will reveal the modal.
    } catch (err) {
      spinLockRef.current = false;
      const status = err?.response?.status;
      if (status === 409) {
        toast.error(L(UI.dupError, lang));
        setPhase("ready");
      } else if (status === 403) {
        setContest((c) => (c ? { ...c, open: false } : c));
        toast.error(err?.response?.data?.detail || L(UI.genericError, lang));
      } else {
        toast.error(L(UI.genericError, lang));
        setPhase("ready");
      }
    }
  };

  const handleSpinEnd = () => {
    if (phase !== "spinning" || !result) return;
    setPhase("done");
    setShowModal(true);
    fireConfetti(result.prize?.is_grand);
    spinLockRef.current = false;
  };

  const inputCls = (k) =>
    `w-full bg-[#FDFBF7] border ${errors[k] ? "border-[#C16542]" : "border-[#2C2621]/20"} focus:border-[#C16542] focus:outline-none px-4 py-3 text-[#2C2621] placeholder-[#2C2621]/40 transition-colors`;

  return (
    <div data-testid="concurso-page" className="bg-[#1A1513] text-[#FDFBF7]">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 berber-bg-cross opacity-[0.06] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A373]/50 to-transparent" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-6 pt-32 md:pt-40 lg:pt-44 pb-6 text-center">
          <span className="inline-flex items-center gap-2.5 text-[#D4A373]">
            <PartyPopper className="w-4 h-4" strokeWidth={1.7} />
            <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">{L(UI.eyebrow, lang)}</span>
          </span>
          <h1 className="font-serif-x text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-5">
            {L(UI.title, lang)}
          </h1>
          <p className="mt-6 text-base md:text-lg text-[#E7DDCA] leading-relaxed max-w-2xl mx-auto">
            {L(UI.subtitle, lang)}
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-28">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4A373]" />
        </div>
      ) : !open ? (
        <section className="max-w-xl mx-auto px-6 py-16 text-center">
          <div className="bg-[#FDFBF7]/5 border border-[#FDFBF7]/15 px-8 py-14">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FDFBF7]/10 text-[#D4A373] mb-5">
              <Gift className="w-7 h-7" strokeWidth={1.5} />
            </span>
            <h2 className="font-serif-x text-3xl">{L(UI.closedTitle, lang)}</h2>
            <p className="mt-3 text-[#E7DDCA]">{L(UI.closedBody, lang)}</p>
          </div>
        </section>
      ) : (
        <>
          {/* Steps */}
          <section className="max-w-5xl mx-auto px-6 pt-6 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {UI.steps.map((s, i) => (
                <div key={i} data-testid={`concurso-step-${i + 1}`} className="bg-[#FDFBF7]/5 border border-[#FDFBF7]/10 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C16542] text-[#FDFBF7] text-sm font-semibold">{i + 1}</span>
                    <h3 className="font-serif-x text-lg text-[#FDFBF7]">{L(s.t, lang)}</h3>
                  </div>
                  <p className="mt-3 text-sm text-[#C9BEA9] leading-relaxed">{L(s.b, lang)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Wheel + form */}
          <section className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">
            {/* Wheel */}
            <div className="order-2 lg:order-1">
              <Wheel prizes={prizes} rotation={rotation} lang={lang} onSpinEnd={handleSpinEnd} />
            </div>

            {/* Panel */}
            <div className="order-1 lg:order-2">
              <div className="bg-[#FDFBF7] text-[#2C2621] p-7 md:p-9 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
                {phase === "form" ? (
                  <form onSubmit={handleParticipate} data-testid="concurso-form" className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#8A7C64] mb-2">
                        <User className="w-3.5 h-3.5" /> {L(UI.firstName, lang)}
                      </label>
                      <input data-testid="concurso-first-name" value={form.first_name} onChange={set("first_name")} className={inputCls("first_name")} placeholder={L(UI.firstName, lang)} />
                      {errors.first_name && <p className="mt-1 text-xs text-[#C16542]">{errors.first_name}</p>}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#8A7C64] mb-2">
                        <User className="w-3.5 h-3.5" /> {L(UI.lastName, lang)}
                      </label>
                      <input data-testid="concurso-last-name" value={form.last_name} onChange={set("last_name")} className={inputCls("last_name")} placeholder={L(UI.lastName, lang)} />
                      {errors.last_name && <p className="mt-1 text-xs text-[#C16542]">{errors.last_name}</p>}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#8A7C64] mb-2">
                        <Phone className="w-3.5 h-3.5" /> {L(UI.phone, lang)}
                      </label>
                      <input data-testid="concurso-phone" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set("phone")} className={inputCls("phone")} placeholder="+34 600 000 000" />
                      {errors.phone && <p className="mt-1 text-xs text-[#C16542]">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#8A7C64] mb-2">
                        <Mail className="w-3.5 h-3.5" /> {L(UI.email, lang)}
                      </label>
                      <input data-testid="concurso-email" type="email" value={form.email} onChange={set("email")} className={inputCls("email")} placeholder="tucorreo@email.com" />
                      {errors.email && <p className="mt-1 text-xs text-[#C16542]">{errors.email}</p>}
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer pt-1" data-testid="concurso-legal-label">
                      <input
                        type="checkbox"
                        data-testid="concurso-legal-checkbox"
                        checked={accepted}
                        onChange={(e) => {
                          setAccepted(e.target.checked);
                          if (e.target.checked) setErrors((prev) => { const { accepted, ...rest } = prev; return rest; });
                        }}
                        required
                        className="mt-0.5 w-[18px] h-[18px] shrink-0 cursor-pointer accent-[#C16542]"
                      />
                      <span className="text-[13px] leading-snug text-[#2C2621]/80">
                        {L(UI.legalPre, lang)}
                        <a href={LEGAL_URL} target="_blank" rel="noopener noreferrer" data-testid="concurso-legal-link" className="text-[#C16542] underline underline-offset-2 hover:text-[#A35133]">
                          {L(UI.legalBases, lang)}
                        </a>
                        {L(UI.legalMid, lang)}
                        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" data-testid="concurso-privacy-link" className="text-[#C16542] underline underline-offset-2 hover:text-[#A35133]">
                          {L(UI.legalPrivacy, lang)}
                        </a>
                        {L(UI.legalPost, lang)}
                      </span>
                    </label>
                    {errors.accepted && <p className="text-xs text-[#C16542]">{errors.accepted}</p>}

                    <button data-testid="concurso-participate-btn" type="submit" disabled={!accepted} className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#2C2621] hover:bg-[#C16542] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2C2621] text-[#FDFBF7] px-6 py-4 text-[12px] tracking-[0.22em] uppercase transition-colors">
                      {L(UI.participate, lang)} <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-[#8A7C64] leading-relaxed pt-1">{L(UI.legalNote, lang)}</p>
                  </form>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-[#5C5248]">
                      {form.first_name} {form.last_name}
                      <br />
                      <span className="text-[#8A7C64]">{form.email}</span>
                    </p>
                    {phase !== "done" && (
                      <p className="mt-4 font-serif-x text-2xl text-[#2C2621]">{L(UI.readyMsg, lang)}</p>
                    )}
                    <button
                      data-testid="concurso-spin-btn"
                      onClick={handleSpin}
                      disabled={phase === "spinning" || phase === "done"}
                      className="w-full mt-6 inline-flex items-center justify-center gap-2.5 bg-[#C16542] hover:bg-[#a9502f] disabled:opacity-60 disabled:cursor-not-allowed text-[#FDFBF7] px-6 py-5 text-[14px] tracking-[0.18em] uppercase font-semibold transition-colors shadow-lg"
                    >
                      {phase === "spinning" ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> {L(UI.spinning, lang)}</>
                      ) : (
                        <><RotateCw className="w-5 h-5" /> {L(UI.spin, lang)}</>
                      )}
                    </button>
                    {phase === "ready" && (
                      <button onClick={() => setPhase("form")} className="mt-4 text-xs tracking-[0.2em] uppercase text-[#8A7C64] hover:text-[#C16542] transition-colors">
                        {L(UI.editData, lang)}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Prize legend */}
          <section className="max-w-5xl mx-auto px-6 pb-24">
            <h2 className="text-center text-[11px] tracking-[0.3em] uppercase text-[#D4A373] mb-6">{L(UI.prizesTitle, lang)}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {prizes.map((p) => (
                <div key={p.id} data-testid={`concurso-prize-${p.id}`} className="flex items-center gap-3 text-sm text-[#E7DDCA]">
                  <span className="shrink-0 w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className={p.is_grand ? "font-semibold text-[#D4A373]" : ""}>{L(p.label, lang)}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Winner modal */}
      {showModal && result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" data-testid="concurso-win-modal">
          <div className="absolute inset-0 bg-[#1A1513]/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#FDFBF7] text-[#2C2621] max-w-md w-full p-8 md:p-10 text-center shadow-2xl fade-up">
            <button onClick={() => setShowModal(false)} data-testid="concurso-win-close" className="absolute top-4 right-4 text-[#8A7C64] hover:text-[#2C2621]">
              <X className="w-5 h-5" />
            </button>
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2EBE1] text-[#C16542] mb-5">
              <PartyPopper className="w-8 h-8" strokeWidth={1.6} />
            </span>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C16542] font-semibold">{L(UI.winTitle, lang)}</p>
            <p className="mt-3 text-sm text-[#8A7C64] uppercase tracking-[0.18em]">{L(UI.winIntro, lang)}</p>
            <p className={`mt-2 font-serif-x leading-tight ${result.prize?.is_grand ? "text-3xl md:text-4xl text-[#B8862F]" : "text-2xl md:text-3xl text-[#2C2621]"}`}>
              {L(result.prize?.label, lang)}
            </p>
            <p className="mt-5 text-sm text-[#5C5248] leading-relaxed flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-[#C16542]" /> {L(UI.winEmail, lang)}
            </p>
            <button onClick={() => setShowModal(false)} data-testid="concurso-win-modal-close-btn" className="mt-7 inline-flex items-center justify-center gap-2 bg-[#2C2621] hover:bg-[#C16542] text-[#FDFBF7] px-8 py-3.5 text-[12px] tracking-[0.22em] uppercase transition-colors">
              {L(UI.winClose, lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
