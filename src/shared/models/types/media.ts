/**
 * Media Library types — the shape every view renders, regardless of where
 * the data came from (Strapi, or the sample set behind VITE_USE_MOCKS).
 *
 * Model layer (Doc 5 §4.3): no React, no fetching. `shared/models/api/
 * mediaApi.ts` converts Strapi's response INTO these shapes, so views never
 * see Strapi's own field layout.
 *
 * Mirrors rog-cms's Sermon / Series / Speaker / Topic / Scripture content
 * types as agreed with Jude on 2026-09-23 (see the project doc "CMS Content
 * Model Build Log").
 */

export type MediaCategory = 'sermon' | 'series'

/** The Media Library's Category filter adds 'all' on top of the two real
 *  categories. 'all' is a view, never a value a message can have. */
export type CategoryFilter = MediaCategory | 'all'

export type MediaType = 'youtube' | 'upload'

export interface Sermon {
  slug: string
  title: string
  category: MediaCategory
  /** Set only when `category` is 'series' — which named series it belongs to. */
  seriesSlug?: string

  /** 'youtube' → `videoId` is set and the thumbnail comes from YouTube.
   *  'upload'  → `videoUrl` (the MP4) and `thumbnailUrl` are set. */
  mediaType: MediaType
  /** YouTube's 11-character id. Empty string for uploads. */
  videoId: string
  /** Absolute URL of an uploaded video file. */
  videoUrl?: string
  /** Absolute URL of an uploaded thumbnail. */
  thumbnailUrl?: string

  /** Optional (Jude, 2026-09-23: "kapag walang speaker, wag mo na lagyan").
   *  When absent nothing speaker-related renders, and the message is left
   *  out of the Speakers tab. */
  speakerSlug?: string
  speakerName?: string

  /** Display date, e.g. "Mar 10, 2024" — or 'Date pending' in sample data. */
  date?: string
  /** `YYYY-MM-DD`, for sorting. Always present for CMS data. */
  isoDate?: string
  /** Sample data only: `date` is a placeholder, style it as one. */
  dateIsPlaceholder?: boolean
  /** Sample data only: `videoId` is a stand-in, show the generic thumbnail. */
  videoIsPlaceholder?: boolean

  topicSlugs: string[]
  scriptureSlug?: string
}

export interface Series {
  slug: string
  title: string
  /** True when the series has no published episodes yet — shown as a
   *  "coming soon" card rather than a link to an empty page. */
  isPlaceholder?: boolean
  /** The series' own cover/header graphic (uploaded when the series is
   *  created in the CMS). Absolute URL or bundled asset. */
  coverImage?: string
}

export interface Topic {
  slug: string
  title: string
  isPlaceholder?: boolean
}

export interface Scripture {
  slug: string
  title: string
  isPlaceholder?: boolean
}

/** Everything the Media Library needs, fetched in one go. */
export interface MediaLibrary {
  sermons: Sermon[]
  series: Series[]
  topics: Topic[]
  scripture: Scripture[]
}

export interface SpeakerSummary {
  slug: string
  name: string
  count: number
}
