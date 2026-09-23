import { FaithSection, MissionCopy, PhotoHero, PortraitSections, Signup, ValuesSection } from './shared'

export default function Directory() {
  return <div className="direction-directory">
    <PhotoHero layout="directory" />
    <MissionCopy layout="balanced" />
    <PortraitSections councilLayout="directory" boardLayout="directory" />
    <ValuesSection layout="list" />
    <FaithSection />
    <Signup layout="split" />
  </div>
}
