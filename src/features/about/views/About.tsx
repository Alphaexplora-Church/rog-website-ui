import { AboutHero } from './AboutHero'
import { OurStorySection } from './OurStorySection'
import { MissionVisionSection } from './MissionVisionSection'
import { BeliefsSection } from './BeliefsSection'
import { FoundersSection } from './FoundersSection'

/**
 * About — View layer only, page container for `/about/who-we-are`.
 *
 * First real second page on the site (see App.tsx's own doc comment on why
 * it's the one that finally triggers `lazy()` there). Route and label come
 * from navigation.ts, not Doc 2's IA: the nav already ships a single
 * `/about/who-we-are` link ("Our story and why we exist"), not Doc 2's
 * five-page `/about` hub (`/about/our-story`, `/about/beliefs`,
 * `/about/mission-vision`, `/about/leadership`, `/about/apostolic-team`).
 * That's the same unresolved Doc 8 reconciliation gap Home.tsx already
 * flags for its own section list — building ONE page that covers story +
 * mission/vision + beliefs + founders keeps it shippable now without
 * betting on which IA wins. If the five-page hub is later confirmed as the
 * real direction, this page's sections are already the right split points
 * to break out into their own routes.
 *
 * Five sections, in the order a first-time visitor would actually ask
 * these questions: who are you (hero) → how did you start (story) → what
 * are you here to do (mission/vision) → what do you believe (doctrine) →
 * who's leading it (founders).
 *
 * PACING, 2026-09-17 (REVERTED same day): tried bumping every section's
 * vertical padding from the site-wide `py-24 sm:py-32` to `py-28 sm:py-40`
 * for a slower editorial rhythm than Home's denser funnel. Reverted almost
 * immediately — Jude's dev server was already running when these files
 * were written, and `py-28`/`py-36`/`py-40` had never been used anywhere
 * else in the codebase before this page, so Tailwind's already-compiled
 * CSS on his machine had no rule for them. They silently resolved to 0px
 * padding rather than erroring, which put the Hero's h1 flush against the
 * very top of its section with no clearance from the fixed floating
 * navbar (`Navbar.tsx`'s `header` is `fixed inset-x-0 top-0 z-50`) — the
 * heading rendered completely hidden behind it. Confirmed live via the
 * browser: `getComputedStyle` showed `padding-top: 0px` on the affected
 * elements, and a direct stylesheet scan found `.py-24`/`.py-32` compiled
 * in but no `.py-28`/`.py-36`/`.py-40` rule anywhere. Back to `py-24
 * sm:py-32` everywhere on this page — a value already proven safe rather
 * than one that depends on a dev-server restart to even render. If a
 * slower About-specific rhythm is wanted later, reach for spacing values
 * already used elsewhere in the codebase (or trigger a full dev-server
 * restart deliberately, not as a silent prerequisite).
 */
export default function About() {
  return (
    <>
      <AboutHero />
      <OurStorySection />
      <MissionVisionSection />
      <BeliefsSection />
      <FoundersSection />
    </>
  )
}
