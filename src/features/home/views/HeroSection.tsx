import { useEffect, useState } from 'react'
import { navActions } from '../../../shared/config/navigation'
import { site } from '../../../shared/config/site'
import { Button } from '../../../shared/components/ui/Button'
import { Pill, WaveMark } from '../../../shared/components/ui/River'
import { container, heroRevealBase, heroRevealDelay1, heroRevealDelay2, heroRevealHidden, heroRevealShown } from '../../../shared/styles/tokens'

/**
 * Home, section 1 — "Poster" hero. REVAMP 2026-09-25 (ROG 11 §6).
 *
 * Built like ROG's own Sample1 graphic: liquid teal/ember texture, the
 * motto as a tall condensed shout, and the Sunday times set right on the
 * poster (ROG 08's separate service-times block moves INTO the hero, the
 * same way their Instagram posters do it).
 *
 * Layers (all decorative, aria-hidden): the texture drifting slowly →
 * abyss scrims (left for the headline, bottom for the fold) → a boiling
 * grain plate at ~8fps. Reduced motion freezes all three.
 *
 * ⚠ `hero-river.webp` is an INTERIM composite cut from the text-free
 * bands of Sample1 (ROG 11 §10 Q6). Replace with the designer's
 * original, text-free texture before launch — same path, same crop.
 *
 * "Watch Latest Service" pointed at `/sermons`, a route that never
 * existed (DESIGN.md route note); it now goes to `/media`, where the
 * latest message is the featured hero.
 */
export function HeroSection() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const sunday = site.services.filter((s) => s.day === 'Sunday')
  const lines = ['We come', 'alive in', 'the River.']

  return (
    <section
      data-plate="dark"
      aria-labelledby="hero-motto"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-abyss text-bone"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src="/assets/rog/hero-river.webp"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full animate-drift object-cover object-[60%_50%] motion-reduce:animate-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/90 via-abyss/45 to-abyss/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/20 to-abyss/50" />
        <div className="absolute -inset-[12%] animate-boil bg-[url('/assets/rog/grain.png')] bg-[length:190px] opacity-[0.22] mix-blend-overlay motion-reduce:animate-none" />
      </div>

      <div className={`${container} pb-14 pt-36 sm:pb-20`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <div className={`text-ember ${heroRevealBase} ${on ? heroRevealShown : heroRevealHidden}`}>
              <WaveMark draw className="h-7 w-20" strokeWidth={6} />
            </div>
            <h1
              id="hero-motto"
              aria-label={site.motto}
              className="mt-6 font-shout text-[clamp(4.5rem,15vw,13.5rem)] leading-[0.84] font-extrabold uppercase tracking-[-0.01em]"
            >
              {lines.map((line, i) => (
                <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.03em]">
                  <span
                    className={`block transition-transform duration-[1300ms] ease-tide motion-reduce:transition-none ${on ? 'translate-y-0' : 'translate-y-[106%] motion-reduce:translate-y-0'} ${i === 2 ? 'text-shallows' : ''}`}
                    style={{ transitionDelay: `${150 + i * 120}ms` }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <div className={`mt-10 flex flex-wrap items-center gap-4 ${heroRevealBase} ${heroRevealDelay1} ${on ? heroRevealShown : heroRevealHidden}`}>
              <Button to={navActions.planAVisit.to} variant="ember" size="lg" arrow>
                {navActions.planAVisit.label}
              </Button>
              <Button to="/media" variant="outline" size="lg">
                Watch Latest Service
              </Button>
            </div>
          </div>

          {/* Sunday times, set on the poster */}
          <div className={`${heroRevealBase} ${heroRevealDelay2} ${on ? heroRevealShown : heroRevealHidden}`}>
            <p className="font-whisper text-lg italic text-bone/80">Every Sunday at Shangri-La Plaza</p>
            <ul className="mt-4 flex gap-6 sm:gap-9">
              {sunday.map((s) => (
                <li key={s.time}>
                  <span className="block font-shout text-[clamp(2.75rem,5vw,4.25rem)] leading-none font-bold tabular-nums">
                    {s.time.replace(':00', '').replace(' ', '').toLowerCase()}
                  </span>
                  <span className="mt-1 block text-sm italic text-bone/65 lowercase">{s.language}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <span aria-hidden="true" className="h-px flex-1 bg-bone/30" />
              <Pill>sunday worship services</Pill>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
