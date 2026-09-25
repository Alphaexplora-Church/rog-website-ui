import { useState } from 'react'
import type { EventItem } from '../../../shared/models/types/event'
import { Spotlight, useSpotlight } from '../../../shared/components/ui/Spotlight'
import { eventDateParts, eventStartMs, type EventDateParts } from './eventDateParts'
import { useCountdown } from './useCountdown'

/**
 * The Events page's own event layouts — a featured "next up" spread and
 * the calendar rows beneath it (2026-09-24, editorial redesign of the
 * Events tab's Upcoming Events; Jude picked "Events page only").
 *
 * DELIBERATELY NOT `EventCard`. That component is still what the Home
 * teaser renders, and Jude scoped this redesign to the Events page, so
 * the Home section is untouched. Both still read the same
 * `useEventsViewModel`, so the *data* can't drift between tabs — only
 * the presentation differs.
 *
 * ── MOTION PASS 2026-09-24 ───────────────────────────────────────────────
 * Jude: "lagyan mo ng animation… hovering effects… make it interactive
 * para hindi siya mukang pale and boring."
 *
 *   · FEATURED — a live countdown to the event (days · hrs · min · sec),
 *     a teal glow that follows the mouse, and the photo easing in slowly
 *     on hover. The countdown is the one moving thing that carries
 *     information, not just decoration: "how soon?" answered at a glance.
 *   · ROWS — on hover the row lifts onto a faint panel, a teal rule grows
 *     down its left edge, the date leaf fills teal, the title nudges
 *     right and the thumbnail zooms. All transform/opacity/colour, so
 *     nothing reflows.
 *
 * Only on devices that can hover (Tailwind v4's `hover:`/`group-hover:`
 * are wrapped in `@media (hover: hover)`), and every movement is dropped
 * under `prefers-reduced-motion`. These still aren't links — there's no
 * event detail page yet — so there is no pointer cursor promising a click.
 */

const TEAL = '#8FD4C9'
/** Strong ease-out for entering/responding motion. */
const EASE = 'ease-[cubic-bezier(0.23,1,0.32,1)]'

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      style={{ color: TEAL }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l2.5 2" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      style={{ color: TEAL }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 18s6-5 6-9a6 6 0 10-12 0c0 4 6 9 6 9z" />
      <circle cx="10" cy="9" r="2.25" />
    </svg>
  )
}

/** Time + (when the CMS ever grows one) location, on one line. */
function Schedule({ event, className = '' }: { event: EventItem; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70 ${className}`}>
      <span className="inline-flex items-center gap-2 tabular-nums">
        <ClockIcon />
        {event.time}
      </span>
      {event.location ? (
        <span className="inline-flex items-center gap-2">
          <PinIcon />
          {event.location}
        </span>
      ) : null}
      {event.note ? (
        <span className="rounded-full border border-white/15 px-3 py-0.5 text-xs font-semibold text-white/60">
          {event.note}
        </span>
      ) : null}
    </div>
  )
}

/**
 * The header photo, or — when there is none or it fails to load — a
 * tinted panel carrying the date in large type. `zoom` sets how far the
 * image eases in when its `group` ancestor is hovered.
 */
function EventPhoto({
  event,
  parts,
  className,
  fallbackSize,
  eager = false,
}: {
  event: EventItem
  parts: EventDateParts | null
  className: string
  fallbackSize: 'lg' | 'sm'
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const show = !!event.photo && !failed
  const zoom =
    fallbackSize === 'lg'
      ? `transition-transform duration-[1400ms] ${EASE} group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100`
      : `transition-transform duration-700 ${EASE} group-hover:scale-[1.08] motion-reduce:transition-none motion-reduce:group-hover:scale-100`

  return (
    <div className={`relative overflow-hidden bg-[#0d0d0d] ${className}`}>
      {show ? (
        <img
          src={event.photo}
          alt=""
          aria-hidden="true"
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${zoom}`}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center ${zoom}`}
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 30% 25%, rgb(27 122 112 / 0.45), transparent 70%), linear-gradient(135deg, #111 0%, #0b1f1d 100%)',
          }}
        >
          {parts ? (
            <span
              className={`font-heading leading-none font-bold tracking-tight text-white/[0.14] tabular-nums transition-colors duration-500 group-hover:text-white/25 ${
                fallbackSize === 'lg' ? 'text-[9rem] sm:text-[12rem]' : 'text-5xl'
              }`}
            >
              {parts.day}
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}

/**
 * A calendar leaf: month over a large day numeral over the weekday.
 * `interactive` makes it fill teal when a `group` ancestor is hovered.
 */
function DateLeaf({
  parts,
  size,
  interactive = false,
}: {
  parts: EventDateParts | null
  size: 'lg' | 'sm'
  interactive?: boolean
}) {
  const lg = size === 'lg'
  const box = lg ? 'h-24 w-20' : 'h-[4.5rem] w-16'

  if (!parts) {
    return (
      <div
        className={`flex shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-center ${box}`}
      >
        <span className="text-[10px] font-bold tracking-[0.16em] text-white/50 uppercase">TBA</span>
      </div>
    )
  }

  const fill = interactive
    ? `transition-[background-color,border-color,transform] duration-300 ${EASE} group-hover:-translate-y-0.5 group-hover:border-[#8FD4C9] group-hover:bg-[#8FD4C9] motion-reduce:group-hover:translate-y-0`
    : ''
  const ink = interactive ? 'transition-colors duration-300 group-hover:text-[#0b1f1d]' : ''

  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center rounded-xl border border-[#8FD4C9]/25 bg-[#1b7a70]/[0.12] text-center ${box} ${fill}`}
    >
      <span className={`text-[10px] font-bold tracking-[0.18em] text-[#8FD4C9] uppercase ${ink}`}>
        {parts.month}
      </span>
      <span
        className={`font-heading leading-none font-bold text-white tabular-nums ${
          lg ? 'mt-1 text-4xl' : 'mt-0.5 text-2xl'
        } ${ink}`}
      >
        {parts.day}
      </span>
      <span
        className={`mt-1 text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase ${
          interactive ? 'transition-colors duration-300 group-hover:text-[#0b1f1d]/70' : ''
        }`}
      >
        {parts.weekday}
      </span>
    </div>
  )
}

/** Days · hrs · min · sec until the event, ticking live. */
function CountdownStrip({ event }: { event: EventItem }) {
  const left = useCountdown(eventStartMs(event.isoDate, event.isoTime))
  if (!left) return null

  if (left.started) {
    return (
      <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: TEAL }}>
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#8FD4C9] opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8FD4C9]" />
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
    <div className="mt-6">
      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Starts in</p>
      {/* The live seconds would be read out every tick if this were a
          live region, so screen readers get one static sentence instead. */}
      <p className="sr-only">
        {left.days} days, {left.hours} hours and {left.minutes} minutes from now
      </p>
      <div aria-hidden="true" className="mt-2 flex gap-2">
        {units.map(([value, label]) => (
          <div
            key={label}
            className={`min-w-[3.75rem] rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2 text-center transition-[border-color,background-color] duration-300 ${EASE} group-hover:border-[#8FD4C9]/30 group-hover:bg-[#1b7a70]/[0.12]`}
          >
            <span className="block font-heading text-2xl leading-none font-bold text-white tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
            <span className="mt-1 block text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * The soonest event, given a full spread: photo on one side, the date leaf,
 * title, description, countdown and schedule on the other.
 */
export function FeaturedEvent({ event }: { event: EventItem }) {
  const parts = eventDateParts(event.isoDate)
  const spot = useSpotlight<HTMLElement>()

  return (
    <article
      {...spot}
      aria-labelledby={`event-${event.slug}-title`}
      className={`group relative grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition-[border-color,box-shadow] duration-500 ${EASE} hover:border-[#8FD4C9]/30 hover:shadow-[0_30px_80px_-30px_rgb(27_122_112/0.55)] lg:grid-cols-12`}
    >
      <Spotlight size={520} strength={0.1} />

      <EventPhoto
        event={event}
        parts={parts}
        eager
        fallbackSize="lg"
        className="aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[26rem]"
      />

      <div className="relative z-[2] flex flex-col justify-center p-6 sm:p-10 lg:col-span-5">
        <span
          className="inline-flex w-fit items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase"
          style={{ color: TEAL }}
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#8FD4C9] opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8FD4C9]" />
          </span>
          Next up
        </span>

        <div className="mt-6 flex items-start gap-5">
          <DateLeaf parts={parts} size="lg" interactive />
          <div className="min-w-0">
            <h3
              id={`event-${event.slug}-title`}
              className="font-heading text-2xl leading-tight font-bold tracking-tight text-balance text-white sm:text-3xl"
            >
              {event.title}
            </h3>
            <p className="mt-2 text-sm text-white/50">{event.date}</p>
          </div>
        </div>

        {event.blurb ? (
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-white/65">{event.blurb}</p>
        ) : null}

        <CountdownStrip event={event} />

        <Schedule event={event} className="mt-6 border-t border-white/10 pt-5" />
      </div>
    </article>
  )
}

/** One later event as a calendar row: date leaf · details · thumbnail. */
export function EventRow({ event }: { event: EventItem }) {
  const parts = eventDateParts(event.isoDate)
  const spot = useSpotlight<HTMLElement>()

  return (
    <article
      {...spot}
      aria-labelledby={`event-${event.slug}-title`}
      className="group relative -mx-4 flex items-start gap-4 overflow-hidden rounded-2xl px-4 py-6 sm:-mx-5 sm:items-center sm:gap-6 sm:px-5"
    >
      {/* Hover panel + spotlight sit behind the content. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-2xl bg-white/[0.035] opacity-0 transition-opacity duration-300 ${EASE} group-hover:opacity-100`}
      />
      <Spotlight size={360} strength={0.1} />
      {/* Teal rule that grows down the left edge. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-4 bottom-4 left-0 w-[3px] origin-top scale-y-0 rounded-full bg-[#8FD4C9] transition-transform duration-500 ${EASE} group-hover:scale-y-100 motion-reduce:transition-none`}
      />

      <div className="relative z-[2]">
        <DateLeaf parts={parts} size="sm" interactive />
      </div>

      <div
        className={`relative z-[2] min-w-0 flex-1 transition-transform duration-500 ${EASE} group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0`}
      >
        <h4
          id={`event-${event.slug}-title`}
          className="font-heading text-lg leading-snug font-bold text-white transition-colors duration-300 group-hover:text-[#8FD4C9] sm:text-xl"
        >
          {event.title}
        </h4>
        {event.blurb ? (
          <p className="mt-1.5 line-clamp-2 max-w-[62ch] text-sm leading-relaxed text-white/55 transition-colors duration-300 group-hover:text-white/70">
            {event.blurb}
          </p>
        ) : null}
        <Schedule event={event} className="mt-3" />
      </div>

      <EventPhoto
        event={event}
        parts={parts}
        fallbackSize="sm"
        className={`relative z-[2] hidden aspect-[4/3] w-40 shrink-0 rounded-xl ring-1 ring-white/10 transition-[box-shadow] duration-500 group-hover:ring-[#8FD4C9]/40 sm:block lg:w-48`}
      />
    </article>
  )
}
