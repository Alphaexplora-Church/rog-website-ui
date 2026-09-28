import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { AgeMinistry } from '../../../shared/models/types/ministry'
import { useMinistriesViewModel } from '../viewModels/useMinistriesViewModel'
import { SectionHead, WaveMark } from '../../../shared/components/ui/River'
import { useCenterBloom } from '../../../shared/hooks/useCenterBloom'
import { container } from '../../../shared/styles/tokens'

/**
 * Ministries, section 2 — "Ages of the River" (was the "Life Seasons"
 * carousel). REVAMP 2026-09-25.
 *
 * Shape: a horizontal strip of TALL portrait panels, each dominated by its
 * age band set as a huge shout numeral ("3–12", "13–19"…), over River
 * duotone imagery that blooms to true colour on hover/focus (and at screen
 * centre on touch, via useCenterBloom). The rail is native scroll-snap —
 * swipe on touch, drag with a mouse, arrow keys when focused, plus
 * prev/next buttons — so it replaces the old page/STEP transform carousel
 * without hiding anything behind pagination.
 *
 * DATA (2026-09-28): from rog-cms (Manage Contents → Ministries, type
 * "Ages of the River") through useMinistriesViewModel, bundled copy as the
 * fallback. Before that it was single-sourced in `shared/data/lifeStages.ts`: six
 * cards over seven canonical stages, and `cardAgeLabel` derives each age
 * line from the stages a card covers (riverofgod.ph's bands win over the
 * Figma board's — see that file). The cards' old `card` / `ageColor` /
 * `bodyColor` class strings belong to the retired white/navy/teal look and
 * are no longer read here.
 *
 * NEVER AN EMPTY BOX. The photos are remote stock placeholders; if one
 * fails to load, the panel's own textured ground (per-panel river
 * gradient + grain + a giant wave mark) is what shows, and it still blooms.
 */

/* Per-panel grounds — token hexes only, as inline style (Tailwind can't
   see runtime-chosen gradients). Each rests under the River duotone and
   warms on bloom, so even a panel with no photo visibly changes colour. */
const grounds = [
  'linear-gradient(165deg, var(--color-river) 0%, var(--color-abyss) 78%)',
  'linear-gradient(200deg, var(--color-ember) 0%, var(--color-deep) 55%, var(--color-abyss) 100%)',
  'linear-gradient(170deg, var(--color-shallows) 0%, var(--color-river) 45%, var(--color-abyss) 100%)',
  'linear-gradient(190deg, var(--color-sand) 0%, var(--color-deep) 60%, var(--color-abyss) 100%)',
  'linear-gradient(160deg, var(--color-deep) 0%, var(--color-river) 50%, var(--color-abyss) 100%)',
  'linear-gradient(205deg, var(--color-ember-ink) 0%, var(--color-deep) 55%, var(--color-abyss) 100%)',
]

export function LifeSeasonsSection() {
  const { ages } = useMinistriesViewModel()
  const rail = useRef<HTMLUListElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  function step(dir: 1 | -1) {
    const el = rail.current
    if (!el) return
    const panel = el.querySelector('li')
    const w = panel ? panel.getBoundingClientRect().width + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * w, behavior: 'smooth' })
  }

  /* Mouse drag — touch and pens already scroll natively. */
  function onPointerDown(e: ReactPointerEvent<HTMLUListElement>) {
    if (e.pointerType !== 'mouse' || !rail.current) return
    drag.current = { x: e.clientX, left: rail.current.scrollLeft, moved: false }
  }
  function onPointerMove(e: ReactPointerEvent<HTMLUListElement>) {
    const d = drag.current
    const el = rail.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true
      el.style.scrollSnapType = 'none'
      el.setPointerCapture(e.pointerId)
    }
    if (d.moved) el.scrollLeft = d.left - dx
  }
  function onPointerUp() {
    const el = rail.current
    drag.current = null
    if (el) el.style.scrollSnapType = ''
  }

  return (
    <section
      id="life-seasons"
      data-plate="dark"
      aria-labelledby="life-seasons-heading"
      className="relative isolate overflow-hidden bg-abyss py-24 text-bone sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[15%] -z-10 blur-[70px] [background-image:radial-gradient(ellipse_40%_35%_at_80%_20%,color-mix(in_srgb,var(--color-river)_45%,transparent),transparent_70%)]"
      />

      <div className={`${container} flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between`}>
        <SectionHead
          id="life-seasons-heading"
          eyebrow="Life stages"
          title={
            <>
              Ages of
              <br />
              the river
            </>
          }
          lead={
            <>
              We&rsquo;ve created new ministries to encourage growth in your journey with the Lord,
              at every stage of life.
            </>
          }
        />
        <div className="hidden gap-3 lg:flex">
          <RailButton dir={-1} onClick={() => step(-1)} />
          <RailButton dir={1} onClick={() => step(1)} />
        </div>
      </div>

      <ul
        ref={rail}
        tabIndex={0}
        aria-label="Life stage ministries — scroll sideways for more"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (drag.current?.moved) e.preventDefault()
        }}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 select-none focus-visible:outline-offset-[-2px] sm:scroll-px-8 sm:px-8 lg:cursor-grab lg:active:cursor-grabbing min-[88rem]:scroll-px-[calc((100vw_-_88rem)/2_+_2rem)] min-[88rem]:px-[calc((100vw_-_88rem)/2_+_2rem)]"
      >
        {ages.map((card, i) => (
          <li key={card.slug} className="flex-none snap-start">
            <AgePanel card={card} index={i} />
          </li>
        ))}
        {/* trailing spacer so the last panel can snap flush */}
        <li aria-hidden="true" className="w-px flex-none" />
      </ul>

      <div className={`${container} mt-8 flex items-center justify-between gap-6`}>
        <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-bone/50 uppercase">
          <span className="lg:hidden">Swipe</span>
          <span className="hidden lg:inline">Drag or scroll</span> · {ages.length} {ages.length === 1 ? 'stage' : 'stages'}
        </p>
        <div className="flex gap-3 lg:hidden">
          <RailButton dir={-1} onClick={() => step(-1)} />
          <RailButton dir={1} onClick={() => step(1)} />
        </div>
      </div>
    </section>
  )
}

function AgePanel({ card, index }: { card: AgeMinistry; index: number }) {
  const bloom = useCenterBloom<HTMLDivElement>()
  const [failed, setFailed] = useState(false)
  const label = card.ageLabel
  const isAges = label.startsWith('Ages ')
  const numeral = isAges ? label.slice(5) : label

  return (
    <article
      aria-labelledby={`age-${card.slug}`}
      className="group relative isolate flex h-[32rem] w-[78vw] max-w-[22rem] flex-col justify-between overflow-hidden sm:h-[36rem] sm:w-[22rem] lg:h-[38rem] lg:w-[24rem] lg:max-w-none"
    >
      {/* Ground: textured gradient under a duotone photo */}
      <div
        ref={bloom}
        aria-hidden="true"
        className="duotone absolute inset-0 -z-10 overflow-hidden"
        style={{ background: grounds[index % grounds.length] }}
      >
        {!failed && card.photo && (
          <img
            src={card.photo}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
          />
        )}
      </div>
      <WaveMark
        className="pointer-events-none absolute -right-[30%] top-[38%] -z-10 h-auto w-[150%] text-bone/[0.07] transition-transform duration-[1600ms] ease-current group-hover:-translate-x-6 motion-reduce:transition-none"
        strokeWidth={3}
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-abyss via-abyss/40 to-abyss/20"
      />

      {/* Top: the age band, shouted */}
      <div className="p-6 pt-7">
        <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-bone/70 uppercase">
          {String(index + 1).padStart(2, '0')} · {isAges ? 'Ages' : 'For'}
        </p>
        <p
          aria-hidden="true"
          className={`mt-2 font-shout font-black uppercase leading-[0.8] tracking-[-0.02em] text-bone tabular-nums ${
            isAges ? 'text-[clamp(5.5rem,24vw,8.5rem)]' : 'text-[clamp(3.5rem,15vw,5rem)]'
          }`}
        >
          {numeral}
        </p>
      </div>

      {/* Bottom: name + line */}
      <div className="p-6 pb-7">
        <span
          aria-hidden="true"
          className="mb-5 block h-[3px] w-10 origin-left bg-ember transition-transform duration-[700ms] ease-current group-hover:scale-x-[2.4] motion-reduce:transition-none"
        />
        <h3 id={`age-${card.slug}`} className="font-shout text-[2.4rem] font-extrabold uppercase leading-[0.9]">
          {card.title}
          <span className="sr-only"> — {label}</span>
        </h3>
        <p className="mt-3 max-w-[30ch] font-whisper text-[1.08rem] italic leading-snug text-bone/85">
          {card.body}
        </p>
      </div>
    </article>
  )
}

function RailButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? 'Next life stages' : 'Previous life stages'}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors duration-[400ms] ease-current hover:border-sky hover:text-sky"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === 1 ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 6l-6 6 6 6" />}
      </svg>
    </button>
  )
}
