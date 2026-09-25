import type { EventItem } from '../../../shared/models/types/event'
import { eventStamp } from './eventDateParts'
import { DateStamp, EventMeta, PosterImage } from './EventsCalendarItems'

/**
 * One event as a poster: the 4:5 graphic, a shout date stamp breaking its
 * bottom edge, then the title, schedule and description.
 *
 * SHARED BY BOTH TABS since 2026-09-23 — Home's teaser and the Events
 * page's poster wall render this one component from the one
 * `useEventsViewModel`, so neither the events nor their look can drift.
 * `location` and `note` render only when the CMS has them.
 *
 * REVAMP 2026-09-25: was a wide image-left row with a 16:9/4:3 crop. ROG's
 * event graphics are Instagram 4:5 posters, so the frame is now native 4:5
 * (never cropped) with Colour Bloom. The image falls back to a typographic
 * poster when missing or dead (see `PosterImage`) — three dead Unsplash URLs
 * have turned up in this codebase already. API unchanged (`event`); `tone`
 * is new and optional so Home's call site keeps working untouched.
 */
export function EventCard({
  event,
  tone = 'dark',
}: {
  event: EventItem
  /** Ground the card sits on — 'light' for the bone plate. */
  tone?: 'dark' | 'light'
}) {
  const dark = tone === 'dark'
  return (
    <article aria-labelledby={`card-${event.slug}-title`} className="group relative flex h-full flex-col">
      <div className="relative">
        <PosterImage event={event} className="w-full" />
        {/* The stamp breaks the poster's bottom edge like a price tag. */}
        <div
          className={`absolute bottom-0 left-0 z-[3] translate-y-1/2 px-4 pt-2 pb-1 transition-colors duration-500 ease-current ${
            dark ? 'bg-abyss text-bone group-hover:bg-ember group-hover:text-abyss' : 'bg-bone text-abyss group-hover:bg-abyss group-hover:text-bone'
          }`}
        >
          <DateStamp stamp={eventStamp(event)} />
        </div>
      </div>

      <div className="pt-16">
        <h3
          id={`card-${event.slug}-title`}
          className={`font-shout text-[clamp(1.75rem,2.4vw,2.25rem)] font-extrabold uppercase leading-[0.95] text-balance ${dark ? 'text-bone' : 'text-abyss'}`}
        >
          <span className="bg-[linear-gradient(var(--color-ember),var(--color-ember))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-[600ms] ease-current group-hover:bg-[length:100%_2px]">
            {event.title}
          </span>
        </h3>
        <EventMeta event={event} tone={tone} className="mt-4" />
        {event.blurb ? (
          <p className={`mt-3 max-w-[42ch] text-[0.95rem] leading-relaxed ${dark ? 'text-bone/70' : 'text-abyss/70'}`}>
            {event.blurb}
          </p>
        ) : null}
      </div>
    </article>
  )
}
