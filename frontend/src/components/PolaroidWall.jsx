/* ============================================================
   PolaroidWall — a warm, editorial "travel memories" carousel shown
   below the WhyXaluca cards. Each printed-photo (polaroid) is
   clickable: tapping it unfolds a first-person storytelling panel
   right below the gallery, with the traveller's memories of their
   trip across Morocco. Selecting another polaroid swaps the story
   in place (no navigation), keeping the same structure & design.

   • Images go through <Img> → responsive srcSet + AVIF/WebP + lazy
     loading + blur-up, so the strip stays light.
   • Captions, signatures, invites and stories are CMS-editable
     (EditableText, slots home.why.polaroid.*).
   • Brand orange (#C16542) throughout. Xaluca logo + "X" monogram
     overlaid like the rest of the site's images.
============================================================ */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, BookOpen, X, Quote, BadgeCheck } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import EditableText from "@/components/EditableText";
import Img from "@/components/Img";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import PassportStamp from "@/components/PassportStamp";
import ImageContactBubble from "@/components/ImageContactBubble";
import xMonogramBorde from "@/assets/monograma-x-borde.png";

const COPY = {
  overline: { es: "Memorias de viaje", en: "Travel memories", fr: "Souvenirs de voyage" },
  title: {
    es: "Instantáneas de un Marruecos que se vive de cerca.",
    en: "Snapshots of a Morocco lived up close.",
    fr: "Instantanés d'un Maroc vécu de près.",
  },
  prev: { es: "Anterior", en: "Previous", fr: "Précédent" },
  next: { es: "Siguiente", en: "Next", fr: "Suivant" },
  close: { es: "Cerrar historia", en: "Close story", fr: "Fermer l'histoire" },
  story_eyebrow: { es: "Sus recuerdos de viaje", en: "Their travel memories", fr: "Ses souvenirs de voyage" },
  verified: { es: "Memorias verificadas", en: "Verified memories", fr: "Souvenirs vérifiés" },
};

const initialsOf = (name) =>
  String(name || "")
    .split(/[\s&·]+/)
    .filter((w) => /[a-zA-ZÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/* Destination shown on the passport stamp for each memory. */
const STAMP_PLACE = {
  dunes: "Erg Chebbi",
  tea: "Fès",
  souk: "Marrakech",
  chefchaouen: "Chefchaouen",
  riad: "Marrakech",
  artisan: "Fès",
};

/* Pull the "Month Year" portion out of a "Name · Month Year" signature. */
const stampDate = (signature, lang) => {
  const s = pick(signature, lang) || "";
  const parts = s.split("·");
  return (parts[1] || parts[0] || "").trim();
};

const PHOTOS = [
  {
    id: "dunes",
    src: "https://images.pexels.com/photos/8357638/pexels-photo-8357638.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "Caravana en el Erg Chebbi", en: "Caravan in Erg Chebbi", fr: "Caravane à l'Erg Chebbi" },
    signature: { es: "Marta & Javier · Abril 1998", en: "Marta & Javier · April 1998", fr: "Marta & Javier · Avril 1998" },
    author: "Marta & Javier",
    invite: { es: "Haz clic para descubrir su historia", en: "Click to discover their story", fr: "Cliquez pour découvrir leur histoire" },
    rotate: -4,
    story_title: { es: "La noche que contamos las estrellas", en: "The night we counted the stars", fr: "La nuit où nous avons compté les étoiles" },
    story: {
      es: "Llegamos al borde del desierto al caer la tarde, cuando la arena empieza a teñirse de cobre. Montamos en los dromedarios casi sin hablar, sobrecogidos por el silencio. Aquella noche, tumbados frente a la hoguera del campamento, contamos más estrellas de las que habíamos visto en toda nuestra vida.\n\nNuestro guía, Brahim, nos enseñó a escuchar el desierto: el viento moldeando las dunas, el crujido de la arena bajo los pies descalzos. Han pasado más de veinte años y todavía cerramos los ojos y volvemos al Erg Chebbi. Fue el viaje que nos cambió la forma de mirar el mundo.",
      en: "We reached the edge of the desert at dusk, when the sand begins to turn copper. We climbed onto the camels almost without speaking, overcome by the silence. That night, lying by the camp fire, we counted more stars than we had seen in our entire lives.\n\nOur guide, Brahim, taught us to listen to the desert: the wind shaping the dunes, the crunch of sand under bare feet. More than twenty years have passed and we still close our eyes and return to Erg Chebbi. It was the trip that changed the way we look at the world.",
      fr: "Nous sommes arrivés au bord du désert au crépuscule, quand le sable se teinte de cuivre. Nous sommes montés sur les dromadaires presque sans parler, saisis par le silence. Cette nuit-là, allongés près du feu du campement, nous avons compté plus d'étoiles que durant toute notre vie.\n\nNotre guide, Brahim, nous a appris à écouter le désert : le vent qui façonne les dunes, le crissement du sable sous les pieds nus. Plus de vingt ans ont passé et nous fermons encore les yeux pour revenir à l'Erg Chebbi. C'est le voyage qui a changé notre regard sur le monde.",
    },
  },
  {
    id: "tea",
    src: "https://images.pexels.com/photos/30498764/pexels-photo-30498764.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "Té a la menta, siempre", en: "Mint tea, always", fr: "Thé à la menthe, toujours" },
    signature: { es: "Elena R. · Septiembre 2007", en: "Elena R. · September 2007", fr: "Elena R. · Septembre 2007" },
    author: "Elena R.",
    invite: { es: "Lee sus recuerdos de viaje", en: "Read her travel memories", fr: "Lisez ses souvenirs de voyage" },
    rotate: 3,
    story_title: { es: "Tres tés y una tarde infinita", en: "Three teas and an endless afternoon", fr: "Trois thés et un après-midi infini" },
    story: {
      es: "Creía que un té era solo un té, hasta que me senté en aquella terraza de Fez. El anciano levantó la tetera muy alto, como quien dibuja un hilo dorado en el aire, y me explicó que el primero es amargo como la vida, el segundo fuerte como el amor y el tercero suave como la muerte.\n\nMe quedé toda la tarde escuchando historias entre vasitos calientes y hojas de hierbabuena. Aprendí que en Marruecos el té no se bebe: se comparte. Cada vez que preparo uno en casa, vuelvo a esa terraza y a la generosidad de quienes me abrieron su puerta.",
      en: "I thought a tea was just a tea, until I sat on that terrace in Fez. The old man lifted the teapot high, as if drawing a golden thread in the air, and explained that the first is bitter like life, the second strong like love and the third gentle like death.\n\nI spent the whole afternoon listening to stories between hot little glasses and mint leaves. I learned that in Morocco tea isn't drunk: it's shared. Every time I make one at home, I return to that terrace and to the generosity of those who opened their door to me.",
      fr: "Je croyais qu'un thé n'était qu'un thé, jusqu'à ce que je m'assoie sur cette terrasse de Fès. Le vieil homme leva la théière très haut, comme s'il dessinait un fil doré dans l'air, et m'expliqua que le premier est amer comme la vie, le deuxième fort comme l'amour et le troisième doux comme la mort.\n\nJ'ai passé tout l'après-midi à écouter des histoires entre petits verres chauds et feuilles de menthe. J'ai appris qu'au Maroc le thé ne se boit pas : il se partage. Chaque fois que j'en prépare un chez moi, je retourne à cette terrasse et à la générosité de ceux qui m'ont ouvert leur porte.",
    },
  },
  {
    id: "souk",
    src: "https://images.pexels.com/photos/36209446/pexels-photo-36209446.jpeg",
    caption: { es: "Colores del zoco de Marrakech", en: "Colours of the Marrakech souk", fr: "Couleurs du souk de Marrakech" },
    signature: { es: "Carlos D. · Marzo 1992", en: "Carlos D. · March 1992", fr: "Carlos D. · Mars 1992" },
    author: "Carlos D.",
    invite: { es: "Descubre lo que vivió", en: "Discover what he lived", fr: "Découvrez ce qu'il a vécu" },
    rotate: -3,
    story_title: { es: "Perderse en el zoco, encontrarse a uno mismo", en: "Getting lost in the souk, finding myself", fr: "Se perdre dans le souk, se retrouver soi-même" },
    story: {
      es: "Entré en el zoco de Marrakech y me perdí a propósito. Los colores de las especias, el repiqueteo de los caldereros, el olor a cuero y a azafrán… todo era demasiado para un chico de pueblo que viajaba solo por primera vez.\n\nUn artesano me invitó a su taller, me ofreció un té y, sin apenas entendernos, estuvimos riendo durante una hora. Salí de allí con una lámpara de latón que todavía cuelga en mi salón. Fue 1992, mi primer viaje a Marruecos, y supe que volvería muchas veces más. No me equivoqué.",
      en: "I walked into the Marrakech souk and got lost on purpose. The colours of the spices, the clatter of the coppersmiths, the smell of leather and saffron… it was all too much for a village boy travelling alone for the first time.\n\nA craftsman invited me into his workshop, offered me tea and, barely understanding each other, we laughed for a whole hour. I left with a brass lamp that still hangs in my living room. It was 1992, my first trip to Morocco, and I knew I would come back many times. I wasn't wrong.",
      fr: "Je suis entré dans le souk de Marrakech et je me suis perdu exprès. Les couleurs des épices, le cliquetis des dinandiers, l'odeur du cuir et du safran… c'était trop pour un garçon de village qui voyageait seul pour la première fois.\n\nUn artisan m'a invité dans son atelier, m'a offert un thé et, nous comprenant à peine, nous avons ri pendant une heure entière. Je suis reparti avec une lampe en laiton qui pend encore dans mon salon. C'était en 1992, mon premier voyage au Maroc, et j'ai su que je reviendrais souvent. Je ne me suis pas trompé.",
    },
  },
  {
    id: "chefchaouen",
    src: "https://images.pexels.com/photos/5472518/pexels-photo-5472518.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "La perla azul, Chefchaouen", en: "The blue pearl, Chefchaouen", fr: "La perle bleue, Chefchaouen" },
    signature: { es: "Lucía F. · Junio 2015", en: "Lucía F. · June 2015", fr: "Lucía F. · Juin 2015" },
    author: "Lucía F.",
    invite: { es: "Su historia, en sus palabras", en: "Her story, in her words", fr: "Son histoire, dans ses mots" },
    rotate: 4,
    story_title: { es: "El azul que se respira", en: "The blue you can breathe", fr: "Le bleu qui se respire" },
    story: {
      es: "Chefchaouen me pareció un sueño pintado de azul. Subí y bajé sus callejones sin rumbo, dejando que cada esquina me sorprendiera con una puerta, una maceta o un gato dormido al sol.\n\nAl atardecer me senté en las escaleras de la medina con un zumo de naranja recién exprimido. Una señora salió a regar sus flores y me saludó como si me conociera de siempre. En ese instante entendí que el azul de Chefchaouen no está solo en las paredes: está en la calma de su gente.",
      en: "Chefchaouen felt like a dream painted in blue. I wandered up and down its alleys with no direction, letting every corner surprise me with a door, a flowerpot or a cat asleep in the sun.\n\nAt dusk I sat on the steps of the medina with a freshly squeezed orange juice. A woman came out to water her flowers and greeted me as if she had always known me. In that instant I understood that the blue of Chefchaouen isn't only on the walls: it's in the calm of its people.",
      fr: "Chefchaouen m'a semblé un rêve peint en bleu. J'ai monté et descendu ses ruelles sans but, laissant chaque coin me surprendre avec une porte, un pot de fleurs ou un chat endormi au soleil.\n\nAu crépuscule, je me suis assise sur les marches de la médina avec un jus d'orange fraîchement pressé. Une dame est sortie arroser ses fleurs et m'a saluée comme si elle me connaissait depuis toujours. À cet instant, j'ai compris que le bleu de Chefchaouen n'est pas seulement sur les murs : il est dans le calme de ses habitants.",
    },
  },
  {
    id: "riad",
    src: "https://images.pexels.com/photos/29125650/pexels-photo-29125650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    caption: { es: "Patios de riad al atardecer", en: "Riad courtyards at dusk", fr: "Patios de riad au crépuscule" },
    signature: { es: "Andrés P. · Octubre 2021", en: "Andrés P. · October 2021", fr: "Andrés P. · Octobre 2021" },
    author: "Andrés P.",
    invite: { es: "Abre sus memorias", en: "Open his memories", fr: "Ouvrez ses souvenirs" },
    rotate: -3,
    story_title: { es: "Detrás de una puerta sencilla", en: "Behind a humble door", fr: "Derrière une porte toute simple" },
    story: {
      es: "Después de meses encerrados, cruzar la puerta de un riad fue como respirar de nuevo. Por fuera, un muro discreto; por dentro, un patio con una fuente, naranjos y el cielo enmarcado en lo alto.\n\nDesayunábamos bajo los arcos escuchando el agua, y por la noche subíamos a la azotea a ver cómo se encendía la medina. Aquel viaje me recordó que la belleza más grande de Marruecos a veces se esconde detrás de una puerta sencilla, esperando a quien se atreve a empujarla.",
      en: "After months locked away, crossing the door of a riad was like breathing again. Outside, a discreet wall; inside, a courtyard with a fountain, orange trees and the sky framed high above.\n\nWe had breakfast beneath the arches listening to the water, and at night we climbed to the rooftop to watch the medina light up. That trip reminded me that Morocco's greatest beauty sometimes hides behind a humble door, waiting for whoever dares to push it open.",
      fr: "Après des mois enfermés, franchir la porte d'un riad fut comme respirer à nouveau. À l'extérieur, un mur discret ; à l'intérieur, un patio avec une fontaine, des orangers et le ciel encadré tout en haut.\n\nNous prenions le petit-déjeuner sous les arcades en écoutant l'eau, et le soir nous montions sur la terrasse pour voir la médina s'illuminer. Ce voyage m'a rappelé que la plus grande beauté du Maroc se cache parfois derrière une porte toute simple, attendant celui qui ose la pousser.",
    },
  },
  {
    id: "artisan",
    src: "https://images.unsplash.com/photo-1517227298311-f248d35b1a18",
    caption: { es: "Manos que guardan oficios", en: "Hands keeping crafts alive", fr: "Des mains gardiennes des métiers" },
    signature: { es: "Nuria & Hugo · Mayo 2026", en: "Nuria & Hugo · May 2026", fr: "Nuria & Hugo · Mai 2026" },
    author: "Nuria & Hugo",
    invite: { es: "Lee su recuerdo", en: "Read their memory", fr: "Lisez leur souvenir" },
    rotate: 2,
    story_title: { es: "El tiempo medido en paciencia", en: "Time measured in patience", fr: "Le temps mesuré en patience" },
    story: {
      es: "Queríamos llevarnos algo hecho a mano, así que pasamos una mañana entera con los artesanos de la medina. Vimos cómo unas manos curtidas convertían un trozo de madera en una caja de cedro, cómo se tallaba el yeso y se trenzaba la palma.\n\nNos quedamos hipnotizados con un hombre que sonreía mientras encajaba diminutas teselas de zellige, una a una, sin prisa. Nos dijo que su abuelo le enseñó el oficio y que él se lo enseñará a su nieto. Volvimos a casa con una bandeja… y con la certeza de que en Marruecos el tiempo se mide en paciencia y en belleza.",
      en: "We wanted to take home something handmade, so we spent a whole morning with the artisans of the medina. We watched weathered hands turn a piece of wood into a cedar box, plaster being carved and palm leaves being woven.\n\nWe were mesmerised by a man who smiled as he fitted tiny zellige tiles, one by one, without rushing. He told us his grandfather taught him the craft and that he will teach it to his grandson. We came home with a tray… and with the certainty that in Morocco time is measured in patience and in beauty.",
      fr: "Nous voulions rapporter quelque chose fait main, alors nous avons passé toute une matinée avec les artisans de la médina. Nous avons vu des mains burinées transformer un morceau de bois en boîte de cèdre, le plâtre se sculpter et la palme se tresser.\n\nNous avons été hypnotisés par un homme qui souriait en ajustant de minuscules tesselles de zellige, une à une, sans se presser. Il nous a dit que son grand-père lui avait appris le métier et qu'il l'enseignera à son petit-fils. Nous sommes rentrés avec un plateau… et la certitude qu'au Maroc le temps se mesure en patience et en beauté.",
    },
  },
];

const Polaroid = ({ photo, active, onSelect, lang }) => (
  <figure
    data-testid={`polaroid-${photo.id}`}
    role="button"
    tabIndex={0}
    aria-expanded={active}
    aria-label={pick(photo.invite, lang)}
    onClick={() => onSelect(photo.id)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(photo.id);
      }
    }}
    className={`group/polaroid relative shrink-0 snap-center w-[68vw] sm:w-[270px] md:w-[290px] cursor-pointer bg-[#FDFBF7] p-2.5 pb-9 md:p-3 md:pb-11 shadow-[0_18px_40px_-18px_rgba(26,21,19,0.5)] transition-transform duration-500 ease-out hover:z-20 hover:!rotate-0 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] ${
      active ? "!rotate-0 -translate-y-2 z-20 ring-2 ring-[#C16542]" : "ring-1 ring-[#C16542]/30"
    }`}
    style={{ transform: `rotate(${photo.rotate}deg)` }}
  >
    {/* washi-tape accent */}
    <span
      className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#C16542]/25 border border-[#C16542]/35 rotate-[-2deg]"
      aria-hidden="true"
    />
    <div className="relative overflow-hidden bg-[#C16542]/5">
      <Img
        src={photo.src}
        alt=""
        width={520}
        sizes="(max-width: 640px) 68vw, 290px"
        className="block w-full aspect-[4/5] object-cover"
      />
      {/* Large Xaluca "X" monogram integrated into the bottom-right edge of the
          frame — a discreet, partially-clipped brand watermark (same treatment
          as the footer's corner monogram). */}
      <img
        src={xMonogramBorde}
        alt=""
        aria-hidden="true"
        data-testid={`polaroid-${photo.id}-monogram`}
        className="pointer-events-none select-none absolute bottom-0 right-0 h-[120%] w-auto object-contain opacity-[0.22] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] z-[2]"
      />
      {/* Xaluca brand logo — top-right corner */}
      <XalucaLogoBadge
        className="top-3 right-3 w-9 h-9 md:w-10 md:h-10"
        testid={`polaroid-${photo.id}-logo`}
      />
      {/* Appointment (/citaprevia) widget — inside the image, interior-left */}
      <ImageContactBubble slug={`polaroid-${photo.id}`} align="left" />
    </div>

    <figcaption className="text-center mt-2.5 px-1">
      <EditableText
        as="span"
        slot={`home.why.polaroid.${photo.id}.caption`}
        defaults={photo.caption}
        multiline={false}
        className="block font-serif-x-italic text-[12px] md:text-[13px] text-[#5C5248] leading-snug"
      />
      <EditableText
        as="span"
        slot={`home.why.polaroid.${photo.id}.signature`}
        defaults={photo.signature}
        multiline={false}
        className="block font-serif-x-italic text-[11px] md:text-[12px] text-[#C16542]/90 leading-snug mt-1"
      />
      {/* interaction invite */}
      <span
        data-testid={`polaroid-invite-${photo.id}`}
        className="mt-2 inline-flex items-center gap-1.5 text-[9px] tracking-[0.18em] uppercase text-[#C16542] group-hover/polaroid:gap-2.5 transition-all duration-300"
      >
        <BookOpen className="w-3 h-3 shrink-0" strokeWidth={1.7} />
        <EditableText
          slot={`home.why.polaroid.${photo.id}.invite`}
          defaults={photo.invite}
          as="span"
          multiline={false}
          className="inline"
        />
      </span>
    </figcaption>
  </figure>
);

const StoryPanel = ({ photo, lang, onClose }) => (
  <article
    data-testid={`polaroid-story-${photo.id}`}
    className="relative animate-slide-down overflow-hidden bg-[#FDFBF7] border border-[#2C2621]/10 shadow-[0_30px_60px_-36px_rgba(26,21,19,0.5)]"
    style={{ borderLeft: "4px solid #C16542" }}
  >
    <div className="absolute inset-0 berber-bg-diamond opacity-[0.05] pointer-events-none" aria-hidden="true" />

    <button
      type="button"
      onClick={onClose}
      aria-label={pick(COPY.close, lang)}
      data-testid="polaroid-story-close"
      className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F2EBE1] hover:bg-[#2C2621] text-[#5C5248] hover:text-[#FDFBF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] transition-colors duration-300"
    >
      <X className="w-4 h-4" strokeWidth={1.8} />
    </button>

    <div className="relative grid grid-cols-1 md:grid-cols-12 gap-0">
      {/* Photo */}
      <div className="md:col-span-4 lg:col-span-3 relative min-h-[220px] md:min-h-full overflow-hidden bg-[#C16542]/5">
        <Img
          src={photo.src}
          alt=""
          width={640}
          sizes="(max-width: 768px) 100vw, 320px"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#FDFBF7]/15 pointer-events-none" />
        <XalucaLogoBadge className="top-3 right-3 w-9 h-9 md:w-10 md:h-10" />
        <PassportStamp
          place={STAMP_PLACE[photo.id] || pick(photo.caption, lang)}
          date={stampDate(photo.signature, lang)}
          className="bottom-4 left-4 w-24 h-24 md:w-28 md:h-28 drop-shadow-[0_2px_4px_rgba(26,21,19,0.85)]"
        />
      </div>

      {/* Narrative */}
      <div className="md:col-span-8 lg:col-span-9 px-6 py-7 md:px-10 md:py-10">
        <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#C16542]">
          <Quote className="w-3.5 h-3.5" strokeWidth={1.8} />
          {pick(COPY.story_eyebrow, lang)}
        </span>

        <EditableText
          as="h4"
          slot={`home.why.polaroid.${photo.id}.story_title`}
          defaults={photo.story_title}
          multiline={false}
          className="font-serif-x text-2xl md:text-3xl leading-[1.12] tracking-tight mt-3 text-[#2C2621] block pr-10"
        />

        {/* Narrator */}
        <div className="mt-4 flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[#FDFBF7] shrink-0 font-serif-x text-[13px] bg-[#C16542]"
            aria-hidden="true"
          >
            {initialsOf(photo.author)}
          </span>
          <div className="min-w-0">
            <span className="block font-serif-x-italic text-[14px] text-[#2C2621] leading-tight">
              {pick(photo.signature, lang)}
            </span>
            <span className="inline-flex items-center gap-1.5 mt-0.5 text-[10px] tracking-[0.14em] uppercase text-[#C16542]">
              <BadgeCheck className="w-3.5 h-3.5" strokeWidth={1.7} />
              {pick(COPY.verified, lang)}
            </span>
          </div>
        </div>

        <EditableText
          as="div"
          slot={`home.why.polaroid.${photo.id}.story`}
          defaults={photo.story}
          multiline
          className="mt-6 text-[14px] md:text-[15px] text-[#2C2621] leading-[1.75] whitespace-pre-line block"
        />
      </div>
    </div>
  </article>
);

export const PolaroidWall = () => {
  const { lang } = useLanguage();
  const railRef = useRef(null);
  const storyRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const activePhoto = PHOTOS.find((p) => p.id === activeId) || null;

  const updateArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanPrev(rail.scrollLeft > 8);
    setCanNext(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    updateArrows();
    rail.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      rail.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  // Gently bring the unfolded story into view (no page reload, no jump).
  useEffect(() => {
    if (activeId && storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeId]);

  const scrollBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: rail.clientWidth * 0.8 * (dir === "next" ? 1 : -1), behavior: "smooth" });
  };

  const handleSelect = (id) => setActiveId((cur) => (cur === id ? null : id));

  return (
    <div className="relative mt-20 md:mt-28" data-testid="why-polaroid-wall">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
        <div className="max-w-2xl">
          <span className="overline inline-flex items-center gap-2 text-[#C16542]">
            <Camera className="w-3.5 h-3.5" strokeWidth={1.7} />
            <EditableText
              slot="home.why.polaroid.overline"
              defaults={COPY.overline}
              as="span"
              multiline={false}
              className="inline"
            />
          </span>
          <EditableText
            as="h3"
            slot="home.why.polaroid.title"
            defaults={COPY.title}
            className="font-serif-x text-2xl md:text-3xl lg:text-4xl leading-[1.1] tracking-tight mt-4 text-[#2C2621] block"
          />
        </div>

        {/* Carousel controls — brand orange */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => scrollBy("prev")}
            aria-label={pick(COPY.prev, lang)}
            data-testid="polaroid-prev"
            disabled={!canPrev}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#C16542]/40 text-[#C16542] hover:bg-[#C16542] hover:text-[#FDFBF7] hover:border-[#C16542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#C16542]"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("next")}
            aria-label={pick(COPY.next, lang)}
            data-testid="polaroid-next"
            disabled={!canNext}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#C16542] text-[#FDFBF7] hover:bg-[#A35133] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] focus-visible:ring-offset-2 transition-colors duration-300 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        data-testid="polaroid-rail"
        className="mt-12 md:mt-16 flex items-start gap-7 md:gap-9 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pt-4 pb-6 -mx-6 md:-mx-12 px-6 md:px-12 focus-visible:outline-none"
      >
        {PHOTOS.map((p) => (
          <Polaroid key={p.id} photo={p} active={activeId === p.id} onSelect={handleSelect} lang={lang} />
        ))}
      </div>

      {/* Storytelling panel — unfolds right below the gallery */}
      {activePhoto && (
        <div ref={storyRef} className="mt-8 md:mt-10 scroll-mt-28">
          <StoryPanel photo={activePhoto} lang={lang} onClose={() => setActiveId(null)} />
        </div>
      )}
    </div>
  );
};

export default PolaroidWall;
