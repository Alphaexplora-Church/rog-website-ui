import { RiverImage, WaveMark } from '../../../shared/components/ui/River'

export interface RosterPerson {
  name: string
  /** One or more role lines. Most rosters carry a single role; the
   * Apostolic Team's people hold several titles each (per riverofgod.ph),
   * so this is always an array — callers with one role just pass a
   * one-item array. */
  roles: string[]
}

/**
 * Portrait frame for the About page's people sections. REVAMP 2026-09-25.
 *
 * No real headshots exist yet. Jude's standing rule (2026-09-22) is a
 * plainly generic placeholder rather than stock photos — stock faces read
 * as real people who aren't these pastors. So the frame is a square-edged
 * poster (radius 0, grain, river light) carrying a faint silhouette and the
 * wave mark. Pass `photo` once headshots arrive and it becomes a
 * `RiverImage` with Colour Bloom (duotone at rest, colour on hover/centre)
 * — no layout change needed.
 */
export function Portrait({
  photo,
  alt = '',
  className = '',
}: {
  photo?: string
  alt?: string
  className?: string
}) {
  if (photo) return <RiverImage src={photo} alt={alt} bloom="hover" className={className} />
  return (
    <div
      aria-hidden="true"
      className={`grain relative overflow-hidden bg-deep ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_15%,color-mix(in_srgb,var(--color-river)_85%,transparent),transparent_70%)] transition-opacity duration-700 ease-current group-hover:opacity-60" />
      <svg
        viewBox="0 0 24 24"
        className="absolute bottom-0 left-1/2 h-[78%] w-auto -translate-x-1/2 translate-y-[6%] text-abyss/70 transition-transform duration-[1200ms] ease-current group-hover:scale-[1.04] motion-reduce:transition-none"
        fill="currentColor"
      >
        <circle cx="12" cy="8.5" r="4" />
        <path d="M4 22C4 16.8 7.6 13.5 12 13.5s8 3.3 8 8.5Z" />
      </svg>
      <WaveMark className="absolute top-4 left-4 h-3 w-8 text-shallows/50" strokeWidth={7} />
    </div>
  )
}
