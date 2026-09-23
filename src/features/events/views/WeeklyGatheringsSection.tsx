import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * Events, section 2 — "Weekly Gatherings". Real recurring schedule info,
 * sourced from what Jude has already shared and confirmed on this project:
 * Sunday Service time/language slots (10AM Taglish, 1PM English, 4PM
 * Taglish/English) are visible on the sermon-card labels in his Media
 * Library screenshots; Wednesday Prayer & Fasting at 6PM, River of God
 * Center, is explicit on the site's own "Prayer & Fasting" media card he
 * shared. Not invented — but also not exhaustively confirmed (there may
 * be more service slots or ministry-specific gatherings not shown in what
 * he's shared so far), so treat this as representative, not exhaustive.
 */
const gatherings = [
  {
    title: 'Sunday Service',
    cadence: 'Every Sunday',
    slots: ['10:00 AM — Taglish', '1:00 PM — English', '4:00 PM — Taglish/English'],
    note: 'River of God Center, Lower Ground, Shangri-La Plaza — also live on Facebook and YouTube.',
  },
  {
    title: 'Prayer & Fasting',
    cadence: 'Every Wednesday',
    slots: ['6:00 PM'],
    note: 'On-site at River of God Center — also airing live on Facebook and YouTube.',
  },
]

export function WeeklyGatheringsSection() {
  const { ref, shown } = useInView<HTMLElement>()

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
            <div key={g.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-bold tracking-[0.1em] text-[#1b7a70] uppercase">{g.cadence}</p>
              <p className="mt-2 font-heading text-xl font-bold">{g.title}</p>
              <ul className="mt-4 space-y-1.5">
                {g.slots.map((slot) => (
                  <li key={slot} className="text-sm text-white/70">
                    {slot}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-white/10 pt-4 text-xs text-white/45">{g.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
