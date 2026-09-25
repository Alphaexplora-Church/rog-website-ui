import { Button } from './Button'
import { WaveMark } from './River'

/**
 * Loading and error blocks for CMS-backed sections.
 *
 * Before 2026-09-23 every section rendered from bundled data, so neither
 * state existed. Now data arrives over the network, and both need a face:
 *
 *   loading → a quiet shimmer in the shape of the content (square poster
 *             frames + text bars), so the section doesn't collapse and then
 *             jump when the data lands
 *   error   → says the content couldn't be loaded and offers a retry.
 *             The technical reason (CMS not running, 403 permissions…) goes
 *             to the console, where the person who can fix it will look —
 *             a visitor gets a sentence, not a stack trace.
 *
 * `tone` matches the plate the block sits on (abyss/river vs the bone
 * plate). `label` names what's loading/failed — "Messages", "Events", etc —
 * defaulting to "Messages" (this block's first caller).
 *
 * REVAMP 2026-09-25 (ROG 11): token colours, square frames, shout headline,
 * wave mark, and the shared Button for retry. Props unchanged.
 */

type Tone = 'dark' | 'light'

export function LoadingBlock({
  tone = 'dark',
  rows = 3,
  label = 'Messages',
}: {
  tone?: Tone
  rows?: number
  label?: string
}) {
  const tile = tone === 'dark' ? 'bg-bone/[0.07]' : 'bg-abyss/[0.07]'
  return (
    <div role="status" aria-live="polite" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <span className="sr-only">Loading {label.toLowerCase()}…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="motion-safe:animate-pulse"
          style={{ animationDelay: `${i * 160}ms` }}
        >
          <div className={`aspect-video w-full ${tile}`} />
          <div className={`mt-5 h-3 w-1/3 rounded-full ${tile}`} />
          <div className={`mt-3 h-7 w-3/4 ${tile}`} />
        </div>
      ))}
    </div>
  )
}

export function ErrorBlock({
  tone = 'dark',
  error,
  onRetry,
  label = 'Messages',
}: {
  tone?: Tone
  error?: unknown
  onRetry?: () => void
  label?: string
}) {
  if (error) console.error('[CMS]', error instanceof Error ? error.message : error)

  const dark = tone === 'dark'
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center border border-dashed px-6 py-14 text-center sm:py-16 ${
        dark ? 'border-bone/20 text-bone' : 'border-abyss/25 text-abyss'
      }`}
    >
      <WaveMark className={`h-6 w-16 ${dark ? 'text-shallows' : 'text-abyss/40'}`} strokeWidth={6} />
      <p className="mt-6 max-w-[20ch] text-balance font-shout text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold uppercase leading-[0.92]">
        {label} couldn’t be loaded right now
      </p>
      <p className={`mt-3 max-w-[40ch] font-whisper text-lg italic ${dark ? 'text-bone/75' : 'text-abyss/70'}`}>
        Please try again in a moment.
      </p>
      {onRetry && (
        <div className="mt-8">
          <Button onClick={onRetry} variant="ember" size="sm">
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}
