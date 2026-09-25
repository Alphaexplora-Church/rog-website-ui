import type { EventItem } from '../../../shared/models/types/event'

/**
 * The pieces of an event's date the Events page lays out separately — a
 * calendar-leaf month/day/weekday, and a month heading to group by.
 *
 * Read from `isoDate` (the CMS's own YYYY-MM-DD), never re-parsed from the
 * human-readable `date` string. Formatted in UTC because a date-only value
 * has no timezone: parsing "2026-12-25" as local midnight west of UTC would
 * show the 24th.
 */
export interface EventDateParts {
  /** "Dec" */
  month: string
  /** "25" */
  day: string
  /** "Fri" */
  weekday: string
  /** "2026-12" — groups events by calendar month. */
  monthKey: string
  /** "December 2026" */
  monthLabel: string
}

export function eventDateParts(isoDate?: string): EventDateParts | null {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}/.test(isoDate)) return null
  const d = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return null

  const f = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-US', { ...o, timeZone: 'UTC' }).format(d)

  return {
    month: f({ month: 'short' }),
    day: f({ day: 'numeric' }),
    weekday: f({ weekday: 'short' }),
    monthKey: isoDate.slice(0, 7),
    monthLabel: f({ month: 'long', year: 'numeric' }),
  }
}

/** What a poster's date stamp prints: "OCT" over "4" (or "14–15"). */
export interface EventStamp {
  month: string
  day: string
  weekday?: string
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/**
 * The date stamp for a poster. `isoDate` first (see above); when an event
 * has none — sample data, or a CMS entry saved before Event Date was
 * required — the human-readable `date` ("November 14–15") is read for
 * DISPLAY ONLY, so the poster still shouts a date instead of "TBA". Nothing
 * that computes (countdown, grouping) ever uses this fallback.
 */
export function eventStamp(event: Pick<EventItem, 'isoDate' | 'date'>): EventStamp | null {
  const parts = eventDateParts(event.isoDate)
  if (parts) return { month: parts.month, day: parts.day, weekday: parts.weekday }
  const m = event.date?.match(/^([A-Za-z]{3,})\.?\s+(\d{1,2})(?:\s*[–-]\s*(\d{1,2}))?/)
  if (!m || !MONTHS.includes(m[1].slice(0, 3).toLowerCase())) return null
  const month = m[1].slice(0, 1).toUpperCase() + m[1].slice(1, 3).toLowerCase()
  return { month, day: m[3] ? `${m[2]}–${m[3]}` : m[2] }
}

export interface EventMonthGroup {
  key: string
  label: string
  events: EventItem[]
}

/**
 * Groups events by calendar month, keeping the order they arrive in (the
 * API already sorts by date, then time). Events with no usable date land
 * in one trailing "Date to be announced" group rather than being dropped.
 */
export function groupByMonth(events: EventItem[]): EventMonthGroup[] {
  const groups = new Map<string, EventMonthGroup>()
  const undated: EventItem[] = []

  for (const event of events) {
    const parts = eventDateParts(event.isoDate)
    // No isoDate: group by the month named in the display date (no year —
    // the string carries none), so the heading agrees with the poster.
    const named = parts ? null : event.date?.match(/^([A-Za-z]{3,})\.?\s+\d/)?.[1]
    const key = parts?.monthKey ?? (named && eventStamp(event) ? `m-${named.toLowerCase()}` : null)
    if (!key) {
      undated.push(event)
      continue
    }
    let group = groups.get(key)
    if (!group) {
      const label = parts?.monthLabel ?? `${named!.slice(0, 1).toUpperCase()}${named!.slice(1).toLowerCase()}`
      group = { key, label, events: [] }
      groups.set(key, group)
    }
    group.events.push(event)
  }

  const out = [...groups.values()]
  if (undated.length) out.push({ key: 'tba', label: 'Date to be announced', events: undated })
  return out
}

/**
 * When an event starts, as a UTC timestamp — or null if it has no usable
 * date. The CMS stores a wall-clock date and time with no zone; ROG meets
 * in Mandaluyong, so they are read as Philippine time (UTC+8, no daylight
 * saving), which keeps the countdown right for a visitor in any timezone.
 * No time set → counts down to the start of that day.
 */
export function eventStartMs(isoDate?: string, isoTime?: string): number | null {
  const m = isoDate?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  const t = isoTime?.match(/^(\d{2}):(\d{2})/)
  const hh = t ? Number(t[1]) : 0
  const mm = t ? Number(t[2]) : 0
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), hh - 8, mm)
}
