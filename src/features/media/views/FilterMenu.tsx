import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import type { FacetOption } from '../viewModels/useMediaBrowseViewModel'

/**
 * One facet dropdown in the Media filter bar ("Topic ▾", "Speaker ▾"…),
 * like Netflix's "Genres ▾" — 2026-09-27.
 *
 * The menu is portalled to <body> and positioned `fixed` from the button's
 * rect, because the filter bar scrolls sideways on phones and would clip an
 * absolutely-positioned child. On phones it becomes a bottom sheet instead.
 *
 * Keyboard: Enter/Space/↓ opens and focuses the chosen option; ↑/↓ move,
 * Home/End jump, Escape closes and returns focus to the button, Tab closes.
 * Options are `menuitemradio` so screen readers announce which is chosen.
 */
export function FilterMenu({
  label,
  plural,
  options,
  selected,
  selectedLabel,
  onSelect,
}: {
  label: string
  plural: string
  options: FacetOption[]
  selected?: string
  selectedLabel?: string
  onSelect: (slug?: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const disabled = options.length === 0 && !selected

  /* Desktop: sit under the button, kept inside the viewport. */
  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const r = btn.current?.getBoundingClientRect()
      if (!r) return
      const w = 288
      setPos({ top: r.bottom + 10, left: Math.max(16, Math.min(r.left, window.innerWidth - w - 16)) })
    }
    place()
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
    }
  }, [open])

  /* Phones: freeze the page behind the sheet so a drag on the list (or the
     scrim) can never scroll or tap the main page underneath. */
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 639px)').matches) return
    const html = document.documentElement
    const prevBody = document.body.style.overflow
    const prevHtml = html.style.overflow
    document.body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBody
      html.style.overflow = prevHtml
    }
  }, [open])

  /* Focus the chosen option (or the first) when the menu opens. */
  useEffect(() => {
    if (!open) return
    const items = menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')
    const chosen = menu.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
    ;(chosen ?? items?.[0])?.focus({ preventScroll: true })
  }, [open])

  /* Outside click closes. */
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (menu.current?.contains(t) || btn.current?.contains(t)) return
      /* The phone scrim closes on its own click (below). Closing here, on
         pointerdown, unmounted the sheet mid-tap and the finishing click
         landed on the page underneath. */
      if ((t as HTMLElement).closest?.('[data-filter-scrim]')) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  function close(refocus = true) {
    setOpen(false)
    if (refocus) btn.current?.focus()
  }

  function choose(slug?: string) {
    onSelect(slug)
    close()
  }

  function onMenuKey(e: KeyboardEvent<HTMLDivElement>) {
    const items = [...(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'Tab') {
      close(false)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const n = items.length
      items[(i + (e.key === 'ArrowDown' ? 1 : -1) + n) % n]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1]?.focus()
    }
  }

  const active = Boolean(selected)

  return (
    <>
      <button
        ref={btn}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className={`inline-flex h-9 flex-none items-center gap-1.5 rounded-full border px-3.5 text-[0.8rem] font-semibold sm:h-10 sm:gap-2 sm:px-4 sm:text-[0.85rem] whitespace-nowrap transition-[background-color,border-color,color] duration-300 ease-current disabled:cursor-not-allowed disabled:opacity-35 ${
          active
            ? 'border-ember bg-ember/15 text-bone'
            : open
              ? 'border-bone/60 text-bone'
              : 'border-bone/20 text-bone/80 hover:border-bone/50 hover:text-bone'
        }`}
      >
        <span className={active ? 'text-bone/55' : 'text-bone/85 sm:text-bone/55'}>{label}</span>
        {active && <span className="max-w-[11rem] truncate">{selectedLabel}</span>}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-300 ease-current ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>

      {open &&
        createPortal(
          <>
            {/* Phone scrim behind the sheet */}
            <div
              aria-hidden="true"
              data-filter-scrim
              onClick={() => close(false)}
              className="fixed inset-0 z-[70] touch-none bg-abyss/60 sm:hidden"
            />
            <div
              ref={menu}
              id={menuId}
              role="menu"
              aria-label={`Filter by ${label.toLowerCase()}`}
              onKeyDown={onMenuKey}
              style={pos ? ({ '--menu-top': `${pos.top}px`, '--menu-left': `${pos.left}px` } as React.CSSProperties) : undefined}
              className="grain fixed inset-x-3 bottom-3 z-[71] max-h-[70svh] touch-pan-y overflow-y-auto overscroll-contain border border-bone/15 bg-abyss-2/95 p-2 text-bone shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:top-[var(--menu-top)] sm:left-[var(--menu-left)] sm:max-h-[min(60vh,28rem)] sm:w-72"
            >
              <p className="px-3 pt-2 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-shallows">
                {plural}
              </p>
              <MenuOption checked={!selected} onClick={() => choose(undefined)}>
                Any {label.toLowerCase()}
              </MenuOption>
              {options.map((o) => (
                <MenuOption key={o.slug} checked={o.slug === selected} count={o.count} onClick={() => choose(o.slug)}>
                  {o.label}
                </MenuOption>
              ))}
            </div>
          </>,
          document.body,
        )}
    </>
  )
}

function MenuOption({
  checked,
  count,
  onClick,
  children,
}: {
  checked: boolean
  count?: number
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      onClick={onClick}
      className={`flex min-h-12 w-full touch-manipulation items-center justify-between gap-4 px-3 py-2.5 text-left text-[0.95rem] outline-none [-webkit-tap-highlight-color:transparent] transition-colors duration-200 hover:bg-bone/[0.07] focus-visible:bg-bone/[0.1] ${
        checked ? 'text-ember' : 'text-bone/85'
      }`}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 flex-none rounded-full ${checked ? 'bg-ember' : 'bg-transparent'}`}
        />
        <span className="truncate">{children}</span>
      </span>
      {typeof count === 'number' && <span className="text-[0.8rem] tabular-nums text-bone/45">{count}</span>}
    </button>
  )
}
