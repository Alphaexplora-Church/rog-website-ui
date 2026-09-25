export interface HimLeader {
  name: string
  portrait: string
  roles: readonly string[]
}

const portraits = {
  cheAhn: '/assets/him-philippines/che-ahn.webp',
  chitoSanchez: '/assets/him-philippines/chito-sanchez.webp',
  rachelSanchez: '/assets/him-philippines/rachel-sanchez.webp',
  reyPeBenito: '/assets/him-philippines/rey-pe-benito.webp',
  artJornales: '/assets/him-philippines/art-jornales.webp',
  tedMalangen: '/assets/him-philippines/ted-malangen.webp',
  noelPantoja: '/assets/him-philippines/noel-pantoja.webp',
  frankSantos: '/assets/him-philippines/frank-santos.webp',
  richConte: '/assets/him-philippines/rich-conte.webp',
  leahValino: '/assets/him-philippines/leah-valino.webp',
  greekoVillanueva: '/assets/him-philippines/greeko-villanueva.webp',
} as const

export const himIntroduction =
  'Harvest International Ministry (HIM) is an international Apostolic Network dedicated to advancing the Kingdom of God by equipping leaders, multiplying churches, evangelizing, discipleship, and bringing revival and reformation to the nations.'

/** The mission's closing line, set as display type on the page. */
export const himMotto = ['Changing Lives.', 'Transforming Cities.', 'Discipling Nations.'] as const

/** Hero facts. Each one is taken from existing page copy: "over 65 nations"
 *  (vision), the 12 core values, and the PCEC membership statement. */
export const himNetworkFacts = [
  { value: '65+', label: 'Nations in the global network' },
  { value: '12', label: 'Core values we share' },
  { value: 'PCEC', label: 'Member council in the Philippines' },
] as const

/** DRAFT — written from the leaders' own role lines below (Bp. Chito Sanchez:
 *  "National Director, Philippines"; Ps. Rachel Sanchez: "HIM Apostles").
 *  Confirm the wording with the church before launch. */
export const himRiverOfGodConnection =
  'River of God is part of the Harvest International Ministry family. Our overseer, Bishop Chito Sanchez, serves as HIM’s National Director for the Philippines, and Pastor Rachel Sanchez serves among the HIM Apostles.'

export const himMission =
  'We believe the Church is meant to grow like a family. As we intentionally build relationships across cultural and generational lines, the Kingdom of God continues to impact and transform countless lives, hearts and homes around the world. Together we advance with this mission: Changing Lives, Transforming Cities, Discipling Nations.'

export const himVision =
  'God-breathed prophetic words released over many generations have given rise to a growing global apostolic network that is impacting lives in over 65 nations around the world. United, we are committed to this vision: advancing the Kingdom of God by equipping leaders, evangelizing, and bringing revival and reformation to the nations.'

export const apostolicCouncil: readonly HimLeader[] = [
  {
    name: 'Dr. Ché Ahn',
    portrait: portraits.cheAhn,
    roles: ['HIM President/Presiding Apostle', 'WLI International Chancellor', 'Senior Pastor of HRock Church'],
  },
  {
    name: 'Bp. Augusto “Chito” Sanchez',
    portrait: portraits.chitoSanchez,
    roles: [
      'Overseer — River of God Churches and Affiliates',
      'PCEC Transformation and Revival',
      'National Director, Philippines',
      'HIM Apostles',
    ],
  },
  {
    name: 'Ps. Rachel Sanchez',
    portrait: portraits.rachelSanchez,
    roles: [
      'Senior Pastor, River of God Ortigas',
      'Overseer, River of God Supernatural Institute',
      'HIM Apostles',
    ],
  },
  {
    name: 'Bp. Rey Pe Benito',
    portrait: portraits.reyPeBenito,
    roles: ['Senior Pastor, Jesus Loves You City Church'],
  },
  {
    name: 'Bp. Art Jornales',
    portrait: portraits.artJornales,
    roles: ['Senior Pastor, Jesus New Creation International Church'],
  },
  {
    name: 'Bp. Ted Malangen',
    portrait: portraits.tedMalangen,
    roles: ['Senior Pastor, Jesus Christ the Deliverer Church'],
  },
]

export const himBoardMembers: readonly HimLeader[] = [
  {
    name: 'Bp. Chito Sanchez',
    portrait: portraits.chitoSanchez,
    roles: ['Overseer, River of God Churches and Affiliates'],
  },
  {
    name: 'Bp. Noel Pantoja',
    portrait: portraits.noelPantoja,
    roles: ['National Director, Philippine Council of Evangelical Churches'],
  },
  {
    name: 'Bp. Frank Santos',
    portrait: portraits.frankSantos,
    roles: ['Senior Pastor, Tarlac First Baptist Church'],
  },
  {
    name: 'Bp. Rich Conte',
    portrait: portraits.richConte,
    roles: ['Senior Pastor, Victory Churches of Asia (VCA)'],
  },
  {
    name: 'Bp. Ted Malangen',
    portrait: portraits.tedMalangen,
    roles: ['Senior Pastor, Jesus Christ the Deliverer Church'],
  },
  {
    name: 'Bp. Rey Pe Benito',
    portrait: portraits.reyPeBenito,
    roles: ['Senior Pastor, Jesus Loves You City Church'],
  },
  {
    name: 'Bp. Art Jornales',
    portrait: portraits.artJornales,
    roles: ['Senior Pastor, Jesus New Creation International Church'],
  },
  {
    name: 'Ps. Rachel Sanchez',
    portrait: portraits.rachelSanchez,
    roles: ['Senior Pastor, River of God Ortigas'],
  },
  {
    name: 'Ps. Leah Valino',
    portrait: portraits.leahValino,
    roles: ["Pastor, Ever Increasing Church Int'l"],
  },
]

export const himSecretary: HimLeader = {
  name: 'Ps. Greeko Villanueva',
  portrait: portraits.greekoVillanueva,
  roles: ['Assistant to National Director'],
}

export type HimLeaderGroup = 'Apostolic Council' | 'Board' | 'Secretary and Staff'

export interface HimLeaderProfile extends HimLeader {
  groups: readonly HimLeaderGroup[]
}

const normalizeRole = (role: string) =>
  role.toLowerCase().replace(/\s*[—–-]\s*/g, ', ').replace(/\s+/g, ' ').trim()

/** One entry per person. Five leaders sit on both the Council and the Board;
 *  they appear once here with both group tags, keeping the Council spelling of
 *  their name and every distinct role line from either group. */
function mergeLeaders(groups: readonly [HimLeaderGroup, readonly HimLeader[]][]) {
  const byPortrait = new Map<string, { name: string; portrait: string; roles: string[]; groups: HimLeaderGroup[] }>()
  for (const [group, leaders] of groups) {
    for (const leader of leaders) {
      const existing = byPortrait.get(leader.portrait)
      if (!existing) {
        byPortrait.set(leader.portrait, { ...leader, roles: [...leader.roles], groups: [group] })
        continue
      }
      if (!existing.groups.includes(group)) existing.groups.push(group)
      const known = new Set(existing.roles.map(normalizeRole))
      for (const role of leader.roles) {
        if (!known.has(normalizeRole(role))) existing.roles.push(role)
      }
    }
  }
  return [...byPortrait.values()] as HimLeaderProfile[]
}

export const himLeadership: readonly HimLeaderProfile[] = mergeLeaders([
  ['Apostolic Council', apostolicCouncil],
  ['Board', himBoardMembers],
  ['Secretary and Staff', [himSecretary]],
])

export interface HimCoreValue {
  label: string
  paragraphs: readonly string[]
}

export const himCoreValuesIntroduction =
  "HIM's 12 Core Values resonate throughout our Global Apostolic Family as Biblical principles that are characteristic of our revival and reformation movement."

export const himCoreValues: readonly HimCoreValue[] = [
  {
    label: 'Christlike Character',
    paragraphs: [
      'We love God and want to be like Him because He first loved us; therefore, we will love God with all of our heart, soul, mind, and strentgh. Matthew 22:37',
    ],
  },
  {
    label: 'Kingdom',
    paragraphs: [
      "We can only experience Jesus' promise of life and life more abundantly by embracing a Kingdom of Heaven that has come to earth.",
    ],
  },
  {
    label: 'Apostolic and Prophetic',
    paragraphs: [
      'Jesus gave us gifts. Among them the apostolic and prophetic; these gifts are for today, not for an appointed time in the future. (Ephesians 4:11-12)',
      'HIM was birthed from a prophetic word and was intentionally formed to be an apostolic network that provides apostolic alignment as we advance the Kingdom with Spirit-empowered ministry. Because God first reveals His plans “to His servants the prophets,” we continually seek to discern the times and seasons while going from glory to glory. (Amos 3:7; 1 Chronicles 12:32; 2 Corinthians 3:18)',
    ],
  },
  {
    label: 'Worship',
    paragraphs: ['God is good, and He is worthy to be praised adored, and worshipped.'],
  },
  {
    label: 'Church',
    paragraphs: [
      'We are called to love and to expand His church, but we are not building it; Jesus has already built His church.',
    ],
  },
  {
    label: 'Presence',
    paragraphs: [
      'Because the presence of God makes all things possible, we cultivate His presence in our environment.',
    ],
  },
  {
    label: 'Word',
    paragraphs: ["God's word is filled with His power and presence; we exalt His Word over our desires."],
  },
  {
    label: 'Family',
    paragraphs: ['Our identity and the value we place on each life is formed in a godly family.'],
  },
  {
    label: 'Commission',
    paragraphs: [
      'We are called to love others outside of our family; thus, commissioning people to love and serve others within the context of their calling is vital.',
    ],
  },
  {
    label: 'Discipleship',
    paragraphs: ["The value we place on God's Word means nothing if we do not study it and apply it."],
  },
  {
    label: 'Revival',
    paragraphs: [
      'God loves us too much to leave us where we are; we seek revival to usher in all that He has for us in the present season.',
    ],
  },
  {
    label: 'Intercession and Prayer',
    paragraphs: [
      "As God's people, we are called to humble ourselves, pray fervently, seek His face together, and repent of our sins in faith so that He will hear us, forgive us, and heal our nation and land.",
    ],
  },
]

export const statementOfFaithIntroduction =
  'Our statement of faith reflects the truths we believe as one global apostolic family. With this foundation of faith, we advance the Kingdom of God on earth as in heaven.'

export interface HimFaithStatement {
  summary: string
  text: string
}

export const statementOfFaith: readonly HimFaithStatement[] = [
  {
    summary: 'One true God, revealed in the Trinity',
    text: 'We believe in one true God, revealed in the Trinity of the Father, Son, and Holy Spirit.',
  },
  {
    summary: 'The divinity of Jesus Christ',
    text: 'We believe in the divinity of Jesus Christ, who, as eternal God, came to earth, took on flesh, and lived among His creation.',
  },
  {
    summary: 'Jesus Christ was born of the Virgin Mary',
    text: 'We believe that Jesus Christ was born of the Virgin Mary, lived, was crucified, died, buried, and rose from the dead after three days and ascended into heaven, where He now sits at the right hand of the Father.',
  },
  {
    summary: 'The Bible is the only inspired, inerrant Word of God',
    text: 'We believe the Bible is the only inspired, inerrant Word of God and is useful for teaching, rebuking, correcting, and training in righteousness, whose integrity has been preserved through the ages.',
  },
  {
    summary: 'A person can receive eternal life',
    text: 'We believe that a person can receive eternal life by accepting the Grace of Jesus Christ for the forgiveness of their sins through faith in Him and His perfect and final atonement on the cross.',
  },
  {
    summary: 'The Final Judgment and the bodily return of Jesus Christ',
    text: 'We believe in the Final Judgment of believers and the lost and the bodily return of Jesus Christ.',
  },
  {
    summary: 'Water Baptism and Holy Communion',
    text: 'We believe in the Sacraments as directed by our Lord Jesus in the Scriptures: Water Baptism, as a public demonstration of faith in Jesus Christ and Holy Communion.',
  },
  {
    summary: 'Baptism in the Holy Spirit and spiritual gifts',
    text: 'We believe in the Baptism in the Holy Spirit and the expression of all the gifts of the Spirit as valid and relevant for today as well as apostolic ministry, prophetic ministry, women in ministry, renewal in the Holy Spirit, and worldwide revival or awakening in the end times.',
  },
]

export const himMembershipStatement =
  'Harvest International Ministry (HIM) Philippines is a member of the Philippine Council of Evangelical Churches (PCEC) thereby every local church and affiliate under HIM Philippines is automatically a member of PCEC.'

export const himApplicationForm =
  '/assets/him-philippines/H.I.M.-Philippines-Application-Form-2025-100.pdf'

export const himDpoBadge = '/assets/him-philippines/dpo-dps-badge.png'
export const himLogo = '/assets/him-philippines/him-logo.webp'
export const himHeroImage = '/assets/him-philippines/hero-worship.webp'
