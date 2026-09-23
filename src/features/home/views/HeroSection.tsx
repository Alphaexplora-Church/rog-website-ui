import { useEffect, useState } from 'react'
import { motion, type Easing } from 'framer-motion'
import { navActions } from '../../../shared/config/navigation'
import { site } from '../../../shared/config/site'
import { Button } from '../../../shared/components/ui/Button'
import {
  heroMarkFadeBase,
  heroMarkFadeHidden,
  heroMarkFadeShown,
  heroRevealBase,
  heroRevealDelay1,
  heroRevealHidden,
  heroRevealShown,
} from '../../../shared/styles/tokens'

/**
 * Same curve as tokens.ts's `ease` (`cubic-bezier(0.32,0.72,0,1)`), as a
 * typed cubic-bezier tuple instead of a raw CSS string — framer-motion's
 * `transition.ease` doesn't accept an arbitrary CSS string (that's what
 * `tokens.ts`'s `ease` export is for: literal Tailwind `ease-[...]` class
 * text, a different consumer with a different type). This was a real
 * pre-existing `tsc -b` failure, not something this pass introduced.
 */
const easeFluid: Easing = [0.32, 0.72, 0, 1]

/**
 * The motto's shimmer. Lives on one wrapping `motion.span` around the whole
 * line (see the MOTTO block's own comment for why one element, not three).
 *
 * RHYTHM, 2026-09-18, three follow-ups from Jude:
 *
 * 1. "make it slower or in a dramatic rhythm" — went from a flat 6s linear
 *    loop to a held-beat/sweep/held-beat/sweep-back cadence at 10s.
 * 2. "make the effects and the flow very slow like you wont notice it" —
 *    that cadence still had a visible shape (a beat you could count). Pulled
 *    the explicit `times` holds back out and stretched the duration to 80
 *    seconds one-way, `repeatType: 'mirror'` keeping the reversal smooth
 *    rather than snapping.
 * 3. "instead na parang straight line lang yung effects, make it parang
 *    gradient color, from start to end" — the actual cause: `bg-[length:
 *    200%_100%]` made the gradient's canvas TWICE the text's own width, so
 *    at any moment the text was only ever showing a narrow slice of the
 *    white→cyan→sky run — mostly one flat-ish band, which is exactly what
 *    reads as "a straight line" instead of a gradient. Shrunk the canvas to
 *    130% (barely oversized, just enough to still drift) and shrunk the
 *    sweep range to match, so the full three-stop gradient — white at "We",
 *    cyan through the middle, sky-400 by "River." — is what's actually
 *    visible across the phrase at (almost) all times, drifting only slightly
 *    rather than scrolling a narrow window through it.
 */
const shimmerText =
  'bg-gradient-to-r from-white via-cyan-300 to-sky-400 bg-[length:130%_100%] bg-clip-text text-transparent'
const shimmerSweep = { backgroundPositionX: ['30%', '-30%'] }
const shimmerTransition = {
  duration: 80,
  ease: 'easeInOut' as const,
  repeat: Infinity,
  repeatType: 'mirror' as const,
}

/**
 * Home hero — black stage, one river of light.
 *
 * BRAND-PALETTE CORRECTION, 2026-09-18. This section used to read as
 * navy/cyan-led — a `#020611` navy-black base under three full-height cyan
 * light beams and a five-stop navy/cyan mesh, per its own former doc comment
 * ("Deep Blue / Navy Base + Cyan Accents"). That inverted the brand: ROG's
 * own site and socials are black-and-white-led with navy/cyan only as an
 * accent. Rebuilt on a true `bg-black` stage — the "stage lighting" drama
 * the brief asks for now comes from two neutral white beams (light has no
 * hue backstage; colour is what a gel adds on purpose), and cyan is mostly
 * spent on one thing: the single low mesh glow. The one deliberate
 * exception is the motto line itself ("We come alive in the River.") — at
 * Jude's request the shimmer that used to sit on just "River." now sweeps
 * the whole line; it stays inside the accent budget because it's a single
 * thin sub-headline, not a section background.
 */
export function HeroSection() {
  const [entered, setEntered] = useState(false)

  /* Fire on the frame after mount so the entry transition actually plays
     instead of being collapsed into the initial paint. */
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section
      data-plate="dark"
      aria-labelledby="hero-motto"
      className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-6 pb-8 pt-[6.5rem] text-center text-white [isolation:isolate]"
    >
      {/* ---------------------------------------------------- AMBIENCE
          River-flow mesh (mono, one accent glow) → stage-light beams
          (white) → grain → vignette. All decorative, aria-hidden. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        {/* Mesh — mostly neutral drift; one dim cyan pool is the section's
            single accent, low enough to read as ambience, not a colour cast. */}
        <motion.span
          className="absolute -inset-[20%] blur-[70px]
            [background-image:radial-gradient(circle_at_50%_24%,rgb(6_182_212/0.09),transparent_45%),radial-gradient(ellipse_65%_50%_at_50%_65%,rgb(255_255_255/0.06),transparent_70%),radial-gradient(ellipse_45%_40%_at_20%_40%,rgb(255_255_255/0.05),transparent_60%),radial-gradient(ellipse_55%_45%_at_80%_30%,rgb(0_0_0/0.8),transparent_75%)]"
          animate={{ x: ['-2%', '3%', '-1.5%'], y: ['-1%', '3%', '2%'], scale: [1, 1.05, 1.02] }}
          transition={{ duration: 25, ease: easeFluid, repeat: Infinity, repeatType: 'mirror' }}
        />

        {/* Stage-light beams — plain white sweeps, the way a real spotlight
            reads before anyone drops a coloured gel in front of it. */}
        <span className="absolute inset-0 opacity-50 mix-blend-screen">
          <motion.span
            className="absolute -top-[20%] left-[16%] h-[140%] w-[34vw] origin-top blur-[50px]
              [background-image:linear-gradient(180deg,rgb(255_255_255/0.14)_0%,rgb(255_255_255/0.04)_45%,transparent_90%)]"
            animate={{ rotate: [-8, 8] }}
            transition={{ duration: 14, ease: easeFluid, repeat: Infinity, repeatType: 'mirror' }}
          />
          <motion.span
            className="absolute -top-[20%] right-[16%] h-[140%] w-[34vw] origin-top blur-[50px]
              [background-image:linear-gradient(180deg,rgb(255_255_255/0.11)_0%,rgb(255_255_255/0.03)_50%,transparent_90%)]"
            animate={{ rotate: [-7, 5] }}
            transition={{ duration: 16, ease: easeFluid, repeat: Infinity, repeatType: 'mirror', delay: 0.5 }}
          />
        </span>

        {/* Grain — very light film texture to make the lighting feel physical */}
        <span
          className="absolute -inset-[50%] opacity-[0.04] mix-blend-screen"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.5'/></svg>\")",
          }}
        />

        {/* Vignette — true-black edge fade to focus the center */}
        <span
          className="absolute inset-0
            [background-image:radial-gradient(circle_at_center,transparent_30%,#000_95%)]"
        />
      </div>

      {/* ------------------------------------------------------ CONTENT */}
      <div className="relative z-10 flex min-h-0 flex-col items-center text-center">
        
        {/* LOGO */}
        <div className="mb-6 flex justify-center">
          <img
            src={site.logo.src}
            alt={site.logo.alt}
            className={`h-auto w-[min(65vw,52vh,38rem)] drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${heroMarkFadeBase} ${entered ? heroMarkFadeShown : heroMarkFadeHidden}`}
            style={{ mixBlendMode: 'screen' }}
            width={640}
            height={640}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* MOTTO — one shimmer, one flow. Jude's follow-up: the earlier
            version put the gradient on three separate elements (one per
            text fragment); even phase-locked by sharing the same duration,
            each one was computing its OWN backgroundPositionX against its
            OWN (differently-sized) box, so the light didn't actually travel
            as a single unbroken sweep from "We" through "River." — three
            synchronized shimmers, not one flowing one.

            Fixed by moving the gradient + animation to ONE motion.span
            wrapping the entire line; the nested spans below are now plain
            layout-only (still needed for the "in the River." mobile
            line-break) and inherit `text-transparent` from the parent
            rather than carrying their own background. This relies on
            `background-clip: text`'s default `box-decoration-break: slice`
            — the browser paints the gradient across the element's full
            bounding box as if it were never broken, THEN slices that single
            image across however many visual lines the text wraps to. That's
            what makes the sweep read as continuous through the mobile
            two-line break, not just on the single-line desktop layout. */}
        <h1
          id="hero-motto"
          className="text-base font-medium tracking-[0.25em] uppercase sm:text-lg lg:text-xl"
        >
          <motion.span
            className={`${shimmerText} drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]`}
            animate={shimmerSweep}
            transition={shimmerTransition}
          >
            We come alive{' '}
            <span className="mt-1 block sm:mt-0 sm:inline">
              in the <em className="not-italic">River.</em>
            </span>
          </motion.span>
        </h1>

        {/* CTAs */}
        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-4 ${heroRevealBase} ${heroRevealDelay1} ${entered ? heroRevealShown : heroRevealHidden}`}
        >
          {/* Reads the label rather than repeating it — this button used to
              spell out "Plan a Visit" while the navbar and footer read
              `navActions.planAVisit.label`, so a rename changed three of the
              four places and left the biggest one saying the old thing. */}
          <Button to={navActions.planAVisit.to} variant="solid" tone="dark" size="md">
            {navActions.planAVisit.label}
          </Button>

          <Button
            to="/sermons"
            variant="outline"
            tone="dark"
            size="md"
            className="border-white/20 text-slate-200"
          >
            Watch Latest Service
          </Button>
        </div>
      </div>
    </section>
  )
}