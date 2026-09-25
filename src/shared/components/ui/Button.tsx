import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * Shared call-to-action. REVAMP 2026-09-25 (ROG 11).
 *
 * Variants:
 *  - `ember`   the ONE primary action per view (Plan a Visit, Watch Live,
 *              Give). Abyss label on ember = 6.6:1. Carries the only glow.
 *  - `solid`   bone fill — secondary action on dark grounds (abyss on light).
 *  - `outline` hairline pill — tertiary.
 *  - `ghost`   text link with the ember underline that flows in on hover.
 *
 * Every variant with `arrow` gets the ripple: the arrow slides and the pill
 * keeps its shape. No shadows (ROG 11 §4.5).
 */

type Variant = 'ember' | 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'
type Tone = 'dark' | 'light'

export interface ButtonProps {
  children: ReactNode
  to?: string
  href?: string
  download?: boolean
  onClick?: () => void
  variant?: Variant
  size?: Size
  tone?: Tone
  live?: boolean
  arrow?: boolean
  className?: string
  'aria-label'?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const base =
  'group/btn relative isolate inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold ' +
  'transition-[transform,background-color,color,border-color,opacity] duration-[400ms] ease-current ' +
  'active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40'

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-[0.8rem] tracking-[0.02em]',
  md: 'h-12 px-6 text-[0.9rem] tracking-[0.01em]',
  lg: 'h-14 px-8 text-base',
}

const variants: Record<Tone, Record<Variant, string>> = {
  dark: {
    ember: 'bg-ember text-abyss hover:bg-[#ff8a33]',
    solid: 'bg-bone text-abyss hover:bg-white',
    outline: 'border border-bone/35 text-bone hover:border-bone hover:bg-bone/5',
    ghost: 'h-auto px-0 text-bone',
  },
  light: {
    ember: 'bg-ember text-abyss hover:bg-[#ff8a33]',
    solid: 'bg-abyss text-bone hover:bg-deep',
    outline: 'border border-abyss/30 text-abyss hover:border-abyss hover:bg-abyss/5',
    ghost: 'h-auto px-0 text-abyss',
  },
}

export function Button({
  children,
  to,
  href,
  download = false,
  onClick,
  variant = 'solid',
  size = 'md',
  tone = 'dark',
  live = false,
  arrow = false,
  className = '',
  type = 'button',
  disabled,
  ...rest
}: ButtonProps) {
  const isGhost = variant === 'ghost'
  const cls = [base, isGhost ? '' : sizes[size], variants[tone][variant], className].join(' ')

  const inner = (
    <>
      {variant === 'ember' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-ember/35 opacity-70 blur-xl transition-opacity duration-500 group-hover/btn:opacity-100"
        />
      )}
      {live && (
        <span aria-hidden="true" className="relative flex h-2 w-2 flex-none">
          <span className="absolute inset-0 animate-live rounded-full bg-current" />
          <span className="relative h-2 w-2 rounded-full bg-current" />
        </span>
      )}
      <span className="relative">
        {children}
        {isGhost && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-[0.35] bg-ember transition-transform duration-[600ms] ease-current group-hover/btn:scale-x-100"
          />
        )}
      </span>
      {arrow && (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4 flex-none transition-transform duration-[400ms] ease-current group-hover/btn:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </>
  )

  if (href && download) {
    return (
      <a href={href} download className={cls} {...rest}>
        {inner}
      </a>
    )
  }
  if (href) {
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {inner}
      </a>
    )
  }
  if (to) {
    return (
      <Link to={to} viewTransition className={cls} {...rest}>
        {inner}
      </Link>
    )
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} {...rest}>
      {inner}
    </button>
  )
}
