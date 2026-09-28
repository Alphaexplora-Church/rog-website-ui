import { ErrorBlock } from '../../../shared/components/ui/LoadState'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { useEventsViewModel } from '../viewModels/useEventsViewModel'
import { EventCard } from './EventCard'
import { FeaturedEvent } from './EventsCalendarItems'
import { groupByMonth } from './eventDateParts'

/**
 * Events, sections 3 + 4 — "Upcoming Events".
 *
 * History worth keeping: both tabs read one source since 2026-09-23 (Jude:
 * "make sure that the data of both Events in Home tab and events tab are the
 * same"), live-wired to rog-cms's Event type via `useEventsViewModel` on
 * 2026-09-24 — the same react-query cache entry the Home teaser reads.
 *
 * REVAMP 2026-09-25 ("Textured Editorial") — a poster wall that flows:
 *
 *   · NEXT UP (abyss) — the soonest event gets the spread: its poster at
 *     native 4:5, a giant shout date, the description and a live countdown.
 *     "What's next, and when?" is the question; answer it first.
 *   · LATER THIS SEASON (bone plate) — everything after it hangs as a
 *     staggered poster wall on the light plate, still grouped by month (the
 *     first poster of each month carries the month tag). On phones the wall
 *     becomes a scroll-snap shelf with the next poster peeking in.
 *
 * Two grounds, two shapes, one data source. The loading skeleton is shaped
 * like the spread so nothing jumps when data lands; errors use the shared
 * `ErrorBlock`.
 */
export function UpcomingEventsSection() {
  const { events, isLoading, error, retry } = useEventsViewModel()

  const [next, ...later] = events
  const months = groupByMonth(later)
  const count = events.length

  return (
    <>
      <section
        data-plate="dark"
        aria-labelledby="events-upcoming-heading"
        className="relative overflow-hidden bg-abyss py-24 text-bone sm:py-32"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -inset-[15%] blur-[70px] [background-image:radial-gradient(ellipse_40%_35%_at_12%_60%,color-mix(in_srgb,var(--color-river)_50%,transparent),transparent_70%),radial-gradient(ellipse_30%_30%_at_95%_20%,color-mix(in_srgb,var(--color-ember)_12%,transparent),transparent_70%)]" />
        <div className={`${container} relative`}>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHead
              id="events-upcoming-heading"
              eyebrow="What's On"
              title="Upcoming Events"
              lead="Gatherings, retreats and conferences across the season. Dates and venues are confirmed closer to each one."
            />
            {!isLoading && !error && count > 0 ? (
              <Reveal>
                <p className="flex items-baseline gap-3 text-sand">
                  <span className="font-shout text-[clamp(3.5rem,6vw,5.5rem)] font-extrabold leading-none tabular-nums text-bone">
                    {String(count).padStart(2, '0')}
                  </span>
                  <span className="max-w-[9ch] text-[0.8rem] font-semibold uppercase leading-snug tracking-[0.18em]">
                    {count === 1 ? 'event' : 'events'} on the calendar
                  </span>
                </p>
              </Reveal>
            ) : null}
          </div>

          <div className="mt-16 sm:mt-20">
            {isLoading ? (
              <EventsSkeleton />
            ) : error ? (
              <ErrorBlock tone="dark" error={error} onRetry={retry} label="Events" />
            ) : !next ? (
              <Reveal className="border-y border-bone/15 py-16 text-center">
                <p className="font-shout text-4xl font-extrabold uppercase">Nothing on the calendar yet</p>
                <p className="mt-3 font-whisper text-lg italic text-bone/70">
                  New events are posted here as they&apos;re confirmed — check back soon.
                </p>
              </Reveal>
            ) : (
              <Reveal>
                <FeaturedEvent event={next} />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {!isLoading && !error && months.length > 0 ? (
        <section
          data-plate="light"
          aria-labelledby="events-later-heading"
          className="relative overflow-hidden bg-bone py-24 text-abyss sm:py-32"
        >
          <div className={container}>
            <SectionHead
              id="events-later-heading"
              tone="light"
              eyebrow="The calendar"
              title="Later this season"
            />
          </div>

          {/* Phones: a shelf that scrolls sideways, next poster peeking.
              md+: a three-up wall, middle column dropped for a hung look. */}
          <ul className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-8 sm:px-8 md:mx-auto md:grid md:max-w-[88rem] md:grid-cols-3 md:gap-x-8 md:gap-y-20 md:overflow-visible md:pb-0 lg:gap-x-12 md:[&>li:nth-child(3n+2)]:mt-24">
            {months.flatMap((group) =>
              group.events.map((event, i) => (
                <Reveal
                  as="li"
                  key={event.slug}
                  delay={Math.min(i, 3) * 60}
                  className="w-[74vw] max-w-[22rem] flex-none snap-start md:w-auto md:max-w-none"
                >
                  <p
                    className={`mb-4 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-abyss/60 ${i === 0 ? '' : 'invisible'}`}
                    aria-hidden={i === 0 ? undefined : true}
                  >
                    <span className="h-px w-8 bg-abyss/40" aria-hidden="true" />
                    {group.label}
                  </p>
                  <EventCard event={event} tone="light" />
                </Reveal>
              )),
            )}
          </ul>
        </section>
      ) : null}
    </>
  )
}

/** Placeholder in the shape of the spread. */
function EventsSkeleton() {
  const tile = 'bg-bone/[0.07]'
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading events…</span>
      <div aria-hidden="true" className="grid gap-10 motion-safe:animate-pulse md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center lg:gap-20">
        <div className={`aspect-[4/5] w-full max-w-[34rem] ${tile}`} />
        <div className="space-y-5">
          <div className={`h-3 w-24 rounded-full ${tile}`} />
          <div className={`h-40 w-48 ${tile}`} />
          <div className={`h-10 w-3/4 ${tile}`} />
          <div className={`h-4 w-2/3 rounded-full ${tile}`} />
          <div className={`h-4 w-1/2 rounded-full ${tile}`} />
        </div>
      </div>
    </div>
  )
}
