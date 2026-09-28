import { AboutHero } from './AboutHero'
import { AboutSubNav } from './AboutSubNav'
import { FoundersStorySection } from './FoundersStorySection'
import { LeadershipBiosSection } from './LeadershipBiosSection'
import { ApostolicTeamSection } from './ApostolicTeamSection'
import { OrtigasPastorsSection } from './OrtigasPastorsSection'
import { ServingMinistryHeadsSection } from './ServingMinistryHeadsSection'
import { LifeStageCoordinatorsSection } from './LifeStageCoordinatorsSection'
import { CoreValuesSection } from './CoreValuesSection'
import { StatementOfFaithSection } from './StatementOfFaithSection'
import { DiscipleshipSection } from './DiscipleshipSection'
import { WaveRule } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * About — View layer only, page container for `/about/who-we-are`.
 *
 * REBUILT 2026-09-22 from the Figma "Who We Are" board (replacing the old
 * 5-section placeholder page, whose files are left orphaned on disk).
 * Core Values + Discipleship added 2026-09-25 from the slide decks Jude
 * sent: identity → values → beliefs → process reads as one arc.
 *
 * REVAMP 2026-09-25 ("Textured Editorial", DESIGN.md). Section order is
 * unchanged; every section now has its own shape and the grounds alternate
 * for rhythm instead of chaining flat greys with wave-fill SVGs (those
 * assumed the old #161616/#232323 plates and are gone — a change of ground
 * is the divider now):
 *
 *   PageHero (photo)            abyss
 *   sticky pill sub-nav         floats under the Navbar
 *   Founders' Story timeline    abyss   — shout years on an ember fill line
 *   Leadership bios             bone    — alternating poster spreads
 *   Apostolic Team              river   — numbered roster rows
 *   Ortigas Pastors             abyss   — stepped portrait rail
 *   Serving Ministry Heads      bone    — two-column credits index
 *   Life Stage Coordinators     abyss   — photo-led index
 *   Core Values                 abyss   — interactive slide posters
 *   Statement of Faith          bone    — numbered accordion
 *   Discipleship teaser         river   — five stages → /discipleship
 */
export default function About() {
  return (
    <>
      <AboutHero />
      <AboutSubNav />
      <FoundersStorySection />
      <LeadershipBiosSection />
      <ApostolicTeamSection />
      <OrtigasPastorsSection />
      <ServingMinistryHeadsSection />
      <LifeStageCoordinatorsSection />
      {/* two abyss sections meet here — the wave hairline marks the turn */}
      <div aria-hidden="true" className={`${container} bg-abyss`}>
        <WaveRule className="text-bone/15" />
      </div>
      <CoreValuesSection />
      <StatementOfFaithSection />
      <DiscipleshipSection />
    </>
  )
}
