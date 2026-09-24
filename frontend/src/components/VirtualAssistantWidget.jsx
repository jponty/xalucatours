import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import PersonalNameFields, { personalNameFields } from "@/components/PersonalNameFields";
import { Content as DialogContent } from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Bot, ChevronRight, Loader2, RotateCcw, ShieldCheck, X } from "lucide-react";
import { Dialog, DialogPortal, DialogOverlay, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { CONTACT } from "@/lib/data";
import { newSubmissionId, useLeadCapture } from "@/lib/leadCapture";
import { DEFAULT_CONTACT_PREFERENCE } from "@/lib/contactSubmission";
import { assistantAvailable, identifyForAssistant, loadAssistantGuide, safeAssistantSourcePath } from "@/lib/assistantApi";
import InternationalPhoneInput, { isValidInternationalPhone } from "@/components/InternationalPhoneInput";
import { ContactPreference } from "@/components/FormExtras";
import { DICTATION_COPY } from "@/components/DictationForm";
import "./VirtualAssistantWidget.css";

const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  title: T("Asistente Virtual", "Virtual Assistant", "Assistant virtuel"),
  intro: T("Elige una opción y descubre nuestros viajes, paso a paso.", "Choose an option and explore our trips, step by step.", "Choisissez une option et découvrez nos voyages, étape par étape."),
  identify: T("Antes de empezar, nos presentamos", "Before we start, let's get acquainted", "Avant de commencer, faisons connaissance"),
  identifyBody: T("Déjanos tus datos para identificarte antes de usar el asistente. Después, solo tendrás que elegir entre las opciones. Los campos marcados con * son obligatorios.", "Leave your details to identify yourself before using the assistant. Then simply choose from the options. Fields marked * are required.", "Laissez-nous vos coordonnées pour vous identifier avant d'utiliser l'assistant. Choisissez ensuite parmi les options. Les champs marqués * sont obligatoires."),
  begin: T("Empezar", "Get started", "Commencer"),
  saving: T("Guardando tus datos…", "Saving your details…", "Enregistrement de vos coordonnées…"),
  searching: T("Cargando las opciones…", "Loading your options…", "Chargement des options…"),
  source: T("Ver información en la web", "Read on our website", "Consulter sur notre site"),
  contact: T("Contactar con el equipo", "Contact our team", "Contacter notre équipe"),
  close: T("Cerrar", "Close", "Fermer"),
  finish: T("Finalizar", "Finish", "Terminer"),
  back: T("Volver", "Back", "Retour"),
  restart: T("Empezar de nuevo", "Start again", "Recommencer"),
  previous: T("Anterior", "Previous", "Précédent"),
  next: T("Siguiente", "Next", "Suivant"),
  page: T("Página", "Page", "Page"),
  journey: T("Tu recorrido", "Your choices", "Vos choix"),
  error: T("No hemos podido cargar este paso. Puedes reintentarlo o contactar con el equipo.", "We couldn't load this step. Please retry or contact our team.", "Impossible de charger cette étape. Réessayez ou contactez notre équipe."),
  expired: T("La sesión ha caducado. Identifícate de nuevo para continuar.", "Your session has expired. Enter your details again to continue.", "Votre session a expiré. Renseignez à nouveau vos coordonnées pour continuer."),
  rateLimit: T("Has alcanzado el límite temporal de consultas. Inténtalo más tarde o contacta con el equipo.", "You have reached the temporary enquiry limit. Try again later or contact our team.", "Vous avez atteint la limite temporaire de demandes. Réessayez plus tard ou contactez notre équipe."),
  unavailable: T("El asistente no está disponible en este momento. Puedes contactar directamente con nuestro equipo.", "The assistant is currently unavailable. You can contact our team directly.", "L'assistant est indisponible pour le moment. Vous pouvez contacter notre équipe directement."),
  retry: T("Volver a intentar", "Try again", "Réessayer"),
  privacyNote: T("Guardaremos tus datos de identificación y avisaremos a nuestro equipo. Esto no envía una consulta sobre tu viaje ni te suscribe a la newsletter. Tus selecciones no se guardan en el navegador al salir de esta página.", "We will save your identification details and notify our team. This does not send a trip enquiry or subscribe you to the newsletter. Your choices are not saved in your browser after leaving this page.", "Nous conserverons vos coordonnées d'identification et en informerons notre équipe. Cela n'envoie pas de demande de voyage et ne vous inscrit pas à la newsletter. Vos choix ne sont pas conservés dans votre navigateur après avoir quitté cette page."),
};
const emptyForm = () => ({ first_name: "", last_name: "", email: "", phone: "", privacy_consent: false, preferred_contact: [...DEFAULT_CONTACT_PREFERENCE] });
const inputClass = "mt-2 w-full border border-[#2C2621]/20 bg-white px-3 py-3 text-base text-[#2C2621] outline-none focus:border-[#C16542] disabled:opacity-60";
const ctaClass = "xaluca-button inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 text-sm transition-colors disabled:cursor-wait disabled:opacity-60";

function cleanGuide(data) {
  if (typeof data?.title !== "string" || !data.selection || typeof data.selection !== "object" || !Array.isArray(data.options)) throw new Error("invalid_guide");
  return {
    ...data,
    description: typeof data.description === "string" ? data.description : "",
    options: data.options.filter(option => typeof option?.id === "string" && typeof option.label === "string" && option.selection && typeof option.selection === "object"),
    sources: Array.isArray(data.sources) ? data.sources.filter(source => safeAssistantSourcePath(source?.path) && typeof source.title === "string" && typeof source.excerpt === "string") : [],
  };
}

export default function VirtualAssistantWidget({ open, onOpenChange, triggerRef }) {
  const { lang } = useLanguage();
  const id = useId();
  const text = key => pick(COPY[key], lang);
  const capture = useLeadCapture("assistant", lang);
  const [form, setForm] = useState(emptyForm);
  const [token, setToken] = useState(null);
  const [guide, setGuide] = useState(null);
  const [history, setHistory] = useState([]);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [available, setAvailable] = useState(null);
  const [check, setCheck] = useState(0);
  const [countryPortal, setCountryPortal] = useState(null);
  const pending = useRef(null);
  const closeButton = useRef(null);
  const body = useRef(null);
  const heading = useRef(null);
  const sessionCapture = useRef(null);
  const guideRef = useRef(null);
  const retryStep = useRef(null);

  useEffect(() => {
    if (!open) { pending.current?.abort(); setSending(false); return; }
    const controller = new AbortController();
    setAvailable(null);
    assistantAvailable(controller.signal)
      .then(value => { if (!controller.signal.aborted) setAvailable(value); })
      .catch(() => { if (!controller.signal.aborted) setAvailable(false); });
    return () => { controller.abort(); pending.current?.abort(); };
  }, [open, check]);

  const requestGuide = useCallback(async (selection, mode = "forward", label = "") => {
    if (!token) return;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    retryStep.current = { selection, mode, label };
    setSending(true); setErrors({});
    try {
      const next = cleanGuide(await loadAssistantGuide(token, { ...selection, language: lang }, controller.signal));
      if (controller.signal.aborted) return;
      const previous = guideRef.current;
      if (mode === "reset") setHistory([]);
      else if (mode === "forward" && previous) setHistory(current => [...current, { guide: previous, label }]);
      guideRef.current = next;
      setGuide(next);
      retryStep.current = null;
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error.status === 401) {
        setToken(null); setGuide(null); guideRef.current = null; setHistory([]); retryStep.current = null;
        setErrors({ submit: pick(COPY.expired, lang) });
      } else setErrors({ guide: pick(COPY[error.status === 429 ? "rateLimit" : "error"], lang) });
    } finally { if (!controller.signal.aborted) setSending(false); }
  }, [token, lang]);

  useEffect(() => {
    if (!open || !token || available !== true) return;
    if (!guideRef.current || guideRef.current.selection.language !== lang) {
      guideRef.current = null; setGuide(null); setHistory([]);
      requestGuide({ language: lang }, "reset");
    }
  }, [open, token, available, lang, requestGuide]);

  useEffect(() => {
    if (!guide || !open) return;
    if (body.current) body.current.scrollTop = 0;
    heading.current?.focus({ preventScroll: true });
  }, [guide, open]);

  const update = (key, value) => { setForm(current => ({ ...current, [key]: value })); setErrors({}); };
  const identify = async event => {
    event.preventDefault();
    if (sending) return;
    const invalid = {};
    for (const [key, value] of Object.entries(personalNameFields(form))) if (!value) invalid[key] = pick(DICTATION_COPY.required, lang);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) invalid.email = pick(DICTATION_COPY.emailError, lang);
    if (!isValidInternationalPhone(form.phone)) invalid.phone = pick(DICTATION_COPY.phoneError, lang);
    if (!form.privacy_consent) invalid.privacy_consent = pick(DICTATION_COPY.required, lang);
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    const controller = new AbortController(); pending.current = controller;
    setSending(true);
    try {
      if (!sessionCapture.current) sessionCapture.current = capture();
      const data = await identifyForAssistant({ ...sessionCapture.current, ...form, ...personalNameFields(form), email: form.email.trim(), language: lang }, controller.signal);
      if (controller.signal.aborted) return;
      if (typeof data.token !== "string" || !data.token) throw new Error("missing_session");
      setToken(data.token); setForm(emptyForm()); setErrors({});
    } catch (error) {
      if (!controller.signal.aborted) setErrors({ submit: text(error.status === 429 ? "rateLimit" : "error") });
    } finally { if (!controller.signal.aborted) setSending(false); }
  };

  const back = () => {
    const previous = history[history.length - 1];
    if (!previous || sending) return;
    retryStep.current = null; setErrors({});
    guideRef.current = previous.guide; setGuide(previous.guide);
    setHistory(current => current.slice(0, -1));
  };
  const finish = () => {
    pending.current?.abort(); setSending(false);
    setToken(null); setGuide(null); guideRef.current = null; setHistory([]); retryStep.current = null;
    setForm(emptyForm()); setErrors({});
    sessionCapture.current = { ...capture(), submission_id: newSubmissionId() };
    onOpenChange(false);
  };
  const fieldError = key => errors[key] && <p id={`${id}-${key}-error`} role="alert" className="mt-2 text-sm text-[#A35133]">{errors[key]}</p>;

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogPortal>
      <DialogOverlay className="virtual-assistant-overlay" />
      <DialogContent className="virtual-assistant-dialog ph-no-capture" data-testid="virtual-assistant-widget" aria-modal="true"
        onOpenAutoFocus={event => { event.preventDefault(); closeButton.current?.focus(); }}
        onCloseAutoFocus={event => { event.preventDefault(); triggerRef?.current?.focus({ preventScroll: true }); }}>
        <header className="virtual-assistant-header">
          <Bot className="h-6 w-6 shrink-0 text-[#D4A373]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <DialogTitle className="font-serif-x text-xl sm:text-2xl">{text("title")}</DialogTitle>
            <DialogDescription className="mt-1 text-xs leading-relaxed text-white/70">{text("intro")}</DialogDescription>
          </div>
          <DialogClose asChild><button ref={closeButton} type="button" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10" aria-label={text("close")} data-testid="assistant-close"><X className="h-5 w-5" aria-hidden="true" /></button></DialogClose>
        </header>

        <div ref={body} className="virtual-assistant-body">
          {available === null ? <p role="status" className="flex items-center gap-3 text-sm"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{text("searching")}</p> : !available ? <div className="space-y-5">
            <p role="status" className="text-sm leading-relaxed">{text("unavailable")}</p>
            <button type="button" onClick={() => setCheck(value => value + 1)} className={`${ctaClass} border border-[#2C2621]/20`}>{text("retry")}</button>
          </div> : !token ? <>
            <h2 className="font-serif-x text-2xl sm:text-3xl">{text("identify")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5C5248]">{text("identifyBody")}</p>
            <form onSubmit={identify} noValidate className="mt-6 space-y-5" data-testid="assistant-identity-form">
              <fieldset disabled={sending} className="min-w-0 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><PersonalNameFields value={form} onChange={update} lang={lang} errors={errors} inputClass={inputClass} testIdPrefix="assistant" /></div>
                {["email"].map(key => <div key={key}>
                  <label htmlFor={`${id}-${key}`} className="text-sm">{pick(DICTATION_COPY.email, lang)} *</label>
                  <input id={`${id}-${key}`} name={key} required type="email" autoComplete="email" maxLength={254} className={inputClass} value={form[key]} onChange={event => update(key, event.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${id}-${key}-error` : undefined} data-testid={`assistant-${key}`} />
                  {fieldError(key)}
                </div>)}
                <div><label htmlFor={`${id}-phone`} className="mb-2 block text-sm">{pick(DICTATION_COPY.phone, lang)} *</label><InternationalPhoneInput id={`${id}-phone`} value={form.phone} onValueChange={value => update("phone", value)} lang={lang} required countryPortalContainer={countryPortal} invalid={Boolean(errors.phone)} testId="assistant-phone" />{fieldError("phone")}</div>
                <ContactPreference lang={lang} value={form.preferred_contact} onChange={value => update("preferred_contact", value)} testidPrefix="assistant-pref" />
                <div className="border-t border-[#2C2621]/15 pt-5 text-xs leading-relaxed text-[#5C5248]">
                  <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" aria-hidden="true" />{pick(DICTATION_COPY.privacy, lang)}</p>
                  <p className="mt-2">{text("privacyNote")}</p>
                  <p className="mt-2">{pick(DICTATION_COPY.privacyBody, lang)} <a className="break-all text-[#A35133] underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
                  <label className="mt-4 flex items-start gap-3"><input type="checkbox" required name="privacy_consent" className="mt-0.5 h-4 w-4 shrink-0 accent-[#C16542]" checked={form.privacy_consent} onChange={event => update("privacy_consent", event.target.checked)} data-testid="assistant-consent" /><span>{pick(DICTATION_COPY.consent, lang)} *</span></label>
                  {fieldError("privacy_consent")}
                </div>
              </fieldset>
              {fieldError("submit")}
              <button disabled={sending} type="submit" className={`${ctaClass} w-full bg-[#C16542] text-white hover:bg-[#A35133]`} data-testid="assistant-identify">{text(sending ? "saving" : "begin")}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            </form>
          </> : <div data-testid="assistant-guided-flow" aria-busy={sending}>
            {history.some(item => item.label) && <nav aria-label={text("journey")} className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-relaxed text-[#5C5248]">
              {history.filter(item => item.label).map((item, index) => <React.Fragment key={index}>{index > 0 && <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />}<span>{item.label}</span></React.Fragment>)}
            </nav>}
            {guide && <>
              <h2 ref={heading} tabIndex={-1} className="font-serif-x text-2xl leading-tight sm:text-3xl" data-testid="assistant-step-title">{guide.title}</h2>
              {guide.description && <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#5C5248]">{guide.description}</p>}
              {guide.sources.length > 0 && <div className="mt-6 space-y-4" data-testid="assistant-sources">{guide.sources.map((source, index) => <article key={`${source.id || source.path}-${index}`} className="virtual-assistant-answer">
                <h3 className="text-sm font-semibold leading-relaxed">{source.title}</h3>
                <blockquote className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#5C5248]">{source.excerpt}</blockquote>
                <Link className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#A35133] underline underline-offset-4" to={source.path} onClick={() => onOpenChange(false)}><BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{text("source")}</Link>
              </article>)}</div>}
              {guide.options.length > 0 && <div className="virtual-assistant-options">{guide.options.map(option => <button key={option.id} type="button" disabled={sending} onClick={() => requestGuide(option.selection, "forward", option.label)} className="virtual-assistant-option" data-testid={`assistant-option-${option.id}`}>
                <span>{option.label}</span><ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>)}</div>}
              {guide.pagination?.pages > 1 && <nav aria-label={`${text("page")} ${guide.pagination.page}`} className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs">
                <button type="button" disabled={sending || !guide.pagination.previous} onClick={() => requestGuide(guide.pagination.previous, "page")} className={`${ctaClass} border border-[#2C2621]/20`} data-testid="assistant-page-previous">{text("previous")}</button>
                <span>{text("page")} {guide.pagination.page} / {guide.pagination.pages}</span>
                <button type="button" disabled={sending || !guide.pagination.next} onClick={() => requestGuide(guide.pagination.next, "page")} className={`${ctaClass} border border-[#2C2621]/20`} data-testid="assistant-page-next">{text("next")}</button>
              </nav>}
            </>}
            {sending && <p role="status" className="mt-5 flex items-center gap-2 text-sm text-[#5C5248]"><Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />{text("searching")}</p>}
            {fieldError("guide")}
            {errors.guide && <button type="button" className={`${ctaClass} mt-4 border border-[#2C2621]/20`} onClick={() => { const step = retryStep.current; if (step) requestGuide(step.selection, step.mode, step.label); }} data-testid="assistant-guide-retry">{text("retry")}</button>}
          </div>}
        </div>

        <footer className="virtual-assistant-footer">
          <Link to={pathFor(lang, "contact")} onClick={() => onOpenChange(false)} className={`${ctaClass} w-full border border-[#C16542] text-[#A35133] hover:bg-[#C16542]/10`} data-testid="assistant-contact-team"><ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />{text("contact")}</Link>
          {token && <div className="virtual-assistant-navigation">
            <button type="button" disabled={sending || !history.length} onClick={back} data-testid="assistant-back"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />{text("back")}</button>
            <button type="button" disabled={sending} onClick={() => requestGuide({ language: lang }, "reset")} data-testid="assistant-restart"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />{text("restart")}</button>
            <button type="button" onClick={finish} data-testid="assistant-finish">{text("finish")}</button>
          </div>}
        </footer>
        <div ref={setCountryPortal} data-testid="assistant-country-layer" />
      </DialogContent>
    </DialogPortal>
  </Dialog>;
}
