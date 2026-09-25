/**
 * An event, as views on the site consume it — views never see Strapi's own
 * field layout (Doc 5 §4.3), same convention as `types/media.ts`.
 *
 * LIVE-WIRED 2026-09-24. Was `EventItem` in `features/events/data/eventsData.ts`
 * (a hand-written placeholder array); the shape moved here, to the Model
 * layer, when the Events content type went live. `location` and `note` are
 * optional because the CMS's Event model (rog-cms, 2026-09-24) has no
 * location or admission-note field — Jude's five fields were Event Name,
 * Event Date, Event Time, Event Description and Header Photo only. `EventCard`
 * renders both conditionally rather than inventing placeholder text for
 * them.
 */
export interface EventItem {
  /** Stable key — the CMS documentId's slug. */
  slug: string
  /** Human-readable, e.g. "December 25, 2026". */
  date: string
  /** ISO YYYY-MM-DD, for anything that needs to sort or compare dates. */
  isoDate?: string
  /** Human-readable, e.g. "2:30 PM". */
  time: string
  /** 24-hour HH:mm, for anything that needs the real clock time (the
   *  Events page's countdown). Absent when the CMS has no time set. */
  isoTime?: string
  /** From the CMS's Event Location field (2026-09-25). Optional: events
   *  saved before the field existed have none. */
  location?: string
  /** Admission or similar. */
  note?: string
  title: string
  blurb: string
  photo: string
}
