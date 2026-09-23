import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { primaryNav, navActions } from '../config/navigation'
import { site } from '../config/site'

/**
 * Site-wide footer. Global chrome like Navbar — lives in shared/components/
 * and is mounted once in App.tsx, not per-page, per Doc 4's "shared = global"
 * rule.
 *
 * `data-plate="dark"` / `.plate-dark` so Navbar's own scroll-tone detector
 * (it reads every `[data-plate]` element's bounding rect — see Navbar.tsx)
 * gets a correct answer if the bar is ever above the footer, e.g. on a
 * short page or after an anchor jump. Always dark regardless of what plate
 * precedes it — a footer is naturally the last, heaviest thing on the page,
 * and NextStepsSection already ends on plate-dark too, so there's no jarring
 * light-to-dark snap directly above it.
 *
 * `site.logo.mark` (the wave-only PNG) reused here with Tailwind's plain
 * `invert` utility rather than the navbar's own `.nav-mark__img` CSS — that
 * rule is written to key off `.nav-bar[data-tone='dark']` specifically
 * (the bar can be either tone; the footer is always dark), so it doesn't
 * apply here and doesn't need to.
 *
 * The logo's `!h-4` is `!important`, not decoration — index.css's BASE rule
 * `img, video { max-width: 100%; height: auto; }` is unlayered CSS, and
 * unlayered CSS beats ANY Tailwind utility (Tailwind's own utilities live
 * inside `@layer`) regardless of source order or specificity. Without the
 * `!`, that base rule's `height: auto` always won and the logo rendered at
 * its full intrinsic size — 2048×572 scaled only by its container's
 * max-width, not by the `h-*` class at all. Same gotcha already documented
 * elsewhere in this codebase (`.plate-dark`'s own background needing
 * `!bg-[...]` in HeroSection) — anything sizing/styling an `<img>` or
 * `<video>` here needs the same `!` or it silently no-ops.
 *
 * NAV COLUMNS ARE DERIVED FROM `primaryNav`, not a separate hand-maintained
 * list — Doc 2 names a distinct `footerColumns` field on the `navigation`
 * single type, but until the CMS exists, duplicating link data here would
 * just be one more place for it to drift from the real nav. `Connect`
 * merges Media & Events' children with Reach Us and the two secondary
 * header actions (Plan a Visit, Give — Watch Live is omitted, it's a
 * state/action rather than a destination worth repeating in a footer).
 *
 * ⚠ `/privacy` and `/terms` are placeholder routes, same forward-reference
 * pattern as HeroSection's `/sermons` — nothing confirms these pages exist
 * or what they'll say yet; caught by App.tsx's Stub route until they're
 * built. Social links: only Facebook is confirmed anywhere in this project
 * (`site.liveStreamUrl`) — add the rest once ROG supplies real handles
 * rather than guessing at Instagram/YouTube URLs that may not exist.
 *
 * TAILWIND-ONLY REWRITE, 2026-09-17. `text-ink-muted`/`text-ink-subtle`/
 * `ring-line-strong`/`border-line` were @theme-generated utilities that
 * disappeared with index.css; this footer is always dark, so they're
 * replaced with their literal dark-plate values directly (see
 * shared/styles/tokens.ts for where those hex values come from).
 *
 * UPDATED 2026-09-22 with confirmed real content from riverofgod.ph: a
 * phone number (new `site.phone` field), and Privacy/Terms now point at
 * the real live pages on riverofgod.ph (external links) instead of this
 * site's own `/privacy` and `/terms` stub routes — those stubs still exist
 * in App.tsx for now but nothing links to them from here anymore.
 */
export function Footer() {
  const year = new Date().getFullYear()

  const about = primaryNav.find((item) => item.label === 'About')
  const ministries = primaryNav.find((item) => item.label === 'Ministries')
  const mediaAndEvents = primaryNav.find((item) => item.label === 'Media & Events')
  const reachUs = primaryNav.find((item) => item.label === 'Reach Us')

  return (
    <footer data-plate="dark" className="bg-black text-white">
      <div className="mx-auto max-w-[86rem] px-6 py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* --------------------------------------------------------- BRAND */}
          <div>
            <Link to="/" className="inline-flex" aria-label={`${site.name} — home`}>
              <img src={site.logo.mark} alt="" className="!h-4 w-auto invert" />
            </Link>

            <p className="mt-5 max-w-[62ch] text-sm text-[#a6a6a6]">{site.motto}</p>

            <p className="mt-6 text-sm text-[#737373]">
              {site.location.venue}
              <br />
              {site.location.area}
            </p>

            <a
              href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
              className="mt-3 inline-block text-sm text-[#737373] transition-colors duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
            >
              {site.phone}
            </a>

            <a
              href={site.liveStreamUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="River of God on Facebook"
              className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full
                ring-1 ring-[#3d3d3d] text-[#a6a6a6] transition-colors
                duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white hover:ring-white"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93v-1.9c0-.86.24-1.44 1.47-1.44h1.57V4.86c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.9v2.96h2.56V21h3.04Z" />
              </svg>
            </a>
          </div>

          {/* ------------------------------------------------------ ABOUT */}
          {about?.children && <FooterColumn heading={about.label} links={about.children} />}

          {/* -------------------------------------------------- MINISTRIES */}
          {ministries?.children && (
            <FooterColumn heading={ministries.label} links={ministries.children} />
          )}

          {/* ---------------------------------------------------- CONNECT */}
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#737373] uppercase">
              Connect
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {mediaAndEvents?.children?.map((child) => (
                <li key={child.to}>
                  <FooterLink to={child.to}>{child.label}</FooterLink>
                </li>
              ))}
              {reachUs?.to && (
                <li>
                  <FooterLink to={reachUs.to}>{reachUs.label}</FooterLink>
                </li>
              )}
              <li>
                <FooterLink to={navActions.planAVisit.to}>{navActions.planAVisit.label}</FooterLink>
              </li>
              <li>
                <FooterLink to={navActions.give.to}>{navActions.give.label}</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------------- LEGAL */}
        <div className="mt-16 flex flex-col gap-4 border-t border-[#262626] pt-8 text-sm text-[#737373] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://www.riverofgod.ph/rogprivacycctvnotice"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#a6a6a6] transition-colors duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.riverofgod.ph/rogtermsfordigitalcontent"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#a6a6a6] transition-colors duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ heading, links }: { heading: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.18em] text-[#737373] uppercase">{heading}</p>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.to}>
            <FooterLink to={link.to}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="text-sm text-[#a6a6a6] transition-colors duration-[400ms]
        ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
    >
      {children}
    </Link>
  )
}
