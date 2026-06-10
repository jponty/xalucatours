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
import { Link } from "react-router-dom";
import {
  Compass, Calendar, CheckCircle2, Phone, Mail, MapPin, Clock,
  Headphones, Users, Sparkles, ShieldCheck, MessageCircle, Star,
  MessagesSquare, BookOpen, Bot, Briefcase, LifeBuoy, CalendarClock, Car, Bus,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import EditableImage from "@/components/EditableImage";
import { E } from "@/components/EditableSection";
import { SlotScope } from "@/components/slotScope";
import FormTabs from "@/components/FormTabs";
import { CalendlyEmbed, useCalendlyScript, CALENDLY_PHONE, CALENDLY_OFFICE } from "@/components/CalendlyEmbed";
import { IMG } from "@/lib/imageBank";
import { CONTACT } from "@/lib/data";

const COPY = {
  hero: {
    eyebrow: { es: "Contacto · Cita previa", en: "Contact · Book a session", fr: "Contact · Rendez-vous" },
    title:   { es: "El inicio de una gran aventura",
               en: "The start of a great adventure",
               fr: "Le début d'une grande aventure" },
    body:    { es: "Planifica tu próxima aventura por Marruecos y resuelve directamente todas tus dudas a través de sesiones informativas online o en nuestras oficinas con agentes de viajes especialistas en ofrecerte la experiencia que mejor se adapte a ti.",
               en: "Plan your next Moroccan adventure and clear every question in a one-on-one session — online or at our offices — with travel specialists who will tailor the experience to you.",
               fr: "Planifiez votre prochaine aventure marocaine et levez tous vos doutes lors d'une séance personnalisée — en ligne ou dans nos bureaux — avec des spécialistes du voyage qui adapteront l'expérience à votre style." },
    support: { es: "Reserva una sesión informativa sin compromiso. Te respondemos en menos de 24 h con un itinerario inicial pensado para ti.",
               en: "Book a no-strings info session. We reply within 24 hours with a first-draft itinerary tailored to you.",
               fr: "Réservez une séance d'information sans engagement. Nous vous répondons en moins de 24 h avec un premier itinéraire pensé pour vous." },
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
    formBody:    { es: "Rellena el formulario de contacto para recibir asistencia personalizada y comenzar a organizar tu próxima aventura por Marruecos.",
                   en: "Fill out the contact form to receive personalized assistance and start planning your next Moroccan adventure.",
                   fr: "Remplissez le formulaire de contact pour recevoir une assistance personnalisée et commencer à organiser votre prochaine aventure marocaine." },
    apptTitle:   { es: "Cita previa", en: "Book an appointment", fr: "Rendez-vous" },
    apptBody:    { es: "Reserva una cita con nuestro equipo y planifica tu viaje de forma personalizada, por teléfono o en nuestras oficinas.",
                   en: "Book an appointment with our team and plan your trip in a personalized way, by phone or at our offices.",
                   fr: "Réservez un rendez-vous avec notre équipe et planifiez votre voyage de façon personnalisée, par téléphone ou dans nos bureaux." },
    apptCta:     { es: "Reservar cita", en: "Book appointment", fr: "Réserver" },
    chatTitle:   { es: "Chat", en: "Chat", fr: "Chat" },
    chatBody:    { es: "Contacta mediante el chat de asistencia y recibe ayuda inmediata para resolver tus dudas al instante.",
                   en: "Reach out via the support chat and get instant help to resolve your questions right away.",
                   fr: "Contactez-nous via le chat d'assistance et recevez une aide immédiate pour répondre à vos questions." },
    chatCta:     { es: "Abrir el chat", en: "Open the chat", fr: "Ouvrir le chat" },
    helpTitle:   { es: "Página de asistencia", en: "Help center", fr: "Centre d'aide" },
    helpBody:    { es: "Accede al centro de ayuda y consulta preguntas frecuentes, información útil y los distintos canales de soporte disponibles.",
                   en: "Access the help center to browse FAQs, useful information and the different support channels available.",
                   fr: "Accédez au centre d'aide pour consulter la FAQ, des informations utiles et les différents canaux de support disponibles." },
    helpCta:     { es: "Centro de ayuda", en: "Help center", fr: "Centre d'aide" },
  },
  support: {
    eyebrow: { es: "Asistencia", en: "Support", fr: "Assistance" },
    title:   { es: "¿Necesitas ayuda?", en: "Need help?", fr: "Besoin d'aide ?" },
    body:    { es: "Estamos aquí para ayudarte de la forma que te resulte más cómoda. Nuestro sistema combina la asistencia inmediata de un asistente virtual con la atención personalizada de nuestro equipo cuando sea necesario.",
               en: "We're here to help in whatever way suits you best. Our system combines the instant support of a virtual assistant with the personal attention of our team whenever needed.",
               fr: "Nous sommes là pour vous aider de la manière qui vous convient le mieux. Notre système combine l'assistance immédiate d'un assistant virtuel et l'attention personnalisée de notre équipe lorsque c'est nécessaire." },
    chatCta: { es: "Abrir el chat de asistencia", en: "Open the support chat", fr: "Ouvrir le chat d'assistance" },
    pageCta: { es: "Abrir la página de asistencia", en: "Open the support page", fr: "Ouvrir la page d'assistance" },
    items: [
      { icon: MessageCircle, title: { es: "Chat de asistencia", en: "Support chat", fr: "Chat d'assistance" },
        body: { es: "Obtén ayuda inmediata a través del chat disponible en esta página.",
                en: "Get instant help through the chat available on this page.",
                fr: "Obtenez une aide immédiate via le chat disponible sur cette page." } },
      { icon: BookOpen, title: { es: "Conversaciones guiadas", en: "Guided conversations", fr: "Conversations guidées" },
        body: { es: "Resuelve dudas frecuentes mediante conversaciones guiadas conectadas a nuestra base de conocimientos y documentación.",
                en: "Resolve common questions through guided conversations connected to our knowledge base and documentation.",
                fr: "Résolvez les questions fréquentes grâce à des conversations guidées connectées à notre base de connaissances et à notre documentation." } },
      { icon: Bot, title: { es: "Asistente virtual y agentes humanos", en: "Virtual assistant & human agents", fr: "Assistant virtuel et agents humains" },
        body: { es: "Nuestro sistema combina respuestas automáticas con la supervisión de agentes humanos para ofrecer una atención más eficiente y personalizada.",
                en: "Our system combines automatic responses with human agent oversight to deliver more efficient and personalized support.",
                fr: "Notre système combine des réponses automatiques et la supervision d'agents humains pour offrir une assistance plus efficace et personnalisée." } },
      { icon: Briefcase, title: { es: "Departamento de viajes", en: "Travel department", fr: "Service voyages" },
        body: { es: "Si necesitas atención personalizada, nuestro equipo está siempre disponible para ayudarte. Todas las conversaciones son revisadas y supervisadas por nuestro equipo de viajes para garantizar que recibas la mejor asistencia posible. Además del chat, podrás contar con atención directa por teléfono, correo electrónico o contacto personalizado siempre que lo necesites.",
                en: "If you need personalized attention, our team is always available to help you. All conversations are reviewed and supervised by our travel team to ensure you receive the best possible assistance. Beyond the chat, you can count on direct support by phone, email or personalized contact whenever you need it.",
                fr: "Si vous avez besoin d'une attention personnalisée, notre équipe est toujours disponible pour vous aider. Toutes les conversations sont vérifiées et supervisées par notre équipe voyages afin de vous garantir la meilleure assistance possible. Au-delà du chat, vous pourrez compter sur une assistance directe par téléphone, e-mail ou contact personnalisé chaque fois que vous en aurez besoin." } },
    ],
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
        body: { es: "Más de 30 años organizando viajes por Marruecos. Conocemos cada rincón y la mejor manera de vivirlo.",
                en: "Over 30 years organizing trips across Morocco. We know every corner and the best way to live it.",
                fr: "Plus de 30 ans d'organisation de voyages au Maroc. Nous connaissons chaque recoin et la meilleure façon de le vivre." } },
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
      <main data-testid="contact-page" className="bg-[#FDFBF7]">

        {/* ============== HERO · same pattern as /quehacemos (image + Ken Burns, no video) ============== */}
        <section
          data-testid="contact-hero"
          className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#1A1513]"
        >
          <EditableImage
            slot="contact.hero"
            fallback={IMG.medinaPeople || IMG.koutoubia}
            alt=""
            aspectRatio="auto"
            imgProps={{ loading: "eager" }}
            className="ken-burns absolute inset-0 w-full h-full object-cover"
          />
          {/* Legibility stack — identical to QueHacemos hero */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/50 to-[#1A1513]/30 pointer-events-none" />
          <div className="absolute inset-0 berber-bg-cross opacity-40 pointer-events-none" aria-hidden="true" />
          <span className="film-grain pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col">
            <div className="pt-[88px] md:pt-[96px] px-6 md:px-12 max-w-7xl mx-auto w-full" />
            <div className="flex-1 flex items-end pt-32 md:pt-44 pb-24 md:pb-32">
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <div className="max-w-3xl">
                  <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
                    <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
                    <E name="hero.eyebrow" defaults={COPY.hero.eyebrow} multiline={false}
                       className="text-[11px] tracking-[0.35em] uppercase font-semibold" />
                  </div>

                  <E name="hero.title" defaults={COPY.hero.title} multiline={false} as="h1"
                     className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6" />

                  <E name="hero.body" defaults={COPY.hero.body} as="p"
                     className="fade-up fade-up-delay-2 mt-8 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed" />

                  <div className="fade-up fade-up-delay-3 mt-10 flex flex-wrap items-center gap-4">
                    <a
                      href="#booking"
                      data-testid="hero-cta-book"
                      className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
                    >
                      <E name="hero.ctaBook" multiline={false}
                         defaults={{ es: "Reservar cita", en: "Book a session", fr: "Réserver une séance" }} />
                      <Calendar className="w-3.5 h-3.5" strokeWidth={1.6} />
                    </a>
                    <a
                      href={`tel:${CONTACT.phoneRaw || "+34937268366"}`}
                      data-testid="hero-cta-call"
                      className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
                    >
                      <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {CONTACT.phone || "+34 937 268 366"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== DIRECT CONTACT — phone + email cards ============== */}
        <section data-testid="contact-direct" className="py-20 md:py-28 border-b border-[#2C2621]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-12">
              <E name="contact.eyebrow" defaults={COPY.contact.eyebrow} multiline={false} as="span"
                 className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4" />
              <E name="contact.title" defaults={COPY.contact.title} multiline={false} as="h2"
                 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight" />
              <E name="contact.body" defaults={COPY.contact.body} as="p"
                 className="mt-5 text-[14px] md:text-base text-[#5C5248] leading-relaxed" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Phone card */}
              <div className="border border-[#2C2621]/12 p-7 md:p-9 hover:border-[#C16542]/50 transition-colors flex flex-col">
                <Phone className="w-6 h-6 text-[#C16542] mb-5" strokeWidth={1.6} />
                <E name="contact.phoneTitle" defaults={COPY.contact.phoneTitle} multiline={false} as="h3"
                   className="font-serif text-2xl text-[#2C2621] mb-3" />
                <E name="contact.phoneBody" defaults={COPY.contact.phoneBody} as="p"
                   className="text-[14px] text-[#5C5248] leading-relaxed mb-7 flex-1" />
                <a
                  href={`tel:${CONTACT.phoneRaw || "+34937268366"}`}
                  data-testid="contact-phone-link"
                  className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-6 py-4 text-[11px] tracking-[0.28em] uppercase transition-colors w-fit"
                >
                  <Phone className="w-3.5 h-3.5" strokeWidth={1.7} />
                  {CONTACT.phone || "+34 937 268 366"}
                </a>
              </div>

              {/* Form card */}
              <div className="border border-[#2C2621]/12 p-7 md:p-9 hover:border-[#C16542]/50 transition-colors flex flex-col">
                <Mail className="w-6 h-6 text-[#C16542] mb-5" strokeWidth={1.6} />
                <E name="contact.formTitle" defaults={COPY.contact.formTitle} multiline={false} as="h3"
                   className="font-serif text-2xl text-[#2C2621] mb-3" />
                <E name="contact.formBody" defaults={COPY.contact.formBody} as="p"
                   className="text-[14px] text-[#5C5248] leading-relaxed mb-7 flex-1" />
                <a
                  href="#contact-form"
                  data-testid="contact-form-anchor"
                  className="inline-flex items-center gap-3 border border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-6 py-4 text-[11px] tracking-[0.28em] uppercase transition-colors w-fit"
                >
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.7} />
                  <E name="contact.goForm" multiline={false}
                     defaults={{ es: "Ir al formulario", en: "Go to form", fr: "Aller au formulaire" }} />
                </a>
              </div>

              {/* Appointment card */}
              <div className="border border-[#2C2621]/12 p-7 md:p-9 hover:border-[#C16542]/50 transition-colors flex flex-col">
                <CalendarClock className="w-6 h-6 text-[#C16542] mb-5" strokeWidth={1.6} />
                <E name="contact.apptTitle" defaults={COPY.contact.apptTitle} multiline={false} as="h3"
                   className="font-serif text-2xl text-[#2C2621] mb-3" />
                <E name="contact.apptBody" defaults={COPY.contact.apptBody} as="p"
                   className="text-[14px] text-[#5C5248] leading-relaxed mb-7 flex-1" />
                <Link
                  to={pathFor(lang, "appointment")}
                  data-testid="contact-appt-link"
                  className="inline-flex items-center gap-3 border border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-6 py-4 text-[11px] tracking-[0.28em] uppercase transition-colors w-fit"
                >
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.7} />
                  <E name="contact.apptCta" defaults={COPY.contact.apptCta} multiline={false} />
                </Link>
              </div>

              {/* Chat card */}
              <div className="border border-[#2C2621]/12 p-7 md:p-9 hover:border-[#C16542]/50 transition-colors flex flex-col">
                <MessageCircle className="w-6 h-6 text-[#C16542] mb-5" strokeWidth={1.6} />
                <E name="contact.chatTitle" defaults={COPY.contact.chatTitle} multiline={false} as="h3"
                   className="font-serif text-2xl text-[#2C2621] mb-3" />
                <E name="contact.chatBody" defaults={COPY.contact.chatBody} as="p"
                   className="text-[14px] text-[#5C5248] leading-relaxed mb-7 flex-1" />
                <button
                  type="button"
                  data-testid="contact-chat-button"
                  onClick={() => {
                    try {
                      if (window.chatbase && typeof window.chatbase.open === "function") {
                        window.chatbase.open();
                        return;
                      }
                    } catch (e) { /* fall through */ }
                    window.open("https://www.chatbase.co/0g0xD-K8_amm7Ihz-vPj2/help", "_blank", "noopener,noreferrer");
                  }}
                  className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-6 py-4 text-[11px] tracking-[0.28em] uppercase transition-colors w-fit"
                >
                  <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.7} />
                  <E name="contact.chatCta" defaults={COPY.contact.chatCta} multiline={false} />
                </button>
              </div>

              {/* Help center card */}
              <div className="border border-[#2C2621]/12 p-7 md:p-9 hover:border-[#C16542]/50 transition-colors flex flex-col">
                <LifeBuoy className="w-6 h-6 text-[#C16542] mb-5" strokeWidth={1.6} />
                <E name="contact.helpTitle" defaults={COPY.contact.helpTitle} multiline={false} as="h3"
                   className="font-serif text-2xl text-[#2C2621] mb-3" />
                <E name="contact.helpBody" defaults={COPY.contact.helpBody} as="p"
                   className="text-[14px] text-[#5C5248] leading-relaxed mb-7 flex-1" />
                <a
                  href="https://www.chatbase.co/0g0xD-K8_amm7Ihz-vPj2/help"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="contact-help-link"
                  className="inline-flex items-center gap-3 border border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-6 py-4 text-[11px] tracking-[0.28em] uppercase transition-colors w-fit"
                >
                  <LifeBuoy className="w-3.5 h-3.5" strokeWidth={1.7} />
                  <E name="contact.helpCta" defaults={COPY.contact.helpCta} multiline={false} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 3 STEPS ============== */}
        <section data-testid="contact-steps" className="py-20 md:py-28 border-b border-[#2C2621]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-14">
              <E name="steps.eyebrow" defaults={COPY.steps.eyebrow} multiline={false} as="span"
                className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4" />
              <E name="steps.title" defaults={COPY.steps.title} multiline={false} as="h2"
                className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {COPY.steps.items.map((s, i) => (
                <div key={s.title.es} data-testid={`contact-step-${i + 1}`} className="relative pl-0">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-[#2C2621] text-[#FDFBF7]">
                      <s.icon className="w-5 h-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-[11px] tracking-[0.32em] uppercase text-[#C16542]">
                      0{i + 1}
                    </span>
                  </div>
                  <E name={`steps.items.${i}.title`} defaults={s.title} multiline={false} as="h3"
                     className="font-serif text-xl md:text-2xl text-[#2C2621] leading-tight mb-3" />
                  <E name={`steps.items.${i}.body`} defaults={s.body} as="p"
                     className="text-[14px] text-[#5C5248] leading-relaxed" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== CALENDLY BOOKING ============== */}
        <section
          id="booking"
          data-testid="contact-booking"
          className="py-20 md:py-28 bg-[#F8F2E6]/40 border-b border-[#2C2621]/10"
        >
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <E name="booking.eyebrow" defaults={COPY.booking.eyebrow} multiline={false} as="span"
                 className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4" />
              <E name="booking.title" defaults={COPY.booking.title} multiline={false} as="h2"
                 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight" />
              <E name="booking.body" defaults={COPY.booking.body} as="p"
                 className="mt-5 text-[14px] md:text-base text-[#5C5248] leading-relaxed" />
            </div>

            {/* Tabs */}
            <div role="tablist" className="flex items-stretch justify-center gap-0 mb-8">
              {[
                { id: "phone",  Icon: Phone,  label: <E name="booking.tabPhone" defaults={COPY.booking.tabPhone} multiline={false} />, testid: "tab-phone" },
                { id: "office", Icon: MapPin, label: <E name="booking.tabOffice" defaults={COPY.booking.tabOffice} multiline={false} />, testid: "tab-office" },
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

        {/* ============== SUPPORT OPTIONS — ¿Necesitas ayuda? ============== */}
        <section data-testid="contact-support" className="py-20 md:py-28 border-b border-[#2C2621]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-12">
              <span className="inline-flex items-center gap-3 text-[#C16542] mb-4">
                <LifeBuoy className="w-3.5 h-3.5" strokeWidth={1.7} />
                <E name="support.eyebrow" defaults={COPY.support.eyebrow} multiline={false} as="span"
                   className="text-[11px] tracking-[0.4em] uppercase" />
              </span>
              <E name="support.title" defaults={COPY.support.title} multiline={false} as="h2"
                 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight" />
              <E name="support.body" defaults={COPY.support.body} as="p"
                 className="mt-5 text-[14px] md:text-base text-[#5C5248] leading-relaxed" />

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  data-testid="support-open-chat"
                  onClick={() => {
                    try {
                      if (window.chatbase && typeof window.chatbase.open === "function") {
                        window.chatbase.open();
                        return;
                      }
                    } catch (e) { /* fall through */ }
                    window.open("https://www.chatbase.co/0g0xD-K8_amm7Ihz-vPj2/help", "_blank", "noopener,noreferrer");
                  }}
                  className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.7} />
                  <E name="support.chatCta" defaults={COPY.support.chatCta} multiline={false} />
                </button>

                <a
                  href="https://www.chatbase.co/0g0xD-K8_amm7Ihz-vPj2/help"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="support-open-page"
                  className="inline-flex items-center gap-3 border border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  <LifeBuoy className="w-3.5 h-3.5" strokeWidth={1.7} />
                  <E name="support.pageCta" defaults={COPY.support.pageCta} multiline={false} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-7">
              {COPY.support.items.map((s, i) => (
                <div
                  key={s.title.es}
                  data-testid={`contact-support-${i + 1}`}
                  className="border border-[#2C2621]/12 p-7 md:p-8 hover:border-[#C16542]/50 hover:shadow-[0_18px_40px_-22px_rgba(44,38,33,0.35)] transition-all duration-300 flex flex-col"
                >
                  <s.icon className="w-7 h-7 text-[#C16542] mb-5" strokeWidth={1.5} />
                  <E name={`support.items.${i}.title`} defaults={s.title} multiline={false} as="h3"
                     className="font-serif text-xl md:text-2xl text-[#2C2621] leading-tight mb-3" />
                  <E name={`support.items.${i}.body`} defaults={s.body} as="p"
                     className="text-[14px] text-[#5C5248] leading-relaxed" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== WHY US ============== */}
        <section data-testid="contact-reasons" className="py-20 md:py-28 bg-[#F8F2E6]/40 border-b border-[#2C2621]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-14">
              <E name="reasons.eyebrow" defaults={COPY.reasons.eyebrow} multiline={false} as="span"
                 className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4" />
              <E name="reasons.title" defaults={COPY.reasons.title} multiline={false} as="h2"
                 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight" />
              <E name="reasons.body" defaults={COPY.reasons.body} as="p"
                 className="mt-5 text-[14px] md:text-base text-[#5C5248] leading-relaxed" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
              {COPY.reasons.items.map((r, i) => (
                <div
                  key={r.title.es}
                  data-testid={`contact-reason-${i + 1}`}
                  className="bg-[#FDFBF7] border border-[#2C2621]/10 p-7 hover:border-[#C16542]/50 hover:shadow-[0_18px_40px_-22px_rgba(44,38,33,0.35)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <r.icon className="w-7 h-7 text-[#C16542] mb-5" strokeWidth={1.5} />
                  <E name={`reasons.items.${i}.title`} defaults={r.title} multiline={false} as="h3"
                     className="font-serif text-xl text-[#2C2621] leading-tight mb-3" />
                  <E name={`reasons.items.${i}.body`} defaults={r.body} as="p"
                     className="text-[13px] text-[#5C5248] leading-relaxed" />
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
                  <E name="quick.hoursLabel" defaults={COPY.quick.hoursLabel} multiline={false} as="p"
                     className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-1" />
                  <E name="quick.hoursValue" defaults={COPY.quick.hoursValue} multiline={false} as="p"
                     className="text-[14px] text-[#2C2621]" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C16542] mt-1" strokeWidth={1.7} />
                <div>
                  <E name="quick.phoneLabel" multiline={false} as="p"
                     defaults={{ es: "Teléfono", en: "Phone", fr: "Téléphone" }}
                     className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-1" />
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
                  <E name="quick.emailLabel" multiline={false} as="p"
                     defaults={{ es: "Email", en: "Email", fr: "E-mail" }}
                     className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-1" />
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

        {/* ============== FORMS — tabbed: detailed planner + quick contact ============== */}
        <div id="contact-form" data-testid="contact-form-section">
          <FormTabs defaultTab="detailed" />
        </div>

        {/* ============== HOW TO REACH US — map + location ============== */}
        <section data-testid="contact-location" className="py-20 md:py-28 border-t border-[#2C2621]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-12">
              <span className="inline-flex items-center gap-3 text-[#C16542] mb-4">
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.7} />
                <E name="location.eyebrow" defaults={{ es: "Visítanos", en: "Visit us", fr: "Visitez-nous" }} multiline={false} as="span"
                   className="text-[11px] tracking-[0.4em] uppercase" />
              </span>
              <E name="location.title" defaults={{ es: "Cómo llegar a nuestras oficinas", en: "How to reach our offices", fr: "Comment rejoindre nos bureaux" }} multiline={false} as="h2"
                 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight" />
              <E name="location.intro"
                 defaults={{
                   es: "Si lo prefieres, puedes visitarnos en persona. Te recibiremos en nuestras oficinas de Sabadell para ofrecerte asesoramiento personalizado y planificar contigo, con calma, tu próximo viaje a Marruecos.",
                   en: "If you prefer, you can visit us in person. We'll welcome you at our Sabadell offices for personalized advice and to plan your next trip to Morocco together, at your own pace.",
                   fr: "Si vous préférez, vous pouvez nous rendre visite en personne. Nous vous accueillerons dans nos bureaux de Sabadell pour vous conseiller et planifier ensemble, en toute tranquillité, votre prochain voyage au Maroc.",
                 }} as="p"
                 className="mt-5 text-[14px] md:text-base text-[#5C5248] leading-relaxed" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
              {/* Interactive map */}
              <div className="min-h-[340px] lg:min-h-full border border-[#2C2621]/12 overflow-hidden" data-testid="contact-map">
                <iframe
                  title="Xaluca Tours — Calle Latorre 52, Sabadell"
                  src="https://www.google.com/maps?q=Calle%20Latorre%2052%2C%2008201%20Sabadell%2C%20Barcelona%2C%20Espa%C3%B1a&t=k&z=18&output=embed"
                  className="w-full h-full min-h-[340px]"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              {/* Location info */}
              <div className="flex flex-col">
                <div className="border border-[#2C2621]/12 p-7 md:p-9">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C16542] mt-1 shrink-0" strokeWidth={1.7} />
                    <div>
                      <span className="block text-[10px] tracking-[0.3em] uppercase text-[#5C5248] mb-2">
                        {pick({ es: "Dirección", en: "Address", fr: "Adresse" }, lang)}
                      </span>
                      <address className="not-italic text-[15px] text-[#2C2621] leading-relaxed" data-testid="contact-address">
                        <strong className="font-medium">Xaluca Tours</strong><br />
                        Calle Latorre, 52<br />
                        08201 Sabadell<br />
                        Barcelona, {pick({ es: "España", en: "Spain", fr: "Espagne" }, lang)}
                      </address>
                    </div>
                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Calle+Latorre+52+08201+Sabadell+Barcelona+Espa%C3%B1a"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="contact-google-maps"
                    className="mt-6 inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors w-fit"
                  >
                    <MapPin className="w-3.5 h-3.5" strokeWidth={1.7} />
                    <E name="location.cta" defaults={{ es: "Abrir en Google Maps", en: "Open in Google Maps", fr: "Ouvrir dans Google Maps" }} multiline={false} />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                  {/* By car */}
                  <div className="border border-[#2C2621]/12 p-6" data-testid="contact-by-car">
                    <Car className="w-6 h-6 text-[#C16542] mb-4" strokeWidth={1.5} />
                    <E name="location.car.title" defaults={{ es: "En coche", en: "By car", fr: "En voiture" }} multiline={false} as="h3"
                       className="font-serif text-xl text-[#2C2621] mb-2" />
                    <E name="location.car.body"
                       defaults={{
                         es: "A pocos minutos de la C-58 y la AP-7. Encontrarás aparcamiento público en las calles cercanas y en parkings del centro de Sabadell.",
                         en: "A few minutes from the C-58 and AP-7 motorways. Public parking is available on nearby streets and in car parks in central Sabadell.",
                         fr: "À quelques minutes des autoroutes C-58 et AP-7. Stationnement public dans les rues voisines et dans les parkings du centre de Sabadell.",
                       }} as="p"
                       className="text-[13px] text-[#5C5248] leading-relaxed" />
                  </div>

                  {/* Public transport */}
                  <div className="border border-[#2C2621]/12 p-6" data-testid="contact-by-transit">
                    <Bus className="w-6 h-6 text-[#C16542] mb-4" strokeWidth={1.5} />
                    <E name="location.transit.title" defaults={{ es: "En transporte público", en: "By public transport", fr: "En transports en commun" }} multiline={false} as="h3"
                       className="font-serif text-xl text-[#2C2621] mb-2" />
                    <E name="location.transit.body"
                       defaults={{
                         es: "Bien conectado con los FGC y Renfe desde Barcelona (estaciones de Sabadell), además de varias líneas de autobús urbano con parada en las inmediaciones.",
                         en: "Well connected by FGC and Renfe trains from Barcelona (Sabadell stations), plus several city bus lines stopping nearby.",
                         fr: "Bien desservi par les trains FGC et Renfe depuis Barcelone (gares de Sabadell), ainsi que plusieurs lignes de bus urbain à proximité.",
                       }} as="p"
                       className="text-[13px] text-[#5C5248] leading-relaxed" />
                  </div>
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
