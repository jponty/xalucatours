import { ROUTES } from "./routes";

const SUPABASE_AUDIO_BASE =
  "https://vcznwmkvphvkpkucciyw.supabase.co/storage/v1/object/public/xaluca-audioguides";

// Keeping the delivery base configurable lets us copy the same object names to
// Bunny later and switch the CDN without touching every programme page.
export const PROGRAM_AUDIO_BASE = String(
  process.env.REACT_APP_AUDIO_CDN_URL || SUPABASE_AUDIO_BASE
).replace(/\/$/, "");

// Audited against storage.objects in the xaluca-audioguides bucket.
// Only exact, confirmed matches belong here: an absent route must never fall
// back to another programme's narration.
export const AVAILABLE_PROGRAM_AUDIO_PATHS = Object.freeze([
  "/viajes/desierto_atlas/programa_4n_5d",
  "/viajes/desierto_atlas/programa_5n_6d",
  "/viajes/desierto_atlas/programa_6n_7d",
  "/viajes/atlas_desierto/programa_4n_5d",
  "/viajes/atlas_desierto/programa_5n_6d",
  "/viajes/atlas_desierto/programa_6n_7d",
  "/viajes/marrakech_ergchebbi/programa_4n_5d",
  "/viajes/marrakech_ergchebbi/programa_5n_6d",
  "/viajes/marrakech_ergchebbi/programa_6n_7d",
  "/viajes/marrakech_ergchebbi/programa_7n_8d",
  "/viajes/ergchebbi_marrakech/programa_4n_5d",
  "/viajes/ergchebbi_marrakech/programa_5n_6d",
  "/viajes/ergchebbi_marrakech/programa_6n_7d",
  "/viajes/ergchebbi_marrakech/programa_7n_8d",
  "/viajes/marrakech_ergchebbi_marrakech/programa_2n_3d",
  "/viajes/marrakech_ergchebbi_marrakech/programa_3n_4d",
  "/viajes/marrakech_ergchebbi_marrakech/programa_4n_5d",
  "/viajes/marrakech_ergchebbi_marrakech/programa_5n_6d",
  "/viajes/marrakech_ergchebbi_marrakech/programa_6n_7d",
  "/viajes/marrakech_ergchebbi_marrakech/programa_7n_8d",
  "/viajes/marrakech_essaouira/programa_6n_7d",
  "/viajes/fez-atlas-errachidia/programa_5n_6d",
  "/viajes/gransur/fez_marrakech/programa_6n_7d",
  "/viajes/gransur/fez_marrakech/programa_7n_8d",
  "/viajes/gransur/fez_marrakech/programa_8n_9d",
  "/viajes/gransur/fez_marrakech/programa_9n_10d",
  "/viajes/gransur/fez_sidiali_marrakech/programa_7n_8d",
  "/viajes/gransur/fez_sidiali_marrakech/programa_8n_9d",
  "/viajes/gransur/fez_sidiali_marrakech/programa_9n_10d",
  "/viajes/gransur/marrakech_fez/programa_6n_7d",
  "/viajes/gransur/marrakech_fez/programa_7n_8d",
  "/viajes/gransur/marrakech_fez/programa_8n_9d",
  "/viajes/gransur/marrakech_fez/programa_9n_10d",
  "/viajes/gransur/fez_sidiali_ozz/programa_6n_7d",
  "/viajes/gransur/fez_sidiali_ouarzazate/programa_7n_8d",
  "/viajes/gransur/ozz_sidiali_fez/programa_5n_6d",
  "/viajes/gransur/ozz_sidiali_fez/programa_6n_7d",
  "/viajes/gransur/ozz_sidiali_fez/programa_7n_8d",
  "/viajes/gransur/tanger-rak/programa_8n_9d",
  "/viajes/gransur/tanger-rak/programa_9n_10d",
  "/viajes/norte/ciudades_imperiales/programa_4n_5d",
  "/viajes/norte/ciudades_imperiales/programa_6n_7d",
  "/viajes/norte/ciudadesimperiales_rif/programa_6n_7d",
  "/viajes/norte/ciudadesimperiales_rif/programa_7n_8d",
  "/viajes/norte/tanger_fez/programa_4n_5d",
  "/viajes/norte/tanger_fez/programa_5n_6d",
  "/viajes/norte/fez_tanger/programa_5n_6d",
  "/viajes/norte/fez_tanger/programa_6n_7d",
  "/viajes/aventura/enduro/programa_4n_5d",
  "/viajes/aventura/enduro/programa_6n_7d",
  "/viajes/escapadas/desierto/programa_3n_4d",
  "/viajes/escapadas/atlas/programa_3n_4d",
  "/viajes/escapadas/fez/programa_2n_3d",
  "/viajes/escapadas/fez/programa_3n_4d",
  "/viajes/escapadas/fez_sidiali/programa_3n_4d",
  "/viajes/escapadas/fez_sidiali/programa_4n_5d",
  "/viajes/escapadas/marrakech/programa_2n_3d",
  "/viajes/escapadas/marrakech_agafay/programa_3n_4d",
]);

const AVAILABLE_PATHS = new Set(AVAILABLE_PROGRAM_AUDIO_PATHS);
const FILE_PREFIX = "ElevenLabs_https_xaluca-tours-web_onrender_com_";

export const programAudioFilenameForPath = (pagePath) =>
  `${FILE_PREFIX}${String(pagePath).replace(/^\//, "").replaceAll("/", "_")}.mp3`;

export const programAudioGuideForPath = (pagePath) => {
  if (!AVAILABLE_PATHS.has(pagePath)) return null;
  return `${PROGRAM_AUDIO_BASE}/${encodeURIComponent(programAudioFilenameForPath(pagePath))}`;
};

export const programAudioGuideForRoute = (routeId, lang = "es") => {
  // The currently uploaded narrations are Spanish. Do not present a Spanish
  // recording as if it were the translated EN/FR audioguide.
  if (lang !== "es") return null;
  const spanishSlug = ROUTES[routeId]?.es;
  return spanishSlug ? programAudioGuideForPath(`/${spanishSlug}`) : null;
};
