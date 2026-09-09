import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ChevronRight, Globe2, LockKeyhole, Search, X } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { buildNavigationCatalog, filterNavigationCatalog, NAV_CATEGORIES, NAV_TYPES } from "@/lib/navigationCatalog";
import xMonogram from "@/assets/monograma-x-borde.png";

const T = (es, en, fr) => ({ es, en, fr });
const COPY = {
  title: T("Mapa de navegación", "Navigation map", "Plan du site"),
  home: T("Inicio", "Home", "Accueil"),
  eyebrow: T("Todo Xaluca Tours · En un solo lugar", "All of Xaluca Tours · In one place", "Tout Xaluca Tours · Au même endroit"),
  heading: T("Cada camino empieza aquí.", "Every journey starts here.", "Chaque chemin commence ici."),
  intro: T("Viajes, rutas, inspiración y servicios. Explora todas las páginas de nuestra web, organizadas por categorías y con acceso a sus versiones en cada idioma.", "Journeys, routes, inspiration and services. Explore every page on our website, organised by category, with access to each language version.", "Voyages, circuits, inspiration et services. Explorez toutes les pages de notre site, classées par catégorie, et leurs versions dans chaque langue."),
  newTab: T("Los enlaces se abren en una nueva pestaña para que puedas conservar este índice y tu posición en el listado.", "Links open in a new tab so you can keep this index and your position in the list.", "Les liens s’ouvrent dans un nouvel onglet pour conserver cet index et votre position dans la liste."),
  pages: T("páginas", "pages", "pages"),
  page: T("página", "page", "page"),
  urls: T("URLs", "URLs", "URL"),
  url: T("URL", "URL", "URL"),
  categories: T("Categorías", "Categories", "Catégories"),
  browse: T("Explorar el mapa", "Explore the map", "Explorer le plan"),
  search: T("Buscar una página", "Find a page", "Trouver une page"),
  placeholder: T("Nombre, destino o URL…", "Name, destination or URL…", "Nom, destination ou URL…"),
  language: T("URLs por idioma", "URLs by language", "URL par langue"),
  allLanguages: T("Todos los idiomas", "All languages", "Toutes les langues"),
  all: T("Todo el proyecto", "Entire website", "Tout le site"),
  clear: T("Limpiar búsqueda", "Clear search", "Effacer la recherche"),
  reset: T("Ver todas las páginas", "Show every page", "Voir toutes les pages"),
  results: T("Resultados", "Results", "Résultats"),
  empty: T("No encontramos esa página.", "We couldn't find that page.", "Nous n'avons pas trouvé cette page."),
  hint: T("Prueba con otro nombre, destino o fragmento de URL, o elimina los filtros.", "Try another name, destination or part of a URL, or clear the filters.", "Essayez un autre nom, une destination ou un fragment d'URL, ou effacez les filtres."),
  source: T("Índice generado a partir de las rutas de la web y los artículos publicados. Incluye las URLs alternativas de los programas y agrupa los enlaces idénticos para no repetirlos.", "Generated from the website routes and published articles. Includes alternative programme URLs and groups identical links to avoid duplicates.", "Index généré à partir des routes du site et des articles publiés. Les URL alternatives des programmes sont incluses et les liens identiques sont regroupés."),
  restricted: T("Este acceso requiere autorización. No da acceso a contenido privado sin iniciar sesión.", "This area requires authorisation. Private content still requires sign-in.", "Cet espace nécessite une autorisation. Une connexion reste nécessaire pour accéder au contenu privé."),
  shared: T("Única", "Shared", "Unique"),
};
const LANGUAGES = { es: "Español", en: "English", fr: "Français" };
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C16542]";

export default function NavigationMapPage() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("all");
  const entries = useMemo(buildNavigationCatalog, []);
  const visible = useMemo(() => filterNavigationCatalog(entries, { query, category, language }), [entries, query, category, language]);
  const categoryMatches = useMemo(() => filterNavigationCatalog(entries, { query, language }), [entries, query, language]);
  const categories = Object.keys(NAV_CATEGORIES).filter((key) => entries.some((entry) => entry.category === key));
  const copy = (key) => pick(COPY[key], lang);
  const urlCount = (items) => items.reduce((total, entry) => total + entry.urls.length, 0);
  const reset = () => { setQuery(""); setCategory("all"); setLanguage("all"); };

  return (
    <div data-testid="navigation-map-page" className="bg-[#F7F0E6] text-[#2C2621]">
      <section className="relative overflow-hidden bg-[#1A1513] pb-14 pt-40 text-[#FDFBF7] md:pb-16 md:pt-48">
        <div className="pointer-events-none absolute inset-0 berber-bg-cross opacity-50" aria-hidden="true" />
        <img src={xMonogram} alt="" aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-[95%] max-w-none opacity-[0.12]" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#FDFBF7]/70">
            <Link to={pathFor(lang, "home")} target="_blank" rel="noopener noreferrer" aria-describedby="nav-new-tab-hint" className={`hover:text-[#D4A373] ${focus}`}>{copy("home")}</Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" /><span aria-current="page" className="text-[#D4A373]">{copy("title")}</span>
          </nav>
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A373]">
            <Globe2 className="h-4 w-4 shrink-0" aria-hidden="true" />{copy("eyebrow")}
          </div>
          <h1 className="mt-5 font-serif-x text-4xl sm:text-5xl lg:text-6xl">{copy("title")}</h1>
          <p className="mt-4 font-serif-x text-2xl text-[#D4A373] md:text-3xl">{copy("heading")}</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#FDFBF7]/75 md:text-base">{copy("intro")}</p>
          <p id="nav-new-tab-hint" className="mt-3 max-w-2xl text-xs leading-6 text-[#D4A373]">{copy("newTab")}</p>
          <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6">
            <dl className="flex gap-7 sm:gap-10">
              {[[entries.length, "pages"], [urlCount(entries), "urls"], [categories.length, "categories"]].map(([value, key]) => (
                <div key={key} className="flex flex-col-reverse gap-1">
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-[#FDFBF7]/65">{copy(key)}</dt>
                  <dd className="font-serif-x text-4xl text-[#FDFBF7]">{value}</dd>
                </div>
              ))}
            </dl>
            <a href="#navigation-index" className={`inline-flex min-h-12 items-center gap-3 border border-[#D4A373]/50 px-5 py-3 text-[10px] uppercase tracking-[0.15em] transition-colors hover:bg-[#D4A373] hover:text-[#1A1513] ${focus}`}>
              {copy("browse")}<ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="navigation-index" className="mx-auto max-w-7xl scroll-mt-32 px-6 py-10 md:px-12 md:py-14" aria-label={copy("title")}>
        <div className="mb-9 grid gap-5 border border-[#2C2621]/15 bg-[#FDFBF7] p-5 sm:grid-cols-[1fr_220px] sm:p-6" role="search" aria-label={copy("search")}>
          <div className="min-w-0">
            <label htmlFor="nav-search" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em]">{copy("search")}</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-[#8A7760]" aria-hidden="true" />
              <input id="nav-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy("placeholder")} className={`min-h-12 w-full min-w-0 appearance-none border border-[#2C2621]/20 bg-transparent py-3 pl-11 pr-12 text-base [&::-webkit-search-cancel-button]:appearance-none ${focus}`} />
              {query && <button type="button" onClick={() => setQuery("")} aria-label={copy("clear")} className={`absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[#675D54] ${focus}`}><X className="h-4 w-4" aria-hidden="true" /></button>}
            </div>
          </div>
          <div>
            <label htmlFor="nav-language" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em]">{copy("language")}</label>
            <select id="nav-language" value={language} onChange={(event) => setLanguage(event.target.value)} className={`min-h-12 w-full border border-[#2C2621]/20 bg-transparent px-3 text-base ${focus}`}>
              <option value="all">{copy("allLanguages")}</option>
              {Object.entries(LANGUAGES).map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="min-w-0 lg:sticky lg:top-32 lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto lg:pr-1" aria-label={copy("categories")}>
            <h2 className="mb-4 hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-[#675D54] lg:block">{copy("categories")}</h2>
            <label htmlFor="nav-category" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] lg:hidden">{copy("categories")}</label>
            <select id="nav-category" value={category} onChange={(event) => setCategory(event.target.value)} className={`min-h-12 w-full border border-[#2C2621]/20 bg-[#FDFBF7] px-3 text-base lg:hidden ${focus}`}>
              {["all", ...categories].map((key) => <option key={key} value={key}>{key === "all" ? copy("all") : pick(NAV_CATEGORIES[key], lang)} ({categoryMatches.filter((entry) => key === "all" || entry.category === key).length})</option>)}
            </select>
            <div className="hidden gap-1 lg:grid">
              {["all", ...categories].map((key) => {
                const count = categoryMatches.filter((entry) => key === "all" || entry.category === key).length;
                return <button key={key} type="button" aria-pressed={category === key} onClick={() => setCategory(key)} className={`flex min-h-11 items-center justify-between gap-3 border-l-2 px-3 py-3 text-left text-xs transition-colors ${focus} ${category === key ? "border-[#C16542] bg-[#C16542]/10 text-[#9C482C]" : "border-transparent text-[#675D54] hover:bg-[#2C2621]/5"}`}>
                  <span>{key === "all" ? copy("all") : pick(NAV_CATEGORIES[key], lang)}</span><span className="text-[10px] tabular-nums">{count}</span>
                </button>;
              })}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-[#2C2621]/15 pb-4">
              <p role="status" className="text-xs text-[#675D54]">{copy("results")}: <span className="font-semibold text-[#2C2621]">{visible.length}</span> {copy(visible.length === 1 ? "page" : "pages")} · {urlCount(visible)} {copy(urlCount(visible) === 1 ? "url" : "urls")}</p>
              {(query || category !== "all" || language !== "all") && <button type="button" onClick={reset} className={`min-h-11 text-xs text-[#9C482C] underline underline-offset-4 ${focus}`}>{copy("reset")}</button>}
            </div>
            {!visible.length && <div className="border border-[#2C2621]/15 bg-[#FDFBF7] p-8 text-center">
              <h2 className="font-serif-x text-3xl">{copy("empty")}</h2><p className="mt-3 text-sm leading-6 text-[#675D54]">{copy("hint")}</p>
            </div>}
            {categories.map((key) => {
              const group = visible.filter((entry) => entry.category === key);
              if (!group.length) return null;
              return <section key={key} aria-labelledby={`nav-category-${key}`} className="mb-10 last:mb-0">
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="text-[10px] tracking-widest text-[#9C482C]">{String(categories.indexOf(key) + 1).padStart(2, "0")}</span>
                  <h2 id={`nav-category-${key}`} className="font-serif-x text-2xl sm:text-3xl">{pick(NAV_CATEGORIES[key], lang)}</h2>
                </div>
                {key === "administration" && <p className="mb-4 text-xs leading-6 text-[#675D54]">{copy("restricted")}</p>}
                <ul className="divide-y divide-[#2C2621]/10 border border-[#2C2621]/15 bg-[#FDFBF7]">
                  {group.map((entry) => {
                    const preferred = entry.urls.find((url) => url.lang === lang) || entry.urls[0];
                    return <li key={entry.id} data-nav-entry={entry.id} className="p-5 sm:p-6">
                      <div className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#675D54]">
                        {entry.type === "restricted" && <LockKeyhole className="h-3 w-3" aria-hidden="true" />}{pick(NAV_TYPES[entry.type], lang)}
                      </div>
                      <h3 className="mb-3 font-serif-x text-xl leading-snug">
                        <Link to={preferred.path} target="_blank" rel="noopener noreferrer" aria-describedby="nav-new-tab-hint" className={`group flex items-start justify-between gap-3 hover:text-[#9C482C] ${focus}`}>
                          <span>{pick(entry.title, lang)}</span><ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#9C482C] transition-transform group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
                        </Link>
                      </h3>
                      <ul className="space-y-1">
                        {entry.urls.map((url) => <li key={url.path}>
                          <Link to={url.path} target="_blank" rel="noopener noreferrer" aria-describedby="nav-new-tab-hint" hrefLang={url.lang || undefined} data-nav-url={url.path} className={`flex min-h-11 items-center gap-3 border-l border-[#C16542]/30 py-2 pl-3 text-xs text-[#675D54] transition-colors hover:border-[#C16542] hover:bg-[#C16542]/5 hover:text-[#9C482C] ${focus}`}>
                            <span className="w-6 shrink-0 text-[9px] font-semibold uppercase" title={LANGUAGES[url.lang]}>{url.lang || copy("shared")}</span>
                            <span className="min-w-0 break-all leading-5">{url.path}</span>
                          </Link>
                        </li>)}
                      </ul>
                    </li>;
                  })}
                </ul>
              </section>;
            })}
            <p className="mt-8 border-t border-[#2C2621]/15 pt-6 text-xs leading-6 text-[#675D54]">{copy("source")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
