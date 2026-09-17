import React, { useRef, useState } from "react";
import { Content as DialogContent } from "@radix-ui/react-dialog";
import { Mic, X } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { Dialog, DialogPortal, DialogOverlay, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import DictationForm, { DICTATION_COPY } from "@/components/DictationForm";
import { FloatingActionsDock } from "@/components/TripFloatingActions";
import "./HomeDictationWidget.css";

const CLOSE = { es: "Cerrar", en: "Close", fr: "Fermer" };
const LABEL = { es: "Dictado", en: "Dictation", fr: "Dictée" };

export default function HomeDictationWidget() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [countryPortal, setCountryPortal] = useState(null);
  const closeButton = useRef(null);
  const triggerButton = useRef(null);

  return <Dialog open={open} onOpenChange={setOpen}>
    <FloatingActionsDock testId="home-dictation-dock">
      <DialogTrigger asChild>
        <button ref={triggerButton} type="button" data-testid="home-dictation-trigger" className="home-dictation-trigger"
          aria-label={pick(DICTATION_COPY.title, lang)}>
          <Mic className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="home-dictation-trigger-label" aria-hidden="true">{pick(DICTATION_COPY.title, lang)}</span>
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
            const trigger = triggerButton.current;
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
          <DictationForm className="home-dictation-form" countryPortalContainer={countryPortal} onNavigate={() => setOpen(false)} />
        </div>
        {/* Outside the scrolling body, inside the dialog's focus/layer scope. */}
        <div ref={setCountryPortal} data-testid="home-dictation-country-layer" />
      </DialogContent>
    </DialogPortal>
  </Dialog>;
}
