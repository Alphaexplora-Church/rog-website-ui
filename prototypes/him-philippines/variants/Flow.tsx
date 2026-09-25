import { FaithSection, MissionCopy, PhotoHero, PortraitSections, Signup, ValuesSection } from './shared'

export default function Flow() {
  return <div className="direction-flow">
    <PhotoHero layout="flow" />
    <MissionCopy layout="balanced" />
    <PortraitSections councilLayout="cards" boardLayout="cards" />
    <ValuesSection layout="grid" />
    <FaithSection />
    <Signup layout="split" />
  </div>
}
