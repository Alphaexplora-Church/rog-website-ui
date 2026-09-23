import type { ReactNode } from 'react'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * Home — "Watch Our Live Services." Three-platform strip sitting between
 * Watch or Listen and Our Services & Main Center. The URLs are real ROG
 * accounts (from the IA handoff doc / riverofgod.ph's own footer) — not
 * placeholders, unlike the sermon cards above once were.
 *
 * ── REWORKED 2026-09-23 ──────────────────────────────────────────────────
 * Part of Jude's "fix the UI and the design too of the Home tab".
 *
 *   1. A UNICODE GLYPH WAS DOING AN ICON'S JOB. The YouTube card's name was
 *      literally the string "▷ ROG YouTube". Doc 9's first surviving ban is
 *      "no unicode glyphs or emoji as icons" — and it was inconsistent on
 *      top of that, since Facebook and Instagram got no mark at all. All
 *      three now carry a real SVG, in the same 24×24 `fill-current` style
 *      as the Facebook icon already in Footer.tsx.
 *   2. ONLY ONE CARD HAD A PLAY BADGE. Same inconsistency from the other
 *      direction. The badge is gone; the platform icon is the affordance
 *      now, and it is the same on all three.
 *   3. THE HEADING WAS 24px WITH NO EYEBROW, like its neighbour below —
 *      both now match the rest of the page (Doc 9 §4C pill + text-3xl/4xl).
 *   4. THE FACEBOOK CARD'S PHOTO NEVER LOADED. `photo-1760367121593…`
 *      returns nothing — the same dead URL that was on the Main Center card
 *      and the Christmas Eve event. Swapped for one confirmed to load.
 *
 * Figma's asymmetric corners went the way they did everywhere else.
 */
interface Platform {
  name: string
  href: string
  photo: string
  /** Complete, literal Tailwind gradient-overlay class — one of three fixed
   *  options below, never assembled from pieces (Tailwind's JIT scanner
   *  needs the whole class string present in source, see tokens.ts). */
  overlay: string
  icon: ReactNode
}

const YouTubeIcon = (
  <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
)

/** Same path Footer.tsx already ships for its Facebook link. */
const FacebookIcon = (
  <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93v-1.9c0-.86.24-1.44 1.47-1.44h1.57V4.86c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.9v2.96h2.56V21h3.04Z" />
)

const InstagramIcon = (
  <path d="M12 2.8c3 0 3.34.01 4.52.07 1.09.05 1.68.23 2.07.38.52.2.9.45 1.29.84.39.39.64.77.84 1.29.15.39.33.98.38 2.07.06 1.18.07 1.53.07 4.52s-.01 3.34-.07 4.52c-.05 1.09-.23 1.68-.38 2.07-.2.52-.45.9-.84 1.29-.39.39-.77.64-1.29.84-.39.15-.98.33-2.07.38-1.18.06-1.53.07-4.52.07s-3.34-.01-4.52-.07c-1.09-.05-1.68-.23-2.07-.38-.52-.2-.9-.45-1.29-.84-.39-.39-.64-.77-.84-1.29-.15-.39-.33-.98-.38-2.07C2.81 15.34 2.8 15 2.8 12s.01-3.34.07-4.52c.05-1.09.23-1.68.38-2.07.2-.52.45-.9.84-1.29.39-.39.77-.64 1.29-.84.39-.15.98-.33 2.07-.38C8.66 2.81 9 2.8 12 2.8Zm0 4.5a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1Zm5.98-7.94a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
)

const platforms: Platform[] = [
  {
    name: 'ROG YouTube',
    href: 'https://www.youtube.com/@riverofgodortigas',
    photo:
      'https://images.unsplash.com/photo-1622598453695-4fbaf151aadc?auto=format&fit=crop&w=600&q=80',
    overlay:
      'bg-[linear-gradient(0deg,rgba(10,10,10,0.88)_0%,rgba(10,10,10,0.2)_60%,rgba(10,10,10,0.05)_100%)]',
    icon: YouTubeIcon,
  },
  {
    name: 'ROG Facebook',
    // Was photo-1760367121593-97b9a02bbd65 — that URL returns nothing.
    href: 'https://www.facebook.com/riverofgodortigas/',
    photo:
      'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=600&q=80',
    overlay:
      'bg-[linear-gradient(0deg,rgba(14,42,63,0.86)_0%,rgba(14,42,63,0.15)_60%,rgba(14,42,63,0.05)_100%)]',
    icon: FacebookIcon,
  },
  {
    name: 'ROG Instagram',
    href: 'https://www.instagram.com/riverofgod.ph/',
    photo:
      'https://images.unsplash.com/photo-1561524891-8e08ab8569f3?auto=format&fit=crop&w=600&q=80',
    overlay:
      'bg-[linear-gradient(0deg,rgba(27,122,112,0.88)_0%,rgba(27,122,112,0.2)_60%,rgba(27,122,112,0.05)_100%)]',
    icon: InstagramIcon,
  },
]

export function LiveServicesSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="live-services-heading"
      className="relative overflow-hidden bg-[#161616] text-white"
    >
      <div className="relative mx-auto max-w-[86rem] px-6 pt-24 pb-36 sm:pt-28 sm:pb-44">
        <div className={reveal} style={{ transitionDelay: '0ms' }}>
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{
              color: '#8FD4C9',
              backgroundColor: 'rgb(27 122 112 / 0.18)',
              boxShadow: 'inset 0 0 0 1px rgb(143 212 201 / 0.25)',
            }}
          >
            Live
          </span>
          <h2
            id="live-services-heading"
            className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Watch Our Live Services
          </h2>
          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-white/55">
            We stream every Sunday. Follow along wherever you already are.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {platforms.map((p, i) => (
            <li key={p.name} className={reveal} style={{ transitionDelay: `${120 + i * 70}ms` }}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-[190px] items-end overflow-hidden rounded-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
              >
                <img
                  src={p.photo}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:transition-none"
                />
                <span aria-hidden="true" className={`absolute inset-0 ${p.overlay}`} />

                <span className="relative flex w-full items-center gap-3 p-5">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-white">
                      {p.icon}
                    </svg>
                  </span>
                  <span className="text-[15px] font-bold text-white">{p.name}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="ml-auto h-4 w-4 shrink-0 text-white/60 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Wave divider into Our Services & Main Center (#232323). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[90px] w-full sm:h-[120px]"
      >
        <path
          d="M0,70 C360,140 720,0 1080,75 C1260,110 1350,95 1440,75 L1440,140 L0,140 Z"
          fill="#232323"
        />
      </svg>
    </section>
  )
}
