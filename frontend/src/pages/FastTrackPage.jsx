import React, { useEffect, useState } from "react";
import PersonalNameFields, { personalNameFields, hasPersonalName } from "@/components/PersonalNameFields";
import axios from "axios";
import { useLeadCapture } from "@/lib/leadCapture";
import { contactSubmissionFields, DEFAULT_CONTACT_PREFERENCE } from "@/lib/contactSubmission";
import { errorToastMessage } from "@/components/GenericErrorMessage";
import { ContactPreference } from "@/components/FormExtras";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeEuro,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Headphones,
  Mail,
  Phone,
  ReceiptText,
  Route,
  ShieldCheck,
  UserRoundCheck,
  Users,
  Zap,
} from "lucide-react";
import { pathFor } from "@/lib/routes";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { IMG } from "@/lib/imageBank";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import FastTrackInfoModal from "@/components/FastTrackInfoModal";
import Testimonials from "@/components/Testimonials";
import InternationalPhoneInput, { isValidInternationalPhone } from "@/components/InternationalPhoneInput";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const WAITLIST_REFRESH_MS = 5 * 60 * 60 * 1000;
const T = (es, en, fr) => ({ es, en, fr });

const getWaitlistEstimate = () => {
  const timeBlock = Math.floor(Date.now() / WAITLIST_REFRESH_MS);
  let hash = timeBlock;
  hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
  hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
  hash ^= hash >>> 16;
  return 8 + ((hash >>> 0) % 5);
};

const BENEFITS = [
  {
    icon: Zap,
    title: T("Atención prioritaria", "Priority attention", "Prise en charge prioritaire"),
    body: T("Tu solicitud entra en una cola de gestión preferente para que podamos empezar a trabajar en ella lo antes posible.", "Your request enters a priority queue so we can start working on it as soon as possible.", "Votre demande est traitée en priorité afin que nous puissions commencer à y travailler au plus vite."),
  },
  {
    icon: UserRoundCheck,
    title: T("Un especialista dedicado", "A dedicated specialist", "Un spécialiste dédié"),
    body: T("Un asesor estudia tus fechas, presupuesto, intereses y forma de viajar para convertirlos en una propuesta coherente.", "An adviser studies your dates, budget, interests and travel style to create a coherent proposal.", "Un conseiller étudie vos dates, votre budget, vos centres d'intérêt et votre façon de voyager pour créer une proposition cohérente."),
  },
  {
    icon: Route,
    title: T("Itinerario a medida", "Tailor-made itinerary", "Itinéraire sur mesure"),
    body: T("Organizamos alojamientos, experiencias, traslados y servicios alrededor de lo que realmente necesitas.", "We organise accommodation, experiences, transfers and services around what you actually need.", "Nous organisons hébergements, expériences, transferts et services selon vos besoins réels."),
  },
  {
    icon: Clock3,
    title: T("Menos espera, menos gestiones", "Less waiting, less admin", "Moins d'attente, moins de démarches"),
    body: T("Reducimos intercambios innecesarios y concentramos la información para que puedas tomar decisiones con rapidez.", "We reduce unnecessary back-and-forth and bring information together so you can decide quickly.", "Nous limitons les échanges inutiles et centralisons les informations pour vous aider à décider rapidement."),
  },
  {
    icon: Headphones,
    title: T("Acompañamiento continuo", "Ongoing support", "Accompagnement continu"),
    body: T("Resolvemos dudas y ajustamos la propuesta contigo hasta que tengas claro cómo quieres vivir el viaje.", "We answer your questions and refine the proposal with you until the trip feels right.", "Nous répondons à vos questions et ajustons la proposition avec vous jusqu'à ce que votre voyage vous corresponde."),
  },
  {
    icon: ShieldCheck,
    title: T("Transparencia desde el inicio", "Transparency from the start", "Transparence dès le départ"),
    body: T("Sabes exactamente qué cubren los 150 € y cómo se descuentan si confirmas el viaje con Xaluca Tours.", "You know exactly what the €150 covers and how it is deducted if you book with Xaluca Tours.", "Vous savez exactement ce que couvrent les 150 € et comment ils sont déduits si vous réservez avec Xaluca Tours."),
  },
];

const IDEAL_FOR = [
  T("Quieres empezar a organizar tu viaje inmediatamente.", "You want to start planning your trip right away.", "Vous souhaitez commencer à organiser votre voyage immédiatement."),
  T("Tienes poco tiempo y buscas un proceso ordenado y eficiente.", "You have limited time and want an organised, efficient process.", "Vous avez peu de temps et cherchez un processus organisé et efficace."),
  T("Necesitas una propuesta personalizada, no un itinerario genérico.", "You need a personalised proposal, not a generic itinerary.", "Vous souhaitez une proposition personnalisée, pas un itinéraire standard."),
  T("Prefieres centralizar las decisiones con un especialista.", "You prefer to make decisions with one specialist.", "Vous préférez prendre vos décisions avec un spécialiste dédié."),
  T("Valoras una atención prioritaria frente al flujo habitual de consultas.", "You value priority service over the usual enquiry process.", "Vous privilégiez une prise en charge prioritaire plutôt que le traitement habituel des demandes."),
];

const STEPS = [
  {
    number: "01",
    title: T("Solicita activar Fast Track", "Request Fast Track", "Demandez Fast Track"),
    body: T("Cuéntanos las claves de tu viaje mediante el formulario de esta página. Revisaremos que el servicio encaje con tu solicitud.", "Tell us about your trip using the form on this page. We will check whether the service suits your request.", "Présentez votre voyage dans le formulaire de cette page. Nous vérifierons que le service correspond à votre demande."),
  },
  {
    number: "02",
    title: T("Formaliza el pago único de 150 €", "Make the one-off €150 payment", "Effectuez le paiement unique de 150 €"),
    body: T("Te indicaremos cómo realizar el pago. Al confirmarse, tu solicitud pasa a planificación prioritaria.", "We will explain how to pay. Once payment is confirmed, your request moves to priority planning.", "Nous vous indiquerons comment payer. Après confirmation du paiement, votre demande passe en planification prioritaire."),
  },
  {
    number: "03",
    title: T("Recibe una propuesta personalizada", "Receive a personalised proposal", "Recevez une proposition personnalisée"),
    body: T("Un especialista diseña el itinerario y trabaja contigo los ajustes necesarios para encontrar la mejor opción.", "A specialist designs the itinerary and works with you on the adjustments needed to find the best option.", "Un spécialiste conçoit l'itinéraire et ajuste avec vous les détails nécessaires pour trouver la meilleure formule."),
  },
  {
    number: "04",
    title: T("Confirma tu viaje", "Confirm your trip", "Confirmez votre voyage"),
    body: T("Si reservas con Xaluca Tours, los 150 € abonados se descuentan íntegramente del importe final del viaje.", "If you book with Xaluca Tours, the €150 paid is deducted in full from the final trip price.", "Si vous réservez avec Xaluca Tours, les 150 € versés sont intégralement déduits du prix final du voyage."),
  },
];

const FAQ = [
  {
    question: T("¿Los 150 € son reembolsables?", "Is the €150 refundable?", "Les 150 € sont-ils remboursables ?"),
    answer: T("No. El importe corresponde al servicio de asesoramiento, estudio, planificación y dedicación personalizada realizado por nuestro equipo, por lo que no es reembolsable.", "No. The fee pays for our team's advice, research, planning and personalised work, so it is non-refundable.", "Non. Ce montant rémunère les conseils, l'étude, la planification et le travail personnalisé de notre équipe ; il n'est donc pas remboursable."),
  },
  {
    question: T("¿Qué ocurre si finalmente reservo el viaje?", "What happens if I book the trip?", "Que se passe-t-il si je réserve le voyage ?"),
    answer: T("Los 150 € se descuentan íntegramente del precio final del viaje. Para quienes confirman su reserva con Xaluca Tours, el importe pasa a formar parte del pago del viaje y no supone un coste adicional.", "The €150 is deducted in full from the final trip price. If you book with Xaluca Tours, it becomes part of your trip payment, not an extra charge.", "Les 150 € sont intégralement déduits du prix final du voyage. Si vous réservez avec Xaluca Tours, ils constituent une partie du paiement du voyage, sans supplément."),
  },
  {
    question: T("¿Estoy obligado a reservar el viaje?", "Am I obliged to book the trip?", "Suis-je obligé de réserver le voyage ?"),
    answer: T("No. Puedes recibir y valorar la propuesta sin obligación de confirmar. Si decides no reservar, los 150 € cubren el trabajo de planificación ya realizado y no se devuelven.", "No. You may review the proposal without booking. If you decide not to book, the €150 covers the planning work already carried out and is not refunded.", "Non. Vous pouvez étudier la proposition sans obligation de réserver. Si vous ne réservez pas, les 150 € couvrent le travail de planification déjà réalisé et ne sont pas remboursés."),
  },
  {
    question: T("¿Cuándo empezáis a trabajar en mi viaje?", "When do you start working on my trip?", "Quand commencez-vous à travailler sur mon voyage ?"),
    answer: T("Cuando el pago del servicio quede confirmado, tu solicitud pasa a gestión prioritaria y uno de nuestros especialistas comienza a trabajar en ella lo antes posible.", "Once the service payment is confirmed, your request moves to priority handling and a specialist starts as soon as possible.", "Dès confirmation du paiement du service, votre demande est traitée en priorité et un spécialiste commence à y travailler au plus vite."),
  },
  {
    question: T("¿Fast Track garantiza la disponibilidad del viaje?", "Does Fast Track guarantee availability?", "Fast Track garantit-il les disponibilités ?"),
    answer: T("Fast Track agiliza y prioriza la planificación, pero la disponibilidad de vuelos, alojamientos y servicios depende de las fechas elegidas y se confirma al formalizar la reserva.", "Fast Track speeds up and prioritises planning, but flight, accommodation and service availability depends on your dates and is confirmed when the booking is finalised.", "Fast Track accélère et priorise la planification, mais la disponibilité des vols, hébergements et services dépend des dates choisies et n'est confirmée qu'à la réservation."),
  },
];

const EMPTY_FORM = {
  preferred_contact: DEFAULT_CONTACT_PREFERENCE,
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  travel_dates: "",
  party_size: "",
  message: "",
};

export default function FastTrackPage() {
  const { lang } = useLanguage();
  const t = (es, en, fr) => pick(T(es, en, fr), lang);
  const leadCapture = useLeadCapture("fast_track");
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [waitlistEstimate, setWaitlistEstimate] = useState(getWaitlistEstimate);

  useEffect(() => {
    let intervalId;
    const timeUntilNextBlock = WAITLIST_REFRESH_MS - (Date.now() % WAITLIST_REFRESH_MS);
    const timeoutId = window.setTimeout(() => {
      setWaitlistEstimate(getWaitlistEstimate());
      intervalId = window.setInterval(
        () => setWaitlistEstimate(getWaitlistEstimate()),
        WAITLIST_REFRESH_MS
      );
    }, timeUntilNextBlock);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const scrollToSection = (sectionId) => (event) => {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  const showActivationForm = () => {
    document.getElementById("activar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "#activar");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;
    if (!hasPersonalName(form)) { toast.error(t("Completa Nombre y Apellido(s).", "Enter your first and last name.", "Indiquez votre prénom et votre nom.")); return; }
    if (!isValidInternationalPhone(form.phone)) {
      toast.error(t("Introduce un teléfono válido con su prefijo internacional.", "Enter a valid phone number with country code.", "Indiquez un numéro de téléphone valide avec l'indicatif international."));
      return;
    }
    setSending(true);

    try {
      await axios.post(`${API}/contact-requests`, {
        ...leadCapture(),
        ...form,
        ...personalNameFields(form),
        journey_interest: "fast-track",
        ...contactSubmissionFields(form),
        language: lang,
        source_route_id: "fastTrack",
        source_path: pathFor(lang, "fastTrack"),
        source_label: "Xaluca Fast Track",
        message: `[FAST TRACK] ${form.message}`,
      });
      setDone(true);
      setForm(EMPTY_FORM);
      toast.success(t("Solicitud Fast Track enviada correctamente", "Fast Track request sent successfully", "Demande Fast Track envoyée avec succès"));
    } catch (error) {
      toast.error(errorToastMessage(error?.response?.data?.detail));
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="fast-track-page" className="bg-[#F8F2E9] text-[#2C2621]">
      <section className="relative min-h-[92svh] overflow-hidden bg-[#17120F] text-[#FDFBF7]">
        <img
          src={IMG.camelCaravan}
          alt={t("Caravana avanzando por las dunas del desierto de Marruecos", "Caravan crossing the dunes of the Moroccan desert", "Caravane traversant les dunes du désert marocain")}
          className="absolute inset-0 h-full w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17120F]/95 via-[#17120F]/72 to-[#17120F]/25" />
        <div className="absolute inset-0 berber-bg-cross opacity-25" aria-hidden="true" />
        <XalucaLogoBadge testid="fast-track-hero-logo" />

        <div className="relative mx-auto flex min-h-[92svh] max-w-7xl items-end px-6 pb-20 pt-44 md:px-12 md:pb-24 md:pt-52">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 border border-[#D4A373]/45 bg-[#17120F]/35 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-[#D4A373]" strokeWidth={1.7} aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.34em] text-[#D4A373]">Xaluca Fast Track</span>
            </div>
            <h1 className="mt-6 max-w-3xl font-serif-x text-5xl font-normal leading-[0.98] tracking-tight md:text-7xl lg:text-[5.5rem]">
              {t("Tu viaje empieza con prioridad.", "Your trip starts with priority.", "Votre voyage commence en priorité.")}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#FDFBF7]/78 md:text-xl">
              {t("Mientras otros esperan una respuesta, tú ya estás hablando con un especialista que empieza a organizar tu viaje desde el primer momento.", "While others wait for a reply, you are already speaking with a specialist who starts planning your trip from the first conversation.", "Pendant que d'autres attendent une réponse, vous échangez déjà avec un spécialiste qui commence à organiser votre voyage dès le premier contact.")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#activar"
                onClick={scrollToSection("activar")}
                data-testid="fast-track-hero-cta"
                className="xaluca-button inline-flex items-center justify-center gap-3 bg-[#C16542] px-8 py-4 text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-[#A35133]"
              >
                {t("Activar Fast Track", "Activate Fast Track", "Activer Fast Track")}
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                data-testid="fast-track-how-it-works"
                className="inline-flex items-center justify-center border border-white/30 px-8 py-4 text-[10px] uppercase tracking-[0.25em] transition-colors hover:border-[#D4A373] hover:text-[#D4A373]"
              >
                {t("Cómo funciona", "How it works", "Comment ça marche")}
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[11px] text-white/65">
              <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#D4A373]" /> {t("Atención prioritaria", "Priority attention", "Prise en charge prioritaire")}</span>
              <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#D4A373]" /> {t("Planificación personalizada", "Personalised planning", "Planification personnalisée")}</span>
              <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#D4A373]" /> {t("150 € deducibles del viaje", "€150 deducted from your trip", "150 € déduits de votre voyage")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">{t("Planificación prioritaria", "Priority planning", "Planification prioritaire")}</span>
            <h2 className="mt-5 max-w-3xl font-serif-x text-4xl leading-[1.05] md:text-6xl">
              {t("Viajar debería ser emocionante. Organizarlo también.", "Travel should be exciting. Planning it should be too.", "Voyager devrait être passionnant. Préparer son voyage aussi.")}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#5C5248] md:text-lg">
              {t("Fast Track es el servicio premium de planificación de Xaluca Tours para viajeros que quieren ahorrar tiempo, evitar gestiones innecesarias y avanzar con el acompañamiento de un experto.", "Fast Track is Xaluca Tours' premium planning service for travellers who want to save time, avoid unnecessary admin and move forward with an expert by their side.", "Fast Track est le service de planification premium de Xaluca Tours pour les voyageurs qui veulent gagner du temps, éviter les démarches inutiles et avancer avec l'aide d'un expert.")}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5C5248]">
              {t("Diseñamos tu itinerario, ordenamos cada decisión y preparamos una propuesta personalizada para que puedas centrarte en lo importante: elegir cómo quieres vivir Marruecos.", "We design your itinerary, organise each decision and prepare a personalised proposal so you can focus on what matters: how you want to experience Morocco.", "Nous concevons votre itinéraire, structurons chaque décision et préparons une proposition personnalisée pour que vous puissiez vous concentrer sur l'essentiel : votre façon de découvrir le Maroc.")}
            </p>
          </div>
          <aside className="border border-[#2C2621]/12 bg-[#FDFBF7] p-7 md:p-9 lg:col-span-5" data-testid="fast-track-summary-card">
            <div className="flex items-center justify-between border-b border-[#2C2621]/10 pb-5">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#5C5248]">{t("Servicio Fast Track", "Fast Track service", "Service Fast Track")}</span>
              <BadgeEuro className="h-5 w-5 text-[#C16542]" strokeWidth={1.5} />
            </div>
            <div className="mt-7 flex items-end gap-3">
              <span className="font-serif-x text-7xl leading-none">150</span>
              <span className="pb-1 text-2xl text-[#C16542]">€</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#5C5248]">
              {t("Pago único para activar la planificación prioritaria y el trabajo personalizado de nuestro equipo.", "A one-off payment activates priority planning and our team's personalised work.", "Un paiement unique active la planification prioritaire et le travail personnalisé de notre équipe.")}
            </p>
            <div className="mt-6 space-y-3 border-t border-[#2C2621]/10 pt-5 text-sm">
              <p className="flex gap-3"><ReceiptText className="mt-0.5 h-4 w-4 shrink-0 text-[#C16542]" /> {t("No reembolsable.", "Non-refundable.", "Non remboursable.")}</p>
              <p className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C16542]" /> {t("Deducible íntegramente si reservas el viaje.", "Deducted in full if you book the trip.", "Intégralement déduit si vous réservez le voyage.")}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#2C2621]/10 bg-[#FDFBF7] px-6 py-20 md:px-12 md:py-24" data-testid="fast-track-optional-section">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">{t("Tú eliges cómo empezar", "Choose how to begin", "Choisissez comment commencer")}</span>
            <h2 className="mt-5 max-w-3xl font-serif-x text-4xl leading-[1.05] md:text-5xl">
              {t("Fast Track es opcional. Pedir información y presupuesto sigue siendo gratuito.", "Fast Track is optional. Enquiries and quotes remain free.", "Fast Track est facultatif. Les renseignements et devis restent gratuits.")}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#5C5248]">
              {t("No necesitas contratar Fast Track para preguntarnos, solicitar un presupuesto o empezar a organizar tu viaje. Nuestro equipo seguirá atendiendo gratuitamente todas las solicitudes mediante el proceso habitual.", "You do not need Fast Track to ask questions, request a quote or begin planning your trip. Our team continues to handle all standard enquiries free of charge.", "Vous n'avez pas besoin de Fast Track pour poser des questions, demander un devis ou commencer à organiser votre voyage. Notre équipe continue de traiter gratuitement toutes les demandes habituelles.")}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5C5248]">
              {t("Fast Track está pensado únicamente para quienes prefieren que su planificación tenga prioridad, reducir los tiempos de espera y trabajar antes con un especialista dedicado.", "Fast Track is for travellers who prefer priority planning, shorter waits and earlier access to a dedicated specialist.", "Fast Track s'adresse aux voyageurs qui souhaitent une planification prioritaire, moins d'attente et un spécialiste dédié plus rapidement.")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to={pathFor(lang, "planTrip")}
                data-testid="fast-track-standard-request"
                className="xaluca-button inline-flex items-center justify-center gap-3 border border-[#2C2621]/22 px-7 py-4 text-[10px] uppercase tracking-[0.22em] transition-colors hover:border-[#C16542] hover:text-[#C16542]"
              >
                {t("Solicitar presupuesto gratuito", "Request a free quote", "Demander un devis gratuit")}
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              </Link>
              <a
                href="#activar"
                onClick={scrollToSection("activar")}
                className="xaluca-button inline-flex items-center justify-center gap-3 bg-[#C16542] px-7 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#A35133]"
              >
                {t("Elegir atención prioritaria", "Choose priority service", "Choisir le service prioritaire")}
              </a>
            </div>
          </div>

          <aside className="relative overflow-hidden border border-[#C16542]/20 bg-[#F8F2E9] p-7 md:p-9 lg:col-span-5" data-testid="fast-track-waitlist-card">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#C16542]/[0.06]" aria-hidden="true" />
            <div className="relative">
              <span className="text-[9px] uppercase tracking-[0.28em] text-[#C16542]">{t("Canal estándar", "Standard service", "Service standard")}</span>
              <div className="mt-5 flex items-end gap-4">
                <strong className="font-serif-x text-8xl font-normal leading-none text-[#2C2621]" data-testid="fast-track-waitlist-count">
                  {waitlistEstimate}
                </strong>
                <span className="max-w-[13rem] pb-2 text-sm leading-snug text-[#5C5248]">{t("solicitudes de planificación actualmente en gestión por delante", "planning requests currently ahead in the queue", "demandes de planification actuellement en attente avant la vôtre")}</span>
              </div>
              <div className="mt-8 bg-[#2C2621] p-5 text-[#FDFBF7] md:p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C16542]">
                    <Zap className="h-4 w-4" fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.26em] text-[#D4A373]">{t("Con Fast Track", "With Fast Track", "Avec Fast Track")}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#FDFBF7]/85">
                      {t("Tu solicitud accede a gestión prioritaria para que nuestro equipo empiece a trabajar en tu viaje antes.", "Your request is handled with priority so our team can start working on your trip sooner.", "Votre demande est traitée en priorité afin que notre équipe puisse commencer à travailler sur votre voyage plus tôt.")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#1A1513] px-6 py-24 text-[#FDFBF7] md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#D4A373]">{t("Todo lo que ganas", "What you gain", "Vos avantages")}</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-6xl">{t("Más velocidad. Más claridad. Menos estrés.", "More speed. More clarity. Less stress.", "Plus de rapidité. Plus de clarté. Moins de stress.")}</h2>
          </div>
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <article key={title.es} className="bg-[#1A1513] p-7 md:p-9">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#D4A373]/10 text-[#D4A373]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif-x text-2xl">{pick(title, lang)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/62">{pick(body, lang)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden">
            <img src={IMG.riadFountain} alt={t("Interior de un riad marroquí", "Interior of a Moroccan riad", "Intérieur d'un riad marocain")} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17120F]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-10">
              <Compass className="h-7 w-7 text-[#D4A373]" strokeWidth={1.4} />
              <p className="mt-4 max-w-md font-serif-x text-3xl leading-tight">{t("Para quienes tienen claro que quieren viajar y prefieren avanzar desde hoy.", "For travellers ready to move forward today.", "Pour les voyageurs qui souhaitent avancer dès aujourd'hui.")}</p>
            </div>
          </div>
          <div className="lg:pl-10">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">{t("¿Es para ti?", "Is it for you?", "Est-ce pour vous ?")}</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-5xl">{t("Fast Track encaja contigo si…", "Fast Track is right for you if…", "Fast Track vous convient si…")}</h2>
            <ul className="mt-9 space-y-5">
              {IDEAL_FOR.map((item) => (
                <li key={item.es} className="flex gap-4 border-b border-[#2C2621]/10 pb-5 text-[15px] leading-relaxed text-[#5C5248]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C16542]" strokeWidth={1.5} />
                  {pick(item, lang)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Testimonials
        themes={["fast-track-planning"]}
        limit={3}
        tone="sand"
        testid="fast-track-testimonials"
        eyebrow={t("Opiniones de viajeros", "Traveller reviews", "Avis de voyageurs")}
        title={t("La tranquilidad de sentirte acompañado desde el primer momento.", "The reassurance of feeling supported from the start.", "La sérénité d'être accompagné dès le premier instant.")}
        subtitle={t("Viajeros que confiaron en la planificación personalizada de Xaluca Tours destacan la rapidez, la atención cercana y la seguridad de saber que cada detalle estaba en manos de un especialista.", "Travellers who chose Xaluca Tours' personalised planning highlight the speed, attentive service and reassurance of having every detail handled by a specialist.", "Les voyageurs qui ont choisi la planification personnalisée de Xaluca Tours apprécient la rapidité, la proximité et la sérénité de confier chaque détail à un spécialiste.")}
      />

      <section id="como-funciona" className="scroll-mt-36 bg-[#EFE3D4] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">{t("Un proceso sencillo", "A simple process", "Un processus simple")}</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-6xl">{t("De tu primera idea a una ruta bien organizada.", "From your first idea to a well-planned itinerary.", "De votre première idée à un itinéraire bien organisé.")}</h2>
          </div>
          <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li key={step.number} className="border border-[#2C2621]/12 bg-[#F8F2E9] p-7 md:p-8">
                <span className="font-serif-x text-4xl text-[#C16542]">{step.number}</span>
                <h3 className="mt-8 font-serif-x text-2xl leading-tight">{pick(step.title, lang)}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#5C5248]">{pick(step.body, lang)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">{t("Precio transparente", "Transparent pricing", "Tarif transparent")}</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-6xl">{t("150 € para empezar con prioridad.", "€150 to get started with priority.", "150 € pour commencer en priorité.")}</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#5C5248]">
              {t("Este importe remunera el tiempo de estudio, asesoramiento y planificación personalizada que nuestro equipo dedica a tu viaje desde el primer momento.", "This fee pays for the research, advice and personalised planning our team dedicates to your trip from the outset.", "Ce montant rémunère le temps d'étude, de conseil et de planification personnalisée que notre équipe consacre à votre voyage dès le départ.")}
            </p>
          </div>
          <div className="mt-12 grid overflow-hidden border border-[#2C2621]/12 bg-[#FDFBF7] md:grid-cols-2">
            <div className="p-8 md:p-12">
              <ReceiptText className="h-7 w-7 text-[#C16542]" strokeWidth={1.5} />
              <h3 className="mt-5 font-serif-x text-3xl">{t("No reembolsable", "Non-refundable", "Non remboursable")}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#5C5248]">
                {t("Si decides no continuar con la reserva, los 150 € no se devuelven porque cubren el trabajo de planificación y asesoramiento ya realizado.", "If you decide not to book, the €150 is not refunded because it covers planning and advice already provided.", "Si vous décidez de ne pas réserver, les 150 € ne sont pas remboursés, car ils couvrent le travail de planification et de conseil déjà effectué.")}
              </p>
            </div>
            <div className="bg-[#C16542] p-8 text-white md:p-12">
              <BadgeEuro className="h-7 w-7" strokeWidth={1.5} />
              <h3 className="mt-5 font-serif-x text-3xl">{t("100 % deducible", "100% deductible", "100 % déductible")}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                {t("Si reservas el viaje con Xaluca Tours, descontamos íntegramente los 150 € del precio final. El importe pasa a formar parte del pago de tu viaje.", "If you book with Xaluca Tours, we deduct the full €150 from the final price. It becomes part of your trip payment.", "Si vous réservez avec Xaluca Tours, nous déduisons intégralement les 150 € du prix final. Ce montant fait alors partie du paiement de votre voyage.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="activar" className="scroll-mt-32 bg-[#1A1513] px-6 py-24 text-white md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#D4A373]">{t("Empieza hoy mismo", "Start today", "Commencez dès aujourd'hui")}</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-6xl">{t("Activa tu solicitud Fast Track.", "Submit your Fast Track request.", "Envoyez votre demande Fast Track.")}</h2>
            <p className="mt-6 text-base leading-relaxed text-white/68">
              {t("Completa el formulario y nuestro equipo revisará tu solicitud. Te explicaremos el siguiente paso para formalizar el pago único de 150 € y comenzar la planificación prioritaria.", "Complete the form and our team will review your request. We will explain how to make the one-off €150 payment and begin priority planning.", "Remplissez le formulaire et notre équipe examinera votre demande. Nous vous expliquerons comment effectuer le paiement unique de 150 € et commencer la planification prioritaire.")}
            </p>
            <div className="mt-8 space-y-4 border-t border-white/12 pt-7 text-sm text-white/72">
              <p className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-[#D4A373]" /> {t("Recibirás el seguimiento en el email indicado.", "We will follow up at the email address you provide.", "Nous vous répondrons à l'adresse e-mail indiquée.")}</p>
              <p className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-[#D4A373]" /> {t("Podremos llamarte para confirmar los detalles esenciales.", "We may call to confirm essential details.", "Nous pourrons vous appeler pour confirmer les détails essentiels.")}</p>
              <p className="flex gap-3"><ShieldCheck className="h-4 w-4 shrink-0 text-[#D4A373]" /> {t("No se realizará ningún cargo al enviar este formulario.", "Submitting this form does not incur a charge.", "L'envoi de ce formulaire n'entraîne aucun paiement.")}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {done ? (
              <div data-testid="fast-track-success" className="border border-[#D4A373]/40 bg-white/[0.04] p-10 text-center md:p-14">
                <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#D4A373]/45 text-[#D4A373]">
                  <Check className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 font-serif-x text-4xl">{t("Hemos recibido tu solicitud.", "We have received your request.", "Nous avons reçu votre demande.")}</h3>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/68">
                  {t("Nuestro equipo la revisará y se pondrá en contacto contigo para explicarte cómo activar el servicio y realizar el pago de 150 €.", "Our team will review it and contact you to explain how to activate the service and make the €150 payment.", "Notre équipe l'examinera et vous contactera pour vous expliquer comment activer le service et effectuer le paiement de 150 €.")}
                </p>
                <button type="button" onClick={() => setDone(false)} className="mt-8 border-b border-[#D4A373]/50 pb-1 text-[10px] uppercase tracking-[0.24em] text-[#D4A373]">
                  {t("Enviar otra solicitud", "Send another request", "Envoyer une autre demande")}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} data-testid="fast-track-form" className="border border-white/15 bg-white/[0.04] p-7 md:p-10">
                <div className="grid gap-6 sm:grid-cols-2">
                  <PersonalNameFields value={form} onChange={(key, value) => setForm(current => ({ ...current, [key]: value }))} disabled={sending} lang={lang}
                    inputClass="fast-track-input" labelClass="text-xs uppercase tracking-[0.18em] text-white/70" testIdPrefix="fast-track" />
                  <FastTrackField label="Email">
                    <input required type="email" name="email" value={form.email} onChange={onChange} data-testid="fast-track-email" className="fast-track-input" />
                  </FastTrackField>
                  <FastTrackField as="div" label={t("Teléfono", "Phone", "Téléphone")}>
                    <InternationalPhoneInput
                      required
                      name="phone"
                      value={form.phone}
                      onValueChange={(phone) => setForm((current) => ({ ...current, phone }))}
                      lang={lang}
                      tone="dark"
                      testId="fast-track-phone"
                    />
                  </FastTrackField>
                  <FastTrackField label={t("Fechas aproximadas", "Approximate dates", "Dates approximatives")}>
                    <input name="travel_dates" value={form.travel_dates} onChange={onChange} placeholder={t("Ej. octubre de 2026", "E.g. October 2026", "P. ex. octobre 2026")} data-testid="fast-track-dates" className="fast-track-input" />
                  </FastTrackField>
                  <FastTrackField label={t("Número de viajeros", "Number of travellers", "Nombre de voyageurs")}>
                    <input name="party_size" value={form.party_size} onChange={onChange} placeholder={t("Ej. 2 adultos", "E.g. 2 adults", "P. ex. 2 adultes")} data-testid="fast-track-party" className="fast-track-input" />
                  </FastTrackField>
                  <div className="hidden items-end sm:flex" aria-hidden="true">
                    <Users className="mb-3 h-5 w-5 text-[#D4A373]/65" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="mt-6">
                  <FastTrackField label={t("¿Cómo imaginas tu viaje?", "What do you have in mind for your trip?", "Comment imaginez-vous votre voyage ?")}>
                    <textarea required name="message" value={form.message} onChange={onChange} rows={5} data-testid="fast-track-message" className="fast-track-input resize-none" />
                  </FastTrackField>
                </div>
                <div className="mt-6"><ContactPreference tone="dark" lang={lang} showTravelDetails value={form.preferred_contact} onChange={preferred_contact => setForm(current => ({ ...current, preferred_contact }))} testidPrefix="fast-track-pref" /></div>
                <label className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-white/60">
                  <input required type="checkbox" className="mt-0.5 h-4 w-4 accent-[#C16542]" data-testid="fast-track-terms" />
                  <span>{t("Entiendo que el servicio cuesta 150 €, que el importe no es reembolsable y que se descontará íntegramente del viaje si finalmente confirmo la reserva con Xaluca Tours.", "I understand that the service costs €150, that this fee is non-refundable and that it will be deducted in full from the trip price if I confirm my booking with Xaluca Tours.", "Je comprends que le service coûte 150 €, que ce montant n'est pas remboursable et qu'il sera intégralement déduit du prix du voyage si je confirme ma réservation avec Xaluca Tours.")}</span>
                </label>
                <button
                  type="submit"
                  disabled={sending}
                  data-testid="fast-track-submit"
                  className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-[#C16542] px-8 py-4 text-[10px] uppercase tracking-[0.24em] transition-colors hover:bg-[#A35133] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
                >
                  {sending ? t("Enviando solicitud…", "Sending request…", "Envoi de la demande…") : t("Solicitar Fast Track", "Request Fast Track", "Demander Fast Track")}
                  {!sending && <ArrowRight className="h-4 w-4" strokeWidth={1.6} />}
                </button>
                <p className="mt-4 text-[11px] leading-relaxed text-white/45">{t("Enviar la solicitud no realiza ningún cargo. El equipo te informará sobre el proceso de activación.", "Submitting your request does not incur a charge. Our team will explain the activation process.", "L'envoi de la demande n'entraîne aucun paiement. Notre équipe vous expliquera la procédure d'activation.")}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">{t("Preguntas frecuentes", "Frequently asked questions", "Questions fréquentes")}</span>
            <h2 className="mt-5 font-serif-x text-4xl md:text-5xl">{t("Antes de activar Fast Track.", "Before activating Fast Track.", "Avant d'activer Fast Track.")}</h2>
          </div>
          <div className="mt-12 divide-y divide-[#2C2621]/12 border-y border-[#2C2621]/12">
            {FAQ.map((item) => (
              <details key={item.question.es} className="group py-6" data-testid="fast-track-faq-item">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif-x text-xl marker:content-none md:text-2xl">
                  {pick(item.question, lang)}
                  <span className="text-2xl font-light text-[#C16542] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pt-4 text-sm leading-relaxed text-[#5C5248] md:text-base">{pick(item.answer, lang)}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-[#5C5248]">{t("¿Todavía tienes dudas antes de solicitarlo?", "Still have questions before applying?", "Vous avez encore des questions avant de faire votre demande ?")}</p>
            <Link to={pathFor(lang, "contact")} className="xaluca-button mt-4 inline-flex items-center gap-2 border-b border-[#C16542]/45 pb-1 text-[10px] uppercase tracking-[0.24em] text-[#C16542]">
              {t("Hablar con el equipo", "Talk to our team", "Parler à notre équipe")}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .fast-track-input {
          width: 100%;
          border: 1px solid rgba(253, 251, 247, 0.18);
          background: transparent;
          color: #FDFBF7;
          padding: 0.9rem 1rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.25s ease, background-color 0.25s ease;
        }
        .fast-track-input:focus {
          border-color: #C16542;
          background: rgba(253, 251, 247, 0.03);
        }
        .fast-track-input::placeholder { color: rgba(253, 251, 247, 0.32); }
      `}</style>
      <FastTrackInfoModal open={infoOpen} onOpenChange={setInfoOpen} onActivate={showActivationForm} />
    </div>
  );
}

function FastTrackField({ label, children, as: Wrapper = "label" }) {
  return (
    <Wrapper className="block">
      <span className="mb-2 block text-[9px] uppercase tracking-[0.28em] text-white/50">{label}</span>
      {children}
    </Wrapper>
  );
}
