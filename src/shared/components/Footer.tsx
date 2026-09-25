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
    <footer data-plate="dark" className="relative isolate overflow-hidden bg-abyss text-bone">
      <div aria-hidden="true" className="absolute -inset-[20%] -z-10 blur-[80px] [background-image:radial-gradient(ellipse_40%_35%_at_85%_10%,rgb(14_95_104/0.45),transparent_70%)]" />

      <div className={`${container} pt-24 sm:pt-32`}>
        {/* Closing invitation */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="font-shout text-[clamp(3rem,8vw,7.5rem)] leading-[0.88] font-extrabold uppercase">
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

        <WaveRule className="mt-20 text-bone/15" />

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label={`${site.name} — home`}>
              <img src={site.logo.mark} alt="" className="h-6 w-auto invert" />
            </Link>
            <p className="mt-5 max-w-[30ch] font-whisper text-lg italic text-bone/80">{site.motto}</p>
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-bone/60">
              {site.location.venue}
              <br />
              {site.location.area}
            </p>
            <a
              href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
              className="mt-3 inline-block text-sm text-bone/60 transition-colors duration-[400ms] hover:text-ember"
            >
              {site.phone}
            </a>
            <div className="mt-6 flex gap-2">
              <Social href={site.social.facebook} label="River of God on Facebook">
                <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93v-1.9c0-.86.24-1.44 1.47-1.44h1.57V4.86c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.9v2.96h2.56V21h3.04Z" />
              </Social>
              <Social href={site.social.instagram} label="River of God on Instagram">
                <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 8.1c-.1-1.5-.4-2.8-1.5-3.9S17.1 2.8 15.6 2.7C14.1 2.6 9.9 2.6 8.4 2.7c-1.5.1-2.8.4-3.9 1.5S3.1 6.6 3 8.1c-.1 1.5-.1 5.7 0 7.2.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 5.7.1 7.2 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.5.1-5.7 0-7.2Z" />
              </Social>
              <Social href={site.social.youtube} label="River of God on YouTube">
                <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
              </Social>
            </div>
          </div>

          <div>
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

        <div className="flex flex-col gap-4 border-t border-bone/12 py-8 text-sm text-bone/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
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
      <div aria-hidden="true" className="relative select-none">
        <WaveMark className="absolute left-1/2 top-0 h-auto w-24 -translate-x-1/2 -translate-y-1/2 text-ember" strokeWidth={6} />
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
    <Link to={to} className="text-sm text-bone/70 transition-colors duration-[400ms] ease-current hover:text-ember">
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bone/20 text-bone/70 transition-colors duration-[400ms] ease-current hover:border-ember hover:text-ember"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        {children}
      </svg>
    </a>
  )
}
