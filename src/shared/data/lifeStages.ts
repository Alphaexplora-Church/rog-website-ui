/**
 * THE ONE LIST OF LIFE STAGES — ROG's age-banded ministries, and who
 * coordinates each.
 *
 * CREATED 2026-09-23 on Jude's call — "make sure that the data placeholders
 * are all the same… para pag inimplement tsaka inintegrate natin yung cms,
 * we wont encounter any issue."
 *
 * ⚠ WHAT IT WAS BEFORE: the same ministries existed twice, in two files,
 * describing the same real thing differently.
 *
 *   About        → `LifeStageCoordinatorsSection`, 7 rows, each a name + an
 *                   age range + a coordinator, scraped from riverofgod.ph.
 *   Ministries   → `LifeSeasonsSection`, 6 cards, each a title + an age
 *                   band + a paragraph, from the Figma board.
 *
 * And they disagreed on nearly every band:
 *
 *     stage          riverofgod.ph        Figma board
 *     River Kids     3–12                 4–12
 *     Young Adults   20–35                20–30
 *     Men / Women    two rows, 36–50      one card, 31–50
 *     River Families no range             "Married couples"
 *
 * riverofgod.ph wins, per Jude's standing instruction on this project to
 * follow the official site where the two sources differ. So the Ministries
 * carousel's age labels change: River Kids reads 3–12 rather than 4–12,
 * Young Adults 20–35 rather than 20–30, and River Men & Women 36–50 rather
 * than 31–50.
 *
 * HOW BOTH PAGES STILL LOOK THE SAME AS BEFORE: `lifeStages` below is the
 * seven canonical stages, which is what About lists. `lifeStageCards` is
 * the six-card presentation the Ministries carousel shows, and each card
 * names which stages it covers — that is the only place the "Men and Women
 * share a card" decision is written down. No fact is stored twice: a card
 * derives its age label from its member stages.
 *
 * ⚠ TWO THINGS STILL NEED JUDE.
 *   1. The Allan Santiago ↔ Seasoned / Bojie Ignacio ↔ River Men pairing is
 *      a best guess, carried over from the original scrape. The source
 *      listed both names together, then both ranges together; this assumes
 *      first pairs with first.
 *   2. riverofgod.ph calls the last stage "River Families" while the Figma
 *      card calls it "Family Ministry" and describes married couples
 *      specifically. Those may be two different things — the River Families
 *      serving ministry's own description says it spans five life stages,
 *      not just couples. Both names are kept below, on the stage and on the
 *      card respectively, until Jude says which is right.
 */
export interface LifeStage {
  /** Stable key; also the future CMS slug. */
  slug: string
  name: string
  /**
   * Display-ready and short, e.g. "3–12" or "51+". Both pages render it
   * behind the word "Ages", so it is written once in one form rather than
   * as "3–12 years old" here and "AGES 3–12" there. Undefined for a stage
   * with no age band.
   */
  ageRange?: string
  /** Slug into `people.ts`. */
  coordinator: string
}

export const lifeStages: LifeStage[] = [
  { slug: 'river-kids', name: 'River Kids', ageRange: '3–12', coordinator: 'aprile-liwanag' },
  { slug: 'river-youth', name: 'River Youth', ageRange: '13–19', coordinator: 'nhea-tagalog' },
  { slug: 'young-adults', name: 'Young Adults', ageRange: '20–35', coordinator: 'mikee-chester' },
  { slug: 'seasoned', name: 'Seasoned', ageRange: '51+', coordinator: 'allan-santiago' },
  { slug: 'river-men', name: 'River Men', ageRange: '36–50', coordinator: 'bojie-ignacio' },
  { slug: 'river-women', name: 'River Women', ageRange: '36–50', coordinator: 'rosalin-co' },
  { slug: 'river-families', name: 'River Families', coordinator: 'nestor-and-sol-mendoza' },
]

const stageBySlug = new Map(lifeStages.map((s) => [s.slug, s]))

export function lifeStage(slug: string): LifeStage {
  const found = stageBySlug.get(slug)
  if (!found) throw new Error(`Unknown life stage slug: ${slug}`)
  return found
}

/**
 * The Ministries carousel's six cards. `card`, `ageColor` and `bodyColor`
 * are complete, literal Tailwind class strings — never assembled at
 * runtime, same JIT constraint documented throughout this codebase.
 */
export interface LifeStageCard {
  slug: string
  title: string
  body: string
  photo: string
  /** Which `lifeStages` entries this card covers. */
  stages: string[]
  /** Used only when the covered stages carry no age range. */
  ageLabel?: string
  card: string
  ageColor: string
  bodyColor: string
}

export const lifeStageCards: LifeStageCard[] = [
  {
    slug: 'river-kids',
    title: 'River Kids',
    body: 'An entry-level experience for kids — games, Bible stories, interactive learning, and lots of fun.',
    photo:
      'https://images.unsplash.com/photo-1588075592405-d3d4f0846961?auto=format&fit=crop&w=500&q=80',
    stages: ['river-kids'],
    card: 'bg-white text-[#0B0F14]',
    ageColor: 'text-[#1b7a70]',
    bodyColor: 'text-black/62',
  },
  {
    slug: 'river-youth',
    title: 'River Youth',
    body: 'Helps young believers "cross over" to adulthood by elevating faith, character, and maturity.',
    photo:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=80',
    stages: ['river-youth'],
    card: 'bg-[#0E2A3F] text-white',
    ageColor: 'text-[#8FD4C9]',
    bodyColor: 'text-white/70',
  },
  {
    slug: 'young-adults',
    title: 'Young Adults',
    body: 'Builds fellowship around career, finances, personal growth, and relationships.',
    photo:
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=500&q=80',
    stages: ['young-adults'],
    card: 'bg-white text-[#0B0F14]',
    ageColor: 'text-[#1b7a70]',
    bodyColor: 'text-black/62',
  },
  {
    slug: 'river-men-women',
    title: 'River Men & Women',
    body: 'Helps men and women mature further in their walk with Christ.',
    photo:
      'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=500&q=80',
    stages: ['river-men', 'river-women'],
    card: 'bg-[#1b7a70] text-white',
    ageColor: 'text-white',
    bodyColor: 'text-white/82',
  },
  {
    slug: 'seasoned',
    title: 'Seasoned',
    body: 'The same maturity focus, for our seasoned believers.',
    photo:
      'https://images.unsplash.com/photo-1504004030892-d06adf9ffbcf?auto=format&fit=crop&w=500&q=80',
    stages: ['seasoned'],
    card: 'bg-white text-[#0B0F14]',
    ageColor: 'text-[#1b7a70]',
    bodyColor: 'text-black/62',
  },
  {
    slug: 'family-ministry',
    title: 'Family Ministry',
    body: 'Helps married couples foster families consecrated to the Lord.',
    photo:
      'https://images.unsplash.com/photo-1561524891-8e08ab8569f3?auto=format&fit=crop&w=500&q=80',
    stages: ['river-families'],
    ageLabel: 'Married couples',
    card: 'bg-white text-[#0B0F14]',
    ageColor: 'text-[#1b7a70]',
    bodyColor: 'text-black/62',
  },
]

/**
 * The line above a card's title. Derived from the stages the card covers,
 * so an age band is written down once (on the stage) and read everywhere.
 * Falls back to the card's own `ageLabel` when none of its stages is
 * age-bounded.
 */
export function cardAgeLabel(card: LifeStageCard): string {
  const ranges = card.stages
    .map((slug) => lifeStage(slug).ageRange)
    .filter((range): range is string => Boolean(range))

  if (ranges.length === 0) return card.ageLabel ?? ''

  const unique = [...new Set(ranges)]
  return `Ages ${unique.join(' / ')}`
}
