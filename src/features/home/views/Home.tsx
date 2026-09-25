import { HeroSection } from './HeroSection'
import { ServicesMainCenterSection } from './ServicesMainCenterSection'
import { WatchOrListenSection } from './WatchOrListenSection'
import { FiveCrossingsSection } from './FiveCrossingsSection'
import { UpcomingEventsSection } from './UpcomingEventsSection'
import { LiveServicesSection } from './LiveServicesSection'
import { Marquee } from '../../../shared/components/ui/River'
import { site } from '../../../shared/config/site'

/**
 * Home — View layer only. REVAMP 2026-09-25 ("Textured Editorial", ROG 11).
 *
 * Every section is a different shape, and the grounds alternate so the page
 * has rhythm instead of one long black plate:
 *
 *   Hero (poster, abyss + liquid texture) → River Marquee (ember band) →
 *   The Current (weekly rhythm + Main Center, river ground) → Watch or
 *   Listen (editorial split + index rows, abyss) → Five crossings (5Es,
 *   bone) → What's on (poster shelf, abyss) → Follow along (typographic
 *   links, river) → Footer.
 *
 * The marquee text is derived from site.ts so service times never drift.
 */
export default function Home() {
  const sunday = site.services
    .filter((s) => s.day === 'Sunday')
    .map((s) => s.time.replace(':00', '').replace(' ', ''))
    .join(' · ')
  const midweek = site.services.filter((s) => s.day !== 'Sunday')

  return (
    <>
      <HeroSection />
      <Marquee
        label="Service times"
        items={[
          'Love God & make disciples',
          `Sunday ${sunday}`,
          ...midweek.map((s) => `${s.day} ${s.time.replace(':00', '')} ${s.label ?? ''}`.trim()),
          'Shangri-La Plaza · Lower Ground',
          site.motto,
        ]}
      />
      <ServicesMainCenterSection />
      <WatchOrListenSection />
      <FiveCrossingsSection />
      <UpcomingEventsSection />
      <LiveServicesSection />
    </>
  )
}
