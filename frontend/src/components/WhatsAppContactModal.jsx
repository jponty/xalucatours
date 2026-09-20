import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Check, MessageCircle, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useLeadCapture } from "@/lib/leadCapture";
import { contactSubmissionFields, DEFAULT_CONTACT_PREFERENCE } from "@/lib/contactSubmission";
import { ContactPreference } from "@/components/FormExtras";
import InternationalPhoneInput, { isValidInternationalPhone } from "@/components/InternationalPhoneInput";
import { WHATSAPP_URL } from "@/components/WhatsAppIcon";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PRIVACY_URL = "https://xalucatours.com/";
const INITIAL_FORM = { first_name: "", last_name: "", email: "", phone: "", privacy: false };

const WHATSAPP_MODAL_EVENT = "xaluca:open-whatsapp-contact";
export const CLOSE_TRANSIENT_CONTACT_EVENT = "xaluca:close-transient-contact";

export const requestWhatsAppContact = (url = WHATSAPP_URL) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CLOSE_TRANSIENT_CONTACT_EVENT));
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new CustomEvent(WHATSAPP_MODAL_EVENT, { detail: { url } }));
  });
};

const COPY = {
  eyebrow: { es: "WhatsApp Business", en: "WhatsApp Business", fr: "WhatsApp Business" },
  title: {
    es: "Antes de continuar por WhatsApp",
    en: "Before continuing on WhatsApp",
    fr: "Avant de continuer sur WhatsApp",
  },
  intro: {
    es: "Déjanos tus datos para que el equipo de Xaluca Tours pueda identificar tu consulta y atenderte personalmente. Al continuar, guardaremos esta solicitud y abriremos nuestro chat oficial de WhatsApp Business.",
    en: "Leave your details so the Xaluca Tours team can identify your enquiry and assist you personally. When you continue, we will save this request and open our official WhatsApp Business chat.",
    fr: "Laissez-nous vos coordonnées afin que l’équipe Xaluca Tours puisse identifier votre demande et vous accompagner personnellement. En continuant, nous enregistrerons cette demande et ouvrirons notre chat WhatsApp Business officiel.",
  },
  firstName: { es: "Nombre", en: "First name", fr: "Prénom" },
  lastName: { es: "Apellidos", en: "Last name", fr: "Nom de famille" },
  email: { es: "Email", en: "Email", fr: "E-mail" },
  phone: { es: "Teléfono", en: "Phone", fr: "Téléphone" },
  privacyPre: { es: "He leído y acepto la ", en: "I have read and accept the ", fr: "J’ai lu et j’accepte la " },
  privacyLink: { es: "política de privacidad", en: "privacy policy", fr: "politique de confidentialité" },
  requiredError: {
    es: "Completa nombre, apellidos, email y teléfono antes de continuar.",
    en: "Complete your first name, last name, email and phone before continuing.",
    fr: "Complétez votre prénom, nom, e-mail et téléphone avant de continuer.",
  },
  emailError: {
    es: "Introduce una dirección de email válida.",
    en: "Enter a valid email address.",
    fr: "Saisissez une adresse e-mail valide.",
  },
  phoneError: {
    es: "Introduce un teléfono válido con su prefijo internacional.",
    en: "Enter a valid phone number with its international calling code.",
    fr: "Saisissez un numéro valide avec son indicatif international.",
  },
  privacyError: {
    es: "Debes aceptar la política de privacidad para continuar.",
    en: "You must accept the privacy policy to continue.",
    fr: "Vous devez accepter la politique de confidentialité pour continuer.",
  },
  submitError: {
    es: "No hemos podido guardar tus datos. Inténtalo de nuevo antes de continuar por WhatsApp.",
    en: "We couldn't save your details. Please try again before continuing on WhatsApp.",
    fr: "Nous n’avons pas pu enregistrer vos coordonnées. Réessayez avant de continuer sur WhatsApp.",
  },
  submit: { es: "Continuar por WhatsApp", en: "Continue on WhatsApp", fr: "Continuer sur WhatsApp" },
  sending: { es: "Guardando tus datos…", en: "Saving your details…", fr: "Enregistrement de vos coordonnées…" },
  reassurance: {
    es: "Tus datos quedarán registrados únicamente para atender esta solicitud.",
    en: "Your details will only be recorded to handle this enquiry.",
    fr: "Vos coordonnées seront enregistrées uniquement pour traiter cette demande.",
  },
  closeLabel: { es: "Cerrar", en: "Close", fr: "Fermer" },
};

const isWhatsAppUrl = (href = "") => {
  try {
    const hostname = new URL(href, window.location.origin).hostname.toLowerCase().replace(/^www\./, "");
    return hostname === "wa.me" || hostname === "api.whatsapp.com" || hostname.endsWith(".whatsapp.com");
  } catch (_) {
    return false;
  }
};

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function WhatsAppContactModal() {
  const { lang } = useLanguage();
  const location = useLocation();
  const leadCapture = useLeadCapture("whatsapp_business", lang);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [preference, setPreference] = useState(DEFAULT_CONTACT_PREFERENCE);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState(WHATSAPP_URL);
  const [countryPortal, setCountryPortal] = useState(null);

  useEffect(() => {
    const showModal = (url) => {
      setWhatsappUrl(isWhatsAppUrl(url) ? url : WHATSAPP_URL);
      setForm(INITIAL_FORM);
      setPreference(DEFAULT_CONTACT_PREFERENCE);
      setError("");
      setOpen(true);
    };

    const handleRequest = (event) => showModal(event.detail?.url);
    const handleDocumentClick = (event) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor || !isWhatsAppUrl(anchor.href)) return;
      event.preventDefault();
      event.stopPropagation();
      requestWhatsAppContact(anchor.href);
    };

    window.addEventListener(WHATSAPP_MODAL_EVENT, handleRequest);
    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      window.removeEventListener(WHATSAPP_MODAL_EVENT, handleRequest);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  const updateForm = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (sending) return;

    const firstName = form.first_name.trim();
    const lastName = form.last_name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!firstName || !lastName || !email || !phone) {
      setError(pick(COPY.requiredError, lang));
      return;
    }
    if (!validEmail(email)) {
      setError(pick(COPY.emailError, lang));
      return;
    }
    if (!isValidInternationalPhone(phone)) {
      setError(pick(COPY.phoneError, lang));
      return;
    }
    if (!form.privacy) {
      setError(pick(COPY.privacyError, lang));
      return;
    }

    // Open synchronously from the user gesture so mobile browsers do not block
    // the WhatsApp tab while the lead is being saved. It is only navigated once
    // the API confirms the record; on failure it is closed again.
    const pendingWindow = window.open("", "_blank");
    if (pendingWindow) pendingWindow.opener = null;

    setSending(true);
    setError("");
    try {
      const fullName = `${firstName} ${lastName}`;
      await axios.post(`${API}/contact-requests`, {
        ...leadCapture(),
        capture_type: "whatsapp_business",
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        ...contactSubmissionFields({ email, phone, preferred_contact: preference }),
        privacy_consent: true,
        message: "Solicitud de contacto a través de WhatsApp Business.",
        journey_interest: "whatsapp-business",
        language: lang,
        source_path: location.pathname,
        source_label: `WhatsApp Business · ${document.title || location.pathname}`,
      });

      setOpen(false);
      setForm(INITIAL_FORM);
      if (pendingWindow && !pendingWindow.closed) {
        pendingWindow.location.replace(whatsappUrl);
      } else {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (_) {
      pendingWindow?.close();
      setError(pick(COPY.submitError, lang));
    } finally {
      setSending(false);
    }
  };

  const inputClass = "h-12 w-full border border-[#2C2621]/20 bg-white px-4 text-sm text-[#2C2621] outline-none transition-[border-color,box-shadow] focus:border-[#C16542] focus:shadow-[0_0_0_3px_rgba(193,101,66,.1)]";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!sending) setOpen(nextOpen); }}>
      <DialogContent
        data-testid="whatsapp-contact-modal"
        closeLabel={pick(COPY.closeLabel, lang)}
        overlayClassName="z-[10020]"
        className="z-[10030] w-[calc(100%-1.5rem)] max-w-2xl gap-0 overflow-visible border border-[#2C2621]/10 bg-[#FDFBF7] p-0 text-[#2C2621] shadow-[0_35px_100px_-35px_rgba(26,21,19,0.75)] sm:rounded-none"
      >
        <div className="max-h-[92dvh] overflow-y-auto overscroll-contain">
          <header className="border-b border-[#2C2621]/10 px-5 py-7 pr-14 sm:px-9 sm:py-9 sm:pr-16">
            <div className="inline-flex items-center gap-2 text-[#1FA855]">
              <MessageCircle className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">
                {pick(COPY.eyebrow, lang)}
              </span>
            </div>
            <DialogTitle className="mt-4 font-serif-x text-3xl font-normal leading-[1.05] tracking-tight sm:text-4xl">
              {pick(COPY.title, lang)}
            </DialogTitle>
            <DialogDescription className="mt-4 max-w-xl text-sm leading-relaxed text-[#2C2621]/70">
              {pick(COPY.intro, lang)}
            </DialogDescription>
          </header>

          <form onSubmit={submit} noValidate className="px-5 py-7 sm:px-9 sm:py-9" data-testid="whatsapp-contact-form">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={`${pick(COPY.firstName, lang)} *`}>
                <input required name="first_name" value={form.first_name} onChange={updateForm} maxLength={120} autoComplete="given-name" data-testid="whatsapp-contact-first-name" className={inputClass} />
              </Field>
              <Field label={`${pick(COPY.lastName, lang)} *`}>
                <input required name="last_name" value={form.last_name} onChange={updateForm} maxLength={150} autoComplete="family-name" data-testid="whatsapp-contact-last-name" className={inputClass} />
              </Field>
            </div>

            <div className="mt-5">
              <Field label={`${pick(COPY.email, lang)} *`}>
                <input required type="email" name="email" value={form.email} onChange={updateForm} maxLength={254} autoComplete="email" data-testid="whatsapp-contact-email" className={inputClass} />
              </Field>
            </div>

            <div className="mt-5">
              <Field as="div" label={`${pick(COPY.phone, lang)} *`}>
                <InternationalPhoneInput
                  required
                  name="phone"
                  value={form.phone}
                  onValueChange={(phone) => {
                    setForm((current) => ({ ...current, phone }));
                    setError("");
                  }}
                  lang={lang}
                  testId="whatsapp-contact-phone"
                  countryPortalContainer={countryPortal}
                />
              </Field>
            </div>

            <div className="mt-6"><ContactPreference lang={lang} value={preference} onChange={setPreference} testidPrefix="whatsapp-pref" /></div>
            <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#2C2621]/68">
              <input required type="checkbox" name="privacy" checked={form.privacy} onChange={updateForm} data-testid="whatsapp-contact-privacy" className="mt-0.5 h-4 w-4 shrink-0 accent-[#C16542]" />
              <span>
                {pick(COPY.privacyPre, lang)}
                <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-[#C16542] underline underline-offset-2">{pick(COPY.privacyLink, lang)}</a>.
              </span>
            </label>

            {error && <p role="alert" data-testid="whatsapp-contact-error" className="mt-5 border border-red-700/20 bg-red-50 px-4 py-3 text-xs text-red-800">{error}</p>}

            <button type="submit" disabled={sending} data-testid="whatsapp-contact-continue" className="xaluca-button mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#25D366] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#1EBE5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
              {sending ? pick(COPY.sending, lang) : pick(COPY.submit, lang)}
              {!sending && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>

            <div className="mt-6 flex items-start gap-2 border-t border-[#2C2621]/10 pt-5 text-[11px] leading-relaxed text-[#2C2621]/58">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C16542]" strokeWidth={1.7} aria-hidden="true" />
              <span>{pick(COPY.reassurance, lang)}</span>
              <Check className="ml-auto h-4 w-4 shrink-0 text-[#1FA855]" strokeWidth={1.8} aria-hidden="true" />
            </div>
          </form>
        </div>
        <div ref={setCountryPortal} data-testid="whatsapp-contact-country-layer" />
      </DialogContent>
    </Dialog>
  );
}

const Field = ({ label, children, as: Wrapper = "label" }) => (
  <Wrapper className="block">
    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2C2621]/55">{label}</span>
    {children}
  </Wrapper>
);
