import React from "react";
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

const STEPS = [
  {
    icon: Zap,
    number: "01",
    title: "Solicita Fast Track",
    body: "Completa el formulario con las fechas, viajeros y primeras ideas de tu viaje. Revisaremos que el servicio encaje con tu solicitud.",
  },
  {
    icon: BadgeEuro,
    number: "02",
    title: "Activa el servicio por 150 €",
    body: "Nuestro equipo te indicará cómo formalizar el pago único. Cuando quede confirmado, tu solicitud pasará a gestión prioritaria.",
  },
  {
    icon: UserRoundCheck,
    number: "03",
    title: "Trabaja con un especialista",
    body: "Un asesor estudia tus preferencias y prepara una propuesta personalizada, ordenando alojamientos, experiencias, traslados y servicios.",
  },
  {
    icon: Route,
    number: "04",
    title: "Confirma tu viaje",
    body: "Si reservas con Xaluca Tours, descontamos íntegramente los 150 € del importe final del viaje.",
  },
];

export default function FastTrackInfoModal({ open, onOpenChange, onActivate }) {
  const activate = () => {
    onOpenChange(false);
    window.setTimeout(() => onActivate?.(), 180);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="fast-track-info-modal"
        overlayClassName="z-[210] bg-[#17120F]/82 backdrop-blur-[2px]"
        closeLabel="Cerrar"
        className="z-[220] w-[calc(100%-1.5rem)] max-w-4xl max-h-[92vh] overflow-y-auto gap-0 border border-[#2C2621]/10 bg-[#F8F2E9] p-0 text-[#2C2621] shadow-[0_36px_100px_-30px_rgba(20,14,11,0.8)] sm:rounded-none"
      >
        <div className="border-b border-[#2C2621]/10 px-6 py-7 pr-14 sm:px-10 sm:py-9 sm:pr-16">
          <div className="inline-flex items-center gap-2 text-[#C16542]">
            <Clock3 className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Cómo funciona Fast Track</span>
          </div>
          <DialogTitle className="mt-4 font-serif-x text-3xl font-normal leading-[1.05] tracking-tight sm:text-5xl">
            Prioridad desde la primera conversación.
          </DialogTitle>
          <DialogDescription className="mt-4 max-w-2xl text-sm leading-relaxed text-[#2C2621]/68 sm:text-[15px]">
            Fast Track acelera y ordena la planificación de tu viaje mediante un proceso prioritario, transparente y acompañado por un especialista de Xaluca Tours.
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
                <h3 className="mt-5 font-serif-x text-xl leading-tight sm:text-2xl">{title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[#2C2621]/65">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 border border-[#2C2621]/10 bg-[#FDFBF7] p-5">
              <ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-[#C16542]" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="font-serif-x text-lg">Importe no reembolsable</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#2C2621]/62">Los 150 € cubren el asesoramiento y la planificación personalizada realizada por el equipo.</p>
              </div>
            </div>
            <div className="flex gap-3 border border-[#C16542]/25 bg-[#C16542]/[0.07] p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C16542]" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="font-serif-x text-lg">100 % deducible del viaje</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#2C2621]/62">Si confirmas tu reserva con Xaluca Tours, descontamos los 150 € íntegramente del precio final.</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-[#2C2621]/55">
            Fast Track prioriza la planificación, pero la disponibilidad de alojamientos, vuelos y servicios se confirma al formalizar la reserva.
          </p>

          <div className="sticky bottom-0 z-10 -mx-6 mt-7 flex flex-col-reverse gap-3 border-t border-[#2C2621]/10 bg-[#F8F2E9]/95 px-6 py-4 backdrop-blur-sm sm:-mx-10 sm:flex-row sm:items-center sm:justify-end sm:px-10">
            <DialogClose asChild>
              <button
                type="button"
                data-testid="fast-track-info-close"
                className="px-5 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#2C2621]/60 transition-colors hover:text-[#C16542]"
              >
                Seguir explorando
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={activate}
              data-testid="fast-track-info-activate"
              className="inline-flex items-center justify-center gap-3 bg-[#C16542] px-7 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#A35133]"
            >
              Solicitar Fast Track
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
