import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { discipleshipStages } from '../../../shared/data/discipleship'
import { useScrollProgress } from '../../../shared/hooks/useScrollProgress'
import { Button } from '../../../shared/components/ui/Button'
import { Reveal, SectionHead } from '../../../shared/components/ui/River'
import { container } from '../../../shared/styles/tokens'

/**
 * Home, section 5 — "Five crossings" (the 5Es). NEW 2026-09-25, ROG 08 §3
 * section 6 / ROG 11 §6 Home 6.
 *
 * Full-width rows on the bone plate, one per stage, each naming its study
 * material — the Discipleship Process diagram in one glance. A vertical
 * river line fills with ember as you scroll through (Current Fill); each
 * row's small bar carries that stage's slide colour. Every row links to
 * its chapter on `/discipleship`. Data: shared/data/discipleship.ts.
 */
export function FiveCrossingsSection() {
  const fill = useRef<HTMLSpanElement>(null)
  const track = useScrollProgress<HTMLOListElement>((p) => {
    if (fill.current) fill.current.style.transform = `scaleY(${p})`
  })

  return (
    <section data-plate="light" aria-labelledby="five-crossings-heading" className="relative bg-bone py-24 text-abyss sm:py-32">
      <div className={container}>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            id="five-crossings-heading"
            tone="light"
            eyebrow="How we make disciples"
            title={
              <>
                Five
                <br />
                crossings.
              </>
            }
            lead="Encounter, evangelize, establish, equip, empower — one river, walked together."
          />
          <Button to="/discipleship" variant="solid" tone="light" arrow>
            The discipleship process
          </Button>
        </div>

        <ol ref={track} className="relative mt-16 border-t border-abyss/15 pl-8 sm:pl-12">
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-abyss/15">
            <span ref={fill} className="block h-full w-full origin-top scale-y-0 bg-ember" />
          </span>
          {discipleshipStages.map((s, i) => (
            <Reveal as="li" key={s.key} delay={i * 60} className="border-b border-abyss/15">
              <Link
                to={`/discipleship#stage-${s.key}`}
                className="group grid items-baseline gap-2 py-7 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-8"
              >
                <span className="font-shout text-lg font-bold tabular-nums text-abyss/45">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex items-center gap-5">
                  <span aria-hidden="true" className="h-8 w-1.5 flex-none transition-transform duration-500 ease-current group-hover:scale-y-150" style={{ background: s.color }} />
                  <span className="font-shout text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] font-extrabold uppercase transition-transform duration-500 ease-current group-hover:translate-x-2">
                    {s.title}
                  </span>
                </span>
                <span className="flex items-center gap-4 text-right">
                  <span className="font-whisper text-lg italic text-abyss/70">{s.materials.map((m) => m.name).join(' · ')}</span>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 flex-none text-ember-ink transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
