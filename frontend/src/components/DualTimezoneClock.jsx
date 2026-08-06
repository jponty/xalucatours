import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Clock3, MapPin, Moon, Search, Sun, Sunset } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage, pick } from "@/contexts/LanguageContext";

const STORAGE_KEY = "xaluca-clock-location";

const COPY = {
  overline: { es: "Hora local", en: "Local time", fr: "Heure locale" },
  body: {
    es: "Consulta la hora local antes de llamarnos o preparar tu próximo viaje.",
    en: "Check the local time before calling us or planning your next journey.",
    fr: "Consultez l'heure locale avant de nous appeler ou de préparer votre prochain voyage.",
  },
  morocco: { es: "Marruecos", en: "Morocco", fr: "Maroc" },
  change: { es: "Cambiar país o ciudad", en: "Change country or city", fr: "Changer de pays ou de ville" },
  selectorTitle: { es: "Elige tu hora local", en: "Choose your local time", fr: "Choisissez votre heure locale" },
  selectorBody: {
    es: "Busca tu país o una ciudad de referencia para compararla con la hora actual de Marruecos.",
    en: "Search for your country or a reference city to compare it with the current time in Morocco.",
    fr: "Recherchez votre pays ou une ville de référence pour la comparer à l'heure actuelle au Maroc.",
  },
  search: { es: "Buscar país o ciudad…", en: "Search country or city…", fr: "Rechercher un pays ou une ville…" },
  noResults: { es: "No encontramos esa ubicación.", en: "We couldn't find that location.", fr: "Cette destination est introuvable." },
  fixed: { es: "Comparación fija", en: "Fixed comparison", fr: "Comparaison fixe" },
  difference: { es: "Diferencia horaria", en: "Time difference", fr: "Décalage horaire" },
  sameTime: { es: "La misma hora que Marruecos", en: "The same time as Morocco", fr: "La même heure qu'au Maroc" },
  ahead: { es: "por delante de Marruecos", en: "ahead of Morocco", fr: "d'avance sur le Maroc" },
  behind: { es: "por detrás de Marruecos", en: "behind Morocco", fr: "de retard sur le Maroc" },
  periods: {
    day: { es: "Día", en: "Daytime", fr: "Journée" },
    afternoon: { es: "Tarde", en: "Afternoon", fr: "Après-midi" },
    night: { es: "Noche", en: "Night", fr: "Nuit" },
  },
  close: { es: "Cerrar", en: "Close", fr: "Fermer" },
};

const LOCALES = { es: "es-ES", en: "en-GB", fr: "fr-FR" };

const N = (es, en, fr) => ({ es, en, fr });

const LOCATIONS = [
  { id: "es-madrid", flag: "🇪🇸", country: N("España", "Spain", "Espagne"), city: "Madrid", timeZone: "Europe/Madrid", terms: "españa spain espagne" },
  { id: "fr-paris", flag: "🇫🇷", country: N("Francia", "France", "France"), city: "París", timeZone: "Europe/Paris", terms: "francia france paris parís" },
  { id: "gb-london", flag: "🇬🇧", country: N("Reino Unido", "United Kingdom", "Royaume-Uni"), city: "Londres", timeZone: "Europe/London", terms: "reino unido united kingdom royaume uni gran bretaña london londres" },
  { id: "pt-lisbon", flag: "🇵🇹", country: N("Portugal", "Portugal", "Portugal"), city: "Lisboa", timeZone: "Europe/Lisbon", terms: "portugal lisboa lisbon lisbonne" },
  { id: "de-berlin", flag: "🇩🇪", country: N("Alemania", "Germany", "Allemagne"), city: "Berlín", timeZone: "Europe/Berlin", terms: "alemania germany allemagne berlin berlín" },
  { id: "it-rome", flag: "🇮🇹", country: N("Italia", "Italy", "Italie"), city: "Roma", timeZone: "Europe/Rome", terms: "italia italy italie roma rome" },
  { id: "nl-amsterdam", flag: "🇳🇱", country: N("Países Bajos", "Netherlands", "Pays-Bas"), city: "Ámsterdam", timeZone: "Europe/Amsterdam", terms: "países bajos netherlands pays bas holanda amsterdam ámsterdam" },
  { id: "be-brussels", flag: "🇧🇪", country: N("Bélgica", "Belgium", "Belgique"), city: "Bruselas", timeZone: "Europe/Brussels", terms: "bélgica belgium belgique bruselas brussels bruxelles" },
  { id: "ch-zurich", flag: "🇨🇭", country: N("Suiza", "Switzerland", "Suisse"), city: "Zúrich", timeZone: "Europe/Zurich", terms: "suiza switzerland suisse zurich zúrich" },
  { id: "us-new-york", flag: "🇺🇸", country: N("Estados Unidos", "United States", "États-Unis"), city: "Nueva York", timeZone: "America/New_York", terms: "estados unidos united states usa etats unis états-unis nueva york new york" },
  { id: "us-chicago", flag: "🇺🇸", country: N("Estados Unidos", "United States", "États-Unis"), city: "Chicago", timeZone: "America/Chicago", terms: "estados unidos united states usa etats unis états-unis chicago" },
  { id: "us-los-angeles", flag: "🇺🇸", country: N("Estados Unidos", "United States", "États-Unis"), city: "Los Ángeles", timeZone: "America/Los_Angeles", terms: "estados unidos united states usa etats unis états-unis los angeles los ángeles california" },
  { id: "ca-toronto", flag: "🇨🇦", country: N("Canadá", "Canada", "Canada"), city: "Toronto", timeZone: "America/Toronto", terms: "canadá canada toronto" },
  { id: "ca-vancouver", flag: "🇨🇦", country: N("Canadá", "Canada", "Canada"), city: "Vancouver", timeZone: "America/Vancouver", terms: "canadá canada vancouver" },
  { id: "mx-mexico-city", flag: "🇲🇽", country: N("México", "Mexico", "Mexique"), city: "Ciudad de México", timeZone: "America/Mexico_City", terms: "méxico mexico mexique ciudad de mexico méxico cdmx" },
  { id: "mx-cancun", flag: "🇲🇽", country: N("México", "Mexico", "Mexique"), city: "Cancún", timeZone: "America/Cancun", terms: "méxico mexico mexique cancún cancun quintana roo" },
  { id: "ar-buenos-aires", flag: "🇦🇷", country: N("Argentina", "Argentina", "Argentine"), city: "Buenos Aires", timeZone: "America/Argentina/Buenos_Aires", terms: "argentina argentine buenos aires" },
  { id: "br-sao-paulo", flag: "🇧🇷", country: N("Brasil", "Brazil", "Brésil"), city: "São Paulo", timeZone: "America/Sao_Paulo", terms: "brasil brazil brésil sao paulo são paulo" },
  { id: "cl-santiago", flag: "🇨🇱", country: N("Chile", "Chile", "Chili"), city: "Santiago", timeZone: "America/Santiago", terms: "chile chili santiago" },
  { id: "co-bogota", flag: "🇨🇴", country: N("Colombia", "Colombia", "Colombie"), city: "Bogotá", timeZone: "America/Bogota", terms: "colombia colombie bogota bogotá" },
  { id: "jp-tokyo", flag: "🇯🇵", country: N("Japón", "Japan", "Japon"), city: "Tokio", timeZone: "Asia/Tokyo", terms: "japón japan japon tokio tokyo" },
  { id: "in-delhi", flag: "🇮🇳", country: N("India", "India", "Inde"), city: "Nueva Delhi", timeZone: "Asia/Kolkata", terms: "india inde nueva delhi new delhi kolkata calcuta" },
  { id: "ae-dubai", flag: "🇦🇪", country: N("Emiratos Árabes Unidos", "United Arab Emirates", "Émirats arabes unis"), city: "Dubái", timeZone: "Asia/Dubai", terms: "emiratos arabes unidos united arab emirates émirats arabes unis dubai dubái" },
  { id: "au-sydney", flag: "🇦🇺", country: N("Australia", "Australia", "Australie"), city: "Sídney", timeZone: "Australia/Sydney", terms: "australia australie sidney sydney sídney" },
];

const MOROCCO = {
  id: "morocco",
  flag: "🇲🇦",
  country: COPY.morocco,
  city: "Casablanca",
  timeZone: "Africa/Casablanca",
};

const normalize = (value = "") => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const localHour = (date, timeZone) => Number(
  new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date).find((part) => part.type === "hour")?.value || 0
);

const periodFor = (date, timeZone) => {
  const hour = localHour(date, timeZone);
  if (hour >= 6 && hour < 14) return "day";
  if (hour >= 14 && hour < 21) return "afternoon";
  return "night";
};

const offsetMinutes = (date, timeZone) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date).filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value])
  );
  const representedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return Math.round((representedAsUtc - date.getTime()) / 60000);
};

const formatDifference = (minutes, lang) => {
  if (minutes === 0) return pick(COPY.sameTime, lang);
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const remainder = absolute % 60;
  const amount = remainder ? `${hours ? `${hours} h ` : ""}${remainder} min` : `${hours} h`;
  return `${amount} ${pick(minutes > 0 ? COPY.ahead : COPY.behind, lang)}`;
};

const Period = ({ period, lang }) => {
  const Icon = period === "day" ? Sun : period === "afternoon" ? Sunset : Moon;
  return (
    <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-[#FDFBF7]/55 sm:text-[10px]">
      <Icon className="h-3 w-3 text-[#D4A373]" strokeWidth={1.6} aria-hidden="true" />
      {pick(COPY.periods[period], lang)}
    </span>
  );
};

const ClockCard = ({ zone, now, lang, locale, interactive, onSelect }) => {
  const time = useMemo(
    () => new Intl.DateTimeFormat(locale, {
      timeZone: zone.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now),
    [locale, now, zone.timeZone]
  );

  const date = useMemo(
    () => new Intl.DateTimeFormat(locale, {
      timeZone: zone.timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(now),
    [locale, now, zone.timeZone]
  );
  const period = periodFor(now, zone.timeZone);

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex min-w-0 items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#D4A373] sm:text-[10px]">
          <span className="text-base leading-none" aria-hidden="true">{zone.flag}</span>
          <span className="truncate">{pick(zone.country, lang)}</span>
          {interactive && <ChevronDown className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />}
        </span>
        <span className="hidden text-[9px] uppercase tracking-[0.18em] text-[#FDFBF7]/45 sm:block">
          {interactive ? zone.city : pick(COPY.fixed, lang)}
        </span>
      </div>
      <time
        dateTime={now.toISOString()}
        data-testid={`home-clock-time-${zone.id}`}
        className="mt-4 block font-serif-x text-[32px] leading-none tabular-nums tracking-tight text-[#FDFBF7] sm:text-4xl lg:text-[42px]"
      >
        {time}
      </time>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="truncate text-[9px] capitalize tracking-[0.1em] text-[#FDFBF7]/55 sm:text-[10px]">{date}</p>
        <Period period={period} lang={lang} />
      </div>
    </>
  );

  return (
    <article
      data-testid={`home-clock-${zone.id}`}
      className={`relative overflow-hidden border border-[#FDFBF7]/15 bg-[#FDFBF7]/[0.055] ${interactive ? "transition-colors hover:border-[#D4A373]/60 hover:bg-[#FDFBF7]/[0.09]" : ""}`}
    >
      {interactive ? (
        <button
          type="button"
          onClick={onSelect}
          data-testid="home-clock-location-trigger"
          aria-label={`${pick(COPY.change, lang)}: ${pick(zone.country, lang)}, ${zone.city}`}
          className="block w-full px-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4A373] sm:px-6 sm:py-6"
        >
          {content}
        </button>
      ) : (
        <div className="px-4 py-5 sm:px-6 sm:py-6">{content}</div>
      )}
    </article>
  );
};

export default function DualTimezoneClock() {
  const { lang } = useLanguage();
  const [now, setNow] = useState(() => new Date());
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return LOCATIONS.some(({ id }) => id === stored) ? stored : LOCATIONS[0].id;
    } catch (_) {
      return LOCATIONS[0].id;
    }
  });
  const locale = LOCALES[lang] || LOCALES.es;
  const selected = LOCATIONS.find(({ id }) => id === selectedId) || LOCATIONS[0];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredLocations = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return LOCATIONS;
    return LOCATIONS.filter((location) => normalize(
      `${location.terms} ${location.city} ${Object.values(location.country).join(" ")}`
    ).includes(needle));
  }, [query]);

  const difference = offsetMinutes(now, selected.timeZone) - offsetMinutes(now, MOROCCO.timeZone);
  const title = lang === "en"
    ? `${pick(selected.country, lang)} and ${pick(COPY.morocco, lang)}, right now.`
    : lang === "fr"
      ? `${pick(selected.country, lang)} et le ${pick(COPY.morocco, lang)}, maintenant.`
      : `${pick(selected.country, lang)} y ${pick(COPY.morocco, lang)}, ahora.`;

  const chooseLocation = (location) => {
    setSelectedId(location.id);
    try { window.localStorage.setItem(STORAGE_KEY, location.id); } catch (_) { /* storage may be unavailable */ }
    setSelectorOpen(false);
    setQuery("");
  };

  return (
    <>
      <section
        data-testid="home-dual-timezone-clock"
        aria-label={title}
        className="relative overflow-hidden border-t border-[#FDFBF7]/10 bg-[#1A1513] py-8 text-[#FDFBF7] md:py-10"
      >
        <div className="absolute inset-0 berber-bg-cross opacity-15 pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-12 md:items-center md:gap-8 md:px-12">
          <div className="md:col-span-4">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#D4A373]">
              <Clock3 className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
              {pick(COPY.overline, lang)}
            </span>
            <h2 data-testid="home-clock-title" className="mt-3 font-serif-x text-2xl leading-tight text-[#FDFBF7] md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-[#FDFBF7]/60 md:text-sm">
              {pick(COPY.body, lang)}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 border border-[#D4A373]/30 bg-[#D4A373]/10 px-3 py-2 text-[10px] tracking-[0.08em] text-[#E2B98A]">
              <Clock3 className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" />
              <span><strong className="font-semibold">{pick(COPY.difference, lang)}:</strong> {formatDifference(difference, lang)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:col-span-8">
            <ClockCard zone={selected} now={now} lang={lang} locale={locale} interactive onSelect={() => setSelectorOpen(true)} />
            <ClockCard zone={MOROCCO} now={now} lang={lang} locale={locale} />
          </div>
        </div>
      </section>

      <Dialog open={selectorOpen} onOpenChange={(open) => { setSelectorOpen(open); if (!open) setQuery(""); }}>
        <DialogContent
          data-testid="home-clock-location-dialog"
          closeLabel={pick(COPY.close, lang)}
          className="w-[calc(100%-1.5rem)] max-w-2xl max-h-[88vh] gap-0 overflow-hidden border border-[#2C2621]/10 bg-[#FDFBF7] p-0 text-[#2C2621] shadow-[0_30px_90px_-35px_rgba(26,21,19,0.75)] sm:rounded-none"
        >
          <header className="border-b border-[#2C2621]/10 px-5 py-6 pr-14 sm:px-8 sm:py-8 sm:pr-16">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#C16542]">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" />
              {pick(COPY.change, lang)}
            </span>
            <DialogTitle className="mt-3 font-serif-x text-3xl font-normal leading-tight sm:text-4xl">
              {pick(COPY.selectorTitle, lang)}
            </DialogTitle>
            <DialogDescription className="mt-3 max-w-xl text-sm leading-relaxed text-[#2C2621]/65">
              {pick(COPY.selectorBody, lang)}
            </DialogDescription>
          </header>

          <div className="border-b border-[#2C2621]/10 p-4 sm:px-8 sm:py-5">
            <label className="relative block">
              <span className="sr-only">{pick(COPY.search, lang)}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2C2621]/40" strokeWidth={1.7} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={pick(COPY.search, lang)}
                autoFocus
                data-testid="home-clock-location-search"
                className="h-12 w-full border border-[#2C2621]/15 bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-[#2C2621]/40 focus:border-[#C16542]"
              />
            </label>
          </div>

          <div className="max-h-[48vh] overflow-y-auto p-3 sm:p-5" role="listbox" aria-label={pick(COPY.selectorTitle, lang)}>
            {filteredLocations.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {filteredLocations.map((location) => {
                  const active = location.id === selected.id;
                  return (
                    <button
                      key={location.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      data-testid={`home-clock-location-${location.id}`}
                      onClick={() => chooseLocation(location)}
                      className={`flex min-h-16 items-center gap-3 border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16542] ${active ? "border-[#C16542] bg-[#C16542]/[0.07]" : "border-[#2C2621]/10 bg-white hover:border-[#C16542]/45"}`}
                    >
                      <span className="text-2xl leading-none" aria-hidden="true">{location.flag}</span>
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate text-sm font-medium">{pick(location.country, lang)}</strong>
                        <span className="mt-0.5 block truncate text-[11px] text-[#2C2621]/55">{location.city}</span>
                      </span>
                      {active && <Check className="h-4 w-4 shrink-0 text-[#C16542]" strokeWidth={2} aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-[#2C2621]/55">{pick(COPY.noResults, lang)}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
