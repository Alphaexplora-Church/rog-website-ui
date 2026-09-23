import { site } from '../../../shared/config/site'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

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

export function WeeklyGatheringsSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const gatherings = weeklyGatherings()

  return (
    <section ref={ref} data-plate="dark" className="bg-[#232323] text-white">
      <div className="mx-auto max-w-[86rem] px-6 py-20 sm:py-24">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">Weekly Gatherings</h2>
        <p className="mt-2 max-w-[52ch] text-sm text-white/55">
          The rhythm you can count on, every single week.
        </p>

        <div
          className={`mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          {gatherings.map((g) => (
            <div key={g.day} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-bold tracking-[0.1em] text-[#1b7a70] uppercase">
                {g.cadence}
              </p>
              <p className="mt-2 font-heading text-xl font-bold">{g.title}</p>
              <ul className="mt-4 space-y-1.5">
                {g.slots.map((slot) => (
                  <li key={slot} className="text-sm text-white/70">
                    {slot}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-white/10 pt-4 text-xs text-white/45">
                {site.location.venue} — {STREAMING_NOTE}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
