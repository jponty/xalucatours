/* ============================================================
   CatalogoPage.jsx  ·  /catalogo · /en/catalogue · /fr/catalogue
   ----
   Embeds the Publuu flipbook catalogue as the primary content of
   the page. Light editorial hero + a single full-bleed iframe
   section. Nothing else on the page is changed.
============================================================ */
import React, { useEffect } from "react";
import { BookOpen, Download, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SlotScope, useSlotId } from "@/components/slotScope";
import EditableText from "@/components/EditableText";

const COPY = {
  eyebrow: { es: "Catálogo digital · Xaluca Tours",
             en: "Digital catalogue · Xaluca Tours",
             fr: "Catalogue numérique · Xaluca Tours" },
  title:   { es: "Hojea nuestro catálogo de viajes",
             en: "Browse our travel catalogue",
             fr: "Feuilletez notre catalogue de voyages" },
  body:    { es: "Recorre todas nuestras rutas por Marruecos en formato revista — itinerarios, mapas y fotografía editorial, todo en un mismo flipbook.",
             en: "Flip through every Moroccan route we offer — itineraries, maps and editorial photography in a single magazine-style flipbook.",
             fr: "Parcourez toutes nos routes au Maroc — itinéraires, cartes et photographie éditoriale dans un seul flipbook." },
  openExternal: { es: "Abrir en pestaña nueva", en: "Open in new tab", fr: "Ouvrir dans un nouvel onglet" },
};

/* Inline-CMS per-page text editor (auto-namespaced by page path). */
const ET = ({ k, as = "span", className, multiline = true, defaults, ...rest }) => {
  const slot = useSlotId(k);
  return <EditableText slot={slot} defaults={defaults || COPY[k] || {}} as={as} className={className} multiline={multiline} {...rest} />;
};

const FLIPBOOK_URL = "https://xalucatours.publuu.com";

const CatalogoPage = () => {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = ({
      es: "Catálogo · Xaluca Tours",
      en: "Catalogue · Xaluca Tours",
      fr: "Catalogue · Xaluca Tours",
    })[lang] || "Catálogo · Xaluca Tours";
  }, [lang]);

  return (
    <SlotScope id="catalogo">
      <main data-testid="catalogo-page" className="bg-[#FDFBF7]">

        {/* Light editorial header */}
        <section
          data-testid="catalogo-header"
          className="pt-[120px] md:pt-[140px] pb-10 md:pb-14 border-b border-[#2C2621]/10"
        >
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.35em] uppercase text-[#C16542] mb-5">
              <BookOpen className="w-3.5 h-3.5" strokeWidth={1.6} />
              <ET k="eyebrow" multiline={false} />
            </div>
            <ET k="title" as="h1" multiline={false} className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2621] leading-tight tracking-tight max-w-3xl" />
            <ET k="body" as="p" className="mt-5 max-w-2xl text-[14px] md:text-base text-[#5C5248] leading-relaxed" />
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={FLIPBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="catalogo-open-external"
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#2C2621] border border-[#2C2621]/25 hover:border-[#C16542] hover:text-[#C16542] px-4 py-2.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.7} />
                <ET k="openExternal" multiline={false} />
              </a>
            </div>
          </div>
        </section>

        {/* Publuu flipbook embed — exact iframe provided by the user, wrapped in
            a responsive section so it integrates cleanly with the site grid. */}
        <section data-testid="catalogo-flipbook" className="py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <iframe
              src={FLIPBOOK_URL}
              title="Xaluca Tours · Catálogo Publuu"
              style={{ border: "none" }}
              scrolling="auto"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              height="700px"
              width="100%"
              allow="clipboard-write; autoplay; fullscreen"
              data-testid="catalogo-flipbook-iframe"
            />
          </div>
        </section>

      </main>
    </SlotScope>
  );
};

export default CatalogoPage;
