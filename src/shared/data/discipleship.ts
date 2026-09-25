/**
 * THE DISCIPLESHIP PROCESS — River of God's five stages, single-sourced.
 *
 * CREATED 2026-09-25 from the two slide decks Jude sent: the per-stage
 * slides (scripture / goal / tools / environment) and the "Discipleship
 * Process" diagram (stage → study material → description). Both describe
 * the same five stages, so each stage is ONE record here. Read by the
 * `/discipleship` page, the Home "Five crossings" section and the About
 * teaser — never retyped in a view.
 *
 * Copy is reproduced as given in ROG's own material (including the
 * Encounter material line ending "...know the Holy Spirit"); it is doctrine
 * from the church, not website copy to rewrite.
 *
 * `color` is each stage's identity colour from the source slides (gold /
 * blue / purple / green / red) — used only as a tint inside that stage's own
 * panel, never as site chrome. `image` is a text-free crop of the photo on
 * that stage's slide (public/assets/rog/stage-*.webp). CMS home when wired:
 * a `discipleship-stage` collection with the same fields.
 */

export interface DiscipleshipScripture {
  ref: string
  text: string
}

export interface DiscipleshipMaterial {
  name: string
  description: string
}

export interface DiscipleshipStage {
  key: string
  title: string
  color: string
  image: string
  scriptures: DiscipleshipScripture[]
  goal: string
  tools: string
  environment: string
  materials: DiscipleshipMaterial[]
}

export const discipleshipStages: DiscipleshipStage[] = [
  {
    key: 'encounter',
    image: '/assets/rog/stage-encounter.webp',
    title: 'Encounter',
    color: '#b8902f',
    scriptures: [
      {
        ref: 'Matthew 22:37-38',
        text: "Jesus replied: 'Love the Lord your God with all your heart and with all your soul and with all your mind.' This is the first and greatest commandment.",
      },
    ],
    goal: 'Intimacy',
    tools: 'Holy Bible',
    environment: 'Personal Prayer & Devotion, Soaking in the River, Prayer Meeting',
    materials: [
      {
        name: 'Holy Bible',
        description:
          'We were all created for an intimate relationship with God. Reading and studying the Holy Bible, along with prayer and intimate worship, is where we encounter and know the Holy Spirit.',
      },
    ],
  },
  {
    key: 'evangelize',
    image: '/assets/rog/stage-evangelize.webp',
    title: 'Evangelize',
    color: '#1f4fb0',
    scriptures: [
      {
        ref: 'Acts 1:8',
        text: 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.',
      },
      {
        ref: 'Luke 19:10',
        text: 'For the Son of Man came to seek and to save what was lost.',
      },
    ],
    goal: 'Preach the Gospel',
    tools: 'Holy Bible, One2One, One Verse Evangelism',
    environment: 'Outreaches',
    materials: [
      {
        name: 'One 2 One',
        description:
          "A personal discipleship guide to help facilitate conversations to jumpstart someone's walk with God. It is a tool to engage people, communicate the gospel to them, and help them follow Jesus.",
      },
    ],
  },
  {
    key: 'establish',
    image: '/assets/rog/stage-establish.webp',
    title: 'Establish',
    color: '#5b2f8f',
    scriptures: [
      {
        ref: 'Matthew 7:24-27',
        text: 'Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock. The rain came down, the streams rose, and the winds blew and beat against that house; yet it did not fall, because it had its foundation on the rock. But everyone who hears these words of mine and does not put them into practice is like a foolish man who built his house on sand. The rain came down, the streams rose, and the winds blew and beat against that house, and it fell with a great crash.',
      },
    ],
    goal: 'Establish in Faith, Word, Prayer, and the Church',
    tools: 'Spiritual Family, Purple Book, Experiencing Victory',
    environment: 'Life Group, Classes, River Weekend',
    materials: [
      {
        name: 'Spiritual Family',
        description:
          'A study manual for understanding church, ministry and spiritual family life in River of God as a global family of churches and ministries.',
      },
      {
        name: 'Purple Book',
        description:
          "A personal Bible study guide for establishing biblical foundations for building strong disciples. It is designed to help believers develop the discipline of reading and studying God's Word on the basic topics of Christianity — sin and salvation, Lordship & obedience, repentance & baptism.",
      },
      {
        name: 'River Weekend',
        description:
          'A two-day retreat to help participants understand and walk in the freedom Christ won for us at the cross. Participants must complete the Preparing for Victory material before attending — a personal Bible study guide that prepares them for the retreat.',
      },
    ],
  },
  {
    key: 'equip',
    image: '/assets/rog/stage-equip.webp',
    title: 'Equip',
    color: '#1f7a4d',
    scriptures: [
      {
        ref: 'Matthew 4:19',
        text: "'Come, follow me,' Jesus said, 'and I will make you fishers of men.'",
      },
      {
        ref: 'Ephesians 4:11-12',
        text: "It was he who gave some to be apostles, some to be prophets, some to be evangelists, and some to be pastors and teachers, to prepare God's people for works of service, so that the body of Christ may be built up.",
      },
    ],
    goal: 'Equip in Basic Ministry Skills',
    tools: 'Making Disciples',
    environment: 'Life Group, Making Disciples Class',
    materials: [
      {
        name: 'Making Disciples',
        description:
          'A study guide made to equip believers to share the gospel and make disciples through life groups.',
      },
    ],
  },
  {
    key: 'empower',
    image: '/assets/rog/stage-empower.webp',
    title: 'Empower',
    color: '#a91f2c',
    scriptures: [
      {
        ref: 'Matthew 28:19-20',
        text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.',
      },
      {
        ref: '2 Timothy 2:2',
        text: 'And the things you have heard me say in the presence of many witnesses entrust to reliable men who will also be qualified to teach others.',
      },
    ],
    goal: 'Make Disciples with Confidence and Competence',
    tools: 'Empowering Leaders',
    environment: 'Life Group, Empowering Leaders Class, Internship, Commissioning',
    materials: [
      {
        name: 'Empowering Leaders',
        description:
          'A study guide to help disciples become leaders who develop other leaders — through Internship, where potential leaders watch and follow other leaders and are given opportunities to serve.',
      },
    ],
  },
]

export const discipleshipAcknowledgement =
  "We recognize Every Nation Ministries who are our partners in ministry, and we honor them for giving us permission to use their discipleship materials for our church — we have adapted these materials into the River of God culture and structure, creating our own discipleship process."
