import { useMemo } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

/**
 * ScrollRiver — global chrome, mounted once in App.tsx like Navbar/Footer.
 *
 * THE BRIEF (2026-09-16): Jude asked for a "morphing scroll effect" and
 * handed creative direction to me. Three directions considered:
 *
 *   1. THIS ONE — a thin wave line running the height of the page, along
 *      the left edge, that ripples as the visitor scrolls: its amplitude
 *      swells mid-page and settles again near the footer. Ties to the one
 *      thing this site is actually named after (`site.motto`: "We come
 *      alive in the River") instead of a generic scroll gimmick bolted on
 *      top of an unrelated design.
 *   2. A wave-shaped divider replacing the flat hairline (`bg-line` +
 *      `gap-px`) between every plate-dark/plate-light section, redrawn per
 *      scroll position within that section. Rejected: touches every
 *      section file — six separate divider redraws, six more places to
 *      get wrong sight-unseen. This session has no live browser; every
 *      visual bug so far (the footer logo's cascade-layer issue, the
 *      WelcomeBanner photo mismatch) was only caught after Jude sent a
 *      screen recording. Six simultaneous new surfaces was the wrong bet.
 *   3. The nav wordmark morphing from the wave glyph into a filled dot as
 *      scroll nears 100%, as a literal progress read. Rejected: the nav
 *      mark already carries three treatments (mix-blend-mode on `.mark`,
 *      filter-invert on `.nav-mark__img`, the tone-detection swap) — a
 *      fourth scroll-driven state on that same element is exactly the kind
 *      of interaction that produced this session's blend-mode-ancestor and
 *      cascade-layer bugs.
 *
 * (1) won: smallest surface area (one new file, one mount point, zero
 * existing sections touched), and it's the one idea that's actually
 * *about* something rather than motion for its own sake.
 *
 * WHY framer-motion, NOT A NEW LIBRARY: it was already sitting in
 * package.json (`framer-motion@^13.2.0`, installed, unused — nothing in
 * `src/` imported it before this file). Using it is a zero-cost addition
 * to the shipped bundle, not a new one. `useScroll` / `useTransform` /
 * `useSpring` write the SVG `d` attribute directly through framer's own
 * scheduler, batched to the animation frame, outside React's render cycle
 * — a `useState` + scroll-listener version would re-render this component
 * on every scroll pixel instead.
 *
 * WHY A FIXED COLOUR, NOT mix-blend-mode: a blend mode would be the
 * tidier answer — one colour reading correctly on both plate-dark and
 * plate-light without per-section logic — but this project already lost
 * real time twice to that exact bug family (`.mark`'s blend-mode silently
 * breaking under an isolating ancestor; unlayered CSS beating a Tailwind
 * utility on the footer logo), both invisible until a screen recording
 * caught them. `--color-river-blue` at low opacity reads clearly on both
 * a black and a white plate at this width without needing a blend mode.
 *
 * MOBILE: stays a vertical strip rather than switching to a horizontal
 * one pinned to the top edge — that spot already belongs to Navbar
 * (`fixed inset-x-0 top-0 z-50`), and duplicating that axis felt like
 * competing with it rather than sitting alongside it. Fixed at 16px wide
 * (`w-4`) so it always sits inside the `px-6` (24px) container padding
 * every section already uses — it never overlaps real content at any
 * breakpoint, so there's nothing extra to do for mobile beyond that.
 * `z-10`: above ordinary section content, comfortably below the nav
 * dropdown panel (`z-20`) and the mobile nav sheet (`z-40`).
 *
 * REDUCED MOTION: `useReducedMotion()` freezes the wave at a static,
 * gentle curve — still visible, just not scroll-linked. This site's
 * standing rule (index.css's REDUCED MOTION block) is that reduced motion
 * means "arrives immediately," never "doesn't arrive."
 *
 * `pointer-events-none` + `aria-hidden`: ambient decoration only, never a
 * click target, never announced.
 */

const STEPS = 32
const CYCLES = 5
const VIEWBOX_W = 16
const VIEWBOX_H = 400

function buildWavePath(phase: number, amplitude: number) {
  const points: string[] = new Array(STEPS + 1)
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS
    const y = t * VIEWBOX_H
    const x = VIEWBOX_W / 2 + Math.sin(t * Math.PI * 2 * CYCLES + phase) * amplitude
    points[i] = `${x.toFixed(1)},${y.toFixed(1)}`
  }
  return `M ${points.join(' L ')}`
}

export function ScrollRiver() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Springs the raw scroll fraction so the wave trails the scroll input
  // slightly rather than snapping 1:1 to it — reads as water, not a slider.
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  // Phase drives the continuous flow; amplitude is the actual "morph" —
  // calm at the hero, swelling through the middle of the page ("we come
  // alive"), settling again by the footer.
  const phase = useTransform(smoothProgress, [0, 1], [0, Math.PI * 2 * 4])
  const amplitude = useTransform(smoothProgress, [0, 0.5, 1], [2, 5.5, 2.5])

  const path = useTransform([phase, amplitude], (latest) => {
    const [p, a] = latest as [number, number]
    return buildWavePath(p, a)
  })

  // Reduced-motion fallback: one gentle curve, computed once, never updated.
  const staticPath = useMemo(() => buildWavePath(0, 3.5), [])

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-10 h-screen w-4"
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      preserveAspectRatio="none"
    >
      {prefersReducedMotion ? (
        <path
          d={staticPath}
          fill="none"
          stroke="var(--color-river-blue)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : (
        <motion.path
          d={path}
          fill="none"
          stroke="var(--color-river-blue)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  )
}
