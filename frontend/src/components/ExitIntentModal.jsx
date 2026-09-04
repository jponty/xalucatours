import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { ArrowRight, Check, Mail, Phone, Sparkles, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { resolvePath } from "@/lib/routes";
import InternationalPhoneInput, { isValidInternationalPhone } from "@/components/InternationalPhoneInput";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SESSION_SHOWN_KEY = "xaluca:exit-intent-shown";
const SESSION_STARTED_KEY = "xaluca:exit-intent-started";
const SESSION_VIEWS_KEY = "xaluca:exit-intent-page-views";
const CONVERTED_KEY = "xaluca:exit-intent-converted";
const PRIVACY_URL = "https://xalucatours.com/";
const DESKTOP_DELAY = 10_000;
const MOBILE_DELAY = 45_000;
const MOBILE_MULTI_PAGE_DELAY = 20_000;

const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  eyebrow: T("Antes de irte", "Before you go", "Avant de partir"),
  title: T(
    "¿Te ayudamos a organizar tu próxima aventura por Marruecos?",
    "Can we help organise your next Moroccan adventure?",
    "Pouvons-nous vous aider à organiser votre prochaine aventure au Maroc ?"
  ),
  body: T(
    "Déjanos tus datos y nuestro equipo se pondrá en contacto contigo para ayudarte a diseñar un viaje adaptado a tus fechas, preferencias y tipo de experiencia.",
    "Leave us your details and our team will contact you to design a journey around your dates, preferences and ideal experience.",
    "Laissez-nous vos coordonnées et notre équipe vous contactera pour concevoir un voyage adapté à vos dates, préférences et type d'expérience."
  ),
  name: T("Nombre", "Name", "Nom"),
  email: T("Correo electrónico", "Email", "E-mail"),
  phone: T("Teléfono", "Phone", "Téléphone"),
  optional: T("Email o teléfono: completa al menos uno", "Email or phone: complete at least one", "E-mail ou téléphone : renseignez-en au moins un"),
  call: T("Prefiero que me llaméis por teléfono", "I would prefer a phone call", "Je préfère être contacté(e) par téléphone"),
  privacyPre: T("He leído y acepto la ", "I have read and accept the ", "J'ai lu et j'accepte la "),
  privacy: T("política de privacidad", "privacy policy", "politique de confidentialité"),
  submit: T("Quiero que me ayudéis", "I would like your help", "Je souhaite votre aide"),
  sending: T("Enviando…", "Sending…", "Envoi…"),
  later: T("Ahora no, seguir explorando", "Not now, keep exploring", "Pas maintenant, continuer à explorer"),
  close: T("Cerrar", "Close", "Fermer"),
  contactError: T("Introduce un correo electrónico válido o un teléfono.", "Enter a valid email address or phone number.", "Saisissez une adresse e-mail valide ou un numéro de téléphone."),
  phoneError: T("Añade un teléfono para solicitar una llamada.", "Add a phone number to request a call.", "Ajoutez un numéro pour demander un appel."),
  privacyError: T("Debes aceptar la política de privacidad.", "You must accept the privacy policy.", "Vous devez accepter la politique de confidentialité."),
  genericError: T("No se pudo enviar la solicitud. Inténtalo de nuevo.", "We couldn't send your request. Please try again.", "La demande n'a pas pu être envoyée. Veuillez réessayer."),
  successTitle: T("¡Gracias! Empezamos a preparar tu próxima aventura", "Thank you! We're starting to prepare your next adventure", "Merci ! Nous commençons à préparer votre prochaine aventure"),
  successBody: T(
    "Hemos recibido tus datos. Nuestro equipo se pondrá en contacto contigo para conocer tus preferencias y ayudarte a organizar un viaje inolvidable por Marruecos.",
    "We've received your details. Our team will contact you to learn about your preferences and help organise an unforgettable journey through Morocco.",
    "Nous avons reçu vos coordonnées. Notre équipe vous contactera pour connaître vos préférences et vous aider à organiser un voyage inoubliable au Maroc."
  ),
};

const initialForm = { fullName: "", email: "", phone: "", preferCall: false, privacy: false };
const emailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const safeGet = (storage, key) => {
  try { return storage.getItem(key); } catch { return null; }
};
const safeSet = (storage, key, value) => {
  try { storage.setItem(key, value); } catch { /* Storage may be unavailable. */ }
};

export default function ExitIntentModal() {
  const { lang } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  const pathRef = useRef(location.pathname);
  const formBusyUntilRef = useRef(0);
  const openedRef = useRef(false);
  const sessionStartedRef = useRef(Date.now());
  const mobileRef = useRef(false);

  pathRef.current = location.pathname;

  const hasBlockingUi = useCallback(() => {
    const path = pathRef.current.toLowerCase();
    if (/(^|\/)(admin|planner|planifica-tu-viaje|citaprevia|feedback|fast-track)(\/|$)/.test(path)) return true;
    if (Date.now() < formBusyUntilRef.current) return true;
    if (document.body.style.overflow === "hidden") return true;
    if (document.activeElement?.closest?.("form")) return true;
    return Boolean(document.querySelector('[aria-modal="true"], [role="dialog"], [data-state="open"][role="menu"], [data-testid="ideal-trip-modal"]'));
  }, []);

  const tryOpen = useCallback(() => {
    if (openedRef.current) return;
    if (safeGet(window.sessionStorage, SESSION_SHOWN_KEY) === "1") return;
    if (safeGet(window.localStorage, CONVERTED_KEY) === "1") return;
    if (Date.now() - sessionStartedRef.current < DESKTOP_DELAY) return;
    if (hasBlockingUi()) return;
    openedRef.current = true;
    safeSet(window.sessionStorage, SESSION_SHOWN_KEY, "1");
    setOpen(true);
  }, [hasBlockingUi]);

  useEffect(() => {
    const storedStart = Number(safeGet(window.sessionStorage, SESSION_STARTED_KEY));
    sessionStartedRef.current = Number.isFinite(storedStart) && storedStart > 0 ? storedStart : Date.now();
    safeSet(window.sessionStorage, SESSION_STARTED_KEY, String(sessionStartedRef.current));
    mobileRef.current = window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches || window.innerWidth < 768;

    const markFormBusy = (event) => {
      if (event.target?.closest?.("form") && !event.target.closest('[data-testid="exit-intent-form"]')) {
        formBusyUntilRef.current = Date.now() + 120_000;
      }
    };
    const onMouseOut = (event) => {
      if (mobileRef.current) return;
      if (event.relatedTarget === null && event.clientY <= 5) tryOpen();
    };
    document.addEventListener("focusin", markFormBusy, true);
    document.addEventListener("input", markFormBusy, true);
    document.addEventListener("change", markFormBusy, true);
    document.addEventListener("mouseout", onMouseOut);

    const mobileTimer = window.setInterval(() => {
      if (mobileRef.current) tryOpen();
    }, MOBILE_DELAY);
    return () => {
      window.clearInterval(mobileTimer);
      document.removeEventListener("focusin", markFormBusy, true);
      document.removeEventListener("input", markFormBusy, true);
      document.removeEventListener("change", markFormBusy, true);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [tryOpen]);

  useEffect(() => {
    const current = Number(safeGet(window.sessionStorage, SESSION_VIEWS_KEY)) || 0;
    const views = current + 1;
    safeSet(window.sessionStorage, SESSION_VIEWS_KEY, String(views));
    if (!mobileRef.current || views < 3) return undefined;
    const elapsed = Date.now() - sessionStartedRef.current;
    const timer = window.setTimeout(tryOpen, Math.max(750, MOBILE_MULTI_PAGE_DELAY - elapsed));
    return () => window.clearTimeout(timer);
  }, [location.pathname, tryOpen]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => dialogRef.current?.querySelector("button")?.focus());
    const onKeyDown = (event) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open]);

  const onChange = (event) => {
    const { name, type, checked, value } = event.target;
    setError("");
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;
    const email = form.email.trim();
    const phone = form.phone.trim();
    if ((!email && !phone) || (email && !emailValid(email)) || (phone && !isValidInternationalPhone(phone))) {
      setError(pick(COPY.contactError, lang)); return;
    }
    if (form.preferCall && !phone) { setError(pick(COPY.phoneError, lang)); return; }
    if (!form.privacy) { setError(pick(COPY.privacyError, lang)); return; }
    setSending(true);
    try {
      let routeId = null;
      try { routeId = resolvePath(location.pathname)?.routeId || null; } catch { routeId = null; }
      const preferredContact = form.preferCall
        ? ["phone"]
        : [email && "email", phone && "phone"].filter(Boolean);
      await axios.post(`${API}/contact-requests`, {
        full_name: form.fullName.trim(),
        email: email || null,
        phone: phone || null,
        journey_interest: "exit-intent",
        preferred_contact: preferredContact,
        preferred_contact_email: preferredContact.includes("email") ? email : null,
        preferred_contact_phone: preferredContact.includes("phone") ? phone : null,
        message: `Solicitud desde modal de intención de salida. Prefiere llamada: ${form.preferCall ? "Sí" : "No"}.`,
        language: lang,
        source_route_id: routeId,
        source_path: location.pathname,
        source_label: `Modal intención de salida · ${document.title || location.pathname}`,
      });
      safeSet(window.localStorage, CONVERTED_KEY, "1");
      window.dispatchEvent(new CustomEvent("xaluca:lead-submitted"));
      setSuccess(true);
    } catch (error) {
      setError(error?.response?.data?.detail || pick(COPY.genericError, lang));
    } finally {
      setSending(false);
    }
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[13000] flex items-center justify-center bg-[#1A1513]/78 px-4 py-6 backdrop-blur-sm"
      data-testid="exit-intent-backdrop"
      onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        data-testid="exit-intent-modal"
        className="relative max-h-[92svh] w-full max-w-4xl overflow-y-auto bg-[#F7F0E6] shadow-[0_35px_100px_-20px_rgba(0,0,0,0.7)]"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={pick(COPY.close, lang)}
          data-testid="exit-intent-close"
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#2C2621]/15 bg-[#FDFBF7]/90 text-[#2C2621] transition-colors hover:border-[#C16542] hover:text-[#C16542]"
        >
          <X className="h-4 w-4" strokeWidth={1.7} />
        </button>

        {success ? (
          <div className="px-6 py-16 text-center sm:px-12 md:py-20" data-testid="exit-intent-success">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#C16542] text-white shadow-lg">
              <Check className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <p className="mt-7 text-[9px] uppercase tracking-[0.3em] text-[#C16542]">Xaluca · Tours</p>
            <h2 id="exit-intent-title" className="mx-auto mt-4 max-w-2xl font-serif-x text-4xl leading-tight text-[#2C2621] md:text-5xl">
              {pick(COPY.successTitle, lang)}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#5C5248] md:text-base">{pick(COPY.successBody, lang)}</p>
            <button type="button" onClick={() => setOpen(false)} className="mt-8 border-b border-[#C16542]/40 pb-1 text-[10px] uppercase tracking-[0.2em] text-[#C16542]">
              {pick(COPY.later, lang)}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden bg-[#2C2621] px-6 py-12 text-white sm:px-9 md:px-10 md:py-16">
              <div className="absolute inset-0 berber-bg-cross opacity-30" aria-hidden="true" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#D4A373]">
                  <Sparkles className="h-3.5 w-3.5" /> {pick(COPY.eyebrow, lang)}
                </span>
                <h2 id="exit-intent-title" className="mt-5 font-serif-x text-4xl leading-[1.06] sm:text-5xl md:text-[46px]">
                  {pick(COPY.title, lang)}
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-white/72 md:text-base">{pick(COPY.body, lang)}</p>
              </div>
            </div>

            <form onSubmit={onSubmit} data-testid="exit-intent-form" className="px-6 py-10 sm:px-9 md:px-10 md:py-14">
              <label className="block">
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#5C5248]">{pick(COPY.name, lang)} *</span>
                <input name="fullName" value={form.fullName} onChange={onChange} required minLength={2} maxLength={120} data-testid="exit-intent-name" className="mt-2 w-full border border-[#2C2621]/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C16542]" />
              </label>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#5C5248]"><Mail className="h-3 w-3" />{pick(COPY.email, lang)}</span>
                  <input type="email" name="email" value={form.email} onChange={onChange} maxLength={254} data-testid="exit-intent-email" className="mt-2 w-full border border-[#2C2621]/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C16542]" />
                </label>
                <div className="block">
                  <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#5C5248]"><Phone className="h-3 w-3" />{pick(COPY.phone, lang)}</span>
                  <InternationalPhoneInput
                    name="phone"
                    value={form.phone}
                    onValueChange={(phone) => { setError(""); setForm((current) => ({ ...current, phone })); }}
                    lang={lang}
                    testId="exit-intent-phone"
                    className="mt-2"
                  />
                </div>
              </div>
              <p className="mt-2 text-[10px] text-[#5C5248]/70">{pick(COPY.optional, lang)}</p>

              <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#5C5248]">
                <input type="checkbox" name="preferCall" checked={form.preferCall} onChange={onChange} data-testid="exit-intent-prefer-call" className="mt-0.5 h-4 w-4 accent-[#C16542]" />
                <span>{pick(COPY.call, lang)}</span>
              </label>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#5C5248]">
                <input type="checkbox" name="privacy" checked={form.privacy} onChange={onChange} required data-testid="exit-intent-privacy" className="mt-0.5 h-4 w-4 accent-[#C16542]" />
                <span>
                  {pick(COPY.privacyPre, lang)}
                  <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-[#C16542] underline underline-offset-2">{pick(COPY.privacy, lang)}</a>.
                </span>
              </label>

              {error && <p role="alert" data-testid="exit-intent-error" className="mt-4 border border-[#C16542]/25 bg-[#C16542]/[0.08] px-3 py-2 text-xs text-[#A35133]">{error}</p>}

              <button type="submit" disabled={sending} data-testid="exit-intent-submit" className="mt-7 inline-flex w-full items-center justify-center gap-3 bg-[#C16542] px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#A35133] disabled:cursor-not-allowed disabled:opacity-60">
                {pick(sending ? COPY.sending : COPY.submit, lang)}
                {!sending && <ArrowRight className="h-3.5 w-3.5" />}
              </button>
              <button type="button" onClick={() => setOpen(false)} data-testid="exit-intent-later" className="mt-4 w-full text-center text-[9px] uppercase tracking-[0.2em] text-[#5C5248] transition-colors hover:text-[#C16542]">
                {pick(COPY.later, lang)}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
