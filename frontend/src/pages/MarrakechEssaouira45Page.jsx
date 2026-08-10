import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_MES_45 } from "@/lib/programData";

export default function MarrakechEssaouira45Page() {
  return <ProgramTemplate program={PROGRAM_MES_45} variant="mes" showJourneyChronology />;
}
