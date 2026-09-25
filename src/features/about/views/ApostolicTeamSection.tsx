import { peopleBySlugs } from '../../../shared/data/people'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { Portrait } from './TeamRosterRow'

/**
 * About — Apostolic Team. REVAMP 2026-09-25: the river (teal) band, set as
 * ROSTER ROWS — a numbered editorial index, one full-width row per person:
 * small poster portrait, name in shout, every title they hold listed on
 * the right. Rows (not cards) because these five carry the longest title
 * lists on the page (up to four each, verbatim from riverofgod.ph,
 * confirmed 2026-09-22) and a row gives those lines room to read.
 *
 * The four people sections deliberately use four different shapes (rows
 * here, a portrait rail for Ortigas Pastors, a two-column credits index for
 * Serving Ministry Heads, a photo-led list for Life Stage Coordinators) —
 * they used to share one card grid (TeamRosterRow), which made the page
 * read as the same block four times.
 *
 * SINGLE-SOURCED 2026-09-23 — `shared/data/people.ts`; this file decides
 * only WHO appears here and in what order.
 */
const apostolicTeam = peopleBySlugs([
  'chito-sanchez',
  'rachel-sanchez',
  'greeko-villanueva',
  'roselyn-arcelo',
  'mark-libunao',
])

export function ApostolicTeamSection() {
  return (
    <section
      id="apostolic-team"
      data-plate="dark"
      aria-labelledby="apostolic-team-heading"
      className="relative scroll-mt-32 overflow-hidden bg-river py-24 text-bone sm:py-32"
    >
      <div aria-hidden="true" className="grain absolute inset-0" />
      <div className={`${container} relative`}>
        <SectionHead
          id="apostolic-team-heading"
          eyebrow={<span className="text-bone/85">Our team</span>}
          title="Apostolic Team"
        />

        <ol className="mt-14 border-t border-bone/20">
          {apostolicTeam.map((p, i) => (
            <Reveal
              as="li"
              key={p.slug}
              delay={i * 60}
              className="group relative grid grid-cols-[4.5rem_1fr] items-start gap-x-5 gap-y-4 border-b border-bone/20 py-7 transition-colors duration-500 ease-current hover:bg-abyss/15 sm:grid-cols-[3rem_5.5rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:gap-x-8 sm:px-3"
            >
              <span className="hidden font-shout text-lg tabular-nums text-bone/80 sm:block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Portrait photo={p.photo} alt={`Portrait of ${p.name}`} className="aspect-[4/5] w-full" />
              <div>
                <h3 className="font-shout text-[clamp(1.8rem,3.2vw,2.9rem)] font-bold uppercase leading-[0.92] transition-transform duration-500 ease-current group-hover:translate-x-1 motion-reduce:transition-none">
                  {p.name}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-12 origin-left bg-ember transition-transform duration-[600ms] ease-current group-hover:scale-x-[2.5]"
                />
              </div>
              <ul className="col-span-2 grid gap-1.5 text-[0.95rem] leading-snug text-bone/85 sm:col-span-1">
                {p.roles.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
