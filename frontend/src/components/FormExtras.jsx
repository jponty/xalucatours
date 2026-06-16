/* ============================================================
   FormExtras — shared bits used by both the detailed planner
   (PlannerForm) and the quick contact form (ContactForm):
     • <WhatHappensNext> — "¿Qué sucede después?" info block.
     • <ContactPreference> — required single-select for the
       preferred contact channel (phone / email).
   Both accept a `tone` ("light" | "dark") so they blend into
   each form's background.
============================================================ */
import React from "react";
import { Phone, Mail, Check, Clock } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";

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
  "Puedes elegir una o ambas opciones.",
  "You can choose one or both options.",
  "Vous pouvez choisir une ou les deux options.",
);

export const CONTACT_PREF_OPTIONS = [
  { id: "phone", Icon: Phone, label: T("Llamada telefónica", "Phone call", "Appel téléphonique") },
  { id: "email", Icon: Mail,  label: T("Correo electrónico", "Email", "E-mail") },
];

/* Human-readable label(s) for stored value(s). Accepts a string or an
   array of ids and returns a comma-joined, localized label. */
export const contactPrefLabel = (value, lang) => {
  const ids = Array.isArray(value) ? value : (value ? [value] : []);
  return ids
    .map((id) => {
      const o = CONTACT_PREF_OPTIONS.find((x) => x.id === id);
      return o ? pick(o.label, lang) : id;
    })
    .join(", ");
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
      <h4 className={`font-serif-x text-xl md:text-2xl leading-snug tracking-tight ${c.title}`}>
        {pick(WHAT_NEXT.title, lang)}
      </h4>
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
            <span>{pick(s, lang)}</span>
          </li>
        ))}
      </ol>
      <p className={`mt-6 pt-5 border-t border-current/10 flex items-start gap-2.5 text-[13px] leading-relaxed ${c.response}`}>
        <Clock className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.6} />
        <span>{pick(WHAT_NEXT.response, lang)}</span>
      </p>
    </div>
  );
};

export const ContactPreference = ({ tone = "light", lang, value = [], onToggle, error, testidPrefix = "contact-pref" }) => {
  const c = TONES[tone] || TONES.light;
  const selected = Array.isArray(value) ? value : (value ? [value] : []);
  return (
    <div data-testid={`${testidPrefix}-group`}>
      <span className={`block text-[11px] tracking-[0.3em] uppercase mb-1.5 ${c.reqLabel}`}>
        {pick(CONTACT_PREF_LABEL, lang)} <span style={{ color: c.eyebrowAccent }}>*</span>
      </span>
      <span className={`block text-[12px] mb-3 ${c.body}`}>{pick(CONTACT_PREF_HINT, lang)}</span>
      <div role="group" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONTACT_PREF_OPTIONS.map((opt) => {
          const on = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              role="checkbox"
              aria-checked={on}
              data-testid={`${testidPrefix}-${opt.id}`}
              onClick={() => onToggle(opt.id)}
              className={`group inline-flex items-center gap-3 px-5 py-4 text-[13px] tracking-[0.05em] border-2 transition-colors ${on ? c.optOn : c.optIdle}`}
            >
              <opt.Icon className="w-4 h-4 shrink-0" strokeWidth={1.7}
                style={{ color: on ? c.optIconOn : c.optIconIdle }} />
              <span className="flex-1 text-left">{pick(opt.label, lang)}</span>
              {on && <Check className="w-4 h-4 shrink-0" strokeWidth={2.2} style={{ color: c.optIconOn }} />}
            </button>
          );
        })}
      </div>
      {error && <span className={`block mt-2 text-xs ${c.error}`} data-testid={`${testidPrefix}-error`}>{error}</span>}
    </div>
  );
};
