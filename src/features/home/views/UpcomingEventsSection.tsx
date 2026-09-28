import { ErrorBlock, LoadingBlock } from '../../../shared/components/ui/LoadState'
import { Button } from '../../../shared/components/ui/Button'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { useEventsViewModel } from '../../events/viewModels/useEventsViewModel'
import { EventCard } from '../../events/views/EventCard'

/**
 * Home, section 6 — What's on. REVAMP 2026-09-25.
 *
 * A poster shelf: the same `EventCard` the Events page uses (native 4:5
 * Instagram posters with Colour Bloom and a date stamp), laid out as a
 * horizontal scroll-snap rail with the next poster peeking in, so it reads
 * as "flip through what's coming" rather than a list. Data unchanged:
 * `useEventsViewModel` (shared with /events so the two can't drift).
 */
export function UpcomingEventsSection() {
  const { events, isLoading, error, retry } = useEventsViewModel()

  return (
    <section data-plate="dark" aria-labelledby="upcoming-events-heading" className="relative overflow-hidden bg-abyss-2 py-24 text-bone sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[20%] blur-[80px] [background-image:radial-gradient(ellipse_35%_40%_at_100%_0%,color-mix(in_srgb,var(--color-ember)_14%,transparent),transparent_70%),radial-gradient(ellipse_40%_40%_at_0%_100%,color-mix(in_srgb,var(--color-river)_45%,transparent),transparent_70%)]" />
      <div className={`${container} relative`}>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            id="upcoming-events-heading"
            eyebrow="What's on"
            title={
              <>
                Coming up
                <br />
                in the river.
              </>
            }
          />
          <Button to="/events" variant="ghost" arrow>
            See all events
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-14">
            <LoadingBlock tone="dark" label="Events" />
          </div>
        ) : error ? (
          <div className="mt-14">
            <ErrorBlock tone="dark" error={error} onRetry={retry} label="Events" />
          </div>
        ) : events.length === 0 ? (
          <p className="mt-14 font-whisper text-xl italic text-bone/60">Nothing on the calendar right now — check back soon.</p>
        ) : (
          <ul className="no-scrollbar -mx-4 mt-14 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:scroll-px-8 sm:gap-10 sm:px-8">
            {events.map((event, i) => (
              <Reveal as="li" key={event.slug} delay={i * 60} className="w-[78vw] max-w-[22rem] flex-none snap-start">
                <EventCard event={event} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
