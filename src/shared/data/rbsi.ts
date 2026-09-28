/**
 * RBSI — River Biblical Supernatural Institute. Single-sourced here; read by
 * the `/about/rbsi` page.
 *
 * CREATED 2026-09-28 from the old riverofgod.ph RBSI page Jude sent (banner
 * screenshot + copy). Copy is ROG's own and is reproduced as given — the aim,
 * vision and mission keep their original capitalisation.
 *
 * Images: the photo is Jude's own public/assets/rog/RBSI-photo.jpg, used
 * as-is. The crest is his RBSI-logo.png trimmed to its edges and re-saved as
 * public/assets/rog/rbsi/rbsi-crest.webp; it is white-on-transparent, so the
 * page draws it as a CSS mask in the ground's ink.
 */

export const rbsi = {
  name: 'River Biblical Supernatural Institute',
  short: 'RBSI',
  established: 2024,
  tagline: 'A Bible school within reach!',
  promises: ['Conveniently Accessible', 'Intently Economical', 'Purposely Familial'],
  crest: '/assets/rog/rbsi/rbsi-crest.webp',
  photo: '/assets/rog/RBSI-photo.jpg',
  heroImage: '/assets/rog/rbsi/rbsi-library.webp',

  aim: 'River Biblical Supernatural Institute’s aim is the equipping and edifying of Church Ministers, Leaders and Believers by the effective and transformative biblical and experiential knowledge of the Holy Scriptures for the end-times discipling of the nations.',

  scripture: {
    text: 'Be diligent to present yourself approved to God, a worker who does not need to be ashamed, rightly dividing the word of truth.',
    ref: '2 Timothy 2:15 (NKJV)',
  },

  vision:
    'A Bible Institute which sufficiently and effectively provides the Church leadership the Biblical Knowledge and Skills in Handling the Word of God for the building up the Body of Christ in Love and the Discipling of the Nations.',

  mission:
    'To Establish our Students in the Knowledge of the Infallible and Eternal Word of God for a Life of Intimacy with and Conformity to the Character of the Son of God for Effective and Faithful Service in His Kingdom.',

  partners: {
    title: 'Partners in Ministry',
    body: 'PARTNERS IN MINISTRY (PIM) is partnering with God in the Great Commission. It is a worthy and big task. PIM releases funds into missions toward the accomplishment of the Great Commission. We become fellow workers in the Lord’s service when we support the ministry of others; publicly as well as financially.',
    scripture: {
      text: 'After this, Jesus traveled about from one town and village to another, proclaiming the good news of the kingdom of God. The Twelve were with him, and also some women who had been cured of evil spirits and diseases: Mary (called Magdalene) from whom seven demons had come out; Joanna the wife of Chuza, the manager of Herod’s household; Susanna; and many others. These women were helping to support them out of their own means.',
      ref: 'Luke 8:1-3',
    },
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSf3rFcvg5gDQL0r3bkgaHlHkJ7yn_64Gr54OanivpKCq-QGNA/viewform',
  },
} as const
