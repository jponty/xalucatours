import React, { useEffect, useState } from "react";
import { ArrowRight, Compass, Grid2X2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { HOME_HELP_COPY, HOME_HELP_OPTIONS } from "@/lib/homeHelpOptions";

const STORAGE_KEY = "xaluca-home-welcome-seen-2026-07";
let shownWithoutStorage = false;

const COPY = {
  ...HOME_HELP_COPY,
  skip: {
    es: "Continuar explorando la Home",
    en: "Continue exploring the Home page",
    fr: "Continuer à explorer l'accueil",
  },
  closeLabel: {
    es: "Cerrar bienvenida",
    en: "Close welcome",
    fr: "Fermer la bienvenue",
  },
};

export default function HomeWelcomeModal({ autoOpen = false }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoOpen) return undefined;

    let shouldShow = false;
    let storageAvailable = true;

    try {
      shouldShow = window.localStorage.getItem(STORAGE_KEY) !== "1";
    } catch {
      storageAvailable = false;
      shouldShow = !shownWithoutStorage;
    }

    if (!shouldShow) return undefined;
    const timer = window.setTimeout(() => {
      try {
        if (storageAvailable) window.localStorage.setItem(STORAGE_KEY, "1");
        else shownWithoutStorage = true;
      } catch {
        shownWithoutStorage = true;
      }
      setOpen(true);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [autoOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        data-testid="home-welcome-modal"
        overlayClassName="z-[210] bg-[#17120F]/80 backdrop-blur-[2px]"
        closeLabel={pick(COPY.closeLabel, lang)}
        className="z-[220] w-[calc(100%-1.5rem)] max-w-4xl max-h-[92vh] overflow-y-auto gap-0 border border-white/10 bg-[#F8F2E9] p-0 text-[#2C2621] shadow-[0_36px_100px_-30px_rgba(20,14,11,0.8)] sm:rounded-none"
      >
        <div className="border-b border-[#2C2621]/10 px-5 py-6 pr-12 sm:px-8 sm:py-8 sm:pr-14 lg:px-10">
          <div className="inline-flex items-center gap-2 text-[#C16542]">
            <Compass className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.34em] sm:text-[10px]">
              {pick(COPY.eyebrow, lang)}
            </span>
          </div>
          <DialogTitle className="mt-3 font-serif-x text-[2rem] font-normal leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {pick(COPY.title, lang)}
          </DialogTitle>
          <DialogDescription className="mt-3 max-w-2xl text-[13px] leading-relaxed text-[#2C2621]/68 sm:text-[15px]">
            {pick(COPY.intro, lang)}
          </DialogDescription>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid gap-3 sm:grid-cols-2">
            {HOME_HELP_OPTIONS.map((option, index) => (
              <DialogClose asChild key={option.routeId}>
                <Link
                  to={pathFor(lang, option.routeId)}
                  data-testid={`home-welcome-${option.routeId}`}
                  className={`group relative min-h-[132px] overflow-hidden bg-[#2C2621] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] focus-visible:ring-offset-2 ${index === HOME_HELP_OPTIONS.length - 1 ? "sm:col-span-2 sm:min-h-[116px]" : ""}`}
                >
                  <img
                    src={option.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-65"
                  />
                  <span className="absolute inset-0 bg-gradient-to-r from-[#17120F]/90 via-[#17120F]/55 to-transparent" />
                  <span className="relative flex h-full min-h-[132px] items-end justify-between gap-5 p-5 sm:p-6">
                    <span>
                      <span className="block text-[9px] uppercase tracking-[0.28em] text-white/65">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-2 block font-serif-x text-xl leading-tight sm:text-[1.4rem]">
                        {pick(option.label, lang)}
                      </span>
                      <span className="mt-1.5 block text-[11px] leading-relaxed text-white/72 sm:text-xs">
                        {pick(option.detail, lang)}
                      </span>
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/45 transition-colors group-hover:border-[#DDA27F] group-hover:bg-[#C16542]">
                      <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </DialogClose>
            ))}
          </div>

          <div className="mt-5 flex justify-center border-t border-[#2C2621]/10 pt-5">
            <DialogClose asChild>
              <button
                type="button"
                data-testid="home-welcome-skip"
                className="inline-flex items-center gap-2 px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-[#2C2621]/60 transition-colors hover:text-[#C16542] sm:text-[10px]"
              >
                <Grid2X2 className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
                {pick(COPY.skip, lang)}
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
