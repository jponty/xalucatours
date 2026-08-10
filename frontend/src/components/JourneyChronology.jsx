import React from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";
import { useSlotId } from "@/components/slotScope";
import { getSlotUrl } from "@/components/EditableImage";
import { Img } from "@/components/Img";
import {
  dayGallerySegment,
  resolveGalleryUrl,
  useDayGallery,
} from "@/lib/dayGalleryStore";

const COPY = {
  es: {
    eyebrow: "Cronología del viaje",
    body: {
      ad: "Del Atlas al corazón del Sáhara: recorre visualmente cada etapa antes de descubrir el programa completo.",
      da: "Del corazón del Sáhara al Alto Atlas: recorre visualmente cada etapa antes de descubrir el programa completo.",
      me: "De Marrakech a las dunas del Erg Chebbi: recorre visualmente cada etapa antes de descubrir el programa completo.",
      em: "De las dunas del Erg Chebbi a Marrakech: recorre visualmente cada etapa antes de descubrir el programa completo.",
      mem: "De Marrakech al Erg Chebbi y regreso: recorre visualmente cada etapa del circuito antes de descubrir el programa completo.",
      frm: "De Marrakech a Fez pasando por el Erg Chebbi: recorre visualmente cada etapa antes de descubrir el programa completo.",
      msf: "De Marrakech a Fez pasando por el Erg Chebbi y el lago Aguelmame Sidi Ali: recorre visualmente cada etapa del viaje.",
      frz: "De Fez a Marrakech pasando por el Erg Chebbi: recorre visualmente cada etapa antes de descubrir el programa completo.",
      fzs: "De Fez a Marrakech pasando por el lago Aguelmame Sidi Ali y el Erg Chebbi: recorre visualmente cada etapa del viaje.",
      foz: "De Fez a Ouarzazate pasando por el lago Aguelmame Sidi Ali y el Erg Chebbi: recorre visualmente cada etapa del viaje.",
      ozf: "De Ouarzazate a Fez pasando por el Erg Chebbi y el lago Aguelmame Sidi Ali: recorre visualmente cada etapa del viaje.",
      fae: "De Fez a Errachidia atravesando el Medio Atlas, el lago Aguelmame Sidi Ali y el Erg Chebbi: recorre visualmente cada etapa del viaje.",
      ci: "De Casablanca a las grandes ciudades imperiales de Marruecos: recorre visualmente cada etapa entre medinas, palacios y legado histórico.",
      cirf: "Del Estrecho de Gibraltar a Marrakech: recorre visualmente cada etapa entre el Rif, pueblos azules, ciudades imperiales y medinas históricas.",
      tf: "De Tánger a Fez por el norte de Marruecos: recorre visualmente cada etapa entre costa, montañas del Rif, ciudades azules y medinas imperiales.",
      ft: "De Fez a Tánger por el norte de Marruecos: recorre visualmente cada etapa entre medinas imperiales, montañas del Rif y costas mediterráneas.",
      enduro: "Del oasis a las pistas del desierto: recorre visualmente cada etapa entre hamadas, gargantas, cordilleras y dunas del Sáhara.",
      mes: "De la energía de Marrakech a la brisa de Essaouira: recorre visualmente cada etapa entre medinas, zocos y paisajes atlánticos.",
      trk: "Del Estrecho de Gibraltar a Marrakech: recorre visualmente la gran travesía entre el Rif, ciudades imperiales, Atlas, Sáhara y kasbahs.",
      desierto: "De Errachidia al corazón del Erg Chebbi: recorre visualmente cada etapa entre oasis, dunas, cultura nómada y noches bajo las estrellas.",
      atlas: "De Ouarzazate al Alto Atlas: recorre visualmente cada etapa entre valles, aldeas bereberes, gargantas, kasbahs y palmerales.",
      fez: "Desde la medina de Fez hacia su legado imperial: recorre visualmente cada etapa entre zocos, artesanos, monumentos y ciudades históricas.",
      fezSidiAli: "De la medina de Fez al lago Aguelmame Sidi Ali: recorre visualmente cada etapa entre ciudades imperiales, cedros y paisajes del Medio Atlas.",
      rak: "Desde el corazón de Marrakech: recorre visualmente cada etapa entre palacios, zocos, artesanos y la energía de la plaza Djemaa el-Fna.",
      raga: "De Marrakech al desierto de Agafay: recorre visualmente cada etapa entre medina, Meseta del Kik, lago Lalla Takerkoust y paisajes del Atlas.",
      newYear: "De Ouarzazate al gran Erg Chebbi: recorre visualmente cada etapa de esta salida especial entre el Atlas, el Sáhara y la celebración de Fin de Año.",
    },
    day: "Día",
    explore: "Ver esta jornada",
    swipe: "Desliza para recorrer los días",
  },
  en: {
    eyebrow: "Journey timeline",
    body: {
      ad: "From the Atlas to the heart of the Sahara: preview every stage before exploring the full programme.",
      da: "From the heart of the Sahara to the High Atlas: preview every stage before exploring the full programme.",
      me: "From Marrakech to the Erg Chebbi dunes: preview every stage before exploring the full programme.",
      em: "From the Erg Chebbi dunes to Marrakech: preview every stage before exploring the full programme.",
      mem: "From Marrakech to Erg Chebbi and back: preview every stage of the circuit before exploring the full programme.",
      frm: "From Marrakech to Fez via Erg Chebbi: preview every stage before exploring the full programme.",
      msf: "From Marrakech to Fez via Erg Chebbi and Lake Aguelmame Sidi Ali: preview every stage of the journey.",
      frz: "From Fez to Marrakech via Erg Chebbi: preview every stage before exploring the full programme.",
      fzs: "From Fez to Marrakech via Lake Aguelmame Sidi Ali and Erg Chebbi: preview every stage of the journey.",
      foz: "From Fez to Ouarzazate via Lake Aguelmame Sidi Ali and Erg Chebbi: preview every stage of the journey.",
      ozf: "From Ouarzazate to Fez via Erg Chebbi and Lake Aguelmame Sidi Ali: preview every stage of the journey.",
      fae: "From Fez to Errachidia through the Middle Atlas, Lake Aguelmame Sidi Ali and Erg Chebbi: preview every stage of the journey.",
      ci: "From Casablanca through Morocco’s great imperial cities: preview every stage among medinas, palaces and historic landmarks.",
      cirf: "From the Strait of Gibraltar to Marrakech: preview every stage through the Rif, blue towns, imperial cities and historic medinas.",
      tf: "From Tangier to Fez through northern Morocco: preview every stage among the coast, Rif Mountains, blue towns and imperial medinas.",
      ft: "From Fez to Tangier through northern Morocco: preview every stage among imperial medinas, the Rif Mountains and Mediterranean coasts.",
      enduro: "From the oasis to the desert tracks: preview every stage among hamadas, gorges, mountain ranges and Saharan dunes.",
      mes: "From Marrakech’s energy to Essaouira’s Atlantic breeze: preview every stage among medinas, souks and coastal landscapes.",
      trk: "From the Strait of Gibraltar to Marrakech: preview the great crossing through the Rif, imperial cities, Atlas, Sahara and kasbahs.",
      desierto: "From Errachidia to the heart of Erg Chebbi: preview every stage among oases, dunes, nomadic culture and nights beneath the stars.",
      atlas: "From Ouarzazate to the High Atlas: preview every stage among valleys, Berber villages, gorges, kasbahs and palm groves.",
      fez: "From Fez’s medina into its imperial legacy: preview every stage among souks, artisans, monuments and historic cities.",
      fezSidiAli: "From Fez’s medina to Lake Aguelmame Sidi Ali: preview every stage among imperial cities, cedar forests and Middle Atlas landscapes.",
      rak: "From the heart of Marrakech: preview every stage among palaces, souks, artisans and the energy of Jemaa el-Fna square.",
      raga: "From Marrakech to the Agafay Desert: preview every stage among the medina, Kik Plateau, Lake Lalla Takerkoust and Atlas landscapes.",
      newYear: "From Ouarzazate to the great Erg Chebbi: preview every stage of this special departure through the Atlas, Sahara and New Year celebration.",
    },
    day: "Day",
    explore: "View this day",
    swipe: "Swipe to explore each day",
  },
  fr: {
    eyebrow: "Chronologie du voyage",
    body: {
      ad: "De l’Atlas au cœur du Sahara : parcourez chaque étape avant de découvrir le programme complet.",
      da: "Du cœur du Sahara au Haut Atlas : parcourez chaque étape avant de découvrir le programme complet.",
      me: "De Marrakech aux dunes de l’Erg Chebbi : parcourez chaque étape avant de découvrir le programme complet.",
      em: "Des dunes de l’Erg Chebbi à Marrakech : parcourez chaque étape avant de découvrir le programme complet.",
      mem: "De Marrakech à l’Erg Chebbi et retour : parcourez chaque étape du circuit avant de découvrir le programme complet.",
      frm: "De Marrakech à Fès par l’Erg Chebbi : parcourez chaque étape avant de découvrir le programme complet.",
      msf: "De Marrakech à Fès par l’Erg Chebbi et le lac Aguelmame Sidi Ali : parcourez chaque étape du voyage.",
      frz: "De Fès à Marrakech par l’Erg Chebbi : parcourez chaque étape avant de découvrir le programme complet.",
      fzs: "De Fès à Marrakech par le lac Aguelmame Sidi Ali et l’Erg Chebbi : parcourez chaque étape du voyage.",
      foz: "De Fès à Ouarzazate par le lac Aguelmame Sidi Ali et l’Erg Chebbi : parcourez chaque étape du voyage.",
      ozf: "D’Ouarzazate à Fès par l’Erg Chebbi et le lac Aguelmame Sidi Ali : parcourez chaque étape du voyage.",
      fae: "De Fès à Errachidia par le Moyen Atlas, le lac Aguelmame Sidi Ali et l’Erg Chebbi : parcourez chaque étape du voyage.",
      ci: "De Casablanca aux grandes cités impériales du Maroc : parcourez chaque étape entre médinas, palais et patrimoine historique.",
      cirf: "Du détroit de Gibraltar à Marrakech : parcourez chaque étape entre le Rif, les villes bleues, les cités impériales et les médinas historiques.",
      tf: "De Tanger à Fès par le nord du Maroc : parcourez chaque étape entre la côte, le Rif, les villes bleues et les médinas impériales.",
      ft: "De Fès à Tanger par le nord du Maroc : parcourez chaque étape entre les médinas impériales, le Rif et les côtes méditerranéennes.",
      enduro: "De l’oasis aux pistes du désert : parcourez chaque étape entre hamadas, gorges, massifs montagneux et dunes du Sahara.",
      mes: "De l’énergie de Marrakech à la brise atlantique d’Essaouira : parcourez chaque étape entre médinas, souks et paysages côtiers.",
      trk: "Du détroit de Gibraltar à Marrakech : parcourez la grande traversée entre le Rif, les cités impériales, l’Atlas, le Sahara et les kasbahs.",
      desierto: "D’Errachidia au cœur de l’Erg Chebbi : parcourez chaque étape entre oasis, dunes, culture nomade et nuits sous les étoiles.",
      atlas: "D’Ouarzazate au Haut Atlas : parcourez chaque étape entre vallées, villages berbères, gorges, kasbahs et palmeraies.",
      fez: "De la médina de Fès à son héritage impérial : parcourez chaque étape entre souks, artisans, monuments et villes historiques.",
      fezSidiAli: "De la médina de Fès au lac Aguelmame Sidi Ali : parcourez chaque étape entre cités impériales, cédraies et paysages du Moyen Atlas.",
      rak: "Depuis le cœur de Marrakech : parcourez chaque étape entre palais, souks, artisans et l’énergie de la place Jemaa el-Fna.",
      raga: "De Marrakech au désert d’Agafay : parcourez chaque étape entre médina, plateau du Kik, lac Lalla Takerkoust et paysages de l’Atlas.",
      newYear: "D’Ouarzazate au grand Erg Chebbi : parcourez chaque étape de ce départ spécial entre l’Atlas, le Sahara et les célébrations du Nouvel An.",
    },
    day: "Jour",
    explore: "Voir cette journée",
    swipe: "Faites glisser pour parcourir les jours",
  },
};

const DAY_COUNT_LABELS = {
  es: { 3: "Tres", 4: "Cuatro", 5: "Cinco", 6: "Seis", 7: "Siete", 8: "Ocho", 9: "Nueve", 10: "Diez" },
  en: { 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten" },
  fr: { 3: "Trois", 4: "Quatre", 5: "Cinq", 6: "Six", 7: "Sept", 8: "Huit", 9: "Neuf", 10: "Dix" },
};

const chronologyTitle = (lang, count) => {
  const label = DAY_COUNT_LABELS[lang]?.[count] || String(count);
  if (lang === "en") return `${label} days, at a glance.`;
  if (lang === "fr") return `${label} jours, en un seul regard.`;
  return `${label} días, de un solo vistazo.`;
};

const completeSummary = (value) => {
  const text = String(value || "")
    .replace(/\.{3}|…/g, ",")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const sentences = text.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) || [text];
  let summary = "";
  for (const sentence of sentences) {
    const candidate = summary ? `${summary} ${sentence}` : sentence;
    if (summary.length >= 95 && candidate.length > 155) break;
    summary = candidate;
    if (summary.length >= 120) break;
  }
  return summary || text;
};

const jumpToDay = (event, id) => {
  event.preventDefault();
  const target = document.getElementById(id);
  if (!target) return;
  const header = document.querySelector('[data-testid="site-header"]');
  const programNav = document.querySelector('[data-testid="program-nav"]');
  const dayNav = document.querySelector('[data-testid="program-day-timeline"]');
  const offset = (header?.offsetHeight || 0) + (programNav?.offsetHeight || 0) + (dayNav?.offsetHeight || 0) + 20;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
};

const ChronologyDayCard = ({ day, index, lang, t }) => {
  // Use the same page-scoped keys and precedence as DayImageGallery. This
  // keeps the chronology tied to the actual gallery curated for this exact
  // day instead of relying on a generic programme image.
  const legacyBase = useSlotId(`day.${day.id}`);
  const indexedKey = useSlotId(dayGallerySegment(index + 1, day.id));
  const indexedGallery = useDayGallery(indexedKey);
  const legacyGallery = useDayGallery(legacyBase);
  const managedGallery = indexedGallery?.length ? indexedGallery : legacyGallery;
  const selectedImage = resolveGalleryUrl(managedGallery?.[0]?.url)
    || getSlotUrl(`${legacyBase}.image`)
    || (Array.isArray(day.gallery) ? day.gallery[0] : null)
    || day.image;
  const dayNumber = String(index + 1).padStart(2, "0");
  const title = pick(day.title, lang);
  const summary = day.chronologySummary
    ? pick(day.chronologySummary, lang)
    : completeSummary(pick(day.body, lang));

  return (
    <article
      data-testid={`journey-chronology-day-${index + 1}`}
      className="group relative min-w-[78vw] snap-center pt-10 sm:min-w-[320px] md:min-w-0"
    >
      <span
        aria-hidden="true"
        className="absolute left-5 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-4 border-[#201A17] shadow-[0_0_0_1px_rgba(212,163,115,0.65)] md:left-1/2 md:-translate-x-1/2"
        style={{ backgroundColor: day.accent || "#D4A373" }}
      />

      <a
        href={`#${day.id}`}
        onClick={(event) => jumpToDay(event, day.id)}
        className="flex h-full min-h-[360px] flex-col overflow-hidden border border-[#FDFBF7]/10 bg-[#2A221E] transition duration-300 hover:-translate-y-1 hover:border-[#D4A373]/60 hover:shadow-[0_24px_45px_-30px_rgba(0,0,0,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
        aria-label={`${t.day} ${index + 1}: ${title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#161210]">
          <Img
            src={selectedImage}
            alt={title}
            width={640}
            sizes="(min-width: 768px) 190px, 78vw"
            priority={index === 0}
            data-testid={`journey-chronology-image-${index + 1}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A221E] via-transparent to-black/10" />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 bg-[#FDFBF7] px-3 py-2 text-[9px] uppercase tracking-[0.25em] text-[#2C2621]">
            <MapPin className="h-3 w-3 text-[#C16542]" strokeWidth={1.8} />
            {t.day} {dayNumber}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 xl:p-5">
          <h3 className="font-serif-x text-[21px] leading-[1.12] text-[#FDFBF7] md:text-lg xl:text-[21px]">
            {title}
          </h3>
          <p className="mt-3 min-h-[80px] text-xs leading-5 text-[#FDFBF7]/60 xl:text-[13px]">
            {summary}
          </p>
          <span className="mt-auto flex items-center gap-2 border-t border-[#FDFBF7]/10 pt-4 text-[9px] uppercase tracking-[0.23em] text-[#D4A373]">
            {t.explore}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </span>
        </div>
      </a>
    </article>
  );
};

export default function JourneyChronology({ days, lang = "es", variant = "ad" }) {
  const t = COPY[lang] || COPY.es;
  if (!Array.isArray(days) || days.length === 0) return null;
  const title = chronologyTitle(lang, days.length);

  return (
    <section
      id="journey-chronology"
      data-testid="journey-chronology"
      className="relative overflow-hidden bg-[#201A17] py-20 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at center, #D4A373 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-[1480px] px-5 md:px-10 xl:px-12">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.55fr)] lg:items-end md:mb-16">
          <div>
            <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[#D4A373]">
              <span className="h-px w-8 bg-current" />
              {t.eyebrow}
            </p>
            <h2 className="mt-5 max-w-3xl font-serif-x text-4xl leading-[1.04] text-[#FDFBF7] md:text-5xl lg:text-[58px]">
              {title}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#FDFBF7]/70 md:text-base">
            {t.body[variant] || t.body.ad}
          </p>
        </div>

        <div className="relative">
          <div aria-hidden="true" className="absolute left-6 right-6 top-[18px] hidden h-px bg-[#D4A373]/35 md:block" />
          <div
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 md:grid md:gap-3 md:overflow-visible md:pb-0 xl:gap-4"
            data-testid="journey-chronology-track"
            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
          >
            {days.map((day, index) => (
              <ChronologyDayCard
                key={`${day.id}-${index}`}
                day={day}
                index={index}
                lang={lang}
                t={t}
              />
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-[9px] uppercase tracking-[0.25em] text-[#FDFBF7]/40 md:hidden">
          {t.swipe}
        </p>
      </div>
    </section>
  );
}
