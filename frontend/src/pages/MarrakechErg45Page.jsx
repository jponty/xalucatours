import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_ME_45 } from "@/lib/programData";

export default function MarrakechErg45Page() {
  return <ProgramTemplate program={PROGRAM_ME_45} variant="me" showJourneyChronology />;
}
