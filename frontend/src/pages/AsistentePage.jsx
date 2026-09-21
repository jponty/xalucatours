import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ListTree, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import VirtualAssistantWidget from "@/components/VirtualAssistantWidget";
import { VIRTUAL_ASSISTANT_OPEN_EVENT } from "@/lib/chatbase";
import { pathFor } from "@/lib/routes";

const T = (es, en, fr) => ({ es, en, fr });

const ARIA_OPEN = T(
  "Abrir el asistente virtual",
  "Open the virtual assistant",
  "Ouvrir l'assistant virtuel",
);

// Identity-gated internal assistant with guided, selectable options.
export default function AsistentePage() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(VIRTUAL_ASSISTANT_OPEN_EVENT, show);
    return () => window.removeEventListener(VIRTUAL_ASSISTANT_OPEN_EVENT, show);
  }, []);

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
            slot="asistente.guided.eyebrow"
            defaults={{ es: "Asistente Virtual · Xaluca Tours", en: "Virtual Assistant · Xaluca Tours", fr: "Assistant virtuel · Xaluca Tours" }}
            multiline={false}
          />
        </span>

        <EditableText
          as="h1"
          slot="asistente.guided.title"
          defaults={{
            es: "Explora tu viaje paso a paso",
            en: "Explore your trip step by step",
            fr: "Explorez votre voyage étape par étape",
          }}
          multiline={false}
          className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-7 block text-[#1A1513]"
        />

        <EditableText
          as="p"
          slot="asistente.guided.subtitle"
          defaults={{
            es: "Elige entre las opciones de nuestro asistente para explorar las rutas y etapas publicadas por Xaluca Tours. Cada elección te mostrará nuevas opciones e información con enlaces a sus fuentes. Si falta información, te ayudaremos a contactar con nuestro equipo.",
            en: "Choose from our assistant's options to explore routes and stages published by Xaluca Tours. Each choice reveals new options and information with links to its sources. If information is missing, we will help you contact our team.",
            fr: "Choisissez parmi les options de notre assistant pour explorer les circuits et étapes publiés par Xaluca Tours. Chaque choix révèle de nouvelles options et des informations avec leurs sources. Si des informations manquent, nous vous aiderons à contacter notre équipe.",
          }}
          className="mt-6 text-base md:text-lg text-[#1A1513]/70 leading-relaxed block max-w-2xl mx-auto"
        />

        {/* The options button opens the identity step before guided navigation. */}
        <div className="mt-12 md:mt-14 flex items-center justify-center" data-testid="asistente-mic-illustration">
          <button
            type="button"
            ref={trigger}
            onClick={() => setOpen(true)}
            aria-label={pick(ARIA_OPEN, lang)}
            aria-haspopup="dialog"
            aria-expanded={open}
            data-testid="asistente-mic-button"
            className="group relative flex items-center justify-center outline-none"
          >
            <span className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full bg-[#C16542]/12 motion-safe:animate-ping" style={{ animationDuration: "3s" }} aria-hidden="true" />
            <span className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full bg-[#C16542]/16 motion-safe:animate-ping" style={{ animationDuration: "3s", animationDelay: "0.7s" }} aria-hidden="true" />
            <span className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border border-[#C16542]/25" aria-hidden="true" />
            <span className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#C16542] to-[#A35133] flex items-center justify-center shadow-[0_26px_60px_-16px_rgba(163,81,51,0.55)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-[#C16542]/40">
              <ListTree className="w-10 h-10 md:w-12 md:h-12 text-[#FDFBF7]" strokeWidth={1.6} aria-hidden="true" />
            </span>
          </button>
        </div>

        {/* Call to action hint → identify yourself, then choose an option. */}
        <div className="mt-16 md:mt-20 inline-flex items-center gap-2.5 text-[11px] tracking-[0.28em] uppercase text-[#1A1513]/60" data-testid="asistente-cta-hint">
          <ListTree className="w-4 h-4 text-[#C16542]" strokeWidth={1.8} aria-hidden="true" />
          <EditableText
            slot="asistente.guided.hint"
            defaults={{
              es: "Identifícate y elige tu primera opción",
              en: "Enter your details and choose your first option",
              fr: "Présentez-vous et choisissez votre première option",
            }}
            multiline={false}
          />
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl px-6 pb-20 md:px-12">
        <div className="grid gap-8 border-y border-[#2C2621]/15 py-10 md:grid-cols-3">
          {[
            [BookOpen, T("Información con fuentes", "Information with sources", "Des informations sourcées"), T("Las respuestas utilizan fragmentos de nuestros programas. Puedes abrir cada fuente para ampliar la información.", "Answers use excerpts from our programmes. Open each source to read more.", "Les réponses utilisent des extraits de nos programmes. Ouvrez chaque source pour en savoir plus.")],
            [ShieldCheck, T("Sin suposiciones", "No assumptions", "Sans suppositions"), T("El asistente no confirma precios, disponibilidad ni reservas. Cuando no pueda responder, te lo indicará.", "The assistant cannot confirm prices, availability or bookings. It will tell you when it cannot answer.", "L'assistant ne confirme ni tarifs, ni disponibilités, ni réservations. Il vous indiquera s'il ne peut pas répondre.")],
            [UserRound, T("Un equipo a tu lado", "Our team is here to help", "Notre équipe à vos côtés"), T("Siempre puedes consultar con nuestros especialistas en Marruecos para recibir una propuesta personalizada.", "You can always speak to our Morocco specialists for a personalised proposal.", "Vous pouvez toujours consulter nos spécialistes du Maroc pour une proposition personnalisée.")],
          ].map(([Icon, title, body]) => <div key={title.es}><Icon className="h-5 w-5 text-[#C16542]" aria-hidden="true" /><h2 className="mt-4 font-serif-x text-2xl">{pick(title, lang)}</h2><p className="mt-3 text-sm leading-relaxed text-[#5C5248]">{pick(body, lang)}</p></div>)}
        </div>
        <div className="mt-8 text-center"><Link to={pathFor(lang, "contact")} className="xaluca-button inline-flex min-h-11 items-center justify-center border border-[#C16542]/40 px-6 py-3 text-sm text-[#A35133] hover:bg-[#C16542]/10">{pick(T("Contactar con el equipo", "Contact our team", "Contacter notre équipe"), lang)}</Link></div>
      </section>
      <VirtualAssistantWidget open={open} onOpenChange={setOpen} triggerRef={trigger} />
    </main>
  );
}
