import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_TF_45 } from "@/lib/programs/tangerFez45";

export default function TangerFez45Page() {
  return <ProgramTemplate program={PROGRAM_TF_45} variant="ci" />;
}
