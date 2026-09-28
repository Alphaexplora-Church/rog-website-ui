/**
 * THE ONE LIST OF PEOPLE. Every name that appears anywhere on this site is
 * defined here exactly once and referenced everywhere else by slug.
 *
 * CREATED 2026-09-23 on Jude's call — "make sure that the data placeholders
 * are all the same… para pag inimplement tsaka inintegrate natin yung cms,
 * we wont encounter any issue."
 *
 * ⚠ WHAT IT WAS BEFORE: the same people were typed out in six different
 * files, and they already disagreed with each other.
 *
 *   - Bishop Chito and Pastor Rachel each existed THREE times on the About
 *     page alone — in FoundersSection (title "Founder"), in
 *     ApostolicTeamSection (four titles each, from riverofgod.ph) and in
 *     LeadershipBiosSection (a third title plus a long biography). Three
 *     records, one person, no link between them.
 *   - The six serving ministry heads existed in ServingMinistryHeadsSection
 *     on About AND as `contact` strings in ServiceMinistriesSection on the
 *     Ministries tab, with the role labels spelled differently in each:
 *     "Media & Production" vs "Media and Production", "Discipleship &
 *     Connect" vs "Discipleship".
 *   - Aprile Liwanag and Nestor and Sol Mendoza existed a third time as
 *     life stage coordinators on About.
 *
 * In Strapi this is one `person` collection that the leadership sections,
 * the ministry cards and the life-stage roster all relate to — so this file
 * is shaped like that collection returns, and the swap is one module.
 *
 * WHAT DOES *NOT* LIVE HERE: the role a person holds by virtue of running
 * something. Erika Garcia's "Ushering" is a fact about the Ushering
 * ministry, so it lives in `ministries.ts` and the roster reads it from
 * there; Aprile Liwanag's "River Kids" lives in `lifeStages.ts` the same
 * way. `roles` below is only for titles a person holds in their own right
 * (the Apostolic Team's, the Ortigas pastors'). That is what stops the two
 * spellings from ever coming back.
 */
export interface Person {
  /** Stable key; also the future CMS slug. */
  slug: string
  name: string
  /**
   * Titles this person holds in their own right, verbatim from
   * riverofgod.ph. Empty for people whose only listed role comes from a
   * ministry or life stage they lead — that role is read from those files.
   */
  roles: string[]
  /**
   * Short single-line title for the places that show one line rather than
   * the full stack (the founder pairing, the leadership biographies).
   */
  shortTitle?: string
  /** Long-form biography. Only the two founders have one. */
  bio?: string
  /** Published on the #SavedToServe recruitment cards. */
  phone?: string
  /** Named as a founder of River of God. */
  founder?: boolean
  /** Portrait under public/assets. ADDED 2026-09-25 — the three headshots
   *  that already ship with the H.I.M. Philippines page are reused here, so
   *  the same person has one photo everywhere. */
  photo?: string
}

export const people: Person[] = [
  // ── Apostolic Team ──────────────────────────────────────────────────
  // Roles verbatim from riverofgod.ph, confirmed 2026-09-22.
  {
    slug: 'chito-sanchez',
    photo: '/assets/him-philippines/chito-sanchez.webp',
    name: 'Bishop Augusto "Chito" Sanchez Jr.',
    founder: true,
    shortTitle: 'Founder & Senior Pastor',
    roles: [
      'Overseer of River of God Churches and Affiliates',
      'Commission Head, PCEC Transformation & Revival Commission',
      'Convenor, Philippine Council of Evangelical Bishops',
      'National Director, Harvest International Ministry – Philippines',
    ],
    bio: 'Bishop Chito is the Head of the Transformation and Revival Commission focusing on prayer for the Nation, a commission of the Philippine Council of Evangelical Churches (PCEC). He is one of the Bishops of PCEC and the convenor of the Philippine Council of Evangelical Bishops. In addition, he is appointed as the Regional Apostolic Coordinator of the Harvest International Ministry in the Philippines.\n\nHe is a revivalist by heart and is passionate about being intimately in love with Jesus Christ and the lost through evangelism and discipleship. He is at the forefront of a movement that conducts a series of free conferences and monthly revival meetings called Soaking in the River that has been running for more than ten years already. His message is clear: the genuine love that we have for Jesus will spark the great flame of transformation and revival from within ourselves, then it will spread to the entire nation of the Philippines and the rest of the world.',
  },
  {
    slug: 'rachel-sanchez',
    photo: '/assets/him-philippines/rachel-sanchez.webp',
    name: 'Pastor Rachel Sanchez',
    founder: true,
    shortTitle: 'Senior Pastor, River of God Ortigas',
    roles: [
      'Senior Pastor of River of God Ortigas',
      'Founder, Jesus Loves the Little Children Foundation',
      'Directress, Riversprings School',
      'Overseer, ROG Supernatural Institute',
    ],
    bio: 'Pastor Rachel is a teacher by heart and loves to impart her knowledge and personal encounter with the Holy Spirit that radically changed her life. She heads ROG Supernatural Ministry, which regularly conducts trainings and workshops open to the Body of Christ. Her passion is to see the saints activated in their spiritual gifts and operate in the supernatural realm through signs, wonders, miracles and healing — all for the purpose of expanding God’s Kingdom.\n\nHer love for children led her to open an orphanage twenty years ago, now converted into a school offering free quality Christian education to qualified students regardless of race, religion or economic status. She started a movement called Women Arise, encouraging women to rise up for Christ and proclaim the gospel boldly, walking in partnership with men.',
  },
  {
    slug: 'greeko-villanueva',
    photo: '/assets/him-philippines/greeko-villanueva.webp',
    name: 'Pastor Greeko Villanueva',
    roles: [
      'Discipleship and Connect Pastor',
      'ROG Daughter Churches & Affiliates Coordinator',
      'River Families and Seasoned Overseer',
    ],
  },
  {
    slug: 'roselyn-arcelo',
    name: 'Pastor Roselyn Arcelo',
    roles: ['Administration Pastor', 'Pastoral Care & Counseling', 'River Women Overseer'],
  },
  {
    slug: 'mark-libunao',
    name: 'Pastor Mark Libunao',
    roles: [
      'Personal Assistant to Bp. Chito Sanchez',
      'Creative Arts & River Men Overseer',
      'Dean, River Biblical Supernatural Institute',
    ],
  },

  // ── River of God Ortigas pastors ────────────────────────────────────
  // ⚠ ROLE TITLES STILL PLACEHOLDER, carried over unchanged from
  // OrtigasPastorsSection's own long-standing flag: the pasted source came
  // through with names and role lines separated, and the pairing is not
  // reliably recoverable. Attributing the wrong ministry to a named pastor
  // is worse than staying generic, so all five read "River of God Ortigas"
  // until Jude confirms the mapping.
  { slug: 'tin-corpus', name: 'Pastor Tin Corpus', roles: ['River of God Ortigas'] },
  {
    slug: 'abigail-sanchez-flores',
    name: 'Pastor Abigail Sanchez-Flores',
    roles: ['River of God Ortigas'],
  },
  { slug: 'rodel-buban', name: 'Pastor Rodel Buban', roles: ['River of God Ortigas'] },
  { slug: 'khristine-lacsina', name: 'Pastor Khristine Lacsina', roles: ['River of God Ortigas'] },
  { slug: 'jethro-mendoza', name: 'Pastor Jethro Mendoza', roles: ['River of God Ortigas'] },

  // ── Serving ministry heads ──────────────────────────────────────────
  // Names and numbers from the #SAVEDTOSERVE cards on riverofgod.ph, which
  // Jude confirmed as authoritative ("follow the details ng service
  // ministries sa official website"). Their role is the ministry they run —
  // see `ministries.ts`, not a `roles` entry here.
  { slug: 'erika-garcia', name: 'Erika Garcia', roles: [], phone: '09338112473' },
  { slug: 'joy-mallari', name: 'Joy Mallari', roles: [], phone: '09972249914' },
  { slug: 'jieyan-antonio', name: 'Jieyan Antonio', roles: [], phone: '09947498070' },
  { slug: 'olga-lomuntad', name: 'Olga Lomuntad', roles: [], phone: '0928487771' },
  { slug: 'carissa-traigo', name: 'Carissa Traigo', roles: [], phone: '09171163975' },
  { slug: 'nica-moreno', name: 'Nica Moreno', roles: [], phone: '09616058244' },

  // These two head a serving ministry AND coordinate a life stage, which is
  // exactly why they used to appear in three separate arrays.
  { slug: 'aprile-liwanag', name: 'Aprile Liwanag', roles: [], phone: '09178320417' },
  {
    slug: 'nestor-and-sol-mendoza',
    name: 'Nestor and Sol Mendoza',
    roles: [],
    phone: '09176510919',
  },

  // ── Life stage coordinators with no other listed role ───────────────
  { slug: 'nhea-tagalog', name: 'Nhea Tagalog', roles: [] },
  { slug: 'mikee-chester', name: 'Mikee Chester', roles: [] },
  { slug: 'allan-santiago', name: 'Allan Santiago', roles: [] },
  { slug: 'bojie-ignacio', name: 'Bojie Ignacio', roles: [] },
  { slug: 'rosalin-co', name: 'Rosalin Co', roles: [] },
]

const bySlug = new Map(people.map((p) => [p.slug, p]))

/**
 * Look up one person. Throws on an unknown slug rather than rendering a
 * blank name — a typo in a slug should fail loudly in dev, not ship a card
 * with an empty line where somebody's name belongs.
 */
export function person(slug: string): Person {
  const found = bySlug.get(slug)
  if (!found) throw new Error(`Unknown person slug: ${slug}`)
  return found
}

export function peopleBySlugs(slugs: string[]): Person[] {
  return slugs.map(person)
}

/** The two founders, in the order they are listed above. */
export function founders(): Person[] {
  return people.filter((p) => p.founder)
}
