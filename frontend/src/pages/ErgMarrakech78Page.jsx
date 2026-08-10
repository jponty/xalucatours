import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_EM_78 } from "@/lib/programData";

export default function ErgMarrakech78Page() {
  return <ProgramTemplate program={PROGRAM_EM_78} variant="em" showJourneyChronology />;
}
