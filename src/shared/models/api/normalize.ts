import { STRAPI_URL } from './client'

/**
 * Converters for values Strapi hands back in a shape the site can't use
 * directly (Doc 5 §4.3 — "fixed once, not per-domain").
 */

export interface StrapiMedia {
  url: string
  mime?: string
  alternativeText?: string | null
}

/**
 * Absolute URL for an uploaded file.
 *
 * The local upload provider (dev, SQLite) returns a path like
 * `/uploads/cover_1a2b.jpg`, relative to the CMS — not to the website, which
 * runs on a different port. Cloud Storage (production) returns a full URL.
 * Both work here.
 *
 * Accepts a single media object or an array (the POC bug: a field later
 * switched to "multiple" broke every image until this handled both).
 */
export function resolveMediaUrl(
  media: StrapiMedia | StrapiMedia[] | null | undefined,
): string | undefined {
  const m = Array.isArray(media) ? media[0] : media
  if (!m?.url) return undefined
  return /^https?:\/\//i.test(m.url) ? m.url : `${STRAPI_URL}${m.url}`
}

/**
 * "Mar 10, 2024" from Strapi's `YYYY-MM-DD`. Formatted in UTC on purpose: a
 * date field has no time, and letting the browser apply its own timezone can
 * shift it to the previous day for anyone west of UTC.
 */
export function formatSermonDate(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * "December 25, 2026" from Strapi's `YYYY-MM-DD` — full month name (the
 * Events cards read wider than the Media Library's abbreviated badges), in
 * UTC for the same reason as `formatSermonDate`: a date field has no time,
 * so letting the browser apply its own timezone can shift it a day early
 * for anyone west of UTC.
 */
export function formatEventDate(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

/**
 * "2:30 PM" from Strapi's `time` field (`HH:mm:ss.SSS`, always UTC-less —
 * it's a wall-clock time, not an instant, so this parses the hour/minute
 * directly rather than going through `Date` and risking a timezone shift).
 */
export function formatEventTime(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined
  const m = iso.match(/^(\d{2}):(\d{2})/)
  if (!m) return undefined
  const d = new Date(2000, 0, 1, Number(m[1]), Number(m[2]))
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
