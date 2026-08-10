import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_FRZ_78 } from "@/lib/programs/fezMarrakech78";

export default function FezMarrakech78Page() {
  return <ProgramTemplate program={PROGRAM_FRZ_78} variant="frz" showJourneyChronology />;
}
