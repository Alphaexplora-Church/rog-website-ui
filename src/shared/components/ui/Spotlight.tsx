import { useCallback, type PointerEvent } from 'react'

/**
 * A soft teal glow that follows the mouse across a card (2026-09-24,
 * Events tab motion pass — Jude: "lagyan mo ng animation… hovering
 * effects… para hindi siya mukang pale and boring").
 *
 * Usage: spread `useSpotlight()` onto a `group relative overflow-hidden`
 * element and drop `<Spotlight />` inside it.
 *
 * The pointer position is written straight onto the element as two CSS
 * custom properties — no React state, so moving the mouse never
 * re-renders anything. Mouse only: on touch there is no hover, and a glow
 * that jumps to wherever a finger landed reads as a glitch.
 *
 * REVAMP 2026-09-25: the glow is the `shallows` token (var(--color-shallows)) on the
 * shared `ease-current` curve. Props unchanged.
 *
 * Tailwind v4's `group-hover:` only applies under `@media (hover: hover)`,
 * so the glow never gets stuck "on" after a tap on a phone either.
 */
export function useSpotlight<T extends HTMLElement>() {
  const onPointerMove = useCallback((e: PointerEvent<T>) => {
    if (e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
  }, [])
  return { onPointerMove }
}

export function Spotlight({ size = 420, strength = 0.14 }: { size?: number; strength?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 ease-current group-hover:opacity-100 motion-reduce:hidden"
      style={{
        background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(127 194 184 / ${strength}), transparent 65%)`,
      }}
    />
  )
}
