import SectionNav from "@/components/SectionNav";
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
import { Compass, Calendar, CheckCircle2, Phone, ArrowRight, Users, Building2 } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";
import HeroMonogram from "@/components/HeroMonogram";
import { E } from "@/components/EditableSection";
import { SlotScope } from "@/components/slotScope";
import ContactForm from "@/components/ContactForm";
import BookingSession from "@/components/BookingSession";
import TripContextBanner from "@/components/TripContextBanner";
import { IMG } from "@/lib/imageBank";
import { CONTACT } from "@/lib/data";
import { TEAM_MEMBERS } from "@/lib/teamMembers";

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
  team: {
    eyebrow: {
      es: "Las personas detrás de tu viaje",
      en: "The people behind your journey",
      fr: "Les personnes derrière votre voyage",
    },
    title: {
      es: "Conoce al equipo que te acompañará desde la primera conversación.",
      en: "Meet the team who will be by your side from the very first conversation.",
      fr: "Rencontrez l'équipe qui vous accompagnera dès la première conversation.",
    },
    body: {
      es: "Antes de reservar tu sesión, pon cara a las personas que escucharán tus ideas, resolverán tus dudas y convertirán tu manera de imaginar Marruecos en un viaje cuidado a medida.",
      en: "Before booking your session, meet the people who will listen to your ideas, answer your questions and turn the way you imagine Morocco into a carefully tailored journey.",
      fr: "Avant de réserver votre séance, découvrez les personnes qui écouteront vos idées, répondront à vos questions et transformeront votre vision du Maroc en un voyage soigneusement conçu sur mesure.",
    },
    groupEyebrow: {
      es: "La fuerza de Grup Xaluca",
      en: "The strength of Grup Xaluca",
      fr: "La force de Grup Xaluca",
    },
    groupTitle: {
      es: "Más de 1.600 profesionales, un mismo compromiso con tu viaje.",
      en: "More than 1,600 professionals, one shared commitment to your journey.",
      fr: "Plus de 1 600 professionnels, un même engagement pour votre voyage.",
    },
    groupBody: {
      es: "Xaluca Tours forma parte de Grup Xaluca, su empresa matriz. Más de 1.600 profesionales trabajan en las distintas áreas del grupo: hoteles y alojamientos, viajes, transporte, organización de eventos y otros servicios vinculados al turismo en Marruecos. Esta estructura propia nos permite coordinar cada etapa con conocimiento local, atención cercana y un control directo de la experiencia.",
      en: "Xaluca Tours is part of its parent company, Grup Xaluca. More than 1,600 professionals work across the group's different areas: hotels and accommodation, travel, transport, event organisation and other tourism-related services in Morocco. This in-house structure allows us to coordinate every stage with local knowledge, personal care and direct control over the experience.",
      fr: "Xaluca Tours fait partie de sa société mère, Grup Xaluca. Plus de 1 600 professionnels travaillent dans les différents domaines du groupe : hôtels et hébergements, voyages, transport, organisation d'événements et autres services liés au tourisme au Maroc. Cette structure intégrée nous permet de coordonner chaque étape avec une connaissance locale, une attention personnalisée et un contrôle direct de l'expérience.",
    },
    groupStat: {
      es: "Profesionales en Grup Xaluca",
      en: "Professionals at Grup Xaluca",
      fr: "Professionnels au sein de Grup Xaluca",
    },
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

const TeamPreview = ({ lang }) => (
  <section
    id="citaprevia-team"
    data-testid="citaprevia-team"
    className="relative overflow-hidden border-b border-[#2C2621]/10 bg-[#EFE4D3] py-20 md:py-28"
  >
    <div className="absolute inset-0 berber-bg-diamond opacity-35 pointer-events-none" aria-hidden="true" />
    <div className="relative max-w-7xl mx-auto px-6 md:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.36em] uppercase text-[#C16542]">
          <Users className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          <E name="team.eyebrow" defaults={COPY.team.eyebrow} multiline={false} />
        </span>
        <E
          name="team.title"
          defaults={COPY.team.title}
          multiline={false}
          as="h2"
          className="mt-5 font-serif-x text-4xl leading-[1.05] tracking-tight text-[#2C2621] md:text-5xl lg:text-6xl"
        />
        <E
          name="team.body"
          defaults={COPY.team.body}
          as="p"
          className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-[#5C5248] md:text-base"
        />
      </div>

      <div className="mt-16 grid grid-cols-1 items-start gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">
        {TEAM_MEMBERS.map((member) => (
          <article
            key={member.id}
            data-testid={`citaprevia-team-card-${member.id}`}
            className={`group relative mx-auto w-full max-w-[330px] bg-[#FDFBF7] p-3.5 pb-7 shadow-[0_32px_70px_-32px_rgba(26,21,19,0.62)] transition-transform duration-700 ease-out hover:rotate-0 ${member.tilt}`}
          >
            <span
              className={`postcard-tape absolute left-1/2 top-0 z-10 h-7 w-24 -translate-x-1/2 -translate-y-1/2 ${member.tapeRotate}`}
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden bg-[#DED2C1]">
              <EditableImage
                slot={`equipo.team.${member.id}.photo`}
                fallback={member.photo}
                alt={`${pick(member.name, lang)} · ${pick(member.role, lang)}`}
                className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
                aspectRatio="4/5"
                imgProps={{ loading: "lazy" }}
              />
            </div>
            <div className="px-3 pt-5 text-center">
              <EditableText
                slot={`equipo.team.${member.id}.name`}
                defaults={member.name}
                multiline={false}
                noTranslate
                as="h3"
                className="font-hand text-[32px] leading-none text-[#2C2621]"
              />
              <EditableText
                slot={`equipo.team.${member.id}.role`}
                defaults={member.role}
                multiline={false}
                as="p"
                className="mt-1.5 font-hand text-xl text-[#A07042]"
              />
              <span className="mx-auto my-4 block h-px w-12 bg-[#2C2621]/15" aria-hidden="true" />
              <EditableText
                slot={`equipo.team.${member.id}.note2`}
                defaults={member.note2}
                as="p"
                className="text-[13px] leading-relaxed text-[#5C5248]"
              />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 grid overflow-hidden border border-[#2C2621]/10 bg-[#2C2621] text-[#FDFBF7] lg:grid-cols-[0.36fr_0.64fr]">
        <div className="flex flex-col justify-between border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
          <Building2 className="h-7 w-7 text-[#D4A373]" strokeWidth={1.4} aria-hidden="true" />
          <div className="mt-10">
            <strong className="block font-serif-x text-6xl font-normal leading-none text-[#D4A373] md:text-7xl">1.600+</strong>
            <E
              name="team.groupStat"
              defaults={COPY.team.groupStat}
              multiline={false}
              as="span"
              className="mt-3 block text-[10px] uppercase tracking-[0.28em] text-white/58"
            />
          </div>
        </div>
        <div className="p-8 lg:p-12">
          <E
            name="team.groupEyebrow"
            defaults={COPY.team.groupEyebrow}
            multiline={false}
            as="span"
            className="text-[10px] uppercase tracking-[0.34em] text-[#D4A373]"
          />
          <E
            name="team.groupTitle"
            defaults={COPY.team.groupTitle}
            multiline={false}
            as="h3"
            className="mt-5 max-w-2xl font-serif-x text-3xl leading-tight md:text-4xl"
          />
          <E
            name="team.groupBody"
            defaults={COPY.team.groupBody}
            as="p"
            className="mt-6 max-w-3xl text-[14px] leading-relaxed text-white/68 md:text-[15px]"
          />
        </div>
      </div>
    </div>
  </section>
);

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
          className="relative min-h-[88svh] w-full overflow-hidden bg-[#1A1513]"
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
          <HeroMonogram />

          <div className="relative z-10 min-h-[88svh] flex items-end pt-32 md:pt-44 pb-24 md:pb-28">
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
        <SectionNav
          testid="citaprevia-nav"
          items={[
            { id: "citaprevia-steps", label: { es: "Cómo funciona", en: "How it works", fr: "Comment ça marche" } },
            { id: "booking", label: { es: "Reservar cita", en: "Book", fr: "Réserver" } },
            { id: "citaprevia-team", label: { es: "El equipo", en: "The team", fr: "L'équipe" } },
            { id: "citaprevia-outro", label: { es: "Contacto", en: "Contact", fr: "Contact" } },
          ]}
        />
        <section id="citaprevia-steps" data-testid="citaprevia-steps" className="py-20 md:py-28 border-b border-[#2C2621]/10">
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
          <div className="max-w-3xl mx-auto px-6 md:px-12 mb-10">
            <TripContextBanner />
          </div>
          <BookingSession testid="citaprevia-booking-session" />
        </section>

        {/* ============== TEAM PREVIEW ============== */}
        <TeamPreview lang={lang} />

        {/* ============== OUTRO CTA ============== */}
        <section id="citaprevia-outro" data-testid="citaprevia-outro" className="py-16 md:py-20">
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
 CitaPreviaPage;
