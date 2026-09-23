import { Button } from '../../../shared/components/ui/Button'
import { useInView } from '../../../shared/hooks/useInView'
import {
  maskLineBase,
  maskLineHidden,
  maskLineShown,
  revealBase,
  revealDelay1,
  revealHidden,
  revealShown,
  riverGlow,
  textH2,
} from '../../../shared/styles/tokens'

/**
 * Home, section 3 — "Welcome" (Doc 8 §3), refined with Premium Image Hover UI.
 * One statement, one CTA.
 *
 * `to="/what-to-expect"` is a forward reference, not yet in navigation.ts.
 *
 * PLATE FIX + BRAND-PALETTE CORRECTION, 2026-09-18. Two bugs, one cause:
 * this section's outer wrapper is a white surround around a dark card, but
 * it carried a single `data-plate="dark"` on the OUTER `<section>` — so
 * Navbar's scroll-tone probe (Navbar.tsx, `[data-plate]` query) would read
 * "dark" for the entire section height, including the light padding above
 * and below the card, and could flip the bar to dark-glass-on-white right
 * where it's least legible. `data-plate` now sits on the card itself, which
 * is the only part of this section that's actually dark — the probe falls
 * through to its own "light" default the moment it's over bare wrapper.
 * Also: the wrapper was `#f8fafc` (a faint blue-grey) and the card was
 * `#0a0f14` (navy-black) with a sky-400 label — none of those are in the
 * black/white/one-accent system every other section now uses; swapped for
 * true white, true near-black, and the house muted-grey label colour.
 */
export function WelcomeBanner() {
  const { ref, shown } = useInView<HTMLElement>()

  return (
    <section ref={ref} aria-labelledby="welcome-heading" className="bg-white px-6 py-12 sm:py-20">
      {/*
        PREMIUM BANNER CARD
        Uses the rounded-[2rem] design language with a full-cover image
      */}
      <div
        data-plate="dark"
        className="group relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#262626] bg-[#0d0d0d] shadow-2xl"
      >

        {/* BACKGROUND IMAGE & MORPHING OVERLAY */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1511806754518-53bada35f930?auto=format&fit=crop&q=80&w=2000"
            alt="Welcome to River of God"
            className="h-full w-full object-cover opacity-30 transition-all duration-[2500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 group-hover:opacity-50"
          />
          {/* Multi-stop gradient overlay to ensure text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/90 via-[#0d0d0d]/60 to-[#0d0d0d]/90 transition-opacity duration-700 group-hover:opacity-80" />
        </div>

        {/* River Glow Ambient Mesh — this card's one accent moment */}
        <div aria-hidden="true" className={`${riverGlow} opacity-40 transition-opacity duration-1000 group-hover:opacity-70`} />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto max-w-[64rem] px-6 py-28 text-center sm:py-40">

          <p
            className={`text-xs font-bold uppercase tracking-[0.22em] text-[#a6a6a6] ${revealBase} ${shown ? revealShown : revealHidden}`}
          >
            New Here?
          </p>

          <h2
            id="welcome-heading"
            className="mx-auto mt-6 max-w-[62ch] text-balance font-heading font-bold leading-[1.05] text-white drop-shadow-lg"
            style={{ fontSize: textH2, letterSpacing: '-0.04em' }}
          >
            <span className="block overflow-hidden pb-[0.1em]">
              <span className={`${maskLineBase} ${shown ? maskLineShown : maskLineHidden}`}>
                Come as you are. We'll take it from there.
              </span>
            </span>
          </h2>

          <p
            className={`mx-auto mt-6 max-w-[50ch] text-lg text-neutral-300 drop-shadow-md ${revealBase} ${shown ? revealShown : revealHidden}`}
          >
            No dress code, no perfect answers required — just a seat that's already yours.
          </p>

          <div className={`mt-10 ${revealBase} ${revealDelay1} ${shown ? revealShown : revealHidden}`}>
            {/* Switched to 'solid' variant to make it pop against the dark glass background */}
            <Button 
              to="/what-to-expect" 
              variant="solid" 
              tone="dark" 
              size="md"
              className="shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_40px_-10px_rgba(255,255,255,0.3)]"
            >
              What to Expect
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}