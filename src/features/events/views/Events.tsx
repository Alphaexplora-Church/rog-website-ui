import { EventsHero } from './EventsHero'
import { WeeklyGatheringsSection } from './WeeklyGatheringsSection'
import { UpcomingEventsSection } from './UpcomingEventsSection'

/**
 * Events — page container for `/events`. Separate page/route from Media
 * per Jude's instruction ("magkaibang page/tab si Events tsaka Media") —
 * they only share a spot in the Navbar's "Media & Events" dropdown.
 *
 * REVAMP 2026-09-25 ("Textured Editorial"), four grounds, four shapes:
 *   PageHero (abyss, photo) → The Current: the weekly rhythm as one wave
 *   line on the river band → Next up: the soonest event's 4:5 poster spread
 *   with a live countdown (abyss) → Later this season: a hung poster wall
 *   on the bone plate.
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
