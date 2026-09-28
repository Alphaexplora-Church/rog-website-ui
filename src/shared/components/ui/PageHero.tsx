import { useEffect, useState, type ReactNode } from 'react'
import { container, heroRevealBase, heroRevealDelay1, heroRevealDelay2, heroRevealHidden, heroRevealShown } from '../../styles/tokens'
import { Eyebrow, WaveMark } from './River'

/**
 * Inner-page hero — "the page is a poster" (ROG 11 §3). REVAMP 2026-09-25.
 *
 * One composition for every inner route so the site reads as one system,
 * with three levers so no two pages look stamped:
 *   - `image`   full-bleed photo, slow drift, River scrim + boiling grain.
 *               Omit it and the ground becomes abyss light-pooling with a
 *               giant wave mark instead.
 *   - `aside`   right-hand slot (facts, service times, a countdown…)
 *   - `align`   'bottom' (default, title sits low like a poster credit) or
 *               'center' for short utility pages (Give, Plan a Visit).
 *
 * The title lines rise out of a mask on mount (mount-triggered — it's the
 * first thing anyone sees, so it never waits on an IntersectionObserver).
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt = '',
  imagePosition,
  aside,
  actions,
  align = 'bottom',
  size = 'tall',
  id,
}: {
  eyebrow?: ReactNode
  /** Pass an array for explicit line breaks — each line gets its own mask. */
  title: string | string[]
  lead?: ReactNode
  image?: string
  imageAlt?: string
  imagePosition?: string
  aside?: ReactNode
  actions?: ReactNode
  align?: 'bottom' | 'center'
  size?: 'tall' | 'short'
  id?: string
}) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(t)
  }, [])
  const lines = Array.isArray(title) ? title : [title]
  const h = size === 'tall' ? 'min-h-[88svh]' : 'min-h-[64svh]'

  return (
    <section
      id={id}
      data-plate="dark"
      className={`relative isolate flex ${h} overflow-hidden bg-abyss text-bone ${align === 'center' ? 'items-center' : 'items-end'}`}
    >
      {/* Ground */}
      {image ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img
            src={image}
            alt={imageAlt}
            fetchPriority="high"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
            className="absolute inset-0 h-full w-full animate-drift object-cover motion-reduce:animate-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/70 to-abyss/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-abyss/85 via-abyss/30 to-transparent" />
          <div className="absolute inset-0 bg-river/30 mix-blend-color" />
        </div>
      ) : (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute -inset-[20%] blur-[70px] [background-image:radial-gradient(ellipse_40%_45%_at_20%_30%,color-mix(in_srgb,var(--color-river)_70%,transparent),transparent_70%),radial-gradient(ellipse_30%_30%_at_85%_80%,color-mix(in_srgb,var(--color-ember)_20%,transparent),transparent_70%)]" />
          <WaveMark className="absolute -right-[8%] top-[12%] h-auto w-[70vw] max-w-[1100px] text-bone/[0.04]" strokeWidth={3} />
        </div>
      )}
      {/* Boiling grain */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[10%] -z-10 animate-boil bg-[url('/assets/rog/grain.png')] bg-[length:180px] opacity-[0.16] mix-blend-overlay motion-reduce:animate-none" />

      <div className={`${container} relative pb-16 pt-36 sm:pb-24`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            {eyebrow && (
              <div className={`${heroRevealBase} ${on ? heroRevealShown : heroRevealHidden}`}>
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h1 className="mt-6 font-shout text-[clamp(3.5rem,11vw,10.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.01em]">
              {lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.04em]">
                  <span
                    className={`block transition-transform duration-[1200ms] ease-tide motion-reduce:transition-none ${on ? 'translate-y-0' : 'translate-y-[106%] motion-reduce:translate-y-0'}`}
                    style={{ transitionDelay: `${120 + i * 110}ms` }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            {lead && (
              <p
                className={`mt-8 max-w-[46ch] font-whisper text-[clamp(1.2rem,1.8vw,1.6rem)] italic leading-[1.4] text-bone/85 ${heroRevealBase} ${heroRevealDelay1} ${on ? heroRevealShown : heroRevealHidden}`}
              >
                {lead}
              </p>
            )}
            {actions && (
              <div className={`mt-10 flex flex-wrap items-center gap-4 ${heroRevealBase} ${heroRevealDelay2} ${on ? heroRevealShown : heroRevealHidden}`}>
                {actions}
              </div>
            )}
          </div>
          {aside && (
            <div className={`${heroRevealBase} ${heroRevealDelay2} ${on ? heroRevealShown : heroRevealHidden}`}>{aside}</div>
          )}
        </div>
      </div>
    </section>
  )
}
