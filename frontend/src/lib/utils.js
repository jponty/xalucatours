import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const parseIsoDay = (value) => {
  const parts = String(value || "").split("-");
  if (parts.length !== 3 || parts[0].length !== 4 || parts[1].length !== 2 || parts[2].length !== 2) return null;
  if (parts.some((part) => !/^[0-9]+$/.test(part))) return null;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== year
    || parsed.getUTCMonth() !== month - 1
    || parsed.getUTCDate() !== day
  ) return null;
  return timestamp;
};

export function calculateInclusiveTripDays(startDate, endDate) {
  const start = parseIsoDay(startDate);
  const end = parseIsoDay(endDate);
  if (start === null || end === null || end < start) return null;
  return Math.floor((end - start) / 86400000) + 1;
}
