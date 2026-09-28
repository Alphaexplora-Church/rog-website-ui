import type { MediaLibrary, Scripture, Sermon, Series, Topic } from '../types/media'

/**
 * ⚠ DUMMY MEDIA — FOR LOOKING AT THE LAYOUT ONLY. DELETE WHEN DONE. ⚠
 *
 * Jude, 2026-09-27: "gawa ka nga ng dummy data na hundreds of uploaded
 * videos na pwede ko rin idelete agad, para makita ko yung totoong itsura
 * niya pag naka upload yung maraming videos."
 *
 * ON:     add  VITE_USE_DUMMY_MEDIA=true  to .env.local, restart `npm run dev`
 * OFF:    set it to false (or remove the line), restart
 * DELETE: delete THIS FILE. Nothing else needs to change — mediaApi.ts loads
 *         it through import.meta.glob, which simply finds nothing once the
 *         file is gone, and falls back to the CMS.
 *
 * It never touches Strapi. ~300 "uploaded" messages over ~4.5 years of
 * Sundays (plus some midweeks), in 14 series (2 with no episodes yet, to
 * show "coming soon"), 18 topics, 22 books, 8 speakers (~5% with no
 * speaker). Generated from a fixed seed, so it is the same every reload.
 *
 * Images are random stock photos from picsum.photos (needs internet; if
 * one fails the site's own River fallback art shows). Every video plays the
 * same short CC0 clip from MDN. None of the names, titles or dates are real
 * ROG messages.
 */

/* Deterministic PRNG (mulberry32) so the library doesn't reshuffle on reload. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = rng(20260927)
const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)]
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const thumb = (seed: string) => `https://picsum.photos/seed/rog-${seed}/1280/720`
const poster = (seed: string) => `https://picsum.photos/seed/rog-series-${seed}/960/1200`

const SPEAKERS = [
  'Bp. Chito Sanchez',
  'Pastor Rachel Sanchez',
  'Ps. Greeko Villanueva',
  'Pastor Rodel Buban',
  'Ps. Mara Dizon',
  'Ps. Joel Ramirez',
  'Ptr. Anna Cruz',
  'Rev. Paolo Lim',
]
/* Weighted so the senior pastors preach most Sundays, like a real church. */
const SPEAKER_WEIGHTS = [34, 22, 12, 10, 7, 6, 5, 4]
function pickSpeaker(): string | undefined {
  if (rand() < 0.05) return undefined
  let r = rand() * SPEAKER_WEIGHTS.reduce((a, b) => a + b, 0)
  for (let i = 0; i < SPEAKERS.length; i++) {
    r -= SPEAKER_WEIGHTS[i]
    if (r <= 0) return SPEAKERS[i]
  }
  return SPEAKERS[0]
}

const TOPIC_NAMES = [
  'Hope', 'Faith', 'Prayer', 'Worship', 'Family', 'Identity', 'Grace', 'Holy Spirit',
  'Healing', 'Purpose', 'Generosity', 'Obedience', 'Restoration', 'End Times',
  'Leadership', 'Relationships', 'Evangelism', 'Rest',
]
const BOOKS = [
  'Genesis', 'Exodus', 'Joshua', 'Ruth', '1 Samuel', 'Psalms', 'Proverbs', 'Ecclesiastes',
  'Isaiah', 'Jeremiah', 'Jonah', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  'Ephesians', 'Philippians', 'Hebrews', 'James', 'Revelation',
]

const SERIES_DEF: { title: string; book?: string; topics: string[]; episodes: string[] }[] = [
  { title: 'I AM', book: 'John', topics: ['Identity', 'Faith'], episodes: ['The Bread of Life', 'The Light of the World', 'The Door', 'The Good Shepherd', 'The Resurrection', 'The Way', 'The True Vine'] },
  { title: 'Exodus', book: 'Exodus', topics: ['Obedience', 'Purpose'], episodes: ['Out of Egypt', 'The Burning Bush', 'Let My People Go', 'Through the Sea', 'Manna in the Morning', 'Mountain of Fire', 'The Tabernacle', 'Glory Fills the House'] },
  { title: 'Deep Waters', topics: ['Holy Spirit', 'Worship'], episodes: ['Ankle Deep', 'Knee Deep', 'Waist Deep', 'Over My Head', 'Where the River Flows'] },
  { title: 'Rooted', book: 'Psalms', topics: ['Faith', 'Rest'], episodes: ['Planted by Streams', 'Deep Roots', 'Seasons', 'Bearing Fruit', 'Evergreen'] },
  { title: 'Kingdom Come', book: 'Matthew', topics: ['Purpose', 'Leadership'], episodes: ['Blessed Are the Poor', 'Salt and Light', 'Treasure in Heaven', 'Seek First', 'On the Rock', 'Your Kingdom Come'] },
  { title: 'The Upper Room', book: 'Acts', topics: ['Holy Spirit', 'Prayer'], episodes: ['Wait for the Promise', 'Tongues of Fire', 'Devoted', 'Signs and Wonders', 'Bold'] },
  { title: 'Unshakeable', book: 'Hebrews', topics: ['Hope', 'Faith'], episodes: ['An Anchor for the Soul', 'Hall of Faith', 'Run the Race', 'A Kingdom That Cannot Be Shaken'] },
  { title: 'Family Matters', topics: ['Family', 'Relationships'], episodes: ['Built on Purpose', 'Honour at Home', 'Raising Arrows', 'Forgive Again', 'A House United', 'Generations'] },
  { title: 'Overflow', topics: ['Generosity', 'Grace'], episodes: ['More Than Enough', 'The Widow’s Oil', 'Open Hands', 'Sow and Reap'] },
  { title: 'Ecclesiastes', book: 'Ecclesiastes', topics: ['Purpose', 'Rest'], episodes: ['Vanity of Vanities', 'A Time for Everything', 'Two Are Better Than One', 'Remember Your Creator'] },
  { title: 'Fire & Rain', topics: ['Prayer', 'Healing'], episodes: ['Elijah Prays', 'A Cloud Like a Hand', 'The Still Small Voice', 'Double Portion', 'Rain on Dry Ground'] },
  { title: 'Ekklesia', book: 'Ephesians', topics: ['Identity', 'Leadership'], episodes: ['Called Out', 'One Body', 'Gifts to the Church', 'Armour of God', 'The Bride'] },
  /* No episodes yet → "coming soon" posters. */
  { title: 'Revelation', book: 'Revelation', topics: [], episodes: [] },
  { title: 'Firstfruits', topics: [], episodes: [] },
]

const TITLE_A = [
  'The', 'Our', 'A New', 'The Power of', 'Walking in', 'The Heart of', 'Living', 'Called to',
  'The Road to', 'When God', 'Return to', 'The Gift of', 'Beyond', 'Rising in', 'The Joy of',
]
const TITLE_B = [
  'Hope', 'Faith', 'Grace', 'Surrender', 'Promise', 'Presence', 'Mercy', 'Glory', 'Freedom',
  'Harvest', 'Calling', 'Light', 'Rest', 'Victory', 'Breakthrough', 'Covenant', 'Wilderness',
  'Morning', 'Overflow', 'Kingdom',
]
const STANDALONE = [
  'Come Alive', 'Deep Calls to Deep', 'Fire on the Altar', 'The Rivers Rise', 'Seasons of Grace',
  'First Love', 'Lessons From Jonah', 'The Day Is Approaching', 'Light in the Darkness', 'Unshaken',
  'Redemption, Reconciliation and Restoration', 'Still Waters', 'Wells of Salvation', 'Mountain Movers',
  'The Waiting Room', 'Open Heavens', 'Bread for Today', 'Anchored', 'Sound of Many Waters', 'Chosen',
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const iso = (d: Date) => d.toISOString().slice(0, 10)
const display = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`

function build(): MediaLibrary {
  const topics: Topic[] = TOPIC_NAMES.map((t) => ({ slug: slugify(t), title: t }))
  const scripture: Scripture[] = BOOKS.map((b) => ({ slug: slugify(b), title: b }))
  const series: Series[] = SERIES_DEF.map((s) => ({
    slug: slugify(s.title),
    title: s.title,
    coverImage: poster(slugify(s.title)),
    isPlaceholder: s.episodes.length === 0,
  }))

  /* Walk back week by week from the most recent Sunday. Series run on
     consecutive Sundays; the weeks between them are standalone Sunday
     messages; about one week in four also has a midweek message. */
  const sermons: Sermon[] = []
  const queue = SERIES_DEF.filter((s) => s.episodes.length).map((s) => ({ ...s, next: s.episodes.length - 1 }))
  let active: (typeof queue)[number] | undefined
  let gap = 2
  const used = new Set<string>()
  const day = new Date(Date.UTC(2026, 8, 27)) // Sun, 27 Sep 2026
  const TARGET = 300

  const push = (s: Omit<Sermon, 'slug' | 'date' | 'isoDate'>, d: Date) => {
    let slug = slugify(s.title)
    if (used.has(slug)) slug = `${slug}-${iso(d)}`
    used.add(slug)
    sermons.push({ ...s, slug, date: display(d), isoDate: iso(d) })
  }

  const standaloneTitle = () => (rand() < 0.35 ? pick(STANDALONE) : `${pick(TITLE_A)} ${pick(TITLE_B)}`)
  const someTopics = (base: string[] = []) => {
    const set = new Set(base.map(slugify))
    const want = base.length ? Math.min(base.length, 2) : 1 + Math.floor(rand() * 2)
    while (set.size < want) set.add(slugify(pick(TOPIC_NAMES)))
    if (rand() < 0.2) set.add(slugify(pick(TOPIC_NAMES)))
    return [...set]
  }

  while (sermons.length < TARGET) {
    /* Sunday */
    if (!active && gap <= 0 && queue.length) {
      active = queue.splice(Math.floor(rand() * queue.length), 1)[0]
    }
    if (active) {
      const title = active.episodes[active.next]
      push(
        {
          title,
          category: 'series',
          seriesSlug: slugify(active.title),
          mediaType: 'upload',
          videoId: '',
          videoUrl: VIDEO,
          thumbnailUrl: thumb(`${slugify(active.title)}-${active.next}`),
          speakerName: pickSpeaker(),
          topicSlugs: someTopics(active.topics),
          scriptureSlug: active.book ? slugify(active.book) : rand() < 0.5 ? slugify(pick(BOOKS)) : undefined,
        },
        day,
      )
      active.next -= 1
      if (active.next < 0) {
        active = undefined
        gap = 3 + Math.floor(rand() * 8)
      }
    } else {
      push(
        {
          title: standaloneTitle(),
          category: 'sermon',
          mediaType: 'upload',
          videoId: '',
          videoUrl: VIDEO,
          thumbnailUrl: thumb(`sun-${iso(day)}`),
          speakerName: pickSpeaker(),
          topicSlugs: someTopics(),
          scriptureSlug: rand() < 0.7 ? slugify(pick(BOOKS)) : undefined,
        },
        day,
      )
      gap -= 1
    }

    /* Midweek (Wednesday before) */
    if (rand() < 0.25 && sermons.length < TARGET) {
      const wed = new Date(day)
      wed.setUTCDate(wed.getUTCDate() - 4)
      push(
        {
          title: `Midweek: ${pick(TITLE_A)} ${pick(TITLE_B)}`,
          category: 'sermon',
          mediaType: 'upload',
          videoId: '',
          videoUrl: VIDEO,
          thumbnailUrl: thumb(`wed-${iso(wed)}`),
          speakerName: pickSpeaker(),
          topicSlugs: someTopics(),
          scriptureSlug: rand() < 0.5 ? slugify(pick(BOOKS)) : undefined,
        },
        wed,
      )
    }
    day.setUTCDate(day.getUTCDate() - 7)
  }

  /* Speaker slugs from names; drop terms nothing ended up using. */
  for (const s of sermons) if (s.speakerName) s.speakerSlug = slugify(s.speakerName)
  const usedTopics = new Set(sermons.flatMap((s) => s.topicSlugs))
  const usedBooks = new Set(sermons.map((s) => s.scriptureSlug).filter(Boolean))

  return {
    sermons,
    series,
    topics: topics.filter((t) => usedTopics.has(t.slug)),
    scripture: scripture.filter((b) => usedBooks.has(b.slug)),
  }
}

export const dummyLibrary: MediaLibrary = build()
