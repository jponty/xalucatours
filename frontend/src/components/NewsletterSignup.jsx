import React, { useState } from "react";
import axios from "axios";
import { ArrowRight, Check, Mail, Sparkles } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { CONTACT } from "@/lib/data";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";
import xMonogramBorde from "@/assets/monograma-x-borde.png";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COPY = {
  eyebrow: {
    es: "Newsletter Xaluca Tours",
    en: "Xaluca Tours Newsletter",
    fr: "Newsletter Xaluca Tours",
  },
  title: {
    es: "Inspírate para tu próximo viaje a Marruecos.",
    en: "Find inspiration for your next journey to Morocco.",
    fr: "Inspirez-vous pour votre prochain voyage au Maroc.",
  },
  description: {
    es: "Suscríbete a nuestra newsletter y recibe nuevos viajes, rutas, experiencias, recomendaciones y consejos para descubrir Marruecos y preparar tu próxima aventura.",
    en: "Subscribe to our newsletter for new journeys, routes, experiences, recommendations and advice to help you discover Morocco and prepare your next adventure.",
    fr: "Inscrivez-vous à notre newsletter pour recevoir de nouveaux voyages, itinéraires, expériences, recommandations et conseils afin de découvrir le Maroc et préparer votre prochaine aventure.",
  },
  descriptionSecondary: {
    es: "Compartimos solo información que creemos que merece la pena: nuevos destinos, propuestas de viaje, lugares especiales y novedades de Xaluca Tours.",
    en: "We only share information we believe is worthwhile: new destinations, travel ideas, special places and the latest from Xaluca Tours.",
    fr: "Nous partageons uniquement des informations qui en valent la peine : nouvelles destinations, idées de voyage, lieux d’exception et actualités de Xaluca Tours.",
  },
  cadence: {
    es: "Sin spam ni correos constantes. Solo buenas ideas para viajar por Marruecos.",
    en: "No spam or constant emails. Just good ideas for travelling through Morocco.",
    fr: "Pas de spam ni d’e-mails incessants. Seulement de bonnes idées pour voyager au Maroc.",
  },
  emailLabel: { es: "Tu email", en: "Your email", fr: "Votre e-mail" },
  emailPlaceholder: { es: "tu@email.com", en: "you@email.com", fr: "vous@email.com" },
  consentPre: {
    es: "Quiero recibir novedades y contenido de Xaluca Tours y acepto el tratamiento de mis datos según la ",
    en: "I want to receive news and content from Xaluca Tours and consent to my data being processed under the ",
    fr: "Je souhaite recevoir les actualités et contenus de Xaluca Tours et j’accepte le traitement de mes données conformément à la ",
  },
  privacyLabel: { es: "información de privacidad", en: "privacy information", fr: "notice de confidentialité" },
  submit: { es: "Suscribirme a la newsletter", en: "Subscribe to the newsletter", fr: "M’inscrire à la newsletter" },
  sending: { es: "Guardando tu suscripción…", en: "Saving your subscription…", fr: "Enregistrement de votre inscription…" },
  successEyebrow: { es: "Suscripción confirmada", en: "Subscription confirmed", fr: "Inscription confirmée" },
  successTitle: {
    es: "Ya formas parte del viaje.",
    en: "You are now part of the journey.",
    fr: "Vous faites désormais partie du voyage.",
  },
  successBody: {
    es: "Te avisaremos cuando tengamos nuevas rutas, experiencias o historias de Marruecos que realmente merezca la pena compartir.",
    en: "We will let you know when we have new routes, experiences or Moroccan stories that are genuinely worth sharing.",
    fr: "Nous vous écrirons lorsque de nouveaux itinéraires, expériences ou récits du Maroc mériteront vraiment d’être partagés.",
  },
  another: { es: "Suscribir otro email", en: "Subscribe another email", fr: "Inscrire une autre adresse" },
  invalidEmail: { es: "Introduce un correo electrónico válido.", en: "Enter a valid email address.", fr: "Saisissez une adresse e-mail valide." },
  consentError: { es: "Debes aceptar el consentimiento para suscribirte.", en: "You must accept the consent to subscribe.", fr: "Vous devez accepter le consentement pour vous inscrire." },
  genericError: {
    es: "No hemos podido confirmar la suscripción. Inténtalo de nuevo en unos instantes.",
    en: "We could not confirm your subscription. Please try again shortly.",
    fr: "Nous n’avons pas pu confirmer votre inscription. Réessayez dans quelques instants.",
  },
  privacySummary: { es: "Cómo trataremos tus datos", en: "How we will use your data", fr: "Comment nous traiterons vos données" },
  privacyBody: {
    es: "Responsable: Xaluca Tours / Grup Xaluca. Usaremos tu email únicamente para enviarte novedades, propuestas y contenido sobre viajes a Marruecos, basándonos en tu consentimiento. Resend actúa como proveedor tecnológico de la lista y los envíos. Puedes retirar tu consentimiento en cualquier momento desde el enlace de baja incluido en cada correo o escribiendo a",
    en: "Controller: Xaluca Tours / Grup Xaluca. We will only use your email to send news, travel ideas and content about Morocco, based on your consent. Resend acts as the technology provider for the contact list and mailings. You can withdraw consent at any time via the unsubscribe link in every email or by writing to",
    fr: "Responsable : Xaluca Tours / Grup Xaluca. Nous utiliserons votre e-mail uniquement pour vous envoyer des nouveautés, des propositions et des contenus sur les voyages au Maroc, sur la base de votre consentement. Resend est notre prestataire technique pour la liste et les envois. Vous pouvez retirer votre consentement à tout moment via le lien de désinscription de chaque e-mail ou en écrivant à",
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const t = (key) => pick(COPY[key], lang);

  const submit = async (event) => {
    event.preventDefault();
    if (sending) return;
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalizedEmail)) {
      setError(t("invalidEmail"));
      return;
    }
    if (!consent) {
      setError(t("consentError"));
      return;
    }

    setError("");
    setSending(true);
    try {
      await axios.post(`${API}/newsletter/subscriptions`, {
        email: normalizedEmail,
        consent: true,
        language: lang,
        source_path: typeof window !== "undefined" ? window.location.pathname : "/",
        website,
      });
      setDone(true);
      setEmail("");
      setConsent(false);
      setWebsite("");
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || t("genericError"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="newsletter"
      data-testid="home-newsletter"
      aria-labelledby="home-newsletter-title"
      className="relative overflow-hidden bg-[#E9D9C6] py-20 text-[#2C2621] md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 berber-bg-diamond opacity-30" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-[#C16542]/12 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="relative grid overflow-hidden border border-[#2C2621]/15 bg-[#201915] shadow-[0_35px_90px_-45px_rgba(26,21,19,0.65)] lg:grid-cols-[1.05fr_0.95fr]">
          <img
            src={xMonogramBorde}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 bottom-[-16%] h-[116%] w-auto max-w-none select-none object-contain opacity-[0.13]"
          />

          <div className="relative flex flex-col justify-between px-7 py-10 text-[#FDFBF7] sm:px-10 sm:py-12 lg:min-h-[540px] lg:px-14 lg:py-14">
            <div>
              <div className="flex items-center gap-3 text-[#E2AE86]">
                <Sparkles className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">{t("eyebrow")}</span>
              </div>
              <h2 id="home-newsletter-title" className="mt-6 max-w-2xl font-serif-x text-[clamp(2.7rem,5vw,5rem)] leading-[0.98] tracking-[-0.035em]">
                {t("title")}
              </h2>
              <p className="mt-7 max-w-xl text-[15px] leading-[1.8] text-[#FDFBF7]/70 sm:text-base">
                {t("description")}
              </p>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-[#FDFBF7]/70 sm:text-base">
                {t("descriptionSecondary")}
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4 border-t border-white/12 pt-7">
              <img src={grupXalucaLogo} alt="Grup Xaluca" className="h-14 w-14 shrink-0 object-contain" />
              <p className="max-w-md text-xs leading-relaxed text-[#FDFBF7]/58">{t("cadence")}</p>
            </div>
          </div>

          <div className="relative border-t border-white/10 bg-[#FDFBF7] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
            {done ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center" role="status" aria-live="polite" data-testid="newsletter-success">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C16542]/35 bg-[#F2EBE1] text-[#C16542]">
                  <Check className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A95739]">{t("successEyebrow")}</p>
                <h3 className="mt-4 font-serif-x text-4xl leading-none text-[#2C2621] sm:text-5xl">{t("successTitle")}</h3>
                <p className="mt-5 max-w-md text-sm leading-[1.75] text-[#5C5248]">{t("successBody")}</p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="mt-8 border-b border-[#C16542]/50 pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A95739] transition-colors hover:border-[#2C2621] hover:text-[#2C2621]"
                >
                  {t("another")}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate data-testid="newsletter-form" className="flex h-full flex-col justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2EBE1] text-[#C16542]">
                  <Mail className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </div>

                <label htmlFor="newsletter-email" className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5C5248]">
                  {t("emailLabel")} <span className="text-[#C16542]">*</span>
                </label>
                <div className="mt-3 flex flex-col gap-3">
                  <input
                    id="newsletter-email"
                    data-testid="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(error)}
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setError(""); }}
                    placeholder={t("emailPlaceholder")}
                    className="min-h-14 min-w-0 flex-1 border border-[#2C2621]/18 bg-white px-4 text-base text-[#2C2621] outline-none transition-colors placeholder:text-[#82756A]/65 focus:border-[#C16542]"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    data-testid="newsletter-submit"
                    className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#C16542] px-6 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#A35133] disabled:cursor-wait disabled:opacity-60"
                  >
                    {sending ? t("sending") : t("submit")}
                    {!sending && <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />}
                  </button>
                </div>

                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="newsletter-website">Website</label>
                  <input id="newsletter-website" name="website" tabIndex="-1" autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-[1.6] text-[#5C5248]">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => { setConsent(event.target.checked); setError(""); }}
                    required
                    data-testid="newsletter-consent"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#C16542]"
                  />
                  <span>{t("consentPre")}<span className="font-medium text-[#A95739]">{t("privacyLabel")}</span>.</span>
                </label>

                {error && <p role="alert" data-testid="newsletter-error" className="mt-4 text-sm text-[#A33D2B]">{error}</p>}

                <details className="mt-7 border-t border-[#2C2621]/12 pt-5 text-xs text-[#5C5248]">
                  <summary className="cursor-pointer list-none font-semibold uppercase tracking-[0.15em] text-[#6E6258] marker:hidden">
                    {t("privacySummary")} <span aria-hidden="true">＋</span>
                  </summary>
                  <p className="mt-3 leading-[1.7]">
                    {t("privacyBody")} {" "}
                    <a className="underline decoration-[#C16542]/60 underline-offset-2 hover:text-[#A95739]" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
                  </p>
                </details>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
