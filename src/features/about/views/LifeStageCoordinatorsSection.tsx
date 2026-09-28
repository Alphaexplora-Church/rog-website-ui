import { useState } from 'react'
import { lifeStageCards, lifeStages } from '../../../shared/data/lifeStages'
import { person } from '../../../shared/data/people'
import { Reveal, RiverImage, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * About — Life Stage Coordinators. REVAMP 2026-09-25: replaces the
 * three-at-a-time card carousel with a PHOTO-LED INDEX on abyss.
 *
 * Shape: seven rows — stage name huge in shout, age band, coordinator in
 * whisper. On desktop a tall photo panel sits beside the list and swaps to
 * the stage under the pointer (full colour — it's the featured image; the
 * mobile thumbnails use Colour Bloom). The photo is decoration — every fact is in the row
 * text, so nothing depends on hovering. On mobile each row carries its own
 * small thumbnail instead (blooms as it crosses the centre of the screen).
 *
 * Photos: the Ministries tab's Life Seasons cards (`lifeStageCards`),
 * matched by which stages each card covers — the same single source, not
 * new images.
 *
 * ── SINGLE-SOURCED 2026-09-23 ────────────────────────────────────────────
 * Stages, age ranges and coordinators come from `shared/data/lifeStages.ts`
 * (riverofgod.ph's numbers won the conflict with the old Ministries tab;
 * the full table is in that file) and names from `people.ts`. The age line
 * reads "Ages 3–12" — one stored short form, rendered by both pages.
 *
 * ⚠ The Allan Santiago ↔ Seasoned / Bojie Ignacio ↔ River Men pairing is
 * still a best guess; that flag lives in `lifeStages.ts` with the data.
 */
const photoFor = new Map<string, string>()
lifeStageCards.forEach((c) => c.stages.forEach((s) => photoFor.set(s, c.photo)))

export function LifeStageCoordinatorsSection() {
  const [active, setActive] = useState(0)
  const activePhoto = photoFor.get(lifeStages[active].slug)

  return (
    <section
      id="life-stage-coordinators"
      data-plate="dark"
      aria-labelledby="life-stage-heading"
      className="relative scroll-mt-32 overflow-hidden bg-abyss py-24 text-bone sm:py-32"
    >
      <div className={container}>
        <SectionHead
          id="life-stage-heading"
          eyebrow="Every season of life"
          title={
            <>
              Life Stage
              <br />
              Coordinators
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Desktop photo panel — decorative, mirrors the row in focus */}
          <div aria-hidden="true" className="hidden lg:block">
            <div className="sticky top-44">
              {activePhoto && (
                <RiverImage
                  key={activePhoto}
                  src={activePhoto}
                  bloom="always"
                  className="aspect-[4/5] w-full"
                />
              )}
              <p className="mt-4 font-shout text-[5rem] font-black leading-[0.8] text-bone/10 tabular-nums">
                {String(active + 1).padStart(2, '0')}
                <span className="text-bone/5">/{String(lifeStages.length).padStart(2, '0')}</span>
              </p>
            </div>
          </div>

          <ol className="border-t border-bone/12">
            {lifeStages.map((stage, i) => {
              const photo = photoFor.get(stage.slug)
              const on = i === active
              return (
                <Reveal
                  as="li"
                  key={stage.slug}
                  delay={i * 50}
                  className="border-b border-bone/12"
                >
                  <div
                    onMouseEnter={() => setActive(i)}
                    className="group grid grid-cols-[5rem_1fr] items-center gap-5 py-6 sm:grid-cols-[6rem_1fr] lg:grid-cols-1 lg:py-7"
                  >
                    {photo && (
                      <RiverImage src={photo} bloom="hover" className="aspect-square w-full lg:hidden" />
                    )}
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-baseline lg:justify-between lg:gap-8">
                      <h3
                        className={`font-shout text-[clamp(2rem,4.6vw,4rem)] font-extrabold uppercase leading-[0.88] transition-colors duration-500 ease-current ${
                          on ? 'lg:text-bone' : 'lg:text-bone/45'
                        }`}
                      >
                        {stage.name}
                      </h3>
                      <div className="lg:text-right">
                        <p className="font-whisper text-lg italic leading-tight lg:text-xl">
                          {person(stage.coordinator).name}
                        </p>
                        <p className="mt-1 text-[0.72rem] font-semibold tracking-[0.2em] text-sand uppercase">
                          {stage.ageRange ? `Ages ${stage.ageRange} · ` : ''}Life Stage Coordinator
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
