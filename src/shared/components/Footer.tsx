import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { primaryNav, navActions } from '../config/navigation'
import { site } from '../config/site'
import { container } from '../styles/tokens'
import { Button } from './ui/Button'
import { WaveMark, WaveRule } from './ui/River'

/**
 * Footer. REVAMP 2026-09-25 (ROG 11 §6, Home section 9).
 *
 * Top: a closing invitation (shout line + ember CTA) so every page ends on
 * a next step. Middle: identity, address, service times, and the link
 * columns (all still read from navigation.ts / site.ts). Bottom: the giant
 * RIVER OF GOD wordmark cropped by the page edge — the site's sign-off.
 */
export function Footer() {
  const year = new Date().getFullYear()
  const about = primaryNav.find((item) => item.label === 'About')
  const ministries = primaryNav.find((item) => item.label === 'Ministries')
  const mediaAndEvents = primaryNav.find((item) => item.label === 'Media & Events')

  return (
    <footer data-plate="dark" className="relative isolate w-full overflow-hidden bg-abyss pb-[env(safe-area-inset-bottom)] text-bone">
      <div aria-hidden="true" className="absolute -inset-[20%] -z-10 blur-[80px] [background-image:radial-gradient(ellipse_40%_35%_at_85%_10%,color-mix(in_srgb,var(--color-river)_45%,transparent),transparent_70%)]" />

      <div className={`${container} pt-16 sm:pt-32`}>
        {/* Closing invitation */}
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="font-shout text-[clamp(2.75rem,13vw,7.5rem)] leading-[0.88] font-extrabold uppercase">
            Come alive
            <br />
            <span className="text-shallows">in the river.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to={navActions.planAVisit.to} variant="ember" size="lg" arrow>
              {navActions.planAVisit.label}
            </Button>
            <Button to={navActions.watchLive.to} variant="outline" size="lg" live>
              {navActions.watchLive.label}
            </Button>
          </div>
        </div>

        <WaveRule className="mt-14 text-bone/15 sm:mt-20" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Mobile (2026-09-28): identity + Sundays span both columns, the
              three link lists sit two-up, so the footer is ~half as tall. */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3" aria-label={`${site.name} — home`}>
              <WaveMark className="h-6 w-24 text-bone" />
            </Link>
            <p className="mt-5 max-w-[30ch] font-whisper text-lg italic text-bone/80">{site.motto}</p>
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-bone/60">
              {site.location.venue}
              <br />
              {site.location.area}
            </p>
            <a
              href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
              className="mt-3 inline-block text-sm text-bone/60 transition-colors duration-[400ms] hover:text-sky"
            >
              {site.phone}
            </a>
            <div className="mt-6 flex gap-2">
              <Social href={site.social.facebook} label="River of God on Facebook">
                <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93v-1.9c0-.86.24-1.44 1.47-1.44h1.57V4.86c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.9v2.96h2.56V21h3.04Z" />
              </Social>
              <Social href={site.social.instagram} label="River of God on Instagram">
                <path fillRule="evenodd" d="M7.5 2.5h9a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-9a5 5 0 0 1-5-5v-9a5 5 0 0 1 5-5Zm0 1.8a3.2 3.2 0 0 0-3.2 3.2v9a3.2 3.2 0 0 0 3.2 3.2h9a3.2 3.2 0 0 0 3.2-3.2v-9a3.2 3.2 0 0 0-3.2-3.2h-9ZM12 7.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm5.3-3.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
              </Social>
              <Social href={site.social.youtube} label="River of God on YouTube">
                <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
              </Social>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Sundays</p>
            <ul className="mt-5 grid gap-2">
              {site.services.map((s) => (
                <li key={`${s.day}-${s.time}`} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-shout text-xl font-bold tabular-nums">{s.time}</span>
                  <span className="text-right text-bone/55 italic">
                    {s.label ?? (s.day === 'Sunday' ? s.language.toLowerCase() : s.day)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {about?.children && <FooterColumn heading={about.label} links={about.children} />}
          {ministries?.children && <FooterColumn heading={ministries.label} links={ministries.children} />}

          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">Connect</p>
            <ul className="mt-5 flex flex-col gap-3">
              {mediaAndEvents?.children?.map((child) => (
                <li key={child.to}>
                  <FooterLink to={child.to}>{child.label}</FooterLink>
                </li>
              ))}
              <li>
                <FooterLink to={navActions.planAVisit.to}>{navActions.planAVisit.label}</FooterLink>
              </li>
              <li>
                <FooterLink to={navActions.give.to}>{navActions.give.label}</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-bone/12 py-8 text-[0.8rem] text-bone/50 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            <span aria-hidden="true" className="hidden h-3 w-px bg-bone/20 sm:block" />
            {/* Site credit (2026-09-28, Jude). */}
            <p>
              Powered by{' '}
              <a
                href="https://alphaexplora.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone/70 underline decoration-bone/25 underline-offset-4 transition-colors duration-[400ms] hover:text-sky hover:decoration-sky"
              >
                Alphaexplora Inc.
              </a>
            </p>
          </div>
          <div className="flex gap-6">
            <a href="https://www.riverofgod.ph/rogprivacycctvnotice" target="_blank" rel="noreferrer" className="transition-colors duration-[400ms] hover:text-bone">
              Privacy Policy
            </a>
            <a href="https://www.riverofgod.ph/rogtermsfordigitalcontent" target="_blank" rel="noreferrer" className="transition-colors duration-[400ms] hover:text-bone">
              Terms of Use
            </a>
          </div>
        </div>
      </div>

      {/* Sign-off wordmark, cropped by the page edge */}
      {/* pointer-events-none: the glyphs overflow their 0.8 line box upward and
          were sitting on top of the copyright row, swallowing its clicks. */}
      <div aria-hidden="true" className="pointer-events-none relative select-none">
        <WaveMark className="absolute left-1/2 top-0 h-auto w-24 -translate-x-1/2 -translate-y-1/2 text-bone" strokeWidth={6} />
        <p className="-mb-[0.22em] whitespace-nowrap text-center font-shout text-[21.5vw] leading-[0.8] font-black uppercase text-bone/[0.07]">
          River of God
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({ heading, links }: { heading: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-shallows uppercase">{heading}</p>
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
    <Link to={to} className="text-sm text-bone/70 transition-colors duration-[400ms] ease-current hover:text-sky">
      {children}
    </Link>
  )
}

function Social({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bone/20 text-bone/70 transition-colors duration-[400ms] ease-current hover:border-sky hover:text-sky"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        {children}
      </svg>
    </a>
  )
}
