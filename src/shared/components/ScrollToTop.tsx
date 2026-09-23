import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Start every page at the top.
 *
 * Added 2026-09-23 on Jude's call ("everytime you switch a tab or goes in a
 * specific tab, it always start at the top of the page").
 *
 * THE PROBLEM. A browser keeps its scroll position across a client-side
 * route change, because nothing actually navigated — React Router swapped
 * the tree and the scrollbar stayed where it was. So clicking "Media" from
 * halfway down Ministries dropped you halfway down Media, usually into the
 * middle of a section with no heading in sight. Nothing in this app touched
 * scroll before this file existed.
 *
 * Renders nothing. It lives inside <BrowserRouter> purely for the hooks.
 *
 * TWO DELIBERATE EXCEPTIONS, both cases where jumping to the top would be
 * the wrong answer:
 *
 *   1. BACK AND FORWARD ARE LEFT ALONE. `navigationType === 'POP'` is the
 *      browser's own history movement, and there the expectation is the
 *      opposite one — you want to land back where you were reading, not at
 *      the top of a page you already scrolled through. Forcing the top here
 *      is the classic version of this fix, and it is the reason "back" feels
 *      broken on so many SPAs. Say the word if you want it top-always and
 *      this guard comes out.
 *   2. A HASH TARGET OWNS THE SCROLL. `/media#media-library` means "put me
 *      at the library", so scrolling to 0 would fight the anchor. Today the
 *      only two hash links on the site (App's own `#main` skip-link and
 *      MediaHero's "Browse the library") are plain `<a>` elements the
 *      browser resolves without involving the router, so this guard is
 *      insurance for the first `<Link to="/x#y">` anyone adds.
 *
 * `useLayoutEffect`, not `useEffect`, so the jump happens before the browser
 * paints. With `useEffect` the new page renders at the old offset for one
 * frame and you see it lurch.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (navigationType === 'POP') return
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash, navigationType])

  return null
}
