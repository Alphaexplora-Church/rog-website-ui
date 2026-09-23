import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

export interface RosterPerson {
  name: string
  /** One or more role lines. Most rosters carry a single role; the
   * Apostolic Team's people hold several titles each (per riverofgod.ph),
   * so this is always an array — callers with one role just pass a
   * one-item array. */
  roles: string[]
}

interface TeamRosterRowProps {
  id: string
  heading: string
  people: RosterPerson[]
  /** Literal Tailwind bg class — only two shades are used site-wide, both passed as complete strings by the caller (Tailwind's JIT needs the literal token, never an assembled one). */
  bg: 'bg-[#232323]' | 'bg-[#161616]'
}

/**
 * Generic avatar placeholder — flat circle + person glyph, standing in for
 * a real headshot until one is supplied. REPLACED the earlier stock/seeded
 * photo placeholders 2026-09-22 per Jude's direct feedback on a screenshot
 * of this row ("make it like this icon") pointing at a plain gray default-
 * avatar circle rather than a random stock photo — stock photos read as
 * real people who aren't actually these pastors/leads, which is worse than
 * an obviously-generic placeholder.
 */
function AvatarPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="flex h-24 w-24 items-center justify-center rounded-full bg-[#3a3a3a] ring-1 ring-white/10"
    >
      <svg viewBox="0 0 24 24" className="h-12 w-12 text-[#525252]" fill="currentColor">
        <circle cx="12" cy="8.5" r="4" />
        <path d="M4 20.2C4 16.2 7.6 13.5 12 13.5s8 2.7 8 6.7c0 .4-.3.8-.8.8H4.8c-.5 0-.8-.4-.8-.8Z" />
      </svg>
    </div>
  )
}

/**
 * Shared roster row — used by ApostolicTeamSection, OrtigasPastorsSection
 * and ServingMinistryHeadsSection, which are identical in shape in the
 * Figma design (a heading + a row of avatar/name/role cards) and differ
 * only in heading, roster and background shade. Pulled out once three
 * sections needed the exact same markup, rather than tripling it.
 *
 * REVISED 2026-09-22 (three rounds, same day): left-aligned horizontal
 * scroll of bare circles → centered wrapping row of bare circles → each
 * avatar inside its own rounded card box with name/role captioned below
 * it → this round, name/role moved INSIDE the box too (per Jude's
 * screenshot: everything — avatar, name, role — lives inside the one card).
 * Card box stretches evenly to fill the row via a CSS grid with
 * `auto-fit`/`minmax`, however many people are in the roster.
 */
export function TeamRosterRow({ id, heading, people, bg }: TeamRosterRowProps) {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      id={id}
      data-plate="dark"
      aria-labelledby={`${id}-heading`}
      className={`${bg} text-white`}
    >
      <div className="mx-auto max-w-[86rem] px-6 py-20 sm:py-24">
        <h2
          id={`${id}-heading`}
          className="font-heading text-2xl font-bold text-white sm:text-3xl"
        >
          {heading}
        </h2>

        <div
          className={`mt-10 grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-6 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {people.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-4 rounded-2xl bg-white/5 px-6 py-8 text-center ring-1 ring-white/10"
            >
              <AvatarPlaceholder />
              <div>
                <p className="font-heading text-base font-bold text-white">{p.name}</p>
                {p.roles.map((r) => (
                  <p key={r} className="mt-1 text-sm text-[#a6a6a6]">
                    {r}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
