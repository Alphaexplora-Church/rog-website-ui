import { useEffect, useRef } from 'react'

/**
 * Writes an element's scroll progress (0 → 1 while it passes through the
 * viewport) to a callback on every animation frame it changes. No React
 * state — callers write straight to a style, so scrolling never re-renders.
 * Used by the "Current Fill" river line (ROG 11 §5).
 */
export function useScrollProgress<T extends HTMLElement>(onProgress: (p: number) => void) {
  const ref = useRef<T | null>(null)
  const cb = useRef(onProgress)
  useEffect(() => {
    cb.current = onProgress
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cb.current(1)
      return
    }
    let frame = 0
    const read = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = (vh * 0.6 - r.top) / Math.max(1, r.height)
      cb.current(Math.min(1, Math.max(0, p)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return ref
}
