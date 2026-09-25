import { site } from '../../../shared/config/site'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { Spotlight, useSpotlight } from '../../../shared/components/ui/Spotlight'

/**
 * Events, section 2 — "Weekly Gatherings": the recurring schedule, as
 * opposed to the dated one-offs in UpcomingEventsSection below it.
 *
 * ── SINGLE-SOURCED 2026-09-23 ────────────────────────────────────────────
 * Jude: "make sure that the data placeholders are all the same… para pag
 * inimplement tsaka inintegrate natin yung cms, we wont encounter any
 * issue."
 *
 * ⚠ THIS SECTION WAS PUBLISHING A DIFFERENT SCHEDULE FROM THE REST OF THE
 * SITE, and had been since it was written. It carried its own `gatherings`
 * array, typed out by hand, which disagreed with `site.services` on two of
 * the four service slots:
 *
 *     slot      site.services (authoritative)   this file (was)
 *     1:00 PM   Taglish                         English
 *     4:00 PM   English                         Taglish/English
 *
 * `site.services` is the schedule Jude picked on 2026-09-16 when three
 * different versions were circulating across riverofgod.ph, their Facebook
 * page and their printed material — see that file's own note. It is what
 * the home page, Watch Live's countdown and Plan a Visit's service picker
 * all read, so this page was the single outlier. It now reads the same
 * array, which means the contradiction cannot come back, and when the
 * Strapi `global` single type takes over, one swap updates every page.
 *
 * The venue line is `site.location.venue` for the same reason. Only the
 * cadence wording and the "also live on Facebook and YouTube" note are
 * written here, because those are this section's own copy, not facts any
 * other page repeats.
 *
 * Grouping is by `day` in the order the services appear in `site.services`,
 * so adding a Saturday service to that array makes a third card here with
 * no change to this file. A day's card title uses the `label` from its
 * entries when one is set (that is where "Prayer & Fasting" comes from) and
 * falls back to "<Day> Service" otherwise.
 */
interface Gathering {
  day: string
  title: string
  cadence: string
  slots: string[]
}

function weeklyGatherings(): Gathering[] {
  const byDay = new Map<string, Gathering>()

  for (const service of site.services) {
    let gathering = byDay.get(service.day)
    if (!gathering) {
      gathering = {
        day: service.day,
        title: service.label ?? `${service.day} Service`,
        cadence: `Every ${service.day}`,
        slots: [],
      }
      byDay.set(service.day, gathering)
    }

    // "6:00 PM" on its own for the labelled midweek entry — repeating
    // "Prayer & Fasting" under a card already titled that reads as a stutter.
    // Everything else carries its language, which is the whole reason a
    // visitor is reading this list.
    gathering.slots.push(service.label ? service.time : `${service.time} — ${service.language}`)
  }

  return [...byDay.values()]
}

const STREAMING_NOTE = 'also live on Facebook and YouTube.'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * "Today" / "Tomorrow" / "In 3 days" for a weekday name, counted in
 * Philippine time (UTC+8) so the answer matches the church's own calendar
 * wherever the visitor is. Added in the 2026-09-24 motion pass — a small
 * live fact that makes a static schedule feel current.
 */
function nextLabel(day: string): string | null {
  const target = DAYS.indexOf(day)
  if (target < 0) return null
  const today = new Date(Date.now() + 8 * 3600 * 1000).getUTCDay()
  const diff = (target - today + 7) % 7
  return diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `In ${diff} days`
}

const EASE = 'ease-[cubic-bezier(0.23,1,0.32,1)]'

/**
 * ── MOTION PASS 2026-09-24 ───────────────────────────────────────────────
 * Jude: "lagyan mo ng animation… hovering effects… para hindi siya mukang
 * pale and boring." Each card now lifts on hover with a teal border, a
 * mouse-following glow and its time slots brightening; the two cards
 * arrive one after the other; and each carries a "Today / In N days" chip.
 * Hover only on devices that can hover; movement off under reduced motion.
 */
function GatheringCard({ g, reveal, delay }: { g: Gathering; reveal: string; delay: number }) {
  const spot = useSpotlight<HTMLDivElement>()
  const next = nextLabel(g.day)
  const isToday = next === 'Today'

  return (
    <div className={reveal} style={{ transitionDelay: `${delay}ms` }}>
      <div
        {...spot}
        className={`group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-[transform,border-color,background-color,box-shadow] duration-500 ${EASE} hover:-translate-y-1 hover:border-[#8FD4C9]/35 hover:bg-white/[0.07] hover:shadow-[0_24px_60px_-28px_rgb(27_122_112/0.6)] motion-reduce:hover:translate-y-0`}
      >
        <Spotlight size={380} strength={0.12} />

        <div className="relative z-[2]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold tracking-[0.1em] text-[#1b7a70] uppercase transition-colors duration-300 group-hover:text-[#8FD4C9]">
              {g.cadence}
            </p>
            {next ? (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase ${
                  isToday
                    ? 'bg-[#8FD4C9] text-[#0b1f1d]'
                    : 'border border-white/10 text-white/55 transition-colors duration-300 group-hover:border-[#8FD4C9]/30 group-hover:text-[#8FD4C9]'
                }`}
              >
                {isToday ? (
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#0b1f1d] opacity-50 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0b1f1d]" />
                  </span>
                ) : null}
                {next}
              </span>
            ) : null}
          </div>

          <p className="mt-2 font-heading text-xl font-bold">{g.title}</p>

          <ul className="mt-4 space-y-1.5">
            {g.slots.map((slot, i) => (
              <li
                key={slot}
                className={`flex items-center gap-2.5 text-sm text-white/70 transition-[color,transform] duration-300 ${EASE} group-hover:translate-x-1 group-hover:text-white motion-reduce:group-hover:translate-x-0`}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/25 transition-colors duration-300 group-hover:bg-[#8FD4C9]"
                />
                {slot}
              </li>
            ))}
          </ul>

          <p className="mt-4 border-t border-white/10 pt-4 text-xs text-white/45">
            {site.location.venue} — {STREAMING_NOTE}
          </p>
        </div>
      </div>
    </div>
  )
}

export function WeeklyGatheringsSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const gatherings = weeklyGatherings()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  return (
    <section ref={ref} data-plate="dark" className="bg-[#232323] text-white">
      <div className="mx-auto max-w-[86rem] px-6 py-20 sm:py-24">
        <div className={reveal}>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">Weekly Gatherings</h2>
          <p className="mt-2 max-w-[52ch] text-sm text-white/55">
            The rhythm you can count on, every single week.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {gatherings.map((g, i) => (
            <GatheringCard key={g.day} g={g} reveal={reveal} delay={140 + i * 90} />
          ))}
        </div>
      </div>
    </section>
  )
}
