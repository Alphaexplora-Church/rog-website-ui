import { useState } from 'react'
import { lifeStages } from '../../../shared/data/lifeStages'
import { person } from '../../../shared/data/people'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * About, section 7 — Life Stage Coordinators. Carousel shape matches the
 * Figma WhoWeAre.dc.html board; the names are the real roster from
 * riverofgod.ph.
 *
 * ── SINGLE-SOURCED 2026-09-23 ────────────────────────────────────────────
 * Jude: "make sure that the data placeholders are all the same… para pag
 * inimplement tsaka inintegrate natin yung cms, we wont encounter any
 * issue."
 *
 * ⚠ THIS SECTION AND THE MINISTRIES TAB DESCRIBED THE SAME MINISTRIES
 * DIFFERENTLY. The seven stages were typed out here with their age ranges,
 * and the Ministries tab's "Life Seasons" carousel typed out six of its own
 * with different bands — River Kids 3–12 here against 4–12 there, Young
 * Adults 20–35 against 20–30, and Men and Women as two rows here against
 * one 31–50 card there. Both now read `shared/data/lifeStages.ts`, where
 * riverofgod.ph's numbers won and the Men/Women card grouping is recorded
 * explicitly. The full conflict table is in that file.
 *
 * The age line now reads "Ages 3–12" rather than "3–12 years old" — one
 * short form is stored and both pages render it, instead of each page
 * carrying its own phrasing of the same number.
 *
 * ⚠ The Allan Santiago ↔ Seasoned / Bojie Ignacio ↔ River Men pairing is
 * still a best guess; that flag moved to `lifeStages.ts` with the data.
 */
const VISIBLE = 3
const STEP = 300


export function LifeStageCoordinatorsSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const [page, setPage] = useState(0)
  const maxPage = Math.max(0, lifeStages.length - VISIBLE)

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="life-stage-heading"
      className="relative bg-[#161616] text-white"
    >
      <div className="mx-auto max-w-[86rem] px-6 py-20 sm:py-24">
        <div className="flex items-end justify-between gap-6">
          <h2 id="life-stage-heading" className="font-heading text-2xl font-bold sm:text-3xl">
            Life Stage Coordinators
          </h2>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              {/* Was the literal character "‹" — Doc 9 bans unicode glyphs
                  as icons; they inherit the font's metrics and sit off-centre. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
              disabled={page === maxPage}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`mt-10 overflow-hidden ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
        >
          <div
            className="flex gap-5 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${page * STEP}px)` }}
          >
            {lifeStages.map((stage) => (
              <div
                key={stage.slug}
                className="w-64 shrink-0 rounded-2xl border border-white/10 bg-[#232323] p-7"
              >
                <p className="text-xs font-bold tracking-[0.14em] text-[#1b7a70] uppercase">
                  {stage.name}
                  {stage.ageRange ? ` · Ages ${stage.ageRange}` : ''}
                </p>
                <p className="mt-4 font-heading text-lg font-bold text-white">
                  {person(stage.coordinator).name}
                </p>
                <p className="mt-1 text-sm text-[#a6a6a6]">Life Stage Coordinator</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: maxPage + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === page ? 'w-[22px] bg-[#1b7a70]' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[70px] w-full sm:h-[100px]"
      >
        <path
          d="M0,60 C360,5 720,115 1080,50 C1260,18 1350,38 1440,55 L1440,130 L0,130 Z"
          fill="#232323"
        />
      </svg>
    </section>
  )
}
