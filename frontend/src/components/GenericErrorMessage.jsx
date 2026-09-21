import React from "react";
import { translations } from "@/lib/i18n";
import { CONTACT } from "@/lib/data";
import { contactSubmissionError } from "@/lib/contactSubmission";

export default function GenericErrorMessage({ lang = "es" }) {
  const message = translations.form_error[lang] || translations.form_error.es;
  const [before, after] = message.split(CONTACT.email);

  return (
    <span>
      {before}
      <a href={`mailto:${CONTACT.email}`} className="break-words underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
        {CONTACT.email}
      </a>
      {after}
    </span>
  );
}

// Preserve actionable server messages; structured errors need a render-safe fallback.
export function errorToastMessage(detail, lang = "es") {
  return contactSubmissionError(detail, <GenericErrorMessage lang={lang} />);
}
