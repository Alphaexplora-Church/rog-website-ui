/**
 * ACTIVATE — the yearly Holy Spirit conference of PCEC Transformation &
 * Revival and River of God. Single-sourced here; read by the `/activate12`
 * page and its two past-conference pages (`/activate12/activate-11`,
 * `/activate12/activate-10`).
 *
 * CREATED 2026-09-28 from the old riverofgod.ph pages Jude sent
 * (screenshots + copy). Copy is ROG's own and is reproduced as given,
 * including each speaker's bio.
 *
 * Images: the Activate 12 photos are crops of the old site's slides (the
 * text-free parts only); the Activate 10 / 11 logos are the files Jude saved
 * in public/assets/rog, trimmed and re-saved under public/assets/rog/activate.
 * The logos are single-colour on transparent, so the views draw them as a
 * CSS mask and colour them with the ground's ink.
 *
 * CMS home when wired: an `activate-conference` collection with these fields
 * (speakers as a repeatable component or a relation to `person`).
 */

export interface ActivateSpeaker {
  name: string
  church?: string
  bio: string
  /** Portrait under public/assets — only for people the site already has a
   *  photo of. Everyone else gets a monogram. */
  photo?: string
}

export interface ActivateAim {
  text: string
  image?: string
}

export interface ActivateConference {
  slug: 'activate-12' | 'activate-11' | 'activate-10'
  /** Route of this conference's own page. */
  to: string
  edition: number
  /** "Activate 11" */
  name: string
  /** The year's theme, e.g. "Come Holy Spirit 2". */
  theme?: string
  /** The hero title, one entry per line (each line gets its own mask). */
  heroTitle?: string[]
  /** Mask image (single-colour logo) for the past-conference cards/heroes. */
  logo?: string
  logoAspect?: string
  /** YouTube video id — recap / conference video. */
  videoId: string
  videoTitle: string
  about?: string
  goals: string[]
  speakers: ActivateSpeaker[]
  /** Slug of the conference before this one, for the "previous" link. */
  previous?: ActivateConference['slug']
}

/** Activate's own one-line definition, from the Activate 12 slides. */
export const activateDefinition =
  "To be consumed by the fire of the Holy Spirit to forcefully advance God's Kingdom."

/** The four aims as the Activate 12 slides phrase them, each with its photo. */
export const activate12Aims: ActivateAim[] = [
  {
    text: 'Activating believers to walk in the supernatural and experience the outpouring of the Holy Spirit through signs, wonders, miracles, impartation of spiritual gifts, healing, and deliverance.',
    image: '/assets/rog/activate/a12-hands.webp',
  },
  {
    text: 'To unite the Body of Christ to encounter the Holy Spirit and be transformed and empowered by His presence.',
    image: '/assets/rog/activate/a12-stage.webp',
  },
  {
    text: 'To awaken believers to the supernatural reality and live out their Kingdom calling on earth.',
    image: '/assets/rog/activate/a12-arms.webp',
  },
  {
    text: 'To see revival in our generation marked by healing, prophetic encounters, and total freedom in Christ.',
    image: '/assets/rog/activate/a12-spirit.webp',
  },
]

export const activate12Invitation = {
  lead: 'Ready for an encounter?',
  /** The slide reads "Be activated. Be transformed, not by might…" — the
   *  view sets "Be activated." as the headline and this as the line under it. */
  body: 'Be transformed, not by might or power, but by the Spirit of the living God.',
  date: 'September 19, 2026',
}

/** Who to call about Activate — the same on every Activate page. */
export const activateContact = {
  landline: '(02) 8470 1439',
  landlineHref: 'tel:+63284701439',
  mobile: '+63 917 100 0570',
  mobileHref: 'tel:+639171000570',
  person: 'Pastor Mark Libunao',
  facebookLabel: 'PCEC Transformation and Revival',
  facebook: 'https://www.facebook.com/pcectfcom',
}

const goals = [
  'To gather the Body of Christ in unity to lead them to encounter the Holy Spirit and His wonderful presence that brings transformation and empowerment in the lives of the believer.',
  'To awaken the believers to the reality of the supernatural realm and how we are to live out our calling as Kingdom people anointed by God to bring His Kingdom on earth.',
  'To prepare and equip the Body of Christ to forcefully advance the Kingdom under the power of the Holy Spirit.',
  'To usher in revival through the impartation of the fire of the Holy Spirit that will result in the healing of the sick, encouragement through prophecy, freedom from bondages and strongholds.',
]

const chito: ActivateSpeaker = {
  name: 'Bishop Chito Sanchez',
  church: 'River of God',
  photo: '/assets/him-philippines/chito-sanchez.webp',
  bio: 'He is a revivalist by heart and is passionate about being intimately in love with Jesus Christ and the lost through evangelism and discipleship. He spearheads the Transformation and Revival Commission of the Philippine Council of Evangelical Churches (PCEC) and conducts a series of free conferences and monthly revival meetings called Soaking in the River that has been running for more than ten years. He is the Bishop and Overseer of more than three hundred River of God churches and affiliates here and abroad and also heads a network of apostolic and prophetic churches in the Philippines under Harvest International Ministry.',
}

const rachel: ActivateSpeaker = {
  name: 'Pastor Rachel Sanchez',
  church: 'River of God',
  photo: '/assets/him-philippines/rachel-sanchez.webp',
  bio: "She is a teacher by heart and loves to impart her knowledge and personal encounter with the Holy Spirit that radically changed her life. She is the Senior Pastor of River of God Ortigas and heads ROG Supernatural Ministry that regularly conducts training and workshops which are open for the Body of Christ. Her passion is to see the saints activated in their spiritual gifts and operate in the supernatural realm through signs, wonders, miracles and healing all for the purpose of expanding God's Kingdom.",
}

const ted: ActivateSpeaker = {
  name: 'Bishop Ted Malangen',
  church: 'Jesus Christ the Deliverer Church',
  photo: '/assets/him-philippines/ted-malangen.webp',
  bio: 'He is the Founder and President of Jesus Christ the Deliverer Church. He is the Bishop and Overseer of more than one hundred twenty churches here and abroad. Married to Rev. Lily Malangen, God blessed them with 2 amazing children. His message is clear - he is called to preach the Gospel; to heal the sick and cast out demons; to equip the Body of Christ to know and move in their Godly-given authority.',
}

export const activateConferences: ActivateConference[] = [
  {
    slug: 'activate-12',
    to: '/activate12',
    edition: 12,
    name: 'Activate 12',
    theme: 'Consuming Fire',
    videoId: 'Z-waLnP-s4U',
    videoTitle: 'Activate 12 Recap',
    goals: [],
    speakers: [],
    previous: 'activate-11',
  },
  {
    slug: 'activate-11',
    to: '/activate12/activate-11',
    edition: 11,
    name: 'Activate 11',
    theme: 'Come Holy Spirit 2',
    heroTitle: ['Come Holy', 'Spirit 2'],
    logo: '/assets/rog/activate/activate-11-logo.webp',
    logoAspect: 'aspect-[365/251]',
    videoId: '0PbKCfUmKs8',
    videoTitle: 'Activate 11 — Come Holy Spirit 2',
    about:
      'Activate 11 is the eleventh installment of the ACTIVATE conferences that are held annually by the PCEC-Transformation and Revival and the River of God church. It aims to activate believers to walk in the supernatural realm and experience the outpouring presence of the Holy Spirit through signs, wonders, miracles, impartation of spiritual gifts, healing and deliverance!',
    goals,
    speakers: [
      chito,
      rachel,
      ted,
      {
        name: 'Pastor Vlad Savchuk',
        church: 'HungryGen',
        bio: 'Vladimir Savchuk is the lead pastor of HungryGen Church, a multicultural congregation focused on soul-winning, healing, and developing young leaders. He is also an author, YouTuber, and traveling preacher, and he offers free e-courses on his online platform, VladSchool, to make theology and Christian living accessible worldwide. Born in Ukraine and moving to the U.S. at 13, Vladimir became a youth pastor at 16 and gained recognition for his preaching style. He shares his ministry with his wife, Lana, impacting both his local community and a global audience.',
      },
      {
        name: 'Dr. Ché Ahn',
        church: 'Harvest International Ministry',
        photo: '/assets/him-philippines/che-ahn.webp',
        bio: 'Ché Ahn and his wife, Sue, have been the Senior Pastors of Harvest Rock Church in Pasadena, California, since 1994. Ché is the President of Harvest International Ministry, an apostolic network in over 65 nations, and the International Chancellor of Wagner University. He received his M.Div. and D.Min. from Fuller Theological Seminary and has authored numerous books. Ché and Sue have been married for over 42 years. They have four wonderful, married adult children and a growing number of grandchildren.',
      },
    ],
    previous: 'activate-10',
  },
  {
    slug: 'activate-10',
    to: '/activate12/activate-10',
    edition: 10,
    name: 'Activate 10',
    heroTitle: ['Activate', 'Ten'],
    logo: '/assets/rog/activate/activate-10-logo.webp',
    logoAspect: 'aspect-[452/158]',
    videoId: 'A-Weyj1tMCw',
    videoTitle: 'Activate 10',
    about:
      'Activate 10 is the tenth installment of the ACTIVATE conferences that are held annually by the PCEC-Transformation and Revival and the River of God church. It aims to activate believers to walk in the supernatural realm and experience the outpouring presence of the Holy Spirit through signs, wonders, miracles, impartation of spiritual gifts, healing and deliverance!',
    goals,
    speakers: [
      { ...chito, church: undefined },
      { ...rachel, church: undefined },
      { ...ted, church: undefined },
      {
        name: 'Bishop Val Febrer',
        bio: 'He is the Founder and Vision Keeper of Gising Kabataan Fired-Up Movement. He is also the overall Spiritual Director and Senior Pastor of the church of JCPSMI located in Mandaluyong City. God is using him to awaken and stir up the hearts of the believers to be a difference maker not only in the Philippines but all over the world. He has done international missions across the globe ministering and sharing about Jesus.',
      },
      {
        name: 'Pastor Hiram Pangilinan',
        bio: 'He is the Senior Pastor of Church So Blessed. He is an anointed author of best-selling books focused on healing, deliverance, spiritual warfare, revival, and signs and wonders. He is blessed with a God-fearing wife and is a father to three lovely children. He is deeply in love with the Lord Jesus.',
      },
      {
        name: 'Tobi Arayomi',
        bio: 'He is the founder, alongside his wife, Pastor Nicola Arayomi, of Light London Church and a Trustee of Christian International Europe, headed by Dr. Sharon Stone in the UK. Light London Church is an apostolic movement devoted to revival and reformation, which was established in 2017 and has since seen exponential growth in all areas. The church was founded on the premise of birthing and equipping wholesome leaders to influence the seven culture shapers of society (Government, Business, Education, Arts & Entertainment, Media, Family and Religion) through intense discipleship and training. It is a prophetic ministry that teaches people to hear the voice of God and speaks what He says, and it not only builds and develops its own members but also aims to reform and develop a culture in London through its leadership, members and teachings.',
      },
    ],
  },
]

export function findActivateConference(slug: string | undefined): ActivateConference | undefined {
  return activateConferences.find((c) => c.slug === slug)
}
