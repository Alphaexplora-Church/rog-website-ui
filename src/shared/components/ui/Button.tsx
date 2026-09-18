import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * One button, four variants, no colour.
 *
 * In a true monochrome system a button cannot signal importance with hue, so
 * it signals with FILL: solid = primary, hairline ring = secondary, bare =
 * tertiary. All three read correctly on a black plate and on a white one.
 *
 * The hover is the authored bit. `solid` does not change colour on hover — it
 * grows a sheen that sweeps across once, which is the one moment of movement a
 * flat black pill can afford without looking like it broke.
 *
 * TONE PROP, added 2026-09-17 (tailwind-design-system migration). Every
 * variant used to be written once, in terms of `var(--color-accent)` /
 * `var(--color-ink)` etc. — CSS custom properties that `.plate-dark` /
 * `.plate-light` silently re-pointed, so this component never had to know
 * which plate it was rendered on. With index.css gone there is no more
 * re-pointing, so the caller now says so explicitly: `tone="dark"` on a
 * black section, `tone="light"` on a white one (Navbar passes its own
 * dynamic `tone` state through, since the bar itself flips per scroll
 * position — see Navbar.tsx). There is no default; every call site was
 * audited and updated rather than risk one silently rendering black-on-black.
 */

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md'
type Tone = 'dark' | 'light'

export interface ButtonProps {
  children: ReactNode
  /** Internal route. Renders a <Link>. */
  to?: string
  /** External URL. Renders an <a> with rel/target set. */
  href?: string
  onClick?: () => void
  variant?: Variant
  size?: Size
  /** Which plate this button sits on — picks the literal colour set. */
  tone: Tone
  /** Renders the pulsing live dot before the label. */
  live?: boolean
  className?: string
  'aria-label'?: string
}

const base =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full ' +
  'font-heading font-semibold whitespace-nowrap ' +
  'transition-[transform,background-color,color,box-shadow] duration-[400ms] ' +
  'ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] motion-reduce:transition-none ' +
  'motion-reduce:active:scale-100'

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.78rem] tracking-[0.06em] uppercase',
  md: 'h-12 px-6 text-sm tracking-[0.04em]',
}

/* Each variant is written out per tone rather than composed from a shared
   "accent" token at runtime — see tokens.ts's own warning: Tailwind's JIT
   scanner needs every class string to appear complete and literal in source,
   so `bg-${accent}` would silently generate nothing. */
const variants: Record<Tone, Record<Variant, string>> = {
  dark: {
    solid: 'bg-white text-black hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)]',
    outline:
      'bg-white/5 ring-1 ring-white/40 text-white hover:ring-white hover:bg-white/10',
    ghost: 'text-[#a6a6a6] hover:text-white hover:bg-white/10',
  },
  light: {
    solid: 'bg-black text-white hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)]',
    outline:
      'bg-black/5 ring-1 ring-black/40 text-black hover:ring-black hover:bg-black/10',
    ghost: 'text-[#5c5c5c] hover:text-black hover:bg-black/10',
  },
}

/* The one-time sweep on `solid`. Tint is whatever `solid`'s own text colour
   is (black on a dark-tone button's white fill, white on a light-tone
   button's black fill) — always contrasts against the fill it sweeps over. */
const sheen: Record<Tone, string> = {
  dark: '[background:linear-gradient(100deg,transparent_30%,rgb(0_0_0/0.26)_50%,transparent_70%)]',
  light: '[background:linear-gradient(100deg,transparent_30%,rgb(255_255_255/0.26)_50%,transparent_70%)]',
}

export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'solid',
  size = 'sm',
  tone,
  live = false,
  className = '',
  ...rest
}: ButtonProps) {
  const cls = [base, sizes[size], variants[tone][variant], className].join(' ')

  const inner = (
    <>
      {live && (
        <span aria-hidden="true" className="relative flex h-[7px] w-[7px] flex-none">
          <span className="absolute inset-0 animate-ping rounded-full bg-current motion-reduce:hidden" />
          <span className="relative h-[7px] w-[7px] rounded-full bg-current" />
        </span>
      )}
      <span className="relative z-10">{children}</span>
      {variant === 'solid' && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -translate-x-[120%] rounded-[inherit] transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[120%] ${sheen[tone]}`}
        />
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...rest}
      >
        {inner}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cls} {...rest}>
      {inner}
    </button>
  )
}
