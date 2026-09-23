import { useState } from 'react'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * About, section 7 — Life Stage Coordinators. Carousel shape matches the
 * Figma WhoWeAre.dc.html board; real names UPDATED 2026-09-22 from
 * riverofgod.ph, replacing the earlier "Coordinator Name" placeholder.
 *
 * ⚠ Allan Santiago / Bojie Ignacio ↔ Seasoned / River Men pairing is a
 * BEST GUESS. The pasted source listed both names together, then both age
 * ranges together, in that order — this assumes first-listed pairs with
 * first-listed, but the scrape doesn't guarantee that. Every other pairing
 * here is unambiguous. Flag to Jude to confirm before this ships.
 */
const VISIBLE = 3
const STEP = 300

const lifeStages = [
  { name: 'River Kids', range: '3–12 years old', coordinator: 'Aprile Liwanag' },
  { name: 'River Youth', range: '13–19 years old', coordinator: 'Nhea Tagalog' },
  { name: 'Young Adults', range: '20–35 years old', coordinator: 'Mikee Chester' },
  { name: 'Seasoned', range: '51 years old and above', coordinator: 'Allan Santiago' },
  { name: 'River Men', range: '36–50 years old', coordinator: 'Bojie Ignacio' },
  { name: 'River Women', range: '36–50 years old', coordinator: 'Rosalin Co' },
  { name: 'River Families', range: undefined, coordinator: 'Nestor and Sol Mendoza' },
]

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
              ‹
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
              disabled={page === maxPage}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              ›
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
                key={stage.name}
                className="w-64 shrink-0 rounded-2xl border border-white/10 bg-[#232323] p-7"
              >
                <p className="text-xs font-bold tracking-[0.14em] text-[#1b7a70] uppercase">
                  {stage.name}
                  {stage.range ? ` · ${stage.range}` : ''}
                </p>
                <p className="mt-4 font-heading text-lg font-bold text-white">
                  {stage.coordinator}
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
