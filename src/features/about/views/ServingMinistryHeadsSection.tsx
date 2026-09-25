import { ministriesBySlugs } from '../../../shared/data/ministries'
import { person } from '../../../shared/data/people'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * About — Serving Ministry Heads. REVAMP 2026-09-25: the bone light plate,
 * set as a TWO-COLUMN CREDITS INDEX — ministry in shout, a hairline leader,
 * the person who heads it — like the credits page of a programme. No
 * portraits here on purpose: the ministry IS the headline for this roster,
 * and it breaks the rhythm after the portrait rail above.
 *
 * ── SINGLE-SOURCED 2026-09-23 ────────────────────────────────────────────
 * Jude: "make sure that the data placeholders are all the same… para pag
 * inimplement tsaka inintegrate natin yung cms, we wont encounter any
 * issue."
 *
 * This roster and the Ministries tab used to disagree on two labels
 * ("Media & Production" vs "Media and Production", "Discipleship &
 * Connect" vs "Discipleship"). The Ministries tab's spelling matches the
 * #SAVEDTOSERVE cards on riverofgod.ph, which Jude confirmed as
 * authoritative, so that is what shows here. A person's role here IS the
 * ministry they run, so it is read from `ministries.ts`; their name from
 * `people.ts`. Nothing in this file can drift from the Ministries tab.
 *
 * WHY SIX AND NOT EIGHT: `ministries.ts` carries eight, including River
 * Kids Teachers (Aprile Liwanag) and River Families (Nestor and Sol
 * Mendoza). Both are already on this page as life stage coordinators
 * below, so listing them again would show the same name twice. Add a slug
 * to the array to change that.
 */
const HEAD_MINISTRIES = [
  'media-and-production',
  'creative-arts',
  'ushering',
  'worship-team',
  'discipleship',
  'cross-cultural',
]

const ministryHeads = ministriesBySlugs(HEAD_MINISTRIES).map((m) => ({
  ministry: m.title,
  name: person(m.contact).name,
}))

export function ServingMinistryHeadsSection() {
  return (
    <section
      id="serving-ministry-heads"
      data-plate="light"
      aria-labelledby="serving-ministry-heads-heading"
      className="relative scroll-mt-32 bg-bone py-24 text-abyss sm:py-32"
    >
      <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20`}>
        <SectionHead
          id="serving-ministry-heads-heading"
          tone="light"
          eyebrow={<span className="text-river">#SavedToServe</span>}
          title={
            <>
              Serving
              <br />
              Ministry
              <br />
              Heads
            </>
          }
          className="lg:sticky lg:top-44 lg:self-start"
        />

        <dl className="grid gap-x-12 sm:grid-cols-2">
          {ministryHeads.map((h, i) => (
            <Reveal
              key={h.ministry}
              delay={(i % 2) * 80}
              className="group border-t border-abyss/15 py-7"
            >
              <dt className="flex items-baseline gap-3">
                <span className="font-shout text-sm tabular-nums text-abyss/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-shout text-[clamp(1.9rem,3vw,2.6rem)] font-extrabold uppercase leading-[0.92]">
                  {h.ministry}
                </span>
              </dt>
              <dd className="mt-4 flex items-center gap-3 pl-7">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-abyss/30 transition-[width,background-color] duration-500 ease-current group-hover:w-14 group-hover:bg-ember-ink"
                />
                <span className="font-whisper text-xl italic">{h.name}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
