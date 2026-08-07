import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Check, Mail, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor, resolvePath } from "@/lib/routes";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PRIVACY_URL = "https://xalucatours.com/";
const initialEmailForm = { full_name: "", email: "", phone: "", message: "", privacy: false };

const WHATSAPP_MODAL_EVENT = "xaluca:open-whatsapp-contact";
export const CLOSE_TRANSIENT_CONTACT_EVENT = "xaluca:close-transient-contact";

export const requestWhatsAppContact = (url) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CLOSE_TRANSIENT_CONTACT_EVENT));
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new CustomEvent(WHATSAPP_MODAL_EVENT, { detail: { url } }));
  });
};

const COPY = {
  eyebrow: { es: "Asistencia Xaluca", en: "Xaluca assistance", fr: "Assistance Xaluca" },
  title: {
    es: "¿Cómo prefieres contactar con nosotros?",
    en: "How would you prefer to contact us?",
    fr: "Comment préférez-vous nous contacter ?",
  },
  intro: {
    es: "Utilizamos una cuenta oficial de WhatsApp Business para que puedas contactar con nuestro equipo de forma rápida y sencilla. Este canal nos permite recibir tu consulta y ayudarte a organizar tu próximo viaje por Marruecos.",
    en: "We use an official WhatsApp Business account so you can contact our team quickly and easily. This channel lets us receive your enquiry and help organise your next journey through Morocco.",
    fr: "Nous utilisons un compte WhatsApp Business officiel afin que vous puissiez contacter facilement notre équipe. Ce canal nous permet de recevoir votre demande et de vous aider à organiser votre prochain voyage au Maroc.",
  },
  expectation: {
    es: "WhatsApp no funciona como un chat de atención en tiempo real. Aunque no siempre podremos responder al instante, revisamos y respondemos todas las solicitudes. Según tu consulta, continuaremos por WhatsApp o te contactaremos por teléfono o correo electrónico para ofrecerte una atención más personalizada.",
    en: "WhatsApp is not a real-time support chat. Although we cannot always reply immediately, we review and answer every enquiry. Depending on your request, we may continue on WhatsApp or contact you by phone or email for more personalised assistance.",
    fr: "WhatsApp n'est pas un service d'assistance en temps réel. Même si nous ne pouvons pas toujours répondre immédiatement, nous consultons et traitons chaque demande. Selon votre demande, nous poursuivrons sur WhatsApp ou vous contacterons par téléphone ou e-mail pour un accompagnement personnalisé.",
  },
  whatsappTitle: { es: "WhatsApp Business", en: "WhatsApp Business", fr: "WhatsApp Business" },
  whatsappBody: {
    es: "Ideal para un primer contacto rápido. Envíanos tu consulta y te responderemos lo antes posible.",
    en: "Ideal for a quick first contact. Send your enquiry and we will reply as soon as possible.",
    fr: "Idéal pour un premier contact rapide. Envoyez-nous votre demande et nous vous répondrons au plus vite.",
  },
  whatsappCta: { es: "Continuar por WhatsApp", en: "Continue on WhatsApp", fr: "Continuer sur WhatsApp" },
  emailTitle: { es: "Correo electrónico", en: "Email", fr: "E-mail" },
  emailBody: {
    es: "Perfecto para consultas detalladas o cuando quieras adjuntar información.",
    en: "Perfect for detailed enquiries or when you want to attach information.",
    fr: "Parfait pour une demande détaillée ou pour joindre des informations.",
  },
  emailCta: { es: "Enviar un correo electrónico", en: "Send an email", fr: "Envoyer un e-mail" },
  formTitle: { es: "Formulario de contacto", en: "Contact form", fr: "Formulaire de contact" },
  formBody: {
    es: "Completa los detalles de tu viaje y nuestro equipo preparará una respuesta personalizada.",
    en: "Share your trip details and our team will prepare a personalised response.",
    fr: "Précisez les détails de votre voyage et notre équipe préparera une réponse personnalisée.",
  },
  formCta: { es: "Ir a la página de contacto", en: "Go to the contact page", fr: "Accéder à la page contact" },
  close: { es: "Ahora no", en: "Not now", fr: "Pas maintenant" },
  closeLabel: { es: "Cerrar", en: "Close", fr: "Fermer" },
  reassurance: {
    es: "Cuenta oficial de Xaluca Tours · Respondemos todas las solicitudes",
    en: "Official Xaluca Tours account · Every enquiry receives a response",
    fr: "Compte officiel Xaluca Tours · Chaque demande reçoit une réponse",
  },
  emailModalEyebrow: { es: "Contacto por correo", en: "Contact by email", fr: "Contact par e-mail" },
  emailModalTitle: {
    es: "Escríbenos sin salir de la página.",
    en: "Write to us without leaving the page.",
    fr: "Écrivez-nous sans quitter la page.",
  },
  emailModalBody: {
    es: "Cuéntanos brevemente qué necesitas. Guardaremos tu consulta y la enviaremos al equipo de Xaluca Tours para que pueda responderte personalmente por correo.",
    en: "Tell us briefly what you need. We will save your enquiry and send it to the Xaluca Tours team so they can reply personally by email.",
    fr: "Expliquez-nous brièvement votre besoin. Nous enregistrerons votre demande et la transmettrons à l'équipe Xaluca Tours afin qu'elle puisse vous répondre personnellement par e-mail.",
  },
  nameLabel: { es: "Nombre", en: "Name", fr: "Nom" },
  emailLabel: { es: "Correo electrónico", en: "Email", fr: "E-mail" },
  phoneLabel: { es: "Teléfono (opcional)", en: "Phone (optional)", fr: "Téléphone (facultatif)" },
  messageLabel: { es: "¿En qué podemos ayudarte?", en: "How can we help?", fr: "Comment pouvons-nous vous aider ?" },
  privacyPre: { es: "He leído y acepto la ", en: "I have read and accept the ", fr: "J'ai lu et j'accepte la " },
  privacyLink: { es: "política de privacidad", en: "privacy policy", fr: "politique de confidentialité" },
  emailSubmit: { es: "Enviar consulta", en: "Send enquiry", fr: "Envoyer la demande" },
  emailSending: { es: "Enviando…", en: "Sending…", fr: "Envoi…" },
  emailError: {
    es: "No se ha podido enviar la consulta. Inténtalo de nuevo.",
    en: "We couldn't send your enquiry. Please try again.",
    fr: "Impossible d'envoyer votre demande. Veuillez réessayer.",
  },
  emailSuccessTitle: { es: "Consulta enviada", en: "Enquiry sent", fr: "Demande envoyée" },
  emailSuccessBody: {
    es: "Gracias. Hemos enviado tu mensaje al equipo y recibirás una confirmación en tu correo electrónico.",
    en: "Thank you. We have sent your message to the team and you will receive a confirmation by email.",
    fr: "Merci. Votre message a été transmis à l'équipe et vous recevrez une confirmation par e-mail.",
  },
  finish: { es: "Cerrar", en: "Close", fr: "Fermer" },
};

const isWhatsAppUrl = (href = "") => {
  try {
    const hostname = new URL(href, window.location.origin).hostname.toLowerCase().replace(/^www\./, "");
    return hostname === "wa.me" || hostname === "api.whatsapp.com" || hostname.endsWith(".whatsapp.com");
  } catch (_) {
    return false;
  }
};

export default function WhatsAppContactModal() {
  const { lang } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailForm, setEmailForm] = useState(initialEmailForm);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/34629415221");

  useEffect(() => {
    const showModal = (url) => {
      if (url) setWhatsappUrl(url);
      setOpen(true);
    };

    const handleRequest = (event) => showModal(event.detail?.url);
    const handleDocumentClick = (event) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor || anchor.dataset.whatsappDirect === "true") return;
      const href = anchor.href;
      if (!isWhatsAppUrl(href)) return;
      event.preventDefault();
      event.stopPropagation();
      requestWhatsAppContact(href);
    };

    window.addEventListener(WHATSAPP_MODAL_EVENT, handleRequest);
    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      window.removeEventListener(WHATSAPP_MODAL_EVENT, handleRequest);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  const continueOnWhatsApp = () => {
    setOpen(false);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const openEmailModal = () => {
    setOpen(false);
    setEmailError("");
    window.requestAnimationFrame(() => setEmailOpen(true));
  };

  const updateEmailForm = (event) => {
    const { name, value, checked, type } = event.target;
    setEmailForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submitEmailForm = async (event) => {
    event.preventDefault();
    if (emailSending) return;
    setEmailSending(true);
    setEmailError("");
    try {
      let routeId = null;
      try { routeId = resolvePath(location.pathname)?.routeId || null; } catch { routeId = null; }
      await axios.post(`${API}/contact-requests`, {
        full_name: emailForm.full_name.trim(),
        email: emailForm.email.trim(),
        phone: emailForm.phone.trim() || null,
        message: emailForm.message.trim(),
        preferred_contact: ["email"],
        language: lang,
        source_route_id: routeId,
        source_path: location.pathname,
        source_label: `Modal de contacto por correo · ${document.title || location.pathname}`,
      });
      setEmailSuccess(true);
      setEmailForm(initialEmailForm);
    } catch (error) {
      setEmailError(error?.response?.data?.detail || pick(COPY.emailError, lang));
    } finally {
      setEmailSending(false);
    }
  };

  const cardClass =
    "group flex h-full flex-col border border-[#2C2621]/10 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#C16542]/55 hover:shadow-[0_18px_45px_-30px_rgba(44,38,33,0.45)] sm:p-6";
  const ctaClass =
    "mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C16542] transition-[gap] duration-300 group-hover:gap-3";

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        data-testid="whatsapp-contact-modal"
        closeLabel={pick(COPY.closeLabel, lang)}
        overlayClassName="z-[10020]"
        className="z-[10030] w-[calc(100%-1.5rem)] max-w-5xl max-h-[92vh] gap-0 overflow-y-auto border border-[#2C2621]/10 bg-[#FDFBF7] p-0 text-[#2C2621] shadow-[0_35px_100px_-35px_rgba(26,21,19,0.75)] sm:rounded-none"
      >
        <header className="border-b border-[#2C2621]/10 px-5 py-7 pr-14 sm:px-9 sm:py-9 sm:pr-16 lg:px-12">
          <div className="inline-flex items-center gap-2 text-[#C16542]">
            <MessageCircle className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">
              {pick(COPY.eyebrow, lang)}
            </span>
          </div>
          <DialogTitle className="mt-4 max-w-3xl font-serif-x text-3xl font-normal leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            {pick(COPY.title, lang)}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-5 grid max-w-4xl gap-3 text-sm leading-relaxed text-[#2C2621]/70 md:grid-cols-2 md:gap-8">
              <p>{pick(COPY.intro, lang)}</p>
              <p>{pick(COPY.expectation, lang)}</p>
            </div>
          </DialogDescription>
        </header>

        <div className="px-5 py-7 sm:px-9 sm:py-9 lg:px-12">
          <div className="grid gap-4 md:grid-cols-3">
            <button type="button" onClick={continueOnWhatsApp} data-testid="whatsapp-contact-continue" className={cardClass}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/10 text-[#1FA855]">
                <MessageCircle className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-serif-x text-xl">{pick(COPY.whatsappTitle, lang)}</h3>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[#2C2621]/65">{pick(COPY.whatsappBody, lang)}</p>
              <span className={ctaClass}>{pick(COPY.whatsappCta, lang)}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
            </button>

            <button
              type="button"
              data-testid="whatsapp-contact-email"
              onClick={openEmailModal}
              className={cardClass}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#C16542]/10 text-[#C16542]">
                <Mail className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-serif-x text-xl">{pick(COPY.emailTitle, lang)}</h3>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[#2C2621]/65">{pick(COPY.emailBody, lang)}</p>
              <span className={ctaClass}>{pick(COPY.emailCta, lang)}<Send className="h-3.5 w-3.5" aria-hidden="true" /></span>
            </button>

            <DialogClose asChild>
              <Link to={pathFor(lang, "contact")} data-testid="whatsapp-contact-form" className={cardClass}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#A07042]/10 text-[#A07042]">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif-x text-xl">{pick(COPY.formTitle, lang)}</h3>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[#2C2621]/65">{pick(COPY.formBody, lang)}</p>
                <span className={ctaClass}>{pick(COPY.formCta, lang)}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
              </Link>
            </DialogClose>
          </div>

          <div className="mt-7 flex flex-col gap-4 border-t border-[#2C2621]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#2C2621]/60">
              <Check className="h-4 w-4 shrink-0 text-[#C16542]" strokeWidth={1.8} aria-hidden="true" />
              <span>{pick(COPY.reassurance, lang)}</span>
            </div>
            <DialogClose asChild>
              <button type="button" data-testid="whatsapp-contact-cancel" className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#2C2621]/60 transition-colors hover:text-[#C16542]">
                {pick(COPY.close, lang)}
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={emailOpen} onOpenChange={(nextOpen) => { setEmailOpen(nextOpen); if (!nextOpen) setEmailSuccess(false); }}>
      <DialogContent
        data-testid="email-contact-modal"
        closeLabel={pick(COPY.closeLabel, lang)}
        overlayClassName="z-[10040]"
        className="z-[10050] w-[calc(100%-1.5rem)] max-w-2xl max-h-[92vh] gap-0 overflow-y-auto border border-[#2C2621]/10 bg-[#FDFBF7] p-0 text-[#2C2621] shadow-[0_35px_100px_-35px_rgba(26,21,19,0.75)] sm:rounded-none"
      >
        {emailSuccess ? (
          <div className="px-6 py-12 text-center sm:px-12 sm:py-16" data-testid="email-contact-success">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#C16542] text-white shadow-lg">
              <Check className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <DialogTitle className="mt-6 font-serif-x text-3xl font-normal sm:text-4xl">
              {pick(COPY.emailSuccessTitle, lang)}
            </DialogTitle>
            <DialogDescription className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#2C2621]/68">
              {pick(COPY.emailSuccessBody, lang)}
            </DialogDescription>
            <DialogClose asChild>
              <button type="button" className="mt-8 bg-[#2C2621] px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#C16542]">
                {pick(COPY.finish, lang)}
              </button>
            </DialogClose>
          </div>
        ) : (
          <>
            <header className="border-b border-[#2C2621]/10 px-6 py-7 pr-14 sm:px-10 sm:py-9 sm:pr-16">
              <div className="inline-flex items-center gap-2 text-[#C16542]">
                <Mail className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">{pick(COPY.emailModalEyebrow, lang)}</span>
              </div>
              <DialogTitle className="mt-4 font-serif-x text-3xl font-normal leading-[1.05] sm:text-4xl">
                {pick(COPY.emailModalTitle, lang)}
              </DialogTitle>
              <DialogDescription className="mt-4 max-w-xl text-sm leading-relaxed text-[#2C2621]/68">
                {pick(COPY.emailModalBody, lang)}
              </DialogDescription>
            </header>

            <form onSubmit={submitEmailForm} className="px-6 py-7 sm:px-10 sm:py-9" data-testid="email-contact-form">
              <div className="grid gap-5 sm:grid-cols-2">
                <EmailField label={pick(COPY.nameLabel, lang)}>
                  <input required name="full_name" value={emailForm.full_name} onChange={updateEmailForm} minLength={2} maxLength={120} autoComplete="name" data-testid="email-contact-name" className="email-contact-input" />
                </EmailField>
                <EmailField label={pick(COPY.emailLabel, lang)}>
                  <input required type="email" name="email" value={emailForm.email} onChange={updateEmailForm} maxLength={254} autoComplete="email" data-testid="email-contact-email" className="email-contact-input" />
                </EmailField>
              </div>
              <div className="mt-5">
                <EmailField label={pick(COPY.phoneLabel, lang)}>
                  <input type="tel" name="phone" value={emailForm.phone} onChange={updateEmailForm} maxLength={40} autoComplete="tel" data-testid="email-contact-phone" className="email-contact-input" />
                </EmailField>
              </div>
              <div className="mt-5">
                <EmailField label={pick(COPY.messageLabel, lang)}>
                  <textarea required name="message" value={emailForm.message} onChange={updateEmailForm} minLength={4} maxLength={4000} rows={5} data-testid="email-contact-message" className="email-contact-input resize-y" />
                </EmailField>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#2C2621]/65">
                <input required type="checkbox" name="privacy" checked={emailForm.privacy} onChange={updateEmailForm} data-testid="email-contact-privacy" className="mt-0.5 h-4 w-4 shrink-0 accent-[#C16542]" />
                <span>
                  {pick(COPY.privacyPre, lang)}
                  <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-[#C16542] underline underline-offset-2">
                    {pick(COPY.privacyLink, lang)}
                  </a>.
                </span>
              </label>

              {emailError && <p role="alert" data-testid="email-contact-error" className="mt-5 border border-red-700/20 bg-red-50 px-4 py-3 text-xs text-red-800">{emailError}</p>}

              <button type="submit" disabled={emailSending} data-testid="email-contact-submit" className="mt-7 inline-flex w-full items-center justify-center gap-3 bg-[#C16542] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#A35133] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                {emailSending ? pick(COPY.emailSending, lang) : pick(COPY.emailSubmit, lang)}
                {!emailSending && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
            </form>
          </>
        )}

        <style>{`
          .email-contact-input {
            width: 100%;
            border: 1px solid rgba(44, 38, 33, 0.18);
            background: #fff;
            padding: 0.8rem 0.9rem;
            color: #2C2621;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.25s ease, box-shadow 0.25s ease;
          }
          .email-contact-input:focus {
            border-color: #C16542;
            box-shadow: 0 0 0 3px rgba(193, 101, 66, 0.1);
          }
        `}</style>
      </DialogContent>
    </Dialog>
    </>
  );
}

const EmailField = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2C2621]/55">{label}</span>
    {children}
  </label>
);
