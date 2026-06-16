import React from "react";
import { Mic, Sparkles } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import TravelFaq from "@/components/TravelFaq";
import { openChatbaseAssistant } from "@/lib/chatbase";

const T = (es, en, fr) => ({ es, en, fr });

const ARIA_OPEN = T(
  "Abrir el asistente virtual",
  "Open the virtual assistant",
  "Ouvrir l'assistant virtuel",
);

/* ============================================================
   AsistentePage — dedicated page for the virtual assistant.
   The active solution is the Chatbase widget: the central
   microphone illustration opens it on click, and the global
   Chatbase bubble stays available at the bottom-right.
============================================================ */
export default function AsistentePage() {
  const { lang } = useLanguage();

  return (
    <main data-testid="asistente-page" className="bg-[#FDFBF7] text-[#1A1513] min-h-screen relative overflow-hidden">
      {/* Subtle berber texture + warm ambient glow on the light surface */}
      <div className="absolute inset-0 berber-bg-cross opacity-[0.5] pointer-events-none" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-20 -translate-x-1/2 w-[680px] h-[680px] max-w-[92vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(193,101,66,0.18) 0%, rgba(193,101,66,0) 70%)" }}
        aria-hidden="true"
      />

      <section className="relative max-w-3xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-24 md:pb-32 text-center">
        <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#C16542] font-semibold">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
          <EditableText
            slot="asistente.hero.eyebrow"
            defaults={{ es: "Asistente de voz", en: "Voice assistant", fr: "Assistant vocal" }}
            multiline={false}
          />
        </span>

        <EditableText
          as="h1"
          slot="asistente.hero.title"
          defaults={{
            es: "Habla con nuestro asistente de viajes",
            en: "Talk to our travel assistant",
            fr: "Parlez à notre assistant de voyage",
          }}
          multiline={false}
          className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-7 block text-[#1A1513]"
        />

        <EditableText
          as="p"
          slot="asistente.hero.subtitle"
          defaults={{
            es: "Resuelve tus dudas sobre rutas, fechas, alojamientos, actividades y precios al instante. Pulsa el botón y empieza a hablar: nuestro asistente de voz te ayudará a descubrir, planificar e imaginar tu próximo viaje por Marruecos.",
            en: "Get instant answers about routes, dates, accommodation, activities and prices. Tap the button and start talking: our voice assistant will help you discover, plan and imagine your next journey through Morocco.",
            fr: "Obtenez des réponses instantanées sur les itinéraires, les dates, les hébergements, les activités et les prix. Appuyez sur le bouton et commencez à parler : notre assistant vocal vous aidera à découvrir, planifier et imaginer votre prochain voyage au Maroc.",
          }}
          className="mt-6 text-base md:text-lg text-[#1A1513]/70 leading-relaxed block max-w-2xl mx-auto"
        />

        {/* Prominent, fully interactive voice-assistant button → opens Chatbase */}
        <div className="mt-12 md:mt-14 flex items-center justify-center" data-testid="asistente-mic-illustration">
          <button
            type="button"
            onClick={openChatbaseAssistant}
            aria-label={pick(ARIA_OPEN, lang)}
            data-testid="asistente-mic-button"
            className="group relative flex items-center justify-center outline-none"
          >
            <span className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full bg-[#C16542]/12 animate-ping" style={{ animationDuration: "3s" }} aria-hidden="true" />
            <span className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full bg-[#C16542]/16 animate-ping" style={{ animationDuration: "3s", animationDelay: "0.7s" }} aria-hidden="true" />
            <span className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border border-[#C16542]/25" aria-hidden="true" />
            <span className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#C16542] to-[#A35133] flex items-center justify-center shadow-[0_26px_60px_-16px_rgba(163,81,51,0.55)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-[#C16542]/40">
              <Mic className="w-10 h-10 md:w-12 md:h-12 text-[#FDFBF7]" strokeWidth={1.6} />
            </span>
          </button>
        </div>

        {/* Call to action hint → click the microphone */}
        <div className="mt-10 inline-flex items-center gap-2.5 text-[11px] tracking-[0.28em] uppercase text-[#1A1513]/60" data-testid="asistente-cta-hint">
          <Mic className="w-4 h-4 text-[#C16542]" strokeWidth={1.8} />
          <EditableText
            slot="asistente.hero.hint"
            defaults={{
              es: "Pulsa el micrófono para hablar con nuestro asistente",
              en: "Tap the microphone to talk to our assistant",
              fr: "Appuyez sur le microphone pour parler à notre assistant",
            }}
            multiline={false}
          />
        </div>
      </section>

      {/* Frequently asked questions about tailor-made Morocco trips */}
      <TravelFaq />
    </main>
  );
}
