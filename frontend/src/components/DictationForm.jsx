import React, { useId, useRef, useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, Mic, Check } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { CONTACT } from "@/lib/data";
import { useLeadCapture } from "@/lib/leadCapture";
import { getTripParam, resolveTripContext } from "@/lib/tripContext";
import VoiceTextField, { VoiceDictationProvider } from "@/components/VoiceTextField";
import InternationalPhoneInput, { isValidInternationalPhone } from "@/components/InternationalPhoneInput";
import { ContactPreference, WhatHappensNext } from "@/components/FormExtras";
import LeadSubmissionSuccess from "@/components/LeadSubmissionSuccess";

const T = (es, en, fr) => ({ es, en, fr });
export const DICTATION_COPY = {
  title: T("Tu viaje, con tus palabras.", "Your trip, in your own words.", "Votre voyage, avec vos mots."),
  intro: T("Explícanos cómo imaginas Marruecos. Primero tu idea; después, cómo podemos responderte.", "Tell us how you picture Morocco. First your ideas, then how we can reach you.", "Racontez-nous votre Maroc. D’abord vos idées, puis comment vous répondre."),
  story: T("Cuéntanos tu viaje soñado", "Tell us about your dream trip", "Racontez-nous votre voyage idéal"),
  contact: T("Tus datos de contacto", "Your contact details", "Vos coordonnées"),
  prompts: T("Cuéntanos todo lo que tengas en mente. Puedes incluir:", "Tell us everything you have in mind. You can include:", "Racontez-nous tout ce que vous imaginez. Vous pouvez préciser :"),
  natural: T("No necesitas seguir ningún orden concreto ni responder a todo. Habla con naturalidad. También puedes escribir. Antes de continuar, revisa y edita el texto a tu gusto.", "There is no set order and you do not need to cover everything. Speak naturally, or type instead. Review and edit the text before continuing.", "Aucun ordre imposé et aucune obligation de tout préciser. Parlez naturellement ou écrivez. Relisez et modifiez le texte avant de continuer."),
  next: T("Continuar con mis datos", "Continue to my details", "Continuer vers mes coordonnées"),
  back: T("Volver a mi viaje", "Back to my trip", "Revenir à mon voyage"),
  submit: T("Enviar consulta", "Send enquiry", "Envoyer ma demande"),
  sending: T("Enviando…", "Sending…", "Envoi…"),
  name: T("Nombre completo", "Full name", "Nom complet"),
  email: T("Correo electrónico", "Email address", "Adresse e-mail"),
  phone: T("Teléfono (opcional)", "Phone (optional)", "Téléphone (facultatif)"),
  required: T("Completa los campos obligatorios marcados con *.", "Complete the required fields marked *.", "Complétez les champs obligatoires marqués *."),
  invalid: T("Revisa los datos indicados antes de continuar.", "Please check the highlighted details before continuing.", "Vérifiez les informations indiquées avant de continuer."),
  messageError: T("Cuéntanos un poco más sobre tu viaje (entre 4 y 4000 caracteres).", "Tell us a little more about your trip (4–4000 characters).", "Précisez votre voyage (4 à 4000 caractères)."),
  contactError: T("Elige al menos una forma de contacto.", "Choose at least one contact method.", "Choisissez au moins un moyen de contact."),
  emailError: T("Introduce un correo electrónico válido.", "Enter a valid email address.", "Saisissez une adresse e-mail valide."),
  phoneError: T("Introduce un teléfono válido con prefijo internacional.", "Enter a valid phone number with country code.", "Saisissez un téléphone valide avec indicatif international."),
  privacy: T("Información de privacidad", "Privacy information", "Informations de confidentialité"),
  privacyBody: T("Xaluca Tours / Grup Xaluca tratará tus datos para gestionar esta consulta y ponerse en contacto contigo. Esta solicitud no te suscribe a la newsletter. Puedes consultar sobre el tratamiento de tus datos o ejercer tus derechos escribiendo a", "Xaluca Tours / Grup Xaluca will use your details to handle this enquiry and contact you. This request does not subscribe you to the newsletter. For data processing questions or to exercise your rights, contact", "Xaluca Tours / Grup Xaluca utilisera vos données pour traiter cette demande et vous contacter. Cette demande ne vous inscrit pas à la newsletter. Pour toute question sur vos données ou pour exercer vos droits, écrivez à"),
  consent: T("He leído la información de privacidad y acepto el tratamiento de mis datos para atender esta consulta.", "I have read the privacy information and agree to my data being processed to handle this enquiry.", "J’ai lu les informations de confidentialité et j’accepte le traitement de mes données pour cette demande."),
  error: T("No hemos podido enviar tu consulta. Tu texto sigue guardado en este formulario; inténtalo de nuevo.", "We could not send your enquiry. Your text is still in this form; please try again.", "Impossible d’envoyer votre demande. Votre texte est conservé dans ce formulaire ; réessayez."),
};
const PROMPTS = [
  T("Fechas aproximadas o exactas de inicio y fin del viaje.", "Approximate or exact start and end dates.", "Dates approximatives ou exactes de début et de fin."),
  T("Número de viajeros y, si corresponde, edades de los niños.", "Number of travellers and children’s ages, if applicable.", "Nombre de voyageurs et, le cas échéant, âge des enfants."),
  T("Desde dónde viajaréis o punto de llegada a Marruecos.", "Where you will travel from or where you will arrive in Morocco.", "Votre lieu de départ ou d’arrivée au Maroc."),
  T("Número aproximado de días.", "Approximate number of days.", "Nombre approximatif de jours."),
  T("Ciudades, regiones o lugares que os gustaría visitar.", "Cities, regions or places you would like to visit.", "Villes, régions ou lieux que vous souhaitez visiter."),
  T("Estilo de viaje: aventura, cultura, desierto, relax, lujo, familia, pareja, luna de miel…", "Travel style: adventure, culture, desert, relaxation, luxury, family, couples, honeymoon…", "Style de voyage : aventure, culture, désert, détente, luxe, famille, couple, lune de miel…"),
  T("Tipo de alojamiento que preferís.", "Your preferred accommodation.", "Le type d’hébergement que vous préférez."),
  T("Experiencias o actividades que os gustaría realizar.", "Experiences or activities you would enjoy.", "Les expériences ou activités qui vous intéressent."),
  T("Presupuesto aproximado, si ya lo tenéis definido.", "An approximate budget, if you have one.", "Votre budget approximatif, si vous le connaissez."),
  T("Cualquier necesidad especial, duda, preferencia o detalle importante.", "Any special needs, questions, preferences or important details.", "Tout besoin particulier, question, préférence ou détail important."),
];
const EMPTY = { message: "", full_name: "", email: "", phone: "", preferred_contact: [], preferred_contact_email: "", preferred_contact_phone: "", privacy_consent: false };
const inputClass = "mt-2 w-full min-w-0 rounded-sm border border-[#2C2621]/25 bg-white p-3.5 text-base text-[#2C2621] outline-none focus:border-[#C16542] focus:ring-1 focus:ring-[#C16542]";
const buttonClass = "inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 py-4 text-xs tracking-[0.12em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto";
const emailValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function DictationForm({ className = "", countryPortalContainer, onNavigate }) {
  const { lang } = useLanguage();
  const text = key => pick(DICTATION_COPY[key], lang);
  const id = useId();
  const heading = useRef(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const capture = useLeadCapture("dictation", lang);
  const update = (key, value) => { setForm(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: "", submit: "" })); };
  const move = next => {
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  };
  const submit = async event => {
    event.preventDefault();
    if (busy || sending) return;
    if (form.message.trim().length < 4 || form.message.length > 4000) {
      setErrors({ message: text("messageError") }); move(1); return;
    }
    if (step === 1) { move(2); return; }
    const invalid = {};
    if (form.full_name.trim().length < 2) invalid.full_name = text("required");
    if (!emailValid(form.email)) invalid.email = text("emailError");
    if (form.phone && !isValidInternationalPhone(form.phone)) invalid.phone = text("phoneError");
    if (!form.preferred_contact.length) invalid.preference = text("contactError");
    if (form.preferred_contact.includes("email") && !emailValid(form.preferred_contact_email)) invalid.preferred_contact_email = text("emailError");
    if (form.preferred_contact.includes("phone") && !isValidInternationalPhone(form.preferred_contact_phone)) invalid.preferred_contact_phone = text("phoneError");
    if (!form.privacy_consent) invalid.privacy_consent = text("required");
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    setSending(true);
    try {
      const trip = resolveTripContext(getTripParam(), lang);
      await axios.post(`${(process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "")}/api/contact-requests`, {
        ...capture(), ...form, full_name: form.full_name.trim(), email: form.email.trim(), message: form.message.trim(), language: lang,
        related_trip_id: trip?.routeId || null, related_trip_title: trip?.title || null,
      });
      setDone(true);
    } catch { setErrors({ submit: text("error") }); }
    finally { setSending(false); }
  };
  const error = key => errors[key] && <p id={`${id}-${key}-error`} role="alert" className="mt-2 text-sm text-[#A35133]">{errors[key]}</p>;

  return <section className={`mx-auto max-w-5xl px-4 sm:px-6 md:px-12 ${className}`} data-testid="dictation-form-section">
    {done ? <div className="border border-[#C16542]/25 bg-white p-6 sm:p-12" role="status"><LeadSubmissionSuccess onNavigate={onNavigate} /></div> : <>
      <div className="mb-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#C16542]/10 text-[#C16542]"><Mic aria-hidden="true" className="h-5 w-5" /></span>
        <h2 className="mt-4 font-serif-x text-3xl sm:text-4xl text-[#2C2621]">{text("title")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#5C5248]">{text("intro")}</p>
      </div>
      <ol className="mb-6 grid grid-cols-2 border border-[#2C2621]/15 text-[#5C5248]" aria-label={text("title")}>
        {["story", "contact"].map((key, index) => <li key={key} aria-current={step === index + 1 ? "step" : undefined} className={`flex min-w-0 items-center gap-2 p-3 text-xs sm:gap-3 sm:p-5 sm:text-sm ${step === index + 1 ? "bg-[#2C2621] text-[#FDFBF7]" : "bg-white"}`}>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current/30">{step > index + 1 ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}</span><span>{text(key)}</span>
        </li>)}
      </ol>
      <VoiceDictationProvider onBusyChange={setBusy}>
        <form onSubmit={submit} data-testid="dictation-form" className="border border-[#2C2621]/15 bg-[#FFFDF8] p-4 sm:p-7 md:p-10">
          <h3 ref={heading} tabIndex={-1} className="mb-6 scroll-mt-32 font-serif-x text-2xl text-[#2C2621] outline-none sm:text-3xl">{step} — {text(step === 1 ? "story" : "contact")}</h3>
          <div hidden={step !== 1}>
            <div className="mb-6 border-l-2 border-[#C16542] bg-[#FBF5EA] p-4 sm:p-5">
              <p className="font-medium text-[#2C2621]">{text("prompts")}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#5C5248]">{PROMPTS.map((prompt, index) => <li key={index}>{pick(prompt, lang)}</li>)}</ul>
              <p className="mt-4 text-sm leading-relaxed text-[#5C5248]">{text("natural")}</p>
            </div>
            <label htmlFor={`${id}-message`} className="text-sm font-medium text-[#2C2621]">{text("story")} *</label>
            <VoiceTextField live as="textarea" id={`${id}-message`} name="message" aria-label={text("story")} required minLength={4} maxLength={4000} rows={9}
              value={form.message} onValueChange={value => update("message", value)} lang={lang} disabled={sending}
              aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? `${id}-message-error` : undefined}
              className={`${inputClass} resize-y`} data-testid="dictation-message" />
            {error("message")}
            <p className="mt-2 text-right text-xs text-[#5C5248]">{form.message.length} / 4000</p>
            <button type="submit" disabled={busy || sending} className={`${buttonClass} mt-6 bg-[#C16542] text-white hover:bg-[#A35133]`} data-testid="dictation-next">{text("next")}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></button>
          </div>
          {step === 2 && <fieldset disabled={sending} className="min-w-0 space-y-7">
            <legend className="sr-only">{text("contact")}</legend>
            <p className="text-xs text-[#5C5248]">{text("required")}</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {["full_name", "email"].map(key => <div key={key}>
                <label htmlFor={`${id}-${key}`} className="text-sm text-[#2C2621]">{text(key === "full_name" ? "name" : key)} *</label>
                <input id={`${id}-${key}`} name={key} value={form[key]} onChange={event => update(key, event.target.value)} required minLength={key === "full_name" ? 2 : undefined} maxLength={key === "full_name" ? 120 : 254} autoComplete={key === "full_name" ? "name" : "email"} type={key === "email" ? "email" : "text"}
                  aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${id}-${key}-error` : undefined} className={inputClass} data-testid={`dictation-${key}`} />{error(key)}
              </div>)}
              <div className="sm:col-span-2">
                <label htmlFor={`${id}-phone`} className="mb-2 block text-sm text-[#2C2621]">{text("phone")}</label>
                <InternationalPhoneInput countryPortalContainer={countryPortalContainer} id={`${id}-phone`} name="phone" value={form.phone} onValueChange={value => update("phone", value)} lang={lang} invalid={Boolean(errors.phone)} testId="dictation-phone" />{error("phone")}
              </div>
            </div>
            <ContactPreference countryPortalContainer={countryPortalContainer} lang={lang} value={form.preferred_contact} onToggle={key => {
              const removing = form.preferred_contact.includes(key);
              update("preferred_contact", removing ? form.preferred_contact.filter(value => value !== key) : [...form.preferred_contact, key]);
              if (removing) update(`preferred_contact_${key}`, "");
              setErrors(current => ({ ...current, preference: "" }));
            }} error={errors.preference} details={{ email: form.preferred_contact_email, phone: form.preferred_contact_phone }} onDetailChange={(key, value) => update(`preferred_contact_${key}`, value)}
              detailErrors={{ email: errors.preferred_contact_email, phone: errors.preferred_contact_phone }} testidPrefix="dictation-pref" />
            <div className="border-t border-[#2C2621]/15 pt-6 text-sm leading-relaxed text-[#5C5248]">
              <h4 className="font-medium text-[#2C2621]">{text("privacy")}</h4>
              <p className="mt-2 text-xs">{text("privacyBody")} <a href={`mailto:${CONTACT.email}`} className="break-all text-[#A35133] underline">{CONTACT.email}</a>.</p>
              <label className="mt-4 flex items-start gap-3"><input type="checkbox" name="privacy_consent" required checked={form.privacy_consent} onChange={event => update("privacy_consent", event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#C16542]" data-testid="dictation-consent" /><span>{text("consent")} *</span></label>
              {error("privacy_consent")}
            </div>
            <WhatHappensNext lang={lang} testid="dictation-what-next" />
            {error("submit")}
            {Object.keys(errors).some(key => key !== "submit" && errors[key]) && <p role="alert" className="text-sm text-[#A35133]">{text("invalid")}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => move(1)} className={`${buttonClass} border border-[#2C2621]/25 text-[#5C5248] hover:bg-[#FBF5EA]`} data-testid="dictation-back"><ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />{text("back")}</button>
              <button type="submit" disabled={busy || sending} className={`${buttonClass} bg-[#C16542] text-white hover:bg-[#A35133]`} data-testid="dictation-submit">{text(sending ? "sending" : "submit")}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></button>
            </div>
          </fieldset>}
        </form>
      </VoiceDictationProvider>
    </>}
  </section>;
}
