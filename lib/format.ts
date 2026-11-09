import type { ISODate, ISODateTime } from "@/lib/mock/types";

const LOCALE = "en-GB";

/** Parses a calendar date ("2026-03-14") as local midnight. */
export function parseCalendarDate(value: ISODate): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

const dateFormatters = {
  short: new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
  long: new Intl.DateTimeFormat(LOCALE, { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
};

/**
 * "14 Mar 2026". Accepts calendar dates and date-times.
 * Values are normalised to a YYYY-MM-DD key first so both kinds format identically.
 */
export function formatDate(value: ISODate | ISODateTime, style: keyof typeof dateFormatters = "short"): string {
  const key = parseCalendarDate(value).toISOString().slice(0, 10);
  return dateFormatters[style].format(new Date(`${key}T00:00:00Z`));
}

/** "Today", "Yesterday", "3 days ago", or a short date for anything older than a week. */
export function formatRelative(value: ISODateTime, now: Date = new Date()): string {
  const then = new Date(value);
  const diffMs = now.getTime() - then.getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(value);
}

export function formatCount(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
