/* ============================================================
   ShareTripButton — icon-only button that opens a dialog to share
   the CURRENT trip page URL via WhatsApp, copy link or email.
   The shared link is always window.location (origin + pathname).
============================================================ */
import React, { useState, useCallback } from "react";
import { Share2, MessageCircle, Link2, Mail, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage, pick } from "@/contexts/LanguageContext";

const COPY = {
  trigger:  { es: "Compartir este viaje", en: "Share this trip", fr: "Partager ce voyage" },
  title:    { es: "Compartir este viaje", en: "Share this trip", fr: "Partager ce voyage" },
  desc:     {
    es: "Envía el enlace de este viaje a quien quieras.",
    en: "Send this trip's link to whomever you like.",
    fr: "Envoyez le lien de ce voyage à qui vous voulez.",
  },
  whatsapp: { es: "Compartir por WhatsApp", en: "Share on WhatsApp", fr: "Partager sur WhatsApp" },
  copy:     { es: "Copiar enlace", en: "Copy link", fr: "Copier le lien" },
  copied:   { es: "¡Enlace copiado!", en: "Link copied!", fr: "Lien copié !" },
  email:    { es: "Enviar por correo", en: "Send by email", fr: "Envoyer par e-mail" },
  shareText: {
    es: "Mira este viaje a Marruecos con Xaluca Tours:",
    en: "Check out this Morocco trip with Xaluca Tours:",
    fr: "Découvrez ce voyage au Maroc avec Xaluca Tours :",
  },
};

const tripUrl = () =>
  typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";

const tripTitle = () =>
  typeof document !== "undefined" ? document.title : "Xaluca Tours";

export default function ShareTripButton({ index, shareUrl, testid, triggerClassName, iconClassName }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = shareUrl || tripUrl();
  const text = `${pick(COPY.shareText, lang)} ${tripTitle()}`;

  const onWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(`${text}\n${url}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener,noreferrer");
  }, [text, url]);

  const onEmail = useCallback(() => {
    const subject = encodeURIComponent(tripTitle());
    const body = encodeURIComponent(`${text}\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [text, url]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [url]);

  const rowClass =
    "w-full flex items-center gap-3 px-4 py-3.5 border border-[#2C2621]/15 text-[#2C2621] hover:border-[#C16542] hover:bg-[#F5EFE3]/70 transition-colors text-sm";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          data-testid={testid || `landmark-card-share-cta-${index}`}
          aria-label={pick(COPY.trigger, lang)}
          title={pick(COPY.trigger, lang)}
          onClick={(e) => e.stopPropagation()}
          className={triggerClassName || "inline-flex items-center justify-center w-11 h-11 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors"}
        >
          <Share2 className={iconClassName || "w-[18px] h-[18px]"} strokeWidth={1.6} />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#FDFBF7] border-[#2C2621]/12 sm:max-w-md" data-testid="share-trip-dialog">
        <DialogHeader>
          <DialogTitle className="font-serif-x text-2xl text-[#2C2621]">{pick(COPY.title, lang)}</DialogTitle>
          <DialogDescription className="text-[#5C5248]">{pick(COPY.desc, lang)}</DialogDescription>
        </DialogHeader>

        {/* Current trip URL */}
        <div className="mt-1 px-3 py-2.5 bg-[#F5EFE3]/70 border border-[#2C2621]/10 text-[12px] text-[#5C5248] break-all" data-testid="share-trip-url">
          {url}
        </div>

        <div className="mt-3 space-y-2.5">
          <button type="button" onClick={onWhatsApp} data-testid="share-whatsapp" className={rowClass}>
            <MessageCircle className="w-[18px] h-[18px] text-[#25D366]" strokeWidth={1.7} />
            {pick(COPY.whatsapp, lang)}
          </button>

          <button type="button" onClick={onCopy} data-testid="share-copy" className={rowClass}>
            {copied ? (
              <Check className="w-[18px] h-[18px] text-[#5A6B4F]" strokeWidth={1.8} />
            ) : (
              <Link2 className="w-[18px] h-[18px] text-[#C16542]" strokeWidth={1.7} />
            )}
            {pick(copied ? COPY.copied : COPY.copy, lang)}
          </button>

          <button type="button" onClick={onEmail} data-testid="share-email" className={rowClass}>
            <Mail className="w-[18px] h-[18px] text-[#C16542]" strokeWidth={1.7} />
            {pick(COPY.email, lang)}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
