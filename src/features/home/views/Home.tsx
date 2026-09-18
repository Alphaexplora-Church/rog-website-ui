import { HeroSection } from './HeroSection'
import { ServiceTimesSection } from './ServiceTimesSection'
import { LatestSermonSection } from './LatestSermonSection'
import { MinistriesGrid } from './MinistriesGrid'
import { EventsStrip } from './EventsStrip'
import { NextStepsSection } from './NextStepsSection'

/**
 * Home — View layer only.
 *
 * Per Doc 4 §3.2 a View never fetches. When a later section needs live data
 * it will call `useHomeViewModel()` from ../viewModels/ and pass plain
 * props down; nothing below this file will ever import the API client.
 *
 * REVISED 2026-09-18, replacing Doc 8 §3's original 9-section plan. 
 * Jude's call: Hero + Service Times stay, then Latest Message / Ministries / 
 * Events / Next Steps in that order — 6 sections total, not 9. 
 * Concretely, against the original plan:
 *
 *   - KEPT (renamed/reshaped): Latest Messages → LatestSermonSection 
 *     (one teaser, not a 3-card feed); Ministries by life stage → 
 *     MinistriesGrid (4 curated tiles, not 6).
 *   - DROPPED: WelcomeBanner (dropped to improve pacing directly into media),
 *     What to Expect as its own section (folded into NextStepsSection instead), 
 *     The 5Es, Find a Church Near You, and Story & Scale. None of these are 
 *     built anywhere else on the site yet — this content has nowhere to live 
 *     until someone decides where.
 *   - ADDED, not in the original plan: EventsStrip (Doc 8/Doc 1 explicitly
 *     held this in reserve "until ROG actually has event data" — it wasn't
 *     forgotten, it's a deliberate reversal, and its content is still
 *     flagged placeholder — see that file) and the Giving half of
 *     NextStepsSection (Doc 8 explicitly made Give nav-only, not a
 *     section — also a deliberate reversal, see that file's own note).
 *
 * Doc 8 itself has not been edited to match — it still describes the old
 * 9-section plan. Someone should reconcile the two before this reaches
 * ROG, particularly the dropped church-finder: Doc 8 built the whole
 * homepage structure around ROG's two audiences (a Sunday-visitor funnel
 * *and* someone elsewhere in the 477-church network looking for their own
 * campus), and nothing in this revised flow routes that second audience
 * anywhere. Worth raising, not silently dropping.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <ServiceTimesSection />
      <LatestSermonSection />
      <MinistriesGrid />
      <EventsStrip />
      <NextStepsSection />
    </>
  )
}