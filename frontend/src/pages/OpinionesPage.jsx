import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Quote, Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import EditableText from "@/components/EditableText";

const SENJA_SCRIPT = "https://widget.senja.io/js/iframeResizer.min.js";
const SENJA_SELECTOR = "#wall-of-love-cLfL-a";

/* Senja "Wall of Love" — loads the iframe-resizer once and keeps the
   embedded iframe responsive without scrollbars. */
const WallOfLove = () => {
  useEffect(() => {
    const init = () => {
      if (typeof window.iFrameResize === "function") {
        try { window.iFrameResize({ log: false, checkOrigin: false }, SENJA_SELECTOR); } catch (e) { /* noop */ }
      }
    };
    let script = document.querySelector(`script[src="${SENJA_SCRIPT}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SENJA_SCRIPT;
      script.async = true;
      script.addEventListener("load", init);
      document.body.appendChild(script);
    } else {
      init();
    }
    return () => { script && script.removeEventListener("load", init); };
  }, []);

  return (
    <div data-testid="wall-of-love" className="senja-embed">
      <iframe
        id="wall-of-love-cLfL-a"
        src="https://senja.io/p/xaluca-tours/cLfL-a?hideNavigation=true&embed=true"
        title="Wall of Love"
        frameBorder="0"
        scrolling="no"
        style={{ width: "100%", border: "none" }}
      />
    </div>
  );
};

const STATS = [
  { value: { es: "4,9 / 5", en: "4.9 / 5", fr: "4,9 / 5" },
    label: { es: "Valoración media", en: "Average rating", fr: "Note moyenne" } },
  { value: { es: "100 %", en: "100%", fr: "100 %" },
    label: { es: "Viajes diseñados a medida", en: "Fully tailor-made trips", fr: "Voyages sur mesure" } },
  { value: { es: "+15 años", en: "15+ years", fr: "+15 ans" },
    label: { es: "Creando viajes por Marruecos", en: "Crafting Moroccan journeys", fr: "À créer des voyages au Maroc" } },
];

export default function OpinionesPage() {
  const { lang } = useLanguage();

  return (
    <main data-testid="opiniones-page" className="bg-[#FDFBF7] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="absolute inset-0 berber-bg-cross opacity-[0.06] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#A07042]">
              <span className="w-8 h-px bg-[#D4A373]" />
              <EditableText slot="opiniones.hero.eyebrow" defaults={{ es: "Opiniones", en: "Reviews", fr: "Avis" }} multiline={false} />
            </span>
            <EditableText
              as="h1"
              slot="opiniones.hero.title"
              defaults={{
                es: "Lo que dicen quienes ya han viajado con nosotros",
                en: "What travellers who've journeyed with us say",
                fr: "Ce que disent ceux qui ont déjà voyagé avec nous",
              }}
              multiline={false}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-[#1A1513] mt-6 block"
            />
            <EditableText
              as="p"
              slot="opiniones.hero.subtitle"
              defaults={{
                es: "Cada viaje que diseñamos es único, pero todos comparten algo: viajeros que vuelven a casa con recuerdos para toda la vida. Estas son sus palabras.",
                en: "Every trip we design is unique, yet they all share one thing: travellers who return home with memories for a lifetime. These are their words.",
                fr: "Chaque voyage que nous concevons est unique, mais tous ont un point commun : des voyageurs qui rentrent avec des souvenirs pour la vie. Voici leurs mots.",
              }}
              className="mt-6 text-base md:text-lg text-[#5C5248] leading-relaxed block"
            />
            <div className="mt-6 flex items-center gap-2 text-[#D4A373]" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-5 h-5 fill-current" strokeWidth={0} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-4" data-testid="opiniones-stats">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-7">
          {STATS.map((s, i) => (
            <div key={i} data-testid={`opiniones-stat-${i + 1}`} className="bg-white border border-[#2C2621]/12 p-7 md:p-8">
              <EditableText
                as="div"
                slot={`opiniones.stat.${i}.value`}
                defaults={s.value}
                multiline={false}
                className="font-serif-x text-4xl md:text-5xl text-[#1A1513] leading-none block"
              />
              <EditableText
                as="div"
                slot={`opiniones.stat.${i}.label`}
                defaults={s.label}
                multiline={false}
                className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[#A07042] block"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Wall of Love */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20" data-testid="opiniones-wall">
        <div className="flex items-center gap-4 mb-10">
          <Heart className="w-5 h-5 text-[#C16542]" strokeWidth={1.7} />
          <EditableText
            as="h2"
            slot="opiniones.wall.title"
            defaults={{ es: "Muro de opiniones", en: "Wall of Love", fr: "Mur d'amour" }}
            multiline={false}
            className="font-serif-x text-2xl md:text-3xl tracking-tight text-[#1A1513]"
          />
          <span className="flex-1 h-px bg-gradient-to-r from-[#D4A373]/50 to-transparent" />
        </div>
        <WallOfLove />
      </section>

      {/* CTA */}
      <section className="bg-[#1A1513] text-[#FDFBF7] berber-bg-cross" data-testid="opiniones-cta">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24 text-center">
          <Quote className="w-8 h-8 text-[#D4A373] mx-auto" strokeWidth={1.4} />
          <EditableText
            as="h2"
            slot="opiniones.cta.title"
            defaults={{
              es: "¿Listo para escribir tu propia historia?",
              en: "Ready to write your own story?",
              fr: "Prêt à écrire votre propre histoire ?",
            }}
            multiline={false}
            className="font-serif-x text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight mt-6 block"
          />
          <EditableText
            as="p"
            slot="opiniones.cta.body"
            defaults={{
              es: "Cuéntanos cómo imaginas tu viaje y diseñaremos contigo una experiencia a medida por Marruecos, sin compromiso.",
              en: "Tell us how you picture your trip and we'll design a tailor-made Moroccan experience with you — no commitment.",
              fr: "Dites-nous comment vous imaginez votre voyage et nous concevrons avec vous une expérience sur mesure au Maroc, sans engagement.",
            }}
            className="mt-5 text-base md:text-lg text-[#FDFBF7]/70 leading-relaxed max-w-2xl mx-auto block"
          />
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={pathFor(lang, "planTrip")}
              data-testid="opiniones-cta-plan"
              className="inline-flex items-center gap-3 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              <EditableText slot="opiniones.cta.plan" defaults={{ es: "Planificar mi viaje", en: "Plan my trip", fr: "Planifier mon voyage" }} multiline={false} />
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
            </Link>
            <Link
              to={pathFor(lang, "contact")}
              data-testid="opiniones-cta-contact"
              className="inline-flex items-center gap-3 border border-[#FDFBF7]/30 hover:border-[#D4A373] hover:text-[#D4A373] text-[#FDFBF7] px-8 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.7} />
              <EditableText slot="opiniones.cta.contact" defaults={{ es: "Contactar", en: "Contact us", fr: "Nous contacter" }} multiline={false} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
