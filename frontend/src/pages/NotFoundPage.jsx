import React from "react";
import { Link } from "react-router-dom";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import SeoHead from "@/components/SeoHead";

const T = (es, en, fr) => ({ es, en, fr });

export default function NotFoundPage() {
  const { lang } = useLanguage();
  const title = pick(T("Página no encontrada", "Page not found", "Page introuvable"), lang);
  return <main className="min-h-[65vh] bg-[#F7F1E8] px-6 py-28 text-[#2C2621]">
    <SeoHead title={`${title} · Xaluca Tours`} description={title} lang={lang} noindex />
    <div className="mx-auto max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B45F42]">404</p>
      <h1 className="mt-5 font-serif-x font-semibold text-4xl md:text-6xl">{title}</h1>
      <p className="mt-6 text-lg leading-relaxed">{pick(T("La dirección que has abierto no existe o ya no está disponible.", "The address you opened does not exist or is no longer available.", "L’adresse que vous avez ouverte n’existe pas ou n’est plus disponible."), lang)}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="inline-flex bg-[#C16542] px-6 py-4 text-sm font-semibold text-white" to={pathFor(lang, "home")}>{pick(T("Volver al inicio", "Back to home", "Retour à l’accueil"), lang)}</Link>
        <Link className="inline-flex border border-[#C16542] px-6 py-4 text-sm font-semibold text-[#9B4B31]" to={pathFor(lang, "toursLanding")}>{pick(T("Explorar viajes", "Explore tours", "Découvrir les voyages"), lang)}</Link>
      </div>
    </div>
  </main>;
}
