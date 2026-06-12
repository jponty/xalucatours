/* ============================================================
   tripPrograms.js
   ----
   Registry mapping every trip routeId → the SAME { program, variant }
   pair that its dedicated page passes to <ProgramTemplate>.

   This is the single source of truth that lets lightweight UI (e.g.
   the trip-card "Lugares destacados" marquee) read a trip's highlights
   from EXACTLY the same data the detail page renders, guaranteeing the
   card and the page never drift apart.

   Adding a new program: add one line here mirroring the page's
   <ProgramTemplate program={...} variant="..."/> call.
============================================================ */

// Legacy programs (share variant copy from VARIANT_COPY)
import {
  PROGRAM_45, PROGRAM_56, PROGRAM_67,
  PROGRAM_AD_45, PROGRAM_AD_56, PROGRAM_AD_67,
  PROGRAM_ME_45, PROGRAM_ME_56, PROGRAM_ME_67, PROGRAM_ME_78,
  PROGRAM_EM_45, PROGRAM_EM_56, PROGRAM_EM_67, PROGRAM_EM_78,
  PROGRAM_MEM_23, PROGRAM_MEM_34, PROGRAM_MEM_45, PROGRAM_MEM_56, PROGRAM_MEM_67, PROGRAM_MEM_78,
  PROGRAM_MES_45, PROGRAM_MES_67,
  PROGRAM_FAE_56,
} from "@/lib/programData";

// Newer per-program modules (each defines its own meta.highlights)
import { PROGRAM_CI_45 } from "@/lib/programs/ciudadesImperiales45";
import { PROGRAM_CI_67 } from "@/lib/programs/ciudadesImperiales67";
import { PROGRAM_CI_RIF_67 } from "@/lib/programs/ciudadesImperialesRif67";
import { PROGRAM_CI_RIF_78 } from "@/lib/programs/ciudadesImperialesRif78";
import { PROGRAM_TF_45 } from "@/lib/programs/tangerFez45";
import { PROGRAM_TF_56 } from "@/lib/programs/tangerFez56";
import { PROGRAM_FT_56 } from "@/lib/programs/fezTanger56";
import { PROGRAM_FT_67 } from "@/lib/programs/fezTanger67";
import { PROGRAM_ENDURO_45 } from "@/lib/programs/enduroAventura45";
import { PROGRAM_ENDURO_67 } from "@/lib/programs/enduroAventura67";
import { PROGRAM_DESIERTO_34 } from "@/lib/programs/escapadaDesierto34";
import { PROGRAM_ATLAS_34 } from "@/lib/programs/escapadaAtlas34";
import { PROGRAM_ESCAPADA_FEZ_23 } from "@/lib/programs/escapadaFez23";
import { PROGRAM_ESCAPADA_FEZ_34 } from "@/lib/programs/escapadaFez34";
import { PROGRAM_ESCAPADA_FEZ_SIDIALI_34 } from "@/lib/programs/escapadaFezSidiali34";
import { PROGRAM_ESCAPADA_FEZ_SIDIALI_45 } from "@/lib/programs/escapadaFezSidiali45";
import { PROGRAM_ESCAPADA_MARRAKECH_23 } from "@/lib/programs/escapadaMarrakech23";
import { PROGRAM_ESCAPADA_RAK_AGAFAY_34 } from "@/lib/programs/escapadaRakAgafay34";
import { PROGRAM_FRM_67 } from "@/lib/programs/marrakechFez67";
import { PROGRAM_FRM_78 } from "@/lib/programs/marrakechFez78";
import { PROGRAM_FRM_89 } from "@/lib/programs/marrakechFez89";
import { PROGRAM_FRM_910 } from "@/lib/programs/marrakechFez910";
import { PROGRAM_FRZ_67 } from "@/lib/programs/fezMarrakech67";
import { PROGRAM_FRZ_78 } from "@/lib/programs/fezMarrakech78";
import { PROGRAM_FRZ_89 } from "@/lib/programs/fezMarrakech89";
import { PROGRAM_FRZ_910 } from "@/lib/programs/fezMarrakech910";
import { PROGRAM_FZS_78 } from "@/lib/programs/fezSidialiMarrakech78";
import { PROGRAM_FZS_89 } from "@/lib/programs/fezSidialiMarrakech89";
import { PROGRAM_FZS_910 } from "@/lib/programs/fezSidialiMarrakech910";
import { PROGRAM_MSF_78 } from "@/lib/programs/marrakechSidialiFez78";
import { PROGRAM_MSF_89 } from "@/lib/programs/marrakechSidialiFez89";
import { PROGRAM_MSF_910 } from "@/lib/programs/marrakechSidialiFez910";
import { PROGRAM_FOZ_56 } from "@/lib/programs/fezSidialiOuarzazate56";
import { PROGRAM_FOZ_67 } from "@/lib/programs/fezSidialiOuarzazate67";
import { PROGRAM_FOZ_78 } from "@/lib/programs/fezSidialiOuarzazate78";
import { PROGRAM_OZF_56 } from "@/lib/programs/ouarzazateSidialiFez56";
import { PROGRAM_OZF_67 } from "@/lib/programs/ouarzazateSidialiFez67";
import { PROGRAM_OZF_78 } from "@/lib/programs/ouarzazateSidialiFez78";
import { PROGRAM_TRK_89 } from "@/lib/programs/tangerRak89";
import { PROGRAM_TRK_910 } from "@/lib/programs/tangerRak910";

const P = (program, variant) => ({ program, variant });

/* routeId → { program, variant } — mirrors lib/routeComponents.js + each page. */
export const TRIP_PROGRAMS = {
  // Desierto → Atlas / Atlas → Desierto
  tourDesiertoAtlas45: P(PROGRAM_45, "da"),
  tourDesiertoAtlas56: P(PROGRAM_56, "da"),
  tourDesiertoAtlas67: P(PROGRAM_67, "da"),
  tourAtlasDesierto45: P(PROGRAM_AD_45, "ad"),
  tourAtlasDesierto56: P(PROGRAM_AD_56, "ad"),
  tourAtlasDesierto67: P(PROGRAM_AD_67, "ad"),

  // Marrakech ↔ Erg Chebbi
  tourMarrakechErg45: P(PROGRAM_ME_45, "me"),
  tourMarrakechErg56: P(PROGRAM_ME_56, "me"),
  tourMarrakechErg67: P(PROGRAM_ME_67, "me"),
  tourMarrakechErg78: P(PROGRAM_ME_78, "me"),
  tourErgMarrakech45: P(PROGRAM_EM_45, "em"),
  tourErgMarrakech56: P(PROGRAM_EM_56, "em"),
  tourErgMarrakech67: P(PROGRAM_EM_67, "em"),
  tourErgMarrakech78: P(PROGRAM_EM_78, "em"),

  // Marrakech loop
  tourMarrakechLoop23: P(PROGRAM_MEM_23, "mem"),
  tourMarrakechLoop34: P(PROGRAM_MEM_34, "mem"),
  tourMarrakechLoop45: P(PROGRAM_MEM_45, "mem"),
  tourMarrakechLoop56: P(PROGRAM_MEM_56, "mem"),
  tourMarrakechLoop67: P(PROGRAM_MEM_67, "mem"),
  tourMarrakechLoop78: P(PROGRAM_MEM_78, "mem"),
  tourEscapadaRakErgRak23: P(PROGRAM_MEM_23, "mem"),
  tourEscapadaRakErgRak34: P(PROGRAM_MEM_34, "mem"),
  tourEscapadaRakErgRak45: P(PROGRAM_MEM_45, "mem"),

  // Marrakech ↔ Essaouira
  tourMarrakechEss45: P(PROGRAM_MES_45, "mes"),
  tourMarrakechEss67: P(PROGRAM_MES_67, "mes"),

  // Fez · Atlas · Errachidia
  tourFezAtlasErr56: P(PROGRAM_FAE_56, "fae"),

  // Gran Sur · Fez → Marrakech
  tourFezRak67: P(PROGRAM_FRZ_67, "frz"),
  tourFezRak78: P(PROGRAM_FRZ_78, "frz"),
  tourFezRak89: P(PROGRAM_FRZ_89, "frz"),
  tourFezRak910: P(PROGRAM_FRZ_910, "frz"),

  // Gran Sur · Fez → Sidi Ali → Marrakech
  tourFezSidialiRak78: P(PROGRAM_FZS_78, "fzs"),
  tourFezSidialiRak89: P(PROGRAM_FZS_89, "fzs"),
  tourFezSidialiRak910: P(PROGRAM_FZS_910, "fzs"),

  // Gran Sur · Marrakech → Fez
  tourMarrakechFez67: P(PROGRAM_FRM_67, "frm"),
  tourMarrakechFez78: P(PROGRAM_FRM_78, "frm"),
  tourMarrakechFez89: P(PROGRAM_FRM_89, "frm"),
  tourMarrakechFez910: P(PROGRAM_FRM_910, "frm"),
  tourMarrakechSidialiFez78: P(PROGRAM_MSF_78, "frm"),
  tourMarrakechSidialiFez89: P(PROGRAM_MSF_89, "frm"),
  tourMarrakechSidialiFez910: P(PROGRAM_MSF_910, "frm"),

  // Fez · Sidi Ali · Ouarzazate (both directions)
  tourFezSidialiOzz56: P(PROGRAM_FOZ_56, "foz"),
  tourFezSidialiOzz67: P(PROGRAM_FOZ_67, "foz"),
  tourFezSidialiOzz78: P(PROGRAM_FOZ_78, "foz"),
  tourOzzSidialiFez56: P(PROGRAM_OZF_56, "ozf"),
  tourOzzSidialiFez67: P(PROGRAM_OZF_67, "ozf"),
  tourOzzSidialiFez78: P(PROGRAM_OZF_78, "ozf"),

  // Tánger → Marrakech
  tourTangerRak89: P(PROGRAM_TRK_89, "trk"),
  tourTangerRak910: P(PROGRAM_TRK_910, "trk"),

  // Norte · Ciudades imperiales & Tánger ↔ Fez
  tourCiudadesImperiales45: P(PROGRAM_CI_45, "ci"),
  tourCiudadesImperiales67: P(PROGRAM_CI_67, "ci"),
  tourCiudadesImperialesRif67: P(PROGRAM_CI_RIF_67, "ci"),
  tourCiudadesImperialesRif78: P(PROGRAM_CI_RIF_78, "ci"),
  tourTangerFez45: P(PROGRAM_TF_45, "ci"),
  tourTangerFez56: P(PROGRAM_TF_56, "ci"),
  tourFezTanger56: P(PROGRAM_FT_56, "ci"),
  tourFezTanger67: P(PROGRAM_FT_67, "ci"),

  // Aventura · Enduro
  tourEnduroAventura45: P(PROGRAM_ENDURO_45, "enduro"),
  tourEnduroAventura67: P(PROGRAM_ENDURO_67, "enduro"),

  // Escapadas cortas
  tourEscapadaDesierto34: P(PROGRAM_DESIERTO_34, "desierto"),
  tourEscapadaAtlas34: P(PROGRAM_ATLAS_34, "atlas"),
  tourEscapadaFez23: P(PROGRAM_ESCAPADA_FEZ_23, "fez"),
  tourEscapadaFez34: P(PROGRAM_ESCAPADA_FEZ_34, "fez"),
  tourEscapadaFezSidiali34: P(PROGRAM_ESCAPADA_FEZ_SIDIALI_34, "fez"),
  tourEscapadaFezSidiali45: P(PROGRAM_ESCAPADA_FEZ_SIDIALI_45, "fez"),
  tourEscapadaMarrakech23: P(PROGRAM_ESCAPADA_MARRAKECH_23, "rak"),
  tourEscapadaRakAgafay34: P(PROGRAM_ESCAPADA_RAK_AGAFAY_34, "raga"),
};

export const getTripProgram = (routeId) =>
  (routeId && TRIP_PROGRAMS[routeId]) || null;

export default TRIP_PROGRAMS;
