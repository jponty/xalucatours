import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, ChevronRight, Compass, Sparkles, ArrowRight, ArrowUpRight, Clock,
  Quote, Lightbulb,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { POSTS, CATEGORIES, getPostBySlug, getPostsByCategory } from "@/lib/blog";
import { banner } from "@/lib/imageBank";
import EditableImage from "@/components/EditableImage";
import { SlotScope } from "@/components/slotScope";

const COPY = {
  breadcrumb: { es: "Inicio",  en: "Home",  fr: "Accueil" },
  blogLabel:  { es: "Blog",    en: "Blog",  fr: "Blog" },
  hero: {
    eyebrow: { es: "Diario de viajes · sur de Marruecos", en: "Travel journal · southern Morocco", fr: "Carnet de voyage · sud du Maroc" },
    place:   { es: "Crónicas desde el desierto", en: "Dispatches from the desert", fr: "Chroniques du désert" },
    title: {
      es: "Historias, rutas y consejos del sur de Marruecos.",
      en: "Stories, routes and tips from southern Morocco.",
      fr: "Récits, itinéraires et conseils du sud du Maroc.",
    },
    subtitle: {
      es: "Lo que aprendemos en el camino — desierto, kasbahs, eventos deportivos y cultura bereber — contado por las personas que llevan 25 años recorriéndolo.",
      en: "What we learn on the road — desert, kasbahs, sporting events and Berber culture — told by people who've travelled it for 25 years.",
      fr: "Ce que nous apprenons en chemin — désert, kasbahs, événements sportifs et culture berbère — raconté par ceux qui le parcourent depuis 25 ans.",
    },
  },
  readingTime: { es: "min de lectura", en: "min read", fr: "min de lecture" },
  readPost:    { es: "Leer artículo",  en: "Read article", fr: "Lire l'article" },
  noResults:   { es: "No hay artículos en esta categoría todavía.",
                 en: "No articles in this category yet.",
                 fr: "Aucun article dans cette catégorie pour le moment." },
};

const fmtDate = (iso, lang) => {
  try {
    const map = { es: "es-ES", en: "en-GB", fr: "fr-FR" };
    return new Date(iso).toLocaleDateString(map[lang] || "es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso; }
};

/* ============================================================
   Blog index
============================================================ */
const InlineBreadcrumb = ({ lang, postTitle }) => (
  <nav
    aria-label="Breadcrumb"
    data-testid="blog-breadcrumbs"
    className="inline-flex items-center gap-2 bg-[#1A1513]/55 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[#FDFBF7]/90"
  >
    <Link to={pathFor(lang, "home")} className="flex items-center gap-1.5 hover:text-[#D4A373] transition-colors">
      <Home className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
      <span>{pick(COPY.breadcrumb, lang)}</span>
    </Link>
    <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
    {postTitle ? (
      <>
        <Link to={pathFor(lang, "blog")} className="hover:text-[#D4A373] transition-colors">{pick(COPY.blogLabel, lang)}</Link>
        <ChevronRight className="w-3 h-3 text-[#FDFBF7]/40" strokeWidth={1.6} />
        <span className="text-[#D4A373] truncate max-w-[60vw]">{postTitle}</span>
      </>
    ) : (
      <span className="text-[#D4A373]">{pick(COPY.blogLabel, lang)}</span>
    )}
  </nav>
);

const Hero = ({ lang, postTitle }) => (
  <section data-testid="blog-hero" className="relative w-full overflow-hidden bg-[#1A1513] pt-[88px] md:pt-[96px] pb-20 md:pb-28">
    <EditableImage
      slot="blog.hero"
      fallback={banner("camelCaravan", 2400)}
      alt=""
      aspectRatio="auto"
      imgProps={{ loading: "eager" }}
      className="ken-burns absolute inset-0 w-full h-full object-cover opacity-40"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/70 to-[#1A1513]/40 pointer-events-none" />
    <div className="absolute inset-0 berber-bg-cross opacity-30 pointer-events-none" aria-hidden="true" />
    <span className="film-grain pointer-events-none" />

    <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-6 md:pt-10">
      <InlineBreadcrumb lang={lang} postTitle={postTitle} />
      {!postTitle && (
        <div className="max-w-3xl mt-10 md:mt-16">
          <div className="fade-up inline-flex items-center gap-3 text-[#D4A373]">
            <Compass className="w-3.5 h-3.5" strokeWidth={1.6} />
            <span className="text-[11px] tracking-[0.35em] uppercase font-semibold">{pick(COPY.hero.eyebrow, lang)}</span>
            <span className="w-8 h-px bg-[#D4A373]/50" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4A373]/80">{pick(COPY.hero.place, lang)}</span>
          </div>
          <h1 className="fade-up fade-up-delay-1 font-serif-x text-[#FDFBF7] text-4xl md:text-5xl lg:text-[64px] leading-[1.04] tracking-tight mt-6">
            {pick(COPY.hero.title, lang)}
          </h1>
          <p className="fade-up fade-up-delay-2 mt-6 max-w-2xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed">
            {pick(COPY.hero.subtitle, lang)}
          </p>
        </div>
      )}
    </div>
  </section>
);

const PostCard = ({ post, lang, featured = false }) => {
  const cat = CATEGORIES.find((c) => c.id === post.category);
  return (
    <SlotScope id={post.slug}>
      <Link
        to={pathFor(lang, "blog") + "/" + post.slug}
        data-testid={`blog-card-${post.slug}`}
        className={`group flex flex-col bg-[#FDFBF7] border border-[#2C2621]/10 hover:border-[#2C2621]/30 transition-colors duration-300 overflow-hidden ${featured ? "md:col-span-2 md:flex-row" : ""}`}
      >
        <div className={`relative overflow-hidden bg-[#1A1513] ${featured ? "md:w-1/2 aspect-[4/3] md:aspect-auto" : "aspect-[4/3]"}`}>
          <EditableImage
            name="cover"
            fallback={post.cover}
            alt={pick(post.title, lang)}
            aspectRatio="auto"
            imgProps={{ loading: "lazy" }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/40 to-transparent pointer-events-none" />
          {cat && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase text-[#C16542]">
              {pick(cat.label, lang)}
            </span>
          )}
        </div>
        <div className={`p-6 md:p-7 flex flex-col flex-1 ${featured ? "md:w-1/2 md:p-9" : ""}`}>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#5C5248]">
            <span>{fmtDate(post.publishedAt, lang)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" strokeWidth={1.8} />
              {post.readingTime} {pick(COPY.readingTime, lang)}
            </span>
          </div>
          <h3 className={`font-serif-x text-[#2C2621] mt-4 leading-[1.12] ${featured ? "text-2xl md:text-[34px]" : "text-xl md:text-[24px]"}`}>
            {pick(post.title, lang)}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#5C5248] flex-1">
            {pick(post.excerpt, lang)}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-[#C16542] group-hover:gap-2.5 transition-all">
            {pick(COPY.readPost, lang)}
            <ArrowUpRight className="w-3 h-3" strokeWidth={1.8} />
          </span>
        </div>
      </Link>
    </SlotScope>
  );
};

const BlogIndexBody = ({ lang }) => {
  const [active, setActive] = useState("all");
  const filtered = useMemo(() => getPostsByCategory(active), [active]);
  const [featured, ...rest] = filtered;

  return (
    <section data-testid="blog-index" className="relative bg-[#FDFBF7] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div data-testid="blog-categories" role="tablist" className="flex flex-wrap gap-2 mb-10 md:mb-12">
          {CATEGORIES.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                type="button"
                data-testid={`blog-cat-${c.id}`}
                onClick={() => setActive(c.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.2em] uppercase border transition-all duration-200 ${
                  isActive
                    ? "bg-[#C16542] border-transparent text-[#FDFBF7]"
                    : "bg-[#FDFBF7] border-[#2C2621]/20 text-[#2C2621] hover:border-[#C16542] hover:text-[#C16542]"
                }`}
              >
                {pick(c.label, lang)}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p data-testid="blog-empty" className="text-base text-[#5C5248]">{pick(COPY.noResults, lang)}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured && <PostCard post={featured} lang={lang} featured />}
            {rest.map((p) => (
              <PostCard key={p.id} post={p} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default function BlogPage() {
  const { lang } = useLanguage();
  useEffect(() => {
    document.title = ({
      es: "Blog · Viajes y aventuras por el sur de Marruecos · Xaluca",
      en: "Blog · Travel and adventures in southern Morocco · Xaluca",
      fr: "Blog · Voyages et aventures dans le sud du Maroc · Xaluca",
    })[lang] || "Blog · Xaluca Tours";
  }, [lang]);

  return (
    <div data-testid="blog-page" className="bg-[#FDFBF7]">
      <Hero lang={lang} />
      <BlogIndexBody lang={lang} />
    </div>
  );
}

/* ============================================================
   Single blog post
============================================================ */
const renderBlock = (block, lang, i) => {
  if (block.type === "h2") {
    return (
      <h2 key={i} className="font-serif-x text-3xl md:text-[36px] leading-[1.12] text-[#2C2621] mt-12 md:mt-16">
        {pick(block.text, lang)}
      </h2>
    );
  }
  if (block.type === "p") {
    return (
      <p key={i} className="mt-5 text-base md:text-lg text-[#3F352E] leading-[1.75]">
        {pick(block.text, lang)}
      </p>
    );
  }
  if (block.type === "list") {
    return (
      <ul key={i} className="mt-6 space-y-3">
        {block.items.map((it, j) => (
          <li key={j} className="flex gap-3 text-base md:text-lg text-[#3F352E] leading-[1.7]">
            <span className="text-[#C16542] flex-shrink-0 mt-2">·</span>
            <span>{pick(it, lang)}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote key={i} className="mt-10 md:mt-12 pl-6 md:pl-8 border-l-2 border-[#C16542] flex flex-col gap-3">
        <Quote className="w-6 h-6 text-[#C16542]/40" strokeWidth={1.4} aria-hidden="true" />
        <p className="font-serif-x text-2xl md:text-[28px] leading-[1.3] text-[#2C2621] italic">
          {pick(block.text, lang)}
        </p>
        {block.by && (
          <cite className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248] not-italic">— {pick(block.by, lang)}</cite>
        )}
      </blockquote>
    );
  }
  if (block.type === "callout") {
    return (
      <aside key={i} className="mt-10 md:mt-12 bg-[#F2EBE1] border-l-2 border-[#C16542] px-5 py-5 md:px-6 md:py-6">
        <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#C16542]">
          <Lightbulb className="w-3.5 h-3.5" strokeWidth={1.8} />
          {pick(block.title, lang)}
        </p>
        <p className="mt-2 text-base text-[#3F352E] leading-relaxed">
          {pick(block.text, lang)}
        </p>
      </aside>
    );
  }
  return null;
};

export function BlogPostPage() {
  const { lang } = useLanguage();
  const location = useLocation();
  const slug = useMemo(() => {
    const m = location.pathname.match(/\/blog\/([^/?#]+)\/?$/);
    return m ? m[1] : "";
  }, [location.pathname]);
  const post = useMemo(() => getPostBySlug(slug), [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${pick(post.title, lang)} · Blog · Xaluca`;
    }
  }, [post, lang]);

  if (!post) {
    return (
      <div data-testid="blog-post-not-found" className="bg-[#FDFBF7] min-h-[60vh] pt-32 md:pt-40 px-6 md:px-12 max-w-3xl mx-auto">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C16542]">404</p>
        <h1 className="font-serif-x text-4xl md:text-5xl text-[#2C2621] mt-3 leading-tight">
          {({ es: "Artículo no encontrado", en: "Article not found", fr: "Article introuvable" })[lang]}
        </h1>
        <Link
          to={pathFor(lang, "blog")}
          className="mt-8 inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-6 py-3 text-[11px] tracking-[0.22em] uppercase"
        >
          {({ es: "Volver al blog", en: "Back to the blog", fr: "Retour au blog" })[lang]}
          <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
        </Link>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === post.category);
  const related = POSTS.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div data-testid={`blog-post-${post.slug}`} className="bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative w-full bg-[#1A1513] overflow-hidden pt-[88px] md:pt-[96px]">
        <SlotScope id={post.slug}>
          <EditableImage
            name="cover"
            fallback={post.cover}
            alt={pick(post.title, lang)}
            aspectRatio="auto"
            imgProps={{ loading: "eager" }}
            className="ken-burns absolute inset-0 w-full h-full object-cover opacity-40"
          />
        </SlotScope>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/75 to-[#1A1513]/40 pointer-events-none" />
        <div className="absolute inset-0 berber-bg-cross opacity-25 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-8 pb-20 md:pb-28">
          <InlineBreadcrumb lang={lang} postTitle={pick(post.title, lang)} />
          <div className="mt-10 md:mt-14 flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-[#D4A373]">
            {cat && <span>{pick(cat.label, lang)}</span>}
            <span className="w-6 h-px bg-[#D4A373]/40" />
            <span className="text-[#FDFBF7]/70">{fmtDate(post.publishedAt, lang)}</span>
            <span className="text-[#FDFBF7]/40">·</span>
            <span className="text-[#FDFBF7]/70 inline-flex items-center gap-1">
              <Clock className="w-3 h-3" strokeWidth={1.8} />
              {post.readingTime} {pick(COPY.readingTime, lang)}
            </span>
          </div>
          <h1 className="fade-up font-serif-x text-[#FDFBF7] text-4xl md:text-5xl lg:text-[56px] leading-[1.04] tracking-tight mt-5">
            {pick(post.title, lang)}
          </h1>
          <p className="fade-up fade-up-delay-1 mt-6 text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed max-w-2xl">
            {pick(post.excerpt, lang)}
          </p>
        </div>
      </section>

      {/* Body */}
      <article className="relative max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28">
        {post.body.map((block, i) => renderBlock(block, lang, i))}

        <div className="mt-16 pt-8 border-t border-[#2C2621]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-[10px] tracking-[0.25em] uppercase text-[#5C5248]">
            {({ es: "Por", en: "By", fr: "Par" })[lang]}{" "}
            <span className="text-[#2C2621]">{post.author}</span>
          </div>
          <Link
            to={pathFor(lang, "blog")}
            data-testid="blog-post-back"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#C16542] hover:text-[#A8533A] border-b border-[#C16542]/40 pb-0.5 transition-colors"
          >
            ← {({ es: "Todos los artículos", en: "All articles", fr: "Tous les articles" })[lang]}
          </Link>
        </div>
      </article>

      {/* Contextual CTA → real trip */}
      {post.cta && (
        <section
          data-testid={`blog-cta-${post.slug}`}
          className="relative bg-[#1A1513] py-20 md:py-24 overflow-hidden border-t border-[#FDFBF7]/10"
        >
          <EditableImage
            slot={`blog.${post.slug}.cta-bg`}
            fallback={post.cover}
            alt=""
            aspectRatio="auto"
            imgProps={{ loading: "lazy" }}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513] via-[#1A1513]/85 to-[#1A1513]/60 pointer-events-none" />
          <div className="absolute inset-0 berber-bg-diamond opacity-20 pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-4xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <span className="overline inline-flex items-center gap-2 text-[#D4A373]">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
                {pick(post.cta.eyebrow, lang)}
              </span>
              <h2 className="font-serif-x text-3xl md:text-4xl lg:text-[44px] leading-[1.08] tracking-tight mt-3 text-[#FDFBF7]">
                {pick(post.cta.title, lang)}
              </h2>
              <p className="mt-4 text-base md:text-lg text-[#FDFBF7]/80 leading-relaxed">
                {pick(post.cta.body, lang)}
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                to={pathFor(lang, post.cta.route)}
                data-testid={`blog-cta-link-${post.slug}`}
                className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A8533A] text-[#FDFBF7] px-7 py-3.5 text-sm tracking-[0.18em] uppercase transition-colors"
              >
                {({ es: "Ver este viaje", en: "View this trip", fr: "Voir ce voyage" })[lang]}
                <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section data-testid="blog-related" className="relative bg-[#F2EBE1] py-20 md:py-24 border-t border-[#2C2621]/10 overflow-hidden">
          <div className="absolute inset-0 berber-bg-diamond opacity-40 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-6 md:px-12">
            <span className="overline inline-flex items-center gap-2 text-[#C16542] mb-6">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.6} />
              {({ es: "Sigue leyendo", en: "Keep reading", fr: "Continuer la lecture" })[lang]}
            </span>
            <h2 className="font-serif-x text-3xl md:text-4xl leading-tight text-[#2C2621] mb-10 max-w-2xl">
              {({ es: "Más historias de la misma categoría.", en: "More stories in the same category.", fr: "Plus de récits dans la même catégorie." })[lang]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {related.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
