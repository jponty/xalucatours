import React, { useId } from "react";
import { Calendar, CalendarRange, CalendarClock, Users } from "lucide-react";
import { pick } from "@/contexts/LanguageContext";
import { TripDurationSummary } from "@/components/FormExtras";

const T = (es, en, fr) => ({ es, en, fr });
export const TRIP_PLANNING_COPY = {
  s1_title: T("Fechas del viaje", "Trip dates", "Dates du voyage"),
  s1_help: T("Elige fechas concretas, un rango o un mes orientativo.", "Pick exact dates, a range or a flexible month.", "Choisissez des dates précises, une plage ou un mois indicatif."),
  mode_range: T("Rango", "Range", "Plage"),
  mode_exact: T("Día concreto", "Exact day", "Date exacte"),
  mode_flex: T("Mes flexible", "Flexible month", "Mois flexible"),
  start_date: T("Fecha de inicio", "Start date", "Date de début"),
  end_date: T("Fecha de fin", "End date", "Date de fin"),
  exact_date: T("Día de llegada", "Arrival day", "Jour d'arrivée"),
  flex_month: T("Mes preferido", "Preferred month", "Mois préféré"),
  s2_title: T("Viajeros", "Travellers", "Voyageurs"),
  s2_help: T("Indica adultos y, si procede, niños menores de 12.", "Tell us about adults and children under 12.", "Indiquez les adultes et, le cas échéant, les enfants de moins de 12 ans."),
  adults: T("Adultos", "Adults", "Adultes"),
  children: T("Niños (3–11)", "Children (3–11)", "Enfants (3–11)"),
  optional: T("Opcional", "Optional", "Facultatif"),
};

export const planningInputClass = "w-full min-w-0 max-w-full bg-transparent border-b border-[#2C2621]/30 focus:border-[#C16542] outline-none py-3 text-[15px] text-[#2C2621] placeholder:text-[#5C5248]/45 transition-colors";

export const PlanningField = ({ label, hint, required, children, error, inputId, as: Wrapper = "label" }) => {
  const Label = inputId ? "label" : "span";
  return <Wrapper className="block min-w-0">
    <Label htmlFor={inputId} className="text-[11px] tracking-[0.3em] uppercase text-[#A07042]">
      {label}{required && <span className="text-[#C16542]"> *</span>}
    </Label>
    <div className="block mt-2">{children}</div>
    {error ? <span className="block mt-2 text-xs text-[#C16542]">{error}</span>
      : hint ? <span className="block mt-2 text-xs text-[#5C5248]/75">{hint}</span> : null}
  </Wrapper>;
};

export function PlanningSection({ step, icon: Icon, title, help, children, testid = `plan-step-${step}`, optionalLabel, headingAs: Heading = "h2" }) {
  return <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start min-w-0" data-testid={testid}>
    <header className="lg:col-span-4 min-w-0">
      <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase text-[#A07042]">
        <span>{step}</span><span className="w-8 h-px bg-[#A07042]/40" />
        {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.6} aria-hidden="true" />}
      </span>
      <Heading className="font-serif-x text-2xl md:text-3xl leading-[1.15] tracking-tight mt-4 text-[#2C2621]">{title}</Heading>
      {optionalLabel && <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#A07042]">{optionalLabel}</p>}
      <p className="mt-3 text-sm text-[#5C5248] leading-[1.75] max-w-xs">{help}</p>
    </header>
    <div className="lg:col-span-8 min-w-0">{children}</div>
  </section>;
}

// Shared with the detailed planner, including its existing CMS labels.
export default function TripPlanningFields({ value, onChange, lang, renderText, optional = false, testidPrefix = "", monthInputType = "text", monthDisabled = false, headingAs = "h2" }) {
  const uid = useId();
  const text = key => renderText ? renderText(key) : pick(TRIP_PLANNING_COPY[key], lang);
  const testid = key => `${testidPrefix}${key}`;
  const optionalLabel = optional ? pick(TRIP_PLANNING_COPY.optional, lang) : undefined;
  const hasTravellers = value.adults !== "" || value.children !== "";
  const total = Number(value.adults || 0) + Number(value.children || 0);
  return <>
    <PlanningSection step="01" icon={CalendarRange} title={text("s1_title")} help={text("s1_help")} optionalLabel={optionalLabel} testid={testid("plan-step-01")} headingAs={headingAs}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label={pick(TRIP_PLANNING_COPY.s1_title, lang)}>
        {[
          { id: "range", label: "mode_range", Icon: CalendarRange },
          { id: "exact", label: "mode_exact", Icon: Calendar },
          { id: "flexible", label: "mode_flex", Icon: CalendarClock },
        ].map(({ id, label, Icon }) => <button key={id} type="button" aria-pressed={value.dateMode === id} onClick={() => onChange("dateMode", id)} data-testid={testid(`date-mode-${id}`)}
          className={`group flex min-w-0 items-center gap-3 px-4 py-4 border text-[12px] tracking-[0.2em] uppercase transition-all ${value.dateMode === id ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]" : "bg-white border-[#2C2621]/15 hover:border-[#2C2621]/60 text-[#3D352C]"}`}>
          <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} aria-hidden="true" /><span>{text(label)}</span>
        </button>)}
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
        {value.dateMode === "range" && <>
          <PlanningField label={text("start_date")}><input type="date" name="start_date" data-testid={testid("start-date")} className={planningInputClass} value={value.startDate} max={value.endDate || undefined} onChange={event => onChange("startDate", event.target.value)} /></PlanningField>
          <PlanningField label={text("end_date")}><input type="date" name="end_date" data-testid={testid("end-date")} className={planningInputClass} value={value.endDate} min={value.startDate || undefined} onChange={event => onChange("endDate", event.target.value)} /></PlanningField>
          <TripDurationSummary startDate={value.startDate} endDate={value.endDate} lang={lang} className="md:col-span-2" testid={testidPrefix ? testid("trip-duration") : "planner-trip-duration"} />
        </>}
        {value.dateMode === "exact" && <PlanningField label={text("exact_date")}><input type="date" name="exact_date" data-testid={testid("exact-date")} className={planningInputClass} value={value.exactDate} onChange={event => onChange("exactDate", event.target.value)} /></PlanningField>}
        {value.dateMode === "flexible" && <PlanningField as="div" inputId={`${uid}-month`} label={text("flex_month")}>
          <input id={`${uid}-month`} name="flexible_month" aria-label={pick(TRIP_PLANNING_COPY.flex_month, lang)} type={monthInputType} disabled={monthDisabled} data-testid={testid("flex-month")} maxLength={40}
            placeholder={lang === "es" ? "Ej. Mayo 2026" : lang === "fr" ? "Ex. mai 2026" : "e.g. May 2026"} className={planningInputClass} value={value.flexMonth} onChange={event => onChange("flexMonth", event.target.value)} />
        </PlanningField>}
      </div>
    </PlanningSection>
    <PlanningSection step="02" icon={Users} title={text("s2_title")} help={text("s2_help")} optionalLabel={optionalLabel} testid={testid("plan-step-02")} headingAs={headingAs}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        <PlanningField label={text("adults")}><input type="number" name="travellers_adults" min={1} max={40} step={1} data-testid={testid("adults")} className={planningInputClass} value={value.adults} onChange={event => onChange("adults", event.target.value.replace(/[^0-9]/g, ""))} /></PlanningField>
        <PlanningField label={text("children")}><input type="number" name="travellers_children" min={0} max={20} step={1} data-testid={testid("children")} className={planningInputClass} value={value.children} onChange={event => onChange("children", event.target.value.replace(/[^0-9]/g, ""))} /></PlanningField>
      </div>
      <p role="status" aria-live="polite" data-testid={testid("travellers-total")} className="mt-5 text-[12px] tracking-[0.2em] uppercase text-[#A07042]">Total · {hasTravellers ? total : "—"}</p>
    </PlanningSection>
  </>;
}

// Use the contact API's existing fields so the lead and both notification emails
// retain the same information. Only the active date mode is submitted.
export function serializeOptionalTripDetails(value) {
  let travel_dates = null;
  if (value.dateMode === "range" && (value.startDate || value.endDate)) travel_dates = `Rango: ${value.startDate || "Por definir"} → ${value.endDate || "Por definir"}`;
  if (value.dateMode === "exact" && value.exactDate) travel_dates = `Día concreto: ${value.exactDate}`;
  if (value.dateMode === "flexible" && value.flexMonth) travel_dates = `Mes flexible: ${value.flexMonth}`;
  const hasTravellers = value.adults !== "" || value.children !== "";
  const total = Number(value.adults || 0) + Number(value.children || 0);
  const party_size = hasTravellers ? `Adultos: ${value.adults || "—"} · Niños: ${value.children || "—"} · Total: ${total}` : null;
  return { travel_dates, party_size };
}
