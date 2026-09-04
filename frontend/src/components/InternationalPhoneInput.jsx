import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isPossiblePhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

const COUNTRY_STORAGE_KEY = "xaluca:phone-country";
const SUPPORTED_COUNTRIES = new Set(getCountries());
const DEFAULT_COUNTRY = "ES";
const CALLING_CODE_DEFAULTS = {
  "1": "US",
  "7": "RU",
  "39": "IT",
  "44": "GB",
  "47": "NO",
  "61": "AU",
  "212": "MA",
  "262": "RE",
  "290": "SH",
  "358": "FI",
  "590": "GP",
  "599": "CW",
};

const TIMEZONE_COUNTRIES = {
  "Africa/Casablanca": "MA",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Los_Angeles": "US",
  "America/Mexico_City": "MX",
  "America/New_York": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Asia/Tokyo": "JP",
  "Europe/Lisbon": "PT",
  "Europe/London": "GB",
  "Europe/Madrid": "ES",
  "Europe/Paris": "FR",
};

const COPY = {
  es: { country: "País y prefijo", changeCountry: "Cambiar país y prefijo", search: "Buscar país o +34…", noResults: "No se ha encontrado ningún país.", number: "Número de teléfono", invalid: "Introduce un número de teléfono válido con su prefijo internacional." },
  en: { country: "Country and calling code", changeCountry: "Change country and calling code", search: "Search country or +44…", noResults: "No country found.", number: "Phone number", invalid: "Enter a valid phone number with its international calling code." },
  fr: { country: "Pays et indicatif", changeCountry: "Changer de pays et d’indicatif", search: "Rechercher un pays ou +33…", noResults: "Aucun pays trouvé.", number: "Numéro de téléphone", invalid: "Saisissez un numéro valide avec son indicatif international." },
};

const languageKey = (lang) => (String(lang || "es").toLowerCase().startsWith("en")
  ? "en"
  : String(lang || "es").toLowerCase().startsWith("fr") ? "fr" : "es");

const localeFor = (lang) => ({ es: "es-ES", en: "en-GB", fr: "fr-FR" }[languageKey(lang)]);

const flagFor = (country) => country
  .toUpperCase()
  .replace(/./g, (character) => String.fromCodePoint(127397 + character.charCodeAt(0)));

const countryFromValue = (value) => {
  if (!value || !String(value).trim().startsWith("+")) return null;
  try {
    return parsePhoneNumberFromString(String(value).trim())?.country || null;
  } catch (_) {
    return null;
  }
};

const countryFromCallingCode = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return null;
  return getCountries()
    .map((country) => ({ country, code: getCountryCallingCode(country) }))
    .sort((a, b) => b.code.length - a.code.length)
    .find(({ code }) => digits.startsWith(code))?.country || null;
};

export const countryForCallingCode = (value) => {
  const callingCode = String(value || "").trim().replace(/^\+/, "");
  if (!/^\d+$/.test(callingCode)) return null;
  const matches = getCountries().filter((country) => getCountryCallingCode(country) === callingCode);
  const preferred = CALLING_CODE_DEFAULTS[callingCode];
  if (preferred && matches.includes(preferred)) return preferred;
  return matches.length === 1 ? matches[0] : null;
};

export const normalizeIncompleteInternationalPhone = (value) =>
  `+${String(value || "").replace(/\D/g, "")}`;

const detectCountry = (value) => {
  const valueCountry = countryFromValue(value);
  if (valueCountry) return valueCountry;

  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(COUNTRY_STORAGE_KEY)?.toUpperCase();
    if (saved && SUPPORTED_COUNTRIES.has(saved)) return saved;
  }

  if (typeof navigator !== "undefined") {
    for (const locale of navigator.languages || [navigator.language]) {
      try {
        const region = new Intl.Locale(locale).maximize().region?.toUpperCase();
        if (region && SUPPORTED_COUNTRIES.has(region)) return region;
      } catch (_) {
        // Older browsers can lack Intl.Locale; the time-zone fallback below still applies.
      }
    }
  }

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIMEZONE_COUNTRIES[timezone]) return TIMEZONE_COUNTRIES[timezone];
  } catch (_) {
    // Keep the stable default when browser locale data is unavailable.
  }

  return DEFAULT_COUNTRY;
};

const nationalDigitsFor = (value, country) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = parsePhoneNumberFromString(raw, country);
    if (parsed) return parsed.nationalNumber;
  } catch (_) {
    // Fall through to a digits-only representation for incomplete legacy values.
  }
  return raw.replace(/\D/g, "");
};

const formatNational = (digits, country) => {
  if (!digits) return "";
  try {
    return new AsYouType(country).input(digits);
  } catch (_) {
    return digits;
  }
};

export const normalizeInternationalPhone = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = parsePhoneNumberFromString(raw);
    return parsed?.number || raw.replace(/[^+\d]/g, "");
  } catch (_) {
    return raw.replace(/[^+\d]/g, "");
  }
};

export const isValidInternationalPhone = (value) => {
  const normalized = normalizeInternationalPhone(value);
  if (!normalized.startsWith("+")) return false;
  try {
    return isPossiblePhoneNumber(normalized);
  } catch (_) {
    return false;
  }
};

export default function InternationalPhoneInput({
  value,
  onValueChange,
  lang = "es",
  name = "phone",
  required = false,
  disabled = false,
  invalid = false,
  testId,
  autoComplete = "tel",
  tone = "light",
  className = "",
}) {
  const initialCountry = useRef(detectCountry(value));
  const [country, setCountry] = useState(initialCountry.current);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [national, setNational] = useState(() => formatNational(
    nationalDigitsFor(value, initialCountry.current),
    initialCountry.current,
  ));
  const lastEmitted = useRef(value || "");
  const copy = COPY[languageKey(lang)];

  const countryOptions = useMemo(() => {
    const displayNames = typeof Intl.DisplayNames === "function"
      ? new Intl.DisplayNames([localeFor(lang)], { type: "region" })
      : null;
    const searchDisplayNames = typeof Intl.DisplayNames === "function"
      ? ["es-ES", "en-GB", "fr-FR"].map((locale) => new Intl.DisplayNames([locale], { type: "region" }))
      : [];
    return getCountries()
      .map((countryCode) => ({
        code: countryCode,
        label: displayNames?.of(countryCode) || countryCode,
        searchTerms: searchDisplayNames.map((names) => names.of(countryCode)).filter(Boolean).join(" "),
        callingCode: getCountryCallingCode(countryCode),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, localeFor(lang)));
  }, [lang]);

  const selectedCountry = countryOptions.find((option) => option.code === country)
    || countryOptions.find((option) => option.code === DEFAULT_COUNTRY);

  useEffect(() => {
    const external = value || "";
    if (external === lastEmitted.current) return;
    const nextCountry = detectCountry(external);
    setCountry(nextCountry);
    setNational(formatNational(nationalDigitsFor(external, nextCountry), nextCountry));
    lastEmitted.current = external;
  }, [value]);

  const emit = (nextCountry, digits) => {
    const normalized = digits ? `+${getCountryCallingCode(nextCountry)}${digits}` : "";
    lastEmitted.current = normalized;
    onValueChange(normalized);
  };

  const selectCountry = (nextCountry) => {
    const digits = national.replace(/\D/g, "");
    setCountry(nextCountry);
    setNational(formatNational(digits, nextCountry));
    if (typeof window !== "undefined") window.localStorage.setItem(COUNTRY_STORAGE_KEY, nextCountry);
    emit(nextCountry, digits);
    setCountryQuery("");
    setCountryOpen(false);
  };

  const searchCountry = (query) => {
    setCountryQuery(query);
    const trimmed = query.trim();
    if (!/^\+\d+$/.test(trimmed)) return;
    const exactCountry = countryForCallingCode(trimmed);
    if (exactCountry) selectCountry(exactCountry);
  };

  const changeNumber = (event) => {
    event.currentTarget.setCustomValidity("");
    const raw = event.target.value;
    if (raw.trim().startsWith("+")) {
      const pastedCountry = countryFromValue(raw) || countryForCallingCode(raw) || countryFromCallingCode(raw);
      if (pastedCountry) {
        const callingCode = getCountryCallingCode(pastedCountry);
        const allDigits = raw.replace(/\D/g, "");
        const digits = allDigits.startsWith(callingCode) ? allDigits.slice(callingCode.length) : allDigits;
        setCountry(pastedCountry);
        setNational(formatNational(digits, pastedCountry));
        if (typeof window !== "undefined") window.localStorage.setItem(COUNTRY_STORAGE_KEY, pastedCountry);
        emit(pastedCountry, digits);
        return;
      }

      const incompleteInternational = normalizeIncompleteInternationalPhone(raw);
      setNational(incompleteInternational);
      lastEmitted.current = incompleteInternational;
      onValueChange(incompleteInternational);
      return;
    }

    const digits = raw.replace(/\D/g, "");
    setNational(formatNational(digits, country));
    emit(country, digits);
  };

  const validateNumber = (event) => {
    event.currentTarget.setCustomValidity(
      !value || isValidInternationalPhone(value) ? "" : copy.invalid,
    );
  };

  const dark = tone === "dark";
  const borderClass = invalid
    ? "border-red-500 focus-within:border-red-400"
    : dark
      ? "border-white/25 focus-within:border-[#D4A373]"
      : "border-[#2C2621]/20 focus-within:border-[#C16542]";
  const textClass = dark ? "text-[#FDFBF7]" : "text-[#2C2621]";

  return (
    <div className={`flex min-w-0 flex-col gap-2 sm:flex-row ${className}`} data-phone-input>
      <Popover
        open={countryOpen}
        onOpenChange={(open) => {
          setCountryOpen(open);
          if (!open) setCountryQuery("");
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={copy.changeCountry}
            aria-expanded={countryOpen}
            data-testid={testId ? `${testId}-country` : undefined}
            className={`flex h-12 min-w-0 items-center gap-2 border bg-transparent px-3 text-left text-[13px] transition-colors disabled:opacity-60 sm:w-[48%] ${borderClass} ${textClass}`}
          >
            <span aria-hidden="true" className="shrink-0 text-base leading-none">{flagFor(selectedCountry.code)}</span>
            <span className="min-w-0 flex-1 truncate">
              {selectedCountry.label} <span className={dark ? "text-white/65" : "text-[#2C2621]/60"}>&middot; +{selectedCountry.callingCode}</span>
            </span>
            <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 transition-transform ${countryOpen ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className={`z-[220] w-[min(92vw,24rem)] overflow-hidden rounded-none p-0 shadow-2xl ${dark ? "border-white/15 bg-[#1A1513] text-[#FDFBF7]" : "border-[#2C2621]/15 bg-[#FDFBF7] text-[#2C2621]"}`}
        >
          <Command className={dark ? "bg-[#1A1513] text-[#FDFBF7]" : "bg-[#FDFBF7] text-[#2C2621]"} shouldFilter>
            <CommandInput
              value={countryQuery}
              onValueChange={searchCountry}
              placeholder={copy.search}
              aria-label={copy.country}
              data-testid={testId ? `${testId}-country-search` : undefined}
              className={dark ? "text-[#FDFBF7] placeholder:text-white/40" : "text-[#2C2621]"}
            />
            <CommandList className="max-h-[min(19rem,48vh)] overscroll-contain">
              <CommandEmpty className={dark ? "py-6 text-center text-sm text-white/60" : "py-6 text-center text-sm text-[#2C2621]/60"}>{copy.noResults}</CommandEmpty>
              {countryOptions.map((option) => (
                <CommandItem
                  key={option.code}
                  value={`${option.label} ${option.searchTerms} ${option.code} +${option.callingCode}`}
                  onSelect={() => selectCountry(option.code)}
                  className={`rounded-none px-3 py-2.5 ${dark ? "data-[selected=true]:bg-white/10 data-[selected=true]:text-white" : "data-[selected=true]:bg-[#C16542]/10"}`}
                >
                  <span aria-hidden="true" className="w-6 shrink-0 text-base">{flagFor(option.code)}</span>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  <span className={dark ? "text-white/60" : "text-[#2C2621]/55"}>+{option.callingCode}</span>
                  <Check aria-hidden="true" className={`h-3.5 w-3.5 text-[#C16542] ${country === option.code ? "opacity-100" : "opacity-0"}`} />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <label className={`min-w-0 flex-1 border transition-colors ${borderClass}`}>
        <span className="sr-only">{copy.number}</span>
        <input
          type="tel"
          inputMode="tel"
          name={name}
          value={national}
          onChange={changeNumber}
          onBlur={validateNumber}
          onInvalid={validateNumber}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={32}
          aria-label={copy.number}
          aria-invalid={invalid || undefined}
          data-testid={testId}
          placeholder="612 345 678"
          className={`h-12 w-full bg-transparent px-3 text-[14px] outline-none placeholder:text-current placeholder:opacity-35 disabled:opacity-60 ${textClass}`}
        />
      </label>
    </div>
  );
}
