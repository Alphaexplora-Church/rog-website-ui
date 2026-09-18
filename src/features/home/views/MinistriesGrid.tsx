import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import {
  maskLineBase,
  maskLineHidden,
  maskLineShown,
  revealBase,
  revealDelay1,
  revealHidden,
  revealShown,
  textH2,
} from '../../../shared/styles/tokens'

/**
 * Home, section 5 — "Ministries by life stage" (Doc 8 §3), refined per
 * Jude's 2026-09-16 revision to a curated 4, not all 6 from Doc 2's full
 * list (River Kids, River Youth, Young Adults, River Men & Women, Seasoned,
 * Family) — the full set still belongs on `/ministries`; this is a taster,
 * not the directory.
 *
 * `Activate12` is a REAL ROG ministry, already routed in navigation.ts
 * (`/activate12`) — not invented for this card. `Discipleship` likewise
 * reuses the existing `/discipleship` route. Kids and Young Adults have no
 * dedicated page yet, so both point at the general `/ministries` listing
 * until they do.
 *
 * Each tile still carries its own authored line icon (same ultra-light
 * stroke language as the hero badge's calendar/pin icons) — the "no stock
 * photography" rule that used to govern this file no longer holds site-
 * wide as of Jude's 2026-09-16 "para may buhay" request; see the
 * ⚠ PLACEHOLDER PHOTOS note below for what changed and why.
 *
 * Each icon carries one plain navy-blue colour, the same on every card —
 * see EventsStrip/NextStepsSection/ServiceTimesSection for the matching
 * accent elsewhere.
 *
 * ICON TREATMENT, 2026-09-16 follow-up: Jude called the original badge —
 * a thin 1px ring circle around a plain Heroicons-style outline glyph —
 * out specifically as "looks very AI"; that exact shape (thin-stroke icon
 * centred in a hairline circle) is the single most common default a
 * generated site reaches for, so it reads as templated no matter how the
 * rest of the page is designed. Replaced with a solid-tint rounded-square
 * tile, same signature now used on NextStepsSection's two icons. (A small
 * wave-squiggle mark under the tile was tried in the same pass and pulled
 * right after — Jude didn't like it — so the tile alone is the current
 * treatment; nothing under it.)
 *
 * ⚠ PLACEHOLDER PHOTOS — each card also carries a keyword-matched photo
 * (loremflickr.com) above the icon per Jude's "para may buhay" follow-up.
 * The icon + its colour stay exactly as they were; the photo is new, not a
 * replacement. Same caveat as WelcomeBanner's: loremflickr photos aren't
 * licensed for production, replace with real ROG photos before launch.
 */
interface MinistryCardData {
  name: string
  tag: string
  to: string
  icon: ReactNode
  photo: string
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-6 w-6',
}

const ministries: MinistryCardData[] = [
  {
    name: 'Kids',
    tag: 'Ages 4–12',
    to: '/ministries',
    photo: 'https://loremflickr.com/400/300/kids,children?lock=11',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      </svg>
    ),
  },
  {
    name: 'Activate12',
    tag: 'Youth · Ages 13–19',
    to: '/activate12',
    photo: 'https://loremflickr.com/400/300/teenagers,youthgroup?lock=12',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3.5c1.5 3 3.5 4.5 3.5 8a3.5 3.5 0 1 1-7 0c0-1 .4-1.7 1-2.3.2 1 .8 1.6 1.5 1.6.9 0 1-1 .8-2C11.4 7 11.6 5.2 12 3.5Z" />
      </svg>
    ),
  },
  {
    name: 'Young Adults',
    tag: 'Ages 20–30',
    to: '/ministries',
    photo: 'https://loremflickr.com/400/300/friends,youngadults?lock=13',
    icon: (
      <svg {...iconProps}>
        <circle cx="8.5" cy="8.5" r="2.75" />
        <circle cx="16" cy="9.5" r="2.25" />
        <path d="M3.5 19.5c0-3 2.2-5.3 5-5.3s5 2.3 5 5.3M14 19.5c0-2.2 1.4-4 3.5-4.6 1.7.4 3 1.9 3 4.1" />
      </svg>
    ),
  },
  {
    name: 'Discipleship',
    tag: "Find your next step",
    to: '/discipleship',
    photo: 'https://loremflickr.com/400/300/biblestudy,mentor?lock=14',
    icon: (
      <svg {...iconProps}>
        <path d="M5 19V6.5A2.5 2.5 0 0 1 7.5 4H19v14.5" />
        <path d="M5 19a2 2 0 0 0 2 2h12" />
        <path d="M9 8h7M9 11.5h5" />
      </svg>
    ),
  },
]

export function MinistriesGrid() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="ministries-heading"
      className="bg-black text-white"
    >
      <div className="mx-auto max-w-[86rem] px-6 py-24 sm:py-32">
        <p className="text-xs font-bold tracking-[0.22em] text-[#737373] uppercase">
          Find Your Place
        </p>

        <h2
          id="ministries-heading"
          className="mt-6 max-w-[62ch] text-balance font-heading leading-[1.05] font-bold"
          style={{ fontSize: textH2, letterSpacing: '-0.04em' }}
        >
          <span className="block overflow-hidden pb-[0.1em]">
            <span className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden}`}>
              There's a room for you.
            </span>
          </span>
        </h2>

        <div
          className={`mt-16 grid grid-cols-2 gap-px overflow-hidden
            rounded-2xl bg-[#262626] ring-1 ring-[#262626] lg:grid-cols-4 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {ministries.map((m) => (
            <Link
              key={m.name}
              to={m.to}
              className="group flex flex-col gap-5 bg-[#0d0d0d] p-8 transition-colors
                duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#1a1a1a]"
            >
              <div className="-mx-8 -mt-8 overflow-hidden">
                <img
                  src={m.photo}
                  alt=""
                  aria-hidden="true"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>

              <span
                aria-hidden="true"
                className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"
              >
                {m.icon}
              </span>
              <span>
                <span className="block font-heading text-lg font-bold">{m.name}</span>
                <span className="mt-1 block text-sm text-[#a6a6a6]">{m.tag}</span>
              </span>
              <span
                className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-white
                  opacity-70 transition-opacity group-hover:opacity-100"
              >
                Learn more
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
