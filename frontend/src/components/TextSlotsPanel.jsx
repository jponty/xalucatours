import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search, Save, Wand2, ExternalLink, ChevronDown, ChevronRight,
  RefreshCw, Loader2, Check, AlertTriangle, Type,
} from "lucide-react";
import { describeSlot } from "@/components/SlotUsagePanel";

const API = process.env.REACT_APP_BACKEND_URL + "/api";
const LANGS = ["es", "en", "fr"];
const LANG_LABEL = { es: "ES", en: "EN", fr: "FR" };

/* ============================================================
   TextSlotsPanel — admin browser for every saved CMS text slot.
   Lists all stored text_slots grouped by page (via describeSlot),
   with full-text search across slot id + es/en/fr values, inline
   trilingual editing, ES→EN/FR autotranslate and a deep link to
   open the page. Saves through PUT /api/text_slots/{id}.
============================================================ */
export default function TextSlotsPanel() {
  const [slots, setSlots] = useState({});       // slot_id -> {es,en,fr}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [collapsed, setCollapsed] = useState({}); // pageLabel -> bool
  const [edits, setEdits] = useState({});         // slot_id -> {es,en,fr}
  const [saving, setSaving] = useState({});       // slot_id -> 'saving'|'done'|'error'
  const [translating, setTranslating] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API}/text_slots`);
      const data = await res.json();
      setSlots((data && data.slots) || {});
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const groups = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const filtered = Object.entries(slots).filter(([id, vals]) => {
      if (!ql) return true;
      if (id.toLowerCase().includes(ql)) return true;
      return LANGS.some((l) => (vals && vals[l] ? String(vals[l]).toLowerCase().includes(ql) : false));
    });
    const map = new Map();
    for (const [id, vals] of filtered) {
      const info = describeSlot(id);
      const key = info.pageLabel || "—";
      if (!map.has(key)) map.set(key, { pageLabel: key, href: info.href, items: [] });
      map.get(key).items.push({ id, vals: vals || {}, sectionLabel: info.sectionLabel, href: info.href });
    }
    const arr = Array.from(map.values());
    arr.forEach((g) => g.items.sort((a, b) => a.id.localeCompare(b.id)));
    arr.sort((a, b) => {
      if (a.pageLabel === "Inicio") return -1;
      if (b.pageLabel === "Inicio") return 1;
      return a.pageLabel.localeCompare(b.pageLabel);
    });
    return arr;
  }, [slots, q]);

  const totalCount = Object.keys(slots).length;
  const shownCount = groups.reduce((n, g) => n + g.items.length, 0);

  const getVal = (id, lang) => {
    const e = edits[id];
    if (e && lang in e) return e[lang];
    return (slots[id] && slots[id][lang]) || "";
  };
  const isDirty = (id) => {
    const e = edits[id];
    if (!e) return false;
    return LANGS.some((l) => (e[l] ?? "") !== ((slots[id] && slots[id][l]) || ""));
  };
  const setVal = (id, lang, value) =>
    setEdits((p) => ({ ...p, [id]: { ...(p[id] || {}), [lang]: value } }));

  const clearSaving = (id, delay = 1600) =>
    setTimeout(() => setSaving((p) => { const n = { ...p }; delete n[id]; return n; }), delay);

  const save = async (id) => {
    const values = {};
    LANGS.forEach((l) => {
      const v = getVal(id, l);
      if (v !== "" || (slots[id] && l in slots[id])) values[l] = v;
    });
    setSaving((p) => ({ ...p, [id]: "saving" }));
    try {
      const res = await fetch(`${API}/text_slots/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      if (!res.ok) throw new Error("save-failed");
      setSlots((p) => ({ ...p, [id]: values }));
      setEdits((p) => { const n = { ...p }; delete n[id]; return n; });
      setSaving((p) => ({ ...p, [id]: "done" }));
      clearSaving(id);
    } catch {
      setSaving((p) => ({ ...p, [id]: "error" }));
      clearSaving(id, 2600);
    }
  };

  const autotranslate = async (id) => {
    const esText = getVal(id, "es");
    if (!esText) return;
    setTranslating((p) => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`${API}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: esText, source: "es", targets: ["en", "fr"] }),
      });
      if (res.ok) {
        const data = await res.json();
        const tr = (data && data.translations) || {};
        setEdits((p) => ({
          ...p,
          [id]: {
            ...(p[id] || {}),
            es: esText,
            ...(tr.en ? { en: tr.en } : {}),
            ...(tr.fr ? { fr: tr.fr } : {}),
          },
        }));
      }
    } catch {
      /* best-effort */
    }
    setTranslating((p) => { const n = { ...p }; delete n[id]; return n; });
  };

  return (
    <div data-testid="admin-texts-panel" className="p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <h2 className="inline-flex items-center gap-2 text-lg font-serif-x">
          <Type className="w-5 h-5 text-[#D4A373]" strokeWidth={1.7} /> Textos editables
        </h2>
        <span data-testid="admin-texts-count" className="text-[10px] tracking-[0.18em] uppercase text-white/50">
          {q ? `${shownCount} / ${totalCount}` : `${totalCount}`} textos
        </span>
        <button
          type="button"
          onClick={load}
          data-testid="admin-texts-refresh"
          title="Recargar"
          className="ml-auto inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase border border-white/15 px-3 py-2 hover:bg-white/5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.8} /> Recargar
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" strokeWidth={1.8} />
        <input
          data-testid="admin-texts-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por texto o por id de slot (es/en/fr)…"
          className="w-full bg-[#14110F] border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#C16542]"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.8} /> Cargando textos…
        </div>
      ) : error ? (
        <p className="text-sm text-[#E07856]">No se pudieron cargar los textos.</p>
      ) : shownCount === 0 ? (
        <p data-testid="admin-texts-empty" className="text-sm text-white/55">
          {q ? "Ningún texto coincide con la búsqueda." : "Aún no hay textos guardados en este entorno."}
        </p>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {groups.map((g) => {
            const isOpen = !collapsed[g.pageLabel];
            return (
              <section key={g.pageLabel} data-testid={`admin-texts-group-${g.pageLabel}`} className="border border-white/10 bg-[#14110F]">
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => ({ ...c, [g.pageLabel]: !c[g.pageLabel] }))}
                  data-testid={`admin-texts-group-toggle-${g.pageLabel}`}
                  className="w-full flex items-center gap-2 px-4 py-3 border-b border-white/10 hover:bg-white/[0.03]"
                >
                  {isOpen ? <ChevronDown className="w-4 h-4 text-[#D4A373]" /> : <ChevronRight className="w-4 h-4 text-white/50" />}
                  <span className="text-[11px] tracking-[0.24em] uppercase text-[#D4A373] font-semibold">{g.pageLabel}</span>
                  <span className="text-[10px] text-white/40">{g.items.length}</span>
                  {g.href && (
                    <a
                      href={g.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="ml-auto inline-flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase text-white/50 hover:text-[#C16542]"
                    >
                      Ver <ExternalLink className="w-3 h-3" strokeWidth={1.9} />
                    </a>
                  )}
                </button>

                {isOpen && (
                  <ul className="divide-y divide-white/8">
                    {g.items.map((it) => {
                      const dirty = isDirty(it.id);
                      const st = saving[it.id];
                      return (
                        <li key={it.id} data-testid={`admin-text-slot-${it.id}`} className="px-4 py-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0">
                              {it.sectionLabel && (
                                <p className="text-[12px] text-white/80 truncate">{it.sectionLabel}</p>
                              )}
                              <p className="font-mono text-[10px] text-white/35 break-all">{it.id}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => autotranslate(it.id)}
                                disabled={translating[it.id] || !getVal(it.id, "es")}
                                data-testid={`admin-text-translate-${it.id}`}
                                title="Traducir ES → EN/FR"
                                className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase border border-white/15 px-2.5 py-1.5 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                {translating[it.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" strokeWidth={1.8} />}
                                EN·FR
                              </button>
                              <button
                                type="button"
                                onClick={() => save(it.id)}
                                disabled={!dirty || st === "saving"}
                                data-testid={`admin-text-save-${it.id}`}
                                className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 transition-colors ${
                                  dirty ? "bg-[#C16542] hover:bg-[#A35133] text-white" : "border border-white/15 text-white/40"
                                }`}
                              >
                                {st === "saving" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                                 st === "done" ? <Check className="w-3.5 h-3.5" strokeWidth={2.2} /> :
                                 st === "error" ? <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} /> :
                                 <Save className="w-3.5 h-3.5" strokeWidth={1.8} />}
                                {st === "done" ? "Guardado" : st === "error" ? "Error" : "Guardar"}
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {LANGS.map((l) => (
                              <label key={l} className="block">
                                <span className="block text-[9px] tracking-[0.24em] uppercase text-white/40 mb-1">{LANG_LABEL[l]}</span>
                                <textarea
                                  data-testid={`admin-text-input-${it.id}-${l}`}
                                  value={getVal(it.id, l)}
                                  onChange={(e) => setVal(it.id, l, e.target.value)}
                                  rows={2}
                                  className="w-full bg-[#0F0D0B] border border-white/15 px-3 py-2 text-[13px] text-white/90 leading-relaxed focus:outline-none focus:border-[#C16542] resize-y"
                                />
                              </label>
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
