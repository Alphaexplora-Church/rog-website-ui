import { useState } from 'react'
import { cardAgeLabel, lifeStageCards } from '../../../shared/data/lifeStages'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealDelay1, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * Ministries, section 2 — "Life Seasons" carousel. From the Figma
 * Ministries.dc.html board: age-stage cards with alternating themes
 * (white / navy #0E2A3F / teal #1B7A70), same carousel pattern as the
 * other pages on this site (page/maxPage/STEP state).
 *
 * ── SINGLE-SOURCED 2026-09-23 ────────────────────────────────────────────
 * Jude: "make sure that the data placeholders are all the same… para pag
 * inimplement tsaka inintegrate natin yung cms, we wont encounter any
 * issue."
 *
 * ⚠ THESE CARDS AND ABOUT'S LIFE STAGE COORDINATORS DESCRIBED THE SAME
 * MINISTRIES WITH DIFFERENT AGE BANDS. This file's Figma-sourced numbers
 * said River Kids 4–12, Young Adults 20–30 and River Men & Women 31–50;
 * About's riverofgod.ph-sourced roster said 3–12, 20–35 and 36–50. The
 * official site won, per Jude's standing instruction on this project, so
 * THE AGE LABELS ON THESE CARDS HAVE CHANGED. The cards themselves,
 * their copy, their photos and their themes are untouched.
 *
 * Card data now lives in `shared/data/lifeStages.ts` — the seven canonical
 * stages that About lists, plus the six-card grouping this carousel shows
 * (River Men and River Women share one card; that decision is written down
 * exactly once, there). `cardAgeLabel` derives a card's age line from the
 * stages it covers, so no age is stored twice.
 *
 * `card` / `ageColor` / `bodyColor` are literal, complete Tailwind class
 * strings in that file — never assembled at runtime, same JIT constraint
 * documented throughout this codebase.
 */
const VISIBLE = 4
const STEP = 272

export function LifeSeasonsSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const [page, setPage] = useState(0)
  const maxPage = Math.max(0, lifeStageCards.length - VISIBLE)

  return (
    <section
      data-plate="dark"
      aria-labelledby="life-seasons-heading"
      className="relative bg-[#232323] text-white"
    >
      <div ref={ref} className="mx-auto max-w-[86rem] px-6 pt-14 pb-36 sm:pt-20 sm:pb-44">
        <h2
          id="life-seasons-heading"
          className="max-w-[52ch] text-balance font-heading text-2xl font-bold sm:text-3xl"
        >
          We&rsquo;ve created new ministries to encourage growth in your journey with the Lord,
          at every stage of life.
        </h2>

        <div className="relative mt-10">
          <div
            className={`overflow-hidden ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
          >
            <div
              className="flex gap-5 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${page * STEP}px)` }}
            >
              {lifeStageCards.map((stage) => (
                <div
                  key={stage.slug}
                  className={`w-64 shrink-0 overflow-hidden rounded-[26px_8px_26px_8px] ${stage.card}`}
                >
                  <img
                    src={stage.photo}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-32 w-full object-cover"
                  />
                  <div className="flex flex-col gap-2.5 p-5">
                    <p className={`text-xs font-bold tracking-[0.06em] ${stage.ageColor}`}>
                      {cardAgeLabel(stage)}
                    </p>
                    <p className="font-heading text-lg font-semibold">{stage.title}</p>
                    <p className={`text-sm leading-relaxed ${stage.bodyColor}`}>{stage.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous life seasons"
            className="absolute top-1/2 left-[-22px] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0B0F14] shadow-lg disabled:opacity-30 sm:flex"
          >
            {/* Was the literal character "‹". Doc 9 bans unicode glyphs as
                icons — they inherit the font's own metrics, so they sit
                off-centre and change shape between platforms. */}
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
            aria-label="Next life seasons"
            className="absolute top-1/2 right-[-22px] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0B0F14] shadow-lg disabled:opacity-30 sm:flex"
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

      {/* Wave divider into whatever section follows — its fill has to MATCH
          that section's plate, or the wave paints a differently-coloured band
          across the top of it. It was #161616 because Body of Christ used to
          come next; the page order changed to put Service Ministries (#0d0d0d)
          there instead, which left a visible lighter strip. Change this fill
          whenever the section below it changes. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[80px] w-full sm:h-[110px]"
      >
        <path
          d="M0,60 C360,130 720,0 1080,65 C1260,100 1350,85 1440,65 L1440,140 L0,140 Z"
          fill="#0d0d0d"
        />
      </svg>
    </section>
  )
}
