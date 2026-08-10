import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_TF_56 } from "@/lib/programs/tangerFez56";

export default function TangerFez56Page() {
  return <ProgramTemplate program={PROGRAM_TF_56} variant="ci" showJourneyChronology />;
}
