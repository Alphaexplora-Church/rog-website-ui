import { FaithSection, MissionCopy, PhotoHero, PortraitSections, Signup, ValuesSection } from './shared'

export default function Portraits() {
  return <div className="direction-portraits">
    <PhotoHero layout="portraits" />
    <MissionCopy layout="spotlight" />
    <PortraitSections councilLayout="portrait" boardLayout="portrait" />
    <ValuesSection layout="grid" />
    <FaithSection visibleAll />
    <Signup layout="centered" />
  </div>
}
