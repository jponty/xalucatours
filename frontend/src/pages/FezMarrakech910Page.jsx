import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_FRZ_910 } from "@/lib/programs/fezMarrakech910";

export default function FezMarrakech910Page() {
  return <ProgramTemplate program={PROGRAM_FRZ_910} variant="frz" showJourneyChronology />;
}
