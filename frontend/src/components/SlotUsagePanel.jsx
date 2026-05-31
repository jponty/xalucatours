import React, { useEffect, useState } from "react";
import { Eye, ExternalLink, MapPin, Loader2 } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

/* =========================================================
   Slot → human-readable page/section mapping
   ---------------------------------------------------------
   Slot ids come in two shapes:
   1. Page-namespaced (via useSlotId): the head segment IS the
      page path, e.g. "viajes/gransur/fez-rak.hub.xxx.program.fr-6-7".
   2. Section-prefixed literals, e.g. "home.hero.1",
      "surdemarruecos.hero.image".
========================================================= */
const SLOT_PREFIX_TO_PATH = {
  home: "/",
  surdemarruecos: "/viajes/surdemarruecos",
  nortedemarruecos: "/viajes/nortedemarruecos",
  marruecos: "/marruecos",
  escapadas: "/viajes/escapadas",
  aventura: "/viajes/aventura",
  "aventura-enduro": "/viajes/aventura/enduro",
  viajes: "/viajes",
  contact: "/contacto",
  citaprevia: "/citaprevia",
  equipo: "/equipo",
  quehacemos: "/quehacemos",
  incentivos: "/incentivos",
  "que-ver-en-marruecos": "/que-ver-en-Marruecos",
  "when-travel": "/cuando-viajar",
  "proximas-salidas": "/proximas_salidas",
  juego: "/juego",
  "findeano-2026": "/findeano2025",
  findeano2025: "/findeano2025",
};
const PAGE_LABELS = {
  home: "Inicio",
  surdemarruecos: "Sur de Marruecos",
  nortedemarruecos: "Norte de Marruecos",
  marruecos: "Marruecos",
  escapadas: "Escapadas",
  aventura: "Aventura",
  "aventura-enduro": "Aventura · Enduro",
  viajes: "Viajes",
  contact: "Contacto",
  citaprevia: "Cita previa",
  equipo: "Equipo",
  quehacemos: "Qué hacemos",
  incentivos: "Incentivos",
  "que-ver-en-marruecos": "Qué ver en Marruecos",
  "when-travel": "Cuándo viajar",
  "proximas-salidas": "Próximas salidas",
  juego: "Juego",
  "findeano-2026": "Fin de Año 2026",
  findeano2025: "Fin de Año",
};
const prettify = (seg) =>
  String(seg || "")
    .replace(/[/_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Map a CMS slot_id to { href, pageLabel, sectionLabel }. */
export function describeSlot(slotId) {
  if (!slotId) return { href: null, pageLabel: "—", sectionLabel: "" };
  const dot = slotId.indexOf(".");
  const head = dot === -1 ? slotId : slotId.slice(0, dot);
  const rest = dot === -1 ? "" : slotId.slice(dot + 1);
  let href = null;
  let pageLabel;
  if (head.includes("/")) {
    href = "/" + head.replace(/^\/+/, "");
    const tail = head.split("/").filter(Boolean).pop();
    pageLabel = prettify(tail);
  } else {
    href = SLOT_PREFIX_TO_PATH[head] || null;
    pageLabel = PAGE_LABELS[head] || prettify(head);
  }
  const sectionLabel = rest ? rest.split(".").map(prettify).join(" › ") : "";
  return { href, pageLabel, sectionLabel };
}

/* ============================================================
   SlotUsagePanel — "Dónde se usa esta imagen"
   Fetches /api/slots/{slotId}/usage and lists every page/section
   that renders the same image, with deep links (open in new tab
   so in-editor drafts aren't lost). `compact` tightens spacing
   for the slide-in EditModal.
============================================================ */
export default function SlotUsagePanel({ slotId, compact = false }) {
  const [state, setState] = useState({ loading: true, count: 0, slots: [], error: false });

  useEffect(() => {
    if (!slotId) return undefined;
    let cancelled = false;
    setState({ loading: true, count: 0, slots: [], error: false });
    (async () => {
      try {
        const res = await fetch(`${API}/api/slots/${encodeURIComponent(slotId)}/usage`);
        const data = await res.json();
        if (!cancelled) {
          setState({ loading: false, count: data.count || 0, slots: data.slots || [], error: false });
        }
      } catch (err) {
        console.debug(`[usage] fetch failed for ${slotId}:`, err);
        if (!cancelled) setState({ loading: false, count: 0, slots: [], error: true });
      }
    })();
    return () => { cancelled = true; };
  }, [slotId]);

  const { loading, count, slots, error } = state;
  const others = count > 1;

  return (
    <div
      data-testid="slot-usage-panel"
      className="border border-[#2C2621]/12 bg-[#F8F2E6]/60"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#2C2621]/10">
        <Eye className="w-3.5 h-3.5 text-[#C16542]" strokeWidth={1.9} />
        <span className="text-[10px] tracking-[0.28em] uppercase text-[#5C5248]">
          Dónde se usa esta imagen
        </span>
        {!loading && !error && (
          <span
            data-testid="slot-usage-count"
            className={`ml-auto text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 ${
              count > 0 ? "bg-[#C16542]/12 text-[#A35133]" : "bg-[#2C2621]/8 text-[#5C5248]"
            }`}
          >
            {count === 0 ? "Sin usar" : `${count} ${count === 1 ? "ubicación" : "ubicaciones"}`}
          </span>
        )}
      </div>

      <div className={compact ? "px-4 py-2.5" : "px-4 py-3"}>
        {loading ? (
          <div className="flex items-center gap-2 text-[12px] text-[#5C5248]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.8} />
            Buscando usos…
          </div>
        ) : error ? (
          <p className="text-[12px] text-[#A35133]">No se pudo cargar el uso de la imagen.</p>
        ) : count === 0 ? (
          <p className="text-[12px] text-[#5C5248]">
            Aún no hay ninguna imagen guardada en este espacio, o no se usa en ninguna otra parte.
          </p>
        ) : (
          <>
            {!others ? (
              <p className="text-[12px] text-[#5C5248] mb-2">
                Esta imagen solo se usa aquí. Cambiarla no afectará a otras páginas.
              </p>
            ) : (
              <p className="text-[12px] text-[#A35133] mb-2">
                Atención: esta misma imagen se usa en {count} ubicaciones. Si la cambias aquí, las
                demás seguirán mostrando la versión anterior (cada espacio es independiente).
              </p>
            )}
            <ul className={compact ? "space-y-1 max-h-52 overflow-y-auto" : "space-y-1.5"}>
              {slots.map((s) => {
                const info = describeSlot(s.slot_id);
                return (
                  <li
                    key={s.slot_id}
                    data-testid={`slot-usage-slot-${s.slot_id.slice(0, 40)}`}
                    className={`flex items-start gap-2 px-2.5 py-2 ${
                      s.is_current
                        ? "bg-[#C16542]/8 border border-[#C16542]/25"
                        : "bg-white border border-[#2C2621]/8"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C16542]" strokeWidth={1.8} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[12.5px] font-medium text-[#2C2621]">
                          {info.pageLabel}
                        </span>
                        {s.is_current && (
                          <span className="text-[9px] tracking-[0.2em] uppercase bg-[#C16542] text-[#FDFBF7] px-1.5 py-0.5">
                            Aquí
                          </span>
                        )}
                      </div>
                      {info.sectionLabel && (
                        <p className="text-[11px] text-[#5C5248] truncate">{info.sectionLabel}</p>
                      )}
                      <p className="font-mono text-[10px] text-[#9C8E78] break-all">{s.slot_id}</p>
                    </div>
                    {info.href && (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`slot-usage-link-${s.slot_id.slice(0, 40)}`}
                        title="Abrir la página en una pestaña nueva"
                        className="inline-flex items-center gap-1 shrink-0 text-[10px] tracking-[0.18em] uppercase text-[#5C5248] hover:text-[#C16542] transition-colors"
                      >
                        Ver
                        <ExternalLink className="w-3 h-3" strokeWidth={1.9} />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
