import { AboutHero } from './AboutHero'
import { AboutSubNav } from './AboutSubNav'
import { FoundersStorySection } from './FoundersStorySection'
import { LeadershipBiosSection } from './LeadershipBiosSection'
import { ApostolicTeamSection } from './ApostolicTeamSection'
import { OrtigasPastorsSection } from './OrtigasPastorsSection'
import { ServingMinistryHeadsSection } from './ServingMinistryHeadsSection'
import { LifeStageCoordinatorsSection } from './LifeStageCoordinatorsSection'
import { StatementOfFaithSection } from './StatementOfFaithSection'

/**
 * About — View layer only, page container for `/about/who-we-are`.
 *
 * REBUILT 2026-09-22 from the Figma "Who We Are" design (artifact
 * 3680dbd7-…, board WhoWeAre.dc.html), same handoff and same tab-by-tab
 * workflow as the Home page rebuild earlier in this project. Replaces
 * the previous 5-section placeholder page (AboutHero w/ count-up,
 * OurStorySection, MissionVisionSection, BeliefsSection, FoundersSection)
 * wholesale, mirroring the "Replace them" decision made for Home's old
 * sections — those files are left orphaned, unused, on disk.
 *
 * Section order matches the Figma board exactly: mini-hero → sticky
 * sub-nav (4 pills, in-page anchors) → Founders' Story timeline → Leadership
 * bios (Chito + Rachel) → Apostolic Team → River of God Ortigas Pastors →
 * Serving Ministry Heads → Life Stage Coordinators carousel → Statement of
 * Faith accordion (10 articles). Footer.tsx (bg-black) closes the page, same
 * as every other route.
 *
 * Wave-divider SVGs chain background colors between sections, same motif
 * added to Home per Jude's "the background is too static" request —
 * applied here from the start rather than retrofitted.
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
      <StatementOfFaithSection />
    </>
  )
}
