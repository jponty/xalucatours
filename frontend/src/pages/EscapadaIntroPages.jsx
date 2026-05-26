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

export const EscapadaDesierto34Page = () => <ProgramTemplate program={PROGRAM_DESIERTO_34} variant="desierto" />;
export const EscapadaAtlas34Page    = () => <ProgramTemplate program={PROGRAM_ATLAS_34}    variant="atlas" />;
export const EscapadaFezPage        = () => <EscapadaIntroPage data={ESCAPADA_FEZ}         accent="#A07042" />;
export const EscapadaMarrakechPage  = () => <EscapadaIntroPage data={ESCAPADA_MARRAKECH}   accent="#D97742" />;
export const EscapadaTangerPage     = () => <EscapadaIntroPage data={ESCAPADA_TANGER}      accent="#5A7F9C" />;
