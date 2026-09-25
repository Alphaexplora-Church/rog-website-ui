import { Link } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown, riverGlow } from '../../../shared/styles/tokens'
import { ErrorBlock, LoadingBlock } from '../../../shared/components/ui/LoadState'
import { useEventsViewModel } from '../../events/viewModels/useEventsViewModel'
import { EventCard } from '../../events/views/EventCard'

/**
 * Home — "Upcoming Events."
 *
 * Soaking in the River, Women Arise Retreat, Activate12 Conference and the
 * Christmas Eve service are all real ROG programs (see the IA handoff doc).
 *
 * ── RE-LAID OUT 2026-09-23 ───────────────────────────────────────────────
 * Jude: "okay na yung design but change the layout, dapat maayos tsaka
 * malinis, make sure na nakalagay yung date, time, and location."
 *
 * The palette, the plate gradient into the hero and the wave divider are
 * unchanged — only the arrangement and the data shape moved.
 *
 * FOUR TALL CARDS BECAME FOUR WIDE ROWS. A 4-up grid gives each event a
 * narrow column, which is the wrong shape for three separate facts: date,
 * time and location had nowhere to sit without stacking into a pile. A row
 * gives each event one clean line of scheduling metadata and lets all four
 * read down the page in order, which is how anyone scans a "what's coming
 * up" list in the first place.
 *
 * ── LIVE-WIRED 2026-09-24 ────────────────────────────────────────────────
 * Events used to live in `features/events/data/eventsData.ts`, a
 * hand-written array shared with the Events page. Both now read
 * `useEventsViewModel`, which fetches rog-cms's Event content type — one
 * request shared between this section and the Events page via
 * `EVENTS_QUERY_KEY`, same as the Media Library's sermons. Loading and
 * error states are new for the same reason the Media Library's are.
 */

export function UpcomingEventsSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`
  const { events, isLoading, error, retry } = useEventsViewModel()

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="upcoming-events-heading"
      className="relative overflow-hidden text-white"
      /* Starts on the hero's own black, settles into #161616 so the two
         plates read as one continuous fall rather than a butt joint. */
      style={{ background: 'linear-gradient(to bottom, #000000 0%, #161616 20%, #161616 100%)' }}
    >
      <div aria-hidden="true" className={riverGlow} />

      {/* `riverGlow`'s first blob sits high-left and lit the very top edge,
          so the tint change redrew the seam the gradient had just removed.
          This holds the top at the hero's black and lets colour rise in
          underneath it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          zIndex: 1,
          height: '18rem',
          background:
            'linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[86rem] px-6 pt-24 pb-36 sm:pt-28 sm:pb-44">
        <div
          className={`flex flex-wrap items-end justify-between gap-6 ${reveal}`}
          style={{ transitionDelay: '0ms' }}
        >
          <div>
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
              id="upcoming-events-heading"
              className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Upcoming Events
            </h2>
          </div>

          <Link
            to="/events"
            className="group inline-flex h-11 items-center gap-2 text-sm font-semibold text-[#8FD4C9] transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
          >
            See all events
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-12">
            <LoadingBlock tone="dark" label="Events" />
          </div>
        ) : error ? (
          <div className="mt-12">
            <ErrorBlock tone="dark" error={error} onRetry={retry} label="Events" />
          </div>
        ) : events.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-sm text-white/50">Nothing on the calendar right now — check back soon.</p>
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

      {/* Wave divider into Watch or Listen (#232323) — straight from the
          Figma design's own section-transition motif (Main.dc.html). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[90px] w-full sm:h-[120px]"
      >
        <path
          d="M0,70 C240,10 480,130 720,60 C960,10 1200,120 1440,55 L1440,140 L0,140 Z"
          fill="#232323"
        />
      </svg>
    </section>
  )
}
