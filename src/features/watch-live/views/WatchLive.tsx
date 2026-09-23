import { WatchLiveHero } from './WatchLiveHero'
import { PreviousMessagesSection } from './PreviousMessagesSection'

/**
 * Watch Live — page container for `/watch-live`. Logic (countdown to next
 * service, notify-me) ported from Jude's reference and re-skinned to this
 * site's dark/teal design system — see WatchLiveHero + useWatchLiveViewModel
 * for the full rationale, and PreviousMessagesSection for why the sermon
 * list is real data instead of the reference's fabricated archive.
 */
export default function WatchLive() {
  return (
    <>
      <WatchLiveHero />
      <PreviousMessagesSection />
    </>
  )
}
