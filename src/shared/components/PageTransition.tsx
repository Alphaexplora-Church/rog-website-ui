import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Fades each page in when the route changes.
 *
 * Added 2026-09-24 ("it doesn't feel smooth"). Before this, a route change
 * was a hard cut: the old page vanished and the new one appeared in the same
 * frame the scroll snapped to the top. Keying this wrapper by pathname makes
 * React insert a fresh element for every page, and Tailwind's `starting:`
 * variant (CSS `@starting-style`) gives that element a 300ms entrance from
 * transparent, over the abyss root background (index.css `html`, body).
 *
 * No exit animation on purpose: the old page stays up until the new route's
 * code has loaded (React Router wraps navigation in a transition), then it is
 * replaced. A true crossfade would need React Router's view transitions,
 * which only work with a data router, not the <BrowserRouter> used here.
 *
 * Reduced motion keeps the fade and drops the 6px rise. Browsers without
 * `@starting-style` simply show the page with no animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div
      key={pathname}
      className="transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] starting:opacity-0 motion-safe:starting:translate-y-1.5"
    >
      {children}
    </div>
  )
}
