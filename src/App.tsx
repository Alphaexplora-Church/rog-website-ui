import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from './shared/components/Navbar'
import { Footer } from './shared/components/Footer'
import { ScrollToTop } from './shared/components/ScrollToTop'
import { PageTransition } from './shared/components/PageTransition'
import Home from './features/home/views/Home'
import { container, displayL } from './shared/styles/tokens'
import { Button } from './shared/components/ui/Button'

const About = lazy(() => import('./features/about/views/About'))
const HimPhilippines = lazy(() => import('./features/about/views/HimPhilippines'))
const Ministries = lazy(() => import('./features/ministries/views/Ministries'))
const Media = lazy(() => import('./features/media/views/Media'))
const SeriesDetail = lazy(() => import('./features/media/views/SeriesDetail'))
const BrowseDetail = lazy(() => import('./features/media/views/BrowseDetail'))
const SermonDetail = lazy(() => import('./features/media/views/SermonDetail'))
const Events = lazy(() => import('./features/events/views/Events'))
const PlanAVisit = lazy(() => import('./features/plan-a-visit/views/PlanAVisit'))
const WatchLive = lazy(() => import('./features/watch-live/views/WatchLive'))
const Give = lazy(() => import('./features/give/views/Give'))
const Discipleship = lazy(() => import('./features/discipleship/views/Discipleship'))

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
 * already carried by HeroSection itself. There WAS also a `ScrollRiver`
 * mounted here — a fixed, scroll-linked wave line along the left edge
 * (Jude's "morphing scroll effect" request, 2026-09-16), pulled per his
 * follow-up call. Both were confirmed dead (unimported, and each referenced
 * CSS custom properties/classes that no longer exist post-tailwind-migration)
 * and deleted outright, 2026-09-18 — `shared/components/IntroCurtain.tsx` and
 * `shared/components/ScrollRiver.tsx` no longer exist.
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
 *
 * MEDIA + EVENTS ROUTES, 2026-09-22. `/media` is the filterable Media
 * Library (Series/Topics/Speakers/Scripture) with three drill-down detail
 * routes; `/events` is a fully separate page — they only share a slot in
 * the Navbar's "Media & Events" dropdown (navigation.ts), per Jude's
 * explicit instruction that the two are different pages, not tabs of one
 * page. See features/media/views/Media.tsx and
 * features/events/views/Events.tsx for what's on each and why.
 *
 * PLAN A VISIT + WATCH LIVE ROUTES, 2026-09-22. `navActions` in
 * navigation.ts already pointed the top-right pills at `/plan-a-visit` and
 * `/watch-live` — these are the pages those pills were waiting on.
 * `/plan-a-visit` is Jude's own form spec (see
 * features/plan-a-visit/views/PlanAVisit.tsx); `/watch-live` ports the
 * countdown logic from a reference component Jude shared, re-skinned to
 * this site's design system (see
 * features/watch-live/viewModels/useWatchLiveViewModel.ts).
 *
 * SCROLL RESTORATION, 2026-09-23. `<ScrollToTop />` sits directly inside
 * BrowserRouter so every route change starts at the top — a client-side
 * route swap does not move the scrollbar on its own, so navigating from
 * halfway down one page used to land you halfway down the next. It leaves
 * back/forward alone on purpose; see the component's own comment.
 *
 * GIVE ROUTE, 2026-09-23. `navigation.ts` has shipped a `/give` pill in the
 * top-right since the nav was built; until now it fell through to the Stub
* below. Built from a reference component Jude sent, re-paletted to this
* site's teal — see features/give/views/Give.tsx.
 *
 * REVAMP, 2026-09-25 ("Textured Editorial", ROG 11). Type, colour and the
 * grain layer now come from `index.css` (@theme + body), so the root no
 * longer carries an inline font stack. `/discipleship` — already in the
 * Ministries dropdown — gets its own page (the 5-stage process Jude sent).
 *
 * PAGE TRANSITIONS, 2026-09-24. `<PageTransition>` fades each new page in
 * over the root's black background instead of hard-cutting between routes;
 * see the component's own comment. The root is `bg-black` so that fade never
 * flashes the browser's white page background.
*/
export default function App() {
  return (
    <div className="bg-abyss text-bone">
      <BrowserRouter>
        <ScrollToTop />
        <a
          href="#main"
          className="absolute top-0 -left-[9999px] z-[100] rounded-br-2xl bg-ember px-4 py-3 font-semibold text-abyss focus:left-0"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main">
          <Suspense fallback={null}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about/who-we-are" element={<About />} />
                <Route path="/about/him-ph" element={<HimPhilippines />} />
                <Route path="/ministries" element={<Ministries />} />
                <Route path="/ministries/body-of-christ" element={<Ministries />} />
                <Route path="/media" element={<Media />} />
                <Route path="/media/series/:slug" element={<SeriesDetail />} />
                <Route path="/media/browse/:type/:slug" element={<BrowseDetail />} />
                <Route path="/media/watch/:slug" element={<SermonDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/plan-a-visit" element={<PlanAVisit />} />
                <Route path="/watch-live" element={<WatchLive />} />
                <Route path="/give" element={<Give />} />
                <Route path="/discipleship" element={<Discipleship />} />
                <Route path="*" element={<Stub />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  )
}

function Stub() {
  return (
    <section data-plate="dark" className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-abyss text-bone">
      <div aria-hidden="true" className="absolute -inset-[20%] -z-10 blur-[70px] [background-image:radial-gradient(ellipse_40%_45%_at_20%_30%,color-mix(in_srgb,var(--color-river)_70%,transparent),transparent_70%)]" />
      <div className={`${container} pt-40 pb-24`}>
        <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Not built yet</p>
        <h1 className={`mt-6 ${displayL}`}>
          Coming
          <br />
          next.
        </h1>
        <p className="mt-6 max-w-[40ch] font-whisper text-xl italic text-bone/75">
          This part of the river is still being dug. Meanwhile, come find us on a Sunday.
        </p>
        <div className="mt-10">
          <Button to="/" variant="ember" arrow>
            Back home
          </Button>
        </div>
      </div>
    </section>
  )
}
