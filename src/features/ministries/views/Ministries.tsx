import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MinistriesHero } from './MinistriesHero'
import { LifeSeasonsSection } from './LifeSeasonsSection'
import { BodyOfChristMinistriesSection } from './BodyOfChristMinistriesSection'
import { ServiceMinistriesSection } from './ServiceMinistriesSection'

/**
 * Ministries — page container for `/ministries` and
 * `/ministries/body-of-christ`. REVAMP 2026-09-25 ("Textured Editorial").
 *
 * Content history: built 2026-09-22 from the Figma Ministries board; the
 * #SAVEDTOSERVE volunteer-recruitment section (real riverofgod.ph copy) was
 * added the same day. Body of Christ Ministries (cross-church programmes)
 * and Service Ministries (internal serving teams) are different things —
 * see each file.
 *
 * Shape — every band a different form, alternating grounds:
 *   Hero (abyss, light-pool)      → PageHero with a section index aside
 *   Ages of the River (abyss)     → tall portrait panels on a snap rail
 *   #SavedToServe (river band)    → editorial index list, row → dialog
 *   Body of Christ (bone plate)   → numbered two-column index
 *
 * `/ministries/body-of-christ` renders this same page (one source, no
 * duplicate route). It used to land at the top like `/ministries`; now it
 * scrolls to the `#body-of-christ` section once the page has mounted, so
 * the nav child actually goes where it says.
 */
export default function Ministries() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname !== '/ministries/body-of-christ') return
    const id = requestAnimationFrame(() => {
      document.getElementById('body-of-christ')?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <>
      <MinistriesHero />
      <LifeSeasonsSection />
      <ServiceMinistriesSection />
      <BodyOfChristMinistriesSection />
    </>
  )
}
