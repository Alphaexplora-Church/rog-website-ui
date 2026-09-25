import type { EventItem } from '../types/event'

/**
 * Sample events — used ONLY when `VITE_USE_MOCKS=true` in `.env.local`. The
 * live site reads Strapi (see eventsApi.ts).
 *
 * Kept so the site can still be worked on without the CMS running, same
 * convention as `mediaSample.ts`. This is the original placeholder array
 * that lived in `features/events/data/eventsData.ts` before the Events
 * content type went live (2026-09-24) — Soaking in the River, Women Arise
 * Retreat, Activate12 Conference and the Christmas Eve service are all real
 * ROG programmes, but nothing scheduling-related about them here was ever
 * confirmed against ROG's calendar (dates were Figma layout placeholders;
 * two of the four had no time in the source; locations were an assumption
 * where not "to be announced"). Real events now come from the CMS.
 */
export const sampleEvents: EventItem[] = [
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
    blurb: 'A family-friendly evening of worship, carols, and candlelight.',
    photo:
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=700&q=80',
  },
]
