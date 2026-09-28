import type { AgeMinistry, BodyMinistry, MinistriesContent, ServiceMinistry } from '../types/ministry'
import { strapiGetAll } from './client'
import { EXTRA_TINTS, fallbackMinistries, lookup } from './ministriesFallback'
import { resolveMediaUrl, type StrapiMedia } from './normalize'

/**
 * Ministries from Strapi (rog-cms's `api::ministry.ministry`, 2026-09-28 —
 * Jude: "gawin mo na rin yung CMS ng Ministries tab"). Edited in the admin
 * under Manage Contents → Ministries.
 *
 * One request, published entries only, in the order they were created —
 * which is the order the page shows them (the seed created the original 20
 * in website order; a new one joins the end of its section).
 *
 * `ministryType` sorts each row into its section:
 *   ages    → Ages of the River panels     (name, ages, description, cover)
 *   service → Service Ministries rows      (+ quote, contact, hashtags)
 *   body    → Body of Christ entries       (title, subtitle, description)
 *
 * Two things the CMS doesn't carry are filled in here, by matching the
 * name against the bundled list (ministriesFallback.ts):
 *   · a picture, while an entry has no Cover Photo uploaded yet
 *   · a Service ministry's one-line blurb and hue; a ministry that isn't in
 *     the bundled list gets its description's first sentence as the blurb
 *     and a hue from EXTRA_TINTS
 */

interface StrapiMinistry {
  documentId: string
  slug: string
  ministryType: 'ages' | 'service' | 'body'
  name: string
  ages?: string | null
  subtitle?: string | null
  description?: string | null
  quote?: string | null
  contactName?: string | null
  contactNumber?: string | null
  hashtags?: string | null
  coverPhoto?: StrapiMedia | null
}

function ministriesQuery(): URLSearchParams {
  const q = new URLSearchParams()
  q.set('sort[0]', 'createdAt:asc')
  q.set('populate[coverPhoto]', 'true')
  return q
}

/** "Ages 3–12" for a range; a phrase ("Married couples") as it is. */
export function agesLabel(ages: string | null | undefined): string {
  const v = (ages ?? '').trim()
  if (!v) return ''
  return /\d/.test(v) ? `Ages ${v}` : v
}

/** First sentence, kept to one line's worth. */
function firstSentence(text: string): string {
  const s = text.trim().split(/(?<=[.!?])\s/)[0] ?? ''
  if (s.length <= 90) return s
  const cut = s.slice(0, 88)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

function toAges(m: StrapiMinistry): AgeMinistry {
  return {
    slug: m.slug,
    title: m.name,
    ageLabel: agesLabel(m.ages),
    body: m.description ?? '',
    photo: resolveMediaUrl(m.coverPhoto) ?? lookup.ages(m.name)?.photo,
  }
}

function toService(m: StrapiMinistry, i: number): ServiceMinistry {
  const known = lookup.service(m.name)
  const description = m.description ?? ''
  return {
    slug: m.slug,
    title: m.name,
    blurb: known?.blurb ?? firstSentence(description),
    description,
    tagline: m.quote ?? '',
    contactName: m.contactName ?? '',
    contactPhone: m.contactNumber?.trim() || undefined,
    hashtag: m.hashtags ?? '',
    image: resolveMediaUrl(m.coverPhoto) ?? known?.image,
    tint: known?.tint ?? EXTRA_TINTS[i % EXTRA_TINTS.length],
  }
}

function toBody(m: StrapiMinistry): BodyMinistry {
  return {
    slug: m.slug,
    title: m.name,
    teaser: m.subtitle ?? '',
    body: m.description ?? '',
    photo: resolveMediaUrl(m.coverPhoto) ?? lookup.body(m.name)?.photo,
  }
}

export const MINISTRIES_QUERY_KEY = ['ministries'] as const

export async function fetchMinistries(): Promise<MinistriesContent> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') return fallbackMinistries

  let raw: StrapiMinistry[]
  try {
    raw = await strapiGetAll<StrapiMinistry>('ministries', ministriesQuery())
  } catch (e) {
    // This page used to be fully bundled; it shouldn't go blank because the
    // CMS is down. Show the bundled copy and say why in the console.
    console.warn('[CMS] Ministries fell back to the bundled copy:', e instanceof Error ? e.message : e)
    return fallbackMinistries
  }

  const service = raw.filter((m) => m.ministryType === 'service')
  return {
    ages: raw.filter((m) => m.ministryType === 'ages').map(toAges),
    service: service.map(toService),
    body: raw.filter((m) => m.ministryType === 'body').map(toBody),
  }
}
