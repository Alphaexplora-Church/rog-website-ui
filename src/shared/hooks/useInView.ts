import { useEffect, useRef, useState } from 'react'

/**
 * One IntersectionObserver per element, fires once, then disconnects.
 *
 * THE FAILSAFE IS NOT OPTIONAL. Everything on this site enters at opacity 0
 * and is revealed by this hook. That means any environment where the observer
 * never fires — a hidden browser pane, a headless prerender, an old WebView, a
 * tab restored from bfcache mid-scroll — renders a completely blank page. We
 * hit exactly that during the POC and spent real time chasing it as a CSS bug.
 *
 * So: if the observer has not reported within FAILSAFE_MS and the element is
 * anywhere near the viewport, show it anyway. The animation is the enhancement;
 * the content is the product.
 */

const FAILSAFE_MS = 1200

export interface UseInViewOptions {
  /** Fraction of the element that must be visible. */
  threshold?: number
  /** Start the reveal this far before the element reaches the viewport. */
  rootMargin?: string
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  // Start as soon as the element's top edge is ~10% above the bottom of the
  // screen. The old default (15% of the element visible) meant a tall section
  // had to scroll several hundred pixels into view before it began to fade in,
  // which read as empty space and lag while scrolling. Changed 2026-09-24.
  threshold = 0,
  rootMargin = '0px 0px -10% 0px',
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No observer at all (very old browser, or a prerender shell): show now.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    let done = false

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          done = true
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)

    const failsafe = window.setTimeout(() => {
      if (done) return
      const rect = el.getBoundingClientRect()
      const withinTwoScreens = rect.top < window.innerHeight * 2
      if (withinTwoScreens) {
        setShown(true)
        observer.disconnect()
      }
    }, FAILSAFE_MS)

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  return { ref, shown }
}
