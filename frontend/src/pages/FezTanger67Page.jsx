import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_FT_67 } from "@/lib/programs/fezTanger67";

export default function FezTanger67Page() {
  return <ProgramTemplate program={PROGRAM_FT_67} variant="ci" showJourneyChronology />;
}
