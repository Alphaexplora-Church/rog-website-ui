import { useRef, useState, type KeyboardEvent } from 'react'
import { coreValues, type CoreValue } from '../../../shared/data/coreValues'
import { Reveal, SectionHead, WaveMark } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * About — Core Values. REVAMP 2026-09-25: the page's one interactive
 * poster wall, built to feel like ROG's own "Core Values" slides (tinted
 * photo collage, huge white condensed word, small tagline, corner icon,
 * "River of God / Core Values" label) — but you can play it.
 *
 * DATA: `shared/data/coreValues.ts` (single-sourced 2026-09-25 from the
 * slide deck Jude sent). `tagline` is the slide's own line, verbatim;
 * `detail` is web copy flagged in that file. "Discipleship" here is the
 * CORE VALUE slide; the 5-stage PROCESS is `DiscipleshipSection` / the
 * /discipleship page — same word, different content.
 *
 * SHAPE
 *  - Desktop: a value rail (tabs, vertical) beside one big poster panel.
 *    The selected value takes over the panel: its slide colour floods the
 *    ground, its photo strip sits at the right at roughly its native size
 *    (the crops are small, ~220–340 × 520–570px, so they're shown modest,
 *    with grain, never stretched full-bleed), and its word is set giant
 *    across it. All four panels are stacked and cross-fade, so switching
 *    feels like one poster morphing into the next rather than a re-render.
 *  - Mobile: a swipeable scroll-snap row of four tall poster cards with
 *    everything visible — no hidden state on small screens.
 *
 * COLOUR — a scoped exception to the one-accent rule: each value carries
 * its identity colour from ROG's real material (red / violet / blue /
 * orange), used only inside its own poster, via inline `style` (Tailwind
 * can't see data-driven colours). Site chrome — the active marker, focus
 * rings — stays ember/bone.
 *
 * A11Y: WAI-ARIA tabs (arrow keys, Home/End); inactive panels are `inert`
 * and aria-hidden. Selection is click/keyboard, never hover-only.
 */
export function CoreValuesSection() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = coreValues.length - 1
    let next = -1
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next < 0) return
    e.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section
      id="core-values"
      data-plate="dark"
      aria-labelledby="core-values-heading"
      className="relative scroll-mt-32 overflow-hidden bg-abyss py-24 text-bone sm:py-32"
    >
      {/* the selected value's colour leaks into the ground, faintly */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-700 ease-current"
        style={{
          background: `radial-gradient(ellipse 50% 45% at 80% 55%, ${coreValues[active].color}40, transparent 70%)`,
        }}
      />
      <div className={`${container} relative`}>
        <SectionHead
          id="core-values-heading"
          eyebrow="What guides us"
          title={
            <>
              Our Core
              <br />
              Values
            </>
          }
        />

        {/* ── Desktop: rail + morphing poster ── */}
        <Reveal className="mt-16 hidden gap-10 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] xl:gap-14">
          <div role="tablist" aria-label="Core values" aria-orientation="vertical" className="flex flex-col border-t border-bone/12">
            {coreValues.map((v, i) => {
              const on = i === active
              return (
                <button
                  key={v.key}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`value-tab-${v.key}`}
                  aria-selected={on}
                  aria-controls={`value-panel-${v.key}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKey}
                  className="group relative flex items-start gap-5 border-b border-bone/12 py-6 pl-5 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-0 bottom-0 left-0 w-[3px] origin-top transition-transform duration-500 ease-current ${on ? 'scale-y-100' : 'scale-y-0'}`}
                    style={{ background: v.color }}
                  />
                  <span className="pt-1.5 font-shout text-sm tabular-nums text-bone/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-shout text-[2.4rem] font-extrabold uppercase leading-[0.9] transition-[color,transform] duration-500 ease-current ${
                        on ? 'translate-x-1 text-bone' : 'text-bone/50 group-hover:text-bone/80'
                      }`}
                    >
                      {v.title}
                    </span>
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-current motion-reduce:transition-none ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <span className="min-h-0 overflow-hidden">
                        <span className="block pt-2 font-whisper text-[1.05rem] italic leading-snug text-bone/75">
                          {v.tagline}
                        </span>
                      </span>
                    </span>
                  </span>
                  <ValueIcon
                    name={v.icon}
                    className={`mt-1 h-6 w-6 flex-none transition-colors duration-500 ${on ? 'text-ember' : 'text-bone/35'}`}
                  />
                </button>
              )
            })}
          </div>

          <div className="grid">
            {coreValues.map((v, i) => (
              <ValuePoster
                key={v.key}
                value={v}
                on={i === active}
                panelProps={{
                  role: 'tabpanel',
                  id: `value-panel-${v.key}`,
                  'aria-labelledby': `value-tab-${v.key}`,
                }}
              />
            ))}
          </div>
        </Reveal>

        {/* ── Mobile / tablet: swipeable poster cards ── */}
        <Reveal className="-mx-4 mt-12 sm:-mx-8 lg:hidden">
          <ul
            aria-label="Core values"
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-8 sm:px-8"
          >
            {coreValues.map((v, i) => (
              <li key={v.key} className="w-[84%] flex-none snap-start sm:w-[56%]">
                <ValueCard value={v} index={i} />
              </li>
            ))}
          </ul>
          <p className="mt-4 px-4 text-[0.72rem] font-semibold tracking-[0.2em] text-bone/55 uppercase sm:px-8">
            Swipe for all {coreValues.length} values
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/** Shared slide chrome: the "River of God / Core Values" label + corner icon. */
function SlideChrome({ value }: { value: CoreValue }) {
  return (
    <div className="relative z-[3] flex items-start justify-between gap-4">
      <p className="flex items-center gap-2.5 text-[0.66rem] font-semibold leading-tight tracking-[0.24em] text-bone uppercase">
        <WaveMark className="h-3 w-8 flex-none" strokeWidth={7} />
        <span>
          River of God
          <br />
          <span className="text-bone/70">Core Values</span>
        </span>
      </p>
      <ValueIcon name={value.icon} className="h-9 w-9 flex-none text-bone sm:h-11 sm:w-11" />
    </div>
  )
}

function ValuePoster({
  value,
  on,
  panelProps,
}: {
  value: CoreValue
  on: boolean
  panelProps: { role: string; id: string; 'aria-labelledby': string }
}) {
  return (
    <article
      {...panelProps}
      aria-hidden={!on}
      inert={!on}
      className={`grain relative isolate col-start-1 row-start-1 flex min-h-[36rem] flex-col justify-between overflow-hidden p-10 transition-opacity duration-700 ease-current motion-reduce:transition-none xl:p-12 ${
        on ? 'z-[1] opacity-100' : 'z-0 opacity-0'
      }`}
      style={{ background: value.color }}
    >
      {/* photo strip, near its native size — a second, faded copy behind
          it builds the slide's collage without stretching the crop */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 flex">
        <img
          src={value.image}
          alt=""
          loading="lazy"
          className="h-full w-auto scale-x-[-1] object-cover opacity-35 mix-blend-luminosity"
        />
        <img
          src={value.image}
          alt=""
          loading="lazy"
          className={`h-full w-auto object-cover transition-transform duration-[1400ms] ease-tide motion-reduce:transition-none ${on ? 'scale-100' : 'scale-[1.08]'}`}
        />
      </div>
      {/* colour wash = scrim for the white word */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${value.color} 34%, ${value.color}cc 52%, ${value.color}00 82%), linear-gradient(0deg, color-mix(in srgb, var(--color-abyss) 45%, transparent), transparent 45%)`,
        }}
      />

      <SlideChrome value={value} />

      <div className="relative z-[3]">
        <h3 className="overflow-hidden pb-[0.04em]">
          <span
            className={`block font-shout text-[clamp(5rem,8.6vw,9.5rem)] font-black uppercase leading-[0.8] tracking-[-0.01em] text-bone transition-transform duration-[1100ms] ease-tide motion-reduce:transition-none ${
              on ? 'translate-y-0' : 'translate-y-[40%]'
            }`}
          >
            {value.title}
          </span>
        </h3>
        <p className="mt-6 max-w-[30ch] font-whisper text-[1.6rem] italic leading-[1.2] text-bone">
          {value.tagline}
        </p>
        <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-bone/85">{value.detail}</p>
      </div>
    </article>
  )
}

function ValueCard({ value, index }: { value: CoreValue; index: number }) {
  return (
    <article
      aria-labelledby={`value-card-${value.key}`}
      className="grain relative isolate flex min-h-[34rem] flex-col justify-between overflow-hidden p-6"
      style={{ background: value.color }}
    >
      <img
        src={value.image}
        alt=""
        loading="lazy"
        aria-hidden="true"
        className="absolute top-0 right-0 h-[72%] w-auto max-w-[80%] object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${value.color}00 20%, ${value.color} 62%), linear-gradient(90deg, ${value.color}cc, ${value.color}00 60%)`,
        }}
      />
      <SlideChrome value={value} />
      <div className="relative z-[3]">
        <p className="font-shout text-sm tabular-nums text-bone/70">
          {String(index + 1).padStart(2, '0')} / {String(coreValues.length).padStart(2, '0')}
        </p>
        <h3
          id={`value-card-${value.key}`}
          className="mt-2 font-shout text-[clamp(3.4rem,15vw,5rem)] font-black uppercase leading-[0.82] text-bone"
        >
          {value.title}
        </h3>
        <p className="mt-4 font-whisper text-xl italic leading-snug text-bone">{value.tagline}</p>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-bone/85">{value.detail}</p>
      </div>
    </article>
  )
}

function ValueIcon({ name, className }: { name: CoreValue['icon']; className?: string }) {
  const common = {
    'aria-hidden': true as const,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  }
  switch (name) {
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 2.5c1 3 .3 4.6-1 6.2-1.6 1.9-3 3.6-3 6.3a4 4 0 0 0 8 0c1.3.9 2 2.2 2 3.5a5 5 0 0 1-10 0c0-3.5 1.8-5.6 3.4-7.6C13 8.6 13.4 6.4 12 2.5Z" />
        </svg>
      )
    case 'people':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="2.6" />
          <circle cx="16" cy="8" r="2.6" />
          <circle cx="12" cy="9.8" r="2.6" />
          <path d="M3.5 20c.6-2.8 2.4-4.5 4.5-4.5s3.9 1.7 4.5 4.5" />
          <path d="M11.5 20c.6-2.8 2.4-4.5 4.5-4.5s3.9 1.7 4.5 4.5" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.4-9.3-8.8C1.4 8 2.8 5 6 5c1.9 0 3.4 1 4.5 2.6C11.6 6 13.1 5 15 5c3.2 0 4.6 3 3.3 6.2C16 15.6 12 20 12 20Z" />
        </svg>
      )
    case 'dove':
      return (
        <svg {...common}>
          <path d="M3 12c2.5-1.5 4.8-1.2 6.2.2.8-2.3 2.8-4 5.3-4 3 0 5.5 2.2 5.5 5.5 0 .5 0 1-.1 1.4-1.6-.4-3-.1-3.9.9" />
          <path d="M9.2 12.2c-.9 3.4-3.4 5.4-6.2 6" />
          <path d="M13 14c1.3 2.7 1 5.2-1 7" />
        </svg>
      )
    default:
      return null
  }
}
