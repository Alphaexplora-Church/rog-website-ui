/**
 * Ministries page types — the shape every Ministries view renders,
 * whether the data came from Strapi (rog-cms's `api::ministry.ministry`,
 * 2026-09-28) or from the bundled fallback (ministriesFallback.ts).
 *
 * Model layer (Doc 5 §4.3): no React, no fetching. `ministriesApi.ts`
 * converts Strapi's response INTO these, so views never see Strapi's own
 * field names.
 */

/** "Ages of the River" — one tall age panel. */
export interface AgeMinistry {
  slug: string
  title: string
  /** "Ages 3–12", or a phrase for a panel without a range ("Married couples"). */
  ageLabel: string
  body: string
  photo?: string
}

/** "Service Ministries" (#SavedToServe) — one index row + its dialog. */
export interface ServiceMinistry {
  slug: string
  title: string
  /** The one-liner on the row. */
  blurb: string
  description: string
  /** The CMS's Quote field — the italic invitation line. */
  tagline: string
  contactName: string
  contactPhone?: string
  hashtag: string
  image?: string
  /** Deep and light ends of this ministry's hue. */
  tint: [string, string]
}

/** "Body of Christ Ministries" — one numbered entry. */
export interface BodyMinistry {
  slug: string
  title: string
  /** The CMS's Subtitle field — the italic pill. */
  teaser: string
  body: string
  photo?: string
}

export interface MinistriesContent {
  ages: AgeMinistry[]
  service: ServiceMinistry[]
  body: BodyMinistry[]
}
