import { site, type ServiceTime } from '../../../shared/config/site'
import { useInView } from '../../../shared/hooks/useInView'
import { Button } from '../../../shared/components/ui/Button'
import { Eyebrow, Pill, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * Events, section 2 — "Weekly Gatherings": the recurring schedule, as
 * opposed to the dated one-offs in UpcomingEventsSection below it.
 *
 * ── SINGLE-SOURCED 2026-09-23 ────────────────────────────────────────────
 * This section used to carry its own hand-typed `gatherings` array that
 * disagreed with `site.services` on two of the four slots (1PM and 4PM had
 * their languages swapped). `site.services` is the schedule Jude confirmed
 * on 2026-09-16 and what Home, Watch Live's countdown and Plan a Visit all
 * read — so this reads it too, and the contradiction can't come back. When
 * the Strapi `global` single type takes over, one swap updates every page.
 * The venue is `site.location.venue` for the same reason; only the
 * "also live on Facebook and YouTube" note is this section's own copy.
 *
 * ── REVAMP 2026-09-25: "THE CURRENT" ─────────────────────────────────────
 * The week as a river you can read left to right: every entry in
 * `site.services` is a stop on one wave line flowing across the teal band,
 * its time in giant shout type above and its language (or label — that's
 * where "Prayer & Fasting" comes from) as an italic pill below. Sunday's
 * stretch of the line and its stops are ember; the midweek stop is bone.
 * On phones the same line becomes a sideways scroll-snap rail.
 *
 * WHY THE LINE IS DRAWN PER STOP. Each stop draws its own segment of one
 * continuous sine wave, phase-flipped every other column, so the segments
 * meet seamlessly and every dot sits exactly on a zero crossing — at any
 * width, in the rail or the full row. One long SVG stretched across the
 * row can't guarantee that.
 *
 * Adding a Saturday service to `site.services` adds a stop here with no
 * change to this file.
 */

const STREAMING_NOTE = 'also live on Facebook and YouTube.'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * "Today" / "Tomorrow" / "In 3 days" for a weekday name, counted in
 * Philippine time (UTC+8) so the answer matches the church's own calendar
 * wherever the visitor is.
 */
function nextLabel(day: string): string | null {
  const target = DAYS.indexOf(day)
  if (target < 0) return null
  const today = new Date(Date.now() + 8 * 3600 * 1000).getUTCDay()
  const diff = (target - today + 7) % 7
  return diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `In ${diff} days`
}

/** "10:00 AM" → { clock: "10", meridiem: "AM" }; keeps non-zero minutes. */
function shoutTime(time: string) {
  const m = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return { clock: time, meridiem: '' }
  return { clock: m[2] === '00' ? m[1] : `${m[1]}:${m[2]}`, meridiem: m[3].toUpperCase() }
}

/** One column's slice of the wave: crosses the centre line at x=100. */
function waveSegment(flip: boolean): string {
  const pts: string[] = []
  for (let x = 0; x <= 200; x += 5) {
    const y = 30 + (flip ? -1 : 1) * 16 * Math.sin((Math.PI * (x - 100)) / 200)
    pts.push(`${x},${y.toFixed(2)}`)
  }
  return `M${pts.join(' L')}`
}

function Stop({
  service,
  index,
  firstOfDay,
  drawn,
}: {
  service: ServiceTime
  index: number
  firstOfDay: boolean
  drawn: boolean
}) {
  const sunday = service.day === 'Sunday'
  const { clock, meridiem } = shoutTime(service.time)
  const next = firstOfDay ? nextLabel(service.day) : null

  return (
    <li className="group relative w-[44vw] flex-none snap-center md:w-auto md:max-w-none md:flex-1">
      {/* Day + "In N days" */}
      <div className="flex min-h-7 items-center justify-center gap-2 px-3">
        <span className={`text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${firstOfDay ? 'text-bone' : 'text-bone/70'}`}>
          {service.day}
        </span>
        {next ? (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${
              next === 'Today' ? 'bg-ember text-abyss' : 'border border-bone/30 text-bone/90'
            }`}
          >
            {next}
          </span>
        ) : null}
      </div>

      {/* Shout time */}
      <p className="mt-3 flex items-start justify-center font-shout font-extrabold uppercase leading-[0.8] text-bone">
        <span className="text-[clamp(5rem,9vw,8.5rem)] tabular-nums tracking-[-0.02em] transition-transform duration-700 ease-current group-hover:-translate-y-1 motion-reduce:transition-none">
          {clock}
        </span>
        <span className="ml-1 mt-[0.3em] text-[clamp(1.5rem,2.4vw,2.25rem)] font-bold">{meridiem}</span>
      </p>

      {/* The line */}
      <div className="relative mt-6 h-[60px]">
        <svg aria-hidden="true" viewBox="0 0 200 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          <path
            d={waveSegment(index % 2 === 1)}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={drawn ? 0 : 1}
            stroke={sunday ? 'var(--color-ember)' : 'color-mix(in srgb, var(--color-bone) 45%, transparent)'}
            strokeWidth={sunday ? 3 : 2}
            strokeLinecap="butt"
            className="transition-[stroke-dashoffset] duration-[900ms] ease-tide motion-reduce:transition-none"
            style={{ transitionDelay: `${index * 220}ms` }}
          />
        </svg>
        <span
          aria-hidden="true"
          className={`absolute top-1/2 left-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-[6px] ring-river transition-transform duration-500 ease-current group-hover:scale-125 motion-reduce:transition-none ${
            sunday ? 'bg-ember' : 'bg-bone'
          }`}
        />
      </div>

      {/* Language / label */}
      <div className="mt-5 flex justify-center">
        <Pill className="px-4 py-1 text-[0.95rem]">{service.label ?? service.language}</Pill>
      </div>
    </li>
  )
}

export function WeeklyGatheringsSection() {
  const { ref, shown } = useInView<HTMLDivElement>()
  const services = site.services

  return (
    <section
      data-plate="dark"
      aria-labelledby="events-weekly-heading"
      className="relative overflow-hidden bg-river py-24 text-bone sm:py-32"
    >
      <div aria-hidden="true" className="grain absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[20%] blur-[80px] [background-image:radial-gradient(ellipse_40%_40%_at_85%_10%,color-mix(in_srgb,var(--color-abyss)_55%,transparent),transparent_70%),radial-gradient(ellipse_35%_35%_at_10%_95%,color-mix(in_srgb,var(--color-shallows)_25%,transparent),transparent_70%)]" />

      <div className={`${container} relative`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Eyebrow className="text-bone/85">Every week</Eyebrow>
            <SectionHead
              id="events-weekly-heading"
              title="Weekly Gatherings"
              lead="The rhythm you can count on, every single week."
            />
          </div>
          <p className="max-w-[30ch] text-[0.95rem] leading-relaxed text-bone/90 lg:text-right">
            {site.location.venue} — {STREAMING_NOTE}
          </p>
        </div>
      </div>

      {/* The Current — a rail on phones, the full row from md up. */}
      <div ref={ref} className="relative mt-16 sm:mt-20">
        <ol
          aria-label="Weekly service times"
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto px-[28vw] pb-2 md:mx-auto md:max-w-[88rem] md:overflow-visible md:px-8"
        >
          {services.map((service, i) => (
            <Stop
              key={`${service.day}-${service.time}`}
              service={service}
              index={i}
              firstOfDay={i === 0 || services[i - 1].day !== service.day}
              drawn={shown}
            />
          ))}
        </ol>
        <p className="mt-6 text-center text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-bone/70 md:hidden" aria-hidden="true">
          Swipe the week →
        </p>
      </div>

      <div className={`${container} relative mt-16 flex justify-center`}>
        <Button to="/watch-live" variant="ghost" arrow>
          Can&apos;t be there? Watch live
        </Button>
      </div>
    </section>
  )
}
