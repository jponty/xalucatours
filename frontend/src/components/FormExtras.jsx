/* ============================================================
   FormExtras — shared bits used by both the detailed planner
   (PlannerForm) and the quick contact form (ContactForm):
     • <WhatHappensNext> — "¿Qué sucede después?" info block.
     • <ContactPreference> — channel preference, without duplicate fields.
   Both accept a `tone` ("light" | "dark") so they blend into
   each form's background.
============================================================ */
import React, { useId } from "react";
import { Phone, Mail, Check, Clock, CalendarDays } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";
import { calculateInclusiveTripDays } from "@/lib/utils";
import EditableText from "@/components/EditableText";
import { DEFAULT_CONTACT_PREFERENCE, contactPrefLabel } from "@/lib/contactSubmission";
export { contactPrefLabel } from "@/lib/contactSubmission";

const T = (es, en, fr) => ({ es, en, fr });

export const WHAT_NEXT = {
  title: T("¿Qué sucede después?", "What happens next?", "Que se passe-t-il ensuite ?"),
  steps: [
    T("Recibimos tu solicitud y la revisamos.",
      "We receive your request and review it.",
      "Nous recevons votre demande et l'examinons."),
    T("Un especialista en viajes a Marruecos de Xaluca Tours analizará tu consulta y preferencias.",
      "A Morocco travel specialist from Xaluca Tours will review your enquiry and preferences.",
      "Un spécialiste des voyages au Maroc de Xaluca Tours étudiera votre demande et vos préférences."),
    T("Nos pondremos en contacto contigo para resolver dudas, recomendar itinerarios y ayudarte a planificar tu viaje.",
      "We will get in touch to answer questions, recommend itineraries and help you plan your trip.",
      "Nous vous contacterons pour répondre à vos questions, recommander des itinéraires et vous aider à planifier votre voyage."),
    T("Si lo deseas, podremos preparar una propuesta personalizada adaptada a tus intereses, fechas y presupuesto.",
      "If you wish, we can prepare a tailor-made proposal adapted to your interests, dates and budget.",
      "Si vous le souhaitez, nous pouvons préparer une proposition sur mesure adaptée à vos intérêts, dates et budget."),
  ],
  response: T(
    "Tiempo habitual de respuesta: dentro del horario de oficina, normalmente respondemos en pocas horas laborables.",
    "Typical response time: within office hours, we usually reply within a few working hours.",
    "Délai de réponse habituel : pendant les heures de bureau, nous répondons généralement en quelques heures ouvrables.",
  ),
};

export const CONTACT_PREF_LABEL = T(
  "¿Cómo prefieres que te contactemos?",
  "How would you prefer us to contact you?",
  "Comment préférez-vous être contacté ?",
);

export const CONTACT_PREF_HINT = T(
  "Indica tu preferencia. Usaremos los datos de contacto que has facilitado.",
  "Choose your preference. We will use the contact details you provided.",
  "Indiquez votre préférence. Nous utiliserons les coordonnées déjà fournies.",
);

export const CONTACT_PREF_OPTIONS = [
  { id: "both", value: DEFAULT_CONTACT_PREFERENCE, Icon: Phone },
  { id: "email", value: ["email"], Icon: Mail },
];

const TRIP_DURATION_LABELS = {
  es: (days) => String(days) + " " + (days === 1 ? "día" : "días") + " de viaje",
  en: (days) => String(days) + " travel " + (days === 1 ? "day" : "days"),
  fr: (days) => String(days) + " " + (days === 1 ? "jour" : "jours") + " de voyage",
};

export const TripDurationSummary = ({
  startDate,
  endDate,
  lang = "es",
  tone = "light",
  className = "",
  testid = "trip-duration",
}) => {
  const days = calculateInclusiveTripDays(startDate, endDate);
  if (!days) return null;
  const language = String(lang || "es").toLowerCase().startsWith("en")
    ? "en"
    : String(lang || "es").toLowerCase().startsWith("fr") ? "fr" : "es";
  const dark = tone === "dark";
  const appearance = dark
    ? "border-[#D4A373] bg-white/[0.05] text-[#FDFBF7]"
    : "border-[#C16542] bg-[#C16542]/[0.06] text-[#2C2621]";

  return (
    <p
      role="status"
      aria-live="polite"
      data-testid={testid}
      className={"flex items-center gap-2 border-l-2 px-4 py-3 text-sm " + appearance + (className ? " " + className : "")}
    >
      <CalendarDays
        className={"h-4 w-4 shrink-0 " + (dark ? "text-[#D4A373]" : "text-[#C16542]")}
        strokeWidth={1.7}
        aria-hidden="true"
      />
      <strong className="font-medium">{TRIP_DURATION_LABELS[language](days)}</strong>
    </p>
  );
};

const TONES = {
  light: {
    box: "bg-white border-[#2C2621]/12",
    title: "text-[#2C2621]",
    eyebrowAccent: "#C16542",
    body: "text-[#5C5248]",
    response: "text-[#A07042]",
    optIdle: "bg-white text-[#3D352C] border-[#2C2621]/15 hover:border-[#2C2621]/45",
    optOn: "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]",
    optIconIdle: "#C16542",
    optIconOn: "#D4A373",
    reqLabel: "text-[#A07042]",
    error: "text-[#C16542]",
  },
  dark: {
    box: "bg-[#FDFBF7]/[0.04] border-[#FDFBF7]/15",
    title: "text-[#FDFBF7]",
    eyebrowAccent: "#D4A373",
    body: "text-[#FDFBF7]/75",
    response: "text-[#D4A373]",
    optIdle: "bg-transparent text-[#FDFBF7]/85 border-[#FDFBF7]/20 hover:border-[#FDFBF7]/55",
    optOn: "bg-[#C16542] text-[#FDFBF7] border-[#C16542]",
    optIconIdle: "#D4A373",
    optIconOn: "#FDFBF7",
    reqLabel: "text-[#FDFBF7]/55",
    error: "text-[#E8A98C]",
  },
};

export const WhatHappensNext = ({ tone = "light", lang, testid = "what-happens-next" }) => {
  const c = TONES[tone] || TONES.light;
  return (
    <div data-testid={testid} className={`border p-6 md:p-8 ${c.box}`}>
      <EditableText
        as="h4"
        slot="form.next.title"
        defaults={WHAT_NEXT.title}
        multiline={false}
        className={`font-serif-x text-xl md:text-2xl leading-snug tracking-tight block ${c.title}`}
      />
      <ol className="mt-5 space-y-3.5">
        {WHAT_NEXT.steps.map((s, i) => (
          <li key={i} className={`flex items-start gap-3 text-[14px] leading-relaxed ${c.body}`}>
            <span
              className="mt-0.5 inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full text-[10px] font-semibold text-[#FDFBF7]"
              style={{ background: c.eyebrowAccent }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <EditableText as="span" slot={`form.next.step.${i}`} defaults={s} />
          </li>
        ))}
      </ol>
      <p className={`mt-6 pt-5 border-t border-current/10 flex items-start gap-2.5 text-[13px] leading-relaxed ${c.response}`}>
        <Clock className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.6} />
        <EditableText as="span" slot="form.next.response" defaults={WHAT_NEXT.response} />
      </p>
    </div>
  );
};

export const ContactPreference = ({
  tone = "light",
  lang,
  value = DEFAULT_CONTACT_PREFERENCE,
  onChange,
  error,
  testidPrefix = "contact-pref",
}) => {
  const id = useId();
  const c = TONES[tone] || TONES.light;
  const selected = value.includes("phone") ? "both" : "email";
  return (
    <fieldset data-testid={`${testidPrefix}-group`} className="min-w-0">
      <legend className={`block text-[11px] tracking-[0.3em] uppercase mb-1.5 ${c.reqLabel}`}>
        <EditableText as="span" slot="form.pref.label" defaults={CONTACT_PREF_LABEL} multiline={false} />{" "}
        <span style={{ color: c.eyebrowAccent }}>*</span>
      </legend>
      <span className={`block text-[12px] mb-3 ${c.body}`}>
        {pick(CONTACT_PREF_HINT, lang)}
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONTACT_PREF_OPTIONS.map((opt) => {
          const on = selected === opt.id;
          return (
            <label key={opt.id} className={`relative cursor-pointer inline-flex min-w-0 items-center gap-3 px-4 py-4 text-[13px] tracking-[0.05em] border-2 transition-colors focus-within:ring-2 focus-within:ring-[#C16542] ${on ? c.optOn : c.optIdle}`}>
              <input type="radio" name={`${id}-preference`} value={opt.id} checked={on} required
                onChange={() => onChange([...opt.value])} data-testid={`${testidPrefix}-${opt.id}`} className="sr-only" />
              <opt.Icon className="w-4 h-4 shrink-0" strokeWidth={1.7}
                style={{ color: on ? c.optIconOn : c.optIconIdle }} />
              <span className="flex-1 text-left">
                {contactPrefLabel(opt.value, lang)}
              </span>
              {on && <Check className="w-4 h-4 shrink-0" strokeWidth={2.2} style={{ color: c.optIconOn }} />}
            </label>
          );
        })}
      </div>
      {error && <span className={`block mt-2 text-xs ${c.error}`} data-testid={`${testidPrefix}-error`}>{error}</span>}
    </fieldset>
  );
};
