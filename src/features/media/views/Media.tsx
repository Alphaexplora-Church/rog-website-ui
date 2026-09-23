import { MediaHero } from './MediaHero'
import { MediaLibrarySection } from './MediaLibrarySection'

/**
 * Media — page container for `/media`. Hero spotlight + the filterable
 * Media Library (Series/Topics/Speakers/Scripture). Detail routes
 * (`/media/series/:slug`, `/media/browse/:type/:slug`, `/media/watch/:slug`)
 * are separate page components wired in App.tsx — matches the real site's
 * drill-down IA (tab list → term page → single message page) rather than
 * cramming everything onto one page.
 *
 * Built 2026-09-22. Separate route/page from Events per Jude's instruction
 * ("magkaibang page/tab si Events tsaka Media") — they only share a spot
 * in the Navbar's "Media & Events" dropdown (see navigation.ts, already
 * wired there before this build).
 */
export default function Media() {
  return (
    <>
      <MediaHero />
      <MediaLibrarySection />
    </>
  )
}
