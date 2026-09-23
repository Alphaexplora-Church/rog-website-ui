/**
 * The one list of ROG events. Read by BOTH the home teaser
 * (`features/home/views/UpcomingEventsSection.tsx`) and the Events page
 * (`features/events/views/UpcomingEventsSection.tsx`).
 *
 * CREATED 2026-09-23 on Jude's call ("make sure that the data of both Events
 * in Home tab and events tab are the same"). They were not the same, and not
 * by a little: home carried the four real ROG programmes while the Events
 * page carried three cards literally titled "Sample Event — Youth Night",
 * "Sample Event — Baptism Sunday" and "Sample Event — Church-wide Outreach".
 * Two hardcoded arrays in two files is how that happens, so there is now one
 * array in one file and neither page owns a copy. Same pattern as
 * `features/media/data/mediaData.ts`, which both Media and the home sermon
 * teaser already share.
 *
 * Soaking in the River, Women Arise Retreat, Activate12 Conference and the
 * Christmas Eve service are all real ROG programmes (see the IA handoff
 * doc). Everything scheduling-related about them is not.
 *
 * ⚠ NOTHING BELOW IS CONFIRMED SCHEDULING DATA.
 *   - DATES were the designer's layout placeholders from the Figma board.
 *     They carry no year and were never checked against ROG's calendar.
 *   - TIMES existed for only two of the four in that mockup. The other two
 *     say so rather than carrying an invented time — "Full weekend" comes
 *     from Women Arise's own blurb, and Activate12 reads "Time to be
 *     announced" because no time was ever given for it.
 *   - LOCATIONS did not exist as a field at all until this pass. Three
 *     default to the church's own venue (`site.location.venue` — River of
 *     God Center at Shangri-La Plaza), which is an assumption, not a fact.
 *     The retreat says "Venue to be announced" because a weekend retreat is
 *     the one of the four least likely to be at the main center, and
 *     guessing it would be worse than admitting it.
 *
 * Replace the whole array from the real `event` collection once Strapi is
 * live. The field shape here deliberately matches what that model returns,
 * so the swap is one file.
 */
export interface EventItem {
  /** Stable key; also the future CMS slug. */
  slug: string
  date: string
  /** Absent in the source for two of these; the UI says so rather than inventing one. */
  time: string
  location: string
  /** Admission or similar — was once jammed into the date string. */
  note?: string
  title: string
  blurb: string
  photo: string
}

export const events: EventItem[] = [
  {
    slug: 'soaking-in-the-river-october',
    date: 'October 4',
    time: '6:00 PM',
    location: 'River of God Center',
    title: 'Soaking in the River — October Gathering',
    blurb: 'A monthly gathering for the Body of Christ, prayer for the nation.',
    photo:
      'https://images.unsplash.com/photo-1760367121593-97b9a02bbd65?auto=format&fit=crop&w=700&q=80',
  },
  {
    slug: 'women-arise-retreat',
    date: 'November 14–15',
    time: 'Full weekend',
    location: 'Venue to be announced',
    title: 'Women Arise Retreat',
    blurb: 'Gathering and empowering women — full weekend schedule.',
    photo:
      'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=700&q=80',
  },
  {
    slug: 'activate12-conference',
    date: 'December 6',
    time: 'Time to be announced',
    location: 'River of God Center',
    note: 'Free admission',
    title: 'Activate12 Conference',
    blurb: 'The annual gathering on the Holy Spirit, the supernatural, and revival.',
    photo:
      'https://images.unsplash.com/photo-1740650511388-f693ce80016c?auto=format&fit=crop&w=700&q=80',
  },
  {
    slug: 'christmas-eve-candlelight',
    date: 'December 24',
    time: '6:00 PM',
    location: 'River of God Center',
    title: 'Christmas Eve Candlelight Service',
    // Was photo-1593100126453-19b562a800c1 — that URL returns nothing and
    // the card rendered an empty frame. This one is confirmed to load.
    blurb: 'A family-friendly evening of worship, carols, and candlelight.',
    photo:
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=700&q=80',
  },
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export interface EventDateParts {
  /** Three-letter month, e.g. "OCT". Empty when `date` names no month. */
  month: string
  /** Day or day range, e.g. "4" or "14–15". */
  day: string
}

/**
 * Split a `date` string into the month/day badge the calendar-tile layouts
 * want, WITHOUT storing the pieces separately.
 *
 * ADDED 2026-09-23. `EventsStrip` used to carry its own `sampleEvents`
 * array with hand-split `month: 'OCT', day: '04'` fields and three invented
 * events ("Baptism Sunday" and friends, with loremflickr photos). It reads
 * this array now like every other events surface, so there is nothing left
 * to drift — but it still wants a two-line badge, and deriving that here is
 * how it gets one without a second copy of each date.
 *
 * Returns empty parts rather than guessing if `date` is not in the
 * "<Month> <day>" shape these placeholders use; a caller should fall back
 * to printing `date` whole.
 */
export function eventDateParts(event: EventItem): EventDateParts {
  const match = /^([A-Za-z]+)\s+(.+)$/.exec(event.date.trim())
  if (!match) return { month: '', day: '' }

  const monthIndex = MONTHS.findIndex((m) => m.toLowerCase() === match[1].toLowerCase())
  if (monthIndex === -1) return { month: '', day: '' }

  return { month: MONTHS[monthIndex].slice(0, 3).toUpperCase(), day: match[2] }
}
