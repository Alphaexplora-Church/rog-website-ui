import { youtubeIdFromUrl } from '../../lib/youtube'
import type { MediaLibrary, Scripture, Sermon, Series, Topic } from '../types/media'
import { strapiGetAll } from './client'
import { sampleLibrary } from './mediaSample'
import { formatSermonDate, resolveMediaUrl, type StrapiMedia } from './normalize'

/**
 * Media Library from Strapi (Doc 6 §6b step 7).
 *
 * Two requests, both paginated to completion:
 *   /api/sermons        every PUBLISHED message, newest first, with its
 *                       speaker, series, topics, scripture and files
 *   /api/sermon-series  every published series, with its cover — so a series
 *                       created before its first episode still shows (as
 *                       "coming soon")
 *
 * Topics and Scripture are NOT fetched as their own lists. They are taken
 * from the messages that use them, so the filters can only ever offer a term
 * that leads somewhere. A topic created in the CMS but not yet attached to a
 * published message simply doesn't appear yet.
 *
 * Drafts never appear: Strapi's public API returns published entries only.
 * That is the CMS's Publish button doing its job — "Save" alone is a draft.
 */

interface StrapiRef {
  slug: string
  title?: string
  name?: string
}

interface StrapiSermon {
  documentId: string
  title: string
  slug: string
  date: string | null
  category: 'sermon' | 'series' | null
  mediaType: 'youtube' | 'upload' | null
  youtubeUrl?: string | null
  youtubeVideoId?: string | null
  videoFile?: StrapiMedia | null
  thumbnail?: StrapiMedia | null
  speaker?: StrapiRef | null
  series?: StrapiRef | null
  topics?: StrapiRef[] | null
  scripture?: StrapiRef | null
}

interface StrapiSeries {
  documentId: string
  title: string
  slug: string
  coverImage?: StrapiMedia | null
}

function sermonQuery(): URLSearchParams {
  const q = new URLSearchParams()
  q.set('sort[0]', 'date:desc')
  q.set('sort[1]', 'title:asc')
  q.set('populate[speaker]', 'true')
  q.set('populate[series]', 'true')
  q.set('populate[topics]', 'true')
  q.set('populate[scripture]', 'true')
  q.set('populate[thumbnail]', 'true')
  q.set('populate[videoFile]', 'true')
  return q
}

function seriesQuery(): URLSearchParams {
  const q = new URLSearchParams()
  q.set('sort[0]', 'title:asc')
  q.set('populate[coverImage]', 'true')
  return q
}

function toSermon(s: StrapiSermon): Sermon {
  const mediaType = s.mediaType === 'upload' ? 'upload' : 'youtube'
  const category = s.category === 'series' ? 'series' : 'sermon'

  return {
    slug: s.slug,
    title: s.title,
    category,
    seriesSlug: category === 'series' ? s.series?.slug : undefined,
    mediaType,
    videoId:
      mediaType === 'youtube' ? (s.youtubeVideoId ?? youtubeIdFromUrl(s.youtubeUrl) ?? '') : '',
    videoUrl: mediaType === 'upload' ? resolveMediaUrl(s.videoFile) : undefined,
    thumbnailUrl: mediaType === 'upload' ? resolveMediaUrl(s.thumbnail) : undefined,
    speakerSlug: s.speaker?.slug,
    speakerName: s.speaker?.name,
    date: formatSermonDate(s.date),
    isoDate: s.date ?? undefined,
    topicSlugs: (s.topics ?? []).map((t) => t.slug),
    scriptureSlug: s.scripture?.slug,
  }
}

/** Unique terms, in first-seen order, from the messages that reference them. */
function collectTerms(refs: (StrapiRef | null | undefined)[]): { slug: string; title: string }[] {
  const map = new Map<string, string>()
  for (const r of refs) {
    if (r?.slug && !map.has(r.slug)) map.set(r.slug, r.title ?? r.slug)
  }
  return [...map.entries()]
    .map(([slug, title]) => ({ slug, title }))
    .sort((a, b) => a.title.localeCompare(b.title))
}

/** One cache entry for the whole library. Every ViewModel that reads media
 *  uses this key, so the Media page, Home and Watch Live share one request. */
export const MEDIA_LIBRARY_QUERY_KEY = ['media-library'] as const

export async function fetchMediaLibrary(): Promise<MediaLibrary> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') return sampleLibrary

  const [rawSermons, rawSeries] = await Promise.all([
    strapiGetAll<StrapiSermon>('sermons', sermonQuery()),
    strapiGetAll<StrapiSeries>('sermon-series', seriesQuery()),
  ])

  const sermons = rawSermons.map(toSermon)

  const episodeCount = new Map<string, number>()
  for (const s of sermons) {
    if (s.seriesSlug) episodeCount.set(s.seriesSlug, (episodeCount.get(s.seriesSlug) ?? 0) + 1)
  }

  const series: Series[] = rawSeries.map((s) => ({
    slug: s.slug,
    title: s.title,
    coverImage: resolveMediaUrl(s.coverImage),
    isPlaceholder: !episodeCount.get(s.slug),
  }))

  // An uploaded Series episode may skip its own thumbnail — it then wears
  // its series' cover image (Jude 2026-09-24: "kapag walang inupload, ang
  // default image for the series's episode is yung header image nung series
  // na yon"). Sermons-category uploads always have one; the CMS requires it.
  const coverBySlug = new Map(series.map((s) => [s.slug, s.coverImage]))
  for (const s of sermons) {
    if (s.mediaType === 'upload' && !s.thumbnailUrl && s.seriesSlug) {
      s.thumbnailUrl = coverBySlug.get(s.seriesSlug)
    }
  }

  const topics: Topic[] = collectTerms(rawSermons.flatMap((s) => s.topics ?? []))
  const scripture: Scripture[] = collectTerms(rawSermons.map((s) => s.scripture))

  return { sermons, series, topics, scripture }
}
