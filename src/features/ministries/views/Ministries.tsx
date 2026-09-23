import { MinistriesHero } from './MinistriesHero'
import { LifeSeasonsSection } from './LifeSeasonsSection'
import { BodyOfChristMinistriesSection } from './BodyOfChristMinistriesSection'
import { ServiceMinistriesSection } from './ServiceMinistriesSection'

/**
 * Ministries — View layer only, page container for `/ministries`.
 *
 * Built 2026-09-22 from the Figma Ministries.dc.html board (Hero → Life
 * Seasons carousel → Body of Christ Ministries carousel), same tab-by-tab
 * workflow as Home and About.
 *
 * `navigation.ts` also lists `/ministries/body-of-christ` as its own nav
 * child ("Serving teams across the house"). Rather than a second route
 * duplicating this section, `BodyOfChristMinistriesSection` carries
 * `id="body-of-christ"` so that link can anchor-jump straight to it —
 * same pattern as About's sub-nav pills.
 *
 * ADDED same day: `ServiceMinistriesSection` — real volunteer-recruitment
 * content Jude confirmed belongs on this page, from riverofgod.ph's own
 * "#SAVEDTOSERVE" page. Distinct from Body of Christ Ministries above
 * (cross-church programs) — this is internal ROG serving teams recruiting
 * volunteers, each with a contact person and phone number. Two of the
 * eight ministries Jude listed (Discipleship, Cross Cultural) still need
 * their description/contact confirmed — see that file's own flag.
 */
export default function Ministries() {
  return (
    <>
      <MinistriesHero />
      <LifeSeasonsSection />
       <ServiceMinistriesSection />
      <BodyOfChristMinistriesSection />
     
    </>
  )
}
