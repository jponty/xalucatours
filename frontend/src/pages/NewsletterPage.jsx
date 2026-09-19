import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown, ArrowRight, BookOpen, Compass, Lightbulb, Mail,
  MapPinned, Sparkles, Users,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { IMG } from "@/lib/imageBank";
import EditableImage from "@/components/EditableImage";
import HeroMonogram from "@/components/HeroMonogram";
import NewsletterSignup from "@/components/NewsletterSignup";
import { SlotScope } from "@/components/slotScope";

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  eyebrow: T("Newsletter Xaluca Tours", "Xaluca Tours Newsletter", "Newsletter Xaluca Tours"),
  title: T(
    "Inspírate para tu próximo viaje a Marruecos.",
    "Find inspiration for your next journey to Morocco.",
    "Inspirez-vous pour votre prochain voyage au Maroc."
  ),
  intro: T(
    "Suscríbete a nuestra newsletter y recibe nuevos viajes, rutas, experiencias, recomendaciones y consejos para descubrir Marruecos y preparar tu próxima aventura.",
    "Subscribe to our newsletter for new journeys, routes, experiences, recommendations and advice to discover Morocco and prepare your next adventure.",
    "Inscrivez-vous à notre newsletter pour recevoir de nouveaux voyages, itinéraires, expériences, recommandations et conseils afin de découvrir le Maroc et préparer votre prochaine aventure."
  ),
  introSecondary: T(
    "Compartimos solo información que creemos que merece la pena: nuevos destinos, propuestas de viaje, lugares especiales y novedades de Xaluca Tours.",
    "We only share information we believe is worthwhile: new destinations, travel ideas, special places and the latest from Xaluca Tours.",
    "Nous partageons uniquement des informations qui en valent la peine : nouvelles destinations, idées de voyage, lieux d’exception et actualités de Xaluca Tours."
  ),
  subscribe: T("Suscribirme", "Subscribe", "M’inscrire"),
  contentsEyebrow: T("Ideas seleccionadas para viajar", "Selected travel inspiration", "Des idées de voyage sélectionnées"),
  contentsTitle: T("¿Qué encontrarás en nuestra newsletter?", "What will you find in our newsletter?", "Que trouverez-vous dans notre newsletter ?"),
  contentsIntro: T(
    "Una selección editorial para descubrir Marruecos, imaginar nuevas rutas y preparar cada viaje con más contexto.",
    "An editorial selection to discover Morocco, imagine new routes and prepare every journey with more context.",
    "Une sélection éditoriale pour découvrir le Maroc, imaginer de nouveaux itinéraires et préparer chaque voyage avec davantage de repères."
  ),
  emotionalEyebrow: T("Marruecos, directamente en tu bandeja de entrada", "Morocco, delivered to your inbox", "Le Maroc, directement dans votre boîte mail"),
  emotionalTitle: T("Menos correos. Más ganas de viajar.", "Fewer emails. More desire to travel.", "Moins d’e-mails. Plus d’envie de voyager."),
  emotionalBody: T(
    "No queremos llenar tu bandeja de entrada. Queremos aparecer cuando tengamos algo interesante que contarte sobre Marruecos: un nuevo viaje, un lugar que descubrir, una experiencia especial o un consejo que pueda ayudarte a preparar mejor tu próxima aventura.",
    "We do not want to fill your inbox. We want to be there when we have something genuinely interesting to share about Morocco: a new journey, a place to discover, a special experience or advice that can help you prepare your next adventure.",
    "Nous ne voulons pas remplir votre boîte mail. Nous souhaitons vous écrire lorsque nous avons quelque chose d’intéressant à partager sur le Maroc : un nouveau voyage, un lieu à découvrir, une expérience particulière ou un conseil pour mieux préparer votre prochaine aventure."
  ),
  specialistsEyebrow: T("Especialistas en Marruecos", "Morocco specialists", "Spécialistes du Maroc"),
  specialistsTitle: T("Conocimiento del destino, compartido contigo.", "Destination knowledge, shared with you.", "Notre connaissance de la destination, partagée avec vous."),
  specialistsBody: T(
    "Detrás de cada recomendación hay un equipo especializado en Marruecos. La newsletter es también una forma de compartir parte de nuestro conocimiento, nuestra inspiración y la experiencia acumulada acompañando a quienes quieren descubrir el país.",
    "Behind every recommendation is a team specialising in Morocco. The newsletter is another way for us to share our knowledge, inspiration and experience with people who are thinking about discovering the country.",
    "Derrière chaque recommandation se trouve une équipe spécialiste du Maroc. La newsletter est aussi une façon de partager notre connaissance, notre inspiration et notre expérience avec celles et ceux qui souhaitent découvrir le pays."
  ),
  meetTeam: T("Conoce a nuestro equipo", "Meet our team", "Découvrez notre équipe"),
  formEyebrow: T("Tu próxima aventura empieza aquí", "Your next adventure starts here", "Votre prochaine aventure commence ici"),
  formTitle: T("Recibe Marruecos con calma y con criterio.", "Discover Morocco, thoughtfully curated.", "Recevez le Maroc, avec justesse et sans précipitation."),
};

const CONTENT_ITEMS = [
  {
    Icon: Compass,
    title: T("Nuevos viajes y rutas", "New journeys and routes", "Nouveaux voyages et itinéraires"),
    body: T(
      "Descubre nuevas propuestas e itinerarios para conocer Marruecos de diferentes maneras.",
      "Discover new ideas and itineraries for experiencing Morocco in different ways.",
      "Découvrez de nouvelles propositions et de nouveaux itinéraires pour parcourir le Maroc autrement."
    ),
  },
  {
    Icon: MapPinned,
    title: T("Lugares que merece la pena descubrir", "Places worth discovering", "Des lieux qui méritent d’être découverts"),
    body: T(
      "Destinos, rincones especiales y lugares menos conocidos que pueden formar parte de tu próximo viaje.",
      "Destinations, special corners and lesser-known places that could become part of your next journey.",
      "Des destinations, des lieux singuliers et des endroits moins connus qui pourraient faire partie de votre prochain voyage."
    ),
  },
  {
    Icon: Sparkles,
    title: T("Experiencias en Marruecos", "Experiences in Morocco", "Expériences au Maroc"),
    body: T(
      "Ideas y experiencias para vivir el país más allá de los itinerarios tradicionales.",
      "Ideas and experiences for discovering the country beyond traditional itineraries.",
      "Des idées et des expériences pour vivre le pays au-delà des itinéraires traditionnels."
    ),
  },
  {
    Icon: Lightbulb,
    title: T("Consejos para preparar tu viaje", "Advice for preparing your journey", "Conseils pour préparer votre voyage"),
    body: T(
      "Información práctica, recomendaciones y consejos de nuestros especialistas para ayudarte a organizar tu aventura.",
      "Practical information, recommendations and advice from our specialists to help you organise your adventure.",
      "Des informations pratiques, des recommandations et les conseils de nos spécialistes pour organiser votre aventure."
    ),
  },
  {
    Icon: BookOpen,
    title: T("Novedades de Xaluca Tours", "News from Xaluca Tours", "Actualités de Xaluca Tours"),
    body: T(
      "Nuevos programas, próximas salidas, experiencias y otras novedades que puedan interesarte.",
      "New programmes, upcoming departures, experiences and other news that may interest you.",
      "Nouveaux programmes, prochains départs, expériences et autres actualités susceptibles de vous intéresser."
    ),
  },
];

export default function NewsletterPage() {
  const { lang } = useLanguage();
  const copy = (key) => pick(COPY[key], lang);

  return (
    <SlotScope id="newsletter-page">
      <main data-testid="newsletter-page" className="overflow-hidden bg-[#FDFBF7] text-[#2C2621]">
        <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-[#1A1513]" data-testid="newsletter-hero">
          <EditableImage
            slot="newsletter.hero"
            fallback={IMG.dunes}
            alt=""
            priority
            aspectRatio="auto"
            imgProps={{ loading: "eager" }}
            className="ken-burns absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1513]/95 via-[#1A1513]/55 to-[#1A1513]/25" />
          <div className="pointer-events-none absolute inset-0 berber-bg-cross opacity-35" aria-hidden="true" />
          <HeroMonogram />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40 md:px-12 md:pb-28">
            <div className="max-w-4xl">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#E2AE86]">
                <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {copy("eyebrow")}
              </p>
              <h1 className="mt-6 max-w-4xl font-serif-x text-[clamp(3.25rem,7vw,7rem)] leading-[0.94] tracking-[-0.04em] text-[#FDFBF7]">
                {copy("title")}
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-[1.8] text-white/80 md:text-lg">{copy("intro")}</p>
              <p className="mt-4 max-w-2xl text-sm leading-[1.8] text-white/70 md:text-base">{copy("introSecondary")}</p>
              <a
                href="#newsletter"
                data-testid="newsletter-hero-cta"
                className="xaluca-button mt-9 inline-flex min-h-14 items-center gap-3 bg-[#C16542] px-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#A35133]"
              >
                {copy("subscribe")}
                <ArrowDown className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28" aria-labelledby="newsletter-contents-title">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C16542]">{copy("contentsEyebrow")}</p>
                <h2 id="newsletter-contents-title" className="mt-5 font-serif-x text-4xl leading-[1.02] tracking-tight md:text-6xl">
                  {copy("contentsTitle")}
                </h2>
                <p className="mt-6 max-w-lg text-[15px] leading-[1.8] text-[#5C5248] md:text-base">{copy("contentsIntro")}</p>
                <div className="relative mt-10 aspect-[4/3] overflow-hidden">
                  <EditableImage
                    slot="newsletter.contents"
                    fallback={IMG.marketBaskets}
                    alt={copy("contentsTitle")}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1513]/30 to-transparent" />
                </div>
              </div>

              <div className="grid gap-px overflow-hidden border border-[#2C2621]/12 bg-[#2C2621]/12 sm:grid-cols-2">
                {CONTENT_ITEMS.map(({ Icon, title, body }, index) => (
                  <article
                    key={title.es}
                    className={`relative min-h-[270px] bg-[#FDFBF7] p-7 sm:p-8 ${index === CONTENT_ITEMS.length - 1 ? "sm:col-span-2" : ""}`}
                  >
                    <span className="text-[10px] font-semibold tracking-[0.24em] text-[#C16542]">0{index + 1}</span>
                    <Icon className="mt-10 h-7 w-7 text-[#C16542]" strokeWidth={1.35} aria-hidden="true" />
                    <h3 className="mt-6 font-serif-x text-2xl leading-tight md:text-3xl">{pick(title, lang)}</h3>
                    <p className="mt-4 max-w-xl text-sm leading-[1.75] text-[#5C5248]">{pick(body, lang)}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#201915] text-[#FDFBF7]" aria-labelledby="newsletter-emotional-title">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[420px] overflow-hidden lg:min-h-[650px]">
              <EditableImage
                slot="newsletter.emotional"
                fallback={IMG.chefAlley}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-[#201915]/25" />
            </div>
            <div className="relative flex items-center overflow-hidden px-7 py-16 sm:px-12 lg:px-16 lg:py-24">
              <div className="pointer-events-none absolute inset-0 berber-bg-diamond opacity-20" aria-hidden="true" />
              <div className="relative max-w-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E2AE86]">{copy("emotionalEyebrow")}</p>
                <h2 id="newsletter-emotional-title" className="mt-6 font-serif-x text-4xl leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                  {copy("emotionalTitle")}
                </h2>
                <p className="mt-7 text-base leading-[1.85] text-[#FDFBF7]/70">{copy("emotionalBody")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28" aria-labelledby="newsletter-specialists-title">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:px-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C16542]">
                <Users className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {copy("specialistsEyebrow")}
              </p>
              <h2 id="newsletter-specialists-title" className="mt-6 max-w-2xl font-serif-x text-4xl leading-[1.02] tracking-tight md:text-6xl">
                {copy("specialistsTitle")}
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-[1.85] text-[#5C5248]">{copy("specialistsBody")}</p>
              <Link
                to={pathFor(lang, "about")}
                data-testid="newsletter-about-cta"
                className="xaluca-button mt-9 inline-flex min-h-[52px] items-center gap-3 border border-[#2C2621] px-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2C2621] transition-colors hover:bg-[#2C2621] hover:text-white"
              >
                {copy("meetTeam")}
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              </Link>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <EditableImage
                slot="newsletter.specialists"
                fallback={IMG.riadFountain}
                alt={copy("specialistsEyebrow")}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 border-[14px] border-white/12" aria-hidden="true" />
            </div>
          </div>
        </section>

        <div className="bg-[#E9D9C6] px-6 pt-20 text-center md:px-12 md:pt-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A95739]">{copy("formEyebrow")}</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-serif-x text-4xl leading-[1.02] tracking-tight md:text-6xl">{copy("formTitle")}</h2>
        </div>
        <NewsletterSignup />
      </main>
    </SlotScope>
  );
}
