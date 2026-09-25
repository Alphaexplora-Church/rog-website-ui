/**
 * Media Library — lookup and filtering logic over a fetched library.
 *
 * ── CMS-CONNECTED, 2026-09-23 ────────────────────────────────────────────
 * Jude: "integrate mo na rin pala na dapat nag rereflect yung CMS dun sa
 * frontend." This file used to BE the data — six hardcoded sample sermons
 * and the helpers that searched them. The data now comes from Strapi
 * (shared/models/api/mediaApi.ts, fetched through each feature's
 * ViewModel), and what is left here is the part that was always logic:
 * `createMediaIndex(library)` returns the same helpers the views already
 * called (`sermonsInCategory`, `findSermon`, `speakerSummaries`…), bound to
 * whichever library was fetched. So the views changed from
 * `findSermon(slug)` to `media.findSermon(slug)` — not in what they do.
 *
 * The six sample sermons moved to shared/models/api/mediaSample.ts and are
 * only used when `VITE_USE_MOCKS=true`. Their full sourcing history (the
 * wrong-church videoId, the placeholder dates, the generated covers) is in
 * this file's git history before 2026-09-23.
 *
 * CATEGORY (agreed with Jude 2026-09-23, matches rog-cms): every message is
 * 'series' (part of a named series — I AM, Exodus…) or 'sermon' (a Sunday
 * or Midweek message). Browse helpers take an optional `pool` of messages;
 * passing `sermonsInCategory(category)` is what makes the Media Library's
 * filters cascade.
 */
import { youtubeThumbnail } from '../../../shared/lib/youtube'
import sermonPlaceholder from '../../../shared/assets/sermon-placeholder.svg'
import type {
  CategoryFilter,
  MediaLibrary,
  Scripture,
  Sermon,
  Series,
  SpeakerSummary,
  Topic,
} from '../../../shared/models/types/media'

export type {
  CategoryFilter,
  MediaCategory,
  MediaLibrary,
  MediaType,
  Scripture,
  Sermon,
  Series,
  SpeakerSummary,
  Topic,
} from '../../../shared/models/types/media'

/* ── Category — pure, no data needed ───────────────────────────────────── */

export const CATEGORY_FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'series', label: 'Series' },
  { key: 'sermon', label: 'Sermons' },
]

export function categoryLabel(c: CategoryFilter): string {
  return CATEGORY_FILTERS.find((f) => f.key === c)?.label ?? 'All'
}

/** Reads a `?category=` value from a URL. Anything unrecognised is 'all',
 *  so a mistyped or stale link still lands somewhere sensible. */
export function parseCategory(value: string | null): CategoryFilter {
  return value === 'series' || value === 'sermon' ? value : 'all'
}

/** `?category=…` for links that should carry the current filter along.
 *  Empty for 'all', so unfiltered URLs stay clean. */
export function categoryQuery(c: CategoryFilter): string {
  return c === 'all' ? '' : `?category=${c}`
}

/**
 * Thumbnail for a message:
 *   upload  → the thumbnail the editor uploaded (required by the CMS)
 *   youtube → YouTube's own ("kung ano yung thumbnail sa youtube, yun din
 *             yung thumbnail sa website")
 * The generic placeholder covers sample stand-ins and a missing id.
 */
export function sermonThumbnail(s: Sermon): string {
  if (s.mediaType === 'upload') return s.thumbnailUrl ?? sermonPlaceholder
  if (s.videoIsPlaceholder || !s.videoId) return sermonPlaceholder
  return youtubeThumbnail(s.videoId)
}

/* ── The index — every data-dependent helper, bound to one library ────── */

export interface MediaIndex {
  sermons: Sermon[]
  series: Series[]
  topics: Topic[]
  scripture: Scripture[]
  /** The single most recent message — see `pickLatestSermon` below for how
   *  "most recent" is decided. */
  latestSermon(): Sermon | undefined
  sermonsInCategory(c: CategoryFilter): Sermon[]
  seriesInCategory(c: CategoryFilter): Series[]
  sermonsBySeries(slug: string): Sermon[]
  sermonsByTopic(slug: string, pool?: Sermon[]): Sermon[]
  sermonsByScripture(slug: string, pool?: Sermon[]): Sermon[]
  sermonsBySpeaker(slug: string, pool?: Sermon[]): Sermon[]
  speakerSummaries(pool?: Sermon[]): SpeakerSummary[]
  seriesCount(slug: string): number
  topicCount(slug: string, pool?: Sermon[]): number
  scriptureCount(slug: string, pool?: Sermon[]): number
  seriesCardThumbnail(slug: string): string | undefined
  seriesBannerImage(slug: string): string | undefined
  findSermon(slug: string): Sermon | undefined
  findSeries(slug: string): Series | undefined
  findTopic(slug: string): Topic | undefined
  findScripture(slug: string): Scripture | undefined
}

export const EMPTY_LIBRARY: MediaLibrary = { sermons: [], series: [], topics: [], scripture: [] }

/**
 * The single most recent message, compared by actual date rather than
 * assumed array order (Jude, 2026-09-24: "kung ano yung pinaka latest based
 * sa date na inupload sa sermons, yun yung lalabas").
 *
 * `mediaApi.ts` asks Strapi to sort newest-first, so this used to agree with
 * `sermons[0]` in practice — but only by assumption. Nothing actually
 * compared a date, so a future reorder (a search result, a different sort,
 * a page that merges two lists) would have silently broken every "Latest
 * Message" claim on the site with no error to catch it. This compares
 * `isoDate` (`YYYY-MM-DD`, sorts correctly as a plain string) directly.
 *
 * Sample data mostly has no confirmed date (`dateIsPlaceholder: true`, no
 * `isoDate`) — of the six rows in mediaSample.ts only one carries a real
 * date, so this naturally lands on that one, the same message the old
 * placeholder-skipping `.find()` in MediaHero used to pick. If nothing has
 * a real date at all, the first message in the library is returned rather
 * than nothing.
 */
function pickLatestSermon(sermons: Sermon[]): Sermon | undefined {
  let latest: Sermon | undefined
  for (const s of sermons) {
    if (!s.isoDate) continue
    if (!latest?.isoDate || s.isoDate > latest.isoDate) latest = s
  }
  return latest ?? sermons[0]
}

export function createMediaIndex(lib: MediaLibrary): MediaIndex {
  const { sermons, series, topics, scripture } = lib

  const sermonsBySeries = (slug: string) => sermons.filter((s) => s.seriesSlug === slug)
  const sermonsByTopic = (slug: string, pool: Sermon[] = sermons) =>
    pool.filter((s) => s.topicSlugs.includes(slug))
  const sermonsByScripture = (slug: string, pool: Sermon[] = sermons) =>
    pool.filter((s) => s.scriptureSlug === slug)
  const findSeries = (slug: string) => series.find((s) => s.slug === slug)

  /**
   * Series card image: the series' own uploaded cover first, then its first
   * episode's thumbnail. Undefined when there is neither, so the card falls
   * back to its "coming soon" treatment instead of a made-up image. The
   * detail-page banner is always the same image (Jude 2026-09-22).
   */
  const seriesCardThumbnail = (slug: string) => {
    const custom = findSeries(slug)?.coverImage
    if (custom) return custom
    const first = sermonsBySeries(slug)[0]
    return first ? sermonThumbnail(first) : undefined
  }

  return {
    sermons,
    series,
    topics,
    scripture,

    latestSermon: () => pickLatestSermon(sermons),

    sermonsInCategory: (c) => (c === 'all' ? sermons : sermons.filter((s) => s.category === c)),
    /** Series only exist under the Series category, so Sermons has none. */
    seriesInCategory: (c) => (c === 'sermon' ? [] : series),

    sermonsBySeries,
    sermonsByTopic,
    sermonsByScripture,
    sermonsBySpeaker: (slug, pool = sermons) => pool.filter((s) => s.speakerSlug === slug),

    speakerSummaries: (pool = sermons) => {
      const map = new Map<string, SpeakerSummary>()
      for (const s of pool) {
        if (!s.speakerSlug || !s.speakerName) continue
        const existing = map.get(s.speakerSlug)
        if (existing) existing.count += 1
        else map.set(s.speakerSlug, { slug: s.speakerSlug, name: s.speakerName, count: 1 })
      }
      return [...map.values()].sort((a, b) => b.count - a.count)
    },

    seriesCount: (slug) => sermonsBySeries(slug).length,
    topicCount: (slug, pool) => sermonsByTopic(slug, pool).length,
    scriptureCount: (slug, pool) => sermonsByScripture(slug, pool).length,

    seriesCardThumbnail,
    seriesBannerImage: seriesCardThumbnail,

    findSermon: (slug) => sermons.find((s) => s.slug === slug),
    findSeries,
    findTopic: (slug) => topics.find((t) => t.slug === slug),
    findScripture: (slug) => scripture.find((s) => s.slug === slug),
  }
}
