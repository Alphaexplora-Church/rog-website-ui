import { Button } from '../../../shared/components/ui/Button'
import { useInView } from '../../../shared/hooks/useInView'
import {
  maskLineBase,
  maskLineHidden,
  maskLineShown,
  revealBase,
  revealDelay1,
  revealHidden,
  revealShown,
  textH2,
} from '../../../shared/styles/tokens'

/**
 * Home, section 6 — Events. NOT in Doc 8's original 9-section plan: that
 * doc explicitly held a homepage events slot "in reserve until ROG actually
 * has event data" (Doc 1, R2), because none existed anywhere in ROG's
 * channels at the time. Jude's 2026-09-16 revision adds it back in now.
 *
 * ⚠ SAMPLE DATA — `sampleEvents` below is illustrative, not real. Titles are
 * generic church-event types (a youth night, an outreach, a baptism) chosen
 * so the layout demos correctly without asserting a specific false claim —
 * none of these dates or descriptions came from ROG. Replace this array
 * with real events (or wire it to Doc 7's future `event` collection) before
 * this section ships. Do not let placeholder dates reach production.
 *
 * "Register" routes to `/events` — the real nav destination already in
 * navigation.ts (Media & Events → Events), not an invented path. Once real
 * events exist there, each card can link to its own event instead.
 *
 * Date badges use one plain navy blue, same on every card — was a
 * sky/teal alternation, then plain teal; now navy blue per Jude's
 * 2026-09-16 follow-up, matching MinistriesGrid, NextStepsSection and
 * ServiceTimesSection's pills — one flat accent site-wide.
 *
 * ⚠ PLACEHOLDER PHOTOS — each card also carries a keyword-matched photo
 * (loremflickr.com) above the date badge per Jude's "para may buhay"
 * follow-up. The badge keeps its existing colour; the photo is new, not a
 * replacement. Same caveat as WelcomeBanner's: not licensed for
 * production, and doubly so here since `sampleEvents` itself is already
 * flagged placeholder — both need real ROG content before launch.
 */
interface SampleEvent {
  month: string
  day: string
  title: string
  blurb: string
  photo: string
}

const sampleEvents: SampleEvent[] = [
  { month: 'OCT', day: '04', title: 'Activate12 Youth Night', blurb: 'Worship, games and a short message for ages 13–19.', photo: 'https://loremflickr.com/500/300/youthgroup,worship?lock=21' },
  { month: 'OCT', day: '18', title: 'Community Outreach', blurb: 'Feeding program and prayer walk around Ortigas.', photo: 'https://loremflickr.com/500/300/volunteers,outreach?lock=22' },
  { month: 'NOV', day: '01', title: 'Baptism Sunday', blurb: 'Sign up after any service if you’re ready to take this step.', photo: 'https://loremflickr.com/500/300/baptism,water?lock=23' },
]

export function EventsStrip() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-plate="light"
      aria-labelledby="events-heading"
      className="bg-white text-black"
    >
      <div className="mx-auto max-w-[86rem] px-6 py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-[#8f8f8f] uppercase">
              What's Coming Up
            </p>
            <h2
              id="events-heading"
              className="mt-6 max-w-[62ch] text-balance font-heading leading-[1.05] font-bold"
              style={{ fontSize: textH2, letterSpacing: '-0.04em' }}
            >
              <span className="block overflow-hidden pb-[0.1em]">
                <span className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden}`}>
                  Get on the calendar.
                </span>
              </span>
            </h2>
          </div>

          <Button
            to="/events"
            variant="ghost"
            tone="light"
            size="sm"
            className={`${revealBase} ${shown ? revealShown : revealHidden}`}
          >
            See all events
          </Button>
        </div>

        <div
          className={`mt-16 grid gap-px overflow-hidden rounded-2xl bg-[#e4e4e4] ring-1 ring-[#e4e4e4] sm:grid-cols-3 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {sampleEvents.map((event) => (
            <div key={event.title} className="flex flex-col gap-5 bg-[#f4f4f4] p-8">
              <div className="-mx-8 -mt-8 overflow-hidden">
                <img
                  src={event.photo}
                  alt=""
                  aria-hidden="true"
                  className="aspect-[5/3] w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-200 text-blue-700">
                <span className="text-[0.65rem] font-bold tracking-[0.14em] uppercase opacity-80">
                  {event.month}
                </span>
                <span className="tabular-nums text-2xl font-bold leading-none">{event.day}</span>
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold">{event.title}</h3>
                <p className="mt-2 text-sm text-[#5c5c5c]">{event.blurb}</p>
              </div>

              <Button
                to="/events"
                variant="outline"
                tone="light"
                size="sm"
                className="mt-auto self-start"
              >
                Register
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
