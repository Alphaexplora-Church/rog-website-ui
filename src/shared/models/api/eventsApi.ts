import type { EventItem } from '../types/event'
import { strapiGetAll } from './client'
import { sampleEvents } from './eventsSample'
import { formatEventDate, formatEventTime, resolveMediaUrl, type StrapiMedia } from './normalize'

/**
 * Events from Strapi (rog-cms's `api::event.event`, live-wired 2026-09-24 —
 * see rog-cms's build log for the content-type and public-permission side).
 *
 * One request, paginated to completion: /api/events, published entries
 * only — the CMS's Publish button doing its job, same as sermons.
 *
 * `location` comes from the CMS's Event Location field (added 2026-09-25 —
 * Jude: "lagyan mo din pala ng Event Location"). Events saved before then
 * have none, so it stays optional and both the Home card and the Events
 * page render it only when present. There is still no admission-note
 * field, so `note` is always undefined on a live event.
 */

interface StrapiEvent {
  documentId: string
  slug: string
  eventName: string
  eventDate: string | null
  eventTime: string | null
  eventEndTime?: string | null
  registrationLink?: string | null
  eventLocation?: string | null
  eventDescription: string | null
  headerPhoto?: StrapiMedia | null
}

function eventsQuery(): URLSearchParams {
  const q = new URLSearchParams()
  q.set('sort[0]', 'eventDate:asc')
  q.set('sort[1]', 'eventTime:asc')
  q.set('populate[headerPhoto]', 'true')
  return q
}

function toEventItem(e: StrapiEvent): EventItem {
  return {
    slug: e.slug,
    date: formatEventDate(e.eventDate) ?? 'Date to be announced',
    isoDate: e.eventDate ?? undefined,
    time: formatEventTime(e.eventTime) ?? 'Time to be announced',
    isoTime: e.eventTime ? e.eventTime.slice(0, 5) : undefined,
    endTime: formatEventTime(e.eventEndTime),
    isoEndTime: e.eventEndTime ? e.eventEndTime.slice(0, 5) : undefined,
    registrationLink: e.registrationLink?.trim() || undefined,
    location: e.eventLocation?.trim() || undefined,
    title: e.eventName,
    blurb: e.eventDescription ?? '',
    photo: resolveMediaUrl(e.headerPhoto) ?? '',
  }
}

/** One cache entry for the whole events list. Every ViewModel that reads
 *  events uses this key, so the Home teaser and the Events page share one
 *  request — same pattern as `MEDIA_LIBRARY_QUERY_KEY`. */
export const EVENTS_QUERY_KEY = ['events'] as const

export async function fetchEvents(): Promise<EventItem[]> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') return sampleEvents

  const raw = await strapiGetAll<StrapiEvent>('events', eventsQuery())
  return raw.map(toEventItem)
}
