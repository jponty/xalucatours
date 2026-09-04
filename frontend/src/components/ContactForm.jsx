import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Mail, Phone, Check, Clock } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { resolvePath } from "@/lib/routes";
import { TRAVEL_CATEGORIES, CONTACT } from "@/lib/data";
import EditableText from "@/components/EditableText";
import { WhatHappensNext, ContactPreference, TripDurationSummary } from "@/components/FormExtras";
import InternationalPhoneInput, { isValidInternationalPhone } from "@/components/InternationalPhoneInput";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initialState = {
  full_name: "",
  email: "",
  phone: "",
  travel_start_date: "",
  travel_end_date: "",
  party_size: "",
  journey_interest: "",
  preferred_contact: [],
  preferred_contact_email: "",
  preferred_contact_phone: "",
  message: "",
};

export const ContactForm = () => {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const [form, setForm] = useState(initialState);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [prefError, setPrefError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [prefDetailErrors, setPrefDetailErrors] = useState({});

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const togglePref = (id) => setForm((p) => {
    const removing = p.preferred_contact.includes(id);
    return {
      ...p,
      preferred_contact: removing
        ? p.preferred_contact.filter((x) => x !== id)
        : [...p.preferred_contact, id],
      ...(removing ? { [`preferred_contact_${id}`]: "" } : {}),
    };
  });

  const changePrefDetail = (id, value) => {
    setForm((p) => ({ ...p, [`preferred_contact_${id}`]: value }));
    setPrefDetailErrors((p) => ({ ...p, [id]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const required = pick({ es: "Campo obligatorio", en: "Required field", fr: "Champ obligatoire" }, lang);
    if (form.phone && !isValidInternationalPhone(form.phone)) {
      setPhoneError(required);
      toast.error(t("form_error"));
      return;
    }
    if (!form.preferred_contact.length) {
      const req = { es: "Campo obligatorio", en: "Required field", fr: "Champ obligatoire" };
      setPrefError(pick(req, lang));
      toast.error(t("form_error"));
      return;
    }
    const detailErrors = {};
    if (form.preferred_contact.includes("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.preferred_contact_email.trim())) {
      detailErrors.email = required;
    }
    if (form.preferred_contact.includes("phone") && !isValidInternationalPhone(form.preferred_contact_phone)) {
      detailErrors.phone = required;
    }
    if (Object.keys(detailErrors).length) {
      setPrefDetailErrors(detailErrors);
      toast.error(t("form_error"));
      return;
    }
    setPrefError("");
    setPrefDetailErrors({});
    setSending(true);
    try {
      let routeId = null;
      try { routeId = resolvePath(location.pathname)?.routeId || null; } catch { routeId = null; }
      const { travel_start_date, travel_end_date, ...requestFields } = form;
      const travel_dates = [travel_start_date, travel_end_date].filter(Boolean).join(" → ");
      await axios.post(`${API}/contact-requests`, {
        ...requestFields,
        travel_dates: travel_dates || null,
        language: lang,
        source_route_id: routeId,
        source_path: location.pathname,
        source_label: (typeof document !== "undefined" ? document.title : "") || null,
      });
      setDone(true);
      toast.success(t("form_success"));
      setForm(initialState);
    } catch (error) {
      toast.error(error?.response?.data?.detail || t("form_error"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 berber-bg-cross opacity-50 pointer-events-none" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — copy & contact details */}
          <div className="lg:col-span-5">
            <EditableText slot="home.contact.overline" defaults={translations.sec_contact_overline}
              multiline={false} className="overline text-[#D4A373]" />
            <EditableText as="h2" slot="home.contact.title" defaults={translations.sec_contact_title}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 block" />
            <EditableText as="p" slot="home.contact.sub" defaults={translations.sec_contact_sub}
              className="mt-6 text-base md:text-lg text-[#FDFBF7]/75 leading-relaxed block" />

            <ul className="mt-12 space-y-5 text-sm text-[#FDFBF7]/85">
              <li className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-[#D4A373]" strokeWidth={1.5} />
                <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-[#D4A373] transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-[#D4A373]" strokeWidth={1.5} />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-[#D4A373] transition-colors">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="w-4 h-4 mt-0.5 text-[#D4A373]" strokeWidth={1.5} />
                <span>
                  <EditableText slot="home.contact.office_hours_label" defaults={translations.office_hours_label}
                    multiline={false} className="block text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55" />
                  <EditableText slot="home.contact.office_hours_value" defaults={translations.office_hours_value}
                    multiline={false} />
                </span>
              </li>
            </ul>

            <EditableText as="p" slot="home.contact.24_7" defaults={translations.contact_24_7} multiline={false}
              className="mt-10 text-xs tracking-[0.25em] uppercase text-[#D4A373]/85 block" />
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7">
            {done ? (
              <div
                data-testid="contact-success-card"
                className="bg-[#FDFBF7]/[0.04] border border-[#D4A373]/40 p-10 md:p-14 text-center berber-watermark relative"
              >
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#D4A373]/40 text-[#D4A373] mx-auto">
                  <Check className="w-5 h-5" strokeWidth={1.6} />
                </span>
                <EditableText as="h3" slot="home.contact.form_success" defaults={translations.form_success}
                  className="font-serif-x text-3xl md:text-4xl leading-[1.05] mt-6 text-[#FDFBF7] block" />
                <button
                  onClick={() => setDone(false)}
                  data-testid="contact-send-another"
                  className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase border-b border-[#D4A373]/40 pb-1 text-[#D4A373] hover:text-[#FDFBF7] hover:border-[#FDFBF7] transition-colors"
                >
                  <EditableText slot="home.contact.send_another" defaults={translations.send_another} multiline={false} />
                  <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                data-testid="contact-form"
                className="bg-[#FDFBF7]/[0.04] border border-[#FDFBF7]/15 p-8 md:p-12 backdrop-blur-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field labelSlot="home.contact.form_name" labelDefaults={translations.form_name} testId="form-name" required>
                    <input required aria-required="true" name="full_name" value={form.full_name} onChange={onChange}
                      data-testid="contact-input-name" className="form-input" />
                  </Field>

                  <Field labelSlot="home.contact.form_email" labelDefaults={translations.form_email} testId="form-email" required>
                    <input required aria-required="true" type="email" name="email" value={form.email} onChange={onChange}
                      data-testid="contact-input-email" className="form-input" />
                  </Field>

                  <Field as="div" labelSlot="home.contact.form_phone" labelDefaults={translations.form_phone} testId="form-phone">
                    <InternationalPhoneInput
                      name="phone"
                      value={form.phone}
                      onValueChange={(phone) => { setPhoneError(""); setForm((current) => ({ ...current, phone })); }}
                      lang={lang}
                      tone="dark"
                      invalid={Boolean(phoneError)}
                      testId="contact-input-phone"
                    />
                    {phoneError && <span className="mt-2 block text-xs text-[#D4A373]">{phoneError}</span>}
                  </Field>

                  <div className="md:col-span-2">
                    <Field as="div" labelSlot="home.contact.form_dates" labelDefaults={translations.form_dates} testId="form-dates">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-[#FDFBF7]/50">
                            {pick({ es: "Fecha de inicio", en: "Start date", fr: "Date de début" }, lang)}
                          </span>
                          <input
                            type="date"
                            name="travel_start_date"
                            value={form.travel_start_date}
                            max={form.travel_end_date || undefined}
                            onChange={onChange}
                            data-testid="contact-input-start-date"
                            className="form-input"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-[#FDFBF7]/50">
                            {pick({ es: "Fecha de fin", en: "End date", fr: "Date de fin" }, lang)}
                          </span>
                          <input
                            type="date"
                            name="travel_end_date"
                            value={form.travel_end_date}
                            min={form.travel_start_date || undefined}
                            onChange={onChange}
                            data-testid="contact-input-end-date"
                            className="form-input"
                          />
                        </label>
                      </div>
                      <TripDurationSummary
                        startDate={form.travel_start_date}
                        endDate={form.travel_end_date}
                        lang={lang}
                        tone="dark"
                        className="mt-4"
                        testid="contact-trip-duration"
                      />
                    </Field>
                  </div>

                  <Field labelSlot="home.contact.form_party" labelDefaults={translations.form_party} testId="form-party">
                    <input name="party_size" value={form.party_size} onChange={onChange}
                      placeholder="2 adults"
                      data-testid="contact-input-party" className="form-input" />
                  </Field>

                  <Field labelSlot="home.contact.form_interest" labelDefaults={translations.form_interest} testId="form-interest">
                    <select name="journey_interest" value={form.journey_interest} onChange={onChange}
                      data-testid="contact-select-journey" className="form-input">
                      <option value="">{t("form_no_preference")}</option>
                      {TRAVEL_CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>{pick(c.title, lang)}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mt-6">
                  <Field labelSlot="home.contact.form_message" labelDefaults={translations.form_message} testId="form-message" required>
                    <textarea required aria-required="true" name="message" value={form.message} onChange={onChange} rows={5}
                      data-testid="contact-input-message" className="form-input resize-none" />
                  </Field>
                </div>

                <div className="mt-8">
                  <ContactPreference
                    tone="dark"
                    lang={lang}
                    value={form.preferred_contact}
                    onToggle={(id) => { togglePref(id); setPrefError(""); }}
                    error={prefError}
                    details={{
                      email: form.preferred_contact_email,
                      phone: form.preferred_contact_phone,
                    }}
                    onDetailChange={changePrefDetail}
                    detailErrors={prefDetailErrors}
                    testidPrefix="contact-pref"
                  />
                </div>

                <div className="mt-8">
                  <WhatHappensNext tone="dark" lang={lang} testid="contact-what-next" />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  data-testid="contact-submit-button"
                  className="mt-8 w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#C16542] hover:bg-[#A35133] disabled:opacity-60 disabled:cursor-not-allowed text-[#FDFBF7] px-10 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  {sending ? (
                    <EditableText slot="home.contact.form_sending" defaults={translations.form_sending} multiline={false} />
                  ) : (
                    <EditableText slot="home.contact.form_submit" defaults={translations.form_submit} multiline={false} />
                  )}
                  {!sending && <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(253, 251, 247, 0.18);
          color: #FDFBF7;
          padding: 0.85rem 1rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          outline: none;
          border-radius: 2px;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }
        .form-input:focus {
          border-color: #C16542;
          background-color: rgba(253, 251, 247, 0.03);
        }
        .form-input::placeholder { color: rgba(253, 251, 247, 0.35); }
        .form-input option { color: #2C2621; background: #FDFBF7; }
      `}</style>
    </section>
  );
};

const Field = ({ labelSlot, labelDefaults, testId, required = false, children, as: Wrapper = "label" }) => (
  <Wrapper className="block" data-testid={`${testId}-field`}>
    <span className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-[#FDFBF7]/55 mb-2">
      <EditableText slot={labelSlot} defaults={labelDefaults} multiline={false} />
      {required && <span className="text-[#D4A373]" aria-hidden="true">*</span>}
    </span>
    {children}
  </Wrapper>
);

export default ContactForm;
