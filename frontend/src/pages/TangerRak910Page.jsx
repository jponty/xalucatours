import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_TRK_910 } from "@/lib/programs/tangerRak910";

export default function TangerRak910Page() {
  return <ProgramTemplate program={PROGRAM_TRK_910} variant="trk" showJourneyChronology />;
}
