import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, CalendarRange, CalendarClock,
  Users, BedDouble, Sparkles, Send, Check,
  Sun, Bike, Camera, Flower, Music, Waves,
  Mountain, MountainSnow, MapPin, ArrowRight, Compass,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { ALL_TRIPS, TRIP_REGIONS } from "@/lib/allTripsCatalog";
import { pathFor } from "@/lib/routes";

/* ============================================================
   PlanificaTuViajePage · /planifica-tu-viaje
   ------------------------------------------------------------
   Trilingual, premium, cinematic multi-section trip planner.
   Posts to backend POST /api/trip-planner.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

const COPY = {
  eyebrow: T("Planifica tu viaje", "Plan your trip", "Planifiez votre voyage"),
  title:   T(
    "Cuéntanos cómo soñaste con Marruecos.",
    "Tell us how you dreamed of Morocco.",
    "Dites-nous comment vous avez rêvé du Maroc.",
  ),
  intro: T(
    "Cuatro pasos y un mensaje opcional. Nuestro equipo en destino te responde con una propuesta personalizada en 24-48 h.",
    "Four short steps and an optional note. Our in-country team replies with a custom proposal within 24-48 h.",
    "Quatre étapes courtes et une note optionnelle. Notre équipe sur place vous répond avec une proposition sur mesure sous 24-48 h.",
  ),
  step:        T("Paso", "Step", "Étape"),
  // Section 1
  s1_title:    T("Fechas del viaje", "Trip dates", "Dates du voyage"),
  s1_help:     T("Elige fechas concretas, un rango o un mes orientativo.", "Pick exact dates, a range or a flexible month.", "Choisissez des dates précises, une plage ou un mois indicatif."),
  mode_range:  T("Rango", "Range", "Plage"),
  mode_exact:  T("Día concreto", "Exact day", "Date exacte"),
  mode_flex:   T("Mes flexible", "Flexible month", "Mois flexible"),
  start_date:  T("Fecha de inicio", "Start date", "Date de début"),
  end_date:    T("Fecha de fin", "End date", "Date de fin"),
  exact_date:  T("Día de llegada", "Arrival day", "Jour d'arrivée"),
  flex_month:  T("Mes preferido", "Preferred month", "Mois préféré"),
  // Section 2
  s2_title:    T("Viajeros", "Travellers", "Voyageurs"),
  s2_help:     T("Indica adultos y, si procede, niños menores de 12.", "Tell us about adults and children under 12.", "Indiquez les adultes et, le cas échéant, les enfants de moins de 12 ans."),
  adults:      T("Adultos", "Adults", "Adultes"),
  children:    T("Niños (3-11)", "Children (3-11)", "Enfants (3-11)"),
  // Section 3
  s3_title:    T("Alojamiento", "Accommodation", "Hébergement"),
  s3_help:     T("Tres categorías curadas. Siempre con encanto local.", "Three curated categories — always with local charm.", "Trois catégories sélectionnées — toujours avec du charme local."),
  // Section 4 — Regions (geographic preferences)
  s4r_title:   T("Regiones que quieres visitar", "Regions you want to visit", "Régions que vous souhaitez visiter"),
  s4r_help:    T("Marca una o varias zonas. Usamos tu selección para sugerirte los itinerarios que mejor encajan.",
                 "Pick one or several zones. We use your choice to recommend itineraries that match.",
                 "Choisissez une ou plusieurs zones. Nous l'utilisons pour vous recommander les itinéraires adaptés."),
  s4r_recos:   T("Itinerarios sugeridos para ti", "Suggested itineraries for you", "Itinéraires suggérés pour vous"),
  s4r_match:   T("coinciden con tu selección", "match your selection", "correspondent à votre sélection"),
  s4r_see:     T("Ver itinerario", "View itinerary", "Voir l'itinéraire"),
  s4r_seeall:  T("Ver todos los viajes", "See all trips", "Voir tous les voyages"),
  s4r_nights:  T("noches", "nights", "nuits"),
  // Section 5 (was 4 — Activities)
  s4_title:    T("Actividades", "Activities", "Activités"),
  s4_help:     T("Marca todo lo que te apetezca; nada es obligatorio.", "Tick anything that calls you; nothing is mandatory.", "Cochez ce qui vous attire ; rien n'est obligatoire."),
  // Section 5
  s5_title:    T("Tus datos", "Your details", "Vos coordonnées"),
  s5_help:     T("Solo te escribimos para preparar tu propuesta.", "We will only write to prepare your proposal.", "Nous vous écrivons uniquement pour préparer votre proposition."),
  name:        T("Nombre completo", "Full name", "Nom complet"),
  email:       T("Email", "Email", "Email"),
  phone:       T("Teléfono (opcional)", "Phone (optional)", "Téléphone (facultatif)"),
  notes:       T("Comentarios o ideas", "Notes or ideas", "Commentaires ou idées"),
  // Submit
  submit:      T("Enviar mi solicitud", "Send my request", "Envoyer ma demande"),
  sending:     T("Enviando…", "Sending…", "Envoi…"),
  success_t:   T("¡Recibido! Te respondemos en 24-48 h.", "Got it! We will reply within 24-48 h.", "Reçu ! Nous répondons sous 24-48 h."),
  success_b:   T(
    "Mientras tanto, explora nuestros viajes a medida o reserva una cita previa con el equipo.",
    "Meanwhile, explore our tailor-made tours or book an appointment with the team.",
    "En attendant, explorez nos voyages sur mesure ou prenez rendez-vous avec l'équipe.",
  ),
  required:    T("Campo obligatorio", "Required field", "Champ obligatoire"),
  privacy:     T(
    "No compartimos tus datos. Solo se usan para preparar tu propuesta.",
    "We never share your data. Only used to prepare your proposal.",
    "Nous ne partageons jamais vos données. Utilisées uniquement pour votre proposition.",
  ),
  send_back:   T("Volver al inicio", "Back to home", "Retour à l'accueil"),
};

const ACCOMMODATIONS = [
  {
    id: "basic", accent: "#A07042",
    title: T("Básico · auténtico", "Basic · authentic", "Basique · authentique"),
    desc:  T("Riads familiares, hostales con encanto, posadas bereberes.", "Family-run riads, charming inns, Berber guesthouses.", "Riads familiaux, auberges de charme, gîtes berbères."),
  },
  {
    id: "superior", accent: "#C16542",
    title: T("Superior", "Superior", "Supérieur"),
    desc:  T("Riads boutique 4★, kasbahs restauradas con piscina.", "Boutique 4★ riads, restored kasbahs with pool.", "Riads boutique 4★, kasbahs restaurées avec piscine."),
  },
  {
    id: "premium", accent: "#3A4A5F",
    title: T("Premium · 5★", "Premium · 5★", "Premium · 5★"),
    desc:  T("Hoteles 5★, riads de lujo, bivouacs premium en el desierto.", "5★ hotels, luxury riads, premium desert bivouacs.", "Hôtels 5★, riads de luxe, bivouacs premium dans le désert."),
  },
];

const ACTIVITIES = [
  { id: "camel",    icon: "mountain-snow", label: T("Paseo en camello", "Camel ride", "Balade à dos de dromadaire") },
  { id: "quad",     icon: "bike",          label: T("Quad por las dunas", "Quad in the dunes", "Quad dans les dunes") },
  { id: "hammam",   icon: "flower",        label: T("Hammam tradicional", "Traditional hammam", "Hammam traditionnel") },
  { id: "massage",  icon: "sparkles",      label: T("Masaje argán", "Argan oil massage", "Massage à l'argan") },
  { id: "cooking",  icon: "sun",           label: T("Clase de cocina marroquí", "Moroccan cooking class", "Cours de cuisine marocaine") },
  { id: "trekking", icon: "mountain",      label: T("Trekking en el Atlas", "Atlas trekking", "Trekking dans l'Atlas") },
  { id: "balloon",  icon: "camera",        label: T("Globo sobre Marrakech", "Hot-air balloon · Marrakech", "Montgolfière · Marrakech") },
  { id: "surf",     icon: "waves",         label: T("Surf en la costa atlántica", "Surf on the Atlantic coast", "Surf sur la côte atlantique") },
  { id: "music",    icon: "music",         label: T("Noche gnaoua en bivouac", "Gnawa night at the bivouac", "Soirée gnaoua au bivouac") },
];

const ICONS = { sun: Sun, bike: Bike, camera: Camera, flower: Flower, music: Music, waves: Waves, mountain: Mountain, "mountain-snow": MountainSnow, sparkles: Sparkles };

/* ============================================================
   Helpers
============================================================ */
const Field = ({ label, hint, required, children, error }) => (
  <label className="block">
    <span className="text-[11px] tracking-[0.3em] uppercase text-[#A07042]">
      {label}{required && <span className="text-[#C16542]"> *</span>}
    </span>
    <span className="block mt-2">{children}</span>
    {error ? (
      <span className="block mt-2 text-xs text-[#C16542]">{error}</span>
    ) : hint ? (
      <span className="block mt-2 text-xs text-[#5C5248]/75">{hint}</span>
    ) : null}
  </label>
);

const inputCls =
  "w-full bg-transparent border-b border-[#2C2621]/30 focus:border-[#C16542] outline-none py-3 text-[15px] text-[#2C2621] placeholder:text-[#5C5248]/45 transition-colors";

/* ============================================================
   Component
============================================================ */
export default function PlanificaTuViajePage() {
  const { lang } = useLanguage();
  const tr = (k) => pick(COPY[k], lang);

  useEffect(() => { document.title = "Xaluca Tours · " + tr("title"); }, [lang]); // eslint-disable-line

  const [form, setForm] = useState({
    dateMode: "range",
    startDate: "", endDate: "", exactDate: "", flexMonth: "",
    adults: 2, children: 0,
    accommodation: "superior",
    regions: [],
    activities: [],
    fullName: "", email: "", phone: "", notes: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errMsg, setErrMsg] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleArrayItem = (key) => (id) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id],
    }));
  const toggleRegion   = toggleArrayItem("regions");
  const toggleActivity = toggleArrayItem("activities");

  const validate = () => {
    const e = {};
    if (!form.fullName || form.fullName.trim().length < 2) e.fullName = tr("required");
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = tr("required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setErrMsg("");
    try {
      const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/trip-planner`;
      const payload = {
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        date_mode: form.dateMode,
        start_date: form.dateMode === "range"   ? (form.startDate || null) : (form.dateMode === "exact" ? (form.exactDate || null) : null),
        end_date:   form.dateMode === "range"   ? (form.endDate   || null) : null,
        flexible_month: form.dateMode === "flexible" ? (form.flexMonth || null) : null,
        travellers_adults: Number(form.adults) || 1,
        travellers_children: Number(form.children) || 0,
        accommodation: form.accommodation,
        activities: form.activities,
        notes: form.notes.trim() || null,
        language: lang,
      };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrMsg(err.message || "Unknown error");
    }
  };

  const totalTravellers = useMemo(
    () => Number(form.adults || 0) + Number(form.children || 0),
    [form.adults, form.children],
  );

  return (
    <div data-testid="plan-trip-page" className="bg-[#FBF5EA] text-[#2C2621]">
      {/* HERO */}
      <section className="relative h-[68svh] min-h-[520px] overflow-hidden bg-[#1A1513]">
        <img
          src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/85 via-[#1A1513]/30 to-transparent" />
        <span className="film-grain opacity-50" aria-hidden="true" />
        <div className="relative h-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-16 md:pb-20">
          <span className="overline text-[#D4A373]">{tr("eyebrow")}</span>
          <h1 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 max-w-3xl text-[#FDFBF7]">
            {tr("title")}
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-[#FDFBF7]/85 leading-relaxed">
            {tr("intro")}
          </p>
        </div>
      </section>

      {/* FORM or SUCCESS */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {status === "success" ? (
            <div
              data-testid="plan-trip-success"
              className="relative bg-white border border-[#2C2621]/10 p-10 md:p-14 text-center"
              style={{ borderTopColor: "#5A6B4F", borderTopWidth: 3 }}
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#5A6B4F]/12 text-[#5A6B4F]">
                <Check className="w-6 h-6" strokeWidth={1.6} />
              </span>
              <h2 className="font-serif-x text-3xl md:text-4xl tracking-tight mt-7 text-[#2C2621]">
                {tr("success_t")}
              </h2>
              <p className="mt-5 text-[15px] md:text-base text-[#5C5248] leading-[1.85] max-w-xl mx-auto">
                {tr("success_b")}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 mt-9 px-7 py-3.5 bg-[#2C2621] text-[#FDFBF7] text-[11px] tracking-[0.25em] uppercase hover:bg-[#C16542] transition-colors"
                data-testid="plan-trip-success-home"
              >
                {tr("send_back")}
              </Link>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              data-testid="plan-trip-form"
              className="space-y-16"
              noValidate
            >
              {/* ============ STEP 1 · DATES ============ */}
              <SectionBlock
                step="01" icon={CalendarRange}
                title={tr("s1_title")} help={tr("s1_help")}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "range",    label: tr("mode_range"),   icon: CalendarRange },
                    { id: "exact",    label: tr("mode_exact"),   icon: Calendar },
                    { id: "flexible", label: tr("mode_flex"),    icon: CalendarClock },
                  ].map(({ id, label, icon: I }) => {
                    const on = form.dateMode === id;
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => set("dateMode", id)}
                        data-testid={`date-mode-${id}`}
                        className={`group flex items-center gap-3 px-4 py-4 border text-[12px] tracking-[0.2em] uppercase transition-all ${
                          on
                            ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                            : "bg-white border-[#2C2621]/15 hover:border-[#2C2621]/60 text-[#3D352C]"
                        }`}
                      >
                        <I className="w-4 h-4 shrink-0" strokeWidth={1.6} />
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  {form.dateMode === "range" && (
                    <>
                      <Field label={tr("start_date")}>
                        <input type="date" data-testid="start-date" className={inputCls}
                          value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
                      </Field>
                      <Field label={tr("end_date")}>
                        <input type="date" data-testid="end-date" className={inputCls}
                          value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
                      </Field>
                    </>
                  )}
                  {form.dateMode === "exact" && (
                    <Field label={tr("exact_date")}>
                      <input type="date" data-testid="exact-date" className={inputCls}
                        value={form.exactDate} onChange={(e) => set("exactDate", e.target.value)} />
                    </Field>
                  )}
                  {form.dateMode === "flexible" && (
                    <Field label={tr("flex_month")}>
                      <input
                        type="text"
                        data-testid="flex-month"
                        placeholder={lang === "es" ? "Ej. Mayo 2026" : lang === "fr" ? "Ex. mai 2026" : "e.g. May 2026"}
                        className={inputCls}
                        value={form.flexMonth}
                        maxLength={40}
                        onChange={(e) => set("flexMonth", e.target.value)}
                      />
                    </Field>
                  )}
                </div>
              </SectionBlock>

              {/* ============ STEP 2 · TRAVELLERS ============ */}
              <SectionBlock
                step="02" icon={Users}
                title={tr("s2_title")} help={tr("s2_help")}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                  <Field label={tr("adults")}>
                    <input type="number" min={1} max={40} data-testid="adults" className={inputCls}
                      value={form.adults} onChange={(e) => set("adults", e.target.value.replace(/[^0-9]/g, ""))} />
                  </Field>
                  <Field label={tr("children")}>
                    <input type="number" min={0} max={20} data-testid="children" className={inputCls}
                      value={form.children} onChange={(e) => set("children", e.target.value.replace(/[^0-9]/g, ""))} />
                  </Field>
                </div>
                <p className="mt-5 text-[12px] tracking-[0.2em] uppercase text-[#A07042]">
                  Total · {totalTravellers}
                </p>
              </SectionBlock>

              {/* ============ STEP 3 · ACCOMMODATION ============ */}
              <SectionBlock
                step="03" icon={BedDouble}
                title={tr("s3_title")} help={tr("s3_help")}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ACCOMMODATIONS.map((a) => {
                    const on = form.accommodation === a.id;
                    return (
                      <button
                        type="button"
                        key={a.id}
                        onClick={() => set("accommodation", a.id)}
                        data-testid={`accommodation-${a.id}`}
                        className={`text-left p-6 border transition-all duration-300 relative ${
                          on
                            ? "bg-white border-transparent shadow-[0_15px_40px_-20px_rgba(44,38,33,0.35)]"
                            : "bg-white border-[#2C2621]/12 hover:border-[#2C2621]/40"
                        }`}
                        style={on ? { borderTopColor: a.accent, borderTopWidth: 3 } : undefined}
                      >
                        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: a.accent }}>
                          {pick(a.title, lang)}
                        </span>
                        <p className="mt-3 text-sm text-[#5C5248] leading-[1.7] min-h-[3.2rem]">
                          {pick(a.desc, lang)}
                        </p>
                        {on && (
                          <span className="absolute top-4 right-4 inline-flex items-center justify-center w-6 h-6 rounded-full text-white" style={{ background: a.accent }}>
                            <Check className="w-3.5 h-3.5" strokeWidth={2} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </SectionBlock>

              {/* ============ STEP 4 · ACTIVITIES ============ */}
              <SectionBlock
                step="04" icon={Sparkles}
                title={tr("s4_title")} help={tr("s4_help")}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ACTIVITIES.map((act) => {
                    const I = ICONS[act.icon];
                    const on = form.activities.includes(act.id);
                    return (
                      <button
                        type="button"
                        key={act.id}
                        onClick={() => toggleActivity(act.id)}
                        data-testid={`activity-${act.id}`}
                        aria-pressed={on}
                        className={`group flex items-center gap-3 px-4 py-3.5 text-left text-[13px] border transition-all ${
                          on
                            ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                            : "bg-white text-[#3D352C] border-[#2C2621]/12 hover:border-[#2C2621]/40"
                        }`}
                      >
                        {I && <I className="w-4 h-4 shrink-0" strokeWidth={1.6} style={{ color: on ? "#D4A373" : "#C16542" }} />}
                        <span className="flex-1 leading-tight">{pick(act.label, lang)}</span>
                        {on && <Check className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={2.2} />}
                      </button>
                    );
                  })}
                </div>
              </SectionBlock>

              {/* ============ STEP 5 · CONTACT ============ */}
              <SectionBlock
                step="05" icon={Send}
                title={tr("s5_title")} help={tr("s5_help")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
                  <Field label={tr("name")} required error={errors.fullName}>
                    <input
                      type="text"
                      data-testid="full-name"
                      autoComplete="name"
                      maxLength={120}
                      className={inputCls}
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                    />
                  </Field>
                  <Field label={tr("email")} required error={errors.email}>
                    <input
                      type="email"
                      data-testid="email"
                      autoComplete="email"
                      maxLength={120}
                      className={inputCls}
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Field>
                  <Field label={tr("phone")}>
                    <input
                      type="tel"
                      data-testid="phone"
                      autoComplete="tel"
                      maxLength={40}
                      className={inputCls}
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="mt-8">
                  <Field label={tr("notes")}>
                    <textarea
                      data-testid="notes"
                      rows={4}
                      maxLength={3000}
                      className={`${inputCls} resize-none`}
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                    />
                  </Field>
                </div>
              </SectionBlock>

              {/* ============ SUBMIT ============ */}
              <div className="pt-2">
                {status === "error" && (
                  <p className="mb-5 text-sm text-[#C16542]" role="alert">{errMsg}</p>
                )}
                <button
                  type="submit"
                  data-testid="plan-trip-submit"
                  disabled={status === "sending"}
                  className="group relative inline-flex items-center gap-3 px-9 py-5 bg-[#C16542] text-[#FDFBF7] text-[11px] tracking-[0.3em] uppercase hover:bg-[#2C2621] transition-all duration-300 disabled:opacity-60"
                >
                  {status === "sending" ? tr("sending") : tr("submit")}
                  <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.6} />
                </button>
                <p className="mt-5 text-xs text-[#5C5248]/70 max-w-xl">{tr("privacy")}</p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   SectionBlock — Reusable step container (kept inside the file
   so the form file stays self-contained).
============================================================ */
function SectionBlock({ step, icon: IconCmp, title, help, children }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" data-testid={`plan-step-${step}`}>
      <header className="lg:col-span-4">
        <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase text-[#A07042]">
          <span>{step}</span>
          <span className="w-8 h-px bg-[#A07042]/40" />
          {IconCmp && <IconCmp className="w-3.5 h-3.5" strokeWidth={1.6} />}
        </span>
        <h2 className="font-serif-x text-2xl md:text-3xl leading-[1.15] tracking-tight mt-4 text-[#2C2621]">
          {title}
        </h2>
        <p className="mt-3 text-sm text-[#5C5248] leading-[1.75] max-w-xs">
          {help}
        </p>
      </header>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}
