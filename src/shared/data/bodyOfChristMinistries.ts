/**
 * THE ONE LIST OF BODY OF CHRIST MINISTRIES — the cross-church programmes
 * ROG runs for the wider Body of Christ (PCEC, Soaking in the River,
 * Activate, Women Arise…). Copy verbatim from the Figma source.
 *
 * MOVED HERE 2026-09-28 from BodyOfChristMinistriesSection.tsx, when the
 * Ministries page started reading the CMS: this is now the bundled
 * fallback (see shared/models/api/ministriesFallback.ts) and the source
 * rog-cms seeded its first 20 ministries from. The live page reads
 * rog-cms first.
 *
 * Photos are stock placeholders; `photo-1760367121593…` (the original first
 * one) was a dead URL and was swapped earlier.
 */
export interface BodyOfChristEntry {
  title: string
  teaser: string
  body: string
  photo: string
}

export const bodyOfChristMinistries: BodyOfChristEntry[] = [
  {
    title: 'PCEC Transformation & Revival',
    teaser: 'Events, activities & testimonies',
    body: 'Links out to a Facebook page for events, activities, and testimonies from the Commission.',
    // Was photo-1760367121593-97b9a02bbd65 — that URL returns nothing.
    photo:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Supernatural Ministry / Prophetic Workshops',
    teaser: 'Founded 2005 by Pastor Rachel Sanchez',
    body: 'Has its own Vision and Mission statement, with a supporting scripture: Ephesians 2:19–20.',
    photo:
      'https://images.unsplash.com/photo-1604882737206-8a000c03d8fe?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Soaking in the River',
    teaser: 'Monthly gathering for the Body of Christ',
    body: 'Focused on prayer for the nation and encountering the Holy Spirit.',
    photo:
      'https://images.unsplash.com/photo-1622598453695-4fbaf151aadc?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Worship Mentoring',
    teaser: 'Running since 2014',
    body: 'Equips worship teams — prophetic worship, worship leading, skills training, and song-writing.',
    photo:
      'https://images.unsplash.com/photo-1740650511388-f693ce80016c?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Activate',
    teaser: 'Annual conference — parent brand of Activate12',
    body: 'Four stated goals around the Holy Spirit, the supernatural, and revival. This year’s conference lives at Activate12.',
    photo:
      'https://images.unsplash.com/photo-1600019246742-3b66977db044?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Women Arise',
    teaser: 'Gathering & empowering women',
    body: 'Has its own Vision and Mission statement, focused on gathering and empowering women.',
    photo:
      'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=600&q=80',
  },
]
