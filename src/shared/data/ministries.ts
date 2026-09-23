/**
 * THE ONE LIST OF SERVING MINISTRIES — ROG's own volunteer-recruitment
 * ministries, from the #SAVEDTOSERVE page on riverofgod.ph.
 *
 * CREATED 2026-09-23 on Jude's call — "make sure that the data placeholders
 * are all the same… para pag inimplement tsaka inintegrate natin yung cms,
 * we wont encounter any issue."
 *
 * ⚠ WHAT IT WAS BEFORE: this array lived inside
 * `features/ministries/views/ServiceMinistriesSection.tsx`, and About's
 * `ServingMinistryHeadsSection` carried its own second copy of the same six
 * people — with two of the role labels spelled differently ("Media &
 * Production" vs "Media and Production", "Discipleship & Connect" vs
 * "Discipleship"). Both pages now read this file, so a ministry is named
 * one way everywhere.
 *
 * `contact` is a slug into `people.ts`, not a name string, so the person and
 * their phone number are defined once. That mirrors how Strapi will model
 * it: a `ministry` collection with a relation to `person`.
 *
 * NOT TO BE CONFUSED with `features/ministries/views/BodyOfChristMinistriesSection.tsx`
 * — those are cross-church programmes ROG runs for the wider Body of Christ
 * (PCEC, Soaking in the River, Activate, Women Arise). These are internal
 * serving teams looking for volunteers.
 *
 * ⚠ TWO ENTRIES ARE STILL INCOMPLETE. Discipleship and Cross Cultural were
 * flagged early on as needing their description and contact confirmed; the
 * copy below is from their own #SAVEDTOSERVE cards, but neither has been
 * checked against ROG directly.
 */
/** Photos are stock placeholders — real ROG photography replaces these. */
const PHOTO_CONGREGATION =
  'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&q=80&w=900'
const PHOTO_HEADPHONES =
  'https://images.unsplash.com/photo-1511806754518-53bada35f930?auto=format&fit=crop&q=80&w=900'
const PHOTO_STAGE_LIGHTS =
  'https://images.unsplash.com/photo-1622598453695-4fbaf151aadc?auto=format&fit=crop&q=80&w=900'
const PHOTO_WORSHIP_WARM =
  'https://images.unsplash.com/photo-1740650511388-f693ce80016c?auto=format&fit=crop&q=80&w=900'
const PHOTO_SEASONED =
  'https://images.unsplash.com/photo-1504004030892-d06adf9ffbcf?auto=format&fit=crop&q=80&w=900'
const PHOTO_EMBRACE =
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=900'
const PHOTO_HORIZON =
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=900'

export interface Ministry {
  /** Stable key; also the future CMS slug. */
  slug: string
  title: string
  /** One line for the card face, compressed from this ministry's own description. */
  blurb: string
  description: string
  tagline: string
  /** Slug into `people.ts`. The phone number lives on that person. */
  contact: string
  hashtag: string
  image: string
  /** Deep and light ends of this ministry's hue. */
  tint: [string, string]
}

export const ministries: Ministry[] = [
  {
    slug: 'ushering',
    title: 'Ushering',
    blurb: 'Order, security and a warm welcome at every service.',
    description:
      'The Ushering Ministry is driven by their vision "to love God and serve His people". Their mission to keep and maintain order and security in the church is one way they do to serve the purpose. Differences in the strength of each member keeps the ministry balanced. The increasing passion in the hearts of people across all ages to serve through this ministry has been one of their core strength.',
    tagline:
      "If you love God and it's your desire to serve His people, this may be an open door for you to serve Jesus.",
    contact: 'erika-garcia',
    hashtag: '#Ushering',
    image: PHOTO_CONGREGATION,
    tint: ['#B45309', '#FCD34D'],
  },
  {
    slug: 'media-and-production',
    title: 'Media and Production',
    blurb: 'Graphics, photography, videography and live broadcast.',
    description:
      "We support ministries in communicating their message through quality presentations, graphic design, photography, videography, and live broadcast, while social media is our primary method for making noise. Our purpose is to relay God's message in today's high-tech society, in this creative and innovative generation. The team is also responsible for communicating updates, information, and changes to the ROG Community through the creation of online collaterals and other related documents.",
    tagline:
      "If you're praying for God to use your creative talents, this may be an open door for you to serve Jesus.",
    contact: 'joy-mallari',
    hashtag: '#MediaProduction #RMP #MediaforJesus',
    image: PHOTO_HEADPHONES,
    tint: ['#0E7490', '#67E8F9'],
  },
  {
    slug: 'creative-arts',
    title: 'Creative Arts',
    blurb: 'Dance and banner, prophetic painting, performing arts.',
    description:
      'The Creative Arts Ministry of River of God has three divisions namely FIRESTARTERS (dance and banner), VISIONCASTERS (prophetic painting), and TRAILBLAZERS (performing arts). To love God and disciple His people through arts is the main thrust of this ministry. Our mission is to evangelize the lost through arts and establish them in the Christian faith, to usher God’s people in worship, and equip them to enhance their artistic skills and empower them to equip others.',
    tagline: "ROG's serving ministries are in need of committed and available volunteers!",
    contact: 'jieyan-antonio',
    hashtag: '#CreativeArts',
    image: PHOTO_STAGE_LIGHTS,
    tint: ['#A21CAF', '#F0ABFC'],
  },
  {
    slug: 'worship-team',
    title: 'Worship Team',
    blurb: 'Ushering people into spirit-led, prophetic worship.',
    description:
      'More than just a team, the River Worship is a family dedicated to honor and serve God using our skills and talents through music. Our aim is to usher people to spirit-led worship and minister to their thirst for God’s presence through prophetic worship. Our mission is to awaken and equip the hearts of worshippers, for we long to see the Body of Christ worshipping the Father in Spirit and in Truth.',
    tagline: 'Praying to serve in the Worship Team?',
    contact: 'olga-lomuntad',
    hashtag: '#RiverWorship',
    image: PHOTO_WORSHIP_WARM,
    tint: ['#6D28D9', '#C4B5FD'],
  },
  {
    slug: 'river-kids-teachers',
    title: 'River Kids Teachers',
    blurb: 'Where fun meets faith — from playtime to purpose.',
    description:
      'River Kids Ministry is a place where fun meets faith. We believe that every moment — from games and laughter to lessons and prayer — can lead a child closer to Jesus. Our heart is to guide children from simple playtime to discovering their God-given purpose. Through Bible-based teaching, creative activities, worship, and meaningful relationships, we help kids grow in character, confidence, and Christ.',
    tagline:
      'From playtime to purpose, walk with River Kids as they learn to follow Jesus wholeheartedly.',
    contact: 'aprile-liwanag',
    hashtag: '#RiverKidsTeachers',
    image: PHOTO_CONGREGATION,
    tint: ['#C2410C', '#FDBA74'],
  },
  {
    slug: 'river-families',
    title: 'River Families',
    blurb: 'Five life stages, one connected family.',
    description:
      'River Families Ministry is a vibrant community that embraces every stage of family life. At its core are five life stages — River Kids, River Youth, Young Adults, Adults, and Seasoned — each representing a unique season of growth and discipleship. Together, these layers form a loving and connected ministry where every person and every family can belong, be supported, and thrive in faith within the community.',
    tagline:
      'If you have a heart to walk alongside families, mentor the next generation, or help create spaces where every life stage can grow in Christ, this may be your opportunity to serve.',
    contact: 'nestor-and-sol-mendoza',
    hashtag: '#RiverFamilies',
    image: PHOTO_SEASONED,
    tint: ['#047857', '#6EE7B7'],
  },
  {
    slug: 'discipleship',
    title: 'Discipleship',
    blurb: 'Connecting people into the ROG spiritual family.',
    description:
      'Loving God and making disciples are essential to the vision of the Discipleship Team. We aim to equip and empower people to do the great commission. Our mission is to help VIPs and ROG members to grow in their relationship with God by connecting them to the River of God Spiritual Family, and eventually getting them into discipleship. Our aim is to encourage leaders to raise more leaders who are in love with God and are passionate in making disciples.',
    tagline:
      'If you love God and you have a heart to make disciples, then this may be an open door for you to serve Jesus.',
    contact: 'carissa-traigo',
    hashtag: '#Discipleship',
    image: PHOTO_EMBRACE,
    tint: ['#1D4ED8', '#93C5FD'],
  },
  {
    slug: 'cross-cultural',
    title: 'Cross Cultural',
    blurb: 'Completing the Great Commission, locally and globally.',
    description:
      "River Cross-Cultural Ministry is God's voice, bringing God's people back to God's agenda. We exist to take part in completing the remaining task of the Great Commission through equipping, edifying and mobilizing churches, both locally and globally.",
    tagline: 'Do you have the heart of Jesus for the lost? Do you feel called to missions?',
    contact: 'nica-moreno',
    hashtag: '#CrossCultural #ROGMissions #GreatCommission',
    image: PHOTO_HORIZON,
    tint: ['#1b7a70', '#8FD4C9'],
  },
]

const bySlug = new Map(ministries.map((m) => [m.slug, m]))

/** Throws on an unknown slug — a typo should fail in dev, not ship blank. */
export function ministry(slug: string): Ministry {
  const found = bySlug.get(slug)
  if (!found) throw new Error(`Unknown ministry slug: ${slug}`)
  return found
}

export function ministriesBySlugs(slugs: string[]): Ministry[] {
  return slugs.map(ministry)
}
