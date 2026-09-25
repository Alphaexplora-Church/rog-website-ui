import { founders } from '../../../shared/data/people'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'
import { Portrait } from './TeamRosterRow'

/**
 * About — Leadership bios (Bishop Chito + Pastor Rachel). REVAMP
 * 2026-09-25: the bone light plate, so the page's first people section
 * breaks from the dark timeline above.
 *
 * Shape: two long editorial spreads, alternating sides — a tall poster
 * portrait (Portrait: generic placeholder until real headshots exist,
 * Colour Bloom once a photo is passed) with the name set huge in shout
 * across it, and the biography beside it. Bios are the church's own text
 * from riverofgod.ph (Jude, 2026-09-22), kept verbatim — the first
 * paragraph is only set larger, never rewritten.
 *
 * SINGLE-SOURCED 2026-09-23: names, titles and bios come from
 * `shared/data/people.ts` (the two records flagged `founder`, in order).
 */
const leaders = founders()

export function LeadershipBiosSection() {
  return (
    <section
      id="leadership"
      data-plate="light"
      aria-labelledby="leadership-heading"
      className="relative scroll-mt-32 bg-bone py-24 text-abyss sm:py-32"
    >
      <div className={container}>
        <SectionHead
          id="leadership-heading"
          tone="light"
          eyebrow="Leadership"
          title="Our founders"
          className="text-river"
        />

        <div className="mt-16 grid gap-24 sm:mt-20 sm:gap-32">
          {leaders.map((leader, i) => {
            const [first, ...rest] = (leader.bio ?? '').split('\n\n')
            const flip = i % 2 === 1
            return (
              <article
                key={leader.slug}
                aria-labelledby={`leader-${leader.slug}`}
                className="group grid gap-10 lg:grid-cols-12 lg:gap-12"
              >
                <Reveal className={`lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : ''}`}>
                  <div className="relative">
                    <Portrait photo={leader.photo} alt={`Portrait of ${leader.name}`} className="aspect-[4/5] w-full max-w-md" />
                    <p className="mt-4 text-[0.72rem] font-semibold tracking-[0.22em] text-abyss/60 uppercase">
                      {leader.shortTitle}
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={120} className={`lg:col-span-7 ${flip ? 'lg:order-1 lg:col-start-1' : ''}`}>
                  <h3
                    id={`leader-${leader.slug}`}
                    className="font-shout text-[clamp(2.6rem,5.6vw,5rem)] font-extrabold uppercase leading-[0.88] text-balance"
                  >
                    {leader.name}
                  </h3>
                  <span aria-hidden="true" className="mt-6 block h-1 w-20 bg-ember" />
                  {first && (
                    <p className="mt-8 max-w-[44ch] font-whisper text-[clamp(1.2rem,1.7vw,1.45rem)] italic leading-[1.45] text-abyss/85">
                      {first}
                    </p>
                  )}
                  {rest.map((para, pi) => (
                    <p key={pi} className="mt-5 max-w-[62ch] leading-relaxed text-abyss/75">
                      {para}
                    </p>
                  ))}
                </Reveal>
              </article>
            )
          })}
        </div>

        <Reveal className="mt-24 border-t border-abyss/15 pt-10">
          <p className="mx-auto max-w-[40ch] text-center font-whisper text-[clamp(1.25rem,2vw,1.7rem)] italic leading-snug text-abyss/80">
            Bishop Chito and Pastor Rachel have 6 children and 7 grandchildren. They reside in Pasig
            City, Metro Manila, Philippines.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
