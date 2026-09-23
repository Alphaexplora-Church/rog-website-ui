import { EventsHero } from './EventsHero'
import { WeeklyGatheringsSection } from './WeeklyGatheringsSection'
import { UpcomingEventsSection } from './UpcomingEventsSection'

/**
 * Events — page container for `/events`. Separate page/route from Media
 * per Jude's instruction ("magkaibang page/tab si Events tsaka Media") —
 * they only share a spot in the same Navbar dropdown ("Media & Events").
 * UI is my own call (no Figma reference given), built to the site's
 * existing theme: dark/teal-accent sections with wave-divider transitions,
 * same pattern as Ministries.
 */
export default function Events() {
  return (
    <>
      <EventsHero />
      <WeeklyGatheringsSection />
      <UpcomingEventsSection />
    </>
  )
}
