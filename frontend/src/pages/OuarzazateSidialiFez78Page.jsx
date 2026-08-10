import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_OZF_78 } from "@/lib/programs/ouarzazateSidialiFez78";

export default function OuarzazateSidialiFez78Page() {
  return <ProgramTemplate program={PROGRAM_OZF_78} variant="ozf" showJourneyChronology />;
}
