import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from './shared/components/Navbar'
import { Footer } from './shared/components/Footer'
import Home from './features/home/views/Home'
import { fontFamily, textH1 } from './shared/styles/tokens'

const About = lazy(() => import('./features/about/views/About'))

/**
 * Minimal shell for the restart — Navbar plus the home route.
 *
 * NOT the final App. Once more than one page exists this goes back to
 * building its <Route> tree from routeManifest.ts (Doc 5 §4.1), so that the
 * app and the prerenderer can never disagree about what routes exist. Right
 * now there is exactly one route and a manifest would be ceremony.
 *
 * The stub route catches every nav link so nothing 404s while we build pages
 * one at a time — clicking "Who We Are" should land somewhere honest rather
 * than a blank screen.
 *
 * Home is a STATIC import, not `lazy()` — it's the only route rendered on
 * first paint, so there's no earlier "shell" for a lazy chunk to save time
 * to. Reintroduce `lazy()` here only once there's a second, genuinely-
 * secondary route worth deferring.
 *
 * There WAS an IntroCurtain mounted here — a one-time splash overlay that
 * played on every load. Pulled per Jude's call: it read as a glitch/flash
 * rather than a polish, and re-showing a full-screen curtain on every single
 * page load (not just a first visit) fought the actual entrance animations
 * already carried by HeroSection itself. `shared/components/IntroCurtain.tsx`
 * and the "INTRO CURTAIN" block in index.css are now dead code — I can't
 * delete files from here, so please delete both by hand when you get a
 * chance.
 *
 * There WAS a `ScrollRiver` mounted here too — a fixed, scroll-linked wave
 * line along the left edge (Jude's "morphing scroll effect" request,
 * 2026-09-16). Pulled per his follow-up call: he didn't want the line on
 * the left side. `shared/components/ScrollRiver.tsx` is now dead code the
 * same way IntroCurtain is — I can't delete files from here, so please
 * delete it by hand when you get a chance.
 *
 * `/about/who-we-are` (2026-09-16) is the first real second page on the
 * site — the route navigation.ts already ships under "About." It's the
 * one that finally earns `lazy()` here: `About` is the only page-level
 * view loaded lazily; `Home` stays a static import for the reason in the
 * paragraph above. `<Suspense fallback={null}>` wraps the whole route
 * tree rather than just the About route — harmless for Home's static
 * import, and it means any future lazy route doesn't need its own
 * boundary. See `features/about/views/About.tsx` for what's on the page
 * and why it's one page, not Doc 2's five-page `/about` hub.
 *
 * TAILWIND-ONLY REWRITE, 2026-09-17 (tailwind-design-system migration,
 * confirmed by Jude: full site-wide conversion, `index.css` deleted). This
 * root wrapper now carries the handful of things that used to be plain,
 * unlayered base rules in index.css and had nowhere else to live once that
 * file was gone:
 *   - `font-family` / body `line-height` / `letter-spacing`, via inline
 *     style on one wrapping div (both `--font-heading` and `--font-body`
 *     pointed at the identical stack, so one value covers the whole site —
 *     see shared/styles/tokens.ts).
 *   - Tailwind's `selection:` variant for the old `::selection` rule.
 *     `::-webkit-scrollbar` theming and the `:focus-visible` outline ring
 *     did NOT make the cut — both style *pseudo-elements/pseudo-classes*
 *     with no DOM node a className can attach to, so there is no zero-CSS
 *     way to keep them; confirmed acceptable with Jude, browser defaults
 *     take over for both. `.skip-link` converts cleanly (it was a real
 *     element, just off-screen until focused).
 */
export default function App() {
  return (
    <div
      className="selection:bg-black selection:text-white"
      style={{ fontFamily, lineHeight: 1.6, letterSpacing: '-0.015em' }}
    >
      <BrowserRouter>
        <a
          href="#main"
          className="absolute top-0 -left-[9999px] z-[100] bg-black px-4 py-3 text-white focus:left-0"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about/who-we-are" element={<About />} />
              <Route path="*" element={<Stub />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  )
}

function Stub() {
  return (
    <section data-plate="dark" className="bg-black text-white">
      <div className="mx-auto max-w-[86rem] px-6 pt-48 pb-40">
        <p className="text-xs font-bold tracking-[0.22em] text-[#737373] uppercase">
          Not built yet
        </p>
        <h1
          className="mt-8 text-balance font-heading leading-[1.05] font-bold"
          style={{ fontSize: textH1, letterSpacing: '-0.045em' }}
        >
          Coming next.
        </h1>
      </div>
    </section>
  )
}
