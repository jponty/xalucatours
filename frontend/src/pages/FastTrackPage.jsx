import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { IMG } from "@/lib/imageBank";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import FastTrackInfoModal from "@/components/FastTrackInfoModal";
import Testimonials from "@/components/Testimonials";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const WAITLIST_REFRESH_MS = 5 * 60 * 60 * 1000;

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
    title: "Atención prioritaria",
    body: "Tu solicitud entra en una cola de gestión preferente para que podamos empezar a trabajar en ella lo antes posible.",
  },
  {
    icon: UserRoundCheck,
    title: "Un especialista dedicado",
    body: "Un asesor estudia tus fechas, presupuesto, intereses y forma de viajar para convertirlos en una propuesta coherente.",
  },
  {
    icon: Route,
    title: "Itinerario a medida",
    body: "Organizamos alojamientos, experiencias, traslados y servicios alrededor de lo que realmente necesitas.",
  },
  {
    icon: Clock3,
    title: "Menos espera, menos gestiones",
    body: "Reducimos intercambios innecesarios y concentramos la información para que puedas tomar decisiones con rapidez.",
  },
  {
    icon: Headphones,
    title: "Acompañamiento continuo",
    body: "Resolvemos dudas y ajustamos la propuesta contigo hasta que tengas claro cómo quieres vivir el viaje.",
  },
  {
    icon: ShieldCheck,
    title: "Transparencia desde el inicio",
    body: "Sabes exactamente qué cubren los 150 € y cómo se descuentan si confirmas el viaje con Xaluca Tours.",
  },
];

const IDEAL_FOR = [
  "Quieres empezar a organizar tu viaje inmediatamente.",
  "Tienes poco tiempo y buscas un proceso ordenado y eficiente.",
  "Necesitas una propuesta personalizada, no un itinerario genérico.",
  "Prefieres centralizar las decisiones con un especialista.",
  "Valoras una atención prioritaria frente al flujo habitual de consultas.",
];

const STEPS = [
  {
    number: "01",
    title: "Solicita activar Fast Track",
    body: "Cuéntanos las claves de tu viaje mediante el formulario de esta página. Revisaremos que el servicio encaje con tu solicitud.",
  },
  {
    number: "02",
    title: "Formaliza el pago único de 150 €",
    body: "Te indicaremos cómo realizar el pago. Al confirmarse, tu solicitud pasa a planificación prioritaria.",
  },
  {
    number: "03",
    title: "Recibe una propuesta personalizada",
    body: "Un especialista diseña el itinerario y trabaja contigo los ajustes necesarios para encontrar la mejor opción.",
  },
  {
    number: "04",
    title: "Confirma tu viaje",
    body: "Si reservas con Xaluca Tours, los 150 € abonados se descuentan íntegramente del importe final del viaje.",
  },
];

const FAQ = [
  {
    question: "¿Los 150 € son reembolsables?",
    answer: "No. El importe corresponde al servicio de asesoramiento, estudio, planificación y dedicación personalizada realizado por nuestro equipo, por lo que no es reembolsable.",
  },
  {
    question: "¿Qué ocurre si finalmente reservo el viaje?",
    answer: "Los 150 € se descuentan íntegramente del precio final del viaje. Para quienes confirman su reserva con Xaluca Tours, el importe pasa a formar parte del pago del viaje y no supone un coste adicional.",
  },
  {
    question: "¿Estoy obligado a reservar el viaje?",
    answer: "No. Puedes recibir y valorar la propuesta sin obligación de confirmar. Si decides no reservar, los 150 € cubren el trabajo de planificación ya realizado y no se devuelven.",
  },
  {
    question: "¿Cuándo empezáis a trabajar en mi viaje?",
    answer: "Cuando el pago del servicio quede confirmado, tu solicitud pasa a gestión prioritaria y uno de nuestros especialistas comienza a trabajar en ella lo antes posible.",
  },
  {
    question: "¿Fast Track garantiza la disponibilidad del viaje?",
    answer: "Fast Track agiliza y prioriza la planificación, pero la disponibilidad de vuelos, alojamientos y servicios depende de las fechas elegidas y se confirma al formalizar la reserva.",
  },
];

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  travel_dates: "",
  party_size: "",
  message: "",
};

export default function FastTrackPage() {
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
    setSending(true);

    try {
      await axios.post(`${API}/contact-requests`, {
        ...form,
        journey_interest: "fast-track",
        preferred_contact: ["email", "phone"],
        language: "es",
        source_route_id: "fastTrack",
        source_path: "/fast-track",
        source_label: "Xaluca Fast Track",
        message: `[FAST TRACK] ${form.message}`,
      });
      setDone(true);
      setForm(EMPTY_FORM);
      toast.success("Solicitud Fast Track enviada correctamente");
    } catch {
      toast.error("No se pudo enviar la solicitud. Inténtalo de nuevo o contacta con nuestro equipo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="fast-track-page" className="bg-[#F8F2E9] text-[#2C2621]">
      <section className="relative min-h-[92svh] overflow-hidden bg-[#17120F] text-[#FDFBF7]">
        <img
          src={IMG.camelCaravan}
          alt="Caravana avanzando por las dunas del desierto de Marruecos"
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
              Tu viaje empieza con prioridad.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#FDFBF7]/78 md:text-xl">
              Mientras otros esperan una respuesta, tú ya estás hablando con un especialista que empieza a organizar tu viaje desde el primer momento.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#activar"
                onClick={scrollToSection("activar")}
                data-testid="fast-track-hero-cta"
                className="inline-flex items-center justify-center gap-3 bg-[#C16542] px-8 py-4 text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-[#A35133]"
              >
                Activar Fast Track
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                data-testid="fast-track-how-it-works"
                className="inline-flex items-center justify-center border border-white/30 px-8 py-4 text-[10px] uppercase tracking-[0.25em] transition-colors hover:border-[#D4A373] hover:text-[#D4A373]"
              >
                Cómo funciona
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[11px] text-white/65">
              <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#D4A373]" /> Atención prioritaria</span>
              <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#D4A373]" /> Planificación personalizada</span>
              <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#D4A373]" /> 150 € deducibles del viaje</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">Planificación prioritaria</span>
            <h2 className="mt-5 max-w-3xl font-serif-x text-4xl leading-[1.05] md:text-6xl">
              Viajar debería ser emocionante. Organizarlo también.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#5C5248] md:text-lg">
              Fast Track es el servicio premium de planificación de Xaluca Tours para viajeros que quieren ahorrar tiempo, evitar gestiones innecesarias y avanzar con el acompañamiento de un experto.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5C5248]">
              Diseñamos tu itinerario, ordenamos cada decisión y preparamos una propuesta personalizada para que puedas centrarte en lo importante: elegir cómo quieres vivir Marruecos.
            </p>
          </div>
          <aside className="border border-[#2C2621]/12 bg-[#FDFBF7] p-7 md:p-9 lg:col-span-5" data-testid="fast-track-summary-card">
            <div className="flex items-center justify-between border-b border-[#2C2621]/10 pb-5">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#5C5248]">Servicio Fast Track</span>
              <BadgeEuro className="h-5 w-5 text-[#C16542]" strokeWidth={1.5} />
            </div>
            <div className="mt-7 flex items-end gap-3">
              <span className="font-serif-x text-7xl leading-none">150</span>
              <span className="pb-1 text-2xl text-[#C16542]">€</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#5C5248]">
              Pago único para activar la planificación prioritaria y el trabajo personalizado de nuestro equipo.
            </p>
            <div className="mt-6 space-y-3 border-t border-[#2C2621]/10 pt-5 text-sm">
              <p className="flex gap-3"><ReceiptText className="mt-0.5 h-4 w-4 shrink-0 text-[#C16542]" /> No reembolsable.</p>
              <p className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C16542]" /> Deducible íntegramente si reservas el viaje.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#2C2621]/10 bg-[#FDFBF7] px-6 py-20 md:px-12 md:py-24" data-testid="fast-track-optional-section">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">Tú eliges cómo empezar</span>
            <h2 className="mt-5 max-w-3xl font-serif-x text-4xl leading-[1.05] md:text-5xl">
              Fast Track es opcional. Pedir información y presupuesto sigue siendo gratuito.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#5C5248]">
              No necesitas contratar Fast Track para preguntarnos, solicitar un presupuesto o empezar a organizar tu viaje. Nuestro equipo seguirá atendiendo gratuitamente todas las solicitudes mediante el proceso habitual.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5C5248]">
              Fast Track está pensado únicamente para quienes prefieren que su planificación tenga prioridad, reducir los tiempos de espera y trabajar antes con un especialista dedicado.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to={pathFor("es", "planTrip")}
                data-testid="fast-track-standard-request"
                className="inline-flex items-center justify-center gap-3 border border-[#2C2621]/22 px-7 py-4 text-[10px] uppercase tracking-[0.22em] transition-colors hover:border-[#C16542] hover:text-[#C16542]"
              >
                Solicitar presupuesto gratuito
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              </Link>
              <a
                href="#activar"
                onClick={scrollToSection("activar")}
                className="inline-flex items-center justify-center gap-3 bg-[#C16542] px-7 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#A35133]"
              >
                Elegir atención prioritaria
              </a>
            </div>
          </div>

          <aside className="relative overflow-hidden border border-[#C16542]/20 bg-[#F8F2E9] p-7 md:p-9 lg:col-span-5" data-testid="fast-track-waitlist-card">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#C16542]/[0.06]" aria-hidden="true" />
            <div className="relative">
              <span className="text-[9px] uppercase tracking-[0.28em] text-[#C16542]">Canal estándar</span>
              <div className="mt-5 flex items-end gap-4">
                <strong className="font-serif-x text-8xl font-normal leading-none text-[#2C2621]" data-testid="fast-track-waitlist-count">
                  {waitlistEstimate}
                </strong>
                <span className="max-w-[13rem] pb-2 text-sm leading-snug text-[#5C5248]">solicitudes de planificación actualmente en gestión por delante</span>
              </div>
              <div className="mt-8 bg-[#2C2621] p-5 text-[#FDFBF7] md:p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C16542]">
                    <Zap className="h-4 w-4" fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.26em] text-[#D4A373]">Con Fast Track</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#FDFBF7]/85">
                      Tu solicitud accede a gestión prioritaria para que nuestro equipo empiece a trabajar en tu viaje antes.
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
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#D4A373]">Todo lo que ganas</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-6xl">Más velocidad. Más claridad. Menos estrés.</h2>
          </div>
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <article key={title} className="bg-[#1A1513] p-7 md:p-9">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#D4A373]/10 text-[#D4A373]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif-x text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/62">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden">
            <img src={IMG.riadFountain} alt="Interior de un riad marroquí" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17120F]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-10">
              <Compass className="h-7 w-7 text-[#D4A373]" strokeWidth={1.4} />
              <p className="mt-4 max-w-md font-serif-x text-3xl leading-tight">Para quienes tienen claro que quieren viajar y prefieren avanzar desde hoy.</p>
            </div>
          </div>
          <div className="lg:pl-10">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">¿Es para ti?</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-5xl">Fast Track encaja contigo si…</h2>
            <ul className="mt-9 space-y-5">
              {IDEAL_FOR.map((item) => (
                <li key={item} className="flex gap-4 border-b border-[#2C2621]/10 pb-5 text-[15px] leading-relaxed text-[#5C5248]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C16542]" strokeWidth={1.5} />
                  {item}
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
        eyebrow="Opiniones de viajeros"
        title="La tranquilidad de sentirte acompañado desde el primer momento."
        subtitle="Viajeros que confiaron en la planificación personalizada de Xaluca Tours destacan la rapidez, la atención cercana y la seguridad de saber que cada detalle estaba en manos de un especialista."
      />

      <section id="como-funciona" className="scroll-mt-36 bg-[#EFE3D4] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">Un proceso sencillo</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-6xl">De tu primera idea a una ruta bien organizada.</h2>
          </div>
          <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li key={step.number} className="border border-[#2C2621]/12 bg-[#F8F2E9] p-7 md:p-8">
                <span className="font-serif-x text-4xl text-[#C16542]">{step.number}</span>
                <h3 className="mt-8 font-serif-x text-2xl leading-tight">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#5C5248]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">Precio transparente</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-6xl">150 € para empezar con prioridad.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#5C5248]">
              Este importe remunera el tiempo de estudio, asesoramiento y planificación personalizada que nuestro equipo dedica a tu viaje desde el primer momento.
            </p>
          </div>
          <div className="mt-12 grid overflow-hidden border border-[#2C2621]/12 bg-[#FDFBF7] md:grid-cols-2">
            <div className="p-8 md:p-12">
              <ReceiptText className="h-7 w-7 text-[#C16542]" strokeWidth={1.5} />
              <h3 className="mt-5 font-serif-x text-3xl">No reembolsable</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#5C5248]">
                Si decides no continuar con la reserva, los 150 € no se devuelven porque cubren el trabajo de planificación y asesoramiento ya realizado.
              </p>
            </div>
            <div className="bg-[#C16542] p-8 text-white md:p-12">
              <BadgeEuro className="h-7 w-7" strokeWidth={1.5} />
              <h3 className="mt-5 font-serif-x text-3xl">100 % deducible</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Si reservas el viaje con Xaluca Tours, descontamos íntegramente los 150 € del precio final. El importe pasa a formar parte del pago de tu viaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="activar" className="scroll-mt-32 bg-[#1A1513] px-6 py-24 text-white md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#D4A373]">Empieza hoy mismo</span>
            <h2 className="mt-5 font-serif-x text-4xl leading-[1.05] md:text-6xl">Activa tu solicitud Fast Track.</h2>
            <p className="mt-6 text-base leading-relaxed text-white/68">
              Completa el formulario y nuestro equipo revisará tu solicitud. Te explicaremos el siguiente paso para formalizar el pago único de 150 € y comenzar la planificación prioritaria.
            </p>
            <div className="mt-8 space-y-4 border-t border-white/12 pt-7 text-sm text-white/72">
              <p className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-[#D4A373]" /> Recibirás el seguimiento en el email indicado.</p>
              <p className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-[#D4A373]" /> Podremos llamarte para confirmar los detalles esenciales.</p>
              <p className="flex gap-3"><ShieldCheck className="h-4 w-4 shrink-0 text-[#D4A373]" /> No se realizará ningún cargo al enviar este formulario.</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {done ? (
              <div data-testid="fast-track-success" className="border border-[#D4A373]/40 bg-white/[0.04] p-10 text-center md:p-14">
                <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#D4A373]/45 text-[#D4A373]">
                  <Check className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 font-serif-x text-4xl">Hemos recibido tu solicitud.</h3>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/68">
                  Nuestro equipo la revisará y se pondrá en contacto contigo para explicarte cómo activar el servicio y realizar el pago de 150 €.
                </p>
                <button type="button" onClick={() => setDone(false)} className="mt-8 border-b border-[#D4A373]/50 pb-1 text-[10px] uppercase tracking-[0.24em] text-[#D4A373]">
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} data-testid="fast-track-form" className="border border-white/15 bg-white/[0.04] p-7 md:p-10">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FastTrackField label="Nombre completo">
                    <input required name="full_name" value={form.full_name} onChange={onChange} data-testid="fast-track-name" className="fast-track-input" />
                  </FastTrackField>
                  <FastTrackField label="Email">
                    <input required type="email" name="email" value={form.email} onChange={onChange} data-testid="fast-track-email" className="fast-track-input" />
                  </FastTrackField>
                  <FastTrackField label="Teléfono">
                    <input required name="phone" value={form.phone} onChange={onChange} data-testid="fast-track-phone" className="fast-track-input" />
                  </FastTrackField>
                  <FastTrackField label="Fechas aproximadas">
                    <input name="travel_dates" value={form.travel_dates} onChange={onChange} placeholder="Ej. octubre de 2026" data-testid="fast-track-dates" className="fast-track-input" />
                  </FastTrackField>
                  <FastTrackField label="Número de viajeros">
                    <input name="party_size" value={form.party_size} onChange={onChange} placeholder="Ej. 2 adultos" data-testid="fast-track-party" className="fast-track-input" />
                  </FastTrackField>
                  <div className="hidden items-end sm:flex" aria-hidden="true">
                    <Users className="mb-3 h-5 w-5 text-[#D4A373]/65" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="mt-6">
                  <FastTrackField label="¿Cómo imaginas tu viaje?">
                    <textarea required name="message" value={form.message} onChange={onChange} rows={5} data-testid="fast-track-message" className="fast-track-input resize-none" />
                  </FastTrackField>
                </div>
                <label className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-white/60">
                  <input required type="checkbox" className="mt-0.5 h-4 w-4 accent-[#C16542]" data-testid="fast-track-terms" />
                  <span>Entiendo que el servicio cuesta 150 €, que el importe no es reembolsable y que se descontará íntegramente del viaje si finalmente confirmo la reserva con Xaluca Tours.</span>
                </label>
                <button
                  type="submit"
                  disabled={sending}
                  data-testid="fast-track-submit"
                  className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-[#C16542] px-8 py-4 text-[10px] uppercase tracking-[0.24em] transition-colors hover:bg-[#A35133] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
                >
                  {sending ? "Enviando solicitud…" : "Solicitar Fast Track"}
                  {!sending && <ArrowRight className="h-4 w-4" strokeWidth={1.6} />}
                </button>
                <p className="mt-4 text-[11px] leading-relaxed text-white/45">Enviar la solicitud no realiza ningún cargo. El equipo te informará sobre el proceso de activación.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.34em] text-[#C16542]">Preguntas frecuentes</span>
            <h2 className="mt-5 font-serif-x text-4xl md:text-5xl">Antes de activar Fast Track.</h2>
          </div>
          <div className="mt-12 divide-y divide-[#2C2621]/12 border-y border-[#2C2621]/12">
            {FAQ.map((item) => (
              <details key={item.question} className="group py-6" data-testid="fast-track-faq-item">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif-x text-xl marker:content-none md:text-2xl">
                  {item.question}
                  <span className="text-2xl font-light text-[#C16542] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pt-4 text-sm leading-relaxed text-[#5C5248] md:text-base">{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-[#5C5248]">¿Todavía tienes dudas antes de solicitarlo?</p>
            <Link to={pathFor("es", "contact")} className="mt-4 inline-flex items-center gap-2 border-b border-[#C16542]/45 pb-1 text-[10px] uppercase tracking-[0.24em] text-[#C16542]">
              Hablar con el equipo
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

function FastTrackField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] uppercase tracking-[0.28em] text-white/50">{label}</span>
      {children}
    </label>
  );
}
