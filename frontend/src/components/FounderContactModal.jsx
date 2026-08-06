import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowRight, Check, Mail, Send, ShieldCheck, Users } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { resolvePath } from "@/lib/routes";
import { supabaseMedia } from "@/lib/supabaseMedia";
import Img from "@/components/Img";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PRIVACY_URL = "https://xalucatours.com/";
const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  eyebrow: T("Contacto con fundadores", "Contact the founders", "Contacter les fondateurs"),
  title: T("Tu mensaje, directamente a sus fundadores.", "Your message, directly to the founders.", "Votre message, directement aux fondateurs."),
  description: T(
    "Comparte una consulta, propuesta o necesidad. Elige a quién deseas dirigirla y la haremos llegar de forma personal.",
    "Share an enquiry, proposal or request. Choose who you would like to address and we will deliver it personally.",
    "Partagez une question, une proposition ou un besoin. Choisissez votre destinataire et nous lui transmettrons personnellement.",
  ),
  firstName: T("Nombre", "First name", "Prénom"),
  lastName: T("Apellidos", "Last name", "Nom"),
  phone: T("Teléfono", "Phone", "Téléphone"),
  email: T("Correo electrónico", "Email", "E-mail"),
  message: T("Comentario o mensaje", "Comment or message", "Commentaire ou message"),
  recipient: T("¿A quién deseas enviar la consulta?", "Who should receive your enquiry?", "À qui souhaitez-vous envoyer votre demande ?"),
  lluis: T("Lluís", "Lluís", "Lluís"),
  tayeb: T("Tayeb", "Tayeb", "Tayeb"),
  both: T("Ambos cofundadores de Grup Xaluca", "Both Grup Xaluca co-founders", "Les deux cofondateurs de Grup Xaluca"),
  privacyPre: T("He leído y acepto la ", "I have read and accept the ", "J’ai lu et j’accepte la "),
  privacy: T("política de privacidad", "privacy policy", "politique de confidentialité"),
  submit: T("Enviar consulta", "Send enquiry", "Envoyer la demande"),
  sending: T("Enviando…", "Sending…", "Envoi…"),
  successTitle: T("Tu mensaje está en camino.", "Your message is on its way.", "Votre message est en route."),
  successBody: T(
    "Hemos registrado tu consulta y la hemos dirigido al destinatario seleccionado. También recibirás una confirmación por correo electrónico.",
    "We have recorded your enquiry and directed it to the selected recipient. You will also receive an email confirmation.",
    "Nous avons enregistré votre demande et l’avons adressée au destinataire choisi. Vous recevrez également une confirmation par e-mail.",
  ),
  close: T("Cerrar", "Close", "Fermer"),
  error: T("No se ha podido enviar la consulta. Inténtalo de nuevo.", "We couldn't send your enquiry. Please try again.", "Impossible d’envoyer votre demande. Veuillez réessayer."),
  teamEyebrow: T("Contacto directo con el equipo", "Direct team contact", "Contact direct avec l’équipe"),
  teamTitle: T("Habla directamente con la persona adecuada.", "Speak directly with the right person.", "Échangez directement avec la bonne personne."),
  teamDescription: T(
    "Envíanos tu consulta y la dirigiremos al miembro del equipo que has seleccionado.",
    "Send us your enquiry and we will direct it to the team member you selected.",
    "Envoyez-nous votre demande et nous la transmettrons au membre de l’équipe sélectionné.",
  ),
  selectedRecipient: T("Tu consulta se enviará a", "Your enquiry will be sent to", "Votre demande sera envoyée à"),
};

const TEAM_RECIPIENTS = {
  noemi: "Noemi Aparicio",
  elena: "Elena Xaluca",
  sanaa: "Sanaa Xaluca",
};

const FOUNDER_VISUALS = {
  lluis: {
    name: "Lluís Pont",
    image: supabaseMedia("xaluca/static/founders/lluis-pont.jpg"),
    tilt: "-rotate-[4deg]",
  },
  tayeb: {
    name: "Tayeb Ettaiek",
    image: supabaseMedia("xaluca/static/founders/tayeb-ettaiek.jpg"),
    tilt: "rotate-[4deg]",
  },
};

const emptyForm = (recipient = "lluis") => ({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  message: "",
  recipient,
  privacy: false,
});

const Field = ({ label, children, wide = false }) => (
  <label className={wide ? "block sm:col-span-2" : "block"}>
    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.23em] text-[#74685E]">{label}</span>
    {children}
  </label>
);

const FounderPolaroid = ({ recipient }) => {
  const founders = recipient === "both"
    ? [FOUNDER_VISUALS.lluis, FOUNDER_VISUALS.tayeb]
    : [FOUNDER_VISUALS[recipient] || FOUNDER_VISUALS.lluis];
  const isPair = founders.length > 1;

  return (
    <div
      data-testid={`founder-contact-polaroid-${recipient}`}
      className={`flex shrink-0 items-center justify-center py-3 sm:py-0 ${isPair ? "-space-x-9 sm:-space-x-12" : ""}`}
      aria-label={founders.map((founder) => founder.name).join(" y ")}
    >
      {founders.map((founder, index) => (
        <figure
          key={founder.name}
          className={`relative bg-[#FFFDF8] p-2 pb-3 shadow-[0_24px_48px_-20px_rgba(26,21,19,.65)] transition-transform duration-500 ${founder.tilt} ${isPair ? "w-[108px] sm:w-[124px]" : "w-[142px] sm:w-[164px]"} ${index === 1 ? "z-[1]" : "z-0"}`}
        >
          <div className="aspect-[4/5] overflow-hidden bg-[#E8DFD2]">
            <Img
              src={founder.image}
              alt={founder.name}
              width={360}
              sizes={isPair ? "124px" : "164px"}
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className={`pt-2 text-center font-hand leading-none text-[#2C2621] ${isPair ? "text-lg sm:text-xl" : "text-2xl"}`}>
            {founder.name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default function FounderContactModal({ open, onOpenChange, initialRecipient = "lluis", contactType = "founder" }) {
  const { lang } = useLanguage();
  const location = useLocation();
  const [form, setForm] = useState(() => emptyForm(initialRecipient));
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm(initialRecipient));
    setSuccess(false);
  }, [open, initialRecipient]);

  const isTeamContact = contactType === "team";
  const recipientName = useMemo(
    () => isTeamContact ? (TEAM_RECIPIENTS[form.recipient] || TEAM_RECIPIENTS.noemi) : pick(COPY[form.recipient] || COPY.lluis, lang),
    [form.recipient, isTeamContact, lang],
  );
  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      let routeId = null;
      try { routeId = resolvePath(location.pathname)?.routeId || null; } catch { routeId = null; }
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      const recipientPayload = isTeamContact
        ? { team_recipient: form.recipient }
        : { founder_recipient: form.recipient };
      await axios.post(`${API}/contact-requests`, {
        full_name: fullName,
        email: form.email.trim(),
        phone: form.phone.trim(),
        preferred_contact: ["email", "phone"],
        message: form.message.trim(),
        ...recipientPayload,
        journey_interest: isTeamContact ? "team-contact" : "founder-contact",
        language: lang,
        source_route_id: routeId,
        source_path: location.pathname,
        source_label: `Contacto directo con ${recipientName} · ${document.title || location.pathname}`,
      });
      setSuccess(true);
      toast.success(pick(COPY.successTitle, lang));
    } catch (_) {
      toast.error(pick(COPY.error, lang));
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="founder-contact-modal"
        closeLabel={pick(COPY.close, lang)}
        overlayClassName="z-[12020]"
        className="z-[12030] max-h-[92svh] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-y-auto border border-[#2C2621]/10 bg-[#F8F3EA] p-0 text-[#2C2621] shadow-[0_35px_100px_-25px_rgba(26,21,19,.75)] sm:rounded-none"
      >
        {success ? (
          <div className="px-6 py-14 text-center sm:px-12 sm:py-20" data-testid="founder-contact-success">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C16542] text-white"><Check className="h-6 w-6" strokeWidth={1.7} /></span>
            <span className="mt-7 block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C16542]">Xaluca · Grup Xaluca</span>
            <DialogTitle className="mx-auto mt-4 max-w-xl font-serif-x text-4xl font-normal leading-[1.05] sm:text-5xl">{pick(COPY.successTitle, lang)}</DialogTitle>
            <DialogDescription className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#62584E] sm:text-base">{pick(COPY.successBody, lang)}</DialogDescription>
            <button type="button" onClick={() => onOpenChange(false)} className="mt-9 inline-flex items-center gap-3 bg-[#2C2621] px-8 py-4 text-[10px] uppercase tracking-[0.23em] text-white">{pick(COPY.close, lang)}</button>
          </div>
        ) : (
          <>
            <header className="border-b border-[#2C2621]/10 px-6 py-8 pr-14 sm:px-10 sm:py-10 sm:pr-16">
              <div className={!isTeamContact ? "grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_180px] sm:gap-10" : undefined}>
                <div>
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C16542]"><Users className="h-4 w-4" strokeWidth={1.6} />{pick(isTeamContact ? COPY.teamEyebrow : COPY.eyebrow, lang)}</span>
                  <DialogTitle className="mt-4 max-w-2xl font-serif-x text-3xl font-normal leading-[1.05] sm:text-4xl lg:text-5xl">{pick(isTeamContact ? COPY.teamTitle : COPY.title, lang)}</DialogTitle>
                  <DialogDescription className="mt-4 max-w-2xl text-sm leading-relaxed text-[#62584E] sm:text-base">{pick(isTeamContact ? COPY.teamDescription : COPY.description, lang)}</DialogDescription>
                </div>
                {!isTeamContact && <FounderPolaroid recipient={form.recipient} />}
              </div>
            </header>

            <form onSubmit={onSubmit} className="px-6 py-8 sm:px-10 sm:py-10" data-testid="founder-contact-form">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={pick(COPY.firstName, lang)}><input required name="firstName" value={form.firstName} onChange={onChange} autoComplete="given-name" data-testid="founder-contact-first-name" className="founder-field" /></Field>
                <Field label={pick(COPY.lastName, lang)}><input required name="lastName" value={form.lastName} onChange={onChange} autoComplete="family-name" data-testid="founder-contact-last-name" className="founder-field" /></Field>
                <Field label={pick(COPY.phone, lang)}><input required type="tel" name="phone" value={form.phone} onChange={onChange} autoComplete="tel" data-testid="founder-contact-phone" className="founder-field" /></Field>
                <Field label={pick(COPY.email, lang)}><input required type="email" name="email" value={form.email} onChange={onChange} autoComplete="email" data-testid="founder-contact-email" className="founder-field" /></Field>
                <Field label={pick(COPY.message, lang)} wide><textarea required minLength={4} rows={5} name="message" value={form.message} onChange={onChange} data-testid="founder-contact-message" className="founder-field resize-none" /></Field>
              </div>

              {isTeamContact ? (
                <div className="mt-7" data-testid="team-contact-selected-recipient">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#74685E]">{pick(COPY.selectedRecipient, lang)}</span>
                  <div className="mt-3 flex items-center gap-3 border border-[#C16542] bg-[#C16542] px-4 py-4 text-sm text-white">
                    <span className="h-2.5 w-2.5 rounded-full border border-white bg-white" />
                    <strong className="font-medium">{recipientName}</strong>
                  </div>
                </div>
              ) : <fieldset className="mt-7">
                <legend className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#74685E]">{pick(COPY.recipient, lang)}</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {["lluis", "tayeb", "both"].map((recipient) => (
                    <label key={recipient} className={`flex cursor-pointer items-center gap-3 border px-4 py-4 text-sm transition-colors ${form.recipient === recipient ? "border-[#C16542] bg-[#C16542] text-white" : "border-[#2C2621]/15 bg-white hover:border-[#C16542]/60"}`}>
                      <input type="radio" name="recipient" value={recipient} checked={form.recipient === recipient} onChange={onChange} data-testid={`founder-recipient-${recipient}`} className="sr-only" />
                      <span className={`h-2.5 w-2.5 rounded-full border ${form.recipient === recipient ? "border-white bg-white" : "border-[#C16542]"}`} />
                      <span className="leading-snug">{pick(COPY[recipient], lang)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>}

              <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#62584E]">
                <input required type="checkbox" name="privacy" checked={form.privacy} onChange={onChange} data-testid="founder-contact-privacy" className="mt-0.5 h-4 w-4 shrink-0 accent-[#C16542]" />
                <span>{pick(COPY.privacyPre, lang)}<a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-[#C16542] underline underline-offset-2">{pick(COPY.privacy, lang)}</a>.</span>
              </label>

              <div className="mt-8 flex flex-col gap-4 border-t border-[#2C2621]/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2 text-xs text-[#74685E]"><ShieldCheck className="h-4 w-4 text-[#C16542]" strokeWidth={1.7} />{pick(T("Tus datos se tratarán de forma confidencial.", "Your details will be handled confidentially.", "Vos données seront traitées de manière confidentielle."), lang)}</span>
                <button disabled={sending} type="submit" data-testid="founder-contact-submit" className="inline-flex items-center justify-center gap-3 bg-[#C16542] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#A35133] disabled:cursor-wait disabled:opacity-60">
                  {sending ? <Mail className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}{pick(sending ? COPY.sending : COPY.submit, lang)}{!sending && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </>
        )}
        <style>{`.founder-field{width:100%;border:1px solid rgba(44,38,33,.17);background:#fff;padding:.85rem 1rem;color:#2C2621;outline:none;transition:border-color .2s,box-shadow .2s}.founder-field:focus{border-color:#C16542;box-shadow:0 0 0 2px rgba(193,101,66,.12)}`}</style>
      </DialogContent>
    </Dialog>
  );
}
