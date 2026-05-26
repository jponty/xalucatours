import React from "react";
import EscapadaIntroPage from "@/components/EscapadaIntroPage";
import {
  ESCAPADA_DESIERTO_34,
  ESCAPADA_ATLAS_34,
  ESCAPADA_FEZ,
  ESCAPADA_MARRAKECH,
  ESCAPADA_TANGER,
} from "@/lib/escapadasIntros";

export const EscapadaDesierto34Page = () => <EscapadaIntroPage data={ESCAPADA_DESIERTO_34} accent="#C16542" />;
export const EscapadaAtlas34Page    = () => <EscapadaIntroPage data={ESCAPADA_ATLAS_34}    accent="#5A6B4F" />;
export const EscapadaFezPage        = () => <EscapadaIntroPage data={ESCAPADA_FEZ}         accent="#A07042" />;
export const EscapadaMarrakechPage  = () => <EscapadaIntroPage data={ESCAPADA_MARRAKECH}   accent="#D97742" />;
export const EscapadaTangerPage     = () => <EscapadaIntroPage data={ESCAPADA_TANGER}      accent="#5A7F9C" />;
