import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_MEM_45 } from "@/lib/programData";

export default function MarrakechLoop45Page() {
  return <ProgramTemplate program={PROGRAM_MEM_45} variant="mem" showJourneyChronology />;
}
