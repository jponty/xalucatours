import React, { useId } from "react";
import { pick } from "@/contexts/LanguageContext";

export const PERSONAL_NAME_LABELS = {
  first_name: { es: "Nombre", en: "First name", fr: "Prénom" },
  last_name: { es: "Apellido(s)", en: "Last name(s)", fr: "Nom de famille" },
};
export const personalNameFields = form => ({
  first_name: (form.first_name || "").trim().replace(/\s+/g, " "),
  last_name: (form.last_name || "").trim().replace(/\s+/g, " "),
});
export const hasPersonalName = form => Object.values(personalNameFields(form)).every(Boolean);

/** Two independent fields; the parent grid controls placement across devices. */
export default function PersonalNameFields({ value, onChange, lang = "es", required = true, disabled = false,
  errors = {}, inputClass = "", labelClass = "text-sm", testIdPrefix = "person", className = "" }) {
  const id = useId();
  return ["first_name", "last_name"].map(key => <div key={key} className={`min-w-0 ${className}`}>
    <label htmlFor={`${id}-${key}`} className={`mb-2 block ${labelClass}`}>
      {pick(PERSONAL_NAME_LABELS[key], lang)}{required ? " *" : ` (${pick({ es: "opcional", en: "optional", fr: "facultatif" }, lang)})`}
    </label>
    <input id={`${id}-${key}`} type="text" name={key} required={required} disabled={disabled}
      autoComplete={key === "first_name" ? "given-name" : "family-name"} maxLength={key === "first_name" ? 120 : 150}
      value={value[key] || ""} onChange={event => onChange(key, event.target.value)} className={inputClass}
      aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${id}-${key}-error` : undefined}
      data-testid={`${testIdPrefix}-${key}`} />
    {errors[key] && <p id={`${id}-${key}-error`} role="alert" className="mt-2 text-xs text-[#C16542]">{errors[key]}</p>}
  </div>);
}
