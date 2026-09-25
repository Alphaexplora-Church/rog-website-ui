import { peopleBySlugs } from '../../../shared/data/people'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { Portrait } from './TeamRosterRow'

/**
 * About — River of God Ortigas Pastors. REVAMP 2026-09-25: a horizontal
 * PORTRAIT RAIL on abyss — tall poster frames that step up and down like
 * prints pinned along a wall, name set in shout beneath each. On mobile
 * it's a scroll-snap row with a visible peek of the next portrait.
 *
 * riverofgod.ph's roster for this section is Tin Corpus, Abigail
 * Sanchez-Flores, Rodel Buban, Khristine Lacsina and Jethro Mendoza (Mark
 * Libunao is on the Apostolic Team instead, with his real titles).
 * Names from `shared/data/people.ts` (single-sourced 2026-09-23).
 *
 * ⚠ ROLE TITLES STILL PLACEHOLDER. All five read "River of God Ortigas"
 * because the pasted source came through with names and role lines
 * separated and the pairing is not reliably recoverable — attributing the
 * wrong ministry to a named pastor is worse than staying generic. The flag
 * lives on the records in `people.ts`.
 */
const ortigasPastors = peopleBySlugs([
  'tin-corpus',
  'abigail-sanchez-flores',
  'rodel-buban',
  'khristine-lacsina',
  'jethro-mendoza',
])

/** Literal offsets so the rail steps like pinned prints (desktop only). */
const offsets = ['lg:mt-0', 'lg:mt-16', 'lg:mt-6', 'lg:mt-24', 'lg:mt-10']

export function OrtigasPastorsSection() {
  return (
    <section
      id="ortigas-pastors"
      data-plate="dark"
      aria-labelledby="ortigas-pastors-heading"
      className="relative scroll-mt-32 overflow-hidden bg-abyss py-24 text-bone sm:py-32"
    >
      <div className={container}>
        <SectionHead
          id="ortigas-pastors-heading"
          eyebrow="River of God Ortigas"
          title={
            <>
              Ortigas
              <br />
              Pastors
            </>
          }
        />
      </div>

      <Reveal className="mt-14">
        <ul
          className="no-scrollbar mx-auto flex max-w-[88rem] snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:gap-6 sm:scroll-px-8 sm:px-8 lg:overflow-visible"
          aria-label="River of God Ortigas pastors"
        >
          {ortigasPastors.map((p, i) => (
            <li
              key={p.slug}
              className={`group w-[68%] flex-none snap-start sm:w-[40%] lg:w-auto lg:flex-1 ${offsets[i % offsets.length]}`}
            >
              <Portrait className="aspect-[3/4] w-full" />
              <p className="mt-5 flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.22em] text-shallows uppercase">
                <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span aria-hidden="true" className="h-px w-6 bg-shallows/50 transition-[width] duration-500 ease-current group-hover:w-10 group-hover:bg-ember" />
              </p>
              <h3 className="mt-2 font-shout text-[1.9rem] font-bold uppercase leading-[0.92]">
                {p.name}
              </h3>
              {p.roles.map((r) => (
                <p key={r} className="mt-2 text-sm text-sand">
                  {r}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
