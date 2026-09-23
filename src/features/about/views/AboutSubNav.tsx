import { useState } from 'react'

/**
 * About sub-nav — 4 pill tabs matching the Figma "Who We Are" board
 * (Founders' Story / Leadership / Our Team / Statement of Faith). These
 * are anchor jumps to the sections below, not a real router/tab-panel
 * switch — the Figma design shows them as in-page navigation, and every
 * section on this page is always rendered (nothing is hidden behind a
 * tab), so a plain anchor list keeps the DOM simple and keyboard/SEO
 * friendly instead of building a fake tablist over content that's
 * already all there.
 *
 * "Leadership" and "Our Team" both point into the people sections below
 * (Leadership → Bios; Our Team → Apostolic Team, since that's the next
 * distinct block after the founder bios) — there's no single Figma anchor
 * id to mirror, so the mapping favors "first section a visitor tapping
 * that pill would expect to land on."
 */
const links = [
  { label: "Founders' Story", href: '#founders-story' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Our Team', href: '#apostolic-team' },
  { label: 'Statement of Faith', href: '#statement-of-faith' },
]

export function AboutSubNav() {
  const [active, setActive] = useState(links[0].href)

  return (
    <nav
      aria-label="About page sections"
      className="sticky top-16 z-30 border-b border-white/10 bg-[#161616]"
    >
      <div className="mx-auto flex max-w-[86rem] gap-2 overflow-x-auto px-6 py-3">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setActive(l.href)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === l.href
                ? 'bg-[#1b7a70] text-white'
                : 'bg-white/5 text-[#a6a6a6] hover:bg-white/10 hover:text-white'
            }`}
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
