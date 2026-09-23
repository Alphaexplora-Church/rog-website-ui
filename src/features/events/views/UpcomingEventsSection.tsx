import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { events } from '../data/eventsData'
import { EventCard } from './EventCard'

/**
 * Events, section 3 — "Upcoming Events".
 *
 * ── REBUILT 2026-09-23 ───────────────────────────────────────────────────
 * Jude: "fix the UI of the Upcoming events under the Events Tab. make sure
 * that the data of both Events in Home tab and events tab are the same."
 *
 * THEY WERE NOT THE SAME, AND NOT BY A LITTLE. This page rendered three
 * cards titled "Sample Event — Youth Night", "Sample Event — Baptism Sunday"
 * and "Sample Event — Church-wide Outreach", each reading "Date to be
 * confirmed", while the home page listed the four actual ROG programmes with
 * dates, times and locations. Anyone clicking through from home to "see all
 * events" landed on a page that shared nothing with what they had just been
 * looking at — and the dedicated Events page was the emptier of the two.
 *
 * Both pages now read `features/events/data/eventsData.ts` and render the
 * same `EventCard`, so neither the content nor the look can drift again. The
 * old placeholders are gone entirely; they were honest about being fake, but
 * real data existed one folder away the whole time.
 *
 * THE UI, WHICH WAS THE OTHER HALF OF THE ASK: it was a white plate dropped
 * between two dark ones, with a 24px heading, no eyebrow, and dashed grey
 * boxes carrying two lines of text each. It is now the same dark treatment
 * as the rest of the page and the same card as home — `#161616` against
 * WeeklyGatherings' `#232323` above it, so the sections still separate — plus
 * the Doc 9 §4C eyebrow pill, a section-scale heading, and a wave divider
 * into the footer, matching how the home page closes.
 *
 * The scheduling caveats (unconfirmed dates, two missing times, assumed
 * locations) live in eventsData.ts beside the values they apply to.
 */
export function UpcomingEventsSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="events-upcoming-heading"
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
            What&apos;s On
          </span>
          <h2
            id="events-upcoming-heading"
            className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Upcoming Events
          </h2>
          <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-white/55">
            Gatherings, retreats and conferences across the season. Dates and venues are confirmed
            closer to each one.
          </p>
        </div>

        {events.length === 0 ? (
          <div
            className={`mt-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center ${reveal}`}
            style={{ transitionDelay: '120ms' }}
          >
            <p className="text-sm text-white/50">
              Nothing on the calendar right now — check back soon.
            </p>
          </div>
        ) : (
          <ul className="mt-12 flex flex-col gap-4">
            {events.map((event, i) => (
              <li
                key={event.slug}
                className={reveal}
                style={{ transitionDelay: `${120 + i * 70}ms` }}
              >
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Wave divider into the footer (bg-black — see Footer.tsx), the same
          way the home page closes its last section. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[90px] w-full sm:h-[120px]"
      >
        <path
          d="M0,70 C240,10 480,130 720,60 C960,10 1200,120 1440,55 L1440,140 L0,140 Z"
          fill="#000000"
        />
      </svg>
    </section>
  )
}
