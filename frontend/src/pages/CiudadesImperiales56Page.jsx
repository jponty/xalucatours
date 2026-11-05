import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_CI_56 } from "@/lib/programs/ciudadesImperiales56";

export default function CiudadesImperiales56Page() {
  return <ProgramTemplate program={PROGRAM_CI_56} variant="ci" showJourneyChronology />;
}
