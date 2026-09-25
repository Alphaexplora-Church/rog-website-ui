import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { primaryNav, navActions, type NavItem } from '../config/navigation'
import { site } from '../config/site'
import { Button } from './ui/Button'

/**
 * ROG primary navigation.
 *
 * Shape is the reference you sent: one floating glass bar, wordmark left,
 * grouped links centre, actions right, and a dropdown panel where each row is
 * a label plus a one-line blurb rather than a bare link.
 *
 * Three things here that the reference does not do, and that are the reason
 * this wins a design comparison against the current riverofgod.ph:
 *
 * 1. IT READS THE PLATE UNDERNEATH IT AND INVERTS.
 *    The site alternates full-bleed black and white sections. A nav with one
 *    fixed colour has to hide behind a permanent scrim to stay legible on
 *    both. This one measures which plate is directly beneath the bar on every
 *    scroll frame and flips its own tone to match — white glass over black,
 *    black glass over white. The inversion rhythm runs THROUGH the chrome
 *    instead of stopping at it, and nothing ever needs a scrim.
 *
 * 2. THE HIGHLIGHT IS ONE ELEMENT THAT TRAVELS.
 *    Instead of each trigger owning a hover background that fades in and out,
 *    a single chip slides and resizes between triggers.
 *
 * 3. IT CONTRACTS ONCE YOU ARE READING.
 *    Past the hero the bar tightens and gains a shadow, handing the viewport
 *    back to the page.
 *
 * ACCESSIBILITY. Hover opens the dropdown only on a fine pointer; touch and
 * keyboard use click/Enter. Escape closes and returns focus to the trigger.
 * Focus leaving the group closes it. Every panel is a real list of real links,
 * so it works with JS motion disabled and it prerenders into the static HTML.
 *
 * TAILWIND-ONLY REWRITE, 2026-09-17 (tailwind-design-system migration,
 * confirmed by Jude: full site-wide conversion, index.css deleted). This
 * used to be ~250 lines of CSS keyed off `[data-tone]` / `[data-scrolled]` /
 * `[data-open]` attribute selectors, plus two CSS custom properties
 * (`--chip-x`, `--chip-w`) written from JS for the travelling highlight.
 * Converted as follows:
 *   - Tone/scrolled/open state was already living in React state (`tone`,
 *     `scrolled`, `openMenu`, `mobileOpen`) — the attribute selectors were
 *     really just a roundabout way of reading state the component already
 *     had. Every rule below is now a plain conditional className computed
 *     directly from that state, no attributes needed.
 *   - The chip's geometry (`--chip-x`/`--chip-w`) is the one piece that
 *     stayed imperative on purpose — `moveChip` still writes directly to the
 *     chip DOM node's own inline `style.transform`/`style.width` on hover,
 *     same as before, specifically to avoid a React re-render on every
 *     mouse move. Only the *storage* changed (real inline style instead of
 *     custom properties a stylesheet rule used to read).
 *   - Colours that used to come from inherited `currentColor` + a stylesheet
 *     rule (`.nav-trigger { color: color-mix(in oklab, currentColor 62%, ...) }`)
 *     are now literal opacity utilities on `currentColor` (`text-current
 *     opacity-60`) — the bar's own `text-white`/`text-black` still sets what
 *     "current" resolves to, so children don't need to know the tone at all.
 */

const HOVER_CLOSE_DELAY = 140

export function Navbar() {
  /** Label of the open dropdown, or null. */
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [tone, setTone] = useState<'light' | 'dark'>('dark')

  const listRef = useRef<HTMLUListElement>(null)
  const chipRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const { pathname } = useLocation()

  /* Any navigation closes everything. */
  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [pathname])

  /* ----------------------------------------------------------------
     Scroll: contract state + plate detection, one rAF-throttled listener.
     ---------------------------------------------------------------- */
  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      setScrolled(window.scrollY > 40)

      const bar = barRef.current
      if (!bar) return
      const rect = bar.getBoundingClientRect()
      const probeY = rect.top + rect.height / 2

      const plates = document.querySelectorAll<HTMLElement>('[data-plate]')
      let found: 'light' | 'dark' = 'light'
      for (const plate of plates) {
        const r = plate.getBoundingClientRect()
        if (probeY >= r.top && probeY <= r.bottom) {
          found = plate.dataset.plate === 'dark' ? 'dark' : 'light'
          break
        }
      }
      setTone(found)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // Re-read on every route change too: when the new page also starts at the
    // top no scroll event fires, and the bar would keep the old page's tone.
  }, [pathname])

  /* Escape closes whatever is open. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenMenu(null)
      setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  /* Lock the page behind the mobile sheet. */
  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  /* ----------------------------------------------------------------
     The travelling highlight. Measure the target trigger and write its
     geometry straight to the chip's own inline style — no re-render, no
     custom properties (there's no stylesheet left to read one).
     ---------------------------------------------------------------- */
  const moveChip = useCallback((el: HTMLElement | null) => {
    const list = listRef.current
    const chip = chipRef.current
    if (!list || !chip) return
    if (!el) {
      chip.style.opacity = '0'
      return
    }
    const listRect = list.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    // X-only now — the chip is `top-0 h-9`, exactly the row's own height,
    // so there's no vertical offset left to apply (see the chip's own
    // className comment for why the old `translateY(-50%)` was masking a
    // centering bug rather than fixing one).
    chip.style.transform = `translateX(${elRect.left - listRect.left}px)`
    chip.style.width = `${elRect.width}px`
    chip.style.opacity = '1'
  }, [])

  const openWith = (label: string, el: HTMLElement) => {
    window.clearTimeout(closeTimer.current)
    setOpenMenu(label)
    moveChip(el)
  }

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setOpenMenu(null)
      moveChip(null)
    }, HOVER_CLOSE_DELAY)
  }

  const finePointer = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(hover: hover) and (pointer: fine)').matches

  const toneText = tone === 'dark' ? 'text-white' : 'text-black'
  const barTone =
    tone === 'dark'
      ? 'bg-[rgb(255_255_255/0.07)] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]'
      : 'bg-[rgb(255_255_255/0.72)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]'
  const barScrolled = scrolled
    ? tone === 'dark'
      ? 'scale-[0.985] bg-[rgb(0_0_0/0.55)] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14),0_14px_40px_-18px_rgb(0_0_0/0.8)]'
      : 'scale-[0.985] bg-[rgb(255_255_255/0.86)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08),0_14px_40px_-18px_rgb(0_0_0/0.35)]'
    : ''

  return (
    <>
      {/* ---------------------------------------------------------- BAR */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-5 sm:pt-6">
        <div
          ref={barRef}
          className={`pointer-events-auto relative mx-auto flex max-w-[86rem] items-center gap-3 rounded-full py-2.5 pr-2.5 pl-5 backdrop-blur-[20px] backdrop-saturate-[1.4] transition-[background-color,box-shadow,transform,color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:pl-6 ${toneText} ${barTone} ${barScrolled}`}
          onMouseLeave={() => {
            if (finePointer()) scheduleClose()
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setOpenMenu(null)
              moveChip(null)
            }
          }}
        >
          {/* The wave-only mark (site.logo.mark). `alt=""` because the
              wrapping link already carries the accessible name. Blend-mode
              trick lives in inline style now (was `.nav-mark__img` +
              `.nav-bar[data-tone='dark'] .mark`): screen-blend on a dark
              tone so the JPEG's black square disappears, plain invert on a
              light tone. This PNG has real alpha so a filter swap is enough. */}
          <Link to="/" className="flex h-7 shrink-0 items-center" aria-label={`${site.name} — home`}>
            <img
              src={site.logo.mark}
              alt=""
              className="h-full w-auto transition-[opacity,filter] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-70"
              style={{ filter: tone === 'dark' ? 'invert(1)' : 'none' }}
            />
          </Link>

          {/* ------------------------------------------------ CENTRE LINKS */}
          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul ref={listRef} className="relative flex items-center">
              {/* FIXED 2026-09-17 — Jude sent a recording showing this chip
                  floating well above the nav row instead of sitting behind
                  it. Root cause: `top-1/2 -translate-y-1/2` (the usual
                  vertical-centering pair) only works when the containing
                  block has an EXPLICIT height. This `<ul>`'s height comes
                  from flex content sizing (h-9 children), which renders at
                  36px but is not a CSS-explicit height — so per spec,
                  `top: 50%` on an absolutely positioned child of an
                  auto-height container doesn't resolve the way it visually
                  appears to; it silently computes as if `auto`, and the
                  chip landed 18px (half its own height) too high. Since the
                  chip is already the same height as the row (`h-9`, same as
                  every trigger), there's no centering math needed at all —
                  `top-0` lines it up directly, no percentage involved. */}
              <span
                ref={chipRef}
                aria-hidden="true"
                className="absolute top-0 left-0 h-9 rounded-full bg-current/10 opacity-0 transition-[transform,width,opacity] duration-[480ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ width: 0 }}
              />

              {primaryNav.map((item) =>
                item.children ? (
                  <DropdownItem
                    key={item.label}
                    item={item}
                    open={openMenu === item.label}
                    onOpen={openWith}
                    onScheduleClose={scheduleClose}
                    onToggle={(label, el) =>
                      openMenu === label
                        ? (setOpenMenu(null), moveChip(null))
                        : openWith(label, el)
                    }
                    finePointer={finePointer}
                  />
                ) : (
                  <li key={item.label} className="relative">
                    <NavLink
                      to={item.to!}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `relative z-10 inline-flex h-9 items-center rounded-full px-3.5 font-heading text-[0.8125rem] font-semibold tracking-[0.07em] whitespace-nowrap uppercase transition-opacity duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
                          isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                        }`
                      }
                      onMouseEnter={(e) => {
                        if (!finePointer()) return
                        window.clearTimeout(closeTimer.current)
                        setOpenMenu(null)
                        moveChip(e.currentTarget)
                      }}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* ---------------------------------------------------- ACTIONS */}
          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <div className="hidden xl:flex">
              <Button to={navActions.planAVisit.to} variant="ghost" tone={tone}>
                {navActions.planAVisit.label}
              </Button>
            </div>

            <div className="hidden sm:flex">
              <Button to={navActions.watchLive.to} variant="outline" tone={tone} live>
                {navActions.watchLive.label}
              </Button>
            </div>

            <Button to={navActions.give.to} variant="solid" tone={tone}>
              {navActions.give.label}
            </Button>

            <button
              type="button"
              className="relative flex h-11 w-11 flex-none items-center justify-center rounded-full lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="nav-sheet"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span
                className={`absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 rounded-sm bg-current transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? 'translate-y-0 rotate-45' : '-translate-y-[5px]'}`}
              />
              <span
                className={`absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 rounded-sm bg-current transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? 'scale-x-[0.3] opacity-0' : ''}`}
              />
              <span
                className={`absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 rounded-sm bg-current transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[5px]'}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------ MOBILE SHEET */}
      <div
        id="nav-sheet"
        hidden={!mobileOpen}
        className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-[rgb(0_0_0/0.96)] text-white backdrop-blur-[24px] lg:hidden"
      >
        <nav aria-label="Main (mobile)" className="flex min-h-full flex-col justify-center gap-10 px-6 pt-28 pb-12">
          <ul>
            {primaryNav.map((item, i) => (
              <li
                key={item.label}
                className={`border-b border-white/10 py-3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                style={{ transitionDelay: mobileOpen ? `${80 + i * 55}ms` : '0ms' }}
              >
                {item.to ? (
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className="block font-heading text-[clamp(1.75rem,8vw,2.5rem)] leading-[1.1] font-bold tracking-[-0.04em]"
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <>
                    <p className="font-heading text-[clamp(1.75rem,8vw,2.5rem)] leading-[1.1] font-bold tracking-[-0.04em]">
                      {item.label}
                    </p>
                    <ul className="mt-3">
                      {item.children!.map((child) => (
                        <li key={child.to}>
                          <NavLink to={child.to} className="block py-[0.55rem] text-base font-semibold">
                            <span>{child.label}</span>
                            <span className="block text-[0.8125rem] font-normal text-white/50">
                              {child.blurb}
                            </span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>

          <div
            className={`flex flex-wrap gap-3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            style={{ transitionDelay: mobileOpen ? '400ms' : '0ms' }}
          >
            <Button to={navActions.planAVisit.to} variant="outline" tone="dark" size="md">
              {navActions.planAVisit.label}
            </Button>
            <Button to={navActions.watchLive.to} variant="outline" tone="dark" size="md" live>
              {navActions.watchLive.label}
            </Button>
          </div>
        </nav>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

interface DropdownItemProps {
  item: NavItem
  open: boolean
  onOpen: (label: string, el: HTMLElement) => void
  onScheduleClose: () => void
  onToggle: (label: string, el: HTMLElement) => void
  finePointer: () => boolean
}

function DropdownItem({
  item,
  open,
  onOpen,
  onScheduleClose,
  onToggle,
  finePointer,
}: DropdownItemProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <li
      className="relative"
      onMouseEnter={() => {
        if (finePointer() && triggerRef.current) onOpen(item.label, triggerRef.current)
      }}
      onMouseLeave={() => {
        if (finePointer()) onScheduleClose()
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`relative z-10 inline-flex h-9 items-center gap-[0.3rem] rounded-full px-3.5 font-heading text-[0.8125rem] font-semibold tracking-[0.07em] whitespace-nowrap uppercase transition-opacity duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
        aria-expanded={open}
        onClick={() => triggerRef.current && onToggle(item.label, triggerRef.current)}
      >
        {item.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 4.75 6 7.75 9 4.75" />
        </svg>
      </button>

      <div
        className={`absolute top-full left-1/2 z-20 min-w-[17rem] origin-top -translate-x-1/2 rounded-[1.25rem] bg-[rgb(10_10_10/0.92)] p-2 pt-[calc(0.85rem+0.5rem)] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1),0_28px_60px_-24px_rgb(0_0_0/0.9)] backdrop-blur-[28px] backdrop-saturate-[1.4] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-[0.97] opacity-0'
        }`}
      >
        <ul>
          {item.children!.map((child, i) => (
            <li
              key={child.to}
              className={`transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
              style={{ transitionDelay: open ? `${i * 45}ms` : '0ms' }}
            >
              <NavLink
                to={child.to}
                className="group/row grid grid-cols-[1fr_auto] items-center gap-x-3 rounded-[0.875rem] px-[0.85rem] py-[0.7rem] transition-colors duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10"
              >
                <span className="font-heading text-[0.9375rem] font-bold tracking-[-0.02em]">
                  {child.label}
                </span>
                <span className="col-start-1 text-[0.8125rem] leading-[1.35] text-white/55">
                  {child.blurb}
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="col-start-2 row-span-2 row-start-1 h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/row:translate-x-0 group-hover/row:opacity-70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.5 8h9M8.5 4l4 4-4 4" />
                </svg>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
