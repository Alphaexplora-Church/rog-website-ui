import { WatchLiveHero } from './WatchLiveHero'
import { PreviousMessagesSection } from './PreviousMessagesSection'

/**
 * Watch Live — page container for `/watch-live`. Countdown logic ported from
 * Jude's reference (see useWatchLiveViewModel). REVAMP 2026-09-25: a live
 * stage on abyss (giant countdown, NEXT SERVICE / LIVE state, Sunday
 * schedule, one ember action) → a numbered index of previous messages on
 * the bone plate. PreviousMessagesSection explains why that list is real
 * data instead of the reference's fabricated archive.
 */
export default function WatchLive() {
  return (
    <>
      <WatchLiveHero />
      <PreviousMessagesSection />
    </>
  )
}
