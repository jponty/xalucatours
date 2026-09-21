import { useRef } from "react";
import { resolvePath } from "@/lib/routes";
import { resolveTripContext } from "@/lib/tripContext";

// Keep attribution, never arbitrary query values such as email or access tokens.
export function captureContext(captureType, lang = "es") {
  const current = new URL(window.location.href);
  const source = new URL(current.pathname, current.origin);
  ["trip", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(key => {
    if (current.searchParams.has(key)) source.searchParams.set(key, current.searchParams.get(key).slice(0, 200));
  });
  const routeId = resolvePath(current.pathname)?.routeId || null;
  const tripId = current.searchParams.get("trip") || routeId;
  const trip = tripId ? resolveTripContext(tripId, lang) : null;
  return {
    capture_type: captureType === "quick_contact" && trip ? "trip_information" : captureType,
    source_url: source.href,
    source_path: source.pathname,
    source_route_id: routeId,
    source_label: document.title || null,
    related_trip_id: trip ? tripId : null,
    related_trip_title: trip?.title || null,
  };
}

// No personal data in localStorage. A mounted form reuses its UUID on retries;
// the backend fingerprints the submitted content so edits remain separate leads.
export function newSubmissionId() {
  // getRandomValues also supports browsers without crypto.randomUUID.
  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function useLeadCapture(type, lang) {
  const submissionId = useRef(null);
  return () => {
    if (!submissionId.current) submissionId.current = newSubmissionId();
    return { ...captureContext(type, lang), submission_id: submissionId.current };
  };
}
