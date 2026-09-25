/**
 * RIVER OF GOD CORE VALUES — single-sourced.
 *
 * CREATED 2026-09-25 from ROG's "Core Values" slide deck Jude sent
 * (Intimacy / Discipleship / Family / Spiritual Gifts). `tagline` is the
 * slide's own line, verbatim. `detail` is a short expansion for the web —
 * ⚠ written for this build, not ROG copy; ROG may replace it.
 *
 * `color` is each value's slide colour (red / violet / blue / orange);
 * `image` is a text-free crop of that slide's photo collage. `icon` names
 * the slide's own corner mark (flame / three people / heart / dove).
 */

export interface CoreValue {
  key: string
  title: string
  tagline: string
  detail: string
  color: string
  image: string
  icon: 'flame' | 'people' | 'heart' | 'dove'
}

export const coreValues: CoreValue[] = [
  {
    key: 'intimacy',
    image: '/assets/rog/value-intimacy.webp',
    title: 'Intimacy',
    tagline: 'We value relationship with God.',
    detail:
      'Worship and prayer are the avenues to know God intimately — and intimacy with God is the key to a victorious Christian life. Everything else we value is built on this one.',
    color: '#7a2620',
    icon: 'flame',
  },
  {
    key: 'discipleship',
    image: '/assets/rog/value-discipleship.webp',
    title: 'Discipleship',
    tagline: 'We value spiritual growth through relationship with other people.',
    detail:
      'Nobody grows alone. Spiritual growth happens in relationship — in life groups, in mentorship, in the everyday company of people further along and just behind.',
    color: '#4a2d73',
    icon: 'people',
  },
  {
    key: 'family',
    image: '/assets/rog/value-family.webp',
    title: 'Family',
    tagline: 'We value long term relationships.',
    detail:
      "Church is family, not an event. We invest in relationships built to last — across life stages and seasons, not just a Sunday morning.",
    color: '#1d4d8a',
    icon: 'heart',
  },
  {
    key: 'spiritual-gifts',
    image: '/assets/rog/value-spiritual-gifts.webp',
    title: 'Spiritual Gifts',
    tagline: 'We value the move of the Holy Spirit.',
    detail:
      'We contend for the manifest presence of the Holy Spirit and the operation of every gift He gives, believing He is actively and powerfully at work today.',
    color: '#a15420',
    icon: 'dove',
  },
]
