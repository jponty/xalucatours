import React from "react";
import ProgramTemplate from "@/components/ProgramTemplate";
import { PROGRAM_FZS_89 } from "@/lib/programs/fezSidialiMarrakech89";

export default function FezSidialiMarrakech89Page() {
  return <ProgramTemplate program={PROGRAM_FZS_89} variant="fzs" />;
}
