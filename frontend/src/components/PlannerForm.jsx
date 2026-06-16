import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, CalendarRange, CalendarClock,
  Users, BedDouble, Sparkles, Send, Check,
  Sun, Bike, Camera, Flower, Music, Waves,
  Mountain, MountainSnow, MapPin, ArrowRight, Compass,
  Moon, ArrowUpRight,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { ALL_TRIPS, TRIP_REGIONS } from "@/lib/allTripsCatalog";
import EditableImage from "@/components/EditableImage";
import FromPrice from "@/components/FromPrice";
import EditableText from "@/components/EditableText";
import { SlotScope, useSlotId } from "@/components/slotScope";
import { pathFor } from "@/lib/routes";

/* ============================================================
   PlannerForm · reusable detailed trip-planner form
   ------------------------------------------------------------
   Extracted from the old PlanificaTuViajePage so it can be
   embedded inside the tabbed <FormTabs> on both /planifica-tu-viaje
   and /contacto. Posts to backend POST /api/trip-planner.
   Slot ids stay page-namespaced via useSlotId so CMS edits on
   /planifica-tu-viaje are preserved unchanged.
============================================================ */

const T = (es, en, fr) => ({ es, en, fr });

export const PLANNER_COPY = {
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
  s4r_help2:   T("Haz clic en un itinerario para añadirlo a tu planificación. Usa «Ver detalle» para abrir su página.",
                 "Click an itinerary to add it to your plan. Use \"View details\" to open its page.",
                 "Cliquez sur un itinéraire pour l'ajouter à votre plan. Utilisez « Voir le détail » pour ouvrir sa page."),
  s4r_match:   T("coinciden con tu selección", "match your selection", "correspondent à votre sélection"),
  s4r_see:     T("Ver itinerario", "View itinerary", "Voir l'itinéraire"),
  s4r_detail:  T("Ver detalle", "View details", "Voir le détail"),
  s4r_select:  T("Seleccionar", "Select", "Sélectionner"),
  s4r_selected: T("Añadido", "Added", "Ajouté"),
  s4r_selcount: T("itinerarios en tu planificación", "itineraries in your plan", "itinéraires dans votre plan"),
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

const COPY = PLANNER_COPY;

/* Read a ?trip=<routeId> query param and resolve it to a catalog trip.
   Used to pre-fill the planner when arriving from a trip page's
   per-day "Contactar" button. */
const getPrefilledTrip = () => {
  if (typeof window === "undefined") return null;
  const id = new URLSearchParams(window.location.search).get("trip");
  if (!id) return null;
  return ALL_TRIPS.find((x) => x.routeId === id) || null;
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

const REGION_ICONS = {
  sur: Sun, norte: MapPin, completo: Compass,
  escapadas: CalendarClock, aventura: Bike, eventos: Calendar,
};
const REGION_DESC = {
  sur:       T("Atlas, valles de kasbahs y dunas del Erg Chebbi.", "Atlas, kasbah valleys and Erg Chebbi dunes.", "Atlas, vallées des kasbahs et dunes de l'Erg Chebbi."),
  norte:     T("Ciudades imperiales, Rif y la costa del estrecho.", "Imperial cities, the Rif and the strait coast.", "Cités impériales, Rif et côte du détroit."),
  completo:  T("De Tánger o Fez hasta Marrakech y el desierto.", "From Tangier or Fez down to Marrakech and the desert.", "De Tanger ou Fès jusqu'à Marrakech et le désert."),
  escapadas: T("Estancias cortas centradas en una sola zona.", "Short stays focused on a single zone.", "Séjours courts centrés sur une seule zone."),
  aventura:  T("Rutas activas: enduro y pistas del Drâa.", "Active routes: enduro and Drâa tracks.", "Itinéraires actifs : enduro et pistes du Drâa."),
  eventos:   T("Salidas especiales en fechas señaladas.", "Special departures on key dates.", "Départs spéciaux à des dates clés."),
};
const REGION_OPTIONS = TRIP_REGIONS
  .filter((r) => r.id !== "all")
  .map((r) => ({ ...r, icon: REGION_ICONS[r.id] || Compass, desc: REGION_DESC[r.id] }));
const REGION_COUNTS = ALL_TRIPS.reduce((acc, t) => {
  acc[t.region] = (acc[t.region] || 0) + 1;
  return acc;
}, {});

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

/* Inline-CMS per-page text editor (auto-namespaced by page path). */
const ET = ({ k, defaults, as = "span", className, multiline = true, ...rest }) => {
  const slot = useSlotId(k);
  return <EditableText slot={slot} defaults={defaults || (k ? COPY[k] : {}) || {}} as={as} className={className} multiline={multiline} {...rest} />;
};

/* ============================================================
   PlannerForm — the detailed multi-step form (no hero).
============================================================ */
export default function PlannerForm() {
  const { lang } = useLanguage();
  const tr = (k) => pick(COPY[k], lang);

  const prefillTrip = useMemo(() => getPrefilledTrip(), []);

  const [form, setForm] = useState({
    dateMode: "range",
    startDate: "", endDate: "", exactDate: "", flexMonth: "",
    adults: 2, children: 0,
    accommodation: "superior",
    regions: prefillTrip ? [prefillTrip.region] : [],
    selectedTrips: prefillTrip ? [prefillTrip.routeId] : [],
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
  const toggleTrip     = toggleArrayItem("selectedTrips");

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
        regions: form.regions,
        selected_trips: form.selectedTrips,
        selected_trips_detail: form.selectedTrips.map((id) => {
          const t = ALL_TRIPS.find((x) => x.routeId === id);
          return {
            id,
            title: t ? pick(t.title, lang) : id,
            url: `${window.location.origin}${pathFor(lang, id)}`,
          };
        }),
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

  const recommendedTrips = useMemo(() => {
    if (!form.regions.length) return [];
    return ALL_TRIPS.filter((t) => form.regions.includes(t.region));
  }, [form.regions]);

  return (
    <div data-testid="plan-trip-form-wrap" className="max-w-4xl mx-auto px-6 md:px-12">
      {status === "success" ? (
        <div
          data-testid="plan-trip-success"
          className="relative bg-white border border-[#2C2621]/10 p-10 md:p-14 text-center"
          style={{ borderTopColor: "#5A6B4F", borderTopWidth: 3 }}
        >
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#5A6B4F]/12 text-[#5A6B4F]">
            <Check className="w-6 h-6" strokeWidth={1.6} />
          </span>
          <ET k="success_t" as="h2" multiline={false} className="font-serif-x text-3xl md:text-4xl tracking-tight mt-7 text-[#2C2621]" />
          <ET k="success_b" as="p" className="mt-5 text-[15px] md:text-base text-[#5C5248] leading-[1.85] max-w-xl mx-auto" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-9 px-7 py-3.5 bg-[#2C2621] text-[#FDFBF7] text-[11px] tracking-[0.25em] uppercase hover:bg-[#C16542] transition-colors"
            data-testid="plan-trip-success-home"
          >
            <ET k="send_back" multiline={false} />
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
            title={<ET k="s1_title" multiline={false} />} help={<ET k="s1_help" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "range",    label: <ET k="mode_range" multiline={false} />, icon: CalendarRange },
                { id: "exact",    label: <ET k="mode_exact" multiline={false} />, icon: Calendar },
                { id: "flexible", label: <ET k="mode_flex" multiline={false} />,  icon: CalendarClock },
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
                  <Field label={<ET k="start_date" multiline={false} />}>
                    <input type="date" data-testid="start-date" className={inputCls}
                      value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
                  </Field>
                  <Field label={<ET k="end_date" multiline={false} />}>
                    <input type="date" data-testid="end-date" className={inputCls}
                      value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
                  </Field>
                </>
              )}
              {form.dateMode === "exact" && (
                <Field label={<ET k="exact_date" multiline={false} />}>
                  <input type="date" data-testid="exact-date" className={inputCls}
                    value={form.exactDate} onChange={(e) => set("exactDate", e.target.value)} />
                </Field>
              )}
              {form.dateMode === "flexible" && (
                <Field label={<ET k="flex_month" multiline={false} />}>
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
            title={<ET k="s2_title" multiline={false} />} help={<ET k="s2_help" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              <Field label={<ET k="adults" multiline={false} />}>
                <input type="number" min={1} max={40} data-testid="adults" className={inputCls}
                  value={form.adults} onChange={(e) => set("adults", e.target.value.replace(/[^0-9]/g, ""))} />
              </Field>
              <Field label={<ET k="children" multiline={false} />}>
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
            title={<ET k="s3_title" multiline={false} />} help={<ET k="s3_help" />}
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
                    <ET k={`accommodation.${a.id}.title`} defaults={a.title} multiline={false} className="text-[10px] tracking-[0.3em] uppercase" style={{ color: a.accent }} />
                    <ET k={`accommodation.${a.id}.desc`} as="p" defaults={a.desc} className="mt-3 text-sm text-[#5C5248] leading-[1.7] min-h-[3.2rem]" />
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

          {/* ============ STEP 4 · REGIONS ============ */}
          <SectionBlock
            step="04" icon={Compass}
            title={<ET k="s4r_title" multiline={false} />} help={<ET k="s4r_help" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-testid="plan-regions">
              {REGION_OPTIONS.map((reg) => {
                const I = reg.icon;
                const on = form.regions.includes(reg.id);
                const count = REGION_COUNTS[reg.id] || 0;
                return (
                  <button
                    type="button"
                    key={reg.id}
                    onClick={() => toggleRegion(reg.id)}
                    data-testid={`region-${reg.id}`}
                    aria-pressed={on}
                    className={`group text-left p-5 border transition-all duration-300 relative ${
                      on
                        ? "bg-[#2C2621] text-[#FDFBF7] border-[#2C2621]"
                        : "bg-white text-[#3D352C] border-[#2C2621]/12 hover:border-[#2C2621]/40"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {I && <I className="w-4 h-4 shrink-0" strokeWidth={1.6} style={{ color: on ? "#D4A373" : "#C16542" }} />}
                      <ET k={`region.${reg.id}.label`} defaults={reg.label} multiline={false} className="text-[12px] tracking-[0.18em] uppercase flex-1" />
                      {on && <Check className="w-4 h-4 text-[#D4A373]" strokeWidth={2.2} />}
                    </span>
                    <ET k={`region.${reg.id}.desc`} as="p" defaults={reg.desc} className={`mt-2.5 text-[12px] leading-[1.6] ${on ? "text-[#FDFBF7]/75" : "text-[#5C5248]"}`} />
                    <span className={`mt-3 inline-block text-[10px] tracking-[0.25em] uppercase ${on ? "text-[#D4A373]" : "text-[#A07042]"}`}>
                      {count} · {tr("s4r_nights") === "noches" ? (count === 1 ? "itinerario" : "itinerarios") : count === 1 ? "itinerary" : "itineraries"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live recommendations */}
            <div className="mt-10" data-testid="plan-trip-recos">
              {form.regions.length === 0 ? (
                <p className="text-[13px] text-[#5C5248]/80 italic flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C16542]" strokeWidth={1.6} />
                  <ET k="s4r_help" />
                </p>
              ) : (
                <>
                  <div className="flex items-baseline justify-between flex-wrap gap-3 mb-2">
                    <ET k="s4r_recos" as="h3" multiline={false} className="font-serif-x text-xl md:text-2xl tracking-tight text-[#2C2621]" />
                    <span data-testid="plan-trip-recos-count" className="text-[10px] tracking-[0.3em] uppercase text-[#A07042]">
                      {recommendedTrips.length} · <ET k="s4r_match" multiline={false} />
                    </span>
                  </div>
                  <ET k="s4r_help2" as="p" className="text-[12px] text-[#5C5248]/80 leading-relaxed mb-5 pb-5 border-b border-[#2C2621]/10 max-w-2xl" />
                  {form.selectedTrips.length > 0 && (
                    <p
                      data-testid="plan-trip-selected-count"
                      className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-[#2C2621] text-[#FDFBF7] text-[10px] tracking-[0.28em] uppercase"
                    >
                      <Check className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={2.2} />
                      {form.selectedTrips.length} · <ET k="s4r_selcount" multiline={false} />
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recommendedTrips.map((trip) => (
                      <RecoCard
                        key={trip.routeId}
                        trip={trip}
                        lang={lang}
                        tr={tr}
                        selected={form.selectedTrips.includes(trip.routeId)}
                        onToggle={() => toggleTrip(trip.routeId)}
                      />
                    ))}
                  </div>
                  <Link
                    to={pathFor(lang, "toursLanding")}
                    data-testid="plan-trip-recos-seeall"
                    className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.28em] uppercase text-[#2C2621] hover:text-[#C16542] transition-colors"
                  >
                    <ET k="s4r_seeall" multiline={false} />
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.7} />
                  </Link>
                </>
              )}
            </div>
          </SectionBlock>

          {/* ============ STEP 5 · ACTIVITIES ============ */}
          <SectionBlock
            step="05" icon={Sparkles}
            title={<ET k="s4_title" multiline={false} />} help={<ET k="s4_help" />}
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
                    <ET k={`activity.${act.id}`} defaults={act.label} multiline={false} className="flex-1 leading-tight" />
                    {on && <Check className="w-3.5 h-3.5 text-[#D4A373]" strokeWidth={2.2} />}
                  </button>
                );
              })}
            </div>
          </SectionBlock>

          {/* ============ STEP 6 · CONTACT ============ */}
          <SectionBlock
            step="06" icon={Send}
            title={<ET k="s5_title" multiline={false} />} help={<ET k="s5_help" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
              <Field label={<ET k="name" multiline={false} />} required error={errors.fullName}>
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
              <Field label={<ET k="email" multiline={false} />} required error={errors.email}>
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
              <Field label={<ET k="phone" multiline={false} />}>
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
              <Field label={<ET k="notes" multiline={false} />}>
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
              {status === "sending" ? tr("sending") : <ET k="submit" multiline={false} />}
              <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.6} />
            </button>
            <ET k="privacy" as="p" className="mt-5 text-xs text-[#5C5248]/70 max-w-xl" />
          </div>
        </form>
      )}
    </div>
  );
}

/* ============================================================
   RecoCard — Itinerary recommendation card shown in the region step.
============================================================ */
function RecoCard({ trip, lang, tr, selected, onToggle }) {
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };
  return (
    <SlotScope id={`plan-recos.${trip.routeId}`}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        data-testid={`plan-trip-reco-${trip.routeId}`}
        className={`group relative flex flex-col cursor-pointer bg-white border transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(44,38,33,0.35)] ${
          selected
            ? "border-[#C16542] ring-2 ring-[#C16542]/40"
            : "border-[#2C2621]/10 hover:border-[#C16542]/60"
        }`}
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1A1513]">
          <EditableImage
            slot={`plan-recos.${trip.routeId}.cover`}
            fallback={trip.image}
            alt={pick(trip.title, lang)}
            aspectRatio="4/3"
            imgProps={{ loading: "lazy" }}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] ${selected ? "scale-[1.03]" : ""}`}
          />
          <span
            className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-[0.26em] uppercase transition-all ${
              selected
                ? "bg-[#C16542] text-[#FDFBF7]"
                : "bg-[#FDFBF7]/95 text-[#2C2621] opacity-0 group-hover:opacity-100"
            }`}
          >
            <Check className="w-3 h-3" strokeWidth={2.4} />
            {selected ? tr("s4r_selected") : tr("s4r_select")}
          </span>
        </div>
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#C16542] mb-1.5">
            <Moon className="w-3 h-3" strokeWidth={1.7} />
            {trip.nights} {tr("s4r_nights")}
          </div>
          <h4 className="font-serif text-[17px] text-[#2C2621] leading-snug mb-1.5">
            <ET k="title" defaults={trip.title} multiline={false} />
          </h4>
          <ET k="summary" as="p" defaults={trip.summary} className="text-[12px] text-[#5C5248] leading-relaxed flex-1" />
          <div className="mt-3">
            <FromPrice tone="dark" size="xs" testid={`plan-trip-reco-from-${trip.routeId}`} />
          </div>
          <Link
            to={pathFor(lang, trip.routeId)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            data-testid={`plan-trip-reco-detail-${trip.routeId}`}
            className="mt-4 inline-flex items-center gap-1.5 self-start text-[10px] tracking-[0.26em] uppercase text-[#2C2621] hover:text-[#C16542] border-b border-[#2C2621]/25 hover:border-[#C16542] pb-0.5 transition-colors"
          >
            {tr("s4r_detail")}
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </SlotScope>
  );
}

/* ============================================================
   SectionBlock — Reusable step container.
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
