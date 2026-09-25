import { Fragment } from 'react'
import { discipleshipStages } from '../../../shared/data/discipleship'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Reveal, WaveMark } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * About — Discipleship teaser. REVAMP 2026-09-25.
 *
 * The full five-stage process (scripture / goal / tools / environment /
 * materials, from the two slide decks Jude sent 2026-09-25) now has its own
 * page at `/discipleship`, single-sourced in `shared/data/discipleship.ts`.
 * This section used to carry a full copy of that data and a stepper; it is
 * now only the doorway: the five stage names on one flowing line (each
 * underlined in its own slide colour, the only place those colours appear
 * on this page), one line of copy, and the way in.
 *
 * Ground: the river (teal) band, closing the page's identity → values →
 * beliefs → process arc before the footer. Keeps id="discipleship-process"
 * so the sub-nav's "Discipleship" pill still lands here.
 */
export function DiscipleshipSection() {
  return (
    <section
      id="discipleship-process"
      data-plate="dark"
      aria-labelledby="discipleship-heading"
      className="relative scroll-mt-32 overflow-hidden bg-river py-24 text-bone sm:py-32"
    >
      <div aria-hidden="true" className="grain absolute inset-0" />
      <WaveMark
        className="pointer-events-none absolute -right-[10%] -bottom-[10%] h-auto w-[70vw] max-w-[900px] text-bone/[0.06]"
        strokeWidth={3}
      />
      <div className={`${container} relative`}>
        <Reveal>
          <Eyebrow className="text-bone/85">How we grow you</Eyebrow>
          <h2 id="discipleship-heading" className="sr-only">
            The Discipleship Process
          </h2>
          <ol
            aria-label="The five stages of the discipleship process"
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 sm:gap-x-6"
          >
            {discipleshipStages.map((s, i) => (
              <Fragment key={s.key}>
                {i > 0 && (
                  <li aria-hidden="true" className="hidden text-bone/45 sm:block">
                    <WaveMark className="h-3 w-7 sm:h-4 sm:w-10" strokeWidth={7} />
                  </li>
                )}
                <li className="font-shout text-[clamp(2.4rem,6.4vw,6rem)] font-extrabold uppercase leading-[0.95]">
                  <span className="relative">
                    {s.title}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-[0.07em] w-full"
                      style={{ background: s.color }}
                    />
                  </span>
                </li>
              </Fragment>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={150} className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[44ch] font-whisper text-[clamp(1.25rem,2vw,1.6rem)] italic leading-snug text-bone/90">
            Five stages, one river — from a first encounter with God to leading others through the
            same current.
          </p>
          <Button to="/discipleship" variant="ember" size="lg" arrow>
            Walk the discipleship process
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
