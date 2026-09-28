import { useState } from 'react'
import type { EventItem } from '../../../shared/models/types/event'
import { Pill, WaveMark } from '../../../shared/components/ui/River'
import { useCenterBloom } from '../../../shared/hooks/useCenterBloom'
import { lead } from '../../../shared/styles/tokens'
import { eventStamp, eventStartMs, type EventStamp } from './eventDateParts'
import { useCountdown } from './useCountdown'

/**
 * The Events page's poster pieces. REVAMP 2026-09-25 ("Textured Editorial").
 *
 * ROG's event graphics are Instagram 4:5 posters, so every event image here
 * is framed at its NATIVE 4:5 and never cropped to 16:9 — the old spread
 * cut the top and bottom off every poster, which is where the date and
 * title usually live. Pieces:
 *
 *   PosterImage   4:5 frame, River duotone at rest → true colour on hover /
 *                 focus / screen-centre on touch (Colour Bloom). A missing or
 *                 dead image becomes a typographic poster, not a broken box.
 *   DateStamp     the big shout day numeral with its month — the date is the
 *                 first thing anyone reads off a poster wall.
 *   EventMeta     time · location · admission note, one line each.
 *   FeaturedEvent the soonest event as a full spread with the live countdown.
 *
 * Events still aren't links (there's no event detail page), so nothing here
 * carries a pointer cursor promising a click.
 */

/* ── Poster image ─────────────────────────────────────────────────────── */

export function PosterImage({
  event,
  className = '',
  eager = false,
}: {
  event: EventItem
  className?: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const show = !!event.photo && !failed
  const ref = useCenterBloom<HTMLDivElement>(show)
  const stamp = eventStamp(event)

  return (
    <div
      ref={ref}
      className={`grain relative aspect-[4/5] overflow-hidden bg-deep ${show ? 'duotone' : ''} ${className}`}
    >
      {show ? (
        <img
          src={event.photo}
          alt={`${event.title} poster`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-current group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      ) : (
        // Typographic stand-in: reads as a deliberate ROG poster (wave mark,
        // shout title, river light) rather than an empty tint.
        <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between p-[8%] text-bone">
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-current [background-image:radial-gradient(ellipse_80%_60%_at_20%_15%,rgb(14_95_104/0.95),transparent_70%),radial-gradient(ellipse_60%_45%_at_90%_95%,rgb(242_118_28/0.35),transparent_70%)] group-hover:scale-[1.06] motion-reduce:transition-none" />
          <div className="relative">
            {stamp && (
              <p className="font-shout text-[clamp(1rem,1.6vw,1.3rem)] font-bold uppercase tracking-[0.18em] text-sand">
                {stamp.month} {stamp.day}
              </p>
            )}
            <p className="mt-2 font-shout text-[clamp(1.9rem,3.4vw,3rem)] font-extrabold uppercase leading-[0.9] text-balance">
              {event.title}
            </p>
          </div>
          <WaveMark className="relative ml-auto h-auto w-[38%] text-bone/70" strokeWidth={6} />
        </div>
      )}
    </div>
  )
}

/* ── Date stamp ───────────────────────────────────────────────────────── */

export function DateStamp({
  stamp,
  size = 'md',
  className = '',
}: {
  stamp: EventStamp | null
  size?: 'md' | 'xl'
  className?: string
}) {
  const xl = size === 'xl'
  if (!stamp) {
    return (
      <p className={`font-shout font-extrabold uppercase leading-none ${xl ? 'text-[clamp(3rem,6vw,5rem)]' : 'text-3xl'} ${className}`}>
        TBA
      </p>
    )
  }
  return (
    <p className={`flex items-end gap-3 font-shout uppercase leading-[0.8] ${className}`}>
      <span
        className={`font-extrabold tabular-nums tracking-[-0.02em] ${xl ? 'text-[clamp(6.5rem,15vw,13rem)]' : 'text-[clamp(3.5rem,6vw,4.75rem)]'}`}
      >
        {stamp.day}
      </span>
      <span className="flex flex-col pb-[0.4em]">
        <span className={`font-bold tracking-[0.06em] ${xl ? 'text-[clamp(1.75rem,3vw,2.75rem)]' : 'text-xl'}`}>
          {stamp.month}
        </span>
        {stamp.weekday && (
          <span className={`mt-1 font-sans font-semibold tracking-[0.22em] opacity-70 ${xl ? 'text-sm' : 'text-[0.65rem]'}`}>
            {stamp.weekday}
          </span>
        )}
      </span>
    </p>
  )
}

/* ── Meta ─────────────────────────────────────────────────────────────── */

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l2.5 2" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 18s6-5 6-9a6 6 0 10-12 0c0 4 6 9 6 9z" />
      <circle cx="10" cy="9" r="2.25" />
    </svg>
  )
}

/** Time + location (+ admission note) — `tone` matches the ground. */
export function EventMeta({
  event,
  tone = 'dark',
  className = '',
}: {
  event: EventItem
  tone?: 'dark' | 'light'
  className?: string
}) {
  const icon = tone === 'dark' ? 'text-shallows' : 'text-abyss/55'
  const ink = tone === 'dark' ? 'text-bone/80' : 'text-abyss/75'
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9rem] ${ink} ${className}`}>
      <span className="inline-flex items-center gap-2 tabular-nums">
        <span className={icon}>
          <ClockIcon />
        </span>
        {event.time}
      </span>
      {event.location ? (
        <span className="inline-flex items-center gap-2">
          <span className={icon}>
            <PinIcon />
          </span>
          {event.location}
        </span>
      ) : null}
      {event.note ? <Pill tone={tone}>{event.note}</Pill> : null}
    </div>
  )
}

/* ── Countdown ────────────────────────────────────────────────────────── */

/** Days · hrs · min · sec until the event, ticking live, in shout numerals. */
function CountdownStrip({ event }: { event: EventItem }) {
  const left = useCountdown(eventStartMs(event.isoDate, event.isoTime))
  if (!left) return null

  if (left.started) {
    return (
      <p className="mt-10 inline-flex items-center gap-3 font-shout text-3xl font-bold uppercase text-ember">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inset-0 animate-live rounded-full bg-ember motion-reduce:hidden" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-ember" />
        </span>
        Happening now
      </p>
    )
  }

  const units: [number, string][] = [
    [left.days, left.days === 1 ? 'day' : 'days'],
    [left.hours, 'hrs'],
    [left.minutes, 'min'],
    [left.seconds, 'sec'],
  ]

  return (
    <div className="mt-10">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-shallows">Starts in</p>
      {/* The live seconds would be read out every tick if this were a
          live region, so screen readers get one static sentence instead. */}
      <p className="sr-only">
        {left.days} days, {left.hours} hours and {left.minutes} minutes from now
      </p>
      <div aria-hidden="true" className="mt-3 flex items-start gap-3 sm:gap-5">
        {units.map(([value, label], i) => (
          <div key={label} className="flex items-start gap-3 sm:gap-5">
            {i > 0 && <span className="font-shout text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-none text-ember/60">:</span>}
            <div>
              <span className="block font-shout text-[clamp(2.75rem,5vw,4.25rem)] font-extrabold leading-[0.85] tabular-nums text-bone">
                {String(value).padStart(2, '0')}
              </span>
              <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-bone/55">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Featured ─────────────────────────────────────────────────────────── */

/**
 * The soonest event as a spread on abyss: the poster at 4:5 on one side,
 * then a giant date, the title, its description, the live countdown and
 * the schedule on the other.
 */
export function FeaturedEvent({ event }: { event: EventItem }) {
  const stamp = eventStamp(event)

  return (
    <article
      aria-labelledby={`event-${event.slug}-title`}
      className="group relative grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center lg:gap-20"
    >
      <div className="relative mx-auto w-full max-w-[34rem] md:mx-0">
        {/* Ember hairline offset behind the poster — a frame, not a shadow. */}
        <span aria-hidden="true" className="absolute -right-3 -bottom-3 h-full w-full border border-ember/50 transition-transform duration-700 ease-current group-hover:translate-x-1 group-hover:translate-y-1 motion-reduce:transition-none" />
        <PosterImage event={event} eager className="relative w-full" />
      </div>

      <div className="min-w-0">
        <p className="inline-flex items-center gap-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ember">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
          Next up
        </p>
        <DateStamp stamp={stamp} size="xl" className="mt-4 text-bone" />
        <h3
          id={`event-${event.slug}-title`}
          className="mt-6 max-w-[16ch] font-shout text-[clamp(2.25rem,4.4vw,3.75rem)] font-extrabold uppercase leading-[0.92] text-balance"
        >
          {event.title}
        </h3>
        <p className="mt-2 text-[0.85rem] tracking-[0.02em] text-sand">{event.date}</p>
        {event.blurb ? <p className={`mt-6 max-w-[40ch] text-bone/85 ${lead}`}>{event.blurb}</p> : null}

        <CountdownStrip event={event} />

        <EventMeta event={event} className="mt-10 border-t border-bone/15 pt-6" />
      </div>
    </article>
  )
}
