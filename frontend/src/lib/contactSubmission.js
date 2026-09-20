export const DEFAULT_CONTACT_PREFERENCE = ["email", "phone"];

export function contactPrefLabel(value, lang = "es") {
  const methods = Array.isArray(value) ? value : [value];
  const labels = {
    es: ["Email + Teléfono", "Solamente Email", "Teléfono / WhatsApp"],
    en: ["Email + Phone", "Email only", "Phone / WhatsApp"],
    fr: ["E-mail + Téléphone", "E-mail uniquement", "Téléphone / WhatsApp"],
  }[lang] || ["Email + Teléfono", "Solamente Email", "Teléfono / WhatsApp"];
  return methods.includes("email") ? labels[methods.includes("phone") ? 0 : 1] : methods.includes("phone") ? labels[2] : "";
}

// Contact details are entered once. Preference only tells the team which
// channel to use; both primary fields are required regardless of preference.
export function contactSubmissionFields({ email, phone, preferred_contact = DEFAULT_CONTACT_PREFERENCE }) {
  return {
    email: email.trim(),
    phone: phone.trim(),
    preferred_contact,
  };
}

// FastAPI validation details can be arrays of objects, which React cannot
// render as toast content. Keep a localized fallback for non-string details.
export const contactSubmissionError = (detail, fallback) => typeof detail === "string" && detail.trim() ? detail : fallback;
