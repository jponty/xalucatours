import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import EscapadaIntroPage from "@/components/EscapadaIntroPage";
import {
  ESCAPADA_FEZ,
  ESCAPADA_MARRAKECH,
  ESCAPADA_TANGER,
} from "@/lib/escapadasIntros";
import { PROGRAM_ATLAS_34 } from "@/lib/programs/escapadaAtlas34";
import { PROGRAM_DESIERTO_34 } from "@/lib/programs/escapadaDesierto34";
import { PROGRAM_ESCAPADA_FEZ_23 } from "@/lib/programs/escapadaFez23";
import { PROGRAM_ESCAPADA_FEZ_34 } from "@/lib/programs/escapadaFez34";
import { PROGRAM_ESCAPADA_FEZ_SIDIALI_34 } from "@/lib/programs/escapadaFezSidiali34";
import { PROGRAM_ESCAPADA_FEZ_SIDIALI_45 } from "@/lib/programs/escapadaFezSidiali45";
import { PROGRAM_ESCAPADA_MARRAKECH_23 } from "@/lib/programs/escapadaMarrakech23";
import { PROGRAM_ESCAPADA_RAK_AGAFAY_34 } from "@/lib/programs/escapadaRakAgafay34";

export const EscapadaDesierto34Page = () => <ProgramTemplate program={PROGRAM_DESIERTO_34} variant="desierto" showJourneyChronology />;
export const EscapadaAtlas34Page    = () => <ProgramTemplate program={PROGRAM_ATLAS_34}    variant="atlas" showJourneyChronology />;
export const EscapadaFez23Page      = () => <ProgramTemplate program={PROGRAM_ESCAPADA_FEZ_23} variant="fez" showJourneyChronology />;
export const EscapadaFez34Page      = () => <ProgramTemplate program={PROGRAM_ESCAPADA_FEZ_34} variant="fez" showJourneyChronology />;
export const EscapadaFezSidiali34Page = () => <ProgramTemplate program={PROGRAM_ESCAPADA_FEZ_SIDIALI_34} variant="fez" showJourneyChronology />;
export const EscapadaFezSidiali45Page = () => <ProgramTemplate program={PROGRAM_ESCAPADA_FEZ_SIDIALI_45} variant="fez" showJourneyChronology />;
export const EscapadaMarrakech23Page= () => <ProgramTemplate program={PROGRAM_ESCAPADA_MARRAKECH_23} variant="rak" showJourneyChronology />;
export const EscapadaRakAgafay34Page= () => <ProgramTemplate program={PROGRAM_ESCAPADA_RAK_AGAFAY_34} variant="raga" showJourneyChronology />;
export const EscapadaFezPage        = () => <EscapadaIntroPage data={ESCAPADA_FEZ}         accent="#A07042" />;
export const EscapadaMarrakechPage  = () => <EscapadaIntroPage data={ESCAPADA_MARRAKECH}   accent="#D97742" />;
export const EscapadaTangerPage     = () => <EscapadaIntroPage data={ESCAPADA_TANGER}      accent="#5A7F9C" />;
