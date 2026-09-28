import { bodyOfChristMinistries } from '../../data/bodyOfChristMinistries'
import { cardAgeLabel, lifeStageCards } from '../../data/lifeStages'
import { ministries as serviceMinistries } from '../../data/ministries'
import { person } from '../../data/people'
import type { MinistriesContent } from '../types/ministry'

/**
 * The Ministries page's BUNDLED copy — the same 20 ministries rog-cms
 * seeds itself with on first run (rog-cms/src/api/ministry/seed.ts).
 *
 * Used three ways by ministriesApi.ts:
 *   1. VITE_USE_MOCKS=true   → the page renders this, no CMS needed
 *   2. while the CMS answers → shown immediately, so the page never opens
 *                              empty (React Query placeholderData)
 *   3. CMS unreachable       → the page keeps showing this rather than
 *                              going blank; the reason is logged
 *
 * It is ALSO where a CMS ministry without its own Cover Photo gets a
 * picture from, and where a Service ministry gets its hand-written
 * one-liner and hue (neither is a CMS field) — matched by name, see
 * `lookup` below.
 */
function key(title: string) {
  return title.trim().toLowerCase()
}

export const fallbackMinistries: MinistriesContent = {
  ages: lifeStageCards.map((c) => ({
    slug: c.slug,
    title: c.title,
    ageLabel: cardAgeLabel(c),
    body: c.body,
    photo: c.photo,
  })),
  service: serviceMinistries.map((m) => {
    const p = person(m.contact)
    return {
      slug: m.slug,
      title: m.title,
      blurb: m.blurb,
      description: m.description,
      tagline: m.tagline,
      contactName: p.name,
      contactPhone: p.phone,
      hashtag: m.hashtag,
      image: m.image,
      tint: m.tint,
    }
  }),
  body: bodyOfChristMinistries.map((b, i) => ({
    slug: `body-${i + 1}`,
    title: b.title,
    teaser: b.teaser,
    body: b.body,
    photo: b.photo,
  })),
}

const agesByName = new Map(fallbackMinistries.ages.map((m) => [key(m.title), m]))
const serviceByName = new Map(fallbackMinistries.service.map((m) => [key(m.title), m]))
const bodyByName = new Map(fallbackMinistries.body.map((m) => [key(m.title), m]))

export const lookup = {
  ages: (title: string) => agesByName.get(key(title)),
  service: (title: string) => serviceByName.get(key(title)),
  body: (title: string) => bodyByName.get(key(title)),
}

/** Hues for Service ministries added in the CMS (not in the bundled list),
 *  cycled by position — the same family of tints the originals use. */
export const EXTRA_TINTS: [string, string][] = [
  ['#B45309', '#FCD34D'],
  ['#0E7490', '#67E8F9'],
  ['#A21CAF', '#F0ABFC'],
  ['#6D28D9', '#C4B5FD'],
  ['#C2410C', '#FDBA74'],
  ['#047857', '#6EE7B7'],
  ['#1D4ED8', '#93C5FD'],
  ['#1b7a70', '#8FD4C9'],
]
