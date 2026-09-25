import type { ReactNode } from 'react'
import { site } from '../../../shared/config/site'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * Home, section 7 — Follow along online. REVAMP 2026-09-25.
 *
 * Was three photo cards (two of them dead Unsplash URLs). Now three huge
 * typographic links on the river ground — the platform name IS the button.
 * Hover: the row fills with abyss from the left, the arrow travels, the
 * handle slides in. Links still come from `site.social`.
 */
interface Platform {
  name: string
  handle: string
  href: string
  icon: ReactNode
}

const platforms: Platform[] = [
  {
    name: 'YouTube',
    handle: '@riverofgodortigas',
    href: site.social.youtube,
    icon: <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />,
  },
  {
    name: 'Facebook',
    handle: 'riverofgodortigas',
    href: site.social.facebook,
    icon: <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93v-1.9c0-.86.24-1.44 1.47-1.44h1.57V4.86c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.9v2.96h2.56V21h3.04Z" />,
  },
  {
    name: 'Instagram',
    handle: '@riverofgod.ph',
    href: site.social.instagram,
    icon: <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 8.1c-.1-1.5-.4-2.8-1.5-3.9S17.1 2.8 15.6 2.7C14.1 2.6 9.9 2.6 8.4 2.7c-1.5.1-2.8.4-3.9 1.5S3.1 6.6 3 8.1c-.1 1.5-.1 5.7 0 7.2.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 5.7.1 7.2 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.5.1-5.7 0-7.2Z" />,
  },
]

export function LiveServicesSection() {
  return (
    <section data-plate="dark" aria-labelledby="live-services-heading" className="grain relative overflow-hidden bg-river py-24 text-bone sm:py-32">
      <div className={`${container} relative`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <SectionHead
            id="live-services-heading"
            eyebrow="Live every Sunday"
            title={
              <>
                Wherever
                <br />
                you are.
              </>
            }
            lead="We stream every Sunday. Follow along on the platform you already use."
          />
          <ul className="self-end border-t border-bone/25">
            {platforms.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 80} className="border-b border-bone/25">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative isolate flex items-center gap-5 overflow-hidden py-6 pr-2 sm:gap-8 sm:py-8"
                >
                  <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-abyss transition-transform duration-[700ms] ease-tide group-hover:scale-x-100 motion-reduce:transition-none" />
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-2 h-7 w-7 flex-none fill-current sm:h-9 sm:w-9">
                    {p.icon}
                  </svg>
                  <span className="font-shout text-[clamp(2.75rem,6.5vw,5.75rem)] leading-none font-extrabold uppercase">{p.name}</span>
                  <span className="ml-auto hidden translate-x-4 text-sm italic text-bone/70 opacity-0 transition-[opacity,transform] duration-500 ease-current group-hover:translate-x-0 group-hover:opacity-100 md:block">
                    {p.handle}
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-auto h-6 w-6 flex-none transition-transform duration-500 ease-current group-hover:translate-x-1 group-hover:text-ember md:ml-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
