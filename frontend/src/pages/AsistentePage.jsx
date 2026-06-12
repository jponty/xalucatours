import React, { useEffect } from "react";
import { Mic, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";

const CONVAI_SCRIPT = "https://unpkg.com/@elevenlabs/convai-widget-embed";
const AGENT_ID = "agent_4001ktxba372etwtx87b1qpp5z92";

/* ============================================================
   AsistentePage — dedicated page that hosts the ElevenLabs ConvAI
   voice assistant. The widget is mounted ONLY here: the custom
   element lives in this page's markup (so it disappears when the
   user navigates away) and the embed script is loaded on mount.
============================================================ */
export default function AsistentePage() {
  const { lang } = useLanguage(); // eslint-disable-line no-unused-vars

  useEffect(() => {
    // Load the ConvAI embed script once; it registers the
    // <elevenlabs-convai> custom element globally.
    let script = document.querySelector(`script[src="${CONVAI_SCRIPT}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = CONVAI_SCRIPT;
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // Hide the global Chatbase widget while on this page only, so the
    // ElevenLabs assistant is the single focus here.
    document.body.classList.add("asistente-page");
    return () => {
      document.body.classList.remove("asistente-page");
    };
  }, []);

  return (
    <main data-testid="asistente-page" className="bg-[#1A1513] text-[#FDFBF7] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 berber-bg-cross opacity-[0.07] pointer-events-none" aria-hidden="true" />
      <span className="film-grain opacity-40" aria-hidden="true" />

      <section className="relative max-w-3xl mx-auto px-6 md:px-12 pt-36 md:pt-44 pb-40 text-center">
        <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#D4A373]">
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
          className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-7 block"
        />

        <EditableText
          as="p"
          slot="asistente.hero.subtitle"
          defaults={{
            es: "Resuelve tus dudas sobre rutas, fechas y precios al instante. Pulsa el botón y empieza a hablar: nuestro asistente de voz te ayudará a imaginar tu viaje por Marruecos.",
            en: "Get instant answers about routes, dates and prices. Tap the button and start talking — our voice assistant will help you imagine your Moroccan journey.",
            fr: "Obtenez des réponses instantanées sur les itinéraires, les dates et les prix. Appuyez sur le bouton et parlez : notre assistant vocal vous aidera à imaginer votre voyage au Maroc.",
          }}
          className="mt-6 text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed block"
        />

        <div className="mt-10 inline-flex items-center gap-2.5 text-[11px] tracking-[0.28em] uppercase text-[#FDFBF7]/55">
          <Mic className="w-4 h-4 text-[#C16542]" strokeWidth={1.7} />
          <EditableText
            slot="asistente.hero.hint"
            defaults={{
              es: "Pulsa el botón inferior para hablar",
              en: "Tap the button below to talk",
              fr: "Appuyez sur le bouton ci-dessous pour parler",
            }}
            multiline={false}
          />
        </div>
      </section>

      {/* ElevenLabs ConvAI widget — floats centered at the bottom of the page */}
      <elevenlabs-convai agent-id={AGENT_ID} data-testid="elevenlabs-convai-widget"></elevenlabs-convai>
    </main>
  );
}
