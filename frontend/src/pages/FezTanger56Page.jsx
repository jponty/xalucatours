import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_FT_56 } from "@/lib/programs/fezTanger56";

export default function FezTanger56Page() {
  return <ProgramTemplate program={PROGRAM_FT_56} variant="ci" showJourneyChronology />;
}
