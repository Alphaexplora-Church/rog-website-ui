import { useEffect, useState } from 'react'
import { site } from '../config/site'

const HOLD_MS = 1100
const EXIT_MS = 750

/**
 * The one-time curtain that plays when the site first opens — the site's
 * own "opening," not another per-section reveal (those already exist: the
 * hero's mask headline, its `data-entered` fades, the navbar's mount).
 * Mounted once at the very top of App, above even the fixed navbar, so it
 * covers everything until it rises away.
 *
 * SEQUENCE: the mark fades/scales in → a short hold → the whole curtain
 * rises off the top of the screen, the mark cross-fading out a beat ahead
 * of it so it reads as settling rather than being dragged offscreen with
 * the curtain → unmounts. Nothing underneath was ever gated behind this —
 * it's a curtain, not a loader; the page is already there and interactive
 * the moment it's revealed.
 *
 * TIMING IS DELIBERATE, NOT ARBITRARY. HOLD_MS + EXIT_MS (curtain fully gone
 * at ~1.85s after mount) must outlast HeroSection's own entrance transition
 * (its slowest piece — the mark's blur/scale/opacity — settles at ~1.48s
 * after ITS mount, see .hero-mark-fade / .hero-reveal--delay-2 in index.css)
 * with margin to spare. This only holds because Home/HeroSection is now a
 * STATIC import in App.tsx (mounts the same tick as this curtain) — when it
 * was `lazy()`, HeroSection could still be mid-mount when the curtain lifted,
 * so its fade played out in the open instead of hidden behind this overlay,
 * which is what read as a "glitch". If HOLD_MS/EXIT_MS ever shrink, or the
 * hero's own transition durations grow, re-check that this margin still
 * holds — Hero should always finish entering before the curtain rises.
 *
 * Skips rendering entirely under `prefers-reduced-motion` — checked once,
 * in JS, before the overlay ever paints, rather than mounting it and then
 * trying to instantly cancel an animation that's already under way.
 *
 * Plays on every full page load (including a hard refresh), not just a
 * visitor's first-ever visit — that's what "opening the website" asked
 * for. If that turns out to be once too often, gate the `skip` check below
 * on `sessionStorage.getItem('rog-intro-shown')` instead.
 */
export function IntroCurtain() {
  const [phase, setPhase] = useState<'idle' | 'entered' | 'leaving' | 'done'>('idle')
  const [skip] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (skip) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const raf = requestAnimationFrame(() => setPhase('entered'))
    const holdTimer = window.setTimeout(() => setPhase('leaving'), HOLD_MS)
    const doneTimer = window.setTimeout(() => setPhase('done'), HOLD_MS + EXIT_MS)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(holdTimer)
      window.clearTimeout(doneTimer)
      document.body.style.overflow = prevOverflow
    }
  }, [skip])

  /* Belt-and-suspenders release in case the cleanup above ever races a fast
     unmount — the page should never get stuck unscrollable. */
  useEffect(() => {
    if (phase === 'done') document.body.style.overflow = ''
  }, [phase])

  if (skip || phase === 'done') return null

  return (
    <div
      aria-hidden="true"
      className="intro-curtain z-[70]"
      data-entered={phase === 'entered' || phase === 'leaving'}
      data-leaving={phase === 'leaving'}
    >
      <img src={site.logo.src} alt="" className="intro-curtain__mark" />
    </div>
  )
}
