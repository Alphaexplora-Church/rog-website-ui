import { useEffect, useRef, useState } from 'react'
import { useInView } from '../../../shared/hooks/useInView'
import {
  maskLineBase,
  maskLineHidden,
  maskLineShown,
  revealBase,
  revealDelay1,
  revealHidden,
  revealShown,
  textH1,
} from '../../../shared/styles/tokens'

/**
 * About, section 1 — page header.
 *
 * REDESIGNED 2026-09-17 (impeccable/ui-ux-pro-max/emil-design-eng pass).
 * The original was a centered text blob under an "About" eyebrow — exactly
 * the generic pattern these skills flag: a kicker sitting above a heading
 * (a hard ban in the craft floor — "the heading carries its own weight;
 * delete the label and let the heading speak"), everything centered with
 * no spatial asymmetry. Replaced with an editorial Swiss-grid split: the
 * headline and lede own the wide column, a compact fact list (unequal
 * width, right-aligned on desktop) carries the two numbers that actually
 * matter — when this started and how far it reached. No card, no border,
 * no icon; just type doing the work.
 *
 * THE ONE AUTHORED MOTION MOMENT for this page lives here: "477" counts up
 * from 0 the first time it scrolls into view, once, using the site's own
 * `useInView` (same failsafe-guarded observer every other section already
 * uses — nothing new to trust). This isn't decoration; a number this size
 * ("477 churches") is the single fact about ROG most worth landing with
 * weight, and a count-up is a legitimate "feedback/emphasis" animation per
 * Emil Kowalski's framework — it earns its purpose instead of being a
 * fade-up copied onto one more element. `prefers-reduced-motion` skips
 * straight to 477; nothing about the fact itself depends on the motion.
 * `data-numeric` reuses the site's existing tabular-numeral rule (index.css)
 * instead of introducing a new one.
 */
function useCountUp(target: number, shouldRun: boolean) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!shouldRun || started.current) return
    started.current = true

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setValue(target)
      return
    }

    const durationMs = 1100
    const start = performance.now()
    // Strong ease-out (same curve family as index.css's --ease-fluid) so the
    // count lands with a decisive final beat instead of trailing off limply.
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    let frame: number
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      setValue(Math.round(easeOut(t) * target))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [shouldRun, target])

  return value
}

export function AboutHero() {
  const { ref, shown } = useInView<HTMLElement>()
  const churchCount = useCountUp(477, shown)

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden bg-[#05070a] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
          [background-image:linear-gradient(160deg,#020617_0%,#0a2a52_45%,#0d3b4a_75%,#020617_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
          [background-image:radial-gradient(ellipse_60%_50%_at_20%_15%,rgb(56_189_248/0.14),transparent_60%)]"
      />

      <div className="relative z-10 mx-auto max-w-[86rem] px-6 py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.7fr_1fr] lg:items-end">
          <div>
            <h1
              id="about-hero-heading"
              className="text-balance font-heading leading-[1.05] font-bold"
              style={{ fontSize: textH1, letterSpacing: '-0.045em' }}
            >
              <span className="block overflow-hidden pb-[0.1em]">
                <span className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden}`}>
                  Who We Are.
                </span>
              </span>
            </h1>

            <p
              className={`mt-8 max-w-[62ch] text-lg text-[#a6a6a6] ${revealBase} ${shown ? revealShown : revealHidden}`}
            >
              A church that started with a handful of children and grew into a family
              scattered across hundreds of cities — still building the same way it began.
            </p>
          </div>

          <dl
            className={`grid grid-cols-2 gap-8 border-t border-[#262626] pt-8
              lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}
          >
            <div>
              <dt className="text-sm text-[#737373]">Founded</dt>
              <dd className="mt-2 font-heading text-4xl font-bold text-white tabular-nums sm:text-5xl">
                1998
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#737373]">Churches today</dt>
              <dd
                aria-label="477 churches"
                className="mt-2 font-heading text-4xl font-bold text-white tabular-nums sm:text-5xl"
              >
                {churchCount}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
