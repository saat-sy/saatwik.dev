const short = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
const long = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/** "Oct 9, 2026" from an ISO date. */
export function formatDate(iso: string) {
  return short.format(new Date(iso));
}

/** "October 9, 2026" from an ISO date. */
export function formatDateLong(iso: string) {
  return long.format(new Date(iso));
}
