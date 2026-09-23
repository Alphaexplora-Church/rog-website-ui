/**
 * Media Library — data model + sample content.
 *
 * FRONTEND-ONLY, CMS-SHAPED (confirmed with Jude 2026-09-22: "wala munang
 * gagalawin sa cms interface" — no real Strapi content-types or API wiring
 * in this pass, that was just context so I'd have the bigger picture).
 * These types are deliberately shaped the way the eventual Strapi
 * collections will be (Sermon / Series / a computed Speaker/Topic/
 * Scripture index), so swapping this file for real API calls later is a
 * data-layer change, not a component rewrite — same pattern as
 * `RosterPerson` on the About page.
 *
 * SAMPLE DATA, NOT A FULL SCRAPE (confirmed: "Konting sample lang muna").
 * The real riverofgod.ph Media Library has 165+ sermons from Bp. Chito
 * alone across dozens of series/topics/speakers/scripture entries — far
 * too much to hand-enter here. This file seeds SEVEN real sermons, each a
 * genuine, verifiable upload from the real @RIVEROFGODORTIGAS YouTube
 * channel (Jude: "kuha ka muna ng mga sample links sa youtube... dapat
 * automatic yung thumbnail" — see shared/lib/youtube.ts for the thumbnail
 * derivation), plus clearly flagged PLACEHOLDER entries where I don't have
 * confirmed real data:
 *
 *   - `sunday-service` is the one real series — all seven sermons are
 *     genuine Sunday Service uploads. `ecclesiastes` and `exodus` are
 *     placeholder series (real series names the live site uses, per the
 *     Media Library screenshots Jude shared) with NO real episodes
 *     assigned — I don't have a confirmed real sermon-to-series mapping
 *     for any of these seven videos, and guessing one would misattribute
 *     content the same way the earlier Ortigas Pastors mixup did.
 *     Flagged, not guessed.
 *   - Topics are inferred from each sermon's own title (reasonable
 *     editorial tagging, not a factual claim).
 *   - Scripture is only tagged where a book is unambiguous from the title
 *     ("Lessons From Jonah" → Jonah). `ecclesiastes-book` is a placeholder
 *     scripture term with zero linked sermons, for the same reason as the
 *     placeholder series above.
 *   - Two of the seven sermons carry a publicly confirmed date, both
 *     visible directly on the video's own thumbnail/title text — nothing
 *     inferred: Spirit of Elijah ("11 June 2023 | SPIRIT OF ELIJAH") and
 *     Redemption, Reconciliation and Restoration ("SUNDAY | 10TH MARCH
 *     2024"). I couldn't confirm a real upload date for the other five
 *     (The End, Our Hope, The Day Is Approaching, Lessons From Jonah,
 *     Light in the Darkness) — search didn't surface one and fetching each
 *     video's own page got rate-limited mid-lookup.
 *
 *     UPDATED 2026-09-22 (again): rather than leave `date` empty on those
 *     five, Jude asked for a placeholder there instead — "lagay ka lang
 *     placeholder ng dates para pag ililink na sa cms, nakaready na" (so
 *     the field is already wired and ready once the real value comes from
 *     the CMS). Those five now carry `date: 'Date pending'` with
 *     `dateIsPlaceholder: true`; every place that renders a date checks
 *     that flag and shows the placeholder muted/italic instead of styled
 *     like a real confirmed date, so a viewer (or Jude) can't mistake it
 *     for one. Swap the value and drop the flag once the real Strapi
 *     field is wired.
 *
 *     CORRECTED 2026-09-22 (important): the "Spirit of Elijah" videoId I'd
 *     sourced (nEAZv-0KGek) turned out to be WRONG — Jude spotted the
 *     thumbnail's own watermark reads "GRACE CHURCH SHAH ALAM" (a different
 *     church, Malaysia), not River of God Ortigas, despite the matching
 *     sermon title. That also invalidates the "confirmed" Jun 11, 2023 date
 *     for this entry, since it was read directly off that same wrong
 *     thumbnail; `date` is reset to the same pending-placeholder treatment
 *     as the other five.
 *
 *     UPDATED once more 2026-09-22: Jude asked to keep the site's thumbnail
 *     logic uniform — "kung ano yung thumbnail sa youtube, yun din yung
 *     thumbnail sa website" (whatever YouTube shows, the site shows,
 *     always, no special-cased placeholder boxes). So rather than leave
 *     `videoId` empty and branch every render site around it,
 *     "spirit-of-elijah" temporarily borrows "the-end"'s real, confirmed
 *     ROG videoId (P5OBtcgl3i8) as a stand-in — `sermonThumbnail`/the video
 *     embed derive from it exactly like any other sermon, same as before.
 *     `videoIsPlaceholder: true` stays on the entry as a data-only note
 *     that this isn't its real video yet; it no longer changes what
 *     renders. Swap in the real "Spirit of Elijah" videoId (and re-verify
 *     the other six) once Jude sends the confirmed @RIVEROFGODORTIGAS
 *     links.
 *
 *     UPDATED once more 2026-09-22: showing "the-end"'s real thumbnail
 *     under "Spirit of Elijah"'s title looked like a duplicate/mismatched
 *     card, so Jude asked for a proper generic placeholder image instead
 *     ("something christianic type") rather than borrowing another
 *     sermon's real photo. `sermonThumbnail` now returns a small local SVG
 *     (a simple cross on the site's own dark/teal palette — see
 *     shared/assets/sermon-placeholder.svg) for any `videoIsPlaceholder`
 *     sermon, so the card/banner clearly reads as "not a real preview yet"
 *     instead of quietly reusing unrelated real content. The video EMBED
 *     on the watch page still plays "the-end"'s real video as a functional
 *     stand-in (untouched) — only the static thumbnail changed.
 *
 *     UPDATED once more 2026-09-22: Jude asked to just go ahead and
 *     generate a custom image for the series card/header for now
 *     ("mag generate ka nalang munang custom image") — a stand-in for
 *     `sunday-service`'s `coverImage` until he supplies a real photo/
 *     graphic. Added a generated SVG (cross + light rays + the ROG wave
 *     motif, site palette) at shared/assets/series-sunday-service-cover.svg
 *     and set it as `coverImage` on the 'sunday-service' series entry below
 *     — `seriesCardThumbnail`/`seriesBannerImage` already prefer
 *     `coverImage` when set, so the Media Library card and the series
 *     detail-page header both pick it up automatically. Swap this for a
 *     real asset whenever Jude has one; no code changes needed then, just
 *     replace the file or the import.
 */
import { youtubeThumbnail } from '../../../shared/lib/youtube'
import sermonPlaceholder from '../../../shared/assets/sermon-placeholder.svg'
import sundayServiceCover from '../../../shared/assets/series-sunday-service-cover.svg'

export interface Sermon {
  slug: string
  title: string
  videoId: string
  speakerSlug: string
  speakerName: string
  seriesSlug: string
  /** Confirmed real date, OR a placeholder string ('Date pending') when
   *  `dateIsPlaceholder` is true. Never a fabricated specific date. */
  date?: string
  /** True when `date` is a placeholder, not a real confirmed value — every
   *  render site must style/flag it differently from a real date. */
  dateIsPlaceholder?: boolean
  /** True when `videoId` is a temporary stand-in, not this sermon's real
   *  confirmed video — data-only note (doesn't change what renders; the
   *  thumbnail/embed still derive from `videoId` normally, same as any
   *  other sermon). Set on "Spirit of Elijah" after its originally-sourced
   *  videoId turned out to belong to a different church entirely. */
  videoIsPlaceholder?: boolean
  /** Inferred from the sermon's own title — editorial tagging, not fact. */
  topicSlugs: string[]
  scriptureSlug?: string
}

export interface Series {
  slug: string
  title: string
  isPlaceholder?: boolean
  /** Dedicated custom banner image for this series' detail-page header —
   *  its own designed graphic (like the real site's illustrated series art),
   *  NOT an episode thumbnail. Unset until a real asset is supplied; the
   *  header falls back to a solid/gradient placeholder until then. See
   *  `seriesBannerImage`. */
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

export const series: Series[] = [
  { slug: 'sunday-service', title: 'Sunday Service', coverImage: sundayServiceCover },
  { slug: 'ecclesiastes', title: 'Ecclesiastes', isPlaceholder: true },
  { slug: 'exodus', title: 'Exodus', isPlaceholder: true },
]

export const topics: Topic[] = [
  { slug: 'end-times', title: 'End Times' },
  { slug: 'hope', title: 'Hope' },
  { slug: 'restoration', title: 'Restoration' },
  { slug: 'obedience', title: 'Obedience' },
  { slug: 'spiritual-anointing', title: 'Spiritual Anointing' },
  { slug: 'light-in-darkness', title: 'Light in Darkness' },
  { slug: 'discipleship', title: 'Discipleship', isPlaceholder: true },
]

export const scripture: Scripture[] = [
  { slug: 'jonah', title: 'Jonah' },
  { slug: 'ecclesiastes-book', title: 'Ecclesiastes', isPlaceholder: true },
]

export const sermons: Sermon[] = [
  {
    slug: 'the-end',
    title: 'The End',
    videoId: 'P5OBtcgl3i8',
    speakerSlug: 'bp-chito-sanchez',
    speakerName: 'Bp. Chito Sanchez',
    seriesSlug: 'sunday-service',
    date: 'Date pending',
    dateIsPlaceholder: true,
    topicSlugs: ['end-times'],
  },
  {
    slug: 'our-hope',
    title: 'Our Hope',
    videoId: '8F0IS9Mtd0M',
    speakerSlug: 'bp-chito-sanchez',
    speakerName: 'Bp. Chito Sanchez',
    seriesSlug: 'sunday-service',
    date: 'Date pending',
    dateIsPlaceholder: true,
    topicSlugs: ['hope'],
  },
  {
    slug: 'the-day-is-approaching',
    title: 'The Day Is Approaching',
    videoId: 'bG6EsoQJ7K4',
    speakerSlug: 'bp-chito-sanchez',
    speakerName: 'Bp. Chito Sanchez',
    seriesSlug: 'sunday-service',
    date: 'Date pending',
    dateIsPlaceholder: true,
    topicSlugs: ['end-times'],
  },
  {
    slug: 'lessons-from-jonah',
    title: 'Lessons From Jonah',
    videoId: '5LYu2yTXgMo',
    speakerSlug: 'bp-chito-sanchez',
    speakerName: 'Bp. Chito Sanchez',
    seriesSlug: 'sunday-service',
    date: 'Date pending',
    dateIsPlaceholder: true,
    topicSlugs: ['obedience'],
    scriptureSlug: 'jonah',
  },
  {
    slug: 'redemption-reconciliation-and-restoration',
    title: 'Redemption, Reconciliation and Restoration',
    videoId: 'KTL0IompwUM',
    speakerSlug: 'pastor-rachel-sanchez',
    speakerName: 'Pastor Rachel Sanchez',
    seriesSlug: 'sunday-service',
    date: 'Mar 10, 2024',
    topicSlugs: ['restoration'],
  },
  {
    slug: 'light-in-the-darkness',
    title: 'Light in the Darkness',
    videoId: 'whWY1SKVEeY',
    speakerSlug: 'pastor-rodel-buban',
    speakerName: 'Pastor Rodel Buban',
    seriesSlug: 'sunday-service',
    date: 'Date pending',
    dateIsPlaceholder: true,
    topicSlugs: ['light-in-darkness'],
  },
]

/**
 * Thumbnail for a sermon — derived automatically from its YouTube
 * `videoId` (Jude: "kung ano yung thumbnail sa youtube, yun din yung
 * thumbnail sa website" — same logic for every sermon, uniformly), EXCEPT
 * a sermon flagged `videoIsPlaceholder`, which shows a generic local
 * placeholder graphic instead — Jude didn't want a real (but unrelated)
 * sermon's photo borrowed under a different title; a clearly-generic
 * "not a real preview yet" image is more honest. See
 * shared/assets/sermon-placeholder.svg.
 */
export function sermonThumbnail(s: Sermon): string {
  if (s.videoIsPlaceholder) return sermonPlaceholder
  return youtubeThumbnail(s.videoId)
}

export function sermonsBySeries(slug: string): Sermon[] {
  return sermons.filter((s) => s.seriesSlug === slug)
}

/**
 * Series card thumbnail (Media Library grid). Prefers `Series.coverImage`
 * — a dedicated custom graphic for that series, settable per series once
 * Jude has one — and falls back to that series' first real sermon's own
 * YouTube thumbnail when no custom image is set. Returns undefined for a
 * placeholder series with zero real episodes and no coverImage
 * (ecclesiastes, exodus), so the card falls back to its dashed
 * "coming soon" treatment instead of showing a made-up image.
 */
export function seriesCardThumbnail(slug: string): string | undefined {
  const custom = findSeries(slug)?.coverImage
  if (custom) return custom
  const first = sermonsBySeries(slug)[0]
  return first ? sermonThumbnail(first) : undefined
}

/**
 * Banner image for a series' detail-page header — always the SAME image
 * as that series' card in the Media Library grid (`seriesCardThumbnail`,
 * which already checks `Series.coverImage` first). Jude 2026-09-22
 * (confirmed after a round of back-and-forth): "kung ano yung thumbnail
 * ... ginamit dun sa main media thumbnail, magiging header siya, kapag
 * pinindot yung specific series" — the two must always match, so this is
 * a thin alias rather than its own lookup.
 */
export function seriesBannerImage(slug: string): string | undefined {
  return seriesCardThumbnail(slug)
}

export function sermonsByTopic(slug: string): Sermon[] {
  return sermons.filter((s) => s.topicSlugs.includes(slug))
}

export function sermonsByScripture(slug: string): Sermon[] {
  return sermons.filter((s) => s.scriptureSlug === slug)
}

export interface SpeakerSummary {
  slug: string
  name: string
  count: number
}

export function speakerSummaries(): SpeakerSummary[] {
  const map = new Map<string, SpeakerSummary>()
  for (const s of sermons) {
    const existing = map.get(s.speakerSlug)
    if (existing) existing.count += 1
    else map.set(s.speakerSlug, { slug: s.speakerSlug, name: s.speakerName, count: 1 })
  }
  return [...map.values()].sort((a, b) => b.count - a.count)
}

export function sermonsBySpeaker(slug: string): Sermon[] {
  return sermons.filter((s) => s.speakerSlug === slug)
}

export function seriesCount(slug: string): number {
  return sermonsBySeries(slug).length
}

export function topicCount(slug: string): number {
  return sermonsByTopic(slug).length
}

export function scriptureCount(slug: string): number {
  return sermonsByScripture(slug).length
}

export function findSermon(slug: string): Sermon | undefined {
  return sermons.find((s) => s.slug === slug)
}

export function findSeries(slug: string): Series | undefined {
  return series.find((s) => s.slug === slug)
}

export function findTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}

export function findScripture(slug: string): Scripture | undefined {
  return scripture.find((s) => s.slug === slug)
}
