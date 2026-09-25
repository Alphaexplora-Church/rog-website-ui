import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { ErrorBlock } from '../../../shared/components/ui/LoadState'
import { useEventsViewModel } from '../viewModels/useEventsViewModel'
import { EventRow, FeaturedEvent } from './EventsCalendarItems'
import { groupByMonth } from './eventDateParts'

/**
 * Events, section 3 — "Upcoming Events".
 *
 * ── REBUILT 2026-09-23 ───────────────────────────────────────────────────
 * Jude: "fix the UI of the Upcoming events under the Events Tab. make sure
 * that the data of both Events in Home tab and events tab are the same."
 * Both tabs read one source, so the content cannot drift (see below).
 *
 * ── LIVE-WIRED 2026-09-24 ────────────────────────────────────────────────
 * Reads the Events section of Manage Contents through `useEventsViewModel`
 * (rog-cms's Event content type, via `shared/models/api/eventsApi.ts`) —
 * the same react-query cache entry the Home teaser reads.
 *
 * ── EDITORIAL REDESIGN 2026-09-24 ────────────────────────────────────────
 * Jude: "enhance the design of the UpcomingEventsSection" — scoped to the
 * Events page only, "richer & editorial" direction.
 *
 * It used to be the Home teaser's stack of identical rows, repeated. On a
 * page whose whole job is the calendar that under-sells the one thing a
 * visitor came to find out: what's next, and when. So:
 *
 *   · THE SOONEST EVENT GETS A SPREAD — large header photo, a calendar
 *     leaf, the full description. "Next up" is the question; answer it
 *     before anything else.
 *   · EVERYTHING AFTER IT READS AS A CALENDAR — grouped under month
 *     headings, each row led by a month/day/weekday leaf so dates scan
 *     down the left edge the way they do on a printed church bulletin.
 *   · A PHOTO-LESS EVENT STILL LOOKS DESIGNED — the fallback panel carries
 *     the day numeral in large type instead of an empty tint.
 *
 * Home keeps `EventCard` untouched; these layouts live in
 * `EventsCalendarItems.tsx`. Same data, page-appropriate presentation.
 *
 * ── MOTION PASS 2026-09-24 ───────────────────────────────────────────────
 * Hover effects and the live countdown live in `EventsCalendarItems.tsx`
 * (see its header). Here: the calendar rows now arrive one after another
 * (60ms apart) instead of as one block, so the list reads top-down.
 *
 * The loading skeleton is shaped like this layout (spread + rows) rather
 * than the shared 3-up `LoadingBlock` grid, so nothing jumps when the
 * data lands. The error state still uses the shared `ErrorBlock`.
 */
export function UpcomingEventsSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`
  const { events, isLoading, error, retry } = useEventsViewModel()

  const [next, ...later] = events
  const months = groupByMonth(later)
  const count = events.length

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="events-upcoming-heading"
      className="relative overflow-hidden bg-[#161616] text-white"
    >
      <div className="relative mx-auto max-w-[86rem] px-6 pt-24 pb-36 sm:pt-28 sm:pb-44">
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

          {!isLoading && !error && count > 0 ? (
            <p className="text-sm text-white/45 tabular-nums">
              <span className="font-heading text-2xl font-bold text-white">{count}</span>{' '}
              {count === 1 ? 'event' : 'events'} on the calendar
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <EventsSkeleton />
        ) : error ? (
          <div className="mt-12">
            <ErrorBlock tone="dark" error={error} onRetry={retry} label="Events" />
          </div>
        ) : !next ? (
          <div
            className={`mt-12 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center ${reveal}`}
            style={{ transitionDelay: '120ms' }}
          >
            <p className="font-heading text-lg font-bold text-white">Nothing on the calendar yet</p>
            <p className="mt-2 text-sm text-white/50">
              New events are posted here as they&apos;re confirmed — check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className={`mt-12 ${reveal}`} style={{ transitionDelay: '120ms' }}>
              <FeaturedEvent event={next} />
            </div>

            {months.length > 0 ? (
              <div className={`mt-16 ${reveal}`} style={{ transitionDelay: '200ms' }}>
                <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/45 uppercase">
                  Later this season
                </h3>

                <div className="mt-6 flex flex-col gap-10">
                  {months.map((group, g) => (
                    <div
                      key={group.key}
                      className="grid gap-2 border-t border-white/10 pt-6 lg:grid-cols-12 lg:gap-8"
                    >
                      <p className="font-heading text-base font-bold text-white/80 lg:col-span-3 lg:pt-6">
                        {group.label}
                      </p>
                      <ul className="divide-y divide-white/10 lg:col-span-9">
                        {group.events.map((event, i) => (
                          <li
                            key={event.slug}
                            className={reveal}
                            style={{ transitionDelay: `${260 + (g * 2 + i) * 60}ms` }}
                          >
                            <EventRow event={event} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
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

/** Placeholder in the shape of the real layout: one spread, two rows. */
function EventsSkeleton() {
  const tile = 'bg-white/[0.06]'
  return (
    <div role="status" aria-live="polite" className="mt-12">
      <span className="sr-only">Loading events…</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="grid overflow-hidden rounded-3xl border border-white/10 lg:grid-cols-12">
          <div className={`aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[26rem] ${tile}`} />
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-10 lg:col-span-5">
            <div className={`h-3 w-20 rounded-full ${tile}`} />
            <div className="mt-2 flex items-start gap-5">
              <div className={`h-24 w-20 shrink-0 rounded-xl ${tile}`} />
              <div className="flex-1 space-y-3 pt-2">
                <div className={`h-6 w-3/4 rounded-full ${tile}`} />
                <div className={`h-3 w-1/3 rounded-full ${tile}`} />
              </div>
            </div>
            <div className={`mt-2 h-3 w-full rounded-full ${tile}`} />
            <div className={`h-3 w-5/6 rounded-full ${tile}`} />
          </div>
        </div>
        <div className="mt-16 space-y-6">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-6 border-t border-white/10 pt-6">
              <div className={`h-[4.5rem] w-16 shrink-0 rounded-xl ${tile}`} />
              <div className="flex-1 space-y-3">
                <div className={`h-5 w-1/2 rounded-full ${tile}`} />
                <div className={`h-3 w-2/3 rounded-full ${tile}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
