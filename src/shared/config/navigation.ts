/**
 * The navigation tree — your grouping, exactly as specified.
 *
 * This is static config, not a model, so it lives in shared/config/ rather
 * than shared/models/. It never round-trips to the API and no ViewModel owns
 * it; the Navbar reads it directly, which is the one case Doc 4 §3.2 allows a
 * View to import data (static, build-time, no fetch).
 *
 * `blurb` is the small grey line under each label in the dropdown — the device
 * from the reference shot. It is what turns a bare list of links into
 * something that tells a first-time visitor where they are going, and it is
 * the single biggest information-scent win over the old riverofgod.ph nav.
 *
 * ⚠ BLURBS FOR H.I.M. PH, RBSI, BODY OF CHRIST AND ACTIVATE12 ARE PLACEHOLDER.
 * I have not confirmed what those acronyms expand to or what those ministries
 * actually do — I am not going to invent it and have it read back to ROG at
 * the pitch. Replace the four marked lines before anyone outside sees this.
 */

export interface NavChild {
  to: string
  label: string
  /** One short line. Sentence case, no full stop, max ~40 chars. */
  blurb: string
}

export interface NavItem {
  label: string
  /** Set for a plain link. Omit when `children` is set. */
  to?: string
  children?: NavChild[]
}

export const primaryNav: NavItem[] = [
  { label: 'Home', to: '/' },

  {
    label: 'About',
    children: [
      {
        to: '/about/who-we-are',
        label: 'Who We Are',
        blurb: 'Our story and why we exist',
      },
      {
        to: '/about/him-ph',
        label: 'H.I.M. PH',
        blurb: 'The network we belong to', // ⚠ PLACEHOLDER — confirm with ROG
      },
      {
        to: '/about/rbsi',
        label: 'RBSI',
        blurb: 'Training and equipping', // ⚠ PLACEHOLDER — confirm with ROG
      },
    ],
  },

  {
    label: 'Ministries',
    children: [
      {
        to: '/ministries',
        label: 'Ministries',
        blurb: 'Every ministry at a glance',
      },
      {
        to: '/ministries/body-of-christ',
        label: 'Body of Christ Ministries',
        blurb: 'Serving teams across the house', // ⚠ PLACEHOLDER — confirm with ROG
      },
      {
        to: '/discipleship',
        label: 'Discipleship',
        blurb: 'Find your next step',
      },
      {
        to: '/activate12',
        label: 'Activate12',
        blurb: 'Step into what you are called to', // ⚠ PLACEHOLDER — confirm with ROG
      },
    ],
  },

  {
    label: 'Media & Events',
    children: [
      {
        to: '/media',
        label: 'Media',
        blurb: 'Messages, worship and archives',
      },
      {
        to: '/events',
        label: 'Events',
        blurb: 'What is coming up',
      },
    ],
  },

]

/** The three right-hand actions, in ascending order of commitment. */
export const navActions = {
  planAVisit: { to: '/plan-a-visit', label: 'Plan a Visit' },
  watchLive: { to: '/watch-live', label: 'Watch Live' },
  give: { to: '/give', label: 'Give' },
} as const
