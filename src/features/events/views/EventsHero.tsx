import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { Spotlight, useSpotlight } from '../../../shared/components/ui/Spotlight'

/**
 * Events, section 1 — small hero. No Figma reference for this page (Jude,
 * 2026-09-22: "ikaw na muna bahala kung pano yung UI basta match sa theme
 * nung website") — built to match the established pattern from
 * MinistriesHero: photo bg, gradient overlay, wave divider into the next
 * section, same dark-plate/teal-accent system as the rest of the site.
 *
 * ── MOTION PASS 2026-09-24 ───────────────────────────────────────────────
 * Jude: "lagyan mo ng animation… para hindi siya mukang pale and boring."
 *   · The photo settles from a slight zoom to rest over ~2.4s on arrival —
 *     a transition, not a loop, so it happens once and then stays still.
 *   · Eyebrow, headline and the teal rule arrive in sequence.
 *   · A wide, soft teal glow follows the mouse across the hero (mouse
 *     only; see `Spotlight`).
 * All of it is dropped under `prefers-reduced-motion`.
 */
export function EventsHero() {
  const { ref, shown } = useInView<HTMLElement>()
  const spot = useSpotlight<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  return (
    <section
      {...spot}
      data-plate="dark"
      className="group relative overflow-hidden bg-black text-white"
    >
      <img
        src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-[2400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:scale-100 motion-reduce:transition-none ${
          shown ? 'scale-100' : 'scale-110'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
      <Spotlight size={700} strength={0.1} />

      <div
        ref={ref}
        className="relative z-[2] mx-auto max-w-[86rem] px-6 pt-40 pb-28 sm:pt-48 sm:pb-36"
      >
        <p
          className={`text-xs font-bold tracking-[0.22em] text-[#8FD4C9] uppercase ${reveal}`}
          style={{ transitionDelay: '0ms' }}
        >
          Events
        </p>
        <h1
          className={`mt-4 max-w-[24ch] text-balance font-heading text-3xl font-bold leading-[1.1] sm:text-5xl ${reveal}`}
          style={{ transitionDelay: '120ms' }}
        >
          Gather with us, on Sundays and every day in between.
        </h1>
        <span
          aria-hidden="true"
          className={`mt-8 block h-[3px] w-16 origin-left rounded-full bg-[#8FD4C9] transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
            shown ? 'scale-x-100' : 'scale-x-0'
          }`}
          style={{ transitionDelay: '420ms' }}
        />
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="relative z-[2] block h-[70px] w-full sm:h-[100px]"
      >
        <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#232323" />
      </svg>
    </section>
  )
}
