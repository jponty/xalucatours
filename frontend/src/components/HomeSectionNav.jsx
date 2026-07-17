import React from "react";
import SectionNav from "@/components/SectionNav";

/* Home in-page navigation — uses the shared robust <SectionNav>. */

const SECTIONS = [
  { id: "buscador",  label: { es: "Buscador",        en: "Search",          fr: "Recherche" } },
  { id: "destinos",  label: { es: "Dónde viajamos",  en: "Where we travel", fr: "Où voyager" } },
  { id: "ruleta",    label: { es: "Ruleta Xaluca",   en: "Xaluca Wheel",    fr: "Roue Xaluca" } },
  { id: "por-que",   label: { es: "Por qué Xaluca",  en: "Why Xaluca",      fr: "Pourquoi Xaluca" } },
  { id: "viajes",    label: { es: "Nuestros viajes", en: "Our trips",       fr: "Nos voyages" } },
  { id: "opiniones", label: { es: "Opiniones",       en: "Reviews",         fr: "Avis" } },
  { id: "contacto",  label: { es: "Contacto",        en: "Contact",         fr: "Contact" } },
];

export default function HomeSectionNav() {
  return <SectionNav items={SECTIONS} testid="home-section-nav" />;
}
