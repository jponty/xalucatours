import React, { useRef, useState, useEffect, useCallback } from "react";
import { Play, Film, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";

/* ============================================================
   Editorial video gallery — "Morocco From Above".
   Each card's play button opens a video dialog (lightbox) that
   streams the YouTube piece. Posters use the official YouTube
   thumbnail and remain editable via the CMS (slot home.video.{id}).
============================================================ */
const yt = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

const VIDEOS = [
  {
    id: "94sDICGmLcU",
    accent: "#C16542",
    eyebrow: { es: "Gran Sur · Sáhara", en: "Great South · Sahara", fr: "Grand Sud · Sahara" },
    title: {
      es: "Valle del Drâa, Telouet y Merzouga: anticipo del Sáhara",
      en: "Drâa Valley, Telouet, Merzouga: a foretaste of the Sahara",
      fr: "Vallée du Drâa, Telouet, Merzouga : un avant-goût du Sahara",
    },
    desc: {
      es: "Un anticipo del Sáhara: el valle del Drâa despliega un paisaje árido salpicado de palmerales. Esta región rebosa tesoros históricos como la majestuosa kasbah de Telouet, que perteneció al antiguo pachá de Marrakech, o el ksar de Ait Ben Haddou, hoy Patrimonio de la Humanidad por la UNESCO. El Gran Sur es también Ouarzazate, sus estudios de cine, su central solar Noor —la mayor de África— y, por supuesto, el impresionante lago de la presa Mansour Eddahbi. Más al este, Merzouga es célebre por sus extensiones de dunas que se recorren a lomos de dromedario. ¡Asombroso!",
      en: "A foretaste of the Sahara: the Drâa Valley offers an arid landscape punctuated by palm groves. This Moroccan region is overflowing with historical treasures such as the majestic Telouet Kasbah, which belonged to the former pasha of Marrakesh, or the Ksar of Ait Ben Haddou, now a UNESCO World Heritage Site. The Great South is also Ouarzazate, its film studios, its solar power plant Noor, the largest in Africa, and of course the impressive lake of the Mansour Eddahbi dam. Further east, Merzouga is known for its expanses of sand dunes where you can hike on camel back. Stupendous!",
      fr: "Un avant-goût du Sahara : la vallée du Drâa déroule un paysage aride ponctué de palmeraies. Cette région regorge de trésors historiques comme la majestueuse kasbah de Telouet, qui appartenait à l'ancien pacha de Marrakech, ou le ksar d'Aït Ben Haddou, aujourd'hui classé au patrimoine mondial de l'UNESCO. Le Grand Sud, c'est aussi Ouarzazate, ses studios de cinéma, sa centrale solaire Noor — la plus grande d'Afrique — et bien sûr l'impressionnant lac du barrage Mansour Eddahbi. Plus à l'est, Merzouga est connue pour ses étendues de dunes que l'on parcourt à dos de dromadaire. Époustouflant !",
    },
  },
  {
    id: "A67Q_6DxZ9E",
    accent: "#D97742",
    eyebrow: { es: "Alto Atlas", en: "High Atlas", fr: "Haut Atlas" },
    title: {
      es: "El Alto Atlas: Marrakech, Ouzoud, Safi y Essaouira",
      en: "The High Atlas: Marrakesh, Ouzoud, Safi & Essaouira",
      fr: "Le Haut Atlas : Marrakech, Ouzoud, Safi et Essaouira",
    },
    desc: {
      es: "Vista desde el cielo, ¡Marrakech es un hervidero! Es también el destino más visitado de Marruecos, y con razón: enamora a todos con sus encantadores riads y sus campos de golf. Pero es además una ciudad histórica, con la plaza Jemaa el-Fna, el Jardín Majorelle y la Menara. La región de Marrakech es igualmente espectacular, con las montañas del Atlas cercanas y las cascadas de Ouzoud, probablemente las más famosas del norte de África. En la costa, Safi —conocida por su barrio de alfareros— o la ventosa Essaouira seducen a quienes buscan aire fresco.",
      en: "As seen from above, Marrakesh is a hive of activity! It is also the most visited destination in Morocco. And for good reason: it appeals to everyone with its many charming riads and its golf courses. But it is also a historical city with the Jemaa el-Fnaa square, the Majorelle Garden and the Menara. The Marrakesh region is also spectacular with the nearby Atlas Mountains and the Ouzoud waterfalls, probably the most famous in North Africa! On the coast, Safi known for its village of potters or even the windy Essaouira entice tourists in search of fresh air.",
      fr: "Vue du ciel, Marrakech est une véritable ruche ! C'est aussi la destination la plus visitée du Maroc. Et pour cause : elle séduit tout le monde avec ses riads de charme et ses parcours de golf. Mais c'est aussi une ville historique avec la place Jemaa el-Fna, le Jardin Majorelle et la Ménara. La région de Marrakech est tout aussi spectaculaire avec l'Atlas tout proche et les cascades d'Ouzoud, sans doute les plus célèbres d'Afrique du Nord ! Sur la côte, Safi, connue pour son village de potiers, ou encore la venteuse Essaouira attirent les amateurs d'air frais.",
    },
  },
  {
    id: "0kxeDjvKJqQ",
    accent: "#5A7F9C",
    eyebrow: { es: "Norte y Rif", en: "North & Rif", fr: "Nord et Rif" },
    title: {
      es: "Tánger, Chefchaouen y Asilah: los esplendores del norte",
      en: "Tangier, Chefchaouen, Asilah: the splendors of the North",
      fr: "Tanger, Chefchaouen, Asilah : les splendeurs du Nord",
    },
    desc: {
      es: "¡Sube a lo más alto para descubrir Marruecos y sus magníficos paisajes! El viaje comienza en la mítica kasbah de Tánger, su corniche, su marina y su puerto internacional Tánger Med, que convierten esta ciudad del norte en un cruce único entre tradición y modernidad. En los alrededores, amplias playas de arena y calas salvajes bordean el Mediterráneo. Camino de la ciudad azul de Chefchaouen, las montañas del Rif ofrecen numerosas rutas de senderismo desde las que admirar las cascadas de Akchour y el «Puente de Dios», una atracción natural. La pequeña y acogedora Asilah, en la costa atlántica, acoge el festival internacional de murales. ¡Aviso para aficionados!",
      en: "Climb to the top to discover Morocco and its magnificent landscapes! The journey begins with the mythical Tangier Kasbah, its cornice, its marina and its international port, Tangier Med, which make this northern city a unique junction between tradition and modernity. In the surrounding areas, vast sandy beaches and wild coves line the Mediterranean. On the road to the blue city of Chefchaouen, the Rif mountains offer many hiking trails from which you can admire the Akchour waterfalls and \"the Bridge of God\", a natural tourist attraction. The small friendly town of Asilah, on the Atlantic side, hosts the international festival of murals. Notice to amateurs!",
      fr: "Grimpez tout en haut pour découvrir le Maroc et ses magnifiques paysages ! Le voyage commence par la mythique kasbah de Tanger, sa corniche, sa marina et son port international Tanger Med, qui font de cette ville du nord un trait d'union unique entre tradition et modernité. Aux alentours, de vastes plages de sable et des criques sauvages bordent la Méditerranée. Sur la route de la ville bleue de Chefchaouen, les montagnes du Rif offrent de nombreux sentiers de randonnée d'où l'on admire les cascades d'Akchour et le « Pont de Dieu », une attraction naturelle. La petite ville chaleureuse d'Asilah, côté Atlantique, accueille le festival international des fresques murales. Avis aux amateurs !",
    },
  },
  {
    id: "q_wJA1qJErI",
    accent: "#C98A5E",
    eyebrow: { es: "Sáhara Atlántico", en: "Atlantic Sahara", fr: "Sahara atlantique" },
    title: {
      es: "Laayoune y Dajla: un paraíso en el fin del mundo",
      en: "Laayoune, Dakhla: a paradise at the end of the world",
      fr: "Laâyoune, Dakhla : un paradis au bout du monde",
    },
    desc: {
      es: "Una tierra preservada. Un cambio de escenario garantizado. El Sáhara tiene todas las razones para fascinar: el Parque Nacional de Khnifiss, con su sima de Akhfenir y su laguna de Nayla entre marismas recortadas, es de postal. Desde la imponente plaza El Mechouar, en el corazón de Laayoune, verás grandes dunas que cruzan uno de los mayores uadis del sur de Marruecos, la Saquia el Hamra. Para los amantes de la adrenalina, Dajla se ha convertido en un spot mundialmente conocido para el surf y el windsurf. Un fin del mundo que invita a desconectar y relajarse.",
      en: "A preserved land. A change of scenery guaranteed. The Sahara has all the reasons to fascinate: the National Park of Khnifiss, with its abyss of Akhfenir and its lagoon of Nayla to the jagged swamps, is postcard perfect! From the imposing El Mechouar Square in the heart of the city of Laayoune, you will see large sand dunes that cross one of the largest wadis in southern Morocco, the Sakia Hamra. For thrill-seekers, Dakhla has become a world-renowned spot for surfing and windsurfing. An end of the world that invites you to disconnect and relax.",
      fr: "Une terre préservée. Un dépaysement garanti. Le Sahara a toutes les raisons de fasciner : le Parc national de Khnifiss, avec son gouffre d'Akhfenir et sa lagune de Naïla aux marais découpés, est une carte postale ! Depuis l'imposante place El Mechouar, au cœur de la ville de Laâyoune, vous verrez de grandes dunes qui traversent l'un des plus grands oueds du sud du Maroc, la Saquia el Hamra. Pour les amateurs de sensations fortes, Dakhla est devenue un spot de renommée mondiale pour le surf et la planche à voile. Un bout du monde qui invite à déconnecter et à se détendre.",
    },
  },
  {
    id: "yQ1C0o8nVYI",
    accent: "#3A4A5F",
    eyebrow: { es: "Costa Atlántica", en: "Atlantic Coast", fr: "Côte Atlantique" },
    title: {
      es: "El Jadida y Casablanca: descubre la costa atlántica",
      en: "El Jadida, Casablanca: discover the Atlantic coast",
      fr: "El Jadida, Casablanca : la côte atlantique du Maroc",
    },
    desc: {
      es: "Rumbo a la costa atlántica de Marruecos. Empezamos por la laguna de Moulay Bousselham, donde se observa una fauna excepcional de flamencos rosados. Más al sur, la ciudad de Salé y su mezquita Al Aadam —la tercera mayor de Marruecos— mira frente a la capital del Reino, Rabat, y su Kasbah de los Oudayas, que ofrece una vista impresionante del río Bouregreg. Pero la costa atlántica alberga también varios balnearios: Harhoura, Skhirat o Bouznika, donde los aficionados a los deportes acuáticos practican paddle y surf. Casablanca, capital económica, sorprende por su extraordinario patrimonio Art Déco y por la Mezquita Hassan II, cuyo minarete de 200 metros se asoma al mar. Otro imprescindible: El Jadida, ciudad portuaria flanqueada por magníficas murallas portuguesas. Mención especial para la antigua cisterna que, con sus seis naves y bóvedas cruzadas, inspiró a Orson Welles, que rodó allí Otelo.",
      en: "Headland on Morocco's Atlantic Coast. Let's start with the lagoon of Moulay Bousselham, where we can observe an exceptional fauna of pink flamingos. Further south, the city of Salé and its Al Aadam mosque, Morocco's third largest mosque, faces the capital of the Kingdom, Rabat and its Kasbah des Oudayas which offers a breathtaking view of the Bouregreg River. But the Atlantic Coast is also home to several seaside resorts: Harhoura, Skhirat or Bouznika where water sports enthusiasts practice paddle and surf. Casablanca, the economic capital of Morocco, is astonishing for its extraordinary Art Deco heritage and for the Hassan 2 Mosque whose 200-meter high minaret overlooks the water. Another must-see destination: El Jadida, the port city flanked by magnificent ramparts built by the Portuguese. Special mention for the old cistern which, with its six naves and crossed vaults, inspired Orson Welles who filmed Othello there.",
      fr: "Cap sur la côte atlantique du Maroc. Commençons par la lagune de Moulay Bousselham, où l'on observe une faune exceptionnelle de flamants roses. Plus au sud, la ville de Salé et sa mosquée Al Aadam, troisième plus grande du Maroc, fait face à la capitale du Royaume, Rabat, et sa Kasbah des Oudayas qui offre une vue imprenable sur le Bouregreg. Mais la côte atlantique abrite aussi plusieurs stations balnéaires : Harhoura, Skhirat ou Bouznika où les amateurs de sports nautiques pratiquent le paddle et le surf. Casablanca, capitale économique du Maroc, étonne par son extraordinaire patrimoine Art déco et par la mosquée Hassan II dont le minaret de 200 mètres surplombe l'eau. Autre incontournable : El Jadida, cité portuaire flanquée de magnifiques remparts construits par les Portugais. Mention spéciale pour l'ancienne citerne qui, avec ses six nefs et ses voûtes croisées, inspira Orson Welles qui y tourna Othello.",
    },
  },
  {
    id: "cgrKiEGsZdw",
    accent: "#A07042",
    eyebrow: { es: "Ciudades Imperiales", en: "Imperial Cities", fr: "Villes impériales" },
    title: {
      es: "Fez, Mequinez, Moulay Idriss y Volubilis: historia concentrada",
      en: "Fez, Meknes, Moulay Idriss, Volubilis: a concentration of history",
      fr: "Fès, Meknès, Moulay Idriss, Volubilis : une concentration d'histoire",
    },
    desc: {
      es: "¿Sabías que en Marruecos se esquía? Ifrane, con sus tejados puntiagudos, está considerada «la pequeña Suiza de Marruecos». En verano, sus bosques centenarios de cedros y sus macacos hacen las delicias de los visitantes. Pero la región es conocida sobre todo por sus ciudades imperiales: Fez y su medina medieval; Mequinez y su puerta Bab El Mansour, una de las más monumentales de Marruecos. A pocos kilómetros, la ciudad de Moulay Idriss Zerhoun destaca por el imponente mausoleo de Moulay Idriss I, fundador de la ciudad y de Fez. No lejos de allí, la ciudad de Volubilis y sus ruinas romanas son un tesoro arqueológico que descubrir sin dudarlo.",
      en: "Did you know that we ski in Morocco? Ifrane, with its pointed roofs, is considered \"the little Switzerland of Morocco\". In summer, its hundred-year-old cedar forests and magots (Barbary apes) are a delight for tourists. But the region is best known for its imperial cities: Fez and its medieval Medina; Meknes and its Bab El Mansour gate, one of the most monumental in Morocco. A few kilometers away, the city of Moulay Idriss Zerhoun stands out thanks to the imposing mausoleum of Moulay Idriss I, founder of the city and of Fez. Not far from there, the city of Volubilis and its Roman ruins is an archaeological treasure to be discovered without hesitation.",
      fr: "Saviez-vous que l'on skie au Maroc ? Ifrane, avec ses toits pointus, est considérée comme « la petite Suisse du Maroc ». En été, ses forêts de cèdres centenaires et ses magots (macaques de Barbarie) font le bonheur des touristes. Mais la région est surtout connue pour ses villes impériales : Fès et sa médina médiévale ; Meknès et sa porte Bab El Mansour, l'une des plus monumentales du Maroc. À quelques kilomètres, la ville de Moulay Idriss Zerhoun se distingue grâce à l'imposant mausolée de Moulay Idriss Ier, fondateur de la ville et de Fès. Non loin de là, la ville de Volubilis et ses ruines romaines est un trésor archéologique à découvrir sans hésiter.",
    },
  },
];

const COPY = {
  overline: { es: "Marruecos en imágenes", en: "Morocco in motion", fr: "Le Maroc en images" },
  title: {
    es: "El país que escapa de las palabras.",
    en: "A country that escapes words.",
    fr: "Un pays qui échappe aux mots.",
  },
  body: {
    es: "Una selección editorial de piezas filmadas en localización para que sientas el ritmo, los colores y el silencio de Marruecos antes de poner un pie en él.",
    en: "An editorial selection of pieces filmed on location — so you can feel Morocco's rhythm, colours and silence before setting foot in it.",
    fr: "Une sélection éditoriale de pièces tournées sur place — pour ressentir le rythme, les couleurs et le silence du Maroc avant d'y poser le pied.",
  },
  play: { es: "Reproducir", en: "Play", fr: "Lire" },
  prev: { es: "Anterior", en: "Previous", fr: "Précédent" },
  next: { es: "Siguiente", en: "Next", fr: "Suivant" },
  watch: { es: "Ver en YouTube", en: "Watch on YouTube", fr: "Voir sur YouTube" },
  close: { es: "Cerrar", en: "Close", fr: "Fermer" },
};

const pickL = (obj, lang) => (obj && (obj[lang] || obj.es)) || "";

const VideoCard = ({ video, lang, onPlay }) => (
  <article
    data-testid={`video-card-${video.id}`}
    className="group relative shrink-0 w-[88vw] sm:w-[420px] lg:w-[460px] snap-start"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1513] border border-[#FDFBF7]/10">
      <EditableImage
        slot={`home.video.${video.id}`}
        fallback={yt(video.id)}
        alt={pickL(video.title, lang)}
        imgProps={{ loading: "lazy" }}
        aspectRatio="16/9"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/35 to-transparent" />
      <span className="film-grain" />
      <XalucaLogoBadge testid={`video-logo-${video.id}`} />
      <div className="absolute top-5 left-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/85">
        <Film className="w-3 h-3" strokeWidth={1.6} style={{ color: video.accent }} />
        {pickL(video.eyebrow, lang)}
      </div>
      <button
        type="button"
        onClick={() => onPlay(video)}
        data-testid={`video-play-${video.id}`}
        aria-label={pickL(COPY.play, lang)}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FDFBF7]/95 text-[#1A1513] shadow-lg transition-transform duration-500 group-hover:scale-110"
          style={{ boxShadow: `0 0 0 1px ${video.accent}55, 0 30px 60px -20px ${video.accent}88` }}
        >
          <Play className="w-6 h-6 ml-1" strokeWidth={1.5} />
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: video.accent }}
          />
        </span>
      </button>
    </div>
    <div className="mt-6 pl-1">
      <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: video.accent }}>
        {pickL(video.eyebrow, lang)}
      </span>
      <h3 className="font-serif-x text-2xl md:text-[26px] leading-[1.15] tracking-tight mt-3 text-[#FDFBF7]">
        {pickL(video.title, lang)}
      </h3>
      <p className="mt-3 text-sm text-[#FDFBF7]/65 leading-relaxed max-w-[44ch] line-clamp-3">
        {pickL(video.desc, lang)}
      </p>
    </div>
  </article>
);

const VideoDialog = ({ video, lang, onClose }) => {
  useEffect(() => {
    if (!video) return undefined; // only lock scroll while a video is open
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      data-testid="video-dialog"
      role="dialog"
      aria-modal="true"
      aria-label={pickL(video.title, lang)}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-[#0F0C0A]/92 backdrop-blur-md p-4 md:p-8 animate-[fadeIn_.25s_ease]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-5xl">
        <button
          type="button"
          onClick={onClose}
          data-testid="video-dialog-close"
          aria-label={pickL(COPY.close, lang)}
          className="absolute -top-12 right-0 md:-right-2 inline-flex items-center gap-2 text-[#FDFBF7]/80 hover:text-[#FDFBF7] text-[11px] tracking-[0.22em] uppercase transition-colors"
        >
          {pickL(COPY.close, lang)}
          <X className="w-5 h-5" strokeWidth={1.7} />
        </button>

        <div className="relative w-full aspect-video bg-black overflow-hidden border border-[#FDFBF7]/15 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
          <iframe
            title={pickL(video.title, lang)}
            data-testid="video-dialog-iframe"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <div className="mt-5 max-h-[28vh] overflow-y-auto pr-1 no-scrollbar">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: video.accent }}>
            {pickL(video.eyebrow, lang)}
          </span>
          <h3 className="font-serif-x text-2xl md:text-3xl text-[#FDFBF7] leading-tight mt-2">
            {pickL(video.title, lang)}
          </h3>
          <p className="mt-3 text-sm md:text-[15px] text-[#FDFBF7]/70 leading-relaxed">
            {pickL(video.desc, lang)}
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="video-dialog-youtube"
            className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#D4A373] hover:text-[#FDFBF7] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
            {pickL(COPY.watch, lang)}
          </a>
        </div>
      </div>
    </div>
  );
};

export default function MoroccoVideos() {
  const { lang } = useLanguage();
  const [dialogVideo, setDialogVideo] = useState(null);
  const railRef = useRef(null);

  const closeDialog = useCallback(() => setDialogVideo(null), []);

  const scrollBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = rail.clientWidth * 0.85 * (dir === "next" ? 1 : -1);
    rail.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id="videos"
      data-testid="morocco-videos"
      className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-diamond opacity-[0.07] pointer-events-none" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-14 md:mb-20">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-[#D4A373] text-[11px] tracking-[0.35em] uppercase">
              <Film className="w-3.5 h-3.5" strokeWidth={1.6} />
              <EditableText slot="home.videos.overline" defaults={COPY.overline} multiline={false} />
              <span className="w-10 h-px bg-[#D4A373]/50" />
            </span>
            <EditableText as="h2" slot="home.videos.title" defaults={COPY.title}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-6 text-[#FDFBF7] block" />
          </div>
          <div className="lg:col-span-5">
            <EditableText as="p" slot="home.videos.body" defaults={COPY.body}
              className="text-base md:text-lg text-[#FDFBF7]/70 leading-relaxed block" />
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollBy("prev")}
                aria-label={pickL(COPY.prev, lang)}
                data-testid="videos-prev"
                className="inline-flex items-center justify-center w-12 h-12 border border-[#FDFBF7]/25 hover:border-[#D4A373] hover:text-[#D4A373] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy("next")}
                aria-label={pickL(COPY.next, lang)}
                data-testid="videos-next"
                className="inline-flex items-center justify-center w-12 h-12 border border-[#FDFBF7]/25 hover:border-[#D4A373] hover:text-[#D4A373] transition-colors"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          data-testid="videos-rail"
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-6 md:-mx-12 px-6 md:px-12 no-scrollbar"
        >
          {VIDEOS.map((v) => (
            <VideoCard key={v.id} video={v} lang={lang} onPlay={setDialogVideo} />
          ))}
        </div>
      </div>

      <VideoDialog video={dialogVideo} lang={lang} onClose={closeDialog} />
    </section>
  );
}
