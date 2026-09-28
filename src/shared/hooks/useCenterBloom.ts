import { useEffect, useRef } from 'react'

/**
 * Touch fallback for Colour Bloom (ROG 11 §5): on devices without hover, set
 * `data-bloom="true"` while the element sits in the middle band of the
 * viewport. On hover-capable devices this does nothing — hover handles it.
 */
export function useCenterBloom<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(hover: hover)').matches) return
    const io = new IntersectionObserver(
      ([entry]) => el.setAttribute('data-bloom', String(entry.isIntersecting)),
      { rootMargin: '-38% 0px -38% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [enabled])
  return ref
}
