import { useState } from 'react'
import type { EventItem } from '../data/eventsData'

/**
 * One event as a wide row: image, then the event, then its schedule.
 *
 * SHARED BY BOTH TABS, 2026-09-23. Home and the Events page each used to
 * render their own card markup from their own array, so they could drift in
 * two ways at once — different events *and* a different look. The data moved
 * to `data/eventsData.ts` and the markup moved here, so "the same" holds for
 * both without anyone having to remember to update two files.
 *
 * The three scheduling facts sit on one line with their own icons, so date,
 * time and location are each findable at a glance instead of being run
 * together into a single string the way they were before.
 *
 * The image falls back to a tinted panel rather than a broken frame — three
 * separate dead Unsplash URLs have turned up in this codebase already, and a
 * card that fails should still look deliberate.
 */
export function EventCard({ event }: { event: EventItem }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl sm:aspect-[4/3] sm:w-44">
        {imageFailed ? (
          <div
            aria-hidden="true"
            className="h-full w-full"
            style={{ background: 'linear-gradient(135deg, #161616, rgb(27 122 112 / 0.35))' }}
          />
        ) : (
          <img
            src={event.photo}
            alt=""
            aria-hidden="true"
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-white uppercase"
            style={{ backgroundColor: 'rgb(27 122 112 / 0.9)' }}
          >
            {event.date}
          </span>
          {event.note && (
            <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/60">
              {event.note}
            </span>
          )}
        </div>

        <h3 className="mt-3 font-heading text-lg leading-snug font-bold text-white sm:text-xl">
          {event.title}
        </h3>
        <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-white/55">{event.blurb}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/65">
          <span className="inline-flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4 shrink-0 text-[#8FD4C9]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="10" cy="10" r="7" />
              <path d="M10 6v4l2.5 2" />
            </svg>
            {event.time}
          </span>

          <span className="inline-flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4 shrink-0 text-[#8FD4C9]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 18s6-5 6-9a6 6 0 10-12 0c0 4 6 9 6 9z" />
              <circle cx="10" cy="9" r="2.25" />
            </svg>
            {event.location}
          </span>
        </div>
      </div>
    </article>
  )
}
