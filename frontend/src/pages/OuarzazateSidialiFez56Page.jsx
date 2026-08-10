import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_OZF_56 } from "@/lib/programs/ouarzazateSidialiFez56";

export default function OuarzazateSidialiFez56Page() {
  return <ProgramTemplate program={PROGRAM_OZF_56} variant="ozf" showJourneyChronology />;
}
