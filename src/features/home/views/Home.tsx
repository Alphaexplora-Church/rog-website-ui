import { HeroSection } from './HeroSection'
import { UpcomingEventsSection } from './UpcomingEventsSection'
import { WatchOrListenSection } from './WatchOrListenSection'
import { LiveServicesSection } from './LiveServicesSection'
import { ServicesMainCenterSection } from './ServicesMainCenterSection'

/**
 * Home — View layer only.
 *
 * Per Doc 4 §3.2 a View never fetches. When a later section needs live data
 * it will call `useHomeViewModel()` from ../viewModels/ and pass plain
 * props down; nothing below this file will ever import the API client.
 *
 * REVISED 2026-09-22, following Jude's Figma handoff (artifact
 * 3680dbd7-…, board "01 — Home"). Explicit instruction: keep the navbar and
 * HeroSection exactly as they are — only the body below the hero changes.
 * The four sections below replace ServiceTimesSection, LatestSermonSection,
 * MinistriesGrid, EventsStrip and NextStepsSection wholesale, matching the
 * approved design 1:1 in content and order:
 *
 *   Hero (unchanged) → Upcoming Events → Watch or Listen →
 *   Watch Our Live Services → Our Services & Main Center → Footer (App.tsx)
 *
 * MinistriesGrid's "Find Your Place" tiles and NextStepsSection's Life
 * Group / Give panel have no equivalent in this design — they're not
 * deleted from disk (still in this folder, just unused), in case a later
 * page needs them. The five now-orphaned files (ServiceTimesSection,
 * LatestSermonSection, MinistriesGrid, EventsStrip, NextStepsSection) are
 * left in place for the same reason: nothing currently imports them, but
 * they're real, working components if a future page wants to reuse the
 * pattern.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <UpcomingEventsSection />
      <WatchOrListenSection />
      <LiveServicesSection />
      <ServicesMainCenterSection />
    </>
  )
}
