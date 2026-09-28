import { useEffect, useRef, useState } from 'react'

/**
 * About sub-nav — sticky in-page pill nav. REVAMP 2026-09-25.
 *
 * These are anchor jumps, not a tab panel: every section on the page is
 * always rendered, so a plain anchor list keeps the DOM simple and
 * keyboard/SEO friendly (original 2026-09-22 reasoning, still true).
 *
 * WHAT CHANGED
 *  - It now floats as a second glass pill directly under the fixed
 *    floating Navbar. The `top-*` offsets below are the Navbar's own
 *    footprint (pt-3 + ~58px bar on mobile, pt-5 + ~58px on sm+) plus a
 *    small gap — change them together if the Navbar's height changes.
 *  - The active pill follows the scroll (scroll-spy) instead of only
 *    changing on click, so it's truthful when someone scrolls by hand.
 *    "Our Team" stays lit across all four roster sections.
 *  - On mobile the pill row scrolls sideways (no-scrollbar, edge fade) and
 *    keeps the active pill in view.
 *
 * Pill → section mapping: "Our Team" → Apostolic Team (the first distinct
 * block after the founder bios). Core Values / Discipleship were added
 * 2026-09-25 with those sections; order matches page order.
 */
const links = [
  { label: "Founders' Story", href: '#founders-story', ids: ['founders-story'] },
  { label: 'Leadership', href: '#leadership', ids: ['leadership'] },
  {
    label: 'Our Team',
    href: '#apostolic-team',
    ids: ['apostolic-team', 'ortigas-pastors', 'serving-ministry-heads', 'life-stage-coordinators'],
  },
  { label: 'Core Values', href: '#core-values', ids: ['core-values'] },
  { label: 'Statement of Faith', href: '#statement-of-faith', ids: ['statement-of-faith'] },
  { label: 'Discipleship', href: '#discipleship-process', ids: ['discipleship-process'] },
]

export function AboutSubNav() {
  const [active, setActive] = useState(links[0].href)
  const rail = useRef<HTMLDivElement>(null)

  // Scroll-spy: whichever section crosses the upper-middle band wins.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const owner = new Map<string, string>()
    links.forEach((l) => l.ids.forEach((id) => owner.set(id, l.href)))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(owner.get(e.target.id) ?? links[0].href)
        })
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    owner.forEach((_, id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // Keep the active pill visible inside the horizontal rail (mobile).
  useEffect(() => {
    const r = rail.current
    const pill = r?.querySelector<HTMLElement>(`a[href="${active}"]`)
    if (!r || !pill) return
    const left = pill.offsetLeft - r.clientWidth / 2 + pill.clientWidth / 2
    r.scrollTo({ left, behavior: 'smooth' })
  }, [active])

  return (
    <nav
      aria-label="About page sections"
      className="pointer-events-none sticky top-[4.9rem] z-30 -mb-16 h-16 sm:top-[5.6rem]"
    >
      <div className="mx-auto max-w-[88rem] px-3 pt-2 sm:px-5">
        <div className="pointer-events-auto relative mx-auto w-fit max-w-full overflow-hidden rounded-full border border-bone/12 bg-abyss/75 backdrop-blur-xl backdrop-saturate-150">
          <div
            ref={rail}
            className="no-scrollbar flex gap-1 overflow-x-auto p-1.5 [mask-image:linear-gradient(90deg,transparent,#000_1.25rem,#000_calc(100%-1.25rem),transparent)] sm:[mask-image:none]"
          >
            {links.map((l) => {
              const on = active === l.href
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setActive(l.href)}
                  aria-current={on ? 'location' : undefined}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-[0.82rem] font-semibold whitespace-nowrap transition-colors duration-[400ms] ease-current ${
                    on
                      ? 'border-bone bg-bone text-abyss'
                      : 'border-transparent text-bone/75 hover:border-ember/60 hover:text-bone'
                  }`}
                >
                  {l.label}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
