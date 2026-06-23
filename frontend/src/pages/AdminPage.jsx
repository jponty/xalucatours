import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Search, Save, ExternalLink, RefreshCw, Image as ImageIcon, Type, Layout,
  Monitor, Tablet, Smartphone, ChevronDown, ChevronRight, Filter, Globe, X,
  Lock, LogOut, Wand2, Tag, Plus, Trash2, UploadCloud, Download, CheckCircle2, AlertTriangle, DownloadCloud,
  MapPin, Languages, Inbox, Mail, Images, Database,
} from "lucide-react";
import { ROUTES, pathFor } from "@/lib/routes";
import GalleryManager from "@/components/GalleryManager";
import TextSlotsPanel from "@/components/TextSlotsPanel";
import { DEFAULT_PRICING, getFromPrice, fmtEuro } from "@/lib/pricing";
import { setPricingOverride } from "@/lib/pricingStore";
import { LANDMARK_CATALOG, infoSlots, cardSlots } from "@/lib/dayLandmarkCatalog";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

const LANGS = ["es", "en", "fr"];
const DEVICES = [
  { id: "desktop", icon: Monitor,    label: "Desktop", w: "100%",  h: "100%" },
  { id: "tablet",  icon: Tablet,     label: "Tablet",  w: "820px", h: "1180px" },
  { id: "mobile",  icon: Smartphone, label: "Mobile",  w: "390px", h: "844px" },
];

/* ============================================================
   /admin URL taxonomy — full Xaluca Tours architecture grouped
   by business areas, navigation and travel regions. Region
   groups contain routes, and each route lists its programs
   grouped by duration. Single source: lib/routes ROUTES keys.
============================================================ */
const URL_TAXONOMY = [
  {
    group: "General",
    links: [
      ["Home", "home"],
      ["Marruecos", "morocco"],
      ["Qué ver en Marruecos", "whatToSee"],
      ["Cuándo viajar", "whenToTravel"],
      ["Galería", "galeria"],
      ["Blog", "blog"],
      ["Catálogo", "catalog"],
      ["Viajes (landing)", "toursLanding"],
    ],
  },
  {
    group: "Planificación del viaje",
    links: [
      ["Planifica tu viaje", "planTrip"],
      ["Cita previa", "appointment"],
      ["Precios", "precios"],
      ["Vuelos", "vuelos"],
      ["Próximas salidas", "upcomingDepartures"],
      ["Viajes a medida", "tourBespoke"],
    ],
  },
  {
    group: "Empresa",
    links: [
      ["Equipo", "about"],
      ["Qué hacemos", "whatWeDo"],
      ["Incentivos y eventos", "events"],
      ["Opiniones", "opiniones"],
      ["Contacto", "contact"],
    ],
  },
  {
    group: "Viajes · Sur de Marruecos",
    region: true,
    routes: [
      { label: "Landing Sur de Marruecos", keys: ["tourSouth"] },
      { label: "Atlas → Desierto", keys: ["tourAtlasDesiertoHub", "tourAtlasDesierto45", "tourAtlasDesierto56", "tourAtlasDesierto67"] },
      { label: "Desierto → Atlas", keys: ["tourDesiertoAtlasHub", "tourDesiertoAtlas45", "tourDesiertoAtlas56", "tourDesiertoAtlas67"] },
      { label: "Marrakech → Erg Chebbi", keys: ["tourMarrakechErgHub", "tourMarrakechErg45", "tourMarrakechErg56", "tourMarrakechErg67", "tourMarrakechErg78"] },
      { label: "Erg Chebbi → Marrakech", keys: ["tourErgChebbiMarrakechHub", "tourErgMarrakech45", "tourErgMarrakech56", "tourErgMarrakech67", "tourErgMarrakech78"] },
      { label: "Marrakech → Erg Chebbi → Marrakech", keys: ["tourMarrakechLoopHub", "tourMarrakechLoop23", "tourMarrakechLoop34", "tourMarrakechLoop45", "tourMarrakechLoop56", "tourMarrakechLoop67", "tourMarrakechLoop78"] },
      { label: "Marrakech → Essaouira", keys: ["tourMarrakechEssHub", "tourMarrakechEss45", "tourMarrakechEss67"] },
      { label: "Errachidia → Atlas → Fez", keys: ["tourErrAtlasFezHub", "tourErrAtlasFez56"] },
      { label: "Fez → Atlas → Errachidia", keys: ["tourFezAtlasErr56"] },
    ],
  },
  {
    group: "Viajes · Gran Sur",
    region: true,
    routes: [
      { label: "Landing Gran Sur", keys: ["tourGransurFezRak", "tourGransurRakFezHub", "tourAtlasDesiertoFezHub", "tourGransurFezSidiali", "tourGransurOuarzaFez", "tourGransurTangerRak"] },
      { label: "Marrakech → Fez", keys: ["tourMarrakechFez67", "tourMarrakechFez78", "tourMarrakechFez89", "tourMarrakechFez910"] },
      { label: "Fez → Marrakech", keys: ["tourFezRak67", "tourFezRak78", "tourFezRak89", "tourFezRak910"] },
      { label: "Marrakech → Sidi Ali → Fez", keys: ["tourMarrakechSidialiFez78", "tourMarrakechSidialiFez89", "tourMarrakechSidialiFez910"] },
      { label: "Fez → Sidi Ali → Marrakech", keys: ["tourFezSidialiRak78", "tourFezSidialiRak89", "tourFezSidialiRak910"] },
      { label: "Fez → Sidi Ali → Ouarzazate", keys: ["tourFezSidialiOzz56", "tourFezSidialiOzz67", "tourFezSidialiOzz78"] },
      { label: "Ouarzazate → Sidi Ali → Fez", keys: ["tourOzzSidialiFez56", "tourOzzSidialiFez67", "tourOzzSidialiFez78"] },
      { label: "Tánger → Marrakech", keys: ["tourTangerRak89", "tourTangerRak910"] },
      { label: "Fin de Año", keys: ["tourFinDeAno2025"] },
      { label: "Marruecos Completo", keys: ["tourFull"] },
    ],
  },
  {
    group: "Viajes · Escapadas",
    region: true,
    routes: [
      { label: "Landing Escapadas", keys: ["tourShort"] },
      { label: "Desierto", keys: ["tourEscapadaDesierto34"] },
      { label: "Atlas", keys: ["tourEscapadaAtlas34"] },
      { label: "Fez", keys: ["tourEscapadaFez", "tourEscapadaFez23", "tourEscapadaFez34"] },
      { label: "Fez + Sidi Ali", keys: ["tourEscapadaFezSidiali34", "tourEscapadaFezSidiali45"] },
      { label: "Marrakech", keys: ["tourEscapadaMarrakech", "tourEscapadaMarrakech23"] },
      { label: "Marrakech + Agafay", keys: ["tourEscapadaRakAgafay34"] },
      { label: "Marrakech → Erg Chebbi → Marrakech", keys: ["tourEscapadaRakErgRakHub", "tourEscapadaRakErgRak23", "tourEscapadaRakErgRak34", "tourEscapadaRakErgRak45"] },
      { label: "Tánger", keys: ["tourEscapadaTanger"] },
    ],
  },
  {
    group: "Viajes · Norte de Marruecos",
    region: true,
    routes: [
      { label: "Landing Norte de Marruecos", keys: ["tourNorth"] },
      { label: "Ciudades Imperiales", keys: ["tourNorteCiudadesImperiales", "tourCiudadesImperiales45", "tourCiudadesImperiales67"] },
      { label: "Ciudades Imperiales + Rif", keys: ["tourCiudadesImperialesRif67", "tourCiudadesImperialesRif78"] },
      { label: "Tánger → Fez", keys: ["tourNorteTangerFez", "tourTangerFez45", "tourTangerFez56"] },
      { label: "Fez → Tánger", keys: ["tourFezTanger56", "tourFezTanger67"] },
    ],
  },
  {
    group: "Viajes · Aventura",
    region: true,
    routes: [
      { label: "Landing Aventura", keys: ["tourAdventure"] },
      { label: "Enduro", keys: ["tourAventuraEnduroHub", "tourEnduroAventura45", "tourEnduroAventura67"] },
    ],
  },
  {
    group: "Herramientas y páginas especiales",
    links: [
      ["Juego", "juego"],
      ["Próximas salidas", "upcomingDepartures"],
      ["Próximas salidas (tours)", "tourUpcoming"],
      ["Fin de Año", "tourFinDeAno2025"],
      ["Viajes a medida", "tourBespoke"],
    ],
  },
];

/* Duration badge from a route key suffix (e.g. 45 → 4N / 5D, 910 → 9N / 10D).
   Keys without a numeric suffix are landing pages / overviews. */
const durationBadge = (key) => {
  const m = key.match(/(\d+)$/);
  if (!m) return key.toLowerCase().includes("hub") ? "Resumen" : "Landing";
  const d = m[1];
  if (d.length >= 3) return `${d.slice(0, 1)}N / ${d.slice(1)}D`;
  return `${d[0]}N / ${d[1]}D`;
};


/* ============================================================
   /admin · centralised content dashboard
   ----------------------------------------------------------
   - URL list pulled from lib/routes (single source of truth).
   - Slot browser pulled from /api/slots (images) and
     /api/text_slots (texts), each editable inline + saved
     immediately to the same PUT endpoints used by the in-page
     CMS. Result: every existing EditableImage / EditableText
     across the site is mass-editable from one screen.
   - Live preview iframe re-renders on save (refresh trigger).
============================================================ */
export default function AdminPage() {
  // ----- Admin password gate -----
  const [authed, setAuthed] = useState(null);   // null = checking, false = locked, true = ok
  const [pw, setPw] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("xaluca_admin_token");
    if (!token) { setAuthed(false); return; }
    fetch(`${API}/admin/verify`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  const doLogin = async (e) => {
    e.preventDefault();
    setAuthBusy(true); setAuthErr("");
    try {
      const r = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!r.ok) { setAuthErr("Contraseña incorrecta"); setAuthBusy(false); return; }
      const d = await r.json();
      localStorage.setItem("xaluca_admin_token", d.token);
      setAuthed(true);
    } catch {
      setAuthErr("Error de conexión");
    }
    setAuthBusy(false);
  };
  const logout = () => { localStorage.removeItem("xaluca_admin_token"); setAuthed(false); };

  const [tab, setTab]            = useState("urls"); // urls | images | texts
  const [query, setQuery]        = useState("");
  const [selectedRoute, setRoute] = useState("home");
  const [previewLang, setLang]   = useState("es");
  const [device, setDevice]      = useState("desktop");
  const [imageSlots, setImageSlots] = useState([]);
  const [textSlots, setTextSlots]   = useState([]);
  const [loading, setLoading]    = useState(false);
  const [previewKey, bumpPreview] = useState(0);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => { document.title = "Admin · Xaluca CMS"; }, []);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const [imgRes, txtRes] = await Promise.all([
        fetch(`${API}/slots`).then((r) => r.json()).catch(() => ({})),
        fetch(`${API}/text_slots`).then((r) => r.json()).catch(() => ({})),
      ]);
      const imgArr = Array.isArray(imgRes) ? imgRes : (Array.isArray(imgRes?.slots) ? imgRes.slots : []);
      const ts = txtRes?.slots ?? txtRes;
      let txtArr = [];
      if (Array.isArray(ts)) txtArr = ts;
      else if (ts && typeof ts === "object") {
        txtArr = Object.entries(ts).map(([slot_id, v]) => ({
          slot_id,
          values: v && typeof v === "object" ? v : { es: v || "" },
        }));
      }
      setImageSlots(imgArr);
      setTextSlots(txtArr);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const previewSrc = useMemo(
    () => pathFor(previewLang, selectedRoute) + `?_admin=1#k=${previewKey}`,
    [previewLang, selectedRoute, previewKey]
  );
  const dev = DEVICES.find((d) => d.id === device);

  // ---- URLs grouped by namespace prefix (route key)
  const allRoutes = useMemo(() => Object.keys(ROUTES), []);

  const taxonomyView = useMemo(() => {
    const q = query.trim().toLowerCase();
    const used = new Set();
    const leafMatch = (key, label) =>
      !q ||
      key.toLowerCase().includes(q) ||
      (label || "").toLowerCase().includes(q) ||
      pathFor(previewLang, key).toLowerCase().includes(q);

    const groups = [];
    URL_TAXONOMY.forEach((g) => {
      if (g.links) {
        const links = g.links.filter(([, key]) => ROUTES[key]);
        links.forEach(([, key]) => used.add(key));
        const visible = links.filter(([label, key]) => leafMatch(key, label));
        if (visible.length) groups.push({ type: "links", group: g.group, links: visible });
      } else if (g.routes) {
        const routes = g.routes
          .map((rt) => {
            const keys = rt.keys.filter((k) => ROUTES[k]);
            keys.forEach((k) => used.add(k));
            return { label: rt.label, keys: keys.filter((k) => leafMatch(k, rt.label)) };
          })
          .filter((rt) => rt.keys.length);
        if (routes.length) groups.push({ type: "region", group: g.group, routes });
      }
    });

    // Catch-all: any ROUTES key not placed in the taxonomy above.
    const leftovers = allRoutes.filter((k) => !used.has(k) && leafMatch(k, k));
    if (leftovers.length) {
      groups.push({ type: "links", group: "Otras / sin clasificar", links: leftovers.map((k) => [k, k]) });
    }
    return groups;
  }, [query, previewLang, allRoutes]);

  // ---- Image / text slot grouping by id prefix (e.g. "home.cat.magic-south.image-0")
  const groupSlots = (slots) => {
    const m = {};
    slots.forEach((s) => {
      const top = (s.slot_id || s.id || "").split(".")[0] || "other";
      (m[top] ||= []).push(s);
    });
    return m;
  };
  const filteredImages = useMemo(
    () => imageSlots.filter((s) => (s.slot_id || "").toLowerCase().includes(query.toLowerCase())),
    [imageSlots, query]
  );
  const filteredTexts = useMemo(
    () => textSlots.filter((s) =>
      (s.slot_id || s.id || "").toLowerCase().includes(query.toLowerCase()) ||
      JSON.stringify(s.values || s.value || "").toLowerCase().includes(query.toLowerCase())
    ),
    [textSlots, query]
  );
  const imageGroups = useMemo(() => groupSlots(filteredImages), [filteredImages]);
  const textGroups  = useMemo(() => groupSlots(filteredTexts),  [filteredTexts]);

  const saveImage = async (slot_id, url) => {
    await fetch(`${API}/slots/${encodeURIComponent(slot_id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, source: "admin" }),
    });
    bumpPreview((k) => k + 1);
    fetchSlots();
  };
  const saveText = async (slot_id, values) => {
    await fetch(`${API}/text_slots/${encodeURIComponent(slot_id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    });
    bumpPreview((k) => k + 1);
    fetchSlots();
  };

  // ----- One-click: fill THIS page's images from Pexels -----
  const iframeRef = useRef(null);
  const [fillBusy, setFillBusy] = useState(false);
  const [fillMsg, setFillMsg] = useState("");

  const buildQuery = (node) => {
    let base = (node.getAttribute("data-cms-alt") || "").trim();
    if (base.length < 4) {
      let el = node, heading = "";
      for (let i = 0; i < 6 && el; i++) {
        el = el.parentElement;
        if (!el) break;
        const h = el.querySelector && el.querySelector("h1,h2,h3,h4");
        if (h && h.textContent.trim().length > 3) { heading = h.textContent.trim(); break; }
      }
      base = heading || selectedRoute.replace(/([A-Z])/g, " $1").replace(/[._-]+/g, " ");
    }
    base = base.replace(/[•·|–—:]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
    const low = base.toLowerCase();
    if (!/(morocco|marruecos|maroc)/.test(low)) base += " Morocco";
    return base;
  };

  const fillPageImages = async () => {
    const doc = iframeRef.current && iframeRef.current.contentDocument;
    if (!doc) { setFillMsg("No se pudo leer la página (recarga el preview)."); return; }
    const nodes = Array.from(doc.querySelectorAll("[data-cms-image-slot]"));
    const seen = new Set();
    const items = [];
    nodes.forEach((n) => {
      const slot_id = n.getAttribute("data-cms-image-slot");
      if (!slot_id || seen.has(slot_id)) return;
      seen.add(slot_id);
      const alt = (n.getAttribute("data-cms-alt") || "").trim();
      items.push({ slot_id, query: buildQuery(n), alt: alt || undefined });
    });
    if (!items.length) { setFillMsg("No hay imágenes detectables en esta página."); return; }
    setFillBusy(true);
    setFillMsg(`Rellenando ${items.length} imágenes desde Pexels…`);
    try {
      const r = await fetch(`${API}/pexels/bulk-fill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, orientation: "landscape", force: true }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      setFillMsg(`✓ ${d.ok}/${d.total} imágenes rellenadas${d.failed ? ` · ${d.failed} fallaron` : ""}.`);
      bumpPreview((k) => k + 1);
      fetchSlots();
    } catch {
      setFillMsg("Error al rellenar (la página puede tener demasiadas imágenes; reinténtalo).");
    }
    setFillBusy(false);
  };

  if (authed === null) {
    return (
      <div data-testid="admin-loading" className="min-h-screen bg-[#0F0D0B] text-white/60 flex items-center justify-center text-sm tracking-[0.2em] uppercase">
        Cargando…
      </div>
    );
  }
  if (!authed) {
    return (
      <div data-testid="admin-login" className="min-h-screen bg-[#0F0D0B] text-[#FDFBF7] flex items-center justify-center px-6">
        <form onSubmit={doLogin} className="w-full max-w-sm bg-[#14110F] border border-white/10 p-8">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#D4A373] mb-6">
            <Lock className="w-4 h-4" strokeWidth={1.6} /> Xaluca · Admin
          </div>
          <h1 className="font-serif text-2xl mb-2">Acceso restringido</h1>
          <p className="text-sm text-white/55 mb-6">Introduce la contraseña para gestionar el contenido.</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            data-testid="admin-login-password"
            className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A373]"
          />
          {authErr && <p data-testid="admin-login-error" className="mt-3 text-xs text-[#E07856]">{authErr}</p>}
          <button
            type="submit"
            disabled={authBusy || !pw}
            data-testid="admin-login-submit"
            className={`mt-5 w-full py-2.5 text-[11px] tracking-[0.25em] uppercase transition-colors ${
              authBusy || !pw ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-[#C16542] hover:bg-[#A8533A] text-white"
            }`}
          >
            {authBusy ? "Comprobando…" : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div data-testid="admin-page" className="min-h-screen bg-[#0F0D0B] text-[#FDFBF7]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#14110F] border-b border-white/10 px-4 md:px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#D4A373]">
          <Layout className="w-4 h-4" strokeWidth={1.6} />
          Xaluca · Admin
        </div>
        <div className="flex-1 max-w-xl ml-4 flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2">
          <Search className="w-4 h-4 text-white/50" strokeWidth={1.8} />
          <input
            data-testid="admin-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar URL, slot, contenido…"
            className="bg-transparent outline-none flex-1 text-sm placeholder:text-white/40"
          />
          {query && <button onClick={() => setQuery("")} className="text-white/50 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <button
          data-testid="admin-refresh"
          onClick={fetchSlots}
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase border border-white/15 px-3 py-2 hover:bg-white/5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.8} />
          {loading ? "Loading…" : "Refresh"}
        </button>
        <a
          href={pathFor(previewLang, selectedRoute)}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase bg-[#C16542] hover:bg-[#A8533A] px-3 py-2"
        >
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} /> Open page
        </a>
        <button
          data-testid="admin-logout"
          onClick={logout}
          title="Cerrar sesión"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase border border-white/15 px-3 py-2 hover:bg-white/5"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.8} /> Salir
        </button>
      </header>

      {/* Body */}
      <div className="grid grid-cols-12 gap-0 min-h-[calc(100vh-56px)]">
        {/* Left rail */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-white/10 bg-[#14110F]">
          <nav className="p-3 flex md:flex-col gap-1">
            {[
              { id: "urls",   label: "URLs",          icon: Globe },
              { id: "texts",  label: "Textos",        icon: Type },
              { id: "galleries", label: "Galerías",   icon: Images },
              { id: "leads",  label: "Leads",         icon: Inbox },
              { id: "notify", label: "Notificaciones", icon: Mail },
              { id: "mirror", label: "Mirror DB",      icon: Database },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  data-testid={`admin-tab-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-[11px] tracking-[0.22em] uppercase transition-colors ${
                    active ? "bg-[#C16542] text-white" : "text-white/75 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.6} /> {t.label}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/10">
            <p className="text-[9px] tracking-[0.28em] uppercase text-white/40 mb-2 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Preview lang
            </p>
            <div className="flex gap-1">
              {LANGS.map((l) => (
                <button
                  key={l}
                  data-testid={`admin-lang-${l}`}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-1.5 text-[10px] tracking-[0.22em] uppercase border ${
                    previewLang === l ? "bg-[#C16542] border-transparent" : "border-white/15 text-white/70 hover:bg-white/5"
                  }`}
                >{l}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Middle: lists */}
        {tab === "urls" && (
        <section className="col-span-12 md:col-span-4 lg:col-span-4 border-r border-white/10 overflow-y-auto max-h-[calc(100vh-56px)]">
          {tab === "urls" && (
            <div data-testid="admin-url-list" className="p-4 space-y-4">
              {taxonomyView.map((g) => {
                const collapsedG = collapsed[g.group];
                const count = g.type === "links" ? g.links.length : g.routes.reduce((n, r) => n + r.keys.length, 0);
                return (
                  <div key={g.group}>
                    <button
                      onClick={() => setCollapsed((c) => ({ ...c, [g.group]: !c[g.group] }))}
                      className="w-full flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#D4A373] mb-2"
                    >
                      {collapsedG ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {g.group} · {count}
                    </button>

                    {!collapsedG && g.type === "links" && (
                      <ul className="space-y-0.5">
                        {g.links.map(([label, r]) => (
                          <li key={r + label}>
                            <button
                              data-testid={`admin-route-${r}`}
                              onClick={() => setRoute(r)}
                              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                                selectedRoute === r ? "bg-[#C16542]/20 text-white" : "text-white/70 hover:bg-white/5"
                              }`}
                            >
                              <span className="truncate">{label}</span>
                              <span className="text-[10px] text-white/40 ml-2 truncate">{pathFor(previewLang, r)}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {!collapsedG && g.type === "region" && (
                      <div className="space-y-1.5 pl-1.5 border-l border-white/10">
                        {g.routes.map((rt) => {
                          const subKey = `${g.group}::${rt.label}`;
                          const subCollapsed = collapsed[subKey];
                          return (
                            <div key={subKey}>
                              <button
                                onClick={() => setCollapsed((c) => ({ ...c, [subKey]: !c[subKey] }))}
                                className="w-full flex items-center gap-1.5 text-[11px] text-white/80 hover:text-white py-1"
                              >
                                {subCollapsed ? <ChevronRight className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
                                <span className="truncate text-left">{rt.label}</span>
                                <span className="text-[9px] text-white/30 ml-auto">{rt.keys.length}</span>
                              </button>
                              {!subCollapsed && (
                                <ul className="space-y-0.5 pl-4">
                                  {rt.keys.map((r) => (
                                    <li key={r}>
                                      <button
                                        data-testid={`admin-route-${r}`}
                                        onClick={() => setRoute(r)}
                                        className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center gap-2 ${
                                          selectedRoute === r ? "bg-[#C16542]/20 text-white" : "text-white/65 hover:bg-white/5"
                                        }`}
                                      >
                                        <span className="shrink-0 inline-block min-w-[58px] text-[9px] tracking-wide px-1.5 py-0.5 bg-white/10 text-[#D4A373] text-center rounded-sm">
                                          {durationBadge(r)}
                                        </span>
                                        <span className="text-[10px] text-white/40 truncate">{pathFor(previewLang, r)}</span>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </section>
        )}

        {/* Right: live preview */}
        {tab === "urls" ? (
        <section className="col-span-12 md:col-span-5 lg:col-span-6 bg-[#0F0D0B] flex flex-col">
          <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-white/60">
              <Layout className="w-3.5 h-3.5" /> Live preview · {selectedRoute}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {fillMsg && (
                <span data-testid="admin-fill-msg" className="text-[10px] tracking-[0.12em] text-white/70 max-w-[280px] truncate">{fillMsg}</span>
              )}
              <button
                data-testid="admin-fill-images"
                onClick={fillPageImages}
                disabled={fillBusy}
                title="Detecta los slots de imagen visibles en esta página y los rellena con fotos de Pexels"
                className={`inline-flex items-center gap-2 px-3 py-2 text-[10px] tracking-[0.22em] uppercase transition-colors ${
                  fillBusy ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-[#3E7C59] hover:bg-[#326449] text-white"
                }`}
              >
                <Wand2 className={`w-3.5 h-3.5 ${fillBusy ? "animate-pulse" : ""}`} strokeWidth={1.8} />
                {fillBusy ? "Rellenando…" : "Rellenar imágenes (Pexels)"}
              </button>
              <div className="flex items-center gap-1 bg-white/5 p-1">
                {DEVICES.map((d) => {
                  const Icon = d.icon;
                  return (
                    <button
                      key={d.id}
                      data-testid={`admin-device-${d.id}`}
                      onClick={() => setDevice(d.id)}
                      aria-label={d.label}
                      className={`p-2 transition-colors ${device === d.id ? "bg-[#C16542] text-white" : "text-white/60 hover:bg-white/10"}`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.7} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-[#1A1513] p-3 md:p-6 flex items-start justify-center">
            <div
              data-testid="admin-preview-frame"
              className="bg-white shadow-2xl transition-all duration-300"
              style={{ width: dev.w, maxWidth: "100%", height: dev.id === "desktop" ? "100%" : dev.h, minHeight: 600 }}
            >
              <iframe
                key={previewKey}
                ref={iframeRef}
                title="Live preview"
                src={previewSrc}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </section>
        ) : tab === "leads" ? (
          <section className="col-span-12 md:col-span-9 lg:col-span-10 bg-[#0F0D0B] overflow-y-auto max-h-[calc(100vh-56px)]">
            <LeadsPanel />
          </section>
        ) : tab === "galleries" ? (
          <section className="col-span-12 md:col-span-9 lg:col-span-10 bg-[#0F0D0B] overflow-hidden max-h-[calc(100vh-56px)]">
            <GalleryManager lang={previewLang} />
          </section>
        ) : tab === "texts" ? (
          <section className="col-span-12 md:col-span-9 lg:col-span-10 bg-[#0F0D0B] overflow-y-auto max-h-[calc(100vh-56px)]">
            <TextSlotsPanel />
          </section>
        ) : tab === "mirror" ? (
          <section className="col-span-12 md:col-span-9 lg:col-span-10 bg-[#0F0D0B] overflow-y-auto max-h-[calc(100vh-56px)]">
            <MirrorPanel />
          </section>
        ) : (
          <section className="col-span-12 md:col-span-9 lg:col-span-10 bg-[#0F0D0B] overflow-y-auto max-h-[calc(100vh-56px)]">
            <NotifyPanel />
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------- Image editor row ---------- */
const ImageEditor = ({ slot, onSave }) => {
  const [url, setUrl] = useState(slot.url || "");
  const [busy, setBusy] = useState(false);
  const dirty = url !== (slot.url || "");
  const save = async () => {
    setBusy(true);
    try { await onSave(slot.slot_id, url); } finally { setBusy(false); }
  };
  return (
    <li data-testid={`admin-image-${slot.slot_id}`} className="bg-white/[0.04] border border-white/10 p-3 flex gap-3">
      <div className="w-20 h-20 flex-shrink-0 bg-black/40 overflow-hidden border border-white/10">
        {url ? <img src={url} alt={slot.alt || ""} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/30"><ImageIcon className="w-5 h-5" /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] tracking-[0.18em] uppercase text-white/55 truncate" title={slot.slot_id}>{slot.slot_id}</p>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL (https://…)"
          className="mt-2 w-full bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white/90 outline-none focus:border-[#D4A373]"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[9px] tracking-[0.22em] uppercase text-white/40">{slot.source || "external"}</span>
          <button
            onClick={save}
            disabled={!dirty || busy}
            data-testid={`admin-save-image-${slot.slot_id}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase transition-colors ${
              dirty && !busy ? "bg-[#C16542] hover:bg-[#A8533A] text-white" : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            <Save className="w-3 h-3" strokeWidth={2} /> {busy ? "…" : "Save"}
          </button>
        </div>
      </div>
    </li>
  );
};

/* ---------- Text editor row ----------
   text_slots store either { value: "..." } (single string) or
   { values: { es, en, fr } } (i18n object). We support both. */
const TextEditor = ({ slot, onSave }) => {
  const isI18n = slot.values && typeof slot.values === "object";
  const [vals, setVals] = useState(isI18n
    ? { es: slot.values.es || "", en: slot.values.en || "", fr: slot.values.fr || "" }
    : { es: slot.value || "", en: "", fr: "" });
  const [busy, setBusy] = useState(false);
  const dirty = isI18n
    ? (vals.es !== (slot.values.es || "") || vals.en !== (slot.values.en || "") || vals.fr !== (slot.values.fr || ""))
    : vals.es !== (slot.value || "");

  const save = async () => {
    setBusy(true);
    try { await onSave(slot.slot_id || slot.id, vals); } finally { setBusy(false); }
  };

  return (
    <li data-testid={`admin-text-${slot.slot_id || slot.id}`} className="bg-white/[0.04] border border-white/10 p-3">
      <p className="text-[10px] tracking-[0.18em] uppercase text-white/55 truncate" title={slot.slot_id || slot.id}>
        {slot.slot_id || slot.id}
      </p>
      <div className="mt-2 space-y-1.5">
        {LANGS.map((l) => (
          <div key={l} className="flex items-start gap-2">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#D4A373] w-6 pt-1.5">{l}</span>
            <textarea
              value={vals[l]}
              onChange={(e) => setVals((v) => ({ ...v, [l]: e.target.value }))}
              rows={Math.max(1, Math.min(4, (vals[l] || "").length / 80 + 1))}
              className="flex-1 bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white/90 outline-none focus:border-[#D4A373] resize-y"
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <button
          onClick={save}
          disabled={!dirty || busy}
          data-testid={`admin-save-text-${slot.slot_id || slot.id}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase transition-colors ${
            dirty && !busy ? "bg-[#C16542] hover:bg-[#A8533A] text-white" : "bg-white/5 text-white/30 cursor-not-allowed"
          }`}
        >
          <Save className="w-3 h-3" strokeWidth={2} /> {busy ? "…" : "Save"}
        </button>
      </div>
    </li>
  );
};

/* ---------- Global pricing editor ----------
   Edits the centralised price matrix (people × low/high) stored
   in the DB via PUT /api/pricing. Updates the live <FromPrice>/
   <PricingSection> store and reloads the preview on save. */
const PricingEditor = ({ onSaved }) => {
  const [tiers, setTiers] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API}/pricing`)
      .then((r) => r.json())
      .then((d) => {
        const base =
          d && Array.isArray(d.tiers) && d.tiers.length ? d.tiers : DEFAULT_PRICING.tiers;
        setTiers(base.map((t) => ({ people: String(t.people), low: String(t.low), high: String(t.high) })));
      })
      .catch(() => setTiers(DEFAULT_PRICING.tiers.map((t) => ({ people: String(t.people), low: String(t.low), high: String(t.high) }))));
  }, []);

  if (!tiers) return <p className="text-sm text-white/50">Cargando precios…</p>;

  const onlyDigits = (v) => v.replace(/[^0-9]/g, "");
  const update = (i, key, val) =>
    setTiers((ts) => ts.map((t, idx) => (idx === i ? { ...t, [key]: onlyDigits(val) } : t)));
  const addTier = () =>
    setTiers((ts) => [...ts, { people: String((Number(ts[ts.length - 1]?.people) || 1) + 1), low: "0", high: "0" }]);
  const removeTier = (i) => setTiers((ts) => ts.filter((_, idx) => idx !== i));

  const nums = tiers.flatMap((t) => [Number(t.low), Number(t.high)]).filter((n) => n > 0);
  const fromPreview = nums.length ? Math.min(...nums) : 0;

  const save = async () => {
    setBusy(true);
    setMsg("");
    const token = localStorage.getItem("xaluca_admin_token");
    const payload = {
      currency: "EUR",
      tiers: tiers
        .map((t) => ({ people: Number(t.people) || 0, low: Number(t.low) || 0, high: Number(t.high) || 0 }))
        .filter((t) => t.people > 0),
    };
    try {
      const r = await fetch(`${API}/pricing`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      setPricingOverride(d);
      setMsg("✓ Precios guardados. Se reflejan en toda la web.");
      onSaved && onSaved();
    } catch {
      setMsg("Error al guardar los precios.");
    }
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-[10px] tracking-[0.28em] uppercase text-[#D4A373] mb-1.5">
          Precios globales · Paquete 4x4
        </h3>
        <p className="text-xs text-white/55 leading-relaxed">
          Tarifa por persona según el número de viajeros. Estos precios se aplican a TODOS los
          viajes y a la etiqueta «Desde» de todas las cards. El mínimo se usa como «Desde».
        </p>
      </div>

      {/* Matrix header */}
      <div className="grid grid-cols-12 gap-2 text-[9px] tracking-[0.22em] uppercase text-white/45 px-1">
        <span className="col-span-4">Viajeros</span>
        <span className="col-span-3">Baja €</span>
        <span className="col-span-3">Alta €</span>
        <span className="col-span-2" />
      </div>

      {tiers.map((t, i) => (
        <div key={i} data-testid={`admin-pricing-row-${i}`} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-4 flex items-center gap-2">
            <input
              value={t.people}
              onChange={(e) => update(i, "people", e.target.value)}
              data-testid={`admin-pricing-people-${i}`}
              className="w-14 bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white outline-none focus:border-[#D4A373]"
            />
            <span className="text-[10px] tracking-[0.18em] uppercase text-white/45">pers.</span>
          </div>
          <input
            value={t.low}
            onChange={(e) => update(i, "low", e.target.value)}
            data-testid={`admin-pricing-low-${i}`}
            className="col-span-3 bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white outline-none focus:border-[#D4A373]"
          />
          <input
            value={t.high}
            onChange={(e) => update(i, "high", e.target.value)}
            data-testid={`admin-pricing-high-${i}`}
            className="col-span-3 bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-white outline-none focus:border-[#D4A373]"
          />
          <button
            onClick={() => removeTier(i)}
            data-testid={`admin-pricing-remove-${i}`}
            title="Eliminar tramo"
            className="col-span-2 inline-flex items-center justify-center py-1.5 text-white/40 hover:text-[#E07856] hover:bg-white/5"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
          </button>
        </div>
      ))}

      <button
        onClick={addTier}
        data-testid="admin-pricing-add"
        className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase border border-white/15 px-3 py-2 text-white/70 hover:bg-white/5"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={1.8} /> Añadir tramo
      </button>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="text-xs text-white/60">
          <span className="block text-[9px] tracking-[0.22em] uppercase text-white/40">Desde (auto)</span>
          <span className="font-serif text-lg text-white" data-testid="admin-pricing-from">
            {fromPreview ? fmtEuro(fromPreview) : "—"}
          </span>
        </div>
        <button
          onClick={save}
          disabled={busy}
          data-testid="admin-pricing-save"
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase transition-colors ${
            busy ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-[#C16542] hover:bg-[#A8533A] text-white"
          }`}
        >
          <Save className="w-3.5 h-3.5" strokeWidth={2} /> {busy ? "Guardando…" : "Guardar precios"}
        </button>
      </div>
      {msg && (
        <p data-testid="admin-pricing-msg" className="text-xs text-white/70">{msg}</p>
      )}
    </div>
  );
};


/* ---------- Mirror Production Database ----------
   One-click FULL pull: this environment's content is OVERWRITTEN with an
   exact copy of production (https://xalucatravel.com). The backend reads
   production's public endpoints (cms/export, day-galleries, files) — no
   prod redeploy needed — and image binaries live in shared object storage,
   so previews show the same images immediately. Run on PREVIEW before a
   deploy so live CMS edits are never lost. */
const MirrorPanel = () => {
  const PROD = "https://xalucatravel.com";
  const onProd = (process.env.REACT_APP_BACKEND_URL || "").includes("xalucatravel.com");
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runMirror = async () => {
    setBusy(true); setError(""); setResult(null);
    try {
      const token = localStorage.getItem("xaluca_admin_token");
      const r = await fetch(`${API}/admin/mirror-production`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || "Error al sincronizar la base de datos.");
      setResult(d.mirrored || {});
    } catch (e) {
      setError(e.message || "Error al sincronizar la base de datos.");
    } finally {
      setBusy(false); setConfirming(false);
    }
  };

  const rows = result && [
    ["Textos y traducciones", result.text_slots],
    ["Imágenes (Edit Image)", result.image_slots],
    ["Galerías por día", result.day_galleries],
    ["Biblioteca de imágenes", result.files],
    ["Precios", result.pricing ? "Sí" : "—"],
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 text-white" data-testid="mirror-panel">
      <div className="flex items-center gap-3 mb-2">
        <Database className="w-6 h-6 text-[#D4A373]" strokeWidth={1.6} />
        <h2 className="text-2xl font-serif-x">Mirror Production Database</h2>
      </div>
      <p className="text-sm text-white/65 leading-relaxed mb-6">
        Copia el contenido completo de <span className="text-[#D4A373]">producción</span> a este entorno
        para que ambos queden idénticos antes de un despliegue. Así no se pierden los cambios hechos en la
        web en vivo (CMS, Edit Text, Edit Image). Las imágenes se comparten en el almacenamiento, así que
        aparecen al instante.
      </p>

      <div className="space-y-2 text-[11px] tracking-[0.15em] uppercase text-white/50 mb-6">
        <div className="flex items-center justify-between border border-white/10 px-4 py-2.5">
          <span>Origen (producción)</span>
          <span className="text-white/80 normal-case tracking-normal">{PROD}</span>
        </div>
        <div className="flex items-center justify-between border border-white/10 px-4 py-2.5">
          <span>Destino (este entorno)</span>
          <span className="text-white/80 normal-case tracking-normal truncate max-w-[55%]">
            {(process.env.REACT_APP_BACKEND_URL || "").replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>

      {/* Destructive warning */}
      <div className="flex items-start gap-3 bg-[#C16542]/10 border border-[#C16542]/40 px-4 py-3 mb-6">
        <AlertTriangle className="w-4 h-4 text-[#C16542] mt-0.5 shrink-0" strokeWidth={1.8} />
        <p className="text-xs text-white/75 leading-relaxed">
          Esta acción <b>sobrescribe por completo</b> el contenido de este entorno (textos, imágenes,
          galerías, biblioteca y precios) con el de producción. No afecta a producción ni a los leads.
          {onProd && (
            <span className="block mt-2 text-[#C16542] font-semibold">
              ⚠ Estás en producción. Esta herramienta está pensada para ejecutarse en PREVIEW.
            </span>
          )}
        </p>
      </div>

      {!confirming ? (
        <button
          type="button"
          data-testid="mirror-start-btn"
          onClick={() => { setConfirming(true); setResult(null); setError(""); }}
          disabled={busy}
          className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-white px-6 py-3 text-[11px] tracking-[0.25em] uppercase transition-colors disabled:opacity-50"
        >
          <DownloadCloud className="w-4 h-4" strokeWidth={1.8} />
          Mirror Production Database
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-3" data-testid="mirror-confirm-row">
          <span className="text-sm text-white/80">¿Sobrescribir este entorno con producción?</span>
          <button
            type="button"
            data-testid="mirror-confirm-btn"
            onClick={runMirror}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-[#C16542] hover:bg-[#A35133] text-white px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase transition-colors disabled:opacity-50"
          >
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={1.8} /> : <CheckCircle2 className="w-4 h-4" strokeWidth={1.8} />}
            {busy ? "Sincronizando…" : "Sí, sobrescribir"}
          </button>
          <button
            type="button"
            data-testid="mirror-cancel-btn"
            onClick={() => setConfirming(false)}
            disabled={busy}
            className="text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-white disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      )}

      {busy && (
        <p className="mt-4 text-xs text-white/55">Copiando la base de datos de producción… puede tardar hasta un minuto. No cierres esta página.</p>
      )}

      {error && (
        <div className="mt-6 flex items-start gap-3 bg-red-500/10 border border-red-500/40 px-4 py-3" data-testid="mirror-error">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" strokeWidth={1.8} />
          <p className="text-xs text-red-300 leading-relaxed">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 border border-[#5A6B4F]/50 bg-[#5A6B4F]/10 px-5 py-4" data-testid="mirror-result">
          <div className="flex items-center gap-2 mb-3 text-[#9DBE8C]">
            <CheckCircle2 className="w-4 h-4" strokeWidth={1.8} />
            <span className="text-sm font-semibold">Mirror completado — este entorno es ahora una copia de producción.</span>
          </div>
          <ul className="space-y-1.5">
            {rows.map(([label, val]) => (
              <li key={label} className="flex items-center justify-between text-xs text-white/75">
                <span>{label}</span>
                <span className="text-white font-mono">{val}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-white/45">Recarga la web para ver el contenido actualizado.</p>
        </div>
      )}
    </div>
  );
};



/* ---------- CMS Sync panel ----------
   Pushes all CMS content (image slots, text slots, global pricing) from the
   CURRENT backend (source = REACT_APP_BACKEND_URL) to a TARGET environment
   (e.g. production). Runs entirely in the browser:
     1. GET  {source}/api/cms/export
     2. POST {target}/api/admin/login  → token
     3. POST {target}/api/cms/import   (Bearer token)
   Also offers a one-click snapshot download for manual backups. */
const SyncPanel = () => {
  const [targetUrl, setTargetUrl] = useState(
    () => localStorage.getItem("xaluca_sync_target") || ""
  );
  const [password, setPassword] = useState("");
  const [wipe, setWipe] = useState(false);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState([]);
  const [counts, setCounts] = useState(null);
  const [verify, setVerify] = useState(null); // null | {status:'ok'|'warn', src, dst}

  const pushLog = (line) => setLog((l) => [...l, line]);
  const trimUrl = (u) => (u || "").trim().replace(/\/+$/, "");

  useEffect(() => {
    fetch(`${API}/cms/export`)
      .then((r) => r.json())
      .then((d) => setCounts(d.counts))
      .catch(() => setCounts(null));
  }, []);

  const downloadSnapshot = async () => {
    try {
      const r = await fetch(`${API}/cms/export`);
      const data = await r.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `xaluca_cms_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      pushLog("✗ No se pudo descargar el snapshot.");
    }
  };

  const publish = async () => {
    const to = trimUrl(targetUrl);
    if (!to) { pushLog("✗ Indica la URL del entorno destino."); return; }
    if (!password) { pushLog("✗ Indica la contraseña de admin del destino."); return; }
    if (to === trimUrl(process.env.REACT_APP_BACKEND_URL)) {
      pushLog("✗ El destino es el mismo entorno actual. Usa la URL de producción.");
      return;
    }
    localStorage.setItem("xaluca_sync_target", to);
    setBusy(true); setLog([]); setVerify(null);
    try {
      pushLog("→ Exportando contenido del entorno actual…");
      const exp = await fetch(`${API}/cms/export`).then((r) => r.json());
      pushLog(`  ✓ ${exp.counts.image_slots} imágenes + ${exp.counts.text_slots} textos.`);

      pushLog(`→ Iniciando sesión en ${to}…`);
      const lr = await fetch(`${to}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!lr.ok) throw new Error(`login destino falló (${lr.status}) — revisa la contraseña`);
      const { token } = await lr.json();
      if (!token) throw new Error("el destino no devolvió token");

      pushLog(`→ Importando en destino${wipe ? " (modo reemplazo total)" : ""}…`);
      const ir = await fetch(`${to}/api/cms/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          image_slots: exp.image_slots || [],
          text_slots: exp.text_slots || [],
          pricing: exp.pricing || null,
          wipe,
        }),
      });
      if (!ir.ok) {
        const t = await ir.text();
        throw new Error(`import falló (${ir.status}): ${t.slice(0, 160)}`);
      }
      const res = await ir.json();
      pushLog(`✓ Hecho. Importado: ${res.imported?.image_slots ?? res.image_slots ?? 0} imágenes, ${res.imported?.text_slots ?? res.text_slots ?? 0} textos, precios: ${(res.imported?.pricing ?? res.pricing) ? "sí" : "no"}.`);

      // ---- Post-publish verification: compare source ↔ destination counts ----
      pushLog("→ Verificando el destino…");
      const dst = await fetch(`${to}/api/cms/export`).then((r) => r.json());
      const src = exp.counts;
      const dstC = dst.counts;
      // wipe → exact mirror; upsert → destination must contain at least the source slots
      const ok = wipe
        ? dstC.image_slots === src.image_slots && dstC.text_slots === src.text_slots
        : dstC.image_slots >= src.image_slots && dstC.text_slots >= src.text_slots;
      setVerify({ status: ok ? "ok" : "warn", src, dst: dstC, wipe });
      if (ok) {
        pushLog(`✓ Verificación correcta: destino con ${dstC.image_slots} imágenes y ${dstC.text_slots} textos.`);
      } else {
        pushLog(`⚠ Discrepancia: destino ${dstC.image_slots}/${dstC.text_slots} vs origen ${src.image_slots}/${src.text_slots}.`);
      }
      pushLog("Tip: recarga el sitio destino (Ctrl/Cmd+Shift+R) para ver los cambios.");
    } catch (e) {
      pushLog(`✗ ${e.message}`);
    }
    setBusy(false);
  };

  // ---- Reverse sync: pull content FROM production INTO this (preview) env ----
  const pullFromProd = async () => {
    const from = trimUrl(targetUrl);
    if (!from) { pushLog("✗ Indica la URL de producción en el campo de arriba."); return; }
    if (from === trimUrl(process.env.REACT_APP_BACKEND_URL)) {
      pushLog("✗ El origen es el mismo entorno actual. Usa la URL de producción.");
      return;
    }
    const token = localStorage.getItem("xaluca_admin_token");
    if (!token) { pushLog("✗ Sesión admin no válida. Vuelve a iniciar sesión."); return; }
    localStorage.setItem("xaluca_sync_target", from);
    setBusy(true); setLog([]); setVerify(null);
    try {
      pushLog(`→ Exportando contenido de producción (${from})…`);
      const exp = await fetch(`${from}/api/cms/export`).then((r) => r.json());
      pushLog(`  ✓ ${exp.counts.image_slots} imágenes + ${exp.counts.text_slots} textos.`);

      pushLog("→ Importando en este entorno (preview)…");
      const ir = await fetch(`${API}/cms/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          image_slots: exp.image_slots || [],
          text_slots: exp.text_slots || [],
          pricing: exp.pricing || null,
          wipe,
        }),
      });
      if (!ir.ok) {
        const t = await ir.text();
        throw new Error(`import falló (${ir.status}): ${t.slice(0, 160)}`);
      }
      const res = await ir.json();
      pushLog(`✓ Hecho. Importado: ${res.imported?.image_slots ?? 0} imágenes, ${res.imported?.text_slots ?? 0} textos, precios: ${res.imported?.pricing ? "sí" : "no"}.`);

      pushLog("→ Verificando preview…");
      const dst = await fetch(`${API}/cms/export`).then((r) => r.json());
      const src = exp.counts;
      const dstC = dst.counts;
      const ok = wipe
        ? dstC.image_slots === src.image_slots && dstC.text_slots === src.text_slots
        : dstC.image_slots >= src.image_slots && dstC.text_slots >= src.text_slots;
      setVerify({ status: ok ? "ok" : "warn", src, dst: dstC, wipe });
      pushLog(ok
        ? `✓ Preview igualado: ${dstC.image_slots} imágenes y ${dstC.text_slots} textos.`
        : `⚠ Discrepancia: preview ${dstC.image_slots}/${dstC.text_slots} vs producción ${src.image_slots}/${src.text_slots}.`);
      pushLog("Tip: recarga esta web (Ctrl/Cmd+Shift+R) para ver los cambios.");
      setCounts(dstC);
    } catch (e) {
      pushLog(`✗ ${e.message}`);
    }
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-[10px] tracking-[0.28em] uppercase text-[#D4A373] mb-1.5">
          Sincronizar contenido CMS
        </h3>
        <p className="text-xs text-white/55 leading-relaxed">
          Publica todas tus ediciones (imágenes, textos y precios) de este entorno a producción
          con un clic. {counts && (
            <span className="text-white/75">
              Snapshot actual: {counts.image_slots} imágenes · {counts.text_slots} textos.
            </span>
          )}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[9px] tracking-[0.22em] uppercase text-white/45 mb-1.5">
            URL del entorno destino (producción)
          </label>
          <input
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://tu-sitio.emergent.host"
            data-testid="admin-sync-target"
            className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#D4A373]"
          />
        </div>
        <div>
          <label className="block text-[9px] tracking-[0.22em] uppercase text-white/45 mb-1.5">
            Contraseña de admin del destino
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            data-testid="admin-sync-password"
            className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#D4A373]"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-white/65 cursor-pointer">
          <input
            type="checkbox"
            checked={wipe}
            onChange={(e) => setWipe(e.target.checked)}
            data-testid="admin-sync-wipe"
            className="accent-[#C16542]"
          />
          Reemplazo total (borra el contenido del destino antes de importar)
        </label>
        <p className="text-[11px] text-white/40 leading-relaxed">
          La contraseña solo es necesaria para <span className="text-white/60">Publicar</span> (escribe en producción).
          «Traer de producción» solo lee de producción e importa aquí (usa tu sesión actual).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
        <button
          onClick={publish}
          disabled={busy}
          data-testid="admin-sync-publish"
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase transition-colors ${
            busy ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-[#C16542] hover:bg-[#A8533A] text-white"
          }`}
        >
          <UploadCloud className={`w-3.5 h-3.5 ${busy ? "animate-pulse" : ""}`} strokeWidth={1.8} />
          {busy ? "Publicando…" : "Publicar en producción"}
        </button>
        <button
          onClick={pullFromProd}
          disabled={busy}
          data-testid="admin-sync-pull"
          title="Trae el contenido de producción e iguala este entorno (preview)"
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase transition-colors ${
            busy ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-[#3E6B8A] hover:bg-[#335874] text-white"
          }`}
        >
          <DownloadCloud className={`w-3.5 h-3.5 ${busy ? "animate-pulse" : ""}`} strokeWidth={1.8} />
          {busy ? "Trayendo…" : "Traer de producción"}
        </button>
        <button
          onClick={downloadSnapshot}
          disabled={busy}
          data-testid="admin-sync-download"
          title="Descargar copia JSON del contenido actual"
          className="inline-flex items-center gap-2 px-3 py-2.5 text-[10px] tracking-[0.22em] uppercase border border-white/15 text-white/70 hover:bg-white/5"
        >
          <Download className="w-3.5 h-3.5" strokeWidth={1.8} /> Snapshot
        </button>
      </div>

      {verify && (
        <div
          data-testid="admin-sync-verify"
          data-status={verify.status}
          className={`flex items-start gap-3 border p-3 ${
            verify.status === "ok"
              ? "border-[#3E7C59]/50 bg-[#3E7C59]/10"
              : "border-[#C9871F]/50 bg-[#C9871F]/10"
          }`}
        >
          {verify.status === "ok"
            ? <CheckCircle2 className="w-5 h-5 text-[#7BB98A] flex-shrink-0 mt-0.5" strokeWidth={1.8} />
            : <AlertTriangle className="w-5 h-5 text-[#E0B25A] flex-shrink-0 mt-0.5" strokeWidth={1.8} />}
          <div className="min-w-0">
            <p className={`text-[11px] tracking-[0.18em] uppercase font-medium ${verify.status === "ok" ? "text-[#7BB98A]" : "text-[#E0B25A]"}`}>
              {verify.status === "ok" ? "✓ Producción sincronizada" : "⚠ Revisar sincronización"}
            </p>
            <p className="mt-1 text-xs text-white/70 leading-relaxed">
              Origen: {verify.src.image_slots} imágenes · {verify.src.text_slots} textos.{" "}
              Destino: {verify.dst.image_slots} imágenes · {verify.dst.text_slots} textos.
              {verify.status === "ok"
                ? " La migración se completó al 100%."
                : " Los conteos no coinciden; revisa el log y reintenta."}
            </p>
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div
          data-testid="admin-sync-log"
          className="bg-black/40 border border-white/10 p-3 text-[11px] leading-relaxed text-white/80 font-mono space-y-0.5 max-h-64 overflow-y-auto"
        >
          {log.map((line, i) => (
            <div key={i} className={line.startsWith("✗") ? "text-[#E07856]" : line.startsWith("✓") ? "text-[#7BB98A]" : ""}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


/* ============================================================
   PoiManager · centralised "Puntos destacados" editor
   ------------------------------------------------------------
   Lists every point of interest used across the day maps and
   itineraries (deduped by stable poiKey). For each POI you edit
   its MAIN card — Título, Descripción, Imagen principal — which
   writes the GLOBAL slots `poi.${poiKey}.gallery.0[.title|.desc]`.
   Those are the exact slots the LandmarkCarousel / route galleries
   render, so a single edit syncs the POI everywhere it appears.
============================================================ */
const KIND_LABEL = {
  town: "Ciudad", village: "Aldea", kasbah: "Kasbah", site: "Sitio",
  palm: "Palmeral", gorges: "Gargantas", valley: "Valle", mountain: "Montaña",
  dunes: "Dunas", viewpoint: "Mirador", market: "Mercado", music: "Música",
  fossils: "Fósiles", hotel: "Hotel", camp: "Campamento", airport: "Aeropuerto",
};

const PoiManager = ({ query, imageSlots, textSlots, onSaveImage, onSaveText, onChanged }) => {
  const imageMap = useMemo(() => {
    const m = {};
    (imageSlots || []).forEach((s) => { if (s.slot_id) m[s.slot_id] = s; });
    return m;
  }, [imageSlots]);
  const textMap = useMemo(() => {
    const m = {};
    (textSlots || []).forEach((s) => {
      const id = s.slot_id || s.id;
      if (id) m[id] = s.values || (s.value ? { es: s.value } : {});
    });
    return m;
  }, [textSlots]);

  const q = (query || "").trim().toLowerCase();
  const list = useMemo(
    () => LANDMARK_CATALOG.filter((p) =>
      !q ||
      p.id.toLowerCase().includes(q) ||
      (p.group || "").toLowerCase().includes(q) ||
      Object.values(p.name || {}).some((v) => (v || "").toLowerCase().includes(q))
    ),
    [q]
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[10px] tracking-[0.28em] uppercase text-[#D4A373] mb-1.5 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" /> Puntos destacados · {list.length}/{LANDMARK_CATALOG.length}
        </h3>
        <p className="text-xs text-white/55 leading-relaxed">
          Cada punto del <span className="text-white/75">Mapa del día</span> (de todos los itinerarios) es un bloque independiente.
          Al desplegarlo verás su información y todas las <span className="text-white/75">cards de la Galería del lugar</span> (ES/EN/FR + imagen).
          Al guardar, el cambio se sincroniza automáticamente en el mapa del día y en todas las galerías donde aparezca ese mismo punto.
        </p>
      </div>
      {list.length === 0 && (
        <p className="text-sm text-white/50">Ningún punto coincide con la búsqueda.</p>
      )}
      <ul className="space-y-3">
        {list.map((poi) => (
          <PoiRow
            key={poi.uid}
            poi={poi}
            imageMap={imageMap}
            textMap={textMap}
            onSaveImage={onSaveImage}
            onSaveText={onSaveText}
            onChanged={onChanged}
          />
        ))}
      </ul>
    </div>
  );
};

const triEqual = (a, b) =>
  (a.es || "") === (b.es || "") && (a.en || "") === (b.en || "") && (a.fr || "") === (b.fr || "");

/* A text override only "counts" if it actually carries content (an empty
   {} tombstone left after a delete must not flag the POI as edited). */
const hasVals = (v) => !!(v && (v.es || v.en || v.fr));

const PoiRow = ({ poi, imageMap, textMap, onSaveImage, onSaveText, onChanged }) => {
  const [open, setOpen] = useState(false);
  const info = infoSlots(poi.prefix);
  const card0 = cardSlots(poi.prefix, 0);
  const headTitle = (poi.hasInfo && textMap[info.name]?.es) || poi.name?.es || poi.id;
  const headImg = imageMap[card0.image]?.url || poi.cards[0]?.image || "";
  const overridden =
    (poi.hasInfo && (hasVals(textMap[info.name]) || hasVals(textMap[info.blurb]))) ||
    poi.cards.some((_, i) => {
      const s = cardSlots(poi.prefix, i);
      return !!imageMap[s.image]?.url || hasVals(textMap[s.title]) || hasVals(textMap[s.desc]);
    });

  return (
    <li data-testid={`admin-poi-${poi.uid}`} className="bg-white/[0.04] border border-white/10">
      {/* Block header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-testid={`admin-poi-toggle-${poi.uid}`}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.03]"
      >
        <div className="w-14 h-14 flex-shrink-0 bg-black/40 overflow-hidden border border-white/10">
          {headImg
            ? <img src={headImg} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-white/30"><ImageIcon className="w-4 h-4" /></div>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white truncate flex items-center gap-2">
            {headTitle}
            {overridden && <span className="text-[8px] tracking-[0.18em] uppercase bg-[#3E7C59]/30 text-[#7BB98A] px-1.5 py-0.5">editado</span>}
          </p>
          <p className="text-[10px] tracking-[0.14em] uppercase text-white/40 truncate">
            {KIND_LABEL[poi.kind] || poi.kind} · {poi.cards.length} cards · {poi.group}
          </p>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
      </button>

      {open && (
        <div className="px-3 pb-3 border-t border-white/10 pt-3 space-y-3">
          {/* Location name + description (curated landmarks only) */}
          {poi.hasInfo && (
            <LandmarkInfoEditor
              poi={poi}
              slots={info}
              textMap={textMap}
              onSaveText={onSaveText}
            />
          )}
          {/* The GALERÍA DEL LUGAR cards */}
          <p className="text-[9px] tracking-[0.24em] uppercase text-white/35 pt-1">Galería del lugar · {poi.cards.length} cards</p>
          {poi.cards.map((card, i) => (
            <PoiCardEditor
              key={i}
              poiKey={poi.uid}
              index={i}
              slots={cardSlots(poi.prefix, i)}
              defaults={card}
              imageMap={imageMap}
              textMap={textMap}
              onSaveImage={onSaveImage}
              onSaveText={onSaveText}
              onChanged={onChanged}
            />
          ))}
        </div>
      )}
    </li>
  );
};

/* Editable name + description of a curated day-map location (its own info,
   shown on the map's side list). Writes ${prefix}.name / ${prefix}.blurb. */
const LandmarkInfoEditor = ({ poi, slots, textMap, onSaveText }) => {
  const nameOv = textMap[slots.name];
  const blurbOv = textMap[slots.blurb];
  const initName = {
    es: nameOv?.es ?? poi.name.es ?? "", en: nameOv?.en ?? poi.name.en ?? "", fr: nameOv?.fr ?? poi.name.fr ?? "",
  };
  const initBlurb = {
    es: blurbOv?.es ?? poi.blurb.es ?? "", en: blurbOv?.en ?? poi.blurb.en ?? "", fr: blurbOv?.fr ?? poi.blurb.fr ?? "",
  };
  const [name, setName] = useState(initName);
  const [blurb, setBlurb] = useState(initBlurb);
  const [busy, setBusy] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [msg, setMsg] = useState("");

  const dirty = !triEqual(name, initName) || !triEqual(blurb, initBlurb);

  const autoTranslate = async () => {
    setTranslating(true); setMsg("");
    try {
      const doOne = async (text) => {
        if (!text || !text.trim()) return {};
        const r = await fetch(`${API}/translate`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, source: "es", targets: ["en", "fr"] }),
        });
        if (!r.ok) throw new Error(String(r.status));
        return (await r.json()).translations || {};
      };
      const [tn, tb] = await Promise.all([doOne(name.es), doOne(blurb.es)]);
      setName((v) => ({ ...v, en: tn.en || v.en, fr: tn.fr || v.fr }));
      setBlurb((v) => ({ ...v, en: tb.en || v.en, fr: tb.fr || v.fr }));
      setMsg("✓ Traducido desde ES (revisa y guarda).");
    } catch { setMsg("✗ La traducción automática falló."); }
    setTranslating(false);
  };

  const save = async () => {
    setBusy(true); setMsg("");
    try {
      const tasks = [];
      if (!triEqual(name, initName)) tasks.push(onSaveText(slots.name, name));
      if (!triEqual(blurb, initBlurb)) tasks.push(onSaveText(slots.blurb, blurb));
      await Promise.all(tasks);
      setMsg("✓ Guardado y sincronizado.");
    } catch { setMsg("✗ Error al guardar."); }
    setBusy(false);
  };

  return (
    <div data-testid={`admin-poi-info-${poi.uid}`} className="bg-black/20 border border-white/10 p-3 space-y-3">
      <p className="text-[9px] tracking-[0.24em] uppercase text-[#D4A373]">Localización · nombre y descripción</p>
      <div>
        <p className="text-[9px] tracking-[0.22em] uppercase text-white/45 mb-1.5">Nombre</p>
        <div className="space-y-1.5">
          {LANGS.map((l) => (
            <div key={l} className="flex items-center gap-2">
              <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 w-6">{l}</span>
              <input
                value={name[l]}
                onChange={(e) => setName((v) => ({ ...v, [l]: e.target.value }))}
                data-testid={`admin-poi-name-${poi.uid}-${l}`}
                className="flex-1 bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white/90 outline-none focus:border-[#D4A373]"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[9px] tracking-[0.22em] uppercase text-white/45 mb-1.5">Descripción</p>
        <div className="space-y-1.5">
          {LANGS.map((l) => (
            <div key={l} className="flex items-start gap-2">
              <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 w-6 pt-1.5">{l}</span>
              <textarea
                value={blurb[l]}
                onChange={(e) => setBlurb((v) => ({ ...v, [l]: e.target.value }))}
                rows={2}
                data-testid={`admin-poi-blurb-${poi.uid}-${l}`}
                className="flex-1 bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white/90 outline-none focus:border-[#D4A373] resize-y"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          type="button"
          onClick={autoTranslate}
          disabled={translating || !name.es}
          data-testid={`admin-poi-info-translate-${poi.uid}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] tracking-[0.18em] uppercase border border-white/15 text-white/70 hover:bg-white/5 disabled:opacity-40"
        >
          <Languages className={`w-3.5 h-3.5 ${translating ? "animate-pulse" : ""}`} strokeWidth={1.8} />
          {translating ? "Traduciendo…" : "Auto-traducir"}
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || busy}
          data-testid={`admin-poi-info-save-${poi.uid}`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors ${
            dirty && !busy ? "bg-[#C16542] hover:bg-[#A8533A] text-white" : "bg-white/5 text-white/30 cursor-not-allowed"
          }`}
        >
          <Save className="w-3 h-3" strokeWidth={2} /> {busy ? "Guardando…" : "Guardar"}
        </button>
      </div>
      {msg && (
        <p data-testid={`admin-poi-info-msg-${poi.uid}`} className={`text-[11px] ${msg.startsWith("✗") ? "text-[#E07856]" : "text-[#7BB98A]"}`}>{msg}</p>
      )}
    </div>
  );
};

/* One editable card of a location's "Galería del lugar".
   Writes the global slots given in `slots` (${prefix}.gallery.${i}…). */
const PoiCardEditor = ({ poiKey, index, slots, defaults, imageMap, textMap, onSaveImage, onSaveText, onChanged }) => {
  const imageOverride = imageMap[slots.image]?.url;
  const titleOverride = textMap[slots.title];
  const descOverride = textMap[slots.desc];

  const initImg = imageOverride || defaults.image || "";
  const initTitle = {
    es: titleOverride?.es ?? defaults.title.es ?? "",
    en: titleOverride?.en ?? defaults.title.en ?? "",
    fr: titleOverride?.fr ?? defaults.title.fr ?? "",
  };
  const initDesc = {
    es: descOverride?.es ?? defaults.desc.es ?? "",
    en: descOverride?.en ?? defaults.desc.en ?? "",
    fr: descOverride?.fr ?? defaults.desc.fr ?? "",
  };

  const [imgUrl, setImgUrl] = useState(initImg);
  const [title, setTitle] = useState(initTitle);
  const [desc, setDesc] = useState(initDesc);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);

  const imgDirty = imgUrl !== initImg;
  const titleDirty = !triEqual(title, initTitle);
  const descDirty = !triEqual(desc, initDesc);
  const dirty = imgDirty || titleDirty || descDirty;
  const overridden = !!imageOverride || hasVals(titleOverride) || hasVals(descOverride);

  const onUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true); setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch(`${API}/slots/${encodeURIComponent(slots.image)}/upload`, { method: "POST", body: fd });
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      if (d.url) setImgUrl(d.url);
      setMsg("✓ Imagen subida.");
      onChanged && onChanged();
    } catch {
      setMsg("✗ Error al subir la imagen.");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const autoTranslate = async () => {
    setTranslating(true); setMsg("");
    try {
      const doOne = async (text) => {
        if (!text || !text.trim()) return { en: "", fr: "" };
        const r = await fetch(`${API}/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, source: "es", targets: ["en", "fr"] }),
        });
        if (!r.ok) throw new Error(String(r.status));
        const d = await r.json();
        return d.translations || {};
      };
      const [tt, td] = await Promise.all([doOne(title.es), doOne(desc.es)]);
      setTitle((v) => ({ ...v, en: tt.en || v.en, fr: tt.fr || v.fr }));
      setDesc((v) => ({ ...v, en: td.en || v.en, fr: td.fr || v.fr }));
      setMsg("✓ Traducido desde ES (revisa y guarda).");
    } catch {
      setMsg("✗ La traducción automática falló.");
    }
    setTranslating(false);
  };

  const save = async () => {
    setBusy(true); setMsg("");
    try {
      const tasks = [];
      if (imgDirty) tasks.push(onSaveImage(slots.image, imgUrl));
      if (titleDirty) tasks.push(onSaveText(slots.title, title));
      if (descDirty) tasks.push(onSaveText(slots.desc, desc));
      await Promise.all(tasks);
      setMsg("✓ Guardado y sincronizado en toda la web.");
    } catch {
      setMsg("✗ Error al guardar.");
    }
    setBusy(false);
  };

  return (
    <div data-testid={`admin-poi-card-${poiKey}-${index}`} className="bg-black/20 border border-white/10 p-3 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 flex-shrink-0 bg-black/40 overflow-hidden border border-white/10">
          {imgUrl
            ? <img src={imgUrl} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-white/30"><ImageIcon className="w-3.5 h-3.5" /></div>}
        </div>
        <p className="text-[9px] tracking-[0.24em] uppercase text-[#D4A373] flex items-center gap-2">
          Card {index + 1}
          {overridden && <span className="text-[8px] bg-[#3E7C59]/30 text-[#7BB98A] px-1.5 py-0.5">editada</span>}
        </p>
        {dirty && <span className="w-2 h-2 rounded-full bg-[#D4A373]" title="Cambios sin guardar" />}
      </div>

      {/* Imagen */}
      <div>
        <p className="text-[9px] tracking-[0.22em] uppercase text-white/45 mb-1.5">Imagen</p>
        <div className="flex gap-2">
          <input
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder="URL de la imagen (https://…)"
            data-testid={`admin-poi-image-${poiKey}-${index}`}
            className="flex-1 bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white/90 outline-none focus:border-[#D4A373]"
          />
          <button
            type="button"
            onClick={() => fileRef.current && fileRef.current.click()}
            disabled={uploading}
            data-testid={`admin-poi-upload-${poiKey}-${index}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] tracking-[0.18em] uppercase border border-white/15 text-white/70 hover:bg-white/5 disabled:opacity-40"
          >
            <UploadCloud className={`w-3.5 h-3.5 ${uploading ? "animate-pulse" : ""}`} strokeWidth={1.8} />
            {uploading ? "…" : "Subir"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
        </div>
      </div>

      {/* Título */}
      <div>
        <p className="text-[9px] tracking-[0.22em] uppercase text-white/45 mb-1.5">Título</p>
        <div className="space-y-1.5">
          {LANGS.map((l) => (
            <div key={l} className="flex items-center gap-2">
              <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 w-6">{l}</span>
              <input
                value={title[l]}
                onChange={(e) => setTitle((v) => ({ ...v, [l]: e.target.value }))}
                data-testid={`admin-poi-title-${poiKey}-${index}-${l}`}
                className="flex-1 bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white/90 outline-none focus:border-[#D4A373]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div>
        <p className="text-[9px] tracking-[0.22em] uppercase text-white/45 mb-1.5">Descripción</p>
        <div className="space-y-1.5">
          {LANGS.map((l) => (
            <div key={l} className="flex items-start gap-2">
              <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 w-6 pt-1.5">{l}</span>
              <textarea
                value={desc[l]}
                onChange={(e) => setDesc((v) => ({ ...v, [l]: e.target.value }))}
                rows={2}
                data-testid={`admin-poi-desc-${poiKey}-${index}-${l}`}
                className="flex-1 bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white/90 outline-none focus:border-[#D4A373] resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          type="button"
          onClick={autoTranslate}
          disabled={translating || !title.es}
          data-testid={`admin-poi-translate-${poiKey}-${index}`}
          title="Rellena EN y FR a partir del español"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] tracking-[0.18em] uppercase border border-white/15 text-white/70 hover:bg-white/5 disabled:opacity-40"
        >
          <Languages className={`w-3.5 h-3.5 ${translating ? "animate-pulse" : ""}`} strokeWidth={1.8} />
          {translating ? "Traduciendo…" : "Auto-traducir"}
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || busy}
          data-testid={`admin-poi-save-${poiKey}-${index}`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors ${
            dirty && !busy ? "bg-[#C16542] hover:bg-[#A8533A] text-white" : "bg-white/5 text-white/30 cursor-not-allowed"
          }`}
        >
          <Save className="w-3 h-3" strokeWidth={2} /> {busy ? "Guardando…" : "Guardar"}
        </button>
      </div>
      {msg && (
        <p data-testid={`admin-poi-msg-${poiKey}-${index}`} className={`text-[11px] ${msg.startsWith("✗") ? "text-[#E07856]" : "text-[#7BB98A]"}`}>{msg}</p>
      )}
    </div>
  );
};


/* ============================================================
   Leads panel — captured submissions from every public form.
   Sub-sections (one per form), each protected by the admin token,
   with search, refresh and CSV export for the sales team.
   Forms covered: Descargar Programa, Contacto Rápido,
   Planificación Detallada. Add a new entry to LEAD_FORMS when a
   new public form is wired to its own endpoint.
============================================================ */
const fmtLeadDate = (iso) => {
  try { return new Date(iso).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }); }
  catch { return iso || ""; }
};

const tripPlannerDates = (r) => {
  if (r.date_mode === "exact") return r.start_date || "—";
  if (r.date_mode === "flexible") return r.flexible_month || "Flexible";
  if (r.start_date || r.end_date) return `${r.start_date || "?"} → ${r.end_date || "?"}`;
  return "—";
};

const LEAD_CONTACT_PREF = { phone: "📞 Teléfono", email: "✉️ Email" };
const leadContactPref = (v) => {
  const ids = Array.isArray(v) ? v : (v ? [v] : []);
  const labels = ids.map((x) => LEAD_CONTACT_PREF[x] || x).filter(Boolean);
  return labels.length ? labels.join(", ") : "—";
};

const colValue = (col, r) => {
  if (col.email) return r.email || "";
  if (col.phone) return r.phone || "";
  return col.get ? col.get(r) : "";
};

const LEAD_FORMS = [
  {
    id: "program-downloads",
    label: "Descargar Programa",
    endpoint: "program-downloads",
    empty: "Aún no hay descargas registradas.",
    search: (r) => [r.first_name, r.last_name, r.email, r.phone, r.program_title, r.route_id],
    columns: [
      { header: "Fecha", get: (r) => fmtLeadDate(r.created_at), nowrap: true, muted: true },
      { header: "Nombre", get: (r) => `${r.first_name || ""} ${r.last_name || ""}`.trim(), nowrap: true },
      { header: "Email", email: true },
      { header: "Teléfono", phone: true },
      { header: "Programa", get: (r) => r.program_title || r.route_id || "—", truncate: true, title: (r) => `${r.program_title || ""} · ${r.route_id || ""}` },
      { header: "Newsletter", get: (r) => (r.newsletter ? "Sí" : "No"), dot: (r) => r.newsletter, center: true },
      { header: "Idioma", get: (r) => (r.language || "").toUpperCase(), small: true },
    ],
  },
  {
    id: "contact-requests",
    label: "Contacto Rápido",
    endpoint: "contact-requests",
    empty: "Aún no hay consultas registradas.",
    search: (r) => [r.full_name, r.email, r.phone, r.journey_interest, r.message, r.source_label, r.source_route_id],
    columns: [
      { header: "Fecha", get: (r) => fmtLeadDate(r.created_at), nowrap: true, muted: true },
      { header: "Nombre", get: (r) => r.full_name, nowrap: true },
      { header: "Email", email: true },
      { header: "Teléfono", phone: true },
      { header: "Viajeros", get: (r) => r.party_size || "—", nowrap: true },
      { header: "Fechas", get: (r) => r.travel_dates || "—", truncate: true },
      { header: "Estilo", get: (r) => r.journey_interest || "—", truncate: true },
      { header: "Canal pref.", get: (r) => leadContactPref(r.preferred_contact), nowrap: true },
      { header: "Mensaje", get: (r) => r.message || "—", truncate: true, title: (r) => r.message },
      { header: "Origen", get: (r) => r.source_label || r.source_route_id || r.source_path || "—", truncate: true, title: (r) => `${r.source_label || ""}\n${r.source_path || ""}` },
      { header: "Idioma", get: (r) => (r.language || "").toUpperCase(), small: true },
    ],
  },
  {
    id: "trip-planner",
    label: "Planificación Detallada",
    endpoint: "trip-planner",
    empty: "Aún no hay planificaciones registradas.",
    search: (r) => [r.full_name, r.email, r.phone, ...(r.regions || []), ...(r.activities || []), ...(r.selected_trips || [])],
    columns: [
      { header: "Fecha", get: (r) => fmtLeadDate(r.created_at), nowrap: true, muted: true },
      { header: "Nombre", get: (r) => r.full_name, nowrap: true },
      { header: "Email", email: true },
      { header: "Teléfono", phone: true },
      { header: "Viajeros", get: (r) => `${r.travellers_adults ?? "?"} ad · ${r.travellers_children ?? 0} niños`, nowrap: true },
      { header: "Fechas", get: (r) => tripPlannerDates(r), truncate: true },
      { header: "Alojamiento", get: (r) => r.accommodation || "—" },
      { header: "Regiones", get: (r) => (r.regions || []).join(", ") || "—", truncate: true, title: (r) => (r.regions || []).join(", ") },
      { header: "Actividades", get: (r) => (r.activities || []).join(", ") || "—", truncate: true, title: (r) => (r.activities || []).join(", ") },
      { header: "Canal pref.", get: (r) => leadContactPref(r.preferred_contact), nowrap: true },
      { header: "Notas", get: (r) => r.notes || "—", truncate: true, title: (r) => r.notes },
      { header: "Idioma", get: (r) => (r.language || "").toUpperCase(), small: true },
    ],
  },
];

const NotifyPanel = () => {
  const [emails, setEmails] = useState(null); // null = loading
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const tokenHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("xaluca_admin_token")}` });
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  const load = useCallback(async () => {
    setErr("");
    try {
      const r = await fetch(`${API}/admin/notify-emails`, { headers: tokenHeader() });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      setEmails(j.emails || []);
    } catch {
      setErr("No se pudo cargar la lista de destinatarios.");
      setEmails([]);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (next) => {
    setBusy(true); setErr(""); setMsg("");
    try {
      const r = await fetch(`${API}/admin/notify-emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader() },
        body: JSON.stringify({ emails: next }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      setEmails(j.emails || []);
      setMsg("Cambios guardados.");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setErr("No se pudieron guardar los cambios.");
    } finally {
      setBusy(false);
    }
  };

  const add = () => {
    const e = draft.trim();
    if (!e) return;
    if (!EMAIL_RE.test(e)) { setErr("Introduce un email válido."); return; }
    if ((emails || []).some((x) => x.toLowerCase() === e.toLowerCase())) { setErr("Ese email ya está en la lista."); return; }
    setDraft("");
    save([...(emails || []), e]);
  };
  const remove = (e) => save((emails || []).filter((x) => x !== e));

  return (
    <div data-testid="admin-notify-panel" className="p-6 md:p-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 text-[#D4A373]">
        <Mail className="w-5 h-5" strokeWidth={1.7} />
        <h2 className="text-base tracking-[0.18em] uppercase font-semibold text-white">Avisos de leads · Destinatarios</h2>
      </div>
      <p className="mt-3 text-sm text-white/60 leading-relaxed">
        Estos correos reciben un aviso cada vez que un cliente envía un formulario
        (contacto, planificador o descarga de programa). Los cambios se aplican al instante.
      </p>

      {/* Add form */}
      <div className="mt-7 flex gap-2">
        <input
          type="email"
          value={draft}
          data-testid="notify-email-input"
          onChange={(e) => { setDraft(e.target.value); setErr(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") add(); }}
          placeholder="nombre@xaluca.com"
          className="flex-1 bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-[#D4A373]"
        />
        <button
          onClick={add}
          disabled={busy || !draft.trim()}
          data-testid="notify-add-btn"
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-colors ${
            busy || !draft.trim() ? "bg-white/5 text-white/30 cursor-not-allowed" : "bg-[#C16542] hover:bg-[#A8533A] text-white"
          }`}
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Añadir
        </button>
      </div>

      {err && <p data-testid="notify-error" className="mt-3 text-xs text-[#E08A6A]">{err}</p>}
      {msg && <p data-testid="notify-msg" className="mt-3 text-xs text-[#7FB48F]">{msg}</p>}

      {/* List */}
      <ul className="mt-6 divide-y divide-white/10 border border-white/10">
        {emails === null && <li className="px-4 py-3 text-sm text-white/40">Cargando…</li>}
        {emails && emails.length === 0 && (
          <li className="px-4 py-3 text-sm text-white/40">No hay destinatarios. Añade al menos uno para recibir avisos.</li>
        )}
        {(emails || []).map((e) => (
          <li key={e} data-testid={`notify-row-${e}`} className="flex items-center justify-between gap-3 px-4 py-3 bg-white/[0.03]">
            <span className="inline-flex items-center gap-2.5 text-sm text-white/90 min-w-0">
              <Mail className="w-3.5 h-3.5 text-[#D4A373] shrink-0" strokeWidth={1.6} />
              <span className="truncate">{e}</span>
            </span>
            <button
              onClick={() => remove(e)}
              disabled={busy}
              data-testid={`notify-remove-${e}`}
              title="Quitar destinatario"
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-[#E08A6A] disabled:opacity-40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.7} /> Quitar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LeadsPanel = () => {
  const [view, setView] = useState("program-downloads");
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [confirmDel, setConfirmDel] = useState(null); // lead row pending deletion
  const [delBusy, setDelBusy] = useState(false);
  const [selected, setSelected] = useState(new Set()); // ids selected for bulk ops
  const [confirmBulk, setConfirmBulk] = useState(false);

  const cfg = LEAD_FORMS.find((f) => f.id === view);
  const rows = cache[view] || [];

  const load = useCallback(async (id) => {
    setLoading(true);
    setErr("");
    try {
      const token = localStorage.getItem("xaluca_admin_token");
      const r = await fetch(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) throw new Error(String(r.status));
      const json = await r.json();
      setCache((c) => ({ ...c, [id]: json }));
    } catch (e) {
      setErr("No se pudieron cargar los registros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { setQ(""); setSelected(new Set()); load(view); }, [view, load]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      (cfg.search(r) || []).filter(Boolean).some((v) => String(v).toLowerCase().includes(term))
    );
  }, [rows, q, cfg]);

  const exportCsv = () => {
    const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const lines = [cfg.columns.map((c) => esc(c.header)).join(",")];
    filtered.forEach((r) => {
      lines.push(cfg.columns.map((c) => esc(colValue(c, r))).join(","));
    });
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xaluca-${cfg.id}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const leadLabel = (r) => {
    if (cfg.id === "program-downloads") return `${r.first_name || ""} ${r.last_name || ""}`.trim() || r.email || r.id;
    return r.full_name || r.email || r.id;
  };

  const doDelete = async () => {
    if (!confirmDel) return;
    setDelBusy(true);
    setErr("");
    try {
      const token = localStorage.getItem("xaluca_admin_token");
      const r = await fetch(`${API}/${cfg.endpoint}/${confirmDel.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error(String(r.status));
      // Optimistically drop from the current cache
      setCache((c) => ({ ...c, [view]: (c[view] || []).filter((x) => x.id !== confirmDel.id) }));
      setSelected((s) => { const n = new Set(s); n.delete(confirmDel.id); return n; });
      setConfirmDel(null);
    } catch (e) {
      setErr("No se pudo eliminar el lead. Inténtalo de nuevo.");
    } finally {
      setDelBusy(false);
    }
  };

  /* ---- Bulk selection helpers ---- */
  const toggleOne = (id) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filteredIds = useMemo(() => filtered.map((r) => r.id), [filtered]);
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selected.has(id));
  const someSelected = filteredIds.some((id) => selected.has(id)) && !allSelected;

  const toggleAll = () =>
    setSelected((s) => {
      const n = new Set(s);
      if (allSelected) filteredIds.forEach((id) => n.delete(id));
      else filteredIds.forEach((id) => n.add(id));
      return n;
    });

  const selectedCount = filteredIds.filter((id) => selected.has(id)).length;

  const doBulkDelete = async () => {
    const ids = filteredIds.filter((id) => selected.has(id));
    if (ids.length === 0) return;
    setDelBusy(true);
    setErr("");
    try {
      const token = localStorage.getItem("xaluca_admin_token");
      const results = await Promise.allSettled(
        ids.map((id) =>
          fetch(`${API}/${cfg.endpoint}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => { if (!r.ok) throw new Error(String(r.status)); return id; })
        )
      );
      const deleted = new Set(results.filter((x) => x.status === "fulfilled").map((x) => x.value));
      const failed = results.filter((x) => x.status === "rejected").length;
      setCache((c) => ({ ...c, [view]: (c[view] || []).filter((x) => !deleted.has(x.id)) }));
      setSelected((s) => { const n = new Set(s); deleted.forEach((id) => n.delete(id)); return n; });
      setConfirmBulk(false);
      if (failed > 0) setErr(`${failed} de ${ids.length} leads no se pudieron eliminar.`);
    } catch (e) {
      setErr("No se pudieron eliminar los leads. Inténtalo de nuevo.");
    } finally {
      setDelBusy(false);
    }
  };


  return (
    <div data-testid="admin-leads" className="p-4 md:p-6 text-white">
      {/* Sub-section tabs (one per form) */}
      <div data-testid="admin-leads-tabs" className="flex flex-wrap gap-2 mb-5">
        {LEAD_FORMS.map((f) => {
          const active = view === f.id;
          const count = (cache[f.id] || []).length;
          return (
            <button
              key={f.id}
              data-testid={`admin-leads-tab-${f.id}`}
              onClick={() => setView(f.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.18em] uppercase border transition-colors ${
                active ? "bg-[#C16542] border-transparent text-white" : "border-white/15 text-white/70 hover:bg-white/5"
              }`}
            >
              {f.label}{cache[f.id] ? ` · ${count}` : ""}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div>
          <h2 className="font-serif-x text-2xl md:text-3xl flex items-center gap-2">
            <Inbox className="w-5 h-5 text-[#D4A373]" strokeWidth={1.7} /> Leads · {cfg.label}
          </h2>
          <p className="text-[11px] tracking-[0.18em] uppercase text-white/45 mt-1">
            {loading ? "Cargando…" : `${filtered.length} de ${rows.length} registros`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              data-testid="admin-leads-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar nombre, email, contenido…"
              className="bg-white/5 border border-white/15 pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#C16542] w-[260px] max-w-[60vw]"
            />
          </div>
          <button
            data-testid="admin-leads-refresh"
            onClick={() => load(view)}
            className="inline-flex items-center gap-2 px-3 py-2 text-[10px] tracking-[0.22em] uppercase border border-white/15 hover:bg-white/5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.8} /> Recargar
          </button>
          <button
            data-testid="admin-leads-export"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 px-3 py-2 text-[10px] tracking-[0.22em] uppercase bg-[#3E7C59] hover:bg-[#326449] disabled:opacity-40 disabled:cursor-not-allowed text-white"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.8} /> Exportar CSV
          </button>
        </div>
      </div>

      {err && <p data-testid="admin-leads-error" className="text-sm text-[#E07856] mb-4">{err}</p>}

      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div
          data-testid="admin-leads-bulk-bar"
          className="flex items-center justify-between gap-3 flex-wrap mb-4 px-4 py-3 bg-[#C16542]/15 border border-[#C16542]/40"
        >
          <span className="text-[11px] tracking-[0.18em] uppercase text-white/80">
            {selectedCount} {selectedCount === 1 ? "lead seleccionado" : "leads seleccionados"}
          </span>
          <div className="flex items-center gap-2">
            <button
              data-testid="admin-leads-bulk-clear"
              onClick={() => setSelected(new Set())}
              className="inline-flex items-center gap-2 px-3 py-2 text-[10px] tracking-[0.22em] uppercase border border-white/15 text-white/75 hover:bg-white/5"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.8} /> Limpiar selección
            </button>
            <button
              data-testid="admin-leads-bulk-delete"
              onClick={() => setConfirmBulk(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-[10px] tracking-[0.22em] uppercase bg-[#B23A28] hover:bg-[#9c3122] text-white"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} /> Eliminar seleccionados
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-[10px] tracking-[0.18em] uppercase text-white/55">
              <th className="font-normal px-3 py-2.5 w-10 text-center">
                <input
                  type="checkbox"
                  data-testid="admin-leads-select-all"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                  onChange={toggleAll}
                  disabled={filtered.length === 0}
                  className="w-4 h-4 accent-[#C16542] cursor-pointer disabled:opacity-40"
                  aria-label="Seleccionar todos"
                />
              </th>
              {cfg.columns.map((c) => (
                <th key={c.header} className={`font-normal px-3 py-2.5 ${c.center ? "text-center" : "text-left"}`}>{c.header}</th>
              ))}
              <th className="font-normal px-3 py-2.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} data-testid={`admin-lead-row-${r.id}`} className={`border-t border-white/8 hover:bg-white/[0.03] align-top ${selected.has(r.id) ? "bg-[#C16542]/10" : ""}`}>
                <td className="px-3 py-2.5 text-center">
                  <input
                    type="checkbox"
                    data-testid={`admin-lead-select-${r.id}`}
                    checked={selected.has(r.id)}
                    onChange={() => toggleOne(r.id)}
                    className="w-4 h-4 accent-[#C16542] cursor-pointer"
                    aria-label="Seleccionar lead"
                  />
                </td>
                {cfg.columns.map((c) => {
                  if (c.email) {
                    return (
                      <td key={c.header} className="px-3 py-2.5">
                        <a href={`mailto:${r.email}`} className="text-[#D4A373] hover:underline">{r.email}</a>
                      </td>
                    );
                  }
                  if (c.phone) {
                    return (
                      <td key={c.header} className="px-3 py-2.5 whitespace-nowrap">
                        {r.phone ? <a href={`tel:${r.phone}`} className="text-white/80 hover:text-[#D4A373]">{r.phone}</a> : <span className="text-white/40">—</span>}
                      </td>
                    );
                  }
                  if (c.dot) {
                    return (
                      <td key={c.header} className="px-3 py-2.5 text-center">
                        <span className={`inline-block w-2 h-2 rounded-full ${c.dot(r) ? "bg-[#7BB98A]" : "bg-white/20"}`} title={c.dot(r) ? "Sí" : "No"} />
                      </td>
                    );
                  }
                  const val = c.get ? c.get(r) : "";
                  const cls = [
                    "px-3 py-2.5",
                    c.nowrap ? "whitespace-nowrap" : "",
                    c.muted ? "text-white/70" : "",
                    c.small ? "uppercase text-white/55 text-[11px]" : "",
                    c.truncate ? "max-w-[220px] truncate" : "",
                    c.center ? "text-center" : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <td key={c.header} className={cls} title={c.title ? c.title(r) : undefined}>{val}</td>
                  );
                })}
                <td className="px-3 py-2.5 text-center whitespace-nowrap">
                  <button
                    data-testid={`admin-lead-delete-${r.id}`}
                    onClick={() => setConfirmDel(r)}
                    title="Eliminar lead"
                    aria-label="Eliminar lead"
                    className="inline-flex items-center justify-center p-1.5 text-white/50 hover:text-[#E07856] hover:bg-[#E07856]/10 border border-transparent hover:border-[#E07856]/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={cfg.columns.length + 2} className="px-3 py-10 text-center text-white/45">
                  {rows.length === 0 ? cfg.empty : "Sin resultados para la búsqueda."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation dialog */}
      {confirmDel && (
        <div
          data-testid="admin-lead-delete-dialog"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !delBusy && setConfirmDel(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#14110F] border border-white/15 shadow-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#E07856]/15 text-[#E07856] shrink-0">
                <AlertTriangle className="w-5 h-5" strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <h3 className="font-serif-x text-xl text-white">Eliminar lead</h3>
                <p className="text-sm text-white/65 mt-2 leading-relaxed">
                  ¿Seguro que quieres eliminar el lead de{" "}
                  <span className="text-white font-medium">{leadLabel(confirmDel)}</span>?
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                data-testid="admin-lead-delete-cancel"
                onClick={() => setConfirmDel(null)}
                disabled={delBusy}
                className="px-4 py-2 text-[11px] tracking-[0.22em] uppercase border border-white/15 text-white/75 hover:bg-white/5 disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                data-testid="admin-lead-delete-confirm"
                onClick={doDelete}
                disabled={delBusy}
                className="inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.22em] uppercase bg-[#B23A28] hover:bg-[#9c3122] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className={`w-3.5 h-3.5 ${delBusy ? "animate-pulse" : ""}`} strokeWidth={1.9} />
                {delBusy ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk delete confirmation dialog */}
      {confirmBulk && (
        <div
          data-testid="admin-leads-bulk-dialog"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !delBusy && setConfirmBulk(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#14110F] border border-white/15 shadow-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#E07856]/15 text-[#E07856] shrink-0">
                <AlertTriangle className="w-5 h-5" strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <h3 className="font-serif-x text-xl text-white">Eliminar {selectedCount} leads</h3>
                <p className="text-sm text-white/65 mt-2 leading-relaxed">
                  Vas a eliminar{" "}
                  <span className="text-white font-medium">{selectedCount} {selectedCount === 1 ? "lead" : "leads"}</span>{" "}
                  de forma permanente. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                data-testid="admin-leads-bulk-cancel"
                onClick={() => setConfirmBulk(false)}
                disabled={delBusy}
                className="px-4 py-2 text-[11px] tracking-[0.22em] uppercase border border-white/15 text-white/75 hover:bg-white/5 disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                data-testid="admin-leads-bulk-confirm"
                onClick={doBulkDelete}
                disabled={delBusy}
                className="inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.22em] uppercase bg-[#B23A28] hover:bg-[#9c3122] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className={`w-3.5 h-3.5 ${delBusy ? "animate-pulse" : ""}`} strokeWidth={1.9} />
                {delBusy ? "Eliminando…" : `Eliminar ${selectedCount}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
