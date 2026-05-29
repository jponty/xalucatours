/* ============================================================
   ContactPage.jsx  ·  /contacto · /en/contact · /fr/contact
   ----
   Editorial contact funnel — built around three pillars:
     1. Inspirational hero ("El inicio de una gran aventura")
     2. 3-step "how it works" rail (Planifica → Reserva → Confirma)
     3. Calendly booking surface with two tabs:
          · Telephone consultation
          · Office visit (Tremp HQ)
     4. Direct-contact section (phone + form CTA)
     5. "Why Xaluca Tours" 5-card grid
     6. Quick-info footer block

   Calendly is loaded once on mount via the official inline-widget
   bootstrap; the two booking URLs are swapped via a tab state so
   we don't double-mount iframes that hammer the Calendly API.
============================================================ */
import React, { useEffect, useState } from "react";
import {
  Compass, Calendar, CheckCircle2, Phone, Mail, MapPin, Clock,
  Headphones, Users, Sparkles, ShieldCheck, MessageCircle,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableSection from "@/components/EditableSection";
import { SlotScope } from "@/components/slotScope";
import ContactForm from "@/components/ContactForm";
import { CONTACT } from "@/lib/data";

const CALENDLY_PHONE  = "https://calendly.com/xalucatours/cita-previa-telefonica";
const CALENDLY_OFFICE = "https://calendly.com/xalucatours/cita-previa-oficinas";

const COPY = {
  hero: {
    eyebrow: { es: "Contacto · Cita previa", en: "Contact · Book a session", fr: "Contact · Rendez-vous" },
    title:   { es: "El inicio de una gran aventura",
               en: "The start of a great adventure",
               fr: "Le début d'une grande aventure" },
    body:    { es: "Planifica tu próxima aventura por Marruecos y resuelve directamente todas tus dudas a través de sesiones informativas online o en nuestras oficinas con agentes de viajes especialistas en ofrecerte la experiencia que mejor se adapte a ti.",
               en: "Plan your next Moroccan adventure and clear every question in a one-on-one session — online or at our offices — with travel specialists who will tailor the experience to you.",
               fr: "Planifiez votre prochaine aventure marocaine et levez tous vos doutes lors d'une séance personnalisée — en ligne ou dans nos bureaux — avec des spécialistes du voyage qui adapteront l'expérience à votre style." },
  },
  steps: {
    eyebrow: { es: "Tres pasos · cero compromiso",
               en: "Three steps · zero commitment",
               fr: "Trois étapes · sans engagement" },
    title:   { es: "Así planificamos tu viaje contigo",
               en: "How we plan your trip with you",
               fr: "Comment nous concevons votre voyage avec vous" },
    items: [
      { icon: Compass,        title: { es: "Planifica tu aventura", en: "Plan your adventure",   fr: "Planifiez votre aventure" },
        body: { es: "Visita nuestra sección de viajes para inspirarte. En la sesión, un/a especialista responderá todas tus dudas vía llamada telefónica o en nuestras oficinas, sin compromiso.",
                en: "Browse our trip catalog for inspiration. During the session a specialist will answer every question by phone or at our offices, no commitment.",
                fr: "Parcourez notre catalogue pour vous inspirer. Pendant la séance, un spécialiste répondra à toutes vos questions par téléphone ou dans nos bureaux, sans engagement." } },
      { icon: Calendar,       title: { es: "Selecciona día y hora", en: "Pick your slot",         fr: "Choisissez votre créneau" },
        body: { es: "Las sesiones se realizan vía llamada telefónica o en nuestras oficinas. Selecciona el día y la hora que mejor se adapten a tu agenda y reserva la sesión en segundos.",
                en: "Sessions take place over the phone or at our office. Pick the day and time that work best for you and book the session in seconds.",
                fr: "Les séances ont lieu par téléphone ou dans nos bureaux. Choisissez la date et l'heure qui vous arrangent et réservez en quelques secondes." } },
      { icon: CheckCircle2,   title: { es: "Confirma y resuelve tus dudas", en: "Confirm and ask anything", fr: "Confirmez et posez vos questions" },
        body: { es: "Solo añade tu correo electrónico y la franja horaria. Uno/a de nuestros/as agentes especialistas se pondrá en contacto contigo para empezar a diseñar tu viaje a medida.",
                en: "Just add your email and the slot. One of our travel specialists will reach out to start designing your tailor-made trip.",
                fr: "Indiquez votre e-mail et le créneau. Un de nos spécialistes vous contactera pour commencer à concevoir votre voyage sur mesure." } },
    ],
  },
  booking: {
    eyebrow: { es: "¿Tienes preguntas?",   en: "Have a question?",      fr: "Une question ?" },
    title:   { es: "Asesoramiento en tiempo real o visita a la oficina",
               en: "Real-time advice — by phone or at the office",
               fr: "Conseils en temps réel — par téléphone ou en agence" },
    body:    { es: "Reserva una cita telefónica para el día y la hora que mejor te convenga, o ven a visitarnos a nuestras oficinas en Tremp para planificar tu próxima aventura cara a cara.",
               en: "Book a phone call at a time that suits you, or come visit our office in Tremp to plan your next adventure face to face.",
               fr: "Réservez un appel téléphonique quand il vous convient, ou venez nous voir à notre bureau de Tremp pour planifier votre prochaine aventure en personne." },
    tabPhone:  { es: "Sesión telefónica", en: "Phone session", fr: "Séance téléphonique" },
    tabOffice: { es: "Visita en oficina", en: "Visit at our office", fr: "Visite au bureau" },
  },
  contact: {
    eyebrow: { es: "Contacto directo",  en: "Direct contact",  fr: "Contact direct" },
    title:   { es: "Ponte en contacto con nosotros",
               en: "Get in touch with us",
               fr: "Contactez-nous" },
    body:    { es: "Somos especialistas en hacer de tu viaje por Marruecos una aventura que nunca olvidarás. Cuéntanos sin compromiso qué viaje te interesa y nos pondremos en contacto contigo lo antes posible.",
               en: "We are specialists in turning your Moroccan trip into an unforgettable adventure. Tell us — no strings attached — which trip you have in mind and we'll come back to you as soon as possible.",
               fr: "Nous sommes spécialistes pour transformer votre voyage au Maroc en une aventure inoubliable. Dites-nous, sans engagement, quel voyage vous intéresse et nous reviendrons vers vous au plus vite." },
    phoneTitle:  { es: "Por teléfono", en: "By phone", fr: "Par téléphone" },
    phoneBody:   { es: "Llámanos y planifica tu próxima aventura por Marruecos. Resolveremos todas tus dudas con un/a agente especialista.",
                   en: "Call us and plan your next Moroccan adventure. A specialist will answer all your questions.",
                   fr: "Appelez-nous et planifiez votre prochaine aventure marocaine. Un spécialiste répondra à toutes vos questions." },
    formTitle:   { es: "Por formulario", en: "By form", fr: "Par formulaire" },
    formBody:    { es: "Rellena el siguiente formulario y nos pondremos en contacto contigo para empezar a organizar tu próxima aventura por Marruecos.",
                   en: "Fill out the form below and we'll get back to you to start planning your next Moroccan adventure.",
                   fr: "Remplissez le formulaire ci-dessous et nous reviendrons vers vous pour commencer à organiser votre prochaine aventure marocaine." },
  },
  reasons: {
    eyebrow: { es: "Por qué elegirnos", en: "Why choose us",   fr: "Pourquoi nous choisir" },
    title:   { es: "Xaluca Tours es la mejor opción para viajar a Marruecos",
               en: "Xaluca Tours is the best way to travel to Morocco",
               fr: "Xaluca Tours, la meilleure façon de voyager au Maroc" },
    body:    { es: "Con Xaluca Tours tu viaje a Marruecos será inolvidable. Estas son algunas de las razones por las que cientos de viajeros nos eligen cada año.",
               en: "With Xaluca Tours, your trip to Morocco will be unforgettable. Here's why hundreds of travelers choose us every year.",
               fr: "Avec Xaluca Tours, votre voyage au Maroc sera inoubliable. Voici pourquoi des centaines de voyageurs nous choisissent chaque année." },
    items: [
      { icon: Headphones, title: { es: "Servicio al cliente excepcional", en: "Outstanding customer service", fr: "Service client exceptionnel" },
        body: { es: "24/7, los 365 días del año, para cualquier necesidad o pregunta que tengas.",
                en: "24/7, 365 days a year, for any need or question.",
                fr: "24h/24 et 365 jours par an, pour tout besoin ou question." } },
      { icon: MapPin,     title: { es: "Experiencia en Marruecos", en: "Morocco expertise", fr: "Expertise marocaine" },
        body: { es: "Más de 25 años organizando viajes por Marruecos. Conocemos cada rincón y la mejor manera de vivirlo.",
                en: "Over 25 years organizing trips across Morocco. We know every corner and the best way to live it.",
                fr: "Plus de 25 ans d'organisation de voyages au Maroc. Nous connaissons chaque recoin et la meilleure façon de le vivre." } },
      { icon: Sparkles,   title: { es: "Viajes 100% personalizados", en: "100% tailor-made trips", fr: "Voyages 100% sur mesure" },
        body: { es: "Trabajamos contigo para planificar un viaje que se adapte a tus intereses, ritmo y presupuesto.",
                en: "We work with you to design a trip that matches your interests, pace and budget.",
                fr: "Nous concevons avec vous un voyage adapté à vos intérêts, votre rythme et votre budget." } },
      { icon: Users,      title: { es: "Guías locales", en: "Local guides", fr: "Guides locaux" },
        body: { es: "Guías marroquíes altamente cualificados que te llevarán a los rincones más auténticos del país.",
                en: "Highly qualified Moroccan guides who will take you to the country's most authentic places.",
                fr: "Des guides marocains hautement qualifiés qui vous emmèneront dans les lieux les plus authentiques du pays." } },
      { icon: ShieldCheck, title: { es: "Seguridad ante todo", en: "Safety first", fr: "Sécurité avant tout" },
        body: { es: "La seguridad y comodidad de nuestros viajeros es la prioridad número uno en cada itinerario.",
                en: "Our travelers' safety and comfort is the number-one priority on every itinerary.",
                fr: "La sécurité et le confort de nos voyageurs sont la priorité numéro un de chaque itinéraire." } },
    ],
  },
  quick: {
    title: { es: "Horario y contacto rápido", en: "Office hours & quick contact", fr: "Horaires et contact rapide" },
    hoursLabel: { es: "Horario de oficina", en: "Office hours", fr: "Horaires" },
    hoursValue: { es: "Lunes a viernes · 10:00 – 20:00", en: "Mon – Fri · 10:00 – 20:00", fr: "Lun – Ven · 10h00 – 20h00" },
  },
};

/* -------- Calendly loader (idempotent) -------- */
const CALENDLY_SRC = "https://assets.calendly.com/assets/external/widget.js";
const useCalendlyScript = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector(`script[src="${CALENDLY_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = CALENDLY_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);
};

/* Each mount of a Calendly widget needs an explicit `initInlineWidget`
   call. Without it the global script bootstraps only the first widget
   it sees on initial page load — switching tabs leaves the new div
   empty. We poll briefly for window.Calendly while the script is
   still downloading, then fire the init once. */
const CalendlyEmbed = ({ url, testid }) => {
  const ref = React.useRef(null);
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const tryInit = () => {
      if (cancelled || !ref.current) return;
      const C = typeof window !== "undefined" ? window.Calendly : null;
      if (C && typeof C.initInlineWidget === "function") {
        ref.current.innerHTML = "";   // clear any prior render before re-init
        C.initInlineWidget({ url, parentElement: ref.current });
        return;
      }
      if (attempts++ < 40) setTimeout(tryInit, 150);    // up to ~6 s
    };
    tryInit();
    return () => { cancelled = true; };
  }, [url]);
  return (
    <div
      ref={ref}
      data-testid={testid}
      style={{ minWidth: 320, height: 720 }}
    />
  );
};

/* ===================================================================== */
const ContactPage = () => {
  const { lang } = useLanguage();
  const [tab, setTab] = useState("phone");
  useCalendlyScript();

  useEffect(() => {
    document.title = ({
      es: "Contacto · Reserva una sesión informativa · Xaluca Tours",
      en: "Contact · Book an info session · Xaluca Tours",
      fr: "Contact · Réservez une séance d'information · Xaluca Tours",
    })[lang] || "Contacto · Xaluca Tours";
  }, [lang]);

  return (
    <SlotScope id="contact">
      <main data-testid="contact-page" className="bg-[#FDFBF7] pt-[88px] md:pt-[96px]">

        {/* ============== HERO ============== */}
        <section
          data-testid="contact-hero"
          className="relative w-full bg-[#1A1513] berber-bg-cross py-20 md:py-28 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1513] via-[#2C2621] to-[#1A1513] opacity-95" />
          <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
            <EditableSection name="hero.eyebrow" fallback={pick(COPY.hero.eyebrow, lang)} as="span"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.4em] uppercase text-[#D4A373] mb-6" />
            <EditableSection name="hero.title" fallback={pick(COPY.hero.title, lang)} as="h1"
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#FDFBF7] leading-[1.05] tracking-tight" />
            <EditableSection name="hero.body" fallback={pick(COPY.hero.body, lang)} as="p"
              className="mt-7 text-base md:text-lg text-[#D4A373]/90 leading-relaxed max-w-3xl mx-auto" />
          </div>
        </section>

        {/* ============== 3 STEPS ============== */}
        <section data-testid="contact-steps" className="py-20 md:py-28 border-b border-[#2C2621]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-14">
              <EditableSection name="steps.eyebrow" fallback={pick(COPY.steps.eyebrow, lang)} as="span"
                className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4" />
              <EditableSection name="steps.title" fallback={pick(COPY.steps.title, lang)} as="h2"
                className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {COPY.steps.items.map((s, i) => (
                <div key={i} data-testid={`contact-step-${i + 1}`} className="relative pl-0">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-[#2C2621] text-[#FDFBF7]">
                      <s.icon className="w-5 h-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-[11px] tracking-[0.32em] uppercase text-[#C16542]">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-[#2C2621] leading-tight mb-3">
                    {pick(s.title, lang)}
                  </h3>
                  <p className="text-[14px] text-[#5C5248] leading-relaxed">{pick(s.body, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== CALENDLY BOOKING ============== */}
        <section
          data-testid="contact-booking"
          className="py-20 md:py-28 bg-[#F8F2E6]/40 border-b border-[#2C2621]/10"
        >
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4">
                {pick(COPY.booking.eyebrow, lang)}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight">
                {pick(COPY.booking.title, lang)}
              </h2>
              <p className="mt-5 text-[14px] md:text-base text-[#5C5248] leading-relaxed">
                {pick(COPY.booking.body, lang)}
              </p>
            </div>

            {/* Tabs */}
            <div role="tablist" className="flex items-stretch justify-center gap-0 mb-8">
              {[
                { id: "phone",  Icon: Phone,  label: pick(COPY.booking.tabPhone,  lang), testid: "tab-phone" },
                { id: "office", Icon: MapPin, label: pick(COPY.booking.tabOffice, lang), testid: "tab-office" },
              ].map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    data-testid={`contact-booking-${t.testid}`}
                    onClick={() => setTab(t.id)}
                    className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 text-[10px] sm:text-[11px] tracking-[0.28em] uppercase border-2 transition-colors ${
                      active
                        ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                        : "bg-transparent text-[#5C5248] border-[#2C2621]/20 hover:border-[#2C2621]/50 hover:text-[#2C2621]"
                    }`}
                  >
                    <t.Icon className="w-3.5 h-3.5" strokeWidth={1.7} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Calendly widget — only the active one is mounted to keep the API
                load minimal and the page interaction snappy. */}
            <div className="bg-[#FDFBF7] border border-[#2C2621]/10 p-3 md:p-4">
              {tab === "phone"
                ? <CalendlyEmbed url={CALENDLY_PHONE}  testid="contact-calendly-phone"  />
                : <CalendlyEmbed url={CALENDLY_OFFICE} testid="contact-calendly-office" />}
            </div>
          </div>
        </section>

        {/* ============== DIRECT CONTACT ============== */}
        <section data-testid="contact-direct" className="py-20 md:py-28 border-b border-[#2C2621]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-12">
              <span className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4">
                {pick(COPY.contact.eyebrow, lang)}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight">
                {pick(COPY.contact.title, lang)}
              </h2>
              <p className="mt-5 text-[14px] md:text-base text-[#5C5248] leading-relaxed">
                {pick(COPY.contact.body, lang)}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
              {/* Phone card */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-[#C16542]" strokeWidth={1.7} />
                  <h3 className="font-serif text-2xl text-[#2C2621]">
                    {pick(COPY.contact.phoneTitle, lang)}
                  </h3>
                </div>
                <p className="text-[14px] text-[#5C5248] leading-relaxed mb-6">
                  {pick(COPY.contact.phoneBody, lang)}
                </p>
                <a
                  href={`tel:${CONTACT.phoneRaw || "+34937268366"}`}
                  data-testid="contact-phone-link"
                  className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-6 py-4 text-[11px] tracking-[0.28em] uppercase transition-colors w-fit"
                >
                  <Phone className="w-3.5 h-3.5" strokeWidth={1.7} />
                  {CONTACT.phone || "+34 937 268 366"}
                </a>
                <a
                  href={`mailto:${CONTACT.email || "xalucatours@xaluca.com"}`}
                  data-testid="contact-email-link"
                  className="inline-flex items-center gap-3 mt-4 text-[13px] text-[#2C2621] hover:text-[#C16542] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.7} />
                  {CONTACT.email || "xalucatours@xaluca.com"}
                </a>
              </div>

              {/* Form card */}
              <div className="lg:col-span-3 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-5 h-5 text-[#C16542]" strokeWidth={1.7} />
                  <h3 className="font-serif text-2xl text-[#2C2621]">
                    {pick(COPY.contact.formTitle, lang)}
                  </h3>
                </div>
                <p className="text-[14px] text-[#5C5248] leading-relaxed mb-6">
                  {pick(COPY.contact.formBody, lang)}
                </p>
                <div className="bg-[#FDFBF7] border border-[#2C2621]/10 p-6 md:p-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== WHY US ============== */}
        <section data-testid="contact-reasons" className="py-20 md:py-28 bg-[#F8F2E6]/40 border-b border-[#2C2621]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-14">
              <span className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4">
                {pick(COPY.reasons.eyebrow, lang)}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight">
                {pick(COPY.reasons.title, lang)}
              </h2>
              <p className="mt-5 text-[14px] md:text-base text-[#5C5248] leading-relaxed">
                {pick(COPY.reasons.body, lang)}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
              {COPY.reasons.items.map((r, i) => (
                <div
                  key={i}
                  data-testid={`contact-reason-${i + 1}`}
                  className="bg-[#FDFBF7] border border-[#2C2621]/10 p-7 hover:border-[#C16542]/50 hover:shadow-[0_18px_40px_-22px_rgba(44,38,33,0.35)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <r.icon className="w-7 h-7 text-[#C16542] mb-5" strokeWidth={1.5} />
                  <h3 className="font-serif text-xl text-[#2C2621] leading-tight mb-3">
                    {pick(r.title, lang)}
                  </h3>
                  <p className="text-[13px] text-[#5C5248] leading-relaxed">{pick(r.body, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== QUICK INFO STRIP ============== */}
        <section data-testid="contact-quick" className="py-14 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 items-start">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C16542] mt-1" strokeWidth={1.7} />
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-1">
                    {pick(COPY.quick.hoursLabel, lang)}
                  </p>
                  <p className="text-[14px] text-[#2C2621]">{pick(COPY.quick.hoursValue, lang)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C16542] mt-1" strokeWidth={1.7} />
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-1">
                    {lang === "en" ? "Phone" : lang === "fr" ? "Téléphone" : "Teléfono"}
                  </p>
                  <a
                    href={`tel:${CONTACT.phoneRaw || "+34937268366"}`}
                    className="text-[14px] text-[#2C2621] hover:text-[#C16542] transition-colors"
                  >
                    {CONTACT.phone || "+34 937 268 366"}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C16542] mt-1" strokeWidth={1.7} />
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-1">
                    {lang === "en" ? "Email" : "Email"}
                  </p>
                  <a
                    href={`mailto:${CONTACT.email || "xalucatours@xaluca.com"}`}
                    className="text-[14px] text-[#2C2621] hover:text-[#C16542] transition-colors break-all"
                  >
                    {CONTACT.email || "xalucatours@xaluca.com"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </SlotScope>
  );
};

export default ContactPage;
