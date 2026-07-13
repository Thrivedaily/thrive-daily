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

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Winding down";
}
