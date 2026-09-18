import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun,
  Droplets, MapPin, Moon, RefreshCw, Sun, Thermometer, Wind } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { HERO, REGIONS, SEASONS, MONTHS } from "@/lib/bestTimeData";
import { CLIMATE_COPY, climateDate, skyCondition, temperature } from "@/lib/climateCopy";
import useClimate from "@/hooks/useClimate";
import EditableImage from "@/components/EditableImage";
import HeroMonogram from "@/components/HeroMonogram";
import SectionNav from "@/components/SectionNav";
import { parseBestMonthsEn } from "@/components/BestMonthFab";
import "./ClimatePage.css";

const SKY_ICONS = { clear: Sun, fair: CloudSun, partlycloudy: CloudSun, cloudy: Cloud,
  fog: CloudFog, rain: CloudRain, snow: CloudSnow, sleet: CloudSnow, thunder: CloudLightning, unknown: Cloud };
const NAV = [
  { id: "clima-ahora", label: CLIMATE_COPY.now },
  { id: "clima-regiones", label: CLIMATE_COPY.regions },
  { id: "clima-temporadas", label: CLIMATE_COPY.seasons },
];
const External = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;

function DataNotice({ loading, copy, retry }) {
  return <div className="climate-notice" role="status">
    <p>{copy(loading ? "loading" : "unavailable")}</p>
    {!loading && <><p className="climate-muted">{copy("unavailableHelp")}</p>
      <button type="button" onClick={retry} className="climate-text-button"><RefreshCw size={15} />{copy("refresh")}</button></>}
  </div>;
}

export function WeatherCard({ item, lang, copy }) {
  const sky = skyCondition(item.symbol);
  const Icon = sky.night && sky.kind === "clear" ? Moon : SKY_ICONS[sky.kind];
  return <article className="climate-weather-card" data-testid={`weather-${item.id}`}>
    <div className="climate-place"><MapPin size={14} aria-hidden="true" /><h3>{item.id === "atlas" ? `${pick(REGIONS.find((r) => r.id === "atlas").name, lang)} · Imlil` : item.name}</h3></div>
    {item.status === "unavailable" ? <p className="climate-unavailable">{copy("unavailable")}</p> : <>
      {item.status === "stale" && <p className="climate-stale" role="status">{copy("stale")}</p>}
      <div className="climate-current"><span>{temperature(item.temperature, lang)}</span><Icon size={42} strokeWidth={1.2} aria-hidden="true" /></div>
      <p className="climate-sky">{pick(sky.label, lang)}</p>
      <p className="climate-feels">{copy("feels")} · {temperature(item.feels_like, lang)}</p>
      <dl className="climate-measures">
        <div><dt><Thermometer size={14} />{copy("range")}</dt><dd>{temperature(item.high, lang)} / {temperature(item.low, lang)}</dd></div>
        <div><dt><Wind size={14} />{copy("wind")}</dt><dd>{Number.isFinite(item.wind_kmh) ? `${Math.round(item.wind_kmh)} km/h` : "—"}</dd></div>
        <div><dt><Droplets size={14} />{copy("humidity")}</dt><dd>{Number.isFinite(item.humidity) ? `${Math.round(item.humidity)} %` : "—"}</dd></div>
      </dl>
      <div className="climate-timestamps">
        <p>{copy("valid")}: <time dateTime={item.valid_at}>{climateDate(item.valid_at, lang)}</time></p>
        <p>{copy("model")}: <time dateTime={item.updated_at}>{climateDate(item.updated_at, lang)}</time></p>
        <p>{copy("checked")}: <time dateTime={item.checked_at}>{climateDate(item.checked_at, lang)}</time></p>
      </div>
    </>}
  </article>;
}

export default function ClimatePage() {
  const { lang } = useLanguage();
  const copy = (key) => pick(CLIMATE_COPY[key], lang);
  const weather = useClimate("current", 15 * 60 * 1000);
  const normals = useClimate("normals");
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const [month, setMonth] = useState(() => Number(new Intl.DateTimeFormat("en", { month: "numeric", timeZone: "Africa/Casablanca" }).format(new Date())));
  const tabRefs = useRef([]);
  const region = REGIONS.find((item) => item.id === regionId);
  const bestMonths = parseBestMonthsEn(region.best.en);
  const average = normals.data?.locations.find((item) => item.id === regionId);
  const selected = average?.months?.find((item) => item.month === month);
  const monthName = pick(MONTHS.find((item) => item.id === month)?.name, lang);

  const navigateRegions = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % REGIONS.length;
    if (event.key === "ArrowLeft") next = (index - 1 + REGIONS.length) % REGIONS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = REGIONS.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setRegionId(REGIONS[next].id);
    tabRefs.current[next]?.focus();
  };

  return <div className="climate-page" data-testid="climate-page">
    <section className="climate-hero">
      <EditableImage slot="climate.hero.bg" fallback={HERO.hero_image} alt="" priority className="climate-hero-image" />
      <div className="climate-hero-shade" aria-hidden="true" />
      <HeroMonogram />
      <div className="climate-container climate-hero-copy">
        <p className="climate-eyebrow"><Sun size={16} />{copy("eyebrow")}</p>
        <h1 className="font-serif-x">{copy("title")}</h1>
        <p className="climate-lead">{copy("intro")}</p>
        <div className="climate-actions"><a className="climate-button" href="#clima-ahora">{copy("now")}<ArrowRight size={17} /></a>
          <a className="climate-hero-link" href="#clima-regiones">{copy("regions")}<CalendarDays size={17} /></a></div>
      </div>
    </section>
    <SectionNav items={NAV} testid="climate-nav" />

    <section id="clima-ahora" className="climate-section">
      <div className="climate-container">
        <div className="climate-heading-row"><div className="climate-heading">
          <p className="climate-eyebrow">{copy("liveEyebrow")}</p>
          <h2 className="font-serif-x">{copy("liveTitle")}</h2><p>{copy("liveIntro")}</p>
        </div><button type="button" disabled={weather.loading} onClick={weather.refresh} className="climate-refresh">
          <RefreshCw size={16} aria-hidden="true" />{copy("refresh")}</button></div>
        {!weather.data ? <DataNotice loading={weather.loading} copy={copy} retry={weather.refresh} /> :
          <div className="climate-weather-grid" aria-busy={weather.loading}>
            {weather.data.locations.map((item) => <WeatherCard key={item.id} item={item} lang={lang} copy={copy} />)}
            <div className="climate-weather-editorial"><Sun size={30} strokeWidth={1} /><p className="font-serif-x">{copy("title")}</p>
              <a href="#clima-regiones">{copy("regions")}<ArrowRight size={16} /></a></div>
          </div>}
        <div className="climate-source"><p>{copy("sourceNote")}</p><p>{copy("timeZone")}</p>
          <p><External href="https://api.met.no/weatherapi/locationforecast/2.0/documentation">MET Norway · Locationforecast</External>{" · "}
            <External href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</External>{" · "}
            <External href="https://www.bom.gov.au/info/thermal_stress/#atapproximation">Steadman / BOM</External></p>
        </div>
      </div>
    </section>

    <section id="clima-regiones" className="climate-section climate-regions-section">
      <div className="climate-container">
        <div className="climate-heading"><p className="climate-eyebrow">{copy("regionalEyebrow")}</p>
          <h2 className="font-serif-x">{copy("regionalTitle")}</h2><p>{copy("regionalIntro")}</p></div>
        <div className="climate-region-tabs" role="tablist" aria-label={copy("regions")}>
          {REGIONS.map((item, index) => <button key={item.id} type="button" role="tab" id={`climate-tab-${item.id}`}
            ref={(node) => { tabRefs.current[index] = node; }} aria-selected={regionId === item.id}
            aria-controls={`climate-region-${item.id}`} tabIndex={regionId === item.id ? 0 : -1}
            onClick={() => setRegionId(item.id)} onKeyDown={(event) => navigateRegions(event, index)}>{pick(item.name, lang)}</button>)}
        </div>
        <div className="climate-region-panel" role="tabpanel" id={`climate-region-${region.id}`} aria-labelledby={`climate-tab-${region.id}`}
          style={{ "--climate-accent": region.accent }}>
          <div className="climate-region-description">
            <span className="climate-region-number" aria-hidden="true">0{REGIONS.indexOf(region) + 1}</span>
            <h3 className="font-serif-x">{pick(region.name, lang)}</h3>
            <p>{pick(region.body, lang)}</p>
            <div className="climate-best"><CalendarDays size={20} /><div><h4>{copy("best")}</h4><p>{pick(region.best, lang)}</p></div></div>
            <div className="climate-caution"><h4>{copy("consider")}</h4><p>{pick(region.avoid, lang)}</p></div>
          </div>
          <div className="climate-region-data">
            <h4>{copy("chooseMonth")}</h4>
            <div className="climate-months" role="group" aria-label={copy("chooseMonth")}>
              {MONTHS.map((item) => <button type="button" key={item.id} aria-pressed={month === item.id}
                aria-label={`${pick(item.name, lang)}${bestMonths.includes(item.id) ? ` · ${copy("recommended")}` : ""}`}
                className={bestMonths.includes(item.id) ? "is-recommended" : ""} onClick={() => setMonth(item.id)}>
                {new Intl.DateTimeFormat(lang, { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2020, item.id - 1, 15)))}
              </button>)}
            </div>
            <p className="climate-month-legend"><span />{copy("recommended")}</p>
            <div aria-live="polite" aria-atomic="true">
              <p className="climate-month-title font-serif-x">{monthName}</p>
              {!selected ? <DataNotice loading={normals.loading} copy={copy} retry={normals.refresh} /> : <>
                {average.status === "stale" && <p className="climate-stale">{copy("stale")}</p>}
                <p className="climate-reference">{copy("typical")} · {average.name}</p>
                <dl className="climate-normals"><div><dt><Sun size={17} />{copy("high")}</dt><dd>{temperature(selected.high, lang, 1)}</dd></div>
                  <div><dt><Moon size={17} />{copy("low")}</dt><dd>{temperature(selected.low, lang, 1)}</dd></div></dl>
                <p className="climate-difference">{copy("difference")}: <strong>{temperature(selected.high - selected.low, lang, 1)}</strong></p>
                <p className="climate-period">{average.period}</p>
              </>}
            </div>
          </div>
        </div>
        <div className="climate-source"><p>{copy("normalsNote")}</p><External href="https://power.larc.nasa.gov/docs/methodology/data/processing/">NASA POWER · MERRA-2</External></div>
        <Link className="climate-text-button" to={pathFor(lang, "whenToTravel")}>{copy("guide")}<ArrowRight size={17} /></Link>
      </div>
    </section>

    <section id="clima-temporadas" className="climate-section">
      <div className="climate-container">
        <div className="climate-heading"><p className="climate-eyebrow">Xaluca Tours · {copy("seasons")}</p>
          <h2 className="font-serif-x">{copy("seasons")}</h2><p>{copy("seasonIntro")}</p></div>
        <div className="climate-seasons-grid">{SEASONS.map((season) => <article key={season.id} className="climate-season-card">
          <div className="climate-season-image"><EditableImage slot={`climate.season.${season.id}`} fallback={season.recommended[0].image}
            alt={pick(season.title, lang)} className="w-full h-full object-cover" loading="lazy" /></div>
          <div className="climate-season-copy"><p className="climate-eyebrow">{pick(season.months, lang)}</p>
            <h3 className="font-serif-x">{pick(season.title, lang)}</h3><p>{pick(season.idealFor, lang)}</p>
            <h4>{copy("experience")}</h4><p>{pick(season.activities, lang)}</p>
            <Link to={pathFor(lang, season.recommended[0].route)} className="climate-text-button">{pick(season.recommended[0].label, lang)}<ArrowRight size={16} /></Link>
          </div>
        </article>)}</div>
      </div>
    </section>
    <section className="climate-contact"><div className="climate-container"><div>
      <h2 className="font-serif-x">{copy("plan")}</h2><p>{copy("planBody")}</p></div>
      <Link className="climate-button" to={pathFor(lang, "planTrip")}>{copy("contact")}<ArrowRight size={17} /></Link></div></section>
  </div>;
}
