import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { toast } from "sonner";
import { X, Download, ArrowRight, Check, Loader2 } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import InternationalPhoneInput, { isValidInternationalPhone } from "@/components/InternationalPhoneInput";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PRIVACY_URL = "https://xalucatours.com/";

const COPY = {
  title: { es: "Descargar programa", en: "Download programme", fr: "Télécharger le programme" },
  subtitle: {
    es: "Completa tus datos y te llevaremos al programa completo de este viaje.",
    en: "Fill in your details and we'll take you to the full programme of this trip.",
    fr: "Remplissez vos coordonnées et nous vous dirigerons vers le programme complet de ce voyage.",
  },
  first_name: { es: "Nombre", en: "First name", fr: "Prénom" },
  last_name: { es: "Apellidos", en: "Last name", fr: "Nom" },
  email: { es: "Correo electrónico", en: "Email", fr: "E-mail" },
  phone: { es: "Teléfono", en: "Phone", fr: "Téléphone" },
  newsletter: {
    es: "Sí, deseo recibir noticias, novedades y otra información de Xaluca Tours.",
    en: "Yes, I want to receive news, updates and other information from Xaluca Tours.",
    fr: "Oui, je souhaite recevoir des actualités, nouveautés et autres informations de Xaluca Tours.",
  },
  privacy_pre: { es: "He leído y acepto la ", en: "I have read and accept the ", fr: "J'ai lu et j'accepte la " },
  privacy_link: { es: "Política de Privacidad", en: "Privacy Policy", fr: "Politique de Confidentialité" },
  privacy_post: { es: ".", en: ".", fr: "." },
  submit: { es: "Descargar programa", en: "Download programme", fr: "Télécharger le programme" },
  sending: { es: "Enviando…", en: "Sending…", fr: "Envoi…" },
  success: {
    es: "¡Gracias! Abriendo tu programa…",
    en: "Thank you! Opening your programme…",
    fr: "Merci ! Ouverture de votre programme…",
  },
  required: { es: "Campo obligatorio", en: "Required field", fr: "Champ obligatoire" },
  invalid_fields: {
    es: "Revisa los campos obligatorios antes de continuar.",
    en: "Please check the required fields before continuing.",
    fr: "Vérifiez les champs obligatoires avant de continuer.",
  },
  network_error: {
    es: "No se puede conectar con el servidor. Comprueba que esté disponible e inténtalo de nuevo.",
    en: "We cannot connect to the server. Please check that it is available and try again.",
    fr: "Impossible de se connecter au serveur. Vérifiez qu’il est disponible et réessayez.",
  },
  server_error: {
    es: "El servidor no ha podido procesar la descarga. Inténtalo de nuevo en unos instantes.",
    en: "The server could not process the download. Please try again in a few moments.",
    fr: "Le serveur n’a pas pu traiter le téléchargement. Réessayez dans quelques instants.",
  },
  request_error: {
    es: "No se pudo completar la solicitud. Revisa los datos e inténtalo de nuevo.",
    en: "The request could not be completed. Please check your details and try again.",
    fr: "La demande n’a pas pu être traitée. Vérifiez vos informations et réessayez.",
  },
};

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const initialForm = { first_name: "", last_name: "", email: "", phone: "", newsletter: false, privacy: false };

export const DownloadProgramModal = ({ open, onClose, routeId, programTitle }) => {
  const { lang } = useLanguage();
  const L = (k) => pick(COPY[k], lang);
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setDone(false);
      setSending(false);
      // Lock scroll WITHOUT layout shift: compensate the removed
      // scrollbar width so the centered modal doesn't jump sideways.
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      const prevOverflow = document.body.style.overflow;
      const prevPad = document.body.style.paddingRight;
      document.body.style.overflow = "hidden";
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPad;
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onField = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const isValid =
    form.first_name.trim().length > 0 &&
    form.last_name.trim().length > 0 &&
    isValidEmail(form.email.trim()) &&
    isValidInternationalPhone(form.phone) &&
    form.privacy === true;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      toast.error(L("invalid_fields"));
      return;
    }
    if (sending) return;
    setSending(true);
    try {
      const { data } = await axios.post(`${API}/program-downloads`, {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        newsletter: form.newsletter,
        privacy_accepted: form.privacy,
        route_id: routeId || null,
        program_title: programTitle || null,
        language: lang,
      });
      setDone(true);
      const url = data?.download_url || PRIVACY_URL;
      // Redirect automatically to the brochure link for this trip page.
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
        onClose();
      }, 900);
    } catch (error) {
      const detail = error?.response?.data?.detail;
      if (typeof detail === "string" && detail.trim()) {
        toast.error(detail);
      } else if (Array.isArray(detail)) {
        toast.error(L("invalid_fields"));
      } else if (!error?.response) {
        toast.error(L("network_error"));
      } else if (error.response.status >= 500) {
        toast.error(L("server_error"));
      } else {
        toast.error(L("request_error"));
      }
      setSending(false);
    }
  };

  return createPortal(
    <div
      data-testid="download-program-modal"
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-[#1A1513]/80 backdrop-blur-sm"
        onClick={onClose}
        data-testid="download-program-backdrop"
      />
      <div className="relative w-full max-w-lg bg-[#FDFBF7] text-[#2C2621] shadow-2xl border border-[#2C2621]/10 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          data-testid="download-program-close"
          aria-label="Close"
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-9 h-9 text-[#2C2621]/60 hover:text-[#C16542] transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={1.6} />
        </button>

        <div className="relative p-8 md:p-10">
          <div className="inline-flex items-center gap-2 text-[#C16542]">
            <Download className="w-4 h-4" strokeWidth={1.7} />
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">Xaluca Tours</span>
          </div>
          <h2 className="font-serif-x text-3xl md:text-4xl leading-[1.05] tracking-tight mt-4">{L("title")}</h2>
          <p className="mt-3 text-sm text-[#2C2621]/70 leading-relaxed">{L("subtitle")}</p>

          {done ? (
            <div data-testid="download-program-success" className="mt-8 flex flex-col items-center text-center py-8">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#C16542]/40 text-[#C16542]">
                <Check className="w-6 h-6" strokeWidth={1.8} />
              </span>
              <p className="mt-5 text-base text-[#2C2621]/80">{L("success")}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} data-testid="download-program-form" className="mt-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DLField label={L("first_name")} testId="dl-first-name" required>
                  <input required name="first_name" value={form.first_name} onChange={onField}
                    data-testid="download-input-first-name" className="dl-input" autoComplete="given-name" />
                </DLField>
                <DLField label={L("last_name")} testId="dl-last-name" required>
                  <input required name="last_name" value={form.last_name} onChange={onField}
                    data-testid="download-input-last-name" className="dl-input" autoComplete="family-name" />
                </DLField>
                <DLField label={L("email")} testId="dl-email" required>
                  <input required type="email" name="email" value={form.email} onChange={onField}
                    data-testid="download-input-email" className="dl-input" autoComplete="email" />
                </DLField>
                <DLField as="div" label={L("phone")} testId="dl-phone" required>
                  <InternationalPhoneInput
                    required
                    name="phone"
                    value={form.phone}
                    onValueChange={(phone) => setForm((current) => ({ ...current, phone }))}
                    lang={lang}
                    testId="download-input-phone"
                  />
                </DLField>
              </div>

              <label className="flex items-start gap-3 cursor-pointer" data-testid="download-newsletter-label">
                <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={onField}
                  data-testid="download-checkbox-newsletter" className="dl-checkbox mt-0.5" />
                <span className="text-[13px] leading-snug text-[#2C2621]/80">{L("newsletter")}</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer" data-testid="download-privacy-label">
                <input type="checkbox" name="privacy" checked={form.privacy} onChange={onField}
                  required data-testid="download-checkbox-privacy" className="dl-checkbox mt-0.5" />
                <span className="text-[13px] leading-snug text-[#2C2621]/80">
                  {L("privacy_pre")}
                  <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer"
                    className="text-[#C16542] underline underline-offset-2 hover:text-[#A35133]"
                    data-testid="download-privacy-link">
                    {L("privacy_link")}
                  </a>
                  {L("privacy_post")}
                </span>
              </label>

              <button
                type="submit"
                disabled={!isValid || sending}
                data-testid="download-program-submit"
                className="w-full inline-flex items-center justify-center gap-3 bg-[#C16542] hover:bg-[#A35133] disabled:opacity-40 disabled:cursor-not-allowed text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
              >
                {sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.8} />{L("sending")}</>
                ) : (
                  <>{L("submit")}<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} /></>
                )}
              </button>
            </form>
          )}
        </div>

        <style>{`
          .dl-input {
            width: 100%;
            background: #fff;
            border: 1px solid rgba(44, 38, 33, 0.18);
            color: #2C2621;
            padding: 0.7rem 0.9rem;
            font-family: 'Outfit', sans-serif;
            font-size: 0.95rem;
            outline: none;
            border-radius: 2px;
            transition: border-color 0.25s ease;
          }
          .dl-input:focus { border-color: #C16542; }
          .dl-checkbox { width: 18px; height: 18px; accent-color: #C16542; flex: 0 0 auto; cursor: pointer; }
        `}</style>
      </div>
    </div>,
    document.body
  );
};

const DLField = ({ label, testId, children, required = false, as: Wrapper = "label" }) => (
  <Wrapper className="block" data-testid={`${testId}-field`}>
    <span className="block text-[10px] tracking-[0.3em] uppercase text-[#2C2621]/55 mb-2">
      {label}{required ? <span className="text-[#C16542]" aria-hidden="true"> *</span> : null}
    </span>
    {children}
  </Wrapper>
);

export default DownloadProgramModal;
