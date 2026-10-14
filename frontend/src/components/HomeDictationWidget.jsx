import React, { useEffect, useRef, useState } from "react";
import { Content as DialogContent } from "@radix-ui/react-dialog";
import { Mic, X } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { Dialog, DialogPortal, DialogOverlay, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import DictationForm, { DICTATION_COPY } from "@/components/DictationForm";
import { FloatingActionsDock } from "@/components/TripFloatingActions";
import { OPEN_DICTATION_MODAL_EVENT } from "@/lib/dictationModal";
import { banner } from "@/lib/imageBank";
import "./HomeDictationWidget.css";

const CLOSE = { es: "Cerrar", en: "Close", fr: "Fermer" };
const LABEL = { es: "Dictado", en: "Dictation", fr: "Dictée" };
// Existing Aït Ben Haddou and Merzouga gallery photos, served by Pexels to avoid Storage egress.
const MOROCCO_BANNER = [
  { image: "dunesRocky", label: { es: "Paisajes del desierto", en: "Desert landscapes", fr: "Paysages du désert" } },
  { src: "https://images.pexels.com/photos/11294565/pexels-photo-11294565.jpeg?auto=compress&cs=tinysrgb&w=400", label: { es: "Merzouga", en: "Merzouga", fr: "Merzouga" } },
  { image: "dunes", label: { es: "Erg Chebbi", en: "Erg Chebbi", fr: "Erg Chebbi" } },
  { src: "https://images.pexels.com/photos/5541277/pexels-photo-5541277.jpeg?auto=compress&cs=tinysrgb&w=400", label: { es: "Aït Ben Haddou", en: "Aït Ben Haddou", fr: "Aït Ben Haddou" } },
  { image: "chefBlueCity", label: { es: "Chefchaouen", en: "Chefchaouen", fr: "Chefchaouen" } },
];

export default function HomeDictationWidget() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [countryPortal, setCountryPortal] = useState(null);
  const closeButton = useRef(null);
  const triggerButton = useRef(null);
  const returnFocusTarget = useRef(null);

  useEffect(() => {
    const openFromContent = event => {
      returnFocusTarget.current = event.detail?.trigger instanceof HTMLElement
        ? event.detail.trigger : document.activeElement;
      setOpen(true);
    };
    window.addEventListener(OPEN_DICTATION_MODAL_EVENT, openFromContent);
    return () => window.removeEventListener(OPEN_DICTATION_MODAL_EVENT, openFromContent);
  }, []);

  return <Dialog open={open} onOpenChange={setOpen}>
    <FloatingActionsDock testId="home-dictation-dock">
      <DialogTrigger asChild>
        <button ref={triggerButton} type="button" data-testid="home-dictation-trigger" className="home-dictation-trigger"
          onClick={event => { returnFocusTarget.current = event.currentTarget; }}
          aria-label={pick(DICTATION_COPY.title, lang)}>
          <Mic className="h-5 w-5 shrink-0" aria-hidden="true" />
        </button>
      </DialogTrigger>
    </FloatingActionsDock>
    <DialogPortal>
      <DialogOverlay className="home-dictation-overlay" />
      <DialogContent
        data-testid="home-dictation-modal"
        className="home-dictation-modal"
        aria-modal="true"
        aria-describedby={undefined}
        onOpenAutoFocus={event => { event.preventDefault(); closeButton.current?.focus(); }}
        onCloseAutoFocus={event => {
          event.preventDefault();
          // Wait for the dock's inert state and visibility transition to clear.
          // An immediately restored focus would be lost while it is hidden.
          let frames = 0;
          const restoreFocus = () => {
            const trigger = returnFocusTarget.current?.isConnected ? returnFocusTarget.current : triggerButton.current;
            if (!trigger || document.querySelector('[aria-modal="true"]')) return;
            if (trigger.closest('[inert]') || getComputedStyle(trigger).visibility === "hidden") {
              if (++frames < 60) requestAnimationFrame(restoreFocus);
              return;
            }
            trigger.focus({ preventScroll: true });
          };
          requestAnimationFrame(restoreFocus);
        }}
      >
        <DialogTitle className="sr-only">{pick(DICTATION_COPY.title, lang)}</DialogTitle>
        <div className="home-dictation-toolbar">
          <span>{pick(LABEL, lang)} · Xaluca Tours</span>
          <DialogClose asChild>
            <button ref={closeButton} type="button" data-testid="home-dictation-close">
              {pick(CLOSE, lang)}<X className="h-4 w-4" aria-hidden="true" />
            </button>
          </DialogClose>
        </div>
        <div className="home-dictation-scroll" data-testid="home-dictation-scroll">
          <div className="home-dictation-banner" data-testid="home-dictation-banner" aria-label={pick({ es: "Paisajes de Marruecos", en: "Moroccan landscapes", fr: "Paysages du Maroc" }, lang)}>
            {MOROCCO_BANNER.map(({ image, src, label }, index) => <div className="home-dictation-banner-frame" key={image || src}>
              <img src={src || banner(image, index === 0 ? 640 : 400)} alt={pick(label, lang)} loading="lazy" decoding="async" />
            </div>)}
          </div>
          <DictationForm className="home-dictation-form" countryPortalContainer={countryPortal} onNavigate={() => setOpen(false)} />
        </div>
        {/* Outside the scrolling body, inside the dialog's focus/layer scope. */}
        <div ref={setCountryPortal} data-testid="home-dictation-country-layer" />
      </DialogContent>
    </DialogPortal>
  </Dialog>;
}
