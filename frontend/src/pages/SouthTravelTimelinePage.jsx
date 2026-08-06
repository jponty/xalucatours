import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  Mountain,
  Sparkles,
  Sun,
  ThermometerSun,
  Waves,
} from "lucide-react";
import SectionNav from "@/components/SectionNav";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";

const T = (es, en, fr) => ({ es, en, fr });

const MONTHS = [
  {
    id: "enero", name: T("Enero", "January", "Janvier"), rating: T("Muy buena", "Very good", "Très bonne"), tone: "good",
    temp: T("Costa: 18–21 °C\nDesierto: 16–20 °C de día / 0–5 °C de noche", "Coast: 18–21 °C\nDesert: 16–20 °C by day / 0–5 °C at night", "Côte : 18–21 °C\nDésert : 16–20 °C le jour / 0–5 °C la nuit"),
    advice: T("Días soleados y claros. Excelente para noches estrelladas en el desierto. Las noches son frescas: recomendamos llevar ropa de abrigo.", "Clear, sunny days and excellent stargazing in the desert. Nights are cool, so warm layers are recommended.", "Journées claires et ensoleillées, idéales pour observer les étoiles dans le désert. Les nuits sont fraîches : prévoyez des vêtements chauds."),
  },
  {
    id: "febrero", name: T("Febrero", "February", "Février"), rating: T("Muy buena", "Very good", "Très bonne"), tone: "good",
    temp: T("Similar a enero, con temperaturas en ligero ascenso", "Similar to January, with temperatures gradually rising", "Proche de janvier, avec des températures en légère hausse"),
    advice: T("Floración de almendros en zonas del sur y del Atlas. Buenas condiciones para las actividades diurnas en el desierto.", "Almond blossom in parts of the south and the Atlas. Good conditions for daytime desert activities.", "Floraison des amandiers dans le sud et l’Atlas. Bonnes conditions pour les activités en journée dans le désert."),
  },
  {
    id: "marzo", name: T("Marzo", "March", "Mars"), rating: T("Excelente", "Excellent", "Excellente"), tone: "excellent",
    temp: T("Costa: 20–23 °C\nDesierto: 22–28 °C de día / ~9 °C de noche", "Coast: 20–23 °C\nDesert: 22–28 °C by day / ~9 °C at night", "Côte : 20–23 °C\nDésert : 22–28 °C le jour / ~9 °C la nuit"),
    advice: T("Comienza la temporada más equilibrada. Temperaturas ideales para combinar ciudades, valles y desierto.", "The most balanced season begins. Ideal temperatures for combining cities, valleys and desert.", "Début de la saison la plus équilibrée. Températures idéales pour associer villes, vallées et désert."),
  },
  {
    id: "abril", name: T("Abril", "April", "Avril"), rating: T("Una de las mejores", "One of the best", "L’un des meilleurs"), tone: "best",
    temp: T("Costa: 21–23 °C\nDesierto: 26–30 °C de día / 12–15 °C de noche", "Coast: 21–23 °C\nDesert: 26–30 °C by day / 12–15 °C at night", "Côte : 21–23 °C\nDésert : 26–30 °C le jour / 12–15 °C la nuit"),
    advice: T("Casi perfecto en todas las zonas. Festival de las Rosas en el valle del Dadès y condiciones muy cómodas para campamentos y hoteles del desierto.", "Almost perfect everywhere. The Rose Festival in the Dadès Valley and very comfortable conditions for desert camps and hotels.", "Conditions presque parfaites partout. Festival des Roses dans la vallée du Dadès et climat très agréable pour les camps et hôtels du désert."),
  },
  {
    id: "mayo", name: T("Mayo", "May", "Mai"), rating: T("Muy buena", "Very good", "Très bonne"), tone: "good",
    temp: T("Costa: 22–24 °C\nDesierto: 30–35 °C de día", "Coast: 22–24 °C\nDesert: 30–35 °C by day", "Côte : 22–24 °C\nDésert : 30–35 °C le jour"),
    advice: T("Una época todavía excelente, con días más cálidos. Ideal para aprovechar las mañanas y los atardeceres en el desierto.", "Still an excellent time, with warmer days. Ideal for enjoying mornings and sunsets in the desert.", "Une période toujours excellente, avec des journées plus chaudes. Idéale pour profiter des matinées et des couchers de soleil dans le désert."),
  },
  {
    id: "junio", name: T("Junio", "June", "Juin"), rating: T("Buena, gestionando el calor", "Good, with heat planning", "Bonne, en gérant la chaleur"), tone: "warm",
    temp: T("Costa: 23–25 °C\nDesierto: 35–40 °C", "Coast: 23–25 °C\nDesert: 35–40 °C", "Côte : 23–25 °C\nDésert : 35–40 °C"),
    advice: T("Días más calurosos en el interior y el desierto. Conviene planificar las actividades al amanecer y al atardecer y disfrutar del hotel durante las horas centrales.", "Hotter inland and desert days. Plan activities around sunrise and sunset, and enjoy the hotel during the hottest hours.", "Journées plus chaudes à l’intérieur et dans le désert. Privilégiez l’aube et le coucher du soleil, puis profitez de l’hôtel aux heures les plus chaudes."),
  },
  {
    id: "julio", name: T("Julio", "July", "Juillet"), rating: T("Factible con precauciones", "Possible with precautions", "Possible avec précautions"), tone: "caution",
    temp: T("Costa: 24–26 °C\nDesierto: 40–45 °C", "Coast: 24–26 °C\nDesert: 40–45 °C", "Côte : 24–26 °C\nDésert : 40–45 °C"),
    advice: T("Calor intenso en el sur. Los hoteles bien climatizados permiten una estancia agradable; priorizamos salidas tempranas y el regreso durante las horas de más calor.", "Intense heat in the south. Well air-conditioned hotels keep stays comfortable; early departures and returning during peak heat are prioritised.", "Forte chaleur dans le sud. Les hôtels bien climatisés assurent un séjour agréable ; départs matinaux et retour pendant les heures les plus chaudes."),
  },
  {
    id: "agosto", name: T("Agosto", "August", "Août"), rating: T("Factible con precauciones", "Possible with precautions", "Possible avec précautions"), tone: "caution",
    temp: T("Temperaturas similares a julio", "Temperatures similar to July", "Températures similaires à juillet"),
    advice: T("Condiciones similares a julio. Interesante para quienes prefieren menos afluencia en algunas zonas y desean aprovechar las instalaciones del hotel.", "Conditions are similar to July. Suitable for travellers seeking fewer visitors in some areas and time to enjoy hotel facilities.", "Conditions proches de juillet. Intéressant pour ceux qui recherchent moins d’affluence et souhaitent profiter des installations de l’hôtel."),
  },
  {
    id: "septiembre", name: T("Septiembre", "September", "Septembre"), rating: T("Muy buena", "Very good", "Très bonne"), tone: "good",
    temp: T("Costa: 24–26 °C\nDesierto: 32–36 °C, moderándose", "Coast: 24–26 °C\nDesert: 32–36 °C, gradually easing", "Côte : 24–26 °C\nDésert : 32–36 °C, en baisse progressive"),
    advice: T("El calor empieza a suavizarse. Excelente transición para combinar costa, interior y desierto.", "The heat begins to ease. An excellent transition month for combining coast, inland and desert.", "La chaleur commence à diminuer. Excellente transition pour associer côte, intérieur et désert."),
  },
  {
    id: "octubre", name: T("Octubre", "October", "Octobre"), rating: T("Una de las mejores", "One of the best", "L’un des meilleurs"), note: T("Frecuentemente el favorito", "Often the favourite", "Souvent le favori"), tone: "best",
    temp: T("Costa: 23–25 °C\nDesierto: 27–30 °C de día / ~14 °C de noche", "Coast: 23–25 °C\nDesert: 27–30 °C by day / ~14 °C at night", "Côte : 23–25 °C\nDésert : 27–30 °C le jour / ~14 °C la nuit"),
    advice: T("Temperaturas muy equilibradas, una luz preciosa, cosecha de dátiles y noches muy agradables en el desierto.", "Very balanced temperatures, beautiful light, the date harvest and wonderfully pleasant desert nights.", "Températures très équilibrées, belle lumière, récolte des dattes et nuits très agréables dans le désert."),
  },
  {
    id: "noviembre", name: T("Noviembre", "November", "Novembre"), rating: T("Excelente", "Excellent", "Excellente"), tone: "excellent",
    temp: T("Costa: 21–24 °C\nDesierto: 22–25 °C de día / ~9 °C de noche", "Coast: 21–24 °C\nDesert: 22–25 °C by day / ~9 °C at night", "Côte : 21–24 °C\nDésert : 22–25 °C le jour / ~9 °C la nuit"),
    advice: T("La última gran ventana de clima suave. Buenas condiciones y, normalmente, una mejor relación calidad-precio.", "The last great window of mild weather, with good conditions and usually better value.", "La dernière grande période de climat doux, avec de bonnes conditions et généralement un meilleur rapport qualité-prix."),
  },
  {
    id: "diciembre", name: T("Diciembre", "December", "Décembre"), rating: T("Muy buena", "Very good", "Très bonne"), tone: "good",
    temp: T("Costa: 19–22 °C\nDesierto: 17–20 °C de día / 2–5 °C de noche", "Coast: 19–22 °C\nDesert: 17–20 °C by day / 2–5 °C at night", "Côte : 19–22 °C\nDésert : 17–20 °C le jour / 2–5 °C la nuit"),
    advice: T("Días agradables y cielos limpios. Las noches son frescas en el desierto, por lo que recomendamos vestir por capas.", "Pleasant days and clear skies. Desert nights are cool, so dressing in layers is recommended.", "Journées agréables et ciel dégagé. Les nuits sont fraîches dans le désert : habillez-vous en plusieurs couches."),
  },
];

const TONE = {
  best: "bg-[#C16542] text-white border-[#C16542]",
  excellent: "bg-[#365C4A] text-white border-[#365C4A]",
  good: "bg-[#F2EBE1] text-[#6A4A37] border-[#DCCBBC]",
  warm: "bg-[#E9D8B2] text-[#674D23] border-[#D9BF86]",
  caution: "bg-[#2C2621] text-white border-[#2C2621]",
};

const SUMMARY = [
  { icon: Sparkles, title: T("Mejores meses", "Best months", "Meilleurs mois"), body: T("Abril y octubre son los grandes favoritos, seguidos de marzo, mayo y noviembre.", "April and October are the favourites, followed by March, May and November.", "Avril et octobre sont les grands favoris, suivis de mars, mai et novembre.") },
  { icon: Sun, title: T("Desierto", "Desert", "Désert"), body: T("Marzo–mayo y septiembre–noviembre ofrecen el equilibrio más cómodo. En verano, organizamos el exterior a primera hora y al atardecer.", "March–May and September–November offer the most comfortable balance. In summer, outdoor activities are planned early and at sunset.", "Mars–mai et septembre–novembre offrent le meilleur équilibre. En été, les activités extérieures sont prévues tôt et au coucher du soleil.") },
  { icon: Waves, title: T("Costa atlántica", "Atlantic coast", "Côte atlantique"), body: T("Agadir y Essaouira son agradables casi todo el año, especialmente cuando el interior es más caluroso.", "Agadir and Essaouira are pleasant almost year-round, especially when inland areas are hotter.", "Agadir et Essaouira sont agréables presque toute l’année, surtout lorsque l’intérieur est plus chaud.") },
  { icon: Mountain, title: T("Atlas y valles", "Atlas and valleys", "Atlas et vallées"), body: T("Primavera y otoño suelen ser los periodos más placenteros para hacer trekking y descubrir los valles.", "Spring and autumn are usually the most pleasant times for trekking and exploring the valleys.", "Le printemps et l’automne sont généralement les périodes les plus agréables pour randonner et découvrir les vallées.") },
];

export default function SouthTravelTimelinePage() {
  const { lang } = useLanguage();
  const p = (value) => pick(value, lang);

  return (
    <div className="bg-[#F8F3EA] text-[#2C2621]" data-testid="south-timeline-page">
      <section className="relative overflow-hidden bg-[#211B17] text-white pt-40 md:pt-52 pb-20 md:pb-28">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #D4A373 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.34em] uppercase text-[#D4A373] mb-6"><CalendarDays className="w-4 h-4" /> Guía anual · Sur de Marruecos</span>
            <h1 className="font-serif-x text-4xl sm:text-5xl lg:text-7xl leading-[1.02] max-w-5xl" data-testid="south-timeline-title">{p(T("Las mejores épocas para viajar al sur de Marruecos.", "The best times to visit southern Morocco.", "Les meilleures saisons pour voyager dans le sud du Maroc."))}</h1>
          </div>
          <p className="lg:col-span-4 text-base md:text-lg leading-relaxed text-white/72">{p(T("Doce meses, doce formas de vivir el desierto, la costa, el Atlas y sus valles. Consulta el clima orientativo y el carácter de cada época.", "Twelve months and twelve ways to experience the desert, coast, Atlas and valleys. Explore the typical climate and character of each season.", "Douze mois, douze façons de vivre le désert, la côte, l’Atlas et ses vallées. Découvrez le climat indicatif de chaque saison."))}</p>
        </div>
      </section>

      <SectionNav testid="south-timeline-nav" items={[
        { id: "calendario", label: T("Calendario anual", "Annual calendar", "Calendrier annuel") },
        { id: "resumen", label: T("Resumen práctico", "Practical summary", "Résumé pratique") },
        { id: "planificar", label: T("Planificar viaje", "Plan a trip", "Planifier") },
      ]} />

      <section id="calendario" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-12 gap-8 mb-14 md:mb-20">
            <div className="lg:col-span-7"><span className="text-[10px] tracking-[0.34em] uppercase text-[#C16542]">{p(T("Mes a mes", "Month by month", "Mois par mois"))}</span><h2 className="font-serif-x text-4xl md:text-5xl mt-4">{p(T("Encuentra el momento que encaja con tu forma de viajar.", "Find the time that suits the way you travel.", "Trouvez la période qui correspond à votre façon de voyager."))}</h2></div>
            <p className="lg:col-span-5 lg:pt-8 text-[#62584E] leading-relaxed">{p(T("Las temperaturas son orientativas y pueden variar. Nuestro equipo adapta horarios, alojamientos y actividades para que cada ruta resulte cómoda en su temporada.", "Temperatures are indicative and may vary. Our team adapts schedules, accommodation and activities so each route feels comfortable in its season.", "Les températures sont indicatives. Notre équipe adapte horaires, hébergements et activités afin que chaque itinéraire reste agréable selon la saison."))}</p>
          </div>

          <nav aria-label={p(T("Ir a un mes", "Jump to a month", "Aller à un mois"))} className="flex gap-2 overflow-x-auto pb-5 mb-12 snap-x">
            {MONTHS.map((month) => <a key={month.id} href={`#mes-${month.id}`} className="shrink-0 snap-start border border-[#2C2621]/15 bg-white px-4 py-3 text-[10px] tracking-[0.18em] uppercase hover:border-[#C16542] hover:text-[#C16542] transition-colors">{p(month.name)}</a>)}
          </nav>

          <div className="relative">
            <div aria-hidden="true" className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-[#C16542]/25" />
            <ol className="space-y-8 md:space-y-12">
              {MONTHS.map((month, index) => (
                <li id={`mes-${month.id}`} key={month.id} data-testid={`timeline-month-${month.id}`} className="relative scroll-mt-40 grid md:grid-cols-2 gap-5 md:gap-20 pl-16 md:pl-0">
                  <div className="absolute left-[17px] md:left-1/2 md:-translate-x-1/2 top-7 w-5 h-5 rounded-full border-[5px] border-[#F8F3EA] bg-[#C16542] shadow-[0_0_0_1px_rgba(193,101,66,.35)] z-10" />
                  <div className={`${index % 2 ? "md:col-start-2" : "md:text-right"} ${index % 2 ? "" : "md:col-start-1"}`}>
                    <article className="bg-white border border-[#2C2621]/10 p-6 md:p-8 shadow-[0_14px_45px_rgba(44,38,33,.06)]">
                      <div className={`flex flex-wrap items-start gap-4 mb-6 ${index % 2 ? "" : "md:justify-end"}`}>
                        <span className="font-serif-x text-4xl md:text-5xl leading-none">{String(index + 1).padStart(2, "0")}</span>
                        <div className={index % 2 ? "" : "md:text-right"}><h3 className="font-serif-x text-2xl md:text-3xl">{p(month.name)}</h3><span className={`inline-flex mt-2 border px-3 py-1.5 text-[9px] tracking-[0.18em] uppercase ${TONE[month.tone]}`}>{p(month.rating)}</span>{month.note && <p className="text-[10px] uppercase tracking-[0.13em] text-[#C16542] mt-2">{p(month.note)}</p>}</div>
                      </div>
                      <div className={`grid gap-5 ${index % 2 ? "" : "md:text-left"}`}>
                        <div className="border-t border-[#2C2621]/10 pt-5"><div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-[#9B684D] mb-3"><ThermometerSun className="w-4 h-4" />{p(T("Temperatura orientativa", "Typical temperature", "Température indicative"))}</div><p className="whitespace-pre-line leading-relaxed text-sm md:text-base">{p(month.temp)}</p></div>
                        <div className="border-t border-[#2C2621]/10 pt-5"><div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-[#9B684D] mb-3"><Compass className="w-4 h-4" />{p(T("Qué destacar", "What to know", "À retenir"))}</div><p className="leading-relaxed text-sm md:text-base text-[#62584E]">{p(month.advice)}</p></div>
                      </div>
                    </article>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="resumen" className="py-20 md:py-28 bg-[#EDE3D4] border-y border-[#2C2621]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="text-[10px] tracking-[0.34em] uppercase text-[#C16542]">{p(T("Resumen práctico", "Practical summary", "Résumé pratique"))}</span>
          <h2 className="font-serif-x text-4xl md:text-5xl mt-4 mb-12 max-w-3xl">{p(T("La elección rápida, según el viaje que imaginas.", "A quick choice, based on the journey you imagine.", "Le choix rapide, selon le voyage que vous imaginez."))}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2C2621]/12 border border-[#2C2621]/12">
            {SUMMARY.map(({ icon: Icon, title, body }) => <article key={p(title)} className="bg-[#F8F3EA] p-7 md:p-8"><Icon className="w-7 h-7 text-[#C16542] mb-8" strokeWidth={1.4} /><h3 className="font-serif-x text-2xl mb-4">{p(title)}</h3><p className="text-sm leading-relaxed text-[#62584E]">{p(body)}</p></article>)}
          </div>
        </div>
      </section>

      <section id="planificar" className="py-20 md:py-28 bg-[#211B17] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8"><span className="inline-flex items-center gap-2 text-[10px] tracking-[0.34em] uppercase text-[#D4A373] mb-5"><CheckCircle2 className="w-4 h-4" />{p(T("Diseñamos la temporada contigo", "We plan the season with you", "Nous choisissons la saison avec vous"))}</span><h2 className="font-serif-x text-4xl md:text-6xl leading-tight">{p(T("El mejor mes es el que mejor se adapta a tu viaje.", "The best month is the one that best fits your journey.", "Le meilleur mois est celui qui convient le mieux à votre voyage."))}</h2></div>
          <div className="lg:col-span-4 flex flex-col gap-3"><Link to={pathFor(lang, "planTrip")} className="inline-flex justify-between items-center bg-[#C66745] hover:bg-[#D57855] px-6 py-5 text-[10px] tracking-[0.25em] uppercase transition-colors">{p(T("Planificar mi viaje", "Plan my trip", "Planifier mon voyage"))}<ArrowRight className="w-4 h-4" /></Link><Link to={pathFor(lang, "tourSouth")} className="inline-flex justify-between items-center border border-white/25 hover:border-white px-6 py-5 text-[10px] tracking-[0.25em] uppercase transition-colors">{p(T("Ver viajes por el sur", "See southern tours", "Voir les voyages dans le sud"))}<ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>
    </div>
  );
}
