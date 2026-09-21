import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_ENDURO_34 } from "@/lib/programs/enduroAventura34";

export default function EnduroAventura34Page() {
  return <ProgramTemplate program={PROGRAM_ENDURO_34} variant="enduro" showJourneyChronology />;
}
