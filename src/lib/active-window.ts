/**
 * Tiny window-based active check for time-bound content (promos, sales).
 *
 * Usage:
 *   isActiveNow({ active: true, startsAt: "2026-06-01", endsAt: "2026-09-30" })
 *
 * Rules:
 *   - active=false → false (manual override always wins)
 *   - startsAt set & today < startsAt → false (not yet)
 *   - endsAt set & today > endsAt → false (expired)
 *   - All other cases → true
 *
 * Dates are interpreted in the site's local timezone (assumed America/Toronto
 * for Montréal). Comparing date-only strings (YYYY-MM-DD) avoids timezone
 * gotchas at midnight transitions.
 */
export interface ActiveWindow {
  active?: boolean | null;
  startsAt?: string | null;
  endsAt?: string | null;
}

export function isActiveNow(w: ActiveWindow, now: Date = new Date()): boolean {
  if (w.active === false) return false;

  // Compare as YYYY-MM-DD to avoid timezone edge cases at midnight.
  // sv-SE locale gives ISO-like format: "2026-06-12"
  const todayKey = now.toLocaleDateString('sv-SE', { timeZone: 'America/Toronto' });

  const startKey = (w.startsAt ?? '').trim();
  const endKey = (w.endsAt ?? '').trim();

  if (startKey && todayKey < startKey) return false;
  if (endKey && todayKey > endKey) return false;
  return true;
}
