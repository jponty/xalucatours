import React, { useState } from "react";
import axios from "axios";
import { Gift, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { useLeadCapture } from "@/lib/leadCapture";
import { contactSubmissionFields, DEFAULT_CONTACT_PREFERENCE } from "@/lib/contactSubmission";
import { ContactPreference } from "@/components/FormExtras";
import InternationalPhoneInput, { isValidInternationalPhone } from "@/components/InternationalPhoneInput";
import { errorToastMessage } from "@/components/GenericErrorMessage";
import { pathFor } from "@/lib/routes";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  eyebrow: T("La lámpara mágica de Xaluca", "The Xaluca magic lamp", "La lampe magique de Xaluca"),
  title: T("Un regalo te espera en Marruecos", "A gift awaits you in Morocco", "Un cadeau vous attend au Maroc"),
  body: T("Déjanos tus datos y descubre el detalle de bienvenida que hemos preparado para cuando vengas a visitarnos a Marruecos.", "Leave your details and discover the welcome gift we have prepared for your visit to Morocco.", "Laissez-nous vos coordonnées et découvrez le cadeau de bienvenue préparé pour votre visite au Maroc."),
  steps: [T("Deja tus datos", "Leave your details", "Laissez vos coordonnées"), T("Descubre tu regalo", "Discover your gift", "Découvrez votre cadeau"), T("Disfrútalo en Marruecos", "Enjoy it in Morocco", "Profitez-en au Maroc")],
  first: T("Nombre", "First name", "Prénom"), last: T("Apellido(s)", "Last name", "Nom"),
  phone: T("Teléfono", "Phone", "Téléphone"), email: T("Correo electrónico", "Email", "E-mail"),
  consent: T("He leído la información de privacidad y acepto el tratamiento de mis datos para gestionar esta solicitud.", "I have read the privacy information and agree to the use of my data to handle this request.", "J'ai lu les informations de confidentialité et j'accepte le traitement de mes données pour gérer cette demande."),
  submit: T("Descubrir mi regalo", "Discover my gift", "Découvrir mon cadeau"),
  reveal: T("¡Tu regalo es un té a la menta!", "Your gift is a mint tea!", "Votre cadeau est un thé à la menthe !"),
  success: T("Hemos recibido tus datos. Te enviaremos una confirmación por email; nuestro equipo te indicará cómo disfrutar del té durante tu visita a Marruecos.", "We have received your details. We will email you a confirmation; our team will explain how to enjoy your tea during your visit to Morocco.", "Nous avons reçu vos coordonnées. Nous vous enverrons une confirmation par e-mail ; notre équipe vous indiquera comment savourer votre thé lors de votre visite au Maroc."),
  note: T("Un detalle de bienvenida para tu próxima visita a Marruecos.", "A welcome gift for your next visit to Morocco.", "Un cadeau de bienvenue pour votre prochaine visite au Maroc."),
};

export default function RuletaPromo() {
  const { lang } = useLanguage();
  const leadCapture = useLeadCapture("magic_lamp");
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", preferred_contact: DEFAULT_CONTACT_PREFERENCE });
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const set = key => event => setForm(current => ({ ...current, [key]: event.target.value }));

  const submit = async event => {
    event.preventDefault();
    if (sending || sent) return;
    if (!isValidInternationalPhone(form.phone) || !consent) {
      toast.error(lang === "es" ? "Revisa el teléfono y acepta la política de privacidad." : "Check your phone and accept the privacy policy.");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/contact-requests`, {
        ...leadCapture(), first_name: form.first_name.trim(), last_name: form.last_name.trim(),
        ...contactSubmissionFields(form), privacy_consent: true,
        message: "Solicitud de regalo garantizado: té a la menta durante su visita a Marruecos.",
        source_label: "Home · Lámpara mágica · Té a la menta", language: lang,
      });
      setSent(true);
    } catch (error) {
      toast.error(errorToastMessage(error?.response?.data?.detail, lang));
    } finally { setSending(false); }
  };

  return (
    <section data-testid="home-magic-lamp" className="relative overflow-hidden bg-[#1A1513] text-[#FDFBF7]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,rgba(224,168,92,0.20),transparent_55%),radial-gradient(circle_at_10%_15%,rgba(193,101,66,0.22),transparent_50%)]" aria-hidden="true" />
      <div className="absolute inset-0 berber-bg-diamond opacity-[0.07] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <svg viewBox="0 0 240 128" className="w-48 h-28 mx-auto lg:mx-0 mb-3 text-[#E0A85C]" role="img" aria-label={lang === "es" ? "Lámpara mágica" : lang === "fr" ? "Lampe magique" : "Magic lamp"}>
            <path d="M53 83c18 3 30 9 69 9 38 0 60-10 68-23-16 4-35 3-46-2-13-6-26-7-41-4-20 4-42 5-67-7 4 12 12 21 17 27Z" fill="currentColor" opacity=".8" />
            <path d="M53 83c18 3 30 9 69 9 38 0 60-10 68-23-16 4-35 3-46-2-13-6-26-7-41-4-20 4-42 5-67-7 4 12 12 21 17 27Zm137-14c17-7 31-21 37-36-23 6-34 8-48 4M76 93c14 10 65 13 93 0M89 103h63M63 60c-9-12-1-29 13-30 11-1 18 8 16 19M93 62c-3-6-5-14-1-19 8-9 21-7 26 2" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M127 34c-2-7 6-12 9-18 2 7 10 11 7 18M151 26l2-8m7 14 8-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="overline inline-flex items-center gap-2 text-[#E0A85C]"><Sparkles className="w-4 h-4" />{pick(COPY.eyebrow, lang)}</span>
          <h2 className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-[1.06] tracking-tight mt-4">{sent ? pick(COPY.reveal, lang) : pick(COPY.title, lang)}</h2>
          <p className="text-base text-[#FDFBF7]/80 leading-relaxed mt-5 max-w-xl mx-auto lg:mx-0">{pick(COPY.body, lang)}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-7 gap-y-3">{COPY.steps.map((step, i) => <span key={i} className="inline-flex items-center gap-2 text-sm text-[#FDFBF7]/85"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C16542] text-xs font-semibold">{i + 1}</span>{pick(step, lang)}</span>)}</div>
          <p className="mt-7 text-sm text-[#E0A85C]">{pick(COPY.note, lang)}</p>
        </div>
        <div className="bg-[#FDFBF7] text-[#2C2621] p-7 md:p-9 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3 mb-6"><Gift className="w-8 h-8 text-[#C16542]" /><h3 className="font-serif-x text-2xl">{pick(COPY.eyebrow, lang)}</h3></div>
          {sent ? <div role="status" aria-live="polite" data-testid="magic-lamp-reveal" className="text-center py-8"><Sparkles className="w-12 h-12 text-[#B8862F] mx-auto mb-4" /><p className="font-serif-x text-3xl mb-4">{pick(COPY.reveal, lang)}</p><p className="text-base leading-relaxed">{pick(COPY.success, lang)}</p></div> : <form onSubmit={submit} className="space-y-4" data-testid="magic-lamp-form">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-xs font-semibold">{pick(COPY.first, lang)}<input required maxLength={120} value={form.first_name} onChange={set("first_name")} className="mt-2 w-full border border-[#2C2621]/20 p-3" /></label>
              <label className="block text-xs font-semibold">{pick(COPY.last, lang)}<input required maxLength={150} value={form.last_name} onChange={set("last_name")} className="mt-2 w-full border border-[#2C2621]/20 p-3" /></label>
            </div>
            <label className="block text-xs font-semibold">{pick(COPY.email, lang)}<input required type="email" value={form.email} onChange={set("email")} className="mt-2 w-full border border-[#2C2621]/20 p-3" /></label>
            <div><label className="block text-xs font-semibold mb-2">{pick(COPY.phone, lang)}</label><InternationalPhoneInput required value={form.phone} onValueChange={phone => setForm(current => ({ ...current, phone }))} lang={lang} /></div>
            <ContactPreference lang={lang} value={form.preferred_contact} onChange={preferred_contact => setForm(current => ({ ...current, preferred_contact }))} testidPrefix="magic-lamp-pref" />
            <label className="flex items-start gap-3 text-xs leading-relaxed"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5 accent-[#C16542]" /><span>{pick(COPY.consent, lang)} <a href={pathFor(lang, "privacy")} target="_blank" rel="noopener noreferrer" className="underline">{pick(T("Ver información de privacidad", "View privacy information", "Voir les informations de confidentialité"), lang)}</a></span></label>
            <button type="submit" disabled={sending} className="xaluca-button w-full inline-flex items-center justify-center gap-2 bg-[#C16542] hover:bg-[#A85231] text-white px-6 py-4 text-xs tracking-[0.18em] uppercase font-semibold disabled:opacity-60"><Send className="w-4 h-4" />{sending ? "Enviando…" : pick(COPY.submit, lang)}</button>
          </form>}
        </div>
      </div>
    </section>
  );
}
