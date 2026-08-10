import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_MSF_910 } from "@/lib/programs/marrakechSidialiFez910";

export default function MarrakechSidialiFez910Page() {
  return <ProgramTemplate program={PROGRAM_MSF_910} variant="msf" showJourneyChronology />;
}
