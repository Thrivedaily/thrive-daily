/** Local calendar date as YYYY-MM-DD */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function msUntilMidnight(from = new Date()): number {
  const next = new Date(from);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - from.getTime();
}

export function isYesterday(dateKey: string, relativeTo = new Date()): boolean {
  const d = new Date(relativeTo);
  d.setDate(d.getDate() - 1);
  return dateKey === todayKey(d);
}

/** Parse YYYY-MM-DD as local calendar date */
export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Whole calendar days from a → b (can be negative) */
export function daysBetween(fromKey: string, toKey: string): number {
  const a = parseDateKey(fromKey);
  const b = parseDateKey(toKey);
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / 86400000);
}

/** True if `nextKey` is exactly one calendar day after `prevKey` */
export function isNextCalendarDay(prevKey: string, nextKey: string): boolean {
  return daysBetween(prevKey, nextKey) === 1;
}

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Winding down";
}
