import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { primaryNav, navActions, type NavItem } from '../config/navigation'
import { site } from '../config/site'
import { Button } from './ui/Button'
import { WaveMark } from './ui/River'

/**
 * Floating pill navigation. REVAMP 2026-09-25 (ROG 11 "Textured Editorial").
 *
 * Kept from the previous build (all behaviour, none of the look):
 *   - plate detection: the bar reads `data-plate` under its own centre line
 *     and flips its ink for bone (light) sections
 *   - hover-intent dropdowns with a travelling highlight chip, click/tap
 *     toggles, Escape closes, focus leaving the bar closes
 *   - mobile sheet locks page scroll
 *
 * New: abyss glass + hairline (no shadows), Hanken Grotesk caps, ember
 * primary action ("Commune Together" — the one glowing thing in the bar),
 * dropdown panels set in the shout/whisper pair, and a full-screen mobile
 * sheet in Big Shoulders with a wave watermark. The hamburger's three lines
 * morph into ✕.
 */

const HOVER_CLOSE_DELAY = 140

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [tone, setTone] = useState<'light' | 'dark'>('dark')

  const listRef = useRef<HTMLUListElement>(null)
  const chipRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      setScrolled(window.scrollY > 40)
      const bar = barRef.current
      if (!bar) return
      const rect = bar.getBoundingClientRect()
      const probeY = rect.top + rect.height / 2
      let found: 'light' | 'dark' = 'dark'
      for (const plate of document.querySelectorAll<HTMLElement>('[data-plate]')) {
        const r = plate.getBoundingClientRect()
        if (probeY >= r.top && probeY <= r.bottom) {
          found = plate.dataset.plate === 'light' ? 'light' : 'dark'
          break
        }
      }
      setTone(found)
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
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenMenu(null)
      setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

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
    typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches

  const sheetOpenTone = mobileOpen ? 'dark' : tone
  const ink = sheetOpenTone === 'dark' ? 'text-bone' : 'text-abyss'
  const glass =
    sheetOpenTone === 'dark'
      ? scrolled || mobileOpen
        ? 'bg-abyss/80 border-bone/15'
        : 'bg-abyss/35 border-bone/12'
      : 'bg-bone/85 border-abyss/10'

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
        <div
          ref={barRef}
          className={`pointer-events-auto relative mx-auto flex max-w-[88rem] items-center gap-3 rounded-full border py-2 pr-2 pl-5 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,color,transform] duration-500 ease-current sm:pl-6 ${ink} ${glass} ${scrolled ? 'scale-[0.99]' : ''}`}
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
          {/* ROG's stacked "RIVER OF GOD" lockup (2026-09-28, Jude — replaces
              the wave mark + typed name). A mask in currentColor, so it is
              bone on dark plates and abyss on light ones with the rest of the
              bar's ink; see site.logo.nav. */}
          <Link to="/" className="group flex h-9 shrink-0 items-center sm:h-10" aria-label={`${site.name} — home`}>
            <span
              aria-hidden="true"
              className="block aspect-[439/240] h-full bg-current transition-opacity duration-[400ms] ease-current group-hover:opacity-70"
              style={{
                WebkitMask: `url('${site.logo.nav}') center / contain no-repeat`,
                mask: `url('${site.logo.nav}') center / contain no-repeat`,
              }}
            />
          </Link>

          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul ref={listRef} className="relative flex items-center">
              <span
                ref={chipRef}
                aria-hidden="true"
                className="absolute top-0 left-0 h-9 rounded-full bg-current/10 opacity-0 transition-[transform,width,opacity] duration-[480ms] ease-current"
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
                      openMenu === label ? (setOpenMenu(null), moveChip(null)) : openWith(label, el)
                    }
                    finePointer={finePointer}
                  />
                ) : (
                  <li key={item.label} className="relative">
                    <NavLink
                      to={item.to!}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `relative z-10 inline-flex h-9 items-center rounded-full px-3.5 text-[0.78rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-opacity duration-[400ms] ease-current ${
                          isActive ? 'opacity-100' : 'opacity-65 hover:opacity-100'
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

          <div className="ml-auto flex items-center gap-2 lg:ml-3">
            <div className="hidden md:flex">
              <Button to={navActions.watchLive.to} variant="outline" size="sm" tone={sheetOpenTone} live>
                {navActions.watchLive.label}
              </Button>
            </div>
            <div className="hidden xl:flex">
              <Button to={navActions.give.to} variant="outline" size="sm" tone={sheetOpenTone}>
                {navActions.give.label}
              </Button>
            </div>
            <Button to={navActions.planAVisit.to} variant="ember" size="sm">
              {navActions.planAVisit.label}
            </Button>

            <button
              type="button"
              className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="nav-sheet"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`absolute left-1/2 h-[1.5px] w-5 -translate-x-1/2 rounded-full bg-current transition-[transform,opacity] duration-[400ms] ease-current ${
                    i === 0
                      ? mobileOpen
                        ? 'rotate-45'
                        : '-translate-y-[6px]'
                      : i === 1
                        ? mobileOpen
                          ? 'scale-x-0 opacity-0'
                          : 'w-3.5 translate-x-[-35%]'
                        : mobileOpen
                          ? '-rotate-45'
                          : 'translate-y-[6px]'
                  }`}
                />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="nav-sheet"
        hidden={!mobileOpen}
        className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-abyss text-bone lg:hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[20%] blur-[70px] [background-image:radial-gradient(ellipse_50%_40%_at_10%_90%,color-mix(in_srgb,var(--color-river)_60%,transparent),transparent_70%)]" />
          <WaveMark className="absolute -right-24 bottom-16 h-auto w-[140vw] text-bone/[0.05]" strokeWidth={3} />
        </div>
        <nav aria-label="Main (mobile)" className="relative flex min-h-full flex-col gap-10 px-5 pt-28 pb-12">
          <ul>
            {primaryNav.map((item, i) => (
              <li
                key={item.label}
                className={`border-b border-bone/12 py-4 transition-[opacity,transform] duration-700 ease-tide ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                style={{ transitionDelay: mobileOpen ? `${80 + i * 60}ms` : '0ms' }}
              >
                {item.to ? (
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className="block font-shout text-[clamp(2.5rem,12vw,3.5rem)] leading-none font-extrabold uppercase"
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <>
                    <p className="font-shout text-[clamp(2.5rem,12vw,3.5rem)] leading-none font-extrabold uppercase">
                      {item.label}
                    </p>
                    <ul className="mt-3 grid gap-1">
                      {item.children!.map((child) => (
                        <li key={child.to}>
                          <NavLink to={child.to} className="flex items-baseline justify-between gap-4 py-1.5">
                            <span className="text-base font-semibold">{child.label}</span>
                            <span className="text-right font-whisper text-sm italic text-bone/55">{child.blurb}</span>
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
            className={`flex flex-wrap gap-3 transition-[opacity,transform] duration-700 ease-tide ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            style={{ transitionDelay: mobileOpen ? '380ms' : '0ms' }}
          >
            <Button to={navActions.watchLive.to} variant="outline" live>
              {navActions.watchLive.label}
            </Button>
            <Button to={navActions.give.to} variant="outline">
              {navActions.give.label}
            </Button>
          </div>
        </nav>
      </div>
    </>
  )
}

interface DropdownItemProps {
  item: NavItem
  open: boolean
  onOpen: (label: string, el: HTMLElement) => void
  onScheduleClose: () => void
  onToggle: (label: string, el: HTMLElement) => void
  finePointer: () => boolean
}

function DropdownItem({ item, open, onOpen, onScheduleClose, onToggle, finePointer }: DropdownItemProps) {
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
        className={`relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.78rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-opacity duration-[400ms] ease-current ${open ? 'opacity-100' : 'opacity-65 hover:opacity-100'}`}
        aria-expanded={open}
        onClick={() => triggerRef.current && onToggle(item.label, triggerRef.current)}
      >
        {item.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-[400ms] ease-current ${open ? 'rotate-180' : ''}`}
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
        className={`absolute top-full left-1/2 z-20 min-w-[19rem] origin-top -translate-x-1/2 pt-3 transition-[opacity,transform] duration-300 ease-current ${
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-3xl border border-bone/12 bg-abyss/95 p-2 text-bone backdrop-blur-xl">
          <ul>
            {item.children!.map((child, i) => (
              <li
                key={child.to}
                className={`transition-[opacity,transform] duration-[420ms] ease-current ${open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
              >
                <NavLink
                  to={child.to}
                  className={({ isActive }) =>
                    `group/item flex items-center justify-between gap-6 rounded-2xl px-4 py-3 transition-colors duration-300 hover:bg-bone/[0.06] ${isActive ? 'bg-bone/[0.06]' : ''}`
                  }
                >
                  <span>
                    <span className="block font-shout text-xl font-bold uppercase leading-tight tracking-[0.01em]">
                      {child.label}
                    </span>
                    <span className="block font-whisper text-sm italic text-bone/60">{child.blurb}</span>
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 flex-none -translate-x-1 text-ember opacity-0 transition-[opacity,transform] duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}
