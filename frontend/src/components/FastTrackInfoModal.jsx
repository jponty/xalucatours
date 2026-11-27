import React from "react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import {
  ArrowRight,
  BadgeEuro,
  CheckCircle2,
  Clock3,
  ReceiptText,
  Route,
  UserRoundCheck,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const T = (es, en, fr) => ({ es, en, fr });
const STEPS = [
  {
    icon: Zap,
    number: "01",
    title: T("Solicita Fast Track", "Request Fast Track", "Demandez Fast Track"),
    body: T("Completa el formulario con las fechas, viajeros y primeras ideas de tu viaje. Revisaremos que el servicio encaje con tu solicitud.", "Complete the form with dates, travellers and your initial ideas. We will check that the service suits your request.", "Complétez le formulaire avec vos dates, le nombre de voyageurs et vos premières idées. Nous vérifierons que le service convient à votre demande."),
  },
  {
    icon: BadgeEuro,
    number: "02",
    title: T("Activa el servicio por 150 €", "Activate the service for €150", "Activez le service pour 150 €"),
    body: T("Nuestro equipo te indicará cómo formalizar el pago único. Cuando quede confirmado, tu solicitud pasará a gestión prioritaria.", "Our team will explain how to make the one-off payment. Once confirmed, your request will be handled with priority.", "Notre équipe vous indiquera comment effectuer le paiement unique. Une fois confirmé, votre demande sera traitée en priorité."),
  },
  {
    icon: UserRoundCheck,
    number: "03",
    title: T("Trabaja con un especialista", "Work with a specialist", "Travaillez avec un spécialiste"),
    body: T("Un asesor estudia tus preferencias y prepara una propuesta personalizada, ordenando alojamientos, experiencias, traslados y servicios.", "An adviser studies your preferences and prepares a personalised proposal covering accommodation, experiences, transfers and services.", "Un conseiller étudie vos préférences et prépare une proposition personnalisée comprenant hébergements, expériences, transferts et services."),
  },
  {
    icon: Route,
    number: "04",
    title: T("Confirma tu viaje", "Confirm your trip", "Confirmez votre voyage"),
    body: T("Si reservas con Xaluca Tours, descontamos íntegramente los 150 € del importe final del viaje.", "If you book with Xaluca Tours, the €150 is deducted in full from the final trip price.", "Si vous réservez avec Xaluca Tours, les 150 € sont intégralement déduits du prix final du voyage."),
  },
];

export default function FastTrackInfoModal({ open, onOpenChange, onActivate }) {
  const { lang } = useLanguage();
  const t = (es, en, fr) => pick(T(es, en, fr), lang);
  const activate = () => {
    onOpenChange(false);
    window.setTimeout(() => onActivate?.(), 180);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="fast-track-info-modal"
        overlayClassName="z-[210] bg-[#17120F]/82 backdrop-blur-[2px]"
        closeLabel={t("Cerrar", "Close", "Fermer")}
        className="z-[220] w-[calc(100%-1.5rem)] max-w-4xl max-h-[92vh] overflow-y-auto gap-0 border border-[#2C2621]/10 bg-[#F8F2E9] p-0 text-[#2C2621] shadow-[0_36px_100px_-30px_rgba(20,14,11,0.8)] sm:rounded-none"
      >
        <div className="border-b border-[#2C2621]/10 px-6 py-7 pr-14 sm:px-10 sm:py-9 sm:pr-16">
          <div className="inline-flex items-center gap-2 text-[#C16542]">
            <Clock3 className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">{t("Cómo funciona Fast Track", "How Fast Track works", "Comment fonctionne Fast Track")}</span>
          </div>
          <DialogTitle className="mt-4 font-serif-x text-3xl font-normal leading-[1.05] tracking-tight sm:text-5xl">
            {t("Prioridad desde la primera conversación.", "Priority from the first conversation.", "La priorité dès le premier échange.")}
          </DialogTitle>
          <DialogDescription className="mt-4 max-w-2xl text-sm leading-relaxed text-[#2C2621]/68 sm:text-[15px]">
            {t("Fast Track acelera y ordena la planificación de tu viaje mediante un proceso prioritario, transparente y acompañado por un especialista de Xaluca Tours.", "Fast Track speeds up and structures your trip planning through a priority, transparent process supported by a Xaluca Tours specialist.", "Fast Track accélère et structure la préparation de votre voyage grâce à un processus prioritaire et transparent, accompagné par un spécialiste de Xaluca Tours.")}
          </DialogDescription>
        </div>

        <div className="px-6 py-7 sm:px-10 sm:py-9">
          <ol className="grid gap-px overflow-hidden border border-[#2C2621]/10 bg-[#2C2621]/10 sm:grid-cols-2">
            {STEPS.map(({ icon: Icon, number, title, body }) => (
              <li key={number} className="bg-[#FDFBF7] p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#C16542]/10 text-[#C16542]">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="font-serif-x text-2xl text-[#C16542]/55">{number}</span>
                </div>
                <h3 className="mt-5 font-serif-x text-xl leading-tight sm:text-2xl">{pick(title, lang)}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[#2C2621]/65">{pick(body, lang)}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 border border-[#2C2621]/10 bg-[#FDFBF7] p-5">
              <ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-[#C16542]" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="font-serif-x text-lg">{t("Importe no reembolsable", "Non-refundable fee", "Montant non remboursable")}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#2C2621]/62">{t("Los 150 € cubren el asesoramiento y la planificación personalizada realizada por el equipo.", "The €150 covers the team's advice and personalised planning work.", "Les 150 € couvrent les conseils et la planification personnalisée de notre équipe.")}</p>
              </div>
            </div>
            <div className="flex gap-3 border border-[#C16542]/25 bg-[#C16542]/[0.07] p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C16542]" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="font-serif-x text-lg">{t("100 % deducible del viaje", "100% deducted from your trip", "100 % déductible du voyage")}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#2C2621]/62">{t("Si confirmas tu reserva con Xaluca Tours, descontamos los 150 € íntegramente del precio final.", "If you confirm your booking with Xaluca Tours, we deduct the full €150 from the final price.", "Si vous confirmez votre réservation avec Xaluca Tours, nous déduisons les 150 € du prix final dans leur intégralité.")}</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-[#2C2621]/55">
            {t("Fast Track prioriza la planificación, pero la disponibilidad de alojamientos, vuelos y servicios se confirma al formalizar la reserva.", "Fast Track prioritises planning, but accommodation, flight and service availability is confirmed only when the booking is finalised.", "Fast Track donne la priorité à la planification, mais la disponibilité des hébergements, vols et services n'est confirmée qu'à la réservation.")}
          </p>

          <div className="sticky bottom-0 z-10 -mx-6 mt-7 flex flex-col-reverse gap-3 border-t border-[#2C2621]/10 bg-[#F8F2E9]/95 px-6 py-4 backdrop-blur-sm sm:-mx-10 sm:flex-row sm:items-center sm:justify-end sm:px-10">
            <DialogClose asChild>
              <button
                type="button"
                data-testid="fast-track-info-close"
                className="xaluca-button px-5 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#2C2621]/60 transition-colors hover:text-[#C16542]"
              >
                {t("Seguir explorando", "Keep exploring", "Continuer à explorer")}
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={activate}
              data-testid="fast-track-info-activate"
              className="xaluca-button inline-flex items-center justify-center gap-3 bg-[#C16542] px-7 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#A35133]"
            >
              {t("Solicitar Fast Track", "Request Fast Track", "Demander Fast Track")}
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
