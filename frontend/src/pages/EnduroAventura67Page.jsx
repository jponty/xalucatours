import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_ENDURO_67 } from "@/lib/programs/enduroAventura67";

export default function EnduroAventura67Page() {
  return <ProgramTemplate program={PROGRAM_ENDURO_67} variant="enduro" showJourneyChronology />;
}
