/* ============================================================
   CitaPreviaPage.jsx · /citaprevia · /en/book-appointment · /fr/prendre-rendez-vous
   ------------------------------------------------------------
   Focused "book an info session" funnel:
     1. Hero — "Planifica tu próxima aventura por Marruecos"
     2. Three detailed steps (Planifica → Selecciona → Confirma)
     3. Calendly booking surface (phone / office tabs)
     4. CTA to the full contact page / phone
   All copy is editable via <E> (SlotScope id="citaprevia").
============================================================ */
import React, { useEffect } from "react";
import { Compass, Calendar, CheckCircle2, Phone, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EditableImage from "@/components/EditableImage";
import { E } from "@/components/EditableSection";
import { SlotScope } from "@/components/slotScope";
import ContactForm from "@/components/ContactForm";
import BookingSession from "@/components/BookingSession";
import { IMG } from "@/lib/imageBank";
import { CONTACT } from "@/lib/data";

const COPY = {
  hero: {
    eyebrow: { es: "Cita previa · Sesión informativa", en: "Book an appointment · Info session", fr: "Rendez-vous · Séance d'information" },
    title: {
      es: "Planifica tu próxima aventura por Marruecos",
      en: "Plan your next Moroccan adventure",
      fr: "Planifiez votre prochaine aventure marocaine",
    },
    body: {
      es: "Planifica tu próxima aventura por Marruecos y resuelve directamente todas tus dudas a través de sesiones informativas online o en nuestras oficinas con agentes de viajes especialistas en ofrecerte la experiencia que mejor se adapte a ti.",
      en: "Plan your next Moroccan adventure and clear every question in a one-on-one session — online or at our offices — with travel specialists who will tailor the experience to you.",
      fr: "Planifiez votre prochaine aventure marocaine et levez tous vos doutes lors d'une séance personnalisée — en ligne ou dans nos bureaux — avec des spécialistes du voyage qui adapteront l'expérience à votre style.",
    },
  },
  steps: {
    eyebrow: { es: "Tres pasos · cero compromiso", en: "Three steps · zero commitment", fr: "Trois étapes · sans engagement" },
    title: { es: "Pide tu cita previa en tres pasos", en: "Book your appointment in three steps", fr: "Réservez votre rendez-vous en trois étapes" },
    items: [
      {
        icon: Compass,
        title: { es: "Planifica tu próxima aventura por Marruecos", en: "Plan your next Moroccan adventure", fr: "Planifiez votre prochaine aventure marocaine" },
        body: {
          es: "A través de las sesiones informativas con nuestros agentes especialistas podrás planificar tu viaje por Marruecos sin ningún tipo de compromiso. Visita nuestra sección de viajes y infórmate sobre todas las opciones disponibles. Cualquier duda o preguntas que tengas podrás resolverlas directamente en las sesiones vía llamada telefónica con uno/a de nuestros/as asesores/as de viajes o en nuestras oficinas.",
          en: "Through info sessions with our specialist agents you can plan your trip to Morocco with no commitment whatsoever. Browse our trips section and learn about every available option. Any question you have can be answered directly in the session — by phone with one of our travel advisors or at our offices.",
          fr: "Lors des séances d'information avec nos agents spécialisés, vous pouvez planifier votre voyage au Maroc sans aucun engagement. Parcourez notre section voyages et découvrez toutes les options disponibles. Toutes vos questions trouveront une réponse directement pendant la séance — par téléphone avec l'un de nos conseillers ou dans nos bureaux.",
        },
      },
      {
        icon: Calendar,
        title: { es: "Selecciona el día y hora que mejor te convenga", en: "Pick the day and time that suit you best", fr: "Choisissez le jour et l'heure qui vous conviennent" },
        body: {
          es: "Las sesiones informativas con nuestros/as agentes de viajes se realizan a través de una llamada telefónica o bien en nuestras oficinas. Para pedir cita previa sólo tienes que seleccionar el día y la hora que mejor se adapten a tu agenda, y reservar la sesión. Uno/a de nuestros/as agentes especialistas se pondrá directamente en contacto contigo para resolver todas tus peticiones y empezar a planificar tu próxima aventura por Marruecos.",
          en: "Info sessions with our travel agents take place by phone or at our offices. To book an appointment, simply select the day and time that best fit your schedule and reserve the session. One of our specialist agents will contact you directly to handle every request and start planning your next Moroccan adventure.",
          fr: "Les séances d'information avec nos agents de voyage ont lieu par téléphone ou dans nos bureaux. Pour prendre rendez-vous, il vous suffit de choisir le jour et l'heure qui conviennent le mieux à votre agenda et de réserver la séance. L'un de nos agents spécialisés vous contactera directement pour répondre à toutes vos demandes et commencer à planifier votre prochaine aventure marocaine.",
        },
      },
      {
        icon: CheckCircle2,
        title: { es: "Confirma la sesión y resuelve todas tus dudas", en: "Confirm your session and ask anything", fr: "Confirmez votre séance et posez vos questions" },
        body: {
          es: "Para confirmar la sesión informativa con uno/a de nuestros/as especialistas, sólo tienes que añadir tu dirección de correo electrónico e indicar el día y la hora que quieres programar tu sesión informativa ya sea vía llamada telefónica o en nuestras oficinas.",
          en: "To confirm your info session with one of our specialists, just add your email address and indicate the day and time you'd like to schedule it — whether by phone or at our offices.",
          fr: "Pour confirmer votre séance d'information avec l'un de nos spécialistes, ajoutez simplement votre adresse e-mail et indiquez le jour et l'heure auxquels vous souhaitez la programmer — par téléphone ou dans nos bureaux.",
        },
      },
    ],
  },
  booking: {
    // Booking copy now lives in <BookingSession> (BOOKING_COPY) so it can be
    // shared 1:1 with the "Cita previa" tab on /planifica-tu-viaje.
  },
  outro: {
    title: { es: "¿Prefieres escribirnos?", en: "Prefer to write to us?", fr: "Vous préférez nous écrire ?" },
    body: {
      es: "Si lo prefieres, llámanos o envíanos tu consulta a través del formulario y un/a agente especialista se pondrá en contacto contigo.",
      en: "If you prefer, call us or send your query through the form and a specialist agent will get back to you.",
      fr: "Si vous préférez, appelez-nous ou envoyez votre demande via le formulaire et un agent spécialiste vous recontactera.",
    },
    cta: { es: "Escríbenos", en: "Write to us", fr: "Écrivez-nous" },
  },
};

const SEO_KEYWORDS = "Viajes a Marruecos, Viajes por Marruecos, Viaje a Marruecos, Viaje por Marruecos, cita previa, sesión informativa";

const CitaPreviaPage = () => {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = ({
      es: "Cita previa · Planifica tu viaje por Marruecos · Xaluca Tours",
      en: "Book an appointment · Plan your trip to Morocco · Xaluca Tours",
      fr: "Prendre rendez-vous · Planifiez votre voyage au Maroc · Xaluca Tours",
    })[lang] || "Cita previa · Xaluca Tours";

    // SEO keywords (rendered as a meta tag, kept out of the visible UI).
    let meta = document.querySelector('meta[name="keywords"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "keywords");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", SEO_KEYWORDS);
  }, [lang]);

  return (
    <SlotScope id="citaprevia">
      <main data-testid="citaprevia-page" className="bg-[#FDFBF7]">

        {/* ============== HERO ============== */}
        <section
          data-testid="citaprevia-hero"
          className="relative h-[88svh] min-h-[600px] w-full overflow-hidden bg-[#1A1513]"
        >
          <EditableImage
            slot="citaprevia.hero"
            fallback={IMG.medinaPeople || IMG.koutoubia}
            alt=""
            priority
            className="ken-burns absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/50 to-[#1A1513]/30 pointer-events-none" />
          <div className="absolute inset-0 berber-bg-cross opacity-40 pointer-events-none" aria-hidden="true" />
          <span className="film-grain pointer-events-none" />

          <div className="relative z-10 h-full flex items-end pt-32 md:pt-44 pb-24 md:pb-28">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
              <div className="max-w-3xl">
                <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.6} />
                  <E name="hero.eyebrow" defaults={COPY.hero.eyebrow} multiline={false}
                     className="text-[11px] tracking-[0.35em] uppercase font-semibold" />
                </div>
                <E name="hero.title" defaults={COPY.hero.title} multiline={false} as="h1"
                   className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight mt-6" />
                <E name="hero.body" defaults={COPY.hero.body} as="p"
                   className="fade-up fade-up-delay-2 mt-7 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed" />
                <div className="fade-up fade-up-delay-3 mt-9 flex flex-wrap items-center gap-4">
                  <a href="#booking" data-testid="citaprevia-hero-cta"
                     className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
                    <E name="hero.cta" multiline={false}
                       defaults={{ es: "Pedir cita previa", en: "Book an appointment", fr: "Prendre rendez-vous" }} />
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
                  </a>
                  <a href={`tel:${CONTACT.phoneRaw || "+34937268366"}`} data-testid="citaprevia-hero-call"
                     className="inline-flex items-center gap-3 border border-[#FDFBF7]/40 hover:border-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1A1513] text-[#FDFBF7] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300">
                    <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {CONTACT.phone || "+34 937 268 366"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== STEPS ============== */}
        <section data-testid="citaprevia-steps" className="py-20 md:py-28 border-b border-[#2C2621]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-14">
              <E name="steps.eyebrow" defaults={COPY.steps.eyebrow} multiline={false} as="span"
                 className="block text-[11px] tracking-[0.4em] uppercase text-[#C16542] mb-4" />
              <E name="steps.title" defaults={COPY.steps.title} multiline={false} as="h2"
                 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {COPY.steps.items.map((s, i) => (
                <div key={i} data-testid={`citaprevia-step-${i + 1}`}>
                  <div className="flex items-center gap-4 mb-5">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-[#2C2621] text-[#FDFBF7]">
                      <s.icon className="w-5 h-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-[11px] tracking-[0.32em] uppercase text-[#C16542]">0{i + 1}</span>
                  </div>
                  <E name={`steps.items.${i}.title`} defaults={s.title} multiline={false} as="h3"
                     className="font-serif text-xl md:text-[22px] text-[#2C2621] leading-snug mb-3" />
                  <E name={`steps.items.${i}.body`} defaults={s.body} as="p"
                     className="text-[14px] text-[#5C5248] leading-relaxed" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== CALENDLY BOOKING ============== */}
        <section id="booking" data-testid="citaprevia-booking"
                 className="py-20 md:py-28 bg-[#F8F2E6]/40 border-b border-[#2C2621]/10">
          <BookingSession testid="citaprevia-booking-session" />
        </section>

        {/* ============== OUTRO CTA ============== */}
        <section data-testid="citaprevia-outro" className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <E name="outro.title" defaults={COPY.outro.title} multiline={false} as="h2"
               className="font-serif text-2xl md:text-3xl text-[#2C2621] leading-tight tracking-tight" />
            <E name="outro.body" defaults={COPY.outro.body} as="p"
               className="mt-4 text-[14px] md:text-base text-[#5C5248] leading-relaxed max-w-2xl mx-auto" />
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="#contact-form" data-testid="citaprevia-outro-contact"
                 className="inline-flex items-center gap-3 border border-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] text-[#2C2621] px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors">
                <E name="outro.cta" defaults={COPY.outro.cta} multiline={false} />
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </a>
              <a href={`tel:${CONTACT.phoneRaw || "+34937268366"}`} data-testid="citaprevia-outro-call"
                 className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-[#C16542] hover:text-[#A35133] transition-colors">
                <Phone className="w-3.5 h-3.5" strokeWidth={1.6} />
                {CONTACT.phone || "+34 937 268 366"}
              </a>
            </div>
          </div>
        </section>

        {/* ============== FORM — same ContactForm used on /contacto ============== */}
        <div id="contact-form" data-testid="citaprevia-form-section">
          <ContactForm />
        </div>

      </main>
    </SlotScope>
  );
};

export default CitaPreviaPage;
